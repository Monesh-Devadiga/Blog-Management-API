# Blog Management API

A RESTful API for managing blog posts with authentication, categories, search, pagination and file upload support.
 a
## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **Validation:** express-validator
- **File Upload:** Multer

## Features

- User authentication (register / login / profile)
- Blog CRUD (create, read, update, delete)
- Category management (admin only)
- Text search across title, content and tags
- Filtering by status, category, author, tag and date range
- Pagination with page and limit parameters
- File/image upload for cover images
- Input validation and error handling
- Role-based access (user / admin)

## Installation

```bash
# Clone the repository
git clone <repo-url>
cd blog-management-api

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# Start the server
npm run dev
```

## Environment Variables

| Variable       | Description                  | Default                          |
| -------------- | ---------------------------- | -------------------------------- |
| `PORT`         | Server port                  | `5000`                           |
| `MONGO_URI`    | MongoDB connection string    | `mongodb://localhost:27017/blog_management` |
| `JWT_SECRET`   | JWT signing secret           | (required)                       |
| `JWT_EXPIRES_IN` | Token expiration period   | `7d`                             |

## API Endpoints

### Health Check

| Method | Endpoint      | Description          |
| ------ | ------------- | -------------------- |
| GET    | `/api/health` | Server health check  |

### Authentication

| Method | Endpoint           | Description          | Auth Required |
| ------ | ------------------ | -------------------- | ------------- |
| POST   | `/api/auth/register` | Register a new user | No            |
| POST   | `/api/auth/login`    | Login user          | No            |
| GET    | `/api/auth/me`       | Get current user    | Yes           |

**POST /api/auth/register**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**POST /api/auth/login**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Categories (Admin only)

| Method | Endpoint                 | Description          | Auth Required |
| ------ | ------------------------ | -------------------- | ------------- |
| GET    | `/api/categories`        | Get all categories   | No            |
| GET    | `/api/categories/:id`    | Get single category  | No            |
| POST   | `/api/categories`        | Create category      | Admin         |
| PUT    | `/api/categories/:id`    | Update category      | Admin         |
| DELETE | `/api/categories/:id`    | Delete category      | Admin         |

### Blogs

| Method | Endpoint              | Description           | Auth Required     |
| ------ | --------------------- | --------------------- | ----------------- |
| GET    | `/api/blogs`          | Get all blogs         | Optional          |
| GET    | `/api/blogs/my-blogs` | Get current user blogs| Yes               |
| GET    | `/api/blogs/:id`      | Get single blog       | Optional          |
| POST   | `/api/blogs`          | Create blog           | Yes               |
| PUT    | `/api/blogs/:id`      | Update blog           | Owner or Admin    |
| DELETE | `/api/blogs/:id`      | Delete blog           | Owner or Admin    |

### Query Parameters for GET /api/blogs

| Parameter   | Type   | Description                        |
| ----------- | ------ | ---------------------------------- |
| `page`      | Number | Page number (default: 1)           |
| `limit`     | Number | Items per page (default: 10, max: 100) |
| `search`    | String | Search in title, content, tags     |
| `status`    | String | Filter by status (`draft` / `published`) |
| `category`  | ID     | Filter by category ID              |
| `author`    | ID     | Filter by author ID                |
| `tag`       | String | Filter by tag                      |
| `startDate` | Date   | Filter by start date (ISO)         |
| `endDate`   | Date   | Filter by end date (ISO)           |
| `sort`      | String | Sort field (default: `createdAt`)  |
| `order`     | String | Sort order (`asc` / `desc`)        |

## Authentication

Include the JWT token in the `Authorization` header:

```
Authorization: Bearer <your_token>
```

## Project Structure

```
blog-management-api/
├── src/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js   # Auth logic
│   │   ├── blogController.js   # Blog CRUD logic
│   │   └── categoryController.js # Category CRUD logic
│   ├── middleware/
│   │   ├── auth.js            # JWT authentication
│   │   ├── errorHandler.js    # Error handling
│   │   ├── upload.js          # File upload config
│   │   └── validate.js        # Request validation
│   ├── models/
│   │   ├── User.js            # User model
│   │   ├── Blog.js            # Blog model
│   │   └── Category.js        # Category model
│   ├── routes/
│   │   ├── authRoutes.js      # Auth routes
│   │   ├── blogRoutes.js      # Blog routes
│   │   └── categoryRoutes.js  # Category routes
│   ├── utils/
│   │   └── helpers.js         # Utility functions
│   └── app.js                 # Express app setup
├── uploads/                   # Uploaded files
├── scripts/
│   └── export-db.js           # Database export script
├── database-export/           # Exported JSON data
├── server.js                  # Entry point
├── .env                       # Environment variables
└── package.json
```

## Testing with Postman

Import the Postman collection from `postman/Blog Management API.postman_collection.json`.

### Test Flow

1. Register a user (POST /api/auth/register)
2. Login (POST /api/auth/login) and copy the token
3. Create categories (POST /api/categories)
4. Create blogs (POST /api/blogs) with the token
5. Test search, filtering and pagination (GET /api/blogs?search=keyword&page=1&limit=5)
6. Update and delete blogs

## Database Export

```bash
npm run export-db
```

Exports all collections as JSON files to the `database-export/` directory.

---------------------------------------------------------------------------------------------------------------------
Created By: 
  [@Monesh Devadiga](https://github.com/Monesh-Devadiga)
