<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;

class GoogleAuthController extends Controller {
    public function redirect() {
        $action = request()->get('action', 'login');
        if ($action === 'link' && auth()->user()) {
            $id = auth()->user()->id;
            session(['goauth_linking_account_id' => $id]);
        }
        session(['goauth_action' => $action]);
        
        return Socialite::driver('google')->redirect();
    }

    public function callback() {
        $action = session('goauth_action');
        session()->forget(['goauth_action']);
        $route = $action === 'link' ? 'profile.edit' : $action;
        try {
            $googleUser = Socialite::driver('google')->user();
            $email = $googleUser->getEmail();
            if ($action === 'link') {
                $userLoggedId = session('goauth_linking_account_id');
                session()->forget(['goauth_linking_account_id']);
                $userLogged = User::find($userLoggedId);
                if ($userLogged->email !== $email) {
                    return redirect()
                        ->route('profile.edit')
                        ->withErrors([
                            'kernel_panic' => __('Email registered and selected in google do not math.'),
                        ]);
                }

                $userLogged->google_account_linked = true;
                $userLogged->save();

                return back();
            }
            /** If the user are login, check first if its account is linked to google
             * if not, returns error
             */
            $user = User::where('email', $email)->first();
            if ($user && !$user->google_account_linked) {
                return redirect()
                    ->route($route)
                    ->withErrors([
                        'kernel_panic' => $action === 'register'
                            ? __('The email it\'s already registered and the account is not linked to google.')
                            : __('Account is not linked to google.'),
                    ]);
            }
            /** Login or register the user */
            $userNotRegistered = !$user;
            $user = User::updateOrCreate(
                ['email' => $email],
                [
                    'google_id' => $googleUser->getId(),
                    'name' => $googleUser->getName(),
                    'email_verified_at' => now(),
                ]
            );
            if ($userNotRegistered) {
                $user->markEmailAsVerified();
                $user->google_account_linked = true;
                $user->save();
                event(new Registered($user));
            }

            Auth::login($user);
            
            return redirect('/dashboard');
            
        } catch (\Exception $e) {
            \Log::error('Socialite Error: ' . $e->getMessage());
            
            return redirect()
                ->route($route)
                ->withErrors(['kernel_panic' => __('Google authentication failed.')]);
        }
    }
}
