# Supplier & Fabric Management System

A comprehensive enterprise resource planning (ERP) module designed for managing textile suppliers, fabrics, and inventory operations. This full-stack application provides a robust solution for fabric sourcing, inventory tracking, and supplier relationship management.

## Overview

The Supplier & Fabric Management System is a professional-grade application that streamlines the management of supplier information, fabric specifications, inventory control, and barcode generation. The system is designed to handle complex textile business operations with efficiency and precision.

### Core Features

- **Supplier Management** - Comprehensive supplier database with contact information, company details, and representative management
- **Fabric Catalog** - Detailed fabric specification tracking including composition, GSM, color codes, and production types
- **Image Management** - Upload and store fabric images with secure storage integration
- **Barcode Generation** - Automated barcode generation and printing capabilities for inventory tracking
- **Stock Management** - Real-time inventory control with IN/OUT transaction tracking and running balance calculations
- **Notes System** - Polymorphic note-taking functionality for suppliers and fabrics
- **Soft Delete & Restore** - Data recovery capabilities with soft delete implementation
- **Advanced Filtering** - Comprehensive search and filtering across all data entities
- **Responsive Design** - Cross-platform compatibility for desktop, tablet, and mobile devices

## Technical Architecture

**Frontend:**
- React 19 with TypeScript
- Vite for blazing-fast builds
- TanStack Query for server state
- Formik + Yup for forms
- Tailwind CSS for styling
- React Hot Toast for notifications

**Backend:**
- Laravel (latest version)
- MySQL database
- Laravel Sanctum for authentication
- UUID primary keys
- Soft deletes for safe data management

## Getting Started

### Prerequisites

- PHP 8.1 or higher
- Composer
- Node.js 18+ and npm
- MySQL 5.7+
- Command-line interface

### Installation Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Devvify/supplier-fabric-management-system.git
   cd supplier-fabric-management-system
   ```

2. **Backend setup:**
   ```bash
   cd backend
   composer install
   cp .env.example .env
   php artisan key:generate
   ```
   
   Configure your database credentials in the `.env` file, then execute:
   ```bash
   php artisan migrate --seed
   php artisan storage:link
   php artisan serve
   ```

3. **Frontend setup:**
   ```bash
   cd ../frontend
   npm install
   cp .env.example .env
   ```
   
   Configure the `.env` file with your backend API URL, then start the development server:
   ```bash
   npm run dev
   ```

4. **Access the application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000

## Project Structure

```
supplier-fabric-management-system/
├── backend/           # Laravel API
│   ├── app/          # Application code
│   ├── database/     # Migrations & seeders
│   ├── routes/       # API routes
│   └── storage/      # Uploaded files
│
└── frontend/         # React app
    ├── src/
    │   ├── components/  # Reusable UI components
    │   ├── pages/       # Page components
    │   ├── services/    # API calls
    │   ├── types/       # TypeScript types
    │   └── config/      # Table columns & configs
    └── public/          # Static assets
```

## Key Features Explained

###Detailed Feature Documentation

### Supplier Management
The supplier management module provides complete CRUD operations with advanced search and filtering capabilities. Suppliers can be categorized by country, company name, and representative details. The system implements soft delete functionality, allowing for data recovery from the trash management interface.

### Fabric Management
The fabric catalog supports comprehensive specification tracking:
- Basic specifications (fabric number, composition, GSM)
- Technical characteristics (construction, weave type, dyeing methods)
- Production parameters (lead time, minimum order quantity, shrinkage percentage)
- Image attachments for visual reference
- Automated barcode generation upon creation

### Stock Tracking
Each fabric maintains an independent stock ledger with:
- **IN transactions** - Stock receipt recording for incoming shipments
- **OUT transactions** - Stock issuance for production or distribution
- **Running balance** - Real-time available quantity calculation
- **Validation** - System-enforced constraints preventing negative stock levels

### Barcode System
The system Credentials

The database seeder creates a default user account for initial access:
- **Email:** test@example.com
- **Password:** password

**Important:** Change these credentials immediately in production environments.

## API Documentation

A comprehensive Postman collection is included at `docs/postman/Supplier-Fabric-Management.postman_collection.json`. This collection contains all available API endpoints with example requests and responses. Import the collection into Postman for API testing and integration development.

## Common Operations

**Database migrations:**
```bash
cd backend
php artisan migrate
```

**Database seeding:**
```bash
php artisan db:seed
```

**Cache management:**
```bash
php artisan cache:clear
php artisan config:clear
```

**Production build:**
```bash
cd frontend
npm run build
```

## Additional Documentation

Detailed technical documentation for each component is available in the respective directories:
- `frontend/README.md` - Frontend architecture, component structure, and development guidelines
- `backend/README.md` - Backend API documentation, database schema, and service layer details
- `docs/architecture.md` - Project architecture, conventions, and error handling

## Static Analysis Status

`phpstan` runs in CI. `psalm` is currently paused due to local PHP version mismatch (requires PHP >= 8.4.3). Re-enable Psalm once the environment is upgraded.

## Contributing

Contributions to the project are welcome. Please submit bug reports, feature requests, or pull requests through the project's issue tracking system.

## License

This project is open-source software. You are free to use, modify, and distribute it in accordance with the applicable license terms.
