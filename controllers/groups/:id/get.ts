import * as groups from '../../../models/groups.ts';

export default async function (ctx) {
    const user = ctx.state.user;

    if (!user.id) {
        ctx.response.status = 400;
        ctx.response.body = { error: true, message: 'Something went wrong. Please try again.' };
        return;
    }

    const group = await groups.getGroup({ code: ctx.params.id?.toUpperCase().trim() });
    
    if (!group || !group.code) {
        ctx.response.redirect('/');
        return;
    }

    const members = await groups.getMembers({ code: group.code });


    if (!members[user.id]) {
        let memberSet = Array.from(new Set([
            ...(group.members || []),
            user.id
        ]));

        memberSet = memberSet.filter(member => typeof member == 'string');

        await groups.updateGroupMembers({
            code: ctx.params.id.toUpperCase().trim(),
            members: memberSet
        });
    }

    ctx.state.session.set('channel', group.code);
    ctx.response.body = ctx.eta.render('./index', {
        user,
        group,
        members
    });
};

