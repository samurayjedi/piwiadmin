<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\PaymentMethod;
use App\Http\Controllers\Pagination;

class PaymentMethodsController extends Controller {
    public function main(int $page = 0, int $rows = 5) {
        $pager = Pagination::normalize('payment_methods', $page, $rows, PaymentMethod::count());
        if (!is_array($pager)) {
            // is a redirect
            return $pager;
        }
        [$limit, $offset, $count] = $pager;
        $paymentMethods = PaymentMethod::orderBy('id', 'DESC')
            ->skip($offset)
            ->take($limit)
            ->get();
          

        return Inertia::render('PaymentMethods', [
            'payment_methods' => $paymentMethods->toArray(),
            'page' => $page,
            'count' => $count,
            'rows' => $rows,
        ]);
    }

    public function store(Request $request) {
        $request->validate([
            'payment_label' => 'required|string|max:255',
            'payment_slug' => 'required|string|unique:payment_methods,payment_slug',
            'payment_currency' => 'required|string|max:255',
        ]);

        $paymentMethod = new PaymentMethod;
        $paymentMethod->payment_label = $request->get('payment_label');
        $paymentMethod->payment_slug = $request->get('payment_slug');
        $paymentMethod->payment_currency = $request->get('payment_currency');
        $paymentMethod->save();
        
        return back();
    }

    public function update(Request $request, int $id) {
        $request->validate([
            'payment_label' => 'required|string|max:255',
            'payment_currency' => 'required|string|max:255',
        ]);

        $paymentMethod = PaymentMethod::findOrFail($id);
        $paymentMethod->payment_label = $request->get('payment_label');
        $paymentMethod->payment_currency = $request->get('payment_currency');
        $paymentMethod->save();
        
        return back();
    }

    
    public function delete(int $id) {
        $paymentMethod = PaymentMethod::findOrFail($id);
        $paymentMethod->delete();

        return back();
    }
}
