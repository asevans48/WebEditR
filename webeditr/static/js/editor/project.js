
var keyo = {
    ctl_key_pressed: false,
}


function reload_project(){
    $('.editor').html('');
    var title = project_objects.current_project;
    var pname = project_objects.pname;
    load_project_assets(pname, title);
}


//load project information
function load_project_assets(pname, project_title){
        var data = {
                    'project_id': pname};
        $.ajax({
            type: 'POST',
            url: '/get_project_assets/',
            data: data,
            success: function(data){
                if(data.success){
                    project_objects.current_project = project_title;
                    project_objects.pname = pname;
                    get_page_info_div();
                    //setup dimensions panel here so that key presses don't create
                    //a ton of errors
                    open_project_dimensions_panel(
                                                  pname,
                                                  project_title);
                    $(document).keyup(function(e){
                        var key_pressed = e.keycode || e.which;
                        if(key_pressed != 17 && keyo.ctl_key_pressed == true){
                            if(key_pressed == 50){
                                var dim_div = $('.dimensions-div');
                                if(dim_div.html() == undefined || dim_div.html() == null){
                                    open_project_dimensions_panel(
                                                                  pname,
                                                                  project_title);
                                }else{
                                    dim_div.remove();
                                }
                            }else if(key_pressed == 49){
                                var fsys_div = $('.fsys-div');
                                if(fsys_div.html() == undefined || fsys_div.html() == null){
                                    open_project_file_panel(
                                                           pname,
                                                           project_title,
                                                           data);
                                }else{
                                    fsys_div.remove();
                                }
                            }else if(key_pressed == 51){
                                var pallet_div = $('.pallet-div');
                                if(pallet_div.html() == undefined || pallet_div.html() == null){
                                    open_project_pallet(
                                                        pname,
                                                        project_title);
                                }else{
                                    pallet_div.remove();
                                }
                            }else if(key_pressed == 51){
                                var pageinf_div = $('.pageinf-div');
                                if(pageinf_div.html() == undefined || pageinf_div.html() == null){
                                    get_page_info_div();
                                }else{
                                    pageinf_div.remove();
                                }
                            }else{
                                keyo.ctl_key_pressed = false;
                            }
                        }else{
                            if(key_pressed == 17){
                                keyo.ctl_key_pressed = true;
                            }else{
                                keyo.ctl_key_pressed = false;
                            }
                        }
                    });
                    open_project_file_panel(
                                            pname,
                                            project_title,
                                            data);
                    check_and_get_current_page();
                }else{
                    alert(data.msg);
                }
            }
        }).fail(function(jqXHR, textStatus){
            console.log("Request Failed" + textStatus);
            console.log(jqXHR);
        });
}


//get project information
function get_project_assets(elmnt){
    var choice_div = $(elmnt);
    var sel_div = $('.project-choice-sel');
    if(sel_div != undefined && sel_div != null){
        var pname = sel_div.val();
        var project_title = sel_div.text();
        load_project_assets(pname, project_title);
    }
}


//obtain existing projects
function get_projects(){
    var data = get_middleware_token_data();
    $.ajax({
       type: "POST",
       url: '/get_projects/',
       data: data,
       success: function(data){
            var projects = data.projects;
            var project_select = $('.project-choice-sel');
            if(projects != undefined && projects != null){
                project_select.html('');
                for(var i = 0; i < projects.length; i++){
                    var name = projects[i].name;
                    var id = projects[i].id;
                    var opt = $('<option>', {
                                 class: 'project-choice-sel-opt'});
                    opt.attr('id', id);
                    opt.attr('value', id);
                    opt.html(name);
                    project_select.append(opt);
                }
            }
       }
    }).fail(function(jqXHR, textStatus){
        console.log("Request Failed" + textStatus);
        console.log(jqXHR);
    });
}


