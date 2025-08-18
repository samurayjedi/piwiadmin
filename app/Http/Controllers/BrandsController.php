<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Brand;
use App\Http\Controllers\Pagination;

class BrandsController extends Controller {
    public function main(int $page = 0, int $rows = 5) {
        $pager = Pagination::normalize('brands', $page, $rows, Brand::count());
        if (!is_array($pager)) {
            // is a redirect
            return $pager;
        }
        [$limit, $offset, $count] = $pager;
        $brands = Brand::orderBy('id', 'DESC')
            ->skip($offset)
            ->take($limit)
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
            'brand_slug' => 'required|string|unique:brands,brand_slug',
        ]);

        $brand = new Brand;
        $brand->brand_label = $request->get('brand_label');
        $brand->brand_slug = $request->get('brand_slug');
        $brand->save();
        
        return back();
    }

    public function update(Request $request, int $id) {
        $request->validate([
            'brand_label' => 'required|string|max:255',
        ]);

        $brand = Brand::findOrFail($id);
        $brand->brand_label = $request->get('brand_label');
        $brand->save();

        return back();
    }

    
    public function delete(int $id) {
        $brand = Brand::findOrFail($id);
        $brand->delete();

        return back();
    }
}
