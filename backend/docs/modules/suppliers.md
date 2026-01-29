## Suppliers Module

**Owner:** Backend team  
**Purpose:** Supplier CRUD, search, and notes.

### Public endpoints
- `GET /api/suppliers`
- `GET /api/suppliers/{id}`
- `POST /api/suppliers`
- `PUT/PATCH /api/suppliers/{id}`
- `DELETE /api/suppliers/{id}`
- `GET /api/suppliers-trash`
- `POST /api/suppliers/{id}/restore`
- `POST /api/notes` (supplier notes)

### Contracts
- DTOs: `App\DTOs\Suppliers\SupplierData`, `App\DTOs\Suppliers\SupplierFilterData`
- Services: `App\Services\Suppliers\SupplierService`
- Actions: `App\Actions\Suppliers\CreateSupplier`, `App\Actions\Suppliers\UpdateSupplier`
- Policy: `App\Policies\Suppliers\SupplierPolicy`

### Permissions
See `docs/permissions.md`.
