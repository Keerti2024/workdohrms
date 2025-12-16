<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AdvanceType extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'notes',
        'is_active',
        'tenant_id',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function salaryAdvances()
    {
        return $this->hasMany(SalaryAdvance::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
