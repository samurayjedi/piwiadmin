<?php
namespace App\Models;

use Illuminate\Support\Facades\Auth;
use App\Mon3trUtils;
use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\Client;
use App\Models\Payment;
use App\Models\PaymentMethod;

class SaleBuilder {
    protected $dni, $cart, $payment, $paymentMethods, $total, $amountPaid;
    protected $notes, $rules;

    public function validate() {
        $this->rules = [
            /** Products to purchase */
            'cart' => 'required|array',
            'cart.*.id' => 'required|integer|exists:products,id',
            'cart.*.sale_price' => 'required|numeric|min:0.01',
            'cart.*.qty' => 'required|numeric|min:0.01',
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
        // default [] because in credit sales can be null
        foreach (request()->get('payment_methods', []) as $paymentMethod) {
            if (request()->get('payment_type') === 'credit') {
                $this->rules[$paymentMethod] = 'numeric|min:0';
            } else {
                $this->rules[$paymentMethod] = [
                    'required_if:payment_type,cash',
                    'required_if:payment_type,layaway',
                    'numeric',
                    'min:0.01',
                ];
            }
            $this->rules[$paymentMethod.'_note'] = 'nullable|string';
        }

        request()->validate($this->rules);

        return $this;
    }

    public function exchange_from_request() {
        $this->dni = request()->get('identification');
        $this->cart = [];
        foreach (request()->get('cart') as $cartItem) {
            $price = $cartItem['sale_price'];
            $profit = $cartItem['profit'];
            $wholesale = $cartItem['wholesale'];
            $wholesale_qty = $cartItem['wholesale_qty'];
            $wholesale_profit = $cartItem['wholesale_profit'];
            $qty = $cartItem['qty'];

            $this->cart[] = [
                'id' => $cartItem['id'],
                'price' =>  floatval($price),
                'profit' => floatval($profit),
                'wholesale' => (bool)$wholesale,
                'wholesale_qty' => floatval($wholesale_qty),
                'wholesale_profit' => floatval($wholesale_profit),
                'qty' => floatval($qty),
            ];
        }
        $this->paymentMethods = request()->get('payment_methods', []);
        $this->payment = [
            'payment_type' => request()->get('payment_type'),
            'notification_interval' => request()->get('notification_interval'),
            'due_date' => (function() {
                $due_date = request()->get('due_date', null);
                if ($due_date !== null) {
                    $due_date = Mon3trUtils::createCarbonDateFrom($due_date)->format('Y-m-d');
                }

                return $due_date;
            })(),
        ];
        foreach ($this->paymentMethods as $payMethod) {
            $this->payment[$payMethod.'_note'] = request()->get($payMethod.'_note', null);
        }
        $this->notes = request()->get('notes');

        return $this;
    }

    public function make_objects() {
        /** Calculate total */
        $this->total = 0; 
        foreach ($this->cart as $item) {
            $this->total += $item['price'] * $item['qty'];
        }
        $this->total = round($this->total, 2);
        /** Calculate & validate amount paid */
        $this->amountPaid = 0;
        foreach ($this->paymentMethods as $payMethod) {
            // default 0, because in credit sales, payment_method can be undefined
            $paymentAmount = floatval(request()->get($payMethod, 0));
            $this->payment[$payMethod] = $paymentAmount;
            $this->amountPaid += $paymentAmount;
        }
        $this->amountPaid = round($this->amountPaid, 2);
        /** if the user add payment methods in credit sales, but all of them are $0.... as its no necesary pay any amount 
         * in that type of sale.... remove all items from payment_methods for no register any payment in the database */
        if ($this->payment['payment_type'] === 'credit' && $this->amountPaid == 0) {
            $this->paymentMethods = [];
        }
        /** validate the ammount payed */
        if ($this->payment['payment_type'] !== 'cash' && $this->amountPaid >= $this->total) {
            return $this->payments_error(__('With the sale type selected, the amount paid cannot be >= to the total'));
        } else if ($this->payment['payment_type'] === 'cash' && $this->amountPaid < $this->total) {
            return $this->payments_error(__('In cash sales, you must pay the totality'));
        }
        /** Make objects */
        // first, sale object
        $client = Client::where('identification', '=', $this->dni)->firstOrFail();
        $sale = new Sale;
        $sale->user_id = Auth::user()->id;
        $sale->client_id = $client->id;
        $sale->payment_type = $this->payment['payment_type'];
        $sale->total_amount = $this->total;
        $sale->amount_paid = min($this->amountPaid, $this->total);
        $sale->status = $this->payment['payment_type'] === 'cash' ? 'completed' : 'pending';
        $sale->due_date = $this->payment['due_date'];
        $sale->notification_interval = $this->payment['notification_interval'];
        $sale->notes = $this->notes;
        // sale items objects
        $saleItems = [];
        foreach ($this->cart as $item) {
            /** check if the stock have availibity for the product */
            [$remaining_stock, $p] = Product::remaining_stock($item['id']);
            if ($item['qty'] > $remaining_stock) {
                return back()->withErrors([
                    'payment_type' => __('There is not enough stock for the product:').' '.$p->name,
                ]);
            }

            $saleItem = new SaleItem;
            $saleItem->product_id = $item['id'];
            $saleItem->quantity = $item['qty'];
            $saleItem->unit_price = $item['price'];
            $saleItem->discount_id = null;
            $saleItems[] = $saleItem;
        }
        // and payments objects
        $payments = [];
        foreach ($this->paymentMethods as $payMethod) {
            $paymentMethodRecord = PaymentMethod::where('payment_slug', '=', $payMethod)->firstOrFail();
            $pay = new Payment;
            $pay->amount = $this->payment[$payMethod];
            $pay->payment_date = date('Y-m-d');
            $pay->payment_method_id = $paymentMethodRecord->id;
            $pay->notes = $this->payment[$payMethod.'_note'];
            $payments[] = $pay;
        }

        return [$sale, $saleItems, $payments];
    }

    protected function get_price(array $item) {
        [
            'price' => $price,
            'profit' => $profit,
            'qty' => $qty,
            'wholesale' => $wholesale,
            'wholesale_profit' => $wholesale_profit,
            'wholesale_qty' => $wholesale_qty,
        ] = $item;
        $isWholesale = $wholesale && $qty >= $wholesale_qty;
        $profit = ($price * $profit) / 100;
        if ($isWholesale) {
            $profit = ($price * $wholesale_profit) / 100;
        }
        
        return $price + $profit;
    }

    protected function payments_error(string $msg) {
        $errors = [];
        foreach ($this->paymentMethods as $payMethod) {
            $errors[$payMethod] = $msg;
        }

        return back()->withErrors($errors);
    }
}