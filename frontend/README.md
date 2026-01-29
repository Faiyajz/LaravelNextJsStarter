# Frontend - Supplier & Fabric Management System

Built with React and TypeScript, this is a modern, responsive, and user-friendly interface for managing suppliers and fabrics.

## Tech Stack

- **React 19.2.0** - The latest and greatest
- **TypeScript 5.9.3** - For type safety and better developer experience
- **Vite** - Lightning-fast build tool
- **TanStack Query v5** - Server state management made easy
- **Formik + Yup** - Forms and validation that don't make you cry
- **Tailwind CSS** - Utility-first styling
- **React Router** - Navigation between pages
- **React Hot Toast** - Beautiful notifications
- **Axios** - HTTP client for API calls

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start development server
npm run dev
```

The app will be running at http://localhost:5173

## Environment Variables

Create a `.env` file in the frontend directory with these variables:

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_STORAGE_URL=http://localhost:8000/storage
```

- `VITE_API_BASE_URL` - Your Laravel backend API URL
- `VITE_STORAGE_URL` - Where uploaded images are stored

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Button.tsx      # Custom button component
│   ├── InputField.tsx  # Form input with Formik
│   ├── SelectField.tsx # Dropdown with Formik
│   ├── NotesList.tsx   # Display and add notes
│   ├── SupplierFilters.tsx
│   └── FabricFilters.tsx
│
├── pages/              # Page components (routes)
│   ├── HomePage.tsx
│   ├── LoginPage.tsx
│   ├── SuppliersListPage.tsx
│   ├── SupplierCreatePage.tsx
│   ├── SupplierEditPage.tsx
│   ├── SupplierViewPage.tsx
│   ├── FabricsListPage.tsx
│   ├── FabricCreatePage.tsx
│   ├── FabricEditPage.tsx
│   ├── FabricViewPage.tsx
│   ├── FabricStockPage.tsx
│   └── TrashPage.tsx
│
├── services/           # API service layer
│   ├── auth.service.ts
│   ├── supplier.service.ts
│   ├── fabric.service.ts
│   ├── fabricStock.service.ts
│   └── note.service.ts
│
├── types/              # TypeScript type definitions
│   └── index.ts
│
├── schemas/            # Yup validation schemas
│   └── index.ts
│
├── config/             # Configuration files
│   ├── supplierColumns.tsx
│   ├── fabricColumns.tsx
│   ├── trashSupplierColumns.tsx
│   └── trashFabricColumns.tsx
│
├── contexts/           # React contexts
│   └── auth-context.ts
│
├── lib/                # Utilities and helpers
│   ├── api.ts         # Axios instance
│   ├── constants.ts   # Shared enums/constants
│   ├── hooks/         # Reusable hooks
│   │   └── useDebouncedValue.ts
│   └── toast.ts       # Toast notification helper
│
├── App.tsx             # Main app component with routes
└── main.tsx           # Entry point
```

## Key Features

### Authentication

- Login/Register pages with form validation
- JWT token stored in localStorage
- Auth context for managing user state
- Protected routes (redirect to login if not authenticated)

### Supplier Management

- **List View** - Paginated table with search and filters
- **Create** - Form with all supplier fields
- **Edit** - Update existing supplier details
- **View** - See all details including notes
- **Delete** - Soft delete (moves to trash)
- **Restore** - Bring back deleted suppliers

### Fabric Management

- **List View** - Sortable table with advanced filters
- **Create** - Comprehensive form with image upload
- **Edit** - Update fabric info and replace images
- **View** - Full details view with image display
- **Barcodes** - Auto-generated, printable barcodes
- **Stock Management** - Track IN/OUT transactions
- **Notes** - Add contextual notes to fabrics

### Stock Management

The stock page (`/fabrics/:id/stock`) lets you:

- Add IN transactions (receiving stock)
- Add OUT transactions (issuing stock)
- View transaction history
- See running balance after each transaction
- Validation prevents issuing more than available

### State Management

We use **TanStack Query** for all server state:

- Automatic caching and refetching
- Query invalidation for real-time updates
- Loading and error states handled gracefully
- Optimistic updates disabled in favor of server truth

### Form Handling

All forms use **Formik + Yup**:

- Type-safe validation schemas
- Error messages displayed inline
- File uploads with preview
- Proper error handling and user feedback

## Available Scripts

```bash
# Development server
npm run dev

