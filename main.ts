import {
    Application,
    HttpServerStd
} from "https://deno.land/x/oak@v9.0.0/mod.ts";
import { Session, PostgresStore } from "https://deno.land/x/oak_sessions/mod.ts";
import logger from "https://deno.land/x/oak_logger/mod.ts";
import { Eta } from "https://deno.land/x/eta@v3.1.0/src/index.ts";
import * as path from "jsr:@std/path";

import * as plexClient from './lib/plex/client.ts';
import Router from './routes/router.ts';
import { db } from './configs/db.ts';

import * as picks from './models/picks.ts';

const app = new Application({ serverConstructor: HttpServerStd });
const pg = db();

const store = new PostgresStore(pg);

app.use(logger.logger)
app.use(logger.responseTime)
app.use(Session.initMiddleware(store));

// General setup
app.use(async (ctx, next) => {
    if(!ctx.state.session.get('id')) {
        ctx.state.session.set('id', crypto.randomUUID());
    }

    ctx.eta = new Eta({ views: path.join(Deno.cwd(), "templates") });

    return await next();
});

// Validate plex credentials
app.use(async (ctx, next) => {
    const sessionId = ctx.state.session.get('id');
    const pin = ctx.state.session.get('plex-pin');
    let token = ctx.state.session.get('plex-token');
    let alias = ctx.state.session.get('alias');
    let channel = ctx.state.session.get('channel');


    if (pin && !token) {
        token = await plexClient.checkForAuthToken(pin);
        ctx.state.session.set('plex-token', token);
    }

    const randomAliases = [
        'Fancy Cow',
        'Slippery Snake',
        'Whispering Wind',
        'Golden Goose',
        'Silent Wolf',
        'Sneaky Fox',
        'Mystic Moon',
        'Gentle Tiger',
        'Sapphire Star',
        'Twinkling Dolphin',
        'Velvet Lion',
        'Whirling Storm',
        'Dancing Dragonfly',
        'Sparkling Sparrow',
        'Crimson Phoenix',
        'Shimmering Shark',
        'Majestic Eagle',
        'Enchanted Butterfly',
        'Radiant Raven',
        'Sapphire Serpent',
        'Golden Griffin',
        'Violet Vixen',
        'Echoing Elk',
        'Whispering Willow',
        'Glimmering Gull',
        'Ember Elephant',
        'Luminous Lizard',
        'Twilight Turtle',
        'Gossamer Giraffe'
    ];

    if (!alias) {
        const randomIndex = Math.floor(Math.random() * randomAliases.length);
        alias = randomAliases[randomIndex];
        ctx.state.session.set('alias', alias);
    }
    
    let totalPicks = 0;
    if (channel) {
        const groupPicks = await picks.getForGroupByUser({ code: channel });
        
        const myPicks = groupPicks.find((count) => count.user_id === sessionId);
        const myPickCount = myPicks && myPicks.picks ? Number(myPicks.picks) : 0;
        totalPicks = myPickCount;
    }

    ctx.state.user = {
        alias,
        id: sessionId,
        pin,
        token,
        totalPicks: totalPicks,
        channel
    };

    return await next();
});

// Static asset routes
app.use(async (context, next) => {
    try {
        await context.send({
            root: `${Deno.cwd()}/public`,
            index: "index.html",
        });
    } catch {
        await next();
    }
});

const router = Router();
app.use(router.routes());
app.use(router.allowedMethods());

app.addEventListener('error', (evt) => {
    console.log(evt.error)
})

app.listen({ port: 8080 });

