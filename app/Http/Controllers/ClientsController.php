<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Models\Client;
use App\ApiUtils;
use App\Http\Controllers\Pagination;

class ClientsController extends Controller {
    public function main(int $page = 0, int $rows = 5) {
        $inDebt = request()->get('in_debt', 0);
        $ids = request()->get('ids', null);
        $clients = Client::orderBy('id', 'DESC')
            ->with([
                'sales',
                'sales.sale_items',
                'sales.sale_items.product' => fn ($query) => $query->withTrashed(),
                'sales.sale_items.product.brand',
                'sales.sale_items.product.category'
            ])
            ->when($inDebt == 1, function($query) {
                $query->whereHas('sales', function($query) {
                    $query->where('status', 'pending');
                });
            })
            ->when(!empty($ids), function ($query) use ($ids) {
                $query->whereIn('id', $ids);
            });
        // pagination
        $pager = Pagination::normalize('clients', $page, $rows, $clients->count());
        if (!is_array($pager)) {
            // is a redirect
            return $pager;
        }
        [$limit, $offset, $count] = $pager;
        // records
        $clients = $clients
            ->skip($offset)
            ->take($limit)
            ->get();
          

        return Inertia::render('Clients', [
            'clients' => $clients->toArray(),
            'in_debt' => intval($inDebt),
            'page' => $page,
            'count' => $count,
            'rows' => $rows,
            'ids' => $ids,
        ]);
    }

    public function store(Request $request) {
        $request->validate([
            'identification' => 'required|string|min:8',
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|min:11',
            'address' => 'nullable|string|max:255',
        ]);
        $identification = $request->get('identification');

        $validator = Validator::make(request()->all(),[
            'identification' => 'unique:clients,identification',
        ]);
        if ($validator->fails()) {
            $client = Client::withTrashed()
                ->where('identification', $identification)
                ->first();
            if ($client->trashed()) {
                $client->restore();
                $client->name = $request->get('name');
                $client->phone = $request->get('phone');
                $client->address = $request->get('address');
                $client->save();

                return back();
            } else {
                return redirect()->back()->withErrors($validator)->withInput();
            }
        }

        $client = new Client;
        $client->identification = $identification;
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

    /** API */

    public function search_clients_by_name(string $name) {
        return $this->search_clients('name', $name);
    }

    public function search_clients_by_iden(string $identification) {
        return $this->search_clients('identification', $identification);
    }

    public function search_clients(string $field, string $value) {
        $rules = [
            'name' => [ 'name' => 'required|string|max:255' ],
            'identification' => [ 'identification' => 'required|string|min:8' ],
        ];
        if ($err=ApiUtils::validate($rules[$field], [$field => $value])) {
            return $err;
        }

        /** clients */
        $clients = Client::where($field, 'LIKE', "%$value%");
        if (!$clients->count()) {
            return response()->json([
                'status' => 0,
                'errors' => [$field => __('No clients found.')],
            ]);
        }

        return response()->json([
            'status' => 1,
            'clients' => $clients->get()->toArray(),
        ]);
    }

    // This isn't being used, likely delete it in the future

    public function search_client(string $identification) {
        $rules = ['identification' => 'required|string|min:8'];
        if ($err=ApiUtils::validate($rules, ['identification' => $identification])) {
            return $err;
        }
        $rules = ['identification' => 'exists:clients,identification'];
        $validator = Validator::make(['identification' => $identification], $rules);
        if ($validation->fails()) {
            return response()->json([
                'status' => -1,
                'errors' => $validation->errors(),
            ]);
        }
        $client = Client::where('identification', $identification)->firstOrFail();

        return response()->json([
            'status' => 1,
            'client' => $client->toArray(),
        ]);
    }
}
