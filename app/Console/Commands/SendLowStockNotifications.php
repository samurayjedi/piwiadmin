<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use App\Notifications\LowStockNotification;
use App\Models\Product;
use App\Models\User;

class SendLowStockNotifications extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:send-low-stock-notifications';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send a notification when products have low stock';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $products = Product::select([
            'products.*',
            DB::raw('products.stock - COALESCE(SUM(sale_items.quantity), 0) as remaining_stock')
        ])
        ->leftJoin('sale_items', 'products.id', '=', 'sale_items.product_id')
        ->havingRaw('remaining_stock <= products.notification_stock')
        ->havingNotNull('products.notification_stock')
        ->groupBy('products.id', 'products.barcode', 'products.name', 
        'products.price', 'products.profit', 'products.stock', 'products.category', 'products.brand',
        'products.wholesale', 'products.wholesale_qty', 'products.wholesale_profit', 'products.created_at',
        'products.updated_at', 'products.deleted_at', 'products.measurement', 'products.notification_stock');
        \Log::error('Products low stock notifications query: ' . $products->toSql());
        $products = $products->get();
        $users = User::all();
        foreach ($products as $p) {
            foreach ($users as $user) {
                $user->notify(new LowStockNotification($p));
            }
        }
    }
}
