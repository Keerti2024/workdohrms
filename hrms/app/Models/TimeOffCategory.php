<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TimeOffCategory extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'annual_quota',
        'notes',
        'is_paid',
        'is_active',
        'tenant_id',
        'author_id',
    ];

    protected $casts = [
        'annual_quota' => 'integer',
        'is_paid' => 'boolean',
        'is_active' => 'boolean',
    ];

    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function requests()
    {
        return $this->hasMany(TimeOffRequest::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
