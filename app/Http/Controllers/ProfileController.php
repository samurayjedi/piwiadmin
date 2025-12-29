<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
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
        }

        $request->user()->save();

        return Redirect::route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
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

    public function update_business_info() {
        request()->validate([
            'business_name' => 'required|string|max:255',
            'business_logo' => 'required|mimes:png',
        ]);
        $path = 'public/images/business_logo';
        // create file where business_name are
        $result = file_put_contents(public_path("storage/images/business_logo/business_name.txt"), request()->get('business_name'));
        if (!$result) {
            return back()->withErrors([
                'business_name' => __('Unknown error writting business name file container.')
            ]);
        }
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
