<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Controllers\Pagination;
/* use App\Models\Brands\BrandsTable;
use App\Models\Categories\CategoryTable;
use App\Models\Products\Product;
use App\Models\Products\ProductsTable; */
use App\Models\Category;
use App\Models\Brand;
use App\Models\Product;

class InventoryController extends Controller {
    public function main() {
        /** products by pagination */
        $page = intval(request()->get('page', 0));
        $rows = intval(request()->get('rows', 5));
        $pager = Pagination::normalize('inventory', $page, $rows, Product::count());
        if (!is_array($pager)) {
            // is a redirect
            return $pager;
        }
        [$limit, $offset, $count] = $pager;
        $products = Product::orderBy('id', 'DESC')
            ->skip($offset)
            ->take($limit)
            ->with(['category', 'brand'])
            ->get();

        return Inertia::render('Inventory', [
            'categories' => Category::all()->toArray(),
            'brands' => Brand::all()->toArray(),
            'products' => $products->toArray(),
            'page' => $page,
            'count' => $count,
            'rows' => $rows,
        ]);
    }

    public function add_product(Request $request) {
        $request->validate([
            'barcode' => 'required|numeric|unique:products,barcode',
            'name' => 'required|string|max:255',
            'price' => 'required|numeric',
            'profit' => 'required|numeric',
            'measurement' => 'required|string|in:unit,liter,weight',
            'stock' => 'required|numeric',
            'category' => 'required|string|max:255',
            'brand' => 'required|string|max:255',
            'wholesale' => 'boolean',
            'wholesale_qty' => 'required_if:wholesale,==,true|numeric',
            'wholesale_profit' => 'required_if:wholesale,==,true|numeric',
        ]);

        $product = new Product;
        $product->barcode = $request->get('barcode');
        $product->name = $request->get('name');
        $product->price = $request->get('price');
        $product->profit = $request->get('profit');
        $product->measurement = $request->get('measurement');
        $product->stock = $request->get('stock');
        $product->category = $request->get('category');
        $product->brand = $request->get('brand');
        $wholesale = $request->get('wholesale');
        $product->wholesale = (bool)$wholesale;
        $product->wholesale_qty = $wholesale ? $request->get('wholesale_qty') : null;
        $product->wholesale_profit = $wholesale ? $request->get('wholesale_profit') : null;
        $product->save();

        return back();
    }

    public function update_product_submit(Request $request, int $id) {
        $request->validate([
            'barcode' => 'required|numeric|exists:products,barcode',
            'name' => 'required|string|max:255',
            'price' => 'required|numeric',
            'profit' => 'required|numeric',
            'measurement' => 'required|string|in:unit,liter,weight',
            'stock' => 'required|numeric',
            'category' => 'required|string|max:255',
            'brand' => 'required|string|max:255',
            'wholesale' => 'boolean',
            'wholesale_qty' => 'required_if:wholesale,==,1|numeric',
            'wholesale_profit' => 'required_if:wholesale,==,1|numeric',
        ]);

        $product = Product::findOrFail($id);
        $product->barcode = $request->get('barcode');
        $product->name = $request->get('name');
        $product->price = $request->get('price');
        $product->profit = $request->get('profit');
        $product->measurement = $request->get('measurement');
        $product->stock = $request->get('stock');
        $product->category = $request->get('category');
        $product->brand = $request->get('brand');
        $wholesale = (bool)$request->get('wholesale');
        $product->wholesale = $wholesale;
        $product->wholesale_qty = $wholesale ? $request->get('wholesale_qty') : null;
        $product->wholesale_profit = $wholesale ? $request->get('wholesale_profit') : null;
        $product->save();
        
        return back();
    }

    
    public function delete_product(int $id) {
        $product = Product::findOrFail($id);
        $product->delete();

        return back();
    }
}
