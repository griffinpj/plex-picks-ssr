import { db } from '../configs/db.ts';

const pg = db();

export async function getForGroup(options) {
    const {
        code
    } = options;

    if (!code) {
        return;
    }

    return await pg`
        SELECT
            p.movie_id,
            SUM(CASE WHEN p.liked = TRUE Then 1 ELSE 0 END) AS likes,
            SUM(CASE WHEN p.liked = FALSE THEN 1 ELSE 0 END) as dislikes
        FROM picks p
        JOIN (
            SELECT
                s.data::json ->> 'id' AS user_id, 
                s.data::json ->> 'alias' AS alias,
                s.data::json ->> 'channel' AS channel
            FROM sessions s
            WHERE s.data::json ->> 'channel' = ${ code }; 
        ) s ON s.user_id = p.user_id
        WHERE p.group_code = ${ code }
        GROUP BY p.movie_id;
    `;
};

export async function addGroupMemberPick(options) {
    const {
        userId,
        liked,
        movieId,
        groupCode
    } = options;

    if (!userId || !movieId || !groupCode) {
        return;
    }

    return pg`
        INSERT INTO picks (group_code, user_id, movie_id, liked) 
        VALUES (${ groupCode }, ${ userId }, ${ movieId }, ${ liked });
    `;
};

