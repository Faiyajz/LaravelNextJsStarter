<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Actions\Auth\LoginUser;
use App\Actions\Auth\LoginBuyerUser;
use App\Actions\Auth\RegisterUser;
use App\DTOs\Auth\LoginData;
use App\DTOs\Auth\RegisterData;
use App\Models\User;
use App\Services\Security\CaptchaService;
use App\Support\ApiResponse;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Symfony\Component\HttpFoundation\Response;

class AuthController extends Controller
{
    /**
     * Register a new user
     */
    public function register(Request $request, RegisterUser $registerUser, CaptchaService $captcha)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $captcha->assertValid($request->input('captcha_token'), $request->ip());

        $requireVerification = (bool) config('security.email_verification.enabled', false);
        $result = $registerUser(RegisterData::fromArray($data), !$requireVerification);

        if ($requireVerification) {
            $result['user']->sendEmailVerificationNotification();
        }

        return ApiResponse::data(
            data: [
                'user' => $result['user']->load('roles'),
                'token' => $result['token'],
                'verification_required' => $requireVerification,
            ],
            message: 'User registered successfully',
            status: Response::HTTP_CREATED
        );
    }

    /**
     * Login user
     */
    public function login(Request $request, LoginUser $loginUser, CaptchaService $captcha)
    {
        $data = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $captcha->assertValid($request->input('captcha_token'), $request->ip());
        $result = $loginUser(LoginData::fromArray($data));

        return ApiResponse::data(
            data: [
                'user' => $result['user']->load('roles'),
                'token' => $result['token'],
            ],
            message: 'Login successful'
        );
    }

    /**
     * Register a buyer
     */
    public function registerBuyer(Request $request, RegisterUser $registerUser, CaptchaService $captcha)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'company_name' => ['required', 'string', 'max:255'],
            'country' => ['required', 'string', 'max:100'],
            'phone' => ['nullable', 'string', 'max:50'],
        ]);

        $captcha->assertValid($request->input('captcha_token'), $request->ip());

        $requireVerification = (bool) config('security.email_verification.enabled', false);
        $result = $registerUser(RegisterData::fromArray([
            ...$data,
            'account_type' => 'buyer',
        ]), !$requireVerification);

        if ($requireVerification) {
            $result['user']->sendEmailVerificationNotification();
        }

        return ApiResponse::data(
            data: [
                'user' => $result['user']->load('roles'),
                'token' => $result['token'],
                'verification_required' => $requireVerification,
            ],
            message: 'Buyer registered successfully',
            status: Response::HTTP_CREATED
        );
    }

    /**
     * Login buyer
     */
    public function loginBuyer(Request $request, LoginBuyerUser $loginBuyerUser, CaptchaService $captcha)
    {
        $data = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $captcha->assertValid($request->input('captcha_token'), $request->ip());
        $result = $loginBuyerUser($data['email'], $data['password']);

        return ApiResponse::data(
            data: [
                'user' => $result['user']->load('roles'),
                'token' => $result['token'],
            ],
            message: 'Buyer login successful'
        );
    }

    /**
     * Logout user
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return ApiResponse::data(
            data: null,
            message: 'Successfully logged out'
        );
    }

    /**
     * Get authenticated user
     */
    public function user(Request $request)
    {
        return ApiResponse::data($request->user()->load('roles'));
    }

    public function verifyEmail(Request $request, string $id, string $hash)
    {
        if (!config('security.email_verification.enabled')) {
            abort(Response::HTTP_NOT_FOUND);
        }

        $user = User::query()->findOrFail($id);

        if (!hash_equals(sha1($user->getEmailForVerification()), $hash)) {
            abort(Response::HTTP_FORBIDDEN);
        }

        if ($user->hasVerifiedEmail()) {
            return ApiResponse::data(null, 'Email already verified.');
        }

        if ($user->markEmailAsVerified()) {
            event(new Verified($user));
        }

        return ApiResponse::data(null, 'Email verified.');
    }

    public function resendVerification(Request $request)
    {
        if (!config('security.email_verification.enabled')) {
            abort(Response::HTTP_NOT_FOUND);
        }

        $data = $request->validate([
            'email' => 'required|email',
        ]);

        $user = User::query()->where('email', $data['email'])->first();

        if ($user && !$user->hasVerifiedEmail()) {
            $user->sendEmailVerificationNotification();
        }

        return ApiResponse::data(null, 'If your email is eligible, a verification message has been sent.');
    }
}
