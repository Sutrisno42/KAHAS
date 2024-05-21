<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class productRequest extends FormRequest
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
            'category_id' => 'nullable',
            'product_name' => 'required',
            'product_code' => 'required',
            'stock' => 'required',
            'price' => 'required',
            'discount' => 'nullable',
            'supplier_id' => 'nullable',
            'hpp_price' => 'nullable',
            'faktur_number' => 'nullable',
            'expired_date' => 'nullable',
            'expired_notif_date' => 'nullable',
            'unit_id*' => 'nullable',
            'unit_price*' => 'nullable',
            'category_name' => 'nullable',
            'category_code' => 'nullable',
        ];
    }
}
