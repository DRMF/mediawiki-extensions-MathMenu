/*
    JOBAD 3 UI Functions
    JOBAD.ui.folding.js
    
    requires: 
        JOBAD.core.js
        JOBAD.ui.js
        
    Copyright (C) 2013 KWARC Group <kwarc.info>
    
    This file is part of JOBAD.
    
    JOBAD is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.
    
    JOBAD is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.
    
    You should have received a copy of the GNU General Public License
    along with JOBAD.  If not, see <http://www.gnu.org/licenses/>.
*/

//JOAD UI Folding Namespace
JOBAD.UI.Folding = {};

//Folding config
JOBAD.UI.Folding.config = {
    "placeHolderHeightMin": 20, //minmum height of the placholder in pixels
    "placeHolderPercent": 10, //percentage of opriginal height to use
    "placeHolderHeightMax": 100, //maxiumum height of the placholder in pixels
    "placeHolderContent": "<p>Click to unfold me. </p>" //jquery ish stuff in the placholder
}

/*
    Enables folding on an element
    @param element      Element to enable folding on. 
    @param config       Configuration. 
        config.enable       Callback on enable. 
        config.disable      Callback on disable
        config.fold         Callback on folding
        config.unfold       Callback on unfold
        config.stateChange  Callback on state change. 
        config.align        Alignment of the folding. Either 'left' (default) or 'right'.  
        config.update       Called every time the folding UI is updated. 
*/

JOBAD.UI.Folding.enable = function(element, config){

    var element = (element instanceof jQuery)?element:JOBAD.refs.$(element);

    if(element.length > 1){
        var me = arguments.callee;
        return element.each(function(i, e){
            me(e, config);
        });
    }

    //check if we are already enabled
    if(element.data("JOBAD.UI.Folding.enabled")){
        JOBAD.console.log("Can't enable folding on element: Folding already enabled. ");
        return;
    }

    var config = config;

    if(typeof config == "undefined"){
        config = {};
    }

    //normalise config properties
    config.enable = (typeof config.enable == 'function')?config.enable:function(){};
    config.disable = (typeof config.disable == 'function')?config.disable:function(){};
    config.fold = (typeof config.fold == 'function')?config.fold:function(){};
    config.unfold = (typeof config.unfold == 'function')?config.unfold:function(){};
    config.stateChange = (typeof config.stateChange == 'function')?config.stateChange:function(){};
    config.update = (typeof config.update == 'function')?config.update:function(){}
    config.align = (config.align == "right")?"right":"left";

    //Folding class
    var folding_class = "JOBAD_Folding_"+config.align;


    var wrapper = JOBAD.refs.$("<div class='JOBAD "+folding_class+" JOBAD_Folding_Wrapper'>");

    element.wrap(wrapper);
    wrapper = element.parent();

    var placeHolder = JOBAD.refs.$("<div class='JOBAD "+folding_class+" JOBAD_Folding_PlaceHolder'>")
    .prependTo(wrapper)
    .height(JOBAD.UI.Folding.config.placeHolderHeight)
    .append(
        JOBAD.UI.Folding.config.placeHolderContent
    ).hide().click(function(){
        JOBAD.UI.Folding.unfold(element);
    }); //prepend and hide me

    var container = JOBAD.refs.$("<div class='JOBAD "+folding_class+" JOBAD_Folding_Container'>")
    .prependTo(wrapper);

    wrapper
    .data("JOBAD.UI.Folding.state", element.data("JOBAD.UI.Folding.state")?true:false)
    .data("JOBAD.UI.Folding.update", function(event){
        event.stopPropagation();
        JOBAD.UI.Folding.update(element);
    })
    .on("JOBAD.UI.Folding.fold", function(event){
        event.stopPropagation();
        //fold me
        wrapper.data("JOBAD.UI.Folding.state", true);
        //trigger event
        config.fold(element);
        config.stateChange(element, true);
        JOBAD.UI.Folding.update(element);
    })
    .on("JOBAD.UI.Folding.unfold", function(event){
        event.stopPropagation();
        //unfold me
        wrapper.data("JOBAD.UI.Folding.state", false);
        //trigger event
        config.unfold(element);
        config.stateChange(element, false);
        JOBAD.UI.Folding.update(element);
    }).on("JOBAD.UI.Folding.update", function(event){
        //update everything
        if(wrapper.data("JOBAD.UI.Folding.state")){
            //we are hiding stuff
            //hide both element and parent
            element.parent().show();
            element.show();

            container
            .css("height", "")

            var height = wrapper.height()*(JOBAD.UI.Folding.config.placeHolderPercent/100);
            if(height < JOBAD.UI.Folding.config.placeHolderHeightMin){
                height = JOBAD.UI.Folding.config.placeHolderHeightMin;
            } else if(height > JOBAD.UI.Folding.config.placeHolderHeightMax){
                height = JOBAD.UI.Folding.config.placeHolderHeightMax;
            }

            element.parent().hide();
            element.hide();

            placeHolder.height(height);
            placeHolder.show();
        } else {
            //we are going back to the normal state
            //hide both element and parent
            placeHolder.hide();
            element.parent().show();
            element.show();
        }

        container
        .css("height", "")
        .height(wrapper.height());

        config.update(element);
    });

    container.click(function(event){
        //fold or unfold goes here
        if(wrapper.data("JOBAD.UI.Folding.state")){
            JOBAD.UI.Folding.unfold(element);
        } else {
            JOBAD.UI.Folding.fold(element);
        }
    });

    element
    .wrap("<div style='overflow: hidden; '>")
    .data("JOBAD.UI.Folding.wrappers", container.add(placeHolder))
    .data("JOBAD.UI.Folding.enabled", true)
    .data("JOBAD.UI.Folding.callback", config.disable)
    .data("JOBAD.UI.Folding.onStateChange", config.update)
    .data("JOBAD.UI.Folding.config", config);;

    JOBAD.refs.$(window).on("resize.JOBAD.UI.Folding", wrapper.data("JOBAD.UI.Folding.update"));

    config.enable(element);
    JOBAD.UI.Folding.update(element);

    //set all the right states
    return element;
}

