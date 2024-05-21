<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ExpiredNotif extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'expired_notifs';

    protected $fillable = [
        'product_id',
        'stock_opname_id',
        'title',
        'description',
        'is_read',
    ];

    protected $casts = [
        'product_id' => 'integer',
        'stock_opname_id' => 'integer',
        'title' => 'string',
        'description' => 'string',
        'is_read' => 'boolean',
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

    public function stockOpname()
    {
        return $this->belongsTo(StockOpname::class, 'stock_opname_id');
    }
}
