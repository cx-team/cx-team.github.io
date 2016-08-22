$.ajax({
    type: 'GET',
    url: api_host + '/admin/dashboard/' + season_id + '/temp_teams/',
    success: function (result) {
        console.log(result);
        //                $('#js-loading').hide();
        result.forEach(function(team){
            $('#js-team-list').append(
                '<tr id="js-team' + team.id + '">' +
                '<td>' + team.detail.attributes.name +'</td>' +
                '<td>' + team.detail.attributes.name_alt +'</td>' +
                '<td>' + team.detail.attributes.name_abbrv +'</td>' +
                '<td>' + team.detail.attributes.city +'</td>' +
                '<td>' + team.detail.attributes.country +'</td>' +
                '<td>' + team.detail.attributes.division +'</td>' +
                '<td>' + team.detail.attributes.uniqueid +'</td>' +
                '<td><button class="js-edit btn-xs btn-primary btn-fill" data-id="' + team.id + '">EDIT</button></td>' +
                '</tr>' +
                '<tr id="js-team-form' + team.id + '" style="display: none">' +
                '<td><input id="js-team-name' + team.id + '" type="text" name="name" value="' + team.detail.attributes.name + '"><br></td>' +
                '<td><input id="js-team-name-alt' + team.id + '" type="text" name="name_alt" value="' + team.detail.attributes.name_alt + '"><br></td>' +
                '<td><input id="js-team-name-abbrv' + team.id + '" type="text" name="name_abbrv" value="' + team.detail.attributes.name_abbrv + '"><br></td>' +
                '<td><input id="js-team-city' + team.id + '" type="text" name="city" value="' + team.detail.attributes.city + '"><br></td>' +
                '<td><input id="js-team-country' + team.id + '" type="text" name="country" value="' + team.detail.attributes.country + '"><br></td>' +
                '<td><input id="js-team-division' + team.id + '" type="text" name="division" value="' + team.detail.attributes.division + '"><br></td>' +
                '<td><input id="js-team-uniqueid' + team.id + '" type="text" name="uniqueid" value="' + team.detail.attributes.uniqueid + '"><br></td>' +
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
        attributes: {
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
        url: api_host + '/admin/dashboard/batch_approvals/' + approval_id + '/requests/' + id,
        data: data,
        success: function (team) {
            console.log(team);
            //                $('#js-loading').hide();
            $('#js-team-form' + id).hide();
            $('#js-team' + id).replaceWith(
                '<tr id="js-team' + team.id + '">' +
                '<td>' + team.detail.attributes.name +'</td>' +
                '<td>' + team.detail.attributes.name_alt +'</td>' +
                '<td>' + team.detail.attributes.name_abbrv +'</td>' +
                '<td>' + team.detail.attributes.city +'</td>' +
                '<td>' + team.detail.attributes.country +'</td>' +
                '<td>' + team.detail.attributes.division +'</td>' +
                '<td>' + team.detail.attributes.uniqueid +'</td>' +
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
        attributes: {
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
        url: api_host + '/admin/dashboard/batch_approvals/' + approval_id + '/requests',
        data: data,
        success: function (team) {
            console.log(team);
            //                $('#js-loading').hide();
            $('#js-team-list').append(
                '<tr id="js-team' + team.id + '">' +
                '<td>' + team.detail.attributes.name +'</td>' +
                '<td>' + team.detail.attributes.name_alt +'</td>' +
                '<td>' + team.detail.attributes.name_abbrv +'</td>' +
                '<td>' + team.detail.attributes.city +'</td>' +
                '<td>' + team.detail.attributes.country +'</td>' +
                '<td>' + team.detail.attributes.division +'</td>' +
                '<td>' + team.detail.attributes.uniqueid +'</td>' +
                '<td><button class="js-edit btn-xs btn-primary btn-fill" data-id="' + team.id + '">EDIT</button></td>' +
                '</tr>' +
                '<tr id="js-team-form' + team.id + '" style="display: none">' +
                '<td><input id="js-team-name' + team.id + '" type="text" name="name" value="' + team.detail.attributes.name + '"><br></td>' +
                '<td><input id="js-team-name-alt' + team.id + '" type="text" name="name_alt" value="' + team.detail.attributes.name_alt + '"><br></td>' +
                '<td><input id="js-team-name-abbrv' + team.id + '" type="text" name="name_abbrv" value="' + team.detail.attributes.name_abbrv + '"><br></td>' +
                '<td><input id="js-team-city' + team.id + '" type="text" name="city" value="' + team.detail.attributes.city + '"><br></td>' +
                '<td><input id="js-team-country' + team.id + '" type="text" name="country" value="' + team.detail.attributes.country + '"><br></td>' +
                '<td><input id="js-team-division' + team.id + '" type="text" name="division" value="' + team.detail.attributes.division + '"><br></td>' +
                '<td><input id="js-team-uniqueid' + team.id + '" type="text" name="uniqueid" value="' + team.detail.attributes.uniqueid + '"><br></td>' +
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