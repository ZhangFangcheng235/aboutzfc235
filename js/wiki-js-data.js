/* ==========================================================
   JavaScript 系统教程数据
   标准：ECMAScript（ES2024 主线），含浏览器/Node 双环境
   章节 1~9，从运行环境到类型、函数闭包、对象原型、DOM、异步
   ========================================================== */
window.WIKI_JS = {
  id:'js', num:'己', en:'COURSE VI · JAVASCRIPT',
  title:'JavaScript',
  lead:'驱动网页交互的脚本语言，如今也跑在服务器（Node.js）与桌面。本教程从「JS 在哪运行、怎么调试」讲起，覆盖类型、运算符、函数与闭包、对象与原型链、数组字符串方法、DOM 与事件，最后落到回调/Promise/async 的异步模型。每节给可运行示例，编号 1.1 至 9.x。',
  chips:['ES2024','单线程+事件循环','共 9 章'],
  chapters:[

  /* ================= 第 1 章 ================= */
  {id:'js-1',num:'1',title:'JavaScript 是什么与运行环境',lead:'一门单线程、事件驱动、弱类型的脚本语言。',sections:[
    {id:'js-1-1',num:'1.1',title:'JS 的定位与历史',lead:'从浏览器脚本到全栈通用语言。',tags:['绪论'],blocks:[
      {t:'p',x:'<b>JavaScript</b> 诞生于 1995 年（Brendan Eich 十天内设计），最初只为给网页加点交互。如今它遵循 <b>ECMAScript</b> 标准，借助 <b>Node.js</b> 登上服务端，借助各种框架登上移动端与桌面端——但核心仍是一门运行在「宿主环境」里的语言。'},
      {t:'p',x:'关键认知：<b>JS 语言 ≠ 浏览器</b>。语言本身只定义语法、类型、标准库（如 <code>Math</code>、<code>JSON</code>、<code>Promise</code>）；而 DOM、<code>fetch</code>、<code>setTimeout</code> 等是宿主（浏览器/Node）提供的。Node 里没有 <code>document</code>，浏览器里没有 <code>require</code>（除非打包器）。'},
      {t:'note',k:'ES 版本',x:'ES6（2015）是分水岭，引入 <code>let/const</code>、箭头函数、类、模块、Promise。<code>&lt;script&gt;</code> 上加 <code>type="module"</code> 即启用 ES Module。'}
    ]},
    {id:'js-1-2',num:'1.2',title:'三种引入与调试',lead:'内联、外链、模块，以及 console 与 DevTools。',tags:['环境'],blocks:[
      {t:'code',lang:'HTML',x:'<script src="app.js"></script>\n<script type="module" src="main.js"></script>  <!-- ES Module -->\n<script>console.log("内联");</script>'},
      {t:'p',x:'调试首选浏览器<b>开发者工具（DevTools）</b>的 Console 与 Sources 面板：<code>console.log/table/warn</code> 输出信息，<code>debugger</code> 语句可下断点，<code>Network</code> 看请求。Node 下用 <code>node script.js</code> 运行、<code>node --inspect</code> 联调。'},
      {t:'note',k:'别用 alert 调试',x:'<code>alert</code> 会阻塞线程且体验差，现代调试都用 <code>console</code> 与断点。'}
    ]}
  ]},

  /* ================= 第 2 章 ================= */
  {id:'js-2',num:'2',title:'变量、类型与字面量',lead:'let/const 取代 var，理解动态类型与相等判断。',sections:[
    {id:'js-2-1',num:'2.1',title:'let / const / var',lead:'块级作用域与不可重复声明。',tags:['基础'],blocks:[
      {t:'code',lang:'JavaScript',x:'let count = 0;       // 可变，块级作用域\nconst PI = 3.14159;   // 不可重新赋值（引用不变）\n// var 函数作用域、可提升、易污染，已不推荐\ncount = 1;           // OK\n// PI = 3;            // 报错：const 不可重赋值'},
      {t:'p',x:'<code>let</code>/<code>const</code> 是块级作用域（<code>{}</code> 内有效），且存在「暂时性死区」（声明前访问会报错）。<code>const</code> 并非「值不可变」而是「绑定不可变」——对象的属性仍可改。'},
      {t:'note',k:'默认用 const',x:'养成习惯：默认 <code>const</code>，确实需要重新赋值时才用 <code>let</code>，几乎不用 <code>var</code>。'}
    ]},
    {id:'js-2-2',num:'2.2',title:'七种数据类型',lead:'原始类型与对象类型的分水岭。',tags:['类型'],blocks:[
      {t:'table',head:['类别','类型'],rows:[
        ['原始（值）','<code>string</code>、<code>number</code>、<code>boolean</code>、<code>null</code>、<code>undefined</code>、<code>symbol</code>、<code>bigint</code>'],
        ['对象（引用）','<code>object</code>（含数组、函数、普通对象）']
      ]},
      {t:'p',x:'原始类型按<b>值</b>比较与传递；对象（含数组）按<b>引用</b>——两个内容相同的对象 <code>===</code> 仍是 false，因为它们是不同的引用。'},
      {t:'code',lang:'JavaScript',x:'typeof "x"        // "string"\ntypeof 42          // "number"\ntypeof null        // "object"（历史 bug！）\ntypeof []          // "object"\nArray.isArray([])  // true（正确判断数组）'},
      {t:'note',k:'number 是双精度',x:'JS 的 <code>number</code> 是 64 位浮点，整数运算也可能丢精度（<code>0.1+0.2!==0.3</code>）。超大整数用 <code>bigint</code>（<code>123n</code>）。'}
    ]},
    {id:'js-2-3',num:'2.3',title:'== 与 === 的坑',lead:'永远优先全等。',tags:['类型'],blocks:[
      {t:'p',x:'<code>==</code> 会做<b>隐式类型转换</b>后比较，导致反直觉结果：<code>0 == ""</code> 为 true、<code>null == undefined</code> 为 true、<code>"5" == 5</code> 为 true。<code>===</code> 严格比较类型与值，<b>一律用 <code>===</code></b>。'},
      {t:'code',lang:'JavaScript',x:'0 == false     // true（危险）\n0 === false    // false\nnull == undefined  // true\nnull === undefined // false'},
      {t:'note',k:'唯一例外',x:'只有需要「同时匹配 null 与 undefined」时才用 <code>== null</code>，否则全程 <code>===</code>。'}
    ]}
  ]},

  /* ================= 第 3 章 ================= */
  {id:'js-3',num:'3',title:'运算符与表达式',lead:'算术、逻辑短路、模板字符串。',sections:[
    {id:'js-3-1',num:'3.1',title:'算术、短路与空值合并',lead:'&& / || 不只是布尔，?? 解决 0/空串误判。',tags:['运算符'],blocks:[
      {t:'p',x:'<code>&&</code> 与 <code>||</code> 返回<b>操作数本身</b>而非布尔，常用于「短路」取值：<code>a || b</code> 取第一个真值，<code>a && b</code> 取第一个假值。'},
      {t:'p',x:'<b>空值合并 <code>??</code></b>只把 <code>null/undefined</code> 当空，区别于 <code>||</code>（把 <code>0</code>、<code>""</code>、<code>false</code> 也当空）。<b>可选链 <code>?.</code></b>在中间值为 null/undefined 时短路返回 undefined，避免层层判空崩溃。'},
      {t:'code',lang:'JavaScript',x:'const name = user?.profile?.name ?? "匿名";\nconst n = input ?? 0;     // 输入为空串 "" 时不会回退到 0（与 || 不同）'},
      {t:'note',k:'?? 与 || 不能混写',x:'<code>a ?? b || c</code> 会语法报错，需加括号：<code>(a ?? b) || c</code>。'}
    ]},
    {id:'js-3-2',num:'3.2',title:'模板字符串',lead:'反引号插值，告别字符串拼接。',tags:['语法糖'],blocks:[
      {t:'code',lang:'JavaScript',x:'const who = "世界";\nconst msg = `你好，${who}！现在是 ${new Date().getFullYear()} 年`;\nconst css = `.btn { color: ${color}; }`;  // 还能跨行'},
      {t:'p',x:'模板字符串用反引号，<code>${expr}</code> 嵌入任意表达式，可多行。它让拼接、生成 HTML/SQL 字符串干净得多。'}
    ]}
  ]},

  /* ================= 第 4 章 ================= */
  {id:'js-4',num:'4',title:'控制流',lead:'条件与循环，以及 ES6 的解构/扩展。',sections:[
    {id:'js-4-1',num:'4.1',title:'if / switch / 三元',lead:'条件分支的三种形态。',tags:['控制流'],blocks:[
      {t:'code',lang:'JavaScript',x:'if (score >= 90) { grade = "A"; }\n  else if (score >= 60) { grade = "B"; }\n  else { grade = "C"; }\n\n// 三元：简单二选一\nconst tip = ok ? "好" : "坏";\n\n// 多值匹配用 switch（注意 break）\nswitch (state) {\n  case "load": load(); break;\n  case "err": fail(); break;\n  default: idle();\n}'},
      {t:'note',k:'别漏 break',x:'<code>switch</code> 的 <code>case</code> 默认「贯穿」到下一个，忘了 <code>break</code> 会执行后续分支——这是经典 bug。'}
    ]},
    {id:'js-4-2',num:'4.2',title:'循环与解构/展开',lead:'for/for-of/for-in 与 ... 运算符。',tags:['控制流'],blocks:[
      {t:'code',lang:'JavaScript',x:'for (let i = 0; i < arr.length; i++) { }   // 经典\nfor (const x of arr) { }                     // 遍历值（数组/字符串/Map）\nfor (const k in obj) { }                      // 遍历键（对象）\n\nconst a = [1, 2]; const b = [...a, 3];        // 展开：b = [1,2,3]\nconst obj2 = { ...obj1, age: 18 };             // 对象展开（浅拷贝）\nconst [x, y, ...rest] = points;                // 数组解构'},
      {t:'p',x:'<b>解构</b>可从数组/对象一次性取出多个值；<b>扩展运算符 <code>...</code></b>可展开或收集。二者配合让拷贝、合并、取参极其简洁。'}
    ]}
  ]},

  /* ================= 第 5 章 ================= */
  {id:'js-5',num:'5',title:'函数与闭包',lead:'函数是一等公民，闭包是 JS 的灵魂。',sections:[
    {id:'js-5-1',num:'5.1',title:'函数声明、表达式与箭头',lead:'箭头函数没有自己的 this，写法更短。',tags:['函数'],blocks:[
      {t:'code',lang:'JavaScript',x:'function add(a, b) { return a + b; }      // 声明，会提升\nconst mul = (a, b) => a * b;                   // 箭头，隐式返回\nconst sq = x => x * x;                          // 单参可省括号\n\n// 默认参数 + 剩余参数\nconst sum = (...nums) => nums.reduce((s, n) => s + n, 0);'},
      {t:'p',x:'箭头函数 <code>(args) => body</code> 比 <code>function</code> 短，且<b>不绑定自己的 <code>this</code></b>——它继承外层 <code>this</code>，特别适合回调，避免 <code>const self = this</code> 的老写法。'},
      {t:'note',k:'箭头不能当方法',x:'箭头函数没有 <code>this</code>/<code>prototype</code>/<code>arguments</code>，不适合用作对象方法或构造函数。'}
    ]},
    {id:'js-5-2',num:'5.2',title:'闭包与 this',lead:'函数记住定义时的作用域；this 随调用方式变。',tags:['核心'],blocks:[
      {t:'p',x:'<b>闭包（closure）</b>：函数能访问其定义时所在词法作用域的变量，即使外层函数已返回。这是模块私有状态、回调捕获上下文、函数工厂的基础。'},
      {t:'code',lang:'JavaScript',x:'function counter() {\n  let n = 0;\n  return () => ++n;          // 闭包记住 n\n}\nconst c = counter();\nc(); c();  // 1, 2 —— n 被保留在闭包里'},
      {t:'p',x:'<b>this</b> 在普通函数里取决于「如何调用」（谁调用指向谁）；箭头函数没有自己的 this，按定义处外层取值。用时务必想清调用方式，必要时用 <code>.bind()</code> 或箭头函数固定。'}
    ]}
  ]},

  /* ================= 第 6 章 ================= */
  {id:'js-6',num:'6',title:'对象与原型链',lead:'JS 的面向对象靠原型而非类（类只是语法糖）。',sections:[
    {id:'js-6-1',num:'6.1',title:'对象、属性与 class',lead:'从字面量到 ES6 class 语法糖。',tags:['对象'],blocks:[
      {t:'code',lang:'JavaScript',x:'const user = { name: "Z", age: 18, say() { return this.name; } };\n\nclass Animal {\n  constructor(name) { this.name = name; }\n  speak() { return `${this.name} 叫`; }\n}\nclass Dog extends Animal {\n  speak() { return `${this.name} 汪`; }   // 重写\n}'},
      {t:'p',x:'对象字面量 <code>{ }</code> 是最常用创建方式。<b>class</b>（ES6）只是基于原型继承的语法糖——底层仍是原型链，并非 Java/C++ 那种类。'},
      {t:'note',k:'属性访问与删除',x:'用 <code>obj.a</code> 或 <code>obj["a"]</code> 访问（后者支持动态键）；<code>delete obj.a</code> 删除属性；<code>in</code> 与 <code>hasOwnProperty</code> 判断存在性。'}
    ]},
    {id:'js-6-2',num:'6.2',title:'原型链',lead:'对象找不到属性时沿 __proto__ 向上找。',tags:['核心'],blocks:[
      {t:'p',x:'每个 JS 对象都有内部链接指向其<b>原型</b>。读取属性时，若自身没有，就沿原型链一层层向上找，直到 <code>null</code>。这就是「继承」的实现：子类实例访问父类方法，靠的是原型链。'},
      {t:'code',lang:'JavaScript',x:'const d = new Dog("旺财");\nd.speak();                 // "旺财 汪"（先找自身，再沿原型链）\nObject.getPrototypeOf(d) === Dog.prototype;  // true\n"toString" in d;           // true（继承自 Object.prototype）'},
      {t:'note',k:'别乱改 prototype',x:'生产代码里避免给内置原型（如 <code>Array.prototype</code>）加方法，会污染所有实例并可能与未来标准冲突。'}
    ]}
  ]},

  /* ================= 第 7 章 ================= */
  {id:'js-7',num:'7',title:'数组与字符串方法',lead:'函数式风格的遍历与处理。',sections:[
    {id:'js-7-1',num:'7.1',title:'数组高阶方法',lead:'map / filter / reduce / find 代替手写循环。',tags:['集合'],blocks:[
      {t:'code',lang:'JavaScript',x:'const nums = [1, 2, 3, 4];\nconst doubled = nums.map(n => n * 2);              // [2,4,6,8]\nconst evens   = nums.filter(n => n % 2 === 0);      // [2,4]\nconst sum     = nums.reduce((s, n) => s + n, 0);    // 10\nconst found   = nums.find(n => n > 2);              // 3'},
      {t:'p',x:'这些<b>高阶函数</b>接收回调函数、返回新数组/值，不修改原数组（不可变风格），链式组合即可表达复杂转换，比 <code>for</code> 循环更可读。'},
      {t:'note',k:'forEach vs map',x:'<code>forEach</code> 用于「执行副作用」（无返回）；要产生新数组用 <code>map</code>。'}
    ]},
    {id:'js-7-2',num:'7.2',title:'字符串常用方法',lead:'slice / split / replace / template。',tags:['集合'],blocks:[
      {t:'code',lang:'JavaScript',x:'"hello".toUpperCase();       // "HELLO"\n"a,b,c".split(",");          // ["a","b","c"]\n"2026-11-13".slice(0,4);      // "2026"\n"hi {name}".replace("{name}", "Z");\n"  trim  ".trim();            // "trim"\n// 现代推荐：includes / startsWith / repeat\n"filename".includes(".js");   // true'},
      {t:'p',x:'字符串在 JS 中不可变：所有方法都返回<b>新字符串</b>。模板字符串（反引号）与 <code>replace</code> 配合正则，是文本处理主力。'}
    ]}
  ]},

  /* ================= 第 8 章 ================= */
  {id:'js-8',num:'8',title:'DOM 操作与事件',lead:'JS 让网页「活」起来的两件事。',sections:[
    {id:'js-8-1',num:'8.1',title:'选取与修改 DOM',lead:'querySelector、textContent、classList。',tags:['DOM'],blocks:[
      {t:'code',lang:'JavaScript',x:'const el = document.querySelector("#app");\nel.textContent = "新文本";           // 改文本（安全）\n// el.innerHTML = "...";           // 可注入 HTML，小心 XSS\nel.classList.add("active");         // 加类\nel.style.color = "red";             // 行内样式\nconst list = document.createElement("li");'},
      {t:'p',x:'<code>document.querySelector/All</code> 用 CSS 选择器取元素。改文本用 <code>textContent</code>（不会被解析为 HTML，安全）；<code>innerHTML</code> 会解析 HTML，<b>拼接用户输入时务必转义</b>，否则 XSS。'},
      {t:'note',k:'classList 优于 className',x:'<code>classList.add/remove/toggle</code> 只动单个类，不会覆盖其它类，比整体重写 <code>className</code> 安全。'}
    ]},
    {id:'js-8-2',num:'8.2',title:'事件与委托',lead:'addEventListener 与事件委托。',tags:['DOM'],blocks:[
      {t:'code',lang:'JavaScript',x:'btn.addEventListener("click", (e) => {\n  console.log("点击了", e.target);\n});\n\n// 事件委托：把子元素的点击统一委托给父级\nlist.addEventListener("click", (e) => {\n  if (e.target.matches("li")) handle(e.target);\n});'},
      {t:'p',x:'<b>事件委托</b>利用事件冒泡：把监听器挂到父容器，通过 <code>e.target</code> 判断实际触发元素。列表项动态增删时不必逐个绑定，性能与可维护性都更好。'},
      {t:'note',k:'e.preventDefault',x:'链接/表单的默认行为（跳转、提交）可用 <code>e.preventDefault()</code> 阻止，常用于 SPA 路由与表单校验。'}
    ]}
  ]},

  /* ================= 第 9 章 ================= */
  {id:'js-9',num:'9',title:'异步编程',lead:'单线程靠事件循环并发，异步模型是 JS 必跨的坎。',sections:[
    {id:'js-9-1',num:'9.1',title:'回调与 Promise',lead:'从金字塔噩梦到链式 then。',tags:['异步'],blocks:[
      {t:'p',x:'JS 是单线程，但能通过「事件循环」实现并发：耗时操作（网络、定时器、IO）不阻塞主线程，完成后再回调。早期用回调，嵌套多了成「回调地狱」。'},
      {t:'code',lang:'JavaScript',x:'// 回调（易嵌套）\ndoA(function(r1){ doB(r1, function(r2){ ... }); });\n\n// Promise：链式，扁平化\nfetch("/api")\n  .then(res => res.json())\n  .then(data => render(data))\n  .catch(err => console.error(err));'},
      {t:'note',k:'Promise 三态',x:'Promise 有 pending/fullfilled/rejected 三态，一旦 settle 不再变。<code>then</code> 处理结果、<code>catch</code> 捕获异常、<code>finally</code> 收尾。'}
    ]},
    {id:'js-9-2',num:'9.2',title:'async/await 与 fetch',lead:'用同步写法写异步，最现代的方式。',tags:['异步'],blocks:[
      {t:'code',lang:'JavaScript',x:'async function load() {\n  try {\n    const res = await fetch("/api/users");   // 等待 Promise\n    const data = await res.json();\n    return data;\n  } catch (e) {\n    console.error("请求失败", e);\n  }\n}'},
      {t:'p',x:'<code>async</code> 函数总是返回 Promise，<code>await</code> 暂停执行直到 Promise 完成——让异步代码读起来像同步，配合 <code>try/catch</code> 处理错误。<code>fetch</code> 是现代浏览器发 HTTP 请求的标准 API。'},
      {t:'note',k:'串行 vs 并行',x:'多个独立请求用 <code>Promise.all([a(), b()])</code> 并行发起，比逐个 await 快；有依赖时才串行 await。'}
    ]}
  ]}
  ]
};
