<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class SessionI18nextLanguageProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        $locale = session('locale', 'es');
        $fakerLocale = session('faker_locale', 'es_ES');
        config([
            'locale' => $locale,
            'faker_locale' => $fakerLocale,
        ]);
    }
}