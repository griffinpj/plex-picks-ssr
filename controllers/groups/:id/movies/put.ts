import * as plexClient from '../../../../lib/plex/client.ts';
import * as groups from '../../../../models/groups.ts';

export default async function (ctx) {
    const { token } = ctx.state.user;

    const group = await groups.getGroup({ code: ctx.params?.id.toUpperCase().trim() })

    if (!group || !group.code) {
        ctx.response.status = 400;
        return;
    }

    const movies = await plexClient.getMoviesSample({
        token,
        size: 20,
        groupId: group.code
    });

    if (!movies || !movies.length) {
        ctx.response.status = 500;
        return;
    }


    await groups.updateGroupMovies({ 
        code: group.code,
        movies
    });
    
    await groups.updateGroupStage({ 
        code: group.code,
        stage: 'picks'
    });

    ctx.response.body = {
        movies
    };
};

