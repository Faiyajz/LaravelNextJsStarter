<?php

namespace Database\Factories;

use App\Models\Supplier;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Fabric>
 */
class FabricFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'supplier_id' => Supplier::factory(),
            'fabric_no' => strtoupper($this->faker->bothify('FAB-###??')),
            'composition' => $this->faker->randomElement(['100% Cotton', 'Cotton/Poly 60/40', 'Viscose Blend']),
            'gsm' => $this->faker->numberBetween(120, 380),
            'qty' => $this->faker->randomFloat(3, 10, 500),
            'cuttable_width' => $this->faker->randomFloat(3, 40, 70),
            'production_type' => $this->faker->randomElement(['Sample Yardage', 'SMS', 'Bulk']),
            'added_by' => User::query()->value('id') ?? 1,
        ];
    }
}
