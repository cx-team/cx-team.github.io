$.ajax({
    type: 'GET',
	dataType: 'json',
    url: api_host + '/dashboard/temp_teams?season=' + season_id,
    success: function (result) {
        console.log(result);
        result.forEach(function(team){
            var data = team;
            var inputs = team.detail.inputs;
            if ($.isEmptyObject(inputs)) {
                inputs = {
                    name: '',
                    name_alt: '',
                    name_abbrv: '',
                    city: '',
                    country: '',
                    division: '',
                    uniqueid: '',
                }
            }
            
            $('#js-team-list').append(
                '<tr id="js-team' + team.id + '">' +
                '<td>' + (data.name) + '</td>' +
                '<td>' + (data.name_alt) + '</td>' +
                '<td>' + (data.name_abbrv) + '</td>' +
                '<td>' + (data.city) + '</td>' +
                '<td>' + (data.country) + '</td>' +
                '<td>' + (data.division) + '</td>' +
                '<td>' + (data.uniqueid) + '</td>' +
                '<td>' +
                    '<button class="js-edit btn-xs btn-primary btn-fill" data-id="' + team.id + '">EDIT</button>' +
                    '<button class="js-delete btn-xs btn-primary btn-fill" data-id="' + team.id + '">DELETE</button>' +
                    '<button class="js-roster btn-xs btn-primary btn-fill" data-id="' + team.id + '">ROSTER</button>' +
                '</td>' +
                '</tr>' +
                '<tr id="js-team-form' + team.id + '" style="display: none">' +
                '<td><input id="js-team-name' + team.id + '" type="text" class="form-control input-sm" name="name" value="' + (inputs.hasOwnProperty("name") ? inputs.name : '') + '"></td>' +
                '<td><input id="js-team-name-alt' + team.id + '" type="text" class="form-control input-sm" name="name_alt" value="' + (inputs.hasOwnProperty("name_alt") ? inputs.name_alt : '') + '"></td>' +
                '<td><input id="js-team-name-abbrv' + team.id + '" type="text" class="form-control input-sm" name="name_abbrv" value="' + (inputs.hasOwnProperty("name_abbrv") ? inputs.name_abbrv : '') + '"></td>' +
                '<td><input id="js-team-city' + team.id + '" type="text" class="form-control input-sm" name="city" value="' + (inputs.hasOwnProperty("city") ? inputs.city : '') + '"></td>' +
                '<td><input id="js-team-country' + team.id + '" type="text" class="form-control input-sm" name="country" value="' + (inputs.hasOwnProperty("country") ? inputs.country : '') + '"></td>' +
                '<td><input id="js-team-division' + team.id + '" type="text" class="form-control input-sm" name="division" value="' + (inputs.hasOwnProperty("division") ? inputs.division : '') + '"></td>' +
                '<td><input id="js-team-uniqueid' + team.id + '" type="text" class="form-control input-sm" name="uniqueid" value="' + (inputs.hasOwnProperty("uniqueid") ? inputs.uniqueid : '') + '"></td>' +
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
        url: api_host + '/dashboard/temp_teams/' + id,
        data: data,
        success: function (team) {
            console.log(team);
            //                $('#js-loading').hide();
            $('#js-team-form' + id).hide();
            $('#js-team' + id).replaceWith(
                '<tr id="js-team' + team.id + '">' +
                '<td>' + team.name +'</td>' +
                '<td>' + team.name_alt +'</td>' +
                '<td>' + team.name_abbrv +'</td>' +
                '<td>' + team.city +'</td>' +
                '<td>' + team.country +'</td>' +
                '<td>' + team.division +'</td>' +
                '<td>' + team.uniqueid +'</td>' +
                '<td>' +
                    '<button class="js-edit btn-xs btn-primary btn-fill" data-id="' + team.id + '">EDIT</button>' +
                    '<button class="js-delete btn-xs btn-primary btn-fill" data-id="' + team.id + '">DELETE</button>' +
                    '<button class="js-roster btn-xs btn-primary btn-fill" data-id="' + team.id + '">ROSTER</button>' +
                '</td>' +
                '</tr>'
            );
        },
        error: function (request, status, error) {
            //retry(this, request, error);
        }
    });
});

$(document).on('click', '.js-delete', function (e) {
    e.preventDefault();

    var id = $(this).attr('data-id');

    $.ajax({
        type: 'DELETE',
        url: api_host + '/dashboard/temp_teams/' + id,
        success: function (result) {
            //                $('#js-loading').hide();
            $('#js-team' + id).remove();
            $('#js-team-form' + id).remove();
        },
        error: function (request, status, error) {
            //retry(this, request, error);
        }
    });
});


$(document).on('click', '.js-roster', function (e) {
    e.preventDefault();

    var id = $(this).attr('data-id');
    window.location.href = api_host + '/dashboard/' + season_id + '/registration?locale=zh-tw&page=rosters_pending&temp_token=' + id;
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
        url: api_host + '/dashboard/temp_teams?season=' + season_id,
        data: data,
        success: function (team) {
            console.log(team);
            //                $('#js-loading').hide();
            $('#js-team-list').append(
                '<tr id="js-team' + team.id + '">' +
                '<td>' + team.name +'</td>' +
                '<td>' + team.name_alt +'</td>' +
                '<td>' + team.name_abbrv +'</td>' +
                '<td>' + team.city +'</td>' +
                '<td>' + team.country +'</td>' +
                '<td>' + team.division +'</td>' +
                '<td>' + team.uniqueid +'</td>' +
                '<td>' +
                '<button class="js-edit btn-xs btn-primary btn-fill" data-id="' + team.id + '">EDIT</button>' +
                '<button class="js-delete btn-xs btn-primary btn-fill" data-id="' + team.id + '">DELETE</button>' +
                '<a href="' + api_host + '/dashboard/' + season_id + '/registration?locale=zh-tw&page=rosters_pending&temp_token=' + team.id + '" class="btn-xs btn-primary btn-fill" data-id="' + team.id + '">ROSTER</a>' +
                '</td>' +
                '</tr>' +
                '<tr id="js-team-form' + team.id + '" style="display: none">' +
                '<td><input id="js-team-name' + team.id + '" type="text" class="form-control input-sm" name="name" value="' + team.detail.inputs.name + '"></td>' +
                '<td><input id="js-team-name-alt' + team.id + '" type="text" class="form-control input-sm" name="name_alt" value="' + team.detail.inputs.name_alt + '"></td>' +
                '<td><input id="js-team-name-abbrv' + team.id + '" type="text" class="form-control input-sm" name="name_abbrv" value="' + team.detail.inputs.name_abbrv + '"></td>' +
                '<td><input id="js-team-city' + team.id + '" type="text" class="form-control input-sm" name="city" value="' + team.detail.inputs.city + '"></td>' +
                '<td><input id="js-team-country' + team.id + '" type="text" class="form-control input-sm" name="country" value="' + team.detail.inputs.country + '"></td>' +
                '<td><input id="js-team-division' + team.id + '" type="text" class="form-control input-sm" name="division" value="' + team.detail.inputs.division + '"></td>' +
                '<td><input id="js-team-uniqueid' + team.id + '" type="text" class="form-control input-sm" name="uniqueid" value="' + team.detail.inputs.uniqueid + '"></td>' +
                '<td><button class="js-update btn-xs btn-primary btn-fill" data-id="' + team.id + '">SAVE</button></td>' +
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