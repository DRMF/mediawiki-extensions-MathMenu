/*
	JOBAD 3 UI Functions
	JOBAD.ui.js
	
	requires: 
		JOBAD.core.js
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
			if(e.ctrlKey){
				return true;
			}
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

		var orgWrapper = $("<div>").css({"overflow": "hidden"});

		var sideBarElement = $("<div>").css({
			"float": "right",
			"width": JOBAD.UI.Sidebar.config.width,
			"height": 1, //something >0
			"position":"relative"
		});

		var container = $("<div>").css({
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
		var org = $(element);
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
		var sbar = $(sidebar);
		var child = $(element);
		var offset = child.offset().top - sbar.offset().top; //offset
		sbar = sbar.parent().parent().find("div").first();
	
		var newGuy =  $("<div>").css({"position": "absolute", "top": offset}).appendTo(sbar);


		var callback = function(){
			var offset = child.offset().top - sbar.offset().top; //offset
			newGuy.css({"top": offset});
		
		};
	

		$(window).on("resize.JOBAD.UI.Sidebar", callback);

		return newGuy.data("JOBAD.UI.Sidebar.ResizeHook", callback);
	};

	/*
		Forces a sidebar notification position update. 
		@returns nothing. 
	*/
	JOBAD.UI.Sidebar.forceNotificationUpdate = function(){
		$(window).trigger("resize.JOBAD.UI.Sidebar");
	};

	/*
		Removes a notification
		@param notification The notification element. 
		@returns nothing. 
	*/
	JOBAD.UI.Sidebar.removeNotification = function(notification){
		var callback = notification.data("JOBAD.UI.Sidebar.ResizeHook");
		$(window).off("resize.JOBAD.UI.Sidebar", callback);
		notification.remove();
	};


	//highlighting
	/*
		highlights an element
	*/
	JOBAD.UI.highlight = function(element){
		var element = $(element);
		if(element.data("JOBAD.UI.highlight.orgColor")){
			element.css("backgroundColor", element.data("JOBAD.UI.highlight.orgColor"));
		}
		element
		.stop().data("JOBAD.UI.highlight.orgColor", element.css("backgroundColor"))
		.animate({ backgroundColor: "#FFFF9C"}, 1000);	
	};
	/*
		unhighlights an element.	
	*/		
	JOBAD.UI.unhighlight = function(element){
		var element = $(element);
		element
		.stop()
		.animate({ backgroundColor: element.data("JOBAD.UI.highlight.orgColor")}, 1000)
		.removeData("JOBAD.UI.highlight.orgColor");	
	}

	/*
	JOBAD Keypress UI - Removed temporarily
	JOBAD.UI.keypress = {};
	//adapted code from https://raw.github.com/jeresig/jquery.hotkeys/master/jquery.hotkeys.js
	JOBAD.UI.keypress.keys = {
		specialKeys: {
			8: "backspace", 9: "tab", 13: "return", 16: "shift", 17: "ctrl", 18: "alt", 19: "pause",
			20: "capslock", 27: "esc", 32: "space", 33: "pageup", 34: "pagedown", 35: "end", 36: "home",
			37: "left", 38: "up", 39: "right", 40: "down", 45: "insert", 46: "del", 
			96: "0", 97: "1", 98: "2", 99: "3", 100: "4", 101: "5", 102: "6", 103: "7",
			104: "8", 105: "9", 106: "*", 107: "+", 109: "-", 110: ".", 111 : "/", 
			112: "f1", 113: "f2", 114: "f3", 115: "f4", 116: "f5", 117: "f6", 118: "f7", 119: "f8", 
			120: "f9", 121: "f10", 122: "f11", 123: "f12", 144: "numlock", 145: "scroll", 191: "/", 224: "meta"
		},

		shiftNums: {
			"`": "~", "1": "!", "2": "@", "3": "#", "4": "$", "5": "%", "6": "^", "7": "&", 
			"8": "*", "9": "(", "0": ")", "-": "_", "=": "+", ";": ": ", "'": "\"", ",": "<", 
			".": ">",  "/": "?",  "\\": "|"
		}
	};

	JOBAD.UI.keypress.matchesKey = function(event, comb) {
			
		var special = event.type !== "keypress" && JOBAD.UI.keypress.keys.specialKeys[ event.which ],
			character = String.fromCharCode( event.which ).toLowerCase(),
			key, modif = "", possible = {};

		// check combinations (alt|ctrl|shift+anything)
		if ( event.altKey && special !== "alt" ) {
			modif += "alt+";
		}

		if ( event.ctrlKey && special !== "ctrl" ) {
			modif += "ctrl+";
		}

		if ( event.metaKey && !event.ctrlKey && special !== "meta" ) {
			modif += "meta+";
		}

		if ( event.shiftKey && special !== "shift" ) {
			modif += "shift+";
		}

		if ( special ) {
			possible[ modif + special ] = true;

		} else {
			possible[ modif + character ] = true;
			possible[ modif + JOBAD.UI.keypress.keys.specialKeys[ character ] ] = true;

			// "$" can be triggered as "Shift+4" or "Shift+$" or just "$"
			if ( modif === "shift+" ) {
				possible[ JOBAD.UI.keypress.keys.shiftNums[ character ] ] = true;
			}
		}

		return possible.hasOwnProperty(comb.toLowerCase());
	};

	*/
})(JOBAD)
