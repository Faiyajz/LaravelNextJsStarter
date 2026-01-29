# Backend - Supplier & Fabric Management System

This is a Laravel-powered REST API that handles all the business logic, data storage, and authentication for the Supplier & Fabric Management System.

## Tech Stack

- **Laravel** (latest version) - The PHP framework for web artisans
- **MySQL** - Reliable relational database
- **Laravel Sanctum** - Simple authentication for SPAs
- **Milon Barcode** - Generate barcodes for fabrics
- **UUID Primary Keys** - Better for distributed systems
- **Soft Deletes** - Never lose data accidentally

## Getting Started

### Prerequisites

- PHP 8.1 or higher
- Composer
- MySQL 5.7+
- Laravel CLI (optional but helpful)

### Installation

```bash
# Install dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Configure your database in .env, then run migrations
php artisan migrate --seed

# Create storage symlink for uploaded files
php artisan storage:link

# Start development server
php artisan serve
```

The API will be running at http://localhost:8000

## Environment Variables

Here are the key variables you need to set in `.env`:

```env
APP_NAME="Supplier & Fabric Management"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database_name
DB_USERNAME=your_database_user
DB_PASSWORD=your_database_password

# Frontend URL for CORS
SANCTUM_STATEFUL_DOMAINS=localhost:5173
SESSION_DOMAIN=localhost
```

## Project Structure

```
app/
├── Http/
│   ├── Controllers/
│   │   └── Api/              # API Controllers
│   │       ├── AuthController.php
│   │       ├── SupplierController.php
│   │       ├── FabricController.php
│   │       ├── FabricStockController.php
│   │       └── NoteController.php
│   │
│   ├── Middleware/           # Custom middleware
│   └── Requests/             # Form request validation
│       ├── StoreSupplierRequest.php
│       ├── UpdateSupplierRequest.php
│       ├── StoreFabricRequest.php
│       └── UpdateFabricRequest.php
│
├── Models/                   # Eloquent models
│   ├── User.php
│   ├── Supplier.php
│   ├── Fabric.php
│   ├── FabricStock.php
│   ├── FabricBarcode.php
│   └── Note.php
│
├── Services/                 # Business logic layer
│   ├── SupplierService.php
│   ├── FabricService.php
│   └── ListQueryService.php
│
├── Traits/                   # Reusable traits
│   └── HasUuid.php
│
└── Support/                  # Helper functions
    └── helpers.php

database/
├── factories/                # Model factories for testing
├── migrations/               # Database migrations
└── seeders/                  # Database seeders

routes/
├── api.php                   # API routes
├── web.php                   # Web routes
└── console.php              # Console commands

storage/
├── app/
│   └── public/              # Public file storage (linked)
├── framework/               # Framework cache/sessions
└── logs/                    # Application logs
```

## Database Schema

### Users Table

- Standard Laravel user table with Sanctum tokens

### Suppliers Table

- UUID primary key
- Company information (name, code, country)
- Contact details (email, phone, address)
- Representative information
- Soft deletes enabled
- Timestamps

### Fabrics Table

- UUID primary key
- Foreign key to suppliers
- Basic specs (fabric_no, composition, GSM, quantity)
- Technical details (construction, weave_type, dyeing_method, etc.)
- Image path for uploaded files
- Soft deletes enabled
- Timestamps

### Fabric Stocks Table

- UUID primary key
- Foreign key to fabrics
- Transaction type (IN/OUT)
- Quantity
- Reference/note
- Timestamps

### Fabric Barcodes Table

- UUID primary key
- Foreign key to fabrics
- Barcode value
- Timestamps

### Notes Table (Polymorphic)

- UUID primary key
- Polymorphic relationships (noteable_type, noteable_id)
- Note content
- Foreign key to users (created_by)
- Timestamps

## API Endpoints

All API routes are prefixed with `/api` and protected by Sanctum authentication (except public routes).

## Postman Collection

The Postman collection lives at `docs/postman/Supplier-Fabric-Management.postman_collection.json` in the repo root. Import it into Postman to explore all endpoints with example requests and responses.

### Authentication Routes

```
POST   /api/register          - Register new user
POST   /api/login             - Login and get token
POST   /api/logout            - Logout (revoke token)
GET    /api/user              - Get authenticated user
```

### Supplier Routes (Protected)

