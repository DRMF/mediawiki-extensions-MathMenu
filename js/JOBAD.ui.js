/*
	JOBAD 3 UI Functions
	JOBAD.ui.js
	
	requires: 
		JOBAD.core.js
*/

(function(JOBAD){

	//Mouse coordinates
	var mouseCoords = [0, 0];


	JOBAD.refs.$(document).on("mousemove.JOBADListener", function(e){
		mouseCoords = [e.pageX-JOBAD.refs.$(window).scrollLeft(), e.pageY-JOBAD.refs.$(window).scrollTop()];
	});

	//UI Namespace. 
	JOBAD.UI = {}

	//Hover UI. 
	JOBAD.UI.hover = {}

	JOBAD.UI.hover.config = {
		"offsetX": 10, //offset from the mouse in X and Y
		"offsetY": 10,
		"hoverDelay": 1000 //Delay for showing tooltip after hovering. (in milliseconds)	
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
		hoverElement = JOBAD.refs.$("<div class='JOBAD JOBADHover'>").html(html).css({
			"position": "fixed",
			"background-color": "grey",
			"-webkit-border-radius": 5,
			"-moz-border-radius": 5,
			"border-radius": 5,
			"border": "1px solid black"
		});
		hoverElement.appendTo(JOBAD.refs.$("body"));

		JOBAD.refs.$(document).on("mousemove.JOBAD.UI.hover", function(){
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
		JOBAD.refs.$(document).off("mousemove.JOBAD.UI.hover");
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
			if(e.ctrlKey){
				return true;
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
			.appendTo(JOBAD.refs.$("body"));
			
			

			menuBuild
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
		Builds the menu html element
		@param items The menu to build. 
		@param element The element the context menu has been requested on. 
		@param elementOrg The element the context menu call originates from. 
		@returns the menu element. 
	*/
	JOBAD.UI.ContextMenu.buildMenuList = function(items, element, elementOrg){
		var $ul = JOBAD.refs.$("<ul>");
		for(var i=0;i<items.length;i++){
			var item = items[i];
			var $a = JOBAD.refs.$("<a href='#'>");
			$li = JOBAD.refs.$("<li>")
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
						JOBAD.refs.$(document).trigger('JOBADContextMenuUnbind');
						callback(element, elementOrg);
					});		
				} else {
					
					$li.append(JOBAD.UI.ContextMenu.buildMenuList(item[1], element, elementOrg));
				}
			})()
					
		}
		return $ul;
	};


	//Sidebar UI
	JOBAD.UI.Sidebar = {}; 

	JOBAD.UI.Sidebar.config = 
	{
		"width": 100 //Sidebar Width
	};

	/*
		Wraps an element to create a sidebar UI. 
		@param element The element to wrap. 
		@returns the original element, now wrapped. 
	*/
	JOBAD.UI.Sidebar.wrap = function(element){
		var org = $(element);

		var orgWrapper = JOBAD.refs.$("<div>").css({"overflow": "hidden"});

		var sideBarElement = JOBAD.refs.$("<div>").css({
			"float": "right",
			"width": JOBAD.UI.Sidebar.config.width,
			"height": 1, //something >0
			"position":"relative"
		}).addClass("JOBAD_sidebar");

		var container = JOBAD.refs.$("<div>").css({
			"width": "100%",
			"float":"left",
			"overflow":"hidden"	
		});
	
		org.wrap(orgWrapper);

		orgWrapper = org.parent();

		orgWrapper.wrap(container);
	
		container = orgWrapper.parent();

		container.prepend(sideBarElement);


		org.data("JOBAD.UI.Sidebar.active", true);
		return org;
	};

	/*
		Unwraps an element, destroying the sidebar. 
		@param The element which has a sidebar. 
		@returns the original element unwrapped. 
	*/
	JOBAD.UI.Sidebar.unwrap = function(element){
		var org = JOBAD.refs.$(element);
		org
		.unwrap()
		.parent()
		.find("div")
		.first().remove();

		org.removeData("JOBAD.UI.Sidebar.active");

		return org.unwrap();
	};

	/*
		Adds a new notification to the sidebar. (It must already exist)
		@param sidebar The element which has a sidebar. 
		@param element The element to bind the notification to. 
		@returns an empty new notification element. 
	*/
	JOBAD.UI.Sidebar.addNotification = function(sidebar, element){
		var sbar = JOBAD.refs.$(sidebar);
		var child = JOBAD.refs.$(element);
		var offset = child.offset().top - sbar.offset().top; //offset
		sbar = sbar.parent().parent().find("div").first();
	
		var newGuy =  JOBAD.refs.$("<div>").css({"position": "absolute", "top": offset}).appendTo(sbar);


		var callback = function(){
			var offset = child.offset().top - sbar.offset().top; //offset
			newGuy.css({"top": offset});
		
		};
	

		JOBAD.refs.$(window).on("resize.JOBAD.UI.Sidebar", callback);

		return newGuy.data("JOBAD.UI.Sidebar.ResizeHook", callback);
	};

	/*
		Forces a sidebar notification position update. 
		@returns nothing. 
	*/
	JOBAD.UI.Sidebar.forceNotificationUpdate = function(){
		JOBAD.refs.$(window).trigger("resize.JOBAD.UI.Sidebar");
	};

	/*
		Removes a notification
		@param notification The notification element. 
		@returns nothing. 
	*/
	JOBAD.UI.Sidebar.removeNotification = function(notification){
		var callback = notification.data("JOBAD.UI.Sidebar.ResizeHook");
		JOBAD.refs.$(window).off("resize.JOBAD.UI.Sidebar", callback);
		notification.remove();
	};


	//highlighting
	/*
		highlights an element
	*/
	JOBAD.UI.highlight = function(element){
		var element = JOBAD.refs.$(element);
		var col;
		if(typeof element.data("JOBAD.UI.highlight.orgColor") == 'string'){
			col = element.data("JOBAD.UI.highlight.orgColor");
		} else {
			col = element.css("backgroundColor");
		}
		
		element
		.stop().data("JOBAD.UI.highlight.orgColor", col)
		.animate({ backgroundColor: "#FFFF9C"}, 1000);	
	};
	/*
		unhighlights an element.	
	*/		
	JOBAD.UI.unhighlight = function(element){
		var element = JOBAD.refs.$(element);
		element
		.stop()
		.animate({ backgroundColor: element.data("JOBAD.UI.highlight.orgColor")}, 1000)
		.removeData("JOBAD.UI.highlight.orgColor");	
	};

})(JOBAD);
