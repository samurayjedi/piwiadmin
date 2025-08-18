<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\Sale;
use App\Models\PaymentMethod;

class Payment extends Model
{
    use HasFactory;

    protected $casts = [
        'amount'            => 'float',
    ];

    public function sale(): BelongsTo {
        return $this->belongsTo(Sale::class);
    }

    public function payment_method(): BelongsTo {
        return $this->belongsTo(PaymentMethod::class);
    }
}
