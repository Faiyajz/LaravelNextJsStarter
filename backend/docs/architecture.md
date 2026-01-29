## Backend Architecture Conventions

This backend follows a module-first structure aligned with Laravel conventions.

### Module boundaries
- **Controllers**: `app/Http/Controllers/Api/{Module}/`
- **Requests**: `app/Http/Requests/{Module}/`
- **Services**: `app/Services/{Module}/`
- **Actions**: `app/Actions/{Module}/`
- **DTOs**: `app/DTOs/{Module}/`
- **Policies**: `app/Policies/{Module}/`

### Responsibilities
- **Controllers**: Validate input (via Requests), authorize (Policies), and orchestrate Actions/Services.
- **Requests**: Input validation only. No business logic.
- **DTOs**: Typed input/output structures for service/action boundaries.
- **Actions**: Single-purpose write operations (create/update/transactional flows).
- **Services**: Read/list/query logic, complex domain workflows, and shared utilities.
- **Policies**: Permission-based authorization (Spatie permissions).

### Authorization
- Permissions are the source of truth (no role checks in code).
- Controllers call `$this->authorize(...)`.
- Routes are guarded with `permission:*` middleware.

### API response shape
- Use `App\Support\ApiResponse` for consistent JSON responses.
- Responses include `request_id` for correlation.

Example error response:
```json
{
  "message": "Validation failed.",
  "errors": {
    "email": ["The email field is required."]
  },
  "request_id": "7b1c1c2a-3a2f-4a0c-9c13-8e6e5c6b8d1f"
}
```

### Error handling
- API exceptions are rendered in a single place (`bootstrap/app.php`) and use the same response shape.
- Validation errors include `errors` and return HTTP 422.

### Testing expectations
- Feature tests should seed permissions and assert both **allowed** and **denied** access.

### Logging
- See `docs/logging.md` for structured logging conventions.
