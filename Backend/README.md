# Backend API Documentation

## Endpoint: `/users/register`

### Description

This endpoint is used to register a new user in the system. It validates the input data, hashes the password, creates a new user in the database, and returns an authentication token along with the user details.

### Method

`POST`

### Request Body

The request body should be a JSON object with the following structure:

```json
{
  "fullname": {
    "firstname": "string (min: 3 characters, required)",
    "lastname": "string (min: 3 characters, optional)"
  },
  "email": "string (valid email format, required)",
  "password": "string (min: 6 characters, required)"
}
```

### Response

#### Success (201 Created)

```json
{
  "token": "string (JWT authentication token)",
  "user": {
    "_id": "string (user ID)",
    "fullname": {
      "firstname": "string",
      "lastname": "string"
    },
    "email": "string",
    "socketId": "string (optional)"
  }
}
```

#### Error (400 Bad Request)

If validation fails, the response will contain an array of error messages:

```json
{
  "errors": [
    {
      "msg": "string (error message)",
      "param": "string (field name)",
      "location": "string (location of the error, e.g., 'body')"
    }
  ]
}
```

### Status Codes

- `201 Created`: User successfully registered.
- `400 Bad Request`: Validation errors or missing required fields.

### Example Request

```bash
curl -X POST http://localhost:4000/users/register \
-H "Content-Type: application/json" \
-d '{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "password123"
}'
```

### Example Response

#### Success

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "64f1c2e4b5d1a2f3c4e5d6a7",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com",
    "socketId": null
  }
}
```

#### Error

```json
{
  "errors": [
    {
      "msg": "Invalid Email",
      "param": "email",
      "location": "body"
    }
  ]
}
```

## Endpoint: `/users/login`

### Description

This endpoint is used to authenticate an existing user. It validates the input data, checks the credentials, and returns an authentication token along with the user details if the credentials are valid.

### Method
`POST`

### Request Body
The request body should be a JSON object with the following structure:

```json
{
  "email": "string (valid email format, required)",
  "password": "string (min: 6 characters, required)"
}
```

### Response

#### Success (200 OK)
```json
{
  "token": "string (JWT authentication token)",
  "user": {
    "_id": "string (user ID)",
    "fullname": {
      "firstname": "string",
      "lastname": "string"
    },
    "email": "string",
    "socketId": "string (optional)"
  }
}
```

#### Error (400 Bad Request)
If validation fails, the response will contain an array of error messages:
```json
{
  "errors": [
    {
      "msg": "string (error message)",
      "param": "string (field name)",
      "location": "string (location of the error, e.g., 'body')"
    }
  ]
}
```

#### Error (401 Unauthorized)
If the email or password is invalid:
```json
{
  "message": "Invalid email or password"
}
```

### Status Codes
- `200 OK`: User successfully authenticated.
- `400 Bad Request`: Validation errors or missing required fields.
- `401 Unauthorized`: Invalid email or password.

### Example Request
```bash
curl -X POST http://localhost:4000/users/login \
-H "Content-Type: application/json" \
-d '{
  "email": "john.doe@example.com",
  "password": "password123"
}'
```

## Endpoint: `/users/profile`

### Description
Retrieves the authenticated user's profile information. This endpoint requires authentication.

### Method
`GET`

### Authentication
Requires Bearer token in the Authorization header.

```http
Authorization: Bearer <jwt_token>
```

### Response

#### Success (200 OK)
```json
{
  "user": {
    "_id": "string",          // MongoDB ObjectId
    "fullname": {
      "firstname": "string",  // User's first name
      "lastname": "string"    // User's last name (optional)
    },
    "email": "string",        // User's email address
    "socketId": "string"      // Optional, for real-time communication
  }
}
```

#### Error (401 Unauthorized)
When no token or invalid token is provided:
```json
{
  "message": "Authentication required"
}
```

#### Error (403 Forbidden)
When token is blacklisted or expired:
```json
{
  "message": "Invalid token"
}
```

### Security Requirements
- Valid JWT token must be provided in Authorization header
- Token must not be expired (24-hour validity)
- Token must not be in blacklist
- User must exist in the database

### Example Request
```bash
curl -X GET http://localhost:4000/users/profile \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Example Response
```json
{
  "user": {
    "_id": "64f1c2e4b5d1a2f3c4e5d6a7",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com",
    "socketId": "abc123xyz"
  }
}
```

### Notes
- Password is never included in the response
- Socket ID is only present if user is currently connected
- Uses `authMiddleware.authUser` for authentication validation
- All timestamps are in ISO 8601 format

### Common Status Codes
- `200 OK`: Request successful
- `201 Created`: Resource successfully created
- `400 Bad Request`: Invalid input or validation error
- `401 Unauthorized`: Missing or invalid authentication
- `403 Forbidden`: Authenticated but not authorized
- `500 Internal Server Error`: Server-side error

### Security Constraints
- All passwords are hashed before storage
- Authentication tokens expire after 24 hours
- Blacklisted tokens cannot be reused
- Rate limiting applies to login attempts
- Vehicle information must be verified
- Email must be unique in the system

### Data Constraints
- Email: Must be unique and valid format
- Password: Minimum 6 characters
- Firstname: Minimum 3 characters
- Vehicle plate: Must be unique
- Vehicle capacity: Must be positive number
- Vehicle type: Must match predefined types

### Example Response
## Endpoint: `/captains/login`

