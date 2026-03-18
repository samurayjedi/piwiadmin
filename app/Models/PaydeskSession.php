<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\Paydesk;
use App\Models\PaydeskPartialCut;
use App\Models\Sale;
use App\Models\PaydeskSessionOpening;
use App\Models\PaydeskSessionClosure;
use App\Models\User;

class PaydeskSession extends Model {
    use HasFactory;

    protected $casts = [
        'open_at' => 'datetime',
        'close_at' => 'datetime',
    ];

    public function paydesk(): BelongsTo {
        return $this->belongsTo(Paydesk::class);
    }

    public function user(): BelongsTo {
        return $this->belongsTo(User::class);
    }

    public function cuts(): HasMany {
        return $this->hasMany(PaydeskPartialCut::class);
    }

    public function sales(): HasMany {
        return $this->hasMany(Sale::class);
    }

    public function need_to_be_closed() {
        return !now()->isSameDay($this->open_at) && now()->gt($this->open_at);
    }
    
    public function using_since_days() {
        $daysPassed = now()->startOfDay()->diffInDays($this->open_at->startOfDay());
        /** i don't know why it returns me negative values :/ */
        if ($daysPassed < 0) {
            $daysPassed *= -1;
        }

        return $daysPassed;
    }

    public function openings(): HasMany {
        return $this->hasMany(PaydeskSessionOpening::class);
    }

    public function closures(): HasMany {
        return $this->hasMany(PaydeskSessionClosure::class);
    }
}
