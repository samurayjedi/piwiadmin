<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\DolarService;

class CurrenciesController extends Controller {
    public function get_dolar_price(DolarService $dolar) {
        return response()->json(['dolar' => $dolar->get_bs_price()]);
    }

    public function set_dolar_price_manually() {
        request()->validate([
            'dolar' => 'required|numeric',
            'interval' => 'required|in:one_hour,three_hours,five_hours,eight_hours,twelve_hours',
        ]);
        
        $dolar = request()->get('dolar');
        $interval = request()->get('interval');
        $hours = (function () use($interval) {
            switch ($interval) {
                case 'three_hours':
                    return 3;
                case 'five_hours':
                    return 5;
                case 'eight_hours':
                    return 8;
                case 'twelve_hours':
                    return 12;
                default:
                    return 1;
            }
        })();
        session([
            'dolar' => $dolar,
            'dolar_expires' => now()->addHours($hours)->timestamp,
        ]);

        return back();
    }
}
