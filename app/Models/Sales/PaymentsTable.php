<?php
namespace App\Models\Sales;

use App\Models\AbstractSqlTable;
use App\Models\Sales\PaymentItem;
use App\Models\Collection;

class PaymentsTable extends AbstractSqlTable {
    public function __construct() {
        parent::__construct('payments');
    }

    public function get() {
        $data = parent::get();
        $payments = new Collection;
        foreach($data as $rawPayment) {
            $payment = new PaymentItem();
            $payment->exchangeArray($rawPayment);
            $payments[] = $payment;
        }


        return $payments;
    }
}
