/*
	JOBAD 3 Event Functions
	JOBAD.event.js
	
	requires:
		JOBAD.core.js
		JOBAD.ui.js
*/

/* left click */
JOBAD.Events.leftClick = 
{
	'default': function(){
		return false;
	},
	'Setup': {
		'enable': function(root){
			var me = this;
			root.delegate("*", 'click.JOBAD.leftClick', function(event){
				var element = $(event.target); //The base element.  
				switch (event.which) {
					case 1:
						/* left mouse button => left click */
						me.Event.leftClick.trigger(element);
						event.stopPropagation(); //Not for the parent. 
						break;
					default:
						/* nothing */
				}
			});
		},
		'disable': function(root){
			root.undelegate("*", 'click.JOBAD.leftClick');	
		}
	},
	'namespace': 
	{
		
		'getResult': function(target){
			return this.modules.iterateAnd(function(module){
				module.leftClick.call(module, target, module.getJOBAD());
				return true;
			});
		},
		'trigger': function(target){
			return this.Event.leftClick.getResult(target);
		}
	}
};

/* context menu entries */
JOBAD.Events.contextMenuEntries = 
{
	'default': function(){
		return [];
	},
	'Setup': {
		'enable': function(root){
			var me = this;
			JOBAD.UI.ContextMenu.enable(root, function(target){
				return me.Event.contextMenuEntries.getResult(target);
			});
		},
		'disable': function(root){
			JOBAD.UI.ContextMenu.disable(root);
		}
	},
	'namespace': 
	{
		'getResult': function(target){
			var res = [];
			var mods = this.modules.iterate(function(module){
				var entries = module.contextMenuEntries.call(module, target, module.getJOBAD());
				return (_.isArray(entries))?entries:JOBAD.util.generateMenuList(entries);
			});
			for(var i=0;i<mods.length;i++){
				var mod = mods[i];
				for(var j=0;j<mod.length;j++){
					res.push(mod[j]);
				}
			}
			if(res.length == 0){
				return false;		
			} else {
				return res;		
			}
		}
	}
}


/*
	Generates a list menu representation from an object representation. 
	@param menu Menu to generate. 
	@returns the new representation. 
*/
JOBAD.util.generateMenuList = function(menu){
	if(typeof menu == 'undefined'){
		return [];
	}
	var res = [];
	for(var key in menu){
		if(menu.hasOwnProperty(key)){
			var val = menu[key];
			if(typeof val == 'function'){
				res.push([key, val]);		
			} else {
				res.push([key, JOBAD.util.generateMenuList(val)]);
			}
		}
	}
	return res;
};

/* hover Text */
JOBAD.Events.hoverText = 
{
	'default': function(){
		return false;	
	},
	'Setup': {
		'init': function(){
			this.Event.hoverText.activeHoverElement = undefined; //the currently active element. 
		},
		'enable': function(root){
			
			var me = this;
			var trigger = function(event){
				var res = me.Event.hoverText.trigger($(this));
				if(res){//something happened here: dont trigger on parent
					event.stopPropagation();
				} else if(!$(this).is(root)){ //I have nothing => trigger the parent
					$(this).parent().trigger('mouseenter.JOBAD.hoverText', event); //Trigger parent if i'm not root. 	
				}
				return false;
			};


			var untrigger = function(event){
				return me.Event.hoverText.untrigger($(this));	
			};

			root
			.delegate("*", 'mouseenter.JOBAD.hoverText', trigger)
			.delegate("*", 'mouseleave.JOBAD.hoverText', untrigger);
		},
		'disable': function(root){
			if(typeof this.Event.hoverText.activeHoverElement != 'undefined')
			{
				me.Event.hoverText.untrigger(); //remove active Hover menu
			}
		
			root
			.undelegate("*", 'mouseenter.JOBAD.hoverText')
			.undelegate("*", 'mouseleave.JOBAD.hoverText');
		}
	},
	'namespace': {
		'getResult': function(target){
			var res = false;
			this.modules.iterate(function(module){
				var hoverText = module.hoverText.call(module, target, module.getJOBAD()); //call apply and stuff here
				if(typeof hoverText != 'undefined' && typeof res == "boolean"){//trigger all hover handlers ; display only the first one. 
					if(typeof hoverText == "string"){
						res = $("<p>").text(hoverText)			
					} else if(typeof hoverText != "boolean"){
						try{
							res = jQuery(hoverText);
						} catch(e){
							JOBAD.error("Module '"+module.info().identifier+"' returned invalid HOVER result. ");
						}
					} else if(hoverText === true){
						res = true;
					}
				}
				return true;
			});
			return res;
		},
		'trigger': function(source){
			if(source.data('JOBAD.hover.Active')){
				return false;		
			}

			var EventResult = this.Event.hoverText.getResult(source); //try to do the event
		
			if(typeof EventResult == 'boolean'){
				return EventResult;		
			}

			if(this.Event.hoverText.activeHoverElement instanceof jQuery)//something already active
			{
				if(this.Event.hoverText.activeHoverElement.is(source)){
					return true; //done and die			
				}
				this.Event.hoverText.untrigger(this.Event.hoverText.activeHoverElement);	
			}

			this.Event.hoverText.activeHoverElement = source;

			source.data('JOBAD.hover.Active', true);		
		
			var tid = window.setTimeout(function(){
				source.removeData('JOBAD.hover.timerId');
				JOBAD.UI.hover.enable(EventResult.html());
			}, JOBAD.config.hoverdelay)

			source.data('JOBAD.hover.timerId', tid);//save timeout id
			return true;
						
		},
		'untrigger': function(source){
			if(typeof source == 'undefined'){
				if(this.Event.hoverText.activeHoverElement instanceof jQuery){
					source = this.Event.hoverText.activeHoverElement;
				} else {
					return false;			
				}
			}		

			if(!source.data('JOBAD.hover.Active')){
				return false;		
			}

		

			if(typeof source.data('JOBAD.hover.timerId') == 'number'){
				window.clearTimeout(source.data('JOBAD.hover.timerId'));
				source.removeData('JOBAD.hover.timerId');		
			}

			source.removeData('JOBAD.hover.Active');

			this.Event.hoverText.activeHoverElement = undefined;

			JOBAD.UI.hover.disable();

			if(!source.is(this.element)){
				this.Event.hoverText.trigger(source.parent());//we are in the parent now
				return false;
			}

			return true;
		}
	}
}


