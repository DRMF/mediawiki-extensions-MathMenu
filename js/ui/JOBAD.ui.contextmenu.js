/*
	JOBAD 3 UI Functions - Context Menu
	JOBAD.ui.contextmenu.js
	
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

//Context Menu UI
JOBAD.UI.ContextMenu = {}

JOBAD.UI.ContextMenu.config = {
	'margin': 20, //margin from page borders
	'width': 250 //menu width
};

/*
	Registers a context menu on an element. 
	@param element jQuery element to register on. 
	@param demandFunction Function to call to get menu. 
	@param typeFunction Optional. Type of menu to use. 0 => jQuery UI menu, 1 => Pie menu (unimplemented). 
	@param onEnable Optional. Will be called before the context menu is enabled. 
	@param onDisable Optional. Will be called after the context menu has been disabled. 
	@return the jquery element. 
*/
JOBAD.UI.ContextMenu.enable = function(element, demandFunction, typeFunction, onEnable, onDisable){
	if(typeof demandFunction != 'function'){
		JOBAD.warning('JOBAD.UI.ContextMenu.enable: demandFunction is not a function, assuming empty function. '); //die
		return element;
	}
	
	if(typeof typeFunction != 'function'){
		typeFunction = function(element){return 0;}; //Default
	}
	
	if(typeof onEnable != 'function'){
		onEnable = function(element){}; //Default
	}
	if(typeof onDisable != 'function'){
		onDisable = function(element){}; //Default
	}

	element.on('contextmenu.JOBAD.UI.ContextMenu', function(e){
		if(e.ctrlKey){
			return true;
		}
		if(JOBAD.util.isHidden(e.target)){
			return false; //we're hidden
		}
		var targetElement = JOBAD.refs.$(e.target);
		var elementOrg = JOBAD.refs.$(e.target);
		var result = false;
		while(true){
			result = demandFunction(targetElement, elementOrg);
			if(result || element.is(this)){
				break;				
			}
			targetElement = targetElement.parent();
		}
		
		if(!result){
			return true; //Allow the browser to handle stuff			
		}
		
		JOBAD.refs.$(document).trigger('JOBADContextMenuUnbind'); //close all other menus

		onEnable(element);

		var menuBuild = JOBAD.refs.$("<div>").addClass("ui-front"); //we ant to be in front. 
		
		var menuType = typeFunction(targetElement, elementOrg);
		
	
		menuBuild
		.append(
			JOBAD.UI.ContextMenu.buildContextMenuList(result, targetElement, elementOrg)
			.menu()
		);
	

		menuBuild
		.css({
			'width': JOBAD.UI.ContextMenu.config.width,
			'position': 'fixed'
		})
		.on('contextmenu', function(){
			return false;			
		})
		.on('mousedown', function(e){
			e.stopPropagation();//prevent closemenu from triggering
		})
		.appendTo(JOBAD.refs.$("body"))
		.css("top", Math.min(mouseCoords[1], window.innerHeight-menuBuild.outerHeight(true)-JOBAD.UI.ContextMenu.config.margin))
		.css("left", Math.min(mouseCoords[0], window.innerWidth-menuBuild.outerWidth(true)-JOBAD.UI.ContextMenu.config.margin))
		var closeHandler = function(e){
			menuBuild
			.remove();
			onDisable(element);
		};

		JOBAD.refs.$(document).on('JOBADContextMenuUnbind', function(){
				closeHandler();
				JOBAD.refs.$(document).unbind('mousedown.UI.ContextMenu.Unbind JOBADContextMenuUnbind');
		});

		JOBAD.refs.$(document).on('mousedown.UI.ContextMenu.Unbind', function(){
			JOBAD.refs.$(document).trigger('JOBADContextMenuUnbind');
		});

		
		return false;
		
	});

	return element;

};

