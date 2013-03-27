JOBAD.modules.register({
	info:{
		'identifier':	'test.color.click',
		'title':	'Test Module: Colors Click',
		'author':	'Tom Wiesing',
		'description':	'A Testing module, colors ps in the color given as first parameter. ',
		'hasCleanNamespace': false
	},
	init: function(JOBADInstance, color){
		this.localStore.set("color", color);
		var counter = this.globalStore.get("counter");
	},
	leftClick: function(target, JOBADInstance){
		if(target.is("p")){
			this.colorize(target);
		}
	},
	colorize: function(target){
		target.css("color", this.localStore.get("color"));
	}
});
