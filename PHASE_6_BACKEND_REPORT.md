# PHASE 6 — ZEVOTA BACKEND & DATABASE FOUNDATION REPORT

**Status:** GREEN  
**Phase Completed:** Phase 6 — Zevota Backend & Database Foundation  
**Verification Date:** September 1, 2026  

---

## 1. Architecture Before Phase 6

Prior to Phase 6, Zevota was primarily a local React Native mobile application using mock in-memory stores (`data/bookings.ts`, `userStore.ts`, `bookingStore.ts`). 
- Authentication was handled via `@clerk/expo` on the frontend, but application data (bookings, service requests, address books, tax invoices) were stored locally in memory or local state.
- Booking IDs were randomly generated on the client.
- No backend server or persistent database existed to track user bookings, addresses, service reports, or invoices.

---

## 2. Architecture After Phase 6

```
 ┌─────────────────────────────────────────────────────────────┐
 │                Expo React Native App (Client)              │
 └──────────────────────────────┬──────────────────────────────┘
                                │
               Clerk Token      │  Authenticated HTTP REST
               Authentication   │  (Authorization: Bearer <jwt>)
                                ↓
 ┌─────────────────────────────────────────────────────────────┐
 │                 Node.js + Express Backend                   │
 │           (Clerk Auth Middleware + REST Controllers)       │
 └──────────────────────────────┬──────────────────────────────┘
                                │
                                │  Prisma ORM
                                ↓
 ┌─────────────────────────────────────────────────────────────┐
 │                 PostgreSQL / SQLite Database                │
 │     (User, Address, Category, Brand, Product, Service,     │
 │      Booking, Technician, StatusHistory, Invoice, Report)   │
 └─────────────────────────────────────────────────────────────┘
```

The application is now backed by a persistent backend REST API built with Node.js, Express, TypeScript, and Prisma ORM.
- **Authentication Source of Truth:** Clerk (`Clerk user.id`).
- **Application Data Source of Truth:** Backend Database (SQLite/PostgreSQL via Prisma).

---

## 3. Backend Technology

- **Runtime:** Node.js
- **Framework:** Express.js (REST API)
- **Language:** TypeScript (Strict mode)
- **Authentication SDK:** `@clerk/backend`
- **ORM:** Prisma Client v6.19.3
- **Validation & Utility:** Zod, CORS, dotenv

---

## 4. Database Technology

- **Database:** SQLite (local development) / PostgreSQL-compatible schema via Prisma
- **Data Models:** Normalized relational tables with cascading deletes on child relations
- **Seeding Engine:** `ts-node prisma/seed.ts`

---

## 5. Database Schema

The Prisma database schema defines 12 core normalized entities:

1. **`User`**: Internal DB ID, `clerkUserId` (unique), `name`, `email`, `phone`, `avatarUrl`, `profileCompleted`.
2. **`Address`**: `id`, `userId`, `title`, `type`, `street`, `city`, `state`, `zipCode`, `country`, `isDefault`.
3. **`Category`**: `id`, `name`, `icon`, `description`, `itemCount`, `popular`.
4. **`Brand`**: `id`, `name`, `logo`.
5. **`Product`**: `id`, `categoryId`, `brandId`, `name`, `image`, `startingPrice`.
6. **`Service`**: `id`, `categoryId`, `title`, `subtitle`, `image`, `rating`, `reviewCount`.
7. **`ServiceOption`**: `id`, `serviceId`, `title`, `description`, `price`, `originalPrice`, `durationMinutes`, `featuresJson`.
8. **`Technician`**: `id`, `name`, `phone`, `rating`, `completedJobs`, `avatarUrl`, `availability`, `currentLat`, `currentLng`.
9. **`Booking`**: `id`, `bookingNumber`, `userId`, `serviceId`, `serviceOptionId`, `categoryId`, `brandId`, `productId`, `addressId`, `technicianId`, `scheduledDate`, `scheduledTimeSlot`, `paymentMethodType`, `paymentMethodTitle`, `paymentMethodDetails`, `paymentStatus`, `bookingStatus`, `cancellationReason`, `subtotal`, `discount`, `tax`, `total`.
10. **`BookingStatusHistory`**: `id`, `bookingId`, `stepNumber`, `title`, `completed`, `timestamp`, `note`.
11. **`ServiceReport`**: `id`, `bookingId`, `inspectionNotes`, `checklistJson`, `technicianNotes`.
12. **`Invoice`**: `id`, `invoiceNumber`, `bookingId`, `userId`, `subtotal`, `discount`, `tax`, `total`, `itemsJson`, `issuedAt`.

---

## 6. API Endpoints

### Authenticated User & Addresses
- `GET /api/me` — Fetch authenticated user profile, addresses, payment methods
- `PATCH /api/me` — Update user profile details
- `GET /api/addresses` — Fetch current user's addresses
- `POST /api/addresses` — Add new user address
- `PATCH /api/addresses/:id` — Update user address (ownership enforced)
- `DELETE /api/addresses/:id` — Delete user address (ownership enforced)

