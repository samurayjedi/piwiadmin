<x-mail::message :subcopy="__('messages.verification_email_subcopy', ['app' => config('app.name')])">
<h1>{{ __('Verify Email Address') }}</h1>
<p>{{ __('messages.verification_email', ['app' => config('app.name')]) }}</p>
<x-mail::button :url="url($url, false)">
{{ __('Verify Email') }}
</x-mail::button>
</x-mail::message>
