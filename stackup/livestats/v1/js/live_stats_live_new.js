var total_period;
var enable_gameclock;
var selectedPlayer = null;
var home_team, away_team;
var home_score, away_score;

// var $clock = $('#js-clock');
var period_time, ot_time;
var pauseDate;
var last_time_input;
//    var time_per_period = 12 * 60;        // 12 minutes
// var time_per_period = 10;   //10s => for testing
var player_data;
var home_active_player_ids = [],
    home_inactive_player_ids = [],
    away_active_player_ids = [],
    away_inactive_player_ids = [];
var cur_period, cur_period_status;
// var posX, posY;

const STAT_CATEGORY_FT_M = 'ft_m';
const STAT_CATEGORY_FT_A = 'ft_a';
const STAT_CATEGORY_TWO_M = 'two_m';
const STAT_CATEGORY_TWO_A = 'two_a';
const STAT_CATEGORY_TREY_M = 'trey_m';
const STAT_CATEGORY_TREY_A = 'trey_a';
const STAT_CATEGORY_REB_O = 'reb_o';
const STAT_CATEGORY_REB_D = 'reb_d';
const STAT_CATEGORY_AST = 'ast';
const STAT_CATEGORY_BLK = 'blk';
const STAT_CATEGORY_STL = 'stl';
const STAT_CATEGORY_TURNOVER = 'turnover';
const STAT_CATEGORY_PFOUL = 'pfoul';

// $('.timepicker').datetimepicker({
//     format: 'mm:ss',
// });

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
        /*this.tryCount++;
         if (this.tryCount <= this.retryLimit) {
         $.ajax(this);
         return;
         }
         return;*/
    } else {
        /*$('#js-loading').hide();
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
        });*/
    }
}

function loadGameSetting() {
    $('#js-loading-message').text('Loading...');
    $('#js-loading').show();
    $.ajax({
        type: 'GET',
        url: api_host + '/admin/livestats/games/' + game_id + '/status',
        success: function (data) {
            console.log(data);

            $('.js-home-team').each(function () {
                home_team = data.home_team;
                $(this).text(data.home_team);
            });
            $('.js-away-team').each(function () {
                away_team = data.away_team;
                $(this).text(data.away_team);
            });

            // if (data.home_logo)
            //    $('#js-home-logo').attr('src', data.home_logo);
            // if (data.away_logo)
            //    $('#js-away-logo').attr('src', data.away_logo);

            // console.log($.isEmptyObject(data.detail));
            if ($.isEmptyObject(data.detail)) {
                swal({
                    title: 'Activate',
                    text: 'Live stats is not activated!',
                    type: "warning",
                    allowOutsideClick: false,
                    cancelButtonText: 'Return to Home Page',
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Activate it!",
                    closeOnConfirm: true
                }, function (isConfirm) {
                    if (isConfirm) {
                        $.ajax({
                            type: 'PUT',
                            url: api_host + '/admin/livestats/games/' + game_id + '/activate',
                            data: null,
                            success: function (result) {
                                // window.location.reload();
                                window.location.href = 'live_stats_setting.html';
                            },
                            error: function (request, status, error) {
                                retry(this, request, error);
                            }
                        });
                    } else {
                        window.location.href = 'index.html';
                    }
                });

            } else {
                enable_gameclock = data.detail.livestats_gameclock;
                total_period = data.detail.livestats_periodnum;
                cur_period = data.detail.livestats_currentperiod;
                cur_period_status = data.detail.livestats_currentperiodstatus;
                period_time = data.detail.livestats_periodtime;
                ot_time = data.detail.livestats_otperiodtime;

                $('#js-show-timeout-modal').attr('disabled', 'disabled');

                if (cur_period == 0 || cur_period_status == 'B')
                    cur_period++;

                if (cur_period_status == 'B' && cur_period > total_period) {
                    $('.js-period').each(function () {
                        $(this).text('OT | P' + cur_period);
                    });
                } else {
                    $('.js-period').each(function () {
                        $(this).text('P' + cur_period);
                        if (cur_period_status == 'A')
                            $(this).attr('style', 'color: #81c868');
                    });
                }

                home_score = data.score_home;
                away_score = data.score_away;
                $('#js-home-score').text(home_score);
                $('#js-away-score').text(away_score);

                var temp = $('#js-start-period2');
                temp.text('START PERIOD');

                /*if ((cur_period == 1 && cur_period_status == 'Z') || cur_period_status == 'B')
                    $('#js-remaining-time-div').hide();*/
                if (cur_period_status == 'B')
                    $('#js-remaining-time-div').hide();

                if (cur_period >= total_period) {
                    $('#js-next-period2').text('END GAME');
                }

                //todo: check period is running
                if (enable_gameclock) {
                    $('#js-game-clock-enable').show();
                    $('#js-game-clock-disable').remove();
                } else {
                    $('#js-game-clock-enable').remove();
                    //$('#js-game-clock-disable').show();
                    $('#js-show-change-player-modal').removeAttr('disabled');
                }

                if (cur_period_status == 'Z')
                    loadPlayerAndScore(data);
                else if (cur_period_status == 'A') {
                    temp.attr('id', 'js-next-period2');
                    temp.removeClass('btn-primary');
                    temp.addClass('btn-danger');
                    if (cur_period == total_period)
                        temp.text('END GAME');
                    else
                        temp.text('END PERIOD');

                    $('#js-show-timeout-modal').removeAttr('disabled');

                    loadPlayerAndScore(data);
                } /*else if (cur_period_status == 'B') {
                    $('#js-loading').hide();

                    window.location.href = "live_stats_adjust.html";
                    // updateStatline(data);
                    //
                    // $('#statlines-modal').modal({
                    //     backdrop: 'static',
                    //     keyboard: false
                    // });
                } else*/ if (cur_period_status == 'B') {
                    if (cur_period > total_period) {    //Tie game
                        swal({
                            title: 'Play overtime',
                            text: 'Do you want to play overtime?',
                            type: "warning",
                            allowOutsideClick: false,
                            cancelButtonText: 'End Game',
                            showCancelButton: true,
                            cancelButtonColor: "#DD6B55",
                            confirmButtonColor: "#DD6B55",
                            confirmButtonText: "Yes",
                            closeOnConfirm: true
                        }, function (isConfirm) {
                            if (!isConfirm) {
                                //End game
                                $.ajax({
                                    type: 'PUT',
                                    url: api_host + '/admin/livestats/games/' + game_id + '/period_status',
                                    data: {
                                        period: cur_period,
                                        status: 'D'
                                    },
                                    success: function (result) {
                                        $('#js-loading').hide();
                                        window.location.reload();
                                        // window.location.href = 'live_stats_end.html';
                                    },
                                    error: function (request, status, error) {
                                        retry(this, request, error);
                                    }
                                });
                            } else {
                                loadPlayerAndScore(data);
                            }
                        });
                    } else
                        loadPlayerAndScore(data);
                } else if (cur_period_status == 'D') {
                    temp.attr('disabled', 'disabled');
                    $('#js-show-change-player-modal').attr('disabled', 'disabled');

                    $('.js-submit-instant-play').each(function () {
                        $(this).attr('disabled', 'disabled');
                    });

                    $('.js-submit-score').each(function () {
                        $(this).attr('disabled', 'disabled');
                    });

                    $('#js-loading').hide();
                    $('#js-screen5').show();
                    if (!data.detail.livestats_gameend)
                        swal('This game is ended!');
                    else
                        swal('This game is ended!');
                }
            }
        },
        // tryCount : 0,
        // retryLimit : 3,
        error: function (request, status, error) {
            // console.log(status);
            // console.log(error);
            // console.log(request.status);    //http code
            retry(this, request, error);
        }
    });
}

