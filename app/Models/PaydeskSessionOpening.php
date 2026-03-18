<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\PaymentMethod;
use App\Models\PaydeskSession;

class PaydeskSessionOpening extends Model {
    use HasFactory;

    protected $casts = [
        'amount'          => 'float',
    ];

    protected $fillable = [
        'payment_method_id',
        'amount',
    ];

    public function paydesk_session(): BelongsTo {
        return $this->belongsTo(PaydeskSession::class);
    }

    public function payment_method(): BelongsTo {
        return $this->belongsTo(PaymentMethod::class);
    }
}
