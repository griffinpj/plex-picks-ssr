import {
    Application,
    HttpServerStd,
    Router,
} from "https://deno.land/x/oak@v9.0.0/mod.ts";
import { Session, SqliteStore } from "https://deno.land/x/oak_sessions/mod.ts";
import logger from "https://deno.land/x/oak_logger/mod.ts";
import { Eta } from "https://deno.land/x/eta@v3.1.0/src/index.ts";
import * as path from "jsr:@std/path";

import {
    BaseConsumer,
    InMemoryLayer,
    JSONConsumer,
    mountConsumer,
} from "https://deno.land/x/oak_channels/mod.ts";

import * as plexClient from './lib/plex/client.ts';

import { db } from './configs/db.ts';
import routes from './routes/index.ts';
import * as groups from './models/groups.ts';

const app = new Application({ serverConstructor: HttpServerStd });
const sqlite = db();

// Pass DB instance into a new SqliteStore. Optionally add a custom table name as second string argument, default is 'sessions'
const store = new SqliteStore(sqlite);

const layer = new InMemoryLayer();

class EchoConsumer extends BaseConsumer {
    async onConnect() {
        const ctx = this.context;
        const alias = ctx.state.session.get('alias');
        const channel = ctx.state.session.get('channel');
        
        if (channel) {
            await this.groupJoin(channel);
            const group = await groups.getGroup({
                code: channel
            });
            await this.layer.groupSend(channel, JSON.stringify(group));
        }
    }

    // handle group messages
    async onGroupMessage(group: string, message: string | Uint8Array) {
        this.send(message)
    }

    // handle client messages
    async onText(text: string) {
        const ctx = this.context;
        const channel = ctx.state.session.get('channel');
        const group = await groups.getGroup({
            code: channel
        });

        await this.layer.groupSend(channel, JSON.stringify(group));
    }
}

const router = new Router();

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

    ctx.state.user = {
        alias,
        id: sessionId,
        pin,
        token
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

router.all("/ws", mountConsumer(EchoConsumer, layer));

routes.forEach((route) => {
    router[route.method](route.path, route.handler);
});

app.use(router.routes());
app.use(router.allowedMethods());


app.addEventListener('error', (evt) => {
    console.log(evt.error)
})

app.listen({ port: 8080 });

