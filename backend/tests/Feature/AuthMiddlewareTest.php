<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthMiddlewareTest extends TestCase
{
    use RefreshDatabase;

    public function test_protected_routes_require_authentication(): void
    {
        $this->getJson('/api/suppliers')->assertStatus(401);
        $this->getJson('/api/fabrics')->assertStatus(401);
        $this->postJson('/api/fabric-stocks', [])->assertStatus(401);
        $this->postJson('/api/notes', [])->assertStatus(401);
    }
}
