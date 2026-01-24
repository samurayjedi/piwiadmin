<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Auth\Middleware\RequirePassword as BaseRequirePassword;

class RequirePassword extends BaseRequirePassword
{
    /**
     * Handle an incoming request.
     */
    public function handle($request, Closure $next, $redirectToRoute = null, $passwordTimeoutSeconds = null)
    {
        // Skip password confirmation for Google OAuth users without passwords
        if ($request->user() && 
            $request->user()->google_account_linked && 
            is_null($request->user()->password)) {
            return $next($request);
        }
        
        return parent::handle($request, $next, $redirectToRoute, $passwordTimeoutSeconds);
    }
}