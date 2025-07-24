<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Brands\Brand;
use App\Models\Brands\BrandsTable;
use App\Http\Controllers\Pagination;

class BrandsController extends Controller {
    public function main(int $page = 0, int $rows = 5) {
        $table = new BrandsTable;
        $pager = Pagination::normalize('brands', $page, $rows, $table->count());
        if (!is_array($pager)) {
            // is a redirect
            return $pager;
        }
        [$limit, $offset, $count] = $pager;
        $brands = $table
          ->limit($limit)
          ->offset($offset)
          ->get();
          

        return Inertia::render('Brands', [
            'brands' => $brands->toArray(),
            'page' => $page,
            'count' => $count,
            'rows' => $rows,
        ]);
    }

    public function store(Request $request) {
        $request->validate([
            'brand_label' => 'required|string|max:255',
            'brand_slug' => 'required|string|max:255',
        ]);

        $brand = new Brand();
        $brand->brand_label = $request->get('brand_label');
        $brand->brand_slug = $request->get('brand_slug');
        $brand->insert();
        
        return back();
    }

    public function update(Request $request, int $id) {
        $request->validate([
            'brand_label' => 'required|string|max:255',
            'brand_slug' => 'required|string|max:255',
        ]);

        $table = new BrandsTable;
        $brands = $table->where('id', '=', $id)->get();
        $brand = $brands[0];
        $brand->brand_label = $request->get('brand_label');
        $brand->brand_slug = $request->get('brand_slug');
        $brand->update();

        return back();
    }

    
    public function delete(int $id) {
        $table = new BrandsTable;
        $brands = $table->where('id', '=', $id)->get();
        $brand = $brands[0];
        $brand->delete();

        return back();
    }
}
