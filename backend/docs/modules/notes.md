## Notes Module

**Owner:** Backend team  
**Purpose:** Attach notes to suppliers or fabrics.

### Public endpoints
- `POST /api/notes`

### Contracts
- DTOs: `App\DTOs\Notes\NoteData`
- Actions: `App\Actions\Notes\CreateNote`
- Policy: `App\Policies\Notes\NotePolicy`

### Permissions
- `suppliers.notes.create`
- `fabrics.notes.create`
