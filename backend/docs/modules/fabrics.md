## Fabrics Module

**Owner:** Backend team  
**Purpose:** Fabric CRUD, stock adjustments, barcode generation, and notes.

### Public endpoints
- `GET /api/fabrics`
- `GET /api/fabrics/{id}`
- `POST /api/fabrics`
- `PUT/PATCH /api/fabrics/{id}`
- `DELETE /api/fabrics/{id}`
- `GET /api/fabrics-trash`
- `POST /api/fabrics/{id}/restore`
- `POST /api/fabric-stocks`
- `POST /api/notes` (fabric notes)

### Contracts
- DTOs: `App\DTOs\Fabrics\FabricData`, `App\DTOs\Fabrics\FabricFilterData`, `App\DTOs\Fabrics\FabricStockData`
- Services: `App\Services\Fabrics\FabricService`, `App\Services\Fabrics\FabricStockService`
- Actions: `App\Actions\Fabrics\CreateFabric`, `App\Actions\Fabrics\UpdateFabric`, `App\Actions\Fabrics\CreateFabricStock`
- Policy: `App\Policies\Fabrics\FabricPolicy`

### Permissions
See `docs/permissions.md`.
