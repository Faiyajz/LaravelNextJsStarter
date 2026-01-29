<?php

namespace Tests\Unit\Policies;

use App\Models\Supplier;
use App\Models\User;
use App\Policies\Suppliers\SupplierPolicy;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Permission;
use Tests\TestCase;

class SupplierPolicyTest extends TestCase
{
    use RefreshDatabase;

    public function test_supplier_permissions_map(): void
    {
        $this->seedPermissions();

        $policy = new SupplierPolicy();
        $user = User::factory()->create();
        $supplier = Supplier::factory()->create();

        $this->assertFalse($policy->viewAny($user));
        $user->givePermissionTo(Permission::findByName('suppliers.view'));
        $this->assertTrue($policy->viewAny($user));
        $this->assertTrue($policy->view($user, $supplier));

        $this->assertFalse($policy->create($user));
        $user->givePermissionTo(Permission::findByName('suppliers.create'));
        $this->assertTrue($policy->create($user));

        $this->assertFalse($policy->update($user, $supplier));
        $user->givePermissionTo(Permission::findByName('suppliers.update'));
        $this->assertTrue($policy->update($user, $supplier));

        $this->assertFalse($policy->delete($user, $supplier));
        $user->givePermissionTo(Permission::findByName('suppliers.delete'));
        $this->assertTrue($policy->delete($user, $supplier));

        $this->assertFalse($policy->viewTrash($user));
        $user->givePermissionTo(Permission::findByName('suppliers.trash.view'));
        $this->assertTrue($policy->viewTrash($user));

        $this->assertFalse($policy->restore($user));
        $user->givePermissionTo(Permission::findByName('suppliers.restore'));
        $this->assertTrue($policy->restore($user));

        $this->assertFalse($policy->createNote($user, $supplier));
        $user->givePermissionTo(Permission::findByName('suppliers.notes.create'));
        $this->assertTrue($policy->createNote($user, $supplier));
    }
}
