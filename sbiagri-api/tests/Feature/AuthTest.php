<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function un_utilisateur_peut_s_inscrire()
    {
        $response = $this->postJson('/api/register', [
            'name' => 'SSBI SOME',
            'email' => 'sbi@test.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertStatus(201);
        $response->assertJsonStructure(['user', 'token', 'message']);
        $this->assertDatabaseHas('users', ['email' => 'sbi@test.com']);
    }

    /** @test */
    public function un_utilisateur_ne_peut_pas_s_inscrire_avec_email_existant()
    {
        User::factory()->create(['email' => 'sbi@test.com']);

        $response = $this->postJson('/api/register', [
            'name' => 'Autre',
            'email' => 'sbi@test.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors('email');
    }

    /** @test */
    public function un_utilisateur_peut_se_connecter()
    {
        $user = User::factory()->create([
            'email' => 'sbi@test.com',
            'password' => bcrypt('password123'),
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'sbi@test.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure(['user', 'token']);
    }

    /** @test */
    public function un_utilisateur_ne_peut_pas_se_connecter_avec_mauvais_mot_de_passe()
    {
        User::factory()->create([
            'email' => 'sbi@test.com',
            'password' => bcrypt('password123'),
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'sbi@test.com',
            'password' => 'mauvais',
        ]);

        $response->assertStatus(401);
    }

    /** @test */
    public function un_utilisateur_connecte_peut_se_deconnecter()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->postJson('/api/logout');

        $response->assertStatus(200);
    }
}