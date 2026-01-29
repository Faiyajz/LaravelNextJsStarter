<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use App\Models\Fabric;
use App\Models\FabricStock;
use App\Models\Supplier;
use App\Services\Fabrics\FabricService;
use Spatie\Permission\Models\Permission;
use Database\Seeders\PermissionSeeder;
use Database\Seeders\RolePermissionSeeder;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Ensure at least 1 user exists with known credentials
        /** @var User $user */
        $user = User::query()->first() ?? User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => bcrypt('password'),
        ]);

        $this->call([
            PermissionSeeder::class,
            RolePermissionSeeder::class,
        ]);

        if (!app()->environment('production')) {
            $user->syncPermissions(Permission::all());
            $adminRole = Role::query()
                ->where('name', 'admin')
                ->where('guard_name', config('auth.defaults.guard', 'web'))
                ->first();
            if ($adminRole && !$user->hasRole($adminRole)) {
                $user->assignRole($adminRole);
            }
        }

        $userId = $user->getKey();
        $suppliers = Supplier::factory()->count(8)->create(['added_by' => $userId]);

        $fabricService = app(FabricService::class);

        $suppliers->each(function ($supplier) use ($userId, $fabricService) {
            /** @var Supplier $supplier */
            $supplierId = $supplier->getKey();
            $fabrics = Fabric::factory()->count(2)->create([
                'supplier_id' => $supplierId,
                'added_by' => $userId,
            ]);

            $fabrics->each(function ($fabric) use ($userId, $fabricService) {
                /** @var Fabric $fabric */
                $fabricId = $fabric->getKey();
                // Create barcode
                $fabricService->createBarcodeForFabric($fabric);

                // Stocks (IN then some OUT)
                FabricStock::query()->create([
                    'fabric_id' => $fabricId,
                    'type' => 'IN',
                    'quantity' => 100,
                    'reference' => 'Initial Stock',
                    'created_by' => $userId,
                ]);

                FabricStock::query()->create([
                    'fabric_id' => $fabricId,
                    'type' => 'OUT',
                    'quantity' => 25,
                    'reference' => 'Issued for Cutting',
                    'created_by' => $userId,
                ]);

                // Notes
                $fabric->notes()->create([
                    'note' => 'Seed note for fabric.',
                    'created_by' => $userId,
                ]);
            });

            $supplier->notes()->create([
                'note' => 'Seed note for supplier.',
                'created_by' => $userId,
            ]);
        });
    }
}
