	/** Global Utils */
	$.fn.hasAttribute = function(name) {  
	   return (typeof this.attr(name) !== 'undefined' && this.attr(name) !== false);
	};

	$.fn.hasAttribute = function(name) {  
	   return (typeof this.attr(name) !== 'undefined' && this.attr(name) !== false);
	};

	var latin = {
	    /* state fields */
	    // focus: holds a reference to the object that was clicked by the user
	    focus : null,
	    // focus: true if focus is within a math object
		focusIsMath : false,    

	    /* JOBAD Interface  */ 
	    
	    info: {
			'identifier' : 'kwarc.latin',
			'title' : 'LATIN Service',
			'author': 'Kwarc',
			'description' : 'The main service for browsing LATIN repository',
			'version' : '1.0',
			'dependencies' : []
	    },

	    leftClick: function(target, JOBADInstance) {
			console.log(target);
	   		//handling clicks on parts of the document - active only for elements that have jobad:href
			if (target.hasAttribute('jobad:href')) {
				var mr = $(target).closest('mrow');
				var select = (mr.length == 0) ? target[0] : mr[0];
				this.setSelected(select);
				return true;
			}
			// highlight bracketed expression
			if (this.getTagName(target[0]) == 'mfenced') {
				this.setSelected(target[0]);
				return true;
			}
			// highlight variable declaration
			if (target.hasAttribute('jobad:varref')) {
				/* var v = $(target).parents('mrow').children().filter('[jobad:xref=' +  target.attr('jobad:varref') + ']');
				this.setSelected(v[0]);*/
				alert("Unsupported");
				return true;
			}
			
			this.unsetSelected();

			
			return true;	//we did stuff also
	    },

	    /*
	    hoverText: function(target, JOBADInstance) {
			//handling clicks on parts of the document - active only for elements that have jobad:href
			//console.log(this);

		if (target.hasAttribute('jobad:href')) {
				var mr = $(target).closest('mrow');
				var select = (mr.length == 0) ? target : mr[0];
				this.setSelected(select);
				return target.attr('jobad:href');
			}
			// bracketed expression
			if (this.getTagName(target) == 'mfenced') {
				this.setSelected(target);
				return true;
			}
			// variable declaration
			if (target.hasAttribute('jobad:varref')) {
				var v = $(target).parents('mrow').children().filter('[jobad:xref=' +  target.attr('jobad:varref') + ']');
				this.setSelected(v[0]);
				return true;
			}
			// maybe return false
			return true;
		},
	*/
	/*
		contextMenuEntries: function(target, JOBADInstance) {
			this.focus = target;
		this.focusIsMath = ($(this.focus).closest('math').length !== 0);
			var res = this.visibMenu();
		  if (this.isSelected(target)) {
				//setCurrentPosition(target);		
				res["infer type"] = this.inferType();
	  			return res;
			} else if ($(target).hasClass('folder') || this.focusIsMath)
				return res;
			else
				return false;
		},
	
	*/

		/* Helper Functions  */
		setVisib : function(prop, val){
			var root = this.focusIsMath ? getSelectedParent(this.focus) : this.focus.parentNode;
			if (val == 'true')
				$(root).find('.' + prop).removeClass(prop + '-hidden');
			if (val == 'false')
				$(root).find('.' + prop).addClass(prop + '-hidden');
		},
	
		quoteSetVisib : function(prop, val){
			return "setVisib('" + prop + "','" + val + "')";
		},
	
		visibSubmenu : function(prop){
			return {
				"show" : this.quoteSetVisib(prop, 'true'),
				"hide" : this.quoteSetVisib(prop, 'false')
		    };
		},

		visibMenu : function(){
	       console.log(this);
	       return {
			"reconstructed types" :  this.visibSubmenu('reconstructed'),
			"implicit arguments" : this.visibSubmenu('implicit-arg'),
			"implicit binders" : this.visibSubmenu('implicit-binder'),
			"redundant brackets" : this.visibSubmenu('brackets'),
	//		"edit" : edit(),
		   }
		},
	
		unsetSelected : function(){
			$('.math-selected').removeClass('math-selected');
		},

	    isSelected : function(target) {
			target.hasClass("math-selected");
		},

		setSelected : function(target){
			this.unsetSelected();
			$(target).addClass('math-selected');
		},
	
	
		/**
		 * getTagPrefix - function that returns the tag prefix of a given element
		 *
		 * @param object : reference to the element whose tag prefix should be determined
		 * @returns returnPrefix : a string value denoting the tag prefix of the given element
		 */
		getTagPrefix : function(object)
		{
			var returnPrefix = ""; //default prefix value
			var tagName = object.tagName;
			var regExpPrefix = /\w*:/;
			returnPrefix = tagName.match(regExpPrefix);
			return returnPrefix;
		},
	
		/**
		 * getTagName - function that returns the tag name of a given element
		 *
		 * @param object : reference to the element whose tag name should be determined
		 * @returns returnTagName : a string value denoting the tag name of the given element
		 */
		getTagName : function(object)
		{
			var returnTagName = ""; //default return value
			if (object == null || object.tagName === undefined) {
				//console.log("Warning: reached document level in function getTagName");
				return null;
			}
			var tagNameOriginal = object.tagName;
			var index = tagNameOriginal.indexOf(":", 0);
			returnTagName = tagNameOriginal.substring(index+1);
			return returnTagName;
		}
	
	};

JOBAD.modules.register(latin);


