/* 
	JOBAD 3 Core Functions
	requires JOBAD.ui.js at runtime to generate UI
*/
var JOBAD = 
(function(){

/* 
	JOBAD 3 Main Function
	Creates a new JOBAD instance on a specefied DOM element.  
	@param element Element to link this element to. May be a DOM Element or a jQuery Object. 
	@param config Configuration for this JOBAD Instance. 

*/

var JOBAD = function(element, config){

	if(!(this instanceof JOBAD)){
		return new JOBAD(element);	
	}

	var me = this; //Kept in functions

	//The element the current JOBAD instance works on. 
	this.element = element;
	if(_.isElement(this.element)){
		this.element = $(this.element);
	}
	if(!(this.element instanceof jQuery)){
		JOBAD.error("Instance creation failed: Parameter is not a DOM Element. ");
	}

	/* modules */
	var InstanceModules = {};
	var disabledModules = [];

	this.modules = {};

	/*
		loads a JOBAD module if not yet loaded. 
		@param module Name of module to load. 
		@param options Array of options to pass to the module. 
		@param ignoredeps Boolean. Ignore dependencies? (Default: false). 
		@returns boolean
	*/
	this.modules.load = function(module, options, ignoredeps){
		if(me.modules.loaded(module)){
			return;	
		}

		var ignoredeps = (typeof ignoredeps == 'boolean')?ignoredeps:false;
	
		if(ignoredeps){
			if(!JOBAD.modules.available(module)){
				JOBAD.error('Missing module: '+module);			
			}
			InstanceModules[module] = new JOBAD.modules.loadedModule(module, options, me);
			return true;
		} else {
			var deps = JOBAD.modules.getDependencyList(module);
		        if(!deps){
				JOBAD.console.warn("Warning: Can't load module <"+module+">: Module not found. "); //Module not found (has no dependecnies)
				return false;	
			}
			for(var i=0;i<deps.length;i++){
				me.modules.load(deps[i], options, true);
			}
			return true;
		}
		

	 };

	/*
		Checks if a module is loaded. 
		@param module Name of the module to check. 
		@returns boolean
	*/
	this.modules.loaded = function(module){
		return InstanceModules.hasOwnProperty(module);
	}

	/*
		Deactivates a module
		@param module Module to be deactivated. 
	*/
	this.modules.deactivate = function(module){
		if(me.modules.isActive(module)){
			JOBAD.error("Module '"+module+"' is already deactivated. ");	
		}
		disabledModules.push(module);
	}

	/*
		Activates a module
		@param module Module to be activated. 
	*/
	this.modules.activate = function(module){
		if(me.modules.isActive(module)){
			JOBAD.error("Module '"+module+"' is already activated. ");	
		}
		disabledModules = _.without(disabledModules, module);
	};
	
	/*
		Checks if a module is active. 
		@param module Module to check. 
	*/
	this.modules.isActive = function(module){
		return (_.indexOf(disabledModules, module)==-1); 
	};
	
	/*
		Iterate over all active modules with callback. 
		if cb returns false, abort. 
		@param callback Function to call. 
		@returns Array of results. 
	*/
	this.modules.iterate = function(callback){
		var res = [];
		for(var key in InstanceModules){
			if(InstanceModules.hasOwnProperty(key)){
				if(me.modules.isActive(key)){
					var cb = callback(InstanceModules[key]);
					if(!cb){
						return res;					
					} else {
						res.push(cb);					
					}
				}			
			}		
		}
		return res;
	};
	
	/*
		Iterate over all active modules with callback. Abort once some callback returns false. 
		@param callback Function to call. 
		@returns true if no callback returns false, otherwise false. 
	*/
	this.modules.iterateAnd = function(callback){
		for(var key in InstanceModules){
			if(InstanceModules.hasOwnProperty(key)){
				if(me.modules.isActive(key)){
					var cb = callback(InstanceModules[key]);
					if(!cb){
						return false;					
					}
				}			
			}		
		}
		return true;
	};
	
	/* Event core function(s) */

	/*
		Simulates an event. This will intervene with the page. 
		@param type Type of the event to trigger. Should be 'keypress', 'click', 'contextmenu', 'hover' 
		@param argument Argument for the event. 
		@returns booelan: was something done.  
	*/
	this.Event = function(type, argument){
		switch(type){
			case 'keypress':
				break;
			case 'click':
				break;
			case 'contextmenu':
				break;
			case 'hover':
				break;
			default:
				break;
		}
	}

	/* Setup core function */
	/* Setup on an Element */

	var enabled = false;

	/*
		Enables or disables this JOBAD instance. 
		@returns boolean indicating if the status was changed.  
	*/
	this.Setup = function(){
		if(enabled){
			return me.Setup.disable();	//unimplemented
		} else {
			return me.Setup.enable();
		}
	}

	/*
		Enables this JOBAD instance 
		@returns boolean indicating success. 
	*/
	this.Setup.enable = function(){
		if(enabled){
			return false;
		}

		var root = me.element;

		me.Setup.enableLeftClick(root);
		me.Setup.enableHover(root);
		me.Setup.enableContextMenu(root);

		return true;
	}

	/*
		Disables this JOBAD instance. 
		@returns boolean indicating success. 
	*/
	this.Setup.disable = function(){
		if(!enabled){
			return false;
		}		
		var root = me.element;

		me.Setup.disableLeftClick(root);
		me.Setup.disableHover(root);
		me.Setup.disableContextMenu(root);

		return true;
	}

	/* Events */ 

	/* left Click */

	/*
		Returns of left clicking an argument. 
		@param target Element to left click. 
		@returns true
	*/
	this.Event.LeftClick = function(target){
		return me.modules.iterateAnd(function(module){
			module.leftClick(target);
			return true;
		});
	};	

	/*
		Triggers a left click on an element. 
		@param source Element to left click. 
		@returns true
	*/
	this.Event.triggerLeftClick = function(source){
		var EventResult = me.Event.LeftClick(source);
		return EventResult;
	}

	/*
		enables the left click on a certain element. 
		@param root The root element to register left clicking on. 
	*/
	this.Setup.enableLeftClick = function(root){
		root.delegate("*", 'click.JOBAD.leftClick', function(event){
			var element = $(event.target); //The base element. 
			switch (event.which) {
				case 1:
					/* left mouse button => left click */
					me.Event.triggerLeftClick(element);
					event.stopPropagation(); //Not for the parent. 
					break;
				default:
					/* nothing */
			}
		});
	}
	/*
		disables the left click on a certain element. 
		@param root The root element to deregister left clicking on. 
	*/
	this.Setup.disableLeftClick = function(root){
		root.undelegate("*", 'click.JOBAD.leftClick');	
	}

	/* hoverText */

	var activeHoverElement = undefined;
	
	/*
		Returns the result of hovering. 
		@param target Element to Hover. 
		@returns a jquery object to use as hover text or false. 
	*/
	this.Event.HoverText = function(target){
		var res = false;
		me.modules.iterate(function(module){
			var hoverText = module.hoverText(target);
			if(typeof hoverText != 'undefined' && typeof res == "boolean"){//trigger all hover handlers ; display only the first one. 
				if(typeof hoverText == "string"){
					res = $("<p>").text(hoverText)			
				} else if(typeof hoverText != "boolean"){
					try{
						res = jQuery(hoverText);
					} catch(e){
						JOBAD.error("Error (FATAL): Module <"+module.info().identifier+"> returned invalid HOVER result. ");
					}
				} else if(hoverText === true){
					res = true;
				}
			}
			return true;
		});
		return res;
	};

	/*
		Creates a hover effect on an element. 
		@param source Element to Hover. 
		@returns boolean indicating success. 
	*/
	this.Event.triggerHoverText = function(source){
		if(source.data('JOBAD.hover.Active')){
			return false;		
		}

		var EventResult = me.Event.HoverText(source); //try to do the event
		
		if(typeof EventResult == 'boolean'){
			return EventResult;		
		}

		if(activeHoverElement instanceof jQuery)//something already active
		{
			if(activeHoverElement.is(source)){
				return true; //done and die			
			}
			me.Event.unTriggerHoverText(activeHoverElement);	
		}

		activeHoverElement = source;

		source.data('JOBAD.hover.Active', true);		
		
		var tid = window.setTimeout(function(){
			source.removeData('JOBAD.hover.timerId');
			JOBAD.UI.hover.enable(EventResult.html());
		}, JOBAD.config.hoverdelay)

		source.data('JOBAD.hover.timerId', tid);//save timeout id
		return true;

	}


	/*
		Removes a hover effect from an element
		@param source element from which hover will be removed. 
		@returns boolean indicating success
	*/
	this.Event.unTriggerHoverText = function(source){

		if(typeof source == 'undefined'){
			if(activeHoverElement instanceof jQuery){
				source = activeHoverElement;
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
		activeHoverElement = undefined;
		JOBAD.UI.hover.disable();

		if(!source.is(me.element)){
			me.Event.triggerHoverText(source.parent());//we are in the parent now
			return false;
		}

		return true;
	}

	/*
		Enables hovering on the specefied element. 
		@param root the element to enable hovering on. 	
	*/
	this.Setup.enableHover = function(root){

		var trigger = function(event){
			var res = me.Event.triggerHoverText($(this));
			if(res){//something happened here: dont trigger on parent
				event.stopPropagation();
			} else if(!$(this).is(root)){ //I have nothing => trigger the parent
				$(this).parent().trigger('mouseenter.JOBAD.hoverText', event); //Trigger parent if i'm not root. 	
			}
			return false;
		};


		var untrigger = function(event){
			return me.Event.unTriggerHoverText($(this));	
		};

		root
		.delegate("*", 'mouseenter.JOBAD.hoverText', trigger)
		.on('mouseenter.JOBAD.hoverText', trigger)
		.delegate("*", 'mouseleave.JOBAD.hoverText', untrigger)
		.on('mouseleave.JOBAD.hoverText', untrigger);
	}
	/*
		Disables hovering on the specefied element. 
		@param root the element to enable hovering on. 	
	*/
	this.Setup.disableHover = function(root){
		if(typeof activeHoverElement != 'undefined')
		{
			me.Event.unTriggerHoverText(activeHoverElement); //remove active Hover menu
		}
		
		root
		.undelegate("*", 'mouseenter.JOBAD.hoverText')
		.undelegate("*", 'mouseleave.JOBAD.hoverText');
	}

	/* contextMenu */

	/*
		enables context menu on a certain element. 
		@param root The root element to register the context menu on. 
	*/
	this.Setup.enableContextMenu = function(root){
		JOBAD.UI.ContextMenu.enable(root, function(target){
			return me.Event.ContextMenuEntries(target);
		});
	};

	/*
		disables context menu on a certain element. 
		@param root The root element to register the context menu on. 
	*/
	this.Setup.disableContextMenu = function(root){
		JOBAD.UI.ContextMenu.disable(root);
	};


	/*
		Returns the result of pressing a key. 
		@param key The key to press. 
		@returns nothing
	*/
	this.Event.KeyPressed = function(key){
		me.modules.iterate(function(module){
			return (module.keyPressed(key))?false:true;
		});
	};

	

	/*
		Returns the result of requesting a contextMenu. 
		@param target Element to left click. 
		@returns array of context menu entries / callback tuples or false. 
	*/
	this.Event.ContextMenuEntries = function(target){
		var res = [];
		var mods = me.modules.iterate(function(module){
				return module.contextMenuEntries(target);
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
	};
	
};

/* JOBAD Version */
JOBAD.version = "3.0.0";

/* JOBAD Global config */
JOBAD.config = 
{
	    'debug': true, //Debugging enabled? (Logs etc)
	    'hoverdelay': 1000, //Delay for showing tooltip after hovering. (in milliseconds)
	    'cleanModuleNamespace': false,//if set to true this.loadedModule instances will not allow additional functions
	    'disabledEvents': ['leftclick']
};

JOBAD.isEventDisabled = function(evtname){
	return (JOBAD.config.disabledEvents.indexOf(evtname) != -1);
};

/*
	JOBAD.console: Mimics  or wraps the native console object if available and debugging is enabled. 
*/
if(!_.isUndefined(console) && JOBAD.config.debug){//Debugging enabled / console available ? 
	
	JOBAD.console = 
	{
		"log": function(msg){
			console.log(msg);
		},
		"warn": function(msg){
			console.warn(msg);		
		},
		"error": function(msg){
			console.error(msg);		
		}
	}
} else {
	JOBAD.console = 
	{
		"log": function(){},
		"warn": function(){},
		"error": function(){}	
	}
}

/*
	JOBAD.error: Produces an error message
*/
JOBAD.error = function(msg){
	JOBAD.console.error(msg);
	throw new Error(msg);
}

/*
	Module Registration
*/
JOBAD.modules = {};

var moduleList = {};
var moduleStorage = {};

/*
	Template for modules
*/
JOBAD.modules.TEMPLATE = 
{
	/*
		Provides info about this module. 
	*/
	info:{
		'identifier':	'template',  //(Unique) identifier for this module, preferably human readable. 
		'title':	'Template Module', //Human Readable title of the module. 
		'author':	'Tom Wiesing', //Author
		'description':	'A template you may use as a starting point for writing other modules. ', //A human readable description of the module. 
		'version':	'1.0', //string containing the version number. May be omitted. 
		'dependencies':	[], //Array of module dependencies. If ommited, assumed to have no dependencies. 
		'hasCleanNamespace': true // Does this module contain only standard functions?
	},
    	globalinit: function(){
	/* 
		Called exactly once GLOBALLY. Can be used to initialise global module ids, etc. May be ommitted. Will be called once a module is loaded. 
		@this undefined. 
		@returns nothing
	*/
	},
	init: function(JOBADInstance, param1, param2, param3 /*, ... */){
		/* 	
			Called to intialise a new instance of this module. 
			@this An instance of JOBAD.modules.loadedModule
			@param JOBADInstance The instance of JOBAD the module is initiated on. 
			@param *param Initial parameters passed to this.modules.load
			@return nothing. 
		*/
	},
	keyPressed: function(checkFunc, JOBADInstance){
		/*
			called when a key is pressed. At most one keyPressed event will be activated. May be ommitted. 
			@this An instance of JOBAD.modules.loadedModule
			@param checkFunc(key) Checks if the specefied combination was pressed. Order is: alt+ctrl+meta+shift+key
			@returns Returns true iff it performed some action. 
		*/
	},
	leftClick: function(target, JOBADInstance){
		/*
			called when a left click is performed.  Every left click action is performed. May be ommitted. 
			@this An instance of JOBAD.modules.loadedModule
			@param target The element that has been left clicked on. 
			@returns Returns true iff it performed some action. 
		*/
	},
	contextMenuEntries: function(target, JOBADInstance){
		/*
			called when a context menu is requested. Context Menu entries will be merged. May be ommitted.  
			@this An instance of JOBAD.modules.loadedModule
			@param target The element the menu has been requested on. 
			@returns returns context menu entries as array [[entry_1, function_1], ..., [entry_n, function_1]] or as a map {entry_1: function_1, entry_2: function_2, ...}
				All entry names must be non-empty. (Empty ones will be ignored). 
		*/
	},
	hoverText: function(target, JOBADInstance){
		/*
			called when a hover text is requested. May be ommitted. 
			@this An instance of JOBAD.modules.loadedModule
			@param target The element the hover has been requested on. 
			@returns a text, a jqueryish ($(...), Domnode, etc) object to use as hover or a boolean indicating either the text or if something was done. 
				
		*/
	}
};

/* 
	Registers a new JOBAD module with JOBAD. 
	@param ModuleObject The ModuleObject to register. 
	@returns boolean if successfull
*/
JOBAD.modules.register = function(ModuleObject){
	var moduleObject = JOBAD.modules.createProperModuleObject(ModuleObject);
	if(!moduleObject){
		return false;	
	}
	var identifier = moduleObject.info.identifier;
	if(JOBAD.modules.available(identifier)){
		return false;	
	} else {
		moduleList[identifier] = moduleObject;
		moduleStorage[identifier] = {};
		return true;
	}
};

/* 
	Creates a proper Module Object. 
	@param ModuleObject The ModuleObject to register. 
	@returns proper Module Object (adding omitted properties etc. Otherwise false. 
*/
JOBAD.modules.createProperModuleObject = function(ModuleObject){
	if(!_.isObject(ModuleObject)){
		return false;
	}
	var properObject = 
	{
		"globalinit": function(){},
		"init": function(){},
		"keyPressed": function(){},
		"leftClick": function(){},
		"contextMenuEntries": function(){},
		"hoverText": function(){},
	};
	
	for(var key in properObject){
		if(properObject.hasOwnProperty(key) && 	ModuleObject.hasOwnProperty(key)){
			var obj = ModuleObject[key];
			if(typeof obj != 'function'){
				return false;			
			}
			properObject[key] = ModuleObject[key];
		}
	}

	if(ModuleObject.hasOwnProperty("info")){
		var info = ModuleObject.info;
		properObject.info = {
			'version': '',
			'dependencies': []	
		};
		
		if(info.hasOwnProperty('version')){
			if(typeof info['version'] != 'string'){
				return false;			
			}
			properObject.info['version'] = info['version'];
		}

		if(info.hasOwnProperty('hasCleanNamespace')){
			if(info['hasCleanNamespace'] == false){
				properObject.info.hasCleanNamespace = false;
			} else {
				properObject.info.hasCleanNamespace = true;
			}
		} else {
			properObject.info.hasCleanNamespace = true;			
		}

		if(info.hasOwnProperty('dependencies')){
			var arr = info['dependencies'];
			if(!_.isArray(arr)){
				return false;			
			}
			properObject.info['dependencies'] = arr;
		}

		try{
			_.map(['identifier', 'title', 'author', 'description'], function(key){
				if(info.hasOwnProperty(key)){
					var infoAttr = info[key];
					if(typeof infoAttr != 'string'){
						throw ""; //return false;
					}
					properObject.info[key] = infoAttr;
				} else {
					throw ""; //return false;
				}
			});
		} catch(e){
			return false;		
		}

		//TODO: Check for cleanModuleNameSpace
		/* properties which are allowed (clean) */		
		var CleanProperties = 
		[
			'info',
			'globalinit',
			'init',
			'keyPressed',
			'leftClick',
			'contextMenuEntries',
			'hoverText'
		];

		properObject.namespace = {};

		for(var key in ModuleObject){
			if(ModuleObject.hasOwnProperty(key) && CleanProperties.indexOf(key) == -1){
				if(properObject.info.hasCleanNamespace){
					JOBAD.console.warn("Warning: Module '"+properObject.info.identifier+"' says its namespace is clean, but property '"+key+"' found. Check ModuleObject.info.hasCleanNamespace. ");	
				} else {
					properObject.namespace[key] = ModuleObject[key];
				}
			}
		}

		
		
		
		return properObject;

	} else {
		return false;	
	}

};

/* 
	Checks if a module is available. 
	@param name The Name to check. 
	@param checkDeps Optional. Should dependencies be checked? (Will result in an endless loop if circular dependencies exist.) Default false. 
	@returns boolean.
*/
JOBAD.modules.available = function(name, checkDeps){
	var checkDeps = (typeof checkDeps == 'boolean')?checkDeps:false;
	var selfAvailable = moduleList.hasOwnProperty(name);
	if(checkDeps && selfAvailable){
		var deps = moduleList[name].info.dependencies;
		for(var i=0;i<deps.length;i++){
			if(!JOBAD.modules.available(deps[i], true)){
				return false;			
			}
		}
		return true;
	} else {
		return selfAvailable;
	}
};

/* 
	Returns an array of dependencies of name including name in such an order, thet they can all be loaded without unresolved dependencies. 
	@param name The Name to check. 
	@returns array of strings or false if some module is not available. 
*/
JOBAD.modules.getDependencyList = function(name){
	if(!JOBAD.modules.available(name, true)){
		return false;	
	}
	var depArray = [name];
	var deps = moduleList[name].info.dependencies;

        for(var i=deps.length-1;i>=0;i--){
		depArray = _.union(depArray, JOBAD.modules.getDependencyList(deps[i]));
	}
	return depArray;
};

/*
	Loads a module, assuming the dependencies are already available. 
	@param name Module to loads
	@param args Arguments to pass to the module. 
	@returns new JOBAD.modules.loadedModule instance. 
*/
JOBAD.modules.loadedModule = function(name, args, JOBADInstance){

	if(!JOBAD.modules.available(name)){
		JOBAD.error("Module is not available and cant be loaded. ");	
	}

	/*
		Storage shared accross all module instances. 
	*/
	this.globalStore = 
	{
		"get": function(prop){
			return  moduleStorage[name][prop+"_"];		
		},
		"set": function(prop, val){
			moduleStorage[name][prop+"_"] = val;
		},
		"delete": function(prop){
			delete moduleStorage[name][prop+"_"];
		}
	}
	
	var storage = {};
	/*
		Storage contained per instance of the module.  
	*/
	this.localStore = 
	{
		"get": function(prop){
			return  storage[prop];		
		},
		"set": function(prop, val){
			storage[prop] = val;
		},
		"delete": function(prop){moduleList
			delete storage[name];
		}
	}

	var ServiceObject = moduleList[name];
	/*
		Information about this module. 
	*/
	this.info = function(){
		return ServiceObject.info;
	}

	/*
		gets the JOBAD instance bound to this module object
	*/
	this.getJOBAD = function(){
		return JOBADInstance;	
	};

	//Events
	
	/*
		Simulate a key press event to pass to the module. 
		@param key Checks if the specefied combination was pressed. Order is: alt+ctrl+meta+shift+key 
	*/
	this.keyPressed = function(checkFunc){
		return ServiceObject.keyPressed.call(this, checkFunc, this.getJOBAD());
	};

	/*
		Simulate a left click event to pass to the Module. 
		@param target The Element to click left on. 
	*/
	this.leftClick = function(target){
		return ServiceObject.leftClick.call(this, target, this.getJOBAD());
	};

	/*
		Simulate a context menu request to the object. 
		@param target The element to request the context menu of. 
		@returns an array of [menu_entry_name, callback]
	*/
	this.contextMenuEntries = function(target){
		var entries = ServiceObject.contextMenuEntries.call(this, target, this.getJOBAD());

		return (_.isArray(entries))?entries:JOBAD.modules.generateMenuList(entries);
	};

	/*
		Simulate a hoverText request to pass to the object
		@param target The element to request the hover of. 
	*/
	this.hoverText = function(target){
		return ServiceObject.hoverText.call(this, target, this.getJOBAD());
	};

	//Initilisation

	if(!moduleStorage[name]["init"]){
		moduleStorage[name]["init"] = true;
		ServiceObject.globalinit.apply(undefined, []);
	}

	var params = [JOBADInstance];
	
	for(var i=0;i<args.length;i++){
		params.push(args[i]);	
	}


	if(JOBAD.config.cleanModuleNamespace){
		if(!ServiceObject.info.hasCleanNamespace){
			JOBAD.console.warn("Warning: Module '"+name+"' may have unclean namespace, but JOBAD.config.cleanModuleNamespace is true. ");		
		}
	} else {
		var orgClone = _.clone(ServiceObject.namespace);

		for(var key in orgClone){
			if(!this.hasOwnProperty(key) && orgClone.hasOwnProperty(key)){
				this[key] = orgClone[key];
			}
		}
	}

	ServiceObject.init.apply(this, params);		
};

/*
	Generates a list menu representation from an object representation. 
	@param menu Menu to generate. 
	@returns the new representation. 
*/
JOBAD.modules.generateMenuList = function(menu){
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
				res.push([key, JOBAD.modules.generateMenuList(val)]);
			}
		}
	}
	return res;
}

return JOBAD;
})();
