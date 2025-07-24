<?php
namespace App\Models\PaymentMethods;

use App\Models\AbstractSqlTable;
use App\Models\PaymentMethods\PaymentMethod;
use App\Models\Collection;

class PaymentMethodsTable extends AbstractSqlTable {
    public function __construct() {
        parent::__construct('payment_methods');
    }

    public function get() {
        $data = parent::get();
        $methods = new Collection;
        foreach($data as $rawMethod) {
            $paymentMethod = new PaymentMethod();
            $paymentMethod->exchangeArray($rawMethod);
            $methods[] = $paymentMethod;
        }

        return $methods;
    }
}
