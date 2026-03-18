<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;
use App\Models\User;
use App\Models\Client;
use App\Models\SaleItem;
use App\Models\Payment;
use App\Modls\PaydeskSession;

class Sale extends Model
{
    use HasFactory;

    protected $casts = [
        'total_amount'          => 'float',
        'amount_paid'           => 'float',
    ];

    public function user(): BelongsTo {
        return $this->belongsTo(User::class);
    }

    public function client(): BelongsTo {
        return $this->belongsTo(Client::class);
    }

    public function sale_items(): HasMany {
        return $this->hasMany(SaleItem::class);
    }

    public function payments(): HasMany {
        return $this->hasMany(Payment::class);
    }

    public function getCreatedAtAttribute($value) {
        return Carbon::parse($value)->format('Y-m-d H:i:s');
    }

    public function session(): BelongsTo {
        return $this->belongsTo(PaydeskSession::class);
    }
}
