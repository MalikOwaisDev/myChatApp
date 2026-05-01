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

---

### Feature 8 — Online Presence & Typing Indicators

**Backend** — No new REST routes (Socket.io events only)

- `presence.service.js` — `getConversationPartners(userId)` queries all conversations to find who should receive presence updates; `isOnline(userId)` checks live socket count via `socketEmitter`
- `presence.handler.js` — on connect: notifies conversation partners via `user_online`, sends `presence_init` (filtered to online partners only); on disconnect: emits `user_offline` only when the user's last socket closes (multi-tab safe)
- `typing.handler.js` — receives `typing_start` / `typing_stop` from sender, validates conversation membership, forwards payload to the other participant only
- `socketEmitter` extended with `isOnline(userId)` and `getAllOnlineUserIds()` helpers
- Presence is **not stored in the database** — in-memory only, derived from the live `userSockets` map
- Privacy: `presence_init` only includes partners of the connecting user, not all online users

**Socket events**

| Direction | Event | Payload | Description |
|-----------|-------|---------|-------------|
| server → client | `presence_init` | `{ onlineUserIds[] }` | Sent on connect — online conversation partners |
| server → client | `user_online` | `{ userId }` | A conversation partner came online |
| server → client | `user_offline` | `{ userId }` | A conversation partner went offline |
| client → server | `typing_start` | `{ conversationId }` | User started typing |
| client → server | `typing_stop` | `{ conversationId }` | User stopped typing |
| server → client | `typing_start` | `{ conversationId, userId }` | Forwarded to other participant |
| server → client | `typing_stop` | `{ conversationId, userId }` | Forwarded to other participant |

**Frontend**

- `ChatContext` extended with `onlineUsers` (`{ [userId]: true }` map) and `typingUsers` (`{ [conversationId]: true }` map); listeners for all 5 presence/typing events; typing cleared automatically when a message arrives
- `OnlineStatus` component — coloured dot: green + glow when online, dim when offline; used in header and conversation list
- `TypingIndicator` component — three bouncing dots with staggered animation + italic "… is typing" label; rendered between message list and input when active
- `ChatHeader` — `@username` line replaced with live presence row: green dot + "Online" when active, grey dot + `@username` when offline
- `ConversationItem` — green presence dot overlaid on avatar (bottom-right, bordered) when other user is online
- `MessageInput` — debounced typing events: `typing_start` on first keystroke, auto `typing_stop` after 2 s of inactivity; immediate `typing_stop` on send or conversation change; cleans up on unmount

---

### Feature 9 — Message Status System (Sent · Delivered · Seen)

**Backend** — 4 new files, 4 modified

| Method | Endpoint | Description |
|--------|----------|-------------|
| PUT | `/api/messages/delivered` | Mark conversation messages as delivered *(recipient only)* |
| PUT | `/api/messages/seen` | Mark conversation messages as seen *(recipient only)* |

- `Message` model extended with `status` field: `enum ['sent', 'delivered', 'seen']`, default `'sent'`
- `messageStatus.service.js` — `markDelivered` and `markSeen`: both use `updateMany` for batch efficiency, return `{ [senderId]: [messageId, ...] }` map used for targeted socket emission
- `messageStatus.controller.js` — validates conversation membership inline, calls service, emits `message_delivered` / `message_seen` to each sender via `emitToUser`
- `messageStatus.routes.js` — `PUT /delivered` and `PUT /seen`, mounted at `/api/messages` **before** the dynamic `/:conversationId` routes to prevent path collision
- `messageStatus.handler.js` — socket handler: listens to `mark_delivered` client event, validates membership, calls service, emits `message_delivered` (lower-latency alternative to REST for real-time delivery confirmation)
- Only the **recipient** can update status — `senderId !== userId` enforced at the service layer, preventing senders from faking their own read receipts

**Socket events**

