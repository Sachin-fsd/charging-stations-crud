# EV Charging Stations Backend

This is a Node.js backend API for managing EV charging stations and user authentication. It uses Express, MongoDB (via Mongoose), JWT for authentication, and supports user roles (admin, user).

## Features

- User registration and login with JWT authentication
- Role-based access control (admin, user)
- CRUD operations for charging stations
- Input validation and error handling

## Project Structure

```
.
├── .env
├── index.js
├── package.json
├── config/
│   └── db.js
├── middleware/
│   ├── auth.middleware.js
│   └── validateCharging.middleware.js
├── models/
│   ├── chargingStation.model.js
│   └── user.model.js
├── routes/
│   ├── add.route.js
│   ├── delete.route.js
│   ├── login.route.js
│   ├── read.route.js
│   ├── register.route.js
│   └── update.route.js
```

## Prerequisites

- Node.js (v14 or higher recommended)
- npm
- MongoDB database (local or Atlas)

## Setup Instructions

1. **Clone the repository**

   ```sh
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**

   ```sh
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the root directory:

   ```
   JWT_SECRET=your_jwt_secret
   DB_URI=your_mongodb_connection_string
   ```

   Example:

   ```
   JWT_SECRET=sachin
   DB_URI=mongodb+srv://username:password@cluster.mongodb.net/charging?retryWrites=true&w=majority
   ```

4. **Start the server**

   Uncomment the server start code in [`index.js`](index.js):

   ```js
   // filepath: index.js
   // ...existing code...
   connectDB(); // Function to connect to MongoDB
   app.listen(3000, () => {
       console.log('Server is running on http://localhost:3000');
   });
   // ...existing code...
   ```

   Then run:

   ```sh
   node index.js
   ```

## API Endpoints

### Authentication

- `POST /api/register` — Register a new user
- `POST /api/login` — Login and receive JWT token

### Charging Stations

- `GET /api/charging-stations` — List all charging stations
- `GET /api/charging-stations/:id` — Get a charging station by ID
- `POST /api/charging-stations` — Add a new charging station (admin only)
- `PUT /api/charging-stations/:id` — Update a charging station (admin only)
- `DELETE /api/charging-stations/:id` — Delete a charging station (admin only)

## Middleware

- [`authenticate`](middleware/auth.middleware.js): Verifies JWT token
- [`authorize`](middleware/auth.middleware.js): Checks user role
- [`validateChargingStation`](middleware/validateCharging.middleware.js): Validates charging station input (not currently used in routes)

## Models

- [`User`](models/user.model.js): User schema with roles
- [`ChargingStation`](models/chargingStation.model.js): Charging station schema

## Notes

- Admin role is required for adding, updating, or deleting charging stations.
- All routes except `/api/login` and `/api/register` require authentication.
- Error handling and 404 middleware are included.

---

**Author:**  
See [package.json](package.json)
