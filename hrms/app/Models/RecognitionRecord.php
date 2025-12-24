<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RecognitionRecord extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'staff_member_id',
        'recognition_category_id',
        'recognition_date',
        'reward',
        'notes',
        'tenant_id',
        'author_id',
    ];

    protected $casts = [
        'recognition_date' => 'date',
    ];

    public function staffMember()
    {
        return $this->belongsTo(StaffMember::class);
    }

    public function category()
    {
        return $this->belongsTo(RecognitionCategory::class, 'recognition_category_id');
    }

    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }
}
