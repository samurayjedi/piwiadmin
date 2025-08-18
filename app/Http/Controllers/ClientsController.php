<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Client;
use App\Http\Controllers\Pagination;

class ClientsController extends Controller {
    public function main(int $page = 0, int $rows = 5) {
        $pager = Pagination::normalize('clients', $page, $rows, Client::count());
        if (!is_array($pager)) {
            // is a redirect
            return $pager;
        }
        [$limit, $offset, $count] = $pager;
        $clients = Client::orderBy('id', 'DESC')
          ->skip($offset)
          ->take($limit)
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

        $client = new Client;
        $client->identification = $request->get('identification');
        $client->name = $request->get('name');
        $client->phone = $request->get('phone');
        $client->address = $request->get('address');
        $client->save();
        
        return back();
    }

    public function update(Request $request, int $id) {
        $request->validate([
            'identification' => 'required|string|min:8',
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|min:11',
            'address' => 'nullable|string|max:255',
        ]);

        $client = Client::findOrFail($id);
        $client->identification = $request->get('identification');
        $client->name = $request->get('name');
        $client->phone = $request->get('phone');
        $client->address = $request->get('address');
        $client->save();
        
        return back();
    }

    
    public function delete(int $id) {
        $client = Client::findOrFail($id);
        $client->delete();

        return back();
    }
}
