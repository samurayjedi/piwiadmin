<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use App\Http\Controllers\Pagination;
use App\Models\Products\ProductsTable;
use App\Models\PaymentMethods\PaymentMethodsTable;
use App\Models\Clients\ClientsTable;
use App\Models\Sales\Sale;
use App\Models\Sales\SalesTable;
use App\Models\Sales\SaleItem;
use App\Models\Sales\Payment;

class SalesController extends Controller {
    private function paymentMethods() {
        $table = new PaymentMethodsTable;
        $paymentMethods = $table->get();

        return $paymentMethods->toArray();
    }

    public function main() {
        $page = intval(request()->get('page', 0));
        $rows = intval(request()->get('rows', 5));
        $table = new SalesTable;
        $pager = Pagination::normalize('sales', $page, $rows, $table->count());
        if (!is_array($pager)) {
            // is a redirect
            return $pager;
        }
        [$limit, $offset, $count] = $pager;
        /** ... */
        $sales = $table
            ->limit($limit)
            ->offset($offset)
            ->orderBy('id', 'DESC')
            ->get();
        $salesArray = $sales->toArray();
        foreach ($sales as $i => $sale) {
            /** client */
            $clientsTable = new ClientsTable;
            $clients = $clientsTable
                ->where('id', '=', $sale->client_id)
                ->get();
            $client = $clients[0];
            if (!$client) {
                throw new \Exception('Client id '.$sale->client_id.' not found!!!.');
            }
            $salesArray[$i]['client'] = $client->toArray();
            /** user */
            $usersTable = DB::table('users');
            $usersTable->where('id', '=', $sale->user_id);
            $users = $usersTable->get();
            $user = $users[0];
            if (!$user) {
                throw new \Exception('User id '.$sale->user_id.' not found!!!');
            }
            $salesArray[$i]['user']['id'] = $user->id;
            $salesArray[$i]['user']['name'] = $user->name;
            $salesArray[$i]['user']['email'] = $user->email;
            /** items */
            $salesItemsTable = DB::table('sale_items');
            $saleItems = $salesItemsTable->where('sale_id', '=', $sale->id)->get();
            if (!$saleItems->count()) {
                throw new \Exception('Sale id '.$sale->id.' has\'nt items!!!!');
            }
            $saleItemsArray = $saleItems
                ->map(function ($item) {
                    return (array) $item;
                })
                ->toArray();
            foreach ($saleItems as $j => $saleItem) {
                // product query
                $productsTable = DB::table('products');
                $products = $productsTable->where('id', '=', $saleItem->product_id)->get();
                if (!$products->count()) {
                    throw new \Exception('Product id '.$saleItem->product_id.' not found!!!');
                }
                $saleItemsArray[$j]['product'] = $products
                    ->map(function ($item) {
                        return (array) $item;
                    })
                    ->toArray()[0];
            }
            $salesArray[$i]['sale_items'] = $saleItemsArray;
        }

        return Inertia::render('Sales', [
            'sales' => $salesArray,
            'page' => $page,
            'count' => $count,
            'rows' => $rows,
        ]);
    }

    public function new_sale() {
        return Inertia::render('Sales/NewSale', [
            'payment_methods' => $this->paymentMethods(),
        ]);
    }

    public function blackhole(Request $request) {
        $action = $request->get('action', null);
        switch ($action) {
            case 'search_product':
                $validations = [
                    'barcode' => [ 'barcode' => 'required|numeric' ],
                    'name' => [ 'name' => 'required|string|max:255' ],
                ];
                $field = $request->get('field', '');
                if (!array_key_exists($field, $validations)) {
                    throw new \Exception('Invalid search field!!!!!');
                }

                $request->validate($validations[$field]);
                $value = $request->get($field);
                $table = new ProductsTable;
                $products = $table
                    ->where($field, 'LIKE', '%'.$value.'%')
                    ->get();
                if (!$products->count()) {
                    return back()->withErrors([
                        $field => 'No products found!!',
                    ]);
                }
                    
                return Inertia::render('Sales/NewSale', [
                    'products' => $products->toArray(),
                    'payment_methods' => $this->paymentMethods(),
                ]);
            case 'search_client':
                $table = new ClientsTable;
                $request->validate([
                    'identification' => 'required|string|min:8',
                ]);
                $clients = $table
                    ->where('identification', '=', $request->get('identification'))
                    ->get();

                if (!$clients->count()) {
                    return back()->withErrors([
                        'identification_not_found' => true,
                        'identification' => 'Client not found, register it.',
                        
                    ]);
                }

                return Inertia::render('Sales/NewSale', [
                    'client' => $clients[0],
                    'payment_methods' => $this->paymentMethods(),
                ]);
        }

        return back();
    }

