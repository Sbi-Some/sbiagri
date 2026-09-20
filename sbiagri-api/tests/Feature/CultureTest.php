<?php

namespace Tests\Feature;

use App\Models\Culture;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CultureTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function un_utilisateur_non_authentifie_ne_peut_pas_acceder_aux_cultures()
    {
        $response = $this->getJson('/api/cultures');
        $response->assertStatus(401);
    }

    /** @test */
    public function un_utilisateur_authentifie_peut_lister_ses_cultures()
    {
        $user = User::factory()->create();
        Culture::factory(3)->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->getJson('/api/cultures');

        $response->assertStatus(200);
    }

    /** @test */
    public function un_utilisateur_peut_creer_une_culture()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->postJson('/api/cultures', [
            'name' => 'Tomates',
            'type' => 'Légume',
            'surface' => 0.5,
            'planting_date' => '2025-01-15',
            'status' => 'Semis',
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('cultures', [
            'name' => 'Tomates',
            'user_id' => $user->id,
        ]);
    }

    /** @test */
    public function un_utilisateur_ne_peut_pas_creer_une_culture_sans_nom()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->postJson('/api/cultures', [
            'type' => 'Légume',
            'surface' => 0.5,
            'planting_date' => '2025-01-15',
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors('name');
    }

    /** @test */
    public function un_utilisateur_peut_voir_une_culture()
    {
        $user = User::factory()->create();
        $culture = Culture::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->getJson("/api/cultures/{$culture->id}");

        $response->assertStatus(200);
        $response->assertJsonFragment(['name' => $culture->name]);
    }

    /** @test */
    public function un_utilisateur_peut_modifier_une_culture()
    {
        $user = User::factory()->create();
        $culture = Culture::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->putJson("/api/cultures/{$culture->id}", [
            'name' => 'Tomates modifiées',
            'type' => 'Légume',
            'surface' => 1.0,
            'planting_date' => '2025-02-01',
            'status' => 'En croissance',
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('cultures', ['name' => 'Tomates modifiées']);
    }

    /** @test */
    public function un_utilisateur_peut_supprimer_une_culture()
    {
        $user = User::factory()->create();
        $culture = Culture::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->deleteJson("/api/cultures/{$culture->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('cultures', ['id' => $culture->id]);
    }

    /** @test */
    public function un_utilisateur_ne_peut_pas_voir_la_culture_d_un_autre()
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        $culture = Culture::factory()->create(['user_id' => $user1->id]);

        $response = $this->actingAs($user2)->getJson("/api/cultures/{$culture->id}");

        $response->assertStatus(404);
    }
}