<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class StockOpname extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'stock_opnames';

    protected $fillable = [
        'product_id',
        'supplier_id',
        'amount',
        'hpp_price',
        'faktur_number',
        'faktur_date',
        'expired_date',
        'expired_notif_date',
        'note',
        'responsible',
        'exp_notif',
        'is_approved',
    ];

    protected $casts = [
        'amount' => 'integer',
        'hpp_price' => 'double',
        'exp_notif' => 'boolean',
        'is_approved' => 'boolean',
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id')->withTrashed();
    }

    public function category() {
        return $this->belongsTo(Category::class, $this->product->category_id);
    }

    public function supplier()
    {
        return $this->belongsTo(Supplier::class, 'supplier_id');
    }
}
