<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductUnit extends Model
{
    use HasFactory;

    protected $table = 'product_unit';

    protected $fillable = [
        'product_id',
        'unit_id',
        'price',
        'minimum',
    ];

    public $timestamps = false;

    protected $casts = [
        'price' => 'double',
        'minimum' => 'integer',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id')->withTrashed();
    }

    public function unit()
    {
        return $this->belongsTo(Unit::class, 'unit_id');
    }
}
