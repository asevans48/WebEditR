
function get_current_dimensions(){
    var heightn = $(window).height();
    var widthn = window.innerWidth;
    var data = {width: widthn, heightn};
    return data;
}


function remove_dimension(elmnt){
    var parent_el = $(elmnt).parent().parent();
    var start_width = parent_el.find('.dimensions-start-spn').html();
    var base_width = parent_el.find('.dimensions-base-spn').html();
    var end_width = parent_el.find('.dimensions-end-spn').html();
    var page_name = project_objects.current_page;
    var data = {
        'start_width': parseInt(start_width),
        'base_width': parseInt(base_width),
        'end_width': parseInt(end_width),
        'page_name': page_name
    }

    $.ajax({
        type: 'POST',
        url: '/remove_dimension_by_page/',
        data: data,
        success: function(data){
            if(data.success){
                setup_page_dimensions(project_objects.current_project, project_objects.current_page);
            }else{
                console.log(data.msg)
                alert(data.msg)
            }
        }
    }).fail(function(jqXHR, textStatus){
        console.log('Failed to Remove Dimension', textStatus);
        console.log(jqXHR);
        alert('Internal Error')
    });
}


function setup_page_dimensions(project_title, current_page){
    //by page as different page designs can get messy
    if(project_title != null && current_page != null){
        var data = {
            'project_title': project_title,
            'current_page': current_page
        }

        var dim_div = $('.dimensions-existing-div');
        if(dim_div != undefined && dim_div.html() != undefined){
            dim_div.html('');
        }

        $.ajax({
            type: 'POST',
            url: '/get_dimensions_by_page/',
            data: data,
            success: function(data){
                    if(data.success){
                        project_objects.page_dimensions = data.page_dimensions;
                        if(project_objects.page_dimensions.length > 0){
                            for(var i = 0; i < project_objects.page_dimensions.length; i++){
                                var dimension = project_objects.page_dimensions[i];
                                var start_width = dimension.start_width;
                                var base_width = dimension.base_width;
                                var end_width = dimension.end_width;
                                var arrow_spn = $('<span>', {
                                                class: 'dimensions-dash-spn dimensions-spn glyphicon glyphicon-arrow-right'});
                                var dim_div = $('<div>', {
                                               class: 'dimensions-dim-div'});
                                var start_spn = $('<span>', {
                                                class: 'dimensions-start-spn dimensions-spn'});
                                start_spn.html(start_width);
                                var base_spn = $('<span>', {
                                                 class: 'dimensions-base-spn dimensions-spn'});
                                base_spn.html(base_width);
                                var end_spn = $('<span>', {
                                                class: 'dimensions-end-spn dimensions-spn'});
                                end_spn.html(end_width);
                                var rem_spn = $('<span>', {
                                              class: 'dimensions-rem-spn dimensions-spn'});
                                var rem_btn = $('<i>', {
                                              class: 'dimensions-rem-btn fa fa-times',
                                              onclick: 'remove_dimension(this);'});
                                dim_div.append(start_spn);
                                dim_div.append(arrow_spn);
                                dim_div.append(base_spn);
                                dim_div.append(arrow_spn.clone());
                                dim_div.append(end_spn);
                                dim_div.append(rem_btn);
                                $('.dimensions-existing-div').append(dim_div);
                            }
                        }
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
        alert('Project Title or Current Page Not Set!');
    }
}


function exit_dimensions(){
    $('.dimensions-div').remove();
}


function reset_dimension_inputs(){
    $('.dimensions-picker-start-inpt').val('');
    $('.dimensions-picker-base-inpt').val('');
    $('.dimensions-picker-end-inpt').val('');
    setup_page_dimensions(project_objects.current_project, project_objects.current_page);
}


function add_new_dimensions(){
    if(project_objects.current_page != null){
        console.log($('.dimensions-picker-start-inpt').val());
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
                'page_name': project_objects.current_page,
            }

            $.ajax({
                type: 'POST',
                url: '/add_dimension_by_page/',
                data: data,
                success: function(data){
                    var project_title = project_objects.current_project;
                    var pname = project_objects.pname;
                    open_project_dimensions_panel(pname, project_title);
                    setup_page_dimensions(
                                          project_objects.current_project,
                                          project_objects.current_page);
                }
            }).fail(function(jqXHR, textStatus){
                console.log('Failed', textStatus);
                console.log(jqXHR);
                alert('Internal Error');
            }).then(reset_dimension_inputs());
        }else{
            alert('Not All Dimensions Supplied');
            reset_dimension_inputs();
        }
    }else{
        alert('Page Not Selected');
        reset_dimension_inputs();
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
                                class: 'dimensions-picker-start-inpt form-control',
                                placeholder: 'Min Width'});
    var dimension_base_inpt = $('<input>', {
                              class: 'dimensions-picker-base-inpt form-control',
                              placeholder: 'Base Width'});
    var dimension_end_inpt = $('<input>', {
                             class: 'dimensions-picker-end-inpt form-control',
                             placeholder: 'End Width'});
    var add_dimension_btn = $('<i>', {
                             class: 'dimension-picker-add-btn glyphicon glyphicon-plus',
                             onclick: 'add_new_dimensions();'});
    dimension_picker.append(dimension_start_inpt);
    dimension_picker.append(dimension_base_inpt);
    dimension_picker.append(dimension_end_inpt);
    dimension_picker.append(add_dimension_btn);
    dim_panel.append(dimension_picker);
    var existing_dimensions_div = $('<div>', {
                             class: 'dimensions-existing-div'});
    dim_panel.append(existing_dimensions_div);
    dim_panel.draggable();
    $('.editor').append(dim_panel);
}
