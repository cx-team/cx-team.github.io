$.ajax({
    type: 'GET',
    url: api_host + '/admin/dashboard/' + season_id + '/temp_teams/' + temp_token + '/players',
    success: function (result) {
        console.log(result);
        result.forEach(function(roster){
            var inputs = roster.detail.inputs;
            if ($.isEmptyObject(inputs)) {
                inputs = {
                    jersey: '',
                    position: '',
                    uniqueid: '',
                    name: '',
                    name_alt: '',
                    classyear: '',
                    height: '',
                    weight: '',
                    birthday: '',
                    city: '',
                    country: '',
                }
            }

            $('#js-roster-list').append(
                '<tr id="js-roster' + roster.id + '">' +
                    '<td>' + (inputs.hasOwnProperty("jersey") ? inputs.jersey : '') +'</td>' +
                    '<td>' + (inputs.hasOwnProperty("position") ? inputs.position : '') +'</td>' +
                    '<td>' + (inputs.hasOwnProperty("uniqueid") ? inputs.uniqueid : '') +'</td>' +
                    '<td>' + (inputs.hasOwnProperty("name") ? inputs.name : '') +'</td>' +
                    '<td>' + (inputs.hasOwnProperty("name_alt") ? inputs.name_alt : '') +'</td>' +
                    '<td>' + (inputs.hasOwnProperty("classyear") ? inputs.classyear : '') +'</td>' +
                    '<td>' + (inputs.hasOwnProperty("height") ? inputs.height : '') +'</td>' +
                    '<td>' + (inputs.hasOwnProperty("weight") ? inputs.weight : '') +'</td>' +
                    '<td>' + (inputs.hasOwnProperty("birthday") ? inputs.birthday : '') +'</td>' +
                    '<td>' + (inputs.hasOwnProperty("city") ? inputs.city : '') +'</td>' +
                    '<td>' + (inputs.hasOwnProperty("country") ? inputs.country : '') +'</td>' +
                    '<td><button class="js-edit btn-xs btn-primary btn-fill" data-id="' + roster.id + '">EDIT</button></td>' +
                '</tr>' +
                '<tr id="js-roster-form' + roster.id + '" style="display: none">' +
                    '<td><input id="js-roster-jersey' + roster.id + '" type="text" name="jersey" maxlength="2" size="2" value = "' + (inputs.hasOwnProperty("jersey") ? inputs.jersey : '') + '"><br></td>' +
                    '<td><input id="js-roster-position' + roster.id + '" type="text" name="position" maxlength="2" size="2" value = "' + (inputs.hasOwnProperty("position") ? inputs.position : '') + '"><br></td>' +
                    '<td><input id="js-roster-uniqueid' + roster.id + '" type="text" name="uniqueid" maxlength="12" size="12" value = "' + (inputs.hasOwnProperty("uniqueid") ? inputs.uniqueid : '') + '"><br></td>' +
                    '<td><input id="js-roster-name' + roster.id + '" type="text" name="name" value = "' + (inputs.hasOwnProperty("name") ? inputs.name : '') + '"><br></td>' +
                    '<td><input id="js-roster-name-alt' + roster.id + '" type="text" name="name_alt" value = "' + (inputs.hasOwnProperty("name_alt") ? inputs.name_alt : '') + '"><br></td>' +
                    '<td><input id="js-roster-classyear' + roster.id + '" type="text" name="classyear" maxlength="3" size="3" value = "' + (inputs.hasOwnProperty("classyear") ? inputs.classyear : '') + '"><br></td>' +
                    '<td><input id="js-roster-height' + roster.id + '" type="text" name="height" maxlength="3" size="3" value = "' + (inputs.hasOwnProperty("height") ? inputs.height : '') + '"><br></td>' +
                    '<td><input id="js-roster-weight' + roster.id + '" type="text" name="weight" maxlength="3" size="3" value = "' + (inputs.hasOwnProperty("weight") ? inputs.weight : '') + '"><br></td>' +
                    '<td><input id="js-roster-birthday' + roster.id + '" type="text" name="birthday" value = "' + (inputs.hasOwnProperty("birthday") ? inputs.birthday : '') + '"><br></td>' +
                    '<td><input id="js-roster-city' + roster.id + '" type="text" name="city" value = "' + (inputs.hasOwnProperty("city") ? inputs.city : '') + '"><br></td>' +
                    '<td><input id="js-roster-country' + roster.id + '" type="text" name="country" value = "' + (inputs.hasOwnProperty("country") ? inputs.country : '') + '"><br></td>' +
                    '<td><button class="js-update btn-xs btn-success btn-fill" data-id="' + roster.id + '">SAVE</button></td>' +
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
    $('#js-roster' + id).hide();
    $('#js-roster-form' + id).show();
});

$(document).on('click', '.js-update', function (e) {
    e.preventDefault();

    var id = $(this).attr('data-id');
    var data = {
        model: 'Roster',
        inputs: {
            jersey: $('#js-roster-jersey' + id).val(),
            position: $('#js-roster-position' + id).val(),
            uniqueid: $('#js-roster-uniqueid' + id).val(),
            name: $('#js-roster-name' + id).val(),
            name_alt: $('#js-roster-name-alt' + id).val(),
            classyear: $('#js-roster-classyear' + id).val(),
            height: $('#js-roster-height' + id).val(),
            weight: $('#js-roster-weight' + id).val(),
            birthday: $('#js-roster-birthday' + id).val(),
            city: $('#js-roster-city' + id).val(),
            country: $('#js-roster-country' + id).val(),
        },
    }

    $.ajax({
        type: 'PUT',
        url: api_host + '/admin/dashboard/' + season_id + '/temp_teams/' + temp_token + '/players/' + id,
        data: data,
        success: function (result) {
            var roster = {
                detail: {
                    inputs: {
                        jersey: $('#js-roster-jersey' + id).val(),
                        position: $('#js-roster-position' + id).val(),
                        uniqueid: $('#js-roster-uniqueid' + id).val(),
                        name: $('#js-roster-name' + id).val(),
                        name_alt: $('#js-roster-name-alt' + id).val(),
                        classyear: $('#js-roster-classyear' + id).val(),
                        height: $('#js-roster-height' + id).val(),
                        weight: $('#js-roster-weight' + id).val(),
                        birthday: $('#js-roster-birthday' + id).val(),
                        city: $('#js-roster-city' + id).val(),
                        country: $('#js-roster-country' + id).val(),
                    }
                }
            }
            //                $('#js-loading').hide();
            $('#js-roster-form' + id).hide();
            $('#js-roster' + id).replaceWith(
                '<tr id="js-roster' + roster.id + '">' +
                '<td>' + roster.detail.inputs.jersey +'</td>' +
                '<td>' + roster.detail.inputs.position +'</td>' +
                '<td>' + roster.detail.inputs.uniqueid +'</td>' +
                '<td>' + roster.detail.inputs.name +'</td>' +
                '<td>' + roster.detail.inputs.name_alt +'</td>' +
                '<td>' + roster.detail.inputs.classyear +'</td>' +
                '<td>' + roster.detail.inputs.height +'</td>' +
                '<td>' + roster.detail.inputs.weight +'</td>' +
                '<td>' + roster.detail.inputs.birthday +'</td>' +
                '<td>' + roster.detail.inputs.city +'</td>' +
                '<td>' + roster.detail.inputs.country +'</td>' +
                '<td><button class="js-edit btn-xs btn-primary btn-fill" data-id="' + roster.id + '">EDIT</button></td>' +
                '</tr>'
            );
            ;
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
        model: 'Roster',
        inputs: {
            jersey: $('#js-roster-jersey').val(),
            position: $('#js-roster-position').val(),
            uniqueid: $('#js-roster-uniqueid').val(),
            name: $('#js-roster-name').val(),
            name_alt: $('#js-roster-name-alt').val(),
            classyear: $('#js-roster-classyear').val(),
            height: $('#js-roster-height').val(),
            weight: $('#js-roster-weight').val(),
            birthday: $('#js-roster-birthday').val(),
            city: $('#js-roster-city').val(),
            country: $('#js-roster-country').val(),
        },
    }

    var select =
    $.ajax({
        type: 'POST',
        url: api_host + '/admin/dashboard/' + season_id + '/temp_teams/' + temp_token + '/players',
        data: data,
        success: function (result) {
            var roster = {
                detail: {
                    inputs: {
                        jersey: $('#js-roster-jersey').val(),
                        position: $('#js-roster-position').val(),
                        uniqueid: $('#js-roster-uniqueid').val(),
                        name: $('#js-roster-name').val(),
                        name_alt: $('#js-roster-name-alt').val(),
                        classyear: $('#js-roster-classyear').val(),
                        height: $('#js-roster-height').val(),
                        weight: $('#js-roster-weight').val(),
                        birthday: $('#js-roster-birthday').val(),
                        city: $('#js-roster-city').val(),
                        country: $('#js-roster-country').val(),
                    }
                }
            }
            // console.log(roster);
            //                $('#js-loading').hide();
            $('#js-roster-list').append(
                '<tr id="js-roster' + roster.id + '">' +
                '<td>' + roster.detail.inputs.jersey +'</td>' +
                '<td>' + roster.detail.inputs.position +'</td>' +
                '<td>' + roster.detail.inputs.uniqueid +'</td>' +
                '<td>' + roster.detail.inputs.name +'</td>' +
                '<td>' + roster.detail.inputs.name_alt +'</td>' +
                '<td>' + roster.detail.inputs.classyear +'</td>' +
                '<td>' + roster.detail.inputs.height +'</td>' +
                '<td>' + roster.detail.inputs.weight +'</td>' +
                '<td>' + roster.detail.inputs.birthday +'</td>' +
                '<td>' + roster.detail.inputs.city +'</td>' +
                '<td>' + roster.detail.inputs.country +'</td>' +
                '<td><button class="js-edit btn-xs btn-primary btn-fill" data-id="' + roster.id + '">EDIT</button></td>' +
                '</tr>' +
                '<tr id="js-roster-form' + roster.id + '" style="display: none">' +
                '<td><input id="js-roster-jersey' + roster.id + '" type="text" name="jersey" maxlength="2" size="2" value = "' + roster.detail.inputs.jersey + '"><br></td>' +
                '<td>' + $('#js-roster-position').clone().attr('id', 'js-roster-position' + roster.id)[0].outerHTML + '</td>' +
                '<td><input id="js-roster-uniqueid' + roster.id + '" type="text" name="uniqueid" maxlength="12" size="12" value = "' + roster.detail.inputs.uniqueid + '"><br></td>' +
                '<td><input id="js-roster-name' + roster.id + '" type="text" name="name" value = "' + roster.detail.inputs.name + '"><br></td>' +
                '<td><input id="js-roster-name-alt' + roster.id + '" type="text" name="name_alt" value = "' + $('#js-roster-name-alt').val() + '"><br></td>' +
                '<td><input id="js-roster-classyear' + roster.id + '" type="text" name="classyear" maxlength="3" size="3" value = "' + roster.detail.inputs.classyear + '"><br></td>' +
                '<td><input id="js-roster-height' + roster.id + '" type="text" name="height" maxlength="3" size="3" value = "' + roster.detail.inputs.height + '"><br></td>' +
                '<td><input id="js-roster-weight' + roster.id + '" type="text" name="weight" maxlength="3" size="3" value = "' + roster.detail.inputs.weight + '"><br></td>' +
                '<td><input id="js-roster-birthday' + roster.id + '" type="text" name="birthday" value = "' + roster.detail.inputs.birthday + '"><br></td>' +
                '<td><input id="js-roster-city' + roster.id + '" type="text" name="city" value = "' + roster.detail.inputs.city + '"><br></td>' +
                '<td><input id="js-roster-country' + roster.id + '" type="text" name="country" value = "' + roster.detail.inputs.country + '"><br></td>' +
                '<td><button class="js-update btn-xs btn-success btn-fill" data-id="' + roster.id + '">SAVE</button></td>' +
                '</tr>'
            );

            $('#js-roster-jersey').val('');
            $('#js-roster-jerpositionsey').val('');
            $('#js-roster-uniqueid').val('');
            $('#js-roster-name').val('');
            $('#js-roster-name-alt').val('');
            $('#js-roster-classyear').val('');
            $('#js-roster-height').val('');
            $('#js-roster-weight').val('');
            $('#js-roster-birthday').val('');
            $('#js-roster-city').val('');
            $('#js-roster-country').val('');
        },
        error: function (request, status, error) {
            //retry(this, request, error);
        }
    });
});