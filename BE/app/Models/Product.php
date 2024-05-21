<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Http\Request;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'products';

    protected $fillable = [
        'category_id',
        'product_name',
        'product_code',
        'stock',
        'price',
        'discount',
    ];

    protected $casts = [
        'stock' => 'integer',
        'price' => 'double',
        'discount' => 'double',
    ];

    protected $hidden = [
        'deleted_at',
        'created_at',
        'updated_at',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    public function stockOpnames()
    {
        return $this->hasMany(StockOpname::class, 'product_id')->orderBy('expired_date', 'desc')->orderBy('id', 'DESC');
    }

    public function stockOpname()
    {
        return $this->hasOne(StockOpname::class, 'product_id')->orderBy('expired_date', 'desc')->orderBy('id', 'DESC');
    }

    public function priceLists()
    {
        return $this->belongsToMany(Unit::class, 'product_unit', 'product_id', 'unit_id')->withPivot([
            'price',
            'minimum',
        ]);
    }
}
