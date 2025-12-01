<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\PayableAccount;
use App\Models\Product;

class PayableAccountItem extends Model
{
    use HasFactory;

    protected $casts = [
        'unit_price'         => 'float',
    ];

    public function payable_account(): BelongsTo {
        return $this->belongsTo(PayableAccount::class);
    }

    public function product(): BelongsTo {
        return $this->belongsTo(Product::class);
    }
}
