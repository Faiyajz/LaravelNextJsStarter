<?php

namespace App\Services\Fabrics;

use App\DTOs\Fabrics\FabricFilterData;
use App\Enums\StockType;
use App\DTOs\Shared\ListQueryData;
use App\Models\Fabric;
use App\Models\FabricBarcode;
use App\Services\Shared\ListQueryService;
use Illuminate\Database\QueryException;
use Illuminate\Http\UploadedFile;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\Response;

class FabricService
{

    public function __construct(
        private readonly ListQueryService $listQuery
    ) {}

    public function paginate(FabricFilterData $filters): LengthAwarePaginator
    {
        $baseQuery = Fabric::query()
            ->with('supplier:id,company_name')
            ->when($filters->search, function ($query, string $value) {
                $query->where(function ($q) use ($value) {
                    $q->where('fabric_no', 'like', "%{$value}%")
                        ->orWhere('composition', 'like', "%{$value}%")
                        ->orWhere('production_type', 'like', "%{$value}%")
                        ->orWhereHas('supplier', fn($sq) => $sq->where('company_name', 'like', "%{$value}%"));
                });
            })
            ->when($filters->supplier, function ($query, string $value) {
                $query->whereHas('supplier', fn($sq) => $sq->where('company_name', 'like', "%{$value}%"));
            })
            ->when($filters->fabricNo, fn($query, string $value) => $query->where('fabric_no', 'like', "%{$value}%"))
            ->when($filters->composition, fn($query, string $value) => $query->where('composition', 'like', "%{$value}%"))
            ->when($filters->productionType, fn($query, string $value) => $query->where('production_type', $value));

        [$query, $perPage] = $this->listQuery->apply(
            query: $baseQuery,
            perPage: $filters->perPage,
            orderBy: $filters->orderBy,
            orderDir: $filters->orderDir,
            allowedOrderColumns: ['created_at', 'fabric_no', 'composition', 'production_type'],
        );

        $paginated = $query
            ->paginate($perPage)
            ->withQueryString();

        $fabricIds = $paginated->getCollection()
            ->map(fn($f) => (string) $f->getKey())
            ->values()
            ->all();

        $balances = calculateFabricBalances($fabricIds);

        $paginated->getCollection()->transform(function ($fabric) use ($balances) {
            $id = (string) $fabric->getKey();
            $fabric->available_balance = (float) ($balances[$id] ?? 0);
            return $fabric;
        });

        return $paginated;
    }

    public function createWithDefaultBarcode(array $data, ?UploadedFile $image = null): Fabric
    {
        return DB::transaction(function () use ($data, $image) {
            if ($image) {
                $data['image_path'] = $this->storeImage($image);
            }

            $fabric = Fabric::query()->create($data);
            $this->createBarcodeForFabric($fabric);

            // Create initial stock entry if qty provided
            if (isset($data['qty']) && $data['qty'] > 0) {
                $fabric->stocks()->create([
                    'type' => StockType::IN->value,
                    'quantity' => $data['qty'],
                    'reference' => 'Initial stock entry',
                ]);
            }

            return $fabric->load(['supplier:id,company_name', 'barcodes']);
        });
    }

    public function storeImage(?UploadedFile $file): ?string
    {
        if (!$file) {
            return null;
        }

        return $file->store('fabrics', 'public');
    }

    /**
     * Transaction-safe barcode creation (UUID-safe + collision safe).
     */
    public function createBarcodeForFabric(Fabric $fabric): FabricBarcode
    {
        /** @var Fabric $lockedFabric */
        $lockedFabric = Fabric::query()
            ->whereKey($fabric->getKey())
            ->lockForUpdate()
            ->firstOrFail();

        $attempts = 0;
        $maxAttempts = 5;

        while (true) {
            try {
                /** @var FabricBarcode $barcode */
                $barcode = $lockedFabric->barcodes()->create([
                    'barcode_value' => $this->generateBarcodeValue($lockedFabric),
                ]);
                return $barcode;
            } catch (QueryException $e) {
                if ($this->isUniqueConstraintViolation($e) && $attempts < $maxAttempts) {
                    $attempts++;
                    continue;
                }
                throw $e;
            }
        }
    }

