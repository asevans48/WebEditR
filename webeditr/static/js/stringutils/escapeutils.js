
function unescape_by_element(content){
    var tdiv = $('<textarea>');
    tdiv.append(content);
    return tdiv.text();
}


function unescape_xml(content){
    var decoded = unescape_by_element(content);
    decoded = unescape(decoded);
    return decoded;
}
