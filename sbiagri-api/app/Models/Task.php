<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'culture_id',
        'title',
        'due_date',
        'status'
    ];

    protected $casts = [
        'due_date' => 'date'
    ];

    // Relations
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function culture()
    {
        return $this->belongsTo(Culture::class);
    }
}