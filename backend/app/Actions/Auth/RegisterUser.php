<?php

namespace App\Actions\Auth;

use App\DTOs\Auth\RegisterData;
use App\Models\BuyerProfile;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class RegisterUser
{
    /**
     * @return array{user:User,token:?string}
     */
    public function __invoke(RegisterData $data, bool $issueToken = true): array
    {
        $isBuyer = $data->accountType === 'buyer'
            || ($data->companyName !== null || $data->country !== null || $data->phone !== null);

        $user = User::query()->create([
            'name' => $data->name,
            'email' => $data->email,
            'password' => Hash::make($data->password),
        ]);

        if ($isBuyer) {
            BuyerProfile::query()->create([
                'user_id' => $user->id,
                'company_name' => $data->companyName ?? '',
                'country' => $data->country ?? '',
                'phone' => $data->phone,
            ]);

            $guard = config('auth.defaults.guard', 'web');
            $role = Role::query()
                ->where('name', 'buyer')
                ->where('guard_name', $guard)
                ->first();
            if ($role) {
                $user->assignRole($role);
            }
        }

        $token = $issueToken ? $user->createToken('auth_token')->plainTextToken : null;

        return [
            'user' => $user,
            'token' => $token,
        ];
    }
}
