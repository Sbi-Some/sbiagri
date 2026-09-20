<?php

namespace Tests\Feature;

use App\Models\StockItem;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StockItemTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function un_utilisateur_authentifie_peut_lister_ses_stocks()
    {
        $user = User::factory()->create();
        StockItem::factory(3)->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->getJson('/api/stocks');

        $response->assertStatus(200);
    }

    /** @test */
    public function un_utilisateur_peut_creer_un_article_de_stock()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->postJson('/api/stocks', [
            'name' => 'Engrais NPK',
            'quantity' => 10,
            'unit' => 'kg',
            'alert_threshold' => 5,
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('stock_items', ['name' => 'Engrais NPK']);
    }

    /** @test */
    public function un_stock_necessite_une_quantite()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->postJson('/api/stocks', [
            'name' => 'Engrais',
            'unit' => 'kg',
            'alert_threshold' => 5,
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors('quantity');
    }

    /** @test */
    public function un_stock_peut_etre_filtre_par_alerte()
    {
        $user = User::factory()->create();

        // Stock OK
        StockItem::factory()->create([
            'user_id' => $user->id,
            'quantity' => 50,
            'alert_threshold' => 10,
        ]);

        // Stock en alerte
        StockItem::factory()->create([
            'user_id' => $user->id,
            'quantity' => 2,
            'alert_threshold' => 10,
        ]);

        $response = $this->actingAs($user)->getJson('/api/stocks?low_stock=true');

        $response->assertStatus(200);
    }

    /** @test */
    public function un_utilisateur_peut_modifier_un_stock()
    {
        $user = User::factory()->create();
        $stock = StockItem::factory()->create([
            'user_id' => $user->id,
            'quantity' => 10,
        ]);

        $response = $this->actingAs($user)->putJson("/api/stocks/{$stock->id}", [
            'quantity' => 25,
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('stock_items', ['quantity' => 25]);
    }

    /** @test */
    public function un_utilisateur_peut_supprimer_un_stock()
    {
        $user = User::factory()->create();
        $stock = StockItem::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->deleteJson("/api/stocks/{$stock->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('stock_items', ['id' => $stock->id]);
    }
}