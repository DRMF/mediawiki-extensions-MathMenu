# JOBAD.util

* **Function** `JOBAD.util.UID()` - Gets a unique id which can be used as identifier. 
* **Function** `JOBAD.util.objectEquals(a, b)` - Checks if two objects are equal. 
* **Function** `JOBAD.util.bindEverything(object, thisObject)` - Binds every function in `object` to `thisObject`. Also includes nested namespaces. 
	* **object** `object` Object to bind functions in. 
	* **object** `thisObject` Object to bind functions to. 
	* **returns** a new object containing the bound functions. 	
* **Function** `JOBAD.util.argWrap(func, wrap)` - Applies a function to the arguments of a function every time it is called. 
	* **Function** `func()` Function to wrap. 
	* **Function** `wrap(original_arguments)` Wrapper Function. 
	
* **Function** `JOBAD.util.argSlice(func, from, to)` - Applies Array.slice to the arguments of a function every time it is called. 
	* **Function** `func()` Function to wrap. 
	* **Number** `from` 
	* **Number** `to`
	

* **Function** `JOBAD.util.createRadio(texts, start)` - Creates a jQuery UI radio button. 
	* **Array** `texts` Texts to use as names. 
	* **number** `start` Identifier of the initial value.  
	* **returns** jQuery object. 
* **Function** `JOBAD.util.createTabs(names, tabs, options, height)` - Creates a jQuery UI tabs. 
	* **Array** `names` Texts to use as names for tab titles. 
	* **Array** `tabs` Elements to use as tabs. 
	* **Array** `options` Options to pass to jQuery UI Tabs. 
	* **number** `height` Optional. Height of the tabs. 
	* **returns** jQuery object. 


* **Function** `JOBAD.util.createProperUserSettingsObject(obj, modName)` - Creates a proper User Settings Object. 
	* **Object** `obj` Configuration Object
	* **String** `modName` Identifier of the module. 
	* **returns** object
	
* **Function** `JOBAD.util.getDefaultConfigSetting` - Gets the default of a configuration object. 
	* **Object** `obj` Configuration Object
	* **String** `key` Key to get. 
	* **returns** object

* **Function** `JOBAD.util.validateConfigSetting(obj, key, val)` - Validates if the specefied object of a configuration object can be set. 
	* **Object** `obj` Configuration Object
	* **String** `key` Key to validate. 
	* **Object** `value` Value to vaildate. 
	* **returns** boolean. 

* **Function** `JOBAD.util.markHidden(element)` - Marks an element as hidden. 
	* **jQuery** `element` Element to mark as hidden. 


* **Function** `JOBAD.util.markVisible(element)` - Marks an element as visible. 
	* **jQuery** `element` Element to mark as visible. 


* **Function** `JOBAD.util.markDefault(element)` - Removes any marking from an element.  
	* **jQuery** `element` Element to remove marking from. 

* **Function** `JOBAD.util.isMarkedHidden(element)` - Checks if an element is marked as hidden. 
	* **jQuery** `element` Element to check. 

* **Function** `JOBAD.util.isMarkedVisible(element)` - Checks if an element is marked as visible. 
	* **jQuery** `element` Element to check. 

* **Function** `JOBAD.util.isHidden(element)` - Checks if an element is hidden. 
	* **jQuery** `element` Element to check. 