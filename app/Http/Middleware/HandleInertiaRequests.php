<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): string|null
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $notifications = [];
        $user = auth()->user();
        if ($user) {
            $notifications = $user->unreadNotifications->toArray();
        }
        // business name
        $business_name = @file_get_contents(public_path("storage/images/business_logo/business_name.txt"));
        if (!$business_name) {
            $business_name = config('app.name', 'Laravel');
        }
        
        // .... 
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'language' => session('language', app()->getLocale()),
            'notifications' => $notifications,
            'business_name' => $business_name,
        ];
    }
}