    public function register_new_sale() {
        $rules = [
            /** Products to purchase */
            'id' => 'required|array',
            'id.*' => 'required|integer|exists:products,id',
            'sale_price' => 'required|array',
            'sale_price.*' => 'required|numeric|min:0',
            // the amount I'm going to buy
            'qty' => 'required|array',
            'qty.*' => 'required|numeric|min:1',
            /** client data */
            'identification' => 'required|string|min:8|exists:clients,identification',
            /** Payment */
            'payment_type' => 'required|string|in:cash,credit,layaway',
            'quotas' => 'required_if:payment_type,credit|string|max:10',
            'payment_interval' => 'required_if:payment_type,credit|string|in:weekly,fortnightly,monthly,bimonthly,quarterly,biannual,yearly',
            'due_date' => [
                'required_if:payment_type,credit',
                'required_if:payment_type,layaway',
                'date',
            ],
            'payment_methods' => 'required|array',
            'payment_methods.*' => 'required|string|exists:payment_methods,payment_slug',
            /** taxes & total */
            'taxes' => 'required|numeric|min:0',
            'total' => 'required|numeric|min:0',
            /** */
            'notes' => 'nullable|string',
        ];
        $paymentMethods = request()->get('payment_methods');
        if (!is_array($paymentMethods)) {
            return back()->withErrors(['payment_methods' => 'You must select at least one payment method.']);
        }
        foreach ($paymentMethods as $paymentMethod) {
            $rules[$paymentMethod] = 'required|numeric|min:0';
        }
        request()->validate($rules);
        $cart = [
            'id' => request()->get('id'),
            'sale_price' =>  request()->get('sale_price'),
            'qty' =>  request()->get('qty'),
        ];
        $clientIdentification = request()->get('identification');
        $payment = [
            'payment_type' => request()->get('payment_type'),
            'quotas' => request()->get('quotas'),
            'payment_interval' => request()->get('payment_interval'),
            'due_date' => request()->get('due_date'),
        ];
        $ammountPaid = 0; $total = floatval(request()->get('total'));
        foreach ($paymentMethods as $payMethod) {
            $paymentAmount = request()->get($payMethod);
            $payment[$payMethod] = $paymentAmount;
            $ammountPaid += floatval($paymentAmount);
        }
        /** validate the ammount payed */
        $fn = function (string $msg) use($paymentMethods) {
            $errors = [];
            foreach ($paymentMethods as $payMethod) {
                $errors[$payMethod] = $msg;
            }

            return $errors;
        };
        if ($ammountPaid <= 0) {
            return back()->withErrors($fn('The payment cannot be 0!!!'));
        } else if ($payment['payment_type'] !== 'cash' && $ammountPaid > $total) {
            return back()->withErrors($fn("In ".$payment['payment_type']." sales, the amount paid cannot be > to the total"));
        }
        /** Init register */
        try {
            DB::beginTransaction();
            // the sale
            $userId = Auth::user()->id;
            $clientTable = new ClientsTable;
            $clients = $clientTable->where('identification', '=', $clientIdentification)->get();
            $client = $clients[0];
            if (!$client) {
                throw new \RuntimeException("The identification not exists!!");
            }
            $sale = new Sale;
            $sale->user_id = $userId;
            $sale->client_id = $client->id;
            $sale->payment_type = $payment['payment_type'];
            $sale->tax_amount = request()->get('taxes');
            $sale->total_amount = $total;
            $sale->amount_paid = $ammountPaid;
            $sale->status = $payment['payment_type'] === 'cash' ? 'completed' : 'pending';
            $sale->due_date = $payment['due_date'];
            $sale->quotas = $payment['quotas'];
            $sale->payment_interval = $payment['payment_interval'];
            $sale->notes = request()->get('notes');
            $sale->insert();
            // the sale product items
            foreach ($cart['id'] as $i => $productId) {
                $qty = $cart['qty'][$i];
                $price = $cart['sale_price'][$i];
                $saleItem = new SaleItem;
                $saleItem->sale_id = $sale->id;
                $saleItem->product_id = $productId;
                $saleItem->quantity = $qty;
                $saleItem->unit_price = $price;
                $saleItem->discount_id = null;
                $saleItem->insert();
            }
            // register the payments
            foreach ($paymentMethods as $payMethod) {
                $paymentMethodTable = new PaymentMethodsTable;
                $paymentMethodRecord = $paymentMethodTable
                    ->where('payment_slug', '=', $payMethod)
                    ->get();
                $paymentMethodRecord = $paymentMethodRecord[0];
                if (!$paymentMethodRecord) {
                    throw new \RuntimeException("$payMethod not registered!!");
                }
                $pay = new Payment;
                $pay->sale_id = $sale->id;
                $pay->amount = $payment[$payMethod];
                $pay->payment_date = date('Y-m-d');
                $pay->payment_method_id = $paymentMethodRecord->id;
                $pay->notes = null;
                $pay->insert();
            }
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();

            return back()->withErrors([
                'kernel_panic' => $e->getMessage(),
            ]);
        }

        return redirect()->route('sales');
    }
}
