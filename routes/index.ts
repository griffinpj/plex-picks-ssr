import * as plex from './plex.ts';

import index from '../controllers/index.ts';
import newGroup from '../controllers/groups/post.ts';
import patchUser from '../controllers/users/patch.ts';
import getGroup from '../controllers/groups/:id/get.ts';
import getGroupTable from '../controllers/groups/:id/table/get.ts';
import postGroupMember from '../controllers/groups/:id/members/post.ts';

export default ([
    {
        path: '/',
        method: 'get',
        handler: index
    },
    {
        path: '/users',
        method: 'patch',
        handler: patchUser
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
        path: '/groups/:id/table',
        method: 'get',
        handler: getGroupTable
    },
    {
        path: '/groups/:id/members',
        method: 'post',
        handler: postGroupMember
    },
    {
        path: '/auth/plex',
        method: 'post',
        handler: plex.authenticate
    }
]);
