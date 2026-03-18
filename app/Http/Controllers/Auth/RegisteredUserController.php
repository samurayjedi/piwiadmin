<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Validation\ValidationException;
use App\Models\AuthorizedUser;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);
        if (User::count()) {
            if (!AuthorizedUser::where('email', $request->email)->exists()) {
                return back()->withErrors([
                    'email' => __('Your email it\'s not authorized for use this system, contact the administrator first.'),
                ]);
            }
        }

        $user = User::withTrashed()
            ->where('email', $request->email)
            ->first();
        
        if ($user && $user->trashed()) {
           if (!Hash::check($request->password, $user->password)) {
                throw ValidationException::withMessages([
                    'email' => [__('The email is associated to a disabled account, enter the same password you used before.')],
                    'password' => [__('The provided password does not match our records for this email.')],
                ]);
            }
            $user->restore();
            $user->update([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'email_verified_at' => null,
            ]);
        } else if ($user) {
            return back()->withErrors([
                'email' => __('The email is already in use.'),
            ]);
        } else {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]);
        }

        event(new Registered($user));

        Auth::login($user);

        return redirect(route('dashboard', absolute: false));
    }
}
