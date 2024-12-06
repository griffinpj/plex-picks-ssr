import * as groups from '../../../../models/groups.ts';
import * as picks from '../../../../models/picks.ts';

export default async function (ctx) {
    const user = ctx.state.user;
    const group = await groups.getGroup({ code: ctx.params.id });
    const members = await groups.getMembers({ code: group.code });

    let finalPick = null;
    if (group.stage === 'results') {
        const moviePicks = await picks.getForGroup({ code: group.code });
        const mappedPicks = moviePicks.map(pick => {
            
            const movie = group.movies.find(movie => movie.id === pick.movie_id);

            return {
                ...movie,
                likes: pick.likes,
                dislikes: pick.dislikes,
            };
        }).sort((a, b) => {
            return Number(b.likes) - Number(a.likes) || Number(b.year) - Number(a.year) || Number(b.duration) - Number(a.duration);
        });

        if (!mappedPicks.length) {
            ctx.response.status = 400;
            return;
        }

        finalPick = mappedPicks[0];
        console.log(finalPick);

        console.log(mappedPicks);
    }

    ctx.response.body = { 
        html: ctx.eta.render('./content/group-info', {
            user,
            group,
            members,
            finalPick
        })
    };
};

