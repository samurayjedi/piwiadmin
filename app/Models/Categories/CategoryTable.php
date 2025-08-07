<?php
namespace App\Models\Categories;

use App\Models\AbstractSqlTable;
use App\Models\Categories\Category;
use App\Models\Collection;

class CategoryTable extends AbstractSqlTable {
    public function __construct() {
        parent::__construct('categories');
    }

    public function get() {
        $data = parent::get();
        $categories = new Collection;
        foreach($data as $rawCategory) {
            $category = new Category;
            $category->exchangeArray($rawCategory);
            $categories[] = $category;
        }

        return $categories;
    }
}
