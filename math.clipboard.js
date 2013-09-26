jQuery( document ).ready( function( $ ) {
JOBAD.modules.register({
  info:{
    'identifier': 'math.clipboard',
    'title':  'Math Clipboard',
    'author': 'Janelle Williams and Deyan Ginev',
    'description':  'Clipboard for math formulas realized via Zeroclipboard',
    // No external dependencies, since MediaWiki hides all JavaScript code from the other scripts
  },
  init: function(){
    var $saved_tex = $("<span id='math_clipboard_tex'>Clipboard Save TeX</span>");
    var $saved_content = $("<span id='math_clipboard_content'>Clipboard Save Content MathML</span>");
    $saved_tex.hide();
    $saved_content.hide();
    $('body').append($saved_tex);
    $('body').append($saved_content);
    // DEBUG: First copy doesn't work unless we have a pointless clip set.
    var $clip_debug = new ZeroClipboard($saved_tex[0], {
      moviePath: "/extensions/MathMenu/ZeroClipboard.swf",
    });
    $clip_debug.setText("Debug");
  },
  onEvent: function(evt){
    if(evt == "contextMenuOpen"){ //Context Menu is opened
      // Clean up previous clipboards
      ZeroClipboard.destroy();
      ZeroClipboard.setDefaults({ moviePath: "/extensions/MathMenu/ZeroClipboard.swf" });
      // Set up DOM clipboard
      var $copy_this = $("#math_clipboard_copy_this");
      var $tex = $("#math_clipboard_tex").text();
      var $content = $("#math_clipboard_content").html();
      // The most important part is here -- attach a Flash ZeroClipboard object
      // to the current menu row, which will only be created __after__ this function has completed
      // in other words add the attachment into an event that will be triggered when the row is created
      var $menu_tex = $("#mathmenu_clipboard_tex");
      var $menu_content = $("#mathmenu_clipboard_content");
      var $submenu = $menu_tex.closest('li.dropdown-submenu');
      // Then copy it when requested
      var $clip_tex = new ZeroClipboard($menu_tex);
      // I'm completely confused by their API,
      // the explanations about multiple copy buttons is very hard to understand
      // It seems there is a ZeroClipboard SINGLETON in JS, which makes it a pain to do
      // several buttons and pass events around...
      var $clip_content = new ZeroClipboard($menu_content);
      // Keep rows active when Flash is hovered
      $clip_tex.on('mouseover', function(client) { $menu_tex.parent().show(); });
      $clip_tex.on('mouseout', function(client) { $menu_tex.parent().hide(); });
      $clip_tex.on('noflash',function(){alert("WARNING: Flash is not enabled, the Math Clipboard will not be operational.")});
      // Set what we want to copy when we hover on the copy button
      $submenu.hover(function(){
       $menu_tex.parent().show(); 
      },function(){
        $menu_tex.parent().hide();
      })
      $menu_tex.hover(function(){
        $clip_tex.setText($tex);
      });      
      $menu_content.hover(function(){
        $clip_content.setText($content);
      });
    }
  },
  contextMenuEntries: function(target){
    var $math = target.closest('math');
    if (! $math.is('math')) { return false;}
    var $tex = $math.find('annotation[encoding="application/x-tex"]').text();
    var $content = $math.find('annotation-xml[encoding="MathML-Content"]').html();
    $("#math_clipboard_tex").text($tex);
    $("#math_clipboard_content").html($content);
    var $menu_rows = {};
    if ($tex && ($tex.length>0)) {
      $menu_rows["Copy TeX Source"] = [function(element){return true;},
      {
      "id": "mathmenu_clipboard_tex", //This is the id
      "icon": "none" //set an icon if desired
      }];}
    if ($content && ($content.length>0)) {
      $menu_rows["Copy Content MathML"] = [function(element){return true;},
      {
      "id": "mathmenu_clipboard_content", //This is the id
      "icon": "none" //set an icon if desired
      }];}

    return [['Copy',$menu_rows]];
  }
});
});