```
GET    /api/suppliers                    - List suppliers (with pagination/filters)
POST   /api/suppliers                    - Create supplier
GET    /api/suppliers/{id}               - Get supplier details
PUT    /api/suppliers/{id}               - Update supplier
DELETE /api/suppliers/{id}               - Soft delete supplier
POST   /api/suppliers/{id}/restore       - Restore deleted supplier
GET    /api/suppliers-trash              - List trashed suppliers
```

**Query Parameters for List:**

- `page` - Page number (default: 1)
- `per_page` - Items per page (default: 10)
- `search` - Search across multiple fields
- `country` - Filter by country
- `company_name` - Filter by company name
- `representative_name` - Filter by representative

### Fabric Routes (Protected)

```
GET    /api/fabrics                      - List fabrics (with pagination/filters)
POST   /api/fabrics                      - Create fabric (with image upload)
GET    /api/fabrics/{id}                 - Get fabric details
PUT    /api/fabrics/{id}                 - Update fabric (with image upload)
DELETE /api/fabrics/{id}                 - Soft delete fabric
POST   /api/fabrics/{id}/restore         - Restore deleted fabric
GET    /api/fabrics-trash                - List trashed fabrics
```

**Query Parameters for List:**

- `page` - Page number
- `per_page` - Items per page
- `search` - Search across multiple fields
- `supplier` - Filter by supplier ID
- `fabric_no` - Filter by fabric number
- `composition` - Filter by composition
- `production_type` - Filter by production type

### Fabric Stock Routes (Protected)

```
POST   /api/fabric-stocks                - Add stock transaction (IN/OUT)
```

**Request Body:**

```json
{
  "fabric_id": "uuid",
  "type": "IN", // or "OUT"
  "quantity": 100,
  "reference": "Challan #12345"
}
```

**Response:**

```json
{
  "stock": { /* stock record */ },
  "available_balance": 1500
}
```

### Barcode Routes

```
GET    /api/fabrics/{fabricId}/barcodes/{barcodeId}/print  - Print barcode (PUBLIC)
```

**Note:** This endpoint is public (no auth required) so it can be opened in a new window for printing.

### Notes Routes (Protected)

```
POST   /api/notes                        - Add note to supplier/fabric
```

**Request Body:**

```json
{
  "noteable_type": "supplier", // or "fabric"
  "noteable_id": "uuid",
  "note": "Your note content here"
}
```

## Key Features

### UUID Primary Keys

All models use UUIDs instead of auto-incrementing integers:

```php
use App\Traits\HasUuid;

class Supplier extends Model
{
    use HasUuid;

    protected $keyType = 'string';
    public $incrementing = false;
}
```

### Soft Deletes

Models use Laravel's soft delete feature:

```php
use Illuminate\Database\Eloquent\SoftDeletes;

class Supplier extends Model
{
    use SoftDeletes;
}
```

This means deleted records aren't actually removed from the database - they're just marked as deleted and can be restored.

### Service Layer Pattern

Business logic is kept in service classes instead of controllers:

```php
// app/Services/FabricService.php
class FabricService
{
    public function createWithDefaultBarcode(array $data): Fabric
    {
        return DB::transaction(function () use ($data) {
            // Create fabric
            $fabric = Fabric::create($data);

            // Generate barcode
            $barcode = FabricBarcode::create([
                'fabric_id' => $fabric->id,
                'barcode_value' => $fabric->fabric_no,
            ]);

            // Create initial stock entry if quantity > 0
            if ($fabric->qty > 0) {
                FabricStock::create([
                    'fabric_id' => $fabric->id,
                    'type' => 'IN',
                    'quantity' => $fabric->qty,
                    'reference' => 'Initial stock entry',
                ]);
            }

            return $fabric->fresh(['supplier', 'barcodes']);
        });
    }
}
```

### Form Request Validation

All input validation happens in Form Request classes:

```php
// app/Http/Requests/StoreFabricRequest.php
class StoreFabricRequest extends FormRequest
{
    public function rules()
    {
        return [
            'supplier_id' => 'required|exists:suppliers,id',
            'fabric_no' => 'required|string|max:255|unique:fabrics,fabric_no',
            'composition' => 'required|string',
            'gsm' => 'required|numeric|min:0',
            'qty' => 'required|numeric|min:0',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            // ... more rules
        ];
    }
}
```

### Image Upload Handling

Images are stored in `storage/app/public/fabric-images`:

```php
if ($request->hasFile('image')) {
    $path = $request->file('image')->store('fabric-images', 'public');
    $data['image_path'] = $path;
}
```

Access via: `http://localhost:8000/storage/fabric-images/filename.jpg`

### Helper Functions

Common calculations are extracted to helper functions:

