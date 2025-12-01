<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Pagination;
/* use App\Models\Brands\BrandsTable;
use App\Models\Categories\CategoryTable;
use App\Models\Products\Product;
use App\Models\Products\ProductsTable; */
use App\Mon3trUtils;
use App\ApiUtils;
use App\Models\Category;
use App\Models\Brand;
use App\Models\Product;
use App\Models\PaymentMethod;
use App\Models\StockLog;
use App\Models\PayableAccount;
use App\Models\PayableAccountPayments;
use App\Models\PayableAccountItem;


class InventoryController extends Controller {
    public function main() {
        /** products by pagination */
        $page = intval(request()->get('page', 0));
        $rows = intval(request()->get('rows', 5));
        $pager = Pagination::normalize('inventory', $page, $rows, Product::count());
        if (!is_array($pager)) {
            // is a redirect
            return $pager;
        }
        [$limit, $offset, $count] = $pager;

        $products = Product::select('products.*')
            ->with([
                'brand' => fn($query) => $query->withTrashed(), 
                'category' => fn($query) => $query->withTrashed(),
            ])
            ->leftJoin('sale_items', 'products.id', '=', 'sale_items.product_id')
            ->addSelect([
                DB::raw('products.stock - COALESCE(SUM(sale_items.quantity), 0) as remaining_stock')
            ])
            ->groupBy('products.id', 'products.barcode', 'products.name', 
            'products.price', 'products.profit', 'products.stock', 'products.category', 'products.brand',
            'products.wholesale', 'products.wholesale_qty', 'products.wholesale_profit', 'products.created_at',
            'products.updated_at', 'products.deleted_at', 'products.measurement')
            ->skip($offset)
            ->take($limit)
            ->orderBy('id', 'DESC')
            ->get()
            ->map(fn ($item) => [
                ...$item->toArray(),
                'stock' => (float)$item->remaining_stock,
            ]);

        return Inertia::render('Inventory', [
            'categories' => Category::all()->toArray(),
            'brands' => Brand::all()->toArray(),
            'products' => $products->toArray(),
            'page' => $page,
            'count' => $count,
            'rows' => $rows,
        ]);
    }

    public function add_product(Request $request) {
        $request->validate([
            'barcode' => 'required|numeric|unique:products,barcode',
            'name' => 'required|string|max:255',
            'price' => 'required|numeric',
            'profit' => 'required|numeric',
            'measurement' => 'required|string|in:unit,liter,weight',
            'stock' => 'required|numeric',
            'category' => 'required|string|max:255',
            'brand' => 'required|string|max:255',
            'wholesale' => 'boolean',
            'wholesale_qty' => 'required_if:wholesale,==,true|numeric',
            'wholesale_profit' => 'required_if:wholesale,==,true|numeric',
        ]);

        $product = new Product;
        $product->barcode = $request->get('barcode');
        $product->name = $request->get('name');
        $product->price = $request->get('price');
        $product->profit = $request->get('profit');
        $product->measurement = $request->get('measurement');
        $product->stock = $request->get('stock');
        $product->category = $request->get('category');
        $product->brand = $request->get('brand');
        $wholesale = $request->get('wholesale');
        $product->wholesale = (bool)$wholesale;
        $product->wholesale_qty = $wholesale ? $request->get('wholesale_qty') : null;
        $product->wholesale_profit = $wholesale ? $request->get('wholesale_profit') : null;
        $product->save();

        return back();
    }

    public function update_product_submit(Request $request, int $id) {
        $request->validate([
            'barcode' => 'required|numeric|exists:products,barcode',
            'name' => 'required|string|max:255',
            'price' => 'required|numeric',
            'profit' => 'required|numeric',
            'measurement' => 'required|string|in:unit,liter,weight',
            'stock' => 'required|numeric',
            'category' => 'required|string|max:255',
            'brand' => 'required|string|max:255',
            'wholesale' => 'boolean',
            'wholesale_qty' => 'required_if:wholesale,==,1|numeric',
            'wholesale_profit' => 'required_if:wholesale,==,1|numeric',
        ]);

        try {
            DB::beginTransaction();
            [$remaining_stock, $product] = Product::remaining_stock($id);
            $stock = $product->stock; $adjustment = $request->get('stock') - $remaining_stock;
            $product->barcode = $request->get('barcode');
            $product->name = $request->get('name');
            $product->price = $request->get('price');
            $product->profit = $request->get('profit');
            $product->measurement = $request->get('measurement');
            $product->stock = $product->stock + $adjustment;
            $product->category = $request->get('category');
            $product->brand = $request->get('brand');
            $wholesale = (bool)$request->get('wholesale');
            $product->wholesale = $wholesale;
            $product->wholesale_qty = $wholesale ? $request->get('wholesale_qty') : null;
            $product->wholesale_profit = $wholesale ? $request->get('wholesale_profit') : null;
            $product->save();
            /** */
            if ($stock !== $product->stock) {
                $log = StockLog::create([
                    'description' => $product->name,
                    'adjustment_type' => 'subtraction',
                    'reason' => __('Edited manually via product form.'),
                ]);
                $log->products()->attach([
                    $product->id => [
                        'adjustment' => $adjustment,
                        'from_stock' => $remaining_stock,
                        'to_stock' => $remaining_stock + $adjustment,
                    ],
                ]);
            }

            DB::commit();

            return back();
        } catch (\Exception $e) {
            DB::rollback();

            return back()->withErrors([
                'kernel_panic' => $e->getMessage(),
            ]);
        }
    }

    
    public function delete_product(int $id) {
        $product = Product::findOrFail($id);
        $product->delete();

        return back();
    }

