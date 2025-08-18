<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\Category;
use App\Models\Brand;

class Product extends Model
{
    use HasFactory;

    protected $casts = [
        'price'            => 'float',
        'profit'           => 'float',
        'stock'            => 'float',
        'wholesale_qty'    => 'float:nullable',
        'wholesale_profit' => 'float:nullable',
    ];

    public function category(): BelongsTo {
        return $this->belongsTo(Category::class, 'category', 'category_slug');
    }

    public function brand(): BelongsTo {
        return $this->belongsTo(Brand::class, 'brand', 'brand_slug');
    }
}