function loadPlayerAndScore(data) {
    player_data = TAFFY(data.statlines);
    var statlines = player_data().order("jersey").get();
    var count = 0;
    statlines.forEach(function (player, index) {
        if (!player.inactive) {
            if (player.side) {
                if (player.active) {
                    count++;
                    home_active_player_ids.push(player.id);
                    addActivePlayer($('#js-home-player-list'), player);
                    addScore($('#js-home-active-score-list'), player);
                    /*$('#js-home-player-select').append(
                     '<option value="' + player.id + '" selected>' + player.name + ' #' + player.jersey + ' ' + player.position + '</option>'
                     );*/
                } else {
                    home_inactive_player_ids.push(player.id);
                    addScore($('#js-home-inactive-score-list'), player);
                }
            } else {
                if (player.active) {
                    away_active_player_ids.push(player.id);
                    addActivePlayer($('#js-away-player-list'), player);
                    addScore($('#js-away-active-score-list'), player);
                } else {
                    away_inactive_player_ids.push(player.id);
                    addScore($('#js-away-inactive-score-list'), player);
                }
            }
        }
    });

    console.log(home_active_player_ids)
    console.log(away_active_player_ids)

    updatePlayerList();

    data.teamstats.forEach(function (team, index) {
        if (team.side)
            updateTotalScore(team);
        else
            updateTotalScore(team);
    });

    if (cur_period_status == 'Z' || cur_period_status == 'B') {
        $('.js-submit-instant-play').each(function() {
            $(this).attr('disabled', 'disabled');
        });

        $('.js-submit-score').each(function() {
            $(this).attr('disabled', 'disabled');
        });

        $('.js-select-player').each(function() {
            $(this).attr('disabled', 'disabled');
        });
    }

    $('#js-change-player').attr('disabled', 'disabled');

    if (count < 5 && cur_period_status != 'D') {
        // console.log(period_time);
        var time_text = moment("2016-01-01").startOf('day').seconds(period_time).format('mm:ss');
        $('#js-remaining-time').val(time_text);

        $('#js-change-player-title').text('SELECT STARTERS - PERIOD ' + cur_period);
        $('#change-player-modal').modal({
            backdrop: 'static',
            keyboard: false
        });
    }

    loadInstantPlay();
}

function loadInstantPlay() {
    // $('#js-loading-message').text('Loading...');
    $.ajax({
        type: 'GET',
        url: api_host + '/admin/livestats/games/' + game_id + '/instantplays?mode=gamelog&period=' + cur_period,
        success: function (data) {
            // console.log(data);
            data.reverse();
            data.forEach(function (play, index) {
                var style = '';
                if (!play.player_name)
                    style = 'style="background-color: rgba(240, 80, 80, 0.2)"';

                if (cur_period_status != 'B')
                    if (play.player_name)
                        if (play.side)
                            addInstantPlay($('#js-home-instant-play-list'), play, 'home');
                        else
                            addInstantPlay($('#js-away-instant-play-list'), play, 'away');
                    else {
                        addInstantPlay(null, play, 'pending');
                    }

                // addInstantPlay($('#js-all-instant-play-list'), play, 'all');
            });

            if (cur_period_status != 'B')
                initXEditable();

            $('#js-loading').hide();
        },
        error: function (request, status, error) {
            retry(this, request, error);
        }
    });
}

function addActivePlayer(select, player) {
    select.append(
    '<tr><td>' +
        '<button class="js-select-player" data-id="' + player.id + '">' +
            //'<img src="https://cx-team.github.io/stackup/share/image/player.png">' +
            '<p><span class="jersey">' + ' #' + player.jersey + '</span><br><strong>' + player.name + '</strong></p>' +
            '<i class="fa fa-info-circle"></i>' +
        '</button>' +
    '</td></tr>');
}

function addScore(list, player) {
    list.append(
        '<tr id="js-score' + player.id + '">' +
            '<td>' + player.jersey + '</td>' +
            '<td>' + player.name + '</td>' +
            '<td>' + player.position + '</td>' +
            '<td>' + moment("2016-01-01").startOf('day').seconds(player.seconds).format('mm:ss') + '</td>' +
            '<td>' + player.two_m + ' - ' + (player.two_m + player.two_a) + '</td>' +
            '<td>' + player.trey_m + ' - ' + (player.trey_m + player.trey_a) + '</td>' +
            '<td>' + player.ft_m + ' - ' + (player.ft_m + player.ft_a) + '</td>' +
            '<td>' + player.reb_o + '</td>' +
            '<td>' + player.reb_d + '</td>' +
            '<td>' + player.ast + '</td>' +
            '<td>' + player.stl + '</td>' +
            '<td>' + player.blk + '</td>' +
            '<td>' + player.turnover + '</td>' +
            '<td>' + player.pfoul + '</td>' +
            '<td>' + player.points + '</td>' +
        '</tr>'
    );
}

function updateTotalScore(team) {
    var time = moment("2016-01-01").startOf('day').seconds(team.seconds).format('hh:mm:ss');
    if (team.seconds < 3600)
        time = '00:' + moment("2016-01-01").startOf('day').seconds(team.seconds).format('mm:ss');
    var minute = Math.floor(moment.duration(time).asMinutes());

    var id = team.side ? 'js-home-total-score' : 'js-away-total-score';
    $('#' + id).replaceWith(
        '<tr id="' + id + '">' +
            '<th colspan="3" class="text-center">TOTAL</th>' +
            '<th>' + minute + moment("2016-01-01").startOf('day').seconds(team.seconds).format(':ss') + '</th>' +
            '<th>' + team.two_m + ' - ' + (team.two_m + team.two_a) + '</th>' +
            '<th>' + team.trey_m + ' - ' + (team.trey_m + team.trey_a) + '</th>' +
            '<th>' + team.ft_m + ' - ' + (team.ft_m + team.ft_a) + '</th>' +
            '<th>' + team.reb_o + '</th>' +
            '<th>' + team.reb_d + '</th>' +
            '<th>' + team.ast + '</th>' +
            '<th>' + team.stl + '</th>' +
            '<th>' + team.blk + '</th>' +
            '<th>' + team.turnover + '</th>' +
            '<th>' + team.pfoul + '</th>' +
            '<th>' + team.points + '</th>' +
        '</tr>'
    );
}

function updateTotalStatline(id, statline) {
    var time = moment("2016-01-01").startOf('day').seconds(statline.seconds).format('hh:mm:ss');
    if (statline.seconds < 3600)
        time = '00:' + moment("2016-01-01").startOf('day').seconds(statline.seconds).format('mm:ss');
    var minute = Math.floor(moment.duration(time).asMinutes());

    $('#' + id).replaceWith(
        '<tr id="' + id + '">' +
        '<th colspan="3" class="text-center">TOTAL</th>' +
        '<th>' + minute + moment("2016-01-01").startOf('day').seconds(statline.seconds).format(':ss') + '</th>' +
        '<th>' + statline.two_m + ' - ' + (statline.two_m + statline.two_a) + '</th>' +
        '<th>' + statline.trey_m + ' - ' + (statline.trey_m + statline.trey_a) + '</th>' +
        '<th>' + statline.ft_m + ' - ' + (statline.ft_m + statline.ft_a) + '</th>' +
        '<th>' + statline.reb_o + '</th>' +
        '<th>' + statline.reb_d + '</th>' +
        '<th>' + statline.ast + '</th>' +
        '<th>' + statline.stl + '</th>' +
        '<th>' + statline.blk + '</th>' +
        '<th>' + statline.turnover + '</th>' +
        '<th>' + statline.pfoul + '</th>' +
        '<th>' + statline.points + '</th>' +
        '</tr>'
    );
}

function addStatline(player, statline) {
    var list = $('#js-away-statline-list');
    if (player.side)
        list = $('#js-home-statline-list');

    list.append(
        '<tr id="js-statline' + player.id + '">' +
            '<td>' + player.jersey + '</td>' +
            '<td>' + player.name + '</td>' +
            '<td>' + player.position + '</td>' +
            '<td>' + moment("2016-01-01").startOf('day').seconds(statline.seconds).format('mm:ss') + '</td>' +
            '<td>' + statline.two_m + ' - ' + (statline.two_m + statline.two_a) + '</td>' +
            '<td>' + statline.trey_m + ' - ' + (statline.trey_m + statline.trey_a) + '</td>' +
            '<td>' + statline.ft_m + ' - ' + (statline.ft_m + statline.ft_a) + '</td>' +
            '<td>' + statline.reb_o + '</td>' +
            '<td>' + statline.reb_d + '</td>' +
            '<td>' + statline.ast + '</td>' +
            '<td>' + statline.stl + '</td>' +
            '<td>' + statline.blk + '</td>' +
            '<td>' + statline.turnover + '</td>' +
            '<td>' + statline.pfoul + '</td>' +
            '<td>' + statline.points + '</td>' +
            '<td><a href="" class="js-edit-stat" data-id="' + player.id + '">Edit</a></td>' +
        '</tr>'
    );
}

loadGameSetting();

/*$(document).on('change', '#js-toggle-canvas', function (e) {
    e.preventDefault();

    $('#js-canvas').toggle();
    $('#js-instant-play-buttons').toggle();
});*/

