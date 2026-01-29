<?php

namespace Tests\Unit\Policies;

use App\Models\Fabric;
use App\Models\User;
use App\Policies\Fabrics\FabricPolicy;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Permission;
use Tests\TestCase;

class FabricPolicyTest extends TestCase
{
    use RefreshDatabase;

    public function test_fabric_permissions_map(): void
    {
        $this->seedPermissions();

        $policy = new FabricPolicy();
        $user = User::factory()->create();
        $fabric = Fabric::factory()->create();

        $this->assertFalse($policy->viewAny($user));
        $user->givePermissionTo(Permission::findByName('fabrics.view'));
        $this->assertTrue($policy->viewAny($user));
        $this->assertTrue($policy->view($user, $fabric));

        $this->assertFalse($policy->create($user));
        $user->givePermissionTo(Permission::findByName('fabrics.create'));
        $this->assertTrue($policy->create($user));

        $this->assertFalse($policy->update($user, $fabric));
        $user->givePermissionTo(Permission::findByName('fabrics.update'));
        $this->assertTrue($policy->update($user, $fabric));

        $this->assertFalse($policy->delete($user, $fabric));
        $user->givePermissionTo(Permission::findByName('fabrics.delete'));
        $this->assertTrue($policy->delete($user, $fabric));

        $this->assertFalse($policy->viewTrash($user));
        $user->givePermissionTo(Permission::findByName('fabrics.trash.view'));
        $this->assertTrue($policy->viewTrash($user));

        $this->assertFalse($policy->restore($user));
        $user->givePermissionTo(Permission::findByName('fabrics.restore'));
        $this->assertTrue($policy->restore($user));

        $this->assertFalse($policy->createStock($user, $fabric));
        $user->givePermissionTo(Permission::findByName('fabrics.stocks.create'));
        $this->assertTrue($policy->createStock($user, $fabric));

        $this->assertFalse($policy->createNote($user, $fabric));
        $user->givePermissionTo(Permission::findByName('fabrics.notes.create'));
        $this->assertTrue($policy->createNote($user, $fabric));
    }
}
