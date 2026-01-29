<?php

namespace Tests\Feature;

use App\Models\Supplier;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Illuminate\Testing\Fluent\AssertableJson;
use Tests\TestCase;

class FabricStockTest extends TestCase
{
    use RefreshDatabase;

    public function test_fabric_stock_and_qty_adjustments(): void
    {
        $user = User::factory()->create();
        $this->grantAllPermissions($user);
        Sanctum::actingAs($user);

        $supplier = Supplier::factory()->create([
            'added_by' => $user->id,
        ]);

        $fabricPayload = [
            'supplier_id' => $supplier->id,
            'fabric_no' => 'FAB-100',
            'composition' => '100% Cotton',
            'gsm' => 160,
            'qty' => 100,
            'cuttable_width' => 60,
            'production_type' => 'Bulk',
        ];

        $create = $this->postJson('/api/fabrics', $fabricPayload)
            ->assertCreated()
            ->assertJsonPath('data.fabric_no', 'FAB-100');

        $fabricId = $create->json('data.id');

        $this->getJson("/api/fabrics/{$fabricId}")
            ->assertOk()
            ->assertJson(fn (AssertableJson $json) =>
                $json->where('data.available_balance', fn ($value) => \abs($value - 100) < 0.0001)
                    ->etc()
            );

        $this->postJson('/api/fabric-stocks', [
            'fabric_id' => $fabricId,
            'type' => 'OUT',
            'quantity' => 30,
            'reference' => 'Issued',
        ])
            ->assertCreated()
            ->assertJson(fn (AssertableJson $json) =>
                $json->where('data.available_balance', fn ($value) => \abs($value - 70) < 0.0001)
                    ->etc()
            );

        $this->postJson('/api/fabric-stocks', [
            'fabric_id' => $fabricId,
            'type' => 'OUT',
            'quantity' => 100,
            'reference' => 'Over-issue',
        ])
            ->assertStatus(422)
            ->assertJsonPath('message', 'Insufficient balance.');

        $this->postJson('/api/fabric-stocks', [
            'fabric_id' => $fabricId,
            'type' => 'OUT',
            'quantity' => 40,
            'reference' => 'Issue 1',
        ])
            ->assertCreated();

        $this->postJson('/api/fabric-stocks', [
            'fabric_id' => $fabricId,
            'type' => 'OUT',
            'quantity' => 40,
            'reference' => 'Issue 2',
        ])
            ->assertStatus(422)
            ->assertJsonPath('message', 'Insufficient balance.');

        $this->putJson("/api/fabrics/{$fabricId}", [
            'qty' => 0,
        ])
            ->assertStatus(422)
            ->assertJsonStructure([
                'message',
                'errors' => ['qty'],
            ]);

        $this->putJson("/api/fabrics/{$fabricId}", [
            'qty' => 120,
        ])
            ->assertOk();

        $this->getJson("/api/fabrics/{$fabricId}")
            ->assertOk()
            ->assertJson(fn (AssertableJson $json) =>
                $json->where('data.available_balance', fn ($value) => \abs($value - 50) < 0.0001)
                    ->etc()
            );

        $this->deleteJson("/api/fabrics/{$fabricId}")
            ->assertOk();

        $this->getJson('/api/fabrics-trash')
            ->assertOk()
            ->assertJsonFragment(['id' => $fabricId]);

        $this->postJson("/api/fabrics/{$fabricId}/restore")
            ->assertOk()
            ->assertJsonPath('data.id', $fabricId);
    }

    public function test_stock_validation_fails_for_invalid_type(): void
    {
        $user = User::factory()->create();
        $this->grantAllPermissions($user);
        Sanctum::actingAs($user);

        $supplier = Supplier::factory()->create([
            'added_by' => $user->id,
        ]);

        $fabric = \App\Models\Fabric::factory()->create([
            'supplier_id' => $supplier->id,
            'added_by' => $user->id,
        ]);

        $this->postJson('/api/fabric-stocks', [
            'fabric_id' => $fabric->id,
            'type' => 'BAD',
            'quantity' => 10,
        ])
            ->assertStatus(422)
            ->assertJsonStructure([
                'message',
                'errors' => ['type'],
            ]);
    }
}
