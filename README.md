# Hotel Management System

A full-stack hotel management web application built with React, Express.js, and SQLite.

## Features

- **Dashboard**: Real-time statistics and analytics
  - Total rooms, guests, and bookings overview
  - Revenue tracking (in Myanmar Kyat - MMK)
  - Today's check-ins and check-outs
  - Recent bookings list

- **Room Management**: 
  - Add, edit, and delete rooms
  - Track room status (Available, Occupied, Maintenance)
  - Manage room types (Single, Double, Suite, Deluxe)
  - Set pricing and capacity (in MMK)
  - Add amenities and descriptions

- **Booking/Reservation System**:
  - Create and manage bookings
  - Automatic price calculation based on duration
  - Check-in and check-out functionality
  - Track booking status (Confirmed, Completed, Cancelled)
  - Special requests handling
  - Pricing in Myanmar Kyat (MMK)

- **Guest Management**:
  - Register and manage guest information
  - Track contact details and ID numbers
  - Guest history and information

- **Housekeeping Management** ✨ NEW:
  - Create and assign housekeeping tasks
  - Track task status (Pending, In Progress, Completed)
  - Set task priority (Low, Normal, High)
  - Schedule tasks by date
  - Assign tasks to staff members
  - Multiple task types (Cleaning, Maintenance, Inspection, Laundry, Restocking)
  - Filter tasks by status

- **Staff Management** ✨ NEW:
  - Add and manage staff members
  - Different roles (Admin, Manager, Receptionist, Housekeeping)
  - User authentication ready
  - Track staff information and contact details

## Tech Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- Lucide React (icons)

### Backend
- Node.js
- Express.js
- SQLite3 (better-sqlite3)
- CORS
- dotenv

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## Installation & Setup

### 1. Install Backend Dependencies

```bash
cd backend
npm install
```

### 2. Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 3. Start the Backend Server

```bash
cd backend
npm start
```

The backend server will start on `http://localhost:5000`

For development with auto-reload:
```bash
npm run dev
```

### 4. Start the Frontend Application

In a new terminal:

```bash
cd frontend
npm run dev
```

The frontend will start on `http://localhost:3000`

### 5. Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

## Project Structure

```
hotel-management-system/
├── backend/
│   ├── database.js          # Database initialization and seeding
│   ├── server.js            # Express server and API routes
│   ├── package.json         # Backend dependencies
│   ├── .env                 # Environment variables
│   └── hotel.db            # SQLite database (auto-generated)
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Layout.jsx   # Main layout with navigation
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx   # Dashboard page
│   │   │   ├── Rooms.jsx       # Room management
│   │   │   ├── Bookings.jsx    # Booking management
│   │   │   └── Guests.jsx      # Guest management
│   │   ├── services/
│   │   │   └── api.js       # API service layer
│   │   ├── App.jsx          # Main app component
│   │   ├── main.jsx         # Entry point
│   │   └── index.css        # Global styles
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
└── README.md
```

## API Endpoints

### Rooms
- `GET /api/rooms` - Get all rooms
- `GET /api/rooms/:id` - Get single room
- `POST /api/rooms` - Create new room
- `PUT /api/rooms/:id` - Update room
- `DELETE /api/rooms/:id` - Delete room

### Guests
- `GET /api/guests` - Get all guests
- `GET /api/guests/:id` - Get single guest
- `POST /api/guests` - Create new guest
- `PUT /api/guests/:id` - Update guest
- `DELETE /api/guests/:id` - Delete guest

### Bookings
- `GET /api/bookings` - Get all bookings
- `GET /api/bookings/:id` - Get single booking
- `POST /api/bookings` - Create new booking
- `PUT /api/bookings/:id` - Update booking
- `POST /api/bookings/:id/checkout` - Check out booking
- `DELETE /api/bookings/:id` - Delete booking

### Staff ✨ NEW
- `GET /api/staff` - Get all staff members
- `GET /api/staff/:id` - Get single staff member
- `POST /api/staff` - Create new staff member
- `PUT /api/staff/:id` - Update staff member
- `DELETE /api/staff/:id` - Delete staff member

### Housekeeping ✨ NEW
- `GET /api/housekeeping` - Get all housekeeping tasks
- `GET /api/housekeeping/:id` - Get single task
- `POST /api/housekeeping` - Create new task
- `PUT /api/housekeeping/:id` - Update task
- `POST /api/housekeeping/:id/complete` - Mark task as completed
- `DELETE /api/housekeeping/:id` - Delete task

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/recent-bookings` - Get recent bookings

## Default Data

The application comes pre-seeded with 10 sample rooms of different types:
- Single rooms: 80,000 MMK/night
- Double rooms: 120,000 MMK/night
- Suites: 250,000 MMK/night

**Currency**: All prices are in Myanmar Kyat (MMK)

## Environment Variables

Backend `.env` file:
```
PORT=5000
JWT_SECRET=your_jwt_secret_key_change_in_production
NODE_ENV=development
```

## Building for Production

### Frontend
```bash
cd frontend
npm run build
```

The build files will be in the `frontend/dist` directory.

### Backend
The backend is production-ready. Just ensure you:
1. Update the `.env` file with production values
2. Change `JWT_SECRET` to a secure random string
3. Consider upgrading from SQLite to PostgreSQL/MySQL for production

## Features to Add (Future Enhancements)

- User authentication and authorization
- Payment processing integration
- Email notifications
- Reports and analytics export
- Room availability calendar
- Multi-property support
- Staff management
- Housekeeping management
- Invoice generation

## License

MIT

## Support

For issues and questions, please create an issue in the repository.
