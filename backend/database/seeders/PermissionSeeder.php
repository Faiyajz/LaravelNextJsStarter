<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class PermissionSeeder extends Seeder
{
    /**
     * @var list<string>
     */
    private array $permissions = [
        'suppliers.view',
        'suppliers.create',
        'suppliers.update',
        'suppliers.delete',
        'suppliers.trash.view',
        'suppliers.restore',
        'suppliers.notes.create',
        'fabrics.view',
        'fabrics.create',
        'fabrics.update',
        'fabrics.delete',
        'fabrics.trash.view',
        'fabrics.restore',
        'fabrics.stocks.create',
        'fabrics.notes.create',
        'buyers.view',
        'buyers.update',
        'buyers.delete',
    ];

    public function run(): void
    {
        $guard = config('auth.defaults.guard', 'web');

        foreach ($this->permissions as $permission) {
            Permission::findOrCreate($permission, $guard);
        }
    }
}
