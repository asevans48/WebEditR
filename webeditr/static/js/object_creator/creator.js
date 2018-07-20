
var creator = {
    current_object_name: null,
    current_object_attributes: {},
    attr_name_map: {
                    'name': 'Object Name',
                    'id_attr': 'ID Attribute',
                    'name_attr': 'Name Attribute',
                    'tag_name': 'Tag Name',
                    'class_name': 'Class Name',
                    'description': 'Description',
                    'attributes': 'Attributes',
                    'perc_page_height': 'Percent Page Height',
                    'perc_page_width': 'Percent Page Width',
                    'content': 'Inner HTML'},
}


function handle_object_select(){
    var sel_list = $('.objecteditor-selector-list');
    var obj_name = sel_list.find(':selected').text();
    if(obj_name != undefined && obj_name != 'Object Name'){
        creator.current_object_name = obj_name;
        get_object_attributes();
        build_class_list();
    }else{
        creator.current_object_name = null;
        creator.current_object_attributes = {};
    }
}


function get_object_attributes(){
    if(creator.current_object_name != null){
        var data = {
            'object_name': creator.current_object_name,
        }

        $.ajax({
            type: 'POST',
            url: '/get_object_details/',
            data: data,
            success: function(data){
                if(data.success == true){
                    creator.current_object_attributes = data.el_dict;
                }else{
                    console.log(data.msg);
                    alert(data.msg);
                    creator.current_object_attributes = {};
                }
            }
        }).fail(function(jqXHR, textStatus){
           console.log('Failed to Get Object Attributes', textStatus);
           console.log(jqXHR);
           alert('Internal Error');
        });
    }
}


function add_class_to_object(){
    var class_name = $('.objecteditor-class-sel').find(':selected').text();
    if(creator.current_object_name != null && creator.current_object_name != 'Object Name'){
        var data = {
                   'object_name': creator.current_object_name,
                   'class_name': class_name,
                   'project_name': project_objects.current_project,
                   'project_id': project_objects.pname,
                   'page_name': project_objects.current_page};
        console.log(data);
        $.ajax({
            type: 'POST',
            url: '/add_class_to_element/',
            data: data,
            success: function(data){
                if(data.success){
                    // add to class list
                    build_class_list();
                }else{
                    console.log(data.msg);
                    alert(data.msg);
                }
            }
        }).fail(function(jqXHR, textStatus){
            console.log('Add Class To Element', textStatus);
            console.log(jqXHR);
            alert('Internal Error');
        });
    }
}


function build_class_list(class_list_div=$('.objectedit-class-list')){
    class_list_div.html('');
    console.log(class_list_div);
    var obj_name = creator.current_object_name;
    if(obj_name != undefined && obj_name != null){
        if(obj_name != 'Object Name'){
            var data = {
                'object_name': obj_name,
            }

            $.ajax({
                type: 'POST',
                url: '/get_element_classes/',
                data: data,
                success: function(data){
                    if(data.success == true){
                        var classes = data.class_names;
                        $(classes).each(function(index, value){
                            var class_div = $('<div>', {
                                            class: 'objecteditor-class-div'});
                            var class_div_spn = $('<span>', {
                                                 class: 'objecteditor-class-name-spn'});
                            class_div_spn.append(value);
                            class_div.append(class_div_spn);
                            var class_rem_spn = $('<span>', {
                                                class: 'objecteditor-class-rem-spn'});
                            var class_rem_btn = $('<i>', {
                                                class: 'objecteditor-class-rem-btn fa fa-times'});
                            class_rem_spn.append(class_rem_btn);
                            class_div.append(class_rem_spn);
                            $(class_list_div).append(class_div);
                        });
                    }else{
                        console.log(data.msg);
                        alert(data.msg);
                    }
                }
            }).fail(function(jqXHR, textStatus){
               console.log('Failed to Get Classes', textStatus);
               console.log(jqXHR);
               alert('Internal Error');
            });
        }
    }
}


function submit_object_classes(obj_name){
    if(obj_name != 'Object Name'){
        var class_list = $('.class-list');
        var classes = [];
        class_list.each(function(){
            var el = $(this);
            var class_name = el.attr('name');
            classes.push(class_name);
        });

        var data = {
            'project_id': project_objects.pname,
            'project_name': project_objects.current_project,
            'object_name': obj_name,
            'classes': classes,
        }

        $.ajax({
            type: 'POST',
            url: '/set_object_classes/',
            data: data,
            success: function(data){
                if(data.success == false){
                    console.log(data.msg);
                    alert(data.msg);
                }
            }
        }).fail(function(jqXHR, textStatus){
            console.log('Failed to Save Classes', textStatus);
            console.log(jqXHR);
            alert('Internal Error');
        });
    }
}


