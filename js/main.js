// 背景音乐：五曲可选（China P / A / 2 + 恭喜发财 + 过年啦），默认 China P
// 自动播放被拦截则首次交互启动；支持上一曲/下一曲与列表循环
(function(){
  var au=document.getElementById('bgm'), btn=document.getElementById('bgmBtn'),
      ttl=document.getElementById('bgmTitle'), eq=document.getElementById('bgmEq'),
      chips=document.getElementById('bgmChips'),
      prev=document.getElementById('bgmPrev'), next=document.getElementById('bgmNext');
  if(!au||!btn) return;
  au.volume=.42;
  au.muted=true;   /* 静音预播：浏览器允许静音自动播放，首次交互立刻出声 */
  var tracks=[
    {src:'bgm.mp3',        name:'China P'},
    {src:'china_a.mp3',    name:'China A'},
    {src:'china_2.mp3',    name:'China 2'},
    {src:'gongxifacai.m4a',name:'刘德华 · 恭喜发财'},
    {src:'guonianla.m4a',  name:'贺东 · 过年啦'}
  ];
  var idx=0, want=true;
  au.src=tracks[idx].src;
  /* 首次任意交互：解除静音（真正的"自动播放"从这里开始出声） */
  ['pointerdown','keydown','touchstart'].forEach(function(ev){
    document.addEventListener(ev,function(){ au.muted=false; },{once:true});
  });
  function paint(){
    btn.classList.toggle('on',!au.paused);
    btn.classList.toggle('off',au.paused);
    btn.textContent=au.paused?'♪':'❚❚';
    eq.classList.toggle('paused',au.paused);
    ttl.textContent=tracks[idx].name;
    if(chips) chips.querySelectorAll('button').forEach(function(it){
      it.classList.toggle('cur',+it.getAttribute('data-i')===idx);
    });
  }
  function play(i){
    idx=((i%tracks.length)+tracks.length)%tracks.length;
    want=true;
    au.src=tracks[idx].src;
    au.muted=false;
    au.play().catch(paint);
    paint();
  }
  function kick(){ if(want&&au.paused) au.play().catch(paint); }
  document.addEventListener('pointerdown',kick);
  document.addEventListener('keydown',kick);
  btn.addEventListener('click',function(){
    if(au.paused){ want=true; au.muted=false; au.play().catch(paint); }
    else { want=false; au.pause(); }
    paint();
  });
  if(prev) prev.addEventListener('click',function(){ play(idx-1); });
  if(next) next.addEventListener('click',function(){ play(idx+1); });
  if(chips) chips.addEventListener('click',function(e){
    var it=e.target.closest('[data-i]');
    if(it) play(+it.getAttribute('data-i'));
  });
  au.addEventListener('ended',function(){ play(idx+1); });  /* 一曲终了，自动下一曲 */
  au.addEventListener('play',paint);
  au.addEventListener('pause',paint);
  kick(); paint();
})();

// 新春序幕：开幕动画
// 无按钮开幕：福字写完自动拉开幕布；期间点击任意处可提前开幕（同时解锁音乐）
(function(){
  var pre=document.getElementById('prelude');
  if(!pre) return;
  var au=document.getElementById('bgm');
  document.documentElement.classList.add('prelock');          /* 开幕期间锁定滚动 */
  var opened=false;
  function open(){
    if(opened) return;
    opened=true;
    pre.classList.add('open');
    document.documentElement.classList.remove('prelock');
    document.body.classList.add('opened');                    /* 首屏元素渐入 */
    if(au){ au.muted=false; au.play().catch(function(){}); }  /* 开幕即奏乐 */
    setTimeout(function(){ pre.classList.add('done'); },1700);
  }
  pre.addEventListener('click',open);                          /* 点击任意处提前开幕 */
  setTimeout(open,5200);                                       /* 福字写完翻转后自动开幕 */
})();