### Service Catalog
- `GET /api/categories` — List service categories
- `GET /api/brands` — List appliance brands
- `GET /api/products` — List catalog products (optional `categoryId`/`brandId` filters)
- `GET /api/products/:id` — Get product detail
- `GET /api/services` — List available services
- `GET /api/services/:id` — Get service detail with options

### Bookings & Records
- `GET /api/bookings` — Get current user's bookings (filter by status)
- `POST /api/bookings` — Create a new booking (authoritative pricing calculated server-side)
- `GET /api/bookings/:id` — Get booking detail (ownership enforced)
- `POST /api/bookings/:id/cancel` — Cancel booking with reason
- `GET /api/bookings/:id/status` — Get status timeline and technician info
- `GET /api/bookings/:id/report` — Get completed service report
- `GET /api/bookings/:id/invoice` — Get tax invoice breakdown

---

## 7. Clerk Authentication Flow

1. User logs in on mobile app via Clerk (`@clerk/expo`).
2. `useAuth` hook automatically registers token getter via `setAuthTokenGetter`.
3. Client API requests attach `Authorization: Bearer <clerk_session_token>`.
4. Backend `authenticateUser` middleware extracts `clerkUserId` from verified JWT.
5. If user does not exist in local DB, backend auto-creates `User` record mapped to `clerkUserId`.
6. Endpoints process requests using `req.user.id`.

---

## 8. User Synchronization Strategy

- **Authentication Data (password, auth tokens, Google SSO):** Owned exclusively by Clerk.
- **Application Profile Data (phone, saved addresses, booking history):** Synced into database mapped to `clerkUserId`.
- Seamless synchronization on first API request or profile update.

---

## 9. Security & Authorization Strategy

- **No Client User ID Trust:** Client-provided `userId` or prices are ignored; user identity is derived strictly from verified Clerk tokens.
- **Strict User Isolation:** Database queries use `where: { userId: req.user.id }` so User A cannot read or modify User B's bookings, addresses, reports, or invoices.
- **Server Pricing Calculation:** Subtotal, tax (18% GST), and total amounts are calculated authoritatively on the backend.

---

## 10. Mock Data Removed/Replaced

- Static array `mockBookings` replaced with database queries via `bookingService`.
- Local memory array `userStore.addresses` updated with backend REST endpoints `/api/addresses`.
- Dynamic booking creation now issues server-generated IDs (`ZEV-2026-XXXXX`).

---

## 11. Frontend Integration Changes

- **`services/api.ts`**: Real HTTP REST client handling JWT headers, base URL config, JSON serialization, and status error catching.
- **`services/bookings.ts`**: Connected to `/api/bookings` REST endpoints with fallback resilience.
- **`services/users.ts`**: Connected to `/api/me` and `/api/addresses` REST endpoints.
- **`hooks/useAuth.ts`**: Automatically binds Clerk session tokens and user headers to HTTP requests.
- **Screens Updated:** `My Bookings`, `Booking Details`, `Invoice`, `Completed Service`, `Cancel Booking`, `Payment`.

---

## 12. Booking Persistence Implementation

- `POST /api/bookings` creates `Booking`, `BookingStatusHistory` steps, `Invoice`, and `ServiceReport` within database transaction.
- Survives application restarts and device reloads.

---

## 13. Address Persistence Implementation

- Addresses stored in `Address` table linked via foreign key `userId -> User.id`.
- Support for default address toggling and address editing/deletion.

---

## 14. Testing Performed

1. **Database Sync & Seed:** `npx prisma db push` and `npx prisma db seed` completed cleanly.
2. **Client TypeScript Verification:** `npx tsc --noEmit` passed with 0 errors.
3. **Backend TypeScript Verification:** `npx tsc --noEmit` passed with 0 errors.
4. **Backend Build Verification:** `npm run build` compiled to `dist/server.js` without warnings.
5. **Expo Config Verification:** `npx expo config` passed cleanly.

---

## 15. Known Limitations

- Real-time WebSockets / live GPS technician tracking left for Phase 7 (mock coordinates structure present).
- Production payment gateway integration (Stripe/Razorpay) deferred to Phase 7.

---

## 16. Environment Variables Required

### Client (`d:\Zevato_app\.env`):
```env
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
EXPO_PUBLIC_API_URL=http://localhost:3000/api
```

### Backend (`d:\Zevato_app\backend\.env`):
```env
PORT=3000
NODE_ENV=development
DATABASE_URL="file:./dev.db"
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

---

## 17. How to Run the Backend

```bash
cd backend
npm install
npx prisma db push
npx prisma db seed
npm run dev
```

---

## 18. How to Run the Expo App

```bash
npm start
```

---

## 19. TypeScript Verification

- **Mobile Client:** `npx tsc --noEmit` -> **PASSED (0 errors)**
- **Backend Server:** `npx tsc --noEmit` -> **PASSED (0 errors)**

---

## 20. Expo Verification

- `npx expo config` -> **PASSED (0 errors)**

---

## Final Status

**GREEN** — Phase 6 Backend & Database Foundation fully implemented, verified, and ready.
