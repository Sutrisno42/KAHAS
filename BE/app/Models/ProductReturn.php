<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProductReturn extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'product_returns';

    protected $fillable = [
        'transaction_id',
        'product_id',
        'product_name',
        'product_code',
        'price',
        'quantity',
        'discount',
        'sub_total',
        'reason',
        'status',
        'user_id',
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
    ];

    protected $appends = [
        'date_return',
    ];

    public function transaction()
    {
        return $this->belongsTo(Transaction::class, 'transaction_id');
    }

    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id')->withTrashed();
    }

    public function getDateReturnAttribute()
    {
        return $this->created_at->format('d-m-Y H:i:s');
    }

    public function cashier()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
