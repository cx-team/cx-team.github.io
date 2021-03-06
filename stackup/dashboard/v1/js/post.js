var upload_photo_url = api_host + '/profiles/articles/attachment';
var upload_file_url = api_host + '/profiles/articles/file';

var toolbarButtons = [
    'paragraphFormat', 'quote', 'bold', 'italic', 'underline', 'color', '|',
    'formatOL', 'formatUL', '|',
    'insertLink', 'insertImage', 'insertVideo', 'insertFile', 'insertHR', '|',
    // 'fullscreen',
    // 'html'
];

// var imageInsertButtons = ['imageBack', '|', 'imageUpload', 'imageByURL', 'imageManager'];
var imageInsertButtons = ['imageBack', '|', 'imageUpload', 'imageByURL'];

var imageEditButtons = [
    // 'imageAlign', 'imageSize', 'imageDisplay', '|',
    'imageLink', 'linkOpen', 'linkEdit', 'linkRemove', '|',
    'imageAlt', '|',
    'imageReplace', 'imageRemove'
];

$('#editor').froalaEditor({
    theme: 'dark',
    heightMin: 500,
    // quickInsertButtons: [],
    toolbarButtons: toolbarButtons,

    imageResize: false,
    imageInsertButtons: imageInsertButtons,
    imageEditButtons: imageEditButtons,

    // Set the image upload parameter.
    imageUploadParam: 'attachment[file]',
    imageUploadURL: upload_photo_url,
    imageUploadMethod: 'POST',
    imageAllowedTypes: ['jpeg', 'jpg', 'png'],
    imageUploadParams: {
        article_id: article_token
    },

    fileUploadParam: 'attachment[file]',
    fileUploadURL: upload_file_url,
    fileUploadMethod: 'POST',
    fileAllowedTypes: ['text/plain', 'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'application/vnd.ms-powerpoint',
        'image/jpeg', 'image/png', 'image/gif'],
    fileUploadParams: {
        article_id: article_token
    },


    /*imageManagerPageSize: 20,
    imageManagerScrollOffset: 10,
    imageManagerLoadURL: '/admin/image/loadEditorImage',
    imageManagerLoadMethod: 'POST',
    imageManagerLoadParams: {
        object_model: '$object_model',
        object_id: $object_id
    },*/
//        imageManagerDeleteURL: '/admin/image/deleteEditorImage',
}).on('froalaEditor.contentChanged', function (e, editor) {
    // console.log(img);
    $('.fr-wrapper').next('div').remove();
}).on('froalaEditor.image.inserted', function (e, editor, img) {
    img.addClass('img-responsive');
    img.removeAttr('style');
}).on('froalaEditor.video.inserted', function (e, editor, video) {
    // console.log(video);

    var iframe = video.children()[0];
    $(iframe).addClass('embed-responsive-item');
    // $(iframe).wrap('<div class="embed-responsive embed-responsive-16by9"></div>');
    // console.log(iframe.outerHTML);
    iframe = '<div class="embed-responsive embed-responsive-16by9">' + iframe.outerHTML + '</div>';
    // console.log(iframe);
    video.replaceWith(iframe);
}).on('froalaEditor.file.uploaded', function (e, editor, file) {
    console.log(file);
});

$('.fr-wrapper').next('div').remove();

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
});