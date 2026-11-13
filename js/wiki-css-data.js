/* ==========================================================
   CSS 系统教程数据
   标准：CSS3 / CSS Cascading & Inheritance Level（Living Standard）
   章节 1~9，从引入方式到选择器、盒模型、布局、排版、动画、响应式、变量
   ========================================================== */
window.WIKI_CSS = {
  id:'css', num:'戊', en:'COURSE V · CSS',
  title:'CSS',
  lead:'层叠样式表决定网页长什么样。本教程从「CSS 怎么生效」讲起，覆盖选择器、盒模型、Flexbox 与 Grid、定位、字体排版、颜色渐变、过渡动画、响应式设计，最后落到 CSS 变量与现代特性。每节给可复制的样式，编号 1.1 至 9.x。',
  chips:['CSS3','布局+Fx','共 9 章'],
  chapters:[

  /* ================= 第 1 章 ================= */
  {id:'css-1',num:'1',title:'CSS 是什么与引入方式',lead:'选择器 + 声明块，决定元素的外观。',sections:[
    {id:'css-1-1',num:'1.1',title:'CSS 的定位',lead:'把「怎么显示」从 HTML 结构里剥离出来。',tags:['绪论'],blocks:[
      {t:'p',x:'<b>CSS（Cascading Style Sheets）</b>描述 HTML 元素的呈现：颜色、字体、间距、布局、动画。它和 HTML 分工——HTML 说「这是什么」，CSS 说「它长什么样」。这种分离让一份结构可被多套外观复用。'},
      {t:'p',x:'CSS 的基本单位是<b>规则（rule）</b>：<code>选择器 { 属性: 值; }</code>。选择器挑出要装饰的元素，声明块里写一条条「属性:值」。'},
      {t:'note',k:'层叠（Cascade）',x:'名字里的 Cascading 指「层叠」：当多条规则作用于同一元素时，按来源、优先级、特异度、出现顺序决定最终生效值。理解层叠是学好 CSS 的关键。'}
    ]},
    {id:'css-1-2',num:'1.2',title:'三种引入方式',lead:'内联、内部、外部，优先级与可维护性不同。',tags:['基础'],blocks:[
      {t:'table',head:['方式','写法','适用'],rows:[
        ['外部','<code>&lt;link rel="stylesheet" href="a.css"&gt;</code>','生产首选，可缓存、复用'],
        ['内部','<code>&lt;style&gt;…&lt;/style&gt;</code> 写 head','单页临时样式'],
        ['内联','<code>&lt;p style="color:red"&gt;</code>','极个别场景，难维护']
      ]},
      {t:'code',lang:'CSS',x:'.title { color: #2b6cb0; font-size: 1.5rem; }\np { line-height: 1.7; }'},
      {t:'note',k:'优先外部样式表',x:'外部 CSS 可被多页共享、浏览器缓存，是工程标准。内联样式优先级最高却最难维护，尽量不用。'}
    ]},
    {id:'css-1-3',num:'1.3',title:'样式如何生效：特异度',lead:'为什么有的样式「覆盖」了别的样式。',tags:['核心'],blocks:[
      {t:'p',x:'当多条规则冲突，浏览器按<b>特异度（specificity）</b>决定谁赢：内联样式 &gt; ID 选择器 &gt; 类/属性/伪类 &gt; 元素/伪元素。特异度相同则后写的赢。'},
      {t:'code',lang:'CSS',x:'p { color: black; }        /* 特异度 0,0,1 */\n.text { color: blue; }     /* 0,1,0 赢 */\n#lead { color: red; }      /* 1,0,0 最赢 */'},
      {t:'note',k:'少用 ID 选择器',x:'ID 特异度过高，会让后续覆盖异常困难。多用类选择器，必要时用 <code>class</code> 组合来表达状态。'}
    ]}
  ]},

  /* ================= 第 2 章 ================= */
  {id:'css-2',num:'2',title:'选择器',lead:'精准挑出要装饰的元素。',sections:[
    {id:'css-2-1',num:'2.1',title:'基础与组合选择器',lead:'后代、子代、相邻、通用兄弟。',tags:['选择器'],blocks:[
      {t:'table',head:['选择器','含义'],rows:[
        ['<code>.a .b</code>','后代：.a 内所有 .b'],
        ['<code>.a &gt; .b</code>','子代：.a 直接子元素 .b'],
        ['<code>.a + .b</code>','相邻兄弟：紧接 .a 之后的 .b'],
        ['<code>.a ~ .b</code>','通用兄弟：.a 之后的所有 .b'],
        ['<code>.a.b</code>','同时有俩类']
      ]},
      {t:'code',lang:'CSS',x:'nav > ul { list-style: none; }\n.item + .item { margin-left: 8px; }'},
      {t:'note',k:'别写过度嵌套',x:'像 <code>div ul li a span</code> 这种超长选择器特异度高、耦合强、难维护。保持选择器扁平。'}
    ]},
    {id:'css-2-2',num:'2.2',title:'伪类与伪元素',lead:'元素的状态与「虚拟部分」。',tags:['选择器'],blocks:[
      {t:'table',head:['写法','用途'],rows:[
        ['<code>:hover</code>','鼠标悬停'],
        ['<code>:focus</code>','获得焦点（键盘可达）'],
        ['<code>:nth-child(n)</code>','第 n 个子元素'],
        ['<code>::before / ::after</code>','在元素前后插入内容'],
        ['<code>::first-line</code>','首行']
      ]},
      {t:'code',lang:'CSS',x:'a:hover { color: #e53e3e; }\n.btn::after { content: " →"; }\nli:nth-child(odd) { background: #f7fafc; }'},
      {t:'note',k:':: 双冒号',x:'伪元素用双冒号 <code>::</code>（CSS3 规范），伪类用单冒号。旧代码常见 <code>:before</code>，新写请用 <code>::before</code>。'}
    ]},
    {id:'css-2-3',num:'2.3',title:'属性选择器',lead:'按属性或属性值匹配元素。',tags:['选择器'],blocks:[
      {t:'code',lang:'CSS',x:'input[type="text"] { border: 1px solid #ccc; }\n[disabled] { opacity: .5; }\na[href^="https"] { color: #2f855a; }  /* 以 https 开头 */\nimg[alt=""] { outline: 2px solid red; } /* 揪出缺 alt 的图 */'},
      {t:'p',x:'属性选择器支持 <code>^=</code>（开头）、<code>$=</code>（结尾）、<code>*=</code>（包含），非常适合批量处理同类控件或做可访问性检查。'}
    ]}
  ]},

  /* ================= 第 3 章 ================= */
  {id:'css-3',num:'3',title:'盒模型',lead:'每个元素都是一个盒子，理解它才能精确控制间距。',sections:[
    {id:'css-3-1',num:'3.1',title:'content/padding/border/margin',lead:'从内到外的四层结构。',tags:['核心'],blocks:[
      {t:'p',x:'CSS 里每个元素都是盒子，由内到外：<b>content</b>（内容）→ <b>padding</b>（内边距）→ <b>border</b>（边框）→ <b>margin</b>（外边距）。width/height 默认只算 content 区域。'},
      {t:'code',lang:'CSS',x:'.box {\n  width: 200px; padding: 20px; border: 2px solid; margin: 10px;\n  /* 默认总宽 = 200 + 40 + 4 + 20 = 264px */\n}'},
      {t:'note',k:'box-sizing 救星',x:'在全局设置 <code>* { box-sizing: border-box; }</code> 后，width 直接包含 padding 和 border，布局心智负担骤降——这是几乎所有现代项目的第一句 CSS。'}
    ]},
    {id:'css-3-2',num:'3.2',title:'box-sizing 与 margin 坍塌',lead:'两个改变布局直觉的关键现象。',tags:['核心'],blocks:[
      {t:'p',x:'<b>margin 坍塌</b>：相邻块级元素的垂直 margin 不会简单相加，而是取较大值（父子间也可能坍塌）。这常与直觉不符，是常见布局 bug 来源。'},
      {t:'code',lang:'CSS',x:'*, *::before, *::after { box-sizing: border-box; }\n/* 防止父 margin 坍塌到外部：给父元素加 overflow 或 padding/border */\n.parent { overflow: hidden; }'},
      {t:'note',k:'border-box 时代',x:'border-box 下，设 <code>width:100%</code> 再加 padding 也不会溢出父容器——响应式布局因此简单很多。'}
    ]}
  ]},

  /* ================= 第 4 章 ================= */
  {id:'css-4',num:'4',title:'布局：Flexbox 与 Grid',lead:'现代布局的两大支柱。',sections:[
    {id:'css-4-1',num:'4.1',title:'Flexbox 一维布局',lead:'沿一条轴排列子项，做导航栏、居中神器。',tags:['布局'],blocks:[
      {t:'code',lang:'CSS',x:'.nav {\n  display: flex;                 /* 开启弹性容器 */\n  justify-content: space-between; /* 主轴分布 */\n  align-items: center;           /* 交叉轴居中 */\n  gap: 12px;                     /* 子项间距 */\n}\n/* 经典水平垂直居中 */\n.center { display:flex; justify-content:center; align-items:center; }'},
      {t:'p',x:'Flex 主轴默认横向（<code>flex-direction: row</code>），<code>justify-content</code> 管主轴对齐、<code>align-items</code> 管交叉轴。<code>flex: 1</code> 让子项按比例占满剩余空间。'},
      {t:'note',k:'Flex 适合一维',x:'Flex 是「一维」布局（一行或一列）。需要二维（行列同时对齐）用 Grid。'}
    ]},
    {id:'css-4-2',num:'4.2',title:'Grid 二维布局',lead:'行列同时定义，做卡片墙、整页骨架。',tags:['布局'],blocks:[
      {t:'code',lang:'CSS',x:'.grid {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr); /* 三等分列 */\n  gap: 16px;\n}\n.layout {\n  grid-template-areas:\n    "header header"\n    "side   main"\n    "footer footer";\n}'},
      {t:'p',x:'<code>grid-template-columns/rows</code> 定义轨道，<code>fr</code> 是分配剩余空间的单位，<code>repeat()</code> 批量生成，<code>grid-template-areas</code> 用「画图」方式排布区域，直观又易改。'},
      {t:'note',k:'Flex 还是 Grid',x:'组件内一维排列用 Flex；整页骨架、仪表盘、卡片矩阵这种二维场景用 Grid。两者常组合：Grid 排大区，Flex 排区内的小条。'}
    ]},
    {id:'css-4-3',num:'4.3',title:'定位与 z-index',lead:'relative/absolute/fixed/sticky 各管什么。',tags:['布局'],blocks:[
      {t:'table',head:['定位','参照与表现'],rows:[
        ['<code>static</code>','默认，不生效 top/left'],
        ['<code>relative</code>','相对自身偏移，占原位置'],
        ['<code>absolute</code>','相对最近非 static 祖先，脱离文档流'],
        ['<code>fixed</code>','相对视口，滚动不动（弹窗/顶栏）'],
        ['<code>sticky</code>','滚动到阈值前 relative，之后 fixed']
      ]},
      {t:'code',lang:'CSS',x:'.topbar { position: sticky; top: 0; z-index: 100; }\n.modal { position: fixed; inset: 0; z-index: 999; }'},
      {t:'note',k:'z-index 要同层',x:'z-index 只在同一定位上下文里比较；脱离文档流的 absolute/fixed 才受它控制，数值越大越靠上。'}
    ]}
  ]},

  /* ================= 第 5 章 ================= */
  {id:'css-5',num:'5',title:'字体与文本排版',lead:'可读性从排版开始。',sections:[
    {id:'css-5-1',num:'5.1',title:'font 系列属性',lead:'字族、大小、字重、行高。',tags:['排版'],blocks:[
      {t:'code',lang:'CSS',x:'body {\n  font-family: system-ui, "PingFang SC", "Microsoft YaHei", sans-serif;\n  font-size: 16px;\n  line-height: 1.7;       /* 行高用倍数更稳 */\n  font-weight: 400;\n}'},
      {t:'p',x:'<code>font-family</code> 写「字体栈」：前一个是首选，找不到依次降级到系统字体，最后用通用族（<code>sans-serif/serif/monospace</code>）。中文务必在栈里含中文字体。'},
      {t:'note',k:'用 rem/无单位行高',x:'字号优先用 <code>rem</code>（相对根元素）以适配用户缩放；line-height 用无单位数字（如 1.7）让子元素继承比例而非固定值。'}
    ]},
    {id:'css-5-2',num:'5.2',title:'文本控制与对齐',lead:'letter-spacing、文本溢出省略号。',tags:['排版'],blocks:[
      {t:'code',lang:'CSS',x:'.title { letter-spacing: .04em; text-align: center; }\n.ellipsis {\n  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;\n}  /* 单行省略号 */'},
      {t:'p',x:'<code>text-align</code> 控制对齐，<code>text-overflow: ellipsis</code> 配合 <code>nowrap+overflow:hidden</code> 可做单行截断；多行截断用 <code>-webkit-line-clamp</code>。'}
    ]}
  ]},

  /* ================= 第 6 章 ================= */
  {id:'css-6',num:'6',title:'颜色、背景与渐变',lead:'视觉风格的主战场。',sections:[
    {id:'css-6-1',num:'6.1',title:'颜色表示法',lead:'hex、rgb、hsl 与透明度。',tags:['视觉'],blocks:[
      {t:'table',head:['写法','说明'],rows:[
        ['<code>#2b6cb0</code>','十六进制，最常用'],
        ['<code>rgb(43,108,176)</code>','红绿蓝 0-255'],
        ['<code>hsl(207,61%,43%)</code>','色相/饱和/亮度，调色直观'],
        ['<code>rgba(...) / #rrggbbaa</code>','带透明度']
      ]},
      {t:'p',x:'现代推荐 <b>HSL</b>：调色时只改饱和度/亮度而不动色相，配色更可控。透明度用 <code>hsla</code> 或八位 hex（<code>#2b6cb0aa</code>）。'},
      {t:'note',k:'优先用相对色/变量',x:'配合第 9 章的 CSS 变量，把主色存成 <code>--accent</code>，全站换色只改一处。'}
    ]},
    {id:'css-6-2',num:'6.2',title:'background 与渐变',lead:'纯色、图片、线性/径向渐变。',tags:['视觉'],blocks:[
      {t:'code',lang:'CSS',x:'.btn {\n  background: linear-gradient(135deg, #667eea, #764ba2);\n  background: radial-gradient(circle at 30% 30%, #fff, #ddd);\n  background-image: url(bg.png);\n  background-size: cover;          /* 铺满不拉伸变形 */\n}'},
      {t:'p',x:'<code>linear-gradient</code> 沿方向渐变，<code>radial-gradient</code> 从圆心扩散，可做按钮高光、卡片质感、占位背景。<code>background-size: cover/contain</code> 控制图片如何适配容器。'}
    ]}
  ]},

  /* ================= 第 7 章 ================= */
  {id:'css-7',num:'7',title:'过渡与动画',lead:'让状态变化平滑、让元素动起来。',sections:[
    {id:'css-7-1',num:'7.1',title:'transition 过渡',lead:'属性变化加一段补间动画。',tags:['动效'],blocks:[
      {t:'code',lang:'CSS',x:'.btn {\n  background: #3182ce;\n  transition: background .25s ease, transform .15s;\n}\n.btn:hover { background: #2b6cb0; transform: translateY(-2px); }'},
      {t:'p',x:'<code>transition</code> 让属性从旧值平滑变到新值：语法 <code>属性 时长 缓动函数 延迟</code>。只写 <code>all</code> 方便但可能误伤，推荐显式列出属性。'},
      {t:'note',k:'尊重 reduce-motion',x:'对动效敏感的用户可系统级关闭动画。用 <code>@media (prefers-reduced-motion: reduce)</code> 减少/关闭动效，是负责任的设计。'}
    ]},
    {id:'css-7-2',num:'7.2',title:'@keyframes 关键帧动画',lead:'定义多帧序列，循环播放。',tags:['动效'],blocks:[
      {t:'code',lang:'CSS',x:'@keyframes spin { to { transform: rotate(360deg); } }\n.loader {\n  animation: spin 1s linear infinite;\n}\n@keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }'},
      {t:'p',x:'<code>@keyframes</code> 定义从 <code>from</code> 到 <code>to</code>（或任意百分比）的关键帧，<code>animation</code> 简写控制时长、缓动、次数（<code>infinite</code> 循环）、方向。比 transition 更适合复杂、循环或非触发式的动效。'}
    ]}
  ]},

  /* ================= 第 8 章 ================= */
  {id:'css-8',num:'8',title:'响应式设计',lead:'一套样式适配从手机到大屏。',sections:[
    {id:'css-8-1',num:'8.1',title:'视口与媒体查询',lead:'viewport meta + @media 断点。',tags:['响应式'],blocks:[
      {t:'code',lang:'HTML',x:'<meta name="viewport" content="width=device-width, initial-scale=1">'},
      {t:'code',lang:'CSS',x:'@media (max-width: 768px) {\n  .nav { flex-direction: column; }\n  .grid { grid-template-columns: 1fr; }\n}'},
      {t:'p',x:'<code>viewport</code> meta 让移动端按设备宽度渲染（否则会缩放桌面版）。<code>@media</code> 按视口宽度/高度/方向应用不同样式，<code>max-width</code> 表示「不超过此宽时生效」。'},
      {t:'note',k:'移动优先',x:'先写手机样式，再用 <code>min-width</code> 向上叠加大屏样式，比反过来更简洁、性能更好。'}
    ]},
    {id:'css-8-2',num:'8.2',title:'流式单位与 clamp',lead:'让字号与间距随屏幕流动。',tags:['响应式'],blocks:[
      {t:'code',lang:'CSS',x:'.title {\n  font-size: clamp(1.25rem, 4vw, 2rem);  /* 最小~理想~最大 */\n  width: min(90%, 720px);\n}'},
      {t:'p',x:'<code>clamp(min, preferred, max)</code> 让值在区间内随视口伸缩，<code>vw/vh</code> 是视口比例单位，<code>min()/max()</code> 取极值。配合它们能减少断点数量，实现丝滑流式排版。'}
    ]}
  ]},

  /* ================= 第 9 章 ================= */
  {id:'css-9',num:'9',title:'变量与现代特性',lead:'可维护、可主题化的现代 CSS。',sections:[
    {id:'css-9-1',num:'9.1',title:'CSS 自定义属性（变量）',lead:':root 定义，var() 引用，运行时可改。',tags:['现代'],blocks:[
      {t:'code',lang:'CSS',x:':root {\n  --accent: #3182ce;\n  --radius: 12px;\n}\n.btn {\n  background: var(--accent);\n  border-radius: var(--radius);\n}\n[data-theme="dark"] { --accent: #63b3ed; }  /* 轻松换肤 */'},
      {t:'p',x:'<b>自定义属性</b>（以 <code>--</code> 开头）定义在任意元素上，用 <code>var()</code> 引用。它有层叠与继承，可被 JS 读写——是实现主题切换、设计令牌（design token）的基础。'},
      {t:'note',k:'比预处理器变量强在哪',x:'Sass/Less 变量在编译期固定；CSS 变量是运行时的，能随状态/主题/媒体查询动态变化，且能被 JS 直接操作。'}
    ]},
    {id:'css-9-2',num:'9.2',title:'逻辑属性与容器查询',lead:'面向国际化与组件自适应的新能力。',tags:['现代'],blocks:[
      {t:'code',lang:'CSS',x:'.box { margin-inline: auto; padding-block: 1rem; }  /* 不区分左右上下 */\n.card { container-type: inline-size; }\n@container (min-width: 400px) { .card { grid-template-columns: 1fr 1fr; } }'},
      {t:'p',x:'<b>逻辑属性</b>（<code>margin-inline/block</code>、<code>padding-inline</code>）用「行内/块」方向代替 left/right，天然适配 RTL（从右向左）语言。<b>容器查询</b>让组件依据「自身容器宽度」响应，而非整页视口，组件化布局更精准。'},
      {t:'note',k:'浏览器支持',x:'现代浏览器已普遍支持变量、clamp、逻辑属性、容器查询；老旧环境需谨慎并为关键样式提供回退。'}
    ]}
  ]}
  ]
};
