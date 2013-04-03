# Known Issues & TODO

## TODO / API Drafts

* Implement Sidebar Event API
	* register on certain elements. Possible API: 
		* `ModuleObject.onUpdate(JOBADInstance)` - Called when any update on the element occurs (jQuery mutation events / or just after every call?)
		* `JOBADInstance.sidebar.forceupdate()` - force an update on the sidebar
			* `loadedModule.reportChange()` - calls the mathod above. (report when an element changed)
		* `JOBADInstance.sidebar.register(target, options, callback, UUID_PREFIX)` - register on an element - returns UUID
			* `loadedModule.registerSidebarElement(target, options, callback)` - calls above with prefix
		* `JOBADInstance.sidebar.unregister(UUID)` - unregister by UUID
			* `loadedModule.unregisterSidebarElement(target, options, callback)`
* Add options for `JOBADInstance` (allow for local disabling of certain events). Possible API: 
	* `JOBADInstance(element, [modules2Load | options])`
	* `JOBADInstance.Events.enable(eventName)`
	* `JOBADInstance.Events.disable(eventName)`
	* `JOBADInstance.Events.isEnabled(eventName)`
* Implement keyPress Event

## Known Issues

* Hover / Context Menu UI sometimes overlap
* Hover behaves strangely with children
* ContextMenu submenu sometimes not wide enough (jQuery UI bug?)
* Example modules undocumented
* Debug enabled by default
