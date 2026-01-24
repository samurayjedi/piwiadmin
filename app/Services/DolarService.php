<?php
namespace App\Services;

class DolarService {
    private function scrap_bs_price_from_bcv() {
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

    public function get_bs_price() {
        // first check if dolar its setted manually and the session variable aren't be expired
        if (session()->has('dolar_expires') && now()->timestamp < session('dolar_expires')) {
            return (float)session('dolar');
        }
        session()->forget(['dolar', 'dolar_expires']);

        return $this->scrap_bs_price_from_bcv();
    }
}