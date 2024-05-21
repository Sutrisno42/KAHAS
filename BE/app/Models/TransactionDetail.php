<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TransactionDetail extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'transaction_details';

    protected $fillable = [
        'transaction_id',
        'product_id',
        'unit_id',
        'product_name',
        'product_code',
        'price',
        'quantity',
        'quantity_unit',
        'discount',
        'sub_total',
    ];

    protected $casts = [
        'price' => 'double',
        'quantity' => 'integer',
        'discount' => 'double',
        'sub_total' => 'double',
    ];

    protected $hidden = [
        'deleted_at',
        'created_at',
        'updated_at',
//        'quantity',
    ];

    public function transaction()
    {
        return $this->belongsTo(Transaction::class, 'transaction_id');
    }

    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id')->withTrashed();
    }

    public function unit()
    {
        return $this->belongsTo(Unit::class, 'unit_id');
    }

    public function scopeByTransactionId($query, $transactionId)
    {
        return $query->where('transaction_id', $transactionId);
    }
}
