import { db } from '../configs/db.ts';

export async function getGroupOwner (options) {
    const store = db();
    const { code } = options;
    
    let data = store.query(`
        SELECT
            JSON_EXTRACT(s.data, '$.id') AS sessionId, 
            JSON_EXTRACT(s.data, '$.alias') AS alias,
            JSON_EXTRACT(s.data, '$.plex-token') AS token
        FROM sessions s
        JOIN groups g
        ON g.owner = sessionId
        AND g.code = ?;
    `, [code]);

    data = data.map((member) => ({
        id: member[0],
        alias: member[1],
        token: member[2]
    })); 

    if (!data || !data.length) {
        return {};
    }

    return data[0];
}

export async function updateGroupStage(options) {
    const store = db();
    const {
        code,
        stage
    } = options;

    return store.query(`
        UPDATE groups 
        SET stage = ?
        WHERE code = ?;
    `, [stage, code]);
}

export async function updateGroupMovies(options) {
    const store = db();
    const {
        code,
        movies
    } = options;

    return store.query(`
        UPDATE groups 
        SET movies = ?
        WHERE code = ?;
    `, [JSON.stringify(movies), code]);
}

export async function updateGroupMembers(options) {
    const store = db();
    const {
        code,
        members
    } = options;

    return store.query(`
        UPDATE groups 
        SET members = ?
        WHERE code = ?;
    `, [JSON.stringify(members), code]);
}

export async function getMembers(options) {
    const store = db();
    const { code } = options;
    
    let data = store.query(`
        SELECT
            JSON_EXTRACT(s.data, '$.id') AS sessionId, 
            JSON_EXTRACT(s.data, '$.alias') AS alias
        FROM sessions s
        JOIN groups g
        ON g.members LIKE '%' || sessionId || '%'
        AND g.code = ?;
    `, [code]);

    data = data.reduce((acc, member) => ({
        ...acc, 
        [member[0]]: {
            id: member[0],
            alias: member[1]
        }
    }), {}); 

    return data;
};

export async function getGroup(options) {
    const store = db();
    const { code } = options;

    const data = store.query(`
        SELECT code, owner, members, stage, movies FROM groups WHERE code = ?;
    `, [code]);

    if (!data.length) {
        return [];
    }

    const record = data[0];
    return {
        code: record[0],
        owner: record[1],
        members: JSON.parse(record[2]),
        stage: record[3],
        movies: JSON.parse(record[4])
    };
};

export async function createGroup(options) {
    const store = db();
    const { code, user } = options;

    const members = JSON.stringify([user.id]); 

    return await store.query(`
        INSERT INTO groups (code, owner, members, stage, movies) VALUES (?, ?, ?, ?, ?) RETURNING code;
    `, [code, user.id, members, 'assemble', JSON.stringify([])]);
};
