JOBAD.modules.register({
	info:{
		'identifier':	'test.color.menu',
		'title':	'Test Module: Colors',
		'author':	'Tom Wiesing',
		'description':	'A Testing module, test the menu. ',
	},
	contextMenuEntries: function(target){
		if(target.is('#nomenu,#nomenu *')){
			return false;
		}
		return {"Colors": 
				{
					"Make me orange": function(element){element.css("color", "orange");}, 
					"Highlight my background": function(element){
						element
						.stop().css("background-color", "#FFFF9C")
						.animate({ backgroundColor: "#FFFFFF"}, 1500);
					},
					"Revert": function(element){element.stop().css('color', '');}
				}
			};
	}
});
