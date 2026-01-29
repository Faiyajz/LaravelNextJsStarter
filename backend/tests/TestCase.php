<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Database\Seeders\PermissionSeeder;
use Spatie\Permission\Models\Permission;
use App\Models\User;

abstract class TestCase extends BaseTestCase
{
    protected function seedPermissions(): void
    {
        $this->seed(PermissionSeeder::class);
    }

    protected function grantAllPermissions(User $user): void
    {
        $this->seedPermissions();
        $user->syncPermissions(Permission::all());
    }
}
