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
	if(JOBAD.util.isObject(obj) && typeof obj != 'function' ){
		var ret = {};
		for(var key in obj){
			ret[key] = JOBAD.util.bindEverything(obj[key], thisObj);
		}
		return ret;
	} else if(typeof obj == 'function'){
		return JOBAD.util.bind(obj, thisObj);
	} else {
		return JOBAD.util.clone(obj);
	}
};

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
	Similary to jQuery's .closest() but also accepts functions. 
*/
JOBAD.util.closest = function(element, selector){
	var element = JOBAD.refs.$(element);
	if(typeof selector == "function"){
		while(element.length > 0){
			if(selector.call(element[0], element)){
				break; //we are matching
			}
			element = element.parent(); //go up
		}
		return element;
	} else {
		return element.closest(selector);
	}
};

/* Element marking */
/*
	Marks an element as hidden. 
	@param	element	Element to mark as hidden. 
*/
JOBAD.util.markHidden = function(element){
	return JOBAD.util.markDefault(element).addClass("JOBAD_Ignore");
};

/*
	Marks an element as visible.
	@param	element	Element to mark as visible. 
*/
JOBAD.util.markVisible = function(element){
	return JOBAD.util.markDefault(element).addClass("JOBAD_Notice");
};

/*
	Removes a marking from an element. Everything is treated as normal. 
	@param	element	Element to remove Marking from. 
*/
JOBAD.util.markDefault = function(element){
	return JOBAD.refs.$(element).removeClass("JOBAD_Ignore").removeClass("JOBAD_Notice");
};

/*
	Checks if an element is marked as hidden. 
	@param	element	Element to check. 
*/
JOBAD.util.isMarkedHidden = function(element){
	return (JOBAD.util.closest(element, function(e){
		//find the closest hidden one. 
		return e.hasClass("JOBAD_Ignore");
	}).length > 0);
};

/*
	Checks if an element is marked as visible. 
	@param	element	Element to check. 
*/
JOBAD.util.isMarkedVisible = function(element){
	return JOBAD.refs.$(element).hasClass("JOBAD_Notice");;
};

/*
	Checks if an element is hidden (either in reality or marked) . 
	@param	element	Element to check. 
*/
JOBAD.util.isHidden = function(element){
	var element = JOBAD.refs.$(element);
	if(JOBAD.util.isMarkedVisible(element)){
		return false;
	} else if(JOBAD.util.isMarkedHidden(element)){
		return true;
	} else {
		return element.is(":hidden");
	}
};

/*
	Checks if object is defined and return obj, otherwise an empty Object. 
	@param	obj	Object to check. 
*/
JOBAD.util.defined = function(obj){
	return (typeof obj == "undefined")?{}:obj;
};

/*
	Forces obj to be a boolean. 
	@param obj	Object to check. 
	@param def	Optional. Default to use instead. 
*/
JOBAD.util.forceBool = function(obj, def){
	if(typeof def == "undefined"){
		def = obj; 
	}
	return (typeof obj == "boolean"?obj:(def?true:false));
};

/*
	Forces obj to be a function. 
	@param func	Function to check. 
	@param def	Optional. Default to use instead. 
*/
JOBAD.util.forceFunction = function(func, def){
	//local References
	var def = def;
	var func = func;
	if(typeof func == "function"){
		return func;
	} else if(typeof def == "undefined"){
		return function(){return func; }
	} else if(typeof def == "function"){
		return def;
	} else {
		return function(){return def; }
	}
}

/*
	If obj is of type type, return obj else def. 
*/
JOBAD.util.ifType = function(obj, type, def){
	return (obj instanceof type)?obj:def;
}

/*
	Checks if two strings are equal, ignoring upper and lower case. 
*/
JOBAD.util.equalsIgnoreCase = function(a, b){
	var a = String(a);
	var b = String(b);

	return (a.toLowerCase() == b.toLowerCase())
};

//contains all the safewraps
var JOBAD_safeWrap_Array = {};

JOBAD.util.safeWrap = function(element, wrapper){
	//wraps an element safely. 
	var id = JOBAD.util.UID();

	JOBAD_safeWrap_Array[id] = JOBAD.refs.$(element).map(function(e){
		var me = JOBAD.refs.$(this);
		me.wrap(wrapper);
		return me.parent();
	});

	return id;
};

JOBAD.util.getWrapper = function(id){
	return JOBAD_safeWrap_Array[id];
}

JOBAD.util.safeUnWrap = function(id){
	//unwraps an element with the given id safely
	var wrappers = JOBAD.refs.$(JOBAD_safeWrap_Array[id]);
	delete JOBAD_safeWrap_Array[id];

	return wrappers.each(function(){
		if(!JOBAD.refs.$.nodeName(this, "body")){
			JOBAD.refs.$(this).replaceWith(JOBAD.refs.$(this).children());
		}
	})
};

/*
	Orders a jQuery collection by their tree depth. 
	@param element Collection to sort. 
*/
JOBAD.util.orderTree = function(element){
	var element = JOBAD.refs.$(element);
	return JOBAD.refs.$(element.get().sort(function(a, b){
		var a = JOBAD.refs.$(a).parents().filter(element).length;
		var b = JOBAD.refs.$(b).parents().filter(element).length;

		if(a<b){
			return -1;
		} else if(a > b){
			return 1;
		} else {
			return 0;
		}
	}));
};

/*
	Checks if a string is a URL. 
	@param str	String to check. 
	@returns boolean. 
*/
JOBAD.util.isUrl = function(str){
	return (new RegExp('^(https?:\/\/)?'+
    '((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|'+
    '((\d{1,3}\.){3}\d{1,3}))'+ // OR ip (v4) address
    '(\:\d+)?(\/[-a-z\d%_.~+]*)*'+ // port and path
    '(\?[;&a-z\d%_.~+=-]*)?'+ // query string
    '(\#[-a-z\d_]*)?$','i')).test(str); // fragment locater
};

/*
	logical or
*/
JOBAD.util.lOr = function(){
	var args = [];
	for(var i=0;i<arguments.length;i++){
		args.push(arguments[i]);
	}
	args = JOBAD.util.map(JOBAD.util.flatten(args), JOBAD.util.forceBool);
	return (JOBAD.util.indexOf(args, true)!= -1);

};

/*
	logical and
*/
JOBAD.util.lAnd = function(){
	var args = [];
	for(var i=0;i<arguments.length;i++){
		args.push(arguments[i]);
	}
	args = JOBAD.util.map(JOBAD.util.flatten(args), JOBAD.util.forceBool);
	return (JOBAD.util.indexOf(args, false)== -1);
};

/*
	Checks if a jQuery element container contains all of contained. 
	Similar to jQuery.contains
	@param	container	Container element. 
	@param	contained	Contained elements. 
	@param	includeSelf	Should container itself be included in the search
*/
JOBAD.util.containsAll = function(container, contained, includeSelf){
	var container = JOBAD.refs.$(container); 
	return JOBAD.util.lAnd(
		JOBAD.refs.$(contained).map(function(){
			return container.is(contained) || (includeSelf && container.find(contained).length > 0); 
		}).get()
	);
};


//Merge underscore and JOBAD.util namespace
_.mixin(JOBAD.util);
JOBAD.util = _.noConflict(); //destroy the original underscore instance. 