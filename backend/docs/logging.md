## Logging Conventions

### Required fields
Every API log entry should include:
- `request_id`
- `path`
- `method`
- `user_id` (when available)

### Correlation IDs
`RequestId` middleware sets `X-Request-Id` and injects `request_id` into all API responses.
Use this value to correlate client errors with server logs.

### Error logging
Unhandled exceptions are logged with full context in `bootstrap/app.php`.
