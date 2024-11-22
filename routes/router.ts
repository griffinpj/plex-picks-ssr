import {
    Router
} from "https://deno.land/x/oak@v9.0.0/mod.ts";

import {
    BaseConsumer,
    InMemoryLayer,
    mountConsumer,
} from "https://deno.land/x/oak_channels/mod.ts";

import * as groups from '../models/groups.ts';
import * as picks from '../models/picks.ts';

import routes from './index.ts';

export default function () {

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

                        const results = await picks.getForGroup({ code: group.code });
                        console.log(results);

                        break;
                    }
                    default: {

                        switch (group.stage) {
                            case 'assemble': {
                                // update group for subscribers
                                await this.layer.groupSend(channel, JSON.stringify({
                                    group:  group
                                }));
                                break;
                            }

                            case 'picks': {
                                // get picks for current round of movies 
                                const results = await picks.getForGroup({ groupCode: group.code });

                                console.log(results);

                                // update group for subscribers
                                await this.layer.groupSend(channel, JSON.stringify({
                                    group:  group
                                }));
                                break;
                            }

                            case 'results': {
                                // update group for subscribers
                                await this.layer.groupSend(channel, JSON.stringify({
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

    const router = new Router();

    router.all("/ws", mountConsumer(EchoConsumer, layer));

    routes.forEach((route) => {
        router[route.method](route.path, route.handler);
    });

    return router;
};
