# Bristol Park HMIS API

This is the backend API for the Bristol Park Hospital Management Information System.

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v13 or higher)
- npm or yarn

### Installation

1. Install dependencies:
   ```
   npm install
   ```

2. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Update the values as needed

3. Start the development server:
   ```
   npm run dev
   ```

## API Endpoints

### Health Check

- `GET /health` - Check if the server is running

### API Version

- `GET /api/version` - Get the API version information

### Database Test

- `GET /api/db-test` - Test the database connection

## Project Structure

```
api/
├── src/
│   ├── controllers/  # Request handlers
│   ├── models/       # Database models
│   ├── routes/       # API routes
│   ├── middleware/   # Express middleware
│   ├── utils/        # Utility functions
│   └── index.js      # Entry point
└── .env              # Environment variables
```
