# JOBAD.UI.Folding

* **Object** `JOBAD.UI.Folding.config` - JOBAD Folding UI Configuration namespace. 
* **Number** `JOBAD.UI.Folding.config.placeHolderHeight` - Default Height for the folded placeholders. (Default: 50)
* **jQuery** `JOBAD.UI.Folding.config.placeHolderContent` - jQuery-ish stuff in the placeholder. Ignored for livePreview mode. 

* **Function** `JOBAD.UI.Folding.enable(element, config)` - Enables folding on an element. 
	* **jQuery** `element` - Element(s) to enable folding on. 
	* **Object** `config` - Configuration. Optional. `element` is the element that is being folded. 
		* **Function** `config.enable(element)` Callback on enable. 
        * **Function** `config.disable(element)` Callback on disable
        * **Function** `config.fold(element)`  Callback on folding
        * **Function** `config.unfold(element)` Callback on unfold
        * **Function** `config.stateChange(element)` Callback on state change. 
        * **Function** `config.update(element)` Called every time the folding UI is updated. 
        * **Object** `config.align` Alignment of the folding. Either 'left' (default) or 'right'.  
        * **Number** `config.height` Height fo the preview / replacement element. Leave empty to assume default. 
        * **Boolean** `config.livePreview` Enable live preview for an element. Default: true. 
    * **returns** `element`. 

* **Function** `JOBAD.UI.Folding.disable(element, keep)` - Disables folding on an element. 
	* **jQuery** `element` - Element(s) to disable folding on. 
	* **Boolean** `keep` - If set to true, the element will remain hidden if it currently is hidden. 

        
* **Function** `JOBAD.UI.Folding.update(update)` - Updates a folded element. 
	* **jQuery** `element` - Element(s) to update folding on. 
	* **returns** boolean

* **Function** `JOBAD.UI.Folding.fold(update)` - Folds an element. 
	* **jQuery** `element` - Element(s) to fold. 
	* **returns** boolean

* **Function** `JOBAD.UI.Folding.unfold(update)` - Unfolds an element. 
	* **jQuery** `element` - Element(s) to unfold. 
	* **returns** boolean