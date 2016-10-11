var upload_photo_url = api_host + '/profiles/articles/attachment';

var editor = new MediumEditor('#editor');

$('#editor').mediumInsert({
    editor: editor,
    addons: { // (object) Addons configuration
        images: { // (object) Image addon configuration
            //label: '<span class="fa fa-camera"></span>', // (string) A label for an image addon
            deleteScript: null, // (string) A relative path to a delete script
//                deleteMethod: 'POST',
//                fileDeleteOptions: {},
            fileUploadOptions: { // (object) File upload configuration. See https://github.com/blueimp/jQuery-File-Upload/wiki/Options
                url: upload_photo_url, // (string) A relative path to an upload script
                paramName: 'attachment[file]',
                formData: {
                    article_id: article_token
                },
                acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i, // (regexp) Regexp of accepted file types
                /*fileuploadcompleted: function (e, data) {
                    console.log(e);
                    console.log(data);
                }*/
            },
            preview: true, // (boolean) Show an image before it is uploaded (only in browsers that support this feature)
            captions: true, // (boolean) Enable captions
            captionPlaceholder: 'Type caption for image',
            /*uploadCompleted: function ($el, data) {
                console.log($el);
                console.log(data);
            },*/
        }
    }
});

/*
$(document).on('click', '#js-upload-image', function (e) {
    e.preventDefault();

    var data = new FormData($('#js-post-form')[0]);

    $('#js-loading-message').text('Loading...');
    $('#js-loading').show();
    $.ajax({
        url: api_host + '/profiles/photos',
        type: 'POST',
        data: data,
        async: true,
        cache: false,
        contentType: false,
        processData: false,
        success: function (result) {
            $('#js-loading').hide();
            console.log(result);
        },
        error: function (request, status, error) {
            console.log(status);
            console.log(request.responseText);
            console.log(error);
        }
    });
});*/
