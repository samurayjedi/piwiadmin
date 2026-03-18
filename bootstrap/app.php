<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Console\Scheduling\Schedule;

$app = Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {      

        $middleware->alias([
            'password.confirm' => \App\Http\Middleware\RequirePassword::class,
        ]);

        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
            \App\Http\Middleware\UserIsAuthorized::class,
        ]);

        //
    })
    ->withSchedule(function (Schedule $schedule) {
        $schedule->command('payment_reminder:send daily')->daily();
        $schedule->command('accounts_reminders:send daily')->daily();
        $schedule->command('app:send-low-stock-notifications')->daily();
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
$app->usePublicPath($app->basePath('public_html'));

return $app;
