<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasPermission
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $permission): Response
    {
        $user = auth()->user();
        if ($user) {
            if ($user->id !== 1) {
                if ($user->hasPermission($permission)) {
                    return $next($request);
                }

                $errors = [
                    'kernel_panic' => __("The users doesn't have permission for: \"permission\", contact the administrator.", [
                        'permission' => __($permission),
                    ]),
                ];
                $referer = $request->headers->get('referer');
                if ($referer && str_starts_with($referer, config('app.url'))) {
                    return back()->withErrors($errors);
                }

                return redirect()->route('dashboard')->withErrors($errors);
            }
        }

        return $next($request);
    }
}
