<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProductExpired extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'product_expireds';

    protected $fillable = [
        'product_id',
        'stock_opname_id',
        'total_expired',
        'note',
        'responsible',
        'expired_date',
    ];

    protected $casts = [
        'total_expired' => 'integer',
    ];

    protected $dates = [
        'expired_date',
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    public function stockOpname()
    {
        return $this->belongsTo(StockOpname::class, 'stock_opname_id');
    }
}
