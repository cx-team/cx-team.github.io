$.ajax({
    type: 'GET',
    url: api_host + '/dashboard/temp_players?tempteam='  + temp_token,
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
                    '<td>' + (roster.jersey) +'</td>' +
                    '<td>' + (roster.position) +'</td>' +
                    '<td>' + (roster.uniqueid) +'</td>' +
                    '<td>' + (roster.name) +'</td>' +
                    '<td>' + (roster.name_alt) +'</td>' +
                    '<td>' + (roster.classyear) +'</td>' +
                    '<td>' + (roster.height) +'</td>' +
                    '<td>' + (roster.weight) +'</td>' +
                    '<td>' + (roster.birthday) +'</td>' +
                    '<td>' + (roster.city) +'</td>' +
                    '<td>' + (roster.country) +'</td>' +
                    '<td>' +
                        '<button class="js-edit btn-xs btn-primary btn-fill" data-id="' + roster.id + '">EDIT</button>' +
                        '<button class="js-delete btn-xs btn-primary btn-fill" data-id="' + roster.id + '">DELETE</button>' + 
                    '</td>' +

                '</tr>' +
                '<tr id="js-roster-form' + roster.id + '" style="display: none">' +
                    '<td><input id="js-roster-jersey' + roster.id + '" type="text" class="form-control input-sm" name="jersey" maxlength="2" size="2" value = "' + (inputs.hasOwnProperty("jersey") ? roster.jersey : '') + '"></td>' +
                    '<td><input id="js-roster-position' + roster.id + '" type="text" class="form-control input-sm" name="position" maxlength="2" size="2" value = "' + (inputs.hasOwnProperty("position") ? roster.position : '') + '"></td>' +
                    '<td><input id="js-roster-uniqueid' + roster.id + '" type="text" class="form-control input-sm" name="uniqueid" maxlength="12" size="12" value = "' + (inputs.hasOwnProperty("uniqueid") ? roster.uniqueid : '') + '"></td>' +
                    '<td><input id="js-roster-name' + roster.id + '" type="text" class="form-control input-sm" name="name" value = "' + (inputs.hasOwnProperty("name") ? roster.name : '') + '"></td>' +
                    '<td><input id="js-roster-name-alt' + roster.id + '" type="text" class="form-control input-sm" name="name_alt" value = "' + (inputs.hasOwnProperty("name_alt") ? roster.name_alt : '') + '"></td>' +
                    '<td><input id="js-roster-classyear' + roster.id + '" type="text" class="form-control input-sm" name="classyear" maxlength="3" size="3" value = "' + (inputs.hasOwnProperty("classyear") ? roster.classyear : '') + '"></td>' +
                    '<td><input id="js-roster-height' + roster.id + '" type="text" class="form-control input-sm" name="height" maxlength="3" size="3" value = "' + (inputs.hasOwnProperty("height") ? roster.height : '') + '"></td>' +
                    '<td><input id="js-roster-weight' + roster.id + '" type="text" class="form-control input-sm" name="weight" maxlength="3" size="3" value = "' + (inputs.hasOwnProperty("weight") ? roster.weight : '') + '"></td>' +
                    '<td><input id="js-roster-birthday' + roster.id + '" type="text" class="form-control input-sm" name="birthday" value = "' + (inputs.hasOwnProperty("birthday") ? roster.birthday : '') + '"></td>' +
                    '<td><input id="js-roster-city' + roster.id + '" type="text" class="form-control input-sm" name="city" value = "' + (inputs.hasOwnProperty("city") ? roster.city : '') + '"></td>' +
                    '<td><input id="js-roster-country' + roster.id + '" type="text" class="form-control input-sm" name="country" value = "' + (inputs.hasOwnProperty("country") ? roster.country : '') + '"></td>' +
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
        url: api_host + '/dashboard/temp_players/' + id,
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
                '<td>' + roster.jersey +'</td>' +
                '<td>' + roster.position +'</td>' +
                '<td>' + roster.uniqueid +'</td>' +
                '<td>' + roster.name +'</td>' +
                '<td>' + roster.name_alt +'</td>' +
                '<td>' + roster.classyear +'</td>' +
                '<td>' + roster.height +'</td>' +
                '<td>' + roster.weight +'</td>' +
                '<td>' + roster.birthday +'</td>' +
                '<td>' + roster.city +'</td>' +
                '<td>' + roster.country +'</td>' +
                '<td>' +
                    '<button class="js-edit btn-xs btn-primary btn-fill" data-id="' + roster.id + '">EDIT</button>' +
                    '<button class="js-delete btn-xs btn-primary btn-fill" data-id="' + roster.id + '">DELETE</button>' + 
                '</td>' +
                '</tr>'
            );
            ;
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
        url: api_host + '/dashboard/temp_players/' + id,
        success: function (result) {
            $('#js-roster' + id).remove();
            $('#js-roster-form' + id).remove();
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
        url: api_host + '/dashboard/temp_players?tempteam=' + temp_token,
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
                '<td>' + roster.jersey +'</td>' +
                '<td>' + roster.position +'</td>' +
                '<td>' + roster.uniqueid +'</td>' +
                '<td>' + roster.name +'</td>' +
                '<td>' + roster.name_alt +'</td>' +
                '<td>' + roster.classyear +'</td>' +
                '<td>' + roster.height +'</td>' +
                '<td>' + roster.weight +'</td>' +
                '<td>' + roster.birthday +'</td>' +
                '<td>' + roster.city +'</td>' +
                '<td>' + roster.country +'</td>' +
                '<td><button class="js-edit btn-xs btn-primary btn-fill" data-id="' + roster.id + '">EDIT</button></td>' +
                '</tr>' +
                '<tr id="js-roster-form' + roster.id + '" style="display: none">' +
                '<td><input id="js-roster-jersey' + roster.id + '" type="text" class="form-control input-sm" name="jersey" maxlength="2" size="2" value = "' + roster.jersey + '"></td>' +
                '<td>' + $('#js-roster-position').clone().attr('id', 'js-roster-position' + roster.id)[0].outerHTML + '</td>' +
                '<td><input id="js-roster-uniqueid' + roster.id + '" type="text" class="form-control input-sm" name="uniqueid" maxlength="12" size="12" value = "' + roster.uniqueid + '"></td>' +
                '<td><input id="js-roster-name' + roster.id + '" type="text" class="form-control input-sm" name="name" value = "' + roster.name + '"></td>' +
                '<td><input id="js-roster-name-alt' + roster.id + '" type="text" class="form-control input-sm" name="name_alt" value = "' + $('#js-roster-name-alt').val() + '"></td>' +
                '<td><input id="js-roster-classyear' + roster.id + '" type="text" class="form-control input-sm" name="classyear" maxlength="3" size="3" value = "' + roster.classyear + '"></td>' +
                '<td><input id="js-roster-height' + roster.id + '" type="text" class="form-control input-sm" name="height" maxlength="3" size="3" value = "' + roster.height + '"></td>' +
                '<td><input id="js-roster-weight' + roster.id + '" type="text" class="form-control input-sm" name="weight" maxlength="3" size="3" value = "' + roster.weight + '"></td>' +
                '<td><input id="js-roster-birthday' + roster.id + '" type="text" class="form-control input-sm" name="birthday" value = "' + roster.birthday + '"></td>' +
                '<td><input id="js-roster-city' + roster.id + '" type="text" class="form-control input-sm" name="city" value = "' + roster.city + '"></td>' +
                '<td><input id="js-roster-country' + roster.id + '" type="text" class="form-control input-sm" name="country" value = "' + roster.country + '"></td>' +
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