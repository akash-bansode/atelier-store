import { config } from "dotenv";

// Next loads .env.local itself; standalone scripts must do it explicitly.
// .env.local first: dotenv never overrides a variable that is already set.
config({ path: ".env.local", quiet: true });
config({ quiet: true });
