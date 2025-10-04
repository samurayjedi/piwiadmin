<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;
use App\Models\Product;
use App\ChartDataset;
use App\Mon3trUtils;

class ChartsController extends Controller {
    public function main() {
        /** Sales charts tunes validation */
        request()->validate([
            'sales_dataset' => 'nullable|in:sales_by_type,sales_by_category,sales_by_brand,sales_by_client,sales_by_user',
            'sales_metric' => 'nullable|in:count,income,both',
            'sales_timeframe' => 'nullable|in:sales_by_month,sales_by_day',
            'sales_date' => 'nullable|date',
            'sales_chart_type' => 'nullable|in:bar,line,scatter,pie',
            'sales_layout' => 'nullable|in:horizontal,vertical',
        ]);
        /** getting the values, if not present, defaults */
        $sales_dataset = request()->get('sales_dataset', 'sales_by_type');
        $sales_metric = request()->get('sales_metric', 'count');
        $sales_timeframe = request()->get('sales_timeframe', 'sales_by_month');
        $sales_date = request()->get('sales_date', null);
        // making sales date a carbon instance
        if ($sales_date === null) {
            $sales_date = Carbon::now();
        } else {
            $sales_date = Mon3trUtils::createCarbonDateFrom($sales_date);
        }
        $sales_chart_type = request()->get('sales_chart_type', 'bar');
        $sales_layout = request()->get('sales_layout', 'vertical');
        /** building dataset */
        [$dataset, $datasetLabels] = ChartDataset::builder()
            ->chartType($sales_chart_type)
            ->filtering($sales_dataset)
            ->timeframe($sales_timeframe, $sales_date)
            ->query()
            ->get();
        /** Best-selling products */
        $page = intval(request()->get('page', 0));
        $rows = intval(request()->get('rows', 5));
        $pager = Pagination::normalize('charts', $page, $rows, Product::count());
        if (!is_array($pager)) {
            // is a redirect
            return $pager;
        }
        [$limit, $offset, $count] = $pager;
        // If you want to see the average unit price
        $products = Product::select([
                'products.id',
                'products.name',
                'products.stock',
                'products.measurement',
                DB::raw('COALESCE(SUM(sale_items.quantity), 0) as total_units_sold'),
                DB::raw('COALESCE(SUM(sale_items.quantity * sale_items.unit_price), 0) as total_revenue'),
                DB::raw('CASE WHEN products.stock > 0 THEN (COALESCE(SUM(sale_items.quantity), 0) / products.stock) * 100 ELSE 0 END as sold_percentage')
            ])
            ->leftJoin('sale_items', 'products.id', '=', 'sale_items.product_id')
            ->groupBy('products.id', 'products.name', 'products.stock', 'products.measurement')
            ->orderByDesc('sold_percentage')
            ->skip($offset)
            ->take($limit)
            ->get()
            ->map(function ($product) {
                $product->total_units_sold = (float) $product->total_units_sold;
                $product->total_revenue = (float) $product->total_revenue;
                $product->sold_percentage = (float) $product->sold_percentage;
                return $product;
            });
        
        return Inertia::render('Charts', [
            'sales_dataset' => $sales_dataset,
            'sales_metric' => $sales_metric,
            'sales_timeframe' => $sales_timeframe,
            'sales_date' => $sales_date->format('d-m-Y'),
            'sales_chart_type' => $sales_chart_type,
            'sales_layout' => $sales_layout,
            'dataset' => $dataset,
            'dataset_labels' => $datasetLabels,
            'bestSelling' => $products->toArray(),
            'page' => $page,
            'count' => $count,
            'rows' => $rows,
        ]);
    }
}
