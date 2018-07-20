
function build_tag(objects){
    var tag = $('<'+ objects['tag_name'] +'>');
    var attr_dict = {};
    $(Object.keys(objects)).each(function(index, key){
        if(key != 'children' && key != 'tag_name'){
            tag.attr(key, objects[key]);
        }
    });
    return [tag, objects['children']]
}


function get_dimensions(){

}


function append_children(tag, children){
    if(children != null){
        for(var i = 0; i < children.length; i++){
    
        }
    }
}


function get_object_preview(){
    var obj_name = creator.current_object_name;
    if(obj_name != null && obj_name != 'Object Name'){
        var data = {
            'object_name': obj_name,
        }

        $.ajax({
            type: 'POST',
            url: '/get_serialized_element/',
            data: data,
            success: function(data){
                if(data.success){
                    //build out tags
                    var objects = data.objects;
                    var oarr = build_tags(objects);
                    var root_tag = append(children(oarr[0], oarr[1]));

                    //append to editor
                    $('.objectedit-btm-right-div').append($(root_tag));
                }else{
                    console.log(data.msg);
                    alert(data.msg);
                }
            }
        }).fail(function(jqXHR, textStatus){
            console.log('Failed to Serialize Element', textStatus);
            console.log(jqXHR);
            alert('Internal Error');
        });
    }
}
