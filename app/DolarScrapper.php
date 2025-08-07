<?php
namespace App;

class DolarScrapper {
    public static function getBsPrice() {
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
                $price = trim($price); // Remove any whitespace
                
                return floatval($price);
            } else {
                throw new \Exception('Could not find the price element');
            }
        }

        throw new \Exception('Could not find the dolar div');
    }
}