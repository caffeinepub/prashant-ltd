# Prashant Ltd

## Current State
A full-featured AI platform landing page with: sticky navbar, hero section, features grid (6 cards), how it works (4 steps), pricing (Free/Pro/Enterprise), testimonials, FAQ (accordion), about section with stats, contact form wired to backend, and footer. No authentication or user-specific features exist. No chat interface exists.

## Requested Changes (Diff)

### Add
- **Login / Signup system**: Internet Identity based authentication. "Login" button in navbar. Users can register and log in.
- **User Dashboard**: A protected route visible only when logged in. Shows:
  - Welcome greeting with user's name/ID
  - Stats cards (messages sent, account status, joined date)
  - Recent chat history list
  - Quick action buttons (New Chat, View Profile)
- **Chat Box feature**: A floating chat widget visible on all pages (bottom-right corner), and a full-page chat view accessible from the dashboard. Users can type messages and receive echo/placeholder responses. Messages stored in backend per user.
- **Navbar update**: Add "Login" button back (was removed earlier). When logged in, show user avatar/initials and a dropdown with "Dashboard" and "Logout".

### Modify
- Navbar: Add login button and user menu for authenticated state
- App routing: Add `/dashboard` and `/chat` routes

### Remove
- Nothing removed

## Implementation Plan
1. Add `authorization` Caffeine component for Internet Identity login
2. Backend: add user profile storage, chat message storage (per user), and CRUD endpoints for messages
3. Frontend: 
   - Add login/logout via authorization hooks
   - Update navbar with login button and user dropdown
   - Add `/dashboard` route with stats and recent chats
   - Add `/chat` route with full chat interface
   - Add floating chat widget (bottom-right) visible site-wide
   - Wire all routes with auth guard (redirect to home if not logged in)
