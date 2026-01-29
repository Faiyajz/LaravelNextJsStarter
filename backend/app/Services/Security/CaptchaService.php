<?php

namespace App\Services\Security;

use Illuminate\Support\Facades\Http;
use Illuminate\Validation\ValidationException;

class CaptchaService
{
    public function assertValid(?string $token, ?string $ip = null): void
    {
        if (!config('security.captcha.enabled')) {
            return;
        }

        if (!$token) {
            throw ValidationException::withMessages([
                'captcha_token' => ['Captcha token is required.'],
            ]);
        }

        $driver = (string) config('security.captcha.driver', 'none');
        if ($driver === 'none') {
            if (app()->environment('production')) {
                throw ValidationException::withMessages([
                    'captcha_token' => ['Captcha is enabled but no driver is configured.'],
                ]);
            }

            return;
        }

        $secret = (string) config('security.captcha.secret', '');
        if ($secret === '') {
            throw ValidationException::withMessages([
                'captcha_token' => ['Captcha secret is missing.'],
            ]);
        }

        $verified = match ($driver) {
            'hcaptcha' => $this->verifyHcaptcha($token, $secret, $ip),
            'recaptcha' => $this->verifyRecaptcha($token, $secret, $ip),
            default => false,
        };

        if (!$verified) {
            throw ValidationException::withMessages([
                'captcha_token' => ['Captcha validation failed.'],
            ]);
        }
    }

    private function verifyHcaptcha(string $token, string $secret, ?string $ip): bool
    {
        $response = Http::asForm()->post('https://hcaptcha.com/siteverify', [
            'secret' => $secret,
            'response' => $token,
            'remoteip' => $ip,
        ]);

        return (bool) ($response->json('success') ?? false);
    }

    private function verifyRecaptcha(string $token, string $secret, ?string $ip): bool
    {
        $response = Http::asForm()->post('https://www.google.com/recaptcha/api/siteverify', [
            'secret' => $secret,
            'response' => $token,
            'remoteip' => $ip,
        ]);

        return (bool) ($response->json('success') ?? false);
    }
}
