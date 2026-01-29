<?php

namespace App\Support;

use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Http\JsonResponse;

class ApiResponse
{
    private static function withRequestId(array $payload): array
    {
        $requestId = request()->attributes->get('request_id');
        if ($requestId) {
            $payload['request_id'] = $requestId;
        }

        return $payload;
    }

    public static function data(mixed $data, ?string $message = null, int $status = 200): JsonResponse
    {
        $payload = ['data' => $data];
        if ($message !== null) {
            $payload['message'] = $message;
        }

        return response()->json(self::withRequestId($payload), $status);
    }

    public static function paginated(LengthAwarePaginator $paginator, ?string $message = null): JsonResponse
    {
        $payload = [
            'data' => $paginator->getCollection()->values(),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
            ],
        ];

        if ($message !== null) {
            $payload['message'] = $message;
        }

        return response()->json(self::withRequestId($payload));
    }

    public static function error(string $message, int $status, ?array $errors = null): JsonResponse
    {
        $payload = ['message' => $message];
        if ($errors !== null) {
            $payload['errors'] = $errors;
        }

        return response()->json(self::withRequestId($payload), $status);
    }
}
