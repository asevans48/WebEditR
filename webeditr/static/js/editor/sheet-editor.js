/*
Broad stylesheet and script sheet editing go here.  Panel based editing
is in another sheet.
*/


var text_edit_objects = {
    current_edited_script: null,
    current_edited_sheet: null
}


function remove_class(elmnt){
    var rem_btn = $(elmnt);
    var class_name = rem_btn.parent().parent().find('.textedit-stylesheet-class-title-spn');
    class_name = class_name.html();
    var stylesheet = $('.textedit-stylesheet-title-txt').html();
    console.log(stylesheet);
    if(class_name != undefined && stylesheet != undefined && class_name.trim().length > 0){
        var data = {
            'class_name': class_name,
            'stylesheet_name': stylesheet
        }

        $.ajax({
            type: 'POST',
            url: '/remove_stylesheet_class/',
            data: data,
            success: function(data){
                if(data.success){
                    rem_btn.parent().parent().parent().remove();
                }else{
                    console.log(data.msg);
                    alert(data.msg);
                }
            }
        }).fail(function(jqXHR, textStatus){
            console.log('Failed to Remove Class', textStatus);
            console.log(jqXHR);
        });
    }else{
        alert('Class Name or Stylesheet Name Not Found');
    }
}


function get_remove_class_btn(){
    var rem_spn = $('<span>', {
                    class: 'textedit-stylesheet-rem-class-spn'});
    var rem_spn_btn = $('<i>', {
                      class: 'textedit-stylesheet-rem-class-btn fa fa-times',
                      onclick: 'remove_class(this);'});
    rem_spn.append(rem_spn_btn);
    return rem_spn;
}


function get_add_attribute_btn(){
    var add_attr_div = $('<div>', {
                        class: 'textedit-stylesheet-add-attr-div'});
    var add_attr_btn = $('<i>', {
                        class: 'textedit-stylesheet-add-attr-btn glyphicon glyphicon-plus',
                        onclick: 'add_attribute(this);'});
    add_attr_div.append(add_attr_btn);
    return add_attr_div;
}


function exit_stylesheet_editor(elmnt){
    $(elmnt).parent().parent().parent().remove();
}


function get_remove_attribute_btn(){
    var attributes_btn_div = $('<div>', {
                             class: 'textedit-remove-attr-div'});
    var attributes_btn = $('<i>', {
                         class: 'textedit-remove-attr-btn fa fa-times',
                         onclick: 'remove_attr(this)'});
    attributes_btn_div.append(attributes_btn);
    return attributes_btn_div;
}


function on_change_class_title(elmnt){
    var title_inpt = $(elmnt);
    var title = title_inpt.val();
    if(title != undefined && title.trim().length > 0){
        var title_name = title_inpt.attr('name');
        var class_name = title_inpt.val();
        var stylesheet_title = $('.textedit-stylesheet-class-title').html();
        var data = {
            'old_class_name': title_name,
            'new_class_name': class_name,
            'style_sheet_name': stylesheet_title
        }
        console.log('Posting')
        console.log(data);
        $.ajax({
            type: 'POST',
            url: '/change_class_name/',
            data: data,
            success: function(data){
                if(data.success){
                    console.log('Re-obtaining Div');
                    var stylesheet = $('.textedit-stylesheet-title-txt').html();
                    get_stylesheet_editor_by_name(stylesheet);
                }else{
                    alert(data.msg);
                    console.log(data.msg);
                }
            }
        }).fail(function(jqXHR, textStatus){
            alert('Internal Error');
            console.log('Failed to Change Class Name', textStatus);
            console.log(jqXHR);
        });
    }else{
        alert('Title Value Not Provided');

    }
}


function edit_class_title(elmnt){
    var title_el = $(elmnt);
    var title_val = title_el.html();
    console.log('Title Element', title_val);
    title_el.html('');
    var edit_div = $('<input>', {
                   class: 'textedit-class-edit-inpt form-control',
                   name: title_val,
                   placeholder: title_val});
    edit_div.keyup(function(e){
        var key_pressed = e.keycode || e.which;
        if(key_pressed == 13){
            on_change_class_title(edit_div);
        }
    });
    console.log(edit_div);
    var parent_el = $(elmnt).parent();
    elmnt.remove();
    parent_el.prepend(edit_div);
}


function get_class_div(class_name, attrs){
    var class_div = $('<div>',{
                    class: 'textedit-stylesheet-attr-div'});
    var title_div = $('<div>', {
                    class: 'textedit-stylesheet-class-title'});
    var title_span = $('<span>', {
                    class: 'textedit-stylesheet-class-title-spn',
                    ondblclick: 'edit_class_title(this)'});
    title_span.html(class_name);
    title_div.append(title_span);
    var remove_class_button = get_remove_class_btn();
    title_div.append(remove_class_button);
    class_div.append(title_div);
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
       var attr_val_spn = $('<span>', {
                      class: 'textedit-stylesheet-attr-val',
                      ondblclick: 'on_select_edit_attr_val(this);'});
       attr_val_spn.html(attr_val);
       attr_div.append(attr_val_spn);
       attrs_div.append(attr_div);
    }
    attrs_div.append(get_add_attribute_btn())
    class_div.append(attrs_div);
    return class_div;
}


