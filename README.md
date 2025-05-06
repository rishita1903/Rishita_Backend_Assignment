# Task Management API

A simple RESTful API for managing tasks built with Node.js and Express.js.

## Features

- CRUD operations for tasks
- User authentication and authorization
- Pagination, sorting, and filtering for task retrieval
- Input validation
- Error handling
- In-memory data storage

## Prerequisites

- Node.js (v12 or higher)
- npm (Node Package Manager)

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3000
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRES_IN=24h
   ```

## Running the Application

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on port 3000 by default. You can change this by setting the PORT environment variable.

## Refer API Doumentation.txt file for the details API documentation

## Refer REPORT.txt file for the details regardng the approach and algorithm used.

## Refer SCREENSHOTS folder for the postman test I have done


## API Documentation

### Authentication Endpoints

#### POST /auth/register
Register a new user

Request body:
```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "username": "testuser",
      "email": "test@example.com",
      "createdAt": "2024-03-14T12:00:00.000Z"
    },
    "token": "jwt_token_here"
  }
}
```

#### POST /auth/login
Login user

Request body:
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "username": "testuser",
      "email": "test@example.com",
      "createdAt": "2024-03-14T12:00:00.000Z"
    },
    "token": "jwt_token_here"
  }
}
```

### Task Endpoints

All task endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer your_jwt_token_here
```

#### GET /tasks
Retrieve tasks with pagination, sorting, and filtering

Query Parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `sortBy`: Field to sort by (default: createdAt)
- `order`: Sort order (asc/desc, default: desc)
- `completed`: Filter by completion status (true/false)
- `title`: Filter by title (case-insensitive)
- `description`: Filter by description (case-insensitive)

Example:
```
GET /tasks?page=1&limit=10&sortBy=createdAt&order=desc&completed=false&title=test
```

Response:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Example Task",
      "description": "This is an example task",
      "completed": false,
      "createdAt": "2024-03-14T12:00:00.000Z",
      "userId": 1
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalTasks": 1,
    "tasksPerPage": 10
  }
}
```

#### GET /tasks/:id
Retrieve a specific task by ID

Response:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Example Task",
    "description": "This is an example task",
    "completed": false,
    "createdAt": "2024-03-14T12:00:00.000Z",
    "userId": 1
  }
}
```

#### POST /tasks
Create a new task

Request body:
```json
{
  "title": "New Task",
  "description": "This is a new task"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "New Task",
    "description": "This is a new task",
    "completed": false,
    "createdAt": "2024-03-14T12:00:00.000Z",
    "userId": 1
  }
}
```

#### PUT /tasks/:id
Update an existing task

Request body:
```json
{
  "title": "Updated Task",
  "description": "This is an updated task"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Updated Task",
    "description": "This is an updated task",
    "completed": false,
    "createdAt": "2024-03-14T12:00:00.000Z",
    "updatedAt": "2024-03-14T12:30:00.000Z",
    "userId": 1
  }
}
```

#### DELETE /tasks/:id
Delete a task

Response:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Example Task",
    "description": "This is an example task",
    "completed": false,
    "createdAt": "2024-03-14T12:00:00.000Z",
    "userId": 1
  }
}
```

## Error Responses

The API uses standard HTTP status codes:

- 200: Success
- 201: Created
- 400: Bad Request (missing required fields)
- 401: Unauthorized (no token provided)
- 403: Forbidden (invalid token or not authorized)
- 404: Not Found
- 500: Internal Server Error

Error response format:
```json
{
  "success": false,
  "message": "Error message"
}
```

## Testing the API

# Testing the API with Postman

Follow these steps to test your API using Postman:

## 1. Start the Server
Make sure your server is running:
```bash
npm run dev
```

## 2. Register a New User
- Method: **POST**
- URL: `http://localhost:3000/auth/register`
- Headers:
  - `Content-Type`: `application/json`
- Body (raw JSON):
```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123"
}
```
- Click **Send**
- Copy the `token` from the response for the next steps

## 3. Login (if needed)
- Method: **POST**
- URL: `http://localhost:3000/auth/login`
- Headers:
  - `Content-Type`: `application/json`
- Body (raw JSON):
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```
- Click **Send**
- Copy the `token` from the response

## 4. Use the Token for Authenticated Requests
For all the following requests, add this header:
- Key: `Authorization`
- Value: `Bearer your_token_here`

**Example:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 5. Create a Task
- Method: **POST**
- URL: `http://localhost:3000/tasks`
- Headers:
  - `Content-Type`: `application/json`
  - `Authorization`: `Bearer your_token_here`
- Body (raw JSON):
```json
{
  "title": "My First Task",
  "description": "This is my first task"
}
```
- Click **Send**

## 6. Get All Tasks
- Method: **GET**
- URL: `http://localhost:3000/tasks`
- Headers:
  - `Authorization`: `Bearer your_token_here`
- Click **Send**

## 7. Get a Single Task
- Method: **GET**
- URL: `http://localhost:3000/tasks/1` (replace 1 with your task's ID)
- Headers:
  - `Authorization`: `Bearer your_token_here`
- Click **Send**

## 8. Update a Task
- Method: **PUT**
- URL: `http://localhost:3000/tasks/1` (replace 1 with your task's ID)
- Headers:
  - `Content-Type`: `application/json`
  - `Authorization`: `Bearer your_token_here`
- Body (raw JSON):
```json
{
  "title": "Updated Task",
  "description": "This is an updated task"
}
```
- Click **Send**

## 9. Delete a Task
- Method: **DELETE**
- URL: `http://localhost:3000/tasks/1` (replace 1 with your task's ID)
- Headers:
  - `Authorization`: `Bearer your_token_here`
- Click **Send**

---

## Troubleshooting
- **401 Unauthorized:** Make sure you included the `Authorization` header with `Bearer` and your token.
- **403 Forbidden:** You may be trying to modify a task that doesn't belong to you, or your token is invalid.
- **404 Not Found:** The task ID does not exist.
- **No token provided:** Double-check the `Authorization` header is set correctly.

**Tip:** Always copy the token exactly as received, and include the word `Bearer` followed by a space and then the token.

---

You can repeat the above steps to create, update, and delete multiple tasks, and test pagination, sorting, and filtering by adding query parameters to the GET requests.

## Sorting Examples

You can sort tasks by any field (e.g., `title`, `createdAt`) using the `sortBy` and `order` query parameters.

### Sort by Title (Ascending)
- **GET** `http://localhost:3000/tasks?sortBy=title&order=asc`
- Headers:
  - `Authorization`: `Bearer your_token_here`
- **Expected:** Tasks are sorted alphabetically by title (A → Z).

### Sort by Title (Descending)
- **GET** `http://localhost:3000/tasks?sortBy=title&order=desc`
- Headers:
  - `Authorization`: `Bearer your_token_here`
- **Expected:** Tasks are sorted in reverse alphabetical order (Z → A).

### Sort by CreatedAt (Newest First)
- **GET** `http://localhost:3000/tasks?sortBy=createdAt&order=desc`
- Headers:
  - `Authorization`: `Bearer your_token_here`
- **Expected:** Most recently created tasks appear first.

### Sort by CreatedAt (Oldest First)
- **GET** `http://localhost:3000/tasks?sortBy=createdAt&order=asc`
- Headers:
  - `Authorization`: `Bearer your_token_here`
- **Expected:** Oldest tasks appear first.

You can combine sorting with pagination and filtering as needed:
- Example: `http://localhost:3000/tasks?sortBy=title&order=asc&page=1&limit=2`