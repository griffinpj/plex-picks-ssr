import * as plex from './plex.ts';

import index from '../controllers/index.ts';
import newGroup from '../controllers/groups/post.ts';
import getGroup from '../controllers/groups/:id/get.ts';

export default ([
    {
        path: '/',
        method: 'get',
        handler: index
    },
    {
        path: '/groups',
        method: 'post',
        handler: newGroup
    },
    {
        path: '/groups/:id',
        method: 'get',
        handler: getGroup
    },
    {
        path: '/auth/plex',
        method: 'post',
        handler: plex.authenticate
    }
]);
