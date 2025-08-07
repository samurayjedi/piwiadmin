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
        $categoriesArr = $categoryTable->get()->toArray();
        $brandsTable = new BrandsTable;
        $brandsArr = $brandsTable->get()->toArray();
        /** products by pagination */
        $page = intval(request()->get('page', 0));
        $rows = intval(request()->get('rows', 5));
        $productsTable = new ProductsTable;
        $pager = Pagination::normalize('inventory', $page, $rows, $productsTable->count());
        if (!is_array($pager)) {
            // is a redirect
            return $pager;
        }
        [$limit, $offset, $count] = $pager;
        $products = $productsTable
            ->limit($limit)
            ->offset($offset)
            ->orderBy('id', 'DESC')
            ->get();
        $arr = $products->toArray();
        foreach ($products as $i => $p) {
            /** load categories */
            $tCategories = new CategoryTable;
            $categories = $tCategories->where('category_slug', '=', $p->category)->get();
            if (!$categories->count()) {
                throw new \Exception('Cannot find category '.$p->category);
            }
            $arr[$i]['category'] = $categories[0]->toArray();
            /** load brands */
            $tBrands = new BrandsTable;
            $brands = $tBrands->where('brand_slug', '=', $p->brand)->get();
            if (!$brands->count()) {
                throw new \Exception('Cannot find brand '.$p->brand);
            }
            $arr[$i]['brand'] = $brands[0]->toArray();
        }

        return Inertia::render('Inventory', [
            'categories' => $categoriesArr,
            'brands' => $brandsArr,
            'products' => $arr,
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

        $product = new Product();
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
        $product->insert();

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
            'wholesale_qty' => 'required_if:wholesale,==,true|nullable|numeric',
            'wholesale_profit' => 'required_if:wholesale,==,true|nullable|numeric',
        ]);

        $table = new ProductsTable;
        $products = $table->where('id', '=', $id)->get();
        $product = $products[0];
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
