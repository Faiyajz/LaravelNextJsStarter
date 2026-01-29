<?php

namespace App\Http\Requests\Fabrics;

use App\Enums\StockType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class FabricStockStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'fabric_id' => ['required', 'uuid', 'exists:fabrics,id'],
            'type' => ['required', Rule::in(StockType::values())],
            'quantity' => ['required', 'numeric', 'min:0.001'],
            'reference' => ['nullable', 'string', 'max:255'],
        ];
    }
}
