# Task Board

A simple full-stack task management application built with Next.js, TypeScript, Prisma, and PostgreSQL.

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

2. Create a `.env` file with your database URL:

```
DATABASE_URL="your-postgres-connection-string"
```

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

- **User**: id, email, passwordHash, createdAt
- **Task**: id, title, status, userId, createdAt, updatedAt

## License

MIT
