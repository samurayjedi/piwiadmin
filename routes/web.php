<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
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
use App\DolarScrapper;

Route::get('/', function () {
    return redirect('/dashboard');
});

Route::middleware(['auth', 'password.confirm'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');
    Route::controller(NotificationsController::class)->group(function() {
        Route::get('/notifications', 'markAllAsRead')->name('notifications');
        Route::get('/notifications/notification/{notificationId}', 'markAsRead')->name('notifications.notification.markAsRead');
    });
    /** Currencies */
    Route::get('/update-dolar-price', function () {
        return response()->json(['dolar' => DolarScrapper::getBsPrice()]);
    })->name('update-dolar-price');
    /** Sale */
    Route::controller(SalesController::class)->group(function() {
        Route::get('/dashboard/sales', 'main')->name('sales');
        Route::post('/dashboard/sales', 'pay')->name('sales.pay');
        Route::get('/dashboard/sales/sale/{id}/print_invoice', 'print_invoice')->name('sales.sale.print_invoice');
        Route::get('/dashboard/sales/new_sale', 'new_sale')->name('sales.new_sale');
        Route::post('/dashboard/sales/new_sale', 'blackhole')->name('sales.new_sale.blackhole');
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
});

Route::get('/locales/{language}/translation.json', [LocaleController::class, 'handle']);
Route::get('/locales/change/{language}', [LocaleController::class, 'changeLanguage'])->name('locale.change');

require __DIR__.'/auth.php';