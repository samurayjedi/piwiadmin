<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Product;

class Brand extends Model
{
    use HasFactory, SoftDeletes;

    public function products(): HasMany {
        return $this->hasMany(Product::class, 'brand', 'brand_slug');
    }
}
