<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Staudenmeir\EloquentJsonRelations\HasJsonRelationships;

class HistoryRepack extends Model
{
    use HasJsonRelationships;

    protected $table = 'history_repacks';

    protected $fillable = [
        'product_id',
        'origin_id',
        'destination_id',
        'quantity_in',
        'quantity_out',
        'type',
        'date',
    ];

    protected $casts = [
        'quantity_in' => 'integer',
        'quantity_out' => 'integer',
        'destination_id' => 'array',
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }

    public function origin()
    {
        return $this->belongsTo(Product::class, 'origin_id');
    }

    public function destinations()
    {
        return $this->belongsToJson(Product::class, 'destination_id');
    }

    public function getDestinationIdAttribute($value)
    {
        return is_array($value) ? $value : (array) json_decode(str_replace('"', '', $value));
    }

    public function setDestinationIdAttribute($value)
    {
        $this->attributes['destination_id'] = json_encode($value);
    }
}