$(document).on('click', '#js-start-period2', function (e) {
    e.preventDefault();

    var temp = $(this);

    $('#js-loading-message').text('Loading...');
    $('#js-loading').show();
    $.ajax({
        type: 'PUT',
        url: api_host + '/admin/livestats/games/' + game_id + '/period_status',
        data: {
            period: cur_period,
            status: 'A',
        },
        success: function (result) {
            temp.attr('id', 'js-next-period2');
            temp.removeClass('btn-primary');
            temp.addClass('btn-danger');
            if (cur_period == total_period)
                temp.text('END GAME');
            else
                temp.text('END PERIOD');
            $('#js-loading').hide();

            cur_period_status = 'A';

            $('#js-show-timeout-modal').removeAttr('disabled');

            $('.js-submit-instant-play').each(function() {
                $(this).removeAttr('disabled');
            });

            $('.js-submit-score').each(function() {
                $(this).removeAttr('disabled');
            });

            $('.js-select-player').each(function() {
                $(this).removeAttr('disabled');
            });

            $('.js-period').each(function() {
                $(this).attr('style', 'color: #81c868');
            });

            toastr.success('Period ' + cur_period + ' has started!');
        },
        error: function (request, status, error) {
            retry(this, request, error);
        }
    });
});

$(document).on('click', '#js-next-period2', function (e) {
    e.preventDefault();

    $('#js-chart-popup').hide();
    // canvas.removeLayer('player_pos').drawLayers();

    swal({
        title: 'End Period',
        text: 'Are you sure to end this period?',
        type: "warning",
        allowOutsideClick: false,
        cancelButtonText: 'Cancel',
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes",
        closeOnConfirm: cur_period >= total_period ? false : true
    }, function (isConfirm) {
        if (isConfirm) {
            if (cur_period >= total_period) {
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
                                period: cur_period,
                                status: 'D'
                            },
                            success: function (result) {
                                $('#js-loading').hide();
                                window.location.reload();
                                // window.location.href = 'live_stats_end.html';
                                // window.location.href = 'live_stats.html';
                            },
                            error: function (request, status, error) {
                                retry(this, request, error);
                            }
                        });
                    } else {
                        endPeriod();
                    }
                });
            } else {
                endPeriod();
            }

            //Call end period API
            /*$('#js-loading-message').text('Loading...');
            $('#js-loading').show();
            $.ajax({
                type: 'PUT',
                url: api_host + '/admin/livestats/games/' + game_id + '/period_status',
                data: {
                    period: cur_period,
                    status: 'B'
                },
                success: function (data) {
                    $('#js-loading').hide();

                    window.location.href = "live_stats_adjust.html";

                    // updateStatline(data);
                    //
                    // $('#statlines-modal').modal({
                    //     backdrop: 'static',
                    //     keyboard: false
                    // });
                }
            });*/
        } /*else {
            //alert('Input overtime to play');
        }*/
    });
});

function updateStatline(data) {
    $('#js-home-statline-list').html('');
    $('#js-away-statline-list').html('');

    player_data = TAFFY(data.statlines);
    var statlines = player_data().order("jersey").get();
    statlines.forEach(function (player, index) {
        if (!player.inactive) {
            var statline = null;
            if (player.period_stats.length) {
                var period_stats = TAFFY(player.period_stats);
                statline = period_stats({period: cur_period}).first();
            }
            if (statline) {
                addStatline(player, statline);
            }
        }
    });

    data.teamstats.forEach(function (team, index) {
        var period_stats = TAFFY(team.period_stats);
        var statline = period_stats({period: cur_period}).first();
        console.log(statline);
        if (team.side)
            updateTotalStatline('js-home-total-statline', statline);
        else
            updateTotalStatline('js-away-total-statline', statline);
    });
}

function resetTeamPlayer() {
    $('#js-home-player-list').html('');
    $('#js-away-player-list').html('');

    home_active_player_ids = [];
    home_inactive_player_ids = [];
    away_active_player_ids = [];
    away_inactive_player_ids = [];

    var player_list = player_data().get();
    player_list.forEach(function (player, index) {
        if (!player.inactive) {
            if (player.side) {
                home_inactive_player_ids.push(player.id);
            } else {
                away_inactive_player_ids.push(player.id);
            }
        }
    });

    updatePlayerList();

    var time_text = moment("2016-01-01").startOf('day').seconds(period_time).format('mm:ss');
    $('#js-remaining-time').val(time_text);
    $('#js-change-player').attr('disabled', 'disabled');

    $('#js-change-player-title').text('Choose starter players to start PERIOD ' + cur_period);
    $('#change-player-modal').modal({
        backdrop: 'static',
        keyboard: false
    });
}

function endPeriod() {
    $('#js-loading-message').text('Loading...');
    $('#js-loading').show();
    $.ajax({
        type: 'PUT',
        url: api_host + '/admin/livestats/games/' + game_id + '/period_status',
        data: {
            period: cur_period,
            status: 'B'
        },
        success: function (result) {
            $('#js-loading').hide();

            $('#js-next-period2').attr('id', 'js-start-period2');
            $('#js-start-period2').removeClass('btn-danger');
            $('#js-start-period2').addClass('btn-primary');
            $('#js-start-period2').text('START PERIOD');

            $('#js-show-timeout-modal').attr('disabled', 'disabled');

            toastr.success('Period ' + cur_period + ' has ended!');

            cur_period++;
            cur_period_status = 'B';

            last_time_input = null;
            if (cur_period > total_period && home_score == away_score) {
                period_time = ot_time;
                var time_text = moment("2016-01-01").startOf('day').seconds(period_time).format('mm:ss');
                $('#js-remaining-time').val(time_text);
            }

            $('.js-submit-instant-play').each(function () {
                $(this).attr('disabled', 'disabled');
            });

            $('.js-submit-score').each(function () {
                $(this).attr('disabled', 'disabled');
            });

            $('.js-period').each(function () {
                if (cur_period > total_period)
                    $(this).text('OT | P' + cur_period);
                else
                    $(this).text('P' + cur_period);
                // $(this).attr('style', 'color: #f05050');
            });

            $('#js-home-instant-play-list').html('');
            $('#js-away-instant-play-list').html('');
            // $('#js-pending-instant-play-list').html('');
            $('#js-remaining-time-div').hide();

            updateGameScoreAndBoxScore(result);

            resetTeamPlayer();
            // }
        },
        error: function (request, status, error) {
            retry(this, request, error);
        }
    });
}

$(document).on('click', '.js-edit-stat', function (e) {
    e.preventDefault();

    var player_id = $(this).attr('data-id');
    $('#js-update-stat').attr('data-id', player_id);
    var player = player_data({id: player_id}).first();
    var period_stats = TAFFY(player.period_stats);
    var statline = period_stats({period: cur_period}).first();
    
    // console.log(player);
    $('#js-edit-stat-player').text(player.name + ' #' + player.jersey + ' ' + player.position);
    $('#js-stat').replaceWith(
        '<tr id="js-stat">' +
        //'<td><input type="text" id="js-seconds" class="form-control" data-mask="99:99" value="' + moment("2016-01-01").startOf('day').seconds(statline.seconds).format('mm:ss') + '"></td>' +
        '<td><input type="number" min="0" id="js-two-m" class="form-control" value="' + statline.two_m + '"></td>' +
        '<td><input type="number" min="0" id="js-two-a" class="form-control" value="' + statline.two_a + '"></td>' +
        '<td><input type="number" min="0" id="js-trey-m" class="form-control" value="' + statline.trey_m + '"></td>' +
        '<td><input type="number" min="0" id="js-trey-a" class="form-control" value="' + statline.trey_a + '"></td>' +
        '<td><input type="number" min="0" id="js-ft-m" class="form-control" value="' + statline.ft_m + '"></td>' +
        '<td><input type="number" min="0" id="js-ft-a" class="form-control" value="' + statline.ft_a + '"></td>' +
        '<td><input type="number" min="0" id="js-reb-o" class="form-control" value="' + statline.reb_o + '"></td>' +
        '<td><input type="number" min="0" id="js-reb-d" class="form-control" value="' + statline.reb_d + '"></td>' +
        '<td><input type="number" min="0" id="js-ast" class="form-control" value="' + statline.ast + '"></td>' +
        '<td><input type="number" min="0" id="js-stl" class="form-control" value="' + statline.stl + '"></td>' +
        '<td><input type="number" min="0" id="js-blk" class="form-control" value="' + statline.blk + '"></td>' +
        '<td><input type="number" min="0" id="js-turnover" class="form-control" value="' + statline.turnover + '"></td>' +
        '<td><input type="number" min="0" id="js-pfoul" class="form-control" value="' + statline.pfoul + '"></td>' +
        '</tr>'
    );

    // $('#js-seconds').datetimepicker({
    //     format: 'mm:ss',
    // });

    $('#statlines-modal').css({'z-index': 999});
    $('#edit-stat-modal').modal();
});

