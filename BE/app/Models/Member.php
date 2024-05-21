<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Member extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'members';
    protected $fillable = [
        'name',
        'code',
        'phone',
        'email',
        'address',
        'default_discount',
    ];

    protected $casts = [
        'default_discount' => 'integer',
    ];

    protected $hidden = [
        'deleted_at',
        'created_at',
        'updated_at',
    ];

    public function transactions()
    {
        return $this->hasMany(Transaction::class, 'member_id');
    }
}
