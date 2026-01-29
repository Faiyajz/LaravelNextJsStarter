<?php

namespace App\Services\Suppliers;

use App\DTOs\Suppliers\SupplierFilterData;
use App\Models\Supplier;
use App\DTOs\Shared\ListQueryData;
use App\Services\Shared\ListQueryService;
use Illuminate\Pagination\LengthAwarePaginator;
use Symfony\Component\HttpFoundation\Response;

class SupplierService
{
    public function __construct(
        private readonly ListQueryService $listQuery
    ) {}

    public function paginate(SupplierFilterData $filters): LengthAwarePaginator
    {
        $baseQuery = Supplier::query()
            ->when($filters->search, function ($query, string $value) {
                $query->where(function ($q) use ($value) {
                    $q->where('company_name', 'like', "%{$value}%")
                        ->orWhere('code', 'like', "%{$value}%")
                        ->orWhere('country', 'like', "%{$value}%")
                        ->orWhere('representative_name', 'like', "%{$value}%")
                        ->orWhere('representative_email', 'like', "%{$value}%")
                        ->orWhere('phone', 'like', "%{$value}%");
                });
            })
            ->when($filters->country, fn($query, string $value) => $query->where('country', $value))
            ->when($filters->companyName, fn($query, string $value) => $query->where('company_name', 'like', "%{$value}%"))
            ->when($filters->representativeName, fn($query, string $value) => $query->where('representative_name', 'like', "%{$value}%"))
            ->when($filters->dateFrom, fn($query, string $value) => $query->whereDate('created_at', '>=', $value))
            ->when($filters->dateTo, fn($query, string $value) => $query->whereDate('created_at', '<=', $value));

        [$query, $perPage] = $this->listQuery->apply(
            query: $baseQuery,
            perPage: $filters->perPage,
            orderBy: $filters->orderBy,
            orderDir: $filters->orderDir,
            allowedOrderColumns: ['created_at', 'company_name', 'country', 'code'],
        );

        return $query
            ->paginate($perPage)
            ->withQueryString();
    }

    public function updateSupplier(string $id, array $data): Supplier
    {
        $supplier = Supplier::query()->findOrFail($id);
        $supplier->update($data);

        return $supplier->refresh();
    }

    public function trash(ListQueryData $queryData): LengthAwarePaginator
    {
        $baseQuery = Supplier::onlyTrashed();

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
        $trashed = Supplier::onlyTrashed()->find($id);

        if ($trashed) {
            $trashed->restore();

            return [
                'status' => Response::HTTP_OK,
                'message' => 'Supplier restored.',
                'data' => $trashed,
            ];
        }

        $active = Supplier::query()->find($id);

        if ($active) {
            return [
                'status' => Response::HTTP_CONFLICT,
                'message' => 'Supplier is not deleted.',
            ];
        }

        return [
            'status' => Response::HTTP_NOT_FOUND,
            'message' => 'Supplier not found.',
        ];
    }
}
