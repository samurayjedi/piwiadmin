<?php

namespace App\Models\Categories;

use App\Models\AbstractModel;

class Category extends AbstractModel
{
    public $category_label, $category_slug;

    public function __construct() {
        $this->table = 'categories';
    }

    public function toArray() {
        return [
            ...parent::toArray(),
            'category_label' => $this->category_label,
            'category_slug' => $this->category_slug,
        ];
    }

    public function exchangeArray(mixed $piwi) {
        parent::exchangeArray($piwi);
        $this->category_label = is_array($piwi) ? $piwi['category_label'] : $piwi->category_label;
        $this->category_slug = is_array($piwi) ? $piwi['category_slug'] : $piwi->category_slug;
    }
}
