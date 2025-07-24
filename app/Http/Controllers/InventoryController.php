<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Brands\BrandsTable;
use App\Http\Controllers\Pagination;
use App\Models\Categories\CategoryTable;
use App\Models\Products\Product;
use App\Models\Products\ProductsTable;

class InventoryController extends Controller {
    public function main() {
        $categoryTable = new CategoryTable;
        $categories = $categoryTable->get();
        $brandsTable = new BrandsTable;
        $brands = $brandsTable->get();
        $productsTable = new ProductsTable;
        $products = $productsTable->get();

        return Inertia::render('Inventory', [
            'categories' => $categories->toArray(),
            'brands' => $brands->toArray(),
            'products' => $products->toArray(),
        ]);
    }

    public function add_product(Request $request) {
        $request->validate([
            'barcode' => 'required|numeric',
            'name' => 'required|string|max:255',
            'price' => 'required|numeric',
            'sale_price' => 'required|numeric',
            'tax' => 'required|numeric',
            'stock' => 'required|numeric',
            'category' => 'required|string|max:255',
            'brand' => 'required|string|max:255',
            'wholesale' => 'required|string|max:3',
            'wholesale_qty' => 'required_if:wholesale,==,Yes|numeric',
            'wholesale_price' => 'required_if:wholesale,==,Yes|numeric',
            'cover' => 'mimes:jpg,bmp,png',
        ]);

        $product = new Product();
        $product->barcode = $request->get('barcode');
        $product->name = $request->get('name');
        $product->price = $request->get('price');
        $product->sale_price = $request->get('sale_price');
        $product->tax = $request->get('tax');
        $product->stock = $request->get('stock');
        $product->category = $request->get('category');
        $product->brand = $request->get('brand');
        $wholesale = $request->get('wholesale') === 'Yes' ? true : false;
        $product->wholesale = $wholesale;
        $product->wholesale_qty = $wholesale ? $request->get('wholesale_qty') : null;
        $product->wholesale_price = $wholesale ? $request->get('wholesale_price') : null;
        $product->cover_path = "i love amiyaa!!!!";
        $product->insert();

        return back();
    }

    public function update_product_submit(Request $request, int $id) {
        $request->validate([
            'barcode' => 'required|numeric',
            'name' => 'required|string|max:255',
            'price' => 'required|numeric',
            'sale_price' => 'required|numeric',
            'tax' => 'required|numeric',
            'stock' => 'required|numeric',
            'category' => 'required|string|max:255',
            'brand' => 'required|string|max:255',
            'wholesale' => 'required|string|max:3',
            'wholesale_qty' => 'required_if:wholesale,==,Yes|nullable|numeric',
            'wholesale_price' => 'required_if:wholesale,==,Yes|nullable|numeric',
            'cover' => 'mimes:jpg,bmp,png',
        ]);

        $table = new ProductsTable;
        $products = $table->where('id', '=', $id)->get();
        $product = $products[0];
        $product->barcode = $request->get('barcode');
        $product->name = $request->get('name');
        $product->price = $request->get('price');
        $product->sale_price = $request->get('sale_price');
        $product->tax = $request->get('tax');
        $product->stock = $request->get('stock');
        $product->category = $request->get('category');
        $product->brand = $request->get('brand');
        $wholesale = $request->get('wholesale') === 'Yes' ? true : false;
        $product->wholesale = $wholesale;
        $product->wholesale_qty = $wholesale ? $request->get('wholesale_qty') : null;
        $product->wholesale_price = $wholesale ? $request->get('wholesale_price') : null;
        $product->cover_path = "i love amiyaa!!!!";
        $product->update();
        
        return back();
    }

    
    public function delete_product(int $id) {
        $table = new ProductsTable;
        $products = $table->where('id', '=', $id)->get();
        $product = $products[0];
        $product->delete();

        return back();
    }
}