$("#edit-stat-modal").on('hidden.bs.modal', function () {
    $('#statlines-modal').css({'z-index': 1050});
});

$(document).on('click', '#js-update-stat', function (e) {
    e.preventDefault();

    var player_id = $(this).attr('data-id');
    var player = player_data({id: player_id}).first();
    var period_stats = TAFFY(player.period_stats);
    var statline = period_stats({period: cur_period}).first();

    var formData = {
        period: cur_period,
        adjustments: {
            //'seconds': moment.duration("00:" + $('#js-seconds').val()).asSeconds() - statline.seconds,
            'two_m': $('#js-two-m').val() - statline.two_m,
            'two_a': $('#js-two-a').val() - statline.two_a,
            'trey_m': ($('#js-trey-m').val() - statline.trey_m),
            'trey_a': ($('#js-trey-a').val() - statline.trey_a),
            'ft_m': ($('#js-ft-m').val() - statline.ft_m),
            'ft_a': ($('#js-ft-a').val() - statline.ft_a),
            'reb_o': ($('#js-reb-o').val() - statline.reb_o),
            'reb_d': ($('#js-reb-d').val() - statline.reb_d),
            'ast': ($('#js-ast').val() - statline.ast),
            'stl': ($('#js-stl').val() - statline.stl),
            'blk': ($('#js-blk').val() - statline.blk),
            'turnover': ($('#js-turnover').val() - statline.turnover),
            'pfoul': ($('#js-pfoul').val() - statline.pfoul),
        }
    };
    // console.log(formData);

    $('#edit-stat-modal').modal('hide');
    $('#js-loading-message').text('Loading...');
    $('#js-loading').show();
    $.ajax({
        type: 'PUT',
        url: api_host + '/admin/livestats/games/' + game_id + '/statlines/' + player_id + '/adjust',
        data: formData,
        success: function (data) {
            $('#js-loading').hide();

            updateStatline(data);

            updateGameScoreAndBoxScore(data);

            toastr.success('Statline is updated');
            /*player_data({id: player.id}).update({
                seconds: $('#js-seconds').val(),
                two_m: $('#js-two-m').val(),
                two_a: $('#js-two-a').val(),
                trey_m: $('#js-trey-m').val(),
                trey_a: $('#js-trey-a').val(),
                ft_m: $('#js-ft-m').val(),
                ft_a: $('#js-ft-a').val(),
                reb_o: $('#js-reb-o').val(),
                reb_d: $('#js-reb-d').val(),
                ast: $('#js-ast').val(),
                stl: $('#js-stl').val(),
                blk: $('#js-blk').val(),
                turnover: $('#js-turnover').val(),
                pfoul: $('#js-pfoul').val(),
            });

            $('#js-statline' + player.id).replaceWith(
                '<tr id="js-statline' + player.id + '">' +
                    '<td>' + player.jersey + '</td>' +
                    '<td>' + player.name + '</td>' +
                    '<td>' + player.position + '</td>' +
                    '<td>' + moment("2016-01-01").startOf('day').seconds(player.seconds).format('mm:ss') + '</td>' +
                    '<td>' + player.two_m + ' - ' + (player.two_m + player.two_a) + '</td>' +
                    '<td>' + player.trey_m + ' - ' + (player.trey_m + player.trey_a) + '</td>' +
                    '<td>' + player.ft_m + ' - ' + (player.ft_m + player.ft_a) + '</td>' +
                    '<td>' + player.reb_o + '</td>' +
                    '<td>' + player.reb_d + '</td>' +
                    '<td>' + player.ast + '</td>' +
                    '<td>' + player.stl + '</td>' +
                    '<td>' + player.blk + '</td>' +
                    '<td>' + player.turnover + '</td>' +
                    '<td>' + player.pfoul + '</td>' +
                    '<td>' + player.points + '</td>' +
                    '<td><a href="" class="js-edit-stat" data-id="' + player.id + '">Edit</a value="' + player.two_m + '"></td>' +
                '</tr>'
            );*/
            // window.location.href = 'formData.html';
        },
        error: function (request, status, error) {
            retry(this, request, error);
        }
    });
});

$(document).on('click', '#js-show-timeout-modal', function (e) {
    e.preventDefault();

    if (!$(this).attr('disabled')) {
        if (last_time_input)
            $('#js-timeout-time').val(last_time_input);
        else {
            var time_text = moment("2016-01-01").startOf('day').seconds(period_time).format('mm:ss');
            $('#js-timeout-time').val(time_text);
        }
        $('#timeout-modal').modal();
    }
});

$(document).on('click', '#js-submit-timeout', function (e) {
    e.preventDefault();

    if (!$('#js-timeout-time').val()) {
        alert('Please input remaining time');
    } else {
        var pass_validation = true;
        if (last_time_input) {
            var last_remaining_time = moment.duration("00:" + last_time_input).asSeconds();
            var new_remaining_time = moment.duration("00:" + $('#js-timeout-time').val()).asSeconds();
            if (new_remaining_time > last_remaining_time) {
                alert('Please input remaining time <= ' + last_time_input);
                pass_validation = false;
            }
        }

        if (pass_validation) {
            var remaining_time;
            if (enable_gameclock) {
                remaining_time = Math.round((period_time - pauseDate) / 1000);
            } else {
                last_time_input = $('#js-timeout-time').val();
                remaining_time = moment.duration("00:" + $('#js-timeout-time').val()).asSeconds();
            }

            var side = $('#js-timeout-form').serialize();

            var formData = side + '&period=' + cur_period + '&gametime=' + remaining_time;

            $('#js-loading-message').text('Loading...');
            $('#js-loading').show();
            $.ajax({
                type: 'POST',
                url: api_host + '/admin/livestats/games/' + game_id + '/timeout',
                data: formData,
                success: function (result) {
                    $('#js-loading').hide();

                    $('#timeout-modal').modal('hide');

                    toastr.success('Timeout is submitted!')
                },
                error: function (request, status, error) {
                    retry(this, request, error);
                }
            });
        }
    }
});

function updatePlayerList() {
    $('#js-home-inactive-player-list').html('');
    $('#js-away-inactive-player-list').html('');

    home_active_player_ids.forEach(function (player_id) {
        var player = player_data({id: player_id}).first();
        $('#js-home-inactive-player-list').append(
            '<div class="js-team-player inactive-player active-player" data-side="1" data-id="' + player.id + '">' +
            //'<img src="https://cx-team.github.io/stackup/share/image/player.png" >' +
            '<p>#' + player.jersey + ' ' + player.position + '</p>' +
            '<p><strong>' + player.name + '</strong></p>' +
            '</div>'
        );
    });

    home_inactive_player_ids.forEach(function (player_id) {
        var player = player_data({id: player_id}).first();
        $('#js-home-inactive-player-list').append(
            '<div class="js-team-player inactive-player" data-side="1" data-id="' + player.id + '">' +
            //'<img src="https://cx-team.github.io/stackup/share/image/player.png" >' +
            '<p>#' + player.jersey + ' ' + player.position + '</p>' +
            '<p><strong>' + player.name + '</strong></p>' +
            '</div>'
        );
    });

    away_active_player_ids.forEach(function (player_id) {
        var player = player_data({id: player_id}).first();
        $('#js-away-inactive-player-list').append(
            '<div class="js-team-player inactive-player active-player" data-side="0" data-id="' + player.id + '">' +
            //'<img src="https://cx-team.github.io/stackup/share/image/player.png" >' +
            '<p>#' + player.jersey + ' ' + player.position + '</p>' +
            '<p><strong>' + player.name + '</strong></p>' +
            '</div>'
        );
    });

    away_inactive_player_ids.forEach(function (player_id) {
        var player = player_data({id: player_id}).first();
        $('#js-away-inactive-player-list').append(
            '<div class="js-team-player inactive-player" data-side="0" data-id="' + player.id + '">' +
            //'<img src="https://cx-team.github.io/stackup/share/image/player.png" >' +
            '<p>#' + player.jersey + ' ' + player.position + '</p>' +
            '<p><strong>' + player.name + '</strong></p>' +
            '</div>'
        );
    });
}

$(document).on('click', '#js-show-change-player-modal', function (e) {
    e.preventDefault();

    $('#js-chart-popup').hide();
    // canvas.removeLayer('player_pos').drawLayers();

    updatePlayerList();

    $('#js-change-player').attr('disabled', 'disabled');

    if ((cur_period == 0 && cur_period_status == 'Z') || cur_period_status == 'B')
        $('#js-remaining-time-div').hide();
    else {
        $('#js-remaining-time-div').show();
        if (last_time_input)
            $('#js-remaining-time').val(last_time_input);
        else {
            var time_text = moment("2016-01-01").startOf('day').seconds(period_time).format('mm:ss');
            $('#js-remaining-time').val(time_text);
        }
    }

    $('#js-change-player-title').text('Substitute players for PERIOD ' + cur_period);
    $('#change-player-modal').modal();
});

