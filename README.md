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

---

### Feature 2 — User Profile Management

**Backend**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/user/profile` | Get authenticated user profile |
| PUT | `/api/user/profile` | Update name, username, and profile image |
| PUT | `/api/user/change-password` | Change password (requires current password) |

- Profile image stored as **Base64** · max **1MB** · JPEG, PNG, WebP, GIF supported
- Username uniqueness enforced at service + DB level · no spaces · alphanumeric, dots, hyphens only
- Old password verified before allowing password change · new password must differ

**Frontend**

| Route | Page | Description |
|-------|------|-------------|
| `/profile` | Profile | Edit name, username, avatar · change password |

- Profile updates sync to global **Auth Context** immediately
- Avatar upload with live preview via FileReader API · camera overlay on hover

---

### Feature 3 — Global Layout & UI System

**Backend** — No new routes (uses existing `/api/auth/me` for session restore)

**Frontend**

| Route | Page | Notes |
|-------|------|-------|
| `/*` (authenticated) | AppLayout + Navbar | Sticky nav · user dropdown · sign out |
| `*` | NotFound | 404 fallback page |

- `AppLayout` wraps all authenticated pages — sticky Navbar + Toast outlet via `<Outlet />`
- `ProtectedRoute` / `PublicRoute` use React Router v6 nested route pattern
- `UIContext` provides global `showToast(message, type)` — success, error, info, warning
- `Button` component: primary, secondary, ghost, danger variants · sm / md / lg sizes
- `Modal` component: portal-based · Escape to close · backdrop click to close
- SCSS modules added: `_layout`, `_navbar`, `_button`, `_modal`, `_toast`, `_pages`, `_typography`
- CSS custom property `--navbar-height: 60px` used across pages for precise layout sizing
