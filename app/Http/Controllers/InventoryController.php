<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Pagination;
/* use App\Models\Brands\BrandsTable;
use App\Models\Categories\CategoryTable;
use App\Models\Products\Product;
use App\Models\Products\ProductsTable; */
use App\ApiUtils;
use App\Models\Category;
use App\Models\Brand;
use App\Models\Product;
use App\Models\PaymentMethod;
use Illuminate\Support\Facades\DB;

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

        $products = Product::select('products.*')
            ->with(['brand', 'category'])
            ->leftJoin('sale_items', 'products.id', '=', 'sale_items.product_id')
            ->addSelect([
                DB::raw('products.stock - COALESCE(SUM(sale_items.quantity), 0) as remaining_stock')
            ])
            ->groupBy('products.id', 'products.barcode', 'products.name', 
            'products.price', 'products.profit', 'products.stock', 'products.category', 'products.brand',
            'products.wholesale', 'products.wholesale_qty', 'products.wholesale_profit', 'products.created_at',
            'products.updated_at', 'products.measurement')
            ->skip($offset)
            ->take($limit)
            ->orderBy('id', 'DESC')
            ->get()
            ->map(fn ($item) => [
                ...$item->toArray(),
                'stock' => (float)$item->remaining_stock,
            ]);

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
        $remaining_stock = Product::select([
                DB::raw('products.stock - COALESCE(SUM(sale_items.quantity), 0) as remaining_stock'),
            ])
            ->leftJoin('sale_items', 'products.id', '=', 'sale_items.product_id')
            ->where('products.id', '=', $id)
            ->groupBy('products.id', 'products.stock')
            ->first()
            ->remaining_stock ?? 0;
        $product->barcode = $request->get('barcode');
        $product->name = $request->get('name');
        $product->price = $request->get('price');
        $product->profit = $request->get('profit');
        $product->measurement = $request->get('measurement');
        $product->stock = $product->stock + ($request->get('stock') - $remaining_stock);
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

    public function search_product_by_name(string $name) {
        return $this->search_product('name', $name);
    }

    public function search_product_by_barcode(string $barcode) {
        return $this->search_product('barcode', $barcode);
    }

    private function search_product($field, $value) {
        $rules = [
            'barcode' => [ 'barcode' => 'required|numeric' ],
            'name' => [ 'name' => 'required|string|max:255' ],
        ];
        if ($err=ApiUtils::validate($rules[$field], [$field => $value])) {
            return $err;
        }
        $products = Product::select('products.*')
            ->with(['brand', 'category'])
            ->leftJoin('sale_items', 'products.id', '=', 'sale_items.product_id')
            ->addSelect([
                DB::raw('products.stock - COALESCE(SUM(sale_items.quantity), 0) as remaining_stock')
            ])
            ->where($field, 'LIKE', '%'.$value.'%')
            ->groupBy('products.id', 'products.barcode', 'products.name', 
            'products.price', 'products.profit', 'products.stock', 'products.category', 'products.brand',
            'products.wholesale', 'products.wholesale_qty', 'products.wholesale_profit', 'products.created_at',
            'products.updated_at', 'products.measurement')
            ->get()
            ->map(fn ($item) => [
                ...$item->toArray(),
                'stock' => (float)$item->remaining_stock,
            ]);
        if (!$products->count()) {
            return response()->json([
                'status' => 0,
                'errors' => [$field => __('No products found.')],
            ]);
        }
        /** payment methods */
        
        $paymentMethods = PaymentMethod::all();

        return response()->json([
            'status' => 1,
            'products' => $products->toArray(),
            'payment_methods' => $paymentMethods->toArray(),
        ]);
    }
}
