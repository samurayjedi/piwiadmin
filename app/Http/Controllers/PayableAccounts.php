<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class PayableAccounts extends Controller {
    public function main() {
        return redirect()->route('clients', ['in_debt' => true]);
    }
}
