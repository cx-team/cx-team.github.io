$.ajax({
    type: 'GET',
	dataType: 'json',
    url: api_host + '/admin/dashboard/' + season_id + '/temp_teams',
    success: function (result) {
        console.log(result);
        result.forEach(function(team){
            $('#js-team-list').append(
                '<tr id="js-team' + team.id + '">' +
                '<td>' + team.detail.inputs.name +'</td>' +
                '<td>' + team.detail.inputs.name_alt +'</td>' +
                '<td>' + team.detail.inputs.name_abbrv +'</td>' +
                '<td>' + team.detail.inputs.city +'</td>' +
                '<td>' + team.detail.inputs.country +'</td>' +
                '<td>' + team.detail.inputs.division +'</td>' +
                '<td>' + team.detail.inputs.uniqueid +'</td>' +
                '<td><button class="js-edit btn-xs btn-primary btn-fill" data-id="' + team.id + '">EDIT</button></td>' +
                '</tr>' +
                '<tr id="js-team-form' + team.id + '" style="display: none">' +
                '<td><input id="js-team-name' + team.id + '" type="text" name="name" value="' + team.detail.inputs.name + '"><br></td>' +
                '<td><input id="js-team-name-alt' + team.id + '" type="text" name="name_alt" value="' + team.detail.inputs.name_alt + '"><br></td>' +
                '<td><input id="js-team-name-abbrv' + team.id + '" type="text" name="name_abbrv" value="' + team.detail.inputs.name_abbrv + '"><br></td>' +
                '<td><input id="js-team-city' + team.id + '" type="text" name="city" value="' + team.detail.inputs.city + '"><br></td>' +
                '<td><input id="js-team-country' + team.id + '" type="text" name="country" value="' + team.detail.inputs.country + '"><br></td>' +
                '<td><input id="js-team-division' + team.id + '" type="text" name="division" value="' + team.detail.inputs.division + '"><br></td>' +
                '<td><input id="js-team-uniqueid' + team.id + '" type="text" name="uniqueid" value="' + team.detail.inputs.uniqueid + '"><br></td>' +
                '<td><button class="js-update btn-xs btn-success btn-fill" data-id="' + team.id + '">SAVE</button></td>' +
                '</tr>'
            );
        });


    },
    error: function (request, status, error) {
        //retry(this, request, error);
    }
});

$(document).on('click', '.js-edit', function (e) {
    e.preventDefault();

    var id = $(this).attr('data-id');
    $('#js-team' + id).hide();
    $('#js-team-form' + id).show();
});

$(document).on('click', '.js-update', function (e) {
    e.preventDefault();

    var id = $(this).attr('data-id');
    var data = {
        model: 'Team',
        inputs: {
            name: $('#js-team-name' + id).val(),
            name_alt: $('#js-team-name-alt' + id).val(),
            name_abbrv: $('#js-team-name-abbrv' + id).val(),
            city: $('#js-team-city' + id).val(),
            country: $('#js-team-country' + id).val(),
            division: $('#js-team-division' + id).val(),
            uniqueid: $('#js-team-uniqueid' + id).val()
        },
    }

    $.ajax({
        type: 'PUT',
        url: api_host + '/admin/dashboard/' + season_id + '/temp_teams/' + id,
        data: data,
        success: function (team) {
            console.log(team);
            //                $('#js-loading').hide();
            $('#js-team-form' + id).hide();
            $('#js-team' + id).replaceWith(
                '<tr id="js-team' + team.id + '">' +
                '<td>' + team.detail.inputs.name +'</td>' +
                '<td>' + team.detail.inputs.name_alt +'</td>' +
                '<td>' + team.detail.inputs.name_abbrv +'</td>' +
                '<td>' + team.detail.inputs.city +'</td>' +
                '<td>' + team.detail.inputs.country +'</td>' +
                '<td>' + team.detail.inputs.division +'</td>' +
                '<td>' + team.detail.inputs.uniqueid +'</td>' +
                '<td><button class="js-edit btn-xs btn-primary btn-fill" data-id="' + team.id + '">EDIT</button></td>' +
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
        model: 'Team',
        inputs: {
            name: $('#js-team-name').val(),
            name_alt: $('#js-team-name-alt').val(),
            name_abbrv: $('#js-team-name-abbrv').val(),
            city: $('#js-team-city').val(),
            country: $('#js-team-country').val(),
            division: $('#js-team-division').val(),
            uniqueid: $('#js-team-uniqueid').val()
        },
    }

    $.ajax({
        type: 'POST',
        url: api_host + '/admin/dashboard/' + season_id + '/temp_teams',
        data: data,
        success: function (team) {
            console.log(team);
            //                $('#js-loading').hide();
            $('#js-team-list').append(
                '<tr id="js-team' + team.id + '">' +
                '<td>' + team.detail.inputs.name +'</td>' +
                '<td>' + team.detail.inputs.name_alt +'</td>' +
                '<td>' + team.detail.inputs.name_abbrv +'</td>' +
                '<td>' + team.detail.inputs.city +'</td>' +
                '<td>' + team.detail.inputs.country +'</td>' +
                '<td>' + team.detail.inputs.division +'</td>' +
                '<td>' + team.detail.inputs.uniqueid +'</td>' +
                '<td><button class="js-edit btn-xs btn-primary btn-fill" data-id="' + team.id + '">EDIT</button></td>' +
                '</tr>' +
                '<tr id="js-team-form' + team.id + '" style="display: none">' +
                '<td><input id="js-team-name' + team.id + '" type="text" name="name" value="' + team.detail.inputs.name + '"><br></td>' +
                '<td><input id="js-team-name-alt' + team.id + '" type="text" name="name_alt" value="' + team.detail.inputs.name_alt + '"><br></td>' +
                '<td><input id="js-team-name-abbrv' + team.id + '" type="text" name="name_abbrv" value="' + team.detail.inputs.name_abbrv + '"><br></td>' +
                '<td><input id="js-team-city' + team.id + '" type="text" name="city" value="' + team.detail.inputs.city + '"><br></td>' +
                '<td><input id="js-team-country' + team.id + '" type="text" name="country" value="' + team.detail.inputs.country + '"><br></td>' +
                '<td><input id="js-team-division' + team.id + '" type="text" name="division" value="' + team.detail.inputs.division + '"><br></td>' +
                '<td><input id="js-team-uniqueid' + team.id + '" type="text" name="uniqueid" value="' + team.detail.inputs.uniqueid + '"><br></td>' +
                '<td><button class="js-update btn-xs btn-success btn-fill" data-id="' + team.id + '">SAVE</button></td>' +
                '</tr>'
            );

            $('#js-team-name').val('');
            $('#js-team-name-alt').val('');
            $('#js-team-name-abbrv').val('');
            $('#js-team-city').val('');
            $('#js-team-country').val('');
            $('#js-team-division').val('');
            $('#js-team-uniqueid').val('');
        },
        error: function (request, status, error) {
            //retry(this, request, error);
        }
    });
});