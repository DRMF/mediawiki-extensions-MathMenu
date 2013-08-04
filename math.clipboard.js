(function($){
JOBAD.modules.register({
  info:{
    'identifier': 'math.clipboard',
    'title':  'Math Clipboard',
    'author': 'Janelle Williams and Deyan Ginev',
    'description':  'Clipboard for math formulas realized via Zeroclipboard',
  },
  onEvent: function(evt){
    if(evt == "contextMenuOpen"){
    //Context Menu is opened
    //alert("Menu opened!");
    var $menu = $("#math_clipboard_menu");
    var math = menu.closest('math');
    if (! math.is('math')) { return false;}
    var $tex = math.find('annotation[encoding="application/x-tex"]').text();
    // The most important part is here -- attach a Flash ZeroClipboard object
    // to the current menu row, which will only be created __after__ this function has completed
    // in other words add the attachment into an event that will be triggered when the row is created
    ZeroClipboard.setMoviePath('/extensions/JOBAD-git/ZeroClipboard.swf');
    var clip = new ZeroClipboard.Client(); 
    clip.glue($menu[0], $menu.parent()[0]);
    clip.setText("TeXXX");
    $menu.zclip({
      path:'/extensions/JOBAD-git/ZeroClipboard.swf',
      copy:"Tex"});
    }
  },
  contextMenuEntries: function(target){
    if(target.is('#nomenu,#nomenu *')){ //no menu for these elements
      return false; }
    var math = target.closest('math');
    if (! math.is('math')) { return false;}
    
    return [
      ["Copy TeX Source", [function(element,object){
        // We really have nothing to do in the actual click,
        // the Flash will capture that event and do the clipboard magic
        // Temporary: just so that we do something
      }],
      {
      "id": "math_clipboard_menu", //This is the id
      "icon": "none" //set an icon if desired
      }]
    ];
  }
});
})(JOBAD.refs.$);