    public function stock() {
        /** products by pagination */
        $page = intval(request()->get('page', 0));
        $rows = intval(request()->get('rows', 5));
        $pager = Pagination::normalize('stock', $page, $rows, StockLog::count());
        if (!is_array($pager)) {
            // is a redirect
            return $pager;
        }
        [$limit, $offset, $count] = $pager;
        $logs = StockLog::orderBy('id', 'DESC')
            ->with([
                'products' => function ($query) {
                    $query
                        ->withTrashed()
                        ->withPivot(['adjustment', 'from_stock', 'to_stock']);
                },
                'products.category' => fn($query) => $query->withTrashed(), 
                'products.brand' => fn($query) => $query->withTrashed(), 
                'sale_items',
                'payable_account',
                'payable_account.payments',
            ])
            ->skip($offset)
            ->take($limit)
            ->get();

        return Inertia::render('Inventory/Stock', [
            'logs' => $logs->toArray(),
            'page' => $page,
            'count' => $count,
            'rows' => $rows,
        ]);
    }

    public function new_merchandise() {
        return Inertia::render('Inventory/Stock/NewMerchandise');
    }

    public function new_merchandise_save() {
        request()->validate([
            'provider' => 'required|string|max:255',
            'total_amount' => 'required|numeric|min:0.01',
            'payment_type' => 'required|in:cash,credit',
            'payment' => 'required_if:payment_type,=,cash|numeric|min:0.01',
            'initial_payment' => 'required_when:initial,==,true,&&,payment_type,==,credit|numeric|min:0.01',
            'due_date' => 'required_if:payment_type,=,credit|date',
            'notification_interval' => 'required_if:payment_type,=,credit|in:daily,weekly,fortnightly,monthly,bimonthly,quarterly,biannual,yearly',
            'products_entries' => 'required|array|min:1',
            'products_entries.*.id' => 'required|numeric',
            'products_entries.*.unit_price' => 'required_if:update_prices,=,true|numeric|min:0.01',
            'products_entries.*.adjustment' => 'required|numeric|min:0.01',
        ]);
        $provider = request()->get('provider');
        $total_amount = floatval(request()->get('total_amount'));
        $payment_type = request()->get('payment_type');
        $initial = request()->get('initial');
        $payment = floatval(request()->get('payment'));
        $initial_payment = floatval(request()->get('initial_payment'));
        $entries = request()->get('products_entries');
        $update_prices = request()->get('update_prices', false);
        if ($payment_type === 'cash') {
            if ($payment < $total_amount) {
                return back()->withErrors([
                    'payment' => __('The amount :payment must be >= to :total.', [
                        'payment' => __('validation.attributes.payment'),
                        'total' => __('validation.attributes.total_amount'),
                    ]),
                ]);
            }
        } else {
            if ($initial === true) {
                if ($initial_payment >= $total_amount) {
                    return back()->withErrors([
                        'initial_payment' => __('The amount :payment must be < to :total.', [
                            'payment' => __('validation.attributes.initial_payment'),
                            'total' => __('validation.attributes.total_amount'),
                        ]),
                    ]);
                }
            }
        }
        try {
            DB::beginTransaction();
            /** creating the log */
            $log = StockLog::create([
                'description' => __('Purchase from supplier :provider.', [
                    'provider' => $provider,
                ]),
                'adjustment_type' => 'addition',
                'reason' => __('New merchandise'),
                'note' => request()->get('note', null),
            ]);
            foreach ($entries as $entry) {
                $adjustment = floatval($entry['adjustment']);
                $idProduct = $entry['id'];
                [$remaining_stock, $product] = Product::remaining_stock($idProduct);
                $product->stock += $adjustment;
                if ($update_prices) {
                    $product->price = floatval($entry['unit_price']);
                }
                $product->save();
                $log->products()->attach([
                    $idProduct => [
                    'adjustment' => $adjustment,
                    'from_stock' => $remaining_stock,
                    'to_stock' => $remaining_stock + $adjustment,
                    ],
                ]);
            }
            /** registering the payable account */
            $payableAccount = PayableAccount::create([
                'description' => __('Purchase from supplier :provider.', [
                    'provider' => $provider,
                ]),
                'type' => $payment_type,
                'total_amount' => $total_amount,
                'amount_paid' => (function() use($payment_type, $payment, $initial, $initial_payment) {
                    if ($payment_type === 'cash') {
                        return $payment;
                    } else {
                        if ($initial === true) {
                            return $initial_payment;
                        }
                    }

                    return 0;
                })(),
                'due_date' => $payment_type === 'credit' ? (function() {
                    return Mon3trUtils::createCarbonDateFrom(request()->get('due_date'))->format('Y-m-d');
                })() : null,
                'notification_interval' => $payment_type === 'credit' ? request()->get('notification_interval') : null,
                'status' => $payment_type === 'cash' ? 'completed' : 'pending',
                'stock_log_id' => $log->id,
            ]);
            /** and the payment if one was made */
            if ($payment_type === 'cash' || ($payment_type === 'credit' && $initial === true)) {
                $accountPayment = new PayableAccountPayments;
                $accountPayment->payable_account_id = $payableAccount->id;
                $accountPayment->amount = $payment_type === 'cash' ? $payment : $initial_payment;
                $accountPayment->notes = request()->get('pay_note', null);
                $accountPayment->save();
            }
            /** */
            foreach ($entries as $entry) {
                $product = Product::findOrFail($entry['id']);
                $item = new PayableAccountItem;
                $item->payable_account_id = $payableAccount->id;
                $item->product_id = $product->id;
                $item->unit_price = $update_prices ? floatval($entry['unit_price']) : $product->price;
                $item->save();
            }
            /** */
            DB::commit();

            return back();
        } catch (\Exception $e) {
            DB::rollback();

            return back()->withErrors([
                'kernel_panic' => $e->getMessage(), // __('Stock adjustment failed because a system error, contact de administrator for details.')
            ]);
        }
    }

