# API Documentation

* [JOBAD](JOBAD/index.md) - Main JOBAD Namespace
	* [JOBADInstance](JOBAD/JOBADInstance/index.md) - JOBAD Instance functions
	* [JOBAD.config](JOBAD/JOBAD.config/index.md) - Global Configuration namespace
	* [JOBAD.console](JOBAD/JOBAD.console.md) - Wraps the native console object if available. 
	* [JOBAD.UI](JOBAD/JOBAD.UI/index.md) - Global UI Namespace
	* [JOBAD.modules](JOBAD/JOBAD.modules/index.md) - Modules API
	

## Documentation Convention
An Object is documented like this:

* **Type** `Name`: Description
	* description of properties
	* **returns** Return value. 

If **returns** is omitted then the Object is either not a function or it returns `undefined`. 

The following types are available: 

* `Undefined` Javascripts undefined. 
* `Object` A javascript object of string / object pairs. Often used as namespace. 
* `Boolean` A javascript boolean object. Is either `true` or `false`. 
* `Number` A javascript number object. This should not be `NaN`, `Infinity` or `-Infinity` unless specefied otherwise. 
* `String` A javascript string. 
* `Function` A javascript function. 
* `Instance[`**Function**`]` Instance of the specefied function. Addtionally has the following abbreviations: 
	* `jQuery` is the same as `Instance[jQuery]`
	* `JOBAD` is the same as `Instance[JOBAD]`
* `Array[`**Type**`][`**Length**`]` Array of specefied type and length. Unless specefied otherwise, this may be empty. If length is omitted, the array can have any length. 
* `Mixed` May be any of the types specefied above. May be further restricted by the appopriate description.  

## See also

* [Module](../modules/index.md) - A list of all available modules. 
