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
  "message": "Invalid email or password"
}
```

## Endpoint: `/users/profile`

### Description
This endpoint retrieves the authenticated user's profile information. Requires authentication token.

### Method
`GET`

### Headers
```json
{
  "Authorization": "Bearer <token>"
}
```

### Response

#### Success (200 OK)
```json
{
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

#### Error (401 Unauthorized)
```json
{
  "message": "Authentication required"
}
```

### Status Codes
- `200 OK`: Profile retrieved successfully
- `401 Unauthorized`: Invalid or missing authentication token

## Endpoint: `/users/logout`

### Description
This endpoint logs out the current user by invalidating their authentication token and clearing cookies. Requires authentication token.

### Method
`GET`

### Headers
```json
{
  "Authorization": "Bearer <token>"
}
```

### Response

#### Success (200 OK)
```json
{
  "message": "Logged out successfully"
}
```

#### Error (401 Unauthorized)
```json
{
  "message": "Authentication required"
}
```

### Status Codes
- `200 OK`: User successfully logged out
- `401 Unauthorized`: Invalid or missing authentication token

### Additional Notes
- The logout endpoint blacklists the current token
- Clears the authentication cookie if present
- After logout, the token cannot be reused for authentication