<x-mail::message :subcopy="__('This password reset link will expire in :count minutes, if you did not request a password reset, no further action is required.', ['count' => config('auth.passwords.'.config('auth.defaults.passwords').'.expire')])">
<h1>{{ __('Reset Password Notification') }}</h1>
<p>{{ __('You are receiving this email because we received a password reset request for your account.') }}</p>
<x-mail::button :url="url(route('password.reset', ['token' => $token, 'email' => $email], false))">
{{ __('Reset Password') }}
</x-mail::button>
</x-mail::message>