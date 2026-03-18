<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\Paydesk;
use App\Models\PaymentMethod;

class PaydeskPettyCashFund extends Model {
    use HasFactory;

    protected $casts = [
        'amount' => 'float',
    ];

    public function paydesk(): BelongsTo {
        return $this->belongsTo(Paydesk::class);
    }

    public function payment_method(): BelongsTo {
        return $this->belongsTo(PaymentMethod::class);
    }
}
