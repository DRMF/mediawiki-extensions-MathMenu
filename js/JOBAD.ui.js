/* 
	JOBAD 3 UI Functions
	requires JOBAD.core.js
*/

(function(JOBAD){

	//Mouse coordinates
	var mouseCoords = [0, 0];

	$(document).on("mousemove.JOBADListener", function(e){
		mouseCoords = [e.pageX-$(window).scrollLeft(), e.pageY-$(window).scrollTop()];
	});

	//UI Namespace. 
	JOBAD.UI = {}

	//Hover UI. 
	JOBAD.UI.hover = {}

	JOBAD.UI.hover.config = {
		"offsetX": 10, //offset from the mouse in X and Y
		"offsetY": 10	
	}
	
	var hoverActive = false;
	var hoverElement = undefined;

	/*
		Activates the hover ui which follows the mouse. 
		@param html HTML to use as content
		@return true. 
	*/
	JOBAD.UI.hover.enable = function(html){
		hoverActive = true;
		hoverElement = $("<div class='JOBAD JOBADHover'>").html(html).css({
			"position": "fixed",
			"background-color": "grey",
			"-webkit-border-radius": 5,
			"-moz-border-radius": 5,
			"border-radius": 5,
			"border": "1px solid black"
		});
		hoverElement.appendTo($("body"));

		$(document).on("mousemove.JOBAD.UI.hover", function(){
			JOBAD.UI.hover.refresh();
		});

		JOBAD.UI.hover.refresh();
		
		return true; 
	}

	/*
		Deactivates the hover UI if active. 
		@param element jQuery element to use as hover
		@return booelan boolean indicating of the UI has been deactived. 
	*/
	JOBAD.UI.hover.disable = function(){
		if(!hoverActive){
			return false;		
		}

		hoverActive = false;
		$(document).off("mousemove.JOBAD.UI.hover");
		hoverElement.remove();
	}
	/*
		Refreshes the position of the hover element if active. 
		@return nothing. 
	*/
	JOBAD.UI.hover.refresh = function(){
		if(hoverActive){
			hoverElement
			.css("top", Math.min(mouseCoords[1]+JOBAD.UI.hover.config.offsetY, window.innerHeight-hoverElement.outerHeight(true)))
			.css("left", Math.min(mouseCoords[0]+JOBAD.UI.hover.config.offsetX, window.innerWidth-hoverElement.outerWidth(true)))
		}
	}

})(JOBAD)
