<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Carbon\Carbon;
use App\Models\StockLog;
use App\Models\PayableAccountPayments;
use App\Models\PayableAccountItem;

class PayableAccount extends Model
{
    use HasFactory;

    protected $fillable = [
        'description',
        'type',
        'total_amount',
        'amount_paid',
        'due_date',
        'notification_interval',
        'status',
        'stock_log_id',
    ];

    protected $casts = [
        'total_amount' => 'float',
        'amount_paid' => 'float',
    ];

    public function stock_log(): BelongsTo {
        return $this->belongsTo(StockLog::class);
    }

    public function payments(): HasMany {
        return $this->hasMany(PayableAccountPayments::class);
    }

    public function items(): HasMany {
        return $this->hasMany(PayableAccountItem::class);
    }

    public function getCreatedAtAttribute($value) {
        return Carbon::parse($value)->format('Y-m-d H:i:s');
    }
}
