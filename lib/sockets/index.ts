import {
    BaseConsumer,
    InMemoryLayer,
    mountConsumer,
} from "https://deno.land/x/oak_channels/mod.ts";

import * as groups from '../../models/groups.ts';
import * as picks from '../../models/picks.ts';

export function sockets () {
    const layer = new InMemoryLayer();

    class EchoConsumer extends BaseConsumer {
        async onConnect() {
            const self = this;
            const ctx = this.context;
            const channel = ctx.state.session.get('channel');
            
            if (channel) {
                setTimeout(async function () {
                    await self.groupJoin(channel);
                    const group = await groups.getGroup({
                        code: channel
                    });
                    await self.layer.groupSend(channel, JSON.stringify({
                        action: 'group.update',
                        group:  group
                    }));
                }, 1000);
            }
        }

        // handle group messages
        async onGroupMessage(group: string, message: string | Uint8Array) {
            this.send(message)
        }

        // handle client messages
        async onText(text: string) {
            const ctx = this.context;
            const channel = ctx.state.user.channel;
            const group = await groups.getGroup({ code: channel });
            
            if (!channel || !group || !group.id) {
                return;
            }

            try {
                const message = JSON.parse(text) as  { action: String, data: any};

                switch (message.action) {
                    case 'update.pick': {
                        const { id, liked } = message.data as { id: string, liked: Boolean };
                        await picks.addGroupMemberPick({ movieId: id, liked, userId: ctx.state?.user?.id, groupCode: group?.code });

                        this.send(JSON.stringify({
                            action: 'group.update',
                            group
                        }));

                        // TODO transition group to results stage if all users have completed all picks...
                        // if (userPickCount && userPickCount.picks) {
                        //     await groups.updateGroupStage({ code: group.code, stage: 'waiting' });
                        //     const updatedGroup = await groups.getGroup({ code: group.code });
    

                        //     // TODO possibly redirect to /groups/:id/results ??
                        //     // to render the eta better???
                        //     this.layer.groupSend(JSON.stringify({
                        //         group: updatedGroup
                        //     }));
                        // }

                        break;
                    }
                    default: {

                        switch (group.stage) {
                            case 'assemble': {
                                // update group for subscribers
                                await this.layer.groupSend(channel, JSON.stringify({
                                    action: 'group.update',
                                    group:  group
                                }));
                                break;
                            }

                            case 'picks': {
                                // get picks for current round of movies 
                                const results = await picks.getForGroup({ groupCode: group.code });

                                // update group for subscribers
                                await this.layer.groupSend(channel, JSON.stringify({
                                    action: 'group.update',
                                    group:  group
                                }));
                                break;
                            }

                            case 'results': {
                                // update group for subscribers

                                // get picks for current round of movies 
                                const results = await picks.getForGroup({ groupCode: group.code });
                                await this.layer.groupSend(channel, JSON.stringify({
                                    action: 'group.update',
                                    group:  group
                                }));
                                break;
                            }
                        }

                    }
                }
                
                // update pick for user
            } catch (e) {

            }
        }
    }

    return mountConsumer(EchoConsumer, layer);
}

