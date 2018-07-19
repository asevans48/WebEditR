
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


function save_object(){

}


function delete_object(){

}


function remove_object_creator(){
    $('.objecteditor').remove();
}


function remove_attr_editor(){
    $('.object-editor-div').remove();
}


function save_object_attrs(oname){
    var inputs = $('.objectattr-inpt');
    var data = {}
    $(inputs).each(function(index, elmnt){
        var el = $(elmnt);
        var name = el.attr('name');
        var val = el.val();
        if(val != creator.attr_name_map[name]){
            data[name] = val;
        }else{
            data[name] = null;
        }
    })

    $.ajax({
        type: 'POST',
        url: '/create_or_edit_object/',
        data: data,
        success: function(data){
            if(data.success == false){
                console.log(data.msg);
                alert(data.msg);
            }else{
                var name = $('input[name="name"]').val();
                if(name != 'Object Name'){
                    $('.objecteditor-opt')
                }
            }
        }
    }).fail(function(jqXHR, textStatus){
        console.log('Failed to Create or Edit Object', textStatus);
        console.log(jqXHR);
        alert('Internal Error');
    }).then(remove_attr_editor());
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
                    class: 'objectattr-inpt',
                    name: key_name});
    attr_inpt.val(attr_name);
    inpt_div.append(attr_inpt);
    editor_div.append(inpt_div);
    return editor_div;
}


function open_object_attr_editor(){
    var object_attr_editor_div = $('.object-editor-div');
    if(object_attr_editor_div != undefined){
        object_attr_editor_div.remove();
    }
    var oname = $('.objecteditor-selector-list').val();
    object_attr_editor_div = $('<div>', {
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


function get_project_elements(object_selector_list){
    var data = {
        'project_name': project_objects.current_project,
        'project_id': project_objects.pname,
    }

    $.ajax({
        type: 'POST',
        url : '/get_element_names_by_project_id/',
        data: data,
        success: function(data){
            if(data.success = true){
                var element_names = data.elements;
                if(element_names && element_names != null){
                    $(element_names).each(function(index, value){
                        var opt = $('<option>', {
                                  class: 'objecteditor-opt'});
                        opt.val(value);
                    });
                }
            }else{
                console.log(data.msg);
                alert(data.msg);
            }
        }
    }).fail(function(jqXHR, textStatus){
        console.log('Failed to Get Project Elements ', textStatus);
        console.log(jqXHR);
        alert('Internal Error');
    });
}


function get_object_creator(){
    var object_creator = $('.objecteditor');
    if(object_creator != undefined){
        object_creator.remove();
    }
    object_creator = $('<div>', {
                     class: 'objecteditor'});

    //object title div
    var title_div = $('<div>', {
                    class: 'objecteditor-title-div'});
    var title_spn = $('<span>', {
                    class: 'objecteditor-title-spn'});
    title_spn.append('Object Editor');
    title_div.append(title_spn);
    var rem_spn = $('<span>', {
                  class: 'objecteditor-rem-spn'});
    var rem_creator_btn = $('<i>', {
                          class: 'fa fa-times objecteditor-rem-btn'});
    rem_spn.append(rem_creator_btn);
    title_div.append(rem_spn);
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
    get_project_elements(object_selector_list);
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
                          class: 'btn btn-primary objectedit-sbmt-btn',
                          onclick: 'save_object();'});
    object_sbmt_btn.append('Save');
    var object_del_btn = $('<button>', {
                         class: 'btn btn-primary objectedit-del-btn',
                         onclick: 'delete_object();'});
    object_del_btn.append('Delete');
    object_sbmt_div.append(object_sbmt_btn);
    object_creator.append(object_sbmt_div);
    $('.editor').append(object_creator);
}
