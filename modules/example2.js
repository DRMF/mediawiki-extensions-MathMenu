JOBAD.modules.register({
	info:{
		'identifier':	'test.p',
		'title':	'Test Module: Paragraphs',
		'author':	'Tom Wiesing',
		'description':	'A Testing module',
	},
	contextMenuEntries: function(target){
		
		if(target.is('#nomenu,#nomenu *')){
			return false;
		}
		return [
			["Am I a <p> ?", function(element){
				if(element.is("p")){
					alert("I am a <p> element. ");
				} else {
					alert("No I'm not. ");
				}
				
			}]
		];
	}
});
