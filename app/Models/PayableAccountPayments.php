<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;
use App\Models\PayableAccount;

class PayableAccountPayments extends Model
{
    use HasFactory;

    protected $casts = [
        'amount' => 'float',
    ];

    public function payable_account(): BelongsTo {
        return $this->belongsTo(PayableAccount::class);
    }

    public function getCreatedAtAttribute($value) {
        return Carbon::parse($value)->format('Y-m-d H:i:s');
    }
}
