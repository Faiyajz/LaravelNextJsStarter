## Permission Matrix

Permissions are defined in `database/seeders/PermissionSeeder.php` and enforced via:
- Route middleware `permission:*`
- Policies in `app/Policies`

### Roles
- **admin**: all permissions
- **buyer**: limited read + notes

### Permissions
| Permission | Description | Routes | Policy |
| --- | --- | --- | --- |
| suppliers.view | View suppliers | GET `/api/suppliers`, GET `/api/suppliers/{id}` | SupplierPolicy::viewAny/view |
| suppliers.create | Create supplier | POST `/api/suppliers` | SupplierPolicy::create |
| suppliers.update | Update supplier | PUT/PATCH `/api/suppliers/{id}` | SupplierPolicy::update |
| suppliers.delete | Delete supplier | DELETE `/api/suppliers/{id}` | SupplierPolicy::delete |
| suppliers.trash.view | View supplier trash | GET `/api/suppliers-trash` | SupplierPolicy::viewTrash |
| suppliers.restore | Restore supplier | POST `/api/suppliers/{id}/restore` | SupplierPolicy::restore |
| suppliers.notes.create | Create supplier note | POST `/api/notes` (supplier) | NotePolicy::createForSupplier |
| fabrics.view | View fabrics | GET `/api/fabrics`, GET `/api/fabrics/{id}` | FabricPolicy::viewAny/view |
| fabrics.create | Create fabric | POST `/api/fabrics` | FabricPolicy::create |
| fabrics.update | Update fabric | PUT/PATCH `/api/fabrics/{id}` | FabricPolicy::update |
| fabrics.delete | Delete fabric | DELETE `/api/fabrics/{id}` | FabricPolicy::delete |
| fabrics.trash.view | View fabric trash | GET `/api/fabrics-trash` | FabricPolicy::viewTrash |
| fabrics.restore | Restore fabric | POST `/api/fabrics/{id}/restore` | FabricPolicy::restore |
| fabrics.stocks.create | Create stock movement | POST `/api/fabric-stocks` | FabricPolicy::createStock |
| fabrics.notes.create | Create fabric note | POST `/api/notes` (fabric) | NotePolicy::createForFabric |

### Notes
- The `notes` endpoint uses `noteable_type` to determine which permission applies.
- Roles are only used for grouping permissions; code checks permissions only.
