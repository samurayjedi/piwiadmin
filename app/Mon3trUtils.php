<?php
namespace App;
use Carbon\Carbon;

class Mon3trUtils {
    public static function createCarbonDateFrom(string $date) {
        $formats = ['d-m-Y', 'Y-m-d'];
        foreach ($formats as $format) {
            try {
                return Carbon::createFromFormat($format, $date);
            } catch (\Exception $e) {
                continue;
            }
        }
    
        throw new \Exception("Cannot create carbon instance for date: $date.");
    }
}