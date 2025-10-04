<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class CurrenciesController extends Controller {
    private function scrap_bcv() {
        /** init dolar price scrapping */
        $url = 'https://www.bcv.org.ve';
        $context = stream_context_create([
            'ssl' => [
                'verify_peer' => false,
                'verify_peer_name' => false,
            ]
        ]);
        $html = file_get_contents($url, false, $context);
        if ($html === false) {
            throw new \Exception('Failed to load BCV URL');
        }
        $dom = new \DOMDocument();
        libxml_use_internal_errors(true); // Suppress warnings for malformed HTML
        $dom->loadHTML($html);
        libxml_clear_errors();
        /** find the div with the dolar price */
        $dolarDiv = $dom->getElementById('dolar');

        if ($dolarDiv) {
            $strongTags = $dolarDiv->getElementsByTagName('strong');
            if ($strongTags->length > 0) {
                $price = $strongTags->item(0)->nodeValue;
                // Remove any whitespace
                $price = trim($price);
                // Remove thousands separators and convert decimal comma to dot
                $price = str_replace(['.', ','], ['', '.'], $price);
                
                return (float)$price;
            } else {
                throw new \Exception('Could not find the price element');
            }
        }

        throw new \Exception('Could not find the dolar div');
    }

    public function get_dolar_price() {
        // first check if dolar its setted manually and the session variable aren't be expired
        if (session()->has('dolar_expires') && now()->timestamp < session('dolar_expires')) {
            return response()->json(['dolar' => (float)session('dolar')]);
        }
        session()->forget(['dolar', 'dolar_expires']);

        return response()->json(['dolar' => $this->scrap_bcv()]);
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
