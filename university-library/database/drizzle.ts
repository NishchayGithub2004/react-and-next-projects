import config from "@/lib/config"; // import configuration object to access environment variables including database connection URL
import { drizzle } from "drizzle-orm/neon-http"; // import drizzle ORM adapter for neon-http to enable database operations over HTTP
import { neon } from "@neondatabase/serverless"; // import neon client for connecting to neon serverless PostgreSQL instance

const sql = neon(config.env.databaseUrl); // create neon client instance using database URL from environment config to establish connection interface

export const db = drizzle({ client: sql, casing: "snake_case" }); // initialize drizzle ORM with neon client and set casing to snake_case for schema consistency