// 集卡系统：五福池 + 特别卡池 · 飞入 + 倾斜跟随 + 粒子 + 详情卷轴 + 加权抽卡演出
(function(){
  var cards=[].slice.call(document.querySelectorAll('.fucard'));
  var prog=document.getElementById('fuProgress'), done=document.getElementById('fuDone'),
      spDone=document.getElementById('spDone'),
      bar=document.getElementById('fuBar'), spBar=document.getElementById('spBar'),
      scanBtn=document.getElementById('fuScan'), modal=document.getElementById('fuModal'),
      drawOv=document.getElementById('drawOv'), dLabel=document.getElementById('dLabel'),
      dName=document.getElementById('dName'), dType=document.getElementById('dType');
  if(!cards.length) return;
  var FU_N=5;
  /* 卡牌数据：优先读 data.php（PHP 环境可用），静态托管时使用内置兜底数据 */
  var DATA=[
    {name:'爱国福',tag:'福卡 · 壹',rare:'稀有度 ★★★',poem:'苟利国家生死以<br>岂因祸福避趋之',bless:'愿山河无恙，家国永安。此心如炬，与君共赴新程。'},
    {name:'富强福',tag:'福卡 · 贰',rare:'稀有度 ★★★★',poem:'仓廪实而知礼节<br>衣食足而知荣辱',bless:'愿仓廪丰实，百业兴旺；手中有粮，心中有光。'},
    {name:'和谐福',tag:'福卡 · 叁',rare:'稀有度 ★★☆',poem:'家和万事兴<br>人和百业旺',bless:'愿阖家和睦，邻里相亲；一屋两人的烟火，胜过万家灯火。'},
    {name:'友善福',tag:'福卡 · 肆',rare:'稀有度 ★★★',poem:'上善若水<br>水善利万物而不争',bless:'愿与人为善，温柔相待；你给出的善意，都会绕回来。'},
    {name:'敬业福',tag:'福卡 · 伍',rare:'稀有度 ★★★★★',poem:'业精于勤荒于嬉<br>行成于思毁于随',bless:'愿心无旁骛，事事有成；白天写代码，晚上开直播，皆是热爱。'},
    {name:'FC235',tag:'特别 · 人物牌',rare:'人物牌 ★★★★★',poem:'白天写代码，晚上开直播<br>网站自己手搓',bless:'站长本尊，VS2026 般可靠——编译通过，人生顺遂。'},
    {name:'rcl',tag:'特别 · 人物牌',rare:'人物牌 ★★★★',poem:'WORLD 1-1<br>橘猫常驻 · 喵~',bless:'像素世界里的特别支持者——嘘，别告诉 rcl。'},
    {name:'JGhuihui',tag:'特别 · 人物牌',rare:'人物牌 ★★★★',poem:'wow<br>液态玻璃 · 折射万千',bless:'QIU 科技作者——像四层折射玻璃一样通透的人。'},
    {name:'zhangsen',tag:'特别 · 人物牌',rare:'人物牌 ★★★★',poem:'NODE-Z2 / 2092<br>由 zhangsen 强力驱动',bless:'来自 2092 的支持者——扫描线之下的硬核浪漫。'},
    {name:'JNL OS',tag:'联动 · JNL',rare:'联动牌 ★★★★',poem:'安全 · 稳定 · 高效<br>3GB 内存流畅运行',bless:'Java Net Lava OS——基于 Debian 13 的 Cinnamon 发行版，开箱即用、离线部署。jnlos.netlify.app'},
    {name:'云梦分享站',tag:'联动 · YUNMENG',rare:'联动牌 ★★★★',poem:'迎新纳福 · 2027<br>软件分享 × 在线工具',bless:'云梦分享站 × zhangfangcheng.cn 联动——精选软件、在线工具、安全绿色、极速直链。yunmeng.de5.net'}
  ];
  try{
    fetch('data.php').then(function(r){ if(!r.ok) throw 0; return r.json(); }).then(function(j){
      if(Array.isArray(j) && j.length===DATA.length && j.every(function(d){ return d && d.name && d.poem; })) DATA=j;
    }).catch(function(){});
  }catch(e){}
  var got={};
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine=window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* 进视口依次飞入 */
  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){
      if(!e.isIntersecting) return;
      var el=e.target, i=cards.indexOf(el);
      setTimeout(function(){ el.classList.add('in'); }, i*130);
      io.unobserve(el);
    });
  },{threshold:.25});
  cards.forEach(function(c){ io.observe(c); });

  function paint(){
    var fu=0,sp=0,k;
    for(k=0;k<FU_N;k++) if(got[k]) fu++;
    for(k=FU_N;k<cards.length;k++) if(got[k]) sp++;
    if(prog) prog.textContent='福卡 '+fu+' / '+FU_N+' · 特别卡 '+sp+' / '+(cards.length-FU_N)+(fu+sp<cards.length?' · 扫一扫抽取':' · 全部集齐');
    if(bar) [].slice.call(bar.children).forEach(function(s,i){ s.classList.toggle('on',!!got[i]); });
    if(spBar) [].slice.call(spBar.children).forEach(function(s,i){ s.classList.toggle('on',!!got[FU_N+i]); });
    if(done){ if(fu===FU_N) done.classList.add('show'); else done.classList.remove('show'); }
    if(spDone){ if(sp===cards.length-FU_N) spDone.classList.add('show'); else spDone.classList.remove('show'); }
  }
  /* 金色粒子爆开 */
  function burst(card){
    if(reduce) return;
    for(var k=0;k<10;k++){
      var s=document.createElement('i');
      s.className='spark';
      var ang=Math.PI*2*k/10+Math.random()*.5, r=46+Math.random()*36;
      s.style.setProperty('--sx',(Math.cos(ang)*r).toFixed(1)+'px');
      s.style.setProperty('--sy',(Math.sin(ang)*r-14).toFixed(1)+'px');
      card.appendChild(s);
      (function(el){ setTimeout(function(){ el.remove(); },820); })(s);
    }
  }
  function collect(i,card){
    got[i]=1;
    card.classList.add('flip');
    burst(card);
    paint();
  }
  /* 悬浮 3D 倾斜跟随 */
  if(fine && !reduce){
    cards.forEach(function(c){
      var inner=c.querySelector('.fc-inner');
      c.addEventListener('pointermove',function(e){
        if(c.classList.contains('flip')) return;
        var r=c.getBoundingClientRect();
        var x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
        inner.style.transform='rotateY('+(x*16).toFixed(2)+'deg) rotateX('+(-y*14).toFixed(2)+'deg) translateZ(6px)';
      });
      c.addEventListener('pointerleave',function(){ inner.style.transform=''; });
    });
  }
  /* 点击卡牌只查看详情 —— 收集只能通过抽卡获得 */
  cards.forEach(function(c){
    var i=+c.getAttribute('data-f');
    c.setAttribute('title','点击查看详情 · 收集请扫一扫抽卡');
    c.addEventListener('click',function(){ openDetail(i); });
    c.addEventListener('keydown',function(e){
      if(e.key==='Enter'||e.key===' '){ e.preventDefault(); openDetail(i); }
    });
  });

  /* ---------- 详情卷轴 ---------- */
  var panel=document.getElementById('fuPanel'),
      mTag=document.getElementById('mTag'), mRare=document.getElementById('mRare'),
      mFu=document.getElementById('mFu'), mName=document.getElementById('mName'),
      mPoem=document.getElementById('mPoem'), mBless=document.getElementById('mBless'),
      mStatus=document.getElementById('mStatus'), mTake=document.getElementById('mTake');
  var curF=0;
  function openDetail(i){
    curF=i;
    var d=DATA[i];
    panel.setAttribute('data-f',i);
    mTag.textContent=d.tag;
    mRare.textContent=d.rare;
    mName.textContent=d.name;
    mPoem.innerHTML=d.poem;
    mBless.textContent=d.bless;
    var isGot=!!got[i];
    mStatus.textContent=isGot?'已收集':'未收集';
    mStatus.classList.toggle('got',isGot);
    mTake.textContent=isGot?'已收集 · 关闭':'去抽卡';
    modal.classList.add('open');
  }
  function closeDetail(){ modal.classList.remove('open'); }
  document.querySelectorAll('[data-more]').forEach(function(m){
    m.addEventListener('click',function(e){
      e.stopPropagation();
      openDetail(+m.closest('.fucard').getAttribute('data-f'));
    });
  });
  modal.addEventListener('click',function(e){
    if(e.target.closest('[data-mclose]')) closeDetail();
  });
  document.addEventListener('keydown',function(e){
    if(e.key==='Escape') closeDetail();
  });
  /* 「去抽卡」：关闭详情并跳到扫福按钮；已收集则直接关闭 */
  mTake.addEventListener('click',function(){
    var ungot=!got[curF];
    closeDetail();
    if(ungot && scanBtn){
      scanBtn.scrollIntoView({behavior:'smooth',block:'center'});
      scanBtn.classList.add('pulse');
      setTimeout(function(){ scanBtn.classList.remove('pulse'); },1600);
    }
  });

  /* ---------- 扫一扫 · 加权抽卡演出（福卡稀有，特别卡常出） ---------- */
  function finishDraw(pi){
    var card=cards[pi];
    card.classList.add('picked');
    setTimeout(function(){ card.classList.remove('picked'); },1300);
    collect(pi,card);
    setTimeout(function(){ openDetail(pi); },450);
  }
  function closeDraw(){
    drawOv.classList.remove('open','reveal');
    if(scanBtn) scanBtn.disabled=false;
    if(drawOv._pending!=null){
      var p=drawOv._pending; drawOv._pending=null;
      finishDraw(p);
    }
  }
  if(drawOv) drawOv.addEventListener('click',function(){
    if(drawOv.classList.contains('reveal')) closeDraw();
  });
  if(scanBtn){
    scanBtn.addEventListener('click',function(){
      if(scanBtn.disabled) return;
      var rest=[];
      cards.forEach(function(c,i){ if(!got[i]) rest.push(i); });
      if(!rest.length){   /* 全集齐：摇横幅 */
        if(done){ done.classList.add('shake'); setTimeout(function(){ done.classList.remove('shake'); },500); }
        if(spDone){ spDone.classList.add('shake'); setTimeout(function(){ spDone.classList.remove('shake'); },500); }
        return;
      }
      scanBtn.disabled=true;
      /* 绿光波扫过全部卡面 */
      cards.forEach(function(c,k){
        setTimeout(function(){
          c.classList.add('scan');
          setTimeout(function(){ c.classList.remove('scan'); },600);
        },k*90);
      });
      /* 加权随机：福卡权重 1（稀有），特别卡权重 3（常出） */
      var total=0;
      rest.forEach(function(i){ total+= i<FU_N?1:3; });
      var t=Math.random()*total, pi=rest[0];
      for(var r=0;r<rest.length;r++){
        t-= rest[r]<FU_N?1:3;
        if(t<=0){ pi=rest[r]; break; }
      }
      if(reduce){ finishDraw(pi); return; }
      /* 演出：遮罩层 + 快速轮播卡名 → 定格结果 */
      var names=DATA.map(function(d){ return d.name; });
      dLabel.textContent='扫 福 中'; dName.textContent='···'; dType.textContent='';
      drawOv.classList.add('open'); drawOv.classList.remove('reveal');
      var cycle=setInterval(function(){ dName.textContent=names[Math.floor(Math.random()*names.length)]; },90);
      setTimeout(function(){
        clearInterval(cycle);
        /* 抽卡演出卡随卡牌主题变色 */
        try{
          var cs=getComputedStyle(cards[pi]);
          ['--ac','--ac-glow','--fcface'].forEach(function(v){
            drawOv.style.setProperty(v,cs.getPropertyValue(v));
          });
        }catch(e){}
        drawOv.classList.add('reveal');
        dLabel.textContent='获 得';
        dName.textContent=DATA[pi].name;
        dType.textContent=pi<FU_N?'✦ 稀有 · 福卡 ✦':'特别 · '+DATA[pi].rare;
        drawOv._pending=pi;
        setTimeout(function(){ if(drawOv.classList.contains('reveal')) closeDraw(); },2100);
      },1500);
    });
  }
})();

