<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful;
use App\Http\Middleware\ForceJsonResponse;
use App\Http\Middleware\RequestId;
use App\Http\Middleware\SecurityHeaders;
use App\Support\ApiResponse;
use Spatie\Permission\Middleware\PermissionMiddleware;
use Spatie\Permission\Middleware\RoleMiddleware;
use Spatie\Permission\Middleware\RoleOrPermissionMiddleware;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\HttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )

    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->alias([
            'role' => RoleMiddleware::class,
            'permission' => PermissionMiddleware::class,
            'role_or_permission' => RoleOrPermissionMiddleware::class,
        ]);

        $middleware->api(prepend: [
            RequestId::class,
            ForceJsonResponse::class,
            SecurityHeaders::class,
            EnsureFrontendRequestsAreStateful::class,
        ]);

        $middleware->web(append: [
            RequestId::class,
            SecurityHeaders::class,
        ]);

        // Add CORS configuration
        $middleware->validateCsrfTokens(except: [
            'api/*',
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $modelMessages = [
            \App\Models\Supplier::class => 'Supplier not found.',
            \App\Models\Fabric::class => 'Fabric not found.',
            \App\Models\FabricBarcode::class => 'Barcode not found.',
        ];

        $getModelMessage = function (?string $modelClass) use ($modelMessages): string {
            return $modelMessages[$modelClass] ?? 'Resource not found.';
        };

        $exceptions->render(function (NotFoundHttpException $e, $request) use ($getModelMessage) {
            if (!($request->is('api/*') || $request->expectsJson())) {
                return null;
            }

            $previous = $e->getPrevious();
            $model = $previous instanceof ModelNotFoundException ? $previous->getModel() : null;

            return ApiResponse::error($getModelMessage($model), 404);
        });

        $exceptions->render(function (ModelNotFoundException $e, $request) use ($getModelMessage) {
            if (!($request->is('api/*') || $request->expectsJson())) {
                return null;
            }

            return ApiResponse::error($getModelMessage($e->getModel()), 404);
        });

        $exceptions->render(function (ValidationException $e, $request) {
            if (!($request->is('api/*') || $request->expectsJson())) {
                return null;
            }

            return ApiResponse::error('Validation failed.', $e->status, $e->errors());
        });

        $exceptions->render(function (AuthenticationException $e, $request) {
            if (!($request->is('api/*') || $request->expectsJson())) {
                return null;
            }

            return ApiResponse::error('Unauthenticated.', 401);
        });

        $exceptions->render(function (AuthorizationException $e, $request) {
            if (!($request->is('api/*') || $request->expectsJson())) {
                return null;
            }

            return ApiResponse::error('Forbidden.', 403);
        });

        $exceptions->render(function (HttpException $e, $request) {
            if (!($request->is('api/*') || $request->expectsJson())) {
                return null;
            }

            $status = $e->getStatusCode();
            $message = $e->getMessage() !== '' ? $e->getMessage() : 'Request failed.';

            return ApiResponse::error($message, $status);
        });

        $exceptions->render(function (\Throwable $e, $request) {
            if (!($request->is('api/*') || $request->expectsJson())) {
                return null;
            }

            Log::error('Unhandled exception', [
                'request_id' => $request->attributes->get('request_id'),
                'path' => $request->path(),
                'method' => $request->method(),
                'user_id' => optional($request->user())->id,
                'exception' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            $message = config('app.debug') ? $e->getMessage() : 'Internal server error.';

            return ApiResponse::error($message, 500);
        });
    })->create();
