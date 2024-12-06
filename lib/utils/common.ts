import * as picks from '../../models/picks.ts';

export async function isGroupFinished (group) {
    const groupPicks = await picks.getForGroupByUser({ code: group?.code });
    const picksFinished = groupPicks.reduce((acc, ele) => acc && Number(ele?.picks || 0) >= 20, true)
    return groupPicks.length === group.members.length && picksFinished;
}
