<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PrediksiPenjualan extends Model
{
    use HasFactory;

    protected $table = 'prediksi_penjualan';

    protected $fillable = [
        'nama_produk',
        'data1',
        'data2',
        'data3',
        'data4',
        'data5',
    ];

    protected $casts = [
        'nama_produk' => 'string',
        'data1' => 'integer',
        'data2' => 'integer',
        'data3' => 'integer',
        'data4' => 'integer',
        'data5' => 'integer',
    ];

    protected $hidden = [
        'deleted_at',
        'created_at',
        'updated_at',
    ];
}
