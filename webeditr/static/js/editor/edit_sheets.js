/*
Broad stylesheet and script sheet editing go here.  Panel based editing
is in another sheet.
*/


var text_edit_objects = {
    current_edited_script: null,
    current_edited_sheet: null
}


function remove_attr(elmnt){
    var parent_el = elmnt.parent();
    var name_el = parent_el.find('').html();
    var val_el = parent_el.find('').html();
    var class_name = parent_el.find('').html();
    var stylesheet_name = parent_el.parent().find('.textedit-stylsheet-title-txt').html();
    var data = {
        'attribute_name': name_el,
        'attribute_value': val_el,
        'class_name': class_name,
        'stylesheet_name': stylesheet_name
    }

    $.ajax({
        type: 'POST',
        url: '/remove_stylesheet_attribute/',
        data: data,
        success: function(data){
            if(data.success == true){
                parent_el.remove();
            }else{
                console.log('Failed to Remove', data);
                alert('Failed to Remove Attribute');
            }
        }
    }).fail(function(jqXHR, textStatus){
        console.log('Internal Error');
        console.log('Data: ', data);
        console.log('Failure', textStatus);
        console.log(jqXHR);
    });
}


function submit_new_class(elmnt){
    var parent_el = $(elmnt).parent();
    var class_name = parent_el.find('.textedit-class-name-inpt').val();
    var style_sheet_name = $('.textedit-stylsheet-title-txt').html();
    var data = {
        'class_name': class_name,
        'style_sheet': style_sheet_name
    }

    $.ajax({
       type: 'POST',
       url: '/submit_new_class/',
       data: data,
       sucess: function(data){
           parent_el.html('');
           var class_name = $('<div>', {
                            class: ''});
       }
    }).fail(function(jqXHR, textStatus){
        console.log('Failed to Submit Class', textStatus);
        alert('Internal Error');
        $(elmnt).parent().remove();
    });
}


function add_stylesheet_class(elmnt){
    var title_el = $('.textedit-stylesheet-title-div');
    var sheet_name = title_el.html();
}


function submit_new_attribute(elmnt){
    var data = {};
    var parent_el = $(elmnt).parent();
    var name = parent_el.find('.textedit-class-name-inpt').val();
    var val = parent_el.find('.textedit-class-val-inpt').val();
    var sheet_name = $('.textedit-stylesheet-title-div');
    if(val != undefined && val.trim().length > 0 && name != undefined && name.trim().length > 0){
        data ={
            'attribute_name': name,
            'attribute_value': val,
        }

        $.ajax({
            type: 'POST',
            url: '/submit_new_attribute/',
            data: data,
            success: function(){
                parent_el.html('');
                var attr_val_name = $('<span>',{
                                class: 'textedit-stylesheet-attr-val-name',
                                ondblclick: 'on_select_edit_attr_name(this);'});
                attr_val_name.append(new_name);
                parent_el.append(attr_val_name);
                var attr_val_colon = $('<span>', {
                             class: 'textedit-stylesheet-attr-colon'});
                attr_val_colon.html(':');
                parent_el.append(attr_val_colon);
                var val_spn = $('<span>', {
                          class: 'textedit-stylesheet-attr-val',
                          ondblclick: 'on_select_edit_attr_val(this);'});
                parent_el.append(val_spn);
                val_spn.html(val);
                parent_el.append(name_spn);
                parent_el.append(colon_spn);
                parent_el.append(val_spn);
            }
        }).fail(function(jqXHR, textStatus){
            alert('Internal Error');
            console.log('Failure', textStatus);
            console.log(jqXHR);
        });
    }else{
        alert('Name and Value Must Be Provided');
        parent_el.remove();
    }
}


