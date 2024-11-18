import * as groups from '../../../models/groups.ts';

export default async function (ctx) {
    const user = ctx.state.user;
    const group = await groups.getGroup({ code: ctx.params.id });
    const members = await groups.getMembers({ code: group.code });

    ctx.response.body = ctx.eta.render('./index', {
        user,
        group,
        members
    })
};