    /**
     * UUID-safe barcode value.
     * Uniqueness should be enforced by a DB unique index on `barcode_value`.
     */
    private function generateBarcodeValue(Fabric $fabric): string
    {
        $fabricId = (string) $fabric->getKey();

        return \sprintf(
            'FAB-%s-%s',
            $fabricId,
            Str::upper(Str::random(10))
        );
    }

    private function isUniqueConstraintViolation(QueryException $e): bool
    {
        $errorInfo = $e->errorInfo;

        if (!isset($errorInfo[0])) {
            return false;
        }

        $sqlState = $errorInfo[0];
        $driverCode = isset($errorInfo[1]) ? (int) $errorInfo[1] : null;

        // MySQL: SQLSTATE 23000 + error code 1062
        // SQLite: SQLSTATE 23000 + error code 19
        if ($sqlState === '23000' && \in_array($driverCode, [1062, 19], true)) {
            return true;
        }

        // Postgres: SQLSTATE 23505
        return $sqlState === '23505';
    }

    public function availableBalance(Fabric $fabric): float
    {
        $id = (string) $fabric->getKey();
        return calculateFabricBalance($id);
    }

    public function updateFabric(Fabric $fabric, array $data, ?UploadedFile $image = null): Fabric
    {
        return DB::transaction(function () use ($fabric, $data, $image) {
            /** @var Fabric $lockedFabric */
            $lockedFabric = Fabric::query()
                ->whereKey($fabric->getKey())
                ->lockForUpdate()
                ->firstOrFail();

            $qtyDelta = null;
            if (\array_key_exists('qty', $data)) {
                $newQty = (float) $data['qty'];
                $oldQty = (float) $lockedFabric->qty;
                $qtyDelta = $newQty - $oldQty;

                if ($qtyDelta < 0) {
                    $available = calculateFabricBalance((string) $lockedFabric->getKey());
                    if (\abs($qtyDelta) > $available) {
                        throw ValidationException::withMessages([
                            'qty' => ['Quantity adjustment would make balance negative.'],
                        ]);
                    }
                }
            }

            $oldPath = null;
            if ($image) {
                $oldPath = $lockedFabric->image_path;

                $data['image_path'] = $this->storeImage($image);
            }

            $lockedFabric->update($data);

            if ($qtyDelta !== null && $qtyDelta != 0.0) {
                $lockedFabric->stocks()->create([
                    'type' => $qtyDelta > 0 ? StockType::IN->value : StockType::OUT->value,
                    'quantity' => \abs($qtyDelta),
                    'reference' => 'Qty adjustment',
                ]);
            }

            if ($oldPath) {
                Storage::disk('public')->delete($oldPath);
            }

            return $lockedFabric->refresh();
        });
    }

    public function softDelete(Fabric $fabric): void
    {
        $fabric->delete();
    }

    public function trash(ListQueryData $queryData): LengthAwarePaginator
    {
        $baseQuery = Fabric::onlyTrashed()
            ->with('supplier:id,company_name');

        [$query, $perPage] = $this->listQuery->apply(
            query: $baseQuery,
            perPage: $queryData->perPage,
            orderBy: $queryData->orderBy,
            orderDir: $queryData->orderDir,
            allowedOrderColumns: ['deleted_at'],
            defaultOrderBy: 'deleted_at',
            defaultOrderDir: 'desc'
        );

        return $query
            ->paginate($perPage)
            ->withQueryString();
    }

    public function restore(string $id): array
    {
        $trashed = Fabric::onlyTrashed()->find($id);

        if ($trashed) {
            $trashed->restore();

            return [
                'status' => Response::HTTP_OK,
                'message' => 'Fabric restored.',
                'data' => $trashed,
            ];
        }

        $active = Fabric::query()->find($id);

        if ($active) {
            return [
                'status' => Response::HTTP_CONFLICT,
                'message' => 'Fabric is not deleted.',
            ];
        }

        return [
            'status' => Response::HTTP_NOT_FOUND,
            'message' => 'Fabric not found.',
        ];
    }
}
