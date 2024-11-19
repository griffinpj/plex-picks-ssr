import * as plex from './plex.ts';

import index from '../controllers/index.ts';
import newGroup from '../controllers/groups/post.ts';
import patchUser from '../controllers/users/patch.ts';
import getGroup from '../controllers/groups/:id/get.ts';
import getGroupInfo from '../controllers/groups/:id/info/get.ts';
import postGroupMember from '../controllers/groups/:id/members/post.ts';
import putGroupMovies from '../controllers/groups/:id/movies/put.ts';

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
        path: '/groups/:id/info',
        method: 'get',
        handler: getGroupInfo
    },
    {
        path: '/groups/:id/members',
        method: 'post',
        handler: postGroupMember
    },
    {
        path: '/groups/:id/movies',
        method: 'put',
        handler: putGroupMovies
    },
    {
        path: '/groups/:id/plex/library/metadata/:metaId/thumb/:thumbId',
        method: 'get',
        handler: plex.getThumbnail
    },
    {
        path: '/groups/:id/plex/library/metadata/:metaId/art/:artId',
        method: 'get',
        handler: plex.getArt
    },
    {
        path: '/auth/plex',
        method: 'post',
        handler: plex.authenticate
    }
]);
