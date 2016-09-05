var game;
var total_period, selected_period, selected_team;

function retry(ajax, request, error) {
    //http://www.w3schools.com/tags/ref_httpmessages.asp
    if (error == 'Request Timeout') {
        // if (error == 'Not Found') {
        swal({
            title: error,
            text: 'Request Timeout',
            type: "warning",
            allowOutsideClick: false,
            // cancelButtonText: 'Cancel',
            showCancelButton: false,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Retry",
            closeOnConfirm: true
        }, function (isConfirm) {
            if (isConfirm) {
                $.ajax(ajax);
            }
        });
    } else {
        $('#js-loading').hide();
        swal({
            title: request.status.toString(),
            text: error,
            type: "error",
            allowOutsideClick: false,
            // cancelButtonText: 'Cancel',
            showCancelButton: false,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Reload",
            // showConfirmButton: false,
            closeOnConfirm: true
        }, function (isConfirm) {
            if (isConfirm) {
                window.location.reload();
            }
        });
    }
}

$(document).on('change', '.js-period-select', function (e) {
    // e.preventDefault();
    selected_period = $(this).val();
    console.log(selected_period);
    updateStatline();
});

$(document).on('change', '.js-team-select', function (e) {
    // e.preventDefault();
    selected_team = $(this).val();
    updateStatline();
});

function loadGameSetting() {
    $('#js-loading-message').text('Loading...');
    $('#js-loading').show();
    $.ajax({
        type: 'GET',
        url: api_host + '/admin/livestats/games/' + game_id + '/status',
        success: function (data) {
            console.log(data);

            game = data;
            selected_period = -1;
            selected_team = 1;

            total_period = data.detail.livestats_periodnum;

            var period;
            for (period = 1; period <= total_period; period++) {
                $('#js-period-select-list').append(
                    '<div class="radio radio-primary radio-inline">' +
                    '<input type="radio" name="period" id="period' + period + '" class="js-period-select" value="' + period + '">' +
                    '<label for="period' + period + '">P' + period + '</label>' +
                    '</div>'
                );
            }

            $('.js-home-team').each(function () {
                $(this).text(game.home_team);
            });
            $('.js-away-team').each(function () {
                $(this).text(game.away_team);
            });

            if (game.home_logo)
                $('#js-home-logo').attr('src', game.home_logo);
            if (game.away_logo)
                $('#js-away-logo').attr('src', game.away_logo);

            $('#js-loading').hide();
            updateStatline();
        },
        error: function (request, status, error) {
            retry(this, request, error);
        }
    });
}

function updateStatline() {
    $('#js-statline-list').html('');

    var player_data = TAFFY(game.statlines);
    var statlines = player_data().order("jersey").get();

    statlines.forEach(function (player, index) {
        if (!player.inactive) {
            if (player.side == selected_team) {
                if (selected_period != -1) {
                    var statline = null;
                    // if (player.period_stats.length) {
                        var period_stats = TAFFY(player.period_stats);
                        statline = period_stats({period: parseInt(selected_period)}).first();
                    // }
                    // console.log(statline);
                    // if (statline) {
                        addStatline(player, statline);
                    // }
                } else
                    addStatline(player, player);
            }
        }
    });

    // initXEditable();

    game.teamstats.forEach(function (team, index) {
        if (team.side == selected_team) {
            var statline = team;
            if (selected_period != -1) {
                var period_stats = TAFFY(team.period_stats);
                statline = period_stats({period: parseInt(selected_period)}).first();
            }

            // console.log(statline);
            updateTotalStatline(statline);
        }
    });

    $('#js-home-score').text(game.score_home);
    $('#js-away-score').text(game.score_away);
}

