<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no" />

        <title>{{ config('app.name') }}</title>

        <link rel="stylesheet" href="{{ _asset('css/__backoffice/vendor.css') }}">
        <link rel="stylesheet" href="{{ _asset('css/__backoffice/app.css') }}">
    </head>

    <body>
        <div id="root"></div>

        <script src="{{ _asset('js/__backoffice/vendor.js') }}"></script>
        <script src="{{ _asset('js/__backoffice/app.js') }}"></script>
    </body>
</html>