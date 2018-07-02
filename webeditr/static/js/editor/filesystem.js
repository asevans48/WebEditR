
function open_project_file_panel(pname){
    var pcdiv = $('.project-choice-div');
    if(pcdiv != undefined && pcdiv != null){
        pcdiv.remove();
    }

    //file system div
    var fsysdiv = $('<div>',{
                    class: 'fsys-div'});
    fsysdiv.draggable();

    //file system title
    var fsys_title = $('<div>',{
                        class: 'fsys-tite-div'});
    fsys_title.html(pname)

    //file system files
    var fsysdiv_files = $('<div>', {
                    class: 'fsys-files-div'});
    var assets = project.project_assets;
}