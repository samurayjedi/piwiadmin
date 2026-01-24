<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Contracts\Support\DeferrableProvider;
use Illuminate\Contracts\Foundation\Application;
use App\Services\EcsPosService;
use App\Services\DolarService;
use App\Services\BusinessInfoService;

class EcsPosServiceProvider extends ServiceProvider implements DeferrableProvider {
    /**
     * Register services.
     */
    public function register(): void {
        $this->app->singleton(EcsPosService::class, function (Application $app) {
            return new EcsPosService($app->make(DolarService::class), $app->make(BusinessInfoService::class));
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void {
        //
    }

    /**

     * Get the services provided by the provider.

     *

     * @return array<int, string>

     */

    public function provides(): array
    {

        return [EcsPosService::class];

    }
}
