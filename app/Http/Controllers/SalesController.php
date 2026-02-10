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
use App\Models\StockLog;
use App\Http\Controllers\CurrenciesController;
use App\Mon3trUtils;
use App\Events\SaleDone;
use App\Events\PaymentMade;
use App\Services\DolarService;
use App\Services\BusinessInfoService;

class SalesController extends Controller {
    public function sales_by_type(string $sale_type) {
        return $this->main(-1, $sale_type);
    }

    public function sale_by_client(int $client_id) {
        return $this->main($client_id, 'all');
    }

    public function main(int $client_id = -1, $sale_type = 'all') {
        $client_name = null;
        if ($client_id > 0) {
            $client = Client::withTrashed()->findOrFail($client_id);
            $client_name = $client->name;
        } 
        request()->validate([
            'date_init' => 'nullable|date',
            'date_end' => 'nullable|date|after:date_init',
        ]);
        /** filters */
        $date_init = request()->get('date_init', 'none');
        $date_end = request()->get('date_end', 'none');
        $sale_id = request()->get('sale_id', -1);
        /** payment methods */
        $paymentMethods = PaymentMethod::all();
        /** sales */
        $sales = Sale::orderBy('id', 'DESC')
            ->with([
                'client' => fn ($query) => $query->withTrashed(),
                'user',
                'sale_items',
                'sale_items.product' => fn ($query) => $query->withTrashed(),
                'sale_items.product.brand' => fn($query) => $query->withTrashed(),
                'sale_items.product.category' => fn($query) => $query->withTrashed(),
                'payments',
                'payments.payment_method' => fn ($query) => $query->withTrashed(),
            ])
            ->when($sale_id > 0, function ($query) use($sale_id) {
                $query->where('id', $sale_id);
            })
            ->when($client_id > 0, function ($query) use($client_id) {
                $query->where('client_id', $client_id);
            })
            ->when($sale_type !== 'all', function($query) use($sale_type) {
                $query->where('payment_type', $sale_type);
            })
            ->when($date_init !== 'none', function($query) use($date_init, $date_end) {
                $date = Mon3trUtils::createCarbonDateFrom($date_init);
                if ($date_end !== 'none') {
                    $query->whereDate('created_at', '>=', $date);
                } else {
                    $query->whereDate('created_at', $date);
                }
            })
            ->when($date_end !== 'none', function ($query) use($date_end) {
                $date = Mon3trUtils::createCarbonDateFrom($date_end);
                $query->whereDate('created_at', '<=', $date);
            });
        /** Pagination */
        $page = intval(request()->get('page', 0));
        $rows = intval(request()->get('rows', 5));
        $pager = Pagination::normalize('sales', $page, $rows, $sales->count());
        if (!is_array($pager)) {
            // is a redirect
            return $pager;
        }
        [$limit, $offset, $count] = $pager;
        /** records */
        $sales = $sales
            ->skip($offset)
            ->take($limit)
            ->get();

        return Inertia::render('Sales', [
            'sales' => $sales->toArray(),
            'payment_methods' => $paymentMethods->toArray(),
            'page' => $page,
            'count' => $count,
            'rows' => $rows,
            'sale_type' => $sale_type,
            'date_init' => $date_init,
            'date_end' => $date_end,
            'client_id' => $client_id,
            'client_name' => $client_name,
        ]);
    }

    public function new_sale(Request $request) {
        $cart = request()->get('cart', null);
        $attrs = [
            'payment_methods' => PaymentMethod::all(),
            'recreated_sale' => $cart !== null,
            'cart' => function () use($cart) {
                if ($cart !== null) {
                    $quantities = array_column($cart, 'qty', 'id');
                    return Product::whereIn('id', array_map(fn($item) => $item['id'], $cart))
                        ->get()
                        ->map(function ($item, $i) use($quantities) {
                            $normal = ($item->price * $item->profit) / 100;
                            $wholesale = ($item->price * $item->wholesale_profit) / 100;
                            $profit = ($item->wholesale && $quantities[$item->id] > $item->wholesale_qty) ? $wholesale : $normal;

                            return [
                                ...$item->toArray(),
                                'qty' => $quantities[$item->id] ?? 0,
                                'sale_price' => round($item->price + $profit, 2),
                            ];
                        })
                        ->toArray();
                }

                return [];
            },
        ];
        switch (request()->get('action', null)) {
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
                $attrs['client'] = $client->toArray();
                break;
        }

        return Inertia::render('Sales/NewSale', $attrs);
    }

