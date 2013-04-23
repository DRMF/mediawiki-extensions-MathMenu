# JOBAD.UI.Sidebar

* **Object** `JOBAD.UI.Sidebar.config` - JOBAD Sidebar UI Configuration namespace
* **Number** `JOBAD.UI.Sidebar.config.width` Width of the sidebar. Default: 100. 
* **Object** `JOBAD.UI.Sidebar.config.icons` Contains urls for default icons. (Depending on the class)

* **Function** `JOBAD.UI.Sidebar.wrap(element)` - Wraps an element to create a sidebar UI. 
	* `element` a jQuery-ish object[^1] to create a sidebar for. 
	* **returns** the original element, now wrapped. 
* **Function** `JOBAD.UI.Sidebar.unwrap(element)` - Unwraps an element, destroying the sidebar. 
	* `element` a jQuery-ish object to remove the sidebar from. 
	* **returns** the original element, now unwrapped. 

* **Function** `JOBAD.UI.Sidebar.addNotification(sidebar, element)` - Adds a new notification to the sidebar. 
	* `sidebar` Sidebar to bind notification to. 
	* `element` Element to bind notification to. 
	* **returns** a new empty jQuery sidebar notification element. 
* **Function** `JOBAD.UI.Sidebar.addNotification(notification)` - Removes a notification from the sidebar. 
	* `notification` Notification to remove. 

* **Function** `JOBAD.UI.Sidebar.forceNotificationUpdate()` - Forces a sidebar notification position update. 

## Footnotes
[^1]: A jQuery-ish object is any object that can be passed to the main jQuery function, for example a document node or a jQuery selector. 



