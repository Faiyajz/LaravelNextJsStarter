<?php

namespace App\Actions\Auth;

use App\DTOs\Auth\LoginData;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class LoginUser
{
    /**
     * @return array{user:User,token:string}
     */
    public function __invoke(LoginData $data): array
    {
        $user = User::query()->where('email', $data->email)->first();

        if (!$user || !Hash::check($data->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Email or password is incorrect.'],
            ]);
        }

        if (config('security.email_verification.enabled') && !$user->hasVerifiedEmail()) {
            throw ValidationException::withMessages([
                'email' => ['Email is not verified.'],
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return [
            'user' => $user,
            'token' => $token,
        ];
    }
}
