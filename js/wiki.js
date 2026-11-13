/* ==========================================================
   方程的工艺百科全书 · 渲染与交互
   数据：wiki-cstar-data.js / wiki-c-data.js / wiki-os-data.js
   结构：全书 → 卷 → 课程 → 章 → 节
   ========================================================== */
(function(){
  'use strict';

  /* ---------- 卷（一级目录） ---------- */
  var HOME={
    id:'index', title:'方程的工艺百科全书',
    en:'THE CRAFT ENCYCLOPEDIA',
    lead:'把学过的、造过的东西，一页一页写清楚。这里按「篇」分卷，每卷下再分课程、章、节，编号可循，随时可查。'
  };
  var VOLUMES=[
    {
      id:'vol', num:'壹', short:'语言篇', treeLabel:'语言篇',
      title:'方程的工艺百科全书 · 语言篇',
      en:'VOLUME I · LANGUAGES',
      lead:'把学过的语言，一页一页写清楚。本卷收录七门语言/技术的系统教程：C* 语言（依据官方仓库教材整理归纳）、C 语言（按 C23 标准从头讲一遍）、C++（在 C 之上叠加面向对象与泛型）、HTML（结构）、CSS（样式）、JavaScript（行为）、以及离机器最近的助记符汇编语言（x86 / NASM 主线）。',
      courses:[window.WIKI_CSTAR, window.WIKI_C, window.WIKI_CPP, window.WIKI_HTML, window.WIKI_CSS, window.WIKI_JS, window.WIKI_ASM].filter(Boolean),
      read:[
        ['按顺序读，但允许跳读','每节都从「是什么」讲到「为什么」再到「怎么用」，有基础的读者可以直接看代码与小结。'],
        ['区分编译型与解释型','C* / C / C++ 需要编译链接（<code>gcc -std=c2x</code>、<code>g++ -std=c++20</code>）；HTML / CSS / JS 由浏览器直接解释运行，改完刷新即可见，无需编译。'],
        ['Web 三件套要一起学','HTML 管结构、CSS 管样式、JavaScript 管行为，三者分工协作；建议先 HTML 再 CSS 最后 JS，再回头看它们如何组合成页面。'],
        ['留意提示框与练习','蓝色为要点、绿色为技巧、橙色为易错陷阱、红色为危险操作；每节末尾的练习用来检验是否真的理解。'],
        ['用目录检索定位','左侧目录支持筛选，按 <code>/</code> 可快速聚焦搜索框；网址带 <code>#小节编号</code> 可直接分享某一节。']
      ],
      more:[
        {title:'工艺篇',desc:'编译原理 · 工具链 · 造轮子',state:'编纂中'},
        {title:'器物篇',desc:'硬件 · 系统 · 网络',state:'编纂中'},
        {title:'杂谈篇',desc:'随笔与学习方法',state:'编纂中'}
      ]
    },
    {
      id:'os', num:'贰', short:'操作系统篇', treeLabel:'操作系统篇',
      title:'方程的工艺百科全书 · 操作系统篇',
      en:'VOLUME II · OPERATING SYSTEMS',
      lead:'把造过的、用过的系统，一层一层拆开看。本卷以自研操作系统原型 Java Net Lava OS（JNL OS）为线索讲清它的构建与架构；另设 Windows 知识与 Linux 知识两门通用系统教程，从内核、文件系统、权限、进程服务到命令行、网络与排错，把日常工程里真正用得到的操作系统知识系统整理成可查阅的教程；还收录 DOS 这门命令行操作系统的历史与实模式底层，作为理解现代系统「从哪来」的钥匙。',
      courses:[window.WIKI_JNL, window.WIKI_WIN, window.WIKI_LINUX, window.WIKI_DOS].filter(Boolean),
      read:[
        ['按需选课程，不必从头读','三门的定位不同：JNL OS 是「自研系统实例」，Windows / Linux 是「通用系统知识」。带着问题进对应课程即可。'],
        ['把命令当成可核查的证据','Windows 与 Linux 各章的命令都可在本机复现：用 <code>ipconfig</code>/<code>ip</code> 看网络、<code>Get-Process</code>/<code>ps</code> 看进程、<code>reg query</code>/<code>cat /etc/passwd</code> 看配置，边读边验证。'],
        ['对照着读 Windows 与 Linux','两者讲同一类概念（内核、文件、权限、服务、网络），但实现与命令迥异；对照读能建立「操作系统共性」的认知，而不被困在单一平台。'],
        ['用目录检索定位','左侧目录支持筛选，按 <code>/</code> 可快速聚焦搜索框；网址带 <code>#小节编号</code> 可直接分享某一节。']
      ],
      more:[
        {title:'嵌入式篇',desc:'裸机 · 驱动 · 实时系统',state:'编纂中'},
        {title:'网络篇',desc:'协议栈 · 服务 · 安全',state:'编纂中'},
        {title:'工具篇',desc:'构建系统 · 调试器 · CI',state:'编纂中'}
      ]
    }
  ];

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
  /* 规模统计 */
  function statsOf(v){
    var o={blocks:0,codes:0,chars:0,secs:0,courses:(v.courses||[]).length,chapters:0};
    (v.courses||[]).forEach(function(c){
      (c.chapters||[]).forEach(function(ch){
        o.chapters++;
        (ch.sections||[]).forEach(function(s){
          o.secs++;
          var bs=blocksOf(s);
          o.blocks+=bs.length;
          bs.forEach(function(b){ if(b.t==='code') o.codes++; o.chars+=blockText(b).length; });
        });
      });
    });
    return o;
  }
  var TOT={blocks:0,codes:0,chars:0,secs:0,courses:0,chapters:0};
  VOLUMES.forEach(function(v){
    v.stat=statsOf(v);
    ['blocks','codes','chars','secs','courses','chapters'].forEach(function(k){ TOT[k]+=v.stat[k]; });
  });
  function wan(n){ return (Math.round(n/1000)/10).toFixed(1); }

  var tree=document.getElementById('wikiTree'),
      article=document.getElementById('wikiArticle'),
      crumb=document.getElementById('wikiCrumb'),
      pager=document.getElementById('wikiPager'),
      search=document.getElementById('wikiSearch'),
      body=document.body,
      sideCount=document.getElementById('sideCount'),
      progress=document.getElementById('wikiProgress');

  /* ---------- 索引 ---------- */
  var INDEX={}, FLAT={};   /* FLAT[卷id] = 该卷全部小节，按阅读顺序 */
  INDEX[HOME.id]={type:'home',data:HOME};
  VOLUMES.forEach(function(v){
    INDEX[v.id]={type:'volume',data:v,parent:HOME.id};
    FLAT[v.id]=[];
    (v.courses||[]).forEach(function(c){
      INDEX[c.id]={type:'course',data:c,parent:v.id,vol:v.id};
      (c.chapters||[]).forEach(function(ch){
        INDEX[ch.id]={type:'chapter',data:ch,parent:c.id,course:c.id,vol:v.id};
        (ch.sections||[]).forEach(function(s){
          INDEX[s.id]={type:'section',data:s,parent:ch.id,course:c.id,vol:v.id};
          FLAT[v.id].push(s.id);
        });
      });
    });
  });
  if(sideCount) sideCount.textContent='共 '+VOLUMES.length+' 卷 · '+TOT.courses+' 门 · '+TOT.secs+' 节';

  /* ---------- 目录树 ---------- */
  function btn(node,arrow){
    var b=document.createElement('button');
    b.type='button';b.className='t-btn';
    if(arrow) b.innerHTML='<span class="t-arrow">▾</span>';
    else b.innerHTML='<span class="t-arrow" style="opacity:0">·</span>';
    var n=document.createElement('span');n.className='t-num';n.textContent=node.num||'';
    var l=document.createElement('span');l.className='t-label';l.textContent=node.treeLabel||node.title;
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
    tree.appendChild(tnode('t-home',HOME,null,false));
    VOLUMES.forEach(function(v){
      var courseKids=(v.courses||[]).map(function(c){
        var chapKids=(c.chapters||[]).map(function(ch){
          var secKids=(ch.sections||[]).map(function(s){ return tnode('t-sec',s,null,false); });
          return tnode('t-chap',ch,secKids,secKids.length>0);
        });
        return tnode('t-course',c,chapKids,true);
      });
      tree.appendChild(tnode('t-vol',v,courseKids,true));
    });
    var more=document.createElement('div');
    more.className='t-node t-empty';
    more.innerHTML='更多篇章 · 编纂中';
    tree.appendChild(more);
  }
  buildTree();

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
  function expandPath(id){
    var cur=INDEX[id];
    if(!cur) return;
    var chain=[];
    var p=cur.parent;
    while(p && INDEX[p]){ chain.push(INDEX[p].data.id); p=INDEX[p].parent; }
    tree.querySelectorAll('.t-chap').forEach(function(n){
      n.classList.toggle('closed',chain.indexOf(n.getAttribute('data-id'))===-1);
    });
    tree.querySelectorAll('.t-vol,.t-course').forEach(function(n){ n.classList.remove('closed'); });
    tree.querySelectorAll('.t-node').forEach(function(n){ n.classList.remove('cur'); });
    var target=tree.querySelector('.t-node[data-id="'+id+'"]');
    if(target){
      target.classList.add('cur');
      var side=document.getElementById('wikiSide');
      var r=target.getBoundingClientRect(), sr=side.getBoundingClientRect();
      if(r.top<sr.top+40||r.bottom>sr.bottom-40){ tree.scrollTop+=r.top-sr.top-140; }
    }
  }

  /* ---------- 工具 ---------- */
  function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
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
    crumb.innerHTML='<a href="#index">百科全书</a>'+parts.map(function(p){
      return '<s>›</s>'+(p.id?'<a href="#'+p.id+'">'+esc(p.t)+'</a>':'<b>'+esc(p.t)+'</b>');
    }).join('');
  }
  function setPager(id,volId){
    var list=FLAT[volId]||[];
    var i=list.indexOf(id);
    if(i===-1){ pager.innerHTML=''; return; }
    function a(j,cls,lab){
      if(j<0||j>=list.length) return '<div class="wa-pg '+cls+' empty"><span>'+lab+'</span><b>没有了</b></div>';
      var s=INDEX[list[j]].data;
      return '<a class="wa-pg '+cls+'" href="#'+s.id+'"><span>'+lab+'</span><b>'+esc(s.num+' '+s.title)+'</b></a>';
    }
    pager.innerHTML=a(i-1,'prev','← 上一节')+a(i+1,'next','下一节 →');
  }
  function courseCard(c){
    var s=statsOf({courses:[c]});
    return '<a class="wa-cl-card" href="#'+c.id+'"><i>'+esc(c.num)+'</i><b>'+esc(c.title)+'</b><span>'
      +(c.chapters||[]).length+' 章 · '+s.secs+' 节 · '+s.codes+' 个示例</span></a>';
  }
  function readList(items){
    return '<ol class="wa-steps">'+items.map(function(i){
      return '<li><b>'+i[0]+'</b>'+i[1]+'</li>';
    }).join('')+'</ol>';
  }
  function moreList(more){
    return '<div class="wa-chapter-list">'+more.map(function(m){
      return '<div class="wa-cl-card" style="opacity:.62;cursor:default"><i>'+esc(m.state)+'</i><b>'+esc(m.title)+'</b><span>'+esc(m.desc)+'</span></div>';
    }).join('')+'</div>';
  }

  /* ---------- 页面渲染 ---------- */
  function renderIndex(){
    crumbs([]);
    var h=cover(HOME.en,HOME.title,HOME.lead,
      [VOLUMES.length+' 卷',TOT.courses+' 门课程',TOT.secs+' 节教程','约 '+wan(TOT.chars)+' 万字']);
    h+='<div class="wa-body"><h3>全书分卷</h3><div class="wa-chapter-list wa-vol-list">';
    VOLUMES.forEach(function(v){
      var s=v.stat;
      h+='<a class="wa-cl-card wa-vol-card" href="#'+v.id+'"><i>'+esc(v.num)+'</i><b>'+esc(v.short)+'</b>'
        +'<span>'+s.courses+' 门课程 · '+s.chapters+' 章 · '+s.secs+' 节 · 约 '+wan(s.chars)+' 万字</span>'
        +'<em>'+esc((v.courses||[]).map(function(c){return c.title;}).join(' / '))+'</em></a>';
    });
    h+='</div>';
    h+='<h3>怎么读这套书</h3>'
      +'<ol class="wa-steps">'
      +'<li><b>按「篇」进入</b>每卷是一个独立主题，卷首页会给出本卷的课程清单与阅读建议，不必从第一卷读起。</li>'
      +'<li><b>用目录树定位</b>左侧目录按「卷 → 课程 → 章 → 节」四级展开，当前位置自动高亮；按 <code>/</code> 可聚焦搜索框筛选。</li>'
      +'<li><b>网址即书签</b>每个层级都有独立地址（如 <code>#c-1-1</code>、<code>#jnl-2-1</code>），可直接分享某一节。</li>'
      +'<li><b>留意内容规模</b>每节标题下方标注内容块数、代码示例数、字数与预计阅读时长，方便安排时间。</li>'
      +'</ol>';
    h+='<h3>编纂说明</h3><p>全书内容手写整理、无框架依赖。语言篇依据公开教材与 C23 标准归纳，操作系统篇依据项目归档文档整理，均标注了资料来源与状态日期；文档中未载明的细节以「待补 / 编纂中」标注，不作推测。</p>';
    h+='</div>';
    article.innerHTML=h; setPager('','');
  }
  function renderVolume(v){
    crumbs([{t:v.short}]);
    var s=v.stat;
    var h=cover(v.en,v.title,v.lead,
      [s.courses+' 门课程',s.chapters+' 章',s.secs+' 节教程',s.codes+' 个代码示例','约 '+wan(s.chars)+' 万字']);
    h+='<div class="wa-body"><h3>本卷目录</h3><div class="wa-chapter-list">';
    (v.courses||[]).forEach(function(c){ h+=courseCard(c); });
    h+='</div><h3>怎么读这一卷</h3>'+readList(v.read||[]);
    h+='<h3>后续篇章</h3>'+moreList(v.more||[]);
    h+='</div>';
    article.innerHTML=h; setPager('','');
  }
  function renderCourse(c){
    var v=INDEX[INDEX[c.id].vol].data;
    crumbs([{t:v.short,id:v.id},{t:c.title}]);
    var n=(c.chapters||[]).reduce(function(a,x){return a+(x.sections||[]).length;},0);
    var h=cover(c.en||'COURSE',c.title,c.lead,[(c.chapters||[]).length+' 章',n+' 节'].concat(c.chips||[]));
    h+='<div class="wa-body"><h3>章节目录</h3><div class="wa-chapter-list">';
    (c.chapters||[]).forEach(function(ch){
      h+='<a class="wa-cl-card" href="#'+ch.id+'"><i>'+esc(ch.num)+'</i><b>'+esc(ch.title)+'</b><span>'+esc((ch.sections||[]).length+' 节 · '+ch.lead.slice(0,28)+'…')+'</span></a>';
    });
    h+='</div></div>';
    article.innerHTML=h; setPager('','');
  }
  function renderChapter(ch,cid){
    var c=INDEX[cid].data, v=INDEX[INDEX[cid].vol].data;
    crumbs([{t:v.short,id:v.id},{t:c.title,id:c.id},{t:ch.num+' '+ch.title}]);
    var h=head(ch,'CHAPTER '+ch.num+' · '+c.title,c.chips||[]);
    h+='<div class="wa-body"><h3>本章小节</h3><div class="wa-sec-list">';
    (ch.sections||[]).forEach(function(s){
      h+='<button class="wa-sec-item" data-goto="'+s.id+'"><em>'+esc(s.num)+'</em><b>'+esc(s.title)+'</b><span>阅读 →</span></button>';
    });
    h+='</div></div>';
    article.innerHTML=h; setPager('','');
  }
  function renderSection(s,chid,cid){
    var ch=INDEX[chid].data, c=INDEX[cid].data, v=INDEX[INDEX[cid].vol].data;
    crumbs([{t:v.short,id:v.id},{t:c.title,id:c.id},{t:ch.num+' '+ch.title,id:ch.id},{t:s.num+' '+s.title}]);
    var bs=blocksOf(s), codes=0, chars=0;
    bs.forEach(function(b){ if(b.t==='code') codes++; chars+=blockText(b).length; });
    var mins=Math.max(2,Math.round(chars/380));
    var stat='<span><b>'+bs.length+'</b> 内容块</span><span><b>'+codes+'</b> 代码示例</span>'
      +'<span><b>'+chars+'</b> 字</span><span><b>'+mins+'</b> 分钟阅读</span>';
    var h=head(s,'SECTION '+s.num+' · '+c.title,(s.tags||[]).concat(c.chips||[]).slice(0,4),stat);
    h+='<div class="wa-body">'+bs.map(blockHTML).join('')+'</div>';
    article.innerHTML=h; setPager(s.id,INDEX[cid].vol);
  }

  /* ---------- 过场动画（时长可在「外观设置」里自定义，单位毫秒） ---------- */
  var wipe=document.getElementById('wikiWipe'),
      wipeNum=document.getElementById('wipeNum'),
      wipeName=document.getElementById('wipeName'),
      wipeEn=document.getElementById('wipeEn'),
      wipeTag=document.getElementById('wipeTag'),
      lastVol=null, lastCourse=null, wipeTimer=null, reduce=false;
  try{ reduce=window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; }catch(_){}
  var WIPE_MIN=600, WIPE_MAX=4000, WIPE_KEY='zfc-wiki-wipe',
      wipeMs=1500, wipeFade=450, wipeHold=1050;
  function applyWipe(ms,save){
    ms=Math.max(WIPE_MIN,Math.min(WIPE_MAX,Math.round(ms/100)*100));
    wipeMs=ms;
    wipeFade=Math.round(ms*0.3);   /* 后 30% 用于淡出 */
    wipeHold=ms-wipeFade;          /* 前 70% 卷名停留 */
    document.documentElement.style.setProperty('--wipe-fade',wipeFade+'ms');
    document.documentElement.style.setProperty('--wipe-hold',wipeHold+'ms');
    var val=document.getElementById('wipeVal'), rng=document.getElementById('wipeRange');
    if(val) val.textContent=(ms/1000).toFixed(1)+' s';
    if(rng && +rng.value!==ms) rng.value=ms;
    if(save!==false){ try{ localStorage.setItem(WIPE_KEY,String(ms)); }catch(_){} }
  }
  try{
    var sv=parseInt(localStorage.getItem(WIPE_KEY),10);
    applyWipe(isNaN(sv)?1500:sv,false);
  }catch(_){ applyWipe(1500,false); }
  function courseWipeNode(c){
    return {num:c.num||'', short:c.title||'', en:c.en||'COURSE', title:c.title||''};
  }
  function playWipe(v,kind){
    if(!wipe||reduce) return;
    var node=v||{num:'✦',short:HOME.title,en:HOME.en};
    if(wipeNum) wipeNum.textContent=node.num||'';
    if(wipeName) wipeName.textContent=node.short||node.title||'';
    if(wipeEn) wipeEn.textContent=node.en||'';
    if(wipeTag) wipeTag.textContent=(kind==='course'?'课 程':kind==='vol'?'卷':'');
    clearTimeout(wipeTimer);
    wipe.classList.remove('show','go','is-vol','is-course');
    if(kind) wipe.classList.add('is-'+kind);
    void wipe.offsetWidth;
    wipe.classList.add('show');
    wipeTimer=setTimeout(function(){
      wipe.classList.add('go');
      wipeTimer=setTimeout(function(){ wipe.classList.remove('show','go','is-vol','is-course'); },wipeFade);
    },wipeHold);
  }
  function fxEnter(){
    if(reduce) return;
    article.classList.remove('fx-in');
    void article.offsetWidth;
    article.classList.add('fx-in');
  }

  /* ---------- 路由 ---------- */
  function render(id){
    var node=INDEX[id]||INDEX['index'];
    id=node.data.id;
    var volId=node.vol || (node.type==='volume'?node.data.id:'index');
    var courseId=node.type==='course'?node.data.id
                :(node.type==='chapter'||node.type==='section')?node.course
                :null;
    /* 过场动画：切卷或进入不同课程时触发。
       跨卷 → 播放卷过场并重置课程记忆；
       同卷内进入不同课程 → 播放该课程专属过场（二级目录各自有独立过场）；
       同一课程内翻章节/小节 → 不打扰。 */
    if(volId!==lastVol){
      lastVol=volId; lastCourse=null;
      playWipe(volId!=='index' && INDEX[volId] ? INDEX[volId].data : null,'vol');
    } else if(courseId && courseId!==lastCourse){
      lastCourse=courseId;
      playWipe(courseWipeNode(INDEX[courseId].data),'course');
    }
    if(node.type==='home'||node.type==='volume'){ lastCourse=null; }
    if(node.type==='home') renderIndex();
    else if(node.type==='volume') renderVolume(node.data);
    else if(node.type==='course') renderCourse(node.data);
    else if(node.type==='chapter') renderChapter(node.data,node.parent);
    else renderSection(node.data,node.parent,node.course);
    expandPath(id);
    fxEnter();
    var vt=node.type==='home'?'':(INDEX[volId]&&INDEX[volId].data.short?INDEX[volId].data.short+' · ':'');
    document.title=(node.data.num?node.data.num+' · ':'')+node.data.title+' | '+vt+'方程的工艺百科全书';
    window.scrollTo({top:0,behavior:'instant'});
  }
  function route(){
    var id=decodeURIComponent(location.hash.replace(/^#/,'')||'index');
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
      expandPath((location.hash.replace(/^#/,'')||'index'));
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
    if(e.key==='Escape'){ closeSide(); closePalette(); if(search) search.blur(); }
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

  /* ---------- 配色切换 ---------- */
  var PALETTES=[
    {id:'slate',name:'蓝墨',   c1:'#1e6fa8',c2:'#f6f8fb'},
    {id:'sand', name:'暖砂',   c1:'#c2552f',c2:'#faf6ef'},
    {id:'moss', name:'苔原',   c1:'#3f7d52',c2:'#f4f7f1'},
    {id:'plum', name:'绛紫',   c1:'#8b4a8f',c2:'#faf6fb'},
    {id:'night',name:'深空夜', c1:'#4fb8d8',c2:'#0e1520',dark:true}
  ];
  var PK='zfc-wiki-palette', paletteBtn=document.getElementById('wikiPalette'),
      palettePop=document.getElementById('palettePop');
  var PAL_META={slate:'#f6f8fb',sand:'#faf6ef',moss:'#f4f7f1',plum:'#faf6fb',night:'#0e1520'};
  function applyPalette(id,init){
    var p=null;
    PALETTES.forEach(function(x){ if(x.id===id) p=x; });
    if(!p) p=PALETTES[0];
    document.documentElement.setAttribute('data-palette',p.id);
    if(p.dark) document.documentElement.setAttribute('data-theme','dark');
    else document.documentElement.removeAttribute('data-theme');
    var meta=document.querySelector('meta[name="theme-color"]');
    if(meta) meta.setAttribute('content',PAL_META[p.id]);
    try{ localStorage.setItem(PK,p.id); }catch(_){}
    if(palettePop) palettePop.querySelectorAll('.pal-item').forEach(function(b){
      b.classList.toggle('on',b.getAttribute('data-pal')===p.id);
    });
    if(!init && toast){
      toast.textContent=p.name+' · 已切换';
      toast.classList.add('show');
      clearTimeout(tt);tt=setTimeout(function(){ toast.classList.remove('show'); toast.textContent='已复制 ✓'; },1200);
    }
  }
  var palItems=document.getElementById('palItems');
  if(palItems){
    palItems.innerHTML=PALETTES.map(function(p){
      return '<button class="pal-item" type="button" data-pal="'+p.id+'">'
        +'<i style="background:linear-gradient(135deg,'+p.c2+' 0 50%,'+p.c1+' 50% 100%)"></i>'
        +'<span>'+p.name+'</span></button>';
    }).join('');
  }
  if(palettePop){
    palettePop.addEventListener('click',function(e){
      var b=e.target.closest('.pal-item');
      if(!b) return;
      applyPalette(b.getAttribute('data-pal'));
      closePalette();
    });
  }
  function openPalette(){ if(palettePop) palettePop.classList.add('open'); }
  function closePalette(){ if(palettePop) palettePop.classList.remove('open'); }
  if(paletteBtn) paletteBtn.addEventListener('click',function(e){
    e.stopPropagation();
    if(palettePop) palettePop.classList.toggle('open');
  });
  document.addEventListener('click',function(e){
    if(palettePop && !e.target.closest('.palette-wrap')) closePalette();
  });
  /* 初始：兼容旧版深色偏好 */
  var saved=null;
  try{ saved=localStorage.getItem(PK)||localStorage.getItem('zfc-wiki-theme'); }catch(_){}
  applyPalette(saved==='dark'?'night':(saved||'slate'),true);

  /* 过场时长：拖动即时生效并记住选择；「试播一次」立即预览当前时长 */
  var wipeRange=document.getElementById('wipeRange'), wipeTry=document.getElementById('wipeTry');
  if(wipeRange) wipeRange.addEventListener('input',function(){ applyWipe(+this.value); });
  if(wipeTry) wipeTry.addEventListener('click',function(){
    closePalette();
    if(reduce){
      if(toast){
        toast.textContent='系统已开启「减少动态效果」，过场未播放';
        toast.classList.add('show');
        clearTimeout(tt); tt=setTimeout(function(){ toast.classList.remove('show'); toast.textContent='已复制 ✓'; },1600);
      }
      return;
    }
    var id=decodeURIComponent(location.hash.replace(/^#/,'')||'index'), n=INDEX[id],
        vid=n?(n.vol||(n.type==='volume'?n.data.id:null)):null;
    playWipe(vid&&INDEX[vid]?INDEX[vid].data:null);
  });

  var yr=document.getElementById('yr'); if(yr) yr.textContent=new Date().getFullYear();
  route();
})();
