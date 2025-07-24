<?php
namespace App\Models\Sales;

use App\Models\AbstractSqlTable;
use App\Models\Sales\SaleItem;
use App\Models\Collection;

class SaleItemTable extends AbstractSqlTable {
    public function __construct() {
        parent::__construct('sale_items');
    }

    public function get() {
        $data = parent::get();
        $items = new Collection;
        foreach($data as $rawSaleItem) {
            $item = new SaleItem();
            $item->exchangeArray($rawSaleItem);
            $items[] = $item;
        }


        return $items;
    }
}
