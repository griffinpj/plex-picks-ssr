import { db } from '../configs/db.ts';

const pg = db();

export async function getGroupOwner (options) {
    const { code } = options;
    
    let data = await pg`
        SELECT
            (s.data::json ->> 'id') AS session_id, 
            (s.data::json ->> 'alias') AS alias,
            (s.data::json ->> 'plex-token') AS token
        FROM sessions s
        JOIN groups g
        ON g.owner = (s.data::json ->> 'id')
        AND g.code = ${ code };
    `;

    data = data.map((member) => ({
        id: member.session_id,
        alias: member.alias,
        token: member.token
    })); 

    if (!data || !data.length) {
        return {};
    }

    return data[0];
}

export async function updateGroupStage(options) {
    const {
        code,
        stage
    } = options;

    return await pg`
        UPDATE groups 
        SET stage = ${ stage }
        WHERE code = ${ code };
    `;
}

export async function updateGroupMovies(options) {
    const {
        code,
        movies
    } = options;

    return await pg`
        UPDATE groups 
        SET movies = ${ movies }
        WHERE code = ${ code };
    `;
}

export async function updateGroupMembers(options) {
    const {
        code,
        members
    } = options;

    return await pg`
        UPDATE groups 
        SET members = ${ members }
        WHERE code = ${ code };
    `;
}

export async function getMembers(options) {
    const { code } = options;
    
    let data = await pg`
        SELECT
            (s.data::json ->> 'id') AS session_id, 
            (s.data::json ->> 'alias') AS alias
        FROM sessions s
        JOIN groups g
        ON (s.data::json ->> 'id') = ANY(g.members) 
        AND g.code = ${ code };
    `;

    data = data.reduce((acc, member) => ({
        ...acc, 
        [member.session_id]: {
            id: member.session_id,
            alias: member.alias
        }
    }), {}); 


    return data;
};

export async function getGroup(options) {
    const { code } = options;

    if (!code) {
        return null;
    }

    const data = await pg`
        SELECT code, owner, members, stage, movies, id 
        FROM groups 
        WHERE code = ${ code };
    `;

    if (!data?.length) {
        return [];
    }

    const record = data[0];
    return {
        code: record.code,
        owner: record.owner,
        members: record.members,
        stage: record.stage,
        movies: record.movies,
        id: record.id
    };
};

export async function createGroup(options) {
    const { code, user } = options;

    return await pg`
        INSERT INTO groups (code, owner, members, stage, movies) 
        VALUES (
            ${ code }, 
            ${ user.id }, 
            ${ [ user.id ] }, 
            ${ 'assemble' }, 
            ${ [] }
        ) 
        RETURNING code;
    `;
};
