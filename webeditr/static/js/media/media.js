
var media = {
    supported_media: ['image', 'audio', 'video'],
    media_tags: {
        'image': 'img',
        'audio': 'audio',
        'video': 'video',
    },
}




function prep_tag(){

}


function add_media_to_element(){

}


function build_media_selector_list(media_type_sel){
    for(var i = 0; i < media.supported_media.length; i++){
        var media = media.supported_media[i];
        var opt = $('<option>', {
                  class: 'media-type-option',
                  value: media});
        opt.append(media);
        $(media_type_sel).append(opt);
    }
}


function get_media_appender(elmnt){
    $('.media-appender').remove();
    var media_div = $('<div>', {
                    class: 'media-appender-div'})
    var media_title_div = $('<div>', {
                          class: 'media-appender-title-div'});
    var media_title_spn = $('<span>', {
                          class: 'media-title-spn'});
    media_title_spn.append('Media Selector');
    var media_rem_spn = $('<span>', {
                        class: 'media-rem-spn'});
    var media_rem_btn = $('<i>', {
                        class: 'media-rem-btn fa fa-times'});
    media_rem_spn.append(media_rem_btn);
    media_title_div.append(media_rem_spn);
    var media_inf_div = $('<div>', {
                        class: 'media-inf-div'});
    var media_type_spn = $('<select>', {
                         class: 'media-type-spn'});
    var media_type_sel = $('<option>', {
                         class: 'media-type-sel'});
    build_media_selector_list(media_type_sel);
}