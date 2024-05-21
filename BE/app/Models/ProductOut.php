<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProductOut extends Model
{
    use SoftDeletes;

    protected $table = 'product_outs';

    protected $fillable = [
        'product_id',
        'stock_opname_id',
        'total_out',
        'nominal',
        'out_date',
        'note',
        'responsible',
    ];

    protected $casts = [
        'total_out' => 'integer',
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
