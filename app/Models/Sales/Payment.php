<?php

namespace App\Models\Sales;

use App\Models\AbstractModel;

class Payment extends AbstractModel
{
    public $sale_id, $amount, $payment_date, $payment_method_id;
    public $notes;

    public function __construct() {
        $this->table = 'payments';
    }

    public function toArray() {
        return [
            ...parent::toArray(),
            'sale_id' => $this->sale_id,
            'amount' => $this->amount,
            'payment_date' => $this->payment_date,
            'payment_method_id' => $this->payment_method_id,
            'notes' => $this->notes,
        ];
    }

    public function exchangeArray(mixed $piwi) {
        parent::exchangeArray($piwi);
        $this->sale_id = is_array($piwi) ? $piwi['sale_id'] : $piwi->sale_id;
        $this->amount = is_array($piwi) ? $piwi['amount'] : $piwi->amount;
        $this->payment_date = is_array($piwi) ? $piwi['payment_date'] : $piwi->payment_date;
        $this->payment_method_id = is_array($piwi) ? $piwi['payment_method_id'] : $piwi->payment_method_id;
        $this->notes = is_array($piwi) ? $piwi['notes'] : $piwi->notes;
    }
}