function save_object(){
    //saves classes associated to the object
    var obj_name = creator.current_object_name;
    submit_object_classes(obj_name);
}


function submit_object_attrs(oname, append=true){
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
    data['project_id'] = project_objects.pname;
    data['project_name'] = project_objects.current_project;
    data['page_name'] = project_objects.current_page;
    $.ajax({
        type: 'POST',
        url: '/create_or_edit_object/',
        data: data,
        success: function(rdata){
            if(rdata.success == false){
                console.log(rdata.msg);
                alert(rdata.msg);
            }else{
                console.log(data);
                var name = data['name'];
                if(name != 'Object Name'){
                    var contains_name = false;
                    $('.objecteditor-opt').each(function(){
                        if($(this).text() == name){
                            contains_name = true;
                        }
                    });

                    if(contains_name == false){
                        var opt = $('<option>', {
                                  class: 'objecteditor-opt'});
                        opt.append(name)
                        opt.val(name);
                        $('.objecteditor-selector-list').prepend(opt);
                    }
                }
            }
        }
    }).fail(function(jqXHR, textStatus){
        console.log('Failed to Create or Edit Object', textStatus);
        console.log(jqXHR);
        alert('Internal Error');
    }).then(remove_attr_editor());
}


function edit_object(){
    try{
        var obj_name = $('input[name="name"]').val();
        if(obj_name != 'Object Name'){
            submit_object_attrs(obj_name, false);
        }
    }catch(err){
        console.log('Failed to Edit Object Attrs')
        alert(err.message);
    }
    $('.objectattr-editor-div').remove();
}


function delete_object(){
    var obj_name = creator.current_object_name;
    if(obj_name != undefined && obj_name != null){
        if(obj_name != 'Object Name'){
            var data = {
                'project_id': project_objects.pname,
                'project_name': project_objects.current_project,
                'object_name': obj_name,
            }
            console.log(data);
            $.ajax({
                type: 'POST',
                url: '/remove_object/',
                data: data,
                success: function(data){
                    if(data.success == true){
                        $('option[value="'+obj_name+'"]').remove();
                        creator.current_object_name = null;
                        creator.current_object_attributes = {};
                    }else{
                        console.log(data.msg);
                        alert(data.msg);
                    }
                }
            }).fail(function(jqXHR, textStatus){
                console.log('Failed to Remove Object', textStatus);
                console.log(jqXHR);
                alert('Internal Error');
            });
        }
    }
}


function remove_object_creator(){
    $('.objecteditor').remove();
}


function remove_attr_editor(){
    $('.object-editor-div').remove();
}


function tag_name_handler(elmnt){
    var attr_name = $(elmnt).val();
}


