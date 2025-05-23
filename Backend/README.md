# EMR System Backend

Electronic Medical Records (EMR) System with role-based access control and comprehensive patient management features.

## Features

- 🔐 Secure authentication with JWT
- 👥 Role-based access control (Admin, Doctor, Patient)
- 📝 Patient management
- 📅 Appointment scheduling
- 📊 Visit notes and medical records
- 💰 Billing and insurance integration
- 🔬 Lab reports management
- 📄 PDF report generation

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/emr-system
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NODE_ENV=development
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- POST `/api/auth/signup` - Register new user
- POST `/api/auth/login` - User login
- GET `/api/auth/me` - Get current user info

### Patients
- GET `/api/patients` - Get all patients (Doctor/Admin only)
- POST `/api/patients` - Create new patient
- GET `/api/patients/:id` - Get patient details
- PUT `/api/patients/:id` - Update patient info
- DELETE `/api/patients/:id` - Delete patient (Admin only)

### Appointments
- GET `/api/appointments` - Get all appointments
- POST `/api/appointments` - Create new appointment
- PUT `/api/appointments/:id` - Update appointment
- DELETE `/api/appointments/:id` - Cancel appointment

### Visits
- GET `/api/visits` - Get all visits
- POST `/api/visits` - Create new visit
- GET `/api/visits/:id` - Get visit details
- PUT `/api/visits/:id` - Update visit notes

### Billing
- GET `/api/billing` - Get all bills
- POST `/api/billing` - Create new bill
- GET `/api/billing/:id` - Get bill details
- PUT `/api/billing/:id` - Update bill status

### Lab Reports
- GET `/api/labs` - Get all lab reports
- POST `/api/labs` - Upload new lab report
- GET `/api/labs/:id` - Get lab report details

## Security

- All routes except login and signup are protected with JWT authentication
- Role-based access control for sensitive operations
- Password hashing using bcrypt
- Input validation using express-validator

## Error Handling

The API uses a consistent error response format:
```json
{
    "message": "Error message",
    "errors": [] // Optional validation errors
}
```

## Development

To run the development server with hot reload:
```bash
npm run dev
```

For production:
```bash
npm start
``` 