// Галерея «рядами»: кадры не обрезаются, ряды выравниваются по ширине.
(function(){
  var GAP=8;
  function layout(g){
    var W=g.clientWidth,T=window.innerWidth<700?W/2.2:Math.min(380,W/3.2),row=[],s=0;
    function flush(last){
      var gaps=GAP*(row.length-1),h=(last&&s*T+gaps<W)?T:(W-gaps)/s;
      row.forEach(function(a){a.style.width=Math.floor(a.r*h)+'px';a.style.height=Math.round(h)+'px'});
      row=[];s=0;
    }
    [].forEach.call(g.children,function(a){row.push(a);s+=a.r;if(s*T+GAP*(row.length-1)>=W)flush(false)});
    if(row.length)flush(true);
  }
  document.querySelectorAll('.g').forEach(function(g){
    var imgs=[].slice.call(g.querySelectorAll('img'));
    Promise.all(imgs.map(function(i){return i.decode().catch(function(){})})).then(function(){
      imgs.forEach(function(i){i.parentNode.r=(i.naturalWidth/i.naturalHeight)||1.5});
      layout(g);g.classList.add('ready');
      var w=g.clientWidth;
      addEventListener('resize',function(){if(g.clientWidth!==w){w=g.clientWidth;layout(g)}});
    });
  });
})();
