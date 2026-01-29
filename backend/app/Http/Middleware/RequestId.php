<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

class RequestId
{
    public const HEADER = 'X-Request-Id';

    public function handle(Request $request, Closure $next): Response
    {
        $requestId = $request->headers->get(self::HEADER) ?? (string) Str::uuid();
        $request->attributes->set('request_id', $requestId);

        Log::withContext([
            'request_id' => $requestId,
            'path' => $request->path(),
            'method' => $request->method(),
        ]);

        $response = $next($request);
        $response->headers->set(self::HEADER, $requestId);

        return $response;
    }
}
