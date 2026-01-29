<?php

namespace Tests\Feature;

use App\Models\Fabric;
use App\Models\Supplier;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class FabricListTest extends TestCase
{
    use RefreshDatabase;

    public function test_fabric_filters_and_pagination(): void
    {
        $user = User::factory()->create();
        $this->grantAllPermissions($user);
        Sanctum::actingAs($user);

        $supplier = Supplier::factory()->create(['added_by' => $user->id]);

        Fabric::factory()->create([
            'supplier_id' => $supplier->id,
            'fabric_no' => 'FAB-BULK',
            'production_type' => 'Bulk',
            'added_by' => $user->id,
        ]);

        Fabric::factory()->create([
            'supplier_id' => $supplier->id,
            'fabric_no' => 'FAB-SMS',
            'production_type' => 'SMS',
            'added_by' => $user->id,
        ]);

        $this->getJson('/api/fabrics?production_type=Bulk')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.fabric_no', 'FAB-BULK');

        Fabric::factory()->count(9)->create([
            'supplier_id' => $supplier->id,
            'production_type' => 'Bulk',
            'added_by' => $user->id,
        ]);

        $this->getJson('/api/fabrics?per_page=5&page=2')
            ->assertOk()
            ->assertJsonPath('meta.current_page', 2)
            ->assertJsonPath('meta.per_page', 5)
            ->assertJsonPath('meta.total', 11)
            ->assertJsonCount(5, 'data');
    }
}
