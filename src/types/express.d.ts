import type { findUserById } from "../queries/userQueries.js";

type AppUser = NonNullable<Awaited<ReturnType<typeof findUserById>>>;

declare global {
  namespace Express {
    interface User extends AppUser {}
  }
}

export {};