function create_attr_div(parent_el, attr_name, attr_val){
    var attr_val_name = $('<span>', {
                        class: 'textedit-stylesheet-attr-val-name',
                        ondblclick: 'on_select_edit_attr_name(this);'});
    attr_val_name.append(attr_name);
    parent_el.append(attr_val_name);
    var attr_val_colon = $('<span>', {
                         class: 'textedit-stylesheet-attr-colon'});
    attr_val_colon.html(':');
    parent_el.append(attr_val_colon);
    var val_spn = $('<span>', {
                  class: 'textedit-stylesheet-attr-val',
                  ondblclick: 'on_select_edit_attr_val(this);'});
    val_spn.append(attr_val);
    parent_el.append(val_spn);
    return parent_el;
}


function remove_attr(elmnt){
    var parent_el = elmnt.parent().parent();
    var name_el = parent_el.find('.textedit-stylesheet-attr-val-name').html();
    var val_el = parent_el.find('.textedit-stylesheet-attr-val').html();
    var class_name = parent_el.find('.textedit-stylesheet-class-title').html();
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


function get_attrs(attrs, attrs_div){
    if(attrs != undefined && attrs != null && attrs.length > 0){
        for(var i = 0; i < attrs.length; i++){
            var attribute = attrs[i];
            var name = attribute['name'];
            var val = attribute['value'];
            var attr_div = $('<div>', {
                           class: 'textedit-stylesheet-attr-div'});
        }
    }
}


function create_attr_div(class_name, attrs){
    var attr_div = $('<div>', {
                   class: 'textedit-stylesheet-attr-div'});
    var title_span = $('<span>', {
                     class: 'textedit-stylesheet-class-title'});
    title_span.html(class_name);
    attr_div.append(title_span);
    var attrs_div = $('<div>', {
                    class: 'textedit-stylesheet-attrs-div'});
    if(attrs != undefined && attrs != null && attrs.length > 0){
        attrs_div.append(get_attrs(attrs));
    }
    attr_div.append(attrs_div);
    var attr_add_div = $('<div>', {
                       class: 'textedit-stylesheet-sbmt-div'});
    var attr_add_btn = $('<i>', {
                       class: 'textedit-stylesheet-add glyphicon glyphicon-plus',
                       onclick: 'add_attribute_inputs();'});
    attr_add_div.append(attr_add_btn);
    attr_div.append(attr_add_div);
    return attr_div;
}


function submit_new_class(elmnt){
    var parent_el = $(elmnt).parent();
    var class_name = parent_el.find('.textedit-class-name-inpt').val();
    var style_sheet_name = $('.textedit-stylesheet-title-txt').html();
    var data = {
        'class_name': class_name,
        'stylesheet_name': style_sheet_name
    }

    if(class_name != null && style_sheet_name != null && class_name.trim().length > 0){
        $.ajax({
           type: 'POST',
           url: '/submit_new_class/',
           data: data,
           success: function(data){
               if(data.success){
                   parent_el.html('');
                   var attr_div = get_class_div(class_name, {})
                   parent_el.append(attr_div);
               }else{
                   console.log(data.msg);
                   alert(data.msg);
                   $(elmnt).parent().remove();
               }
           }
        }).fail(function(jqXHR, textStatus){
            console.log('Failed to Submit Class', textStatus);
            alert('Internal Error');
            $(elmnt).parent().remove();
        });
    }else{
        alert('Not All Information Provided');
        $(elmnt).parent().remove();
    }
}


function submit_new_attribute(elmnt){
    var data = {};
    var parent_el = $(elmnt).parent();
    var class_name = $('.textedit-stylesheet-class-title-spn').html();
    var name = parent_el.find('.textedit-attr-name-inpt').val();
    var val = parent_el.find('.textedit-attr-val-inpt').val();
    var sheet_name = $('.textedit-stylesheet-title-txt').html();
    if(val != undefined && val.trim().length > 0 && name != undefined && name.trim().length > 0){
        data ={
            'attr_name': name,
            'attr_val': val,
            'stylesheet_name': sheet_name,
            'class_name': class_name
        }

        $.ajax({
            type: 'POST',
            url: '/add_stylesheet_attribute/',
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
                var remove_attr = $('<span>', {
                                  class: 'textedit-remove-attr-spn'});
                var remove_attr_btn = $('<i>', {
                                      class: 'textedit-remove-attr-btn fa fa-times',
                                      onclick: 'remove_attr(this);'});
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
    $('.textedit-stylesheet-attrs-div').append(textedit_inputs_div);
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
        var attr_val_name = $('<span>', {
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


function get_edit_attrs_area(attributes){
    //attributes is a dict-like object containing kv pairs
    // of names and attributes which is kv of attr name and value
    var edit_attrs_area = $('<div>', {
                          class: 'textedit-stylesheet-edit-area'});
    for(var i = 0; i < attributes.length; i++){
        var class_name = attributes[i].name;
        var attrs = attributes[i].attributes;
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
    return stylesheet_btns_div;
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


function get_stylesheet_editor_by_name(title){
    var data = {
        'stylesheet': title
    };
    var text_edit = $('.textedit-stylesheet-div');
    if(text_edit != undefined){
        text_edit.remove();
    }

    $.ajax({
        type: "POST",
        url: '/get_stylesheet_dict/',
        data: data,
        success: function(data){
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


function get_style_sheet_editor(elmnt){
    var title = $(elmnt).html();
    get_stylesheet_editor_by_name(title);
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
    $(elmnt).parent().parent().before(attr_div);
}


function close_sheet_editor(elmnt){
    text_edit_objects.current_edited_sheet = null;
}
