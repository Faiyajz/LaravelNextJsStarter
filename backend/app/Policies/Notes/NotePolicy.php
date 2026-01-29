<?php

namespace App\Policies\Notes;

use App\Models\User;

class NotePolicy
{
    public function createForSupplier(User $user): bool
    {
        return $user->can('suppliers.notes.create');
    }

    public function createForFabric(User $user): bool
    {
        return $user->can('fabrics.notes.create');
    }
}
