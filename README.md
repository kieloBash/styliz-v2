# 🧱 Full-Stack Boilerplate with Role-Based Access, Notifications, and More

A production-ready full-stack monorepo boilerplate using **Next.js App Router**, **tRPC**, **Prisma**, **Supabase**, **Auth.js**, and **shadcn/ui** — built for rapid development with scalable role-based layouts, API access control, notifications, and essential app features out of the box.

---

## 🚀 Tech Stack

- **Frontend**: [Next.js App Router](https://nextjs.org), [shadcn/ui](https://ui.shadcn.com), [TanStack Query](https://tanstack.com/query)
- **Backend**: [tRPC](https://trpc.io), [Prisma](https://prisma.io)
- **Database**: PostgreSQL (via [Supabase](https://supabase.com))
- **Auth**: [Auth.js](https://authjs.dev)
- **Realtime**: Supabase Realtime (polling)
- **Email**: SMTP (via Resend or nodemailer)
- **Validation**: [Zod](https://zod.dev)
- **Testing**: [Vitest](https://vitest.dev)
- **Logging**: [Winston](https://github.com/winstonjs/winston)

---

## 📦 Features

### 🔐 Authentication & Access Control
- Auth.js with JWT session strategy
- Role-based access control (RBAC): `ADMIN`, `DOCTOR`, `PATIENT`
- `middleware.ts` for dynamic route protection
- Centralized route config (`routes.ts`)
- `useCurrentUser()` hook
- Role-based layout rendering with conditional sidebars

### 🔔 Notifications & Realtime
- Notification system using Supabase + polling
- Secure per-user notification access (RLS)
- Unread tracking + `useNotifications()` hook

### ⚙️ User Profile & Settings
- Profile update (name, email)
- JWT auto-refresh when user updates data
- User preferences (theme, language) stored in DB

### 📧 Email Notifications
- SMTP-ready (Resend or nodemailer)
- Sends email on system events (e.g., bookings, cancellations)
- Forgot password flow:
  - Token-based secure reset
  - `/forgot-password` and `/reset-password/[token]` pages

### 💥 Error Handling & Monitoring
- Centralized logging with Winston
- Custom error handler for tRPC, API, and global events
- Supports console and file logging

### 🕵️ Audit Trail
- `AuditLog` model in Prisma
- Tracks user actions (e.g., profile update, booking)
- Admin-only viewer page

### 🧪 Testing Setup
- Vitest configured
- Unit tests for utils, auth, and API logic
- `test-utils.ts` for reusable test helpers

### 🧭 Routing & Layout
- App Router structure with `layout.tsx`, `page.tsx`
- Role-based route groups (admin, doctor, patient)
- Centralized `routes.ts` config
- Custom 404 (`not-found.tsx`) and 403 pages

### 🧰 Utilities
- Global `queryClient` for TanStack Query
- Toast system via `shadcn/ui` or `sonner`
- Skeletons and loading states
- Zod schemas for validation across frontend/backend

---

## 📁 Project Structure

```txt
app/
  (auth)/               → Login & registration pages
  (dashboard)/          → Role-protected pages
    layout.tsx          → Role-based layout logic
  not-found.tsx         → Custom 404 page

lib/
  auth.ts               → Auth.js config
  logger.ts             → Winston logger setup

hooks/
  useCurrentUser.ts
  useNotifications.ts

utils/
  audit.ts              → createAuditLog()
  permissions.ts        → RBAC helpers
  routes.ts             → Route + role config

pages/
  api/auth/[...nextauth].ts
