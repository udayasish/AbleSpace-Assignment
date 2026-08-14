# Pyramid - AbleSpace Assignment

I built Pyramid as a task management application for the AbleSpace Full Stack Developer assessment. The UI follows the provided Figma design and works on desktop, tablet, and mobile screens.

## What I built

- Guest login with access and refresh tokens stored in secure cookies.
- Task board and list views.
- Create, update, move, and delete tasks.
- Task details with subtasks and comments.
- Projects with their own task views.
- Profile settings, light/dark mode, and six accent colours.
- Responsive sidebar and layouts.

## Tech used

- Frontend: Next.js, TypeScript, Tailwind CSS, shadcn/ui, Redux Toolkit, and dnd-kit.
- Backend: NestJS, TypeScript, Drizzle ORM, Zod, Passport JWT, and PostgreSQL.
- Database: PostgreSQL locally with Docker and Neon in production.
- Backend deployment: [Render](https://ablespace-assignment-6qcj.onrender.com/health).

## Project structure

```text
frontend/   Next.js application and Figma design tokens
backend/    NestJS API, Drizzle schema, migrations, and Docker Compose file
docs/       Task 2 product-understanding notes
```

## Run the project locally

### 1. Start the database

```bash
cd backend
npm install
copy .env.example .env
npm run db:up
npm run db:migrate
```

### 2. Start the backend

```bash
cd backend
npm run start:dev
```

The backend runs at `http://127.0.0.1:4000`.

### 3. Start the frontend

```bash
cd frontend
npm install
copy .env.example .env.local
npm run dev
```

Open `http://localhost:3000` and choose **Continue as Guest**.

## Environment variables

Use the example files as a starting point:

- `backend/.env.example`
- `frontend/.env.example`

For local development, the frontend points to `http://127.0.0.1:4000`. For deployment, set `BACKEND_URL` to the deployed backend URL in the frontend environment settings.

## Useful commands

| Command | Purpose |
| --- | --- |
| `npm run db:up` | Start local PostgreSQL with Docker. |
| `npm run db:migrate` | Apply database migrations. |
| `npm run start:dev` | Start the NestJS backend in watch mode. |
| `npm run dev` | Start the Next.js frontend. |

## Notes

- Google login is shown in the interface but is not connected yet.
- The product-understanding notes for Task 2 are in [docs/task-2/ablespace-take-data-understanding.md](docs/task-2/ablespace-take-data-understanding.md).