```php
// app/Support/helpers.php
function calculateFabricBalance(string $fabricId): float
{
    return FabricStock::where('fabric_id', $fabricId)
        ->selectRaw("
            SUM(CASE WHEN type = 'IN' THEN quantity ELSE 0 END) - 
            SUM(CASE WHEN type = 'OUT' THEN quantity ELSE 0 END) as balance
        ")
        ->value('balance') ?? 0;
}
```

### Polymorphic Relationships

Notes can belong to either suppliers or fabrics:

```php
// app/Models/Note.php
public function noteable()
{
    return $this->morphTo();
}

// app/Models/Supplier.php
public function notes()
{
    return $this->morphMany(Note::class, 'noteable');
}

// app/Models/Fabric.php
public function notes()
{
    return $this->morphMany(Note::class, 'noteable');
}
```

## Common Tasks

### Running Migrations

```bash
# Run all migrations
php artisan migrate

# Rollback last migration
php artisan migrate:rollback

# Rollback all and re-run
php artisan migrate:fresh

# With seeders
php artisan migrate:fresh --seed
```

### Seeding Data

```bash
# Run all seeders
php artisan db:seed

# Run specific seeder
php artisan db:seed --class=SupplierSeeder
```

### Creating New Resources

```bash
# Create model with migration, factory, and controller
php artisan make:model YourModel -mfc

# Create form request
php artisan make:request StoreYourModelRequest

# Create service
php artisan make:class Services/YourModelService
```

### Clearing Caches

```bash
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
```

### Queue Workers (if using queues)

```bash
php artisan queue:work
```

## Testing

We have factories set up for testing:

```bash
# Run tests
php artisan test

# Run specific test
php artisan test --filter=SupplierTest
```

## Security

### Authentication

- Uses Laravel Sanctum for SPA authentication
- Tokens are issued on login and stored in frontend
- All protected routes use `auth:sanctum` middleware

### Authorization

Add authorization logic in controllers or policies as needed:

```php
if ($request->user()->cannot('update', $supplier)) {
    abort(403);
}
```

### Input Validation

- All inputs validated via Form Requests
- SQL injection prevented by Eloquent ORM
- XSS protection via Laravel's default escaping

### File Upload Security

- File type validation (only images)
- Max file size limit (2MB)
- Stored in non-public directory with symlink

## Performance Tips

1. **Eager Loading** - Always eager load relationships:

```php
$fabrics = Fabric::with(['supplier', 'barcodes'])->get();
```

2. **Query Optimization** - Use `select()` to limit columns:

```php
$suppliers = Supplier::select('id', 'company_name')->get();
```

3. **Caching** - Cache expensive queries:

```php
$suppliers = Cache::remember('suppliers', 3600, function () {
    return Supplier::all();
});
```

4. **Database Indexing** - Add indexes to frequently queried columns in migrations:

```php
$table->index('fabric_no');
$table->index('supplier_id');
```

## Troubleshooting

**"Storage link already exists" error?**

```bash
rm public/storage
php artisan storage:link
```

**CORS issues?**

- Check `config/cors.php` settings
- Make sure `SANCTUM_STATEFUL_DOMAINS` in `.env` includes your frontend domain

**Database connection failed?**

- Verify `.env` database credentials
- Make sure MySQL is running
- Check database exists: `mysql -u root -p -e "CREATE DATABASE your_db_name;"`

**Token mismatch errors?**

- Clear Laravel caches: `php artisan cache:clear`
- Clear browser cookies
- Regenerate app key: `php artisan key:generate`

**Upload errors?**

- Check storage directory permissions: `chmod -R 775 storage`
- Verify `storage/app/public` exists
- Ensure symlink is created: `php artisan storage:link`

## API Response Format

### Success Response

```json
{
  "message": "Supplier created successfully",
  "data": { /* resource data */ }
}
```

### Error Response

```json
{
  "message": "Validation failed",
  "errors": {
    "email": ["The email field is required."]
  }
}
```

### Paginated Response

```json
{
  "data": [ /* array of items */ ],
  "meta": {
    "current_page": 1,
    "last_page": 5,
    "per_page": 10,
    "total": 50
  }
}
```

## Best Practices

1. **Use Form Requests** - Never validate in controllers
2. **Use Services** - Keep controllers thin, business logic in services
3. **Use Transactions** - For operations that modify multiple tables
4. **Eager Load** - Prevent N+1 query problems
5. **Type Hint** - Always type hint method parameters and returns
6. **Document** - Add docblocks to complex methods
7. **Test** - Write tests for critical functionality
