/*
	JOBAD 3 UI Functions
	JOBAD.ui.overlay.js
	
	requires: 
		JOBAD.core.js
		JOBAD.ui.js
		JOBAD.util.js
		
	Copyright (C) 2013 KWARC Group <kwarc.info>
	
	This file is part of JOBAD.
	
	JOBAD is free software: you can redistribute it and/or modify
	it under the terms of the GNU General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.
	
	JOBAD is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU General Public License for more details.
	
	You should have received a copy of the GNU General Public License
	along with JOBAD.  If not, see <http://www.gnu.org/licenses/>.
*/
//JOBAD UI Overlay namespace. 
JOBAD.UI.Overlay = {};

/*
	Draws an overlay for an element. 
	@param	element			Element to draw overlay for. 
*/
JOBAD.UI.Overlay.draw = function(element){

	//trigger undraw
	var element = JOBAD.refs.$(element);

	//trigger undraw
	JOBAD.UI.Overlay.undraw(element.find("div.ui-widget-overlay").parent());
	
	//get offset for element and draw it. 
	var offset = element.offset()
	var overlay_element = JOBAD.refs.$('<div>')
	.css({
		"position": "absolute",
		"top": offset.top
,		"left": offset.left,
		"width": JOBAD.refs.$(element).outerWidth(),
		"height": JOBAD.refs.$(element).outerHeight()
	})
	.addClass('ui-widget-overlay ui-front')
	.appendTo(element);

	JOBAD.util.markHidden(overlay_element); //hide the overlay element

	//listen for undraw
	element.one("JOBAD.UI.Overlay.undraw", function(){
		overlay_element.remove();
	})

	return overlay_element;
}

/*
	Removes the overlay from an element. 
	@param	element	element to remove overlay from. 
*/
JOBAD.UI.Overlay.undraw = function(element){
	return JOBAD.refs.$(element).trigger("JOBAD.UI.Overlay.undraw");
}