$("#change-player-modal").on('hidden.bs.modal', function () {
    $(this).data('bs.modal', null);
});

$(document).on('click', '#js-change-player', function (e) {
    e.preventDefault();

    var $this = $(this);
    if ($this.attr('disabled'))
        return;
    if (!$('#js-remaining-time').val()) {
        alert('Please input remaining time');
    } else {
        var pass_validation = true;
        if (last_time_input) {
            var last_remaining_time = moment.duration("00:" + last_time_input).asSeconds();
            var new_remaining_time = moment.duration("00:" + $('#js-remaining-time').val()).asSeconds();
            if (new_remaining_time > last_remaining_time) {
                alert('Please input remaining time <= ' + last_time_input);
                pass_validation = false;
            }
        }

        if (pass_validation) {
            $this.attr('disabled', 'disabled');
            $('#change-player-modal').modal('hide');

            var remaining_time;
            if (enable_gameclock) {
                remaining_time = Math.round((period_time - pauseDate) / 1000);
            } else {
                last_time_input = $('#js-remaining-time').val();
                remaining_time = moment.duration("00:" + $('#js-remaining-time').val()).asSeconds();
            }

            // var subin_player_id_list = [];
            // var subout_player_id_list = [];
            // var changed_player_id_list = [];

            var temp = [];
            var home_active_players = [];
            var away_active_players = [];

            $('#js-home-inactive-player-list div.active-player').each(function () {
                var player_id = $(this).attr('data-id');
                temp.push(player_id);
                var player = player_data({id: player_id}).first();
                home_active_players.push(player);
                // if (home_active_player_ids.indexOf(player_id) == -1) {
                //     subout_player_id_list.push(player_id);
                //     changed_player_id_list.push(player_id);
                // }
            });
            home_active_player_ids = temp;
            home_active_players = TAFFY(home_active_players);
            home_active_players = home_active_players().order("jersey").get();

            temp = [];
            $('#js-home-inactive-player-list div:not(.active-player)').each(function () {
                var player_id = $(this).attr('data-id');
                temp.push(player_id);
                // if (home_inactive_player_ids.indexOf(player_id) == -1) {
                //     subin_player_id_list.push(player_id);
                //     changed_player_id_list.push(player_id);
                // }
            });
            home_inactive_player_ids = temp;

            temp = [];
            $('#js-away-inactive-player-list div.active-player').each(function () {
                var player_id = $(this).attr('data-id');
                temp.push(player_id);
                var player = player_data({id: player_id}).first();
                away_active_players.push(player);
                // if (away_active_player_ids.indexOf(player_id) == -1) {
                //     subout_player_id_list.push(player_id);
                //     changed_player_id_list.push(player_id);
                // }
            });
            away_active_player_ids = temp;
            away_active_players = TAFFY(away_active_players);
            away_active_players = away_active_players().order("jersey").get();

            temp = [];
            $('#js-away-inactive-player-list div:not(.active-player)').each(function () {
                var player_id = $(this).attr('data-id');
                temp.push(player_id);
                // if (away_inactive_player_ids.indexOf(player_id) == -1) {
                //     subin_player_id_list.push(player_id);
                //     changed_player_id_list.push(player_id);
                // }
            });
            away_inactive_player_ids = temp;

            console.log(home_active_player_ids.length);
            console.log(away_active_player_ids.length);
            /*
            changed_player_id_list.forEach(function (player_id) {
                var player = player_data({id: player_id}).first();
                if (player.side)
                    if (player.active)
                        $('#js-home-inactive-score-list').append($('#js-score' + player_id));
                    else
                        $('#js-home-active-score-list').append($('#js-score' + player_id));
                else
                if (player.active)
                    $('#js-away-inactive-score-list').append($('#js-score' + player_id));
                else
                    $('#js-away-active-score-list').append($('#js-score' + player_id));
            });*/

            var formData = {
                period: cur_period,
                set_active_home: home_active_player_ids,
                set_active_away: away_active_player_ids,
                gametime: remaining_time,
                //atomictime: moment.utc().format('HH:mm:ss')
            };

            if (cur_period == 1 && cur_period_status == 'Z') {
                formData = {
                    'starters': home_active_player_ids.concat(away_active_player_ids)
                }
                formData['gametime'] = remaining_time;
                period_time = remaining_time;
            }

            $('#js-loading-message').text('Loading...');
            $('#js-loading').show();
            $.ajax({
                type: 'PUT',
                url: api_host + '/admin/livestats/games/' + game_id + '/update_rotation',
                data: formData,
                success: function (data) {
                    $('#js-loading').hide();
                    $this.removeAttr('disabled');

                    selectedPlayer = null;

                    // Update active player list
                    $('#js-home-player-list').html('');
                    home_active_players.forEach(function (player) {
                        addActivePlayer($('#js-home-player-list'), player);
                    });

                    $('#js-away-player-list').html('');
                    away_active_players.forEach(function (player) {
                        addActivePlayer($('#js-away-player-list'), player);
                    });

                    // Update box score when change player
                    $('#js-home-active-score-list').html('');
                    $('#js-home-inactive-score-list').html('');
                    $('#js-away-active-score-list').html('');
                    $('#js-away-inactive-score-list').html('');

                    data.forEach(function (player, index) {
                        if (!player.inactive) {
                            if (player.side) {
                                if (player.active)
                                    addScore($('#js-home-active-score-list'), player);
                                else
                                    addScore($('#js-home-inactive-score-list'), player);
                            } else {
                                if (player.active)
                                    addScore($('#js-away-active-score-list'), player);
                                else
                                    addScore($('#js-away-inactive-score-list'), player);
                            }
                        }
                    });

                    if (cur_period_status == 'Z' || cur_period_status == 'B') {
                        $('.js-submit-instant-play').each(function() {
                            $(this).attr('disabled', 'disabled');
                        });

                        $('.js-submit-score').each(function() {
                            $(this).attr('disabled', 'disabled');
                        });

                        $('.js-select-player').each(function() {
                            $(this).attr('disabled', 'disabled');
                        });
                    }

                    toastr.success('Players are updated!')
                },
                error: function (request, status, error) {
                    retry(this, request, error);
                }
            });
        }
    }
});

$(document).on('click', '.js-team-player', function (e) {
    e.preventDefault();

    var temp = $(this);
    var side = temp.attr('data-side');
    var team = side == '1' ? 'home' : 'away';
    var player = player_data({id: $(this).attr('data-id')}).first();

    if (temp.hasClass('active-player')) {
        /*temp.remove();
        $('#js-' + team + '-inactive-player-list').append(
            '<div class="js-team-player inactive-player" data-side="' + side + '" data-id="' + player.id + '">' +
                //'<img src="https://cx-team.github.io/stackup/share/image/player.png" >' +
                '<p>#' + player.jersey + ' ' + player.position + '</p>' +
                '<p><strong>' + player.name + '</strong></p>' +
            '</div>'
        );*/
        temp.removeClass('active-player');
        $('#js-change-player').attr('disabled', 'disabled');
    } else {
        var active_player_count = $('#js-' + team + '-inactive-player-list div.active-player').length;
        if (active_player_count + 1 <= 5) {
            /*temp.remove();
            $('#js-' + team + '-active-player-list').append(
                '<div class="js-team-player active-player" data-side="' + side + '" data-id="' + player.id + '">' +
                    //'<img src="https://cx-team.github.io/stackup/share/image/player.png" >' +
                    '<p>#' + player.jersey + ' ' + player.position + '</p>' +
                    '<p><strong>' + player.name + '</strong></p>' +
                '</div>'
            );*/
            temp.addClass('active-player');

            home_active_player_count = $('#js-home-inactive-player-list div.active-player').length;
            away_active_player_count = $('#js-away-inactive-player-list div.active-player').length;

            if (home_active_player_count == 5 && away_active_player_count == 5) {
                $('#js-change-player').removeAttr('disabled');
            } else {
                $('#js-change-player').attr('disabled', 'disabled');
            }
        }
    }
});

