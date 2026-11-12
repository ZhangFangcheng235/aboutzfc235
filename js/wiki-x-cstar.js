/* ==========================================================
   逐节扩写 · C* 语言 第 1~8 章（cstar-*）
   依据官方仓库教材：手册 / 小学版 / 初中版 / 普高必修一 / 普高选修一 / 高职教程
   ========================================================== */
window.WIKI_X_CSTAR = {

/* ---------------- 第 1 章 ---------------- */
'cstar-1-1': [
  {t:'h',x:'深入：C* 的七条设计目标逐条拆解'},
  {t:'p',x:'官方手册用一张表列出了 C*（读作 "C Asterisk"）的定位：<b>入门友好，但不脱离 C</b>。它不是「简化玩具」，而是在 C 的语法骨架上，换掉难记的关键字、补上运行时安全检查、并加一条直通 Win32 世界的捷径。理解这七条目标，就能理解后面所有语法选择。'},
  {t:'table',head:['目标','具体做法','对初学者的意义'],rows:[
    ['像 C，好迁移','大括号、分号、运算符、<code>if/for/while</code> 全部沿用','学会 C* 之后读 C 代码几乎无门槛'],
    ['关键字看得懂','<code>print</code> 打印、<code>function main()</code> 入口','不必先记 <code>printf</code> 的格式串'],
    ['两种写法','代码视图写 <code>.cask</code>，积木视图拖积木','从图形化平滑过渡到文本编程'],
    ['运行安全','溢出、除零、越界都报错并指出行号','把 C 里最折磨人的 UB 变成可读错误信息'],
    ['整洁易懂','局部变量自动初始化为 0 / 空','不会出现「读到垃圾值」的玄学 bug'],
    ['名字好写','变量名、函数名可用中文（需 UTF-8）','降低母语者的第一道门槛'],
    ['跑得快','直接生成 x86-64 汇编，<code>as</code> + <code>ld</code> 链接原生 exe','不经过 C 编译器，也没有虚拟机开销']
  ]},
  {t:'code',lang:'C* · 官方示例：猜数字',x:`// guess.cask -- 猜数字
function main() {
    int secret = now() % 100 + 1;
    int guess = 0;
    print "我想了一个 1 到 100 的数，猜吧！";
    while (guess != secret) {
        input guess;
        if (guess < secret) { print "小了"; }
        else if (guess > secret) { print "大了"; }
    }
    print "猜对了！";
}`},
  {t:'note',kind:'tip',k:'和 C 最本质的差别',x:'C 把「越界、溢出、除零」定义为未定义行为，交给程序员自己负责；C* 把它们变成<b>带文件名和行号的运行时错误</b>并立刻停止。这不是语法糖，而是语言对「错误」的根本态度不同——也因此 C* 更适合作为第一门系统级语言。'},
  {t:'cards',items:[
    ['适合谁','第一次学编程、想直接做出能双击运行的窗口程序、以后要转 C/C++ 的人'],
    ['不适合谁','需要跨平台生产部署、需要庞大生态库、或已在做底层系统编程的项目'],
    ['版本线索','手册中反复出现的 0.4.2 / 0.5.0 / 0.5.1 是功能分水岭：类型改名在 0.4.2，窗口美化在 0.5.0，OS/NET/SC 三个新头在 0.5.1']
  ]},
  {t:'ex',k:'思考题',items:[
    'C* 为什么要保留 <code>int</code> / <code>float</code> 这些 C 名字，而不是全用中文？',
    '「运行时检查」会带来性能开销，为什么教学语言仍值得默认开启？',
    '如果 C* 生成的是原生 exe 而不是字节码，它对操作系统有什么依赖？'
  ]}
],

'cstar-1-2': [
  {t:'h',x:'深入：从 .cask 到 exe 的完整链路'},
  {t:'p',x:'C* 的编译链路刻意做得很短：<code>.cask</code> 源码经过前端（词法、语法、语义、检查）直接生成 <b>x86-64 汇编</b>，再由系统汇编器 <code>as</code> 生成目标文件、链接器 <code>ld</code> 生成原生可执行文件。中间没有虚拟机、没有字节码，也没有经过 C 编译器——这正是它能「跑得快」又「能直接调系统函数」的原因。'},
  {t:'steps',items:[
    ['前端分析','读取 UTF-8 或 GBK 的 <code>.cask</code>，做词法/语法分析，收集类型、常量、函数表；这一步也负责四级问题诊断（E/S/P/H）。'],
    ['生成汇编','直接产出 x86-64 汇编（<code>.s</code>），并为每条运行时检查记录<b>源文件行号</b>，这样报错才能指回 <code>.cask</code> 而不是汇编。'],
    ['汇编','调用 <code>as</code> 把 <code>.s</code> 变成可重定位目标文件；用 <code>-g</code> 可以保留生成的 <code>.s</code> 供研究。'],
    ['链接','调用 <code>ld</code> 链接成 exe；<code>use "C_OPED.cash"</code> 时会自动带上 user32 / gdi32 / comctl32 等窗口库。']
  ]},
  {t:'code',lang:'Bash · 观察内部执行过程',x:`:: Windows（手册示例）
bin\\caskc.exe hello.cask -v        :: 打印内部 as / ld 命令行
bin\\caskc.exe hello.cask -g        :: 保留生成的 .s 汇编文件
bin\\caskc.exe hello.cask --fast    :: 关掉运行时检查

:: 只检查不编译（适合编辑器 / CI）
bin\\caskc.exe hello.cask --check
bin\\caskc.exe hello.cask --check --diag   :: 机器可读的 P|行|列|信息`},
  {t:'note',kind:'warn',k:'平台限制要记牢',x:'汇编后端是 x86-64，窗口程序依赖 Win32（<code>C_OPED.cash</code> 会生成 <code>WinMain</code>），<b>C# / .NET 用不了</b>——它们没有 C 头文件。手册明确写了这一点。做跨平台部署前先确认目标机器架构与操作系统。'},
  {t:'p',x:'<code>use</code> 头文件会展开成对应的包含与链接配置：<code>use "my_helper.h";</code> 生成 <code>#include "..."</code>，<code>use &lt;stdio.h&gt;;</code> 生成 <code>#include &lt;stdio.h&gt;</code>。进阶用法可以借此直接调 C 库函数，但<b>类型必须自己对得上</b>（例如 C* 的 <code>int</code> 对应 C 的 <code>long long</code>），否则容易踩坑。'},
  {t:'ex',k:'动手练一练',items:[
    '用 <code>-g</code> 编译 hello.cask，打开生成的 <code>.s</code>，找出 <code>print</code> 对应的调用。',
    '用 <code>-v</code> 记录完整的 <code>as</code> / <code>ld</code> 命令行，说明每一步的输入输出。',
    '思考：为什么运行时错误能精确指回 <code>.cask</code> 的行号？编译器需要额外记录什么？'
  ]}
],

'cstar-1-3': [
  {t:'h',x:'深入：C* ↔ C 逐项对照与迁移注意'},
  {t:'p',x:'C* 的官方对照表几乎是「一一映射」，但有几处语义差异必须留意，否则从 C* 转到 C 时会写出隐蔽 bug。最典型的是 <b><code>MOD</code> 与 <code>%</code> 的符号规则不同</b>，以及 <b>C* 的 int 是 64 位</b>。'},
  {t:'table',head:['C*','C（等价写法）','差异提醒'],rows:[
    ['<code>int</code>','<code>long long</code>','C 的 <code>int</code> 通常只有 32 位，别直接照抄'],
    ['<code>float</code>','<code>double</code>','C 的 <code>float</code> 是单精度，名字相同精度不同'],
    ['<code>string</code>','<code>char *</code>','C* 字符串不可原地修改；C 里字面量也不可改'],
    ['<code>bool</code>','<code>int</code>（0/1）','C23 起可用真正的 <code>bool</code>'],
    ['<code>none</code>','<code>void</code>','只用于函数返回类型'],
    ['<code>print a, b;</code>','<code>printf</code> + 自动选格式 + 换行','C 必须自己写格式串，写错就是 UB'],
    ['<code>input x;</code>','按行读入并按类型解析','C 的 <code>scanf</code> 会残留换行，需额外处理'],
    ['<code>and or not</code>','<code>&amp;&amp; || !</code>','完全等价，含短路'],
    ['<code>IF(条件,a,b)</code>','<code>(条件) ? a : b</code>','C* 没有三目运算符'],
    ['<code>MOD(a,b)</code>','<b>不等于</b> C 的 <code>%</code>','<code>MOD(-3,10)==7</code>，C 的 <code>-3%10==-3</code>'],
    ['越界 / 溢出','C 中是未定义行为','C* 报错并指出行号']
  ]},
  {t:'code',lang:'C* · 最容易踩的 MOD 差异',x:`function main() {
    print MOD(-3, 10);      // 7（Excel 语义：结果符号跟除数）
    print -3 % 10;          // -3（C 语义：结果符号跟被除数）
    // 迁移到 C 时，若要 Excel 语义需自己写：
    // int mod(int a, int b) { int r = a % b; return r < 0 ? r + b : r; }
}`},
  {t:'p',x:'另一个差异是<b>条件表达式</b>：C 里「非 0 即真」，<code>if (n)</code> 合法；C* 要求条件必须是 <code>bool</code>，要写 <code>if (n != 0)</code>。这是刻意设计——初学阶段把「数字」和「真假」分开，能避免 <code>if (x = 1)</code> 这类笔误。'},
  {t:'note',kind:'tip',k:'迁移顺序建议',x:'先改类型（<code>int→long long</code>、<code>float→double</code>），再改输出（<code>print→printf</code> 并补格式串），然后补 <code>return 0;</code> 与函数原型，最后逐项处理「C* 帮你做而 C 不帮你做」的检查：数组边界、除零、溢出、初始化。第 8.4 节给了完整清单。'},
  {t:'ex',k:'动手练一练',items:[
    '把猜数字程序改写成 C23，列出你改动的所有位置。',
    '验证 <code>MOD(-3,10)</code> 与 <code>-3%10</code> 的结果，并写出 C 里实现 Excel MOD 的函数。',
    '解释为什么 C* 的 <code>float</code> 对应 C 的 <code>double</code> 而不是 <code>float</code>。'
  ]}
],

'cstar-1-4': [
  {t:'h',x:'深入：五套教材的定位与阅读顺序'},
  {t:'p',x:'官方仓库的 <code>docs/</code> 里放了六份材料：一份完整手册、五套按学段编写的教材。它们<b>不是同一本书的五个版本</b>，而是面向不同起点的五条路径；内容有重叠但深度与项目完全不同。选错教材会觉得「太浅」或「跳太快」。'},
  {t:'table',head:['教材','面向','重点','建议'],rows:[
    ['小学版教程','零基础 / 少儿','认识程序、<code>print</code>、顺序与循环、积木视图','配合积木视图，先建立「指令按顺序执行」的直觉'],
    ['初中版教程','初中起步','变量、类型、分支、函数、数组','主线教材，本卷 1~5 章主要按它的节奏'],
    ['普高教材必修一','高中 / 有代数基础','系统化语法、算法初步、小型控制台项目','想把基础打扎实、准备参加竞赛或会考'],
    ['普高选修一','已学完必修一','进阶内容、综合项目、算法与数据结构','做完整项目时用，课题式组织'],
    ['高职教程 CStar 语言基础','职业教育 / 想快速上手工作','窗口程序、<code>C_OPED/C_CSS/C_IO</code>、OS/NET/SC 三新头','本卷 6 章主要依据它，工程味最浓'],
    ['CStar 手册','所有人 / 查阅','完整语法、全部内建函数、全部控件、安全机制、关键字总表','当参考书，写代码时随查']
  ]},
  {t:'steps',items:[
    ['路径 A · 完全零基础','小学版 → 初中版 → 手册第 4 章 → 普高必修一。每一步都把例题亲手改一遍。'],
    ['路径 B · 已会一门语言','直接读手册第 1、4、9 章（约半小时），然后从高职教程的窗口程序入手做项目。'],
    ['路径 C · 目标是转 C','初中版打底 → 本卷乙部 C23 → 回头看手册第 7 章「C* 与 C 的对照速查」。'],
    ['路径 D · 目标是做工具','手册第 5 章 + 高职教程第 13 章，重点 <code>C_OPED</code> / <code>C_CSS</code> / <code>C_IO</code> 三个头。']
  ]},
  {t:'note',kind:'tip',k:'手册是最好的速查表',x:'手册第 9 章「关键字总表」只有五类、二十来个词，全部是初中英语词汇；第 10 章还讲了在 VS Code 里配置高亮与代码片段。<b>把手册第 4 章与第 9 章打印出来放桌边</b>，写前几周代码会顺很多。'},
  {t:'ex',k:'动手练一练',items:[
    '打开官方仓库 <code>docs/</code>，对比小学版与初中版第 1 章的讲解差异。',
    '从五套教材里各找一个「猜数字」或等价例题，比较它们的写法与讲解深度。',
    '给自己选一条路径，列出前三周每周要读完的章节与要做的练习。'
  ]}
],

/* ---------------- 第 2 章 ---------------- */
'cstar-2-1': [
  {t:'h',x:'深入：目录结构、依赖与首次构建'},
  {t:'p',x:'官方手册第 2 章说明了安装包需要什么、目录怎么摆、以及怎么从源码构建编译器本身。对使用者来说，最实用的信息是 <code>bin/</code> 下的几个可执行文件各自负责什么，以及为什么中文变量名必须存成 UTF-8。'},
  {t:'table',head:['文件 / 目录','作用','备注'],rows:[
    ['<code>bin/caskc.exe</code>','命令行编译器','<code>.cask → .s → .o → exe</code> 的主入口'],
    ['<code>bin/caskide.exe</code>','C* Studio 图形编辑器','可把 <code>.cask</code> 文件名作为参数直接打开'],
    ['<code>bin/web/</code>','编辑器界面网页','本机 127.0.0.1 小服务提供，不连外网'],
    ['<code>bin/*.cash</code>','六套头文件','<code>C_OPED / C_CSS / C_IO / C_OS / C_NET / C_SC</code>'],
    ['<code>examples/</code>','官方示例','<code>hello.cask</code>、<code>win_hello.cask</code>、<code>calc.cask</code> 等'],
    ['<code>docs/</code>','五套教材 + 手册','见 1.4']
  ]},
  {t:'code',lang:'Bash · 首次验证安装',x:`:: 1) 确认编译器可执行
bin\\caskc.exe --version

:: 2) 编译并运行最小程序
bin\\caskc.exe examples\\hello.cask
examples\\hello.exe
:: Hello, world!

:: 3) 只做静态检查，不产生文件
bin\\caskc.exe examples\\hello.cask --check
echo %errorlevel%        :: 0 表示没有问题`},
  {t:'note',kind:'warn',k:'编码是第一个坑',x:'用中文变量名（<code>int 苹果 = 3;</code>）时源文件必须存成 <b>UTF-8</b>，否则编译器会提示「名字里有非 ASCII 字母，文件要存成 UTF-8」。C* Studio 的菜单栏「编辑 → 转成 UTF-8」和工具栏「编码 ▾」就是干这个的；老环境才需要 GBK。'},
  {t:'p',x:'构建编译器本身需要 C/C++ 工具链与汇编器/链接器（<code>as</code> / <code>ld</code>）。如果只是<b>使用</b> C*，装好发布包即可；只有想改编译器、加内建函数或移植平台时才需要从源码构建。这条分界线能省下不少无谓折腾。'},
  {t:'ex',k:'动手练一练',items:[
    '列出你本机 <code>bin/</code> 下的文件，逐个确认用途。',
    '故意把含中文变量名的文件存成 GBK 再编译，记录报错原文。',
    '用 <code>--check</code> 检查 <code>examples/</code> 下全部示例，统计有没有提示（H）。'
  ]}
],

'cstar-2-2': [
  {t:'h',x:'深入：最小程序的每一行与三种入口写法'},
  {t:'p',x:'官方 <code>hello.cask</code> 只有四行，却包含了 C* 最核心的约定：<code>//</code> 注释、<code>function main()</code> 入口、<code>print</code> 自动换行、以及「不写 return 就返回 0」。手册还给了三种等价的入口写法，理解它们能读懂老版本示例代码。'},
  {t:'code',lang:'C* · 三种等价入口',x:`// 推荐写法：一眼看出是主函数
function main() {
    print "Hello, world!";
}

/* 老写法：完全等价（0.2/0.3 时代） */
start {
    print "Hello, world!";
}

// 写成 C 的样子也行，return 的值就是退出码
int main() {
    print "Hello, world!";
    return 3;
}`},
  {t:'table',head:['要素','规则','常见错误'],rows:[
    ['入口','必须有且只有一个；<b>不能带参数</b>','写 <code>function main(int n)</code> 会被提示「不要参数」'],
    ['返回值','不写 <code>return</code> 等价于退出码 0','写 <code>return 3;</code> 则进程退出码为 3'],
    ['注释','<code>// 一行</code> 与 <code>/* 多行 */</code>，与 C 相同','块注释不支持嵌套'],
    ['<code>print</code>','可跟任意多个值，末尾<b>自动换行</b>','想不换行要用 <code>show</code>'],
    ['语句结尾','分号 <code>;</code>','中文全角分号会报语法错']
  ]},
  {t:'p',x:'<code>print "结果：", x, " 和 ", y;</code> 会自动按值的类型挑选输出格式并换行——这替初学者挡掉了 C 里最容易出错的格式串。<code>show</code> 只输出不换行，常用来做输入提示：<code>show "请输入："; input 年龄;</code>。<code>say</code> 是 <code>print</code> 的软弃用老名字，看到老代码不必奇怪。'},
  {t:'note',kind:'tip',k:'先用后定义',x:'C* 编译器会<b>先扫一遍全文</b>再生成代码，所以函数可以先调用后定义（手册明确写了）。这在写「main 在前面、辅助函数在后面」时很方便，不必像 C 那样先写一堆函数原型。'},
  {t:'ex',k:'动手练一练',items:[
    '把 hello.cask 改成打印三个不同类型的值，观察自动格式选择。',
    '分别用三种入口写法编译，比较生成的 exe 退出码。',
    '故意给 main 加一个参数，记录编译器的提示文字。'
  ]}
],

'cstar-2-3': [
  {t:'h',x:'深入：编译选项速查与适用场景'},
  {t:'table',head:['选项','作用','什么时候用'],rows:[
    ['<code>--fast</code>','关闭全部运行时检查','已充分测试、追求极限速度时（见 7.3）'],
    ['<code>-g</code>','保留生成的 <code>.s</code> 汇编文件','想研究编译结果 / 排查后端问题'],
    ['<code>-v</code>','打印内部执行的 <code>as</code> / <code>ld</code> 命令行','链接报错时定位参数'],
    ['<code>--check</code>','只检查不编译，不留任何文件；有问题退出码非 0','编辑器后台、CI、提交前检查'],
    ['<code>--check --diag</code>','机器可读格式，每行 <code>级别|行|列|信息</code>','给编辑器 / 脚本解析'],
    ['<code>--console</code>','窗口程序保留黑色控制台','调试窗口程序时看 print 输出']
  ]},
  {t:'code',lang:'Bash · 日常开发流水线',x:`:: 1) 边写边查（编辑器后台其实就在跑这条）
bin\\caskc.exe app.cask --check --diag

:: 2) 开发期：保留汇编 + 显示链接命令，方便排错
bin\\caskc.exe app.cask -g -v

:: 3) 窗口程序调试：留控制台看调试输出
bin\\caskc.exe win.cask --console

:: 4) 发布前：确认逻辑正确后再考虑关检查
bin\\caskc.exe app.cask --fast`},
  {t:'p',x:'<code>--diag</code> 的输出是给程序读的：每条问题一行，行首一个字母表示级别，之后是行、列、信息。C* Studio 的「问题」面板正是解析这个输出，才能做到点一条就跳到对应行、顶部四个小圆点实时显示各类计数。'},
  {t:'note',kind:'warn',k:'--fast 不是优化开关',x:'它<b>只关闭运行时检查</b>，不会让编译器做更多优化，收益通常很小；代价却是溢出、越界、除零重新变成不可预期的行为。除非已经在开发模式跑完测试且确实需要那一点性能，否则别在发布版随手加 <code>--fast</code>。'},
  {t:'ex',k:'动手练一练',items:[
    '用 <code>--check --diag</code> 检查一段有拼写错误的代码，读出 <code>P|...</code> 那条建议。',
    '对比 <code>-v</code> 输出里窗口程序与普通控制台程序的链接参数差异。',
    '用 <code>--console</code> 编译窗口示例，确认控制台里能看到 <code>print</code>。'
  ]}
],

'cstar-2-4': [
  {t:'h',x:'深入：C* Studio 的双视图与边写边查'},
  {t:'p',x:'C* Studio 是官方图形编辑器，界面按 <b>Visual Studio 2026 深色风格</b>布局：顶部菜单与工具栏、文档标签页、下方停靠的「输出 / 问题」面板、底部蓝色状态栏。它本质是一页网页，但装在一个真正的 Windows 窗口里——程序在本机起了个只认 127.0.0.1 的小服务，把 <code>bin/web/</code> 的页面喂给窗口，<b>不连外网</b>。缺 WebView2 时会退回默认浏览器，功能一样。'},
  {t:'table',head:['操作','快捷键 / 位置','作用'],rows:[
    ['新建 / 打开 / 保存','<code>Ctrl+N / O / S</code>','基本文件操作'],
    ['编译并运行','<code>F5</code>','输出到「输出」面板，结束时显示退出码'],
    ['停止运行','<code>Esc</code>','中断正在跑的程序'],
    ['缩进 / 帮助','<code>Tab</code> / <code>F1</code>','四格缩进 / 快捷键小抄'],
    ['代码 / 积木切换','工具栏','两种视图随时互换'],
    ['格式化','工具栏','自动理清缩进、一句一行'],
    ['编码 ▾','工具栏 / 编辑菜单','转成 UTF-8（推荐）或 GBK'],
    ['跳转到错误行','点「问题」面板某一条','光标直接定位']
  ]},
  {t:'p',x:'<b>边写边查</b>是最贴心的设计：停下打字约半秒，编辑器就在后台跑一次 <code>--check</code>，「问题」面板列出每一条、行号栏标出错误行，顶部四个小圆点实时计数——严重（红）、语法（橙）、拼写（绿）、提示（蓝）。输入时若程序执行到 <code>input</code>，输出面板会出现输入框，打完回车喂给程序。'},
  {t:'cards',items:[
    ['十类积木箱','输出输入 / 变量数据 / 运算 / 判断 / 循环 / 函数 / 字符串与数组 / 窗口程序 等，与语法高亮配色一一对应'],
    ['语法配色','青=输出输入、蓝=变量数据、浅绿=运算、紫粉=判断、黄褐=循环、黄=函数、橙=字符串数组、天蓝=窗口'],
    ['状态栏','文件名（改动亮 ●）、编码、当前行列、四类问题计数、版本号'],
    ['积木视图的意义','拖拽生成的就是合法 <code>.cask</code> 代码，可随时切回代码视图看「积木变成了什么」']
  ]},
  {t:'note',kind:'tip',k:'从积木过渡到代码的方法',x:'先用积木拼出一个能跑的程序，切到代码视图，逐块对照「这块积木对应哪一行代码」。然后试着只改代码里的一个数字再切回去，看积木是否同步变化。这种双向对照比单纯看教程更快建立语法直觉。'},
  {t:'ex',k:'动手练一练',items:[
    '在 Studio 里拼一个「输入两个数求和」的积木程序，切到代码视图逐行对照。',
    '故意打错一个变量名，观察四类计数里哪一盏灯亮、建议是什么。',
    '把含中文变量名的文件从 GBK 转成 UTF-8，比较编译结果。'
  ]}
],

/* ---------------- 第 3 章 ---------------- */
'cstar-3-1': [
  {t:'h',x:'深入：五种基本类型的底层映射与边界'},
  {t:'p',x:'C* 只保留五种数据类型外加一个 <code>none</code>（无返回值）。0.4.2 起类型名统一成 C 的说法：<code>int / float / string / char</code>，旧的 <code>number / real / text / letter</code> 变成<b>软弃用别名</b>——照样能编译，只在 <code>--diag</code> 时给一条 H 提示。'},
  {t:'table',head:['C* 类型','含义','对应 C','取值范围 / 备注'],rows:[
    ['<code>int</code>','整数','<code>long long</code>','−9223372036854775808 … 9223372036854775807'],
    ['<code>float</code>','小数','<code>double</code>','约 ±1.8e308'],
    ['<code>string</code>','字符串','<code>char *</code>','不限长度，<b>不能原地修改</b>'],
    ['<code>char</code>','一个字符','<code>char</code>','−128…127，超出会报运行时错误'],
    ['<code>bool</code>','真假','<code>int</code>','<code>true</code> / <code>false</code>'],
    ['<code>none</code>','无返回值','<code>void</code>','只用于函数类型']
  ]},
  {t:'code',lang:'C* · 类型声明与自动检查',x:`int    n = 42;
float  r = 2.5;
string s = "hello";
char   c = 'A';
bool   ok = true;

function main() {
    string t = s + " world";   // 拼接返回新串，原串不变
    print n, r, s, c, ok, t;

    // char c2 = 999;         // 字面量在编译期就会报范围错
    // int big = 9000000000000000000 * 9;   // 运行时报整数溢出
}`},
  {t:'note',kind:'warn',k:'两个名字相同但含义不同的坑',x:'① C* 的 <code>float</code> 是 C 的 <code>double</code>；② C* 的 <code>int</code> 是 C 的 <code>long long</code>。转 C 时若直接照抄类型名，精度和范围都会变。字符串用双引号、字符用单引号，转义支持 <code>\\n \\t \\r \\\\ \\" \\&#39; \\0 \\x41 \\101</code>。'},
  {t:'p',x:'字符串的所有运算（<code>+</code> 拼接、比较）都返回<b>新的字符串</b>，原串不会被改坏——这从语言层面消除了 C 里 <code>strcpy</code> 越界、缓冲区溢出这一整类问题。代价是频繁拼接会有分配开销，但对教学与小型工具完全够用。'},
  {t:'ex',k:'动手练一练',items:[
    '分别声明五种类型并用 <code>print</code> 输出，观察自动格式选择。',
    '验证 <code>string</code> 拼接后原串不变。',
    '故意把 999 赋给 <code>char</code>，记录编译期报错与运行时报错的区别。'
  ]}
],

'cstar-3-2': [
  {t:'h',x:'深入：变量、常量与命名规则'},
  {t:'p',x:'声明格式 <code>类型 名字 [= 初值];</code>，可用逗号连写；<b>没写初值时自动初始化</b>——数字/布尔为 0，<code>string</code> 为空，数组全 0。这一条直接消灭了 C 里「读未初始化变量」这个最常见的入门 bug。'},
  {t:'code',lang:'C* · 变量、常量与中文命名',x:`// 全局常量：值必须是编译期能算出来的表达式
constant int MAX = 100;
constant float PI = 3.14159;
constant string NAME = "C*";
int table[3][4];                 // 数组长度可直接用常量

function main() {
    int 苹果 = 3, 香蕉 = 5;      // 中文变量名，文件需 UTF-8
    int 未赋值;                  // 自动为 0
    print 苹果 + 香蕉, 未赋值, NAME;

    {
        int 苹果 = 99;           // 内层可以同名遮蔽外层
        print 苹果;              // 99
    }
    print 苹果;                  // 3
}`},
  {t:'table',head:['规则','说明'],rows:[
    ['自动初始化','数字/布尔 0，string 空，数组全 0'],
    ['作用域','块 <code>{ }</code> 内声明，出块即失效'],
    ['遮蔽','内层可声明同名变量覆盖外层'],
    ['全局','写在入口之外，任何函数都能读写'],
    ['常量','<code>constant</code>（可写 <code>const</code>），值须为常量表达式'],
    ['常量唯一性','常量名全程序唯一，且变量不能与常量同名'],
    ['命名冲突','不能与 C 关键字、<code>printf</code> / <code>main</code> 等库函数名、<code>cask_</code> / <code>__cask</code> 前缀冲突']
  ]},
  {t:'p',x:'常量值必须编译期可算：<b>字面量、四则运算、别的常量</b>可以；函数调用、变量、下标不行，错误信息会说明原因。这个限制让常量能安全地用作数组长度——<code>int table[ROWS][COLS];</code>。对比 C：C 里 <code>const int N = 5;</code> 并不是常量表达式，得用 <code>#define</code>、<code>enum</code> 或 C23 的 <code>constexpr</code>。'},
  {t:'note',kind:'tip',k:'中文命名与编码',x:'中文变量名要求源文件存成 UTF-8，否则编译器明确提示。C* Studio 菜单栏「编辑 → 转成 UTF-8（推荐）」可一键转换；给老环境分享代码时才用 GBK。团队项目建议统一 UTF-8 并写进 README。'},
  {t:'ex',k:'动手练一练',items:[
    '声明一个未初始化变量并打印，验证自动为 0。',
    '用 <code>constant</code> 定义数组的行列长度，再试试用变量当长度看报错。',
    '写一个内层遮蔽外层的例子，说明遮蔽与「修改外层」的区别。'
  ]}
],

'cstar-3-3': [
  {t:'h',x:'深入：运算符全集与 IF() 为什么取代三目'},
  {t:'p',x:'C* 的运算符优先级与 C 完全一致，只是逻辑运算多了 <code>and / or / not</code> 这套可读写法（<code>&amp;&amp; || !</code> 仍可用）。最特别的是<b>没有三目运算符 <code>? :</code></b>，改由内建函数 <code>IF(条件, 真值, 假值)</code> 承担，与 Excel 同名同义。'},
  {t:'table',head:['类别','运算符','备注'],rows:[
    ['算术','<code>+ - * / %</code>','整数除法截断（<code>7/2==3</code>），除 0 报错'],
    ['比较','<code>== != &lt; &lt;= &gt; &gt;=</code>','结果是 <code>bool</code>'],
    ['逻辑','<code>and or not</code>（别名 <code>&amp;&amp; || !</code>）','含短路'],
    ['位运算','<code>&amp; | ^ ~ &lt;&lt; &gt;&gt;</code>','<code>&lt;&lt;</code> 会检查溢出'],
    ['赋值','<code>= += -= *= /= %=</code>','还支持 <code>&amp;= |= ^= &lt;&lt;= &gt;&gt;=</code>'],
    ['自增','<code>++ --</code>','前缀后缀都支持'],
    ['三目','<b>无</b>','用 <code>IF()</code> 代替']
  ]},
  {t:'code',lang:'C* · IF() 与二选一',x:`function main() {
    int i = 0;
    i++;                     // 1
    i += 10;                 // 11
    string t = IF(i >= 10, "大", "小");
    print t;                 // 大

    // IF 只计算用到的那一边，和 C 的 ?: 一样安全
    int d = 0;
    string s = IF(d != 0, 100 / d, 0);   // 不会除零
    print s;

    // 数字不能直接当条件，要显式比较
    if (i != 0) { print "非零"; }
}`},
  {t:'note',kind:'warn',k:'条件必须是 bool',x:'C 里 <code>if (n)</code> 合法（非 0 即真），C* 里不行——条件必须是 <code>bool</code> 或比较结果，要写 <code>if (n != 0)</code>。这条规则把「数字」与「真假」分开，也顺带消灭了 <code>if (x = 1)</code> 这类赋值笔误。'},
  {t:'p',x:'<code>IF()</code> 属于 Excel 风格大写内建函数族，同族还有 <code>AND OR NOT TRUE() FALSE()</code>。把 Excel 表格里的公式直接搬进程序是官方明确鼓励的用法——对已经会做表格的人来说，这比学 <code>? :</code> 直观得多（详见 5.4）。'},
  {t:'ex',k:'动手练一练',items:[
    '验证 <code>7/2</code>、<code>MOD(-3,10)</code>、<code>-3%10</code> 三个结果。',
    '写一个「成绩 → 等级」的 <code>IF()</code> 嵌套，并说明只算用到的一边为什么重要。',
    '把 <code>if (i)</code> 改成合法写法，观察编译器提示。'
  ]}
],

'cstar-3-4': [
  {t:'h',x:'深入：print / show / input 的设计取舍'},
  {t:'p',x:'输入输出是入门语言最该省事的地方。C* 用三条语句替代了 C 里格式串、缓冲区、换行残留这一整套麻烦：<code>print</code> 自动选格式并换行、<code>show</code> 只输出不换行、<code>input</code> <b>每次读一整行</b>并按目标类型解析。'},
  {t:'table',head:['语句','行为','典型用途'],rows:[
    ['<code>print a, b, c;</code>','输出任意多个值，<b>自动换行</b>','结果输出'],
    ['<code>show "提示：";</code>','输出但<b>不换行</b>','输入提示、同行排版'],
    ['<code>input 变量;</code>','读一整行，按类型解析；数字行不合法会提示重输','读取用户输入'],
    ['<code>say</code>','<code>print</code> 的软弃用老名字','读老代码时认识即可'],
    ['<code>char</code> 输入','取该行第一个非空字符','单字符交互']
  ]},
  {t:'code',lang:'C* · 完整的输入交互',x:`function main() {
    int 年龄;
    string 姓名;
    char 首字母;

    show "请输入姓名：";
    input 姓名;                 // 读整行，可含空格
    show "请输入年龄：";
    input 年龄;                 // 读到非数字会提示重输
    show "请输入首字母：";
    input 首字母;               // 取该行第一个非空字符

    print "你好，", 姓名, "！";
    print 年龄, " 岁，首字母 ", 首字母;
}`},
  {t:'p',x:'<code>input</code> 按行读取的设计，专门解决 C 里 <code>scanf("%d")</code> 留下换行、接着 <code>fgets</code> 读到空行的经典问题：<b>数字、文字、字符输入挨着写也不会互相吃掉换行</b>。这是官方文档明确写出的设计动机。'},
  {t:'note',kind:'tip',k:'对比 C 的迁移要点',x:'转到 C 时，<code>print a, b;</code> 要拆成带格式串的 <code>printf</code>（C* 的 int 是 <code>long long</code>，用 <code>%lld</code>），<code>input</code> 要用 <code>fgets</code> + <code>sscanf</code> 并自己处理换行与错误重输。C23 乙部 1.8 有安全写法对照。'},
  {t:'ex',k:'动手练一练',items:[
    '写一个「输入三个数求平均」的程序，用 <code>show</code> 让提示停在同一行。',
    '故意在数字输入处敲字母，观察提示重输的行为。',
    '把上面的交互程序改写成 C23，列出所有需要自己处理的细节。'
  ]}
],

/* ---------------- 第 4 章 ---------------- */
'cstar-4-1': [
  {t:'h',x:'深入：分支的条件类型与 else if 顺序'},
  {t:'code',lang:'C* · 分支写法与常见顺序陷阱',x:`function main() {
    int 分数 = 85;

    // 注意：手册示例里 else if 的顺序会决定结果，写判断要从严到宽
    if (分数 >= 90) { print "优秀"; }
    else if (分数 >= 80) { print "良好"; }
    else if (分数 >= 60) { print "及格"; }
    else { print "加油"; }

    // 条件必须是 bool / 比较结果
    int n = 3;
    if (n != 0 and 分数 > 60) { print "有效成绩"; }
    if (not (分数 < 0)) { print "非负"; }
}`},
  {t:'p',x:'分支的三条规则：① 条件必须是 <code>bool</code> 或比较结果，数字不能直接当条件；② <code>else if</code> 按<b>从上到下</b>匹配，第一个成立就执行并跳出整条链，所以多区间判断要<b>从严到宽</b>排列；③ 逻辑运算用 <code>and / or / not</code>，含短路，与 C 的 <code>&amp;&amp; || !</code> 一致。'},
  {t:'table',head:['C* 写法','C 写法','说明'],rows:[
    ['<code>and</code>','<code>&amp;&amp;</code>','短路与'],
    ['<code>or</code>','<code>||</code>','短路或'],
    ['<code>not</code>','<code>!</code>','逻辑非'],
    ['<code>if (n != 0)</code>','<code>if (n)</code>','C* 要求显式比较'],
    ['<code>IF(c,a,b)</code>','<code>c ? a : b</code>','表达式级的二选一']
  ]},
  {t:'note',kind:'warn',k:'区间判断的经典 bug',x:'手册示例里出现过 <code>if (分数 &gt;= 60) ... else if (分数 &gt;= 80)</code> 这种顺序：85 分会先落进「及格」而永远到不了「良好」。写多分支时把最严格的条件放最前面，或改用互斥区间 <code>分数 &gt;= 80 and 分数 &lt; 90</code>。'},
  {t:'ex',k:'动手练一练',items:[
    '把成绩分级改成互斥区间写法，用 59/60/79/80/89/90 六个边界值测试。',
    '写一个判断闰年的分支（能被 4 整除且不能被 100 整除，或能被 400 整除）。',
    '用 <code>IF()</code> 表达式重写上面的成绩分级，比较可读性。'
  ]}
],

'cstar-4-2': [
  {t:'h',x:'深入：循环四件套与控制流'},
  {t:'code',lang:'C* · while / for / break / continue',x:`function main() {
    int i = 0;
    while (i < 10) { i++; }              // 条件驱动

    // for 三段都可省略，第一段允许逗号分隔多个声明
    for (int j = 0, k = 10; j < 10; j++) {
        if (j % 2 == 0) { continue; }   // 跳过偶数
        if (j > 7) { break; }           // 提前结束
        print j;
    }

    // 无限循环 + break 的惯用写法
    for (;;) {
        int v = 0;
        input v;
        if (v < 0) { break; }
        print "读到 ", v;
    }
}`},
  {t:'table',head:['循环','适用','要点'],rows:[
    ['<code>while (c) {...}</code>','次数未知、条件驱动','先判断再执行，可能一次都不做'],
    ['<code>for (init;c;step)</code>','次数已知','三段都可省；init 可写多个声明'],
    ['<code>do {...} while (c);</code>','至少执行一次','先做后问，见 4.3'],
    ['<code>until (c) {...}</code>','做到条件成立为止','与 while 相反，见 4.3'],
    ['<code>foreach (x in a)</code>','遍历一维数组','见 4.4'],
    ['<code>break / continue</code>','跳出 / 跳过本轮','与 C 相同']
  ]},
  {t:'p',x:'循环体里所有下标来自用户输入或计算时，C* 的<b>数组越界运行时检查</b>会兜底报错并指出行号——这是相对 C 最大的安全网。不过「死循环」检查不了：写完循环先自问「哪一行让条件趋近为假」，尤其是 <code>continue</code> 之前的步进语句有没有被跳过。'},
  {t:'note',kind:'tip',k:'与 C 的差别很小',x:'循环语法几乎就是 C，唯一要注意的是<b>条件必须是 bool</b>（<code>while (n)</code> 要写成 <code>while (n != 0)</code>）。所以学会 C* 的循环，转 C 时几乎不用重新学，只需补上「非 0 即真」这个更宽松的规则。'},
  {t:'ex',k:'动手练一练',items:[
    '用 <code>for</code> 打印 1..100 中能被 3 或 5 整除的数，并统计个数。',
    '写一个「输入直到合法为止」的循环，用 <code>break</code> 退出。',
    '故意让 <code>continue</code> 跳过步进语句，观察死循环并用 Esc 中断。'
  ]}
],

'cstar-4-3': [
  {t:'h',x:'深入：do…while 与 until 的语义对照'},
  {t:'p',x:'这两种循环是 0.3 版从 C / Python 搬来的补充写法，<b>都至少执行一次</b>。<code>do…while(条件)</code> 是「条件成立就继续」，<code>until(条件)</code> 是「条件成立就停」——正好相反，也正因如此它们常被初学者弄混。'},
  {t:'code',lang:'C* · 三种等价写法对照',x:`function main() {
    int n = 0;

    // A) do…while：先做再问，条件成立继续
    do {
        print "A:", n;
        n = n + 1;
    } while (n < 3);

    // B) until：条件成立就停（等价于 while (not 条件)）
    n = 0;
    until (n >= 3) {
        print "B:", n;
        n = n + 1;
    }

    // C) 标准 while：先判断
    n = 0;
    while (n < 3) {
        print "C:", n;
        n = n + 1;
    }
}`},
  {t:'table',head:['写法','判断时机','继续条件','至少执行一次'],rows:[
    ['<code>while (c)</code>','先判断','<code>c</code> 为真','否'],
    ['<code>do {...} while (c)</code>','后判断','<code>c</code> 为真','是'],
    ['<code>until (c)</code>','后判断','<code>c</code> 为假','是'],
    ['<code>for (;;)</code> + break','手动控制','自定义','视 break 位置']
  ]},
  {t:'note',kind:'tip',k:'怎么选',x:'菜单、重试、校验输入这类「<b>总得先问一次</b>」的场景用 <code>do…while</code> 或 <code>until</code>；普通计数用 <code>for</code>；条件驱动用 <code>while</code>。<code>until</code> 在表达「一直做到成功为止」时最自然：<code>until (ok) { ... }</code>。'},
  {t:'ex',k:'动手练一练',items:[
    '把上面的三段代码分别跑一遍，确认输出都是 0 1 2。',
    '用 <code>until</code> 写一个「反复输入直到密码正确」的循环。',
    '把 <code>until (n &gt;= 3)</code> 改写成等价的 <code>while</code>，说明 <code>not</code> 的位置。'
  ]}
],

'cstar-4-4': [
  {t:'h',x:'深入：foreach 的能力边界与嵌套'},
  {t:'p',x:'<code>foreach (名字 in 数组)</code> 把一维数组的元素轮流交给循环变量，且<b>循环里可以直接改元素</b>。它省掉了下标变量，也让「越界」这件事在语法层面不再可能发生——但只支持一维数组，多维要嵌套。'},
  {t:'code',lang:'C* · foreach 遍历与就地修改',x:`function main() {
    int scores[5] = {60, 72, 88, 95, 43};

    foreach (s in scores) {
        print s;                 // 依次输出 60 72 88 95 43
    }

    // 循环里可以直接改元素（不是副本）
    foreach (s in scores) {
        s = s + 5;               // 加分
    }
    foreach (s in scores) { print s; }

    // 多维数组用嵌套 foreach
    int table[2][3];
    foreach (row in table) {
        foreach (cell in row) { cell = 1; }
    }
    print table[1][2];           // 1
}`},
  {t:'table',head:['特性','说明'],rows:[
    ['适用范围','<b>只支持一维数组</b>；多维需嵌套，每层用自己的名字'],
    ['元素可写','循环变量是元素本身，赋值会写回数组'],
    ['无需下标','不用声明 <code>int i</code>，也就不会越界'],
    ['与 C 对照','C23 没有 foreach，得写 <code>for (size_t i=0; i&lt;n; ++i)</code>'],
    ['与 C++ 对照','类似 <code>for (auto&amp; x : arr)</code> 的引用遍历']
  ]},
  {t:'note',kind:'warn',k:'需要下标时别硬用 foreach',x:'如果逻辑里要用到「第几个」（比如同时输出名次、或访问相邻元素），老老实实用 <code>for</code> + 下标更清楚。C* 的下标越界有运行时检查兜底，不必为了安全硬套 <code>foreach</code>。'},
  {t:'ex',k:'动手练一练',items:[
    '用 <code>foreach</code> 求数组的总和与最大值（可用 <code>SUM</code> / <code>MAX</code> 对照）。',
    '写一个嵌套 <code>foreach</code> 给二维数组全部赋同一个值。',
    '把 <code>foreach</code> 版本改写成 C23 的下标循环，对比两版代码量。'
  ]}
],

'cstar-4-5': [
  {t:'h',x:'深入：switch 的常量 case 与 break 规则'},
  {t:'code',lang:'C* · switch 多分支',x:`function main() {
    int score = 95;
    switch (score / 10) {
        case 10: print "perfect"; break;
        case 9:  print "great";   break;
        case 8:  print "good";    break;
        default: print "keep trying";
    }

    // case 后面可以是常量表达式
    constant int BASE = 6;
    switch (score / 10) {
        case BASE + 2: print "八十分段"; break;
        default:       print "其他";
    }
}`},
  {t:'table',head:['规则','说明'],rows:[
    ['case 值','必须是<b>编译期可算</b>：字面量、<code>constant</code>、四则运算'],
    ['结束分支','每个 case 末尾写 <code>break;</code>，<code>return</code> 也算结束'],
    ['default','最多一个，可省略；建议始终写上'],
    ['表达式类型','整数类（<code>int</code> / <code>char</code> 等）'],
    ['与 C 差异','C 允许「故意贯穿」，C* 更强调显式 break，减少误写']
  ]},
  {t:'p',x:'<code>switch</code> 适合「一个值对多个格子」的分派；若条件是区间（如成绩 ≥ 80），用 <code>if/else if</code> 更自然。注意 <code>score / 10</code> 是整数除法，95 → 9，100 → 10，所以满分要单独一个 <code>case 10</code>——这是教材示例里特意留的细节。'},
  {t:'note',kind:'tip',k:'和 C23 属性对照',x:'C 里忘写 <code>break</code> 会静默贯穿，C23 可以用 <code>[[fallthrough]]</code> 明确标注「我是故意的」；C* 则要求每个 case 显式结束。两者思路一致：<b>让「贯穿」成为需要明说的例外，而不是默认值</b>。'},
  {t:'ex',k:'动手练一练',items:[
    '用 <code>switch</code> 把 1~12 映射到四个季度，记得写 <code>default</code>。',
    '把 <code>case</code> 改成一个变量，观察编译期报错。',
    '对比同一逻辑用 <code>if/else if</code> 与 <code>switch</code> 的可读性。'
  ]}
],

/* ---------------- 第 5 章 ---------------- */
'cstar-5-1': [
  {t:'h',x:'深入：函数声明、按值传递与返回值保证'},
  {t:'code',lang:'C* · 函数的三种写法',x:`// 有返回值：写类型
int add(int a, int b) {
    return a + b;
}

// 无返回值：可以写 function 开头
function greet(string who) {
    print "Hello, ", who, "!";
}

// 也可以像 C 一样写 none（= void）
none bye(string who) {
    print "Bye, ", who, "!";
}

// 可以先用后定义（编译器会先扫一遍全文）
function main() {
    print add(2, 3);
    greet("world");
    bye("world");
}`},
  {t:'table',head:['要素','规则','与 C 的差异'],rows:[
    ['返回类型','写类型 / <code>function</code> / <code>none</code>','<code>none</code> 对应 C 的 <code>void</code>'],
    ['简写','<code>func</code> 是 <code>function</code> 的简写','C 无此写法'],
    ['参数传递','<b>按值</b>：<code>string</code> 传指针但不可改，其余复制','与 C 一致'],
    ['返回值','所有路径都要 return；忘了写编译器<b>补一个安全的 return 0</b>','C 里漏返回是 UB'],
    ['定义顺序','可以先调用后定义','C 需要先声明原型'],
    ['递归','支持，和 C 一样快','手册举例 <code>fib(20)</code> 秒出']
  ]},
  {t:'p',x:'「忘写 return 时编译器补一个安全的 <code>return 0</code>」是很能代表 C* 哲学的设计：C 里非 void 函数漏返回是未定义行为，可能返回栈上的垃圾；C* 宁可替你补一个确定的值，也不让初学者撞上玄学结果。'},
  {t:'note',kind:'warn',k:'string 参数不可改',x:'<code>string</code> 是按值传指针但内容不可原地修改。想「改完拿回来」要返回新串：<code>string upper(string s) { return ...; }</code>，调用处写 <code>s = upper(s);</code>。这点和 C 里 <code>char*</code> 可以乱写完全不同，也更安全。'},
  {t:'ex',k:'动手练一练',items:[
    '写一个 <code>int fact(int n)</code> 递归阶乘，并测试 <code>fact(20)</code> 的耗时。',
    '写一个返回新字符串的函数（拼接前缀），验证原串不变。',
    '把 main 放在文件最前面、函数定义在后面，确认「先用后定义」可行。'
  ]}
],

'cstar-5-2': [
  {t:'h',x:'深入：数组维度、初始化与越界检查'},
  {t:'code',lang:'C* · 数组声明与整表初始化',x:`function main() {
    int a[5] = {10, 20, 30, 40, 50};
    string names[3] = {"ann", "bob", "cat"};
    int table[3][4];          // 二维，自动全 0
    int b[4];                 // 自动全 0

    for (int i = 0; i < 5; i++) { print a[i]; }
    foreach (nm in names) { print nm; }
    print table[2][3], b[0];  // 0 0

    // a[5] = 1;   // 运行时错误：数组下标越界，并指出 文件:行
}`},
  {t:'table',head:['规则','说明'],rows:[
    ['长度','必须是整数或 <code>constant int</code>'],
    ['维度','每维最多 8 维'],
    ['初始化','一维可整表 <code>= {…}</code>；不写初值则<b>全 0</b>'],
    ['越界','下标 <code>&lt;0</code> 或 <code>&gt;=长度</code> 立刻报错，带文件名和行号'],
    ['<code>--fast</code>','关闭上述检查后，越界行为不再保证'],
    ['遍历','<code>for</code> + 下标，或一维用 <code>foreach</code>']
  ]},
  {t:'p',x:'越界检查是 C* 相对 C 最有价值的一层保护。手册说明：汇编后端为每条检查记录了<b>源码行号</b>，所以错误信息指向的是 <code>.cask</code> 文件而不是生成的汇编。对比 C 里数组越界属于未定义行为，常常「看起来正常」直到优化等级改变才暴露。'},
  {t:'note',kind:'tip',k:'迁移到 C 时',x:'C 里数组长度用 <code>size_t</code>，遍历写半开区间 <code>for (size_t i=0; i&lt;n; ++i)</code>；所有来自输入的下标都要显式 <code>if (i &lt; n)</code> 判断，并用 ASan 兜底（见 C23 乙部 6.4）。C* 帮你做的这一层，转 C 后必须自己补上。'},
  {t:'ex',k:'动手练一练',items:[
    '故意访问 <code>a[5]</code>，记录完整的运行时错误信息格式。',
    '用 <code>constant int</code> 定义二维数组的行列并整表初始化。',
    '把 <code>--fast</code> 打开后再越界一次，对比行为差异（见 7.3）。'
  ]}
],

'cstar-5-3': [
  {t:'h',x:'深入：字符串不可变与常用处理函数'},
  {t:'p',x:'C* 的 <code>string</code> 是不可原地修改的：所有运算（<code>+</code> 拼接、比较）都返回<b>新串</b>。因此 C 里 <code>strcpy/strcat</code> 的缓冲区溢出、缺 NUL 结尾、内存重叠这一整类问题，在 C* 里从语言层面消失了。需要处理文本时用内建函数，而不是自己操作字符数组。'},
  {t:'table',head:['函数','作用','示例 / 返回'],rows:[
    ['<code>LEN(文字)</code>','长度（字节数）','<code>LEN("abc")==3</code>'],
    ['<code>at(文字, i)</code>','第 i 个字符（越界报错）','小写 <code>at</code> 保留为规范名'],
    ['<code>LEFT / RIGHT / MID</code>','取子串','Excel 风格'],
    ['<code>CONCAT</code>','拼接','也可用 <code>+</code>'],
    ['<code>FIND(文字, 要找[, 起点])</code>','位置（从 1 起），找不到给 0','区分大小写'],
    ['<code>SUBSTITUTE(文字, 旧, 新)</code>','把「旧」全部换成「新」','返回新串'],
    ['<code>REPT(文字, 次数)</code>','重复若干遍','<code>REPT("-", 10)</code>'],
    ['<code>EXACT(a, b)</code>','逐字节是否完全一样','大小写敏感'],
    ['<code>CHAR(编号) / CODE(文字)</code>','编号(0..255) ↔ 字符',''],
    ['<code>TRIM / UPPER / LOWER</code> 类','去空格 / 大小写','以手册 4.10 为准']
  ]},
  {t:'code',lang:'C* · 字符串处理示例',x:`function main() {
    string s = "Hello, C*";
    print LEN(s);                       // 9
    print at(s, 0);                     // H
    print FIND(s, "C*");                // 8（从 1 起）
    print SUBSTITUTE(s, "C*", "C 星");  // Hello, C 星
    print REPT("=", 12);
    print EXACT("abc", "ABC");          // false

    string t = "方程";
    print LEN(t);                       // 字节数（UTF-8 下通常是 6，不是 2）
}`},
  {t:'note',kind:'warn',k:'LEN 返回字节数',x:'<code>LEN</code> 返回的是<b>字节数</b>而不是「字符个数」。UTF-8 下一个汉字通常占 3 字节，所以 <code>LEN("方程")</code> 不是 2。这与 C 的 <code>strlen</code> 一致（见 C23 乙部 2.5），处理中文文本时要格外注意。'},
  {t:'ex',k:'动手练一练',items:[
    '用 <code>FIND</code> + <code>SUBSTITUTE</code> 实现「把一段文字里的某个词全部替换并统计次数」。',
    '验证 <code>LEN("方程")</code> 的实际返回值，解释它与字符数的差异。',
    '写一个判断回文字符串的函数（提示：用 <code>at</code> 逐字符比较）。'
  ]}
],

'cstar-5-4': [
  {t:'h',x:'深入：Excel 风格大写内建函数全表'},
  {t:'p',x:'「会用 Excel 就会写」是 C* 最讨巧的设计：一批大写函数与 Excel 同名同义，表格里的公式可以直接搬进程序。小写数学函数（<code>abs / len / sqrt / sin / log / floor</code> 等）是<b>软弃用别名</b>，照常编译，<code>--check --diag</code> 时给一条 H 提示建议改大写。'},
  {t:'table',head:['类别','函数','说明'],rows:[
    ['逻辑','<code>IF(c,a,b)</code> <code>AND(...)</code> <code>OR(...)</code> <code>NOT(x)</code> <code>TRUE()</code> <code>FALSE()</code>','参数须为比较结果；IF 只算用到的一边'],
    ['数学','<code>ABS</code> <code>SIGN</code>','符号返回 −1 / 0 / 1'],
    ['数学','<code>MOD(a,b)</code>','结果符号跟除数：<code>MOD(-3,10)==7</code>'],
    ['数学','<code>ROUND(x)</code> <code>ROUND(x,位数)</code> <code>INT(x)</code> <code>TRUNC(x)</code>','<code>INT(-2.7)==-3</code>，TRUNC 向 0 取整'],
    ['数学','<code>SQRT POWER EXP LN LOG PI</code>','<code>LOG(x, 底)</code> 可选底数'],
    ['数学','<code>ATAN2(y,x)</code> <code>LOG10(x)</code>','0.4.2 新增'],
    ['随机','<code>RAND()</code> <code>RANDBETWEEN(a,b)</code>','后者两端都含'],
    ['汇总','<code>SUM(数组)</code> <code>AVERAGE(数组)</code> <code>COUNT(数组)</code>','AVERAGE 返回小数'],
    ['汇总','<code>MAX(...)</code> <code>MIN(...)</code>','多个数或整个数组'],
    ['文本','<code>FIND SUBSTITUTE REPT EXACT CHAR CODE</code>','见 5.3']
  ]},
  {t:'code',lang:'C* · 把表格公式搬进程序',x:`function main() {
    int scores[5] = {60, 72, 88, 95, 43};
    print "总分 ", SUM(scores);
    print "平均 ", AVERAGE(scores);
    print "个数 ", COUNT(scores);
    print "最高 ", MAX(scores), " 最低 ", MIN(scores);

    print MOD(-3, 10);          // 7（Excel 语义）
    print ROUND(3.14159, 2);    // 3.14
    print INT(-2.7);            // -3
    print SIGN(-5), ABS(-5);    // -1 5
    print IF(scores[2] >= 60, "及格", "不及格");
}`},
  {t:'note',kind:'tip',k:'彩蛋函数 rcl()',x:'手册 4.10 还记了一个彩蛋：<code>rcl();</code> 会打印 <code>rcl永远爱方程235！</code> 并<b>立刻结束整个程序</b>；<code>rcl(235);</code> / <code>rcl("FC235");</code> 等认得的暗号回一句话，<code>rcl("rcl");</code> 回 <code>方程235，rcl永远爱你！</code>，其他值什么都不做。不用 <code>use</code>、不用写函数体，返回值是 <code>int 0</code>；参数只能是 0 或 1 个。'},
  {t:'ex',k:'动手练一练',items:[
    '用 <code>SUM / AVERAGE / MAX / MIN</code> 做一张成绩统计表并格式化输出。',
    '对比 <code>INT(-2.7)</code>、<code>TRUNC(-2.7)</code>、<code>ROUND(-2.7)</code> 三个结果。',
    '把小写别名 <code>abs / len</code> 改成大写，用 <code>--check --diag</code> 观察 H 提示消失。'
  ]}
],

/* ---------------- 第 6 章 ---------------- */
'cstar-6-1': [
  {t:'h',x:'深入：use 的两种形式与 .cash 头文件体系'},
  {t:'code',lang:'C* · use 的两种写法',x:`use "my_helper.h";    // 引号里带路径/带 .h → 生成 #include "..."
use <stdio.h>;        // 尖括号 → 生成 #include <stdio.h>

// 六个官方 .cash 头文件（可单独用于控制台，也可叠加）
use "C_OPED.cash";    // 窗口 / 控件 / Win32
use "C_CSS.cash";     // 窗口美化（需与 C_OPED 一起）
use "C_IO.cash";      // 文件与系统（不用开窗口）
use "C_OS.cash";      // 操作系统信息（0.5.1）
use "C_NET.cash";     // 网络校验与主动侦察（0.5.1）
use "C_SC.cash";      // 便携化交互 / 端口探测（0.5.1）`},
  {t:'table',head:['头文件','打开的能力','是否需要窗口'],rows:[
    ['<code>C_OPED.cash</code>','系统头已包含、可直接调系统函数、自动链接 user32/gdi32/comctl32、内建窗口控件、生成窗口式 exe','窗口'],
    ['<code>C_CSS.cash</code>','CSS 式配色、字号、圆角、投影、密码框','<b>需与 C_OPED 一起用</b>'],
    ['<code>C_IO.cash</code>','读写文件、判断存在、取程序目录、读环境变量、等待外部程序','不需要'],
    ['<code>C_OS.cash</code>','进程号、CPU 核数、内存、平台、管理员、开机时长、进程查找','不需要'],
    ['<code>C_NET.cash</code>','URL 校验、编码/哈希、DNS/HTTP 状态、主机存活','不需要'],
    ['<code>C_SC.cash</code>','是否便携、exe 旁写文件、空闲内存/磁盘、64 位、本机端口探测','不需要']
  ]},
  {t:'note',kind:'warn',k:'C# 用不了',x:'手册明确写了：<b>C# / .NET 没有 C 头文件，能打开的只有 C 和 C++ 两个世界</b>。<code>use</code> 的本质是把包含与链接配置注入生成的代码，这依赖 C 风格的头文件与 ABI。'},
  {t:'p',x:'进阶用法里，<code>use &lt;stdio.h&gt;;</code> 让你直接调 C 库函数，但<b>类型必须自己对得上</b>：C* 的 <code>int</code> 是 C 的 <code>long long</code>、<code>float</code> 是 <code>double</code>。混用前先回看 1.3 的对照表，否则参数宽度不匹配会产生很难查的错误。'},
  {t:'ex',k:'动手练一练',items:[
    '分别用引号与尖括号形式 <code>use</code> 一个头文件，比较 <code>-g</code> 生成结果里的包含指令。',
    '列出六个 <code>.cash</code> 头文件各自最常调用的三个函数。',
    '思考：为什么 <code>C_CSS.cash</code> 必须与 <code>C_OPED.cash</code> 一起用？'
  ]}
],

'cstar-6-2': [
  {t:'h',x:'深入：C_OPED 一行开窗口与事件回调'},
  {t:'p',x:'在文件<b>最前面</b>写一行 <code>use "C_OPED.cash";</code>，就从控制台进入 Win32 世界：系统头文件已包含、系统函数不用声明就能调、窗口库自动链接、并生成窗口式 exe（默认不带黑色控制台，调试加 <code>--console</code>）。'},
  {t:'code',lang:'C* · 官方第一个窗口程序',x:`use "C_OPED.cash";

int 次数标签;
int 点击次数 = 0;

function on_click(int 控件) {          // 按钮被点击时 C* 自动调用
    点击次数 = 点击次数 + 1;
    settext(次数标签, "你点了 " + 点击次数 + " 次");
}

function main() {
    int 窗口 = window("我的第一个窗口", 460, 260);     // 标题, 宽, 高
    label("你好，C*！点一下按钮看看：", 24, 24, 400, 24);
    次数标签 = label("你点了 0 次", 24, 56, 400, 24);
    button("点我", 24, 104, 140, 34);
    run();                              // 显示窗口，等关闭才结束
}`},
  {t:'table',head:['控件 / 函数','作用','关键参数'],rows:[
    ['<code>window(标题,宽,高)</code>','创建窗口','返回控件句柄（<code>int</code>）'],
    ['<code>label(文字,x,y,w,h)</code>','静态文本','返回句柄，供 <code>settext</code> 后续修改'],
    ['<code>button(文字,x,y,w,h)</code>','按钮','点击触发 <code>on_click</code>'],
    ['<code>textbox(...)</code>','输入框','配合 <code>gettext</code> 读内容'],
    ['<code>settext(句柄, 文字)</code>','改控件文字',''],
    ['<code>run()</code>','进入消息循环','窗口关闭才返回'],
    ['<code>on_click(控件)</code>','事件回调','C* 自动调用，无需注册'],
    ['<code>GetTickCount()</code> 等','直接调 Win32 函数','不用 <code>use &lt;windows.h&gt;</code>']
  ]},
  {t:'note',kind:'tip',k:'句柄是 int',x:'C* 把窗口控件句柄统一抽象成 <code>int</code>，所以「保存哪个标签以便后面改文字」就是声明一个全局 <code>int</code> 变量。这种设计让初学者不必接触 <code>HWND</code> / 消息泵 / 回调函数指针，却仍能做出真正可交互的原生窗口程序。'},
  {t:'ex',k:'动手练一练',items:[
    '照抄并运行官方 <code>win_hello.cask</code>，用 <code>--console</code> 看调试输出。',
    '给窗口加第二个按钮和一个输入框，点击后把输入内容显示到标签上。',
    '说明 <code>run()</code> 为什么必须放在 <code>main()</code> 最后一行。'
  ]}
],

'cstar-6-3': [
  {t:'h',x:'深入：C_CSS 的可用属性与平台差异'},
  {t:'p',x:'紧跟 <code>use "C_OPED.cash";</code> 再加一行 <code>use "C_CSS.cash";</code>，就得到一套 CSS 式美化工具箱。颜色写法与 CSS 一致：<code>"#RRGGBB"</code>、<code>"RRGGBB"</code> 或颜色名（<code>"blue"</code> <code>"gold"</code>）。'},
  {t:'code',lang:'C* · 给窗口上妆',x:`use "C_OPED.cash";
use "C_CSS.cash";

function main() {
    int 窗口 = window("美化示例", 460, 220);
    csbg(窗口, "1B2129");                  // 整块窗口底色

    int 标题 = label("欢迎使用 C*", 24, 24, 400, 40);
    csfont(标题, 24, 1);                   // 字号(磅) + 加粗
    cstext(标题, "FFD54F");                // 文字色

    int 输入框 = textbox("", 24, 88, 300, 30);
    csbg(输入框, "FFF9C4");
    cspass(输入框);                        // 密码框打码

    int 按钮 = button("确定", 24, 136, 120, 34);
    csbg(按钮, "1E88E5"); cstext(按钮, "FFFFFF");
    csradius(按钮, 8);                     // 圆角（Linux 生效）
    csshadow(窗口, 1);                     // 投影（Linux 生效）

    run();
}`},
  {t:'table',head:['函数','作用','平台备注'],rows:[
    ['<code>cstext(控件, 色)</code>','文字颜色','Windows 0.5.0 起按钮改为自绘后生效'],
    ['<code>csbg(控件, 色)</code>','背景颜色','窗口级会换背景刷'],
    ['<code>csfont(控件, 字号, 加粗)</code>','字号（磅）+ 0/1 粗细','按屏幕 DPI 换算，96 DPI 下 12 磅≈16 像素'],
    ['<code>csradius(控件, px)</code>','圆角','Linux 生效'],
    ['<code>csshadow(控件, 0~3)</code>','投影','Linux 生效'],
    ['<code>cshide / csshow</code>','隐藏 / 显示',''],
    ['<code>cspass(控件)</code>','输入框打码','密码框'],
    ['<code>cscolor(名,色) / csapply(名,控件)</code>','命名样式复用','']
  ]},
  {t:'note',kind:'warn',k:'别忽略平台差异',x:'手册明确标注 <code>csradius</code> / <code>csshadow</code> 在 <b>Linux 生效</b>；Windows 上 0.5.0 起按钮改为 owner-draw 后 <code>csbg/cstext/csfont</code> 才不会被 Win10/11 视觉样式盖掉。写跨平台界面时先查手册对应条目的适用平台，别假设所有属性都能用。'},
  {t:'ex',k:'动手练一练',items:[
    '把官方窗口示例改成深色主题（窗口底色 + 文字色 + 按钮色）。',
    '用 <code>cscolor</code> + <code>csapply</code> 给三个控件套同一套样式。',
    '验证 <code>cspass</code> 前后输入框的显示差异。'
  ]}
],

'cstar-6-4': [
  {t:'h',x:'深入：C_IO 文件与系统函数'},
  {t:'p',x:'<code>C_IO.cash</code> 是<b>不用开窗口也能用</b>的「文件与系统」头：读写文件、判断存在、取 exe 所在目录、读环境变量、启动外部程序并等待。它让 C* 能写真正的批处理小工具，而不只是控制台练习。'},
  {t:'table',head:['函数','作用','返回'],rows:[
    ['<code>readfile("路径")</code>','把整个文件读成一段文字','不存在给 <code>""</code>，上限 1MB'],
    ['<code>writefile("路径", 内容)</code>','整体写入（覆盖）','1 = 成功'],
    ['<code>appendfile("路径", 内容)</code>','追加到末尾','1 = 成功'],
    ['<code>fileexists("路径")</code>','文件或目录在不在','1 / 0'],
    ['<code>makedir("路径")</code>','建目录','已有也算成功'],
    ['<code>appdir()</code>','exe 所在目录完整路径','不带末尾分隔符'],
    ['<code>envget("名字")</code>','读环境变量','没有给 <code>""</code>'],
    ['<code>launchwait("命令行")</code>','启动外部程序并<b>等它跑完</b>','退出码；起不来 −1']
  ]},
  {t:'code',lang:'C* · 官方示例：带配置的程序',x:`use "C_IO.cash";

function main() {
    string 配置 = appdir() + "/app.set";
    if (fileexists(配置) != 0) print "上次的内容: ", readfile(配置);
    writefile(配置, "名字=Steve" + "\\n" + "内存=2048");
    print "写完了。";
    return 0;
}`},
  {t:'p',x:'<code>launch()</code>（5.4 节，启动就返回）与 <code>launchwait()</code>（本节，跑完才返回）是一对：写启动器、下载器这类「发起就继续干别的」的程序用前者；写批处理、需要拿到退出码的用后者。另外 <code>readfile</code> 有 <b>1MB 上限</b>，处理大文件要另想办法。'},
  {t:'note',kind:'tip',k:'appdir() 的价值',x:'绿色软件常要「把配置放在 exe 旁边」。<code>appdir()</code> 返回程序所在目录且不带末尾分隔符，配合 <code>+ "/app.set"</code> 就能拼出稳定路径，不依赖当前工作目录。6.5 的 <code>C_SC.cash</code> 里 <code>isportable()</code> 与 <code>copytoexe()</code> 正是把这个模式封装好了。'},
  {t:'ex',k:'动手练一练',items:[
    '写一个简易记事本：把用户输入追加写入 exe 旁的 <code>note.txt</code>。',
    '用 <code>launchwait</code> 调用系统命令并打印退出码。',
    '思考：为什么配置文件路径要用 <code>appdir()</code> 而不是相对路径 <code>"./app.set"</code>？'
  ]}
],

'cstar-6-5': [
  {t:'h',x:'深入：0.5.1 三个新头与合规边界'},
  {t:'p',x:'0.5.1 新增 <code>C_OS / C_NET / C_SC</code> 三个头，都能<b>单独给控制台程序用</b>，也能和 <code>C_OPED / C_CSS</code> 叠起来做窗口工具（例如「系统信息面板」）。它们把系统信息、网络校验、便携化交互做成了几个直接可调的函数。'},
  {t:'table',head:['头文件','代表函数','用途 / 边界'],rows:[
    ['<code>C_OS.cash</code>','<code>os_pid os_cores os_ram os_cpu os_hostname os_platform isadmin uptime findproc</code>','展示系统信息；手册提醒 <code>os_cpu/hostname/ram</code> 因机器而异，<b>只展示别写死</b>，判断只判「非空 / 非 0」'],
    ['<code>C_NET.cash</code>','<code>isurl urlhost base64 unbase64 httpcode dnsresolve hostalive bannerget</code>','被动层（校验/编码/哈希/存活）随时可用；主动层（<code>bannerget/httpcode/dnsresolve</code>）会连出去读数据，<b>只对实验室、127.0.0.1 或已获书面授权的目标使用</b>'],
    ['<code>C_SC.cash</code>','<code>isportable copytoexe freebytes diskfree is64bit portcheck portscan</code>','<code>portcheck/portscan</code> 是往 127.0.0.1 拨号的<b>只读探测</b>：只连、不听，不对外']
  ]},
  {t:'code',lang:'C* · 三个头各来一段',x:`use "C_OS.cash";

function main() {
    print "平台 ", os_platform(), "，核数 ", os_cores(), "，内存 ", os_ram(), " GB";
    if (isadmin() == 1) print "管理员";
    print "进程号 ", os_pid(), "，开机时长(ms) ", uptime();
    return 0;
}

/* C_SC.cash 示例
use "C_SC.cash";
function main() {
    if (isportable() == 1) print "绿色版：可就地放文件";
    print "80 端口：", portcheck(80);
} */`},
  {t:'note',kind:'danger',k:'合规红线',x:'手册对 <code>C_NET.cash</code> 写得很清楚：C* <b>不提供</b>发原始数据包、DoS 洪水、SYN 半开、漏洞利用/注入；主动侦察也只是「连一下、读回来」，与浏览器访问页面同量级，且会阻塞 3~4 秒，别在界面主循环里高频调用。<b>只对实验室、127.0.0.1 或已获书面授权的目标使用。</b>'},
  {t:'p',x:'三个头的完整讲解、综合示例（「系统信息面板」窗口）与测验在<b>高职教材第 13 章</b>。做这类工具时记得：系统信息只用于展示、网络探测严守授权边界、端口扫描只在本机——这三条既是官方要求，也是基本的安全常识。'},
  {t:'ex',k:'动手练一练',items:[
    '用 <code>C_OS.cash</code> 写一段「系统信息卡」，并用 <code>print</code> 格式化输出。',
    '用 <code>C_NET.cash</code> 的 <code>isurl</code> + <code>urlhost</code> 校验一批网址（只做被动校验）。',
    '用 <code>C_SC.cash</code> 判断程序是否便携，并在 exe 旁写一个小文本。'
  ]}
],

/* ---------------- 第 7 章 ---------------- */
'cstar-7-1': [
  {t:'h',x:'深入：三层运行时检查逐项对照'},
  {t:'p',x:'C* 默认打开运行时检查，出错时<b>程序立刻停止</b>，并打印带位置的信息，例如：<code>C* 运行错误: 数组下标越界</code> / <code>位置 tests\\array.cask:6</code>。汇编后端为每条检查记录了源码行号，所以报错能精确指回 <code>.cask</code>。'},
  {t:'table',head:['检查','触发条件','例子','C 里的对应情况'],rows:[
    ['整数溢出','<code>int</code> 加/减/乘结果放不下','<code>9000000000000000000 * 9</code>','有符号溢出是 UB，编译器可能删代码'],
    ['除零','<code>/</code> <code>%</code> 除数为 0','<code>10 / 0</code>','UB，通常直接崩'],
    ['数组越界','下标 <code>&lt;0</code> 或 <code>&gt;=长度</code>','<code>a[5]</code> 只有 3 个元素','UB，可能静默改坏相邻数据'],
    ['移位检查','位数不在 0…63，或左移负数/溢出','<code>1 &lt;&lt; 99</code>','UB'],
    ['字符范围','<code>int</code> 赋给 <code>char</code> 超出 −128…127','<code>char c = 999;</code>','实现定义，通常静默截断']
  ]},
  {t:'code',lang:'C* · 逐一触发（都应在报错后停止）',x:`function main() {
    int a[3];
    // a[5] = 1;                         // 数组下标越界
    // int x = 10 / 0;                   // 除零
    // int y = 9000000000000000000 * 9;  // 整数溢出
    // int z = 1 << 99;                  // 移位位数越界
    // char c = 999;                     // 字面量在编译期就报
    print a[0];                        // 0（自动初始化）
}`},
  {t:'p',x:'还有一层是<b>自动初始化</b>：局部变量默认 0 / 空，数组全 0（见 3.2）。严格说它不是「检查」而是「预防」，但效果同样是把 C 里最隐蔽的一类 bug（读未初始化内存）从源头消掉。'},
  {t:'note',kind:'tip',k:'对比 C23 的做法',x:'C 把这些都交给程序员，但可以用工具补：ASan 抓越界/泄漏、UBSan 抓溢出/移位、<code>&lt;stdckdint.h&gt;</code> 的 <code>ckd_*</code> 主动检查溢出（C23 乙部 4.9、6.4）。学 C* 时享受的默认保护，转 C 后需要自己用工具链搭起来。'},
  {t:'ex',k:'动手练一练',items:[
    '把上面五条注释逐条打开，记录每条的完整报错文字与行号。',
    '验证局部变量与数组未初始化时的默认值。',
    '思考：为什么「报错并指出行号」比「返回 0 继续执行」更适合教学语言？'
  ]}
],

'cstar-7-2': [
  {t:'h',x:'深入：四级问题与 --diag 机器格式'},
  {t:'p',x:'编译期问题分<b>三级</b>（严重 / 语法 / 拼写），另有一个不计错的「提示」级。<code>--check --diag</code> 会把每条按 <code>级别|行|列|信息</code> 打印，供编辑器与脚本解析；普通模式则是 <code>文件:行:列: 错误:</code> 的可读格式。'},
  {t:'table',head:['字母','级别','含义','是否算错'],rows:[
    ['<code>E</code>','严重','程序跑不起来：未定义的名字、类型不符等','是'],
    ['<code>S</code>','语法','写法不对：少分号、括号不配对；多数会<b>自动跳过</b>继续检查，一次报多条','是'],
    ['<code>P</code>','拼写','名字打错，附「是不是想写 ×××」的建议（只在明显相像时给）','是'],
    ['<code>H</code>','提示','老写法提醒（如还在用 <code>say</code>）','<b>否</b>，不计入退出码']
  ]},
  {t:'code',lang:'Bash · 检查与解析',x:`:: 只检查不编译，不留任何文件；有问题退出码非 0
bin\\caskc.exe app.cask --check
echo %errorlevel%

:: 机器可读格式，供编辑器解析
bin\\caskc.exe app.cask --check --diag
:: 输出形如：
:: S|6|12|少了分号
:: P|9|5|是不是想写 print ？
:: H|3|1|say 是老写法，建议用 print`},
  {t:'p',x:'C* Studio 正是解析这个输出，才做到「停下半秒自动后台检查 → 问题面板列每一条 → 行号栏标错行 → 顶部四个小圆点实时计数（严重红 / 语法橙 / 拼写绿 / 提示蓝）」。点面板里任意一条，光标就跳到对应行。'},
  {t:'note',kind:'tip',k:'语法错误「一次报多条」',x:'S 级错误多数会跳过错的地方继续检查，所以一次能看到多条问题——这是编译器特意为初学者做的错误恢复。别只改第一条就重编译，先把一轮里报出来的都看一遍；但也注意后面的报错可能由第一个错误连锁引起。'},
  {t:'ex',k:'动手练一练',items:[
    '写出能分别触发 E / S / P / H 的四段代码，用 <code>--check --diag</code> 对照级别字母。',
    '在 Studio 里点「问题」面板的一条，确认光标跳转行为。',
    '说明为什么 H 提示不计入退出码（考虑 CI 场景）。'
  ]}
],

'cstar-7-3': [
  {t:'h',x:'深入：--fast 到底关掉了什么'},
  {t:'p',x:'<code>--fast</code> 只做一件事：<b>关闭运行时检查</b>（溢出、除零、越界、移位、字符范围）。手册原话是「追求速度、并且确认逻辑正确时可以 <code>--fast</code> 关闭这些检查，省一点点开销，出错行为不再保证」。注意它<b>不是优化开关</b>，收益通常很小。'},
  {t:'table',head:['','默认（推荐）','<code>--fast</code>'],rows:[
    ['溢出 / 除零 / 越界','报错并指出 <code>.cask</code> 行号后停止','不再保证，行为接近 C 的 UB'],
    ['性能','每条检查有少量开销','略快'],
    ['适合','开发、教学、调试、绝大多数发布场景','已充分测试且实测确有瓶颈的热路径'],
    ['错误定位','精确到源文件行','可能崩在别处、或静默出错']
  ]},
  {t:'code',lang:'Bash · 对照实验',x:`:: 默认：越界立刻报 位置 app.cask:6
bin\\caskc.exe app.cask && app.exe

:: --fast：同样的越界可能读到脏数据或崩溃，且不再有行号
bin\\caskc.exe app.cask --fast && app.exe`},
  {t:'note',kind:'danger',k:'别把它当发布仪式',x:'很多人的习惯是「开发版调试、发布版加 --fast」，但这恰恰把最需要保护的线上运行暴露给 UB。更稳妥的做法：<b>发布版也保留检查</b>，只在 profiling 证实某段循环确实被检查拖慢、且该段逻辑已被测试完整覆盖时，才针对那一个程序考虑 <code>--fast</code>。'},
  {t:'p',x:'把 C* 与 C 并排看会很有意思：C* 默认付出一点点开销换「错误立刻可见」，C 默认零开销换「出错不可预期」。C23 给出的折中是用 Sanitizer 在<b>开发构建</b>里加检查、发布构建里去掉，再加 <code>ckd_*</code> 这类显式检查放在关键路径上——思路与 C* 一致，只是把选择权交给了工程师。'},
  {t:'ex',k:'动手练一练',items:[
    '对同一段含大量数组访问的循环，分别用默认与 <code>--fast</code> 计时，量化差异有多大。',
    '在 <code>--fast</code> 下越界一次，描述结果与默认模式的差别。',
    '讨论：为什么「把检查留到发布版」在教学语言里是合理默认，在工程语言里却常不被接受？'
  ]}
],

/* ---------------- 第 8 章 ---------------- */
'cstar-8-1': [
  {t:'h',x:'深入：全部关键字与命名禁区'},
  {t:'p',x:'手册第 9 章给出的关键字总表只有五类、二十来个词，<b>每个都是初中阶段的英语词</b>。这是 C* 「入门友好」最直接的体现：其余要记的都是 C 里已经会的语法（括号、分号、大括号）。'},
  {t:'table',head:['类别','关键字'],rows:[
    ['程序','<code>function</code> <code>main</code> <code>use</code> <code>constant</code>'],
    ['类型','<code>int</code> <code>float</code> <code>string</code> <code>char</code> <code>bool</code> <code>none</code>'],
    ['输出/输入','<code>print</code> <code>show</code> <code>input</code>'],
    ['流程','<code>if</code> <code>else</code> <code>while</code> <code>for</code> <code>do</code> <code>until</code> <code>foreach</code> <code>in</code> <code>switch</code> <code>case</code> <code>default</code> <code>break</code> <code>continue</code> <code>return</code>'],
    ['逻辑','<code>and</code> <code>or</code> <code>not</code> <code>true</code> <code>false</code>']
  ]},
  {t:'cards',items:[
    ['大写的不是关键字','<code>IF SUM MAX LEN FIND ...</code> 是<b>内建函数名</b>，不是关键字，但同样不能当变量名用'],
    ['命名禁区','不能与 C 关键字、<code>printf</code> / <code>main</code> 等常用库函数名、<code>cask_</code> / <code>__cask</code> 前缀冲突'],
    ['中文命名','允许，但源文件必须 UTF-8（见 3.2）'],
    ['入口限制','<code>function main()</code> 不能带参数，写了会提示「不要参数」']
  ]},
  {t:'note',kind:'tip',k:'把这张表打印出来',x:'前几周写代码时把关键字总表放在手边，能省掉大量「这个词是不是关键字」「该用大写还是小写」的犹豫。遇到不认识的标识符，先查手册 4.10 的内建函数表，再查 5.x 的头文件函数表，最后才怀疑是自己拼错了。'},
  {t:'ex',k:'动手练一练',items:[
    '把五类关键字抄一遍，并给每一类各写一行示例代码。',
    '试着把变量命名为 <code>print</code>、<code>MAX</code>、<code>cask_tmp</code>，分别记录结果。',
    '统计一段自己写的 .cask 里出现了多少个不同关键字。'
  ]}
],

'cstar-8-2': [
  {t:'h',x:'深入：软弃用别名对照与迁移'},
  {t:'p',x:'C* 从 0.2/0.3 走来，改过一批名字，但官方承诺<b>老写法全都还能用，一个都不会突然失效</b>。它们被标为「软弃用」：照样编译通过，带 <code>--diag</code> 检查时多给一条 <code>H|行|列|…</code> 提示，<b>不计入错误、不影响退出码</b>。'},
  {t:'table',head:['老写法','新写法','说明'],rows:[
    ['<code>say</code>','<code>print</code>','打印并换行，完全一样'],
    ['<code>start { … }</code>','<code>function main() { … }</code>','程序入口，完全一样'],
    ['<code>func</code>','<code>function</code>','完全一样'],
    ['<code>const</code>','<code>constant</code>','完全一样'],
    ['<code>void</code>','<code>none</code>','完全一样'],
    ['<code>number</code>','<code>int</code>','整数类型'],
    ['<code>real</code>','<code>float</code>','小数类型'],
    ['<code>text</code>','<code>string</code>','字符串类型'],
    ['<code>letter</code>','<code>char</code>','字符类型'],
    ['<code>&amp;&amp; || !</code>','<code>and or not</code>','完全一样，含短路'],
    ['<code>abs len sin floor log10 …</code>','<code>ABS LEN SIN FLOOR LOG10 …</code>','小写数学函数是软弃用别名']
  ]},
  {t:'code',lang:'C* · 老写法 vs 新写法',x:`// 0.2/0.3 老程序：照样能编译，但 --diag 会给 H 提示
start {
    number 苹果 = 3;
    text 问候 = "你好";
    say 问候, 苹果;
}

// 0.4.2 起推荐：一律用新名
function main() {
    int 苹果 = 3;
    string 问候 = "你好";
    print 问候, 苹果;
}`},
  {t:'p',x:'类型改名发生在 <b>0.4.2</b>：规范名统一成 C 的 <code>int / float / string / char</code>，理由是「学过 C 的人一眼就懂」。<code>bool</code> 和 <code>none</code> 没有改名。新写的程序一律用新名，读老教材时按上表换算即可。'},
  {t:'note',kind:'tip',k:'用 --diag 做批量迁移',x:'对一批老 <code>.cask</code> 跑 <code>--check --diag</code>，把所有 <code>H|</code> 开头的提示挑出来，就是一份精确的迁移清单。因为 H 不影响退出码，可以放心在 CI 里加一步「统计提示数」而不阻断构建。'},
  {t:'ex',k:'动手练一练',items:[
    '把一段老写法程序逐项改成新写法，用 <code>--diag</code> 验证 H 提示归零。',
    '找一份用 <code>number/real/text/letter</code> 的官方老示例，说明每个类型的现代名字。',
    '讨论：为什么「软弃用」比「直接删除老写法」更适合教学语言的版本演进？'
  ]}
],

'cstar-8-3': [
  {t:'h',x:'深入：五套教材怎么选（决策表）'},
  {t:'table',head:['你的情况','选哪套','先用哪几章','跳过什么'],rows:[
    ['完全没写过代码','小学版 → 初中版','小学版前 3 章建立直觉，再整本初中版','普高选修一、高职窗口章节'],
    ['会一点 Python / Scratch','初中版','第 1~5 章 + 手册第 4 章','小学版'],
    ['高中，想系统学','普高必修一 → 选修一','必修一整本，选修一挑项目做','小学版'],
    ['想快速做出能用的窗口工具','高职教程','手册第 5 章 + 高职第 13 章','普高理论章节'],
    ['目标是转到 C / C++','初中版 + 手册第 7、9 章','语法主线 + 对照速查表','窗口与美化章节'],
    ['只是查某个函数','CStar 手册','第 4.10 内建函数、第 5 章控件表、第 9 章关键字','整套教材']
  ]},
  {t:'p',x:'六份材料的关系可以这样记：<b>手册是「字典」，五套教材是「五条上课路线」</b>。字典讲全、不讲顺序；教材讲顺序、会有取舍。写代码时卡住先翻手册对应条目，系统性学习才按教材一章章走。'},
  {t:'note',kind:'tip',k:'本卷（语言篇）的取材',x:'甲部 C* 8 章的骨架按「初中版教程」的节奏组织，头文件与窗口部分主要依据<b>高职教程</b>与手册第 5 章，安全机制与关键字总表来自手册第 6、9 章，五套教材的定位见本节与 1.4。每节末尾都附了官方教材原文链接，可随时回查。'},
  {t:'ex',k:'动手练一练',items:[
    '按上面的决策表给自己定一条路径，写下四周计划。',
    '对比小学版与普高必修一讲「循环」的那一章，列出讲法差异。',
    '在手册里查一个你没用过的内建函数，写一个三行示例验证它的行为。'
  ]}
],

'cstar-8-4': [
  {t:'h',x:'深入：从 C* 走向 C23 的完整迁移清单'},
  {t:'p',x:'学完 C* 再学 C，最大的优势是<b>语法与心智模型几乎无缝</b>；最大的风险是把 C* 替你做的事当成理所当然。下面这份清单按「必须改 / 必须补 / 可以享受」三类组织，配合本卷乙部 6 章逐项落地。'},
  {t:'table',head:['类别','C* 里的习惯','C23 里要改成'],rows:[
    ['类型','<code>int</code>','<code>long long</code> 或按需 <code>int32_t</code>（C 的 int 常为 32 位）'],
    ['类型','<code>float</code>','<code>double</code>（C 的 float 是单精度）'],
    ['输出','<code>print a, b;</code>','<code>printf</code> + 格式串 + <code>\\n</code>，注意 <code>%lld / %zu</code>'],
    ['输入','<code>input x;</code>','<code>fgets</code> + <code>sscanf</code>，自己处理换行与错误重输'],
    ['入口','<code>function main()</code>','<code>int main(void) { … return 0; }</code>'],
    ['常量','<code>constant int N</code>','<code>constexpr int N</code>（C23）或 <code>enum / #define</code>'],
    ['逻辑','<code>and or not</code>','<code>&amp;&amp; || !</code>'],
    ['二选一','<code>IF(c,a,b)</code>','<code>c ? a : b</code>'],
    ['取余','<code>MOD(a,b)</code>','注意 C 的 <code>%</code> 符号跟被除数，Excel 语义要自己实现'],
    ['函数顺序','先用后定义','先声明原型或把定义放前面'],
    ['字符串','不可变 + <code>+</code> 拼接','<code>char[]</code> / <code>snprintf</code> / <code>memmove</code>，自己管缓冲区'],
    ['初始化','局部变量自动 0','<b>一律显式初始化</b>，否则读到未定义值']
  ]},
  {t:'cards',items:[
    ['必须补 · 边界','所有数组下标显式检查 <code>i &lt; n</code>；分配尺寸用 <code>ckd_mul</code> 防溢出（乙部 4.9）'],
    ['必须补 · 内存','<code>malloc/free</code> 成对，释放后置 <code>nullptr</code>，所有权写进接口注释（乙部 3.1、6.1）'],
    ['必须补 · 工具链','Debug 用 ASan + UBSan，发布用 <code>-O2 -Werror</code>，CI 里跑单元测试（乙部 6.3、6.4）'],
    ['可以享受','C23 的 <code>bool / nullptr / constexpr / typeof / #embed / %b / [[nodiscard]]</code> 让 C 写起来比 C99 舒服得多（乙部第 4 章）']
  ]},
  {t:'note',kind:'tip',k:'心态上的转变',x:'C* 的口号是「出错就报错并指出行号」，C 的口号是「程序员负责一切」。转到 C 之后，你要主动把那层保护<b>用工具链重新搭一遍</b>：编译警告、Sanitizer、静态分析、单元测试、代码规范。这正是乙部第 6 章存在的意义。'},
  {t:'ex',k:'结业练习',items:[
    '把 C* 的猜数字程序完整迁移到 C23，逐条对照上表打勾。',
    '列出你最可能忘记补的三项检查，并为每一项写一个能触发错误的示例。',
    '用 <code>#embed</code> + <code>constexpr</code> + <code>nullptr</code> 重写这段 C 代码，体会 C23 相对 C99 的改进。'
  ]}
]

};
