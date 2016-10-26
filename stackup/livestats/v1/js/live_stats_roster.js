var home_team, away_team;
var player_data;

function loadGameSetting() {
    $('#js-loading-message').text('Loading...');
    $('#js-loading').show();

    $.get(api_host + '/admin/livestats/games/' + game_id + '/status', function (data, status) {
        $('#js-loading').hide();

        $('.js-home-team').each(function () {
            home_team = data.home_team;
            $(this).text(data.home_team);
        });
        $('.js-away-team').each(function () {
            away_team = data.away_team;
            $(this).text(data.away_team);
        });
        
        loadTeamPlayer(data.statlines);
    });
}

function addPlayer(list, player) {
    // if (player.roster)
    //     list.append(
    //         '<tr id="js-player' + player.id + '">' +
    //             '<td>' + player.name + '</td>' +
    //             '<td>#' + player.jersey + '</td>' +
    //             '<td>' + player.position + '</td>' +
    //             '<td class="text-right">' +
    //                 '<button class="js-show-update-player-modal btn btn-warning" data-id="' + player.id + '">Edit</button>' +
    //             '</td>' +
    //         '</tr>'
    //     );
    // else

    var checkbox = '<input type="checkbox" id="player' + player.id + '" class="js-deactivate-player" checked data-id="' + player.id + '">';
    if (player.inactive)
        checkbox = '<input type="checkbox" id="player' + player.id + '" class="js-activate-player" data-id="' + player.id + '">';
    list.append(
        '<tr id="js-player' + player.id + '">' +
            '<td>' + player.name + ' / ' + player.name_alt + '</td>' +
            '<td>#' + player.jersey + '</td>' +
            '<td>' + player.position + '</td>' +
            '<td class="">' +
                '<div class="checkbox checkbox-primary">' +
                    checkbox +
                    '<label for="player' + player.id + '">Activate</label>' +
                '</div>' +
            '</td>' +
            '<td class="text-center">' +
                '<button class="js-show-update-player-modal btn btn-white" data-id="' + player.id + '">Edit</button>' +
            '</td>' +
        '</tr>'
    );
}

function loadTeamPlayer(data) {
    player_data = TAFFY(data);
    data.forEach(function (player, index) {
        if (player.side) {
            addPlayer($('#js-home-player-list'), player);
        } else {
            addPlayer($('#js-away-player-list'), player);
        }
    });
}

loadGameSetting();


$(document).on('click', '.js-show-add-player-modal', function (e) {
    e.preventDefault();

    $('#add-player-modal').modal();
});

$(document).on('click', '.js-show-update-player-modal', function (e) {
    e.preventDefault();

    var player_id = $(this).attr('data-id');
    var player = player_data({id: player_id}).first();

    if (player.roster)
        $('#js-player-name-div').hide();
    else
        $('#js-player-name-div').show();

    $('#js-player-name').val(player.name);
    $('#js-player-jersey').val(player.jersey);
    $('#js-player-position').val(player.position);

    $('#js-update-player').attr('data-id', player_id);
    $('#update-player-modal').modal();
});

$(document).on('click', '#js-add-player', function (e) {
    e.preventDefault();

    if ($('#js-add-player-form').parsley().validate()) {
        $('#add-player-modal').modal('hide');

        var formData = $('#js-add-player-form').serialize();
        $('#js-loading-message').text('Loading...');
        $('#js-loading').show();
        $.ajax({
            type: 'POST',
            url: api_host + '/admin/livestats/games/' + game_id + '/statlines',
            data: formData,
            success: function (player) {
                $('#js-loading').hide();
                if (player.side) {
                    addPlayer($('#js-home-player-list'), player);
                } else {
                    addPlayer($('#js-away-player-list'), player);
                }

                player_data.insert(player);

                toastr.success('Player is added!')
            },
            error: function (request, status, error) {
                console.log(status);
                console.log(request.responseText);
                console.log(error);
            }
        });
    }
});

