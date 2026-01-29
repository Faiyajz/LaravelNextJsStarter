<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Supplier>
 */
class SupplierFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'country' => $this->faker->country(),
            'company_name' => $this->faker->company(),
            'code' => strtoupper($this->faker->unique()->bothify('SUP-####')),
            'email' => $this->faker->safeEmail(),
            'phone' => $this->faker->phoneNumber(),
            'address' => $this->faker->address(),
            'representative_name' => $this->faker->name(),
            'representative_email' => $this->faker->safeEmail(),
            'representative_phone' => $this->faker->phoneNumber(),
            'added_by' => User::query()->value('id') ?? 1,
        ];
    }
}