function submit_style_sheet(){
    //get attributes
    var data = {};
    /*
    var attrs = attrs.find('.textedit-stylesheet-attr-div');
    var title = $('.textedit-stylesheet-title-div');
    title = title.html();
    var attr_obj = {};

    if(attrs != undefined && attrs != null){
        for(var i = 0; i < attrs.length; i++){
            var attr = attrs[i];

        }
    }

    var data = {
        'title': title,
        'attributes': attr_obj,
    }

    //submit attributes
    $.ajax({
        type: 'POST',
        url: '/submit_stylesheet/',
        data: data,
        success: function(data){
            console.log('Stylesheet Updated');
        }
    }).fail(function(jqXHR, textStatus){
        alet('Stylesheet Update Failed');
        console.log("Request Failed", textStatus);
        console.log(jqXHR);
    });

    $('textedit-stylesheet-div').remove();
    */
}


function add_attribute_inputs(){
    var textedit_inputs_div = $('<div>',{
                              class: 'textedit-stylesheet-attr-div'});
    var textedit_attr_name = $('<input>', {
        class: 'edit-inpt textedit-attr-name',
        placeholder: 'Attribute Name'});
    textedit_inputs_div.append(textedit_inputs_div);

    var textedit_attr_val = $('<input>', {
                            class: 'edit-inpt textedit-attr-val',
                            placeholder: 'Attribute Value'});
    textedit_inputs_div.append(textedit_attr_val);
    $('textedit-stylesheet-attrs-div').append(textedit_inputs_div);
}


function change_element_val(elmnt, old_val, new_val){
    $.ajax({
        type: 'POST',
        url: '/change_val/',
        data: {
            'old_val': old_val,
            'new_val': new_val,
            'sheet_name': text_edit_objects.current_edited_sheet
        },
        success: function(data){
            if(data.success == false){
                alert(data.msg);
            }
            var parent_el = $(elmnt).parent();
            $(elmnt).remove();
            var val_spn = $('<span>', {
                          class: 'textedit-stylesheet-attr-val',
                          ondblclick: 'on_select_edit_attr_val(this);'});
            parent_el.append(val_spn);
        }
    }).fail(function(jqXHR, textStatus){
       console.log("Request Failed", textStatus);
       console.log(jqXHR);
       var parent_el = $(elmnt).parent();
       $(elmnt).remove();
       var val_spn = $('<span>',{
                     class: 'textedit-stylesheet-attr-val',
                     ondblclick: 'on_select_edit_attr_val(this);'});
       parent_el.append(val_spn);
    });
}


function change_element_name(elmnt, old_name, new_name){
    $.ajax({
        type: 'POST',
        url: '/change_name/',
        data: {
            'old_name': old_name,
            'new_name': new_name
        },
        success: function(data){
            if(data.success == false){
                alert(data.msg);
            }
            var parent_el = $(elmnt).parent();
            $(elmnt).remove();
            var attr_val_name = $('<span>',{
                                class: 'textedit-stylesheet-attr-val-name',
                                ondblclick: 'on_select_edit_attr_name(this);'});
            attr_val_name.append(new_name);
            parent_el.prepend(attr_val_name);
        }
    }).fail(function(jqXHR, textStatus){
        console.log("Request Failed" + textStatus);
        console.log(jqXHR);
        var parent_el = $(elmnt).parent();
        $(elmnt).remove();
        var attr_val_name = $('<span>',{
                            class: 'textedit-stylesheet-attr-val-name',
                            ondblclick: 'on_select_edit_attr_name(this);'});
        attr_val_name.html(old_name);
        parent_el.append(attr_val_name);
    }).then(update_project_assets());
}


function on_change_element_name(elmnt){
    var new_name = elmnt.val();
    var old_name = elmnt.attr('name');
    change_elemnt_name(elmnt, old_name, new_name);
}


function on_change_element_val(elmnt){
    var new_val = elmnt.val();
    var old_val = elmnt.attr('name');
    change_element_val(elmnt, old_val, new_val);
}


