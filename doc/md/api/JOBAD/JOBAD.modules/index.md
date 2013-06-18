# JOBAD.modules

* **Function** [`JOBAD.modules.loadedModule(name, args, JOBADInstance)`](loadedModule.md) Represents a loaded module. 
* **Array** `JOBAD.modules.ifaces` An array containing extensions to JOBAD modules. 
* **Object** `JOBAD.modules.extensions` A map containing module extensions. 
* **Array** `JOBAD.modules.cleanProperties` A list of clean module properties. 
* **Function** `JOBAD.modules.register(moduleObject)` Registers a new JOBAD module with JOBAD. 
	* **Object** `moduleObject` The object representing the module to register with JOBAD. See [`template`](../../template.md). 
	* **returns** `true` if successfull, otherwise `false`
* **Function** `JOBAD.modules.createProperModuleObject(moduleObject)` Creates a proper Module Object. 
	* **Object** `moduleObject` The object representing the module to register with JOBAD. 
	* **returns** The proper `moduleObject` (adding omitted properties etc. ) If it fails, it returns `false`. 
* **Function** `JOBAD.modules.available(name, checkDeps)` Checks if a module is registered with JOBAD. 
	* **String** `name` Name of the module to check. 
	* **Boolean** `checkDeps` Also checks if that modules dependencies are available. 
	* **returns** a boolean indicating if the module is available. 
* **Function** `JOBAD.modules.getDependencyList(name)` checks the complete dependency tree of a module. Warning: Does not check for circular dependencies. May hang up it in a loop in that case. 
	* **String** `name` Name of the module to check. 
	* **returns** an array of dependencies of name including name in such an order, thet they can all be loaded without unresolved dependencies. 

* **Function** `JOBAD.modules.createProperModuleObject(ModuleObject)` - Creates a proper Module Object. 
	* **Object** `ModuleObject` Module object which is loaded directly. 
	* **returns** object

* **Function** `JOBAD.modules.createProperUserSettingsObject(obj, modName)` - Creates a proper User Settings Object. 
	* **Object** `obj` Configuration Object
	* **String** `modName` Identifier of the module. 
	* **returns** object
	
* **Function** `JOBAD.modules.getDefaultConfigSetting(obj, key)` - Gets the default of a configuration object. 
	* **Object** `obj` Configuration Object
	* **String** `key` Key to get. 
	* **returns** object

* **Function** `JOBAD.modules.validateConfigSetting(obj, key, val)` - Validates if the specefied object of a configuration object can be set. 
	* **Object** `obj` Configuration Object
	* **String** `key` Key to validate. 
	* **Object** `value` Value to vaildate. 
	* **returns** boolean. 
