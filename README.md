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

---

### Feature 4 — Dashboard (Authenticated Home)

**Backend**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard` | Get user + stats summary *(requires JWT)* |

**Frontend**

| Route | Page | Description |
|-------|------|-------------|
| `/` | Dashboard | Welcome · user card · quick actions · stats |

- Time-based greeting (morning / afternoon / evening) based on local time
- User card displays avatar, name, username, email, and active badge
- Quick actions panel — Profile link active · Start Chat, Find People, Settings coming soon
- Stats row — Member Since (real date), Profile status (complete/incomplete), Messages (0 placeholder)
- `SectionWrapper` reusable layout component for titled sections

---

### Feature 5 — Real-Time Notification System

**Backend** — No REST routes (Socket.io events only)

- Socket.io server attached to the Node HTTP server
- JWT authentication middleware on every socket connection (`socket.handshake.auth.token`)
- `socketEmitter` maps `userId → Set<socketId>` for targeted multi-tab delivery
- Emits `notification` event after profile update (success) and password change (warning)

**Frontend**

- `socket.js` — singleton Socket.io client, `autoConnect: false`, reconnects up to 5×
- `NotificationContext` — connects on login, disconnects on logout, caps history at 50
- Each incoming `notification` event appends to panel list **and** fires a toast
- `NotificationBell` in Navbar — gradient badge for unread count, cleared on panel open
- `NotificationPanel` — glassmorphism dropdown with scrollable list and "Clear all"
- `NotificationItem` — colour-coded icon per type (success · error · info · warning) + relative timestamp

---

### Feature 6 — User Search & Discovery

**Backend**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/search?query=` | Search users by username *(requires JWT)* |

- Case-insensitive partial match · regex-escaped input prevents ReDoS
- Excludes the requesting user from results · max 15 results per request
- In-memory rate limiter: 30 requests / 60 s per user

**Frontend**

| Route | Page | Description |
|-------|------|-------------|
| `/search` | Search | Real-time user discovery by username |

- 300 ms debounced input via `useDebounce` hook · stale-request cancellation
- `SearchInput` — full-width glass input with search icon, spinner, and clear button
- `UserResultCard` — avatar, name, username row with slide-in animation
- `EmptyState` — shown when query returns no matches
- "Find People" quick action on Dashboard now links to `/search`

---

### Feature 7 — Conversation System + Real-Time Messaging

**Backend**

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/conversations` | Create or fetch existing 1-to-1 conversation |
| GET | `/api/conversations` | Get all conversations for logged-in user |
| GET | `/api/conversations/:id` | Get conversation by ID *(participant only)* |
| POST | `/api/messages/:conversationId` | Send a message *(participant only)* |
| GET | `/api/messages/:conversationId` | Get paginated messages *(participant only)* |

- `Conversation` model: participants array (2 users), lastMessage ref, timestamps · indexed on `participants` and `updatedAt`
- `Message` model: conversationId, senderId, text, messageType · max 2000 chars · indexed on `conversationId + createdAt`
- `conversationAccess` middleware validates participant membership before every message/conversation route
- `message.service.js` handles create + `lastMessage` update atomically
- Duplicate conversation prevention via `$all` + `$size: 2` query
- `message.handler.js` socket handler: validates membership, persists via service, emits `receive_message` to all participant sockets (multi-tab support)
- Pagination: `?page=1&limit=30` · messages returned oldest-first per page · max 50 per request

**Frontend**

| Route | Page | Description |
|-------|------|-------------|
| `/chat` | Chat | Conversation list with empty-state prompt |
| `/chat/:conversationId` | Chat | Active conversation with real-time messaging |

- `ChatContext` — manages conversations list, per-conversation message map, pagination state, real-time socket listener, and `startConversation` / `sendMessage` actions
- `ChatLayout` — fixed sidebar + fluid chat window · responsive: sidebar/window swap on mobile via CSS transform
- `ConversationList` — sorted by `updatedAt`, skeleton loaders, empty state
- `ConversationItem` — avatar with initials fallback, last message preview truncated at 40 chars, timestamp, active-state left-border highlight
- `ChatHeader` — participant avatar + name/username, back button visible on mobile
- `MessageList` — auto-scroll on new messages, "Load earlier messages" pagination button, skeleton loaders
- `MessageBubble` — sent (gradient) / received (glass) variants · timestamp · `bubbleIn` animation
- `MessageInput` — `Enter` to send · `Shift+Enter` for newline · auto-clamp textarea · animated send button activates when text is present
- Real-time flow: client emits `send_message` → server persists + emits `receive_message` to all participant sockets
- Message deduplication by `_id` prevents duplicates across socket and REST responses
- "Start a Chat" quick action on Dashboard now links to `/chat`