// 时钟
(function(){
  var el=document.getElementById('clock');
  function p(n){return n<10?'0'+n:n}
  function tick(){var d=new Date();el.textContent=p(d.getHours())+':'+p(d.getMinutes())+':'+p(d.getSeconds());}
  setInterval(tick,1000);tick();
})();

// 倒计时：元旦 & 春节（单位：秒）
(function(){
  var nyEl=document.getElementById('cdNY'), cnyEl=document.getElementById('cdCNY');
  if(!nyEl||!cnyEl) return;
  var NY=new Date(2027,0,1,0,0,0).getTime();    /* 元旦 2027-01-01 00:00:00 */
  var CNY=new Date(2027,1,6,0,0,0).getTime();   /* 春节 2027-02-06 00:00:00 · 正月初一 */
  function fmt(s){ return (s<0?0:s).toLocaleString('en-US'); }
  function tick(){
    var now=Date.now();
    nyEl.textContent=fmt(Math.floor((NY-now)/1000));
    cnyEl.textContent=fmt(Math.floor((CNY-now)/1000));
  }
  setInterval(tick,1000);tick();
})();

// 液态玻璃：鼠标位置驱动折射光斑
(function(){
  var g=document.querySelector('.liquid .glass');
  if(!g) return;
  g.addEventListener('pointermove',function(e){
    var r=g.getBoundingClientRect();
    g.style.setProperty('--mx',((e.clientX-r.left)/r.width*100).toFixed(1)+'%');
    g.style.setProperty('--my',((e.clientY-r.top)/r.height*100).toFixed(1)+'%');
  });
  g.addEventListener('pointerleave',function(){
    g.style.setProperty('--mx','50%');g.style.setProperty('--my','18%');
  });
})();

// FC235 代码打字机（滚动到视野内自动开始，点击窗口重放）
(function(){
  var win=document.querySelector('.vs2026');
  if(!win) return;
  var el=win.querySelector('.typer'),
      pos=document.getElementById('vsPos'),
      full='public override string 签名 => "山岚雾内望岚山，悠悠湖水月儿弯";',
      done='<span class="k">public override string</span> <span class="id">签名</span> => <span class="s">"山岚雾内望岚山，悠悠湖水月儿弯"</span>;';
  var timer=null, started=false;
  function play(){
    if(timer) clearInterval(timer);
    el.textContent=''; var i=0;
    timer=setInterval(function(){
      i++; el.textContent=full.slice(0,i);
      if(pos) pos.textContent='行 7，列 '+(9+i);
      if(i>=full.length){ clearInterval(timer); timer=null; el.innerHTML=done; }
    },42);
  }
  function start(){ if(started) return; started=true; play(); }
  if('IntersectionObserver' in window){
    new IntersectionObserver(function(en,ob){
      en.forEach(function(e){ if(e.isIntersecting){ start(); ob.disconnect(); } });
    },{threshold:.35}).observe(win);
  } else { start(); }
  win.addEventListener('click',function(){ play(); });
})();
