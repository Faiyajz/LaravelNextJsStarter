<?php

namespace App\Http\Controllers\Api\Fabrics;

use App\Http\Controllers\Controller;
use App\Actions\Fabrics\CreateFabric;
use App\Actions\Fabrics\UpdateFabric;
use App\DTOs\Fabrics\FabricFilterData;
use App\DTOs\Fabrics\FabricData;
use App\DTOs\Shared\ListQueryData;
use App\Http\Requests\Fabrics\FabricStoreRequest;
use App\Http\Requests\Fabrics\FabricUpdateRequest;
use App\Models\Fabric;
use App\Services\Fabrics\FabricService;
use App\Support\ApiResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class FabricController extends Controller
{
    public function __construct(
        private FabricService $fabricService,
        private CreateFabric $createFabric,
        private UpdateFabric $updateFabric
    ) {}

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $this->authorize('viewAny', Fabric::class);
        return ApiResponse::paginated(
            $this->fabricService->paginate(
                FabricFilterData::fromRequest($request)
            )
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(FabricStoreRequest $request)
    {
        $this->authorize('create', Fabric::class);
        $fabric = ($this->createFabric)(
            data: FabricData::fromArray($request->validated()),
            image: $request->file('image')
        );

        return ApiResponse::data($fabric, 'Fabric created.', Response::HTTP_CREATED);
    }

    /**
     * Display the specified resource.
     */
    public function show(Fabric $fabric)
    {
        $this->authorize('view', $fabric);
        $fabric->load(['supplier', 'notes', 'barcodes', 'stocks']);
        $fabric->available_balance = $this->fabricService->availableBalance($fabric);

        return ApiResponse::data($fabric);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(FabricUpdateRequest $request, Fabric $fabric)
    {
        $this->authorize('update', $fabric);
        $updated = ($this->updateFabric)(
            fabric: $fabric,
            data: FabricData::fromArray($request->validated()),
            image: $request->file('image')
        );

        return ApiResponse::data($updated, 'Fabric updated.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Fabric $fabric)
    {
        $this->authorize('delete', $fabric);
        $this->fabricService->softDelete($fabric);

        return ApiResponse::data(null, 'Fabric deleted.');
    }


    public function trash(Request $request)
    {
        $this->authorize('viewTrash', Fabric::class);
        return ApiResponse::paginated(
            $this->fabricService->trash(ListQueryData::fromRequest($request))
        );
    }

    public function restore(string $fabric)
    {
        $this->authorize('restore', Fabric::class);
        $result = $this->fabricService->restore($fabric);

        return ApiResponse::data(
            data: $result['data'] ?? null,
            message: $result['message'],
            status: $result['status']
        );
    }

    // Print barcode page for a specific barcode
    public function printBarcode(Fabric $fabric, string $barcodeId)
    {
        $this->authorize('view', $fabric);
        $fabric->load('supplier');
        $barcode = $fabric->barcodes()->findOrFail($barcodeId);

        return view('barcodes.fabric-roll', compact('fabric', 'barcode'));
    }
}
