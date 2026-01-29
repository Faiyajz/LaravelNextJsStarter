<?php

namespace Tests\Feature;

use App\Models\Supplier;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class SupplierValidationTest extends TestCase
{
    use RefreshDatabase;

    public function test_supplier_code_must_be_unique(): void
    {
        $user = User::factory()->create();
        $this->grantAllPermissions($user);
        Sanctum::actingAs($user);

        Supplier::factory()->create([
            'code' => 'SUP-001',
            'added_by' => $user->id,
        ]);

        $this->postJson('/api/suppliers', [
            'country' => 'USA',
            'company_name' => 'Duplicate Supplier',
            'code' => 'SUP-001',
        ])
            ->assertStatus(422)
            ->assertJsonStructure([
                'message',
                'errors' => ['code'],
            ]);
    }
}
