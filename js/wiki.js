/* ==========================================================
   方程的工艺百科全书 · 渲染与交互
   数据来自 wiki-cstar-data.js / wiki-c-data.js（window.WIKI_CSTAR / WIKI_C）
   ========================================================== */
(function(){
  'use strict';
  var courses=[window.WIKI_CSTAR, window.WIKI_C].filter(Boolean);

  /* ---------- 逐节扩写内容：由 wiki-x-*.js 注入 ---------- */
  var EXTRA={};
  ['WIKI_X_CSTAR','WIKI_X_C1','WIKI_X_C2','WIKI_X_C3'].forEach(function(k){
    var v=window[k];
    if(v && typeof v==='object') Object.keys(v).forEach(function(id){
      EXTRA[id]=(EXTRA[id]||[]).concat(v[id]||[]);
    });
  });
  function blocksOf(s){ return (s.blocks||[]).concat(EXTRA[s.id]||[]); }
  function plain(s){ return String(s==null?'':s).replace(/<[^>]*>/g,''); }
  function blockText(b){
    var n=plain(b.x);
    (b.items||[]).forEach(function(i){ n+=Array.isArray(i)?plain(i.join('')):plain(i); });
    (b.rows||[]).forEach(function(r){ n+=plain(r.join('')); });
    (b.head||[]).forEach(function(x){ n+=plain(x); });
    if(b.q) n+=plain(b.q)+plain(b.a);
    return n;
  }
  /* 全书规模统计（供卷首与小节元信息展示） */
  var TOT={blocks:0,codes:0,chars:0};
  courses.forEach(function(c){
    (c.chapters||[]).forEach(function(ch){
      (ch.sections||[]).forEach(function(s){
        var bs=blocksOf(s);
        TOT.blocks+=bs.length;
        bs.forEach(function(b){ if(b.t==='code') TOT.codes++; TOT.chars+=blockText(b).length; });
      });
    });
  });

  var VOL={
    id:'vol', num:'壹',
    title:'方程的工艺百科全书 · 语言篇',
    lead:'把学过的东西，一页一页写清楚。本卷收录两门语言的系统教程：C* 语言（依据官方仓库教材整理归纳）与 C 语言（按 C23 标准从头到尾讲一遍）。',
    en:'VOLUME I · LANGUAGES'
  };
  /* 后续篇章占位：先做语言篇 */
  var MORE=[
    {title:'工艺篇',desc:'编译原理 · 工具链 · 造轮子',state:'编纂中'},
    {title:'器物篇',desc:'硬件 · 系统 · 网络',state:'编纂中'},
    {title:'杂谈篇',desc:'随笔与学习方法',state:'编纂中'}
  ];

  var tree=document.getElementById('wikiTree'),
      article=document.getElementById('wikiArticle'),
      crumb=document.getElementById('wikiCrumb'),
      pager=document.getElementById('wikiPager'),
      search=document.getElementById('wikiSearch'),
      body=document.body,
      sideCount=document.getElementById('sideCount'),
      progress=document.getElementById('wikiProgress');

  /* ---------- 索引：id -> 节点 ---------- */
  var INDEX={}, FLAT=[];   /* FLAT：所有小节按阅读顺序 */
  courses.forEach(function(c){
    INDEX[c.id]={type:'course',data:c,parent:'vol'};
    (c.chapters||[]).forEach(function(ch){
      INDEX[ch.id]={type:'chapter',data:ch,parent:c.id};
      (ch.sections||[]).forEach(function(s){
        INDEX[s.id]={type:'section',data:s,parent:ch.id,course:c.id};
        FLAT.push(s.id);
      });
    });
  });
  INDEX[VOL.id]={type:'volume',data:VOL};
  if(sideCount) sideCount.textContent='共 '+courses.length+' 门 · '+FLAT.length+' 节';

  /* ---------- 目录树 ---------- */
  function btn(node,arrow){
    var b=document.createElement('button');
    b.type='button';b.className='t-btn';
    if(arrow) b.innerHTML='<span class="t-arrow">▾</span>';
    else b.innerHTML='<span class="t-arrow" style="opacity:0">·</span>';
    var n=document.createElement('span');n.className='t-num';n.textContent=node.num||'';
    var l=document.createElement('span');l.className='t-label';l.textContent=node.title;
    b.appendChild(n);b.appendChild(l);
    b.setAttribute('data-goto',node.id);
    return b;
  }
  function tnode(cls,node,kids,arrow){
    var d=document.createElement('div');
    d.className='t-node '+cls;
    d.setAttribute('data-id',node.id);
    d.setAttribute('data-text',(node.num||'')+' '+node.title);
    d.appendChild(btn(node,arrow));
    if(kids){
      var k=document.createElement('div');k.className='t-kids';
      kids.forEach(function(x){ k.appendChild(x); });
      d.appendChild(k);
    }
    return d;
  }
  function buildTree(){
    tree.innerHTML='';
    var volKids=courses.map(function(c){
      var chapKids=(c.chapters||[]).map(function(ch){
        var secKids=(ch.sections||[]).map(function(s){ return tnode('t-sec',s,null,false); });
        return tnode('t-chap',ch,secKids,secKids.length>0);
      });
      return tnode('t-course',c,chapKids,true);
    });
    tree.appendChild(tnode('t-vol',VOL,volKids,true));
    /* 后续篇章占位节点 */
    var more=document.createElement('div');
    more.className='t-node t-empty';
    more.innerHTML='更多篇章 · 编纂中';
    tree.appendChild(more);
  }
  buildTree();

  /* 折叠：点击箭头只折叠，点击文字跳转 + 展开 */
  tree.addEventListener('click',function(e){
    var arrow=e.target.closest('.t-arrow');
    var b=e.target.closest('.t-btn');
    if(!b) return;
    var node=b.parentNode;
    if(arrow && node.querySelector(':scope > .t-kids')){
      node.classList.toggle('closed');
      return;
    }
    location.hash=b.getAttribute('data-goto');
  });
  /* 默认折叠：除当前路径外全部章收起 */
  function expandPath(id){
    var cur=INDEX[id];
    if(!cur) return;
    var chain=[];
    var p=cur.parent;
    while(p && INDEX[p]){ chain.push(INDEX[p].data.id); p=INDEX[p].parent; }
    /* 全部章收起，卷/课程展开 */
    tree.querySelectorAll('.t-chap').forEach(function(n){
      n.classList.toggle('closed',chain.indexOf(n.getAttribute('data-id'))===-1);
    });
    tree.querySelectorAll('.t-vol,.t-course').forEach(function(n){ n.classList.remove('closed'); });
    /* 当前项高亮 */
    tree.querySelectorAll('.t-node').forEach(function(n){ n.classList.remove('cur'); });
    var target=tree.querySelector('.t-node[data-id="'+id+'"]');
    if(target){
      target.classList.add('cur');
      var side=document.getElementById('wikiSide');
      var r=target.getBoundingClientRect(), sr=side.getBoundingClientRect();
      if(r.top<sr.top+40||r.bottom>sr.bottom-40){
        tree.scrollTop+=r.top-sr.top-140;
      }
    }
  }

  /* ---------- 工具 ---------- */
  function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
  /* 轻量高亮：单遍分词，注释 / 字符串 / 预处理 / 关键字 / 数字一次替换，避免嵌套占位符 */
  var KW='int|char|float|double|long|short|void|bool|true|false|nullptr|const|constexpr|static|extern|register|auto|volatile|unsigned|signed|struct|union|enum|typedef|sizeof|return|if|else|while|do|for|switch|case|default|break|continue|goto|typeof|typeof_unqual|_Generic|static_assert|alignof|alignas|restrict|inline|_Atomic|string|none|function|print|show|input|constant|and|or|not|use|until|foreach|in';
  var CODE_RE=new RegExp(
    '(\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/)'+
    '|("(?:[^"\\\\]|\\\\.)*"|\'(?:[^\'\\\\]|\\\\.)*\')'+
    '|(^\\s*#[^\\n]*)'+
    '|(\\b(?:'+KW+')\\b)'+
    '|(\\b(?:0[bB][01\']+|0[xX][0-9a-fA-F\']+|\\d[\\d\']*(?:\\.\\d+)?(?:[eE][+-]?\\d+)?)\\b)',
    'gm');
  function codeHi(src){
    return esc(src).replace(CODE_RE,function(m,cmt,str,pre,kw,num){
      if(cmt) return '<span class="c-cmt">'+cmt+'</span>';
      if(str) return '<span class="c-str">'+str+'</span>';
      if(pre) return '<span class="c-pre">'+pre+'</span>';
      if(kw)  return '<span class="c-kw">'+kw+'</span>';
      if(num) return '<span class="c-num">'+num+'</span>';
      return m;
    });
  }
  function blockHTML(b){
    switch(b.t){
      case 'p': return '<p>'+b.x+'</p>';
      case 'h': return '<h3>'+b.x+'</h3>';
      case 'ul': return '<ul>'+b.items.map(function(i){ return '<li>'+i+'</li>'; }).join('')+'</ul>';
      case 'ol': return '<ol>'+b.items.map(function(i){ return '<li>'+i+'</li>'; }).join('')+'</ol>';
      case 'steps': return '<ol class="wa-steps">'+b.items.map(function(i){ return '<li><b>'+i[0]+'</b>'+i[1]+'</li>'; }).join('')+'</ol>';
      case 'cards': return '<div class="wa-cards">'+b.items.map(function(i){ return '<div class="wa-card"><b>'+i[0]+'</b><span>'+i[1]+'</span></div>'; }).join('')+'</div>';
      case 'ex': return '<div class="wa-ex"><div class="wa-ex-h"><i>EXERCISE</i>'+(b.k||'动手练一练')+'</div><ol>'+b.items.map(function(i){ return '<li>'+i+'</li>'; }).join('')+'</ol></div>';
      case 'faq': return '<details class="wa-faq"><summary>'+esc(b.q)+'</summary><div class="faq-a">'+b.a+'</div></details>';
      case 'quote': return '<div class="wa-quote">'+b.x+'</div>';
      case 'note': return '<div class="wa-note '+(b.kind||'')+'"><b>'+(b.k||'要点')+'</b>'+b.x+'</div>';
      case 'code':
        return '<div class="wa-code"><div class="wa-code-bar"><i></i><span>'+(b.lang||'C')+'</span>'
          +'<button class="wa-copy" type="button">复制</button></div><pre><code>'+codeHi(b.x.replace(/^\n+|\n+$/g,''))+'</code></pre></div>';
      case 'table':
        var th='<thead><tr>'+b.head.map(function(h){ return '<th>'+h+'</th>'; }).join('')+'</tr></thead>';
        var tb='<tbody>'+b.rows.map(function(r){ return '<tr>'+r.map(function(c){ return '<td>'+c+'</td>'; }).join('')+'</tr>'; }).join('')+'</tbody>';
        return '<div class="wa-table-hint">↔ 左右滑动查看完整表格</div><div class="wa-table-wrap"><table class="wa-table">'+th+tb+'</table></div>';
      default: return '';
    }
  }
  function head(o,kicker,chips,stat){
    var h='<div class="wa-head"><span class="wa-kicker">'+esc(kicker)+'</span>';
    if(o.num) h+='<span class="wa-num">'+esc(o.num)+'</span>';
    h+='<h1 class="wa-title">'+esc(o.title)+'</h1>';
    if(o.lead) h+='<p class="wa-lead">'+esc(o.lead)+'</p>';
    if(chips&&chips.length) h+='<div class="wa-meta">'+chips.map(function(c){ return '<span class="wa-chip">'+esc(c)+'</span>'; }).join('')+'</div>';
    if(stat) h+='<div class="wa-stat">'+stat+'</div>';
    return h+'</div>';
  }
  function cover(kick,title,desc,stats){
    return '<div class="wa-cover"><span class="wa-cover-kick">'+esc(kick)+'</span><h1>'+esc(title)+'</h1><p>'+esc(desc)+'</p>'
      +'<div class="cover-stat">'+stats.map(function(s){ return '<span>'+esc(s)+'</span>'; }).join('')+'</div></div>';
  }
  function crumbs(parts){
    crumb.innerHTML='<a href="#vol">百科全书</a>'+parts.map(function(p){
      return '<s>›</s>'+(p.id?'<a href="#'+p.id+'">'+esc(p.t)+'</a>':'<b>'+esc(p.t)+'</b>');
    }).join('');
    /* 窄屏面包屑保持单行、从左显示；当前节标题在正文里已完整呈现 */
  }
  function setPager(id){
    var i=FLAT.indexOf(id);
    if(i===-1){ pager.innerHTML=''; return; }
    function a(j,cls,lab){
      if(j<0||j>=FLAT.length) return '<div class="wa-pg '+cls+' empty"><span>'+lab+'</span><b>没有了</b></div>';
      var s=INDEX[FLAT[j]].data;
      return '<a class="wa-pg '+cls+'" href="#'+s.id+'"><span>'+lab+'</span><b>'+esc(s.num+' '+s.title)+'</b></a>';
    }
    pager.innerHTML=a(i-1,'prev','← 上一节')+a(i+1,'next','下一节 →');
  }

  /* ---------- 页面渲染 ---------- */
  function renderVolume(){
    crumbs([{t:'语言篇'}]);
    var wan=(Math.round(TOT.chars/1000)/10).toFixed(1);
    var h=cover(VOL.en,VOL.title,VOL.lead,
      ['2 门语言',FLAT.length+' 节教程',TOT.codes+' 个代码示例','约 '+wan+' 万字']);
    h+='<div class="wa-body"><h3>本卷目录</h3><div class="wa-chapter-list">';
    courses.forEach(function(c){
      var secs=0,codes=0;
      (c.chapters||[]).forEach(function(ch){ (ch.sections||[]).forEach(function(s){
        secs++; blocksOf(s).forEach(function(b){ if(b.t==='code') codes++; });
      });});
      h+='<a class="wa-cl-card" href="#'+c.id+'"><i>'+esc(c.num)+'</i><b>'+esc(c.title)+'</b><span>'
        +(c.chapters||[]).length+' 章 · '+secs+' 节 · '+codes+' 个示例</span></a>';
    });
    h+='</div>';
    h+='<h3>怎么读这套教程</h3>'
      +'<ol class="wa-steps">'
      +'<li><b>按顺序读，但允许跳读</b>每节都从「是什么」讲到「为什么」再到「怎么用」，有基础的读者可以直接看代码与小结。</li>'
      +'<li><b>每个示例都亲手编译一次</b>教程里的示例按 C23 编写，用 <code>gcc -std=c2x -Wall -Wextra</code> 即可编译；改坏它、再修好它，比读三遍更有效。</li>'
      +'<li><b>留意提示框与练习</b>蓝色为要点、绿色为技巧、橙色为易错陷阱、红色为危险操作；每节末尾的练习用来检验是否真的理解。</li>'
      +'<li><b>用目录检索定位</b>左侧目录支持筛选，按 <code>/</code> 可快速聚焦搜索框；网址带 <code>#小节编号</code> 可直接分享某一节。</li>'
      +'</ol>';
    h+='<h3>后续篇章</h3><div class="wa-chapter-list">';
    MORE.forEach(function(m){
      h+='<div class="wa-cl-card" style="opacity:.62;cursor:default"><i>'+esc(m.state)+'</i><b>'+esc(m.title)+'</b><span>'+esc(m.desc)+'</span></div>';
    });
    h+='</div></div>';
    article.innerHTML=h; setPager('');
  }
  function renderCourse(c){
    crumbs([{t:'语言篇',id:'vol'},{t:c.title}]);
    var n=(c.chapters||[]).reduce(function(a,x){return a+(x.sections||[]).length;},0);
    var h=cover(c.en||'COURSE',c.title,c.lead,[(c.chapters||[]).length+' 章',n+' 节'].concat(c.chips||[]));
    h+='<div class="wa-body"><h3>章节目录</h3><div class="wa-chapter-list">';
    (c.chapters||[]).forEach(function(ch){
      h+='<a class="wa-cl-card" href="#'+ch.id+'"><i>'+esc(ch.num)+'</i><b>'+esc(ch.title)+'</b><span>'+esc((ch.sections||[]).length+' 节 · '+ch.lead.slice(0,28)+'…')+'</span></a>';
    });
    h+='</div></div>';
    article.innerHTML=h; setPager('');
  }
  function renderChapter(ch,cid){
    var c=INDEX[cid].data;
    crumbs([{t:'语言篇',id:'vol'},{t:c.title,id:c.id},{t:ch.num+' '+ch.title}]);
    var h=head(ch,'CHAPTER '+ch.num+' · '+c.title,c.chips||[]);
    h+='<div class="wa-body"><h3>本章小节</h3><div class="wa-sec-list">';
    (ch.sections||[]).forEach(function(s){
      h+='<button class="wa-sec-item" data-goto="'+s.id+'"><em>'+esc(s.num)+'</em><b>'+esc(s.title)+'</b><span>阅读 →</span></button>';
    });
    h+='</div></div>';
    article.innerHTML=h; setPager('');
  }
  function renderSection(s,chid,cid){
    var ch=INDEX[chid].data, c=INDEX[cid].data;
    crumbs([{t:'语言篇',id:'vol'},{t:c.title,id:c.id},{t:ch.num+' '+ch.title,id:ch.id},{t:s.num+' '+s.title}]);
    var bs=blocksOf(s), codes=0, chars=0;
    bs.forEach(function(b){ if(b.t==='code') codes++; chars+=blockText(b).length; });
    var mins=Math.max(2,Math.round(chars/380));
    var stat='<span><b>'+bs.length+'</b> 内容块</span><span><b>'+codes+'</b> 代码示例</span>'
      +'<span><b>'+chars+'</b> 字</span><span><b>'+mins+'</b> 分钟阅读</span>';
    var h=head(s,'SECTION '+s.num+' · '+c.title,(s.tags||[]).concat(c.chips||[]).slice(0,4),stat);
    h+='<div class="wa-body">'+bs.map(blockHTML).join('')+'</div>';
    article.innerHTML=h; setPager(s.id);
  }
  function render(id){
    var node=INDEX[id];
    if(!node) node=INDEX['vol'];
    id=node.data.id;
    if(node.type==='volume') renderVolume();
    else if(node.type==='course') renderCourse(node.data);
    else if(node.type==='chapter') renderChapter(node.data,node.parent);
    else renderSection(node.data,node.parent,node.course);
    expandPath(id);
    document.title=(node.data.num?node.data.num+' · ':'')+node.data.title+' | 方程的工艺百科全书';
    window.scrollTo({top:0,behavior:'instant'});
  }

  /* ---------- 路由 ---------- */
  function route(){
    var id=decodeURIComponent(location.hash.replace(/^#/,'')||'vol');
    render(id);
    closeSide();
  }
  window.addEventListener('hashchange',route);
  document.addEventListener('click',function(e){
    var g=e.target.closest('[data-goto]');
    if(g && !g.closest('.wiki-tree')){ location.hash=g.getAttribute('data-goto'); }
  });

  /* ---------- 复制代码 ---------- */
  var toast=document.getElementById('wikiToast'),tt=null;
  article.addEventListener('click',function(e){
    var b=e.target.closest('.wa-copy');
    if(!b) return;
    var code=b.closest('.wa-code').querySelector('code').innerText;
    function ok(){
      toast.classList.add('show');
      clearTimeout(tt);tt=setTimeout(function(){ toast.classList.remove('show'); },1400);
    }
    if(navigator.clipboard&&navigator.clipboard.writeText){ navigator.clipboard.writeText(code).then(ok,fallback); }
    else fallback();
    function fallback(){
      var t=document.createElement('textarea');t.value=code;document.body.appendChild(t);
      t.select();try{document.execCommand('copy');ok();}catch(_){}t.remove();
    }
  });

  /* ---------- 搜索：过滤目录 ---------- */
  function filter(q){
    q=q.trim().toLowerCase();
    if(!q){
      tree.querySelectorAll('.t-node').forEach(function(n){ n.classList.remove('t-hide'); });
      expandPath((location.hash.replace(/^#/,'')||'vol'));  /* 恢复当前路径的折叠状态 */
      return;
    }
    tree.querySelectorAll('.t-sec').forEach(function(n){
      var txt=(n.getAttribute('data-text')||'').toLowerCase();
      n.classList.toggle('t-hide',txt.indexOf(q)===-1);
    });
    tree.querySelectorAll('.t-chap').forEach(function(n){
      var vis=[].slice.call(n.querySelectorAll('.t-sec')).some(function(s){ return !s.classList.contains('t-hide'); });
      var self=(n.getAttribute('data-text')||'').toLowerCase().indexOf(q)!==-1;
      n.classList.toggle('t-hide',!vis&&!self);
      n.classList.remove('closed');
    });
    tree.querySelectorAll('.t-course,.t-vol').forEach(function(n){ n.classList.remove('t-hide','closed'); });
  }
  function bindSearch(el){
    if(!el) return;
    el.addEventListener('input',function(){
      filter(el.value);
      /* 两个搜索框保持同步 */
      var other=el===search?(document.getElementById('sideSearch')):search;
      if(other && other.value!==el.value) other.value=el.value;
    });
  }
  bindSearch(search);
  bindSearch(document.getElementById('sideSearch'));
  document.addEventListener('keydown',function(e){
    if(e.key==='/'&&document.activeElement!==search&&document.activeElement!==document.getElementById('sideSearch')){
      e.preventDefault();
      var box=window.innerWidth<=900?document.getElementById('sideSearch'):search;
      if(box){ openSide(); box.focus(); }
    }
    if(e.key==='Escape'){ closeSide(); if(search) search.blur(); }
  });

  /* ---------- 手机目录抽屉 ---------- */
  function openSide(){ body.classList.add('side-open'); }
  function closeSide(){ body.classList.remove('side-open'); }
  var menu=document.getElementById('wikiMenu'),mask=document.getElementById('sideMask');
  if(menu) menu.addEventListener('click',function(){ body.classList.toggle('side-open'); });
  if(mask) mask.addEventListener('click',closeSide);

  /* ---------- 阅读进度 ---------- */
  function updProgress(){
    var h=document.documentElement.scrollHeight-window.innerHeight;
    if(progress) progress.firstElementChild.style.width=(h>0?Math.min(100,window.scrollY/h*100):0)+'%';
  }
  window.addEventListener('scroll',updProgress,{passive:true});
  window.addEventListener('resize',updProgress);

  /* ---------- 深色 / 浅色切换 ---------- */
  var themeBtn=document.getElementById('wikiTheme'), TK='zfc-wiki-theme';
  try{
    if(localStorage.getItem(TK)==='dark') document.documentElement.setAttribute('data-theme','dark');
  }catch(_){}
  function applyMeta(){
    var meta=document.querySelector('meta[name="theme-color"]');
    if(meta) meta.setAttribute('content',document.documentElement.getAttribute('data-theme')==='dark'?'#0c1220':'#ffffff');
  }
  applyMeta();
  if(themeBtn) themeBtn.addEventListener('click',function(){
    var isDark=document.documentElement.getAttribute('data-theme')==='dark';
    if(isDark) document.documentElement.removeAttribute('data-theme');
    else document.documentElement.setAttribute('data-theme','dark');
    try{ localStorage.setItem(TK,isDark?'light':'dark'); }catch(_){}
    applyMeta();
  });

  var yr=document.getElementById('yr'); if(yr) yr.textContent=new Date().getFullYear();
  route();
})();
