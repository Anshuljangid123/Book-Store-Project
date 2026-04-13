# Bookstore Capstone Project: Architecture & Data Flow

This document provides a comprehensive, deep-dive explanation into how the Bookstore Capstone Project was assembled. It covers the complete data flow separating the client, the server, and the database logic, showcasing how modern state-of-the-art tooling securely unites the codebase.

---

## 1. High-Level Architecture Overview
The application follows a **Monorepo Architecture Pattern** split exclusively across two primary domains:

- **Frontend (`bookstore-frontend`)**: Built in **Next.js 14** using the React App Router. It is heavily styled using **Chakra UI**, providing dynamic components and advanced aesthetic principles.
- **Backend (`bookstore-backend`)**: Programmed using **NestJS**, serving as the rigid monolithic brain of the application. It receives requests, validates permissions securely, and proxies requests directly to the database.
- **Database**: A Serverless PostgeSQL instance hosted on **Neon DB**, dynamically managed via **Prisma ORM**.
- **Authentication**: Offloaded purely to **Clerk**, processing user identity via JWT standard tokens.

### Visual Flow Pipeline
1. The End-User opens the React Client (`localhost:3000`).
2. The user executes a request (e.g., *Navigating to the Cart*).
3. The Next.js client attaches a secure **JWToken** Bearer natively and triggers an Axios HTTP request.
4. The NestJS server (`localhost:3005`) strictly intercepts this request via API endpoints.
5. NestJS Guards decode the JWT token, validating user roles natively against the internal Database.
6. The exact Prisma logic searches Neon DB and returns data natively backward down the stack.

---

## 2. Authentication & Identity Flow (Clerk)

One of the most complex parts of this codebase is bridging external identity (Clerk) directly into the internal application ecosystem securely.

1. **Frontend Authorization**: When a user logs in via Clerk UI blocks, standard Clerk API cookies track the session. We use the `@clerk/nextjs` hooks (e.g., `useAuth()`) to grab the local `getToken()` instance dynamically.
2. **Axios API Interceptor (`src/lib/api.ts`)**: The frontend uses a generalized Axios client. It runs a pre-flight interceptor effectively stating: *“Before sending any backend request, ask Clerk for the Bearer Token and forcibly string it into the Headers.”*
3. **Backend `ClerkAuthGuard`**: When NestJS sees the `/cart` endpoints being hit, it triggers the AuthGuard before executing any controller logic mapping.
   - It decrypts the token locally against the `CLERK_SECRET_KEY`.
   - It references `prisma.user.findUnique({ where: { clerkUserId: sub }})`.
   - If the user is missing, it dynamically generates an internal local profile for them tied securely to Clerk tracking.

### Admin Privileges & The `RolesGuard`
Certain pathways (e.g., *adding or deleting a book*) are strictly protected. The backend defines an `@Roles('ADMIN')` decorator attached to `@Post()` endpoints. The `RolesGuard` verifies the incoming `AuthGuard` user object synchronously—if your database `user.role` natively does not strictly equal `'ADMIN'`, it forcibly rejects the mutation preventing malicious tampering securely. 

---

## 3. Frontend Implementation Details (Next.js)

The frontend maximizes aesthetic layouts without writing deep raw CSS manually utilizing modern library frameworks securely natively.

- **Component Tree Integration**:
  Every feature is split within the `src/app` structure:
  - `/` (Home): Contains robust static promotional banners drawing users smoothly utilizing sophisticated glassmorphism logic.
  - `/books`: Dynamically queries the backend providing side-bar logic arrays that manipulate `URLSearchParams` on native inputs (e.g., 'price max').
  - `/admin`: Purely hidden natively utilizing dynamic rendering. It contains nested routes like `/new` explicitly mapped natively to custom Form layouts cleanly.

- **Client vs Server Components**:
  Because this system utilizes high interactivity (Inputs, Checkboxes, Buttons), files primarily rely on the `'use client'` directive to bind React context gracefully to DOM hooks efficiently without Server Action complexities.

---

## 4. Backend Implementation Details (Nest.js)

The backend natively isolates logic into highly modular scopes complying with standard MVC (Model, View, Controller) software development lifecycles.

- **PrismaService Injection (`src/prisma/prisma.service.ts`)**: This class initializes the `PrismaClient` and establishes standard `onModuleInit()` hooks.
  - *Hardening Update*: Due to specific deployment architectures, this class initiates raw connections cleanly leveraging `@prisma/adapter-pg` across standard `pg` Pool protocols avoiding complex Serverless Polyfill bugs intelligently natively!
  
- **Controllers & Services Modules**: 
  - Each primary database entity (`Books`, `Categories`, `Cart`, `Users`) possesses a dedicated module securely isolated natively.
  - **Controllers** act as the entry point APIs (e.g., `GET /books/:id`).
  - **Services** write the explicit execution blocks synchronously processing `prisma.book.findMany(...)` securely passing validated Typescript DTO structures.

---

## 5. Database Architecture & Relationships (Prisma)

The **Prisma Schema (`schema.prisma`)** natively serves as the exact Ground Truth architectural model for entire data types natively executing SQL commands. 

- **User Model**: Standard properties (`email`, `name`, `role`). Tied specifically to a robust `clerkUserId` parameter securely guaranteeing no email collision exploits natively!
- **Category Model**: Isolated tables purely defining strings dynamically (e.g., *Fiction*, *Science Fiction*).
- **Book Model**: Tied directly securely via `categoryId` arrays to the `Category` native logic.
- **Cart & CartItem Definitions**: A robust logical map connecting `User -> Cart -> CartItems[]`. Every single Cart block connects securely back exclusively to a `User` utilizing `userId @unique` natively preventing cart contamination intelligently natively!

---

### Conclusion

The Capstone securely isolates state management natively over highly flexible `TCP` channels. By migrating completely to strong-typed implementations (Prisma, TypeScript natively) and offloading Authentication explicitly toward robust Cloud Providers natively (Clerk/Neon DB), the application ensures rapid scalability and extreme data integrity dynamically.
