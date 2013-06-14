# JOBADInstance
An instance of `JOBAD` has the following properties: 

* **jQuery** `.element` The element this JOBAD instance is bound to. 

* **Object** [`.Setup`](setup.md) Namespace for setup functions
* **Object** [`.modules`](modules.md) Namespace for module related functions. 
* **Object** [`.Config`](Config.md) JOBAD Configuration namespace. 
* **Object** [`.Event`](event/index.md) Namespace for event related functions. 
* **Object** [`.Sidebar`](sidebar.md) Namespace for Sidebar Functions. 
* **Array** `.args` An array containing the parameters originally parsed to the module constructor. 
* **Function** `.showConfigUI()` Displays the configuration UI. 
* **Function** `.enableFolding(element, align)` - Enables folding on the specefied elements. Optional, defaults to JOBADInstance root element. 
	* **jQuery** `element` Element(s) to enable folding on. 
	* **String** `align`, either `left` or `right`. Optional, defaults to `left`. 