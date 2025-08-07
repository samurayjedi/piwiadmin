<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Clients\Client;
use App\Models\Clients\ClientsTable;
use App\Http\Controllers\Pagination;

class ClientsController extends Controller {
    public function main(int $page = 0, int $rows = 5) {
        $table = new ClientsTable;
        $pager = Pagination::normalize('clients', $page, $rows, $table->count());
        if (!is_array($pager)) {
            // is a redirect
            return $pager;
        }
        [$limit, $offset, $count] = $pager;
        $clients = $table
          ->limit($limit)
          ->offset($offset)
          ->get();
          

        return Inertia::render('Clients', [
            'clients' => $clients->toArray(),
            'page' => $page,
            'count' => $count,
            'rows' => $rows,
        ]);
    }

    public function store(Request $request) {
        $request->validate([
            'identification' => 'required|string|min:8|unique:clients,identification',
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|min:11',
            'address' => 'nullable|string|max:255',
        ]);

        $client = new Client();
        $client->identification = $request->get('identification');
        $client->name = $request->get('name');
        $client->phone = $request->get('phone');
        $client->address = $request->get('address');
        $client->insert();
        
        return back();
    }

    public function update(Request $request, int $id) {
        $request->validate([
            'identification' => 'required|string|min:8|exists:clients,identification',
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|min:11',
            'address' => 'nullable|string|max:255',
        ]);

        $table = new ClientsTable;
        $clients = $table->where('id', '=', $id)->get();
        $client = $clients[0];
        $client->identification = $request->get('identification');
        $client->name = $request->get('name');
        $client->phone = $request->get('phone');
        $client->address = $request->get('address');
        $client->update();
        
        return back();
    }

    
    public function delete(int $id) {
        $table = new ClientsTable;
        $clients = $table->where('id', '=', $id)->get();
        $client = $clients[0];
        $client->delete();

        return back();
    }
}