/*
    Updates a folded element. 
    @param element  Element to update folding on. 
*/
JOBAD.UI.Folding.update = function(element){
    var element = JOBAD.refs.$(element);
    if(!element.data("JOBAD.UI.Folding.enabled")){
        JOBAD.console.log("Can't update element: Folding not enabled. ");
        return false;
    }
    element.parent().parent().trigger("JOBAD.UI.Folding.update");
    return true;
}

/*
    Folds an element. 
    @param element  Element to update folding on. 
*/
JOBAD.UI.Folding.fold = function(element){
    var element = JOBAD.refs.$(element);
    if(!element.data("JOBAD.UI.Folding.enabled")){
        JOBAD.console.log("Can't fold element: Folding not enabled. ");
        return false;
    }
    element.parent().parent().trigger("JOBAD.UI.Folding.fold");
    return true;
}

/*
    Unfolds an element
*/
JOBAD.UI.Folding.unfold = function(element){
    var element = JOBAD.refs.$(element);
    if(!element.data("JOBAD.UI.Folding.enabled")){
        JOBAD.console.log("Can't unfold element: Folding not enabled. ");
        return false;
    }
    element.parent().parent().trigger("JOBAD.UI.Folding.unfold");
    return true;
}

/*
    Disables folding on an element
    @param element Element to disable folding on. 
    @param keep Keeps elements hidden if set to true. 
*/
JOBAD.UI.Folding.disable = function(element, keep){
    var element = JOBAD.refs.$(element);

    if(element.length > 1){
        var me = arguments.callee;
        return element.each(function(i, e){
            me(e);
        });
    }

    if(element.data("JOBAD.UI.Folding.enabled") !== true){
        JOBAD.console.log("Can't disable folding on element: Folding already disabled. ");
        return;
    }

    //store the state of the current hiding. 
    element.data("JOBAD.UI.Folding.state", element.data("JOBAD.UI.Folding.wrappers").eq(0).parent().data("JOBAD.UI.Folding.state")?true:false);


    //do we keep it hidden?
    if(keep?false:true){
        JOBAD.UI.Folding.unfold(element);
    }
    
    //call event handlers
    element.data("JOBAD.UI.Folding.callback")(element);
    element.data("JOBAD.UI.Folding.onStateChange")(element);

    //unregister event handlers
    JOBAD.refs.$(window).off("resize.JOBAD.UI.Folding", element.parent().data("JOBAD.UI.Folding.update"));

    //remove unneccesary elements. 
    element.data("JOBAD.UI.Folding.wrappers").remove();

    //clear up the last stuff
    element
    .unwrap()
    .unwrap()
    .removeData("JOBAD.UI.Folding.callback")
    .removeData("JOBAD.UI.Folding.onStateChange")
    .removeData("JOBAD.UI.Folding.enabled")
    .removeData("JOBAD.UI.Folding.wrappers");

    return element;
}