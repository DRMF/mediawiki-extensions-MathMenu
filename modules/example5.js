/*
	example5.js - An example module for JOBAD. 
	Counts the words in a paragraph and shows a tooltip. 
*/

JOBAD.modules.register({
	info:{
		'identifier':	'test.sidebar',
		'title':	'Test Module: Sidebar',
		'author':	'Tom Wiesing',
		'description':	'Displays the number of characters next to every p and clicking it trigger the original p. ',
	},
	init: function(JOBADInstance){
		JOBADInstance.element.find("p")
		.each(function(i, target){
			var $target = JOBAD.refs.$(target);
			JOBADInstance.Sidebar.registerNotification($target, {
				"text": $target.text().length.toString()+" Characters of text",
				"trace": true, 
				"click": function(){
						JOBADInstance.Event.leftClick.trigger($target);
				}
			})
		})
	}
});