| Direction | Event | Payload | Description |
|-----------|-------|---------|-------------|
| client → server | `mark_delivered` | `{ conversationId }` | Recipient signals message received (socket path) |
| server → client | `message_delivered` | `{ conversationId, messageIds[] }` | Sender's UI updates ticks to delivered |
| server → client | `message_seen` | `{ conversationId, messageIds[] }` | Sender's UI updates ticks to seen |

**Frontend**

- `ChatContext` — two new status update paths: (1) on `receive_message` from other user, emits `mark_delivered` via socket; (2) on `openConversation`, calls `PUT /messages/seen` via REST; listens to `message_delivered` and `message_seen` events and patches message status in state by `_id`
- `MessageBubble` — `__footer` row aligns timestamp + status tick to the right; `MessageStatus` sub-component renders SVG ticks: single check (`sent`), double grey check (`delivered`), double purple check (`seen`, `color: #a5b4fc`)
- Tick SVGs: custom inline paths — single checkmark `(1→4→11)`, double checkmark offset by 4px on x-axis
- Status is never shown on received messages (only on `isMine` bubbles)
- Existing messages loaded via REST already carry their DB `status`, so historical ticks render correctly on page load

---

### Feature 10 — Media & File Sharing + Chat-Aware Notifications

**Backend** — 5 new files, 4 modified

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/messages/media` | Send an image message *(requires JWT, participant only)* |

- `Message` model extended with `media` (Base64 string), `mediaType` (`image/jpeg` · `image/png` · `image/webp` · `image/gif`), and `messageType` enum extended to include `'media'`; `text` field made optional (either `text` or `media` present)
- `fileValidation.middleware.js` — validates Base64 data URL via existing `validateBase64Image` util (type + 1 MB size check), extracts `mediaType` from the data URL prefix and attaches to `req.mediaType`
- `mediaMessage.service.js` — `createMediaMessage`: persists message with `messageType: 'media'`, atomically updates `Conversation.lastMessage`
- `mediaMessage.controller.js` — validates conversation membership inline, calls service, emits `receive_message` to all participants via `emitToUser` (reuses same event as text messages — `messageType` field distinguishes rendering)
- `mediaMessage.routes.js` — `POST /`, mounted at `/api/messages/media` **before** the dynamic `/:conversationId` routes
- `media.handler.js` — socket handler: listens to `send_media` client event as a lower-latency alternative to the REST path; validates, persists, emits `receive_message` to participants
- `conversation.controller.js` — `lastMessage` populate select extended with `messageType` so the sidebar can display "📷 Photo" for media last messages
- JSON body limit stays at **5 MB** (sufficient for 1 MB images after Base64 ~33 % overhead)

**Socket events**

| Direction | Event | Payload | Description |
|-----------|-------|---------|-------------|
| client → server | `send_media` | `{ conversationId, media }` | Socket path for sending media (alternative to REST) |
| server → client | `receive_message` | `{ ..., media, mediaType, messageType: 'media' }` | Reuses existing event; all participants receive the media message |

**Frontend**

- `media.service.js` — `sendMediaApi(conversationId, media)`: `POST /messages/media` with Base64 payload
- `MediaUpload` — hidden `<input type="file">` behind a clip-icon button; accepts JPEG · PNG · WebP · GIF; reads via `FileReader` → Base64 data URL; passes result to parent via `onMedia` callback
- `MediaPreview` — thumbnail preview (110 × 110 px, object-fit cover) with an absolute × dismiss button; shown above the input row after a file is selected
- `UploadLoader` — three bouncing dots (reuses `typingDot` animation) rendered in place of the send button while uploading
- `MediaMessageBubble` — renders `<img>` (max 260 px tall, contain) inside the standard bubble shell; same `__footer` / `MessageStatus` tick logic as text bubbles; `isMine` styling identical to `MessageBubble`
- `MessageInput` — extended: `MediaUpload` button left of the textarea; `MediaPreview` fragment above the input row; send handler branches on `pendingMedia` → calls `sendMedia`; textarea disabled while image is staged; `UploadLoader` replaces send button while `uploading`
- `MessageList` — routes each message to `MediaMessageBubble` or `MessageBubble` based on `msg.messageType`
- `ConversationItem` — last-message preview shows **📷 Photo** when `lastMessage.messageType === 'media'`
- `ChatContext` — `sendMedia(conversationId, media)`: calls REST, sets `uploading` flag, shows error toast on failure; `receive_message` socket handler unchanged — media messages enter the same deduplication + unread-count + mark-delivered flow as text messages
- `NotificationContext` — `handleReceiveMessage` now produces "sent you a photo" text for `messageType === 'media'` entries in the notification panel
- Chat-aware notification logic unchanged: active-conversation messages suppress the toast; inactive-conversation messages show toast + increment unread badge

---

### Feature 11 — User Settings & Chat Preferences + Conversation Management

**Backend** — 8 new files, 7 modified

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/settings` | Get user settings and blocked users list |
| PUT | `/api/settings` | Update notification / sound preferences |
| PUT | `/api/conversations/:id/mute` | Mute a conversation for the requesting user |
| PUT | `/api/conversations/:id/unmute` | Unmute a conversation |
| DELETE | `/api/conversations/:id` | Soft-delete conversation from user's inbox |
| DELETE | `/api/messages/:conversationId/clear` | Clear all messages for the requesting user only |
| POST | `/api/users/block` | Block a user — prevents messaging in both directions |
| POST | `/api/users/unblock` | Remove a block |

