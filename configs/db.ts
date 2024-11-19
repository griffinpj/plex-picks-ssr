import { DB } from "https://deno.land/x/sqlite/mod.ts";

let sqlite;
export function db () {
    if (!sqlite) {
        sqlite = new DB('./database.db');
        sqlite.query(`
            CREATE TABLE IF NOT EXISTS groups (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                code TEXT,
                owner TEXT,
                members TEXT,
                stage TEXT,
                movies TEXT
            )
        `);
    }
    
    return sqlite;
};
