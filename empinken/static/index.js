define(['base/js/namespace', 'base/js/events', 'notebook/js/textcell', 'notebook/js/codecell'], function (Jupyter, events, textcell, codecell) {

    // add button to make codecell commentate red
    //based on https://github.com/ipython-contrib/IPython-notebook-extensions/blob/master/usability/read-only.js
    "using strict";
    
    var mod_name = 'empinken';

    var CodeCell = codecell.CodeCell;
    var MarkdownCell = textcell.MarkdownCell;

    var params = {
        empinken_pink: true,
        empinken_blue: false
    };

    var typs = ['commentate', 'activity', 'student'];

    // update params with any specified in the server's config file
    var update_params = function () {
        var config = Jupyter.notebook.config;
        for (var key in params) {
            if (config.data.hasOwnProperty(key))
                params[key] = config.data[key];
        }
    };

    function toggle(typ) {
        console.log("Run toggle");
        var cell = Jupyter.notebook.get_selected_cell();
        if ((cell instanceof CodeCell) || (cell instanceof MarkdownCell)) {
            if (!(typ in cell.metadata)) {
                for (var _typ in typs) {
                    if (_typ in cell.metadata)
                        delete cell.metadata[_typ];
                }
                cell.metadata[typ] = true;
            } else delete cell.metadata[typ]; //cell.metadata.commentate = !cell.metadata.commentate
            setcommentate(cell, typ);
        }
    };
    function togglecommentate() {
        console.log("Run togglecommentate");
        toggle('commentate')
    };
    function toggleactivity() {
        console.log("Run toggleactivity");
        toggle('activity')
    };
    function togglestudent() {
        console.log("Run togglestudent");
        toggle('student')
    };

    var setcommentate = function (cell,typ) {
        console.log("Run setcommentate");
        var cp = cell.element;
        var prompt = cell.element.find('div.inner_cell');
        if (cell instanceof CodeCell) {
            if ((typ in cell.metadata) && cell.metadata[typ] == true) {
                cp.addClass('ou_'+typ+'_outer');
                prompt.addClass('ou_'+typ+'_prompt');
            } else {
                cp.removeClass('ou_'+typ+'_outer');
                prompt.removeClass('ou_'+typ+'_prompt');
            }
        } else if (cell instanceof MarkdownCell) {
            if ((typ in cell.metadata) && cell.metadata[typ] == true) {
                cp.addClass('ou_'+typ+'_outer');
            } else {
                cp.removeClass('ou_'+typ+'_outer');
            }
        }
    }


    function oustyle_notebook_commentate() {

        console.log("Run oustyle_notebook_commentate");
        /* loop through notebook and set style of commentate cell defined in metadata */
        var cells = Jupyter.notebook.get_cells();
        for (var i in cells) {
            console.log(i)
            var cell = cells[i];
            if ((cell instanceof CodeCell) || (cell instanceof MarkdownCell)) {
                for (_typ of typs) {
                    console.log(_typ)
                    if (_typ in cell.metadata) {
                        console.log('got one...')
                        setcommentate(cell, _typ);
                    }
                }
            }
        };
    }


    var initialize = function () {
        var layout_cell_color = function () {
            var style = document.createElement("style");
            style.innerHTML = ".ou_student_outer {background-color: #ffffcc;}; .ou_student_prompt {background-color: #ffeecd;};";
            document.getElementsByTagName("head")[0].appendChild(style);

            style = document.createElement("style");
            style.innerHTML = ".ou_commentate_outer {background-color: #eda7c3;}; .ou_commentate_prompt {background-color: #f4cadb;};";
            document.getElementsByTagName("head")[0].appendChild(style);

            style = document.createElement("style");
            style.innerHTML = ".ou_activity_outer {background-color: #c8ecff;}; .ou_activity_prompt {background-color: #ecf6ff;};";
            document.getElementsByTagName("head")[0].appendChild(style);

        }

        layout_cell_color();
        update_params();
        Jupyter.toolbar.add_buttons_group([
            Jupyter.keyboard_manager.actions.register ({
                help : 'Toggle cell comment',
                icon : 'fa-exclamation-circle',
                handler : togglecommentate
            }, 'empinken-commentate', mod_name),
            Jupyter.keyboard_manager.actions.register ({
                help : 'Toggle cell activity',
                icon : 'fa-tasks',
                handler : toggleactivity
            }, 'empinken-activity', mod_name),
            Jupyter.keyboard_manager.actions.register ({
                help : 'Toggle cell student',
                icon : 'fa-user-circle',
                handler : togglestudent
            }, 'empinken-student', mod_name)
        ]);

        oustyle_notebook_commentate();
    }

    function load_jupyter_extension() {
        //return Jupyter.notebook.config.loaded.then(initialize);
        if (Jupyter.notebook !== undefined && Jupyter.notebook._fully_loaded) {
            // notebook already loaded. Update directly
            initialize();
        }
        events.on("notebook_loaded.Notebook", initialize);
    }

    return {
        'load_ipython_extension': load_jupyter_extension,
        'load_jupyter_extension': load_jupyter_extension
    };

})