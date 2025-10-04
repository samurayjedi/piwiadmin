<?php
namespace App;
use Carbon\Carbon;

class Mon3trUtils {
    public static function createCarbonDateFrom(string $date) {
        $locale = session()->get('locale', null);
        if (!$locale) {
            throw new \RuntimeException('Locale not set!!');
        }
        $format = (function () use($locale) {
            switch ($locale) {
                case 'en':
                    return 'Y-m-d';
                case 'es':
                    return 'd-m-Y';
            }

            throw new \RuntimeException("Locale $locale not implemented!!!");
        })();
    
        return Carbon::createFromFormat($format, $date);
    }
}