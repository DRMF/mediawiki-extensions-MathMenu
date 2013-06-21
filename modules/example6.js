/*
	example6.js - An example module for JOBAD. 
	Shows several menu items for testing some of the features of JOBAD. 
	
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
(function($){
	JOBAD.modules.register({
		info:{
			'identifier':	'test.features',
			'title':	'Feature tester',
			'author':	'Tom Wiesing',
			'description':	'Shows several menu items for testing some of the features of JOBAD. '
		},
		contextMenuEntries: function(target, JOBADInstance){
			if(target.is('#nomenu,#nomenu *')){
				return false;
			}

			

			var entries = [
				["Show Config UI", function(element){
					JOBADInstance.showConfigUI();
				}],
				["Folding",  {
					"Trigger on this JOBAD Instance": function(){
						if(JOBADInstance.element.data("JOBAD.UI.Folding.enabled")){ //check if folding is enabled on the overall element
							JOBADInstance.disableFolding();
						} else {
							JOBADInstance.enableFolding();
						}
					},
					"Trigger on this element": function(element){
						if(element.data("JOBAD.UI.Folding.enabled")){ //check if folding is enabled
							JOBADInstance.disableFolding(element);
						} else {
							JOBADInstance.enableFolding(element);
						}
					}
				}]
			];

			var c = JOBAD.util.random(1, 15);

			for(var i=0;i<c;i++){
				entries.push(["Random Text No. "+i, function(){alert("nothing here. Move along. "); }])
			}

			return entries; 
		}
	});
})(JOBAD.refs.$);