    public function manage_stock() {
        $id = request()->get('id', 0);
        $product = $id === 0 ? null : Product::remaining_stock($id);
        if ($product !== null) {
            [$remaining_stock, $p] = $product;
            $product = $p->toArray();
            $product['stock'] = floatval($remaining_stock);
        }
        return Inertia::render('Inventory/Stock/Manage', [
            'product' => $product,
        ]);
    }

    public function manually_edit_stock() {
        request()->validate([
            'product_id' => 'required|integer|exists:products,id',
            'adjustment_type' => 'required|string|in:addition,subtraction',
            'adjustment' => 'required|numeric|min:0.01',
            'reason' => 'required|string|max:255',
            'other_reason' => 'required_if:reason,Other|string|max:255',
            'note' => 'string',
        ]);

        try {
            DB::beginTransaction();
            // make the adjustment in the stock of the product
            $product_id = request()->get('product_id');
            $adjustment_type = request()->get('adjustment_type');
            $adjustment = request()->get('adjustment');
            [$remaining_stock, $product] = Product::remaining_stock($product_id);
            $from_stock = $remaining_stock;
            $to_stock = 0;
            if ($adjustment_type === 'subtraction') {
                $product->stock -= floatval($adjustment);
                $to_stock = $remaining_stock - floatval($adjustment);
            } else {
                $product->stock += floatval($adjustment);
                $to_stock = $remaining_stock + floatval($adjustment);
            }
            $product->save();
            // create stock history log
            $log = StockLog::create([
                'description' => $product->name,
                'adjustment_type' => $adjustment_type,
                'reason' => (function() {
                    if (($reason=request()->get('reason')) !== 'Other') {
                        return $reason;
                    }

                    return request()->get('other_reason');
                })(),
                'note' => request()->get('note'),
            ]);
            $log->products()->attach([
                $product_id => [
                    'adjustment' => $adjustment,
                    'from_stock' => $from_stock,
                    'to_stock' => $to_stock,
                ],
            ]);

            DB::commit();

            return redirect()->route('stock');
        } catch (\Exception $e) {
            DB::rollback();
            
            \Log::error('Stock adjustment failed: ' . $e->getMessage());

            return back()->withErrors([
                'kernel_panic' => $e->getMessage(), // __('Stock adjustment failed because a system error, contact de administrator for details.')
            ]);
        }
    }

