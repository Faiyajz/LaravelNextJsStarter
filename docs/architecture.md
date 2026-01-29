# Architecture & Conventions

This document describes the project boundaries, conventions, and error handling for both backend and frontend.

## Backend (Laravel)

### Layering
- **Routes** (`backend/routes/*.php`) define URL structure and middleware only.
- **Controllers** (`backend/app/Http/Controllers`) are thin; they delegate to services and format responses.
- **Form Requests** (`backend/app/Http/Requests`) validate input and authorize access.
- **Services** (`backend/app/Services`) contain business logic and transactions.
- **Models** (`backend/app/Models`) define data relations and query scopes.
- **Support** (`backend/app/Support`) contains API response helpers and cross-cutting utilities.

### Service Boundaries
- Services accept primitive arrays or model instances and return models or simple arrays.
- Do **not** call Eloquent directly from controllers except for simple read-only lookups.
- Keep transactions and side effects (e.g., stock adjustments, image updates) inside services.

### DTOs & Validation
- Request DTOs are **Form Requests**. Controllers should only use `$request->validated()`.
- For lists, use query helpers (`ListQueryService`, model scopes) to keep pagination/filter logic consistent.

### Error Handling
- Use `App\Support\ApiResponse` for successful and error responses.
- Prefer `ValidationException` for user-correctable inputs (returns 422).
- Not-found handling is centralized in `backend/bootstrap/app.php`.

## Frontend (React)

### Layering
- **Pages** (`frontend/src/pages`) compose screens and wire up hooks/services.
- **Components** (`frontend/src/components`) are reusable UI building blocks.
- **Services** (`frontend/src/services`) are the API boundary (HTTP only).
- **Types** (`frontend/src/types`) define API data contracts.
- **Lib** (`frontend/src/lib`) contains shared utilities (API client, hooks, constants).

### Service Boundaries
- Pages **must not** call `axios` directly. Use `src/services/*`.
- `src/lib/api.ts` is the single HTTP configuration point (headers, interceptors).

### DTOs & Validation
- Form schemas live in `frontend/src/schemas`.
- Form values map directly to API request payloads defined in `frontend/src/types`.

### Error Handling
- `src/lib/api.ts` handles global API errors and toast messages.
- UI components should not swallow errors silently—use service errors or `notify`.

## Testing
- Backend tests use `RefreshDatabase` and Sanctum for authenticated flows.
- Frontend tests use `vitest` + Testing Library and mock services at the API boundary.
