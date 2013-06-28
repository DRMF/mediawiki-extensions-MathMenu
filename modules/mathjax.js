/*
	mathjax.js - A mathJax Module. Needs JOBAD 3.2
	
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
			'identifier':	'mathjax.mathjax',
			'title':	'MathJax',
			'author':	'Tom Wiesing',
			'description':	'A MathJax Module to use MathJax on the current page. ',
			'externals': ["http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML"] //load MathJax as an external
		},
		globalinit: function(){
			//setup mathjax with the right options
			MathJax.Hub.Config({
			  menuSettings: { context: "Browser" }, //use JOABD COntextMenu not the one from MathJax
			  skipStartupTypeset: true
			});
		},
		activate: function(JOBADInstance){
			JOBADInstance.element.each(function(){
				MathJax.Hub.Queue(["Typeset",MathJax.Hub, this]);
			});

			MathJax.Hub.Queue([function(){
				JOBADInstance.Sidebar.redraw(); //We will have to redraw the sidebar. 
			}]);
		}, 
		deactivate: function(JOBADInstance){
			JOBADInstance.element.each(function(){
				var allMath = MathJax.Hub.getAllJax(this);

				for(var i=0;i<allMath.length;i++){
					(function(){
						var me = allMath[i];
						var text = JOBAD.refs.$(me.originalText);
						var source = JOBAD.refs.$("#"+me.inputID);

						MathJax.Hub.Queue(["Remove",allMath[i]]);
						MathJax.Hub.Queue([function(){
							source.replaceWith(text);
						}]);
					})();
				}
				
				MathJax.Hub.Queue([function(){
					JOBADInstance.Sidebar.redraw(); //We will have to redraw the sidebar. 
				}]);
			});
		}
	});
})(JOBAD.refs.$);
