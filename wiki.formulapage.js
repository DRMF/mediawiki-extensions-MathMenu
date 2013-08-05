(function($){
  JOBAD.modules.register({
    info:{
      'identifier': 'wiki.formulapage',
      'title':  'Formula page redirects for MediaWiki',
      'author': 'Janelle Williams',
      'description':  'Simple link to proof page from MediaWiki',
    },
    contextMenuEntries: function(target){
      var math = target.closest('math');
      if (! math.is('math')) { return false;}

      var tex = math.find('annotation[encoding="application/x-tex"]').text();
      tex = tex.replace(/\{{4}([^\{\}]+)\}{4}/g,"{$1}");
      tex = tex.replace(/\{{3}([^\{\}]+)\}{3}/g,"{$1}");
      tex = tex.replace(/\{{2}([^\{\}]+)\}{2}/g,"{$1}");
      tex = tex.replace(/\[/g,"obrackett").replace(/\]/g,"cbrackett").replace(/\{/g,"obracee").replace(/\}/g,"cbracee");
      tex = encodeURIComponent(tex);//.replace(/\(/g, "%28").replace(/\\\\/g,"\\").replace(/\)/g,"%29").replace(/\*/g,"%@A").replace(/\\/g,"%5C");        

      var req = new XMLHttpRequest();
      req.open('GET', '/index.php?title='+tex, false);
      req.send(null);
      $page_exists = (req.status == 200);

      if (! $page_exists) {
        return[
          ["New formula page", function(element){
            window.location.href = "/index.php?title=" + tex+"&action=edit&boilerplate=Template%3ADRMF";
          }]];
      }
      else {
        return[
          ["Formula page", function(element){
            window.location.href = "/index.php?title=" + tex;
          }]]; 
      }
    }
  });
})(JOBAD.refs.$);
