<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DataShiftRequest extends FormRequest
{

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'cashier_id' => 'nullable|integer',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'total_cash' => 'nullable|numeric',
            'total_transfer' => 'nullable|numeric',
            'total_qris' => 'nullable|numeric',
            'total_transaction' => 'nullable|numeric',
            'discount_cash' => 'nullable|numeric',
            'discount_transfer' => 'nullable|numeric',
            'discount_qris' => 'nullable|numeric',
            'discount_total' => 'nullable|numeric',
            'retur_total' => 'nullable|numeric',
            'retur_nominal' => 'nullable|numeric',
            'nota_total' => 'nullable|numeric',
            'initial_balance' => 'nullable|numeric',
        ];
    }
}
