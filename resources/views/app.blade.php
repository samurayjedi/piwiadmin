<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @routes
        <?php
        $appFilePath = public_path().'/js/app.bundle.js';
        $uri = file_exists($appFilePath) ? '/js' : 'http://localhost:3000'; ?>
        <!-- <script defer="defer" src="<?= $uri ?>/vendors-app.bundle.js"></script> -->
        <script defer="defer" src="<?= $uri ?>/app.bundle.js"></script>
        <!-- <script defer="defer" src="<?= $uri ?>/runtime.bundle.js"></script> -->
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
