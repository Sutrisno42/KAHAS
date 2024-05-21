<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Supplier extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'suppliers';

    protected $fillable = [
        'name',
        'phone',
    ];

    protected $hidden = [
        'deleted_at',
        'created_at',
        'updated_at',
    ];

    public function stockOpnames()
    {
        return $this->hasMany(StockOpname::class, 'supplier_id');
    }

    public function products()
    {
        return $this->belongsToMany(Product::class, 'stock_opnames', 'supplier_id', 'product_id')->orderBy('faktur_date', 'DESC');
    }
}
