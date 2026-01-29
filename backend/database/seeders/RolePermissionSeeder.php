<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        $guard = config('auth.defaults.guard', 'web');

        $admin = Role::findOrCreate('admin', $guard);
        $buyer = Role::findOrCreate('buyer', $guard);

        $permissions = Permission::query()->where('guard_name', $guard)->get();

        $adminPermissions = $permissions->pluck('name')->toArray();

        $buyerPermissions = [
            'suppliers.view',
            'fabrics.view',
            'fabrics.notes.create',
            'suppliers.notes.create',
        ];

        $admin->syncPermissions($adminPermissions);
        $buyer->syncPermissions($buyerPermissions);
    }
}
