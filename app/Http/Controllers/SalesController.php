<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Dompdf\Dompdf;
use App\Http\Controllers\Pagination;
use App\Models\Products\ProductsTable;
use App\Models\Sales\SaleItemTable;
use App\Models\PaymentMethods\PaymentMethodsTable;
use App\Models\Clients\ClientsTable;
use App\Models\Sales\Sale;
use App\Models\Sales\SalesTable;
use App\Models\Sales\SaleItem;
use App\Models\Sales\Payment;
use App\Models\Sales\PaymentsTable;
use App\DolarScrapper;
use App\Models\Brands\BrandsTable;
use App\Models\Categories\CategoryTable;

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
            $salesItemsTable = new SaleItemTable;
            $saleItems = $salesItemsTable->where('sale_id', '=', $sale->id)->get();
            if (!$saleItems->count()) {
                throw new \Exception('Sale id '.$sale->id.' has\'nt items!!!!');
            }
            $saleItemsArray = $saleItems->toArray();
            foreach ($saleItems as $j => $saleItem) {
                // product query
                $productsTable = new ProductsTable;
                $products = $productsTable->where('id', '=', $saleItem->product_id)->get();
                if (!$products->count()) {
                    throw new \Exception('Product id '.$saleItem->product_id.' not found!!!');
                }
                $product = $products[0];
                $saleItemsArray[$j]['product'] = $product->toArray();
                // product category query
                $tCategory = new CategoryTable;
                $categories = $tCategory->where('category_slug', '=', $product->category)->get();
                if (!$categories->count()) {
                    throw new \Exception('Cannot find category '.$product->category);
                }
                $saleItemsArray[$j]['product']['category'] = $categories[0]->toArray();
                // product brand query
                $tBrands = new BrandsTable;
                $brands = $tBrands->where('brand_slug', '=', $product->brand)->get();
                if (!$brands->count()) {
                    throw new \Exception('Cannot find brand '.$product->brand);
                }
                $saleItemsArray[$j]['product']['brand'] = $brands[0]->toArray();
            }
            $salesArray[$i]['sale_items'] = $saleItemsArray;
            /** payments made */
            $paymentsTable = new PaymentsTable;
            $payments = $paymentsTable->where('sale_id', '=', $sale->id)->get();
            $salesArray[$i]['payments'] = array_map(function($pay) {
                $payMethodsTable = new PaymentMethodsTable;
                $payMethod = $payMethodsTable->where('id', '=', $pay['payment_method_id'])->get()[0];

                return [
                    ...$pay,
                    'payment_method' => $payMethod->toArray(),
                ];
            }, $payments->toArray());
        }

        return Inertia::render('Sales', [
            'sales' => $salesArray,
            'payment_methods' => $this->paymentMethods(),
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
                $arr = $products->toArray();
                foreach ($products as $i => $product) {
                    // product category query
                    $tCategory = new CategoryTable;
                    $categories = $tCategory->where('category_slug', '=', $product->category)->get();
                    if (!$categories->count()) {
                        throw new \Exception('Cannot find category '.$product->category);
                    }
                    $arr[$i]['category'] = $categories[0]->toArray();
                    // product brand query
                    $tBrands = new BrandsTable;
                    $brands = $tBrands->where('brand_slug', '=', $product->brand)->get();
                    if (!$brands->count()) {
                        throw new \Exception('Cannot find brand '.$product->brand);
                    }
                    $arr[$i]['brand'] = $brands[0]->toArray();
                }
                    
                return Inertia::render('Sales/NewSale', [
                    'products' => $arr,
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
            'price' => 'required|array',
            'price.*' => 'required|numeric|min:0',
            // the amount I'm going to buy
            'qty' => 'required|array',
            'qty.*' => 'required|numeric|min:0.01',
            /** client data */
            'identification' => 'required|string|min:8|exists:clients,identification',
            /** Payment */
            'payment_type' => 'required|string|in:cash,credit,layaway',
            'notification_interval' => [
                'required_if:payment_type,credit',
                'required_if:payment_type,layaway',
                'string',
                'in:daily,weekly,fortnightly,monthly,bimonthly,quarterly,biannual,yearly',
            ],
            'due_date' => [
                'required_if:payment_type,credit',
                'required_if:payment_type,layaway',
                'date',
            ],
            'payment_methods' => [
                'required_if:payment_type,cash',
                'required_if:payment_type,layaway',
                'array',
                'min:1',
            ],
            'payment_methods.*' => 'required|string|exists:payment_methods,payment_slug',
            /** */
            'notes' => 'nullable|string',
        ];
        $paymentMethods = request()->get('payment_methods', []); // default [] because in credit sales can be null
        foreach ($paymentMethods as $paymentMethod) {
            if (request()->get('payment_type') === 'credit') {
                $rules[$paymentMethod] = 'numeric|min:0';
            } else {
                $rules[$paymentMethod] = [
                    'required_if:payment_type,cash',
                    'required_if:payment_type,layaway',
                    'numeric',
                    'min:0.01',
                ];
            }
        }
        request()->validate($rules);
        $cart = [
            'id' => request()->get('id'),
            'price' =>  request()->get('price'),
            'profit' => request()->get('profit'),
            'wholesale' => request()->get('wholesale'),
            'wholesale_qty' => request()->get('wholesale_qty'),
            'wholesale_profit' => request()->get('wholesale_profit'),
            'qty' =>  request()->get('qty'),
        ];
        $clientIdentification = request()->get('identification');
        $payment = [
            'payment_type' => request()->get('payment_type'),
            'notification_interval' => request()->get('notification_interval'),
            'due_date' => request()->get('due_date'),
        ];
        $getPrice = function($price, $profit, $qty, $wholesale, $wholesale_profit, $wholesale_qty) {
            $salePrice = ($price * $profit) / 100;
            $wholesaleSalePrice = ($price * $wholesale_profit) / 100;
            $isWholesaleSale = $wholesale && $qty >= $wholesale_qty;

            return $isWholesaleSale ? $price + $wholesaleSalePrice : $price + $salePrice;
        };
        $total = 0; 
        foreach ($cart['id'] as $i => $id) {
            $price = floatval($cart['price'][$i]);
            $profit = floatval($cart['profit'][$i]);
            $wholesale = (bool)$cart['wholesale'][$i];
            $wholesale_qty = floatval($cart['wholesale_qty'][$i]);
            $wholesale_profit = floatval($cart['wholesale_profit'][$i]);
            $qty = floatval($cart['qty'][$i]);

            $total += $getPrice($price, $profit, $qty, $wholesale, $wholesale_profit, $wholesale_qty) * $qty;
        }
        $total = round($total, 2);
        $ammountPaid = 0;
        foreach ($paymentMethods as $payMethod) {
            $paymentAmount = floatval(request()->get($payMethod, 0)); // default 0, because in credit sales, payment_method can be undefined
            $payment[$payMethod] = $paymentAmount;
            $ammountPaid += $paymentAmount;
        }
        $ammountPaid = round($ammountPaid, 2);
        // if the user add payment methods in credit sales, but all of them are $0.... as its no necesary pay any amount in that type of sale....
        // if the case occurs, remove all items from payment_methods for no register any payment in the database
        if ($payment['payment_type'] === 'credit' && $ammountPaid == 0) {
            $paymentMethods = [];
        }
        /** validate the ammount payed */
        $fn = function (string $msg) use($paymentMethods) {
            $errors = [];
            foreach ($paymentMethods as $payMethod) {
                $errors[$payMethod] = $msg;
            }

            return $errors;
        };
        if ($payment['payment_type'] !== 'cash' && $ammountPaid >= $total) {
            return back()->withErrors($fn("In ".$payment['payment_type']." sales, the amount paid cannot be >= to the total"));
        } else if ($payment['payment_type'] === 'cash' && $ammountPaid < $total) {
            return back()->withErrors($fn("In cash sales, you must pay the totality."));
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
            $sale->total_amount = $total;
            $sale->amount_paid = $ammountPaid;
            $sale->status = $payment['payment_type'] === 'cash' ? 'completed' : 'pending';
            $sale->due_date = $payment['due_date'];
            $sale->notification_interval = $payment['notification_interval'];
            $sale->notes = request()->get('notes');
            $sale->insert();
            // the sale product items
            foreach ($cart['id'] as $i => $productId) {
                $saleItem = new SaleItem;
                $saleItem->sale_id = $sale->id;
                $saleItem->product_id = $productId;
                $saleItem->quantity = $cart['qty'][$i];
                $saleItem->unit_price = $getPrice(
                    $cart['price'][$i],
                    $cart['profit'][$i],
                    $cart['qty'][$i],
                    $cart['wholesale'][$i],
                    $cart['wholesale_profit'][$i],
                    $cart['wholesale_qty'][$i],
                );
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

    public function pay() {
        $rules = [
            'sale_id' => 'required|exists:sales,id',
            'payment_methods' => 'required|array',
            'payment_methods.*' => 'required|string|exists:payment_methods,payment_slug',
            /** */
            'notes' => 'nullable|string',
        ];
        $paymentMethods = request()->get('payment_methods');
        if (!is_array($paymentMethods)) { // above are the validation that ensure this field is array and required, but i dont known, when undefined, that not works :/
            return back()->withErrors(['payment_methods' => 'You must select at least one payment method.']);
        }
        foreach ($paymentMethods as $paymentMethod) {
            $rules[$paymentMethod] = 'required|numeric|min:0.01';
        }
        request()->validate($rules);
        $saleId = request()->get('sale_id');
        $ammountPaid = 0;
        foreach ($paymentMethods as $payMethod) {
            $paymentMethodTable = new PaymentMethodsTable;
            $paymentMethodRecord = $paymentMethodTable
                ->where('payment_slug', '=', $payMethod)
                ->get();
            $paymentMethodRecord = $paymentMethodRecord[0];
            if (!$paymentMethodRecord) {
                throw new \RuntimeException("$payMethod not registered!!");
            }
            $paymentAmount = floatval(request()->get($payMethod));
            $pay = new Payment;
            $pay->sale_id = $saleId;
            $pay->amount = $paymentAmount;
            $pay->payment_date = date('Y-m-d');
            $pay->payment_method_id = $paymentMethodRecord->id;
            $pay->notes = request()->get('notes', null);
            $pay->insert();
            $ammountPaid += $paymentAmount;
        }
        $saleTable = new SalesTable;
        $sales = $saleTable->where('id', '=', $saleId)->get();
        $sale = $sales[0];
        $sale->amount_paid = min($sale->total_amount, $sale->amount_paid + $ammountPaid);
        if ($sale->amount_paid == $sale->total_amount) {
            $sale->status = 'completed';
        }
        $sale->update();
        
        return back();
    }

    public function print_invoice(int $id) {
        /** get sale */
        $salesTable = new SalesTable;
        $sales = $salesTable->where('id', '=', $id)->get();
        if (!$sales->count()) {
            throw new \Exception("Sale #$id not found!!");
        }
        $sale = $sales[0];
        /** get sale items */
        $saleItemsTable = new SaleItemTable;
        $saleItems = $saleItemsTable->where('sale_id', '=', $id)->get();
        if (!$saleItems->count()) {
            throw new \Exception("Sale items for sale #$id not found!!!");
        }
        $saleItems = $saleItems->toArray();
        foreach ($saleItems as $i => $item) {
            $productsTable = new ProductsTable;
            $products = $productsTable->where('id', '=', $item['product_id'])->get();
            if (!$products->count()) {
                throw new \Exception("Cannot find product #$id!!!");
            }
            $product = $products[0];
            $saleItems[$i]['product'] = $product->toArray();
        }
        /** get user */
        $usersTable = DB::table('users');
        $users = $usersTable->where('id', '=', $sale->user_id)->get();
        if (!$users->count()) {
            throw new \Exception("User for sale #$id not found!!!");
        }
        $user = $users[0];
        /** get client */
        $clientsTable = new ClientsTable;
        $clients = $clientsTable->where('id', '=', $sale->client_id)->get();
        if (!$clients->count()) {
            throw new \Exception("Cannot find the client for sale #$id");
        }
        $client = $clients[0];
        /** print to a file */
        $pdfUniqName = substr(md5(uniqid(rand())),0,8).'.pdf';
        $pdf = new Dompdf;
        $pdf->setPaper([0, 0, 226.77, 800], 'portrait'); 
        $pdf->load_html(view('sales.invoice', [
            'sale' => $sale->toArray(),
            'saleItems' => $saleItems,
            'client' => $client->name,
            'user' => $user->name,
            'dolar' => DolarScrapper::getBsPrice(),
        ])->render());
        $pdf->render();
        $pdfPath = public_path('/storage/tmp')."/$pdfUniqName";
        file_put_contents($pdfPath, $pdf->output());

        return redirect(asset("storage/tmp/$pdfUniqName"));
    }
}
