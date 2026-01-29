<?php

namespace App\Actions\Suppliers;

use App\DTOs\Suppliers\SupplierData;
use App\Models\Supplier;

class CreateSupplier
{
    public function __invoke(SupplierData $data): Supplier
    {
        return Supplier::query()->create($data->toArray());
    }
}
