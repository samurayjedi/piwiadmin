<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use App\Services\BusinessInfoService;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'goauth' => $request->user()->google_account_linked,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
            $request->user()->sendEmailVerificationNotification();
        }

        $request->user()->save();

        return redirect()->route('profile.edit')->with([
            'status' => !$request->user()->email_verified_at
                ? __('A new verification link has been sent to the email address you provided during registration.')
                : null,
        ]);
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        if ($request->user() && 
            $request->user()->google_account_linked && 
            is_null($request->user()->password)) {
            return back()->withErrors(['password' => __('You need establish a password to the account.')]);
        }
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }

    public function update_business_info(BusinessInfoService $info) {
        request()->validate([
            'name' => 'required|string|max:255',
            'rif' => 'required|string|min:8',
            'address' => 'required|string|max:255',
            'business_logo' => 'required|mimes:png',
        ]);
        $path = 'public/images/business_logo';
        // create file where business data are
        $info->update_info([
            'name' => request()->get('name'),
            'rif' => request()->get('rif'),
            'address' => request()->get('address'),
        ]);
        // Delete existing logo files
        $this->deleteExistingLogo($path);
        // Get the uploaded file
        $file = request()->file('business_logo');
        // Generate the new filename
        $extension = $file->getClientOriginalExtension();
        $filename = 'logo.' . $extension;
        // Store the file
        $path = $file->storeAs($path, $filename);
        
        return back();
    }

    /**
     * Delete existing logo files from the directory
     */
    private function deleteExistingLogo(string $directory): void
    {
        // Get all files in the directory
        $files = Storage::files($directory);
        
        foreach ($files as $file) {
            // Check if filename starts with 'logo.'
            $filename = pathinfo($file, PATHINFO_FILENAME);
            if ($filename === 'logo') {
                Storage::delete($file);
            }
        }
    }
}
