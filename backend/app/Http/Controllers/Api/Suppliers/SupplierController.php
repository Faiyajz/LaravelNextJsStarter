<?php

namespace App\Http\Controllers\Api\Suppliers;

use App\Http\Controllers\Controller;
use App\Actions\Suppliers\CreateSupplier;
use App\Actions\Suppliers\UpdateSupplier;
use App\DTOs\Suppliers\SupplierFilterData;
use App\DTOs\Suppliers\SupplierData;
use App\DTOs\Shared\ListQueryData;
use App\Http\Requests\Suppliers\SupplierStoreRequest;
use App\Http\Requests\Suppliers\SupplierUpdateRequest;
use App\Models\Supplier;
use App\Services\Suppliers\SupplierService;
use App\Support\ApiResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SupplierController extends Controller
{
    public function __construct(
        private SupplierService $supplierService,
        private CreateSupplier $createSupplier,
        private UpdateSupplier $updateSupplier
    ) {}

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $this->authorize('viewAny', Supplier::class);
        return ApiResponse::paginated(
            $this->supplierService->paginate(
                SupplierFilterData::fromRequest($request)
            )
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(SupplierStoreRequest $request)
    {
        $this->authorize('create', Supplier::class);
        $supplier = ($this->createSupplier)(SupplierData::fromArray($request->validated()));
        return ApiResponse::data($supplier, 'Supplier created.', Response::HTTP_CREATED);
    }

    /**
     * Display the specified resource.
     */
    public function show(Supplier $supplier)
    {
        $this->authorize('view', $supplier);
        return ApiResponse::data(
            $supplier->load(['notes'])
        );
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(SupplierUpdateRequest $request, string $supplier)
    {
        $model = Supplier::query()->findOrFail($supplier);
        $this->authorize('update', $model);
        $updated = ($this->updateSupplier)(
            id: $supplier,
            data: SupplierData::fromArray($request->validated())
        );

        return ApiResponse::data($updated, 'Supplier updated.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Supplier $supplier)
    {
        $this->authorize('delete', $supplier);
        $supplier->delete();
        return ApiResponse::data(null, 'Supplier deleted.');
    }

    // Trash list
    public function trash(Request $request)
    {
        $this->authorize('viewTrash', Supplier::class);
        return ApiResponse::paginated(
            $this->supplierService->trash(ListQueryData::fromRequest($request))
        );
    }

    public function restore(string $supplier)
    {
        $this->authorize('restore', Supplier::class);
        $result = $this->supplierService->restore($supplier);

        return ApiResponse::data(
            data: $result['data'] ?? null,
            message: $result['message'],
            status: $result['status']
        );
    }
}
