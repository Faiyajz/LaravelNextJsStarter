<?php

namespace App\Actions\Auth;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class LoginBuyerUser
{
    /**
     * @return array{user:User,token:string}
     */
    public function __invoke(string $email, string $password): array
    {
        $user = User::query()->where('email', $email)->first();

        if (!$user || !Hash::check($password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Email or password is incorrect.'],
            ]);
        }

        if (!$user->hasRole('buyer')) {
            throw ValidationException::withMessages([
                'email' => ['Buyer account not found.'],
            ]);
        }

        $token = $user->createToken('buyer_token')->plainTextToken;

        return [
            'user' => $user,
            'token' => $token,
        ];
    }
}
