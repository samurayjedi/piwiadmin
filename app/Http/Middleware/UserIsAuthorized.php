<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;
use App\Models\AuthorizedUser;

class UserIsAuthorized
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = auth()->user();
        if ($user) {
            if ($user->id !== 1) {
                if (!AuthorizedUser::where('email', $user->email)->exists()) {
                    Auth::guard('web')->logout();
                    $request->session()->invalidate();
                    $request->session()->regenerateToken();

                    return redirect()->route('login')->withErrors([
                        'kernel_panic' => __('Your email it\'s not authorized for use this system, contact the administrator first.'),
                    ]);
                }
            }
        }

        return $next($request);
    }
}
