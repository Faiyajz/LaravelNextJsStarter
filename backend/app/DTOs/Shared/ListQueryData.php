<?php

namespace App\DTOs\Shared;

use Illuminate\Http\Request;

class ListQueryData
{
    public function __construct(
        public int $perPage = 10,
        public string $orderBy = 'created_at',
        public string $orderDir = 'desc'
    ) {}

    public static function fromRequest(Request $request): self
    {
        return new self(
            perPage: (int) $request->input('per_page', 10),
            orderBy: (string) $request->input('order_by', 'created_at'),
            orderDir: (string) $request->input('order_dir', 'desc')
        );
    }
}