function build_project_class_list(project_class_list){
    var proj_name = project_objects.current_project;
    var pname = project_objects.pname;
    var data = {
        'project_name': proj_name,
        'project_id': pname,
    }

    $.ajax({
        type: 'POST',
        url: '/get_class_names_by_project_id/',
        data: data,
        success: function(data){
            if(data.success){
                var pclasses = data.class_names;
                if(pclasses != undefined && pclasses != null){
                    $(pclasses).each(function(index, name){
                        var opt = $('<option>', {
                                   class: 'project-class-list-opt'});
                        opt.val(name);
                        opt.append(name);
                        project_class_list.append(opt);
                    });
                }
            }else{
                console.log(data.msg);
                alert(data.msg);
            }
        }
    }).fail(function(jqXHR, textStatus){
        console.log('Failed to Get Project Classes', textStatus)
        console.log(jqXHR);
        alert('Internal Error');
    });
    return project_class_list;
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
    var attr_inpt = null;
    if(key_name != 'tag_name' && key_name != 'content'){
        attr_inpt = $('<input>', {
                    class: 'objectattr-inpt form-control',
                    name: key_name});
        attr_inpt.val(attr_name);
    }else if(key_name == 'content'){
        attr_inpt = $('<textarea>', {
            class: 'objectattr-tarea form-control',
            name: key_name,
        });
        attr_inpt.append('Inner HTML');
    }else{
        attr_inpt = $('<select>', {
                    class: 'objectattr-inpt form-control',
                    name: key_name,
                    placeholder: 'Tag Name'});
        var opts = ['div', 'input', 'iframe', 'img', 'p', 'span', 'address', 'embed', 'article', 'aside', 'audio', 'svg', 'blockquote', 'button', 'i', 'cite', 'table', 'em', 'picture', 'pre', 'section', 'select', 'ul', 'ol']
        $(opts).each(function(index, tag_name){
            var opt = $('<option>', {
                      class: 'object-attr-option'});
            opt.val(tag_name);
            opt.append(tag_name);
            attr_inpt.append(opt);
        });
        attr_inpt.change(tag_name_handler(attr_inpt));
    }
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
                             class: 'objectattr-editor-div  standard-grey-gradient shadow'});

    object_attr_editor_div.draggable();
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
                   onclick: 'edit_object()'});
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
                        opt.append(value);
                        object_selector_list.append(opt);
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
    if(project_objects.current_page != null){
        var object_creator = $('.objecteditor');
        if(object_creator != undefined){
            object_creator.remove();
        }
        object_creator = $('<div>', {
                         class: 'objecteditor standard-grey-gradient shadow'});
        object_creator.draggable();
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
                              class: 'fa fa-times objecteditor-rem-btn',
                              onclick: 'remove_object_creator();'});
        rem_spn.append(rem_creator_btn);
        title_div.append(rem_spn);
        object_creator.append(title_div);

        //object selector div
        var object_selector_div = $('<div>', {
                                   class: 'objecteditor-selector-div'});
        var object_selector_spn = $('<span>', {
                                   class: 'objecteditor-selector-list-span'});
        var object_selector_list = $('<select>', {
                                   class: 'objecteditor-selector-list form-control'});
        var def_opt = $('<option>', {
                      class: 'objecteditor-opt'});
        def_opt.val('Object Name');
        def_opt.append('Object Name');
        object_selector_list.append(def_opt);
        get_project_elements(object_selector_list);
        object_selector_spn.append(object_selector_list);
        object_selector_div.append(object_selector_spn);
        object_selector_list.change(handle_object_select);
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


        var project_class_div = $('<div>', {
                                class: 'objecteditor-class-sel-div'});
        var project_class_list_spn = $('<span>', {
                                     class: 'objecteditor-class-sel-spn'});
        var project_class_list = $('<select>', {
                                 class: 'objecteditor-class-sel form-control'});
        project_class_list = build_project_class_list(project_class_list);
        project_class_list_spn.append(project_class_list);
        project_class_div.append(project_class_list_spn);

        var object_new_spn = $('<span>', {
                             class: 'objecteditor-selector-new-spn'});
        var object_new_btn = $('<i>', {
                             class: 'objecteditor-selector-new-btn glyphicon glyphicon-plus',
                             onclick: 'add_class_to_object();'});
        object_new_spn.append(object_new_btn);
        project_class_div.append(object_new_spn);

        object_creator.append(project_class_div);

        //object bottom div
        var object_btm_div = $('<div>', {
                             class: 'objectedit-btm-div'});

        var object_btm_left_div = $('<div>', {
                              class: 'objectedit-btm-left'});
        var class_list_div = $('<div>', {
                              class: 'objectedit-class-list'});
        build_class_list(class_list_div);
        object_btm_left_div.append(class_list_div);
        object_btm_div.append(object_btm_left_div);
        object_creator.append(object_btm_left_div);

        var object_btm_right_div = $('<div>', {
                                    class: 'objectedit-btm-right-div'});
        var object_preview_div = $('<div>', {
                                 class: 'objectedit-preview-div'});
        object_btm_right_div.append(object_preview_div);
        object_btm_div.append(object_btm_right_div);
        object_creator.append(object_btm_div);

        //edit sbmt div
        var object_sbmt_div = $('<div>', {
                              class: 'objecteditor-sbmt-div'});
        var object_sbmt_btn = $('<button>', {
                              class: 'btn btn-primary objecteditor-sbmt-btn',
                              onclick: 'save_object();'});
        object_sbmt_btn.append('Save');
        var object_del_btn = $('<button>', {
                             class: 'btn btn-primary objecteditor-del-btn',
                             onclick: 'delete_object();'});
        object_del_btn.append('Delete');
        object_sbmt_div.append(object_sbmt_btn);
        object_sbmt_div.append(object_del_btn);
        object_creator.append(object_sbmt_div);
        $('.editor').append(object_creator);
    }else{
        alert('Current Page Is Null!');
    }
}
