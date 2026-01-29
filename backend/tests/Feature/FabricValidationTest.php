<?php

namespace Tests\Feature;

use App\Models\Supplier;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class FabricValidationTest extends TestCase
{
    use RefreshDatabase;

    public function test_fabric_requires_valid_production_type(): void
    {
        $user = User::factory()->create();
        $this->grantAllPermissions($user);
        Sanctum::actingAs($user);

        $supplier = Supplier::factory()->create(['added_by' => $user->id]);

        $this->postJson('/api/fabrics', [
            'supplier_id' => $supplier->id,
            'fabric_no' => 'FAB-INVALID',
            'composition' => '100% Cotton',
            'gsm' => 180,
            'qty' => 10,
            'cuttable_width' => 58,
            'production_type' => 'Invalid',
        ])
            ->assertStatus(422)
            ->assertJsonStructure([
                'message',
                'errors' => ['production_type'],
            ]);
    }
}
