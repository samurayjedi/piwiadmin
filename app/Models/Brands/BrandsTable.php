<?php
namespace App\Models\Brands;

use App\Models\AbstractSqlTable;
use App\Models\Brands\Brand;
use App\Models\Collection;

class BrandsTable extends AbstractSqlTable {
    public function __construct() {
        parent::__construct('brands');
    }

    public function get() {
        $data = parent::get();
        $brands = new Collection;
        foreach($data as $rawBrand) {
            $brand = new Brand;
            $brand->exchangeArray($rawBrand);
            $brands[] = $brand;
        }


        return $brands;
    }
}
