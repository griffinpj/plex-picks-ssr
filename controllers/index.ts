export default async function (ctx) {
    const user = ctx.state.user;

    ctx.response.body = ctx.eta.render('./index', {
        user
    })
};
