<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ExitCategory extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'notes',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function offboardings()
    {
        return $this->hasMany(Offboarding::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