function on_select_edit_attr_name(elmnt){
    var elmnt = $(elmnt);
    var parent_el = elmnt.parent();
    var old_name = elmnt.html();
    elmnt.remove();
    var name_input = $('<input>', {
                    class: 'edit-inpt textedit-attr-name'});
    name_input.keyup(function(e){
        var key_pressed = e.keycode || e.which;
        if(key_pressed == 13){
            on_change_element_name(name_input);
        }
    });
    name_input.val(old_name);
    parent_el.prepend(name_input);
}


function on_select_edit_attr_val(elmnt){
    var elmnt = $(elmnt);
    var parent_el = elmnt.parent();
    var old_val = elmnt.html();
    elmnt.remove();
    var val_input = $('<input>',{
                    class: 'edit-inpt textedit-attr-val'});
    val_input.keyup(function(e){
        var key_pressed = e.keycode || e.which;
        if(key_pressed == 13){
            on_change_element_val(val_input);
        }
    });
}


function get_class_div(class_name, attrs){
    var attr_div = $('<div>',{
                    class: 'textedit-stylesheet-attr-div'});
    var title_span = $('<span>',{
                    class: 'textedit-stylesheet-attr-txt'});
    title_span.html(class_name);
    var attrs_div = $('<div>',{
                    class: 'textedit-stylesheet-attrs-div'});
    var attr_keys = Object.keys(attrs);
    for(var i = 0; i < attr_keys.length; i++){
       var attr_name = attr_keys[i];
       var attr_val = attrs[attr_name];
       var attr_div = $('<div>', {
                        class: 'textedit-stylesheet-attr-edit-div'});
       var attr_val_name = $('<span>', {
                            class: 'textedit-stylesheet-attr-val-name',
                            ondblclick: 'on_select_edit_attr_name(this);'});
       attr_val_name.html(attr_name);
       attr_div.append(attr_val_name);
       var attr_val_colon = $('<span>', {
                             class: 'textedit-stylesheet-attr-colon'});
       attr_val_colon.html(':');
       attr_div.append(attr_val_colon);
       var attr_val = $('<span>', {
                      class: 'textedit-stylesheet-attr-val',
                      ondblclick: 'on_select_edit_attr_val(this);'});
       attr_val.html(attr_val);
       attr_div.append(attr_val);
       attrs_div.append(attr_div);
    }
}


function get_edit_attrs_area(attributes){
    //attributes is a dict-like object containing kv pairs
   // of names and attributes which is kv of attr name and value
    var edit_attrs_area = $('<div>',{
                          class: 'textedit-stylesheet-edit-area'});
    for(var i = 0; i < attributes.length; i++){
        var attribute = attributes[i];
        var class_name = attribute.name;
        var attrs = attribute.attributes;
        var class_div = get_class_div(class_name, attrs);
        edit_attrs_area.append(class_div);
    }
    return edit_attrs_area;
}


function get_add_stylesheet_btns(){
    var stylesheet_btns_div = $('<div>', {
                                class: 'textedit-stylesheet-btns'});
    var add_btn_div = $('<div>', {
                      class: 'textedit-class-add-div'});
    var add_btn = $('<i>', {
                  class: 'glyphicon glyphicon-plus textedit-add-btn',
                  onclick: 'add_class(this);'});
    add_btn_div.append(add_btn);
    stylesheet_btns_div.append(add_btn_div);
     var sheet_editor_sbmt_div = $('<div>', {
                                class: 'textedit-stylesheet-sbmt-div'});
    var sheet_edit_sbmt_btn = $('<i>', {
                                class: 'textedit-stylesheet-sbmt-btn glyphicon glyphicon-upload',
                                onclick: 'submit_style_sheet();'});
    sheet_editor_sbmt_div.append(sheet_edit_sbmt_btn);
    stylesheet_btns_div.append(sheet_editor_sbmt_div);
    return stylesheet_btns_div;
}


function exit_stylesheet_editor(elmnt){
    $(elmnt).parent().parent().parent().remove();
}


