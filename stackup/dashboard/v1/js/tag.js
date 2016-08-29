$.ajax({
    type: 'GET',
    dataType: 'json',
    url: 'http://api.cxn-tw.com/v1/seasons/ehCFp7guicmh6QX2rFzBGQ/games',
    success: function (games) {
        console.log(games);
        games.forEach(function(game){
            $('#js-game-select').append(
                '<option value="' + game.id + '">' + game.name + '</option>'
            );
        });

        $('#js-game-select').select2();
    },
    error: function (request, status, error) {
        //retry(this, request, error);
    }
});

$.ajax({
    type: 'GET',
	dataType: 'json',
    url: 'http://api.cxn-tw.com/v1/seasons/ehCFp7guicmh6QX2rFzBGQ/rosters',
    success: function (result) {
        console.log(result);
        result.forEach(function(roster){
            $('#js-player-select').append(
                '<option value="' + roster.id + '">' + '[' + roster.team_name + '] ' + roster.jersey + ' - ' + roster.position + ' - ' + roster.player_name + '</option>'
            );
        });

        $('#js-player-select').select2();
    },
    error: function (request, status, error) {
        //retry(this, request, error);
    }
});

