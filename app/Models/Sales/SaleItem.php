<?php

namespace App\Models\Sales;

use App\Models\AbstractModel;

class SaleItem extends AbstractModel
{
    public $sale_id, $product_id, $quantity, $unit_price;
    public $discount_id;

    public function __construct() {
        $this->table = 'sale_items';
    }

    public function toArray() {
        return [
            ...parent::toArray(),
            'sale_id' => $this->sale_id,
            'product_id' => $this->product_id,
            'quantity' => $this->quantity,
            'unit_price' => $this->unit_price,
            'discount_id' => $this->discount_id,
        ];
    }

    public function exchangeArray(mixed $piwi) {
        parent::exchangeArray($piwi);
        $this->sale_id = is_array($piwi) ? $piwi['sale_id'] : $piwi->sale_id;
        $this->product_id = is_array($piwi) ? $piwi['product_id'] : $piwi->product_id;
        $this->quantity = is_array($piwi) ? $piwi['quantity'] : $piwi->quantity;
        $this->unit_price = is_array($piwi) ? $piwi['unit_price'] : $piwi->unit_price;
        $this->discount_id = is_array($piwi) ? $piwi['discount_id'] : $piwi->discount_id;
    }
}
