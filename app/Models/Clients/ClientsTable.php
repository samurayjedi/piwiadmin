<?php
namespace App\Models\Clients;

use App\Models\AbstractSqlTable;
use App\Models\Clients\Client;
use App\Models\Collection;

class ClientsTable extends AbstractSqlTable {
    public function __construct() {
        parent::__construct('clients');
    }

    public function get() {
        $data = parent::get();
        $clients = new Collection;
        foreach($data as $rawClient) {
            $client = new Client();
            $client->exchangeArray($rawClient);
            $clients[] = $client;
        }


        return $clients;
    }
}
