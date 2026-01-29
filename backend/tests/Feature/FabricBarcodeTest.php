<?php

namespace Tests\Feature;

use App\Models\Fabric;
use App\Models\Supplier;
use App\Models\User;
use App\Services\Fabrics\FabricService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class FabricBarcodeTest extends TestCase
{
    use RefreshDatabase;

    public function test_barcode_generation_retries_after_unique_collision(): void
    {
        $user = User::factory()->create();
        $this->grantAllPermissions($user);
        Sanctum::actingAs($user);

        $supplier = Supplier::factory()->create(['added_by' => $user->id]);

        $fabric = Fabric::factory()->create([
            'supplier_id' => $supplier->id,
            'added_by' => $user->id,
        ]);

        $duplicateRandom = 'DUPLICATE1';
        $existingBarcode = \sprintf('FAB-%s-%s', $fabric->id, $duplicateRandom);

        $fabric->barcodes()->create([
            'barcode_value' => $existingBarcode,
        ]);

        $sequence = [$duplicateRandom, 'UNIQUE00000'];

        Str::createRandomStringsUsing(function () use (&$sequence): string {
            return array_shift($sequence) ?? 'UNIQUE00000';
        });

        try {
            $service = app(FabricService::class);
            $barcode = $service->createBarcodeForFabric($fabric);
        } finally {
            Str::createRandomStringsUsing(null);
        }

        $this->assertNotSame($existingBarcode, $barcode->barcode_value);
        $this->assertDatabaseCount('fabric_barcodes', 2);
    }
}