$(document).on('click', '#js-update-player', function (e) {
    e.preventDefault();

    var temp = $(this);
    if ($('#js-update-player-form').parsley().validate()) {
        $('#update-player-modal').modal('hide');
        var player_id = temp.attr('data-id');

        var formData = $('#js-update-player-form').serialize();
        $('#js-loading-message').text('Loading...');
        $('#js-loading').show();
        $.ajax({
            type: 'PUT',
            url: api_host + '/admin/livestats/games/' + game_id + '/statlines/' + player_id,
            data: formData,
            success: function (player) {
                $('#js-loading').hide();

                var checkbox = '<input type="checkbox" id="player' + player.id + '" class="js-deactivate-player" checked data-id="' + player.id + '">';
                if (player.inactive)
                    checkbox = '<input type="checkbox" id="player' + player.id + '" class="js-activate-player" data-id="' + player.id + '">';
                $('#js-player' + player.id).replaceWith(
                    '<tr id="js-player' + player.id + '">' +
                        '<td>' + player.name + ' / ' + player.name_alt + '</td>' +
                        '<td>#' + player.jersey + '</td>' +
                        '<td>' + player.position + '</td>' +
                        '<td class="">' +
                            '<div class="checkbox checkbox-primary">' +
                                checkbox +
                                '<label for="player' + player.id + '">Activate</label>' +
                            '</div>' +
                        '</td>' +
                        '<td class="text-center">' +
                            '<button class="js-show-update-player-modal btn btn-white" data-id="' + player.id + '">Edit</button>' +
                        '</td>' +
                    '</tr>'
                );

                player_data({id: player.id}).update({
                    name: player.name,
                    jersey: player.jersey,
                    position: player.position,
                });

                toastr.success('Player is updated!')
            },
            error: function (request, status, error) {
                console.log(status);
                console.log(request.responseText);
                console.log(error);
            }
        });
    }
});

$(document).on('click', '.js-deactivate-player', function (e) {
    e.preventDefault();

    var player_id = $(this).attr('data-id');
    /*swal({
        title: 'Warning',
        text: 'Are you sure you want to deactivate this player?',
        type: "warning",
        allowOutsideClick: true,
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes",
        closeOnConfirm: true
    }, function(isConfirm){
        if (isConfirm) {*/
            $('#js-loading-message').text('Loading...');
            $('#js-loading').show();
            $.ajax({
                type: 'PUT',
                data: {
                    status: 'deactivate'
                },
                url: api_host + '/admin/livestats/games/' + game_id + '/statlines/' + player_id + '/status',
                success: function (result) {
                    $('#js-loading').hide();

                    player_data({id: player_id}).update({
                        inactive: false
                    });

                    var player = player_data({id: player_id}).first();
                    $('#js-player' + player.id).replaceWith(
                        '<tr id="js-player' + player.id + '">' +
                            '<td>' + player.name + ' / ' + player.name_alt + '</td>' +
                            '<td>#' + player.jersey + '</td>' +
                            '<td>' + player.position + '</td>' +
                            '<td class="">' +
                                '<div class="checkbox checkbox-primary">' +
                                    '<input type="checkbox" id="player' + player.id + '" class="js-activate-player" data-id="' + player.id + '">' +
                                    '<label for="player' + player.id + '">Activate</label>' +
                                '</div>' +
                            '</td>' +
                            '<td class="text-center">' +
                                '<button class="js-show-update-player-modal btn btn-white" data-id="' + player.id + '">Edit</button>' +
                            '</td>' +
                        '</tr>'
                    );

                    toastr.success('Player is deactivated');
                }
            });
        /*}
    });*/
});


$(document).on('click', '.js-activate-player', function (e) {
    e.preventDefault();

    var player_id = $(this).attr('data-id');
    /*swal({
        title: 'Warning',
        text: 'Are you sure you want to activate this player?',
        type: "warning",
        allowOutsideClick: true,
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes",
        closeOnConfirm: true
    }, function(isConfirm){
        if (isConfirm) {*/
            $('#js-loading-message').text('Loading...');
            $('#js-loading').show();
            $.ajax({
                type: 'PUT',
                data: {
                    status: 'reactivate'
                },
                url: api_host + '/admin/livestats/games/' + game_id + '/statlines/' + player_id + '/status',
                success: function (result) {
                    $('#js-loading').hide();

                    player_data({id: player_id}).update({
                        inactive: true
                    });

                    var player = player_data({id: player_id}).first();
                    $('#js-player' + player.id).replaceWith(
                        '<tr id="js-player' + player.id + '">' +
                            '<td>' + player.name + ' / ' + player.name_alt + '</td>' +
                            '<td>#' + player.jersey + '</td>' +
                            '<td>' + player.position + '</td>' +
                            '<td class="">' +
                                '<div class="checkbox checkbox-primary">' +
                                    '<input type="checkbox" id="player' + player.id + '" class="js-deactivate-player" checked data-id="' + player.id + '">' +
                                    '<label for="player' + player.id + '">Activate</label>' +
                                '</div>' +
                            '</td>' +
                            '<td class="text-center">' +
                                '<button class="js-show-update-player-modal btn btn-white" data-id="' + player.id + '">Edit</button>' +
                            '</td>' +
                        '</tr>'
                    );

                    toastr.success('Player is activated');
                }
            });
        /*}
    });*/
});