<?php

namespace App\Models\Products;

use App\Models\AbstractModel;

class Product extends AbstractModel
{
    public $barcode, $name, $price, $sale_price, $stock;
    public $tax, $category, $brand, $wholesale;
    public $wholesale_qty, $wholesale_price;

    public function __construct() {
        $this->table = 'products';
    }

    public function toArray() {
        return [
            ...parent::toArray(),
            'barcode' => $this->barcode,
            'name' => $this->name,
            'price' => $this->price,
            'sale_price' => $this->sale_price,
            'tax' => $this->tax,
            'stock' => $this->stock,
            'category' => $this->category,
            'brand' => $this->brand,
            'wholesale' => $this->wholesale,
            'wholesale_qty' => $this->wholesale_qty,
            'wholesale_price' => $this->wholesale_price,
        ];
    }

    public function exchangeArray(mixed $piwi) {
        parent::exchangeArray($piwi);
        $this->barcode = is_array($piwi) ? $piwi['barcode'] : $piwi->barcode;
        $this->name = is_array($piwi) ? $piwi['name'] : $piwi->name;
        $this->price = is_array($piwi) ? $piwi['price'] : $piwi->price;
        $this->sale_price = is_array($piwi) ? $piwi['sale_price'] : $piwi->sale_price;
        $this->tax = is_array($piwi) ? $piwi['tax'] : $piwi->tax;
        $this->stock = is_array($piwi) ? $piwi['stock'] : $piwi->stock;
        $this->category = is_array($piwi) ? $piwi['category'] : $piwi->category;
        $this->brand = is_array($piwi) ? $piwi['brand'] : $piwi->brand;
        $this->wholesale = is_array($piwi) ? $piwi['wholesale'] : $piwi->wholesale;
        $this->wholesale_qty = is_array($piwi) ? $piwi['wholesale_qty'] : $piwi->wholesale_qty;
        $this->wholesale_price = is_array($piwi) ? $piwi['wholesale_price'] : $piwi->wholesale_price;
    }
}
