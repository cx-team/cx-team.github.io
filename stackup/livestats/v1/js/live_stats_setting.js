function loadGameStatus() {
    $('#js-loading-message').text('Loading...');
    $('#js-loading').show();

    $.get(api_host + '/admin/livestats/games/' + season_id + '/status', function (data, status) {
        $('#js-loading').hide();

        //todo: update form with game current setting
    });
}

// loadGameStatus();

$(document).on('click', '#js-submit-livestats-setting', function (e) {
    e.preventDefault();

    $('#js-loading-message').text('Loading...');
    $('#js-loading').show();
    var formData = $('#js-livestats-setting-form').serialize();

    $.ajax({
        type: 'PUT',
        url: api_host + '/admin/livestats/games/' + game_id + '/settings',
        data: formData ,
        success: function (result) {
            $('#js-loading').hide();

            toastr.success('Setting is updated!');
            // window.location.href = 'live_stats_setting.html';
        }
    });
});