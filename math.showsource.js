/*
  mathc_clipboard.js - An example module for JOBAD. 
  Extracts the TeX from a selected MathML formula and shows a tooltip.
*/
jQuery( document ).ready( function( $ ) {
        // Paste snippet here
        // Paste as many as you like, only one "jQuery document ready" wrapper is needed!
  JOBAD.modules.register({
    info:{
      'identifier': 'math.showsource',
      'title':  'Show TeX source of MathML formulas',
      'author': 'Deyan Ginev',
      'description':  'Simply displays the TeX source of MathML formulas',
    },
    contextMenuEntries: function(target){
      var math = target.closest('math');
      if (! math.is('math')) { return false;}
      return [
        ["Display TeX", function(element){
          var txt = math.find('annotation[encoding="application/x-tex"]').text();
          alert(txt);
        }]
      ];
    }
  });
} );
