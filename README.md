# Garage Management System

A full-stack web application connecting car owners with garages for service booking and management.

## Tech Stack

### Frontend
- React 19 + Vite
- Tailwind CSS
- React Router DOM
- Axios
- Lucide React (icons)

### Backend
- Laravel 13 (PHP 8.3)
- Laravel Sanctum (Authentication)
- Eloquent ORM

### Database
- MySQL (via XAMPP)
- SQLite (development)

## Project Structure

```
Garage Management System/
├── frontend/               # React Application
│   ├── src/
│   │   ├── api/           # Axios configuration
│   │   ├── components/    # Reusable components
│   │   ├── context/       # Auth context
│   │   ├── pages/         # Page components
│   │   │   ├── auth/      # Login, Register
│   │   │   ├── client/    # Client pages
│   │   │   ├── admin/     # Admin pages
│   │   │   └── mechanic/  # Mechanic pages
│   │   ├── routes/        # Route definitions
│   │   └── styles/        # CSS files
│   └── package.json
│
└── backend/               # Laravel API
    ├── app/
    │   ├── Models/        # User, Vehicle, Service, Booking
    │   └── Http/
    │       └── Controllers/ # API Controllers
    ├── database/
    │   └── migrations/    # Database migrations
    └── routes/
        └── api.php        # API Routes
```

## Features

### Client
- Register/Login with role selection
- Add and manage vehicles
- Book services (oil change, repairs, etc.)
- View booking status and service history
- Real-time status tracking

### Admin
- Dashboard with statistics
- Manage users (clients & mechanics)
- Manage services and pricing
- Assign mechanics to jobs
- Update service status
- View revenue analytics

### Mechanic
- View assigned jobs
- Update job progress
- Add service notes
- Track completed jobs

## Setup Instructions

### Prerequisites
- PHP 8.3+
- Composer
- Node.js 18+
- MySQL (XAMPP/WAMP) or SQLite

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install PHP dependencies:
```bash
composer install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Generate application key:
```bash
php artisan key:generate
```

5. Configure database in `.env`:
```env
DB_CONNECTION=sqlite
# OR for MySQL:
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=garage_db
DB_USERNAME=root
DB_PASSWORD=
```

6. Run migrations:
```bash
php artisan migrate
```

7. Install Sanctum (for authentication):
```bash
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
```

8. Start the Laravel server:
```bash
php artisan serve
```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - Login
- `POST /api/logout` - Logout (auth required)
- `GET /api/user` - Get current user (auth required)

### Users (auth required)
- `GET /api/users` - List all users
- `GET /api/users/mechanics` - List mechanics
- `GET /api/users/clients` - List clients
- `POST /api/users` - Create user
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user

### Vehicles (auth required)
- `GET /api/vehicles` - List vehicles
- `POST /api/vehicles` - Create vehicle
- `PUT /api/vehicles/{id}` - Update vehicle
- `DELETE /api/vehicles/{id}` - Delete vehicle

### Services (auth required)
- `GET /api/services` - List services
- `POST /api/services` - Create service
- `PUT /api/services/{id}` - Update service
- `DELETE /api/services/{id}` - Delete service

### Bookings (auth required)
- `GET /api/bookings` - List bookings
- `GET /api/bookings/stats` - Get booking statistics
- `POST /api/bookings` - Create booking
- `PUT /api/bookings/{id}` - Update booking
- `DELETE /api/bookings/{id}` - Delete booking
- `POST /api/bookings/{id}/assign` - Assign mechanic

## User Roles

1. **Client** - Can book services, manage vehicles, view history
2. **Mechanic** - Can view and update assigned jobs
3. **Admin** - Full access to all features

## Status Flow

```
Pending → In Progress → Completed
   ↓
Cancelled
```

## Database Schema

### Users
- id, name, email, password, role (admin/client/mechanic)

### Vehicles
- id, user_id, car_name, model, plate_number, year

### Services
- id, name, description, price, duration_minutes

### Bookings
- id, user_id, vehicle_id, service_id, assigned_mechanic_id
- status (pending/in_progress/completed/cancelled)
- notes, scheduled_date, completed_at

## Development

### Run Tests
```bash
# Backend
php artisan test

# Frontend
npm run test
```

### Build for Production
```bash
# Frontend
npm run build
```

## License

MIT
