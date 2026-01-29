<?php

namespace App\Http\Controllers\Api\Fabrics;

use App\Http\Controllers\Controller;
use App\Actions\Fabrics\CreateFabricStock;
use App\DTOs\Fabrics\FabricStockData;
use App\Http\Requests\Fabrics\FabricStockStoreRequest;
use App\Models\Fabric;
use App\Support\ApiResponse;
use Symfony\Component\HttpFoundation\Response;

class FabricStockController extends Controller
{

    /**
     * Store a newly created resource in storage.
     */
    public function store(FabricStockStoreRequest $request)
    {
        $data = $request->validated();
        $fabric = Fabric::query()->findOrFail($data['fabric_id']);
        $this->authorize('createStock', $fabric);

        $result = app(CreateFabricStock::class)(FabricStockData::fromArray($data));

        if (isset($result['error'])) {
            return ApiResponse::error($result['error'], $result['status']);
        }

        return ApiResponse::data(
            data: [
                'stock' => $result['stock'],
                'available_balance' => $result['available_balance'],
            ],
            message: 'Stock transaction created.',
            status: Response::HTTP_CREATED
        );
    }
}
