/* ==========================================================
   HTML 系统教程数据
   标准：HTML5（Living Standard / W3C）
   章节 1~9，从文档结构到语义化、表单、媒体、API 与可访问性
   ========================================================== */
window.WIKI_HTML = {
  id:'html', num:'丁', en:'COURSE IV · HTML',
  title:'HTML',
  lead:'超文本标记语言是网页的骨架。本教程从「一份合法 HTML 文档长什么样」讲起，覆盖语义标签、链接图像、列表表格表单、页面结构语义化、媒体与 HTML5 API、可访问性，直到校验与最佳实践。每节都给可复制的片段，编号 1.1 至 9.x。',
  chips:['HTML5','语义化','共 9 章'],
  chapters:[

  /* ================= 第 1 章 ================= */
  {id:'html-1',num:'1',title:'HTML 是什么与文档结构',lead:'HTML 不是编程语言，是描述结构的标记语言。',sections:[
    {id:'html-1-1',num:'1.1',title:'HTML 的定位',lead:'用标签描述内容的意义与层级，表现交给 CSS、行为交给 JS。',tags:['绪论'],blocks:[
      {t:'p',x:'<b>HTML（HyperText Markup Language）</b>用一系列<b>标签（tag）</b>描述网页的结构与内容含义：标题、段落、列表、链接、图片……它本身<b>不负责外观与交互</b>——样式由 CSS 决定，行为由 JavaScript 驱动。三者分工是现代网页的基石。'},
      {t:'p',x:'一个常见误区：HTML 是「编程语言」。其实它是<b>标记语言（markup）</b>，没有变量、循环、条件，只描述「这是什么」。浏览器把 HTML 解析成 DOM 树，CSS 与 JS 再作用于这棵树。'},
      {t:'note',k:'三层分离',x:'把结构（HTML）、表现（CSS）、行为（JS）分离，是 Web 工程的基本纪律：改样式不必动结构，改交互不必动样式，维护成本低得多。'}
    ]},
    {id:'html-1-2',num:'1.2',title:'一个最小合法文档',lead:'<!DOCTYPE>、html、head、body 各司其职。',tags:['基础'],blocks:[
      {t:'code',lang:'HTML',x:'<!DOCTYPE html>\n<html lang="zh-CN">\n  <head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1">\n    <title>页面标题</title>\n  </head>\n  <body>\n    <h1>你好，HTML5</h1>\n    <p>这是一段正文。</p>\n  </body>\n</html>'},
      {t:'ul',items:[
        '<code>&lt;!DOCTYPE html&gt;</code>：声明文档类型，触发标准模式（而非 IE 怪异模式）',
        '<code>&lt;html lang="zh-CN"&gt;</code>：根元素，<code>lang</code> 帮助屏幕阅读器与搜索引擎',
        '<code>&lt;head&gt;</code>：放元数据（字符集、标题、样式/脚本引用），不显示在页面',
        '<code>&lt;body&gt;</code>：放用户可见的内容'
      ]},
      {t:'note',k:'charset 必须靠前',x:'<code>&lt;meta charset&gt;</code> 应放在 <code>&lt;head&gt;</code> 最前面，让浏览器尽早确定编码，避免中文乱码。'}
    ]},
    {id:'html-1-3',num:'1.3',title:'标签、属性与转义',lead:'开始/结束标签、自闭合、属性值与保留字转义。',tags:['语法'],blocks:[
      {t:'p',x:'标签大多成对：<code>&lt;p&gt;…&lt;/p&gt;</code>。少数<b>空元素（void element）</b>无需结束标签，如 <code>&lt;img&gt;</code>、<code>&lt;br&gt;</code>、<code>&lt;meta&gt;</code>、<code>&lt;input&gt;</code>。属性写在开始标签内：<code>&lt;a href="url"&gt;</code>。'},
      {t:'p',x:'HTML 里有几个字符有语法意义，必须写成<b>实体（entity）</b>：<code>&amp;amp;</code>（&amp;）、<code>&amp;lt;</code>（&lt;）、<code>&amp;gt;</code>（&gt;）、<code>&amp;quot;</code>（"）、<code>&amp;nbsp;</code>（不换行空格）。直接写 <code>&lt;</code> 会被当成标签开头。'},
      {t:'code',lang:'HTML',x:'<p>5 &lt; 10 &amp;&amp; 3 &gt; 1</p>\n<img src="cat.png" alt="一只猫">'},
      {t:'note',k:'属性值加引号',x:'虽然 HTML 在不含空格时可省略引号，但<b>始终加双引号</b>是更好的习惯：可读、防错、对属性含特殊字符更安全。'}
    ]}
  ]},

  /* ================= 第 2 章 ================= */
  {id:'html-2',num:'2',title:'文本与语义标签',lead:'用对的标签表达内容的语义，而不是只为了好看。',sections:[
    {id:'html-2-1',num:'2.1',title:'标题、段落与强调',lead:'h1~h6 构建文档大纲，em/strong 表达语气。',tags:['文本'],blocks:[
      {t:'p',x:'<code>&lt;h1&gt;</code> 到 <code>&lt;h6&gt;</code> 是六级标题，应<b>按层级嵌套</b>构建大纲（一个页面通常只有一个 h1）。<code>&lt;p&gt;</code> 是段落。<code>&lt;em&gt;</code>（强调，通常斜体）与 <code>&lt;strong&gt;</code>（重要，通常粗体）比 <code>&lt;i&gt;/&lt;b&gt;</code> 更有语义——前者表达含义，后者只是样式。'},
      {t:'code',lang:'HTML',x:'<h1>主标题</h1>\n<h2>章节</h2>\n<p>正文，其中<em>这词需要强调</em>，而<strong>这点是重点</strong>。</p>'},
      {t:'note',k:'语义 > 样式',x:'不要用 <code>&lt;b&gt;</code> 只为加粗——若只是为了视觉强调而没有语义，用 CSS。需要语义就用 <code>strong</code>。'}
    ]},
    {id:'html-2-2',num:'2.2',title:'换行、分隔与引用',lead:'br、hr、blockquote、cite、code、pre 的用途。',tags:['文本'],blocks:[
      {t:'code',lang:'HTML',x:'<p>第一行<br>第二行</p>\n<hr>\n<blockquote cite="https://example.com">\n  一段引用内容。\n</blockquote>\n<p>行内代码：<code>console.log()</code></p>\n<pre><code>多行\n  保留空白与缩进</code></pre>'},
      {t:'p',x:'<code>&lt;br&gt;</code> 是换行（如地址、诗句）；<code>&lt;hr&gt;</code> 是主题分隔线；<code>&lt;blockquote&gt;</code> 是整段引用并可用 <code>cite</code> 标注出处；<code>&lt;pre&gt;</code> 保留空白格式，常用于代码块。'},
      {t:'note',k:'pre 与代码块',x:'展示代码务必用 <code>&lt;pre&gt;&lt;code&gt;</code> 组合，<code>pre</code> 保格式，<code>code</code> 表语义。内容里的 <code>&lt;</code> 记得转义。'}
    ]}
  ]},

  /* ================= 第 3 章 ================= */
  {id:'html-3',num:'3',title:'链接、图像与多媒体',lead:'超链接是 Web 的灵魂，img 是主要的视觉资源。',sections:[
    {id:'html-3-1',num:'3.1',title:'超链接 a 与 href',lead:'锚点、相对/绝对路径、新窗口与下载。',tags:['核心'],blocks:[
      {t:'p',x:'<code>&lt;a href="目标"&gt;</code> 创建超链接。<code>href</code> 可以是站内相对路径（<code>about.html</code>）、绝对 URL（<code>https://…</code>）、锚点（<code>#section</code> 跳到本页某 id）、<code>mailto:</code> 或 <code>tel:</code>。'},
      {t:'code',lang:'HTML',x:'<a href="https://example.com">外链</a>\n<a href="#top">回到顶部</a>\n<a href="file.pdf" download>下载</a>\n<a href="/doc" target="_blank" rel="noopener">新窗口打开</a>'},
      {t:'note',k:'target=_blank 必加 rel',x:'外链开新窗口时务必加 <code>rel="noopener"</code>（和 <code>noreferrer</code>），否则新页面可通过 <code>window.opener</code> 操控你的页面，存在安全与性能隐患。'}
    ]},
    {id:'html-3-2',num:'3.2',title:'图片 img 与 alt',lead:'alt 是图片的无障碍生命线，也影响 SEO。',tags:['媒体'],blocks:[
      {t:'code',lang:'HTML',x:'<img src="photo.jpg" alt="夕阳下的海岸线" width="800" height="600" loading="lazy">'},
      {t:'p',x:'<code>alt</code> 描述图片内容：屏幕阅读器会读出它，图片加载失败时它作为占位文字，搜索引擎也靠它理解图片。<b>装饰性图片用空 alt（<code>alt=""</code>）</b>，信息性图片必须有准确描述。'},
      {t:'p',x:'<code>width/height</code> 提前预留空间避免布局抖动；<code>loading="lazy"</code> 让视口外图片延迟加载，提升性能。'},
      {t:'note',k:'响应式图片',x:'用 <code>&lt;picture&gt;</code> + <code>&lt;source&gt;</code> 可按屏幕密度/宽度提供不同分辨率图，避免手机下载巨图。'}
    ]}
  ]},

  /* ================= 第 4 章 ================= */
  {id:'html-4',num:'4',title:'列表、表格与表单',lead:'结构化内容的三种主力容器。',sections:[
    {id:'html-4-1',num:'4.1',title:'三种列表',lead:'无序 ul、有序 ol、描述 dl。',tags:['结构'],blocks:[
      {t:'code',lang:'HTML',x:'<ul><li>苹果</li><li>香蕉</li></ul>\n<ol><li>第一步</li><li>第二步</li></ol>\n<dl><dt>HTML</dt><dd>标记语言</dd><dt>CSS</dt><dd>样式表</dd></dl>'},
      {t:'p',x:'<code>&lt;ul&gt;</code>/<code>&lt;ol&gt;</code> 配合 <code>&lt;li&gt;</code> 表达并列或有序项；<code>&lt;dl&gt;</code>（描述列表）用 <code>&lt;dt&gt;</code>（术语）+<code>&lt;dd&gt;</code>（解释）呈现键值对照，适合词汇表、参数说明。'}
    ]},
    {id:'html-4-2',num:'4.2',title:'表格 table 的正确结构',lead:'用 thead/tbody/tfoot 与 th 表达表头，而非堆叠 div。',tags:['结构'],blocks:[
      {t:'code',lang:'HTML',x:'<table>\n  <thead><tr><th>名称</th><th>数量</th></tr></thead>\n  <tbody>\n    <tr><td>苹果</td><td>3</td></tr>\n    <tr><td>香蕉</td><td>5</td></tr>\n  </tbody>\n</table>'},
      {t:'p',x:'表格的语义元素：<code>&lt;caption&gt;</code> 表标题、<code>&lt;thead&gt;/&lt;tbody&gt;/&lt;tfoot&gt;</code> 分区、<code>&lt;th scope="col|row"&gt;</code> 表头单元格并声明其作用方向。复杂的二维数据才用表格，<b>不要用表格做页面布局</b>（那是 Flex/Grid 的事）。'},
      {t:'note',k:'th 的 scope',x:'给 <code>&lt;th&gt;</code> 加 <code>scope</code> 能让屏幕阅读器正确朗读「第几行/列」，是表格可访问性的关键。'}
    ]},
    {id:'html-4-3',num:'4.3',title:'表单：输入控件的全家福',lead:'input 的 type、label、select、textarea、button。',tags:['核心'],blocks:[
      {t:'table',head:['控件','用途'],rows:[
        ['<code>&lt;input type="text"&gt;</code>','单行文本'],
        ['<code>type="email" / "number" / "tel"</code>','带校验的专用输入'],
        ['<code>type="checkbox" / "radio"</code>','多选 / 单选'],
        ['<code>type="date" / "range" / "color"</code>','日期 / 滑块 / 取色'],
        ['<code>&lt;select&gt; &lt;option&gt;</code>','下拉选择'],
        ['<code>&lt;textarea&gt;</code>','多行文本'],
        ['<code>&lt;button&gt;</code>','可点击按钮']
      ]},
      {t:'code',lang:'HTML',x:'<form action="/submit" method="post">\n  <label for="name">姓名</label>\n  <input id="name" name="name" type="text" required>\n  <button type="submit">提交</button>\n</form>'},
      {t:'note',k:'label 必须用 for 关联',x:'<code>&lt;label for="id"&gt;</code> 与输入框 <code>id</code> 绑定后，点击文字即可聚焦输入框，且对屏幕阅读器至关重要。'}
    ]}
  ]},

  /* ================= 第 5 章 ================= */
  {id:'html-5',num:'5',title:'页面结构语义化',lead:'用 sectioning 元素替代满屏 div，构建可被机器理解的大纲。',sections:[
    {id:'html-5-1',num:'5.1',title:'header/nav/main/section/article/footer',lead:'每个区块的意思都写进标签名里。',tags:['语义'],blocks:[
      {t:'p',x:'HTML5 提供一批<b>语义化结构标签</b>，取代过去千篇一律的 <code>&lt;div class="header"&gt;</code>：<code>&lt;header&gt;</code>（页眉/区头）、<code>&lt;nav&gt;</code>（导航）、<code>&lt;main&gt;</code>（主内容，每页一个）、<code>&lt;section&gt;</code>（主题区块）、<code>&lt;article&gt;</code>（独立可分发内容如博客/评论）、<code>&lt;aside&gt;</code>（侧栏/补充）、<code>&lt;footer&gt;</code>（页脚）。'},
      {t:'code',lang:'HTML',x:'<header><h1>站点名</h1><nav>…</nav></header>\n<main>\n  <article><h2>文章标题</h2><p>…</p></article>\n  <aside>相关链接</aside>\n</main>\n<footer>© 2026</footer>'},
      {t:'note',k:'main 唯一且跳过',x:'<code>&lt;main&gt;</code> 每页只有一个，辅助技术可一键跳到主内容（配合「跳到主内容」链接），显著提升键盘/读屏体验。'}
    ]},
    {id:'html-5-2',num:'5.2',title:'什么时候还用 div / span',lead:'没有语义时才用通用容器。',tags:['语义'],blocks:[
      {t:'p',x:'<code>&lt;div&gt;</code>（块级）<code>&lt;span&gt;</code>（行内）是<b>无语义</b>的通用容器，仍大量存在：仅为了布局分组、套 CSS、挂 JS 钩子，而内容本身没有「导航」「文章」之类的语义时，就用它们。'},
      {t:'p',x:'判断原则：先问「这一段有没有语义？」有就用对应的语义标签，没有才用 div/span。过度语义化（把每个小块都套 section）和完全不用（满屏 div）都不可取。'}
    ]}
  ]},

  /* ================= 第 6 章 ================= */
  {id:'html-6',num:'6',title:'嵌入资源与外部引用',lead:'把样式、脚本、字体、图标接进来。',sections:[
    {id:'html-6-1',num:'6.1',title:'link 与 script 的放置',lead:'CSS 放 head，JS 放 body 末尾或用 defer。',tags:['引用'],blocks:[
      {t:'code',lang:'HTML',x:'<head>\n  <link rel="stylesheet" href="style.css">\n</head>\n<body>\n  …内容…\n  <script src="app.js" defer></script>\n</body>'},
      {t:'p',x:'<code>&lt;link rel="stylesheet"&gt;</code> 引入外部 CSS。<code>&lt;script&gt;</code> 放 <code>&lt;body&gt;</code> 末尾可避免阻塞渲染；用 <code>defer</code> 则脚本延迟到 DOM 解析完再按顺序执行（还能放 head）；<code>async</code> 则不保证顺序、谁先加载完谁先跑，适合独立统计脚本。'},
      {t:'note',k:'defer vs async',x:'依赖 DOM 或彼此有顺序的脚本用 <code>defer</code>；独立、无依赖（如广告/分析）用 <code>async</code> 以最快执行。'}
    ]},
    {id:'html-6-2',num:'6.2',title:'SVG 图标与 favicon',lead:'行内 SVG 与图标字体、站点图标的设置。',tags:['资源'],blocks:[
      {t:'code',lang:'HTML',x:'<link rel="icon" href="favicon.ico">\n<!-- 行内 SVG 可直接写进 HTML，可被 CSS 染色 -->\n<svg viewBox="0 0 24 24" width="24" height="24">\n  <path d="M12 2l3 7h7l-5 5 2 7-7-4-7 4 2-7-5-5h7z"/>\n</svg>'},
      {t:'p',x:'SVG 是矢量图，直接内联在 HTML 里可被 CSS 改色、被 JS 操作，不增加请求数；适合图标、Logo、简单插画。favicon 用 <code>rel="icon"</code> 指定，提升标签页辨识度。'}
    ]}
  ]},

  /* ================= 第 7 章 ================= */
  {id:'html-7',num:'7',title:'HTML5 常用 API',lead:'现代浏览器在 HTML 里内置的能力。',sections:[
    {id:'html-7-1',num:'7.1',title:'video / audio 与 canvas',lead:'原生媒体播放与脚本画图。',tags:['API'],blocks:[
      {t:'code',lang:'HTML',x:'<video controls width="640">\n  <source src="m.mp4" type="video/mp4">\n  <source src="m.webm" type="video/webm">\n  您的浏览器不支持 video。\n</video>\n<canvas id="c" width="300" height="150"></canvas>'},
      {t:'p',x:'<code>&lt;video&gt;/&lt;audio&gt;</code> 提供原生播放器（<code>controls</code> 显示控件），多 <code>&lt;source&gt;</code> 做格式兼容。<code>&lt;canvas&gt;</code> 是一块画布，需用 JavaScript 的 2D/WebGL 上下文去绘制图形、图表、游戏。'},
      {t:'note',k:'canvas vs svg',x:'需要<b>逐像素/高频重绘</b>（游戏、图表）用 canvas；需要<b>可缩放、可交互、可访问</b>用 SVG。两者互补。'}
    ]},
    {id:'html-7-2',num:'7.2',title:'Web Storage 与 data 属性',lead:'localStorage 持久化与 data-* 自定义数据。',tags:['API'],blocks:[
      {t:'code',lang:'HTML',x:'<div id="u" data-user-id="42" data-role="admin">用户</div>\n<script>\n  localStorage.setItem("theme","dark");\n  const t = localStorage.getItem("theme");\n</script>'},
      {t:'p',x:'<code>localStorage</code> 提供约 5MB 的同源持久键值存储（刷新/关页不丢）；<code>sessionStorage</code> 仅会话内有效。任何元素都可加 <code>data-*</code> 属性挂自定义数据，JS 用 <code>element.dataset</code> 读取——比塞进 class 干净。'},
      {t:'note',k:'别存敏感信息',x:'localStorage 明文本地存储、可被任意 JS 读取（含 XSS），<b>绝不</b>存 token、密码等敏感数据。'}
    ]}
  ]},

  /* ================= 第 8 章 ================= */
  {id:'html-8',num:'8',title:'可访问性 a11y',lead:'让所有人（含残障用户）都能使用你的页面。',sections:[
    {id:'html-8-1',num:'8.1',title:'语义结构即无障碍',lead:'正确的标签与 alt 已解决大半问题。',tags:['a11y'],blocks:[
      {t:'p',x:'屏幕阅读器高度依赖 HTML 的语义结构：正确的标题层级、<code>alt</code> 文本、<code>label</code> 关联、<code>lang</code> 属性、<code>main/nav</code> 等 landmark——这些「免费」的可访问性，远胜过事后补救。'},
      {t:'p',x:'几条铁律：图片有 alt；表单控件有 label；颜色不单独承载信息（还要文字/图标）；键盘能走完所有功能；焦点状态可见。'},
      {t:'note',k:'ARIA 是补充不是替代',x:'当原生标签语义不足时（如自定义控件）才用 ARIA 属性（<code>role</code>、<code>aria-*</code>）。能用原生语义标签就别上 ARIA——「No ARIA is better than bad ARIA」。'}
    ]},
    {id:'html-8-2',num:'8.2',title:'焦点、tabindex 与键盘可达',lead:'保证键盘用户能操作一切可交互元素。',tags:['a11y'],blocks:[
      {t:'code',lang:'HTML',x:'<button>可聚焦</button>\n<a href="#x">可聚焦</a>\n<div tabindex="0" role="button">手动让 div 可聚焦</div>'},
      {t:'p',x:'原生按钮、链接、输入天然可聚焦、可被 Tab 遍历。<b>切勿</b>用 <code>div</code> 伪造按钮（除非迫不得已并补上 <code>role</code>、<code>tabindex</code>、键盘事件）。<code>tabindex="-1"</code> 表示可程序聚焦但不在 Tab 序列；<code>0</code> 加入序列。'},
      {t:'note',k:'可见焦点环',x:'永远不要 <code>outline:none</code> 而不提供替代焦点样式——那会让键盘用户「看不见自己在哪」。'}
    ]}
  ]},

  /* ================= 第 9 章 ================= */
  {id:'html-9',num:'9',title:'校验与最佳实践',lead:'写出合法、健壮、可维护的 HTML。',sections:[
    {id:'html-9-1',num:'9.1',title:'用校验器检查',lead:'W3C Validator 与浏览器 DevTools。',tags:['工具'],blocks:[
      {t:'p',x:'浏览器对 HTML 容错极强（标签不闭合也能渲染），但这会掩盖错误。提交前用 <b>W3C Markup Validator</b> 或浏览器 DevTools 的「检查」面板核对：未闭合标签、错误嵌套、缺失 <code>alt</code>、重复 id 等会被标出。'},
      {t:'note',k:'id 全局唯一',x:'同一个页面里 <code>id</code> 必须唯一——锚点跳转、label 关联、JS 选取都依赖它。重复 id 会导致行为错乱。'}
    ]},
    {id:'html-9-2',num:'9.2',title:'常见反模式',lead:'避开这些老习惯。',tags:['实践'],blocks:[
      {t:'table',head:['反模式','更好的做法'],rows:[
        ['用表格做页面布局','用 Flexbox / Grid'],
        ['满屏 div 无语义','用 header/nav/main 等语义标签'],
        ['<code>&lt;br&gt;</code> 撑间距','用 CSS margin/padding'],
        ['<code>onclick=""</code> 内联事件','用 JS addEventListener'],
        ['图片不做 alt','补齐准确 alt 或空 alt'],
        ['行内 style 写满','样式抽到 CSS 文件']
      ]},
      {t:'note',k:'三层分离回顾',x:'所有「表现」交给 CSS、「行为」交给 JS、HTML 只管结构——这是贯穿全教程的纪律，也是校验之外最重要的「好习惯」。'}
    ]}
  ]}
  ]
};
