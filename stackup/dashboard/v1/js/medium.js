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
        },
        embeds: {
            oembedProxy: null
        }
    }
});

$(document).on('click', '#js-submit-article', function(e){
    e.preventDefault();

    var body = $('#editor').val();
    body = body.replace(/(\r\n|\n|\r|\t)/gm, "");
    body = body.replace(/>\s+</gm, "><");

    var pos = body.indexOf('<div class="medium-insert-buttons"');
    body = body.substr(0, pos);

    body = body.replace('<div class="medium-insert-embeds" contenteditable="false"><figure>', '');
    body = body.replace('</figure><div class="medium-insert-embeds-overlay"></div></div>', '');

    body = body.replace('<div class="medium-insert-embed"><iframe', '<iframe');
    body = body.replace('</iframe></div>', '</iframe>');

    body = body.replace('<div class="medium-insert-images medium-insert-active"><figure contenteditable="false">', '');
    body = body.replace('<div class="medium-insert-images"><figure contenteditable="false">', '');
    body = body.replace('</figure></div>', '');

    body = body.replace('p class=""', 'p');

    console.log(body);
    //todo: use body here to submit
})
