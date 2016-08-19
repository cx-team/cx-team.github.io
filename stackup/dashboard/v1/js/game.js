/*$.ajax({
    type: 'GET',
    url: api_host + '/admin/dashboard/batch_approvals/' + season_id + '/requests',
    success: function (result) {
        console.log(result);
        //                $('#js-loading').hide();
        result.forEach(function(game){
            $('#js-game-list').append(
                '<tr id="js-game' + game.id + '">' +
                '<td>' + game.detail.inputs.name +'</td>' +
                '<td>' + game.detail.inputs.name_alt +'</td>' +
                '<td>' + game.detail.inputs.name_abbrv +'</td>' +
                '<td>' + game.detail.inputs.city +'</td>' +
                '<td>' + game.detail.inputs.country +'</td>' +
                '<td>' + game.detail.inputs.division +'</td>' +
                '<td>' + game.detail.inputs.uniqueid +'</td>' +
                '<td><button class="js-edit btn-xs btn-primary btn-fill" data-id="' + game.id + '">EDIT</button></td>' +
                '</tr>' +
                '<tr id="js-game-form' + game.id + '" style="display: none">' +
                '<td><input id="js-game-name' + game.id + '" type="text" name="name" value="' + game.detail.inputs.name + '"><br></td>' +
                '<td><input id="js-game-name-alt' + game.id + '" type="text" name="name_alt" value="' + game.detail.inputs.name_alt + '"><br></td>' +
                '<td><input id="js-game-name-abbrv' + game.id + '" type="text" name="name_abbrv" value="' + game.detail.inputs.name_abbrv + '"><br></td>' +
                '<td><input id="js-game-city' + game.id + '" type="text" name="city" value="' + game.detail.inputs.city + '"><br></td>' +
                '<td><input id="js-game-country' + game.id + '" type="text" name="country" value="' + game.detail.inputs.country + '"><br></td>' +
                '<td><input id="js-game-division' + game.id + '" type="text" name="division" value="' + game.detail.inputs.division + '"><br></td>' +
                '<td><input id="js-game-uniqueid' + game.id + '" type="text" name="uniqueid" value="' + game.detail.inputs.uniqueid + '"><br></td>' +
                '<td><button class="js-update btn-xs btn-success btn-fill" data-id="' + game.id + '">SAVE</button></td>' +
                '</tr>'
            );
        });


    },
    error: function (request, status, error) {
        //retry(this, request, error);
    }
});*/

$(document).on('click', '.js-edit', function (e) {
    e.preventDefault();

    var id = $(this).attr('data-id');
    $('#js-game' + id).hide();
    $('#js-game-form' + id).show();
});

$(document).on('click', '.js-update', function (e) {
    e.preventDefault();

    var id = $(this).attr('data-id');
    var data = {
        model: 'game',
        attributes: {
            date: $('#js-game-date' + id).val(),
            time: $('#js-game-time' + id).val(),
            location: $('#js-game-location' + id).val(),
            home_team: $('#js-game-home-team' + id).val(),
            away_team: $('#js-game-away-team' + id).val()
        },
    }

    $.ajax({
        type: 'PUT',
        url: api_host + '/admin/dashboard/batch_approvals/' + season_id + '/requests/' + id,
        data: data,
        success: function (game) {
            console.log(game);
            //                $('#js-loading').hide();
            $('#js-game-form' + id).hide();
            $('#js-game' + id).replaceWith(
                '<tr id="js-game' + game.id + '">' +
                    '<td>' + game.detail.inputs.date +'</td>' +
                    '<td>' + game.detail.inputs.time +'</td>' +
                    '<td>' + game.detail.inputs.location +'</td>' +
                    '<td>' + game.detail.inputs.home_team +'</td>' +
                    '<td>' + game.detail.inputs.away_team +'</td>' +
                    '<td></td>' +
                    '<td></td>' +
                    '<td></td>' +
                    '<td><button class="js-edit btn-xs btn-primary btn-fill" data-id="' + game.id + '">EDIT</button></td>' +
                '</tr>'
            );
        },
        error: function (request, status, error) {
            //retry(this, request, error);
        }
    });
});

$(document).on('click', '#js-create', function (e) {
    e.preventDefault();

    //        var id = $(this).attr('data-id');
    var data = {
        model: 'game',
        attributes: {
            date: $('#js-game-date').val(),
            time: $('#js-game-time').val(),
            location: $('#js-game-location').val(),
            home_team: $('#js-game-home-team').val(),
            away_team: $('#js-game-away-team').val()
        },
    }

    $.ajax({
        type: 'POST',
        url: api_host + '/admin/dashboard/batch_approvals/' + season_id + '/requests',
        data: data,
        success: function (game) {
            console.log(game);
            //                $('#js-loading').hide();
            $('#js-game-list').append(
                '<tr id="js-game' + game.id + '">' +
                    '<td>' + game.detail.inputs.date +'</td>' +
                    '<td>' + game.detail.inputs.time +'</td>' +
                    '<td>' + game.detail.inputs.location +'</td>' +
                    '<td>' + game.detail.inputs.home_team +'</td>' +
                    '<td>' + game.detail.inputs.away_team +'</td>' +
                    '<td></td>' +
                    '<td></td>' +
                    '<td></td>' +
                    '<td><button class="js-edit btn-xs btn-primary btn-fill" data-id="' + game.id + '">EDIT</button></td>' +
                '</tr>' +
                '<tr id="js-game-form' + game.id + '" style="display: none">' +
                    '<td><input id="js-game-date' + game.id + '" type="text" name="name" value="' + game.detail.inputs.date + '"><br></td>' +
                    '<td><input id="js-game-time' + game.id + '" type="text" name="name_alt" value="' + game.detail.inputs.time + '"><br></td>' +
                    '<td><input id="js-game-location' + game.id + '" type="text" name="name_abbrv" value="' + game.detail.inputs.location + '"><br></td>' +
                    '<td>'  + $('#js-game-home-team').clone().attr('id', 'js-game-home-team' + game.id)[0].outerHTML + '</td>' +
                    '<td>'  + $('#js-game-away-team').clone().attr('id', 'js-game-away-team' + game.id)[0].outerHTML + '</td>' +
                    '<td></td>' +
                    '<td></td>' +
                    '<td></td>' +
                    '<td><button class="js-update btn-xs btn-success btn-fill" data-id="' + game.id + '">SAVE</button></td>' +
                '</tr>'
            );

            $('#js-game-date').val('');
            $('#js-game-time').val('');
            $('#js-game-location').val('');
            $('#js-game-home-team').val('');
            $('#js-game-away-team').val('');
        },
        error: function (request, status, error) {
            //retry(this, request, error);
        }
    });
});