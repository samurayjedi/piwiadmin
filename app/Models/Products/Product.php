<?php

namespace App\Models\Products;

use App\Models\AbstractModel;

class Product extends AbstractModel
{
    public $barcode, $name, $price, $profit, $stock;
    public $measurement, $category, $brand, $wholesale;
    public $wholesale_qty, $wholesale_profit;

    public function __construct() {
        $this->table = 'products';
    }

    public function toArray() {
        return [
            ...parent::toArray(),
            'barcode' => $this->barcode,
            'name' => $this->name,
            'price' => (float)$this->price,
            'profit' => (float)$this->profit,
            'measurement' => $this->measurement,
            'stock' => (float)$this->stock,
            'category' => $this->category,
            'brand' => $this->brand,
            'wholesale' => $this->wholesale,
            'wholesale_qty' => (float)$this->wholesale_qty,
            'wholesale_profit' => (float)$this->wholesale_profit,
        ];
    }

    public function exchangeArray(mixed $piwi) {
        parent::exchangeArray($piwi);
        $this->barcode = is_array($piwi) ? $piwi['barcode'] : $piwi->barcode;
        $this->name = is_array($piwi) ? $piwi['name'] : $piwi->name;
        $this->price = is_array($piwi) ? $piwi['price'] : $piwi->price;
        $this->profit = is_array($piwi) ? $piwi['profit'] : $piwi->profit;
        $this->measurement = is_array($piwi) ? $piwi['measurement'] : $piwi->measurement;
        $this->stock = is_array($piwi) ? $piwi['stock'] : $piwi->stock;
        $this->category = is_array($piwi) ? $piwi['category'] : $piwi->category;
        $this->brand = is_array($piwi) ? $piwi['brand'] : $piwi->brand;
        $this->wholesale = is_array($piwi) ? $piwi['wholesale'] : $piwi->wholesale;
        $this->wholesale_qty = is_array($piwi) ? $piwi['wholesale_qty'] : $piwi->wholesale_qty;
        $this->wholesale_profit = is_array($piwi) ? $piwi['wholesale_profit'] : $piwi->wholesale_profit;
    }
}
