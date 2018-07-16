
function unload_external_script(url){

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


function load_styles(attr_dict){

}


function load_tags(attr_dict){

}