- `User` model extended with `settings` (`notificationsEnabled`, `soundEnabled` — both Boolean, default `true`) and `blockedUsers` (`ObjectId[]` ref User)
- `Conversation` model extended with `mutedBy` (`ObjectId[]`) and `deletedFor` (`ObjectId[]`); `getUserConversations` filters `{ deletedFor: { $nin: [userId] } }`; `createOrGetConversation` uses `findOneAndUpdate` with `$pull: { deletedFor }` to restore a previously deleted conversation when the user re-initiates it
- `Message` model extended with `deletedFor` (`ObjectId[]`); `getMessages` service filters `{ deletedFor: { $nin: [userId] } }` to implement per-user message clearing
- `settings.service.js` — `getSettings` populates blocked users with name/username/profileImage; `updateSettings` uses `$set` on individual sub-paths to safely update boolean preferences
- `conversationManagement.controller.js` — `muteConversation` / `unmuteConversation` use `$addToSet` / `$pull`; `deleteConversation` uses `$addToSet`; `clearMessages` uses `Message.updateMany` with `$addToSet: { deletedFor }`
- `block.controller.js` — `blockUser` validates self-block, confirms target exists, returns target's public profile; block check enforced in `message.handler.js` and `mediaMessage.controller.js` / `media.handler.js` — both directions checked (`sender → other` and `other → sender`) before any message is persisted
- `conversationManagement.routes.js` mounted at `/api/conversations` **before** base conversation routes; `clearMessages` route added to `message.routes.js` as `DELETE /:conversationId/clear` before `/:conversationId` to avoid path collision; `block.routes.js` mounted alongside `userSearch.routes.js` at `/api/users`

**Frontend** — 12 new files, 8 modified

