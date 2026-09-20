<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StockItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'quantity',
        'unit',
        'alert_threshold'
    ];

    protected $casts = [
        'quantity' => 'decimal:2',
        'alert_threshold' => 'decimal:2'
    ];

    // Relations
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Accesseur : est-ce que le stock est en alerte ?
    public function getIsLowStockAttribute()
    {
        return $this->quantity <= $this->alert_threshold;
    }
}