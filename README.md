# LaravelNextJsStarter

A full-stack starter template that pairs a Laravel API with a React (Vite) frontend. It includes role-aware admin + buyer experiences, a modular frontend architecture, and a permission-first backend. This repo is designed to scale as a production application while keeping local development simple.

## What’s Included

**Frontend**
- React 19 + TypeScript (Vite)
- Modular routes and feature folders (`admin`, `buyer`, `public`, `shared`)
- Shared design system layer
- TanStack Query, Formik, Yup, Tailwind CSS

**Backend**
- Laravel API with Sanctum auth
- Spatie roles/permissions + policies + route middleware
- DTO-based request handling and service layer
- UUID primary keys, soft deletes
- Rate limiting and consistent API error shape

## Quick Start

### Prerequisites
- PHP 8.1+ and Composer
- Node 18+ and npm
- MySQL 5.7+

### Backend
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan storage:link
php artisan serve
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

### URLs
- Frontend: http://localhost:5173
- API: http://localhost:8000

## Project Structure

```
LaravelNextJsStarter/
├── backend/
│   ├── app/
│   │   ├── Actions/
│   │   ├── DTOs/
│   │   ├── Http/
│   │   │   ├── Controllers/Api/
│   │   │   └── Requests/
│   │   ├── Models/
│   │   ├── Policies/
│   │   └── Services/
│   ├── database/
│   └── routes/
└── frontend/
    ├── src/
    │   ├── modules/
    │   │   ├── admin/
    │   │   ├── buyer/
    │   │   ├── public/
    │   │   └── shared/
    │   └── routes/
    └── public/
```

## Default Credentials (Dev)

The database seeder creates a default user account:
- **Email:** test@example.com
- **Password:** password

## Common Commands

**Backend**
```bash
php artisan migrate
php artisan db:seed
php artisan config:clear
php artisan cache:clear
```

**Frontend**
```bash
npm run dev
npm run build
npm run lint
```

## Documentation

- `docs/architecture.md` — architecture, conventions, error handling
- `docs/postman/Supplier-Fabric-Management.postman_collection.json` — API collection
- `backend/README.md` — backend details
- `frontend/README.md` — frontend details

## Notes on Permissions

Routes are permission-guarded. If you add a new feature module, you should:
1) Define permissions in `PermissionSeeder`
2) Assign permissions to roles in `RolePermissionSeeder`
3) Add policy checks and/or permission middleware on routes

## License

Open source. Use, modify, and distribute as needed.
