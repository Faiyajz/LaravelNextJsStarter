<?php

namespace App\Policies\Fabrics;

use App\Models\Fabric;
use App\Models\User;

class FabricPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('fabrics.view');
    }

    public function view(User $user, Fabric $fabric): bool
    {
        return $user->can('fabrics.view');
    }

    public function create(User $user): bool
    {
        return $user->can('fabrics.create');
    }

    public function update(User $user, Fabric $fabric): bool
    {
        return $user->can('fabrics.update');
    }

    public function delete(User $user, Fabric $fabric): bool
    {
        return $user->can('fabrics.delete');
    }

    public function viewTrash(User $user): bool
    {
        return $user->can('fabrics.trash.view');
    }

    public function restore(User $user): bool
    {
        return $user->can('fabrics.restore');
    }

    public function createStock(User $user, Fabric $fabric): bool
    {
        return $user->can('fabrics.stocks.create');
    }

    public function createNote(User $user, Fabric $fabric): bool
    {
        return $user->can('fabrics.notes.create');
    }
}
