/*
	JOBAD 3 Events
	depends:
		JOBAD.core.modules.js
		JOBAD.core.events.js
		JOABD.core.js
		
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

/* left click */
JOBAD.events.leftClick = 
{
	'default': function(){
		return false;
	},
	'Setup': {
		'enable': function(root){
			var me = this;
			root.delegate("*", 'click.JOBAD.leftClick', function(event){
				var element = JOBAD.refs.$(event.target); //The base element.  
				switch (event.which) {
					case 1:
						/* left mouse button => left click */
						me.Event.leftClick.trigger(element);
						event.stopPropagation(); //Not for the parent. 
						break;
					default:
						/* nothing */
				}
				root.trigger('JOBAD.Event', ['leftClick', element]);
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
			var evt = this.Event.leftClick.getResult(target);
			return evt;
		}
	}
};

/* double Click */
JOBAD.events.dblClick = 
{
	'default': function(){
		return false;
	},
	'Setup': {
		'enable': function(root){
			var me = this;
			root.delegate("*", 'dblclick.JOBAD.dblClick', function(event){
				var element = JOBAD.refs.$(event.target); //The base element.  
				var res = me.Event.dblClick.trigger(element);
				root.trigger('JOBAD.Event', ['dblClick', element]);
				event.stopPropagation(); //Not for the parent. 
			});
		},
		'disable': function(root){
			root.undelegate("*", 'dblclick.JOBAD.dblClick');	
		}
	},
	'namespace': 
	{
		
		'getResult': function(target){
			return this.modules.iterateAnd(function(module){
				module.dblClick.call(module, target, module.getJOBAD());
				return true;
			});
		},
		'trigger': function(target){
			var evt = this.Event.dblClick.getResult(target);
			return evt;
		}
	}
};

/* onEvent */
JOBAD.events.onEvent = 
{
	'default': function(){},
	'Setup': {
		'enable': function(root){
			var me = this;
			root.on('JOBAD.Event', function(jqe, event, args){
				me.Event.onEvent.trigger(event, args);
			});
		},
		'disable': function(root){
			root.off('JOBAD.Event');
		}
	},
	'namespace': 
	{
		
		'getResult': function(event, element){
			return this.modules.iterateAnd(function(module){
				module.onEvent.call(module, event, element, module.getJOBAD());
				return true;
			});
		},
		'trigger': function(event, element){
			return this.Event.onEvent.getResult(event, element);
		}
	}
};

/* context menu entries */
JOBAD.events.contextMenuEntries = 
{
	'default': function(){
		return [];
	},
	'Setup': {
		'enable': function(root){
			var me = this;
			JOBAD.UI.ContextMenu.enable(root, function(target){
				var res = me.Event.contextMenuEntries.getResult(target);
				root.trigger('JOBAD.Event', ['contextMenuEntries', target]);
				return res;
			}, function(target){
				return me.Config.get("cmenu_type");
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
				return JOBAD.util.generateMenuList(entries);
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

/* configUpdate */
JOBAD.events.configUpdate = 
{
	'default': function(setting, JOBADInstance){},
	'Setup': {
		'enable': function(root){
			var me = this;
			JOBAD.refs.$("body").on('JOBAD.ConfigUpdateEvent', function(jqe, setting, moduleId){
				me.Event.configUpdate.trigger(setting, moduleId);
			});
		},
		'disable': function(root){
			JOBAD.refs.$("body").off('JOBAD.ConfigUpdateEvent');
		}
	},
	'namespace': 
	{
		
		'getResult': function(setting, moduleId){
			return this.modules.iterateAnd(function(module){
				if(module.info().identifier == moduleId){ //only call events for own module. 
					module.configUpdate.call(module, setting, module.getJOBAD());
				}
				return true;
			});
		},
		'trigger': function(setting, moduleId){
			this.element.trigger("JOBAD.Event", ["configUpdate", setting, moduleId]);
			return this.Event.configUpdate.getResult(setting, moduleId);
		}
	}
};

/* hover Text */
JOBAD.events.hoverText = 
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
				var $element = JOBAD.refs.$(this);
				var res = me.Event.hoverText.trigger($element);
				if(res){//something happened here: dont trigger on parent
					event.stopPropagation();
				} else if(!$element.is(root)){ //I have nothing => trigger the parent
					JOBAD.refs.$(this).parent().trigger('mouseenter.JOBAD.hoverText', event); //Trigger parent if i'm not root. 	
				}
				root.trigger('JOBAD.Event', ['hoverText', $element]);
				return false;
			};


			var untrigger = function(event){
				return me.Event.hoverText.untrigger(JOBAD.refs.$(this));	
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
						res = JOBAD.refs.$("<p>").text(hoverText)			
					} else if(typeof hoverText != "boolean"){
						try{
							res = JOBAD.refs.$(hoverText);
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

			if(this.Event.hoverText.activeHoverElement instanceof JOBAD.refs.$)//something already active
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
				JOBAD.UI.hover.enable(EventResult.html(), "JOBAD_Hover");
			}, JOBAD.UI.hover.config.hoverDelay);

			source.data('JOBAD.hover.timerId', tid);//save timeout id
			return true;
						
		},
		'untrigger': function(source){
			if(typeof source == 'undefined'){
				if(this.Event.hoverText.activeHoverElement instanceof JOBAD.refs.$){
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
		}
	}
}

/* sidebar: SideBarUpdate Event */
JOBAD.events.SideBarUpdate = 
{
	'default': function(){
		//Does nothing
	},
	'Setup': {
		'init': {
			/* Sidebar namespace */
			'Sidebar': {
				'forceInit': function(){
					if(typeof this.Sidebar.ElementRequestCache == 'undefined'){
						this.Sidebar.ElementRequestCache = [];
					}
					
					if(typeof this.Sidebar.Elements == 'undefined'){
						this.Sidebar.Elements = {};
					}
					
					if(typeof this.Sidebar.PastRequestCache == 'undefined'){
						this.Sidebar.PastRequestCache = {};
					}
					
					
					if(!this.Event.SideBarUpdate.enabled){
						return;
					}
				
					var new_type = this.Config.get("sidebar_type");
			
					if(this.Event.SideBarUpdate.type != new_type){
						if(this.Event.SideBarUpdate.type == 0){
							this.Sidebar.toTB();
						} else {
							this.Sidebar.toSB();
						}
						
						this.Event.SideBarUpdate.type = new_type;
					}
				},
				'makeCache': function(){
					var cache = [];
					
					for(var key in this.Sidebar.PastRequestCache){
						cache.push(this.Sidebar.PastRequestCache[key]);
					}
					
					return cache;
				},
				'toSB': function(){
					if(!this.Event.SideBarUpdate.enabled){
						return;
					}
					
					var cache = this.Sidebar.makeCache(); //cache the loaded requests
					
					
					//remove all old requests
					for(var key in this.Sidebar.Elements){
						this.Sidebar.removeNotificationTB(this.Sidebar.Elements[key], false);
					}
					
					this.Sidebar.redrawTB(); //clears the toolbar
					
					this.Event.SideBarUpdate.type = 1; //update type
					
					//reregister everything
					for(var i=0;i<cache.length;i++){
						this.Sidebar.registerNotification(cache[i][0], cache[i][1], false);
					}
					
					this.Sidebar.redraw(); //redraw the sidebar
				},
				'toTB': function(){
					if(!this.Event.SideBarUpdate.enabled){
						return;
					}
					
					var cache = this.Sidebar.makeCache(); //cache the loaded requests
					
					//remove all old requests
					for(var key in this.Sidebar.Elements){
						this.Sidebar.removeNotificationSB(this.Sidebar.Elements[key], false);
					}
					
					this.Sidebar.redrawSB(); //clears the sidebar
					
					this.Event.SideBarUpdate.type = 1; //update type
					
					//reregister everything
					for(var i=0;i<cache.length;i++){
						this.Sidebar.registerNotification(cache[i][0], cache[i][1], false);
					}
					
					this.Sidebar.redraw(); //redraw the sidebar
				},
				/*
					Redraws the sidebar. 
				*/
				'redraw': function(){
				
					if(typeof this.Event.SideBarUpdate.enabled == "undefined"){
						return; //do not run if disabled
					}
				
					this.Sidebar.forceInit();
					
					if(this.Event.SideBarUpdate.type == 0){
						return this.Sidebar.redrawSB();
					} else {
						return this.Sidebar.redrawTB();
					}
				},
				'redrawSB': function(){
					if(JOBAD.refs._.keys(this.Sidebar.Elements).length +  this.Sidebar.ElementRequestCache.length == 0){
						//sidebar is empty; cache is also empty
						if(this.element.data("JOBAD.UI.Sidebar.active")){ //remove the sidebar
							JOBAD.UI.Sidebar.unwrap(this.element);
						}
					} else {
						for(var i=0;i<this.Sidebar.ElementRequestCache.length;i++){
							var id = this.Sidebar.ElementRequestCache[i][0];
							var element = this.Sidebar.ElementRequestCache[i][1];
							var config = this.Sidebar.ElementRequestCache[i][2];
							
							this.Sidebar.Elements[id] = JOBAD.UI.Sidebar.addNotification(this.element, element, config)
							.data("JOBAD.Events.Sidebar.id", id);
							
							this.Sidebar.PastRequestCache[id] = [element, config]; 
						}
						
						this.Sidebar.ElementRequestCache = []; //clear the cache
						
					}
					
					JOBAD.UI.Sidebar.forceNotificationUpdate();
					this.Event.SideBarUpdate.trigger();
				},
				'redrawTB': function(){
					for(var i=0;i<this.Sidebar.ElementRequestCache.length;i++){
						var id = this.Sidebar.ElementRequestCache[i][0];
						var element = this.Sidebar.ElementRequestCache[i][1];
						var config = this.Sidebar.ElementRequestCache[i][2];
						
						this.Sidebar.Elements[id] = JOBAD.UI.Toolbar.addItem(element, config)
						.data("JOBAD.Events.Sidebar.id", id);
						
						this.Sidebar.PastRequestCache[id] = [element, config]; 
					}
					
					this.Sidebar.ElementRequestCache = []; //clear the cache
					
					JOBAD.UI.Toolbar.update();
					this.Event.SideBarUpdate.trigger();
				},
				
				/*
					Registers a new notification. 
					@param element Element to register notification on. 
					@param config
							config.class:	Notificaton class. Default: none. 
							config.icon:	Icon (Default: Based on notification class. )
							config.text:	Text
							config.menu:	Context Menu
							config.trace:	Trace the original element on hover? (Ignored for direct)
							config.click:	Callback on click, Default: Open Context Menu
					@param autoRedraw Optional. Should the sidebar be redrawn? (default: true)
					@return jQuery element used as identification. 
							
				*/
				'registerNotification': function(element, config, autoRedraw){
				
					this.Sidebar.forceInit(); //force an init
				
					var id = JOBAD.util.UID(); //generate new UID
					
					var config = (typeof config == 'undefined')?{}:config;
					config.menuThis = this;
					
					this.Sidebar.ElementRequestCache.push([id, JOBAD.refs.$(element), JOBAD.refs._.clone(config)]); //cache the request. 
					
					if((typeof autoRedraw == 'boolean')?autoRedraw:true){
						this.Sidebar.redraw();
						return this.Sidebar.Elements[id];
					}		
					
				},
				'removeNotification': function(item, autoRedraw){
					this.Sidebar.forceInit();
					if(!this.Event.SideBarUpdate.enabled){
						//we're disabled; just remove it from the cache
						var id = item.data("JOBAD.Events.Sidebar.id");
						
						for(var i=0;i<this.Sidebar.PastRequestCache.length;i++){
							if(this.Sidebar.PastRequestCache[i][0] == id){
								this.Sidebar.PastRequestCache.splice(i, 1); //remove the element
								break;
							}
						}
					} else {
						if(this.Event.SideBarUpdate.type == 0){
							return this.Sidebar.removeNotificationSB(item, autoRedraw);
						} else {
							return this.Sidebar.removeNotificationTB(item, autoRedraw);
						}
					}
				},
				/*
					removes a notification. 
					@param	item	Notification to remove.
					@param autoRedraw Optional. Should the sidebar be redrawn? (default: true)
					
				*/
				'removeNotificationSB': function(item, autoRedraw){
					if(item instanceof JOBAD.refs.$){
						var id = item.data("JOBAD.Events.Sidebar.id");
	
						JOBAD.UI.Sidebar.removeNotification(item);
						
						delete this.Sidebar.Elements[id];
						delete this.Sidebar.PastRequestCache[id];
						
						if((typeof autoRedraw == 'boolean')?autoRedraw:true){
							this.Sidebar.redraw();
						}
						return id;
					} else {
						JOBAD.error("JOBAD Sidebar Error: Tried to remove invalid Element. ");
					}
				},
				'removeNotificationTB': function(item, autoRedraw){
					if(item instanceof JOBAD.refs.$){
						var id = item.data("JOBAD.Events.Sidebar.id");
	
						JOBAD.UI.Toolbar.removeItem(item);
						
						delete this.Sidebar.Elements[id];
						delete this.Sidebar.PastRequestCache[id];
						
						if((typeof autoRedraw == 'boolean')?autoRedraw:true){
							this.Sidebar.redraw();
						}
						
						return id;
					} else {
						JOBAD.error("JOBAD Sidebar Error: Tried to remove invalid Element. ");
					}
				}	
			}
		},
		'enable': function(root){
			this.Event.SideBarUpdate.enabled = true;
			this.Event.SideBarUpdate.type = this.Config.get("sidebar_type"); //init the type
			this.Sidebar.redraw(); //redraw the sidebar
		},
		'disable': function(root){
		
			var newCache = []
		
			//remove all old requests
			for(var key in this.Sidebar.Elements){
				newCache.push([key, this.Sidebar.PastRequestCache[key][0], this.Sidebar.PastRequestCache[key][1]]);
				
				this.Sidebar.removeNotification(this.Sidebar.Elements[key], false);
			}
			
			this.Sidebar.redraw(); //redraw it one more time. 
			
			this.Sidebar.ElementRequestCache = newCache; //everything is now hidden
			
			this.Event.SideBarUpdate.enabled = undefined; 
		}
	},
	'namespace': 
	{
		
		'getResult': function(){
			if(this.Event.SideBarUpdate.enabled){
				this.modules.iterateAnd(function(module){
					module.SideBarUpdate.call(module, module.getJOBAD());
					return true;
				});
			}
		},
		'trigger': function(){
			this.Event.SideBarUpdate.getResult();
		}
	}
};

for(var key in JOBAD.events){
	JOBAD.modules.cleanProperties.push(key);
}
