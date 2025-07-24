<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
//
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\Facades\Validator;
use App\Mail\EmailVerificationNotification;
use App\Mail\PasswordResetEmail;
use App\Validators\RequiredWhenValidator;
use App\Validators\RequiredIfArrayIncludes;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        VerifyEmail::toMailUsing(
            fn (object $notifiable, string $url) => (new EmailVerificationNotification($url))
                ->to($notifiable->email)
        );
        ResetPassword::toMailUsing(
            fn (object $notifiable, string $token) => (new PasswordResetEmail($token, $notifiable->email))
                ->to($notifiable->email)
        );

        /** required _if_array_includes */
        Validator::extendImplicit('required_if_in', function (...$args) {
            return call_user_func([RequiredIfArrayIncludes::class, 'passes'], ...$args);
        });
        Validator::replacer('required_if_in', function(...$args) {
            return call_user_func([RequiredIfArrayIncludes::class, 'message'], ...$args);
        });
        /** required_when */
        Validator::extendImplicit('required_when', function(...$args) {
            return call_user_func([RequiredWhenValidator::class, 'passes'], ...$args);
        });
        Validator::replacer('required_when', function(...$args) {
            return call_user_func([RequiredWhenValidator::class, 'message'], ...$args);
        });        
    }
}
