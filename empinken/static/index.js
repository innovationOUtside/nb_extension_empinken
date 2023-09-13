define(['base/js/namespace', 'base/js/events', 'notebook/js/textcell', 'notebook/js/codecell'], function (Jupyter, events, textcell, codecell) {

    // add button to make codecell commentate red
    //based on https://github.com/ipython-contrib/IPython-notebook-extensions/blob/master/usability/read-only.js
    "using strict";
    
    var mod_name = 'empinken';

    var TAG_PREFIX = 'style-';

    var CodeCell = codecell.CodeCell;
    var MarkdownCell = textcell.MarkdownCell;

    var params = {
        commentate: true,
        activity: true,
        student: true,
        solution: true,
        commentate_colour: "#eda7c3",
        activity_colour: "#c8ecff",
        student_colour: "#ffffcc",
        solution_colour: "#87f287"
    };

    var typs = ['commentate', 'activity', 'student', 'solution'];

    var typs_config = {
        'commentate': {"icon": 'fa-exclamation-circle'},
        'activity':  {"icon": 'fa-tasks'},
        'student':  {"icon": 'fa-user-circle'},
        'solution':  {"icon": 'fa-pencil-square-o'}
    }

    // update params with any specified in the server's config file
    var update_params = function () {
        var config = Jupyter.notebook.config;
        for (var key in params) {
            console.log("KEY "+ key)
            if (config.data.hasOwnProperty(key))
                params[key] = config.data[key];
                console.log("PARAMSKEY "+ key +"DD"+params[key])
        }
    };

    function toggle(typ) {
        console.log("Run toggle "+typ);
        var cell = Jupyter.notebook.get_selected_cell();
        if ((cell instanceof CodeCell) || (cell instanceof MarkdownCell)) {
            if (cell.metadata.tags === undefined) {
                cell.metadata.tags = [];
            }
            // We are requesting that typ is set if it isn't set
            var tstyle = TAG_PREFIX+typ;
            var add_tag = cell.metadata.tags.indexOf(tstyle) === -1;
            if (add_tag) {
                // We can only have one style type applied so clear styles
                for (typ of typs) {
                    //console.log(_typ);
                    var anytstyle = TAG_PREFIX+typ;
                    //console.log('wtf', cell.metadata.tags, cell.metadata.tags.indexOf(anytstyle), anytstyle)
                    // Return tags that are not the anytsyle tag
                    cell.metadata.tags = cell.metadata.tags.filter(x => x != anytstyle);
                    //console.log('wtf2', cell.metadata.tags)
                }
                //console.log('should be empty',cell.metadata.tags)
                // Add style tag and no longer support metadata tag
                //cell.metadata[typ] = true;
                cell.metadata.tags.push(tstyle);
            } else {
                // Remove all instances of it
                cell.metadata.tags = cell.metadata.tags.filter(x => x != tstyle);
            }
            // If tags list is empty, remove it
            if (cell.metadata.tags.length === 0) {
                delete cell.metadata.tags;
            }
            for (typ of typs)
                setcommentate(cell, typ);
        }
    };
    /*
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
    function togglesolution() {
        console.log("Run togglesolution");
        toggle('solution')
    };
    */
    var setcommentate = function (cell,typ) {
        var cp = cell.element;
        var prompt = cell.element.find('div.inner_cell');
        var tstyle = TAG_PREFIX+typ;
        var style_me = cell.metadata.tags.indexOf(tstyle) > -1;
        //console.log("Run setcommentate", style_me, tstyle, cell.metadata.tags);
        if (cell instanceof CodeCell) {
            if (style_me) {
                cp.addClass('ou_'+typ+'_outer');
                prompt.addClass('ou_'+typ+'_prompt');
            } else {
                cp.removeClass('ou_'+typ+'_outer');
                prompt.removeClass('ou_'+typ+'_prompt');
            }
        } else if (cell instanceof MarkdownCell) {
            if (style_me) {
                cp.addClass('ou_'+typ+'_outer');
            } else {
                cp.removeClass('ou_'+typ+'_outer');
            }
        }
    }


    function oustyle_notebook_commentate() {

        //console.log("Run oustyle_notebook_commentate");
        /* loop through notebook and set style of commentate cell defined in metadata */
        var cells = Jupyter.notebook.get_cells();
        for (var i in cells) {
            //console.log(i)
            var cell = cells[i];
            if ((cell instanceof CodeCell) || (cell instanceof MarkdownCell)) {
                for (_typ of typs) {
                    //console.log(_typ)
                    var tstyle = TAG_PREFIX+_typ;
                    var oldstyle = 'style_'+_typ;
                    //Legacy handler
                    if ((_typ in cell.metadata)) {
                        //console.log('got one...')
                        //Update legacy style to tagstyle
                        // Even though only one type should be set it may be multiple ones are incorrectly set?
                        // That would need handling?
                        if (!('tags' in cell.metadata))
                            cell.metadata.tags = new Array();
                        if ((cell.metadata[_typ] == true) && (cell.metadata.tags.indexOf(tstyle) === -1))
                            cell.metadata.tags.push(tstyle);
                            //cell.metadata.splice(cell.metadata.indexOf(_typ), 1);
                            delete cell.metadata[_typ];
                    }
                    if (('tags' in cell.metadata) && (cell.metadata.tags.indexOf(oldstyle) > -1)) {
                        cell.metadata.tags.splice(cell.metadata.tags.indexOf(oldstyle), 1);
                        //delete cell.metadata.tags[oldstyle];
                        if (cell.metadata.tags.indexOf(tstyle) === -1)
                            cell.metadata.tags.push(tstyle);
                    }
                    if (('tags' in cell.metadata) && (cell.metadata.tags.indexOf(tstyle) > -1)) {
                        //console.log('got one tags...', cell.metadata, cell.metadata.tags)
                        setcommentate(cell, _typ);
                    }
                }
            }
        };
    }

    //https://stackoverflow.com/a/10000178/454773
    function handleToggle(passedInElement) {
        return function() {
            toggle(passedInElement); 
        };
    }
    var initialize = function () {

        $.extend(true, params, Jupyter.notebook.config.data.empinken);
        
        var layout_cell_color = function () {
            for (_typ of typs) {
                var style = document.createElement("style");
                style.innerHTML = ".ou_"+_typ+"_outer {background-color: "+params[_typ+'_colour']+";}; .ou_commentate_prompt {background-color: "+params[_typ+'_colour']+";};";
                document.getElementsByTagName("head")[0].appendChild(style);
            }
        }

        layout_cell_color();
        update_params();
        var keys = [];
        console.log("SOLUTION"+params['empinken_solution'])
        for (_typ of typs){
            if (params[_typ]) {
                keys.push(Jupyter.keyboard_manager.actions.register ({
                    help : 'Toggle cell '+_typ,
                    icon : typs_config[_typ]['icon'],
                    handler : handleToggle(_typ)
                    }, 'empinken-'+_typ, mod_name))
            }  
        }
        /*if (params['solution'])
            keys.push(Jupyter.keyboard_manager.actions.register ({
                        help : 'Toggle cell solution',
                        icon : 'fa-pencil-square-o',
                        handler : togglesolution
                        }, 'empinken-solution', mod_name))
        if (params['commentate'])
            keys.push(Jupyter.keyboard_manager.actions.register ({
                        help : 'Toggle cell comment',
                        icon : 'fa-exclamation-circle',
                        handler : togglecommentate
                        }, 'empinken-commentate', mod_name),)
        if (params['activity'])
            keys.push(Jupyter.keyboard_manager.actions.register ({
                        help : 'Toggle cell activity',
                        icon : 'fa-tasks',
                        handler : toggleactivity
                        }, 'empinken-activity', mod_name))
        if (params['student'])
            keys.push(Jupyter.keyboard_manager.actions.register ({
                help : 'Toggle cell student',
                icon : 'fa-user-circle',
                handler : togglestudent
            }, 'empinken-student', mod_name))
            */
        Jupyter.toolbar.add_buttons_group(keys);

        oustyle_notebook_commentate();
    }

    function load_jupyter_extension() {
        //return Jupyter.notebook.config.loaded
         //   .then( function(){
         //       $.extend(true, params, Jupyter.notebook.config.data.empinken); // update params
         //   } )
         //   .then(initialize);
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
