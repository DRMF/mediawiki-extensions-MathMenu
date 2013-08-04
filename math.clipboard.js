(function($){
JOBAD.modules.register({
  info:{
    'identifier': 'math.clipboard',
    'title':  'Math Clipboard',
    'author': 'Janelle Williams and Deyan Ginev',
    'description':  'Clipboard for math formulas realized via Zeroclipboard',
  },
  init: function(){
    var $saved_text = $("<span id='math_clipboard_saved'>Clipboard Save text</span>");
    $saved_text.hide();
    $('body').append($saved_text);
    var $clip = new ZeroClipboard($saved_text[0], {
      moviePath: "/extensions/MathMenu/ZeroClipboard.swf",
    });
    $clip.setText($saved_text);
  },
  onEvent: function(evt){
    var $text = $("#math_clipboard_saved").text();
    if(evt == "contextMenuOpen"){ //Context Menu is opened
      // The most important part is here -- attach a Flash ZeroClipboard object
      // to the current menu row, which will only be created __after__ this function has completed
      // in other words add the attachment into an event that will be triggered when the row is created
      var $menu = $("#math_clipboard_menu");
      $menu.attr("data-clipboard-ready","true");
      var $clip = new ZeroClipboard( $menu[0], {
        moviePath: "/extensions/MathMenu/ZeroClipboard.swf",
      });
      $clip.setText($text);
    }
  },
  contextMenuEntries: function(target){
    if(target.is('#nomenu,#nomenu *')){ //no menu for these elements
      return false; }
    var $math = target.closest('math');
    if (! $math.is('math')) { return false;}
    var $tex = $math.find('annotation[encoding="application/x-tex"]').text();
    $("#math_clipboard_saved").text($tex);
        
    return {
      "Copy TeX Source": [function(element){return true;},
      {
      "id": "math_clipboard_menu", //This is the id
      "icon": "none" //set an icon if desired
      }]
    };
  }
});
})(JOBAD.refs.$);