<?php

return [
    'rate_limits' => [
        'auth_per_minute' => (int) env('AUTH_RATE_LIMIT_PER_MINUTE', 5),
        'api_per_minute' => (int) env('API_RATE_LIMIT_PER_MINUTE', 60),
    ],

    'email_verification' => [
        'enabled' => (bool) env('AUTH_EMAIL_VERIFICATION', false),
    ],

    'captcha' => [
        'enabled' => (bool) env('AUTH_CAPTCHA_ENABLED', false),
        // Supported drivers: none, hcaptcha, recaptcha
        'driver' => env('AUTH_CAPTCHA_DRIVER', 'none'),
        'secret' => env('AUTH_CAPTCHA_SECRET'),
    ],
];
