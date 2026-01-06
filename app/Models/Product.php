<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Category;
use App\Models\Brand;
use App\Models\StockLog;
use App\Models\ProductStockSlog;
use App\Models\PayableAccountItem;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    protected $casts = [
        'price'            => 'float',
        'profit'           => 'float',
        'stock'            => 'float',
        'wholesale_qty'    => 'float:nullable',
        'wholesale_profit' => 'float:nullable',
        'notification_stock'    => 'float:nullable',
    ];

    public function category(): BelongsTo {
        return $this->belongsTo(Category::class, 'category', 'category_slug');
    }

    public function brand(): BelongsTo {
        return $this->belongsTo(Brand::class, 'brand', 'brand_slug');
    }

    public function stock_logs(): BelongsToMany {
        return $this->belongsToMany(StockLog::class)->using(ProductStockSlog::class);
    }

    public function payable_account_items(): HasMany {
        return $this->hasMany(PayableAccountItem::class);
    }

    public function getMeasurementSuffix() {
        if ($this->stock === 0) {
            return '';
        }

        switch ($this->measurement) {
            case 'unit':
                if ($this->stock > 1) {
                    return __('Units');
                }
                return __('Unit');
            case 'liter':
                return $this->stock > 1 ? 'Lts' : 'Lt';
            case 'weight':
                return 'Kg';
        }

        return '';
    } 

    public static function remaining_stock($id) {
        $product = Product::findOrFail($id);
        $remaining_stock = Product::select([
            DB::raw('products.stock - COALESCE(SUM(sale_items.quantity), 0) as remaining_stock'),
        ])
        ->leftJoin('sale_items', 'products.id', '=', 'sale_items.product_id')
        ->where('products.id', '=', $product->id)
        ->groupBy('products.id', 'products.stock')
        ->first()
        ->remaining_stock ?? 0;

        return [$remaining_stock, $product];
    }
}