    public function payable_accounts() {
        /** products by pagination */
        $page = intval(request()->get('page', 0));
        $rows = intval(request()->get('rows', 5));
        $pager = Pagination::normalize('inventory.stock.payable_accounts', $page, $rows, PayableAccount::count());
        if (!is_array($pager)) {
            // is a redirect
            return $pager;
        }
        [$limit, $offset, $count] = $pager;
        $query = PayableAccount::orderBy('id', 'DESC')
            ->with([
                'stock_log',
                'stock_log.products' => function ($q) {
                    $q
                        ->withTrashed()
                        ->withPivot(['adjustment', 'from_stock', 'to_stock']);
                },
                'stock_log.products.category' => fn($query) => $query->withTrashed(),
                'stock_log.products.brand' => fn($query) => $query->withTrashed(),
                'payments',
                'items',
                'items.product' => function ($q) {
                    $q->withTrashed();
                },
                'items.product.brand' => fn($query) => $query->withTrashed(),
                'items.product.category' => fn($query) => $query->withTrashed(),
            ])
            ->skip($offset)
            ->take($limit);
        if (($id=request()->get('id', null)) !== null) {
            $query->where('id', $id);
        }
        $logs = $query->get()->toArray();

        return Inertia::render('Inventory/Stock/PayableAccounts', [
            'inventory_payable_accounts' => $logs,
            'page' => $page,
            'count' => $count,
            'rows' => $rows,
        ]);
    }

    public function pay_off_debt(int $id) {
        request()->validate([
            'amount' => 'required|numeric|min:0.01',
            'note' => 'string|max:255',
        ]);
        $pay = floatval(request()->get('amount'));

        try {
            DB::beginTransaction();
            $account = PayableAccount::findOrFail($id);
            $account->amount_paid += $pay;
            if ($account->amount_paid >= $account->total_amount) {
                $account->status = 'completed';
                if ($account->amount_paid > $account->total_amount) {
                    $account->amount_paid = $account->total_amount;
                }
            }
            $account->save();
            $payment = new PayableAccountPayments;
            $payment->payable_account_id = $account->id;
            $payment->amount = $pay;
            $payment->notes = request()->get('note', null);
            $payment->save();
            DB::commit();

            return back();
        } catch(\Exception $e) {
            DB::rollback();

            return back()->withErrors([
                'kernel_panic' => $e->getMessage(),
            ]);
        }
    }

    /** API */

    public function search_product_by_name(string $name) {
        return $this->search_product('name', $name);
    }

    public function search_product_by_barcode(string $barcode) {
        return $this->search_product('barcode', $barcode);
    }

    private function search_product($field, $value) {
        $rules = [
            'barcode' => [ 'barcode' => 'required|numeric' ],
            'name' => [ 'name' => 'required|string|max:255' ],
        ];
        if ($err=ApiUtils::validate($rules[$field], [$field => $value])) {
            return $err;
        }
        $products = Product::select('products.*')
            ->with([
                'brand' => fn($query) => $query->withTrashed(),
                'category' => fn($query) => $query->withTrashed(),
            ])
            ->leftJoin('sale_items', 'products.id', '=', 'sale_items.product_id')
            ->addSelect([
                DB::raw('products.stock - COALESCE(SUM(sale_items.quantity), 0) as remaining_stock')
            ])
            ->where($field, 'LIKE', '%'.$value.'%')
            ->groupBy('products.id', 'products.barcode', 'products.name', 
            'products.price', 'products.profit', 'products.stock', 'products.category', 'products.brand',
            'products.wholesale', 'products.wholesale_qty', 'products.wholesale_profit', 'products.created_at',
            'products.updated_at', 'products.deleted_at', 'products.measurement')
            ->get()
            ->map(fn ($item) => [
                ...$item->toArray(),
                'stock' => (float)$item->remaining_stock,
            ]);
        if (!$products->count()) {
            return response()->json([
                'status' => 0,
                'errors' => [$field => __('No products found.')],
            ]);
        }
        /** payment methods */
        
        $paymentMethods = PaymentMethod::all();

        return response()->json([
            'status' => 1,
            'products' => $products->toArray(),
            'payment_methods' => $paymentMethods->toArray(),
        ]);
    }
}
