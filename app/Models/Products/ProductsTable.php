<?php
namespace App\Models\Products;

use App\Models\AbstractSqlTable;
use App\Models\Products\Product;
use App\Models\Collection;

class ProductsTable extends AbstractSqlTable {
    public function __construct() {
        parent::__construct('products');
    }

    public function get() {
        $data = parent::get();
        $products = new Collection;
        foreach($data as $rawProduct) {
            $product = new Product();
            $product->exchangeArray($rawProduct);
            $products[] = $product;
        }


        return $products;
    }
}
