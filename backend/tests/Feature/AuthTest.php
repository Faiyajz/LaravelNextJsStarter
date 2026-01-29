<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_register_and_login(): void
    {
        $registerPayload = [
            'name' => 'Test User',
            'email' => 'testuser@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ];

        $this->postJson('/api/register', $registerPayload)
            ->assertCreated()
            ->assertJsonPath('data.user.email', 'testuser@example.com')
            ->assertJsonPath('data.user.name', 'Test User')
            ->assertJsonStructure([
                'data' => ['user' => ['id', 'name', 'email'], 'token'],
            ]);

        $this->postJson('/api/login', [
            'email' => 'testuser@example.com',
            'password' => 'password123',
        ])
            ->assertOk()
            ->assertJsonPath('data.user.email', 'testuser@example.com')
            ->assertJsonStructure([
                'data' => ['user' => ['id', 'name', 'email'], 'token'],
            ]);
    }

    public function test_login_fails_with_invalid_credentials(): void
    {
        $user = \App\Models\User::factory()->create([
            'email' => 'loginfail@example.com',
            'password' => bcrypt('password123'),
        ]);

        $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => 'wrong-password',
        ])
            ->assertStatus(422)
            ->assertJsonStructure([
                'message',
                'errors' => ['email'],
            ]);
    }

    public function test_register_validation_fails(): void
    {
        $this->postJson('/api/register', [
            'name' => '',
            'email' => 'not-an-email',
            'password' => 'short',
            'password_confirmation' => 'mismatch',
        ])
            ->assertStatus(422)
            ->assertJsonStructure([
                'message',
                'errors' => ['name', 'email', 'password'],
            ]);
    }
}
