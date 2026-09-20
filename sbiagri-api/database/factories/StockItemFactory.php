<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class StockItemFactory extends Factory
{
    public function definition(): array
    {
        $noms = [
            'Engrais NPK',
            'Semences de tomates',
            'Pesticide bio',
            'Compost organique',
            'Herbicide',
            'Fongicide',
            'Engrais azoté',
            'Chaux agricole',
        ];
        $unites = ['kg', 'L', 'sacs', 'unités'];

        $quantite = $this->faker->randomFloat(2, 1, 100);

        return [
            'user_id' => User::factory(),
            'name' => $this->faker->randomElement($noms),
            'quantity' => $quantite,
            'unit' => $this->faker->randomElement($unites),
            'alert_threshold' => $this->faker->boolean(40)
                ? $quantite + $this->faker->randomFloat(2, 1, 20)  // En alerte
                : $quantite - $this->faker->randomFloat(2, 1, 20), // OK
        ];
    }
}