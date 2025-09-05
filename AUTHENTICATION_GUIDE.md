# 🔐 Authentication System Implementation Guide

## 📋 Overview
This guide explains how the authentication system has been implemented in your frontend (Next.js) to work with your Spring Boot backend.

## 🏗️ Architecture

### Backend Components (Spring Boot)
- **User Entity** - JPA entity with Spring Security integration
- **JWT Service** - Token generation and validation
- **Authentication Service** - Business logic for login/register
- **Security Configuration** - JWT authentication and CORS setup
- **Auth Controller** - REST endpoints for authentication

### Frontend Components (Next.js + TypeScript)
- **API Service** - HTTP client for backend communication
- **Auth Context** - Global authentication state management
- **Token Storage** - JWT token persistence in localStorage
- **Auth Components** - Enhanced login/register forms
- **Protected Routes** - Route protection based on authentication
- **Enhanced UI** - User info display and logout functionality

## 🚀 How to Use

### 1. Start the Backend
```bash
cd backend/backend
./mvnw.cmd spring-boot:run
```

### 2. Start the Frontend
```bash
cd frontend
npm run dev
```

### 3. Test the Authentication
1. Navigate to the login section
2. Try registering a new user
3. Login with the credentials
4. Notice the header changes to show user info
5. Try accessing protected sections (like "Gestión de Tareas")
6. Test the API endpoints in the API section

## 🔗 API Endpoints

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Test Endpoints
- `GET /api/test/public` - Public endpoint (no auth required)
- `GET /api/test/protected` - Protected endpoint (JWT required)
- `GET /api/test/admin` - Admin endpoint (JWT + ADMIN role required)

## 📝 Example Usage

### Register Request
```json
POST http://localhost:8080/api/auth/register
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

### Login Request
```json
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "username": "testuser",
  "password": "password123"
}
```

### Response Format
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "type": "Bearer",
  "id": 1,
  "username": "testuser",
  "email": "test@example.com",
  "role": "USER"
}
```

### Using Protected Endpoints
```javascript
// In frontend, the token is automatically included
fetch('http://localhost:8080/api/test/protected', {
  headers: {
    'Authorization': 'Bearer <your-jwt-token>'
  }
})
```

## 🔧 Key Features

### Frontend Features
- ✅ **Form Validation** - Client-side validation with error messages
- ✅ **API Integration** - Seamless backend communication
- ✅ **Global State** - Authentication state managed with React Context
- ✅ **Token Persistence** - JWT tokens stored in localStorage
- ✅ **Protected Routes** - Automatic route protection
- ✅ **User Interface** - Enhanced UI showing auth state
- ✅ **Error Handling** - Comprehensive error messages
- ✅ **Loading States** - Visual feedback during API calls

### Backend Features
- ✅ **JWT Authentication** - Stateless token-based auth
- ✅ **Password Encryption** - BCrypt hashing
- ✅ **Input Validation** - Bean validation on all inputs
- ✅ **CORS Configuration** - Cross-origin requests enabled
- ✅ **Role-based Access** - USER and ADMIN roles
- ✅ **Database Integration** - MySQL with Hibernate

## 🔒 Security Features

1. **JWT Tokens** - Secure, stateless authentication
2. **Password Hashing** - BCrypt encryption
3. **Token Expiration** - Automatic token validation
4. **CORS Protection** - Configured for your frontend
5. **Input Validation** - Both frontend and backend validation
6. **Protected Routes** - Client-side route protection

## 🧪 Testing the System

1. **Register** a new user through the frontend
2. **Login** with the created credentials
3. Notice the **header changes** to show user info
4. Try accessing **protected sections**
5. Test **API endpoints** in the API section
6. **Logout** and verify access is restricted

## 📁 File Structure

```
backend/backend/src/main/java/com/gestion/backend/
├── config/
│   ├── SecurityConfig.java
│   └── JwtAuthenticationFilter.java
├── controller/
│   ├── AuthController.java
│   └── TestController.java
├── dto/
│   ├── LoginRequest.java
│   ├── RegisterRequest.java
│   └── AuthResponse.java
├── entity/
│   └── User.java
├── repository/
│   └── UserRepository.java
└── service/
    ├── AuthService.java
    ├── JwtService.java
    └── CustomUserDetailsService.java

frontend/src/
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   └── ProtectedRoute.tsx
│   ├── dashboard/
│   │   └── DashboardContent.tsx
│   └── api/
│       └── ApiTestComponent.tsx
├── contexts/
│   └── AuthContext.tsx
├── services/
│   └── api.ts
└── utils/
    └── auth.ts
```

## 🔄 Next Steps

You can now extend this system by:
1. Adding user profile management
2. Implementing password reset functionality
3. Adding social login options
4. Creating admin-specific features
5. Adding refresh token functionality
6. Implementing role-based UI components
