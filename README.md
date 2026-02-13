# Task Board

A simple full-stack task management application built with Next.js, TypeScript, Prisma, and PostgreSQL.

🔗 **Live Demo**: [https://taskboard-cyan-delta.vercel.app/](https://taskboard-cyan-delta.vercel.app/)

## Features

- **Authentication**: Signup, login, logout with secure password hashing (bcrypt)
- **Task Management**: Create tasks, view your tasks, update task status
- **Statuses**: todo, in-progress, done
- **Responsive UI**: Works on desktop and mobile

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (NeonDB)
- **ORM**: Prisma 7
- **Auth**: Cookie-based sessions, bcrypt for password hashing

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (or NeonDB account)

### Setup

1. Clone the repo and install dependencies:

```bash
git clone https://github.com/shubhusion/Taskboard.git
cd Taskboard/taskboard
npm install
```

2. Create a `.env` file based on the example:

```bash
cp .env.example .env
```

Then update `DATABASE_URL` with your PostgreSQL connection string.

3. Generate Prisma client and push schema:

```bash
npx prisma generate
npx prisma db push
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
taskboard/
├── app/
│   ├── (auth)/          # Login, Signup pages
│   ├── (dashboard)/     # Dashboard page
│   ├── api/             # API routes (auth, tasks)
│   ├── layout.tsx
│   └── page.tsx         # Landing page
├── lib/
│   ├── auth.ts          # Auth utilities (hash, session)
│   └── db.ts            # Prisma client
├── prisma/
│   └── schema.prisma    # Database schema
└── ...
```

## Authentication Flow

1. **Signup**: User submits email + password → password hashed with bcrypt (10 salt rounds) → user stored in database
2. **Login**: User submits credentials → password verified against hash → session cookie set (`httpOnly`, `sameSite: lax`, 7-day expiry)
3. **Protected Routes**: Middleware checks for session cookie → redirects to `/login` if missing
4. **API Authorization**: Each API route validates session cookie → returns 401 if unauthorized
5. **Logout**: Session cookie deleted → user redirected to login

> **Security Notes:**
> - Passwords are never stored in plain text
> - Session cookies are `httpOnly` (not accessible via JavaScript)
> - Cookies are `secure` in production (HTTPS only)

## API Endpoints

| Method | Endpoint            | Description           |
|--------|---------------------|-----------------------|
| POST   | /api/auth/signup    | Create new user       |
| POST   | /api/auth/login     | Login user            |
| POST   | /api/auth/logout    | Logout user           |
| GET    | /api/tasks          | Get user's tasks      |
| POST   | /api/tasks          | Create new task       |
| PATCH  | /api/tasks/[id]     | Update task status    |

## Database Schema

```
┌─────────────────────────────────┐       ┌─────────────────────────────────┐
│             USER                │       │             TASK                │
├─────────────────────────────────┤       ├─────────────────────────────────┤
│ id           INT (PK)           │       │ id           INT (PK)           │
│ email        VARCHAR (UNIQUE)   │       │ title        VARCHAR            │
│ passwordHash VARCHAR            │       │ status       VARCHAR            │
│ createdAt    TIMESTAMP          │       │ userId       INT (FK) ──────────┼───┐
└─────────────────────────────────┘       │ createdAt    TIMESTAMP          │   │
              │                           │ updatedAt    TIMESTAMP          │   │
              │                           └─────────────────────────────────┘   │
              │                                                                 │
              └─────────────────────── 1 : N ───────────────────────────────────┘
```

**Relationships:**
- One **User** can have many **Tasks** (1:N relationship)
- Deleting a User cascades to delete all their Tasks

**Status Values:** `todo` | `in-progress` | `done`

## License

MIT
