<?php

namespace Tests\Feature;

use App\Models\Fabric;
use App\Models\Supplier;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class PermissionDeniedTest extends TestCase
{
    use RefreshDatabase;

    public function test_permissions_denied_when_missing(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $supplier = Supplier::factory()->create(['added_by' => $user->id]);
        $fabric = Fabric::factory()->create([
            'supplier_id' => $supplier->id,
            'added_by' => $user->id,
        ]);

        $this->getJson('/api/suppliers')->assertStatus(403);
        $this->getJson('/api/fabrics')->assertStatus(403);
        $this->postJson('/api/fabric-stocks', [
            'fabric_id' => $fabric->id,
            'type' => 'IN',
            'quantity' => 1,
        ])->assertStatus(403);
        $this->postJson('/api/notes', [
            'noteable_type' => 'supplier',
            'noteable_id' => $supplier->id,
            'note' => 'No permission',
        ])->assertStatus(403);
    }

    public function test_permissions_allow_with_grant(): void
    {
        $user = User::factory()->create();
        $this->grantAllPermissions($user);
        Sanctum::actingAs($user);

        $supplier = Supplier::factory()->create(['added_by' => $user->id]);
        $fabric = Fabric::factory()->create([
            'supplier_id' => $supplier->id,
            'added_by' => $user->id,
        ]);

        $this->getJson('/api/suppliers')->assertOk();
        $this->getJson('/api/fabrics')->assertOk();
        $this->postJson('/api/fabric-stocks', [
            'fabric_id' => $fabric->id,
            'type' => 'IN',
            'quantity' => 1,
        ])->assertCreated();
        $this->postJson('/api/notes', [
            'noteable_type' => 'supplier',
            'noteable_id' => $supplier->id,
            'note' => 'Has permission',
        ])->assertCreated();
    }
}
