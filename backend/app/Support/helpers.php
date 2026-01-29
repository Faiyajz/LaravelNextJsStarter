<?php

use App\Models\FabricStock;
use Illuminate\Support\Collection;

if (!function_exists('calculateFabricBalances')) {
    /**
     * Batch balances in ONE query (recommended for lists).
     *
     * @param array<int, string> $fabricIds
     * @return array<string, float> [fabric_id => balance]
     */
    function calculateFabricBalances(array $fabricIds): array
    {
        $fabricIds = array_values(array_filter(array_unique($fabricIds)));

        if (empty($fabricIds)) {
            return [];
        }

        /** @var Collection<string, mixed> $balances */
        $balances = FabricStock::query()
            ->selectRaw("
                fabric_id,
                (SUM(CASE WHEN type='IN' THEN quantity ELSE 0 END) -
                 SUM(CASE WHEN type='OUT' THEN quantity ELSE 0 END)) AS balance
            ")
            ->whereIn('fabric_id', $fabricIds)
            ->groupBy('fabric_id')
            ->pluck('balance', 'fabric_id');

        $result = [];
        foreach ($fabricIds as $id) {
            $result[$id] = (float) ($balances[$id] ?? 0);
        }

        return $result;
    }
}

if (!function_exists('calculateFabricBalance')) {
    /**
     * Single balance.
     */
    function calculateFabricBalance(string $fabricId): float
    {
        $map = calculateFabricBalances([$fabricId]);
        return (float) ($map[$fabricId] ?? 0);
    }
}
