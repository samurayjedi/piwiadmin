<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\Payment;
use App\Models\PaydeskSessionOpening;
use App\Models\PaydeskSessionClosure;
use App\Models\PaydeskPettyCashFund;
use App\Models\PaydeskPartialCutAmount;

class PaymentMethod extends Model {
    use HasFactory, SoftDeletes;

    public function payments(): HasMany {
        return $this->hasMany(Payment::class);
    }

    public function paydesk_openings(): HasMany {
        return $this->hasMany(PaydeskSessionOpening::class);
    }

    public function paydesk_closures(): HasMany {
        return $this->hasMany(PaydeskSessionClosure::class);
    }

    public function paydesk_petty_cash_funds(): HasMany {
        return $this->hasMany(PaydeskPettyCashFund::class);
    }

    public function partial_cuts(): HasMany {
        return $this->hasMany(PaydeskPartialCutAmount::class);
    }
}