function submit_project(elmnt){
    var np_div = $(elmnt).parent();
    var data = get_middleware_token_data();
    var pname = $('.project-name-inpt');
    var pdesc = $('.project-desc-inpt');
    data["project_name"] = pname.val();
    data["project_description"] = pdesc.val();
    $.ajax({
       type: "POST",
       url: '/submit_project/',
       data: data,
       success: function(data){
        if(data.success == false){
            console.log('Project Submit Failed '+data.msg);
            alert(data.msg);
        }else{
            get_projects();
        }
       }
    }).fail(function(jqXHR, textStatus){
        console.log("Request Failed: " + textStatus);
        console.log(jqXHR);
    }).then(get_starting_div());
}


function remove_project_add_div(elmnt){
    $(elmnt).parent().parent().remove();
}


function create_new_project(){
    var adiv = $('.project-add-div');
    if(adiv != undefined && adiv != null){
        adiv.remove();
    }

    var proj_div = $('<div>', {
                    class: 'project-add-div standard-grey-gradient'});

    var proj_title_div = $('<div>', {
                           class: 'project-title-div'});
    proj_title_div.html('New Project');
    proj_div.append(proj_title_div);

    var name_div = $('<div>',{
                    class: 'project-name-div'});
    var project_name_inpt = $('<input>',{
                    class: 'project-name-inpt form-control',
                    placeholder: 'Project Name'});
    name_div.append(project_name_inpt);

    var project_description_div = $('<div>',{
                                class: 'project-desc-div'});
    var project_description_label = $('<label>',{
                                'for': 'project-desc-inpt'});
    var project_description_inpt = $('<textarea>', {
                                    class: 'project-desc-inpt form-control',
                                    placeholder: 'Project Description'});
    project_description_div.append(project_description_label);
    project_description_div.append(project_description_inpt);

    proj_div.append(name_div);
    proj_div.append(project_description_div);

    var proj_add_btn = $('<div>', {
                        class: 'project-sbmt-div'});
    var sbmt_btn = $('<button>', {
                    class: 'project-sbmt-btn btn btn-primary',
                    onclick: 'submit_project(this);'});
    sbmt_btn.html('Create')
    proj_div.append(sbmt_btn);
    proj_div.draggable();

    var proj_remove_btn_div = $('<div>',{
                              class: 'project-add-rem-btn-div'});
    var proj_remove_btn = $('<i>', {
                            class: 'fa fa-times project-add-rem-btn',
                            onclick: 'remove_project_add_div(this);'});
    proj_remove_btn_div.append(proj_remove_btn);
    proj_div.append(proj_remove_btn_div);
    $('.editor').append(proj_div);
}


//obtains working project
function get_starting_div(){
    var add_div = $('.project-add-div');
    if(add_div != undefined && add_div != null){
        add_div.remove();
    }

    var body = $('.editor');
    var pdiv = $('project-choice-div');
    if(pdiv != undefined && pdiv != null){
        pdiv.remove();
    }
    var project_chooser = $('<div>', {
                            class: 'project-choice-div standard-grey-gradient'});

    var project_chooser_title_div = $('<div>',{
                                class: 'project-chooser-title'});
    project_chooser_title_div.html('Choose Project');
    project_chooser.append(project_chooser_title_div);


    var sel_div = $('<div>', {
                    class: 'project-choice-sel-div'});

    var project_select = $('<select>',{
                            class: 'project-choice-sel form-control'});
    get_projects();
    sel_div.append(project_select);

    var add_btn = $('<i>', {
                   class: 'project-sel-add-btn glyphicon glyphicon-plus',
                   onclick: 'create_new_project();'});
    sel_div.append(add_btn);
    project_chooser.append(sel_div);

    var ok_div = $('<div>');
    var ok_btn = $('<button>', {
                type: 'button',
                class: 'input-sel-btn form-control btn btn-primary',
                onclick: 'get_project_assets(this);'});
    ok_btn.html('Get Project');
    ok_div.append(ok_btn);
    project_chooser.append(ok_div);
    body.append(project_chooser);
}
