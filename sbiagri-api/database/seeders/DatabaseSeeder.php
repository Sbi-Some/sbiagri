<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Culture;
use App\Models\Task;
use App\Models\StockItem;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Créer un utilisateur de test
        $user = User::create([
            'name' => 'SSBI SOME',
            'email' => 'sbi@test.com',
            'password' => Hash::make('password123'),
        ]);

        // Créer 5 cultures
        $cultures = Culture::factory(5)->create(['user_id' => $user->id]);

        // Créer 10 tâches
        Task::factory(10)->create(['user_id' => $user->id]);

        // Créer 8 stocks
        StockItem::factory(8)->create(['user_id' => $user->id]);

        $this->command->info(' Données de test créées !');
        $this->command->info('Email: sbi@test.com');
        $this->command->info('Mot de passe: password123');
    }
}