/*
	Disables the Context Menu. 
	@param element jQuery element to remove the context menu from. 
	@return the jquery element. 
*/
JOBAD.UI.ContextMenu.disable = function(element){
	element.off('contextmenu.JOBAD.UI.ContextMenu'); //remove listener
	return element;
};

/*
	Builds the menu html element for a standard context menu. 
	@param items The menu to build. 
	@param element The element the context menu has been requested on. 
	@param elementOrg The element the context menu call originates from. 
	@returns the menu element. 
*/
JOBAD.UI.ContextMenu.buildContextMenuList = function(items, element, elementOrg){
	var $ul = JOBAD.refs.$("<ul class='JOBAD JOBAD_Contextmenu'>");
	for(var i=0;i<items.length;i++){
		var item = items[i];
		
		var $a = JOBAD.refs.$("<a href='#'>");
		
		var $li = JOBAD.refs.$("<li>").appendTo($ul);
		
		$li.append($a);
		
		$a
		.text(item[0])
		.on('click', function(e){
			return false; //Don't follow link. 
		});
		
		if(item[2] != "none"){
			$a.prepend(JOBAD.refs.$("<span>").addClass("ui-icon ui-icon-"+item[2]));
		}
		
		(function(){
			if(typeof item[1] == 'function'){
				var callback = item[1];

				$a.on('click', function(e){
					JOBAD.refs.$(document).trigger('JOBADContextMenuUnbind');
					callback(element, elementOrg);
				});		
			} else {
				$li.append(JOBAD.UI.ContextMenu.buildContextMenuList(item[1], element, elementOrg));
			}
		})()
				
	}
	return $ul;
};


/*
	Generates a list menu representation from an object representation. 
	@param menu Menu to generate. 
	@returns the new representation. 
*/
JOBAD.UI.ContextMenu.generateMenuList = function(menu){
	var DEFAULT_ICON = "none";
	if(typeof menu == 'undefined'){
		return [];
	}
	var res = [];
	if(JOBAD.refs._.isArray(menu)){
		for(var i=0;i<menu.length;i++){
			var key = menu[i][0];
			var val = menu[i][1];
			var icon = (typeof menu[i][2] == 'undefined')?DEFAULT_ICON:menu[i][2];
			if(typeof val == 'function'){
				res.push([key, val, icon]);		
			} else {
				res.push([key, JOBAD.UI.ContextMenu.generateMenuList(val), icon]);
			}
		}
	} else {
		for(var key in menu){
			if(menu.hasOwnProperty(key)){
				var val = menu[key];
				if(typeof val == 'function'){
					res.push([key, val, DEFAULT_ICON]);	
				} else if(JOBAD.refs._.isArray(val)){
					if(typeof val[1] == 'string'){ //we have a string there => we have an icon
						if(typeof val[0] == 'function'){
							res.push([key, val[0], val[1]]);
						} else {
							res.push([key, JOBAD.UI.ContextMenu.generateMenuList(val[0]), val[1]]);
						}
					} else {
						res.push([key, JOBAD.UI.ContextMenu.generateMenuList(val), DEFAULT_ICON]);
					}
					
				} else {
					res.push([key, JOBAD.UI.ContextMenu.generateMenuList(val), DEFAULT_ICON]);
				}
			}
		}
	}
	return res;
};

/*
	Wraps a menu function
	@param menu Menu to generate. 
	@returns the new representation. 
*/
JOBAD.UI.ContextMenu.fullWrap = function(menu, wrapper){
	var menu = JOBAD.UI.ContextMenu.generateMenuList(menu);
	var menu2 = [];
	for(var i=0;i<menu.length;i++){
		if(typeof menu[i][1] == 'function'){
			(function(){
				var org = menu[i][1];
				menu2.push([menu[i][0], function(){
					return wrapper(org, arguments)
				}, menu[i][2]]);
			})();
		} else {
			menu2.push([menu[i][0], JOBAD.UI.ContextMenu.fullWrap(menu[i][1]), menu[i][2]]);
		}
		
	}
	return menu2;
};