<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\LocaleController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\FormSetupController;
use App\Http\Controllers\CategoriesController;
use App\Http\Controllers\BrandsController;
use App\Http\Controllers\InventoryController;
use App\Http\Controllers\ClientsController;
use App\Http\Controllers\PaymentMethodsController;
use App\Http\Controllers\SalesController;
use App\Http\Controllers\NotificationsController;
use App\Http\Controllers\ChartsController;
use App\Http\Controllers\CurrenciesController;
use App\Http\Controllers\StockController;

Route::get('/', function () {
    return redirect('/dashboard');
});

Route::middleware(['auth', 'password.confirm'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::post('/profile/update-business-information', [ProfileController::class, 'update_business_info'])->name('profile.update-business-info');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'main'])->name('dashboard');
    Route::get('/dashboard/charts', [ChartsController::class, 'main'])->name('charts');
    Route::controller(NotificationsController::class)->group(function() {
        Route::get('/notifications', 'markAllAsRead')->name('notifications.markAllAsRead');
        Route::get('/notifications/notification/{notificationId}', 'markAsRead')->name('notifications.notification.markAsRead');
    });
    /** Sale */
    Route::controller(SalesController::class)->group(function() {
        Route::get('/dashboard/sales', 'main')->name('sales');
        Route::get('/dashboard/sales/sale_type/{sale_type}', 'sales_by_type')->name('sale_type');
        Route::get('/dashboard/sales/client_id/{client_id}', 'sale_by_client')->name('sales.client');
        Route::get('/dashboard/sales/client_id/{client_id}/sale_type/{sale_type}', 'main')->name('sales.client.sale_type');
        // ....
        Route::post('/dashboard/sales', 'pay')->name('sales.pay');
        Route::get('/dashboard/sales/sale/{id}/print_invoice', 'print_invoice')->name('sales.sale.print_invoice');
        Route::post('/dashboard/sales/sale/{id}/void', 'void_invoice')->name('sales.void_invoice');
        /** New sale */
        Route::get('/dashboard/sales/new_sale', 'new_sale')->name('sales.new_sale');
        Route::post('/dashboard/sales/new_sale', 'new_sale')->name('sales.new_sale.perform_action');
        // Route::post('/dashboard/sales/new_sale', 'blackhole')->name('sales.new_sale.blackhole');
        Route::post('/dashboard/sales/new_sale/save', 'register_new_sale')->name('sales.new_sale.save');
    });
    /** Categories */
    Route::controller(CategoriesController::class)->group(function() {
        Route::get('/dashboard/categories/{page?}/{rows?}', 'main')->name('categories');
        Route::post('/dashboard/categories', 'store')->name('categories.store');
        Route::post('/dashboard/categories/update/id/{id}', 'update')->name('categories.update');
        Route::post('/dashboard/categories/delete/id/{id}', 'delete')->name('categories.delete');
    });
    /** Brands */
    Route::controller(BrandsController::class)->group(function() {
        Route::get('/dashboard/brands/{page?}/{rows?}', 'main')->name('brands');
        Route::post('/dashboard/brands', 'store')->name('brands.store');
        Route::post('/dashboard/brands/update/id/{id}', 'update')->name('brands.update');
        Route::post('/dashboard/brands/delete/id/{id}', 'delete')->name('brands.delete');
    });
    /** Inventory */
    Route::controller(InventoryController::class)->group(function() {
        Route::get('/dashboard/inventory', 'main')->name('inventory');
        Route::post('/dashboard/inventory/product/add', 'add_product')->name('inventory.product.add');
        Route::post('/dashboard/inventory/product/update/id/{id}', 'update_product_submit')->name('inventory.product.update.submit');
        Route::post('/dashboard/inventory/product/delete/id/{id}', 'delete_product')->name('inventory.product.delete');
        Route::get('/dashboard/inventory/stock', 'stock')->name('stock');
        Route::get('/dashboard/inventory/stock/new_merchandise', 'new_merchandise')->name('stock.new_merchandise');
        Route::post('/dashboard/inventory/stock/new_merchandise', 'new_merchandise_save')->name('stock.new_merchandise.save');
        Route::get('/dashboard/inventory/stock/manage', 'manage_stock')->name('stock.manage');
        Route::post('/dashboard/inventory/stock/manage', 'manually_edit_stock')->name('stock.manage.edit');
        Route::get('/dashboard/inventory/stock/payable_accounts', 'payable_accounts')->name('inventory.stock.payable_accounts');
        Route::post('/dashboard/inventory/stock/payable_accounts/pay/{id}', 'pay_off_debt')->name('inventory.stock.payable_accounts.pay');
    });
    /** Clients */
    Route::controller(ClientsController::class)->group(function() {
        Route::get('/dashboard/clients/{page?}/{rows?}', 'main')->name('clients');
        Route::post('/dashboard/clients/add', 'store')->name('clients.store');
        Route::post('/dashboard/clients/update/id/{id}', 'update')->name('clients.update');
        Route::post('/dashboard/clients/delete/id/{id}', 'delete')->name('clients.delete');
    });
    /** Payment Methods */
    Route::controller(PaymentMethodsController::class)->group(function() {
        Route::get('/dashboard/payment_methods/{page?}/{rows?}', 'main')->name('payment_methods');
        Route::post('/dashboard/payment_methods/add', 'store')->name('payment_methods.store');
        Route::post('/dashboard/payment_methods/update/id/{id}', 'update')->name('payment_methods.update');
        Route::post('/dashboard/payment_methods/delete/id/{id}', 'delete')->name('payment_methods.delete');
    });
    /** Currencies */
    Route::controller(CurrenciesController::class)->group(function() {
        Route::get('/update-dolar-price', 'get_dolar_price')->name('update-dolar-price');
        Route::post('/update-dolar-price', 'set_dolar_price_manually')->name('update-dolar-price.manually');
    });
    /** API */
    // Search products
    Route::post('/search_product/name/{name}', [InventoryController::class, 'search_product_by_name'])->name('search_product.name');
    Route::post('/search_product/barcode/{barcode}', [InventoryController::class, 'search_product_by_barcode'])->name('search_product.barcode');
    // Search clients
    Route::post('/search_client/name/{name}', [ClientsController::class, 'search_clients_by_name'])->name('search_client.name');
    Route::post('/search_client/identification/{identification}', [ClientsController::class, 'search_clients_by_iden'])->name('search_client.identification');
});

Route::get('/locales/{language}/translation.json', [LocaleController::class, 'handle']);
Route::get('/locales/change/{language}', [LocaleController::class, 'changeLanguage'])->name('locale.change');
Route::post('/redirect/{route}', function (string $route) {
    $redirect = redirect()->route($route);
    if ($errors = request()->get('errors', null)) {
        $redirect->withErrors($errors);
    }

    return $redirect;
})->name('redirect');

require __DIR__.'/auth.php';
