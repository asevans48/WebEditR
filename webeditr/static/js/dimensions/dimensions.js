
function get_current_dimensions(){
    var heightn = $(window).height();
    var widthn = window.innerWidth;
    var data = {width: widthn, heightn};
    return data;
}


function set_default_dimensions(start_width, base_width, end_width){
    var data = {
        'start_width': start_width,
        'base_width': base_width,
        'end_width': end_width
    }

    $.ajax({
        type: 'POST',
        url: '/set_default_dimensions/',
        data: data,
        success: function(data){
            console.log('Set Default Dimensions');
        }
    }).fail(function(jqXHR, textStatus){
        console.log('Failed to Set Default Dimensions', textStatus);
        console.log(jqXHR);
    });
}


function setup_page_dimensions(project_title, current_page){
    //by page as different page designs can get messy
    if(project_title != null && current_page != null){
        var data = {
            'project_title': project_title,
            'current_page': current_page
        }

        $.ajax({
            type: 'POST',
            url: '/get_default_page_dimensions/',
            data: data,
            success: function(data){
                if(data.success == true){
                    project_objects.default_dimensions = data.default_dimensions;
                    project_objects.page_dimensions = data.page_dimensions;
                }else{
                    console.log('Failed to Get Project Dimensions');
                    alert(data.msg);
                }
            }
        }).fail(function(jqXHR, textStatus){
            console.log('Failed to Get Project Dimensions', textStatus);
            console.log(jqXHR);
            alert('Internal Error');
            project_objects.default_dimensions = null;
            project_objects.page_dimensions = null;
        });
    }else{
        alert('Project Title Not Set!');
    }
}


function exit_dimensions(){
    $('.dimensions-div').remove();
}


function reset_dimension_inputs(){
    $('.dimension-picker-start-inpt').val('');
    $('.dimension-picker-base-inpt').val('');
    $('.dimension-picker-end-inpt').val('');
}


function add_new_dimensions(){
    if(project_objects.current_page != null){
        var start_dimension = $('.dimensions-picker-start-inpt').val();
        var base_dimension = $('.dimensions-picker-base-inpt').val();
        var end_dimension = $('.dimensions-picker-end-inpt').val();
        var project_name = $('.fsys-title-div').html();

        if(start_dimension != null && start_dimension.length > 0
           && base_dimension != null && base_dimension.length > 0
           && end_dimension != null && end_dimension.length > 0){
            var data = {
                'start_dimension': parseInt(start_dimension),
                'base_dimension': parseInt(base_dimension),
                'end_dimension': parseInt(end_dimension),
                'project_name': parseInt(project_name),
                'page_name': project_objects.current_page,
            }

            $.ajax({
                type: 'POST',
                url: '/add_dimension_by_page/',
                data: data,
                success: function(data){
                    var project_title = project_objects.project_title;
                    var pname = project_objects.pname;
                    open_project_dimensions_panel(pname, project_title);
                    setup_page_dimensions(
                                          project_objects.project_title,
                                          project_objects.current_page);
                }
            }).fail(function(jqXHR, textStatus){
                console.log('Failed', textStatus);
                console.log(jqXHR);
                alert('Internal Error');
            }).then(reset_dimension_inputs());
        }else{
            alert('Not All Dimensions Supplied');
        }
    }else{
        alert('Page Not Selected');
    }
}


function open_project_dimensions_panel(pid, project_title){
    //dimensions panel is attached to the project due to errors
    //dimensions themselves are by page
    var dim_panel = $('.dimensions-div');
    if(dim_panel != undefined && dim_panel != null){
        dim_panel.remove();
    }
    dim_panel = $('<div>', {
                class: 'dimensions-div standard-grey-gradient shadow'});
    //append items here
    var dimension_title = $('<div>', {
                          class: 'dimensions-div-title'});
    var dimension_title_spn = $('<span>', {
                              class: 'dimensions-div-title-spn'});
    dimension_title_spn.append('Dimensions');
    dimension_title.append(dimension_title_spn);
    dim_panel.append(dimension_title);
    var dimension_picker = $('<div>', {
                            class: 'dimensions-picker-div'});
    var dimension_start_inpt = $('<input>', {
                                class: 'dimensions-picker-start-inpt form-control'});
    var dimension_base_inpt = $('<input>', {
                              class: 'dimensions-picker-base-inpt form-control'});
    var dimension_end_inpt = $('<input>', {
                             class: 'dimension-picker-end-inpt form-control'});
    var add_dimension_btn = $('<i>', {
                             class: 'dimension-picker-add-btn glyphicon glyphicon-plus',
                             onclick: 'add_new_dimensions();'});
    dimension_picker.append(dimension_start_inpt);
    dimension_picker.append(dimension_base_inpt);
    dimension_picker.append(dimension_end_inpt);
    dimension_picker.append(add_dimension_btn);
    dim_panel.append(dimension_picker);
    var current_dimensions_div = $('<div>', {
                             class: 'dimensions-existing-div'});
    dim_panel.append(current_dimensions_div);
    dim_panel.draggable();
    $('.editor').append(dim_panel);
}
