<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\PaymentMethods\PaymentMethod;
use App\Models\PaymentMethods\PaymentMethodsTable;
use App\Http\Controllers\Pagination;

class PaymentMethodsController extends Controller {
    public function main(int $page = 0, int $rows = 5) {
        $table = new PaymentMethodsTable;
        $pager = Pagination::normalize('payment_methods', $page, $rows, $table->count());
        if (!is_array($pager)) {
            // is a redirect
            return $pager;
        }
        [$limit, $offset, $count] = $pager;
        $paymentMethods = $table
          ->limit($limit)
          ->offset($offset)
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
            'payment_slug' => 'required|string|max:255',
            'payment_currency' => 'required|string|max:255',
        ]);

        $paymentMethod = new PaymentMethod();
        $paymentMethod->payment_label = $request->get('payment_label');
        $paymentMethod->payment_slug = $request->get('payment_slug');
        $paymentMethod->payment_currency = $request->get('payment_currency');
        $paymentMethod->insert();
        
        return back();
    }

    public function update(Request $request, int $id) {
        $request->validate([
            'payment_label' => 'required|string|max:255',
            'payment_slug' => 'required|string|max:255',
            'payment_currency' => 'required|string|max:255',
        ]);

        $table = new PaymentMethodsTable;
        $paymentMethods = $table->where('id', '=', $id)->get();
        $paymentMethod = $paymentMethods[0];
        $paymentMethod->payment_label = $request->get('payment_label');
        $paymentMethod->payment_slug = $request->get('payment_slug');
        $paymentMethod->payment_currency = $request->get('payment_currency');
        $paymentMethod->update();
        
        return back();
    }

    
    public function delete(int $id) {
        $table = new PaymentMethodsTable;
        $paymentMethods = $table->where('id', '=', $id)->get();
        $paymentMethod = $paymentMethods[0];
        $paymentMethod->delete();

        return back();
    }
}