function updateGameScoreAndBoxScore(game) {
    game.teamstats.forEach(function (team, index) {
        if (team.side) {
            home_score = team.points;
            $('#js-home-score').text(home_score);
            updateTotalScore(team);
        } else {
            away_score = team.points;
            $('#js-away-score').text(away_score);
            updateTotalScore(team);
        }
    });
    

    if (game.statlines) {
        player_data = TAFFY(game.statlines);
        var data = player_data().order("jersey").get();

        $('#js-home-active-score-list').html('');
        $('#js-home-inactive-score-list').html('');
        $('#js-away-active-score-list').html('');
        $('#js-away-inactive-score-list').html('');

        data.forEach(function (player, index) {
            if (!player.inactive) {
                if (player.side) {
                    if (player.active)
                        addScore($('#js-home-active-score-list'), player);
                    else
                        addScore($('#js-home-inactive-score-list'), player);
                } else {
                    if (player.active)
                        addScore($('#js-away-active-score-list'), player);
                    else
                        addScore($('#js-away-inactive-score-list'), player);
                }
            }
        });
    }
}

function initXEditable() {
    $('.js-instant-play-category').editable({
        validate: function(value) {
            if ($.trim(value) == '') return 'This value is required.';
        },
        // url: api_host + '/admin/livestats/games/' + game_id + '/instantplays/' + $(this).attr('data-id'),
        ajaxOptions: {
            type: 'PUT'
        },
        send: 'always',
        params: function(params) {  //params already contain `name`, `value` and `pk`
            var data = {};
            data['stat_category'] = params.value;
            return data;
        },
        // mode: 'inline',
        type: 'select',
        source: [
            {value: STAT_CATEGORY_FT_M, text: STAT_CATEGORY_FT_M},
            {value: STAT_CATEGORY_FT_A, text: STAT_CATEGORY_FT_A},
            {value: STAT_CATEGORY_TWO_M, text: STAT_CATEGORY_TWO_M},
            {value: STAT_CATEGORY_TWO_A, text: STAT_CATEGORY_TWO_A},
            {value: STAT_CATEGORY_TREY_M, text: STAT_CATEGORY_TREY_M},
            {value: STAT_CATEGORY_TREY_A, text: STAT_CATEGORY_TREY_A},
            {value: STAT_CATEGORY_REB_O, text: STAT_CATEGORY_REB_O},
            {value: STAT_CATEGORY_REB_D, text: STAT_CATEGORY_REB_D},
            {value: STAT_CATEGORY_AST, text: STAT_CATEGORY_AST},
            {value: STAT_CATEGORY_BLK, text: STAT_CATEGORY_BLK},
            {value: STAT_CATEGORY_STL, text: STAT_CATEGORY_STL},
            {value: STAT_CATEGORY_TURNOVER, text: STAT_CATEGORY_TURNOVER},
            {value: STAT_CATEGORY_PFOUL, text: 'foul'},
        ],
        error: function(response, newValue) {
            // console.log(response);
            if (response.status === 500) {
                return 'Service unavailable. Please try later!';
            } else if (response.status === 408) {
                return 'Request timeout. Please try again!';
            } else {
                return response.status + ' - ' + response.statusText;
            }
        }
        // prepend: "not selected",
    }).on('save', function(e, params) {
        // console.log(params);
        var play = params.response;

        updateGameScoreAndBoxScore(play);
    });

    var active_player_list = [];
    home_active_player_ids.forEach(function (player_id) {
        var player = player_data({id: player_id}).first();
        active_player_list.push({value: player.id, text: '[' + home_team + '] #' + player.jersey + ' - ' + player.name});
    });

    away_active_player_ids.forEach(function (player_id) {
        var player = player_data({id: player_id}).first();
        active_player_list.push({value: player.id, text: '[' + away_team + '] #' + player.jersey + ' - ' + player.name});
    });

    $('.js-instant-play-player').editable({
        validate: function(value) {
            if ($.trim(value) == '') return 'This value is required.';
        },
        // url: api_host + '/admin/livestats/games/' + game_id + '/instantplays/' + $(this).attr('data-id'),
        ajaxOptions: {
            type: 'PUT'
        },
        send: 'always',
        params: function(params) {  //params already contain `name`, `value` and `pk`
            var data = {};
            data['statline_token'] = params.value;
            return data;
        },
        // mode: 'inline',
        type: 'select',
        source: active_player_list,
        // prepend: "not selected",
        display: function(value, sourceData, response) {
            if (response)
                $(this).text(response.player_name);
        },
        error: function(response, newValue) {
            // console.log(response);
            if (response.status === 500) {
                return 'Service unavailable. Please try later!';
            } else if (response.status === 408) {
                return 'Request timeout. Please try again!';
            } else {
                return response.status + ' - ' + response.statusText;
            }
        }
    }).on('save', function(e, params) {
        // console.log(params);
        var play = params.response;
        // console.log(play.player_name);
        // $('#js-all-instant-play-team' + play.id).text(play.team_name);
        // $('#js-pending-instant-play-team' + play.id).text(play.team_name);
        // $('#js-instant-play-player' + play.id).text(play.player_name);
        // $('#js-instant-play' + play.id).removeAttr('style');

        // $('#js-pending-instant-play' + play.id).remove();
        // var remove = false;
        // if (play.side) {
            if ($('#js-away-pending-instant-play' + play.id).length) {
                $('#js-away-pending-instant-play' + play.id).remove();
                // remove = true;
                // $('#js-home-pending-instant-play' + play.id).attr('id', 'js-home-instant-play' + play.id);
            }
        // } else {
            if ($('#js-home-pending-instant-play' + play.id).length) {
                $('#js-home-pending-instant-play' + play.id).remove();
                // remove = true;
                // $('#js-away-pending-instant-play' + play.id).attr('id', 'js-away-instant-play' + play.id);
            }
        // }

        updateGameScoreAndBoxScore(play);

        $('.js-instant-play-category').each(function() {
            $(this).editable('destroy');
        });
        $('.js-instant-play-player').each(function() {
            $(this).editable('destroy');
        });

        var url = api_host + '/admin/livestats/games/' + game_id + '/instantplays/' + play.id;

        var type = play.side ? 'home' : 'away';
        var opposite = play.side ? 'away' : 'home';

        if ($('#js-' + opposite + '-instant-play' + play.id).length)
            $('#js-' + opposite + '-instant-play' + play.id).remove();
        if ($('#js-' + type + '-instant-play' + play.id).length)
            $('#js-' + type + '-instant-play' + play.id).replaceWith(
                '<tr id="js-' + type + '-instant-play' + play.id + '" data-id="' + play.id + '">' +
                    '<td>' + play.jersey + '</td>' +
                    // '<td>' + play.current_gametime + '</td>' +
                    // '<td id="js-instant-play-team' + play.id + '">' + play.team_name + '</td>' +
                    '<td><span class="js-instant-play-category" data-url="' + url + '">' + play.stat_category + '</span></td>' +
                    '<td><span class="js-instant-play-player" data-url="' + url + '">' + play.player_name + '</span></td>' +
                    '<td><a href="" class="js-delete-instant-play" data-id="' + play.id + '"><i class="fa fa-remove fa-lg"></i></a></td>' +
                '</tr>'
            )
        else
            addInstantPlay($('#js-' + type + '-instant-play-list'), play, type);

        initXEditable();
    });
}

function addInstantPlay(list, play, type) {
    var url = api_host + '/admin/livestats/games/' + game_id + '/instantplays/' + play.id;

    if (type == 'pending') {
        var style = "background-color: rgba(240, 80, 80, 0.2)";

        $('#js-home-instant-play-list').prepend(
            '<tr id="js-home-pending-instant-play' + play.id + '" data-id="' + play.id + '" style="' + style + '">' +
                '<td>' + play.jersey + '</td>' +
                // '<td>' + play.current_gametime + '</td>' +
                // '<td id="js-all-instant-play-team' + play.id + '">' + play.team_name + '</td>' +
                '<td><span class="js-instant-play-category" data-url="' + url + '">' + play.stat_category + '</span></td>' +
                '<td><span class="js-instant-play-player" data-url="' + url + '">' + play.player_name + '</span></td>' +
                '<td><a href="" class="js-delete-instant-play" data-id="' + play.id + '"><i class="fa fa-remove fa-lg"></i></a></td>' +
            '</tr>'
        );
        $('#js-away-instant-play-list').prepend(
            '<tr id="js-away-pending-instant-play' + play.id + '" data-id="' + play.id + '" style="' + style + '">' +
                '<td>' + play.jersey + '</td>' +
                // '<td>' + play.current_gametime + '</td>' +
                // '<td id="js-all-instant-play-team' + play.id + '">' + play.team_name + '</td>' +
                '<td><span class="js-instant-play-category" data-url="' + url + '">' + play.stat_category + '</span></td>' +
                '<td><span class="js-instant-play-player" data-url="' + url + '">' + play.player_name + '</span></td>' +
                '<td><a href="" class="js-delete-instant-play" data-id="' + play.id + '"><i class="fa fa-remove fa-lg"></i></a></td>' +
            '</tr>'
        );
    } else
        list.prepend(
            '<tr id="js-' + type + '-instant-play' + play.id + '" data-id="' + play.id + '">' +
                '<td>' + play.jersey + '</td>' +
                // '<td>' + play.current_gametime + '</td>' +
                // '<td id="js-instant-play-team' + play.id + '">' + play.team_name + '</td>' +
                '<td><span class="js-instant-play-category" data-url="' + url + '">' + play.stat_category + '</span></td>' +
                '<td><span class="js-instant-play-player" data-url="' + url + '">' + play.player_name + '</span></td>' +
                '<td><a href="" class="js-delete-instant-play" data-id="' + play.id + '"><i class="fa fa-remove fa-lg"></i></a></td>' +
            '</tr>'
        );
}

