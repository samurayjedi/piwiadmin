<?php

namespace App\Models\PaymentMethods;

use App\Models\AbstractModel;

class PaymentMethod extends AbstractModel
{
    public $payment_label, $payment_slug, $payment_currency;

    public function __construct() {
        $this->table = 'payment_methods';
    }

    public function toArray() {
        return [
            ...parent::toArray(),
            'payment_label' => $this->payment_label,
            'payment_slug' => $this->payment_slug,
            'payment_currency' => $this->payment_currency,
        ];
    }

    public function exchangeArray(mixed $piwi) {
        parent::exchangeArray($piwi);
        $this->payment_label = is_array($piwi) ? $piwi['payment_label'] : $piwi->payment_label;
        $this->payment_slug = is_array($piwi) ? $piwi['payment_slug'] : $piwi->payment_slug;
        $this->payment_currency = is_array($piwi) ? $piwi['payment_currency'] : $piwi->payment_currency;
    }
}
