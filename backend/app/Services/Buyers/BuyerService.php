<?php

namespace App\Services\Buyers;

use App\DTOs\Buyers\BuyerData;
use App\DTOs\Buyers\BuyerFilterData;
use App\Models\BuyerProfile;
use App\Services\Shared\ListQueryService;
use Illuminate\Pagination\LengthAwarePaginator;

class BuyerService
{
    public function __construct(
        private readonly ListQueryService $listQuery
    ) {}

    public function paginate(BuyerFilterData $filters): LengthAwarePaginator
    {
        $baseQuery = BuyerProfile::query()
            ->with('user')
            ->whereHas('user.roles', fn($q) => $q->where('name', 'buyer'))
            ->when($filters->search, function ($query, string $value) {
                $query->where(function ($q) use ($value) {
                    $q->where('company_name', 'like', "%{$value}%")
                        ->orWhere('country', 'like', "%{$value}%")
                        ->orWhere('phone', 'like', "%{$value}%")
                        ->orWhereHas('user', function ($u) use ($value) {
                            $u->where('name', 'like', "%{$value}%")
                                ->orWhere('email', 'like', "%{$value}%");
                        });
                });
            })
            ->when($filters->country, fn($query, string $value) => $query->where('country', $value))
            ->when($filters->companyName, fn($query, string $value) => $query->where('company_name', 'like', "%{$value}%"));

        [$query, $perPage] = $this->listQuery->apply(
            query: $baseQuery,
            perPage: $filters->perPage,
            orderBy: $filters->orderBy,
            orderDir: $filters->orderDir,
            allowedOrderColumns: ['created_at', 'company_name', 'country']
        );

        return $query
            ->paginate($perPage)
            ->withQueryString();
    }

    public function update(BuyerProfile $buyer, BuyerData $data): BuyerProfile
    {
        $buyer->user->update([
            'name' => $data->name,
            'email' => $data->email,
        ]);

        $buyer->update([
            'company_name' => $data->companyName,
            'country' => $data->country,
            'phone' => $data->phone,
        ]);

        return $buyer->refresh()->load('user');
    }

    public function delete(BuyerProfile $buyer): void
    {
        $buyer->user()->delete();
    }
}
