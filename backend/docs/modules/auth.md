## Auth Module

**Owner:** Backend team  
**Purpose:** Authentication, token issuance, and optional email verification.

### Public endpoints
- `POST /api/register`
- `POST /api/login`
- `POST /api/logout`
- `GET /api/user`
- `POST /api/email/verification-notification`
- `GET /api/email/verify/{id}/{hash}`

### Contracts
- DTOs: `App\DTOs\Auth\LoginData`, `App\DTOs\Auth\RegisterData`
- Actions: `App\Actions\Auth\LoginUser`, `App\Actions\Auth\RegisterUser`

### Security notes
- Rate limited via `throttle:auth`
- Optional CAPTCHA + email verification hooks (see `config/security.php`)
