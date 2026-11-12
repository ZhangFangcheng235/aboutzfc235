/* ==========================================================
   C* 语言教程数据
   素材来源：https://github.com/ZhangFangcheng235/C-Asterisk
   （CStar手册.md / 小学版教程 / 初中版教程 / 普高教材必修一 /
     普高选修一 / 高职教程CStar语言基础 / README.md，版本 0.5.1）
   整理归纳，按 章.节 编号
   ========================================================== */
window.WIKI_CSTAR = {
  id:'cstar', num:'甲', en:'COURSE I · C ASTERISK',
  title:'C* 语言',
  lead:'一门「语法像 C、关键字用初中英语词汇」的入门编程语言，源文件后缀 .cask，直接编译成 x86-64 原生可执行文件。本教程依据官方仓库的五套教材与手册整理归纳，按章节编号，便于循序渐进查阅。',
  chips:['版本 0.5.1','官方教材归纳','跨平台'],
  chapters:[

  /* ===== 第 1 章 ===== */
  {id:'cstar-1',num:'1',title:'C* 语言概述',lead:'先弄清它是什么、怎么跑起来、和 C 是什么关系，再决定按哪套教材学。',sections:[
    {id:'cstar-1-1',num:'1.1',title:'C* 是什么',lead:'C*（C Asterisk）是一门教学型编程语言，由本站作者发起，目标是让初学者用最少的英语负担学会 C 风格的程序思维。',tags:['入门'],blocks:[
      {t:'p',x:'<b>C* = 像 C 的骨架 + 看得懂的关键字。</b>大括号、分号、运算符和优先级都与 C 相同；<code>print</code> 打印、<code>show</code> 不换行打印、<code>input</code> 输入、<code>function main()</code> 主程序、<code>int/string/char/bool</code> 类型，<code>and / or / not</code> 等价于 C 的 <code>&& || !</code>。'},
      {t:'p',x:'它还有不少为教学准备的设计：<b>中文变量名</b>（<code>int 苹果 = 3;</code>，文件存 UTF-8）、<b>Excel 同名函数</b>（<code>IF / MOD / SUM / ROUND / LEFT / MID …</code>）、<b>局部变量自动初始化为 0</b>、以及溢出／除零／越界时<b>立刻停下并指出 .cask 出错行</b>。'},
      {t:'code',lang:'C*',x:'// hello.cask —— 最小的 C* 程序\nfunction main() {\n    print "Hello, world!";\n}'},
      {t:'note',k:'版本约定',x:'本教程对应 <b>C* 0.5.1</b>。0.2/0.3 时代的 <code>number/real/text/letter</code>、<code>say/start/func/const/void</code> 都保留为<b>软弃用别名</b>：老程序照样编译，只是带 <code>--diag</code> 检查时给一条不计错的提示。新写程序一律用新名字。'},
      {t:'p',x:'官方仓库：<a href="https://github.com/ZhangFangcheng235/C-Asterisk" target="_blank" rel="noopener" style="color:#4fd6a8">ZhangFangcheng235/C-Asterisk</a>。仓库内 <code>docs/</code> 目录放着手册与五套教材，本教程全部据此归纳。'}
    ]},
    {id:'cstar-1-2',num:'1.2',title:'工具链：.cask → 汇编 → 可执行文件',lead:'理解编译链，才能看懂报错和构建脚本。',tags:['原理'],blocks:[
      {t:'p',x:'编译链是 <code>.cask → x86-64 汇编 → as → ld → 原生可执行文件</code>（Windows 生成 exe，Linux 生成无后缀文件）。<b>全程不调用 C 编译器</b>：链接的是预先构建好的运行时库 <code>libcastrt.a</code>，所以用户机器上只需要 binutils（<code>as</code> / <code>ld</code>）。'},
      {t:'p',x:'<code>compiler/caskc.c</code> 是编译器本体，<code>compiler/asm_backend.inc</code> 是汇编后端，<code>compiler/cask_rt.h</code> 是运行时；<code>.cash</code> 文件是「头文件」，用 <code>use</code> 引入。<code>build.bat</code> / <code>build.sh</code> 负责一次性构建整套工具链（这一步才需要 gcc）。'},
      {t:'table',head:['环节','产物 / 工具','说明'],rows:[
        ['编写','<code>.cask</code> 源文件','UTF-8，可用中文标识符'],
        ['编译','<code>caskc</code> → <code>.s</code>','词法/语法/语义检查，生成 x86-64 汇编'],
        ['汇编','<code>as</code> → <code>.o</code>','binutils，把汇编变成目标文件'],
        ['链接','<code>ld</code> + <code>libcastrt.a</code>','生成原生可执行文件，不依赖 gcc'],
        ['运行','exe / 无后缀程序','窗口程序在 Windows 用 Win32、Linux 用 GTK3']
      ]},
      {t:'note',k:'特点',x:'编译一个小程序约 <b>0.1–0.3 秒</b>（一次 as + 一次 ld）；整数溢出、除零、数组越界、非法移位都会<b>立即停止并报出 .cask 的行号</b>；<code>--fast</code> 可关闭这些检查换取更快速度。'}
    ]},
    {id:'cstar-1-3',num:'1.3',title:'C* 与 C 的关系',lead:'学完 C* 再看 C 几乎无障碍——这是设计目标。',tags:['对照'],blocks:[
      {t:'p',x:'C* 的语句结构、运算符优先级、<code>if/else/while/for/return/break/continue</code>、<code>switch/case/default</code>、数组下标、函数按值传参，都与 C 一致。差别主要在于<b>关键字更口语化、类型更少、多了运行时安全检查</b>。'},
      {t:'table',head:['C*','C（对照）'],rows:[
        ['<code>int</code>','<code>long long</code>（64 位整数）'],
        ['<code>float</code>','<code>double</code>'],
        ['<code>string</code>','<code>char *</code>（不可原地修改）'],
        ['<code>char</code> / <code>bool</code> / <code>none</code>','<code>char</code> / <code>int</code>(0/1) / <code>void</code>'],
        ['<code>print a, b;</code>','<code>printf</code> 自动选格式 + 换行'],
        ['<code>input x;</code>','按行读入并解析'],
        ['<code>function main() { }</code>','<code>int main(void) { … return 0; }</code>'],
        ['<code>constant int N = 5;</code>','<code>#define N (5LL)</code>'],
        ['<code>and or not</code>','<code>&& || !</code>'],
        ['<code>IF(条件, a, b)</code>','<code>(条件) ? (a) : (b)</code>'],
        ['越界 / 溢出','C 里是未定义行为，C* 里立即报错']
      ]},
      {t:'note',k:'提示',x:'本卷同时收录 <a href="#clang" style="color:#4fd6a8"><b>C 语言（C23）全套教程</b></a>，学完 C* 后可以按那条线继续。'}
    ]},
    {id:'cstar-1-4',num:'1.4',title:'官方教材体系导读',lead:'仓库里五套教材面向不同学段，选一本顺着走即可。',tags:['索引'],blocks:[
      {t:'p',x:'五本教材覆盖同一门语言，但深度和例子不同；<b>手册</b>是查阅用的语法总表。下面按由浅入深排列（链接直达仓库文件）：'},
      {t:'ul',items:[
        '<b>小学版教程</b>（18 课 + 附录）：从「让电脑说第一句话」讲起，每课都有例子和练习 — <a href="https://github.com/ZhangFangcheng235/C-Asterisk/blob/main/docs/小学版教程.md" target="_blank" rel="noopener" style="color:#4fd6a8">docs/小学版教程.md</a>',
        '<b>初中版教程</b>（9 单元 + 附录）：语法到函数、数组、常用算法，例子最多 — <a href="https://github.com/ZhangFangcheng235/C-Asterisk/blob/main/docs/初中版教程.md" target="_blank" rel="noopener" style="color:#4fd6a8">docs/初中版教程.md</a>',
        '<b>普高教材必修一</b>（4 章 + 附录）：走进 C*、数据与运算、控制结构、函数与模块化 — <a href="https://github.com/ZhangFangcheng235/C-Asterisk/blob/main/docs/普高教材必修一.md" target="_blank" rel="noopener" style="color:#4fd6a8">docs/普高教材必修一.md</a>',
        '<b>普高选修一</b>（6 章）：数组与字符串、算法初步、模块化、窗口进阶、可靠性 — <a href="https://github.com/ZhangFangcheng235/C-Asterisk/blob/main/docs/普高选修一.md" target="_blank" rel="noopener" style="color:#4fd6a8">docs/普高选修一.md</a>',
        '<b>高职教程 C* 语言基础</b>（13 章 + 6 附录）：最完整，含系统调用、实训与项目交付规范 — <a href="https://github.com/ZhangFangcheng235/C-Asterisk/blob/main/docs/高职教程CStar语言基础.md" target="_blank" rel="noopener" style="color:#4fd6a8">docs/高职教程CStar语言基础.md</a>',
        '<b>C* 使用说明书（手册）</b>（10 节）：语法、关键字总表、C 对照、常见问题 — <a href="https://github.com/ZhangFangcheng235/C-Asterisk/blob/main/docs/CStar手册.md" target="_blank" rel="noopener" style="color:#4fd6a8">docs/CStar手册.md</a>'
      ]},
      {t:'note',k:'本教程的定位',x:'下面 2–8 章是把上面这些教材<b>压缩归纳成的一条速通线</b>：每节给结论、语法骨架和最小示例；想看大量练习、项目实战与彩蛋（<code>rcl()</code>），请回到原教材。'}
    ]}
  ]},

  /* ===== 第 2 章 ===== */
  {id:'cstar-2',num:'2',title:'快速上手',lead:'装好工具链、跑通第一个程序、记住常用命令。',sections:[
    {id:'cstar-2-1',num:'2.1',title:'构建工具链',lead:'Windows 用 build.bat，Linux/macOS 用 build.sh。',tags:['环境'],blocks:[
      {t:'p',x:'<b>构建</b>工具链（只需一次）：Windows 需要 PATH 里有 gcc / g++；Linux 需要 <code>build-essential</code>，若要编译窗口程序再装 <code>pkg-config libgtk-3-dev</code>。'},
      {t:'code',lang:'Bash · Linux / macOS',x:'sudo apt install build-essential pkg-config libgtk-3-dev\n./build.sh                # 生成 bin/caskc、libcastrt.a、头文件与网页编辑器\n./bin/caskc examples/hello.cask --run'},
      {t:'code',lang:'BAT · Windows',x:'build.bat\nbin\\caskc.exe examples\\hello.cask --run\nrun_tests.bat             :: 一键跑回归测试'},
      {t:'p',x:'编译好的程序<b>只需要 binutils</b>（<code>as</code> / <code>ld</code>）加工具链目录里的运行时库即可编译运行，不依赖 gcc。编辑器 C* Studio：Windows 双击 <code>bin\\caskide.exe</code>，Linux 用 <code>bin/caskide.sh</code>（Python 小服务器 + 浏览器，界面完全一致）。'},
      {t:'note',k:'编辑器快捷键',x:'<code>F5</code> 运行 · <code>Esc</code> 停止 · <code>F1</code> 帮助 · 工具栏「代码 / 积木」切换 · 停顿半秒自动跑一遍 <code>--check</code> 把问题列进「问题」面板。'}
    ]},
    {id:'cstar-2-2',num:'2.2',title:'第一个程序：Hello, world!',lead:'程序入口、打印、注释，一次看全。',tags:['示例'],blocks:[
      {t:'code',lang:'C* · hello.cask',x:'// 我的第一个 C* 程序\nfunction main() {\n    print "Hello, world!";\n    print "1 + 2 = ", 1 + 2;\n    show "不换行";\n    show "接在同一行\\n";\n}'},
      {t:'p',x:'要点：<code>function main() { … }</code> 是推荐入口写法（老写法 <code>start { … }</code> 完全等价）；<code>print</code> 可以跟任意多个值，末尾<b>自动换行</b>；<code>show</code> 不换行；注释 <code>//</code> 与 <code>/* */</code> 和 C 完全一样。入口块里可以写 <code>return 整数;</code> 作退出码，不写就是 0。'},
      {t:'note',k:'注意',x:'入口<b>不能带参数</b>，括号里写了东西编译器会提示「<code>function main</code> 不要参数」。'}
    ]},
    {id:'cstar-2-3',num:'2.3',title:'编译器选项速查',lead:'一张表记全 caskc 的开关。',tags:['速查'],blocks:[
      {t:'table',head:['选项','作用'],rows:[
        ['<code>-o 文件名</code>','指定输出可执行文件'],
        ['<code>--run</code>','编译完立刻运行'],
        ['<code>--console</code>','窗口程序里保留控制台（让 print 看得见）'],
        ['<code>--emit-c 文件</code>','只写出生成的 C 代码（调试用；正常编译不产生 C）'],
        ['<code>--keep</code> / <code>-g</code>','保留生成的 .s 汇编文件'],
        ['<code>--fast</code>','关闭溢出 / 除零 / 越界检查（更快，出错行为不再保证）'],
        ['<code>--check</code>','只检查不编译，不留文件；有错退出码非 0'],
        ['<code>--check --diag</code>','按 <code>E</code>严重 / <code>S</code>语法 / <code>P</code>拼写 / <code>H</code>提示 逐条输出'],
        ['<code>-O0..3</code>','保留兼容（优化已内置在汇编后端）'],
        ['<code>-v</code> / <code>-h</code> / <code>--version</code>','显示 as/ld 命令行 / 帮助 / 版本号']
      ]}
    ]},
    {id:'cstar-2-4',num:'2.4',title:'C* Studio：代码与积木双视图',lead:'像 Scratch 一样拖积木，但代码始终是唯一的真身。',tags:['工具'],blocks:[
      {t:'p',x:'编辑器是 VS 深色风格的一页网页，装在原生窗口里（Windows 用 WebView2，Linux 用本机 Python 服务 + 浏览器）。<b>积木视图</b>左侧积木箱共 14 类，拖到画布即改写代码文本，两个视图永远不会不一致。'},
      {t:'ul',items:[
        '<b>十色高亮</b>：代码按分类上色（输出输入 / 变量数据 / 运算 / 判断 / 循环 / 函数 / 字符串与数组 / 窗口程序 / CSS 美化 / 其它），鼠标停在任意词上弹出用法小卡片',
        '<b>头文件门禁</b>：只有程序里 <code>use</code> 了对应 <code>.cash</code> 头文件，「窗口程序 / CSS 美化 / 文件与系统 / 操作系统 / 网络与攻防 / 便携化交互」等积木才出现；没 use 就收着，点它会自动补一行 <code>use</code>',
        '<b>问题分三级 + 提示</b>：严重（跑不起来）、语法（写法不对，一次报多条并自动跳过错处）、拼写（附「是不是想写 ×××」）、提示（不计错），状态栏四个计数实时显示',
        '<b>编码</b>：编辑菜单可把文件在 UTF-8 / GBK 之间互转；中文变量名需要 UTF-8'
      ]}
    ]}
  ]},

  /* ===== 第 3 章 ===== */
  {id:'cstar-3',num:'3',title:'语言基础',lead:'类型、变量、常量、运算符、输入输出——写程序的五块砖。',sections:[
    {id:'cstar-3-1',num:'3.1',title:'五种基本类型',lead:'int / float / string / char / bool，外加 none。',tags:['类型'],blocks:[
      {t:'table',head:['类型','含义','对应 C','取值范围'],rows:[
        ['<code>int</code>','整数','<code>long long</code>','−2⁶³ … 2⁶³−1'],
        ['<code>float</code>','小数','<code>double</code>','约 ±1.8e308'],
        ['<code>string</code>','字符串','<code>char *</code>','不限长度，<b>不能原地修改</b>'],
        ['<code>char</code>','一个字符','<code>char</code>','−128 … 127'],
        ['<code>bool</code>','真假','<code>int</code>','<code>true</code> / <code>false</code>'],
        ['<code>none</code>','无返回值','<code>void</code>','只用于函数类型']
      ]},
      {t:'code',lang:'C*',x:'int n = 42;\nfloat r = 2.5;\nstring s = "hello";\nchar c = \'A\';\nbool ok = true;'},
      {t:'p',x:'字符串用双引号、字符用单引号，支持转义 <code>\\n \\t \\r \\\\ \\" \\&#39; \\0 \\x41 \\101</code>。<code>string</code> 的 <code>+</code> 拼接和比较都返回<b>新字符串</b>，原串不会被改坏；赋值为 <code>char</code> 时会检查数值是否在 −128…127。'},
      {t:'note',k:'老名字',x:'<code>number→int</code>、<code>real→float</code>、<code>text→string</code>、<code>letter→char</code> 是 0.3 时代的软弃用别名，仍能编译。<b>新程序一律用新名字。</b>'}
    ]},
    {id:'cstar-3-2',num:'3.2',title:'变量与常量',lead:'声明、自动初始化、作用域、中文名字。',tags:['数据'],blocks:[
      {t:'code',lang:'C*',x:'int a = 1, b = 2;          // 可逗号连写\nint 苹果 = 3;                // 名字可以用中文（文件存 UTF-8）\nstring 同学 = "小明";        // 未写初值时：数字/布尔为 0，string 为空，数组全 0\nint c;                       // c 自动 = 0\n\nconstant int MAX = 100;      // 也可写 const int MAX = 100;\nconstant float PI = 3.14159;\nint table[ROWS][COLS];       // 数组长度可直接用常量'},
      {t:'ul',items:[
        '声明格式 <code>类型 名字 [= 初值];</code>，<b>局部变量自动初始化</b>，不会读到垃圾值',
        '作用域：块 <code>{ }</code> 内声明的变量出了块就没了，内层可以<b>同名遮蔽</b>外层；全局变量写在入口之外',
        '常量值必须是<b>编译期能算出</b>的表达式（字面量、四则运算、别的常量），函数调用/变量/下标都不行',
        '常量名全程序唯一，且<b>变量不能与常量同名</b>；名字不能与 C 关键字、常用库函数名、<code>cask_</code>/<code>__cask</code> 前缀冲突'
      ]}
    ]},
    {id:'cstar-3-3',num:'3.3',title:'运算符与 IF()',lead:'优先级与 C 相同，但没有三目运算符。',tags:['运算'],blocks:[
      {t:'ul',items:[
        '算术 <code>+ - * / %</code>（整数除法截断，<code>7/2 == 3</code>；除 0 报错）',
        '比较 <code>== != &lt; &lt;= &gt; &gt;=</code>，结果是 <code>bool</code>',
        '逻辑 <code>and or not</code>（别名 <code>&& || !</code>）',
        '位运算 <code>& | ^ ~ &lt;&lt; &gt;&gt;</code>（<code>&lt;&lt;</code> 会检查溢出）',
        '赋值 <code>=</code> 与复合赋值 <code>+= -= *= /= %=</code>、<code>&= |= ^= &lt;&lt;= &gt;&gt;=</code>',
        '自增自减 <code>++ --</code>，前缀后缀都可以'
      ]},
      {t:'code',lang:'C*',x:'int i = 0;\ni++;                              // 1\ni += 10;                          // 11\nstring t = IF(i >= 10, "大", "小"); // 代替 C 的 (条件) ? a : b'},
      {t:'note',k:'为什么没有 ? :',x:'二选一的值统一写成 Excel 式 <code>IF(条件, 真值, 假值)</code>，与 <code>MOD / ROUND / SUM / AVERAGE / MAX / MIN / LEFT / MID / UPPER / TRIM / CONCAT / VALUE</code> 等一整套大写函数一起，方便把表格公式直接搬进程序。'}
    ]},
    {id:'cstar-3-4',num:'3.4',title:'输出与输入',lead:'print / show / input 三件套。',tags:['I/O'],blocks:[
      {t:'code',lang:'C*',x:'print "结果：", x, " 和 ", y;   // 输出各值，最后自动换行\nshow "请输入：";               // 只输出，不换行\ninput 年龄;                    // 读一整行，按变量类型自动解析'},
      {t:'ul',items:[
        '<code>print</code> 后可跟任意多个值（int/float/string/char/bool），自动换行；<code>say</code> 是它的老名字',
        '<code>input</code> <b>每次读一整行</b>：数字行必须是数字否则提示重输，字符串读整行（可含空格），<code>char</code> 取该行第一个非空字符',
        '这样设计后，数字、文字、字符输入挨着写也不会互相吃掉换行'
      ]}
    ]}
  ]},

  /* ===== 第 4 章 ===== */
  {id:'cstar-4',num:'4',title:'流程控制',lead:'分支、循环，以及四种从 C / Python 搬来的常见写法。',sections:[
    {id:'cstar-4-1',num:'4.1',title:'分支：if / else',lead:'条件必须是 bool，数字不能直接当条件。',tags:['分支'],blocks:[
      {t:'code',lang:'C*',x:'if (分数 >= 60) { print "及格"; }\nelse if (分数 >= 80) { print "良好"; }\nelse { print "加油"; }'},
      {t:'note',k:'与 C 的差别',x:'C 里「非 0 即真」，C* 里条件必须是 <code>bool</code> 或比较表达式的结果。想判断整数非零，请显式写 <code>n != 0</code>。'}
    ]},
    {id:'cstar-4-2',num:'4.2',title:'循环：while / for',lead:'三个部分都可省略，break / continue 与 C 相同。',tags:['循环'],blocks:[
      {t:'code',lang:'C*',x:'while (i < 10) { i++; }\n\nfor (int j = 0; j < 10; j++) {\n    if (j % 2 == 0) { continue; }\n    if (j > 7) { break; }\n}\n\nfor (;;) { /* 三个部分都可以省略 */ }'},
      {t:'p',x:'<code>for</code> 第一段允许写多个声明（逗号分隔），循环体内声明的变量在循环外不可见。'}
    ]},
    {id:'cstar-4-3',num:'4.3',title:'do…while 与 until',lead:'两个「至少做一次」的写法，until 与 while 正好相反。',tags:['循环'],blocks:[
      {t:'code',lang:'C*',x:'do {                       // 至少做一次：先做再问\n    print n;\n    n = n + 1;\n} while (n < 3);\n\nuntil (n >= 3) {           // 做到条件成立为止（= while (条件不成立)）\n    n = n + 1;\n}'},
      {t:'note',k:'记法',x:'<code>while(条件)</code> 是「条件成立就继续」；<code>until(条件)</code> 是「条件成立就停」。两者都先执行一次循环体再判断。'}
    ]},
    {id:'cstar-4-4',num:'4.4',title:'foreach 遍历数组',lead:'把一维数组每个元素轮流交给循环变量。',tags:['循环'],blocks:[
      {t:'code',lang:'C*',x:'int scores[3] = {88, 95, 70};\nforeach (s in scores) {\n    print s;\n}'},
      {t:'p',x:'<code>foreach (名字 in 数组)</code> 只支持<b>一维数组</b>，循环里可以直接改元素；两层嵌套可以套着写，每层用自己的名字。'}
    ]},
    {id:'cstar-4-5',num:'4.5',title:'switch 多分支',lead:'一个值对多个「格子」。',tags:['分支'],blocks:[
      {t:'code',lang:'C*',x:'switch (score / 10) {\n    case 10: print "perfect"; break;\n    case 9:  print "great";   break;\n    default: print "keep trying";\n}'},
      {t:'ul',items:[
        '<code>case</code> 后面必须是<b>编译期算得出</b>的常量（字面量、<code>constant</code>、四则运算）',
        '每个 <code>case</code> 末尾写 <code>break;</code> 跳出（<code>return</code> 也算结束）',
        '<code>default:</code> 最多一个，可以省略'
      ]}
    ]}
  ]},

  /* ===== 第 5 章 ===== */
  {id:'cstar-5',num:'5',title:'函数、数组与字符串',lead:'把重复的东西装进函数，把一排数据装进数组。',sections:[
    {id:'cstar-5-1',num:'5.1',title:'自定义函数',lead:'按值传递；所有路径都有返回值。',tags:['函数'],blocks:[
      {t:'code',lang:'C*',x:'int add(int a, int b) {\n    return a + b;\n}\n\nfunction greet(string who) {        // 不返回值的函数\n    print "Hello, ", who, "!";\n}\n\nnone bye(string who) {              // none = C 的 void\n    print "Bye, ", who, "!";\n}\n\nfunction main() {\n    print add(2, 3);\n    greet("world");\n    bye("world");\n}'},
      {t:'ul',items:[
        '返回类型写 <code>none</code> 或用 <code>function</code> 开头都表示不返回值（<code>func</code> 是 <code>function</code> 的简写）',
        '参数<b>按值传递</b>：<code>string</code> 传指针但不可改，<code>int/float/char/bool</code> 复制',
        '<b>可以先用后定义</b>（编译器先整体扫一遍）；递归与 C 一样快',
        '忘写 <code>return</code> 时编译器会在末尾补一个安全的 <code>return 0</code>'
      ]}
    ]},
    {id:'cstar-5-2',num:'5.2',title:'数组',lead:'常量长度、最多 8 维、越界立刻报错。',tags:['数据'],blocks:[
      {t:'code',lang:'C*',x:'int a[5] = {10, 20, 30, 40, 50};\nstring names[3] = {"ann", "bob", "cat"};\nint table[3][4];               // 二维\nint b[4];                      // 自动全 0\n\nfor (int i = 0; i < 5; i++) { print a[i]; }'},
      {t:'note',k:'安全',x:'长度必须是整数或 <code>constant int</code>；<b>下标越界立刻报错并指出文件与行号</b>（<code>--fast</code> 关闭检查）。数组维度最多 8 维，一维数组可整表初始化。'}
    ]},
    {id:'cstar-5-3',num:'5.3',title:'字符串处理',lead:'string 不可原地改，所有运算返回新串。',tags:['字符串'],blocks:[
      {t:'code',lang:'C*',x:'string a = "C*";\nstring b = a + " 语言";      // 拼接，得到新串\nif (a == "C*") { print "一样"; }\nprint LEN(b);                 // 大写内建函数\nprint UPPER("hello");         // HELLO'},
      {t:'p',x:'字符串比较用 <code>== !=</code> 直接比内容；常用处理交给大写内建函数：<code>LEFT / MID / RIGHT / UPPER / LOWER / TRIM / CONCAT / FIND / SUBSTITUTE / REPT / EXACT / CHAR / CODE / VALUE / LEN</code>。'}
    ]},
    {id:'cstar-5-4',num:'5.4',title:'Excel 风格大写内建函数',lead:'会 Excel 就会写——同名同义的一整套函数。',tags:['函数'],blocks:[
      {t:'table',head:['类别','函数'],rows:[
        ['判断与取值','<code>IF(条件, 真值, 假值)</code>'],
        ['数学','<code>MOD</code> <code>ROUND</code> <code>SUM</code> <code>AVERAGE</code> <code>MAX</code> <code>MIN</code> <code>ABS</code> <code>TRUNC</code> <code>LOG10</code>'],
        ['三角与取整','<code>SIN</code> <code>COS</code> <code>TAN</code> <code>ASIN</code> <code>ACOS</code> <code>ATAN</code> <code>ATAN2</code> <code>FLOOR</code> <code>CEILING</code>'],
        ['文本','<code>LEFT</code> <code>MID</code> <code>RIGHT</code> <code>UPPER</code> <code>LOWER</code> <code>TRIM</code> <code>CONCAT</code> <code>VALUE</code> <code>FIND</code> <code>SUBSTITUTE</code> <code>REPT</code> <code>EXACT</code> <code>CHAR</code> <code>CODE</code>']
      ]},
      {t:'p',x:'小写老写法（<code>abs / len / sin …</code>）是软弃用别名，照常编译，检查时提示改用大写。注意 <code>MOD(a,b)</code> 的结果符号跟<b>除数</b>，而 C 的 <code>%</code> 跟被除数。'}
    ]}
  ]},

  /* ===== 第 6 章 ===== */
  {id:'cstar-6',num:'6',title:'头文件与窗口程序',lead:'一行 use 打开一个新世界：窗口、美化、文件、系统。',sections:[
    {id:'cstar-6-1',num:'6.1',title:'use 与 .cash 头文件',lead:'放在文件最前面，头文件里的函数不用声明就能调。',tags:['模块'],blocks:[
      {t:'code',lang:'C*',x:'use "C_OPED.cash";    // 打开窗口 / GUI 世界\nuse "C_CSS.cash";     // 可选的 CSS 式界面美化\nuse "C_IO.cash";      // 文件与系统（控制台程序也能用）\n\nfunction main() {\n    print "文件头必须写在最前面";\n}'},
      {t:'table',head:['头文件','能力'],rows:[
        ['<code>C_OPED.cash</code>','万能窗口头：系统头文件自动包含、窗口库自动链接、内建 GUI 与事件循环'],
        ['<code>C_CSS.cash</code>','<code>cstext / csbg / csfont / csradius / csshadow / cspass / cshide / csshow / cscolor / csapply</code>'],
        ['<code>C_IO.cash</code>','<code>readfile / writefile / appendfile / fileexists / makedir / appdir / envget / launchwait</code>'],
        ['<code>C_OS.cash</code>','<code>os_pid / os_cores / os_ram / os_cpu / os_hostname / os_platform / isadmin / uptime / findproc</code>'],
        ['<code>C_NET.cash</code>','网络与攻防（<b>只做防御层</b>）：<code>isurl / isip / urlhost / urlport / fnv1a / base64 / unbase64 / hostalive</code>'],
        ['<code>C_SC.cash</code>','便携化交互：<code>isportable / copytoexe / freebytes / diskfree / is64bit / portcheck / portscan</code>']
      ]},
      {t:'p',x:'后三个是 <b>0.5.1 新增</b>。积木视图里这些分类也遵循「头文件门禁」：没 <code>use</code> 就不显示。'}
    ]},
    {id:'cstar-6-2',num:'6.2',title:'C_OPED：一行打开窗口',lead:'Windows 生成 Win32 窗口 exe，Linux 生成 GTK3 窗口程序。',tags:['GUI'],blocks:[
      {t:'code',lang:'C*',x:'use "C_OPED.cash";\n\nfunction main() {\n    window w = window("我的窗口", 400, 300);\n    label  l = label(w, "你好，C*！", 20, 20);\n    button b = button(w, "点我", 20, 70);\n    on_click(b, function() { alert("被点了！"); });\n    run(w);\n}'},
      {t:'ul',items:[
        '内建控件：<code>window / label / button / textbox / memo / checkbox / listbox / progress</code>',
        '事件：<code>on_click / on_change / on_close</code>；事件循环 <code>run()</code>',
        '辅助：<code>alert / msgbox / ask / sleep / launch(命令行)</code>（<code>launch</code> 启动外部程序且不等它退出，返回 1 表示成功）',
        '窗口程序默认没有控制台；调试时加 <code>--console</code> 就能看见 <code>print</code>'
      ]},
      {t:'note',k:'跨平台',x:'同一份 .cask 在 Windows 上编成 Win32 窗口程序、Linux 上编成 GTK3 窗口程序；C# 没有 C 头文件，不支持。'}
    ]},
    {id:'cstar-6-3',num:'6.3',title:'C_CSS：给窗口上妆',lead:'颜色写法和 CSS 完全一样。',tags:['GUI'],blocks:[
      {t:'code',lang:'C*',x:'use "C_OPED.cash";\nuse "C_CSS.cash";\n\nfunction main() {\n    window w = window("美化演示", 420, 260);\n    button b = button(w, "确定", 30, 40);\n    csbg(b, "#0e3833");\n    cstext(b, "#f3d98b");\n    csfont(b, 16, 1);\n    csradius(b, 8);\n    csshadow(b, 1);\n    run(w);\n}'},
      {t:'p',x:'颜色写 <code>"#RRGGBB"</code> 或颜色名；<code>cscolor(名字, …)</code> 给样式起名，<code>csapply(控件, 名字)</code> 把它涂到别的控件上。<code>cspass</code> 让输入框密码打码。仓库里的 <code>examples/calc.cask</code> 是一个完整的窗口计算器示例。'}
    ]},
    {id:'cstar-6-4',num:'6.4',title:'C_IO：文件与系统',lead:'0.5.0 新增，控制台程序也能用，不必开窗口。',tags:['文件'],blocks:[
      {t:'code',lang:'C*',x:'use "C_IO.cash";\n\nfunction main() {\n    writefile("note.txt", "第一行\\n");\n    appendfile("note.txt", "第二行\\n");\n    if (fileexists("note.txt")) { print readfile("note.txt"); }\n    print appdir();                 // 本程序所在目录\n    int code = launchwait("notepad");  // 启动并等它跑完，拿退出码\n}'},
      {t:'p',x:'<code>examples/mc_launcher.cask</code>（Minecraft 启动器）是综合示例：自动找 Java、定位 jar、把上次填写的配置记在 exe 旁边，演示 <code>C_IO + C_CSS</code> 组合用法。'}
    ]},
    {id:'cstar-6-5',num:'6.5',title:'0.5.1 新头：OS / NET / SC',lead:'操作系统信息、防御层网络工具、便携化交互。',tags:['0.5.1'],blocks:[
      {t:'code',lang:'C*',x:'use "C_OS.cash";\nuse "C_NET.cash";\nuse "C_SC.cash";\n\nfunction main() {\n    print "CPU 核心数：", os_cores();\n    print "主机名：", os_hostname();\n    if (isurl("https://example.com")) { print urlhost("https://example.com"); }\n    print "是否便携：", isportable();\n    print "剩余空间：", diskfree();\n}'},
      {t:'note',k:'边界',x:'<code>C_NET.cash</code> 明确<b>只做防御层</b>：URL/IP 校验、编码、哈希、只读探测，不做攻击性功能。写工具时请守住这个定位。'}
    ]}
  ]},

  /* ===== 第 7 章 ===== */
  {id:'cstar-7',num:'7',title:'安全机制与调试',lead:'C* 最有教学价值的部分：把 C 里的未定义行为变成看得见的报错。',sections:[
    {id:'cstar-7-1',num:'7.1',title:'运行时检查',lead:'溢出 / 除零 / 越界 / 非法移位，立刻停下并指出行号。',tags:['安全'],blocks:[
      {t:'ul',items:[
        '<b>整数溢出</b>：加减乘、除模、下标访问的溢出检查内联成几条指令',
        '<b>数组越界</b>：下标检查默认开启，报错指出 .cask 文件与行',
        '<b>除零与非法移位</b>：立即停止，不产生未定义行为',
        '<b>自动初始化</b>：局部变量默认为 0，避免读到垃圾值',
        '<b>返回值兜底</b>：忘写 return 时补 <code>return 0</code>'
      ]},
      {t:'code',lang:'C*',x:'int a[3] = {1, 2, 3};\nprint a[5];     // 运行时立刻报错：数组越界，并指出这一行'},
      {t:'p',x:'这些检查在热点循环里也做了内联优化（热整型局部变量放进 <code>rbx/r12–r15</code> 寄存器缓存），十亿次空循环约半秒量级。'}
    ]},
    {id:'cstar-7-2',num:'7.2',title:'四级问题与 --diag',lead:'报错信息全是中文：第几行、哪里不对、该怎么改。',tags:['调试'],blocks:[
      {t:'table',head:['级别','标记','含义'],rows:[
        ['严重','<code>E</code>','跑不起来'],
        ['语法','<code>S</code>','写法不对，可一次报多条并自动跳过错处'],
        ['拼写','<code>P</code>','名字打错了，附「是不是想写 ×××」'],
        ['提示','<code>H</code>','不计错，例如建议把 <code>say</code> 换成 <code>print</code>']
      ]},
      {t:'code',lang:'Bash',x:'bin/caskc demo.cask --check --diag\n# 输出形如： S|3|5|这里要写 \';\'，它给这条声明收尾，但是碰到了 \'print\''},
      {t:'p',x:'编辑器里「问题」面板列出每条，点一条跳到出错行，行号栏标红；状态栏四个计数实时显示。调试顺序建议：先清严重 → 再清语法 → 再看拼写提示 → 最后用打印探针查逻辑错。'}
    ]},
    {id:'cstar-7-3',num:'7.3',title:'--fast 与取舍',lead:'要速度还是要安全，由你决定。',tags:['性能'],blocks:[
      {t:'p',x:'<code>--fast</code> 关闭溢出 / 除零 / 越界检查，速度更快，但<b>出错行为不再保证</b>——这正是 C 语言默认的状态。教学阶段建议一直开着检查，等算法正确、需要压测时再关。'},
      {t:'note',k:'对照 C23',x:'C23 引入了 <code>&lt;stdckdint.h&gt;</code> 的 <code>ckd_add / ckd_sub / ckd_mul</code> 做显式溢出检查，思路和 C* 的自动检查相通。详见 C 语言教程 4.9。'}
    ]}
  ]},

  /* ===== 第 8 章 ===== */
  {id:'cstar-8',num:'8',title:'速查与学习路线',lead:'把手册压成几张表，然后往 C23 走。',sections:[
    {id:'cstar-8-1',num:'8.1',title:'关键字总表',lead:'全部关键字都是初中阶段的英语词。',tags:['速查'],blocks:[
      {t:'table',head:['类别','关键字'],rows:[
        ['程序','<code>function</code> <code>main</code> <code>use</code> <code>constant</code>'],
        ['类型','<code>int</code> <code>float</code> <code>string</code> <code>char</code> <code>bool</code> <code>none</code>'],
        ['输出 / 输入','<code>print</code> <code>show</code> <code>input</code>'],
        ['流程','<code>if</code> <code>else</code> <code>while</code> <code>for</code> <code>do</code> <code>until</code> <code>foreach</code> <code>in</code> <code>switch</code> <code>case</code> <code>default</code> <code>break</code> <code>continue</code> <code>return</code>'],
        ['逻辑','<code>and</code> <code>or</code> <code>not</code> <code>true</code> <code>false</code>']
      ]},
      {t:'p',x:'其余（<code>printf</code>、<code>for</code> 的括号）就是你已经会的 C。大写 Excel 函数是<b>函数名</b>不是关键字，也不能当变量名用。'}
    ]},
    {id:'cstar-8-2',num:'8.2',title:'软弃用别名对照',lead:'老程序不会突然失效。',tags:['速查'],blocks:[
      {t:'table',head:['老写法','新写法'],rows:[
        ['<code>say</code>','<code>print</code>'],
        ['<code>start { … }</code>','<code>function main() { … }</code>'],
        ['<code>func</code> / <code>const</code> / <code>void</code>','<code>function</code> / <code>constant</code> / <code>none</code>'],
        ['<code>number / real / text / letter</code>','<code>int / float / string / char</code>'],
        ['<code>&& || !</code>','<code>and or not</code>']
      ]}
    ]},
    {id:'cstar-8-3',num:'8.3',title:'五套教材怎么选',lead:'按自己的起点挑一条线，不必全读。',tags:['路线'],blocks:[
      {t:'ul',items:[
        '第一次学编程 → <b>小学版</b> 18 课，每课都有例子和练习',
        '想多写代码、练算法 → <b>初中版</b> 9 单元，例子最多',
        '按课程标准走 → <b>普高必修一</b>（4 章）→ <b>普高选修一</b>（6 章，含算法与窗口进阶）',
        '要最全、要项目交付 → <b>高职教程</b> 13 章，含系统调用、综合实训与规范',
        '随时查语法 → <b>CStar手册</b> 第 4 节语言基础、第 7 节 C 对照、第 9 节关键字总表'
      ]}
    ]},
    {id:'cstar-8-4',num:'8.4',title:'从 C* 走向 C23',lead:'骨架已经会了，接下来补上真实世界的 C。',tags:['衔接'],blocks:[
      {t:'p',x:'C* 帮你建立了「变量—运算—分支—循环—函数—数组」的模型，接下来在 <a href="#clang" style="color:#4fd6a8"><b>C 语言（C23）教程</b></a> 里需要补的主要是：指针与地址、手动内存管理、结构体与位域、预处理器、多文件工程、标准库、以及 C23 的 <code>bool/true/false</code>、<code>nullptr</code>、<code>constexpr</code>、<code>typeof</code>、<code>#embed</code> 等新写法。'},
      {t:'note',k:'一个思维转换',x:'C* 里 <code>string</code> 是「不可原地修改的字符串」，越界会报错；C 里 <code>char *</code> 与数组由你自己负责边界，越界是<b>未定义行为</b>。这是从 C* 转 C 时最需要绷紧的一根弦。'}
    ]}
  ]}
  ]
};