function addStatline(player, statline) {
    /*var list = $('#js-away-statline-list');
    if (player.side)
        list = $('#js-home-statline-list');*/

    $('#js-statline-list').append(
        '<tr >' +
            '<td><b>' + player.jersey + '</b></td>' +
            '<td>' + player.name + '</td>' +
            '<td><input type="text" min="0" id="js-seconds' + player.id + '" class="form-control" data-mask="99:99" value="' + moment("2016-01-01").startOf('day').seconds(statline.seconds).format('mm:ss') + '"></td>' +
            '<td><input type="number" min="0" id="js-trey-m' + player.id + '" class="form-control" value="' + statline.trey_m + '"></td>' +
            '<td><input type="number" min="0" id="js-trey-a' + player.id + '" class="form-control" value="' + statline.trey_a + '"></td>' +
            '<td><input type="number" min="0" id="js-two-m' + player.id + '" class="form-control" value="' + statline.two_m + '"></td>' +
            '<td><input type="number" min="0" id="js-two-a' + player.id + '" class="form-control" value="' + statline.two_a + '"></td>' +
            '<td><input type="number" min="0" id="js-ft-m' + player.id + '" class="form-control" value="' + statline.ft_m + '"></td>' +
            '<td><input type="number" min="0" id="js-ft-a' + player.id + '" class="form-control" value="' + statline.ft_a + '"></td>' +
            '<td style="background: #000; color: #fff">' + statline.points + '</td>' +
            '<td><input type="number" min="0" id="js-reb-o' + player.id + '" class="form-control" value="' + statline.reb_o + '"></td>' +
            '<td><input type="number" min="0" id="js-reb-d' + player.id + '" class="form-control" value="' + statline.reb_d + '"></td>' +
            '<td style="background: #000; color: #fff">' + (statline.reb_d + statline.reb_o) + '</td>' +
            '<td><input type="number" min="0" id="js-ast' + player.id + '" class="form-control" value="' + statline.ast + '"></td>' +
            '<td><input type="number" min="0" id="js-stl' + player.id + '" class="form-control" value="' + statline.stl + '"></td>' +
            '<td><input type="number" min="0" id="js-blk' + player.id + '" class="form-control" value="' + statline.blk + '"></td>' +
            '<td><input type="number" min="0" id="js-turnover' + player.id + '" class="form-control" value="' + statline.turnover + '"></td>' +
            '<td><input type="number" min="0" id="js-pfoul' + player.id + '" class="form-control" value="' + statline.pfoul + '"></td>' +
            '<td><button class="js-update-stat btn btn-primary btn-custom" data-id="' + player.id + '">Update</button></td>' +
        '</tr>'
    );

    /*list.append(
        '<tr >' +
            '<td><b>' + player.jersey + '</b></td>' +
            '<td>' + player.name + '</td>' +
            '<td><span class="js-adjust-stat" data-url="' + api_host + '/admin/livestats/games/' + game_id + '/statlines/' + player.id + '/adjust" data-category="seconds">' + statline.seconds + '</span></td>' +
            '<td><span class="js-adjust-stat" data-url="' + api_host + '/admin/livestats/games/' + game_id + '/statlines/' + player.id + '/adjust" data-category="trey_m">' + statline.trey_m + '</span></td>' +
            '<td><span class="js-adjust-stat" data-url="' + api_host + '/admin/livestats/games/' + game_id + '/statlines/' + player.id + '/adjust" data-category="trey_a">' + statline.trey_a + '</span></td>' +
            '<td><span class="js-adjust-stat" data-url="' + api_host + '/admin/livestats/games/' + game_id + '/statlines/' + player.id + '/adjust" data-category="two_m">' + statline.two_m + '</span></td>' +
            '<td><span class="js-adjust-stat" data-url="' + api_host + '/admin/livestats/games/' + game_id + '/statlines/' + player.id + '/adjust" data-category="two_a">' + statline.two_a + '</span></td>' +
            '<td><span class="js-adjust-stat" data-url="' + api_host + '/admin/livestats/games/' + game_id + '/statlines/' + player.id + '/adjust" data-category="ft_m">' + statline.ft_m + '</span></td>' +
            '<td><span class="js-adjust-stat" data-url="' + api_host + '/admin/livestats/games/' + game_id + '/statlines/' + player.id + '/adjust" data-category="ft_a">' + statline.ft_a + '</span></td>' +
            '<td style="background: #000; color: #fff">' + statline.points + '</td>' +
            '<td><span class="js-adjust-stat" data-url="' + api_host + '/admin/livestats/games/' + game_id + '/statlines/' + player.id + '/adjust" data-category="reb_o">' + statline.reb_o + '</span></td>' +
            '<td><span class="js-adjust-stat" data-url="' + api_host + '/admin/livestats/games/' + game_id + '/statlines/' + player.id + '/adjust" data-category="reb_d">' + statline.reb_d + '</span></td>' +
            '<td style="background: #000; color: #fff">' + (statline.reb_d + statline.reb_o) + '</td>' +
            '<td><span class="js-adjust-stat" data-url="' + api_host + '/admin/livestats/games/' + game_id + '/statlines/' + player.id + '/adjust" data-category="ast">' + statline.ast + '</span></td>' +
            '<td><span class="js-adjust-stat" data-url="' + api_host + '/admin/livestats/games/' + game_id + '/statlines/' + player.id + '/adjust" data-category="stl">' + statline.stl + '</span></td>' +
            '<td><span class="js-adjust-stat" data-url="' + api_host + '/admin/livestats/games/' + game_id + '/statlines/' + player.id + '/adjust" data-category="blk">' + statline.blk + '</span></td>' +
            '<td><span class="js-adjust-stat" data-url="' + api_host + '/admin/livestats/games/' + game_id + '/statlines/' + player.id + '/adjust" data-category="turnover">' + statline.turnover + '</span></td>' +
            '<td><span class="js-adjust-stat" data-url="' + api_host + '/admin/livestats/games/' + game_id + '/statlines/' + player.id + '/adjust" data-category="pfoul">' + player.pfoul + '</span></td>' +
        '</tr>'
    );*/
}

