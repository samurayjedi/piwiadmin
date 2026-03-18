<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\PaydeskSession;
use App\Models\PaydeskPettyCashFund;

class Paydesk extends Model
{
    use HasFactory;

    public function sessions(): HasMany {
        return $this->hasMany(PaydeskSession::class);
    }

    public function petty_cash_funds(): HasMany {
        return $this->hasMany(PaydeskPettyCashFund::class);
    }
}
