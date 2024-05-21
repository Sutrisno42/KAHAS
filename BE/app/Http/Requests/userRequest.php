<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class userRequest extends FormRequest
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
            'name' => 'required|string|max:255',
            'email' => 'required|unique:users,email,NULL,id,deleted_at,NULL',
            'password' => 'required',
            'username' => 'required|unique:users,username,NULL,id,deleted_at,NULL',
            'phone' => 'required|unique:users,phone,NULL,id,deleted_at,NULL',
            'role' => 'nullable',

        ];
    }
}
