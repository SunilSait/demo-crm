# Alphagnito CRM — Full Stack Web Application

A functional, full-stack CRM web application for property inspection management, built with React JS, Node.js/Express, and MySQL.

---

## Project Overview

Alphagnito CRM enables real estate teams to manage agents, properties, and inspections through a clean dashboard interface. It includes role-based authentication, a full agent management module (CRUD), and an activity overview dashboard.

**Pages implemented:**
- Login page (JWT-based auth)
- Register page (full form validation)
- Dashboard (stats overview, quick actions, recent activity)
- Agents page (full CRUD — create, read, update, delete with pagination, search, filter)

---

## Tech Stack

| Layer    | Technology                         |
|----------|------------------------------------|
| Frontend | React JS 18, React Router v6, Axios|
| Styling  | Custom CSS (Inter font, design system from Figma) |
| Backend  | Node.js + Express JS               |
| Auth     | JWT (jsonwebtoken) + bcryptjs      |
| Database | MySQL 8 (mysql2 driver)            |

---

## Project Structure

```
alphagnito-crm/
├── backend/
│   ├── config/
│   │   ├── db.js           # MySQL connection pool
│   │   └── schema.sql      # Database setup script
│   ├── middleware/
│   │   └── auth.js         # JWT verification middleware
│   ├── routes/
│   │   ├── auth.js         # Register, Login, Logout, /me
│   │   └── agents.js       # Full CRUD for agents
│   ├── server.js           # Express app entry point
│   ├── .env.example        # Environment variable template
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.js          # Navigation sidebar
│   │   │   ├── Topbar.js           # Header with search & user
│   │   │   ├── ProtectedRoute.js   # Auth guard for routes
│   │   │   ├── AgentModal.js       # Add/Edit agent form modal
│   │   │   └── ConfirmDialog.js    # Delete confirmation dialog
│   │   ├── context/
│   │   │   └── AuthContext.js      # Global auth state (React Context)
│   │   ├── pages/
│   │   │   ├── Login.js            # Login page
│   │   │   ├── Register.js         # Registration page
│   │   │   ├── Dashboard.js        # Dashboard with stats
│   │   │   ├── Agents.js           # Agent management (CRUD)
│   │   │   └── Placeholder.js      # Stub for future pages
│   │   ├── utils/
│   │   │   └── api.js              # Axios API helpers
│   │   ├── App.js                  # Routes configuration
│   │   ├── styles.css              # Complete design system styles
│   │   └── index.js
│   └── package.json
│
└── README.md
```

---

## Database Schema

```sql
-- Users table
CREATE TABLE users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  full_name     VARCHAR(100) NOT NULL,
  email         VARCHAR(150) NOT NULL UNIQUE,
  mobile_number VARCHAR(20)  NOT NULL,
  password      VARCHAR(255) NOT NULL,   -- bcrypt hashed
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Agents table
CREATE TABLE agents (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  agent_name   VARCHAR(100) NOT NULL,
  company_name VARCHAR(150) NOT NULL,
  email        VARCHAR(150) NOT NULL UNIQUE,
  phone        VARCHAR(30)  NOT NULL,
  properties   INT DEFAULT 0,
  inspections  INT DEFAULT 0,
  status       ENUM('Active','Inactive','Suspended') DEFAULT 'Active',
  created_by   INT,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);
```

---

## Setup Instructions

### Prerequisites
- Node.js 16+
- MySQL 8.0+
- npm or yarn

---

### 1. Database Setup

```bash
# Log into MySQL
mysql -u root -p

# Run the schema script
source /path/to/alphagnito-crm/backend/config/schema.sql

# Or manually:
CREATE DATABASE alphagnito_crm;
USE alphagnito_crm;
# (paste contents of schema.sql)
```

---

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your values:
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=your_password
# DB_NAME=alphagnito_crm
# JWT_SECRET=your_secret_key
# PORT=5000
# CLIENT_URL=http://localhost:3000

# Start the server
npm run dev      # development (nodemon)
npm start        # production
```

Backend runs on: `http://localhost:5000`

---

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

Frontend runs on: `http://localhost:3000`

---

## API Endpoint Documentation

### Auth Endpoints

| Method | Route              | Description               | Auth Required |
|--------|--------------------|---------------------------|---------------|
| POST   | /api/auth/register | Register new user         | No            |
| POST   | /api/auth/login    | Login, returns JWT        | No            |
| POST   | /api/auth/logout   | Logout (client clears JWT)| Yes           |
| GET    | /api/auth/me       | Get current user profile  | Yes           |

**POST /api/auth/register — Request Body:**
```json
{
  "full_name": "John Doe",
  "email": "john@example.com",
  "mobile_number": "+44 7000 000000",
  "password": "secret123",
  "confirm_password": "secret123"
}
```

**POST /api/auth/login — Request Body:**
```json
{
  "email": "john@example.com",
  "password": "secret123"
}
```

**POST /api/auth/login — Response:**
```json
{
  "success": true,
  "token": "<JWT>",
  "user": { "id": 1, "full_name": "John Doe", "email": "john@example.com" }
}
```

---

### Agent Endpoints (all require `Authorization: Bearer <token>`)

| Method | Route            | Description                          |
|--------|------------------|--------------------------------------|
| GET    | /api/agents      | List agents (pagination, search, filter) |
| GET    | /api/agents/:id  | Get single agent                     |
| POST   | /api/agents      | Create new agent                     |
| PUT    | /api/agents/:id  | Update agent                         |
| DELETE | /api/agents/:id  | Delete agent                         |

**GET /api/agents — Query Params:**
```
?page=1&limit=10&search=Michael&status=Active
```

**POST /api/agents — Request Body:**
```json
{
  "agent_name": "Michael",
  "company_name": "Bluenest Reality",
  "email": "michael@bluenest.com",
  "phone": "+44 7911 234567",
  "properties": 18,
  "inspections": 42,
  "status": "Active"
}
```

---

## Environment Variable Reference

### Backend `.env`

| Variable     | Description                        | Default                    |
|--------------|------------------------------------|----------------------------|
| PORT         | API server port                    | 5000                       |
| DB_HOST      | MySQL host                         | localhost                  |
| DB_USER      | MySQL username                     | root                       |
| DB_PASSWORD  | MySQL password                     | (empty)                    |
| DB_NAME      | MySQL database name                | alphagnito_crm             |
| JWT_SECRET   | Secret key for JWT signing         | (required — change this!)  |
| CLIENT_URL   | Allowed CORS origin                | http://localhost:3000      |

---
