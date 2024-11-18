$(document).ready(function() {
    const { ws, jsonws } = setupSockets();

    ws.onopen = () => {
      console.log("sending 'foo'");
      ws.send('foo');
    }

    jsonws.onopen = () => {
      console.log("sending json");
      jsonws.send(JSON.stringify({ ping: new Date().getTime() }));
    }

    window.ws = ws;
    window.jsonws = jsonws;
    
    plexAuthentication();
    groupActions();
});

function groupActions () {
    const $createButton = $('#j-create-group');
    $('#j-create-group').on('click', function (e) {
        $createButton.addClass('is-loading');
        $.ajax({
            url: '/groups',
            method: 'post'
        }).done((data) => {
            if (data.code) {
                window.location = `/groups/${data.code}`;
            }
        }).always(() => {
            $createButton.removeClass('is-loading');
        });
    });
}

function plexAuthentication () {
    const $authButton = $('.j-authenticate-plex');
    $authButton.on('click', function (e) {
        $authButton.addClass('is-loading');
        $.ajax({
            url: '/auth/plex',
            method: 'post'
        }).done((data) => {
            if (data && data.url) {
                window.location = data.url;
            }
        }).always(() => {
            $authButton.removeClass('is-loading');
        });
    });
}


function setupSockets() {
    const host = window.location.host;
    const scheme = window.location.protocol === "http:" ? "ws" : "wss";
    const baseURL = `${scheme}://${host}`;
    const jsonws = new WebSocket(baseURL + '/ws-json');
    const ws = new WebSocket(baseURL + '/ws');

    ws.addEventListener("message", (e) => console.log("received_ws", e.data));
    jsonws.addEventListener("message", (e) => console.log("received_json", JSON.parse(e.data)));
    
    return { jsonws, ws };
}