function submitInstantPlay(formData) {
    $('#js-chart-popup').hide();
    // canvas.removeLayer('player_pos').drawLayers();

    // $('#js-loading-message').text('Loading...');
    // $('#js-loading').show();
    var player = null, player_name = '---', player_jersey = '---';
    if (formData.statline_token)
        player = player_data({id: formData.statline_token}).first();
    if (player) {
        player_jersey = player.jersey;
        player_name = player.name;
    }
    var style = 'style="background-color: rgba(240, 80, 80, 0.2)"';
    $('#js-home-instant-play-list').prepend(
        '<tr ' + style + ' id="js-home-pending-instant-play-temp">' +
            '<td>' + player_jersey + '</td>' +
            // '<td>---</td>' +
            // '<td id="js-instant-play-team' + play.id + '">' + play.team_name + '</td>' +
            '<td>' + formData.stat_category + '</td>' +
            '<td>' + player_name + '</td>' +
            '<td><i class="fa fa-spinner fa-pulse"></i></td>' +
        '</tr>'
    );
    $('#js-away-instant-play-list').prepend(
        '<tr ' + style + ' id="js-away-pending-instant-play-temp">' +
            '<td>' + player_jersey + '</td>' +
            // '<td>---</td>' +
            // '<td id="js-instant-play-team' + play.id + '">' + play.team_name + '</td>' +
            '<td>' + formData.stat_category + '</td>' +
            '<td>' + player_name + '</td>' +
            '<td><i class="fa fa-spinner fa-pulse"></i></td>' +
        '</tr>'
    );

    $.ajax({
        type: 'POST',
        url: api_host + '/admin/livestats/games/' + game_id + '/instantplays',
        data: formData,
        success: function (play) {
            // $('#js-loading').hide();
            $('#js-home-pending-instant-play-temp').remove();
            $('#js-away-pending-instant-play-temp').remove();

            // var style = '';
            // if (!selectedPlayer)
            //     style = '';

            if (selectedPlayer)
                if (play.side)
                    addInstantPlay($('#js-home-instant-play-list'), play, 'home');
                else
                    addInstantPlay($('#js-away-instant-play-list'), play, 'away');
            else {
                addInstantPlay(null, play, 'pending');
            }

            // addInstantPlay($('#js-all-instant-play-list'), play, 'all');

            // selectedPlayer = null;
            // $('.js-select-player').each(function () {
            //     $(this).removeClass('active');
            // });

            updateGameScoreAndBoxScore(play);

            $('.js-instant-play-category').each(function() {
                $(this).editable('destroy');
            });
            $('.js-instant-play-player').each(function() {
                $(this).editable('destroy');
            });
            
            initXEditable();

            toastr.success('Submitted successfully');
        },
        error: function (request, status, error) {
            retry(this, request, error);
        }
    });
}

$(document).on('dblclick', '.js-submit-instant-play', function (e) {
    e.preventDefault();

    if (!$(this).attr('disabled') && !selectedPlayer) {
        var formData = {
            stat_category: $(this).attr('data-category'),
            period: cur_period,
        };

        submitInstantPlay(formData);
    }
});

$(document).on('click', '.js-submit-instant-play', function (e) {
    e.preventDefault();

    if (!$(this).attr('disabled') && selectedPlayer) {
        var formData = {
            stat_category: $(this).attr('data-category'),
            period: cur_period,
            statline_token: selectedPlayer.id
        };

        submitInstantPlay(formData);
    }
});

$(document).on('click', '.js-delete-instant-play', function (e) {
    e.preventDefault();

    var instant_play_id = $(this).attr('data-id');
    swal({
        title: 'Warning',
        text: 'Are you sure you want to delete this item?',
        type: "warning",
        allowOutsideClick: true,
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, delete it",
        closeOnConfirm: true
    }, function(isConfirm){
        if (isConfirm) {
            $('#js-loading-message').text('Loading...');
            $('#js-loading').show();
            $.ajax({
                type: 'DELETE',
                url: api_host + '/admin/livestats/games/' + game_id + '/instantplays/' + instant_play_id,
                success: function (game) {
                    $('#js-loading').hide();
                    // $('#js-all-instant-play' + instant_play_id).remove();
                    $('#js-home-instant-play' + instant_play_id).remove();
                    $('#js-away-instant-play' + instant_play_id).remove();
                    $('#js-home-pending-instant-play' + instant_play_id).remove();
                    $('#js-away-pending-instant-play' + instant_play_id).remove();

                    updateGameScoreAndBoxScore(game);

                    toastr.success('Deleted successfully');
                },
                error: function (request, status, error) {
                    retry(this, request, error);
                }
            });
        }
    });
});

$(document).on('click', '.js-select-player', function (e) {
    e.preventDefault();

    // $('#js-chart-popup').hide();
    // canvas.removeLayer('player_pos').drawLayers();

    var temp = $(this);
    if (temp.hasClass('active')) {
        temp.removeClass('active');
        selectedPlayer = null;
    } else {
        $('.js-select-player').each(function () {
            $(this).removeClass('active');
        });

        temp.addClass('active');

        var player_id = $(temp).attr('data-id');
        selectedPlayer = player_data({id: player_id}).first();
    }
});

var press_key = null;

$(document).on('keyup', function(e) {
    // e.preventDefault();

    var key = e.which;
    // console.log(key);

    if (press_key && press_key == key) {
        var stat_category = null;
        if (key == 65) {
            // AST
            stat_category = STAT_CATEGORY_AST;
        } else if (key == 79) {
            // RED_O
            stat_category = STAT_CATEGORY_REB_O;
        } else if (key == 68) {
            // RED_D
            stat_category = STAT_CATEGORY_REB_D;
        } else if (key == 70) {
            // FOUL
            stat_category = STAT_CATEGORY_PFOUL;
        } else if (key == 84) {
            // TO
            stat_category = STAT_CATEGORY_TURNOVER;
        } else if (key == 83) {
            // STL
            stat_category = STAT_CATEGORY_STL;
        } else if (key == 66) {
            // BLK
            stat_category = STAT_CATEGORY_BLK;
        }

        if (stat_category) {
            // console.log(stat_category);
            var formData = {
                stat_category: stat_category,
                period: cur_period,
            };
            submitInstantPlay(formData);
        }
        press_key = null;
    } else
        press_key = e.which;
});

$(document).on('click', '#js-reset-game', function (e) {
    e.preventDefault();

    $('#js-loading-message').text('Resetting...');
    $('#js-loading').show();
    //Call reset game API
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
                    window.location.reload();
                },
                error: function (request, status, error) {
                    retry(this, request, error);
                }
            });
            // $('#js-loading').hide();
            // window.location.reload();
            // window.location.href = 'index.html';
        },
        error: function (request, status, error) {
            retry(this, request, error);
        }
    });
});


