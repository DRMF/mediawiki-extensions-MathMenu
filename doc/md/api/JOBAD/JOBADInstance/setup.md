# JOBADInstance.Setup
* **Function** `.Setup()` Toggles the state of this JOBAD instance. 
* **Function** `.Setup.isEnabled()` Checks if this JOBAD instance is currently enabled. 
	* **returns** a boolean indicating if this instance of JOBAD is active. 
* **Function** `.Setup.enable()` Enables this JOBAD instance. 
	* **returns** boolean indicating success. 
* **Function** `.Setup.disable()` Disables this JOBAD instance. 
	* **returns** boolean indicating success. 

* **Function** `.Setup.enableLeftClick(root)` Enables the left click on a certain (root) element. 
	* **jQuery** `root` The root element to register left clicking on. 

* **Function** `.Setup.disableLeftClick(root)` Disables the left click on a certain element.
	* **jQuery** `root` The root element to unregister left clicking on. 

* **Function** `.Setup.enableHover(root)` Enables hovering on the specefied (root) element. 
	* **jQuery** `root` The element to enable hovering on. 

* **Function** `.Setup.disableHover(root)` Disables hovering on the specefied element. 
	* **jQuery** `root` The element to disable hovering on. 

* **Function** `.Setup.enableContextMenu(root)` Enables context menu on a certain element. 
	* **jQuery** `root` The element to register the context menu on. 

* **Function** `.Setup.disableContextMenu(root)` Disables context menu on a certain element. 
	* **jQuery** `root` The element to deregister the context menu on. 

