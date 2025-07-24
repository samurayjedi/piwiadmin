<?php
namespace App\Http\Controllers;

class Pagination {
    public static function normalize(string $routeName, int $page, int $rows, int $count) {
        /** pagination params */
        $pages = abs(ceil($count / $rows));
        $cPage = $page;
        
        if (intval($pages) <= 0) {
            return [$rows, 0, $count];
        } else if ($cPage < 0) { 
            return redirect()->route($routeName);
        } else if ($cPage >= $pages) {
            $cPage = intval($pages) === 0 ? 0 : $pages - 1;

            return redirect()->route($routeName, ['page' => $pages - 1, 'rows' => $rows]);
        }
        
        return [$rows, $cPage * $rows, $count];
    }
}