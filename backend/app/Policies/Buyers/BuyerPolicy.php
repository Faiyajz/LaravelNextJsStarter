<?php

namespace App\Policies\Buyers;

use App\Models\BuyerProfile;
use App\Models\User;

class BuyerPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('buyers.view');
    }

    public function view(User $user, BuyerProfile $buyer): bool
    {
        return $user->can('buyers.view');
    }

    public function update(User $user, BuyerProfile $buyer): bool
    {
        return $user->can('buyers.update');
    }

    public function delete(User $user, BuyerProfile $buyer): bool
    {
        return $user->can('buyers.delete');
    }
}
