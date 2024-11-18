import { db } from '../configs/db.ts';

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
        SELECT code, owner, members FROM groups WHERE code = ?;
    `, [code]);

    if (!data.length) {
        return [];
    }

    const record = data[0];
    return {
        code: record[0],
        owner: record[1],
        members: JSON.parse(record[2])
    };
};

export async function createGroup(options) {
    const store = db();
    const { code, user } = options;

    const members = JSON.stringify([user.id]); 

    return await store.query(`
        INSERT INTO groups (code, owner, members) VALUES (?, ?, ?) RETURNING code;
    `, [code, user.id, members]);
};
