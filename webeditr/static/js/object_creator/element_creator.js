
var preview = {
    'percent_size_reduction': .12,
}

var tag_map = {
                'name': 'name',
                'class_name': 'class',
                'perc_page_height': 'perc_page_height',
                'perc_page_width': 'perc_page_width'};
var tag_keys = Object.keys(tag_map);


function get_dimensions(tag, odict, perc_modifier=1){
    var perc_height = odict['perc_page_height'];
    var perc_width = odict['perc_page_width'];

    if(perc_height == undefined){
        perc_height = .1;
    }

    if(perc_width == undefined){
        perc_width = .1;
    }

    var height = parseFloat(perc_height) * $(window).height() * perc_modifier;
    var width = parseFloat(perc_width) * window.innerWidth * perc_modifier;
    $(tag).css('height', height+'px');
    $(tag).css('width', width+'px');
    return tag;
}


function build_tag(objects, perc_modifier=1){
    var tag = $('<'+ objects['tag_name'] +'>');
    var attr_dict = {};
    $(Object.keys(objects)).each(function(index, key){
        if(tag_keys.includes(key) == true){
            tag.attr(tag_map[key], objects[key]);
        }
    });

    if(objects['attributes'] != undefined && objects['attributes'] != null){
        var attrs = objects['attributes'];
        $(Object.keys(attrs)).each(function(index, key){
           var val = attrs[key];
           tag.attr(key, val);
        });
    }
    tag = get_dimensions(tag, objects, perc_modifier);
    return [tag, objects['children']]
}


function append_children(tag, children, perc_modifier=1){
    if(children != undefined && children != null){
        for(var i = 0; i < children.length; i++){
            var tag_arr = build_tag(children[i][1], perc_modifier);
            if(tag_arr != undefined && tag_arr[1] != undefined && tag_arr[1] != null){
                append_children(tag_arr[0], tag_arr[1], perc_modifier);
            }
            tag_arr[0].append(tag_arr[1]);
        }
    }
    return tag;
}


function get_object_preview(obj_name, perc_modifier=preview.percent_size_reduction){
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
                    var oarr = build_tag(objects, perc_modifier);
                    var root_tag = null;
                    if(oarr != undefined && oarr[1] != undefined && oarr[1] != null){
                        root_tag = append_children(oarr[0], oarr[1], perc_modifier);
                    }

                    //append to editor
                    if(root_tag != undefined && root_tag != null){
                        $('.objectedit-btm-right-div').html('');
                        var obj_div = $('<div>', {
                                      style: 'position: relative; margin-left: 10px; margin-top: 10px;'});
                        obj_div.append($(root_tag));
                        $('.objectedit-btm-right-div').append(obj_div);
                    }
                }else{
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
