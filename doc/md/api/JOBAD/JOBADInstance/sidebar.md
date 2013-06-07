# JOBADInstance.Sidebar
	
* **Function** `.Sidebar.redraw()` Redraws the sidebar. **To redraw the sidebar use this function **
	* **Instance[ [JOBAD](../JOBADInstance/index.md) ]** `this` The JOBAD Instance to work on. 
* **Function** `.Sidebar.redrawSB()` Redraws the sidebar for the display style right. 
	* **Instance[ [JOBAD](../JOBADInstance/index.md) ]** `this` The JOBAD Instance to work on. **Do not use**
* **Function** `.Sidebar.redrawTB()` Redraws the sidebar for the display style bound to element. 
	* **Instance[ [JOBAD](../JOBADInstance/index.md) ]** `this` The JOBAD Instance to work on. **Do not use**

* **Function** `.Sidebar.registerNotification(element, config, autoRedraw)` Registers a new notification on the sidebar. 
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

* **Function** `.Sidebar.removeNotification(notification, autoRedraw)` Removes a notification from the sidebar. **To remove an element use this function **
	* **Instance[ [JOBAD](../JOBADInstance/index.md) ]** `this` The JOBAD Instance to work on. 
	* **jQuery** `notification` A jQuery element represnting the notification. 
	* **Boolean** `autoRedraw` Optional. Should the sidebar be redrawn? (default: true)

* **Function** `.Sidebar.removeNotificationSB(notification, autoRedraw)` Removes a notification from the sidebar for the display style right. **Do not use**
	* **Instance[ [JOBAD](../JOBADInstance/index.md) ]** `this` The JOBAD Instance to work on. 
	* **jQuery** `notification` A jQuery element represnting the notification. 
	* **Boolean** `autoRedraw` Optional. Should the sidebar be redrawn? (default: true)

* **Function** `.Sidebar.removeNotificationTB(notification, autoRedraw)` Removes a notification from the sidebar for the display style bound to element. **Do not use**
	* **Instance[ [JOBAD](../JOBADInstance/index.md) ]** `this` The JOBAD Instance to work on. 
	* **jQuery** `notification` A jQuery element represnting the notification. 
	* **Boolean** `autoRedraw` Optional. Should the sidebar be redrawn? (default: true)

* **Function** `.Sidebar.forceInit()` Forces an initialisation of the sidebar. **Do not use**
	* **Instance[ [JOBAD](../JOBADInstance/index.md) ]** `this` The JOBAD Instance to work on. 

* **Function** `.Sidebar.makeCache()` Creates a cache of requests for all currently active notifications.   **Do not use**
	* **Instance[ [JOBAD](../JOBADInstance/index.md) ]** `this` The JOBAD Instance to work on. 
	
* **Function** `.Sidebar.toSB()` Removes the bound to element style sidebar and switches to the right sidebar.  **Do not use**
	* **Instance[ [JOBAD](../JOBADInstance/index.md) ]** `this` The JOBAD Instance to work on. 
	
* **Function** `.Sidebar.toTB()` Removes the right style sidebar and switches to the bound to element sidebar.   **Do not use**
	* **Instance[ [JOBAD](../JOBADInstance/index.md) ]** `this` The JOBAD Instance to work on. 

	
* **Array** `.Sidebar.ElementRequestCache` Cache for elements yet to register to the sidebar. **Do not modify**
* **Object** `.Sidebar.PastRequestCache` Request cache for elements registered with the sidebar. **Do not modify** 
* **Object** `.Sidebar.Elements` All elements currently registered with the sidebar. **Do not modify**


## See also
* [`JOBADInstance.Event.onSideBarUpdate`](event/onSideBarUpdate.md)
