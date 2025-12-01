<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class ProductStockSlog extends Pivot
{
    protected $table = 'product_stock_log';

    public $incrementing = true;

    public $timestamps = true;

    protected $fillable = [
        'stock_log_id',
        'product_id',
        'adjustment',
        'from_stock', 
        'to_stock',
    ];

    protected $casts = [
        'adjustment'          => 'float',
        'from_stock'          => 'float',
        'to_stock'            => 'float',
    ];
}
