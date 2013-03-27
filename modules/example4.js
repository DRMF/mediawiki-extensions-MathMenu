JOBAD.modules.register({
	info:{
		'identifier':	'test.color.hover',
		'title':	'Test Module: Colors Hover',
		'author':	'Tom Wiesing',
		'description':	'Counts the words in a p element. ',
	},
	hoverText: function(target){
		if(target.is("p")){
			var wordCount = (target.text().split(" ").length+1).toString()
			return "I am a p element which contains "+wordCount+" words. ";
		}
	}
});
