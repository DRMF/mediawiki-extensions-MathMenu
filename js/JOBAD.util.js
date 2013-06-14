/*
	JOBAD utility functions
	
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

/* various utility functions */
JOBAD.util = {};

/*
	Binds every function within an object recursively. 
	@param obj Object to bind. 
	@param thisObj 'this' inside functions. 
*/
JOBAD.util.bindEverything = function(obj, thisObj){
	if(JOBAD.refs._.isObject(obj) && typeof obj != 'function' ){
		var ret = {};
		for(var key in obj){
			ret[key] = JOBAD.util.bindEverything(obj[key], thisObj);
		}
		return ret;
	} else if(typeof obj == 'function'){
		return JOBAD.refs._.bind(obj, thisObj);
	} else {
		return JOBAD.refs._.clone(obj);
	}
}

/*
	Creates a unique ID
	@param	prefix	Optional. A prefix to use for the UID. 
*/
JOBAD.util.UID = function(prefix){
	var prefix = (typeof prefix == "string")?prefix+"_":"";
	var time = (new Date()).getTime();
	var id1 = Math.floor(Math.random()*1000);
	var id2 = Math.floor(Math.random()*1000);
	return ""+prefix+time+"_"+id1+"_"+id2;
};

/*
	Creates a radio button for use with jQuery UI. 
	@param texts	Texts to use. 
	@param start	Initial selection
*/
JOBAD.util.createRadio = function(texts, start){
	var id = JOBAD.util.UID();
	
	if(typeof start !== 'number'){
		start = 0;
	}
	
	var Labeller = JOBAD.refs.$('<span>');
	
					
	for(var i=0;i<texts.length;i++){
		var nid = JOBAD.util.UID();
		Labeller.append(
			JOBAD.refs.$("<input type='radio' name='"+id+"' id='"+nid+"'>"),
			JOBAD.refs.$("<label>").attr("for", nid).text(texts[i])
		)
	}
	
	Labeller.find("input").eq(start)[0].checked = true;
	
	return Labeller.buttonset();
};

/*
	Creates tab data compatible with jQuery UI. 
	@param names	Texts to use. 
	@param divs	Divs to use as content
	@üaram height Maximum tab height
	@param options Options for tabs. 
*/
JOBAD.util.createTabs = function(names, divs, options, height){
	var div = JOBAD.refs.$("<div>");
	var ul = JOBAD.refs.$("<ul>").appendTo(div);
	for(var i=0;i<names.length;i++){
		var id = JOBAD.util.UID();
		ul.append(
			JOBAD.refs.$("<li>").append(JOBAD.refs.$("<a>").attr("href", "#"+id).text(names[i]))
		);
		
		var ndiv = JOBAD.refs.$("<div>").append(divs[i]).attr("id", id);
		
		if(typeof height == 'number'){
			ndiv.css({
				"height": height, 
				"overflow": "auto"
			});
		}
		
		div.append(ndiv);
	}
	return div.tabs(options);
}

/*
	Generates a list menu representation from an object representation. 
	@param menu Menu to generate. 
	@returns the new representation. 
*/
JOBAD.util.generateMenuList = function(menu){
	var DEFAULT_ICON = "none";
	if(typeof menu == 'undefined'){
		return [];
	}
	var res = [];
	if(JOBAD.refs._.isArray(menu)){
		for(var i=0;i<menu.length;i++){
			var key = menu[i][0];
			var val = menu[i][1];
			var icon = (typeof menu[i][2] == 'undefined')?DEFAULT_ICON:menu[i][2];
			if(typeof val == 'function'){
				res.push([key, val, icon]);		
			} else {
				res.push([key, JOBAD.util.generateMenuList(val), icon]);
			}
		}
	} else {
		for(var key in menu){
			if(menu.hasOwnProperty(key)){
				var val = menu[key];
				if(typeof val == 'function'){
					res.push([key, val, DEFAULT_ICON]);	
				} else if(JOBAD.refs._.isArray(val)){
					if(typeof val[1] == 'string'){ //we have a string there => we have an icon
						if(typeof val[0] == 'function'){
							res.push([key, val[0], val[1]]);
						} else {
							res.push([key, JOBAD.util.generateMenuList(val[0]), val[1]]);
						}
					} else {
						res.push([key, JOBAD.util.generateMenuList(val), DEFAULT_ICON]);
					}
					
				} else {
					res.push([key, JOBAD.util.generateMenuList(val), DEFAULT_ICON]);
				}
			}
		}
	}
	return res;
};
/*
	Wraps a menu function
	@param menu Menu to generate. 
	@returns the new representation. 
*/
JOBAD.util.fullWrap = function(menu, wrapper){
	var menu = JOBAD.util.generateMenuList(menu);
	var menu2 = [];
	for(var i=0;i<menu.length;i++){
		if(typeof menu[i][1] == 'function'){
			(function(){
				var org = menu[i][1];
				menu2.push([menu[i][0], function(){
					return wrapper(org, arguments)
				}, menu[i][2]]);
			})();
		} else {
			menu2.push([menu[i][0], JOBAD.util.fullWrap(menu[i][1]), menu[i][2]]);
		}
		
	}
	return menu2;
};

/*
	Applies a function to the arguments of a function every time it is called. 
	@param func Function to wrap
	@param wrap Wrapper function. 
*/

JOBAD.util.argWrap = function(func, wrapper){
	return function(){
		var new_args = [];
		for(var i=0;i<arguments.length;i++){
			new_args.push(arguments[i]);
		}
		
		return func.apply(this, wrapper(new_args));
	};
};


/*
	Applies Array.slice to the arguments of a function every time it is called. 
	@param func Function to wrap
	@param to First parameter for args
	@param from Second Parameter for slice
*/

JOBAD.util.argSlice = function(func, from, to){
	return JOBAD.util.argWrap(func, function(args){
		return args.slice(from, to);
	});
};

/*
	Checks if 2 objects are equal. Does not accept functions. 
	@param a Object A
	@param b Object B
	@returns boolean
*/
JOBAD.util.objectEquals = function(a, b){
	try{
		return JSON.stringify(a) == JSON.stringify(b);
	} catch(e){
		return a==b;
	}
	
};

/*
	Checks if something is a pure javascript object
*/
JOBAD.util.isObject = function(obj){

}