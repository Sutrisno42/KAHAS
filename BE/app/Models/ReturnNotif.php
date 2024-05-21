<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ReturnNotif extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'return_notifs';

    protected $fillable = [
        'product_id',
        'product_return_id',
        'title',
        'description',
        'is_read',
    ];

    protected $casts = [
        'product_id' => 'integer',
        'product_return_id' => 'integer',
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

    public function productReturn()
    {
        return $this->belongsTo(ProductReturn::class, 'product_return_id');
    }
}
