# JOBAD
This object is the main JOBAD Namespace. 

* **Function** `JOBAD(JOBADRootElement)` Creates a new instance of `JOBAD` bound to `JOBADRootElement`. 
	* `JOBADRootElement` a jQuery-ish object[^1] to bind a new JOBAD instance to. 
	* **returns** a new [`JOBAD`](JOBADInstance/index.md) instance. 

* **String** `JOBAD.version` - The current JOBAD Version ('3.0.0')
* **Object** [`JOBAD.config`](JOBAD.config/index.md) - Global Configuration namespace. 
* **Object** [`JOBAD.console`](JOBAD.console.md) - Wraps the native console object if available. 
* **Object** [`JOBAD.UI`](JOBAD.UI/index.md) - Global UI Namespace. 
* **Object** [`JOBAD.modules`](JOBAD.modules/index.md) - Namespace for global module registering. 

* **Function** `JOBAD.error(msg)` Produces an error message. 
	* **String** `msg` The message to produce. 

* **Object** [`JOBAD.Events`](JOBAD.Events/index.md) - JOBAD Event Namespace. 

* **Function** `JOBAD.isEventDisabled(evtName)` Checks if an event is globally disabled. 
	* **String** `evtName` Name of the event to check. 
	* **returns** a boolean. 

* **Object** [`JOBAD.util`](JOBAD.util.md) - Contains Utility functions. 

* **Function** [`JOBAD.noConflict`](JOBAD.noConflict.md) - Provides a way to free the variables used by JOBADs dependencies. 
* **Object** [`JOBAD.refs`](JOBAD.refs.md) - Contains internal references to  JOBADs dependencies. 

## Footnotes
[^1]: A jQuery-ish object is any object that can be passed to the main jQuery function, for example a document node or a jQuery selector. 
