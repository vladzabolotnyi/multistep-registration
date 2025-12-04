# Multi-Step User Registration System

A full-stack user registration application featuring a multi-step form with React frontend and Go backend, implementing comprehensive validation, middleware chains, and database persistence.

## DEMO

### Success flow

[Success flow](https://github.com/user-attachments/assets/011df03c-cabb-4f18-a545-1bd5e1320642)

### Validation rules flow

[Validation rules flow](https://github.com/user-attachments/assets/907e0c4c-e992-428d-86c3-1fa992775cd0)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Running Tests](#running-tests)
- [Assumptions](#assumptions)

## ✨ Features

### Frontend

- **Multi-step form** with 4 distinct steps (Personal Info, Address, Account Setup)
- **Progress indicator** with step navigation
- **Real-time validation** with immediate feedback
- **Data persistence** across navigation
- **Review screen** before final submission
- **Responsive UI** with loading states
- **Email domain validation** matching selected country

### Backend

- **RESTful API** with Go and Gin framework
- **Middleware chain architecture** for extensible validation
- **PostgreSQL database** with migrations
- **SQLC** for type-safe database queries
- **Field-level and cross-field validation**
- **Username and email uniqueness checks**
- **Structured error responses**
- **Health check endpoints**

## 🛠 Tech Stack

### Frontend

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Context API** - State management
- **TailwindCSS** - Component styling
- **Axios** - HTTP client

### Backend

- **Go 1.24** - Backend language
- **Gin** - Web framework
- **PostgreSQL 15** - Database
- **SQLC** - SQL code generation
- **golang-migrate** - Database migrations
- **Docker & Docker Compose** - Containerization

## 📦 Prerequisites

- Go 1.24+
- Node.js 20+
- Docker
- Make

## 🚀 Quick Start

### Option 1: Docker Compose

1. **Clone the repository**

```bash
git clone git@github.com:vladzabolotnyi/multistep-registration.git
cd multistep-registration
```

2. **Create environment file**

```bash
# Backend uses sensible defaults, but you can customize:
cat > .env << EOF
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=registration_db
DB_SSLMODE=disable
DB_MIGRATIONS_PATH=./internal/database/migrations

PORT=8080
GIN_MODE=debug
READ_TIMEOUT=10
WRITE_TIMEOUT=10

PASSWORD_COST=12
EOF
```

3. **Start all services**

```bash
make docker-run
```

4. **Access the application**

- Frontend: http://localhost:5173
- Backend API: http://localhost:8080
- Health Check: http://localhost:8080/health

5. **Stop services**

```bash
make docker-down
# or
docker compose down
```

### Option 2: Local Development

1. **Start PostgreSQL**

```bash
make db-up
```

2. **Install backend dependencies**

```bash
go mod download
```

3. **Run database migrations** (automatic on app start)

4. **Start backend**

```bash
make run
```

5. **Access the application**

- Frontend: http://localhost:5173
- Backend: http://localhost:8080

## 🧪 Running Tests

### Testing Strategy

While tests are not currently implemented due to time constraints, here's the comprehensive testing approach planned for this project:

1. Frontend Testing
   Testing Stack:

- Jest - Primary testing framework
- React Testing Library - Component testing utilities
- MSW (Mock Service Worker) - API response stubbing

Testing Approach:

Presentational Components: Utilize snapshot testing to ensure UI renders correctly and catches unintended visual regressions
Container Components/Pages: Implement integration tests focusing on user workflows and component interactions
API Service Layer: Mock API calls to verify correct request formatting, response handling, and error scenarios

Multi-Step Form Testing:
For the multi-step form implementation, tests would include:

Helper functions to simulate form progression through each step
Validation testing for each input field at every step
End-to-end submission flow testing, including success/error response handling
State management verification across form steps

### Backend Testing

Testing Stack:

- Testify - Assertion library and test suites
- GoMock - Mock generation for interfaces
- Godog (optional) - BDD framework for behavior-driven development if adopted project-wide

Testing Approach:

Unit Tests: Isolated testing of validators, utilities, and pure functions
Integration Tests: Service layer and HTTP handlers with mocked database interactions
Database Layer: Mock repository calls to verify correct query execution and data handling
API Contracts: Ensure request/response schemas match documentation

## 📝 Assumptions

1. **Email Domain Validation:**
   - UK emails should contain ".uk" (e.g., .co.uk)
   - US emails should contain ".com", ".edu", ".gov", or ".org"
   - Other countries have similar domain patterns

2. **Username Availability:**
   - Checked in real-time via debounced API call
   - Case-insensitive uniqueness check

3. **Password Requirements:**
   - Minimum 8 characters
   - Must include: uppercase, lowercase, number, special character
   - bcrypt has restriction with 72 bytes long but intentionally restrictred with 50

4. **Phone Number:**
   - Optional field
   - If provided, must be in valid international format
   - No country-specific validation

5. **Data Persistence:**
   - Form data persists in memory during session
   - Cleared after successful submission or page refresh

6. **Database:**
   - PostgreSQL for production reliability
   - SQLC provides generic interface to apply any SQL database but before switching you have to adjust extensions and types in migrations
