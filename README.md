# BBQ Log 🔥

A platform for logging and tracking your barbecue cooking attempts. Built with Next.js, React, TypeScript, and PostgreSQL.

## Features

- **Log BBQ Attempts**: Record details about each cooking attempt including:

  - Recipe title
  - Date
  - Type of smoker used
  - Weather conditions
  - Smoking process details
  - Rating (1-10)

- **View & Sort**: Browse all your attempts with sorting by:

  - Date
  - Rating
  - Weather conditions

- **Filter**: Filter attempts by weather conditions

- **Compare**: Compare multiple attempts of the same recipe side-by-side

## Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database running

### Installation

1. Install dependencies:

```bash
npm install
```

2. Set up your environment variables:

```bash
cp .env.example .env
```

Edit `.env` and add your PostgreSQL connection string:

```
DATABASE_URL="postgresql://user:password@localhost:5432/bbqlog?schema=public"
```

3. Set up the database:

```bash
# Generate Prisma Client
npm run db:generate

# Push the schema to your database
npm run db:push
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Management

- View your data in Prisma Studio: `npm run db:studio`
- Create migrations: `npm run db:migrate`
- Push schema changes: `npm run db:push`

## Project Structure

```
bbqlog/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── attempts/      # CRUD operations for attempts
│   │   └── recipes/       # Recipe list endpoint
│   ├── new/               # New attempt form page
│   ├── compare/           # Comparison page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   └── AttemptList.tsx    # Attempt list with sorting/filtering
├── lib/                   # Utility libraries
│   └── prisma.ts          # Prisma client instance
├── prisma/                # Database schema
│   └── schema.prisma      # Prisma schema definition
└── package.json
```

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Prisma** - Database ORM
- **PostgreSQL** - Database
- **React** - UI library

## Next Steps

Consider adding:

- User authentication
- Image uploads for each attempt
- Recipe templates
- Export functionality
- Advanced analytics and charts
- Mobile app
