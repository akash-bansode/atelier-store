# Atelier Store

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Better Auth · Drizzle ORM · Neon Postgres.

## Setup

```bash
npm install
cp .env.example .env   # fill in DATABASE_URL (pooled Neon string) and BETTER_AUTH_SECRET
npm run dev
```

`DATABASE_URL` is required at import time, including for `npm run build`.

## Layout

| Path | Purpose |
| --- | --- |
| `src/db/schema.ts` | Single Drizzle schema file (empty for now) |
| `src/db/index.ts` | `db` client over Neon's HTTP driver |
| `src/lib/auth.ts` | Better Auth server instance (Drizzle adapter, email/password) |
| `src/lib/auth-client.ts` | Better Auth React client — client components only |
| `src/app/api/auth/[...all]/route.ts` | Better Auth HTTP handler |
| `drizzle.config.ts` | drizzle-kit config; migrations are emitted to `./drizzle` |

## Database scripts

`db:generate`, `db:migrate`, `db:push` (dev only), `db:studio`.
