
function unload_javascript(){
    //get project
    var pdiv =  $('.page-inf-title-div')
    var project = pdiv.html();
    var pname = pdiv.attr('id');

    //get page
    var current_page = $('.page-inf-div').html();

    //refresh page
    window.location.assign('/?project='+project.replace(/\s+/g,'+')+'&page='+page.replace(/\s+/g,'+')+'&pname='+pname);
}


function load_external_script(attr_dict){
    var url = attr_dict;
    $.ajax({
        url: url,
        dataType: 'script',
        success: function(data){
            console.log('Loaded Script');
        }
    }).fail(function(jqXHR, textStatus){
        console.log('Failed to Load Script', textStatus);
        console.log(jqXHR);
    });
}


function unload_external_css(css_id){
    var link = $('link[id='+css_id+']');
    if(link != undefined && link != null){
        link.prop('disabled', true);
    }
}


function create_external_css_tag(css_id, url){
    var link = $('link[id='+css_id+']');
    if(link != undefined && link != null){
        link.prop('disabled', true);
        link.remove();
    }
    link = $('<link>'. {rel: 'stylesheet', id: css_id, type: 'text/css'});
    link.prop('disabled', false);
    $('head').append(link);
}


function unload_dynamic_script(script_type, id){
    var tag_sel = script_type+'[name="dynamic_'+script_type+'"][id='+id+']';
    var tag = $(tag_sel);
    if(tag != undefined && tag != null){
        tag.remove();
    }else{
        alert('Tag Not Found');
    }
}


function load_dynamic_script(tag_type, id, code, script_type, location=$('head')){
    var tag = $(tag_type, {id: id, name: 'dynamic_'+script_type});
    tag.append(code);
    location.append(tag);
}


function load_dynamic_js(id, code, location=$('head')){
    load_dynamic_script('<script>', id, code, 'js', location);
}


function load_dynamic_css(id, code, location=$('head')){
    load_dynamic_script('<style>', id, code, 'css', location);
}
