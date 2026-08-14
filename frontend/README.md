# Pyramid frontend

This folder contains the Next.js frontend for Pyramid.

## Main features

- Guest login.
- Task board and list views.
- Task details with subtasks and comments.
- Projects and project details.
- Profile settings, light/dark mode, and accent colours.
- Responsive layouts for desktop, tablet, and mobile.

## Run locally

```bash
npm install
copy .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## Environment variable

```env
BACKEND_URL=http://127.0.0.1:4000
```

`BACKEND_URL` is used by Next.js to forward `/api/*` requests to the backend. In production, set it to the deployed backend URL without adding `:4000`.

## Main folders

```text
src/app/          Pages and route layouts
src/components/   Reusable UI components
src/lib/          API and service helpers
src/store/        Redux Toolkit store and slices
```
