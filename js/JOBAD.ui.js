/* 
	JOBAD 3 UI Functions
	requires JOBAD.core.js
*/

(function(JOBAD){

	//Mouse coordinates
	var mouseCoords = [0, 0];

	$(document).on("mousemove.JOBADListener", function(e){
		mouseCoords = [e.pageX-$(window).scrollLeft(), e.pageY-$(window).scrollTop()];
	});

	//UI Namespace. 
	JOBAD.UI = {}

	//Hover UI. 
	JOBAD.UI.hover = {}

	JOBAD.UI.hover.config = {
		"offsetX": 10, //offset from the mouse in X and Y
		"offsetY": 10	
	}
	
	var hoverActive = false;
	var hoverElement = undefined;

	/*
		Activates the hover ui which follows the mouse. 
		@param html HTML to use as content
		@return true. 
	*/
	JOBAD.UI.hover.enable = function(html){
		hoverActive = true;
		hoverElement = $("<div class='JOBAD JOBADHover'>").html(html).css({
			"position": "fixed",
			"background-color": "grey",
			"-webkit-border-radius": 5,
			"-moz-border-radius": 5,
			"border-radius": 5,
			"border": "1px solid black"
		});
		hoverElement.appendTo($("body"));

		$(document).on("mousemove.JOBAD.UI.hover", function(){
			JOBAD.UI.hover.refresh();
		});

		JOBAD.UI.hover.refresh();
		
		return true; 
	}

	/*
		Deactivates the hover UI if active. 
		@param element jQuery element to use as hover
		@return booelan boolean indicating of the UI has been deactived. 
	*/
	JOBAD.UI.hover.disable = function(){
		if(!hoverActive){
			return false;		
		}

		hoverActive = false;
		$(document).off("mousemove.JOBAD.UI.hover");
		hoverElement.remove();
	}
	/*
		Refreshes the position of the hover element if active. 
		@return nothing. 
	*/
	JOBAD.UI.hover.refresh = function(){
		if(hoverActive){
			hoverElement
			.css("top", Math.min(mouseCoords[1]+JOBAD.UI.hover.config.offsetY, window.innerHeight-hoverElement.outerHeight(true)))
			.css("left", Math.min(mouseCoords[0]+JOBAD.UI.hover.config.offsetX, window.innerWidth-hoverElement.outerWidth(true)))
		}
	}

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
		@param onEnable Optional. Will be called before the context menu is enabled. 
		@param onDisable Optional. Will be called after the context menu has been disabled. 
		@return the jquery element. 
	*/
	JOBAD.UI.ContextMenu.enable = function(element, demandFunction, onEnable, onDisable){
		if(typeof demandFunction != 'function'){
			JOBAD.error('JOBAD.UI.ContextMenu.enable: demandFunction is not a function'); //die
			return element;
		}
		
		if(typeof onEnable != 'function'){
			onEnable = function(element){}; //Default
		}
		if(typeof onDisable != 'function'){
			onDisable = function(element){}; //Default
		}

		element.on('contextmenu.JOBAD.UI.ContextMenu', function(e){
			var targetElement = $(e.target);
			var elementOrg = $(e.target);
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
			
			$(document).trigger('JOBADContextMenuUnbind'); //close all other menus

			onEnable(element);

			var menuBuild = JOBAD.UI.ContextMenu.buildMenuList(result, targetElement, elementOrg)
			.menu()
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
			.appendTo($("body"));
			
			

			menuBuild
			.css("top", Math.min(mouseCoords[1], window.innerHeight-menuBuild.outerHeight(true)-JOBAD.UI.ContextMenu.config.margin))
			.css("left", Math.min(mouseCoords[0], window.innerWidth-menuBuild.outerWidth(true)-JOBAD.UI.ContextMenu.config.margin))
			var closeHandler = function(e){
				menuBuild
				.remove();
				onDisable(element);
			};

			$(document).on('JOBADContextMenuUnbind', function(){
					closeHandler();
					$(document).unbind('mousedown.UI.ContextMenu.Unbind JOBADContextMenuUnbind');
			});

			$(document).on('mousedown.UI.ContextMenu.Unbind', function(){
				$(document).trigger('JOBADContextMenuUnbind');
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
		Builds the menu html element
		@param items The menu to build. 
		@param element The element the context menu has been requested on. 
		@param elementOrg The element the context menu call originates from. 
		@returns the menu element. 
	*/
	JOBAD.UI.ContextMenu.buildMenuList = function(items, element, elementOrg){
		var $ul = $("<ul>");
		for(var i=0;i<items.length;i++){
			var item = items[i];
			var $a = $("<a href='#'>");
			$li = $("<li>")
			.appendTo($ul)
			.append($a);
			$a
			.text(item[0])
			.on('click', function(e){
				return false; //Don't follow link. 
			});
			(function(){
				if(typeof item[1] == 'function'){
					var callback = item[1];

					$a.on('click', function(e){
						$(document).trigger('JOBADContextMenuUnbind');
						callback(element, elementOrg);
					});		
				} else {
					
					$li.append(JOBAD.UI.ContextMenu.buildMenuList(item[1], element, elementOrg));
				}
			})()
					
		}
		return $ul;
	};

})(JOBAD)
