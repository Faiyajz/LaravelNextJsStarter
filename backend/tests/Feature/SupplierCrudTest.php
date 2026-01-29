<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class SupplierCrudTest extends TestCase
{
    use RefreshDatabase;

    public function test_supplier_crud_flow(): void
    {
        $user = User::factory()->create();
        $this->grantAllPermissions($user);
        Sanctum::actingAs($user);

        $payload = [
            'country' => 'USA',
            'company_name' => 'Acme Textiles',
            'code' => 'ACME-001',
            'email' => 'info@acme.test',
            'phone' => '+1-555-0100',
            'address' => '123 Main St',
            'representative_name' => 'Jane Doe',
            'representative_email' => 'jane@acme.test',
            'representative_phone' => '+1-555-0101',
        ];

        $create = $this->postJson('/api/suppliers', $payload)
            ->assertCreated()
            ->assertJsonPath('data.company_name', 'Acme Textiles');

        $supplierId = $create->json('data.id');

        $this->getJson('/api/suppliers')
            ->assertOk()
            ->assertJsonFragment(['id' => $supplierId]);

        $this->getJson("/api/suppliers/{$supplierId}")
            ->assertOk()
            ->assertJsonPath('data.id', $supplierId);

        $this->putJson("/api/suppliers/{$supplierId}", ['country' => 'Canada'])
            ->assertOk()
            ->assertJsonPath('data.country', 'Canada');

        $this->deleteJson("/api/suppliers/{$supplierId}")
            ->assertOk();

        $this->getJson('/api/suppliers-trash')
            ->assertOk()
            ->assertJsonFragment(['id' => $supplierId]);

        $this->postJson("/api/suppliers/{$supplierId}/restore")
            ->assertOk()
            ->assertJsonPath('data.id', $supplierId);
    }
}
