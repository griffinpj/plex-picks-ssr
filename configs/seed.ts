import postgres from 'https://deno.land/x/postgresjs@v3.1.0/mod.js'
import { PostgresStore } from "https://deno.land/x/oak_sessions/mod.ts";

// Create a postgres connection, or use an existing one
const pg = postgres({
    host: Deno.env.get('DB_HOST'),
    port: Deno.env.get('DB_PORT'),
    database: Deno.env.get('DB_NAME'),
    user: Deno.env.get('DB_USER'),
    password: Deno.env.get('DB_PSW'),
});

// Pass postgres connection into a new PostgresStore. Optionally add a custom table name as second string argument, default is 'sessions'
const store = new PostgresStore(pg, 'sessions')

// Initialize sessions table. Will create a table if one doesn't exist already.
await store.initSessionsTable()

await pg`
    CREATE TABLE IF NOT EXISTS groups (
        id SERIAL PRIMARY KEY,
        code TEXT UNIQUE,
        owner TEXT,
        members TEXT [],
        stage TEXT,
        movies JSONB []
    );
`;

await pg`
    CREATE TABLE IF NOT EXISTS picks (
        id SERIAL PRIMARY KEY,
        user_id TEXT,
        group_code TEXT,
        movie_id TEXT,
        liked BOOLEAN
    );
`;

await pg`
    ALTER TABLE IF EXISTS picks
        ADD CONSTRAINT group_code_picks_code FOREIGN KEY (group_code) REFERENCES groups (code) ON DELETE CASCADE;
`;

await pg.end();

