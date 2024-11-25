import {
    Router
} from "https://deno.land/x/oak@v9.0.0/mod.ts";

import { sockets } from '../lib/sockets/index.ts';

import routes from './index.ts';

export default function () {

    const router = new Router();

    router.all("/ws", sockets());

    routes.forEach((route) => {
        router[route.method](route.path, route.handler);
    });

    return router;
};
