<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Auth\AuthorizedUsersController;
use App\Http\Controllers\Auth\UserRolesController;
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
use App\Http\Middleware\EnsureUserHasPermission;
use App\Http\Controllers\ESCPosController;

Route::get('/csrf-token', function () {
    return response()->json(['token' => csrf_token()]);
});

Route::get('/', function () {
    return redirect('/dashboard');
});

Route::middleware(['auth', 'verified', 'password.confirm'])->group(function () {
    Route::controller(ProfileController::class)->group(function () {
        Route::get('/profile', 'edit')->name('profile.edit');
        Route::patch('/profile', 'update')->name('profile.update');
        Route::delete('/profile', 'destroy')->name('profile.destroy');
        Route::post('/profile/update-business-information', 'update_business_info')->name('profile.update-business-info');
        /** this will be moved to another controller */
        Route::post('/profile/petty-cash-funds', 'petty_cash_funds')->name('petty_cash_funds');
        Route::delete('/profile/petty-cash-funds/{id}/delete', 'delete_petty_fund')->name('petty_cash_funds.delete');
    });
    Route::controller(AuthorizedUsersController::class)->group(function() {
        Route::get('/authorized_users/{page?}/{rows?}', 'main')->name('authorized_users');
        Route::post('/authorized_users/add', 'add')->name('add_authorized_user');
        Route::put('/authorized_users/update/{id}', 'update')->name('update_authorized_user');
        Route::delete('/authorized_users/delete/{id}', 'delete')->name('delete_authorized_user');
    });
    Route::controller(UserRolesController::class)->group(function() {
        Route::get('/roles/{page?}/{rows?}', 'main')->name('roles');
        Route::post('/roles/add_role', 'add')->name('add_role');
        Route::put('/roles/update/{id}', 'update')->name('update_role');
        Route::delete('/roles/delete/{id}', 'delete')->name('delete_role');
    });
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
        Route::get('/dashboard/sales', 'main')
            ->middleware(EnsureUserHasPermission::class.':see_sales')
            ->name('sales');
        Route::get('/dashboard/sales/sale_type/{sale_type}', 'sales_by_type')
            ->middleware(EnsureUserHasPermission::class.':see_sales')
            ->name('sale_type');
        Route::get('/dashboard/sales/client_id/{client_id}', 'sale_by_client')
            ->middleware(EnsureUserHasPermission::class.':see_sales')
            ->name('sales.client');
        Route::get('/dashboard/sales/client_id/{client_id}/sale_type/{sale_type}', 'main')
            ->middleware(EnsureUserHasPermission::class.':see_sales')
            ->name('sales.client.sale_type');
        /** Pay pending sales */
        Route::post('/dashboard/sales', 'pay')
            ->middleware(EnsureUserHasPermission::class.':manage_sales_payments')
            ->name('sales.pay');
        /** New sale */
        Route::get('/dashboard/sales/new_sale', 'new_sale')
            ->middleware(EnsureUserHasPermission::class.':make_sales')
            ->name('sales.new_sale');
        Route::post('/dashboard/sales/new_sale', 'new_sale')->name('sales.new_sale.perform_action');
        Route::post('/dashboard/sales/new_sale/save', 'register_new_sale')
            ->middleware(EnsureUserHasPermission::class.':make_sales')
            ->name('sales.new_sale.save');
        /** Digital invoice (pdf) */
        Route::get('/dashboard/sales/sale/{id}/print_invoice', 'print_invoice')
            ->middleware(EnsureUserHasPermission::class.':reprint_sales_invoices')
            ->name('sales.sale.print_invoice');
        /** Void invoice */
        Route::post('/dashboard/sales/sale/{id}/void', 'void_invoice')
            ->middleware(EnsureUserHasPermission::class.':void_sales')
            ->name('sales.void_invoice');
        /** Paydesk operations */
        Route::get('/dashboard/close_paydesk', 'close_paydesk')->name('close_paydesk');
        Route::get('/dashboard/cut_paydesk', 'cut_paydesk')->name('cut_paydesk');
    });
    /** ESC/POS invoice */
    Route::controller(ESCPosController::class)->group(function() {
        Route::get('/dashboard/print_esc_pos/file/{file}', 'print_esc_pos')
            ->middleware(EnsureUserHasPermission::class.':reprint_sales_invoices')
            ->name('sales.sale.print_esc_eos_invoice');
        Route::get('/dashboard/esc_pos/certificate', 'certificate')
            ->middleware(EnsureUserHasPermission::class.':reprint_sales_invoices')
            ->name('esc_pos.certificate');
        Route::post('/dashboard/sales/new_sale/qz_signing', 'sign')
            ->middleware(EnsureUserHasPermission::class.':make_sales')
            ->name('sales.new_sale.sign');
    });
    /** Categories */
    Route::controller(CategoriesController::class)->group(function() {
        Route::get('/dashboard/categories/{page?}/{rows?}', 'main')
            ->middleware(EnsureUserHasPermission::class.':see_categories')
            ->name('categories');
        Route::post('/dashboard/categories', 'store')
            ->middleware(EnsureUserHasPermission::class.':add_category')
            ->name('categories.store');
        Route::post('/dashboard/categories/update/id/{id}', 'update')
            ->middleware(EnsureUserHasPermission::class.':update_category')
            ->name('categories.update');
        Route::post('/dashboard/categories/delete/id/{id}', 'delete')
            ->middleware(EnsureUserHasPermission::class.':delete_category')
            ->name('categories.delete');
    });
    /** Brands */
    Route::controller(BrandsController::class)->group(function() {
        Route::get('/dashboard/brands/{page?}/{rows?}', 'main')
            ->middleware(EnsureUserHasPermission::class.':see_brands')
            ->name('brands');
        Route::post('/dashboard/brands', 'store')
            ->middleware(EnsureUserHasPermission::class.':add_brand')
            ->name('brands.store');
        Route::post('/dashboard/brands/update/id/{id}', 'update')
            ->middleware(EnsureUserHasPermission::class.':update_brand')
            ->name('brands.update');
        Route::post('/dashboard/brands/delete/id/{id}', 'delete')
            ->middleware(EnsureUserHasPermission::class.':delete_brand')
            ->name('brands.delete');
    });
    /** Inventory */
    Route::controller(InventoryController::class)->group(function() {
        /** Products */
        Route::get('/dashboard/inventory', 'main')
            ->middleware(EnsureUserHasPermission::class.':see_inventory')
            ->name('inventory');
        Route::post('/dashboard/inventory/product/add', 'add_product')
            ->middleware(EnsureUserHasPermission::class.':add_product')
            ->name('inventory.product.add');
        Route::post('/dashboard/inventory/product/update/id/{id}', 'update_product_submit')
            ->middleware(EnsureUserHasPermission::class.':update_product')
            ->name('inventory.product.update.submit');
        Route::post('/dashboard/inventory/product/delete/id/{id}', 'delete_product')
            ->middleware(EnsureUserHasPermission::class.':delete_product')
            ->name('inventory.product.delete');
        /** Stock */
        Route::get('/dashboard/inventory/stock', 'stock')
            ->middleware(EnsureUserHasPermission::class.':see_stock')
            ->name('stock');
        Route::get('/dashboard/inventory/stock/new_merchandise', 'new_merchandise')
            ->middleware(EnsureUserHasPermission::class.':manage_stock')
            ->name('stock.new_merchandise');
        Route::post('/dashboard/inventory/stock/new_merchandise', 'new_merchandise_save')
            ->middleware(EnsureUserHasPermission::class.':manage_stock')
            ->name('stock.new_merchandise.save');
        Route::get('/dashboard/inventory/stock/manage', 'manage_stock')
            ->middleware(EnsureUserHasPermission::class.':manage_stock')
            ->name('stock.manage');
        Route::post('/dashboard/inventory/stock/manage', 'manually_edit_stock')
            ->middleware(EnsureUserHasPermission::class.':manage_stock')
            ->name('stock.manage.edit');
        /** Merchandise payable accounts */
        Route::get('/dashboard/inventory/stock/payable_accounts', 'payable_accounts')
            ->middleware(EnsureUserHasPermission::class.':see_stock_orders')
            ->name('inventory.stock.payable_accounts');
        Route::post('/dashboard/inventory/stock/payable_accounts/pay/{id}', 'pay_off_debt')
            ->middleware(EnsureUserHasPermission::class.':make_stock_orders_payments')
            ->name('inventory.stock.payable_accounts.pay');
    });
    /** Clients */
    Route::controller(ClientsController::class)->group(function() {
        Route::get('/dashboard/clients/{page?}/{rows?}', 'main')
            ->middleware(EnsureUserHasPermission::class.':see_clients')
            ->name('clients');
        Route::get('/dashboard/payable_accounts', 'indebt_clients')
            ->middleware(EnsureUserHasPermission::class.':see_clients')
            ->name('payable_accounts');
        Route::post('/dashboard/clients/add', 'store')
            ->middleware(EnsureUserHasPermission::class.':add_client')
            ->name('clients.store');
        Route::post('/dashboard/clients/update/id/{id}', 'update')
            ->middleware(EnsureUserHasPermission::class.':update_client')
            ->name('clients.update');
        Route::post('/dashboard/clients/delete/id/{id}', 'delete')
            ->middleware(EnsureUserHasPermission::class.':delete_client')
            ->name('clients.delete');
    });
    /** Payment Methods */
    Route::controller(PaymentMethodsController::class)->group(function() {
        Route::get('/dashboard/payment_methods/{page?}/{rows?}', 'main')
            ->middleware(EnsureUserHasPermission::class.':see_payment_methods')
            ->name('payment_methods');
        Route::post('/dashboard/payment_methods/add', 'store')
            ->middleware(EnsureUserHasPermission::class.':add_payment_method')
            ->name('payment_methods.store');
        Route::post('/dashboard/payment_methods/update/id/{id}', 'update')
            ->middleware(EnsureUserHasPermission::class.':update_payment_method')
            ->name('payment_methods.update');
        Route::post('/dashboard/payment_methods/delete/id/{id}', 'delete')
            ->middleware(EnsureUserHasPermission::class.':delete_payment_method')
            ->name('payment_methods.delete');
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
