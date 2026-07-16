(()=>{
  const grid=document.querySelector("#live-news-grid");
  if(!grid)return;
  const stamp=document.querySelector("#news-updated");
  const esc=s=>String(s||"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const safeUrl=value=>{try{const u=new URL(value);return /^https?:$/.test(u.protocol)?u.href:"#"}catch{return"#"}};
  const initials=s=>String(s||"News").split(/\s+/).slice(0,2).map(x=>x[0]).join("").toUpperCase();
  const date=v=>{const d=new Date(v);return Number.isNaN(d.getTime())?"Recent":d.toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})};
  const imageFor=a=>safeUrl(a.image||a.urlToImage||a.thumbnail||a.imageUrl||a.image_url||"");
  fetch("assets/news-feed.json?ts="+Date.now())
    .then(r=>{if(!r.ok)throw Error();return r.json()})
    .then(data=>{
      const items=Array.isArray(data.articles)?data.articles.slice(0,9):[];
      if(!items.length)throw Error();
      grid.innerHTML=items.map((a,index)=>{
        const image=imageFor(a);
        const hasImage=image!=="#";
        const source=esc(a.source||"News source");
        return '<article class="news-card news-card-enhanced" style="--news-index:'+index+'">'+
          '<a class="news-card-media'+(hasImage?' has-image':'')+'" href="'+safeUrl(a.url)+'" target="_blank" rel="noopener noreferrer" aria-label="Read '+esc(a.title)+'">'+
            '<div class="news-media-fallback"><span>'+esc(initials(a.source))+'</span><i></i><b>Industry update</b></div>'+
            (hasImage?'<img src="'+image+'" alt="" loading="lazy" decoding="async">':'')+
            '<span class="news-media-badge">'+source+'</span>'+
          '</a>'+
          '<div class="news-card-body">'+
            '<div class="news-card-top"><div class="news-source"><span class="news-source-mark">'+esc(initials(a.source))+'</span>'+source+'</div><time class="news-date">'+esc(date(a.publishedAt))+'</time></div>'+
            '<h3>'+esc(a.title)+'</h3>'+
            '<p>'+esc(a.description||"Open the original report for complete details.")+'</p>'+
            '<a class="news-read-link" href="'+safeUrl(a.url)+'" target="_blank" rel="noopener noreferrer">Read full story <span>↗</span></a>'+
          '</div>'+
        '</article>';
      }).join("");
      grid.querySelectorAll(".news-card-media img").forEach(img=>img.addEventListener("error",()=>{
        const media=img.closest(".news-card-media");
        img.remove();
        if(media)media.classList.remove("has-image");
      }));
      if(stamp&&data.updatedAt)stamp.innerHTML="<i></i> Updated "+esc(date(data.updatedAt));
    })
    .catch(()=>{
      grid.innerHTML='<div class="news-state"><strong>Industry news feed is being connected.</strong>GemEasy’s original procurement guides remain available below.</div>';
      if(stamp)stamp.style.display="none";
    });
})();