<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\Sale;
use App\Models\Product;

class SaleItem extends Model
{
    use HasFactory;

    protected $casts = [
        'unit_price'         => 'float',
        'quantity'           => 'float',
    ];

    public function sale(): BelongsTo {
        return $this->belongsTo(Sale::class);
    }

    public function product(): BelongsTo {
        return $this->belongsTo(Product::class);
    }
}
