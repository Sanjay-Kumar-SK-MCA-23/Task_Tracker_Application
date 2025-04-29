# Task Tracker MERN Stack Application

A comprehensive task and project management application built with the MERN stack (MongoDB, Express, React, Node.js).

## Features

- User authentication with JWT
- Create up to 4 projects per user
- Create, read, update, and delete tasks
- Track task statuses (To Do, In Progress, Completed)
- User profile management
- Responsive design

## Technology Stack

- **Frontend**: React, React Router, Context API, Tailwind CSS, React Icons, React Toastify
- **Backend**: Node.js, Express.js, MongoDB
- **Authentication**: JWT with HTTP-only cookies

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/task-tracker-mern.git
   cd task-tracker-mern
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/tasktracker
   JWT_SECRET=your_jwt_secret
   NODE_ENV=development
   VITE_API_URL=http://localhost:5000/api
   ```

   Replace `your_jwt_secret` with a strong secret key for JWT token generation.
   
   For MongoDB Atlas, replace the MONGO_URI with your connection string.

## Running the Application

### Development Mode

1. Start the backend server:
   ```
   npm run dev:server
   ```

2. In a separate terminal, start the frontend:
   ```
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`

### Production Build

1. Build the frontend:
   ```
   npm run build
   ```

2. Start the server:
   ```
   npm run server
   ```

## API Endpoints

### Auth

- `POST /api/users` - Register a new user
- `POST /api/users/login` - Login
- `POST /api/users/logout` - Logout
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Projects

- `POST /api/projects` - Create a new project
- `GET /api/projects` - Get all user projects
- `GET /api/projects/:id` - Get project by ID
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Tasks

- `POST /api/tasks` - Create a new task
- `GET /api/tasks` - Get all tasks or filter by project
- `GET /api/tasks/:id` - Get task by ID
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

## Project Structure

```
task-tracker-mern/
├── backend/                  # Backend code
│   ├── config/               # DB configuration
│   ├── controllers/          # Route controllers
│   ├── middleware/           # Custom middleware
│   ├── models/               # Mongoose models
│   ├── routes/               # API routes
│   ├── utils/                # Utility functions
│   └── server.js             # Server entry point
├── public/                   # Static files
├── src/                      # Frontend code
│   ├── assets/               # Assets (images, etc.)
│   ├── components/           # React components
│   ├── context/              # Context API
│   ├── pages/                # Page components
│   ├── App.jsx               # Main App component
│   ├── index.css             # Global styles
│   └── main.jsx              # Entry point
├── .env                      # Environment variables
├── package.json              # Dependencies and scripts
└── README.md                 # Project documentation
```

## Deployment

The application can be deployed to various platforms such as:

- Heroku
- Vercel
- Netlify (frontend)
- MongoDB Atlas (database)

Make sure to set the appropriate environment variables on your deployment platform.

## License

MIT

## Author

Your Name