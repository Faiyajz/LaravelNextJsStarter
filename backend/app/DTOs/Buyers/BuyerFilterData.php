<?php

namespace App\DTOs\Buyers;

use Illuminate\Http\Request;

class BuyerFilterData
{
    public function __construct(
        public ?string $search,
        public ?string $country,
        public ?string $companyName,
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
            country: $request->filled('country') ? (string) $request->input('country') : null,
            companyName: $request->filled('company_name') ? (string) $request->input('company_name') : null,
            perPage: $perPage,
            orderBy: (string) $request->input('order_by', 'created_at'),
            orderDir: strtolower((string) $request->input('order_dir', 'desc')) === 'asc' ? 'asc' : 'desc'
        );
    }
}
