
//get project information
function get_project_assets(elmnt){
    var choice_div = $(elmnt);
    var sel_div = $('.project-choice-sel');
    if(sel_div != undefined && sel_div != null){
        var pname = sel_div.val();
        var project_title = sel_div.text();
        var data = {
                    'project_id': pname};
        $.ajax({
            type: 'POST',
            url: '/get_project_assets/',
            data: data,
            success: function(data){
                if(data.success){
                    open_project_file_panel(
                                            pname,
                                            project_title,
                                            data);
                }else{
                    alert(data.msg);
                }
            }
        }).fail(function(jqXHR, textStatus){
            console.log("Request Failed" + textStatus);
            console.log(jqXHR);
        });
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
        }
       }
    }).fail(function(jqXHR, textStatus){
        console.log("Request Failed: " + textStatus);
        console.log(jqXHR);
    });
    $('.project-add-div').remove();
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
    $('.editor').append(proj_div);
}


//obtains working project
function get_starting_div(){
    var body = $('.editor');
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