# JOBAD.modules.TEMPLATE

This object can be used as a termplate for module objects. 

* **Object** `JOBAD.modules.TEMPLATE.info` Module information namespace. 
* **String** `JOBAD.modules.TEMPLATE.info.identifier` A unique identifier for the module. 
* **String** `JOBAD.modules.TEMPLATE.info.author` The module author. 
* **String** `JOBAD.modules.TEMPLATE.info.description` A human readable description of the module. 
* **String** `JOBAD.modules.TEMPLATE.info.version` String containing the version number. May be omitted. 
* **String** `JOBAD.modules.TEMPLATE.info.hasCleanNamespace` Booelan indicating if the namespace of this moudle contains other, custom, properties which should be copied over. If so, they will be copied to any module instance and `this` inside of any of the functions can refer to it. Note that this may be shared among different instances of the module since javascript creates references to JSON-style objects. Can also be disabled globally by configuration in which case non-clean modules will not load. Property may be omitted in which case it is assumed to be true. 
* **Array[String]** `JOBAD.modules.TEMPLATE.info.dependencies` Array of module dependencies. If ommited, assumed to have no dependencies. 

* **Function** `JOBAD.modules.TEMPLATE.globalinit()` Called exactly once GLOBALLY. Can be used to initialise global module ids, etc. May be ommitted. Will be called once a module is loaded. 
	* **Undefined** `this`
* **Function** `JOBAD.modules.TEMPLATE.init(JOBADInstance, param1, param2, param3 /*, ... */)` Called to intialise a new instance of this module. 
	* **Instance[ [JOBAD.modules.loadedModule](loadedModule.md) ]** `this` The current module instance. 
	* **Instance[ [JOBAD](../JOBADInstance/index.md) ]** `JOBADInstance` The instance of JOBAD the module is initiated on. 
	* **Mixed** `*param` Initial parameters passed to [`JOBADInstance.modules.load`](../JOBADInstance/modules.md). 
* **Function** `JOBAD.modules.TEMPLATE.keyPressed(checkFunc, JOBADInstance)` Called when a key is pressed. At most one keyPressed event will be activated. May be ommitted. 
	* **Instance[ [JOBAD.modules.loadedModule](loadedModule.md) ]** `this` The current module instance. 
	* **Function** `checkFunc(combination)` Checks if the specefied combination was pressed. Order is: alt+ctrl+meta+shift+key
	* **Instance[ [JOBAD](../JOBADInstance/index.md) ]** `JOBADInstance` The instance of JOBAD the module is initiated on. 
	* **returns** `true` if it performed some action, `false` otherwise. 
* **Function** `JOBAD.modules.TEMPLATE.leftClick(target, JOBADInstance)` Called when a left click is performed.  Every left click action is performed. May be ommitted. 
	* **Instance[ [JOBAD.modules.loadedModule](loadedModule.md) ]** `this` The current module instance. 
	* **jQuery** `target` The element that was left clicked on. 
	* **Instance[ [JOBAD](../JOBADInstance/index.md) ]** `JOBADInstance` The instance of JOBAD the module is initiated on. 
	* **returns** `true` if it performed some action, `false` otherwise. 
* **Function** `JOBAD.modules.TEMPLATE.contextMenuEntries(target, JOBADInstance)` Called when a context menu is requested. Context Menu entries will be merged. May be ommitted. 
	* **Instance[ [JOBAD.modules.loadedModule](loadedModule.md) ]** `this` The current module instance. 
	* **jQuery** `target` The element that was right clicked on. 
	* **Instance[ [JOBAD](../JOBADInstance/index.md) ]** `JOBADInstance` The instance of JOBAD the module is initiated on. 
	* **returns** context menu entries as array [[entry_1, function_1], ..., [entry_n, function_1]] or as a map {entry_1: function_1, entry_2: function_2, ...} All entry names must be non-empty. (Empty ones will be ignored). For the first notation, a function may also be a sub menu. If no context menu is available, it should return false. 
		* **Function** `callback(element, originElement)` Callback on menu entries. 
			* **Undefined** `this`
			* **jQuery** `element` The element the context menu was request on. 
			* **jQuery** `originElement` The lowest level element the menu was requested on. 
* **Function** `JOBAD.modules.TEMPLATE.hoverText(target, JOBADInstance)` Called when a hover text is requested. May be ommitted. 
	* **Instance[ [JOBAD.modules.loadedModule](loadedModule.md) ]** `this` The current module instance. 
	* **jQuery** `target` The element that was left clicked on. 
	* **Instance[ [JOBAD](../JOBADInstance/index.md) ]** `JOBADInstance` The instance of JOBAD the module is initiated on. 
	* **returns** a text, a jQuery-ish object[^1] or a boolean indicating either the text or if something was done. 

## Footnotes
[^1]: A jQuery-ish object is any object that can be passed to the main jQuery function, for example a document node or a jQuery selector. 
