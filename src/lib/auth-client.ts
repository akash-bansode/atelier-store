import { createAuthClient } from "better-auth/react";

// Client components only. Server code calls `auth.api.*` with `headers()`.
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
});
