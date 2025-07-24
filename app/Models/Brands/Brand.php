<?php

namespace App\Models\Brands;

use App\Models\AbstractModel;

class Brand extends AbstractModel
{
    public $brand_label, $brand_slug;

    public function __construct() {
        $this->table = 'brands';
    }

    public function toArray() {
        return [
            ...parent::toArray(),
            'brand_label' => $this->brand_label,
            'brand_slug' => $this->brand_slug,
        ];
    }

    public function exchangeArray(mixed $piwi) {
        parent::exchangeArray($piwi);
        $this->brand_label = is_array($piwi) ? $piwi['brand_label'] : $piwi->brand_label;
        $this->brand_slug = is_array($piwi) ? $piwi['brand_slug'] : $piwi->brand_slug;
    }
}
