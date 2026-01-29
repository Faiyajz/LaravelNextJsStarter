<?php

namespace App\Actions\Fabrics;

use App\DTOs\Fabrics\FabricStockData;
use App\Enums\StockType;
use App\Models\Fabric;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

class CreateFabricStock
{
    /**
     * @return array{stock:mixed,available_balance:float}|array{error:string,status:int}
     */
    public function __invoke(FabricStockData $data): array
    {
        return DB::transaction(function () use ($data) {
            /** @var Fabric $fabric */
            $fabric = Fabric::query()
                ->whereKey($data->fabricId)
                ->lockForUpdate()
                ->firstOrFail();

            if ($data->type === StockType::OUT->value) {
                $available = calculateFabricBalance($data->fabricId);
                if ($data->quantity > $available) {
                    return [
                        'error' => 'Insufficient balance.',
                        'status' => Response::HTTP_UNPROCESSABLE_ENTITY,
                    ];
                }
            }

            $stock = $fabric->stocks()->create([
                'type' => $data->type,
                'quantity' => $data->quantity,
                'reference' => $data->reference,
            ]);

            return [
                'stock' => $stock,
                'available_balance' => calculateFabricBalance($data->fabricId),
            ];
        });
    }
}
