<?php
namespace App\Models\Sales;

use App\Models\AbstractSqlTable;
use App\Models\Sales\Sale;
use App\Models\Collection;

class SalesTable extends AbstractSqlTable {
    public function __construct() {
        parent::__construct('sales');
    }

    public function get() {
        $data = parent::get();
        $sales = new Collection;
        foreach($data as $rawSale) {
            $sale = new Sale();
            $sale->exchangeArray($rawSale);
            $sales[] = $sale;
        }


        return $sales;
    }
}
