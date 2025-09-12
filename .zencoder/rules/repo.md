---
description: Repository Information Overview
alwaysApply: true
---

# Repository Information Overview

## Repository Summary
This is a full-stack web application with a React frontend and Express.js backend. The application appears to be an agricultural platform called "Cardo" that supports multiple user roles including customers, farmers, agricultural care providers, hub managers, and administrators.

## Repository Structure
- **frontend/**: React application built with Vite
- **backend/**: Express.js server with MongoDB integration

### Main Repository Components
- **Frontend**: React application with registration form and role-based UI
- **Backend**: Express API with MongoDB integration and JWT authentication
- **Database**: MongoDB for user data storage

## Projects

### Frontend (React Application)
**Configuration File**: frontend/package.json

#### Language & Runtime
**Language**: JavaScript (React)
**Version**: React 19.1.1
**Build System**: Vite 7.1.5
**Package Manager**: npm

#### Dependencies
**Main Dependencies**:
- react: ^19.1.1
- react-dom: ^19.1.1
- react-router-dom: ^7.8.2
- axios (for API calls)

**Development Dependencies**:
- @vitejs/plugin-react: ^5.0.0
- eslint: ^9.33.0
- eslint-plugin-react-hooks: ^5.2.0
- vite: ^7.1.5

#### Build & Installation
```bash
cd frontend
npm install
npm run dev    # Development server
npm run build  # Production build
```

#### Main Files
**Entry Point**: src/main.jsx
**Routing**: src/App.jsx
**Key Components**: 
- src/pages/RegisterPage.jsx (Multi-step registration form)
- src/pages/LoginPage.jsx
- src/pages/LandingPage.jsx
**API Service**: src/services/api.js

### Backend (Express.js Server)
**Configuration File**: backend/package.json

#### Language & Runtime
**Language**: JavaScript (Node.js)
**Framework**: Express.js 5.1.0
**Database**: MongoDB with Mongoose
**Package Manager**: npm

#### Dependencies
**Main Dependencies**:
- express: ^5.1.0
- mongoose: ^8.18.1
- cors: ^2.8.5
- dotenv: ^17.2.2
- bcrypt (for password hashing)
- jsonwebtoken (for authentication)
- express-validator (for request validation)

#### Build & Installation
```bash
cd backend
npm install
node server.js
```

#### Main Files
**Entry Point**: server.js
**Models**: models/User.js
**Routes**:
- routes/auth.js (Authentication routes)
- routes/farmer.js
- routes/customer.js
- routes/agricare.js
- routes/hubmanager.js
- routes/admin.js

#### Database
**Type**: MongoDB
**Connection**: Environment variable MONGO_URI
**Models**:
- User: Authentication and profile data with role-based schema