<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use App\Models\Product;
use App\Models\SaleItem;
use App\Models\ProductStockSlog;
use App\Models\PayableAccount;

class StockLog extends Model {
    use HasFactory;

    protected $fillable = [
        'description',
        'adjustment_type',
        'reason',
        'note', 
    ];

    public function products(): BelongsToMany {
        return $this->belongsToMany(Product::class)
            ->using(ProductStockSlog::class)
            ->withTimestamps();
    }

    public function sale_items(): BelongsToMany {
        return $this->belongsToMany(SaleItem::class)->withTimestamps();
    }

    public function getCreatedAtAttribute($value) {
        return Carbon::parse($value)->format('Y-m-d H:i:s');
    }

    public function payable_account(): HasOne {
        return $this->hasOne(PayableAccount::class);
    }
}