function updateTotalStatline(statline) {
    var time = moment("2016-01-01").startOf('day').seconds(statline.seconds).format('hh:mm:ss');
    if (statline.seconds < 3600)
        time = '00:' + moment("2016-01-01").startOf('day').seconds(statline.seconds).format('mm:ss');
    var minute = Math.floor(moment.duration(time).asMinutes());

    $('#js-total-statline').replaceWith(
        '<tr id="js-total-statline">' +
            '<th colspan="2" class="text-center">TOTAL</th>' +
            '<th>' + minute + moment("2016-01-01").startOf('day').seconds(statline.seconds).format(':ss') + '</th>' +
            '<th>' + statline.trey_m + '</th>' +
            '<th>' + statline.trey_a + '</th>' +
            '<th>' + statline.two_m + '</th>' +
            '<th>' + statline.two_a + '</th>' +
            '<th>' + statline.ft_m + '</th>' +
            '<th>' + statline.ft_a + '</th>' +
            '<th>' + statline.points + '</th>' +
            '<th>' + statline.reb_o + '</th>' +
            '<th>' + statline.reb_d + '</th>' +
            '<th>' + (statline.reb_o + statline.reb_d) + '</th>' +
            '<th>' + statline.ast + '</th>' +
            '<th>' + statline.stl + '</th>' +
            '<th>' + statline.blk + '</th>' +
            '<th>' + statline.turnover + '</th>' +
            '<th>' + statline.pfoul + '</th>' +
        '</tr>'
    );
}

loadGameSetting();

$(document).on('click', '.js-update-stat', function (e) {
    e.preventDefault();

    var player_id = $(this).attr('data-id');
    var player_data = TAFFY(game.statlines);
    var player = player_data({id: player_id}).first();

    if (selected_period != -1) {
        // if (player.period_stats.length) {
            var period_stats = TAFFY(player.period_stats);
            player = period_stats({period: parseInt(selected_period)}).first();
        // }
    }

    var formData = {
        period: selected_period,
        adjustments: {
            'seconds': moment.duration("00:" + $('#js-seconds' + player_id).val()).asSeconds() - player.seconds,
            // 'seconds': $('#js-seconds' + player_id).val() - player.seconds,
            'two_m': $('#js-two-m' + player_id).val() - player.two_m,
            'two_a': $('#js-two-a' + player_id).val() - player.two_a,
            'trey_m': ($('#js-trey-m' + player_id).val() - player.trey_m),
            'trey_a': ($('#js-trey-a' + player_id).val() - player.trey_a),
            'ft_m': ($('#js-ft-m' + player_id).val() - player.ft_m),
            'ft_a': ($('#js-ft-a' + player_id).val() - player.ft_a),
            'reb_o': ($('#js-reb-o' + player_id).val() - player.reb_o),
            'reb_d': ($('#js-reb-d' + player_id).val() - player.reb_d),
            'ast': ($('#js-ast' + player_id).val() - player.ast),
            'stl': ($('#js-stl' + player_id).val() - player.stl),
            'blk': ($('#js-blk' + player_id).val() - player.blk),
            'turnover': ($('#js-turnover' + player_id).val() - player.turnover),
            'pfoul': ($('#js-pfoul' + player_id).val() - player.pfoul),
        }
    };
    // console.log(formData);

    $('#js-loading-message').text('Loading...');
    $('#js-loading').show();
    $.ajax({
        type: 'PUT',
        url: api_host + '/admin/livestats/games/' + game_id + '/statlines/' + player_id + '/adjust',
        data: formData,
        success: function (data) {
            $('#js-loading').hide();

            game = data;
            updateStatline();

            toastr.success('Statline is updated');
        },
        error: function (request, status, error) {
            retry(this, request, error);
        }
    });
});

