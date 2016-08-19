function addLiveGame(game) {
    $('#js-live-games').append(
        '<tr>' +
              '<td>' + game.date + '</td>' +
              '<td>' + game.home_team + '</td>' +
              '<td>' + game.away_team + '</td>' +
              '<td>' +
                    '<a href="live_stats.html" class="btn btn-success waves-effect waves-light">Live Stats</a>' +
                    '<a href="#" class="btn btn-inverse waves-effect waves-light">Box Score</a>' +
                    '<a href="#" class="btn btn-danger waves-effect waves-light">Secure</a>' +
              '</td>' +
        '</tr>'
    );
}

function addUpcomingGame(game) {
    $('#js-upcoming-games').append(
        '<tr>' +
            '<td>' + game.date + '</td>' +
            '<td>' + game.home_team + '</td>' +
            '<td>' + game.away_team + '</td>' +
            '<td><a href="" class="js-activate-livestats btn btn-success" data-id="' + game.id + '">Activate Live Stats</a></td>' +
        '</tr>'
    );
}

function addLastGame(game) {
    $('#js-upcoming-games').append(
        '<tr>' +
            '<td>' + game.date + '</td>' +
            '<td>' + game.home_team + '</td>' +
            '<td>' + game.away_team + '</td>' +
            '<td><a href="#" class="btn btn-inverse">Box Score</a></td>' +
        '</tr>'
    );
}

function loadGameList() {
    $('#js-loading-message').text('Loading...');
    $('#js-loading').show();

    $.get(api_host + '/admin/livestats/seasons/' + season_id + '/games', function (data, status) {
        $('#js-loading').hide();

        data.forEach(function(game) {
           if (game.detail)
               if (game.detail.livestats_enable)
                   if (game.detail.livestats_currentperiodstatus != 'C')
                        addLiveGame(game);
                   else
                       addLastGame(game);
               else
                   addUpcomingGame(game);
        });
    });
}

loadGameList();

$(document).on('click', '.js-activate-livestats', function (e) {
    e.preventDefault();

    var game_id = $(this).attr('data-id');

    $('#js-loading-message').text('Loading...');
    $('#js-loading').show();
    $.ajax({
        type: 'PUT',
        url: api_host + '/admin/livestats/games/' + game_id + '/activate',
        data: null,
        success: function (result) {
            $('#js-loading').hide();

            toastr.success('Game livestats is activated!');
            window.location.href = 'live_stats_setting.html';
        }
    });
});