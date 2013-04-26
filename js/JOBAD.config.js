/*
	JOBAD Modules config
	Core Extension
*/

JOBAD.extensions.config = {
	"required": false, //not required
	
	"validate": function(prop){return true; }, //anything is ok
	
	"init": function(available, value, originalObject, properObject){
		return available ? value : {};
	},
	
	"onJOBADinit": function(element, config){
		//JOBAD module init
	},
	
	"onFirstLoad": function(value, globalStore){},
	
	"onLoad": function(value, properObject, loadedModule){
		
	}
}