- `SettingsContext` — loads settings + blocked users on login via `GET /api/settings`; exposes `updateSettings`, `blockUser`, `unblockUser`, `isBlocked(userId)`; resets on logout; `SettingsProvider` wraps `NotificationProvider` + `ChatProvider` in `App.jsx`
- `settings.service.js` / `conversationManagement.service.js` — thin Axios wrappers for all 8 new endpoints
- **Settings page** (`/settings`) — three sections: Notifications (toggle panel), Privacy (blocked users list + unblock), Account Info (read-only name/username/email)
- `ToggleSwitch` — accessible checkbox hidden behind custom styled track + thumb; animated with CSS transition; purple gradient when checked
- `SettingsPanel` — renders two toggle rows (Chat Notifications, Sound); calls `updateSettings` on toggle change with per-key `saving` state
- `PrivacySection` — lists blocked users with avatar/name/username; per-item `Unblock` button with loading state
- `AccountInfo` — reads from `AuthContext`; read-only display of name, username, email, optional avatar
- `ChatMenu` — 3-dot trigger button in `ChatHeader`; click-outside closes; dropdown with Mute/Unmute (optimistic state from `conv.mutedBy`), Clear Chat, Delete Conversation, Block/Unblock User; destructive actions route through `ConfirmModal`
- `ConfirmModal` — portal-based dialog (renders into `document.body`); Escape key closes; danger/confirm/cancel button variants; receives `loading` prop to disable buttons during async actions
- `ChatHeader` — receives `conversationId` and `isMuted` props; renders `ChatMenu`; shows a "Muted" pill badge next to presence when muted
- `ChatLayout` — computes `isMuted` from `activeConv.mutedBy?.includes(myId)` and passes to `ChatHeader`; imports `useAuth` for `myId`
- `ChatContext` — `muteConversation` / `unmuteConversation` optimistically patch `mutedBy` array in local conversation state; `deleteConversation` removes from `conversations` list and clears `messages` map; `clearMessages` empties `messages[convId]`; `receive_message` handler suppresses toast when `conv.mutedBy` includes `myId` OR `settings.notificationsEnabled === false`; settings read via `settingsRef` (always-fresh, no stale closure)
- `UserDropdown` — "Settings" link added between "My Profile" and "Sign Out"
- `main.scss` — imports new `_settings.scss` partial

---

### Feature 12 — Performance Optimization + Chat Security Hardening

