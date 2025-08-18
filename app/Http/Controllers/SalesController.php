<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Dompdf\Dompdf;
use App\Http\Controllers\Pagination;
use App\Models\PaymentMethod;
use App\Models\Sale;
use App\Models\Payment;
use App\Models\Product;
use App\Models\Client;
use App\Models\SaleBuilder;
use App\DolarScrapper;

class SalesController extends Controller {
    public function main() {
        $page = intval(request()->get('page', 0));
        $rows = intval(request()->get('rows', 5));
        $pager = Pagination::normalize('sales', $page, $rows, Sale::count());
        if (!is_array($pager)) {
            // is a redirect
            return $pager;
        }
        [$limit, $offset, $count] = $pager;
        /** payment methods */
        $paymentMethods = PaymentMethod::all();
        /** sales */
        $sales = Sale::orderBy('id', 'DESC')
            ->skip($offset)
            ->take($limit)
            ->with([
                'client',
                'user',
                'sale_items',
                'sale_items.product',
                'sale_items.product.brand',
                'sale_items.product.category',
                'payments',
                'payments.payment_method'
            ])
            ->get();

        return Inertia::render('Sales', [
            'sales' => $sales->toArray(),
            'payment_methods' => $paymentMethods->toArray(),
            'page' => $page,
            'count' => $count,
            'rows' => $rows,
        ]);
    }

    public function new_sale() {
        $paymentMethods = PaymentMethod::all();

        return Inertia::render('Sales/NewSale', [
            'payment_methods' => $paymentMethods->toArray(),
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
                $products = Product::where($field, 'LIKE', '%'.$value.'%')
                    ->with(['brand', 'category'])
                    ->get();
                if (!$products->count()) {
                    return back()->withErrors([
                        $field => __('No products found.'),
                    ]);
                }
                /** payment methods */
                $paymentMethods = PaymentMethod::all();
                    
                return Inertia::render('Sales/NewSale', [
                    'products' => $products->toArray(),
                    'payment_methods' => $paymentMethods->toArray(),
                ]);
            case 'search_client':
                $request->validate([
                    'identification' => 'required|string|min:8',
                ]);

                /** clients */
                $iden = $request->get('identification');
                $client;
                try {
                    $client = Client::where('identification', '=', $iden)->firstOrFail();
                } catch(ModelNotFoundException $e) {
                    return back()->withErrors([
                        'identification_not_found' => true,
                        'identification' => __('Client not found, register it.'),
                        
                    ]);
                }
                /** payment methods */
                $paymentMethods = PaymentMethod::all();

                return Inertia::render('Sales/NewSale', [
                    'client' => $client->toArray(),
                    'payment_methods' => $paymentMethods->toArray(),
                ]);
        }

        return back();
    }

    public function register_new_sale() {
        $result = (new SaleBuilder)
            ->make_validation_rules()
            ->exchange_from_request()
            ->validate_and_make_objects();
        try {
            if (!is_array($result)) {
                // the return value must be a redirect, so return it

                return $result;
            }
            [$sale, $saleItems, $payments] = $result;
            DB::beginTransaction();
            $sale->save();
            // the sale product items
            foreach ($saleItems as $saleItem) {
                $saleItem->sale_id = $sale->id;
                $saleItem->save();
            }
            // register the payments
            foreach ($payments as $pay) {
                $pay->sale_id = $sale->id;
                $pay->save();
            }
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Sale creation failed: '.$e->getMessage());

            return back()->withErrors([
                'kernel_panic' => __('Error while creating the sale.'),
            ]);
        }

        return redirect()->route('sales');
    }

    public function pay() {
        request()->validate([
            'sale_id' => 'required|exists:sales,id',
            'payment_methods' => 'required|array|min:1',
            'payment_methods.*' => 'required|string|exists:payment_methods,payment_slug',
            /** */
            'notes' => 'nullable|string',
        ]);
        $rules = [];
        $paymentMethods = request()->get('payment_methods');
        foreach ($paymentMethods as $paymentMethod) {
            $rules[$paymentMethod] = 'required|numeric|min:0.01';
        }
        request()->validate($rules);
        $saleId = request()->get('sale_id');
        $ammountPaid = 0;
        foreach ($paymentMethods as $payMethod) {
            $paymentMethodRecord = PaymentMethod::where('payment_slug', '=', $payMethod)->firstOrFail();
            $paymentAmount = floatval(request()->get($payMethod));
            $pay = new Payment;
            $pay->sale_id = $saleId;
            $pay->amount = $paymentAmount;
            $pay->payment_date = date('Y-m-d');
            $pay->payment_method_id = $paymentMethodRecord->id;
            $pay->notes = request()->get('notes', null);
            $pay->save();
            $ammountPaid += $paymentAmount;
        }
        $sale = Sale::where('id', '=', $saleId)->firstOrFail();
        $sale->amount_paid = min($sale->total_amount, $sale->amount_paid + $ammountPaid);
        if ($sale->amount_paid == $sale->total_amount) {
            $sale->status = 'completed';
        }
        $sale->save();
        
        return back();
    }

    public function print_invoice(int $id) {
        $sale = Sale::where('id', '=', $id)
            ->with([
                'client',
                'user',
                'sale_items',
                'sale_items.product',
                'sale_items.product.brand',
                'sale_items.product.category',
                'payments',
                'payments.payment_method'
            ])
            ->firstOrFail();
        /** print invoice */
        $pdfUniqName = substr(md5(uniqid(rand())),0,8).'.pdf';
        $pdf = new Dompdf;
        $pdf->setPaper([0, 0, 226.77, 800], 'portrait'); 
        $pdf->load_html(view('sales.invoice', [
            'sale' => $sale->toArray(),
            'dolar' => DolarScrapper::getBsPrice(),
        ])->render());
        $pdf->render();
        $pdfPath = public_path('/storage/tmp')."/$pdfUniqName";
        file_put_contents($pdfPath, $pdf->output());

        return redirect(asset("storage/tmp/$pdfUniqName"));
    }
}
