<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class CultureFactory extends Factory
{
    public function definition(): array
    {
        $types = ['Légume', 'Céréale', 'Tubercule', 'Fruit', 'Oléagineux'];
        $statuts = ['Semis', 'En croissance', 'Prêt pour récolte', 'Récoltée'];
        $noms = ['Tomates', 'Maïs', 'Carottes', 'Blé', 'Riz', 'Pommes de terre', 'Soja'];

        return [
            'user_id' => User::factory(),
            'name' => $this->faker->randomElement($noms) . ' ' . $this->faker->numberBetween(1, 100),
            'type' => $this->faker->randomElement($types),
            'surface' => $this->faker->randomFloat(2, 0.1, 10),
            'planting_date' => $this->faker->dateTimeBetween('-6 months', 'now')->format('Y-m-d'),
            'status' => $this->faker->randomElement($statuts),
        ];
    }
}