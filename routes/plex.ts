import * as groups from '../models/groups.ts';
import * as plexClient from '../lib/plex/client.ts';
import * as plexApi from '../lib/plex/api.ts';

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

export async function getThumbnail (ctx) {
    const owner = await groups.getGroupOwner({ code: ctx.params.id.toUpperCase().trim() });
    const token = owner.token;

    const metaId = ctx.params.metaId;
    const thumbId = ctx.params.thumbId;
    try {
        const thumb = await plexApi.thumb(token, [metaId, thumbId]) as Blob;
        
        if (!thumb || !thumb.bytes) {
            ctx.response.status = 400;
            return;
        }

        ctx.response.headers.set('Content-Type', 'image/png');
        ctx.response.body = await thumb.bytes();
    } catch (e) {
        console.log(e);
        ctx.response.status = 400;
        return;
    }
};

export async function getArt (ctx) {
    const owner = await groups.getGroupOwner({ code: ctx.params.id.toUpperCase().trim() });
    const token = owner.token;

    const metaId = ctx.params.metaId;
    const artId = ctx.params.artId;

    try {
        const art = await plexApi.art(token, [metaId, artId]);
        if (!art || !art?.bytes) {
            ctx.response.status = 400;
            return;
        }

        ctx.response.headers.set('Content-Type', 'image/png');
        ctx.response.body = await art.bytes();
    } catch (e) {
        ctx.response.status = 400;
    }
};
