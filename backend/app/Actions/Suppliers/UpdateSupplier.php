<?php

namespace App\Actions\Suppliers;

use App\DTOs\Suppliers\SupplierData;
use App\Models\Supplier;
use App\Services\Suppliers\SupplierService;

class UpdateSupplier
{
    public function __construct(private SupplierService $supplierService) {}

    public function __invoke(string $id, SupplierData $data): Supplier
    {
        return $this->supplierService->updateSupplier($id, $data->toArray());
    }
}
