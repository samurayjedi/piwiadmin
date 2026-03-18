<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\PaydeskPartialCut;
use App\Models\PaymentMethod;

class PaydeskPartialCutAmount extends Model {
    use HasFactory;

    protected $casts = [
        'amount' => 'float',
    ];


    protected $fillable = [
        'payment_method_id',
        'amount',
    ];

    public function cut(): BelongsTo {
        return $this->belongsTo(PaydeskPartialCut::class);
    }

    public function payment_method(): BelongsTo {
        return $this->belongsTo(PaymentMethod::class);
    }
}
