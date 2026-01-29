<?php

namespace App\Services\Shared;

use Illuminate\Database\Eloquent\Builder;

class ListQueryService
{
    public function apply(
        Builder $query,
        int $perPage,
        string $orderBy,
        string $orderDir,
        array $allowedOrderColumns,
        int $defaultPerPage = 10,
        int $maxPerPage = 100,
        string $defaultOrderBy = 'created_at',
        string $defaultOrderDir = 'desc'
    ): array {
        $perPage = $perPage > 0 ? $perPage : $defaultPerPage;
        $perPage = max(1, min($perPage, $maxPerPage));

        $orderBy = $orderBy ?: $defaultOrderBy;
        if (!\in_array($orderBy, $allowedOrderColumns, true)) {
            $orderBy = $defaultOrderBy;
        }

        $dir = \strtolower($orderDir ?: $defaultOrderDir);
        $orderDir = $dir === 'asc' ? 'asc' : 'desc';

        return [$query->orderBy($orderBy, $orderDir), $perPage];
    }
}
