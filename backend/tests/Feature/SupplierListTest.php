<?php

namespace Tests\Feature;

use App\Models\Supplier;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class SupplierListTest extends TestCase
{
    use RefreshDatabase;

    public function test_supplier_filters_and_pagination(): void
    {
        $user = User::factory()->create();
        $this->grantAllPermissions($user);
        Sanctum::actingAs($user);

        Supplier::factory()->create([
            'company_name' => 'Acme Textiles',
            'country' => 'USA',
            'code' => 'ACME-01',
            'added_by' => $user->id,
        ]);

        Supplier::factory()->create([
            'company_name' => 'Beta Mills',
            'country' => 'UK',
            'code' => 'BETA-01',
            'added_by' => $user->id,
        ]);

        $this->getJson('/api/suppliers?search=Acme')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.company_name', 'Acme Textiles');

        $this->getJson('/api/suppliers?country=UK')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.company_name', 'Beta Mills');

        Supplier::factory()->count(13)->create(['added_by' => $user->id]);

        $this->getJson('/api/suppliers?per_page=10&page=2')
            ->assertOk()
            ->assertJsonPath('meta.current_page', 2)
            ->assertJsonPath('meta.per_page', 10)
            ->assertJsonPath('meta.total', 15)
            ->assertJsonCount(5, 'data');
    }
}
