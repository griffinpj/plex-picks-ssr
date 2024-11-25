import postgres from 'https://deno.land/x/postgresjs@v3.1.0/mod.js'

// Create a postgres connection, or use an existing one
let pg = null;
try {
    pg = postgres({
        host: Deno.env.get('DB_HOST'),
        port: Deno.env.get('DB_PORT'),
        database: Deno.env.get('DB_NAME'),
        user: Deno.env.get('DB_USER'),
        password: Deno.env.get('DB_PSW'),
    });
} catch (e) {
    console.log(e);
}


export function db () {
    if (pg) {
        return pg;
    }

    throw new Error('Could not create db client');
}

