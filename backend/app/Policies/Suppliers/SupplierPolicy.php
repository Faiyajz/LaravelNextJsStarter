<?php

namespace App\Policies\Suppliers;

use App\Models\Supplier;
use App\Models\User;

class SupplierPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('suppliers.view');
    }

    public function view(User $user, Supplier $supplier): bool
    {
        return $user->can('suppliers.view');
    }

    public function create(User $user): bool
    {
        return $user->can('suppliers.create');
    }

    public function update(User $user, Supplier $supplier): bool
    {
        return $user->can('suppliers.update');
    }

    public function delete(User $user, Supplier $supplier): bool
    {
        return $user->can('suppliers.delete');
    }

    public function viewTrash(User $user): bool
    {
        return $user->can('suppliers.trash.view');
    }

    public function restore(User $user): bool
    {
        return $user->can('suppliers.restore');
    }

    public function createNote(User $user, Supplier $supplier): bool
    {
        return $user->can('suppliers.notes.create');
    }
}
