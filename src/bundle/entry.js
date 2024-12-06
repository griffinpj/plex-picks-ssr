let group = null;
let selectedIdx = 0;
let maxIdx = 0;

let restored = false;

$(document).ready(function() {
    const { ws } = setupSockets();

    ws.addEventListener("message", (e) => {
        try {
            const data = JSON.parse(e.data);

            switch (data.action) {
                case 'group.update':
                    updateGroup(group, data.group);
                    break;
            }

        } catch (e) {
            console.log(e);
        }
    });

    window.ws = ws;
    window.addEventListener("beforeunload", function(event) {
        ws.close();
    });   
    
    plexAuthentication();
    groupActions();
    headerActions();
    updateMovieCards();

    // Movie navigation
    $(document).on('click', '#j-like-movie', function (e) {
        navigate(true, getActiveMovie());
    });

    $(document).on('click', '#j-dislike-movie', function (e) {
        navigate(false, getActiveMovie());
    });

    $(document).on('update-server', function (e, data) {
        const { id, liked } = data;

        ws.send(JSON.stringify({
            action: 'update.pick',
            data: { id, liked }
        }));
    });
});

function getActiveMovie () {
    return $(`.j-movie-card[data-idx="${selectedIdx}"]`);
}

function navigate (liked, $movie, saved) {
    const idx = $movie.data('idx');
    const newIdx = saved ?? idx + 1;
    
    const $nextMovie = $(`.j-movie-card[data-idx="${newIdx}"]`);
    if ($nextMovie.length) {
        $movie.addClass('is-hidden');
        $nextMovie.removeClass('is-hidden');
    }
        
    selectedIdx = newIdx;
    maxIdx = newIdx > maxIdx ? newIdx : maxIdx;

    if (group?.code) {
        // save pick progress to client in case of refresh
        localStorage.setItem(`${group.code}-idx`, maxIdx);

        // trigger update to the server
        $(document).trigger('update-server', { id: $movie.data('id'), liked });
    }
    updateProgress();
};

function updateProgress () {
    const progress = Math.floor((maxIdx) / $('.j-movie-card').length * 100);
    

    if ($('.j-movie-card').length) {
        if (maxIdx === 20) {
        }

        $('#j-pick-progress').val(progress);
        $('#j-pick-progress').text(progress);
    }
}

function updateMovieCards () {
    getActiveMovie().removeClass('is-hidden');
}

function updateGroup (old, updated) {
    if (old?.stage !== updated?.stage) {
        $(`[data-stage]`).addClass('is-hidden');
        $(`[data-stage="${updated?.stage}"]`).removeClass('is-hidden');
    }

    $.ajax({
        url: `/groups/${updated.code}/info`,
        method: 'get'
    }).done((data) => {
        if (data.html) {
            $('#j-group-info').html(data.html);
            if (updated.movies?.length) {
                updateMovieCards();

                if (updated?.code) {
                    const savedIdx = localStorage.getItem(`${updated.code}-idx`);
                    if (savedIdx && !restored) {
                        navigate(null, $('.j-movie-card'), Number(savedIdx));
                    }
                    restored = true;
                }

                updateProgress();
            }
        }

        group = updated;
    }).fail(() => {
        $('#j-group-info').html(`
            Something went wrong that wasn't supposed to. Blame the developer...
        `);
    });
}

function headerActions () {
    const $updateAliasInput = $('#j-alias-input');
    const $updateAlias = $('#j-update-alias');



    $updateAlias.on('click', function () {
        if (!$updateAliasInput.val()) {
            return;
        }

        $updateAlias.addClass('is-loading');
        $.ajax({
            url: `/users?alias=${$updateAliasInput.val()}`,
            method: 'patch'
        }).done((data) => {
            ws.send(JSON.stringify({
                action: 'update.alias',
                data: {
                    alias: $updateAliasInput.val()
                }
            }));
        }).always(() => {
            $updateAlias.removeClass('is-loading');
        });
    });
}

function groupActions () {
    const $createButton = $('#j-create-group');
    const $joinButton = $('#j-join-group');
    const $joinInput = $('#j-join-input');

    $(document).on('click','#j-group-pick', function (e) {
        const $pickButton = $('#j-group-pick');

        if (group && group.code) {
            $pickButton.addClass('is-loading');
            $.ajax({
                url: `/groups/${group.code}/movies`,
                method: 'put'
            }).always(() => {
                $pickButton.removeClass('is-loading');
                ws.send(JSON.stringify({
                    action: 'update.stage',
                    data: { stage: 'picks' },
                }));
            });
        }
    });

    $createButton.on('click', function (e) {
        $createButton.addClass('is-loading');
        $.ajax({
            url: '/groups',
            method: 'post'
        }).done((data) => {
            if (data.code) {
                window.location = `/groups/${data.code}`;
            }
        }).fail(() => {
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
        }).fail(() => {
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