### Description
Authenticates a captain and provides an authentication token for subsequent requests.

### Method
`POST`

### Request Body
```json
{
  "email": "string",     // Required, must be valid email format
  "password": "string"   // Required, minimum 6 characters
}
```

### Response

#### Success (200 OK)
```json
{
  "token": "string",     // JWT authentication token
  "captain": {
    "_id": "string",     // MongoDB ObjectId
    "fullname": {
      "firstname": "string",
      "lastname": "string"   // Optional
    },
    "email": "string",
    "vehicle": {
      "color": "string",     // Minimum 3 characters
      "plate": "string",     // Minimum 3 characters
      "capacity": "number",  // Must be numeric
      "vehicleType": "string" // Must be: 'car', 'motorcycle', or 'auto'
    },
    "socketId": "string"    // Optional, used for real-time updates
  }
}
```

#### Error Responses
- `400 Bad Request`:
```json
{
  "errors": [
    {
      "msg": "Invalid Email",
      "param": "email",
      "location": "body"
    }
  ]
}
```
- `401 Unauthorized`:
```json
{
  "message": "Invalid email or password"
}
```

## Endpoint: `/captains/profile`

### Description
Retrieves the authenticated captain's profile information.

### Method
`GET`

### Headers
```json
{
  "Authorization": "Bearer <token>"  // Required: JWT token from login
}
```

### Response

#### Success (200 OK)
```json
{
  "captain": {
    "_id": "string",           // MongoDB ObjectId
    "fullname": {
      "firstname": "string",   // Minimum 3 characters
      "lastname": "string"     // Optional
    },
    "email": "string",         // Verified email address
    "vehicle": {
      "color": "string",      // Vehicle color
      "plate": "string",      // License plate number
      "capacity": "number",   // Passenger capacity
      "vehicleType": "string" // Vehicle type
    },
    "socketId": "string",     // Current socket connection ID
    "isAvailable": "boolean", // Captain's availability status
    "currentLocation": {      // Optional: Current GPS coordinates
      "latitude": "number",
      "longitude": "number"
    }
  }
}
```

## Endpoint: `/captains/logout`

### Description
Logs out the captain by invalidating the current authentication token.

### Method
`GET`

### Headers
```json
{
  "Authorization": "Bearer <token>"  // Required: JWT token to invalidate
}
```

### Response

#### Success (200 OK)
```json
{
  "message": "Logged out successfully"
}
```

## Endpoint: `/captains/register`

### Description
Registers a new captain (driver) in the system with their vehicle details. Creates a new account and returns authentication credentials.

### Method
`POST`

### Request Body
```json
{
  "fullname": {
    "firstname": "string",     // Required, min 3 characters
    "lastname": "string"       // Optional, min 3 characters if provided
  },
  "email": "string",          // Required, unique, valid email format
  "password": "string",       // Required, min 6 characters
  "vehicle": {
    "color": "string",        // Required, min 3 characters
    "plate": "string",        // Required, min 3 characters, unique
    "capacity": "number",     // Required, min value 1
    "vehicleType": "string"   // Required, enum: ['car', 'motorcycle', 'auto']
  }
}
```

### Validation Rules
- Firstname must be at least 3 characters long
- Email must be unique and in valid format
- Password must be at least 6 characters long
- Vehicle color must be at least 3 characters
- Vehicle plate must be at least 3 characters
- Vehicle capacity must be a positive number
- Vehicle type must be one of: 'car', 'motorcycle', 'auto'

### Response

#### Success (201 Created)
```json
{
  "token": "string",          // JWT authentication token
  "captain": {
    "_id": "string",          // MongoDB ObjectId
    "fullname": {
      "firstname": "string",
      "lastname": "string"
    },
    "email": "string",
    "vehicle": {
      "color": "string",
      "plate": "string",
      "capacity": "number",
      "vehicleType": "string"
    },
    "status": "string",       // Default: 'active'
    "socketId": "string"      // Optional
  }
}
```

#### Error (400 Bad Request)
For validation failures:
```json
{
  "errors": [
    {
      "msg": "string",        // Error message
      "param": "string",      // Field name with error
      "location": "body"      // Location of error
    }
  ]
}
```

For duplicate email:
```json
{
  "message": "Captain already exist"
}
```

### Status Codes
- `201 Created`: Captain successfully registered
- `400 Bad Request`: Validation errors or duplicate email
- `500 Internal Server Error`: Server error

### Example Request
```bash
curl -X POST http://localhost:4000/captains/register \
-H "Content-Type: application/json" \
-d '{
  "fullname": {
    "firstname": "John",
    "lastname": "Smith"
  },
  "email": "john.smith@example.com",
  "password": "password123",
  "vehicle": {
    "color": "Black",
    "plate": "ABC123",
    "capacity": 4,
    "vehicleType": "car"
  }
}'
```

### Example Response
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "captain": {
    "_id": "64f1c2e4b5d1a2f3c4e5d6a7",
    "fullname": {
      "firstname": "John",
      "lastname": "Smith"
    },
    "email": "john.smith@example.com",
    "vehicle": {
      "color": "Black",
      "plate": "ABC123",
      "capacity": 4,
      "vehicleType": "car"
    },
    "status": "active",
    "socketId": null
  }
}
```

### Security Notes
- Password is hashed before storage using bcrypt
- Email must be unique in the system
- JWT token is generated with 24-hour expiry
- Vehicle details are validated before registration