/*
$(document).on('click', '.js-submit-score', function (e) {
    e.preventDefault();

    var formData;
    if ($('#js-canvas').is(":visible") || selectedPlayer) {
        if (selectedPlayer) {
            formData = {
                stat_category: $(this).attr('data-category'),
                period: cur_period,
                statline_token: selectedPlayer.id,
                shotchart_x: posX,
                shotchart_y: posY
            };
        } else {
            formData = {
                stat_category: $(this).attr('data-category'),
                period: cur_period,
                shotchart_x: posX,
                shotchart_y: posY
            };
        }

        submitInstantPlay(formData);
    }
});

$(document).on('dblclick', '.js-submit-score', function (e) {
    e.preventDefault();

    if (!$(this).attr('disabled') && !$('#js-canvas').is(":visible") && !selectedPlayer) {
        var formData = {
            stat_category: $(this).attr('data-category'),
            period: cur_period,
            shotchart_x: posX,
            shotchart_y: posY
        };

        submitInstantPlay(formData);
    }
});

var point, red_region = false;
var canvasJS = document.getElementById('myCanvas');
var canvas = $('#myCanvas').drawImage({
    layer: true,
    name: "stadium",
    source: 'image/stadium.jpg',
    x: 0,
    y: 0,
    index: 1,
    fromCenter: false,
    click: function (layer) {
        red_region = false;
        point = 3;
        $('#js-point').text(3);
    }
}).drawPath({
    layer: true,
    name: "twopoint",
    strokeStyle: '#000',
    strokeWidth: 0,
    closed: true,
    opacity: 0.4,
    x: 549,
    y: 0,
    rotate: 90,
    // fillStyle: "blue",
    fillStyle: "transparent",
    index: 2,
    // Top petal
    p1: {
        type: 'line',
        x1: 0, y1: 0,
        x2: 0, y2: 497,
        x3: 106, y3: 497,
    },
    p2: {
        type: 'quadratic',
        cx1: 316, cy1: 462,
        x2: 335, y2: 250,
        cx2: 317, cy2: 32,
        x3: 106, y3: 0
    },
    click: function (layer) {
        red_region = false;
        point = 2;
        $('#js-point').text(2);
    }
}).drawPath({
    layer: true,
    name: "halfcircle",
    strokeStyle: '#000',
    strokeWidth: 0,
    closed: true,
    opacity: 0.4,
    x: 228,
    y: 218,
    rotate: 0,
    // fillStyle: "red",
    fillStyle: "transparent",
    index: 3,
    // Top petal
    p1: {
        type: 'line',
        x1: 200, y1: 0,
        x2: 0, y2: 0
    },
    p2: {
        type: 'quadratic',
        cx1: 6, cy1: 70,
        x2: 70, y2: 75,
        cx2: 140, cy2: 70,
        x3: 146, y3: 0
    },
    click: function (layer) {
        red_region = true;
    }

});

refeshLayer('twopoint');

function showCanvasPopup(e) {
    var mousePos = getMousePos(canvasJS, e);
    genCirclePoint(mousePos.x, mousePos.y);

    posX = mousePos.x;
    posY = mousePos.y;
    $('#js-px').text(posX);
    $('#js-py').text(posY);

    //        var offset = $(this).offset();
    var left = e.pageX;
    /!*console.log(left);
     console.log(mousePos.x);*!/
    var top = e.pageY;
    var theHeight = $('.popover').height();

    var minus_height = 73;
    if (red_region) {
        $('#js-ft').show();
        $('#js-two').show();
        $('#js-trey').hide();
        minus_height = 95;
    } else if (point == 2) {
        $('#js-ft').hide();
        $('#js-two').show();
        $('#js-trey').hide();
    } else {
        $('#js-ft').hide();
        $('#js-two').hide();
        $('#js-trey').show();
    }
    $('#js-chart-popup').show();

    $('#js-chart-popup').css('left', (left + 10 + 5) + 'px');
    $('#js-chart-popup').css('top', (top - (theHeight / 2) - 10 - minus_height) + 'px');
}

canvas.on('dblclick', function (e) {
    if (!selectedPlayer && cur_period_status == 'A') {
        $('#js-player').text('');

        showCanvasPopup(e);
    }
});

canvas.click(function (e) {
    if (selectedPlayer) {
        $('#js-player').text(selectedPlayer.name);

        showCanvasPopup(e);
    }
});

function genCirclePoint(x, y) {
    $('#js-chart-popup').hide();
    canvas.removeLayer('player_pos').drawLayers();
    canvas.drawEllipse({
        name: 'player_pos',
        layer: true,
        fillStyle: '#c33',
        x: x, y: y,
        width: 10, height: 10
    });
}

function refeshLayer(layerName) {
    var layer = canvas.getLayer(layerName);
    canvas.animateLayer(layer, {
        scale: 1
    });
}

function getMousePos(canvas, evt) {
    var rect = canvasJS.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

$(document).on('click', '#js-cancel', function (e) {
    e.preventDefault();

    $('#js-chart-popup').hide();
    canvas.removeLayer('player_pos').drawLayers();
});
*/

/*
function start_countdown() {
    $clock.countdown({
        date: period_time,
        text: "%m : %s",
        end: function () {
            $clock.countdown('destroy');
            alert('Finish period');

            $("#js-pause").attr('disabled', 'disabled');
            $("#js-end-period").removeAttr('disabled');
            $("#js-next-period").removeAttr('disabled');
        }
    });
}

$(document).on('click', '#js-start', function (e) {
    e.preventDefault();

    if (!$(this).attr('disabled')) {
        $(this).attr('disabled', 'disabled');
        $("#js-pause").removeAttr('disabled');

        //        period_time = new Date().getTime() + 720000;
        period_time = new Date().getTime() + time_per_period * 1000;
        $("#js-end-period").attr('disabled', 'disabled');
        $("#js-next-period").attr('disabled', 'disabled');

        start_countdown();
    }
});


$(document).on('click', '#js-next-period', function (e) {
    e.preventDefault();

//        console.log($(this).attr('disabled'));
    if (!$(this).attr('disabled')) {
        if ($(this).text() == 'END GAME') {
            swal({
                title: 'End Game',
                text: 'Are you sure to end this game?',
                type: "warning",
                allowOutsideClick: false,
                cancelButtonText: 'Play overtime',
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes",
                closeOnConfirm: true
            }, function (isConfirm) {
                if (isConfirm) {
                    window.location.reload();
                } else {
                    //alert('Input overtime to play');
                }
            });
        } else {
            swal({
                title: 'End Period',
                text: 'Are you sure to end this period and go the next period?',
                type: "warning",
                allowOutsideClick: false,
                cancelButtonText: 'Cancel',
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes",
                closeOnConfirm: true
            }, function (isConfirm) {
                if (isConfirm) {
                    var cur_period = parseInt($('#js-period').attr('data-period'));
                    if (cur_period < total_period) {
                        $clock.text('00 : 10');
                        cur_period++;
                        if (cur_period == total_period) {
                            $(this).text('END GAME');
                            $(this).attr('class', 'btn btn-danger');
                        } else {
                            $('#js-period').attr('data-period', cur_period);
                            $('#js-period').text('P' + cur_period);
                            $('#js-start').removeAttr('disabled');
                            $(this).attr('disabled', 'disabled');
                        }
                    }
                } else {
                    //alert('Input overtime to play');
                }
            });
        }
    }
});

$(document).on('click', '#js-pause', function (e) {
    e.preventDefault();

    if (!$(this).attr('disabled')) {
        pauseDate = new Date().getTime();
        $clock.countdown('stop');

        $(this).attr('id', 'js-resume');
        $(this).text("RESUME");

        $('#js-show-change-player-modal').removeAttr('disabled');
    }
});

$(document).on('click', '#js-resume', function (e) {
    e.preventDefault();

    if (!$(this).attr('disabled')) {
        var timedelta = new Date().getTime() - pauseDate;
        period_time = new Date(period_time + timedelta).getTime();
        $clock.countdown('destroy');
        start_countdown();

        $(this).attr('id', 'js-pause');
        $(this).text("STOP");
        $('#js-show-change-player-modal').attr('disabled', 'disabled');
    }
});*/

var checking = $('#floatingCirclesG');
var connectionStatus = $('#js-connection-status');
var connectionStatusText = $('#js-status');

function checkConnectionStatus() {
    var ajaxTime = new Date().getTime();
    checking.show();
    $.ajax({
        type: "GET",
        url: api_host2,
    }).done(function () {
        checking.hide();
        var totalTime = new Date().getTime()-ajaxTime;
        // console.log(totalTime);


        if (totalTime < 250) {
            connectionStatus.css('background-color', '#2ab27b');
            connectionStatusText.text('Excellent');
        } else if (totalTime < 500) {
            connectionStatus.css('background-color', '#3499e0');
            connectionStatusText.text('Good');
        } else if (totalTime < 750) {
            connectionStatus.css('background-color', '#E47911');
            connectionStatusText.text('Average');
        } else {
            connectionStatus.css('background-color', '#eb4d5c');
            connectionStatusText.text('Unstable');
        }
        // Here I want to get the how long it took to load some.php and use it further
    }).fail(function(jqXHR, textStatus, errorThrown ) {
        checking.hide();
        // console.log(jqXHR);
        // console.log(textStatus);
        // console.log(errorThrown);
        connectionStatus.css('background-color', '#000');
        connectionStatusText.text('Offline');
    });;
}

checkConnectionStatus();
// setInterval(checkConnectionStatus, 7000);