/*
	JOBAD Configuration
*/
JOBAD.storageBackend = {
	"getKey": function(key, def){
		var res = JOBAD.storageBackend.engines[JOBAD.config.storageBackend][0](key);
		if(typeof res == "string"){
			return JSON.parse(res);
		} else {
			return def;
		}
	}, 
	"setKey": function(key, value){return JOBAD.storageBackend.engines[JOBAD.config.storageBackend][1](key, JSON.stringify(value));}
}

JOBAD.storageBackend.engines = {
	"none": [function(key){}, function(key, value){}]
}

JOBAD.config.storageBackend = "none";

/*
	Validates if specefied object of a configuration object can be set. 
	@param	obj Configuration Object
	@param	key	Key to validate. 
	@param	val	Value to vaildate. 
	@returns boolean
*/
JOBAD.util.validateConfigSetting = function(obj, key, val){
	if(!obj.hasOwnProperty(key)){
		JOBAD.console.warn("Undefined user setting: "+key);
		return false;
	}
	var type = obj[key][0];
	var validator = obj[key][1];
	switch(type){
		case "string":
			if(typeof val != "string"){
				return false;
			}
			if(JOBAD.refs._.isRegExp(validator)){
				return validator.test(val);
			} else if(typeof validator == 'function') {
				return validator(val);
			} else {
				return true;
			}
			break;
		case "bool":
			return (typeof val == "boolean");
			break;
		case "integer":
			if(typeof val != "number" || val % 1 != 0){
				return false;
			}
			if (typeof validator == "function"){
				return validator(val);
			} else if(JOBAD.refs._.isArray(validator)){
				return (val >= validator[0] && val <= validator[1]);
			} else {
				return true;
			}
			break;
		case "number":
			if(typeof val != "number"){
				return false;
			}
			if (typeof validator == "function"){
				return validator(val);
			} else if(JOBAD.refs._.isArray(validator)){
				return (val >= validator[0] && val <= validator[1]);
			} else {
				return true;
			}
			break;
		case "list":
			return validator.indexOf(val) != -1;
			break;
		default:
			JOBAD.console.warn("Unknown configuration type '"+type+"' for user setting '"+key+"'");
			break;
	}
};

/*
	Gets the default of a configuration object
	@param	obj Configuration Object
	@param	key	Key to get. 
	@returns object
*/
JOBAD.util.getDefaultConfigSetting = function(obj, key){
	if(!obj.hasOwnProperty(key)){
		JOBAD.console.warn("Undefined user setting: "+key);
		return;
	}
	var val = obj[key][2];
	if(JOBAD.util.validateConfigSetting(obj, key, val)){
		return val;
	} else {
		JOBAD.console.warn("Undefined user setting: "+obj);
	}
};

var configCache = {};

JOBAD.modules.extensions.config = {
	"required": false, //not required
	
	"validate": function(prop){return true; }, //anything is ok
	
	"init": function(available, value, originalObject, properObject){
		return available ? value : {};
	},
	
	"onLoad": function(value, properObject, loadedModule){
		var id = properObject.info.identifier;
		
		this.UserConfig = {};
		
		this.UserConfig.set = function(prop, val){
			if(this.UserConfig.canSet(prop, val)){
				configCache[id][prop] = val;
			} else {
				JOBAD.console.warn("Can not set user config '"+prop+"': Validation failure. ");
			}
			JOBAD.storageBackend.setKey(id, configCache[id]);
		};
		
		this.UserConfig.canSet = function(prop, val){
			return JOBAD.util.validateConfigSetting(value, prop, val);
		};
		
		this.UserConfig.get = function(prop){
			var res = configCache[id][prop];
			if(JOBAD.util.validateConfigSetting(value, prop, res)){
				return res;
			} else{
				JOBAD.console.log("Failed to access user setting '"+prop+"'");
			}
		};
		
		this.UserConfig.getTypes = function(){
			return JOBAd.refs._.clone(value);
		}
		
		this.UserConfig.reset = function(prop){
			configCache[id] = JOBAD.storageBackend.getKey(id);
			if(typeof configCache[id] == "undefined"){
				configCache[id] = {};
				for(var key in value){
					configCache[id][key] = JOBAD.util.getDefaultConfigSetting(value, key);
				}
			}
		};
		
		if(!configCache.hasOwnProperty(id)){//not yet loaded by some other JOBAD
			this.UserConfig.reset();
		}
	}
}