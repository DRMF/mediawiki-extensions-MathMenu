jQuery( document ).ready( function( $ ) {
  var JOBAD_IN_PAGE;
  var selector = jQuery("#mw-content-text");
  JOBAD_IN_PAGE = new JOBAD(selector);
  JOBAD.config.BootstrapScope = "bootstrap"; //Bootstrap CSS scope
  JOBAD_IN_PAGE.modules.load([
    "math.clipboard",
    "mathjax.mathjax",
    'math.wolframalpha'
  ], function(mod, state){
    this.Setup();
  });

true;
});