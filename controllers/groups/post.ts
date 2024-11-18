import { Status } from "jsr:@oak/oak/";
import { nanoid } from 'npm:nanoid';
import * as groups from '../../models/groups.ts';

export default async function (ctx) {
    const user = ctx.state.user;

    const newCode = nanoid(4).toUpperCase();
    
    const data = await groups.createGroup({
        code: newCode,
        user
    });


    if (!data.length) {
        ctx.response.status = Status.BAD;
        return;
    }

    const record = data[0];
    const groupCode = record[0]

    if (!groupCode) {
        ctx.response.status = Status.BAD;
        return;
    }
    
    ctx.state.session.set('channel', groupCode);

    ctx.response.status = Status.OK;
    ctx.response.body = {
        code: groupCode
    };
};