function get_stylesheet_editor_title_div(title){
    var edit_title = $('<div>', {
                      class: 'textedit-stylesheet-title-div'});
    var edit_spn = $('<span>', {
                   class: 'textedit-stylesheet-title-txt'});
    edit_spn.html(title);
    var edit_spn_type = $('<span>', {
                        class: 'textedit-stylesheet-title-type'});
    edit_spn_type.html('CSS');
    var title_exit_btn = $('<span>', {
                         class: 'textedit-stylesheet-title-exit'});
    var exit_btn = $('<i>', {
                    class: 'fa fa-times textedit-stylesheet-exit-btn',
                    onclick: 'exit_stylesheet_editor(this);'});
    title_exit_btn.append(exit_btn);
    edit_title.append(title_exit_btn);
    edit_title.append(edit_spn);
    edit_title.append(edit_spn_type);
    edit_title.append(title_exit_btn);
    return edit_title;
}


function get_style_sheet_editor(elmnt){
    var title = $(elmnt).html();
    var data = {
        'stylesheet': title
    }
    var text_edit = $('.textedit-stylesheet-div');
    if(text_edit != undefined){
        text_edit.remove();
    }

    $.ajax({
        type: "POST",
        url: '/get_stylesheet_dict/',
        data: data,
        success: function(data){
            console.log('Setting Up Stylesheet Editor');
            var edit_div = $('<div>', {
                    class: 'textedit-stylesheet-div standard-grey-gradient shadow'});
            var edit_title = get_stylesheet_editor_title_div(title);
            edit_div.append(edit_title);
            var attrs_edit_div = get_edit_attrs_area(data.sheet.classes);
            edit_div.append(attrs_edit_div);
            var add_class_btn = get_add_stylesheet_btns();
            edit_div.append(add_class_btn);
            edit_div.draggable();
            $('.editor').append(edit_div);
        }
    }).fail(function(jqXHR, textStatus){
        console.log('Failure', textStatus);
        console.log(jqXHR);
    });
}


function add_class(elmnt){
    var class_div = $('<div>', {
                    class: 'textedit-stylesheet-class-div'});
    var name_inpt = $('<input>', {
                    class: 'edit-inpt textedit-class-name-inpt form-control'});
    class_div.append(name_inpt);
    var sbmt_inpt = $('<i>', {
                class: 'glyphicon glyphicon-plus textedit-class-sbmt',
                onclick: 'submit_new_class(this);'});
    class_div.append(sbmt_inpt);
    $('.textedit-stylesheet-edit-area').append(class_div);
}


function add_attribute(elmnt){
    var attr_div = $('<div>', {
                    class: 'textedit-stylesheet-attr-div'});
    var name_inpt = $('<input>', {
                    class: 'edit-inpt textedit-attr-name-inpt form-control'});
    attr_div.append(name_inpt);
    var val_inpt = $('<input>', {
               class: 'edit-inpt textedit-attr-val-inpt form-control'});
    attr_div.append(val_inpt);
    var sbmt_inpt = $('<i>', {
                class: 'glyphicon glyphicon-plus textedit-class-attr-sbmt',
                onclick: 'submit_new_attribute(this);'});
    attr_div.append(sbmt_inpt);
    $(elmnt).parent().parent().append(attr_div);
}


function edit_function(){

}


function edit_function_name(){

}


function add_function(){

}


function get_script_sheet_editor(elmnt){
    var text_edit = $('.textedit-scriptsheet-div');
    if(text_edit != undefined){
        text_edit.remove();
    }

    var data = {};

    $.ajax({
        type: "POST",
        url: '/load_script_sheet/',
        data: data,
        success: function(data){
            var edit_div = $('<div>',{
                            class: 'textedit-scriptsheet-div'});
            var title = elmnt.html();
            $('.editor').append(edit_div);
        }
    }).fail(function(jqXHR, textStatus){
        console.log('Failure', textStatus);
        console.log(jqXHR);
    });
}


function close_sheet_editor(elmnt){
    text_edit_objects.current_edited_sheet = null;
}


function close_script_editor(elmnt){
    text_edit_objects.current_edited_script = null;
}