**Backend** — 2 new files, 5 modified

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/messages/:conversationId?cursor=&limit=` | Cursor-based paginated message fetch |

- `pagination.service.js` — `getPagedMessages(conversationId, userId, cursor, limit)`: cursor is the `_id` of the oldest message currently loaded; queries `{ _id: { $lt: cursor } }`, sorts `{ _id: -1 }`, fetches `limit + 1` to detect `hasMore`, reverses result to chronological order; returns `{ messages, hasMore, nextCursor }` where `nextCursor` is the `_id` of the oldest returned message
- `sanitize.middleware.js` — `sanitizeBody`: strips HTML tags via regex (`<[^>]*>`) and removes dangerous control characters (`\x00–\x1F` range) from `req.body.text`; applied to all text message send routes
- `message.controller.js` — `getMessages` updated to use `paginationService.getPagedMessages`; accepts `cursor` (MongoDB `_id`) and `limit` query params; page-based pagination removed
- `message.service.js` — `getMessages` function removed; `createMessage` retained
- `message.routes.js` — `messageSendLimiter` applied to `POST /:conversationId` (30 messages / 60 s); `sanitizeBody` middleware applied to the same route
- `mediaMessage.routes.js` — `mediaSendLimiter` applied to `POST /` (20 media / 60 s)
- `message.handler.js` (socket) — per-socket `createSocketRateLimit(30, 60_000)` closure created at handler registration; rate check runs before all other validation; text is sanitized with `stripHtml` inline before persistence
- `media.handler.js` (socket) — per-socket `createSocketRateLimit(20, 60_000)` closure; rate check runs before validation; socket emits `message_error` with `'Rate limit exceeded'` on breach
- `Message` model indexes: compound `{ conversationId: 1, createdAt: 1 }` — unchanged but now leveraged by cursor query on `_id` (which shares the same index prefix)

**Frontend** — 4 new files, 4 modified

- `pagination.service.js` (backend) / `message.service.js` (frontend) — `getMessagesApi` updated to accept `cursor` (nullable string) instead of `page`; sends `cursor` as query param only when non-null
- `usePagination.js` (hook) — encapsulates `hasMore`, `loadMore`, `loadingMore` for a given `conversationId`; reads from `ChatContext`; `loadMore` only fires when `!loadingMore && hasMore && msgs.length > 0`
- `InfiniteScrollLoader` — invisible 1 px sentinel div; single `IntersectionObserver` created on mount (never re-created); uses `disabledRef` and `callbackRef` to read latest `disabled` / `onIntersect` values without re-running the effect; fires callback once per intersection event when not disabled; `rootMargin: '100px 0px 0px 0px'` pre-loads slightly before the sentinel is visible
- `MessagePaginationLoader` — three skeleton rows (55% / 45% width, alternating sides) animated with `skeletonPulse` keyframe; rendered at the top of the message list while `loadingMore` is true
- `MessageList` — replaced button-based "Load earlier" with `InfiniteScrollLoader` sentinel at list top; uses `useLayoutEffect` (runs before paint) to either restore scroll position after prepend or smooth-scroll to bottom after append; `savedScrollOffsetRef` stores `scrollHeight − scrollTop` before fetch, consumed after DOM update to keep the user's view stable; `usePagination` hook provides `hasMore` / `loadingMore` / `loadMore`
- `ChatContext` — `messagePages` removed; replaced with `hasMoreMessages` (map of `convId → boolean`) and `loadingMore` (boolean); `loadMessages(conversationId, cursor)` dispatches to correct loading state flag; `loadEarlierMessages` derives cursor from `msgs[0]._id` (oldest in current slice); `deleteConversation` and `clearMessages` also clean up `hasMoreMessages` map; logout resets `hasMoreMessages`
- `_chat.scss` — added `.infinite-scroll-trigger` (1 px sentinel), `.msg-pagination-loader` with `__item` and `__item--right` variants, `@keyframes skeletonPulse`

---

### Feature 13 — Deployment & Production Readiness

**Backend** — 2 new files, 4 modified

- `logger.util.js` — structured console logger with ISO timestamp prefix and four levels (`info`, `warn`, `error`, `debug`); `debug` is silenced in production; used throughout config, middleware, and app startup
- `security.middleware.js` — `setSecurityHeaders` sets `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `X-XSS-Protection: 0` (disabled in favour of CSP), `Referrer-Policy`, `Permissions-Policy`; adds `Strict-Transport-Security` in production only; `globalLimiter` wraps `createRateLimiter` at 500 req / 15 min as a broad API-wide ceiling on top of the stricter per-route limits
- `config/env.js` — adds `NODE_ENV` export; fail-fast validation checks `MONGO_URI` and `JWT_SECRET` on startup and calls `process.exit(1)` with a clear error message if either is missing
- `config/db.js` — adds `serverSelectionTimeoutMS: 5000` and `socketTimeoutMS: 45000`; wraps `mongoose.connect` in try/catch so connection failures log via `logger` and exit cleanly; replaces raw `console.log`
- `error.middleware.js` — in production: logs `METHOD PATH — message` (no stack); in development: logs full stack; `stack` field is stripped from the JSON response body in production to avoid internal path/module disclosure
- `app.js` — calls `app.disable('x-powered-by')`; wires `setSecurityHeaders` and `globalLimiter` before routes; replaces `console.log` startup message with `logger.info`
- `server/.env.example` — added `NODE_ENV=development`

**Frontend** — 2 new files, 11 modified

- `client/src/config/env.js` — single source of truth for `API_URL`, `SOCKET_URL`, and `IS_PROD`; all values read from `import.meta.env` with localhost fallbacks for development
- `client/src/services/apiClient.js` — single shared Axios instance using `API_URL` from `env.js`; attaches `Authorization: Bearer <token>` from `localStorage` on every request via a request interceptor; replaces the duplicated `axios.create` + interceptor boilerplate that existed in each of the 9 service files
- All 9 service files updated (`auth`, `conversation`, `message`, `media`, `settings`, `conversationManagement`, `user`, `dashboard`, `search`) — removed local `axios.create` block; now import and use `apiClient` directly
- `socket/socket.js` — imports `SOCKET_URL` from `config/env.js` instead of inlining the env read
- `vite.config.js` — added `build` config: `sourcemap: false`, `chunkSizeWarningLimit: 1000`, `manualChunks` splitting React/router into `vendor`, Socket.IO into `socket`, Axios into `http` — reduces initial bundle size and improves cache efficiency for unchanged chunks
- `client/.env.example` — added `VITE_SOCKET_URL=http://localhost:5000`
