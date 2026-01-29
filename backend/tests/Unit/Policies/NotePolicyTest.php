<?php

namespace Tests\Unit\Policies;

use App\Models\User;
use App\Policies\Notes\NotePolicy;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Permission;
use Tests\TestCase;

class NotePolicyTest extends TestCase
{
    use RefreshDatabase;

    public function test_note_permissions_map(): void
    {
        $this->seedPermissions();

        $policy = new NotePolicy();
        $user = User::factory()->create();

        $this->assertFalse($policy->createForSupplier($user));
        $user->givePermissionTo(Permission::findByName('suppliers.notes.create'));
        $this->assertTrue($policy->createForSupplier($user));

        $this->assertFalse($policy->createForFabric($user));
        $user->givePermissionTo(Permission::findByName('fabrics.notes.create'));
        $this->assertTrue($policy->createForFabric($user));
    }
}
