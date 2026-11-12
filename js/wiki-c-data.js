/* ==========================================================
   C 语言（C23）系统教程数据
   标准：ISO/IEC 9899:2024（C23）
   章节 1~6，从零基础到工程实践，按 章.节 编号
   ========================================================== */
window.WIKI_C = {
  id:'clang', num:'乙', en:'COURSE II · THE C LANGUAGE (C23)',
  title:'C 语言',
  lead:'按 C23 标准从「C 语言是什么」一路讲到工程实践：基础语法、指针与内存、结构体、文件与预处理、C23 全部新特性、数据结构实现、并发与构建。每节都有可编译的示例，编号 1.1 至 6.9。',
  chips:['C23 / ISO 9899:2024','由浅入深','共 6 章'],
  chapters:[

  /* ================= 第 1 章 ================= */
  {id:'c-1',num:'1',title:'C 语言基础',lead:'从语言定位、标准演进、第一个程序，到类型、运算符与输入输出。',sections:[
    {id:'c-1-1',num:'1.1',title:'C 语言是什么',lead:'一门贴近硬件、靠标准库吃饭的通用过程式语言。',tags:['绪论'],blocks:[
      {t:'p',x:'<b>C 是一门「可移植的汇编」。</b>1972 年前后由 Dennis Ritchie 在贝尔实验室为重写 UNIX 而设计：语法精炼、直接映射内存与地址、几乎没有运行时，因此既能写操作系统内核，也能写单片机固件。它不自带垃圾回收、异常、类与模板——换来的是极小的抽象代价和完全可控的行为。'},
      {t:'p',x:'C 的核心世界观有三条：<b>一切对象都是一段有类型的内存</b>；<b>指针就是地址，可以算术运算</b>；<b>程序员负责生命周期与边界</b>。越界、解引用空指针、读未初始化对象在 C 里属于「未定义行为」（UB），编译器可以假定它不会发生，因此优化后可能出现任何结果——这是 C 最需要敬畏的地方。'},
      {t:'table',head:['特点','含义'],rows:[
        ['过程式','程序由函数与数据构成，没有类与继承'],
        ['静态类型 / 弱检查','类型在编译期确定，但允许不少隐式转换'],
        ['手动内存','<code>malloc/free</code> 自己管，没有 GC'],
        ['零成本抽象','结构体、指针、宏都直接对应机器表示'],
        ['标准小、生态大','语言本身很小，能力来自标准库与 POSIX/第三方库']
      ]},
      {t:'note',k:'适合学 C 的理由',x:'理解 C，就理解了内存模型、调用栈、链接、字节序、系统调用这些所有高级语言共同的地基。C++、Rust、Go、Java、Python 的解释器，底层都站在它肩上。'}
    ]},
    {id:'c-1-2',num:'1.2',title:'C 标准演进与 C23',lead:'K&R → C89 → C99 → C11 → C17 → C23，本教程统一用 C23。',tags:['标准'],blocks:[
      {t:'table',head:['标准','年份','关键内容'],rows:[
        ['K&R C','1978','《The C Programming Language》事实标准'],
        ['C89 / C90','1989','第一个 ANSI/ISO 标准，<code>void</code>、<code>const</code>、函数原型'],
        ['C99','1999','<code>//</code> 注释、<code>long long</code>、<code>bool</code>(&lt;stdbool.h&gt;)、VLA、复合字面量、<code>restrict</code>、<code>inline</code>'],
        ['C11','2011','<code>_Generic</code>、<code>_Static_assert</code>、原子 &lt;stdatomic.h&gt;、线程 &lt;threads.h&gt;、<code>_Alignof</code>'],
        ['C17','2017','C11 的缺陷修订，无新特性'],
        ['<b>C23</b>','<b>2024</b>','<code>bool/true/false/nullptr</code> 关键字、<code>constexpr</code>、<code>typeof</code>、<code>#embed</code>、属性 <code>[[...]]</code>、<code>0b</code> 与数字分隔符、枚举底层类型、<code>&lt;stdckdint.h&gt;</code>、<code>&lt;stdbit.h&gt;</code>、<code>_BitInt</code>、<code>auto</code> 类型推断']
      ]},
      {t:'p',x:'C23 的正式编号是 <b>ISO/IEC 9899:2024</b>（草案长期以 <em>C2x</em> 称呼）。它做了两件大事：一是把过去靠头文件/下划线关键字提供的能力收进语言核心（<code>bool</code>、<code>alignas</code>、<code>static_assert</code>、<code>thread_local</code> 都成了普通关键字）；二是补上了现代工程常用能力（<code>#embed</code> 嵌入二进制、<code>typeof</code> 泛型、溢出检查库）。'},
      {t:'code',lang:'Bash · 编译命令',x:'# GCC 14 / Clang 18 及更早用 c2x，新编译器可用 c23\ngcc -std=c2x -Wall -Wextra -Wpedantic -O2 main.c -o main\nclang -std=c23 -Wall -Wextra main.c -o main\n./main'},
      {t:'note',k:'兼容性',x:'C23 移除了 K&amp;R 函数定义、三字母词（trigraph），并规定 <code>void f();</code> 等价于 <code>void f(void);</code>（无参数）。老代码建议先用 <code>-std=c17 -Wall</code> 编译，再逐项迁移；迁移清单见 4.1。'}
    ]},
    {id:'c-1-3',num:'1.3',title:'开发环境与第一个程序',lead:'一个最小可编译程序，逐行拆开看。',tags:['入门'],blocks:[
      {t:'code',lang:'C23 · hello.c',x:'#include <stdio.h>\n\nint main(void) {\n    printf("Hello, C23!\\n");\n    return 0;\n}'},
      {t:'ul',items:[
        '<code>#include &lt;stdio.h&gt;</code>：预处理指令，把标准输入输出头文件「贴」进来，才能让编译器认识 <code>printf</code>',
        '<code>int main(void)</code>：程序入口。<code>void</code> 明确表示不接收参数；C23 里写 <code>int main()</code> 等价',
        '<code>printf</code> 的 <code>\\n</code> 是换行转义；字符串字面量类型是 <code>char[N]</code>',
        '<code>return 0;</code>：向操作系统返回退出码。<b>main 是特例</b>：走到结尾没写 return 也等价于返回 0'
      ]},
      {t:'code',lang:'Bash',x:'gcc -std=c2x -Wall -Wextra -Wpedantic hello.c -o hello\n./hello\n# Hello, C23!\necho $?   # 0'},
      {t:'note',k:'建议',x:'从第一天起就打开 <code>-Wall -Wextra -Wpedantic</code>，把警告当错误看（<code>-Werror</code>）。C 的很多坑编译器其实早就警告过，只是默认不说。'}
    ]},
    {id:'c-1-4',num:'1.4',title:'编译、链接与运行全过程',lead:'预处理 → 编译 → 汇编 → 链接，四步各做什么。',tags:['原理'],blocks:[
      {t:'table',head:['阶段','输入 → 输出','做了什么'],rows:[
        ['预处理','<code>.c → .i</code>','展开 <code>#include</code>、<code>#define</code>、条件编译、<code>#embed</code>'],
        ['编译','<code>.i → .s</code>','词法/语法/语义分析、优化，生成汇编'],
        ['汇编','<code>.s → .o</code>','<code>as</code> 生成可重定位目标文件'],
        ['链接','<code>.o + 库 → 可执行文件</code>','符号解析、重定位、合并段，默认链 libc']
      ]},
      {t:'code',lang:'Bash',x:'gcc -E main.c -o main.i      # 只看预处理结果\ngcc -S main.c -o main.s      # 看汇编\ngcc -c main.c -o main.o      # 只编译不链接\nnm main.o                    # 看符号表\ngcc main.o -o main           # 链接'},
      {t:'p',x:'<b>声明与定义的区别</b>贯穿全程：<code>extern int g;</code> 是声明（「别处有个 g」），<code>int g = 1;</code> 是定义（「在这里分配存储」）。头文件里只放声明，定义放在恰好一个 <code>.c</code> 里，否则链接期会报 <code>multiple definition</code>。'},
      {t:'note',k:'C23 的相关变化',x:'C23 起 <code>void f();</code> 就是无参数原型（不再是「参数未知」的旧式声明）；函数定义也不再允许 K&amp;R 形式 <code>int f(a) int a; {…}</code>。这让编译期能抓到更多参数错误。'}
    ]},
    {id:'c-1-5',num:'1.5',title:'数据类型与整数模型',lead:'整数、浮点、_BitInt、sizeof、转换规则。',tags:['类型'],blocks:[
      {t:'table',head:['类别','类型','典型宽度 / 说明'],rows:[
        ['字符','<code>char</code> <code>signed char</code> <code>unsigned char</code>','1 字节；普通 <code>char</code> 的符号由实现决定'],
        ['整数','<code>short</code> <code>int</code> <code>long</code> <code>long long</code>','常见 2/4/8/8 字节，用 <code>&lt;limits.h&gt;</code> 查'],
        ['精确宽度','<code>int8_t</code> … <code>uint64_t</code>','<code>&lt;stdint.h&gt;</code>，跨平台首选'],
        ['任意位宽','<code>_BitInt(N)</code> <code>unsigned _BitInt(N)</code>','<b>C23 新增</b>，如 <code>_BitInt(24)</code>'],
        ['浮点','<code>float</code> <code>double</code> <code>long double</code>','IEEE 754 常见 32/64/80 位'],
        ['布尔','<code>bool</code>','<b>C23 关键字</b>，值 <code>true</code>/<code>false</code>'],
        ['空指针字面量','<code>nullptr</code>','<b>C23 关键字</b>，类型 <code>nullptr_t</code>（&lt;stddef.h&gt;）'],
        ['字符扩展','<code>char8_t</code> <code>char16_t</code> <code>char32_t</code>','<code>&lt;uchar.h&gt;</code>，UTF-8/16/32']
      ]},
      {t:'code',lang:'C23',x:'#include <stdio.h>\n#include <stdint.h>\n#include <limits.h>\n\nint main(void) {\n    int32_t  a = 0b1010\'0110;        // C23：二进制 + 数字分隔符\n    _BitInt(24) b = 0xFFFFFF;        // C23：24 位整数\n    printf("int=%zu bytes, INT_MAX=%d\\n", sizeof(int), INT_MAX);\n    printf("a=%d, b=%d\\n", a, (int)b);\n    return 0;\n}'},
      {t:'p',x:'<b>整型提升</b>：<code>char/short</code> 参与运算时先提升为 <code>int</code>；<b>usual arithmetic conversions</b> 会把两边转成同一类型，规则大致是「小转大、有符号转无符号（同级时）」。有符号与无符号混用是经典 bug 来源：<code>-1 &lt; 1u</code> 的结果是 <b>false</b>，因为 <code>-1</code> 被转成了很大的 <code>unsigned</code>。'},
      {t:'note',k:'要点',x:'用 <code>size_t</code> 表示大小/下标，用 <code>ptrdiff_t</code> 表示指针差，用 <code>intN_t</code> 表示需要精确位宽的数据；打印 <code>size_t</code> 用 <code>%zu</code>。C23 的 <code>%b</code>/<code>%B</code> 可以直接打印二进制。'}
    ]},
    {id:'c-1-6',num:'1.6',title:'变量、常量与字面量',lead:'声明、初始化、作用域起点、const / constexpr / typeof。',tags:['数据'],blocks:[
      {t:'code',lang:'C23',x:'#include <stddef.h>\n\nint g = 1;                       // 全局变量：静态存储期\nextern int h;                    // 声明（定义在别的 .c）\nstatic int file_only = 2;        // 内部链接，仅本文件可见\n\nint main(void) {\n    int a;                       // 未初始化：值不确定（自动存储期）\n    int b = 10;                  // 初始化\n    const int c = 20;            // 只读对象，不是编译期常量\n    constexpr int N = 5;         // C23：编译期常量\n    int arr[N] = {};             // C23：空初始化器，全部置零\n    auto x = 3.14;               // C23：auto 类型推断 → double\n    typeof(b) y = b;             // C23：typeof 取 b 的类型 → int\n    int *p = nullptr;            // C23：空指针字面量\n    {\n        int a = 99;              // 遮蔽外层 a\n        (void)a;\n    }\n    static int counter = 0;      // 局部静态：只初始化一次，跨调用保持\n    (void)x; (void)y; (void)p; (void)c; (void)counter;\n    return 0;\n}'},
      {t:'ul',items:[
        '<b>C23 空初始化器</b> <code>{}</code>：把对象（含数组、结构体）全部零初始化，不必再写 <code>{0}</code>',
        '<code>const</code> 只保证「不通过这个名字改」，不等于编译期常量：<code>const int n = 5; int a[n];</code> 在文件作用域不是 VLA 也不是常量表达式（用 <code>constexpr</code> 或 <code>#define</code>）',
        '<code>constexpr</code>（C23）只能修饰对象，值必须是常量表达式，可用于数组长度、<code>case</code> 标签、位域宽度',
        '<code>auto</code>（C23）只从初始化器推断类型，不能用于函数参数/返回类型（那是 C++ 的能力）',
        '<code>static</code> 局部变量有静态存储期，默认零初始化，只初始化一次'
      ]},
      {t:'note',k:'字面量后缀',x:'<code>10U</code> unsigned、<code>10L</code> long、<code>10LL</code> long long、<code>3.14f</code> float、<code>3.14L</code> long double。C23 支持 <code>0b1010</code> 二进制与 <code>1\'000\'000</code> 数字分隔符（单引号只作视觉分组）。'}
    ]},
    {id:'c-1-7',num:'1.7',title:'运算符与表达式',lead:'优先级、求值顺序、短路、未定义行为。',tags:['运算'],blocks:[
      {t:'table',head:['优先级（高→低）','运算符'],rows:[
        ['1','<code>()</code> <code>[]</code> <code>.</code> <code>-&gt;</code> <code>++ --</code>(后缀) <code>(类型){…}</code> 复合字面量'],
        ['2','<code>++ --</code>(前缀) <code>+ -</code>(单目) <code>! ~</code> <code>*</code>(解引用) <code>&</code>(取址) <code>sizeof</code> <code>alignof</code> <code>_Generic</code>'],
        ['3–4','<code>* / %</code> → <code>+ -</code>'],
        ['5–8','<code>&lt;&lt; &gt;&gt;</code> → <code>&lt; &lt;= &gt; &gt;=</code> → <code>== !=</code> → <code>&</code>'],
        ['9–12','<code>^</code> → <code>|</code> → <code>&&</code> → <code>||</code>'],
        ['13','<code>?:</code>（三目）'],
        ['14','<code>= += -= *= /= %= &lt;&lt;= &gt;&gt;= &amp;= ^= |=</code>'],
        ['15','<code>,</code>（逗号）']
      ]},
      {t:'code',lang:'C23',x:'int a = 7, b = 2;\nprintf("%d %d %d\\n", a / b, a % b, a << 1);  // 3 1 14\n\n// 短路求值：&& 左侧为假则右侧不求值；|| 左侧为真则右侧不求值\nint *p = nullptr;\nif (p != nullptr && *p > 0) { /* 安全：不会解引用空指针 */ }\n\n// 三目运算符\nint m = a > b ? a : b;'},
      {t:'note',k:'最容易踩的坑',x:'<b>优先级不规定求值顺序。</b><code>f(i++, i++)</code>、<code>a[i] = i++</code> 这类表达式里对同一对象「无序列地多次修改」是未定义行为。C23 虽新增 <code>[[unsequenced]]</code>/<code>[[reproducible]]</code> 属性帮助编译器优化纯函数，但并没有放宽求值顺序规则。拿不准就拆成两条语句。'}
    ]},
    {id:'c-1-8',num:'1.8',title:'标准输入输出初步',lead:'printf / scanf 的格式、返回值与常见错误。',tags:['I/O'],blocks:[
      {t:'code',lang:'C23',x:'#include <stdio.h>\n\nint main(void) {\n    int age;\n    char name[32];\n    printf("姓名：");\n    if (scanf("%31s", name) != 1) return 1;   // 宽度限制防溢出\n    printf("年龄：");\n    if (scanf("%d", &age) != 1) return 1;     // 必须传地址\n    printf("%s 今年 %d 岁，二进制 %b\\n", name, age, age); // C23 %b\n    return 0;\n}'},
      {t:'table',head:['格式','含义'],rows:[
        ['<code>%d %u %ld %lld</code>','int / unsigned / long / long long'],
        ['<code>%zu</code>','<code>size_t</code>（sizeof、strlen 的返回类型）'],
        ['<code>%f %Lf %e %g</code>','double / long double / 科学计数 / 自动'],
        ['<code>%c %s</code>','单个字符 / 字符串（遇空白结束）'],
        ['<code>%p</code>','指针（实现定义格式，通常 0x…）'],
        ['<code>%x %o %b %B</code>','十六进制 / 八进制 / <b>C23 二进制（小写/大写）</b>'],
        ['<code>%%</code>','输出一个百分号']
      ]},
      {t:'note',k:'铁律',x:'① <code>scanf</code> 一定要检查返回值（成功匹配的项数）；② <code>%s</code> 必须写宽度如 <code>%31s</code>，否则就是缓冲区溢出漏洞；③ 格式串与参数类型必须严格对应，不匹配是 UB；④ 更稳的做法是用 <code>fgets</code> 读整行 + <code>strtol/sscanf</code> 解析（见 3.4）。'}
    ]},
    {id:'c-1-9',num:'1.9',title:'代码风格、注释与编译警告',lead:'把好习惯放在第一章，后面少踩一半的坑。',tags:['规范'],blocks:[
      {t:'code',lang:'C23 · 推荐骨架',x:'/* 文件说明：模块职责、作者、日期 */\n#include <stdio.h>\n#include <stdint.h>\n\n#define MAX_ITEMS 64        /* 宏名全大写，能加括号就加括号 */\n\ntypedef struct {            /* 类型名用 _t 或清晰名词 */\n    uint32_t id;\n    char     name[32];\n} Item;\n\nstatic int item_init(Item *it, uint32_t id) {\n    if (it == nullptr) return -1;   /* 入口校验 */\n    *it = (Item){ .id = id, .name = {} };  /* 复合字面量 + 指定初始化 */\n    return 0;\n}\n\nint main(void) {\n    Item it;\n    if (item_init(&it, 1) != 0) return 1;\n    printf("item %u\\n", it.id);\n    return 0;\n}'},
      {t:'ul',items:[
        '注释写「为什么」，代码本身说明「做什么」；<code>//</code> 与 <code>/* */</code> 都可用，注释不嵌套',
        '每个 <code>if/for/while</code> 都写大括号，哪怕只有一行；统一 4 空格缩进',
        '指针声明把 <code>*</code> 贴向变量名：<code>char *p, *q;</code>（避免误以为 <code>char* p, q</code> 里 q 也是指针）',
        '所有非 <code>extern</code> 的函数加 <code>static</code> 收窄链接范围；头文件用 include guard 或 <code>#pragma once</code>',
        '编译命令常驻 <code>-Wall -Wextra -Wpedantic -Wconversion -Wshadow</code>，CI 里加 <code>-Werror</code>'
      ]},
      {t:'note',k:'C23 小改进',x:'标签后面现在可以直接跟声明（<code>retry: int r = f();</code> 在 C17 里必须先写个空语句），写状态机时更顺手。'}
    ]}
  ]},

  /* ================= 第 2 章 ================= */
  {id:'c-2',num:'2',title:'C 语言中级',lead:'流程控制、函数、数组与字符串、指针、结构体、位运算——C 的主干全部在这里。',sections:[
    {id:'c-2-1',num:'2.1',title:'分支结构：if / switch',lead:'条件、悬空 else、switch 的穿透与 [[fallthrough]]。',tags:['控制流'],blocks:[
      {t:'code',lang:'C23',x:'#include <stdio.h>\n\nint grade(int s) {\n    if (s >= 90) return 4;\n    else if (s >= 60) return 2;   // 始终写大括号更稳妥\n    else return 0;\n}\n\nint main(void) {\n    int op = 2;\n    switch (op) {\n        case 1:\n            puts("add");\n            break;\n        case 2:\n            puts("sub");\n            [[fallthrough]];        // C23 属性：明确表示故意穿透\n        case 3:\n            puts("common tail");\n            break;\n        default:\n            puts("unknown");\n    }\n    return 0;\n}'},
      {t:'ul',items:[
        'C 里<b>任何非 0 值都为真</b>，指针判断写 <code>if (p)</code>；但显式写 <code>if (p != nullptr)</code> 更清楚',
        '<code>switch</code> 的 <code>case</code> 标签必须是<b>整型常量表达式</b>（C23 起可以是 <code>constexpr</code> 对象）',
        '漏写 <code>break</code> 会「穿透」到下一个 case；C23 用 <code>[[fallthrough]];</code> 告诉编译器与读者这是故意的',
        '悬空 else 永远配对最近的未匹配 <code>if</code>——靠大括号消除歧义'
      ]}
    ]},
    {id:'c-2-2',num:'2.2',title:'循环结构：while / do / for',lead:'C23 允许标签后直接声明，for 的声明作用域。',tags:['控制流'],blocks:[
      {t:'code',lang:'C23',x:'#include <stdio.h>\n\nint main(void) {\n    int i = 0;\n    while (i < 3) { printf("w:%d ", i); ++i; }\n\n    do { --i; } while (i > 0);        // 至少执行一次\n\n    for (int j = 0; j < 3; ++j) {     // j 的作用域只在 for 内\n        if (j == 1) continue;\n        printf("f:%d ", j);\n    }\n\n    // C23：标签后可直接跟声明\n    retry: int r = 0;\n    (void)r;\n    return 0;\n}'},
      {t:'note',k:'数组遍历惯用法',x:'<code>for (size_t i = 0; i &lt; n; ++i)</code> 用 <code>size_t</code> 与元素个数配对；<b>倒序</b>不要写 <code>for (size_t i = n-1; i &gt;= 0; --i)</code>（无符号永远 ≥0，死循环），改成 <code>for (size_t i = n; i-- &gt; 0; )</code>。'}
    ]},
    {id:'c-2-3',num:'2.3',title:'函数：定义、声明、参数与返回值',lead:'C23 起 f() 就是无参数；一切传参都是按值。',tags:['函数'],blocks:[
      {t:'code',lang:'C23',x:'#include <stdio.h>\n\n/* 原型：声明放头文件，定义放 .c */\nstatic int add(int a, int b);\n\n[[nodiscard]] static int add(int a, int b) {  // C23 属性：别忽略返回值\n    return a + b;\n}\n\n/* 「修改调用者的变量」只能靠指针：传地址，函数内解引用 */\nstatic void inc(int *p) { if (p) ++*p; }\n\nint main(void) {\n    int x = 1;\n    inc(&x);\n    printf("%d %d\\n", x, add(2, 3));   // 2 5\n    return 0;\n}'},
      {t:'ul',items:[
        'C <b>只有按值传参</b>：所谓「传引用」是把指针的值复制进去；数组作为形参会<b>退化</b>为指向首元素的指针，所以必须另传长度',
        '<code>void f();</code> 在 C23 中等于 <code>void f(void);</code>；老式「参数未指定」的写法已移除',
        '<code>[[nodiscard]]</code>（C23）让编译器对忽略返回值报警；<code>[[noreturn]]</code> 标注不返回的函数',
        '没有返回值的函数用 <code>void</code>；非 void 函数所有路径都要有 return，否则是 UB',
        '函数不能嵌套定义（标准 C），也不能返回局部数组的地址'
      ]},
      {t:'note',k:'main 的合法形式',x:'<code>int main(void)</code> 或 <code>int main(int argc, char **argv)</code>（及等价写法）。实现还可提供第三个 <code>envp</code> 参数，但不是标准。'}
    ]},
    {id:'c-2-4',num:'2.4',title:'数组与多维数组',lead:'连续内存、指定初始化、C23 空初始化与 VLA 的可选化。',tags:['数据'],blocks:[
      {t:'code',lang:'C23',x:'#include <stdio.h>\n\nint main(void) {\n    int a[5] = {1, 2, 3};           // 其余元素自动为 0\n    int b[]  = {1, 2, 3, 4};        // 编译器推断长度 4\n    int c[5] = {};                  // C23：空初始化器，全 0\n    int d[3][4] = { [1][2] = 7 };   // 指定初始化器\n    int e[4] = { [0] = 10, [3] = 40, [2] = 30 };\n\n    size_t n = sizeof a / sizeof a[0];   // 求元素个数的惯用法（仅数组作用域内有效）\n    printf("n=%zu d[1][2]=%d e[3]=%d\\n", n, d[1][2], e[3]);\n    return 0;\n}'},
      {t:'p',x:'多维数组在内存里是<b>行优先</b>连续排布：<code>a[i][j]</code> 等价于 <code>*(*(a+i)+j)</code> 也就是 <code>a[i*列数+j]</code>。作为函数参数时只有第一维可省略：<code>void f(int a[][4], size_t rows)</code> 等价于 <code>void f(int (*a)[4], size_t rows)</code>。'},
      {t:'note',k:'C23 与 VLA',x:'变长数组（VLA，长度是运行时变量）在 <b>C23 中变为可选特性</b>，实现可定义 <code>__STDC_NO_VLA__</code> 表示不支持；带 VM 类型的参数仍被要求支持。工程代码更推荐「指针 + 长度」或 <code>malloc</code>，别把大数组放栈上。'}
    ]},
    {id:'c-2-5',num:'2.5',title:'字符串与 <string.h>',lead:'C 没有字符串类型，只有以 \\0 结尾的 char 数组。',tags:['字符串'],blocks:[
      {t:'code',lang:'C23',x:'#include <stdio.h>\n#include <string.h>\n#include <stdlib.h>\n\nint main(void) {\n    char s1[] = "hello";        // 数组，含结尾 \'\\0\'，sizeof = 6\n    const char *s2 = "hello";   // 指向字符串字面量，只读\n    char buf[16] = {};\n\n    strncpy(buf, s1, sizeof buf - 1);   // 留一格给 \'\\0\'\n    strncat(buf, "!", sizeof buf - strlen(buf) - 1);\n    printf("%s len=%zu\\n", buf, strlen(buf));\n    printf("cmp=%d\\n", strcmp(s1, s2));\n\n    // C23 把 POSIX 的 strdup/strndup 收进 <string.h>\n    char *copy = strdup(buf);\n    if (copy) { puts(copy); free(copy); }\n    return 0;\n}'},
      {t:'table',head:['函数','作用','注意'],rows:[
        ['<code>strlen / strcmp / strncmp</code>','长度 / 比较','不含结尾 \\0；比较按 unsigned char 逐字节'],
        ['<code>strcpy / strncpy</code>','复制','<code>strcpy</code> 不检查长度，优先用 <code>strncpy</code> 或 <code>snprintf</code>'],
        ['<code>strcat / strncat</code>','拼接','同样注意目标缓冲区'],
        ['<code>strchr / strstr / strtok</code>','查找 / 切分','<code>strtok</code> 会改原串且不可重入，用 <code>strtok_r</code>(POSIX)'],
        ['<code>memcpy / memmove</code>','内存复制','区间重叠必须用 <code>memmove</code>'],
        ['<code>strdup / strndup</code>','分配并复制','<b>C23 新收录</b>，返回的内存要 <code>free</code>'],
        ['<code>memset_explicit</code>','安全清零','<b>C23 新增</b>，编译器不得优化掉，用于擦除密钥']
      ]},
      {t:'note',k:'铁律',x:'字符串字面量是只读的，<code>char *p = "abc"; p[0]=\'x\';</code> 是 UB；写成 <code>const char *</code> 让编译器替你拦住。<code>sizeof(s1)</code> 是数组大小，<code>sizeof(s2)</code> 是指针大小——别混。'}
    ]},
    {id:'c-2-6',num:'2.6',title:'指针基础',lead:'地址、解引用、const 位置、void* 与 nullptr。',tags:['指针'],blocks:[
      {t:'code',lang:'C23',x:'#include <stdio.h>\n#include <stddef.h>\n\nint main(void) {\n    int x = 42;\n    int *p = &x;             // p 保存 x 的地址\n    printf("x=%d *p=%d p=%p\\n", x, *p, (void *)p);\n    *p = 100;                // 通过指针改 x\n    printf("x=%d\\n", x);\n\n    const int *q = &x;      // 指向 const：不能经 q 改\n    int *const r = &x;      // const 指针：r 不能再指向别处\n    const int *const s = &x;\n\n    int *n = nullptr;        // C23 空指针字面量\n    (void)q;(void)r;(void)s;(void)n;\n    return 0;\n}'},
      {t:'ul',items:[
        '<code>&amp;</code> 取地址、<code>*</code> 解引用；<code>int *p;</code> 里 <code>*</code> 属于声明符，不是对 p 解引用',
        '<code>const</code> 在 <code>*</code> 左边修饰<b>被指对象</b>，在右边修饰<b>指针本身</b>：从右往左读声明',
        '<code>void *</code> 是通用指针：可与其他对象指针隐式互转（C 里不需要显式强转），但<b>不能解引用、不能做指针算术</b>',
        '<code>NULL</code> 仍是宏（通常是 <code>((void*)0)</code> 或 0）；C23 推荐 <code>nullptr</code>，它有专门的 <code>nullptr_t</code> 类型，不会与整数 0 混淆',
        '未初始化指针（野指针）、指向已释放内存（悬垂指针）、函数返回局部变量地址——三大经典错误'
      ]},
      {t:'note',k:'调试建议',x:'声明时立刻初始化（<code>int *p = nullptr;</code>），<code>free(p)</code> 后马上 <code>p = nullptr;</code>；用 AddressSanitizer（<code>-fsanitize=address</code>）能在运行期抓到绝大多数指针错误，见 6.4。'}
    ]},
    {id:'c-2-7',num:'2.7',title:'指针与数组、指针运算',lead:'a[i] 就是 *(a+i)，数组名在多数场合退化为指针。',tags:['指针'],blocks:[
      {t:'code',lang:'C23',x:'#include <stdio.h>\n\nint main(void) {\n    int a[5] = {10, 20, 30, 40, 50};\n    int *p = a;              // 等价于 &a[0]\n    printf("%d %d %d\\n", a[2], *(a + 2), *(p + 2));  // 都是 30\n    printf("diff=%td\\n", &a[4] - &a[0]);              // 4，ptrdiff_t 用 %td\n\n    for (int *it = a; it != a + 5; ++it) printf("%d ", *it);\n    putchar(\'\\n\');\n\n    int (*row)[5] = &a;      // 指向「含 5 个 int 的数组」的指针\n    printf("%d\\n", (*row)[3]);\n    return 0;\n}'},
      {t:'ul',items:[
        '<b>指针加减以「所指向类型的大小」为单位</b>：<code>p+1</code> 对 <code>int*</code> 前进 4 字节，对 <code>char*</code> 前进 1 字节',
        '只有指向同一数组（含末尾后一位）的指针相减才有定义，结果类型是 <code>ptrdiff_t</code>',
        '<code>sizeof</code> 数组名、<code>&amp;数组名</code>、字符串字面量初始化数组时<b>不退化</b>；作为函数参数、参与算术时退化',
        '<code>int *p</code> 与 <code>int (*p)[5]</code> 完全不同：后者 +1 会跨过 20 字节'
      ]},
      {t:'note',k:'别名规则（strict aliasing）',x:'通过不兼容类型的指针访问对象是 UB（<code>char*</code> 可例外查看任意对象字节）。例如把 <code>float*</code> 强转成 <code>int*</code> 再解引用是错的；需要按位重解释请用 <code>memcpy</code>，编译器会优化成一次寄存器搬移。'}
    ]},
    {id:'c-2-8',num:'2.8',title:'作用域、链接与存储期',lead:'四个存储期 + 三种链接，决定变量活多久、谁能看见。',tags:['模型'],blocks:[
      {t:'table',head:['存储期','写法','生命周期'],rows:[
        ['自动','函数内普通局部变量（含 <code>register</code> 建议）','进入块到离开块'],
        ['静态','全局变量、<code>static</code> 局部、<code>static</code> 全局','程序整个运行期，默认零初始化'],
        ['线程','<code>thread_local</code>（C23 关键字，旧名 <code>_Thread_local</code>）','每个线程一份'],
        ['分配','<code>malloc/calloc/realloc</code>','从分配到 <code>free</code>']
      ]},
      {t:'table',head:['链接','写法','可见范围'],rows:[
        ['外部链接','文件作用域非 <code>static</code> 的函数/对象','整个程序，可跨 .c（配 <code>extern</code> 声明）'],
        ['内部链接','文件作用域加 <code>static</code>','仅本翻译单元'],
        ['无链接','块作用域变量、函数参数','仅本块']
      ]},
      {t:'code',lang:'C23',x:'#include <threads.h>\n\nthread_local int per_thread_counter = 0;  // C23 关键字\nstatic int file_scope = 1;               // 内部链接\n\nstatic void f(void) {\n    static int calls = 0;                // 静态存储期，只初始化一次\n    ++calls;\n}'},
      {t:'note',k:'要点',x:'全局名字尽量加 <code>static</code> 收窄可见性；跨文件共享的全局对象在<b>唯一一个 .c 里定义</b>、头文件里写 <code>extern</code> 声明。C23 把 <code>thread_local</code>、<code>alignas</code>、<code>alignof</code>、<code>static_assert</code>、<code>bool</code>、<code>true</code>、<code>false</code>、<code>nullptr</code> 都变成不需要头文件的普通关键字。'}
    ]},
    {id:'c-2-9',num:'2.9',title:'结构体、位域与柔性数组',lead:'自定义类型、内存布局、指定初始化。',tags:['复合类型'],blocks:[
      {t:'code',lang:'C23',x:'#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\ntypedef struct {\n    unsigned id    : 8;      // 位域：只占 8 位\n    unsigned flags : 4;\n    double  score;\n} Record;\n\ntypedef struct {\n    size_t len;\n    char   data[];           // 柔性数组成员：必须是最后一个成员\n} Packet;\n\nint main(void) {\n    Record r = { .id = 7, .flags = 3, .score = 95.5 };  // 指定初始化\n    printf("sizeof=%zu id=%u\\n", sizeof r, r.id);\n\n    Packet *p = malloc(sizeof *p + 16);\n    if (!p) return 1;\n    p->len = 5;\n    memcpy(p->data, "hello", 5);\n    printf("%.*s\\n", (int)p->len, p->data);\n    free(p);\n    return 0;\n}'},
      {t:'ul',items:[
        '<code>struct</code> 成员按声明顺序排布，中间可能插入<b>填充字节</b>（对齐），所以 <code>sizeof</code> 常大于各成员之和；用 <code>alignof</code>/<code>_Alignof</code> 与 <code>offsetof</code>（&lt;stddef.h&gt;）查看',
        'C23 允许<b>匿名结构体/联合体</b>成员，少写一层名字',
        '<b>位域</b>的类型只能是 <code>int/unsigned int/bool/_BitInt</code> 等整型；它的布局（位序、跨单元行为）是实现定义的，做协议解析要谨慎',
        '<b>柔性数组</b>配合一次 <code>malloc(sizeof *p + n)</code> 使用，比「指针 + 二次分配」更省一次分配、内存更连续',
        '结构体可以整体赋值与按值传参（大结构体建议传指针）'
      ]}
    ]},
    {id:'c-2-10',num:'2.10',title:'联合体、枚举与 C23 底层类型',lead:'同一块内存的不同解释，以及能指定底层类型的枚举。',tags:['复合类型'],blocks:[
      {t:'code',lang:'C23',x:'#include <stdio.h>\n#include <stdint.h>\n\ntypedef union {\n    uint32_t u;\n    float    f;\n    uint8_t  b[4];\n} Bits;\n\n// C23：枚举可指定底层类型，不再由编译器随便挑\nenum Color : uint8_t { RED = 1, GREEN = 2, BLUE = 0xFF };\n\nint main(void) {\n    Bits x = { .f = 1.0f };\n    printf("1.0f as hex = %08x\\n", x.u);   // 按位重解释\n    enum Color c = BLUE;\n    printf("sizeof(enum Color)=%zu value=%u\\n", sizeof c, c);\n    return 0;\n}'},
      {t:'p',x:'<code>union</code> 所有成员共用起始地址，大小等于最大成员（按对齐补齐）。写 <code>.f</code> 再读 <code>.u</code> 属于<b>按位重解释</b>，在 C 里允许（不同于 strict aliasing 的指针场景），常用来观察浮点位模式。'},
      {t:'note',k:'C23 枚举改进',x:'C17 的枚举底层类型由实现选择且枚举常量必须是 <code>int</code>；<b>C23 允许 <code>enum E : 类型 { … }</code></b> 显式指定底层类型，也允许枚举常量超出 <code>int</code> 范围（前提是能放进底层类型）。这对嵌入式和协议字段非常实用。'}
    ]},
    {id:'c-2-11',num:'2.11',title:'位运算与常用技巧',lead:'掩码、置位、清位、判 2 的幂、位计数。',tags:['技巧'],blocks:[
      {t:'code',lang:'C23',x:'#include <stdio.h>\n#include <stdint.h>\n#include <stdbit.h>   // C23 位工具库\n\n#define BIT(n)       (1u << (n))\n#define SET(x, n)    ((x) |=  BIT(n))\n#define CLEAR(x, n)  ((x) &= ~BIT(n))\n#define TOGGLE(x, n) ((x) ^=  BIT(n))\n#define TEST(x, n)   (((x) >> (n)) & 1u)\n\nint main(void) {\n    uint32_t flags = 0;\n    SET(flags, 3); SET(flags, 7);\n    printf("flags=%b\\n", flags);                    // C23 %b 二进制输出\n    TOGGLE(flags, 3);\n    printf("leading zeros=%u popcount=%u\\n",\n           stdc_leading_zeros_uc((unsigned char)0x08),\n           stdc_popcount_uint(flags));               // C23 <stdbit.h>\n    printf("is power of 2: %d\\n", flags && !(flags & (flags - 1)));\n    return 0;\n}'},
      {t:'ul',items:[
        '<code>&amp;</code> 取位、<code>|</code> 置位、<code>^</code> 翻转、<code>~</code> 取反、<code>&lt;&lt; &gt;&gt;</code> 移位；掩码一律用<b>无符号</b>类型避免符号扩展坑',
        '对有符号负数右移、左移到符号位、移位数 ≥ 位宽都是<b>实现定义 / 未定义</b>',
        '<code>flags &amp;= ~BIT(n)</code> 清位；<code>x &amp; (x-1)</code> 消掉最低位的 1，可判 2 的幂、可数 1 的个数',
        'C23 <code>&lt;stdbit.h&gt;</code> 提供 <code>stdc_popcount_*</code>、<code>stdc_leading_zeros_*</code>、<code>stdc_trailing_zeros_*</code>、<code>stdc_bit_floor/ceil</code>、<code>stdc_has_single_bit</code> 等，不必再手写内建函数'
      ]},
      {t:'note',k:'宏的括号',x:'位运算宏里每个参数和整体都必须加括号：<code>#define BIT(n) (1u &lt;&lt; (n))</code>。否则 <code>BIT(1|2)</code> 会因优先级出错。C23 里更推荐用 <code>constexpr</code> + <code>static inline</code> 函数代替函数式宏。'}
    ]}
  ]},

  /* ================= 第 3 章 ================= */
  {id:'c-3',num:'3',title:'C 语言进阶',lead:'动态内存、函数指针、文件 I/O、预处理器、多文件工程——从这里开始写「真正的程序」。',sections:[
    {id:'c-3-1',num:'3.1',title:'动态内存管理',lead:'malloc / calloc / realloc / free，以及所有权纪律。',tags:['内存'],blocks:[
      {t:'code',lang:'C23',x:'#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nint main(void) {\n    size_t n = 4;\n    int *a = malloc(n * sizeof *a);       // 未初始化\n    if (a == nullptr) return 1;           // 必须检查失败\n\n    int *b = calloc(n, sizeof *b);        // 已清零\n    if (!b) { free(a); return 1; }\n\n    for (size_t i = 0; i < n; ++i) a[i] = (int)i * i;\n\n    int *tmp = realloc(a, 8 * sizeof *a); // 扩容：不要直接赋回原指针\n    if (!tmp) { free(a); free(b); return 1; }  // 失败时原块仍有效\n    a = tmp;\n\n    memcpy(b, a, 4 * sizeof *b);\n    for (size_t i = 0; i < 4; ++i) printf("%d ", b[i]);\n    putchar(\'\\n\');\n\n    free(a); a = nullptr;                 // 释放后立即置空\n    free(b); b = nullptr;\n    return 0;\n}'},
      {t:'ul',items:[
        '<code>sizeof *a</code> 比 <code>sizeof(int)</code> 更稳：改类型时不用改分配语句',
        '<code>realloc</code> 失败返回 <code>nullptr</code> 且<b>原内存仍有效</b>，务必用临时指针接收',
        '<code>free(nullptr)</code> 是安全的（什么都不做）；<code>free</code> 非 malloc 得到的指针、重复 free、访问已释放内存都是 UB',
        'C23 的 <code>free_sized</code> / <code>free_aligned_sized</code>（若实现提供）可把尺寸信息交给分配器，配合 <code>sizeof</code> 与对齐分配使用'
      ]},
      {t:'note',k:'所有权',x:'每个分配都有唯一负责 <code>free</code> 的一方，写进注释或命名约定（如 <code>xxx_create/xxx_destroy</code> 成对）。数组、链表这类结构要写清楚「谁拥有节点、谁只借用指针」。'}
    ]},
    {id:'c-3-2',num:'3.2',title:'函数指针与回调',lead:'把函数当数据传：qsort、状态机、策略表。',tags:['进阶'],blocks:[
      {t:'code',lang:'C23',x:'#include <stdio.h>\n#include <stdlib.h>\n\ntypedef int (*Cmp)(const void *, const void *);  // 函数指针类型\n\nstatic int cmp_int(const void *a, const void *b) {\n    int x = *(const int *)a, y = *(const int *)b;\n    return (x > y) - (x < y);                     // 避免 x-y 溢出\n}\n\nstatic int apply(int (*f)(int, int), int a, int b) { return f(a, b); }\nstatic int add(int a, int b) { return a + b; }\nstatic int mul(int a, int b) { return a * b; }\n\nint main(void) {\n    int v[] = {5, 1, 9, 3};\n    qsort(v, 4, sizeof v[0], cmp_int);\n    for (int i = 0; i < 4; ++i) printf("%d ", v[i]);\n    putchar(\'\\n\');\n\n    Cmp fp = cmp_int;               // 用 typedef 更清晰\n    (void)fp;\n    printf("%d %d\\n", apply(add, 2, 3), apply(mul, 2, 3));\n\n    // 策略表：用数组索引选择行为\n    int (*ops[])(int, int) = { add, mul };\n    printf("%d\\n", ops[1](6, 7));\n    return 0;\n}'},
      {t:'p',x:'声明读法：<code>int (*f)(int, int)</code> 是「指向接收两个 int、返回 int 的函数的指针」；<code>int *f(int,int)</code> 是「返回 int* 的函数」——括号位置决定一切。用 <code>typedef</code> 或 <code>typeof</code> 简化后可读性大幅提升。'},
      {t:'note',k:'要点',x:'函数指针没有捕获环境，需要上下文时传一个 <code>void *ctx</code> 参数（<code>qsort_r</code>、线程入口、事件回调都是这个套路）。不同函数指针类型之间强转后调用是 UB，签名要严格一致。'}
    ]},
    {id:'c-3-3',num:'3.3',title:'复杂声明、typedef 与 C23 typeof',lead:'从右往左读声明，再用 typedef 和 typeof 把它变简单。',tags:['进阶'],blocks:[
      {t:'table',head:['声明','含义'],rows:[
        ['<code>int *p[5]</code>','5 个 <code>int*</code> 组成的数组'],
        ['<code>int (*p)[5]</code>','指向「5 个 int 的数组」的指针'],
        ['<code>int *f(void)</code>','返回 <code>int*</code> 的函数'],
        ['<code>int (*f)(void)</code>','指向「无参返回 int 的函数」的指针'],
        ['<code>int (*const a[3])(int)</code>','3 个「不可改指向的函数指针」组成的数组']
      ]},
      {t:'code',lang:'C23',x:'#include <stdio.h>\n\ntypedef int Arr[5];                  // 给数组类型起名\ntypedef int (*Callback)(void *);     // 给函数指针起名\n\n#define SWAP(a, b) do { typeof(a) _t = (a); (a) = (b); (b) = _t; } while (0)\n\nint main(void) {\n    Arr x = {1,2,3,4,5};\n    int  n = 3;\n    typeof(n) m = n;                  // m 与 n 同类型\n    typeof_unqual(+m) plain = m;     // 去掉 const/volatile/原子限定\n    SWAP(n, m);                      // 类型安全的泛型交换宏\n    printf("%d %d %d\\n", x[4], n, plain);\n    return 0;\n}'},
      {t:'p',x:'<code>typeof(expr)</code>（C23）取得表达式的<b>类型</b>（不求值），<code>typeof_unqual</code> 再去掉 <code>const/volatile/_Atomic</code> 限定。这让宏可以做到以前只有 GNU <code>__typeof__</code> 才能做的类型泛型，且是标准写法。'},
      {t:'note',k:'typedef vs #define',x:'<code>typedef char *Str;</code> 后 <code>Str a, b;</code> 两个都是指针；<code>#define Str char *</code> 展开成 <code>char *a, b;</code>，b 只是 char。类型别名一律用 <code>typedef</code>。'}
    ]},
    {id:'c-3-4',num:'3.4',title:'文件 I/O：<stdio.h>',lead:'文本流、二进制、定位、以及更稳的「读整行再解析」。',tags:['文件'],blocks:[
      {t:'code',lang:'C23',x:'#include <stdio.h>\n#include <stdlib.h>\n\nint main(void) {\n    FILE *fp = fopen("data.txt", "w");\n    if (!fp) { perror("fopen"); return 1; }\n    fprintf(fp, "%s %d\\n", "answer", 42);\n    fclose(fp);\n\n    fp = fopen("data.txt", "r");\n    if (!fp) { perror("fopen"); return 1; }\n    char line[256];\n    while (fgets(line, sizeof line, fp)) {   // 读整行，永不溢出\n        char key[64]; int val;\n        if (sscanf(line, "%63s %d", key, &val) == 2)\n            printf("%s=%d\\n", key, val);\n    }\n    if (ferror(fp)) { perror("read"); }\n    fclose(fp);\n\n    // 二进制与定位\n    fp = fopen("nums.bin", "wb");\n    int arr[3] = {1,2,3};\n    fwrite(arr, sizeof arr[0], 3, fp);\n    fclose(fp);\n    return 0;\n}'},
      {t:'table',head:['函数 / 模式','说明'],rows:[
        ['<code>fopen</code>','<code>"r" "w" "a"</code> 文本；加 <code>"b"</code> 为二进制；<code>"r+" "w+"</code> 读写'],
        ['<code>fprintf / fscanf</code>','格式化读写，<code>fscanf</code> 同样要查返回值'],
        ['<code>fgets / fputs</code>','按行读写，最推荐的文本输入方式'],
        ['<code>fread / fwrite</code>','二进制块读写，返回成功读写的元素数'],
        ['<code>fseek / ftell / rewind</code>','定位；大文件用 <code>fgetpos/fsetpos</code>'],
        ['<code>fflush / fclose</code>','刷缓冲 / 关闭（返回 EOF 表示写失败，如磁盘满）'],
        ['<code>perror / feof / ferror</code>','打印 errno 对应消息 / 判结束 / 判错误']
      ]},
      {t:'note',k:'C23 相关',x:'<code>printf/scanf</code> 新增 <code>%b/%B</code> 二进制格式与 <code>%wN/%wfN</code> 指定宽度整数参数；<code>fopen</code> 的 <code>"x"</code> 独占创建模式来自 C11。文本与二进制的差别主要在换行转换（Windows 上 <code>\\n ↔ \\r\\n</code>）。'}
    ]},
    {id:'c-3-5',num:'3.5',title:'预处理器与宏',lead:'#include、对象式/函数式宏、条件编译、C23 的 #embed 与 #warning。',tags:['预处理'],blocks:[
      {t:'code',lang:'C23',x:'#include <stdio.h>\n#include "myheader.h"       // 先找当前目录\n\n#define VERSION "1.0"\n#define MAX(a, b) ((a) > (b) ? (a) : (b))\n#define LOG(fmt, ...) fprintf(stderr, "[%s:%d] " fmt "\\n", __FILE__, __LINE__ __VA_OPT__(,) __VA_ARGS__)\n\n#ifndef NDEBUG\n#warning "这是调试构建，别发布"     // C23 新增 #warning\n#endif\n\n// C23：把二进制文件直接嵌入为初始化列表\nstatic const unsigned char icon[] = {\n    #embed "icon.png" limit(16)     // 只取前 16 字节\n};\n\nint main(void) {\n    LOG("start %s", VERSION);\n    printf("max=%d icon[0]=%u\\n", MAX(3, 7), icon[0]);\n    return 0;\n}'},
      {t:'ul',items:[
        '<b>对象式宏</b> <code>#define PI 3.14</code>；<b>函数式宏</b>务必给每个参数与整体加括号，多语句宏用 <code>do { … } while (0)</code> 包起来',
        '<code>#</code> 字符串化、<code>##</code> 记号粘贴、<code>__VA_ARGS__</code> 变参；C23 标准化 <code>__VA_OPT__(,)</code>，解决「变参为空时逗号多余」',
        '<b>条件编译</b> <code>#if/#ifdef/#ifndef/#elif/#else/#endif</code>；头文件守卫或 <code>#pragma once</code>（非标准但普遍支持）',
        '预定义宏：<code>__FILE__ __LINE__ __func__ __DATE__ __TIME__ __STDC_VERSION__</code>（C23 为 <code>202311L</code>）, <code>__STDC_NO_VLA__</code> 等特性测试宏',
        '<b>C23 <code>#embed</code></b>：把文件内容变成逗号分隔的整数初始化列表，支持 <code>limit()</code>、<code>prefix()</code>、<code>suffix()</code>、<code>if_empty()</code> 参数，替代 <code>xxd -i</code>'
      ]},
      {t:'note',k:'宏的代价',x:'宏没有类型检查、参数可能被求值多次（<code>MAX(i++, j++)</code> 会出错）、调试器看不到。C23 里优先用 <code>static inline</code> 函数 + <code>constexpr</code> + <code>typeof</code> 泛型宏，把宏限制在「必须操作记号」的场合。'}
    ]},
    {id:'c-3-6',num:'3.6',title:'多文件工程与头文件设计',lead:'接口放 .h，实现放 .c，链接器把它们拼起来。',tags:['工程'],blocks:[
      {t:'code',lang:'C23 · vec.h',x:'#ifndef VEC_H\n#define VEC_H\n#include <stddef.h>\n#ifdef __cplusplus\nextern "C" {\n#endif\n\ntypedef struct Vec Vec;             // 不透明类型，隐藏实现\nVec *vec_create(size_t cap);\nvoid vec_destroy(Vec *v);\nint  vec_push(Vec *v, int x);\nsize_t vec_len(const Vec *v);\n\n#ifdef __cplusplus\n}\n#endif\n#endif /* VEC_H */'},
      {t:'code',lang:'C23 · vec.c',x:'#include "vec.h"\n#include <stdlib.h>\n\nstruct Vec { int *data; size_t len, cap; };\n\nVec *vec_create(size_t cap) {\n    Vec *v = malloc(sizeof *v);\n    if (!v) return nullptr;\n    v->data = malloc(cap * sizeof *v->data);\n    if (!v->data && cap) { free(v); return nullptr; }\n    v->len = 0; v->cap = cap;\n    return v;\n}\nvoid vec_destroy(Vec *v) { if (v) { free(v->data); free(v); } }\nint vec_push(Vec *v, int x) {\n    if (!v || v->len == v->cap) return -1;\n    v->data[v->len++] = x; return 0;\n}\nsize_t vec_len(const Vec *v) { return v ? v->len : 0; }'},
      {t:'ul',items:[
        '头文件只放<b>类型声明、函数原型、宏、extern 声明</b>；定义放 .c，避免 <code>multiple definition</code>',
        '<b>不透明类型</b>（<code>typedef struct Vec Vec;</code>）把结构布局藏在 .c 里，改实现不用重编所有调用方',
        '每个 .c 都包含自己的 .h，让编译器检查声明与定义是否一致',
        '<code>static</code> 收窄内部函数；需要给 C++ 调用时加 <code>extern "C"</code> 包裹',
        '编译：<code>gcc -c vec.c -o vec.o</code> + <code>gcc -c main.c -o main.o</code> + <code>gcc vec.o main.o -o app</code>'
      ]}
    ]},
    {id:'c-3-7',num:'3.7',title:'命令行参数、环境与退出',lead:'argc/argv、getenv、exit 与 atexit。',tags:['系统'],blocks:[
      {t:'code',lang:'C23',x:'#include <stdio.h>\n#include <stdlib.h>\n\nstatic void cleanup(void) { puts("bye (atexit)"); }\n\nint main(int argc, char **argv) {\n    atexit(cleanup);\n    for (int i = 0; i < argc; ++i) printf("argv[%d]=%s\\n", i, argv[i]);\n    const char *home = getenv("HOME");\n    printf("HOME=%s\\n", home ? home : "(unset)");\n    if (argc < 2) { fprintf(stderr, "用法: %s <名字>\\n", argv[0]); return 2; }\n    // strtol 比 atoi 更安全：能检查尾部与溢出\n    char *end; long n = strtol(argv[1], &end, 10);\n    if (*end != \'\\0\') { fputs("不是整数\\n", stderr); return 2; }\n    printf("n=%ld\\n", n);\n    return 0;\n}'},
      {t:'note',k:'要点',x:'<code>argv[argc]</code> 保证是空指针；<code>argv[0]</code> 是程序名（不保证是绝对路径）。<code>exit(n)</code> 会刷缓冲、调用 <code>atexit</code> 注册的函数；<code>_Exit(n)</code> 立即终止。返回 <code>EXIT_SUCCESS/EXIT_FAILURE</code> 比裸 0/1 更清楚。C23 起 <code>&lt;stdlib.h&gt;</code> 还新收了 <code>strdup</code> 之外的一些实用函数，但 <code>setenv/putenv</code> 仍是 POSIX。'}
    ]},
    {id:'c-3-8',num:'3.8',title:'C23 标准库全景',lead:'按头文件分组速查，知道「该去哪找」。',tags:['速查'],blocks:[
      {t:'table',head:['头文件','提供什么'],rows:[
        ['<code>&lt;stdio.h&gt;</code>','<code>printf/scanf</code>、<code>fopen/fread/fwrite</code>、<code>snprintf</code>'],
        ['<code>&lt;stdlib.h&gt;</code>','<code>malloc/free</code>、<code>exit/atexit</code>、<code>qsort/bsearch</code>、<code>strtol/rand</code>'],
        ['<code>&lt;string.h&gt;</code>','<code>memcpy/memmove/memset</code>、<code>strlen/strcmp/strdup</code>、<b>C23 <code>memset_explicit</code></b>'],
        ['<code>&lt;stdint.h&gt; &lt;limits.h&gt; &lt;stddef.h&gt;</code>','精确宽度整数、类型极限、<code>size_t/ptrdiff_t/nullptr_t/offsetof</code>'],
        ['<code>&lt;stdbool.h&gt;</code>','C23 起只剩兼容用途（bool 已是关键字）'],
        ['<code>&lt;stdckdint.h&gt;</code>','<b>C23 新增</b>：<code>ckd_add/ckd_sub/ckd_mul</code> 溢出检查'],
        ['<code>&lt;stdbit.h&gt;</code>','<b>C23 新增</b>：popcount / 前导零 / 位宽工具'],
        ['<code>&lt;stdalign.h&gt; &lt;stdatomic.h&gt; &lt;threads.h&gt;</code>','对齐、原子操作、线程（C11 起）'],
        ['<code>&lt;math.h&gt; &lt;complex.h&gt; &lt;tgmath.h&gt;</code>','数学函数、复数、泛型数学宏'],
        ['<code>&lt;time.h&gt; &lt;locale.h&gt; &lt;wchar.h&gt; &lt;uchar.h&gt;</code>','时间/本地化/宽字符/<b>C23 <code>char8_t</code></b>'],
        ['<code>&lt;assert.h&gt; &lt;errno.h&gt; &lt;signal.h&gt; &lt;setjmp.h&gt;</code>','断言、错误码、信号、非局部跳转'],
        ['<code>&lt;stdarg.h&gt;</code>','<code>va_list/va_start/va_arg/va_end</code> 可变参数']
      ]},
      {t:'p',x:'<b>标准库之外</b>：POSIX（<code>unistd.h</code>、<code>pthread.h</code>、socket）、Win32 API、第三方库（SDL、SQLite、cJSON…）。C 的哲学是「语言小、库按需」，所以查文档的能力本身就是 C 程序员的基本功。'}
    ]},
    {id:'c-3-9',num:'3.9',title:'断言、变参函数与常见陷阱',lead:'把 UB 清单背下来，比背语法更有用。',tags:['调试'],blocks:[
      {t:'code',lang:'C23',x:'#include <assert.h>\n#include <stdarg.h>\n#include <stdio.h>\n#include <stddef.h>\n\nstatic int sum(size_t n, ...) {\n    va_list ap; va_start(ap, n);\n    int s = 0;\n    for (size_t i = 0; i < n; ++i) s += va_arg(ap, int);\n    va_end(ap);\n    return s;\n}\n\nint main(void) {\n    int *p = nullptr;\n    assert(p != nullptr);   // NDEBUG 时整条消失；别把有副作用的表达式放进去\n    printf("%d\\n", sum(3, 1, 2, 3));\n    return 0;\n}'},
      {t:'note',k:'UB / 高危清单',x:'① 数组越界、缓冲区溢出；② 解引用空/野/悬垂指针；③ 读未初始化对象；④ 有符号整数溢出、除零；⑤ <code>printf/scanf</code> 格式与参数不匹配；⑥ 无序列地多次修改同一对象（<code>i = i++ + ++i</code>）；⑦ 违反 strict aliasing；⑧ 返回局部变量地址；⑨ 忽略 <code>realloc</code> 失败；⑩ <code>assert</code> 里放有副作用的表达式（发布版会消失）。'},
      {t:'p',x:'变参函数要点：<code>va_arg</code> 的类型必须与实际提升后的类型一致（<code>char/float</code> 会提升为 <code>int/double</code>）；需要一个哨兵或计数来知道参数个数。更稳的替代是传数组 + 长度。'}
    ]}
  ]},

  /* ================= 第 4 章 ================= */
  {id:'c-4',num:'4',title:'C23 新特性与现代写法',lead:'专门一章讲 C17 → C23 的变化：新关键字、编译期常量、类型泛型、属性、二进制嵌入与溢出检查库。',sections:[
    {id:'c-4-1',num:'4.1',title:'C23 总览与迁移清单',lead:'C23 = ISO/IEC 9899:2024，草案名 C2x。',tags:['C23'],blocks:[
      {t:'p',x:'<code>__STDC_VERSION__</code> 在 C23 模式下是 <b>202311L</b>（C17 是 201710L，C11 是 201112L）。编译器支持：GCC 14/15、Clang 18/19+ 逐步完善；用 <code>-std=c2x</code> 覆盖较老编译器，新一点的可直接 <code>-std=c23</code>。'},
      {t:'table',head:['变化','从 C17 迁移要做什么'],rows:[
        ['<code>bool true false nullptr</code> 变关键字','删掉 <code>&lt;stdbool.h&gt;</code>；旧代码里自己 <code>#define bool</code> 的会冲突'],
        ['<code>alignas alignof static_assert thread_local</code> 变关键字','去掉下划线版本与 <code>&lt;stdalign.h&gt;/&lt;stdassert.h&gt;</code>'],
        ['<code>f()</code> 等价于 <code>f(void)</code>','把「参数未知」的旧式声明补全为原型'],
        ['移除 K&amp;R 函数定义、三字母词','老代码改写为标准原型；<code>??=</code> 之类替换掉'],
        ['VLA 变为可选','检查 <code>__STDC_NO_VLA__</code>，必要时改用 malloc'],
        ['十进制浮点、<code>_BitInt</code> 等为可选/条件特性','用特性测试宏 <code>__STDC_IEC_60559_BFP__</code>、<code>__STDC_ENDIAN_*__</code> 等探测']
      ]},
      {t:'code',lang:'C23 · 特性探测',x:'#include <stdio.h>\n#if __STDC_VERSION__ >= 202311L\n  #define HAS_C23 1\n#endif\n#ifdef __STDC_NO_VLA__\n  #warning "当前实现不支持 VLA"\n#endif\nstatic_assert(sizeof(int) >= 4, "need 32-bit int");  // C23 关键字\nint main(void) { printf("C=%ld\\n", (long)__STDC_VERSION__); }'},
      {t:'note',k:'迁移策略',x:'先用 <code>-std=c17 -Wall -Wextra -Wpedantic</code> 把老代码警告清零，再切 <code>-std=c2x</code>。逐个替换：宏定义的 bool → 关键字、<code>_Static_assert</code> → <code>static_assert</code>、手工溢出判断 → <code>&lt;stdckdint.h&gt;</code>、<code>xxd -i</code> 生成的数组 → <code>#embed</code>。'}
    ]},
    {id:'c-4-2',num:'4.2',title:'bool / true / false / nullptr',lead:'四个关键字，终结二十多年的宏模拟。',tags:['C23'],blocks:[
      {t:'code',lang:'C23',x:'#include <stdio.h>\n#include <stddef.h>   // nullptr_t\n\nint main(void) {\n    bool ok = true;\n    bool bad = false;\n    printf("bool=%zu ok=%d bad=%d\\n", sizeof(bool), ok, bad);\n\n    int *p = nullptr;             // nullptr_t 可隐式转任意指针类型\n    nullptr_t n = nullptr;\n    if (p == nullptr && n == nullptr) puts("both null");\n    // int x = nullptr;          // 错误：nullptr 不能隐式转整数\n    return 0;\n}'},
      {t:'ul',items:[
        'C17 需要 <code>#include &lt;stdbool.h&gt;</code> 才有 <code>bool</code>（其实是宏 <code>_Bool</code>）；<b>C23 直接是关键字</b>，头文件变成兼容空壳',
        '<code>nullptr</code> 有专门类型 <code>nullptr_t</code>，只能转指针与 <code>bool</code>，<b>不会像 <code>NULL</code>（可能是 0）那样被当成整数</b>，重载/泛型场景更安全',
        '<code>NULL</code> 依然可用，新代码建议统一 <code>nullptr</code>'
      ]},
      {t:'note',k:'一个真实收益',x:'C17 里 <code>NULL</code> 若是 <code>((void*)0)</code>，传给变参函数或 <code>_Generic</code> 时类型是 <code>void*</code>；若为 <code>0</code> 则是 <code>int</code>。<code>nullptr</code> 消除了这种实现差异。'}
    ]},
    {id:'c-4-3',num:'4.3',title:'constexpr 与常量表达式',lead:'C23 的 constexpr 只修饰对象，但足够替代大多数 #define 常量。',tags:['C23'],blocks:[
      {t:'code',lang:'C23',x:'#include <stdio.h>\n\nconstexpr int    N     = 8;                 // 编译期常量\nconstexpr double PI    = 3.141592653589793;\nconstexpr int    SQUARE = N * N;            // 可由常量表达式计算\nstatic constexpr size_t BUF = 256;          // 可与 static/存储期说明符同用\n\nint main(void) {\n    int a[N] = {};                          // 可作数组长度\n    char buf[BUF];\n    switch (N) {\n        case SQUARE / 8: puts("8"); break;  // 可作 case 标签\n        default: break;\n    }\n    printf("%zu %f\\n", sizeof a, PI);\n    (void)buf;\n    return 0;\n}'},
      {t:'table',head:['对比','<code>const int N = 8;</code>','<code>constexpr int N = 8;</code>'],rows:[
        ['是否是常量表达式','否（是「只读对象」）','<b>是</b>'],
        ['可作数组长度 / case 标签','文件作用域下不是标准写法','可以'],
        ['可用于位域宽度 / 静态断言','否','可以'],
        ['有类型与作用域','有','有'],
        ['能取地址','能','能（对象仍存在）']
      ]},
      {t:'note',k:'与 C++ 的区别',x:'C23 的 <code>constexpr</code> <b>只能用于对象声明</b>，没有 <code>constexpr 函数</code>；也不可用于 <code>volatile</code>、<code>_Atomic</code> 或 VLA。需要「编译期函数」还得靠宏或 <code>static inline</code> + 编译器常量折叠。'}
    ]},
    {id:'c-4-4',num:'4.4',title:'typeof 与 typeof_unqual',lead:'标准版的类型泛型，写宏终于不用 GNU 扩展了。',tags:['C23'],blocks:[
      {t:'code',lang:'C23',x:'#include <stdio.h>\n\n#define MAX(a, b) ({ typeof(a) _a = (a); typeof(b) _b = (b); _a > _b ? _a : _b; }) /* GNU 语句表达式，非标准 */\n\n/* 标准 C23 写法：用 typeof 声明临时量，配合三目 */\n#define CLAMP(x, lo, hi)  ((typeof(x))((x) < (lo) ? (lo) : ((x) > (hi) ? (hi) : (x))))\n\nint main(void) {\n    const volatile int cv = 5;\n    typeof(cv) a = cv;              // a 也是 const volatile int\n    typeof_unqual(cv) b = cv;       // b 是普通 int\n    double d = 3.7;\n    typeof(d) e = d;\n    printf("%d %d %.1f %.1f\\n", a, b, e, CLAMP(e, 1.0, 2.0));\n    return 0;\n}'},
      {t:'p',x:'<code>typeof(expr)</code> 返回表达式的静态类型且<b>不求值</b>（类似 <code>sizeof</code>）；<code>typeof_unqual</code> 再去掉顶层 <code>const/volatile/_Atomic</code>。参数为类型名时写 <code>typeof(int)</code> 也合法。'},
      {t:'note',k:'注意',x:'上面的 <code>({ … })</code> 语句表达式是 <b>GNU 扩展，不是标准 C</b>，仅作对照。标准 C23 里把「只求值一次」的 MAX 写成 <code>static inline</code> 函数配合 <code>_Generic</code>，或用 typeof 声明临时量后放进逗号表达式。'}
    ]},
    {id:'c-4-5',num:'4.5',title:'属性 [[...]]',lead:'C23 把编译器属性收进标准语法。',tags:['C23'],blocks:[
      {t:'code',lang:'C23',x:'#include <stdio.h>\n#include <stdlib.h>\n\n[[nodiscard]] static int parse(const char *s);\n\n[[deprecated("改用 parse_v2")]] static int parse_old(const char *s) { return atoi(s); }\n\n[[noreturn]] static void die(const char *msg) {\n    fprintf(stderr, "%s\\n", msg);\n    exit(EXIT_FAILURE);\n}\n\n[[nodiscard]] static int parse(const char *s) {\n    if (!s) die("null input");\n    return atoi(s);\n}\n\nint main(void) {\n    int v = parse("42");\n    // parse("7");        // 编译器会警告：忽略 nodiscard 返回值\n    [[maybe_unused]] int unused = parse_old("1");\n    switch (v) {\n        case 42: [[fallthrough]];\n        default: printf("v=%d\\n", v);\n    }\n    return 0;\n}'},
      {t:'table',head:['标准属性','作用'],rows:[
        ['<code>[[nodiscard]]</code>','忽略返回值时警告（可带字符串理由）'],
        ['<code>[[deprecated("msg")]]</code>','标记过时，使用时给警告'],
        ['<code>[[fallthrough]]</code>','声明 switch 故意穿透'],
        ['<code>[[maybe_unused]]</code>','声明可能未使用，抑制警告'],
        ['<code>[[noreturn]]</code>','函数不会返回'],
        ['<code>[[unsequenced]]</code>','函数无副作用且结果只依赖参数，可自由重排'],
        ['<code>[[reproducible]]</code>','允许读共享状态的结果可缓存，副作用更弱约束']
      ]},
      {t:'p',x:'属性可放在声明、语句、标签前；未知属性实现可忽略（不报错），因此不同编译器之间更安全。C17 时代的写法是 <code>__attribute__((…))</code>（GCC/Clang）或 <code>__declspec</code>（MSVC），不可移植。'}
    ]},
    {id:'c-4-6',num:'4.6',title:'#embed：把文件嵌进程序',lead:'C23 最实用的新特性，终结 xxd -i。',tags:['C23'],blocks:[
      {t:'code',lang:'C23',x:'#include <stdio.h>\n\n// 把整个文件展开成逗号分隔的 unsigned char 初始化列表\nstatic const unsigned char logo[] = {\n    #embed "logo.png"\n};\n\n// 带参数：限制字节数、加前后缀、空文件兜底\nstatic const unsigned char head[] = {\n    #embed "data.bin" \\\n        limit(64) \\\n        prefix(0xDE, 0xAD,) \\\n        suffix(, 0xBE, 0xEF) \\\n        if_empty(0)\n};\n\n// __has_embed 可探测文件是否可用\n#if __has_embed("logo.png")\n  #define HAS_LOGO 1\n#endif\n\nint main(void) {\n    printf("logo bytes=%zu, head bytes=%zu\\n", sizeof logo, sizeof head);\n    return 0;\n}'},
      {t:'ul',items:[
        '<code>#embed &lt;头文件&gt;</code> 或 <code>#embed "文件"</code>，默认把每个字节变成一个整数常量',
        '<code>limit(n)</code> 最多 n 个元素；<code>prefix(…)</code>/<code>suffix(…)</code> 加额外元素；<code>if_empty(…)</code> 文件为空时的替代内容',
        '<code>__has_embed(...)</code> 预处理期探测；还有 <code>__has_include</code>（C17 已有）',
        '用途：图标、字体、着色器、证书、测试固件——不再需要外部生成脚本，也不依赖运行期读文件'
      ]},
      {t:'note',k:'注意',x:'元素类型由数组声明决定（<code>unsigned char[]</code> 时每字节 0–255）；文件路径按实现定义的搜索规则解析，构建系统里通常要配置 include 路径。'}
    ]},
    {id:'c-4-7',num:'4.7',title:'二进制字面量、分隔符、%b 与 _BitInt',lead:'字面量层的四个现代化改进。',tags:['C23'],blocks:[
      {t:'code',lang:'C23',x:'#include <stdio.h>\n#include <stdint.h>\n\nint main(void) {\n    unsigned mask  = 0b1010\'1100;        // 二进制 + 分隔符\n    long    budget = 1\'000\'000\'000;      // 分隔符不影响数值\n    printf("mask=%b budget=%ld\\n", mask, budget);   // %b 输出二进制\n    printf("upper=%B\\n", 0b1011);                   // %B 大写前缀形式\n\n    _BitInt(12) small = 0b1111\'1111\'1111; // 12 位整数\n    unsigned _BitInt(24) color = 0xFF00FF;\n    printf("small=%d color=%u\\n", (int)small, (unsigned)color);\n    return 0;\n}'},
      {t:'ul',items:[
        '<code>0b/0B</code> 二进制字面量；单引号 <code>\'</code> 作数字分隔符，可出现在任意两个数字之间（不能开头/结尾/连续）',
        '<code>printf/scanf</code> 新增 <code>%b/%B</code>（二进制），以及 <code>%wN/%wfN</code> 用于指定宽度整数参数',
        '<code>_BitInt(N)</code> 精确 N 位有符号整数（含符号位），<code>unsigned _BitInt(N)</code> 为无符号；适合硬件寄存器、协议字段、大整数实验',
        '字符/字符串前缀：<code>u8"…"</code> 在 C23 中是 <code>char8_t</code> 数组，配合 <code>&lt;uchar.h&gt;</code> 做 UTF-8 更规范'
      ]}
    ]},
    {id:'c-4-8',num:'4.8',title:'枚举底层类型与 auto 推断',lead:'两个让声明更精确的新能力。',tags:['C23'],blocks:[
      {t:'code',lang:'C23',x:'#include <stdio.h>\n#include <stdint.h>\n\nenum Mode : uint8_t { MODE_IDLE = 0, MODE_RUN = 1, MODE_ERR = 200 };\nenum Big  : uint64_t { BIG = 0x1\'0000\'0000ULL };\n\nint main(void) {\n    auto i = 42;              // int\n    auto d = 3.14;            // double\n    auto p = (const char *)"hi";\n    enum Mode m = MODE_ERR;\n    printf("sizeof(Mode)=%zu m=%u big=%llu\\n", sizeof m, (unsigned)m,\n           (unsigned long long)BIG);\n    printf("%s %d %.2f\\n", p, i, d);\n    return 0;\n}'},
      {t:'p',x:'<code>enum E : 底层类型 { … }</code> 让枚举大小与取值范围可预测；枚举常量也不再受 <code>int</code> 限制。<code>auto</code> 只从初始化器推断类型，<b>不能用于函数参数、返回类型或没有初始化器的声明</b>，与 C++ 的 <code>auto</code> 语义不同（C 里没有引用、没有类型推导的函数返回）。'},
      {t:'note',k:'建议',x:'在协议/嵌入式里用带底层类型的枚举替代 <code>#define</code> 常量组，既保留调试符号，又能控制存储大小；但跨编译器传输结构体时仍要注意对齐与字节序。'}
    ]},
    {id:'c-4-9',num:'4.9',title:'<stdckdint.h> 与 <stdbit.h>',lead:'标准库终于有了溢出检查和位工具。',tags:['C23'],blocks:[
      {t:'code',lang:'C23',x:'#include <stdio.h>\n#include <stdckdint.h>   // C23 溢出检查\n#include <stdbit.h>      // C23 位工具\n#include <stdint.h>\n\nint main(void) {\n    int a = INT_MAX, r;\n    if (ckd_add(&r, a, 1)) { puts("加法溢出！"); }   // 返回 true 表示溢出\n    else printf("sum=%d\\n", r);\n\n    unsigned long long n = 0xF0F0;\n    printf("popcount=%u leading=%u trailing=%u\\n",\n           stdc_popcount_ull(n),\n           stdc_leading_zeros_ull(n),\n           stdc_trailing_zeros_ull(n));\n    printf("bit_ceil(5)=%llu\\n", stdc_bit_ceil_ull(5));\n    return 0;\n}'},
      {t:'ul',items:[
        '<code>ckd_add/ckd_sub/ckd_mul(&amp;结果, x, y)</code>：计算 <code>x?y</code> 写入结果，溢出时返回 <code>true</code> 且结果是回绕后的值；支持任意有/无符号整数类型',
        'C17 里要手写「先判断再算」（<code>if (a &gt; INT_MAX - b) …</code>），繁琐且容易漏；C23 一套宏解决',
        '<code>&lt;stdbit.h&gt;</code> 提供 <code>stdc_popcount_*</code>、<code>stdc_leading_zeros_*</code>、<code>stdc_trailing_zeros_*</code>、<code>stdc_first_leading_one_*</code>、<code>stdc_bit_floor/ceil/width</code>、<code>stdc_has_single_bit</code>，后缀 <code>_uc/_us/_ui/_ul/_ull</code> 对应类型',
        '这些名字取代了各家编译器的 <code>__builtin_popcount</code> 等内建函数，代码可移植'
      ]},
      {t:'note',k:'回顾 C*',x:'C* 语言把溢出/越界检查做在语言运行时里；C23 则给 C 程序员提供<b>显式的、零成本的检查工具</b>。思路相通，代价与自由度不同。'}
    ]},
    {id:'c-4-10',num:'4.10',title:'宏增强、#warning 与变参改进',lead:'预处理器的现代化收尾。',tags:['C23'],blocks:[
      {t:'code',lang:'C23',x:'#include <stdio.h>\n\n#define LOG(fmt, ...) \\\n    fprintf(stderr, "[%s:%d] " fmt "\\n", __FILE__, __LINE__ __VA_OPT__(,) __VA_ARGS__)\n\n#ifndef NDEBUG\n#warning "调试构建：日志已开启"\n#endif\n\nint main(void) {\n    LOG("启动");                 // 无变参：__VA_OPT__ 消掉多余逗号\n    LOG("值=%d 名=%s", 7, "x"); // 有变参：自动补逗号\n    return 0;\n}'},
      {t:'ul',items:[
        '<code>__VA_OPT__(内容)</code>：仅当 <code>__VA_ARGS__</code> 非空时展开「内容」，解决「可变参数为空时逗号多余」这个 C99 以来的老问题（C23 标准化，C++20 也有）',
        '<code>#warning 文本</code>：产生一条不中断编译的诊断，适合标记调试构建、废弃配置',
        '<code>__has_include</code>（C17 起）/ <code>__has_embed</code>（C23）/ <code>__has_c_attribute</code>（C23）构成特性探测三件套',
        'C23 移除了三字母词，并把 <code>#elifdef</code>/<code>#elifndef</code> 收进标准（此前是常见扩展）'
      ]}
    ]},
    {id:'c-4-11',num:'4.11',title:'C23 语法清理与标准库补录',lead:'那些「小但到处都遇到」的变化。',tags:['C23'],blocks:[
      {t:'table',head:['变化','说明'],rows:[
        ['<code>void f();</code> = <code>void f(void);</code>','旧式「参数未指定」声明彻底退出'],
        ['标签后可跟声明','<code>retry: int r = 0;</code> 不再需要先写 <code>;</code>'],
        ['空初始化器 <code>{}</code>','<code>int a[5] = {};</code>、<code>struct S s = {};</code> 全部零初始化'],
        ['移除 K&amp;R 函数定义','<code>int f(a) int a; {…}</code> 不再合法'],
        ['移除三字母词','<code>??= ??/ ??&#39;</code> 等不再替换'],
        ['<code>char8_t</code>','<code>&lt;uchar.h&gt;</code>，<code>u8"…"</code> 的类型更明确'],
        ['<code>strdup / strndup</code>','从 POSIX 正式收进 <code>&lt;string.h&gt;</code>'],
        ['<code>memset_explicit</code>','安全擦除敏感数据，禁止编译器优化掉'],
        ['<code>timespec_getres</code>','<code>&lt;time.h&gt;</code> 查询时间精度'],
        ['特性测试宏','<code>__STDC_NO_VLA__</code>、<code>__STDC_VERSION__</code>、<code>__STDC_ENDIAN_*</code> 等']
      ]},
      {t:'p',x:'C23 没有引入垃圾回收、异常、模块、命名空间，也没有把 <code>&lt;threads.h&gt;</code> 变成强制——它是一次<b>克制的现代化</b>：把已成事实的扩展标准化，把容易出错的地方补上工具，同时保持「C 还是那个 C」。'},
      {t:'note',k:'编译器支持速查',x:'<code>typeof/#embed/[[...]]/constexpr/_BitInt</code> 的支持进度各家不同，GCC 15 与 Clang 20 覆盖最全。上线前用 <code>__has_c_attribute</code> 与 <code>__STDC_VERSION__</code> 做条件编译，或限定最低编译器版本。'}
    ]}
  ]},

  /* ================= 第 5 章 ================= */
  {id:'c-5',num:'5',title:'数据结构与算法（C 实现）',lead:'用 C23 把常用数据结构从零写一遍，顺带把泛型、递归、排序查找讲透。',sections:[
    {id:'c-5-1',num:'5.1',title:'顺序表与链表',lead:'连续内存 vs 节点串联，先写动态数组再写单链表。',tags:['数据结构'],blocks:[
      {t:'code',lang:'C23 · 动态数组',x:'#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\ntypedef struct { int *data; size_t len, cap; } Vec;\n\nstatic bool reserve(Vec *v, size_t cap) {\n    if (cap <= v->cap) return true;\n    int *p = realloc(v->data, cap * sizeof *p);\n    if (!p) return false;\n    v->data = p; v->cap = cap; return true;\n}\nstatic bool push(Vec *v, int x) {\n    if (v->len == v->cap && !reserve(v, v->cap ? v->cap * 2 : 4)) return false;\n    v->data[v->len++] = x; return true;\n}\nint main(void) {\n    Vec v = {};                       // C23 空初始化\n    for (int i = 0; i < 8; ++i) push(&v, i * i);\n    for (size_t i = 0; i < v.len; ++i) printf("%d ", v.data[i]);\n    putchar(\'\\n\');\n    free(v.data);\n    return 0;\n}'},
      {t:'code',lang:'C23 · 单链表',x:'#include <stdio.h>\n#include <stdlib.h>\n\ntypedef struct Node { int val; struct Node *next; } Node;\n\nstatic Node *prepend(Node *head, int v) {\n    Node *n = malloc(sizeof *n);\n    if (!n) return head;\n    n->val = v; n->next = head; return n;\n}\nstatic void clear(Node *head) {\n    while (head) { Node *t = head->next; free(head); head = t; }\n}\nint main(void) {\n    Node *head = nullptr;\n    for (int i = 0; i < 5; ++i) head = prepend(head, i);\n    for (Node *p = head; p; p = p->next) printf("%d ", p->val);\n    putchar(\'\\n\');\n    clear(head);\n    return 0;\n}'},
      {t:'table',head:['对比','顺序表','链表'],rows:[
        ['随机访问','O(1)','O(n)'],
        ['头部插入 / 删除','O(n)','O(1)（有头指针）'],
        ['内存','连续、缓存友好','节点分散、每节点多一个指针'],
        ['扩容','realloc 可能搬移','天然按需分配']
      ]},
      {t:'note',k:'工程建议',x:'默认用动态数组（缓存局部性几乎总是赢）；只有需要频繁在中间插删、且已有节点指针时才用链表。链表删除时务必先保存 <code>next</code> 再 <code>free</code>，否则就是 use-after-free。'}
    ]},
    {id:'c-5-2',num:'5.2',title:'栈与队列',lead:'数组实现最简洁，环形队列解决「假溢出」。',tags:['数据结构'],blocks:[
      {t:'code',lang:'C23 · 栈 + 环形队列',x:'#include <stdio.h>\n#include <stdbool.h>\n\n#define CAP 8\ntypedef struct { int a[CAP]; int top; } Stack;\ntypedef struct { int a[CAP]; int head, tail, size; } Queue;\n\nstatic bool spush(Stack *s, int x) {\n    if (s->top == CAP) return false;\n    s->a[s->top++] = x; return true;\n}\nstatic int spop(Stack *s) { return s->top ? s->a[--s->top] : -1; }\n\nstatic bool enq(Queue *q, int x) {\n    if (q->size == CAP) return false;\n    q->a[q->tail] = x; q->tail = (q->tail + 1) % CAP; ++q->size; return true;\n}\nstatic int deq(Queue *q) {\n    if (!q->size) return -1;\n    int v = q->a[q->head]; q->head = (q->head + 1) % CAP; --q->size; return v;\n}\nint main(void) {\n    Stack s = {}; Queue q = {};\n    spush(&s, 1); spush(&s, 2);\n    enq(&q, 1); enq(&q, 2);\n    printf("%d %d\\n", spop(&s), deq(&q));\n    return 0;\n}'},
      {t:'p',x:'栈用于表达式求值、函数调用、DFS 回溯、括号匹配；队列用于 BFS、任务调度、缓冲。环形队列用 <code>(i+1)%CAP</code> 回绕，用单独的 <code>size</code> 区分「空」与「满」，比留一个空位更直观。'}
    ]},
    {id:'c-5-3',num:'5.3',title:'树与二叉搜索树',lead:'递归是最好的老师：插入、查找、中序遍历。',tags:['数据结构'],blocks:[
      {t:'code',lang:'C23 · BST',x:'#include <stdio.h>\n#include <stdlib.h>\n\ntypedef struct Node { int key; struct Node *l, *r; } Node;\n\nstatic Node *insert(Node *t, int k) {\n    if (!t) { Node *n = malloc(sizeof *n); if (n) *n = (Node){ .key = k }; return n; }\n    if (k < t->key) t->l = insert(t->l, k);\n    else if (k > t->key) t->r = insert(t->r, k);\n    return t;\n}\nstatic bool find(Node *t, int k) {\n    return t ? (k == t->key ? true : find(k < t->key ? t->l : t->r, k)) : false;\n}\nstatic void inorder(Node *t) {\n    if (!t) return;\n    inorder(t->l); printf("%d ", t->key); inorder(t->r);\n}\nstatic void clear(Node *t) { if (t) { clear(t->l); clear(t->r); free(t); } }\n\nint main(void) {\n    int v[] = {5, 3, 8, 1, 7};\n    Node *root = nullptr;\n    for (size_t i = 0; i < 5; ++i) root = insert(root, v[i]);\n    inorder(root); putchar(\'\\n\');       // 1 3 5 7 8（有序）\n    printf("find(7)=%d\\n", find(root, 7));\n    clear(root);\n    return 0;\n}'},
      {t:'note',k:'要点',x:'BST 的查找/插入平均 O(log n)，但输入有序时会退化成链（O(n)）；生产环境用自平衡树（AVL / 红黑树）或哈希表。树的销毁用<b>后序递归</b>：先删子树再释放根。递归深度过大时有爆栈风险。'}
    ]},
    {id:'c-5-4',num:'5.4',title:'哈希表（链地址法）',lead:'散列函数 + 桶 + 冲突处理，平均 O(1) 查找。',tags:['数据结构'],blocks:[
      {t:'code',lang:'C23 · 简易字符串哈希表',x:'#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\n#define NB 64\ntypedef struct Ent { char *k; int v; struct Ent *next; } Ent;\ntypedef struct { Ent *b[NB]; } Map;\n\nstatic unsigned hash(const char *s) {          // FNV-1a\n    unsigned h = 2166136261u;\n    for (; *s; ++s) { h ^= (unsigned char)*s; h *= 16777619u; }\n    return h % NB;\n}\nstatic bool put(Map *m, const char *k, int v) {\n    unsigned i = hash(k);\n    for (Ent *e = m->b[i]; e; e = e->next)\n        if (strcmp(e->k, k) == 0) { e->v = v; return true; }\n    Ent *e = malloc(sizeof *e);\n    if (!e) return false;\n    e->k = strdup(k);                          // C23 标准库\n    if (!e->k) { free(e); return false; }\n    e->v = v; e->next = m->b[i]; m->b[i] = e;\n    return true;\n}\nstatic int get(Map *m, const char *k) {\n    for (Ent *e = m->b[hash(k)]; e; e = e->next)\n        if (strcmp(e->k, k) == 0) return e->v;\n    return -1;\n}\nint main(void) {\n    Map m = {};\n    put(&m, "answer", 42);\n    printf("%d\\n", get(&m, "answer"));\n    return 0;\n}'},
      {t:'p',x:'链地址法把冲突元素挂在同一桶的链表上；负载因子超过 0.75 左右时应扩容并重散列。示例用 FNV-1a，工程上可选更均匀的哈希；别忘了销毁时逐个 <code>free(k)</code> 与 <code>free(e)</code>。'}
    ]},
    {id:'c-5-5',num:'5.5',title:'排序算法',lead:'qsort、手写快排、归并、稳定性与复杂度。',tags:['算法'],blocks:[
      {t:'code',lang:'C23 · qsort 与手写快排',x:'#include <stdio.h>\n#include <stdlib.h>\n\nstatic int cmp(const void *a, const void *b) {\n    int x = *(const int *)a, y = *(const int *)b;\n    return (x > y) - (x < y);           // 不用 x-y，避免溢出\n}\nstatic void qsort_int(int *a, int lo, int hi) {\n    if (lo >= hi) return;\n    int piv = a[hi], i = lo;\n    for (int j = lo; j < hi; ++j)\n        if (a[j] < piv) { int t = a[i]; a[i++] = a[j]; a[j] = t; }\n    int t = a[i]; a[i] = a[hi]; a[hi] = t;\n    qsort_int(a, lo, i - 1); qsort_int(a, i + 1, hi);\n}\nint main(void) {\n    int a[] = {5, 2, 9, 1, 5, 6};\n    size_t n = sizeof a / sizeof a[0];\n    qsort(a, n, sizeof a[0], cmp);       // 标准库：优先用它\n    for (size_t i = 0; i < n; ++i) printf("%d ", a[i]);\n    putchar(\'\\n\');\n    int b[] = {5, 2, 9, 1, 5, 6};\n    qsort_int(b, 0, 5);\n    return 0;\n}'},
      {t:'table',head:['算法','平均 / 最坏','稳定','备注'],rows:[
        ['插入 / 选择 / 冒泡','O(n²) / O(n²)','插入、冒泡稳定','小数组或近乎有序时插入很快'],
        ['快速排序','O(n log n) / O(n²)','否','实际最快，枢轴要随机化或三数取中'],
        ['归并排序','O(n log n) / O(n log n)','<b>是</b>','需要 O(n) 额外空间，适合链表与外部排序'],
        ['堆排序','O(n log n) / O(n log n)','否','原地、最坏有保证'],
        ['<code>qsort</code>','实现定义','否','标准库通用排序，比较函数返回负数/0/正数']
      ]},
      {t:'note',k:'细节',x:'比较函数<b>绝不能</b>写 <code>return x - y;</code>（有符号溢出是 UB）；用 <code>(x &gt; y) - (x &lt; y)</code>。需要稳定排序时自己写归并，或用「键 + 原下标」组合比较。'}
    ]},
    {id:'c-5-6',num:'5.6',title:'查找算法',lead:'顺序、二分、bsearch 与边界写法。',tags:['算法'],blocks:[
      {t:'code',lang:'C23',x:'#include <stdio.h>\n#include <stdlib.h>\n\nstatic int cmp(const void *a, const void *b) {\n    int x = *(const int *)a, y = *(const int *)b;\n    return (x > y) - (x < y);\n}\n// 返回第一个 >= key 的下标（lower_bound）；n 为 0 时返回 0\nstatic size_t lower_bound(const int *a, size_t n, int key) {\n    size_t lo = 0, hi = n;                 // 左闭右开，避免 size_t 下溢\n    while (lo < hi) {\n        size_t mid = lo + (hi - lo) / 2;  // 防 lo+hi 溢出\n        if (a[mid] < key) lo = mid + 1; else hi = mid;\n    }\n    return lo;\n}\nint main(void) {\n    int a[] = {1, 3, 5, 7, 9};\n    size_t n = sizeof a / sizeof a[0];\n    printf("lower_bound(6)=%zu\\n", lower_bound(a, n, 6));\n    int *p = bsearch(&(int){7}, a, n, sizeof a[0], cmp); // 复合字面量取地址\n    printf("bsearch=%d\\n", p ? *p : -1);\n    return 0;\n}'},
      {t:'p',x:'二分查找的前提是<b>有序</b>，复杂度 O(log n)。写循环用「左闭右开 <code>[lo, hi)</code>」区间，中点用 <code>lo + (hi-lo)/2</code>，能同时避免死循环与整数溢出。<code>bsearch</code> 只保证返回<b>任意一个</b>匹配元素，不保证第一个。'}
    ]},
    {id:'c-5-7',num:'5.7',title:'递归、分治与回溯',lead:'基线条件 + 缩小规模；小心栈深度与重复计算。',tags:['算法'],blocks:[
      {t:'code',lang:'C23 · 全排列（回溯）',x:'#include <stdio.h>\n\nstatic void swap(int *a, int *b) { int t = *a; *a = *b; *b = t; }\nstatic void permute(int *a, int n, int k) {\n    if (k == n) {\n        for (int i = 0; i < n; ++i) printf("%d ", a[i]);\n        putchar(\'\\n\'); return;\n    }\n    for (int i = k; i < n; ++i) {\n        swap(&a[k], &a[i]);\n        permute(a, n, k + 1);       // 深入\n        swap(&a[k], &a[i]);         // 回溯：恢复现场\n    }\n}\nint main(void) { int a[] = {1,2,3}; permute(a, 3, 0); return 0; }'},
      {t:'ul',items:[
        '递归三要素：<b>基线条件</b>、<b>规模缩小</b>、<b>结果合并</b>；分治（归并、快排）就是递归 + 合并',
        '回溯 = 做选择 → 递归 → 撤销选择；「恢复现场」漏掉是最常见 bug',
        '朴素斐波那契递归是指数级重复计算，改用迭代或记忆化；C 没有尾递归优化保证，深递归可能爆栈',
        '递归里别把大数组放栈上，用堆或传指针'
      ]}
    ]},
    {id:'c-5-8',num:'5.8',title:'_Generic 与泛型编程',lead:'C11 起的类型选择表达式，配合 C23 typeof 写泛型宏。',tags:['C23'],blocks:[
      {t:'code',lang:'C23',x:'#include <stdio.h>\n#include <math.h>\n\n#define sqr(x) _Generic((x),          \\\n    int:    sqr_i,                    \\\n    long:   sqr_l,                    \\\n    double: sqr_d,                    \\\n    float:  sqr_f)(x)\n\nstatic int    sqr_i(int x)    { return x * x; }\nstatic long   sqr_l(long x)   { return x * x; }\nstatic double sqr_d(double x) { return x * x; }\nstatic float  sqr_f(float x)  { return x * x; }\n\n#define TYPE_NAME(x) _Generic((x), int:"int", double:"double", default:"other")\n\nint main(void) {\n    printf("%d %f %s\\n", sqr(5), sqr(2.5), TYPE_NAME(1));\n    return 0;\n}'},
      {t:'p',x:'<code>_Generic(控制表达式, 类型: 表达式, …, default: 表达式)</code> 在<b>编译期</b>按控制表达式的静态类型选择一个分支，未选中的分支不做类型检查也不会求值。控制表达式本身<b>不求值</b>，所以 <code>_Generic((x)++ …)</code> 不会真的自增。'},
      {t:'note',k:'C23 组合技',x:'<code>_Generic</code> 负责「按类型选实现」，<code>typeof</code> 负责「按类型声明临时量」，<code>static inline</code> 负责「类型安全的函数体」——三者配合，可以写出接近 C++ 模板体验的容器宏，同时保持零运行时开销。'}
    ]}
  ]},

  /* ================= 第 6 章 ================= */
  {id:'c-6',num:'6',title:'工程实践与系统编程',lead:'从「能跑」到「能交付」：构建、测试、内存安全、并发、系统调用、性能与规范。',sections:[
    {id:'c-6-1',num:'6.1',title:'模块化设计与接口约定',lead:'不透明类型、错误码、所有权、命名。',tags:['工程'],blocks:[
      {t:'ul',items:[
        '<b>一个模块一对文件</b>：<code>mod.h</code> 只暴露类型与函数声明，<code>mod.c</code> 放实现与 <code>static</code> 内部函数',
        '<b>不透明指针</b>隐藏布局；<code>mod_create/mod_destroy</code> 成对出现，明确谁拥有对象',
        '<b>错误约定统一</b>：返回 <code>0</code> 成功、负数错误码，或用枚举；输出参数一律放前面并允许 <code>nullptr</code> 表示「不关心」',
        '<b>const 正确性</b>：不修改的输入指针一律 <code>const T *</code>，让编译器帮你查',
        '<b>命名前缀</b>：<code>vec_push</code>、<code>vec_len</code> 避免全局符号冲突（C 没有命名空间）',
        '<b>版本与变更</b>：改接口就升版本号；跨 ABI 的结构体不要随意增删字段'
      ]},
      {t:'code',lang:'C23 · 典型接口',x:'// buf.h\ntypedef struct Buf Buf;                 // 不透明\nBuf  *buf_new(size_t cap);               // 拥有者：调用方\nvoid  buf_free(Buf *b);\nint   buf_append(Buf *b, const void *data, size_t n);  // 0 成功 / -1 失败\nconst unsigned char *buf_data(const Buf *b);            // 借用，不可 free\nsize_t buf_len(const Buf *b);'},
      {t:'note',k:'API 设计口诀',x:'「输入 const、输出明确、错误可查、所有权唯一、生命周期成对」。C 没有 RAII，把这些约定写进头文件注释就是团队的契约。'}
    ]},
    {id:'c-6-2',num:'6.2',title:'Makefile 与 CMake 构建',lead:'先会用 Makefile，再用 CMake 管跨平台。',tags:['构建'],blocks:[
      {t:'code',lang:'Makefile',x:'CC      ?= gcc\nCFLAGS  ?= -std=c2x -O2 -Wall -Wextra -Wpedantic -Werror\nOBJS     = main.o vec.o\n\napp: $(OBJS)\n\t$(CC) $(CFLAGS) $(OBJS) -o $@ -lm\n\n%.o: %.c vec.h\n\t$(CC) $(CFLAGS) -MMD -MP -c $< -o $@\n\n-include $(OBJS:.o=.d)\n\n.PHONY: clean test\nclean:\n\trm -f $(OBJS) $(OBJS:.o=.d) app\ntest: app\n\t./app --selftest'},
      {t:'code',lang:'CMakeLists.txt',x:'cmake_minimum_required(VERSION 3.20)\nproject(craft_c C)\nset(CMAKE_C_STANDARD 23)\nset(CMAKE_C_STANDARD_REQUIRED ON)\nadd_compile_options(-Wall -Wextra -Wpedantic)\nadd_library(vec STATIC vec.c)\ntarget_include_directories(vec PUBLIC ${CMAKE_CURRENT_SOURCE_DIR})\nadd_executable(app main.c)\ntarget_link_libraries(app PRIVATE vec m)\nenable_testing()\nadd_test(NAME selftest COMMAND app --selftest)'},
      {t:'ul',items:[
        '<code>-MMD -MP</code> 自动生成头文件依赖，改 .h 也能触发重编（手写依赖最容易漏）',
        '调试构建用 <code>-g -O0 -DDEBUG</code>，发布用 <code>-O2 -DNDEBUG</code>，测试构建叠加 sanitizer',
        'CMake 的 <code>target_*</code> 现代写法把编译选项限制在目标内，别再用全局 <code>include_directories</code>',
        '持续集成里跑：编译 → 单元测试 → sanitizer 构建 → 静态分析'
      ]}
    ]},
    {id:'c-6-3',num:'6.3',title:'单元测试与覆盖率',lead:'没有框架也能测，一个宏就够了。',tags:['测试'],blocks:[
      {t:'code',lang:'C23 · 极简测试框架',x:'#include <stdio.h>\n\nstatic int fails = 0, total = 0;\n#define CHECK(expr) do {                                   \\\n    ++total;                                               \\\n    if (!(expr)) { ++fails;                                \\\n        fprintf(stderr, "FAIL %s:%d: %s\\n", __FILE__, __LINE__, #expr); } \\\n} while (0)\n\nstatic int add(int a, int b) { return a + b; }\n\nint main(void) {\n    CHECK(add(2, 3) == 5);\n    CHECK(add(-1, 1) == 0);\n    CHECK(add(0, 0) == 0);\n    printf("%d/%d passed\\n", total - fails, total);\n    return fails ? 1 : 0;\n}'},
      {t:'code',lang:'Bash · 覆盖率',x:'gcc -std=c2x -g -O0 --coverage test.c -o test && ./test\ngcov test.c            # 生成 .gcda/.gcov\nlcov --capture -d . -o cov.info && genhtml cov.info -o out/'},
      {t:'p',x:'正式项目可用 Unity / CMocka / greatest 等轻量框架，或 CTest 统一调度。测试要点：正常值、边界值（0、空、最大值）、错误路径（分配失败、无效参数）、以及用 sanitizer 再跑一遍。'}
    ]},
    {id:'c-6-4',num:'6.4',title:'内存安全与 Sanitizer',lead:'把 UB 变成运行期的红色报错。',tags:['调试'],blocks:[
      {t:'code',lang:'Bash',x:'gcc -std=c2x -g -O1 -fsanitize=address,undefined \\\n    -fno-omit-frame-pointer main.c -o app_asan\nASAN_OPTIONS=detect_leaks=1 ./app_asan\n\n# 线程竞争用 ThreadSanitizer\ngcc -std=c2x -g -O1 -fsanitize=thread main.c -o app_tsan -pthread'},
      {t:'table',head:['Sanitizer','抓什么'],rows:[
        ['<b>ASan</b>','越界、use-after-free、double-free、栈溢出、内存泄漏（LeakSanitizer）'],
        ['<b>UBSan</b>','有符号溢出、除零、错位对齐、无效移位、类型不匹配'],
        ['<b>TSan</b>','数据竞争'],
        ['<b>MSan</b>','未初始化读取（需全量插桩，Clang）'],
        ['<b>Valgrind</b>','无需重编，慢但能查泄漏与非法访问']
      ]},
      {t:'note',k:'必做',x:'C 项目<b>至少</b>要有一套 ASan+UBSan 的构建目标，CI 里跑测试时启用。它能在几分钟内抓到人工 review 几天都发现不了的越界与悬垂指针。发布版不要带 sanitizer（体积与性能代价大）。'}
    ]},
    {id:'c-6-5',num:'6.5',title:'并发：线程、互斥与原子',lead:'C11 <threads.h> / <stdatomic.h>，C23 保留并补关键字。',tags:['并发'],blocks:[
      {t:'code',lang:'C23 · 线程 + 原子计数',x:'#include <stdio.h>\n#include <threads.h>\n#include <stdatomic.h>\n\n#define N 100000\nstatic atomic_int counter = 0;       // 原子：无需加锁\n\nstatic int worker(void *arg) {\n    (void)arg;\n    for (int i = 0; i < N; ++i) atomic_fetch_add(&counter, 1);\n    return 0;\n}\nint main(void) {\n    thrd_t t1, t2;\n    thrd_create(&t1, worker, nullptr);\n    thrd_create(&t2, worker, nullptr);\n    thrd_join(t1, nullptr); thrd_join(t2, nullptr);\n    printf("counter=%d\\n", atomic_load(&counter));  // 200000\n    return 0;\n}'},
      {t:'code',lang:'C23 · 互斥与条件变量',x:'#include <threads.h>\n\nstatic mtx_t mu;\nstatic cnd_t cv;\nstatic bool ready = false;\n\nstatic int waiter(void *arg) {\n    (void)arg;\n    mtx_lock(&mu);\n    while (!ready) cnd_wait(&cv, &mu);   // 必须用 while 防虚假唤醒\n    mtx_unlock(&mu);\n    return 0;\n}\n/* 主线程：mtx_init(&mu, mtx_plain); cnd_init(&cv); … 结束时 destroy */'},
      {t:'ul',items:[
        '<code>thrd_create/thrd_join</code>、<code>mtx_t/cnd_t</code>、<code>thread_local</code>（C23 关键字）、<code>tss_t</code> 线程局部存储',
        '<code>&lt;stdatomic.h&gt;</code> 提供 <code>atomic_int</code>、<code>atomic_fetch_add</code>、<code>atomic_compare_exchange</code>、内存序 <code>memory_order_*</code>',
        '共享可变数据要么加锁、要么原子；<b>数据竞争是 UB</b>，TSan 能抓到',
        '条件变量等待一律用 <code>while (!谓词)</code>；唤醒后重新检查'
      ]},
      {t:'note',k:'现实提醒',x:'不少平台更常用 POSIX <code>pthread</code>；<code>&lt;threads.h&gt;</code> 在 C11 是可选、C23 仍非强制（检查 <code>__STDC_NO_THREADS__</code>）。跨平台项目通常自己封装一层线程抽象。'}
    ]},
    {id:'c-6-6',num:'6.6',title:'POSIX 系统调用入门',lead:'文件、进程、信号——C 标准库之外的世界。',tags:['系统'],blocks:[
      {t:'code',lang:'C23 · POSIX',x:'#include <unistd.h>\n#include <fcntl.h>\n#include <sys/wait.h>\n#include <stdio.h>\n#include <signal.h>\n\nstatic volatile sig_atomic_t got = 0;\nstatic void on_sigint(int s) { (void)s; got = 1; }   // 信号处理里只能做极安全的事\n\nint main(void) {\n    signal(SIGINT, on_sigint);\n\n    int fd = open("log.txt", O_WRONLY | O_CREAT | O_TRUNC, 0644);\n    if (fd < 0) { perror("open"); return 1; }\n    write(fd, "hello\\n", 6);\n    close(fd);\n\n    pid_t pid = fork();\n    if (pid == 0) { _exit(0); }             // 子进程用 _exit 避免重复刷缓冲\n    else if (pid > 0) { int st; waitpid(pid, &st, 0); }\n\n    printf("pid=%ld\\n", (long)getpid());\n    return 0;\n}'},
      {t:'ul',items:[
        '<code>open/read/write/close</code> 返回文件描述符；失败返回 −1 并设置 <code>errno</code>，用 <code>perror</code>/<code>strerror</code> 打印',
        '<code>fork</code> 复制进程，<code>exec*</code> 换程序，<code>waitpid</code> 回收子进程（不回收会变僵尸）',
        '信号处理函数里只能调用 async-signal-safe 函数，且只能写 <code>volatile sig_atomic_t</code>',
        '<code>errno</code> 是线程局部的；检查前先保存，因为后续调用可能覆盖它',
        'Windows 对应的是 Win32 API（<code>CreateFile</code>/<code>CreateProcess</code>），跨平台要抽象一层'
      ]}
    ]},
    {id:'c-6-7',num:'6.7',title:'性能优化与缓存友好',lead:'先测量，再优化；多数瓶颈在内存访问而非指令。',tags:['性能'],blocks:[
      {t:'code',lang:'C23 · 行优先遍历',x:'#include <stdio.h>\n#define N 1024\nstatic double a[N][N];\n\nint main(void) {\n    double sum = 0;\n    // 好：按行连续访问，缓存命中率高\n    for (size_t i = 0; i < N; ++i)\n        for (size_t j = 0; j < N; ++j) sum += a[i][j];\n    // 坏：按列跳着访问，每行都跨 N*8 字节\n    // for (size_t j = 0; j < N; ++j)\n    //     for (size_t i = 0; i < N; ++i) sum += a[i][j];\n    printf("%f\\n", sum);\n    return 0;\n}'},
      {t:'ul',items:[
        '<b>先 profile</b>：<code>perf</code>、<code>gprof</code>、Valgrind/Callgrind、编译器 <code>-ftime-report</code>；别凭感觉优化',
        '<b>数据布局优先</b>：结构体按大小排序减少填充、热字段放一起、AoS ↔ SoA 按访问模式选；连续数组几乎总比指针链快',
        '<code>restrict</code> 告诉编译器两个指针不重叠，能解锁向量化；但撒谎就是 UB',
        '小函数 <code>static inline</code>、常量用 <code>constexpr</code>、循环内别反复分配内存',
        '优化级别 <code>-O2</code> 通常最稳；<code>-O3 -flto -march=native</code> 需基准测试确认收益；发布别忘 <code>-DNDEBUG</code>'
      ]},
      {t:'note',k:'别牺牲正确性',x:'任何依赖 UB 的「优化」（越界读取、类型双关、假设有符号溢出回绕）都可能在新编译器上突然失效。性能问题用数据结构与算法解决，比用未定义行为投机可靠得多。'}
    ]},
    {id:'c-6-8',num:'6.8',title:'静态分析、编译警告与代码规范',lead:'让机器在提交前替你挑错。',tags:['工程'],blocks:[
      {t:'code',lang:'Bash · 工具链',x:'gcc -std=c2x -Wall -Wextra -Wpedantic -Wconversion -Wshadow \\\n    -Wstrict-prototypes -Werror -fanalyzer main.c -o app\nclang --analyze main.c                 # Clang Static Analyzer\nclang-tidy main.c -checks="*" -- -std=c2x\ncppcheck --enable=all --inconclusive .  # 轻量静态检查\nclang-format -i *.c *.h                # 统一格式'},
      {t:'ul',items:[
        '<b>编译警告全开</b>：<code>-Wall -Wextra -Wpedantic -Wconversion -Wshadow -Wstrict-prototypes</code>，CI 用 <code>-Werror</code>',
        '<code>-fanalyzer</code>（GCC）能静态追踪内存泄漏、双重释放、空指针解引用等路径',
        '<code>clang-tidy</code>/<code>cppcheck</code> 检查命名、可读性、常见误用；<code>clang-format</code> 统一风格并写进 pre-commit',
        '团队规范建议：MISRA C（汽车/嵌入式）、CERT C（安全）、或自定的精简规则集；关键是不靠人眼记',
        '代码审查清单：边界、错误路径、所有权、并发、格式串、返回值检查'
      ]}
    ]},
    {id:'c-6-9',num:'6.9',title:'附录：全卷速查与学习路线',lead:'把六章压成一张表，然后给出下一步。',tags:['总结'],blocks:[
      {t:'table',head:['章','主题','必须掌握'],rows:[
        ['1 基础','语言定位 / C23 / 类型 / 运算符 / I/O','<code>int main(void)</code>、<code>sizeof</code>、整型提升、格式串与返回值检查'],
        ['2 中级','控制流 / 函数 / 数组 / 指针 / 结构体','数组退化、指针算术、const 位置、存储期与链接、位域'],
        ['3 进阶','动态内存 / 函数指针 / 文件 / 预处理 / 多文件','malloc/free 所有权、realloc 失败处理、头文件守卫、<code>#embed</code>'],
        ['4 C23','新关键字 / constexpr / typeof / 属性 / 溢出检查','<code>nullptr</code>、<code>constexpr</code>、<code>[[nodiscard]]</code>、<code>ckd_add</code>'],
        ['5 数据结构','线性表 / 树 / 哈希 / 排序 / 泛型','复杂度、比较函数写法、lower_bound、_Generic'],
        ['6 工程','构建 / 测试 / 内存安全 / 并发 / POSIX','Makefile 依赖、ASan/UBSan、原子与互斥、profile 优先']
      ]},
      {t:'p',x:'<b>推荐路线</b>：① 按 1→6 顺序通读并敲一遍每节示例；② 用 C23 写一个小项目（如命令行 TODO、简易 JSON 解析器、词法分析器）；③ 给它补上 Makefile、单元测试、ASan 构建与 <code>clang-format</code>；④ 再回头读 C 标准草案与《C Programming Language》《Expert C Programming》《C Interfaces and Implementations》。'},
      {t:'p',x:'<b>与 C* 的关系</b>：本卷姊妹篇 <a href="#cstar" style="color:#4fd6a8">C* 语言教程</a> 用更友好的关键字建立同样的程序思维；学完那边再来这边，重点补「指针、内存所有权、未定义行为」这三根弦。'},
      {t:'note',k:'最后一句',x:'C 的核心不是语法，而是<b>对内存与生命周期的精确责任</b>。把每个字节从哪来、活多久、归谁管想清楚，剩下的都是查文档的事。'}
    ]}
  ]}
  ]
};
