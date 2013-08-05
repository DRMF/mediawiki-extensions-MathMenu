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
      
      return[
        ["Formula page", function(element){
          /*     var link = target.closest('a').attr('href');
          window.location.href = link; */
          var math_key = 'title';
          var tex = math.find('annotation[encoding="application/x-tex"]').text();
          tex = tex.replace(/\[/g,"obrackett").replace(/\]/g,"cbrackett").replace(/\{/g,"obracee").replace(/\}/g,"cbracee");
          tex = encodeURIComponent(tex);//.replace(/\(/g, "%28").replace(/\\\\/g,"\\").replace(/\)/g,"%29").replace(/\*/g,"%@A").replace(/\\/g,"%5C");        
          var new_url ="/index.php?title=" + tex+"&action=edit&boilerplate=Template%3ADRMF";
          //alert(new_url);
          //alert(decodeURIComponent(math_value));
          window.location.href = new_url;
        }]
      ];
    }
  });
})(JOBAD.refs.$);
