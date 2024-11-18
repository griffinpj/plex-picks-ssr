import * as plexClient from '../lib/plex/client.ts';

export async function authenticate (ctx) {
    let pin: number | null = null;
    let url: string | null = null;

    try {
        const data = await plexClient.login();
        pin = data.pin || null;
        url = data.url || null;
        
        ctx.state.session.set('plex-pin', pin);
    } catch (e) {
        console.log(e);
    }

    ctx.response.body = { url, pin };
};

