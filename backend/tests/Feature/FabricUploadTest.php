<?php

namespace Tests\Feature;

use App\Models\Supplier;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class FabricUploadTest extends TestCase
{
    use RefreshDatabase;

    public function test_fabric_image_upload(): void
    {
        Storage::fake('public');

        $user = User::factory()->create();
        $this->grantAllPermissions($user);
        Sanctum::actingAs($user);

        $supplier = Supplier::factory()->create(['added_by' => $user->id]);

        $response = $this->post('/api/fabrics', [
            'supplier_id' => $supplier->id,
            'fabric_no' => 'FAB-IMG',
            'composition' => '100% Cotton',
            'gsm' => 180,
            'qty' => 10,
            'cuttable_width' => 58,
            'production_type' => 'Bulk',
            'image' => UploadedFile::fake()->image('fabric.jpg'),
        ]);

        $response->assertCreated();

        $path = $response->json('data.image_path');
        $this->assertNotNull($path);
        Storage::disk('public')->assertExists($path);
    }

    public function test_fabric_image_upload_validation_fails_for_non_image(): void
    {
        Storage::fake('public');

        $user = User::factory()->create();
        $this->grantAllPermissions($user);
        Sanctum::actingAs($user);

        $supplier = Supplier::factory()->create(['added_by' => $user->id]);

        $response = $this->post('/api/fabrics', [
            'supplier_id' => $supplier->id,
            'fabric_no' => 'FAB-BAD',
            'composition' => '100% Cotton',
            'gsm' => 180,
            'qty' => 10,
            'cuttable_width' => 58,
            'production_type' => 'Bulk',
            'image' => UploadedFile::fake()->create('fabric.pdf', 10, 'application/pdf'),
        ]);

        $response->assertStatus(422)
            ->assertJsonStructure([
                'message',
                'errors' => ['image'],
            ]);
    }
}
