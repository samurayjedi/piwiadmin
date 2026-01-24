<?php
namespace App\Services;

class BusinessInfoService {
    public $name, $address, $rif;

    function __construct() {
        $company = @file_get_contents(public_path("storage/business.json"));
        if ($company) {
            $company = json_decode($company, true);
        }
        $this->name = is_array($company) && array_key_exists('name', $company) ? $company['name'] : config('app.name', 'Laravel');
        $this->rif = is_array($company) && array_key_exists('rif', $company) ? $company['rif'] : '';
        $this->address = is_array($company) && array_key_exists('address', $company) ? $company['address'] : '';
    }

    public function toArray() {
        return [
            'name' => $this->name,
            'rif' => $this->rif,
            'address' => $this->address,
        ];
    }

    public function update_info(array $info) {
        @file_put_contents(public_path("storage/business.json"), json_encode([
            'name' => $info['name'],
            'rif' => $info['rif'],
            'address' => $info['address'],
        ]));
    }
}