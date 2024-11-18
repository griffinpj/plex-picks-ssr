$(document).ready(function() {
    const { ws } = setupSockets();

    ws.addEventListener("message", (e) => {
        try {
            const data = JSON.parse(e.data);
            updateGroup(data); 
        } catch (e) {
            console.log(e);
            console.log("received_ws", e.data)
        }
    });

    window.ws = ws;
    
    plexAuthentication();
    groupActions();
    headerActions();
});

function updateGroup (group) {
    $.ajax({
        url: `/groups/${group.code}/table`,
        method: 'get'
    }).done((data) => {
        if (data.html) {
            $('#j-members-table').html(data.html);
        }
    });
}

function headerActions () {
    const $updateAliasInput = $('#j-alias-input');
    const $updateAlias = $('#j-update-alias');

    $updateAlias.on('click', function () {
        $updateAlias.addClass('is-loading');
        $.ajax({
            url: `/users?alias=${$updateAliasInput.val()}`,
            method: 'patch'
        }).done((data) => {
            ws.send('hello');
        }).always(() => {
            $updateAlias.removeClass('is-loading');
        });
    });
}

function groupActions () {
    const $createButton = $('#j-create-group');
    const $joinButton = $('#j-join-group');
    const $joinInput = $('#j-join-input');

    $createButton.on('click', function (e) {
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

    $joinButton.on('click', function (e) {
        const joinCode = $joinInput.val();

        if (!joinCode) {
            return;
        }

        if (joinCode.length > 6) {
            return;
        }

        $joinButton.addClass('is-loading');
        $.ajax({
            url: `/groups/${joinCode}/members`,
            method: 'post'
        }).done((data) => {
            if (data.code) {
                window.location = `/groups/${data.code}`;
            }
        }).always(() => {
            $joinButton.removeClass('is-loading');
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
    const ws = new WebSocket(baseURL + '/ws');

    
    return { ws };
}
