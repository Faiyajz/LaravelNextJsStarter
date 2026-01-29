<?php

namespace App\Http\Requests\Fabrics;

use App\Enums\ProductionType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class FabricUpdateRequest extends FormRequest
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
            'supplier_id' => ['sometimes', 'required', 'uuid', 'exists:suppliers,id'],

            'fabric_no' => ['sometimes', 'required', 'string', 'max:100'],
            'composition' => ['sometimes', 'required', 'string', 'max:255'],
            'gsm' => ['sometimes', 'required', 'integer', 'min:1'],
            'qty' => ['sometimes', 'required', 'numeric', 'min:0'],
            'cuttable_width' => ['sometimes', 'required', 'numeric', 'min:0'],
            'production_type' => ['sometimes', 'required', Rule::in(ProductionType::values())],

            'construction' => ['nullable', 'string', 'max:255'],
            'color_pantone_code' => ['nullable', 'string', 'max:100'],
            'weave_type' => ['nullable', 'string', 'max:100'],
            'finish_type' => ['nullable', 'string', 'max:100'],
            'dyeing_method' => ['nullable', 'string', 'max:100'],
            'printing_method' => ['nullable', 'string', 'max:100'],
            'lead_time' => ['nullable', 'integer', 'min:0'],
            'moq' => ['nullable', 'numeric', 'min:0'],
            'shrinkage_percent' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'remarks' => ['nullable', 'string'],
            'fabric_selected_by' => ['nullable', 'string', 'max:255'],

            'image' => ['nullable', 'image', 'max:4096'],
        ];
    }
}
