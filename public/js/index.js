let group = null;
let selectedIdx = 0;
let maxIdx = 0;

$(document).ready(function() {
    const { ws } = setupSockets();

    ws.addEventListener("message", (e) => {
        try {
            const data = JSON.parse(e.data);
            updateGroup(group, data.group);
            updateUser(data.user);
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
        navigate(true, getActiveMovie());
    });
});

function getActiveMovie () {
    return $(`.j-movie-card[data-idx="${selectedIdx}"]`);
}

function navigate (forward, $movie, saved) {
    const idx = $movie.data('idx');
    const newIdx = saved ?? (forward ? idx + 1 : idx - 1);
    
    const $nextMovie = $(`.j-movie-card[data-idx="${newIdx}"]`);
    if ($nextMovie.length) {
        $movie.addClass('is-hidden');
        $nextMovie.removeClass('is-hidden');
        
        selectedIdx = newIdx;
        maxIdx = newIdx > maxIdx ? newIdx : maxIdx;

        if (group?.code) {
            localStorage.setItem(`${group.code}-idx`, maxIdx);
        }
    }
    updateProgress();
};

function updateProgress () {
    const progress = Math.floor((maxIdx + 1.0) / $('.j-movie-card').length * 100);
    $('#j-pick-progress').val(progress);
    $('#j-pick-progress').text(progress);
}

function updateUser (user) {
    // console.log(user); 
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
                updateProgress();

                if (updated?.code) {
                    const savedIdx = localStorage.getItem(`${updated.code}-idx`);
                    if (savedIdx) {
                        navigate(null, $('.j-movie-card'), Number(savedIdx));
                    }
                }
            }
        }

        group = updated;
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
            ws.send('update');
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
                    action: 'update',
                    resource: 'stage',
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