# Run tests (Vitest)
npm run test

# Run tests in watch mode
npm run test:watch

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check

# Lint code
npm run lint
```

## API Integration

All API calls are centralized in the `services/` directory. Each service exports functions that return promises:

```typescript
// Example: services/fabric.service.ts
export const fabricService = {
  getAll: (params) => api.get('/fabrics', { params }),
  getById: (id) => api.get(`/fabrics/${id}`),
  create: (data) => api.post('/fabrics', data),
  update: (id, data) => api.put(`/fabrics/${id}`, data),
  delete: (id) => api.delete(`/fabrics/${id}`),
  restore: (id) => api.post(`/fabrics/${id}/restore`)
};
```

### Image Uploads

Images are uploaded using `FormData`:

```typescript
const formData = new FormData();
formData.append('fabric_no', 'FAB-001');
formData.append('image', imageFile); // File object
await fabricService.create(formData);
```

### Image Display

Images are displayed using the storage URL:

```typescript
const imageUrl = `${import.meta.env.VITE_STORAGE_URL}/${fabric.image_path}`;
<img src={imageUrl} alt="Fabric" />
```

## Routing

Routes are defined in `App.tsx`:

```typescript
<Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/login" element={<LoginPage />} />

  {/* Protected Routes */}
  <Route element={<ProtectedRoute />}>
    <Route path="/suppliers" element={<SupplierListPage />} />
    <Route path="/suppliers/create" element={<SupplierCreatePage />} />
    <Route path="/suppliers/:id" element={<SupplierViewPage />} />
    <Route path="/suppliers/:id/edit" element={<SupplierEditPage />} />

    <Route path="/fabrics" element={<FabricListPage />} />
    <Route path="/fabrics/create" element={<FabricCreatePage />} />
    <Route path="/fabrics/:id" element={<FabricViewPage />} />
    <Route path="/fabrics/:id/edit" element={<FabricEditPage />} />
    <Route path="/fabrics/:id/stock" element={<FabricStockPage />} />

    <Route path="/trash" element={<TrashPage />} />
  </Route>
</Routes>
```

## Component Patterns

### Query Hook Pattern

```typescript
const { data: fabrics, isLoading } = useQuery({
  queryKey: ['fabrics', filters],
  queryFn: () => fabricService.getAll(filters)
});
```

### Mutation Hook Pattern

```typescript
const mutation = useMutation({
  mutationFn: fabricService.create,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['fabrics'] });
    notify.success('Fabric created!');
    navigate('/fabrics');
  },
  onError: (error) => {
    notify.error(error.response?.data?.message || 'Error');
  }
});
```

## Styling

We use **Tailwind CSS** for all styling:

- Utility-first approach
- Responsive design with breakpoints
- Custom components in `components/` directory
- Consistent color scheme and spacing

## Common Tasks

### Adding a New Page

1. Create component in `pages/YourPage.tsx`
2. Add route in `App.tsx`
3. Create service functions if needed
4. Add TypeScript types in `types/index.ts`

### Adding a New API Endpoint

1. Add function to relevant service in `services/`
2. Use in component with `useQuery` or `useMutation`
3. Handle loading/error states
4. Invalidate queries on success

### Adding Form Validation

1. Create schema in `schemas/index.ts`:

```typescript
export const mySchema = Yup.object({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Required')
});
```

2. Use with Formik:

```typescript
<Formik
  initialValues={{ name: '', email: '' }}
  validationSchema={mySchema}
  onSubmit={handleSubmit}
>
  {/* form fields */}
</Formik>
```

## Troubleshooting

**CORS errors?**

- Make sure your Laravel backend has CORS configured
- Check that `VITE_API_BASE_URL` is correct

**Images not loading?**

- Run `php artisan storage:link` in the backend
- Verify `VITE_STORAGE_URL` is correct
- Check file permissions on storage directory

**Login not working?**

- Check backend API is running
- Verify credentials in database
- Check browser console for errors

**Query not refetching?**

- Make sure you're invalidating queries after mutations
- Check query keys are correct
- Use React Query DevTools for debugging
