<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProductRefund extends Model
{
    use SoftDeletes;

    protected $table = 'product_refunds';

    protected $fillable = [
        'stock_opname_id',
        'product_id',
        'total_refund',
        'nominal',
        'faktur_number',
        'refund_date',
        'responsible',
        'note',
        'status',
    ];

    protected $casts = [
        'total_refund' => 'integer',
        'nominal' => 'double',
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

    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id')->withTrashed();
    }
}
