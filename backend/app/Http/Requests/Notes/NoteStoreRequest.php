<?php

namespace App\Http\Requests\Notes;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class NoteStoreRequest extends FormRequest
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
            'noteable_type' => ['required', Rule::in(['supplier', 'fabric'])],
            'noteable_id' => ['required', 'string', 'uuid'],
            'note' => ['required', 'string', 'max:5000'],
        ];
    }
}
