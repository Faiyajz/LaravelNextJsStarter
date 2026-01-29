<?php

namespace App\Http\Requests\Buyers;

use App\Models\BuyerProfile;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class BuyerUpdateRequest extends FormRequest
{
    public function rules(): array
    {
        $buyer = $this->route('buyer');
        $userId = $buyer instanceof BuyerProfile ? $buyer->user_id : null;

        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($userId, 'id'),
            ],
            'company_name' => ['required', 'string', 'max:255'],
            'country' => ['required', 'string', 'max:100'],
            'phone' => ['nullable', 'string', 'max:50'],
        ];
    }
}
