<?php

namespace App\DTOs\Fabrics;

use Illuminate\Http\Request;

class FabricFilterData
{
    public function __construct(
        public ?string $search,
        public ?string $supplier,
        public ?string $fabricNo,
        public ?string $composition,
        public ?string $productionType,
        public int $perPage,
        public string $orderBy,
        public string $orderDir
    ) {}

    public static function fromRequest(Request $request): self
    {
        $perPage = (int) $request->input('per_page', 10);
        $perPage = max(1, min($perPage, 100));

        return new self(
            search: $request->filled('search') ? (string) $request->input('search') : null,
            supplier: $request->filled('supplier') ? (string) $request->input('supplier') : null,
            fabricNo: $request->filled('fabric_no') ? (string) $request->input('fabric_no') : null,
            composition: $request->filled('composition') ? (string) $request->input('composition') : null,
            productionType: $request->filled('production_type') ? (string) $request->input('production_type') : null,
            perPage: $perPage,
            orderBy: (string) $request->input('order_by', 'created_at'),
            orderDir: strtolower((string) $request->input('order_dir', 'desc')) === 'asc' ? 'asc' : 'desc'
        );
    }
}
