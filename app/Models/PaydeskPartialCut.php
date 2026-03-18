<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\PaydeskSession;
use App\Models\PaydeskPartialCutAmount;
use App\Models\User;

class PaydeskPartialCut extends Model
{
    use HasFactory;

    public function session(): BelongsTo {
        return $this->belongsTo(PaydeskSession::class, 'paydesk_session_id');
    }

    public function user(): BelongsTo {
        return $this->belongsTo(User::class);
    }

    public function amounts(): HasMany {
        return $this->hasMany(PaydeskPartialCutAmount::class);
    }
}