$(document).on('click', '#js-end-game', function (e) {
    e.preventDefault();

    $('#js-loading-message').text('Loading...');
    $('#js-loading').show();

    $.ajax({
        type: 'PUT',
        url: api_host + '/admin/livestats/games/' + game_id + '/end',
        data: null,
        success: function (result) {
            $('#js-loading').hide();

            window.location.href = 'index.html';
        },
        error: function (request, status, error) {
            retry(this, request, error);
        }
    });
});

$(document).on('click', '#js-reset-game', function (e) {
    e.preventDefault();

    $('#js-loading-message').text('Loading...');
    $('#js-loading').show();
    $.ajax({
        type: 'PUT',
        url: api_host + '/admin/livestats/games/' + game_id + '/reset',
        data: null,
        success: function (result) {
            $('#js-loading-message').text('Activating...');
            $.ajax({
                type: 'PUT',
                url: api_host + '/admin/livestats/games/' + game_id + '/activate',
                data: null,
                success: function (result) {
                    $('#js-loading').hide();
                    window.location.href = 'index.html';
                }
            });
        },
        error: function (request, status, error) {
            retry(this, request, error);
        }
    });
});

/*
$(document).on('click', '#js-finalize-period', function (e) {
    e.preventDefault();

    // $('#statlines-modal').modal('hide');

    if (selected_period >= total_period) {
        swal({
            title: 'End Game',
            text: 'Are you sure to end this game?',
            type: "warning",
            allowOutsideClick: false,
            cancelButtonText: 'Play overtime',
            showCancelButton: true,
            cancelButtonColor: "#DD6B55",
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes",
            closeOnConfirm: true
        }, function (isConfirm) {
            if (isConfirm) {
                $('#js-loading-message').text('Loading...');
                $('#js-loading').show();
                //End game
                $.ajax({
                    type: 'PUT',
                    url: api_host + '/admin/livestats/games/' + game_id + '/period_status',
                    data: {
                        period: selected_period,
                        status: 'D'
                    },
                    success: function (result) {
                        $('#js-loading').hide();
                        // window.location.reload();
                        // window.location.href = 'live_stats_end.html';
                        window.location.href = 'live_stats.html';
                    }
                });
            } else {
                endPeriod();
            }
        });
    } else {
        endPeriod();
    }
});

function endPeriod() {
    $('#js-loading-message').text('Loading...');
    $('#js-loading').show();
    $.ajax({
        type: 'PUT',
        url: api_host + '/admin/livestats/games/' + game_id + '/period_status',
        data: {
            period: selected_period,
            status: 'C'
        },
        success: function (result) {
            $('#js-loading').hide();

            window.location.href = 'live_stats.html';
        }
    });
}*/

/*function initXEditable() {
 $('.js-adjust-stat').editable({
 validate: function(value) {
 if ($.trim(value) == '') return 'This value is required.';
 },
 // url: api_host + '/admin/livestats/games/' + game_id + '/instantplays/' + $(this).attr('data-id'),
 ajaxOptions: {
 type: 'PUT'
 },
 send: 'always',
 params: function(params) {  //params already contain `name`, `value` and `pk`
 console.log($($(this)[0]).text());
 // console.log(params);
 var temp = $($(this)[0]);

 var category = temp.attr('data-category');

 var data = {};
 data['period'] = selected_period;
 data['adjustments'] = {};
 data['adjustments'][category] = parseInt(params.value) - parseInt(temp.text());
 console.log(data);

 return data;
 },
 // mode: 'inline',
 // type: 'select',
 // prepend: "not selected",
 }).on('save', function(e, params) {
 console.log(params.response);
 // var play = params.response;
 updateStatline(params.response);
 });
 }*/