<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Contracts\Support\DeferrableProvider;
use Illuminate\Contracts\Foundation\Application;
use App\Services\DolarService;

class DolarPriceProvider extends ServiceProvider implements DeferrableProvider
{
    /**
     * Register services.
     */
    public function register(): void {
        $this->app->singleton(DolarService::class, function(Application $app) {
            return new DolarService;
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }

    /**

     * Get the services provided by the provider.

     *

     * @return array<int, string>

     */

    public function provides(): array
    {

        return [DolarService::class];

    }
}
