/*
	JOBAD Modules config
	Provides JOBAD configuration
*/

JOBAD.modules.ifaces.config = {
	"validate": function(prop){return true; }, //anything is ok
	
	"init": function(available, value, originalObject, properObject){
		return available ? value : {};
	},
	
	"required": false, //not required
	
	"onFirstLoad": function(value, globalStore){
		//on First module load
	},
	
	"onLoad": function(value, properObject, loadedModule){
	
	}
}

for(var key in JOBAD.modules.ifaces){
	JOBAD.modules.cleanProperties.push(key);
}