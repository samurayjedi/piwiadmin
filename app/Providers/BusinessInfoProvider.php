<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Services\BusinessInfoService;

class BusinessInfoProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void {
        $this->app->singleton(BusinessInfoService::class, function () {
            return new BusinessInfoService;
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void {
        //
    }
}
