# Real-Time Chat App

A full-stack real-time chat app built with React, Node.js, Express, and MongoDB.

**Stack:** React + Vite + SCSS · Node.js + Express · MongoDB + Mongoose · JWT · Socket.io (upcoming)

---

## Getting Started

```bash
# Backend — copy .env.example to .env and fill in your values
cd server && npm run dev

# Frontend — copy .env.example to .env
cd client && npm run dev
```

Frontend runs on `http://localhost:5173` · Backend API on `http://localhost:5000/api`

---

## Features

### Feature 1 — Authentication System

**Backend**

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register with name, username, email, password |
| POST | `/api/auth/login` | Login and receive a JWT |
| POST | `/api/auth/forgot-password` | Send password reset link to email |
| POST | `/api/auth/reset-password` | Reset password using token from email |
| GET | `/api/auth/me` | Get logged-in user *(requires JWT)* |

- Passwords hashed with **bcrypt** · Reset tokens **SHA-256 hashed** · **15-minute** token expiry
- Generic error messages to prevent user enumeration

**Frontend**

| Route | Page | Description |
|-------|------|-------------|
| `/register` | Register | Sign up with validation |
| `/login` | Login | Sign in + forgot password link |
| `/forgot-password` | Forgot Password | Request a reset link |
| `/reset-password` | Reset Password | Set new password via email link |

- Auth state managed via **React Context** · JWT stored in `localStorage`
- Protected routes redirect to `/login` if not authenticated
