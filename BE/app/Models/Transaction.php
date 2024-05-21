<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Transaction extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'transactions';

    protected $fillable = [
        'member_id',
        'cashier_id',
        'nota_number',
        'date',
        'hour',
        'status',
        'discount',
        'discount_global',
        'total',
        'grand_total',
        'payment_method',
        'cash',
        'transfer',
        'qris',
        'change',
        'payment_discount',
    ];

    protected $casts = [
        'date' => 'datetime:Y-m-d',
        'hour' => 'datetime:H:i',
        'discount' => 'double',
        'discount_global' => 'double',
        'total' => 'double',
        'grand_total' => 'double',
        'cash' => 'double',
        'transfer' => 'double',
        'qris' => 'double',
        'change' => 'double',
        'payment_discount' => 'double',
    ];

    protected $hidden = [
        'deleted_at',
        'created_at',
        'updated_at',
    ];

    public function member()
    {
        return $this->belongsTo(Member::class, 'member_id');
    }

    public function cashier()
    {
        return $this->belongsTo(User::class, 'cashier_id', 'id');
    }

    public function details()
    {
        return $this->hasMany(TransactionDetail::class, 'transaction_id');
    }
}
