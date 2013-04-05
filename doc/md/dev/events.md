# Event Handling
Every module can register listeners to events. Whenever an event occurs JOBAD will check if there is a handler for this from any of the active modules. 

## Available events

* `leftClick`: When an element is left clicked on. 
* `contextMenu`: When an element is right clicked on, a context menu may appear. Is not triggered when the control key is pressed to allow override. 
* `hoverText`: A text which will appear in a tooltip hovering over the hovered element. 
* `onSideBarUpdate`: Called when the sidebar is upated. 

## Event handling and DOM nodes

JOBAD catches events at every level of the DOM tree up to the JOBAD root node. Then it performs the following algorithm to try to handle the event: 

* Does a module provide event handling for this event at this DOM node?
	* If yes, allow the module to handle the event and prevent the browser from handling it. 
	* If not, continue below. 
* Does this node have a parent for which JOBAD is active?
	* If so, allow the parent element to handle this event (i. e. pass it back to browser which will automatically bubble it up. )
	* If not, allow the browser to handle the event. 

This means that if, for example, the user click on a &lt;b&gt; element within a &lt;div&gt;, 
JOBAD will first check if any active module handles the left click on the &lt;b&gt;
element. If so **only** that specific module will handle this event. If not, JOBAD will check the parent &lt;div&gt; if some module can handle a click on 
the &lt;div&gt; element. 

## Multiple event handler
If there are multiple event handlers for one event, JOBAD might only execute only one. 

* `leftClick`: Every handler is executed. 
* `contextMenu`: Context Menu entries will be merged. 
* `hoverText`: Only the first handler is called. 
* `onSideBarUpdate`: Every handler is called. 

## See also
* [API Documentation for JOBAD.Events](../api/JOBAD/JOBAD.Events/index.md)
* [Modules](modules.md)
