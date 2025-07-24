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
    /** Currencies */
    Route::get('/update-dolar-price', function () {
        /** init dolar price scrapping */
        $url = 'https://www.bcv.org.ve';
        $context = stream_context_create([
            'ssl' => [
                'verify_peer' => false,
                'verify_peer_name' => false,
            ]
        ]);
        $html = file_get_contents($url, false, $context);
        if ($html === false) {
            throw new \Exception('Failed to load BCV URL');
        }
        $dom = new \DOMDocument();
        libxml_use_internal_errors(true); // Suppress warnings for malformed HTML
        $dom->loadHTML($html);
        libxml_clear_errors();
        /** find the div with the dolar price */
        $dolarDiv = $dom->getElementById('dolar');

        if ($dolarDiv) {
            $strongTags = $dolarDiv->getElementsByTagName('strong');
            if ($strongTags->length > 0) {
                $price = $strongTags->item(0)->nodeValue;
                $price = trim($price); // Remove any whitespace
                
                return response()->json(['dolar' => $price]);
            } else {
                throw new \Exception('Could not find the price element');
            }
        }

        throw new \Exception('Could not find the dolar div');
    })->name('update-dolar-price');
    /** Sale */
    Route::controller(SalesController::class)->group(function() {
        Route::get('/dashboard/sales', 'main')->name('sales');
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
        Route::get('/dashboard/inventory/{page?}/{rows?}', 'main')->name('inventory');
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