    public function register_new_sale() {
        $result = (new SaleBuilder)
            ->validate()
            ->exchange_from_request()
            ->make_objects();
        try {
            if (!is_array($result)) {
                // the return value must be a redirect, so return it

                return $result;
            }
            [$sale, $saleItems, $payments] = $result;
            DB::beginTransaction();
            $sale->save();
            $sale->load('client'); // load client relationship
            // the sale product items
            $logProducts = []; $logSaleItems = [];
            foreach ($saleItems as $saleItem) {
                $saleItem->sale_id = $sale->id;
                $saleItem->save();
                // 
                [$remaining_stock, $product] = Product::remaining_stock($saleItem->product_id);
                $logProducts[$product->id] = [
                    'adjustment' => $saleItem->quantity,
                    'from_stock' => $remaining_stock + $saleItem->quantity,
                    'to_stock' => $remaining_stock,
                ];
                $logSaleItems = [$saleItem->id];
            }
            // register in stock log a output
            $log = StockLog::create([
                'description' => __('Sale to :client, :items item(s).', [
                    'client' => $sale->client->name,
                    'items' => count($saleItems),
                ]),
                'adjustment_type' => 'subtraction',
                'reason' => __('Sold'),
                'note' => __('Sold in receipt #:id.', [ 'id' => $sale->id ]),
            ]);
            $log->products()->attach($logProducts);
            $log->sale_items()->attach($logSaleItems);
            // register the payments
            foreach ($payments as $pay) {
                $pay->sale_id = $sale->id;
                $pay->save();
            }
            DB::commit();
            // print invoice, etc
            event(new SaleDone($sale));
            if ($sale->payment_type !== 'cash') {
                return redirect()->route('sales');
            }

            return redirect()->route('sales.sale.print_esc_eos_invoice', [
                'id' => $sale->id,
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Sale creation failed: '.$e->getMessage());

            return back()->withErrors([
                'kernel_panic' => $e->getMessage(),
            ]);
        }
    }

    public function print_esc_pos_invoice(int $id) {
        $sale = Sale::with([
            'client',
            'user',
            'sale_items',
            'sale_items.product',
            'sale_items.product.brand',
            'sale_items.product.category',
            'payments',
            'payments.payment_method',
        ])->where('id', $id)->firstOrFail();

        return Inertia::render('Sales/NewSale/PrintEcsPosInvoice', [
            'sale' => $sale->toArray(),
        ]);
    }

    public function sign() {
        request()->validate(['toSign' => 'required|string']);
        $toSign = request('toSign');
        $keyPath = storage_path('app/qz-tray/private-key.pem');
        if (!file_exists($keyPath)) {
            \Log::error('Private key file not exists!!!');

            throw new \Exception(__("Critical error, contact the administrator of the system for more details."));
        }
        $key = openssl_pkey_get_private("file://{$keyPath}");
        if (!$key) {
            \Log::error('Cannot open the private key file!!!');

            throw new \Exception(__("Critical error, contact the administrator of the system for more details."));
        }
        $signature = null;
        $signed = openssl_sign($toSign, $signature, $key, OPENSSL_ALGO_SHA512);
        if (!$signed) {
            \Log::error('Signing failed!!');

            throw new \Exception(__("Critical error, contact the administrator of the system for more details."));
        }

        // Return base64 encoded signature
        return response(base64_encode($signature))
            ->header('Content-Type', 'text/plain');
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
        $sale = Sale::where('id', '=', $saleId)->firstOrFail();
        if ($sale->status === 'completed') {
            return back()->withErrors([
                'kernel_panic' => __('The sale is already completed.'),
            ]);
        }
        $ammountPaid = 0;
        foreach ($paymentMethods as $payMethod) {
            $paymentMethodRecord = PaymentMethod::where('payment_slug', '=', $payMethod)->firstOrFail();
            $paymentAmount = floatval(request()->get($payMethod));
            $pay = new Payment;
            $pay->sale_id = $saleId;
            $pay->amount = $paymentAmount;
            $pay->payment_date = date('Y-m-d');
            $pay->payment_method_id = $paymentMethodRecord->id;
            $pay->notes = request()->get($payMethod.'_note', null);
            $pay->save();
            $ammountPaid += $paymentAmount;
        }
        $sale->amount_paid = min($sale->total_amount, $sale->amount_paid + $ammountPaid);
        $statusChanged = false;
        if ($sale->amount_paid == $sale->total_amount) {
            $sale->status = 'completed';
            $statusChanged = true;
        }
        $notes = request()->get('notes', null);
        if ($notes !== null) {
            $sale->notes = $notes;
        }
        $sale->save();

        event(new PaymentMade($sale));
        
        if ($statusChanged) {
            return redirect()->route('sales.sale.print_esc_eos_invoice', [
                'id' => $sale->id,
            ]);
        }
        
        return back();
    }

    public function print_invoice(int $id, DolarService $dolar, BusinessInfoService $info) {
        $sale = Sale::where('id', '=', $id)
            ->with([
                'client' => fn ($query) => $query->withTrashed(),
                'user',
                'sale_items',
                'sale_items.product' => function ($query) {
                    $query->withTrashed();
                },
                'sale_items.product.brand' => fn($query) => $query->withTrashed(),
                'sale_items.product.category' => fn($query) => $query->withTrashed(),
                'payments',
                'payments.payment_method' => fn ($query) => $query->withTrashed(),
            ])
            ->firstOrFail();
        /** print invoice */
        $pdfUniqName = substr(md5(uniqid(rand())),0,8).'.pdf';
        $pdf = new Dompdf;
        $pdf->setPaper([0, 0, 226.77, 800], 'portrait'); 
        $pdf->load_html(view('sales.invoice', [
            'sale' => $sale->toArray(),
            'dolar' => $dolar->get_bs_price(),
            'business_name' => $info->name,
        ])->render());
        $pdf->render();
        $pdfPath = public_path('/storage/tmp')."/$pdfUniqName";
        file_put_contents($pdfPath, $pdf->output());

        return redirect(asset("storage/tmp/$pdfUniqName"));
    }

    public function void_invoice(int $id) {
        try {
            DB::beginTransaction();
            $sale = Sale::with([
                'sale_items', 
                'sale_items.product' => function ($query) {
                    $query->withTrashed();
                }
            ])
                ->where('id', '=', $id)
                ->lockForUpdate()
                ->firstOrFail();
            $sale->status = 'canceled';
            $sale->save();
            // handle trashed products
            $sale_items = $sale->sale_items
                ->filter(function ($item) {
                    return $item->product && !$item->product->trashed();
                });
            if ($sale_items->count()) {
                $log = StockLog::create([
                    'description' => __('messages.voided_invoice', ['sale_id' => $id]),
                    'adjustment_type' => 'addition',
                    'reason' => __('Voided invoice'),
                    'note' => request()->get('note'),
                ]);
                $log->products()->attach($sale_items->mapWithKeys(function ($item) {
                    [$remaining_stock, $product] = Product::remaining_stock($item->product->id);

                    return [
                        $item->product_id => [
                            'adjustment' => $item->quantity,
                            'from_stock' => $remaining_stock,
                            'to_stock' => $remaining_stock + $item->quantity,
                        ],
                    ];
                })->toArray());
                $log->sale_items()->attach($sale->sale_items->pluck('id')->toArray());
            }
            // returns items
            foreach ($sale->sale_items as $item) {
                $product = $item->product;
                $product->stock += $item->quantity;
                $product->save();
            }

            DB::commit();
        } catch (\Exception $e) {
            DB::rollback();
            \Log::error('Void invoice failed: ' . $e->getMessage(), [
                'sale_id' => $id,
                'exception' => $e,
            ]);

            return back()->withErrors([
                'kernel_panic' => __('Void invoice failed because a system error, contact de administrator for details.'),
            ]);
        }

        return back();
    }
}
