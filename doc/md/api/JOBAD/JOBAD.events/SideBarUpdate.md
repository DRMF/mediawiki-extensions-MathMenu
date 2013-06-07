# JOBAD.events.SideBarUpdate

The SideBarUpdate event is triggered every time the sidebar is updated. 

* **Function** `JOBAD.events.SideBarUpdate.default()` The default Event Handler for SideBarUpdate Events. Just returns false. 

* **Function** `JOBAD.events.SideBarUpdate.Setup.enable(root)` Enables the SideBarUpdate event. 
	* **Instance[ [JOBAD](../JOBADInstance/index.md) ]** `this` The JOBAD Instance to work on. 
	* **jQuery** `root` The root element to enable SideBarUpdate on. 
* **Function** `JOBAD.events.SideBarUpdate.Setup.disable(root)` Disables the SideBarUpdate event. 
	* **Instance[ [JOBAD](../JOBADInstance/index.md) ]** `this` The JOBAD Instance to work on. 
	* **jQuery** `root` The root element to disable SideBarUpdate on. 

* **Function** `JOBAD.events.SideBarUpdate.namespace.getResult()` Get the Result of the SideBarUpdate event handlers. 
	* **Instance[ [JOBAD](../JOBADInstance/index.md) ]** `this` The JOBAD Instance to work on. 

* **Function** `JOBAD.events.SideBarUpdate.namespace.trigger()` Trigger the SideBarUpdate event. 
	* **Instance[ [JOBAD](../JOBADInstance/index.md) ]** `this` The JOBAD Instance to work on. 

* **Object** `JOBAD.events.SideBarUpdate.Setup.init.Sidebar` - Namespace for [JOBADInstance](../JOBADInstance/index.md) related sidebar functions. 

* **Function** `JOBAD.events.SideBarUpdate.Setup.init.Sidebar.redraw()` Redraws the sidebar. **To redraw the sidebar use this function **
	* **Instance[ [JOBAD](../JOBADInstance/index.md) ]** `this` The JOBAD Instance to work on. 
* **Function** `JOBAD.events.SideBarUpdate.Setup.init.Sidebar.redrawSB()` Redraws the sidebar for the display style right. 
	* **Instance[ [JOBAD](../JOBADInstance/index.md) ]** `this` The JOBAD Instance to work on. 
* **Function** `JOBAD.events.SideBarUpdate.Setup.init.Sidebar.redrawTB()` Redraws the sidebar for the display style bound to element. 
	* **Instance[ [JOBAD](../JOBADInstance/index.md) ]** `this` The JOBAD Instance to work on. 

* **Function** `JOBAD.events.SideBarUpdate.Setup.init.Sidebar.registerNotification(element, config, autoRedraw)` Registers a new notification on the sidebar. 
	* **Instance[ [JOBAD](../JOBADInstance/index.md) ]** `this` The JOBAD Instance to work on. 
	* **jQuery** `element` An element to register the notification on. 
	* **Object** `config` A map which may contain any of the following members: 
		* **String** `config.class` Notification class. If provided should be one of "info", "warning" or "error". 
		* **String** `config.icon` An icon to use for the notification. Default depends on `config.class`. 
		* **String** `config.menu` A context menu for the notification. 
		* **String** `config.text` A text to use for the notification. 
		* **Boolean** `config.trace` Highlight the original element when hovering the notification ? 
		* **Function** `config.click` On click callback. 
	* **Boolean** `autoRedraw` Optional. Should the sidebar be redrawn? (default: true)
	* **returns** a jQuery element representing the added notification if autoredraw is true, otherwise nothing. 
	
	
	* **returns** a jQuery element representing the added notification. 

* **Function** `JOBAD.events.SideBarUpdate.Setup.init.Sidebar.removeNotification(notification, autoRedraw)` Removes a notification from the sidebar. **To remove an element use this function **
	* **Instance[ [JOBAD](../JOBADInstance/index.md) ]** `this` The JOBAD Instance to work on. 
	* **jQuery** `notification` A jQuery element represnting the notification. 
	* **Boolean** `autoRedraw` Optional. Should the sidebar be redrawn? (default: true)

* **Function** `JOBAD.events.SideBarUpdate.Setup.init.Sidebar.removeNotificationSB(notification, autoRedraw)` Removes a notification from the sidebar for the display style right. 
	* **Instance[ [JOBAD](../JOBADInstance/index.md) ]** `this` The JOBAD Instance to work on. 
	* **jQuery** `notification` A jQuery element represnting the notification. 
	* **Boolean** `autoRedraw` Optional. Should the sidebar be redrawn? (default: true)

* **Function** `JOBAD.events.SideBarUpdate.Setup.init.Sidebar.removeNotificationTB(notification, autoRedraw)` Removes a notification from the sidebar for the display style bound to element. 
	* **Instance[ [JOBAD](../JOBADInstance/index.md) ]** `this` The JOBAD Instance to work on. 
	* **jQuery** `notification` A jQuery element represnting the notification. 
	* **Boolean** `autoRedraw` Optional. Should the sidebar be redrawn? (default: true)
	
* **Function** `JOBAD.events.SideBarUpdate.Setup.init.Sidebar.forceInit()` Forces an initialisation of the sidebar. 
	* **Instance[ [JOBAD](../JOBADInstance/index.md) ]** `this` The JOBAD Instance to work on. 

* **Function** `JOBAD.events.SideBarUpdate.Setup.init.Sidebar.makeCache()` Creates a cache of requests for all currently active notifications. 
	* **Instance[ [JOBAD](../JOBADInstance/index.md) ]** `this` The JOBAD Instance to work on. 
	
* **Function** `JOBAD.events.SideBarUpdate.Setup.init.Sidebar.toSB()` Removes the bound to element style sidebar and switches to the right sidebar. 
	* **Instance[ [JOBAD](../JOBADInstance/index.md) ]** `this` The JOBAD Instance to work on. 
	
* **Function** `JOBAD.events.SideBarUpdate.Setup.init.Sidebar.toTB()` Removes the right style sidebar and switches to the bound to element sidebar. 
	* **Instance[ [JOBAD](../JOBADInstance/index.md) ]** `this` The JOBAD Instance to work on. 
