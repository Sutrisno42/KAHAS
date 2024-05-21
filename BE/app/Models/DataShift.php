<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DataShift extends Model
{
    use SoftDeletes;

    protected $table = 'data_shifts';

    protected $fillable = [
        'cashier_id',
        'start_date',
        'end_date',
        'total_cash',
        'total_transfer',
        'total_qris',
        'total_change',
        'total_transaction',
        'discount_transaction',
        'discount_payment',
        'discount_total',
        'retur_total',
        'retur_nominal',
        'nota_total',
        'initial_balance',
    ];

    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'total_cash' => 'double',
        'total_transfer' => 'double',
        'total_qris' => 'double',
        'total_change' => 'double',
        'total_transaction' => 'double',
        'discount_transaction' => 'double',
        'discount_payment' => 'double',
        'discount_total' => 'double',
        'retur_total' => 'integer',
        'retur_nominal' => 'double',
        'nota_total' => 'integer',
        'initial_balance' => 'double',
    ];

    public function cashier()
    {
        return $this->belongsTo(User::class, 'cashier_id', 'id');
    }

    public function scopeByCashierId($query, $cashierId)
    {
        return $query->where('cashier_id', $cashierId);
    }

    public function scopeByDate($query, $date)
    {
        return $query->whereDate('start_date', $date);
    }

    public function scopeByDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('start_date', [$startDate, $endDate]);
    }
}
