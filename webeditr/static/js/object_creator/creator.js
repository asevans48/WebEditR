
var creator = {
    current_object_name: null,
    current_object_attributes: {},
    attr_name_map: {
                    'name': 'Object name',
                    'id_attr': 'ID Attribute',
                    'name_attr': 'Name Attribute',
                    'tag_name': 'Tag Name',
                    'class_name': 'Class Name',
                    'description': 'Description',
                    'attributes': 'Attributes',
                    'perc_page_height': 'Percent Page Height',
                    'perc_page_width': 'Percent Page Width'},
}


function get_similar_objects(){

}


function validate_new_object(){

}


function get_object_details(){

}


function populate_class_names(){

}


function get_element_classes(){

}


function save_object(oname){

}


function append_attribute(key_name, editor_div=$('.objectattr-editor-inputs-div')){
    var keys = Object.keys(creator.current_object_attributes);
    var attr_name = creator.attr_name_map[key_name];
    if(keys.includes(key_name) == true){
        //create the input for the
        attr_name = creator.current_object_attributes[key_name];
    }
    var inpt_div = $('<div>', {
                   class: 'objectattr-inpt-div'});
    var attr_inpt = $('<input>', {
                    class: 'objectattr-inpt'});
    attr_inpt.val(attr_name);
    inpt_div.append(attr_inpt);
    editor_div.append(inpt_div);
    return editor_div;
}


function open_object_attr_editor(){
    var oname = $('.objecteditor-selector-list').val();
    var object_attr_editor_div = $('<div>', {
                                 class: 'objectattr-editor-div'});

    //title
    var object_attr_title_div = $('<div>', {
                                class: 'objectattr-editor-title-div'});
    object_attr_title_div.append('Attribute Editor');

    //inputs
    var object_attr_input_div = $('<div>', {
                                class: 'objectattr-editor-inputs-div'});
    var attrs = Object.keys(creator.attr_name_map);
    $(attrs).each(function(index, value){
        object_attr_input_div = append_attribute(value, object_attr_input_div);
    });
    object_attr_editor_div.append(object_attr_input_div);

    //sbmt btn
    var sbmt_btn_div = $('<div>', {
                       class: 'objectattr-editor-sbmt-div'});
    var sbmt_btn = $('<button>',{
                   class: 'objectattr-editor-sbmt-btn btn btn-primary',
                   onclick: 'save_object("' + oname + '")'});
    sbmt_btn.append('Edit');
    sbmt_btn_div.append(sbmt_btn);
    object_attr_editor_div.append(sbmt_btn_div);
    $('.editor').append(object_attr_editor_div);
}


function get_page_elements(){

}


function get_object_creator(){
    var object_creator = $('<div>', {
                        class: 'objecteditor'});

    //object title div
    var title_div = $('<div>', {
                    class: 'objecteditor-title-div'});
    title_div.append('Object Editor');
    object_creator.append(title_div);

    //object selector div
    var object_selector_div = $('<div>', {
                               class: 'objecteditor-selector-div'});
    var object_selector_spn = $('<span>', {
                               class: 'objecteditor-selector-list-span'});
    var object_selector_list = $('<selector>', {
                               class: 'objecteditor-selector-list form-control'});
    var def_opt = $('<option>', {
                  class: 'objecteditor-opt'});
    def_opt.append('Object Name');
    object_selector_list.append(def_opt);
    object_selector_div.append(object_selector_list);
    var object_new_spn = $('<span>', {
                         class: 'objecteditor-selector-new-spn'});
    var object_new_btn = $('<i>', {
                         class: 'objecteditor-selector-new-btn glyphicon glyphicon-plus',
                         onclick: 'open_object_attr_editor();'});
    object_new_spn.append(object_new_btn);
    object_selector_div.append(object_new_spn);
    var object_edit_spn = $('<span>', {
                          class: 'objecteditor-edit-spn'});
    var object_edit_btn = $('<i>', {
                          class: 'objecteditor-edit-btn glyphicon glyphicon-asterisk',
                          onclick: 'open_object_attr_editor();'});
    object_edit_spn.append(object_edit_btn);
    object_selector_div.append(object_edit_spn);
    object_creator.append(object_selector_div);

    //object bottom div
    var object_btm_div = $('<div>', {
                         class: 'objectedit-btm-div'});

    var object_btm_left_div = $('<div>', {
                          class: 'objectedit-btm-left'});
    var class_list_div = $('<div>', {
                          class: 'objectedit-class-list'});
    object_btm_left_div.append(class_list_div);
    object_btm_div.append(object_btm_left_div);

    var object_btm_right_div = $('<div>', {
                                class: 'objectedit-btm-right-div'});
    var object_preview_div = $('<div>', {
                             class: 'objectedit-preview-div'});
    object_btm_right_div.append(object_preview_div);
    object_btm_div.append(object_btm_right_div);
    object_creator.append(object_btm_div);

    //edit sbmt div
    var object_sbtm_div = $('<div>', {
                          class: 'objectedit-sbmt-div'});
    var object_sbmt_btn = $('<button>', {
                          class: 'btn btn-primary'});
    object_sbmt_div.append(object_sbmt_btn);
    object_creator.append(object_sbmt_div);
    $('.editor').append(object_creator);
}
