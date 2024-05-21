<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class menuRequest extends FormRequest
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
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'menu_name' => 'required|string|max:255',
            'parent_id' => 'nullable|integer',
            'path' => 'required',
        ];
    }
}
