<?php

namespace Database\Factories;

use App\Models\Culture;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class TaskFactory extends Factory
{
    public function definition(): array
    {
        $titres = [
            'Irriguer parcelle',
            'Traiter contre les nuisibles',
            'Fertiliser le sol',
            'Récolter les légumes',
            'Semer les graines',
            'Tailler les plants',
            'Désherber',
            'Pailler le sol',
        ];
        $statuts = ['À faire', 'En cours', 'Terminée'];

        return [
            'user_id' => User::factory(),
            'culture_id' => $this->faker->boolean(70) ? Culture::factory() : null,
            'title' => $this->faker->randomElement($titres) . ' ' . $this->faker->word(),
            'due_date' => $this->faker->dateTimeBetween('now', '+2 months')->format('Y-m-d'),
            'status' => $this->faker->randomElement($statuts),
        ];
    }
}