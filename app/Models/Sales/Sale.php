<?php

namespace App\Models\Sales;

use App\Models\AbstractModel;

class Sale extends AbstractModel
{
    public $user_id, $client_id, $payment_type;
    public $total_amount, $amount_paid, $status;
    public $due_date, $notification_interval, $notes;

    public function __construct() {
        $this->table = 'sales';
    }

    public function toArray() {
        return [
            ...parent::toArray(),
            'user_id' => (int)$this->user_id,
            'client_id' => (int)$this->client_id,
            'payment_type' => $this->payment_type,
            'total_amount' => (float)$this->total_amount,
            'amount_paid' => (float)$this->amount_paid,
            'status' => $this->status,
            'due_date' => $this->due_date,
            'notification_interval' => $this->notification_interval,
            'notes' => $this->notes,
        ];
    }

    public function exchangeArray(mixed $piwi) {
        parent::exchangeArray($piwi);
        $this->user_id = is_array($piwi) ? $piwi['user_id'] : $piwi->user_id;
        $this->client_id = is_array($piwi) ? $piwi['client_id'] : $piwi->client_id;
        $this->payment_type = is_array($piwi) ? $piwi['payment_type'] : $piwi->payment_type;
        $this->total_amount = is_array($piwi) ? $piwi['total_amount'] : $piwi->total_amount;
        $this->amount_paid = is_array($piwi) ? $piwi['amount_paid'] : $piwi->amount_paid;
        $this->status = is_array($piwi) ? $piwi['status'] : $piwi->status;
        $this->due_date = is_array($piwi) ? $piwi['due_date'] : $piwi->due_date;
        $this->notification_interval = is_array($piwi) ? $piwi['notification_interval'] : $piwi->notification_interval;
        $this->notes = is_array($piwi) ? $piwi['notes'] : $piwi->notes;
    }
}
