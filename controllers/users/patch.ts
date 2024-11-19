export default function (ctx) {
    const newAlias = ctx.request.url.searchParams.get('alias');

    if (!newAlias || !newAlias.length) {
        ctx.response.status = 400;
        ctx.response.body = {
            error: true,
            message: 'Something went wrong. Please try again.'
        };
        return;
    }
    
    ctx.state.session.set('alias', newAlias);
    ctx.response.status = 200;
};
