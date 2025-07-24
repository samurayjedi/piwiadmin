<?php

namespace App\Models\Clients;

use App\Models\AbstractModel;

class Client extends AbstractModel
{
    public $identification, $name, $phone, $address;

    public function __construct() {
        $this->table = 'clients';
    }

    public function toArray() {
        return [
            ...parent::toArray(),
            'identification' => $this->identification,
            'name' => $this->name,
            'phone' => $this->phone,
            'address' => $this->address,
        ];
    }

    public function exchangeArray(mixed $piwi) {
        parent::exchangeArray($piwi);
        $this->identification = is_array($piwi) ? $piwi['identification'] : $piwi->identification;
        $this->name = is_array($piwi) ? $piwi['name'] : $piwi->name;
        $this->phone = is_array($piwi) ? $piwi['phone'] : $piwi->phone;
        $this->address = is_array($piwi) ? $piwi['address'] : $piwi->address;
    }
}