/* sidebar: onSideBarUpdate Event */
JOBAD.Events.onSideBarUpdate = 
{
	'default': function(){
		//Does nothing
	},
	'Setup': {
		'init': {
			/* Sidebar namespace */
			'Sidebar': {
				/*
					Forces an update of the sidebar. 
				*/
				'forceUpdate': function(){
					if(_.keys(this.Sidebar.Elements).length == 0){
						if(this.element.data("JOBAD.UI.Sidebar.active")){
							JOBAD.UI.Sidebar.unwrap(this.element);
						}	
					} else {
						if(!this.element.data("JOBAD.UI.Sidebar.active")){
							JOBAD.UI.Sidebar.wrap(this.element);
						}
						for(var id in this.Sidebar.Elements){
							var element = this.Sidebar.Elements[id];
							if(!element.data("JOBAD.Events.Sidebar.id")){
								this.Sidebar.Elements[id] = JOBAD.UI.Sidebar.addNotification(this.element, this.Sidebar.Elements[id]);
							}
						}
					}
					JOBAD.UI.Sidebar.forceNotificationUpdate();
					this.Event.onSideBarUpdate.trigger();
				},
				/*
					Registers a new notification. 
					@param element Element to register notification on. 
					@param config
							config.icon:		Icon to display [UNIMPLEMENTED]
							config.text:		Text
							config.trace:		Trace the original element on hover?
							config.callback:	Callback on click
					@return jQuery element used as identification. 
							
				*/
				'registerNotification': function(element, config){
					var element = $(element);
					var id = (new Date()).getTime().toString();
					this.Sidebar.Elements[id] = element;			
					this.Sidebar.forceUpdate();
					var sidebar_element = this.Sidebar.Elements[id].data("JOBAD.Events.Sidebar.id", id);

					sidebar_element.data("JOBAD.Events.Sidebar.element", element)					
	
					var config = (typeof config == 'undefined')?{}:config;
					
					if(config.hasOwnProperty("text")){
						sidebar_element.text(config.text);
					}
					

					if(config.trace){
						//highlight the element
						sidebar_element.hover(
						function(){
							JOBAD.UI.highlight(element);
						},
						function(){
							JOBAD.UI.unhighlight(element);
						});
					}

					if(typeof config.callback == "function"){
						sidebar_element.click(config.callback);
					}

					return sidebar_element;
				}, 
				/*
					removes a notification. 
					@param	item	Notification to remove. 
				*/
				'removeNotification': function(item){
					if(item instanceof jQuery){
						var id = item.data("JOBAD.Events.Sidebar.id");
						JOBAD.UI.Sidebar.removeNotification(item);
						delete this.Sidebar.Elements[id];
						this.Sidebar.forceUpdate();
					} else {
						JOBAD.error("JOABD Sidebar Error: Tried to remove invalid Element. ");
					}
				}	
			}
		},
		'enable': function(root){
			this.Sidebar.Elements = {};
			this.Event.onSideBarUpdate.enabled = true;
			
		},
		'disable': function(root){
			this.Event.onSideBarUpdate.enabled = undefined;
		}
	},
	'namespace': 
	{
		
		'getResult': function(){
			if(this.Event.onSideBarUpdate.enabled){
				this.modules.iterateAnd(function(module){
					module.onSideBarUpdate.call(module, module.getJOBAD());
					return true;
				});
			}
		},
		'trigger': function(){
			this.Event.onSideBarUpdate.getResult();
		}
	}
};

