# Pyramid backend

This folder contains the NestJS API for Pyramid.

## What it handles

- Guest authentication with JWT access and refresh tokens.
- Task, project, subtask, and comment APIs.
- Profile, theme, and accent-colour preferences.
- Request validation with Zod.
- PostgreSQL database access with Drizzle ORM.

## Run locally

```bash
npm install
copy .env.example .env
npm run db:up
npm run db:migrate
npm run start:dev
```

The API runs at `http://127.0.0.1:4000`.

## Database commands

```bash
npm run db:up        # Start PostgreSQL with Docker
npm run db:down      # Stop PostgreSQL
npm run db:generate  # Generate a new Drizzle migration
npm run db:migrate   # Apply migrations
```

## Environment variables

Copy `.env.example` to `.env` and provide:

- `DATABASE_URL`
- `JWT_SECRET`
- `CORS_ORIGIN`

For Render, use the cloud database URL, set `NODE_ENV=production`, and let Render provide the `PORT` value.

## Main folders

```text
src/modules/    Feature modules such as auth, tasks, and projects
src/database/   Drizzle schema and migrations
src/common/     Shared errors, filters, decorators, and validation
```
