<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Mail;
use App\Mail\PasswordResetEmail;

class PasswordResetLinkController extends Controller
{
    /**
     * Display the password reset link request view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/ForgotPassword', [
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming password reset link request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        /* In theory, it's not necesary the use of the second callback argument, but
         * for some fuck reason, when i leave as default, it throws me the error:
         * DOMDocument::loadHTML(): Argument #1 ($source) must not be empty.
         * for that reason, i manually send the email, check Illuminate\Auth\Passwords\PasswordBroker,
         * Password::sendResetLink inherit from there, and there already check that the email exists, etc, etc,
         * only the callback is trigered when all is successful, the callback have 2 entries or parameters,
         * the first is the user (Illuminate\Contracts\Auth\CanResetPassword) and the second its the generated token (string).
        */
        /*
         * no necesary, i moved this functionallity to app/providers/AppServiceProvider
        $status = Password::sendResetLink($request->only('email'), function ($user, $token) {
            $email = $user->getEmailForPasswordReset();
            Mail::to($email)->send(new PasswordResetEmail($token, $email));
        }); */
        $status = Password::sendResetLink($request->only('email'));

        if ($status == Password::RESET_LINK_SENT) {
            // return back()->with('status', __($status));
            return redirect('login')->with('status', __($status));
        }

        throw ValidationException::withMessages([
            'email' => [trans($status)],
        ]);
    }
}
