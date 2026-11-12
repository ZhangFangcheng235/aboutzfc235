/* ==========================================================
   逐节扩写 · C 语言 第 1~2 章（c-1-* / c-2-*）
   每节在原有教程之后追加：深入原理、更多示例、对照表、易错陷阱、练习
   块类型：h / p / ul / ol / steps / cards / table / code / note / ex / faq / quote
   ========================================================== */
window.WIKI_X_C1 = {

/* ---------------- 第 1 章 ---------------- */
'c-1-1': [
  {t:'h',x:'深入：C 的设计哲学与「抽象渗漏」'},
  {t:'p',x:'C 的诞生目标很窄：用一种足够高级、又足够贴近机器的语言重写 UNIX 内核。于是它做了三个刻意的选择——<b>语法几乎一一对应机器指令</b>、<b>不提供运行时</b>、<b>相信程序员</b>。这三条决定了 C 的全部优点与全部缺点：你可以精确控制每一个字节，也必须亲自为每一个字节负责。'},
  {t:'p',x:'所谓「可移植的汇编」，重点是<b>可移植</b>而不是「汇编」：C 定义了抽象机器（abstract machine）上的语义，编译器负责把它映射到现在千差万别的 CPU 上。当你写 <code>a + b</code> 时，你描述的是抽象机上的整数加法；编译器可以重排、向量化、常量折叠，只要<b>可观察行为</b>一致。反过来，一旦触发未定义行为，抽象机就不再对你的程序做任何承诺。'},
  {t:'table',head:['维度','C','C++','Rust'],rows:[
    ['抽象层次','过程式，直接映射内存','多范式，零成本抽象','所有权 + 生命周期，编译期保证安全'],
    ['内存管理','手动 <code>malloc/free</code>','RAII / 智能指针','所有权系统，无 GC 也安全'],
    ['运行时','几乎没有','异常、RTTI、标准库','无 GC，panic 与少量运行时'],
    ['未定义行为','数量多、后果严重','同样继承 C 的大部分 UB','安全 Rust 中几乎不存在'],
    ['典型用途','内核、驱动、嵌入式、解释器','游戏引擎、高性能服务','系统软件、浏览器组件、CLI']
  ]},
  {t:'cards',items:[
    ['适合用 C','操作系统内核、驱动、固件、虚拟机、语言运行时、需要精确 ABI 的库、极致资源受限环境'],
    ['不适合用 C','业务后台、Web 服务、需要大量字符串/JSON 处理的场景、对内存安全零容忍且不打算做形式化验证的项目'],
    ['学 C 的真正收益','理解调用栈、链接、字节序、缓存行、系统调用——这些是任何语言都绕不开的地基']
  ]},
  {t:'note',kind:'tip',k:'心智模型',x:'把每个对象想象成「一段带类型的字节」，把指针想象成「这段字节的起始地址 + 一个步长」。之后数组、结构体、类型转换、对齐都只是这个模型的推论。'},
  {t:'ex',k:'思考题',items:[
    '为什么 C 标准把「数组越界」规定为未定义行为，而不是直接定义成「报错」或「返回 0」？如果强制检查，会付出什么代价？',
    '一门语言如果自带垃圾回收，为什么难以用来写操作系统内核的内存分配器？',
    '举出一个「编译器优化后结果不符合直觉」的未定义行为例子，并说明编译器为什么可以那样做。'
  ]}
],

'c-1-2': [
  {t:'h',x:'深入：C23 迁移清单与编译器支持'},
  {t:'p',x:'C23 不是一次「加语法糖」的小更新，而是<b>把过去靠头文件和下划线关键字提供的能力收进语言核心</b>：过去要 <code>#include &lt;stdbool.h&gt;</code> 才能用 <code>bool</code>，写 <code>_Bool</code>；现在 <code>bool / true / false</code> 是关键字。同理 <code>static_assert</code>、<code>alignas</code>、<code>alignof</code>、<code>thread_local</code>、<code>typeof</code> 都摆脱了下划线前缀。'},
  {t:'table',head:['C17 写法','C23 写法','变化性质'],rows:[
    ['<code>#include &lt;stdbool.h&gt;</code> + <code>bool</code>','直接 <code>bool / true / false</code>','关键字化，头文件变空壳'],
    ['<code>NULL</code>（<code>&lt;stddef.h&gt;</code>）','<code>nullptr</code>','有类型的空指针常量'],
    ['<code>_Static_assert(...)</code>','<code>static_assert(...)</code>','去掉下划线'],
    ['<code>_Alignof / _Alignas</code>','<code>alignof / alignas</code>','去掉下划线'],
    ['<code>__typeof__</code>（编译器扩展）','<code>typeof / typeof_unqual</code>','标准化'],
    ['<code>void f();</code> 表示「参数未知」','等价于 <code>void f(void)</code>','移除旧式声明'],
    ['<code>??=</code> 等三字母词','已删除','语法清理'],
    ['外部工具 <code>xxd -i</code> 生成数组','<code>#embed "data.bin"</code>','原生嵌入二进制']
  ]},
  {t:'code',lang:'Bash · 确认编译器版本与 C23 支持',x:`# GCC 14+ / Clang 18+ 对 C23 支持较完整；较老版本用 -std=c2x
gcc   --version
clang --version
echo 'int main(void){bool ok=true;return ok?0:1;}' > t.c
gcc -std=c23 -Wall -Wextra -Wpedantic t.c -o t && ./t
# 若报 "unrecognized command-line option -std=c23"，改用 -std=c2x`},
  {t:'note',kind:'warn',k:'兼容性陷阱',x:'C23 里 <code>bool</code> 成为关键字后，老代码中若有 <code>typedef int bool;</code> 或 <code>#define bool _Bool</code> 会直接编译失败。迁移顺序建议：先删掉这类自定义定义，再切 <code>-std=c23</code>。'},
  {t:'p',x:'另一个容易踩的点是 <code>void f();</code>。C17 里它是「参数未指定」的旧式声明，调用时传几个参数编译器都不管；<b>C23 起它等价于 <code>void f(void)</code></b>，多传参数会报错。这对提升安全性是好事，但会让依赖旧式声明的代码需要显式补上原型。'},
  {t:'faq',q:'现在学 C，应该学 C99/C11 还是直接 C23？',a:'直接学 C23。它的核心变化（<code>bool</code>、<code>nullptr</code>、<code>constexpr</code>、<code>#embed</code>）都是让代码更清晰、更安全，而不是增加负担。同时要能读懂存量代码里的 <code>_Bool</code>、<code>NULL</code>、<code>_Static_assert</code>——本教程 1.2 与第 4 章都给了对照表。'},
  {t:'ex',k:'迁移练习',items:[
    '把一段使用 <code>NULL</code> 和 <code>typedef enum { FALSE, TRUE } BOOL;</code> 的旧代码改写成 C23 风格。',
    '查资料说明为什么 <code>nullptr</code> 比 <code>NULL</code> 更安全（提示：考虑 <code>NULL</code> 在 C 中可能被定义为 <code>0</code> 或 <code>((void*)0)</code>）。',
    '用 <code>-std=c17</code> 和 <code>-std=c2x</code> 分别编译同一段代码，记录所有新增警告。'
  ]}
],

'c-1-3': [
  {t:'h',x:'深入：三大平台的环境搭建与逐行拆解'},
  {t:'table',head:['平台','推荐工具链','安装方式','验证命令'],rows:[
    ['Linux','GCC / Clang + make + gdb','<code>sudo apt install build-essential gdb</code>','<code>gcc --version</code>'],
    ['macOS','Apple Clang（Xcode CLT）','<code>xcode-select --install</code>','<code>clang --version</code>'],
    ['Windows','MSYS2 + MinGW-w64 GCC','安装 MSYS2 后 <code>pacman -S mingw-w64-x86_64-gcc</code>','<code>gcc --version</code>'],
    ['在线','Compiler Explorer / Godbolt','浏览器直接打开 godbolt.org','选择 gcc / clang 并设 <code>-std=c2x</code>']
  ]},
  {t:'code',lang:'C23 · 带注释的最小程序',x:`#include <stdio.h>          // 声明 printf 等标准 I/O 函数

/* main 是唯一由标准保证的程序入口。
   参数写成 void 明确表示不接收命令行参数。*/
int main(void) {
    // 字符串字面量是 char[13]，末尾自动有一个 '\\0'
    printf("Hello, C23!\\n");
    return 0;                // 返回给操作系统的退出码
}`},
  {t:'steps',items:[
    ['预处理','<code>cpp hello.c &gt; hello.i</code>：把 <code>#include</code> 展开成上千行声明，处理所有 <code>#</code> 指令。'],
    ['编译','<code>gcc -S hello.i -o hello.s</code>：生成汇编，此时能看到 <code>printf</code> 只是一条 <code>call</code> 指令。'],
    ['汇编','<code>as hello.s -o hello.o</code>：生成可重定位目标文件，里面 <code>printf</code> 的地址还是待填的占位。'],
    ['链接','<code>gcc hello.o -o hello</code>：与 libc 合并，解析 <code>printf</code> 的真实地址（通常是动态链接）。']
  ]},
  {t:'table',head:['常见编译错误','典型报错','原因'],rows:[
    ['漏分号','<code>expected ; before ...</code>','语句结尾缺少 <code>;</code>'],
    ['用了未声明函数','<code>implicit declaration of function</code>','忘记 <code>#include</code> 对应头文件'],
    ['拼错 main','<code>undefined reference to main</code>','入口函数名写错或文件没参与链接'],
    ['中文全角符号','<code>stray \\302 in program</code>','把 <code>；</code> <code>（）</code> 当成半角符号输入'],
    ['链接数学库','<code>undefined reference to sqrt</code>','用了 <code>&lt;math.h&gt;</code> 却没加 <code>-lm</code>']
  ]},
  {t:'note',kind:'warn',k:'第一个就该养成的习惯',x:'从写第一行代码起就固定使用 <code>-Wall -Wextra -Wpedantic -Werror</code>。C 编译器其实很早就知道很多问题，只是默认不说；把警告当错误，能省掉后面几百小时的调试。'},
  {t:'code',lang:'Bash · 推荐的日常编译脚本',x:`#!/bin/sh
set -e
SRC=\${1:-main.c}
gcc -std=c2x -Wall -Wextra -Wpedantic -Werror -g -O0 "$SRC" -o app
./app`},
  {t:'ex',k:'动手练一练',items:[
    '故意删掉 <code>#include &lt;stdio.h&gt;</code>，观察报错；再故意把 <code>return 0;</code> 删掉，看程序退出码是否仍为 0。',
    '用 <code>-E</code> 生成预处理结果，找出 <code>printf</code> 的声明长什么样。',
    '把 <code>printf</code> 改成 <code>fprintf(stderr, ...)</code>，理解 stdout 与 stderr 的区别。'
  ]}
],

'c-1-4': [
  {t:'h',x:'深入：目标文件、符号与链接到底做了什么'},
  {t:'p',x:'理解「编译」与「链接」的分工，是理解 C 工程的第一道分水岭。编译器每次只处理<b>一个翻译单元</b>（一个 <code>.c</code> 加上它递归包含的所有头文件），它看不到别的文件。所以调用外部函数时，编译器只能根据<b>声明</b>生成一条「调用某某符号」的占位指令；真正把占位换成地址，是链接器的工作。'},
  {t:'code',lang:'Bash · 四阶段实操与符号查看',x:`# 1) 只预处理
gcc -E main.c -o main.i
# 2) 只编译到汇编
gcc -S main.c -o main.s
# 3) 只汇编到目标文件
gcc -c main.c -o main.o
# 4) 链接
gcc main.o helper.o -o app

# 查看目标文件里的符号：U 表示「未定义，等链接器填」
nm main.o
# 查看可执行文件依赖的动态库
ldd app        # Linux
otool -L app   # macOS`},
  {t:'table',head:['符号类型','<code>nm</code> 标记','含义'],rows:[
    ['已定义全局函数','<code>T</code>','在代码段，可被其他文件引用'],
    ['已定义全局变量','<code>D</code> / <code>B</code>','已初始化数据段 / 未初始化 BSS'],
    ['未定义引用','<code>U</code>','本文件只用没定义，需链接器解析'],
    ['文件内静态','<code>t</code> / <code>d</code>','小写表示内部链接，别的文件看不见'],
    ['弱符号','<code>W</code>','可被强符号覆盖']
  ]},
  {t:'p',x:'链接错误里最常见的两类：<b>undefined reference</b>（声明了但没定义，或忘了把某个 <code>.o</code> 加进命令）和 <b>multiple definition</b>（同一个全局符号在多个翻译单元里定义了实体）。后者正是「头文件里只放声明、不放定义」这条规则存在的原因——见 3.6。'},
  {t:'table',head:['链接方式','优点','缺点'],rows:[
    ['静态链接 <code>.a</code>','发布单文件、无运行时依赖','体积大、库升级要重新链接'],
    ['动态链接 <code>.so/.dll</code>','多个程序共享、可单独升级','部署需带齐依赖，存在版本兼容问题'],
    ['直接合并 <code>.o</code>','最简单，教学项目常用','文件一多就难管理，需 Makefile']
  ]},
  {t:'note',kind:'tip',k:'调试技巧',x:'遇到「明明写了函数却报 undefined reference」，先跑 <code>nm 文件.o | grep 函数名</code>：如果输出是 <code>U</code> 说明这个文件只是调用方，定义可能在另一个没被链接的 <code>.o</code> 里。'},
  {t:'ex',k:'动手练一练',items:[
    '建两个文件：<code>main.c</code> 调用 <code>add()</code>，<code>helper.c</code> 定义它。分别只链接 <code>main.o</code> 与两个都链接，对比报错。',
    '把 <code>add()</code> 的定义写进被两个 <code>.c</code> 同时包含的头文件，观察 multiple definition 报错，再用 <code>static</code> 或 <code>inline</code> 修复。',
    '用 <code>nm</code> 观察加 <code>static</code> 前后符号大小写的变化。'
  ]}
],

'c-1-5': [
  {t:'h',x:'深入：补码、整数提升与固定宽度类型'},
  {t:'p',x:'C23 明确规定有符号整数使用<b>二进制补码</b>表示（此前标准允许符号-数值表示和反码，导致 <code>-1</code> 的位模式不唯一）。补码的好处是加减法可以用同一套电路，且 <code>-x == ~x + 1</code>。但注意：<b>有符号溢出仍然是未定义行为</b>，编译器可以假定它永不发生。'},
  {t:'code',lang:'C23 · 位模式与溢出检查',x:`#include <stdio.h>
#include <stdint.h>
#include <limits.h>
#include <stdckdint.h>   // C23：带进位的加减法

int main(void) {
    int8_t a = 127;
    // 有符号溢出是 UB，不要写 a + 1 去"看看结果"
    int8_t r;
    if (ckd_add(&r, a, 1)) puts("溢出：结果无法用 int8_t 表示");
    else printf("结果 = %d\\n", r);

    printf("int 位数=%d, 最小值=%d, 最大值=%d\\n",
           (int)(sizeof(int) * CHAR_BIT), INT_MIN, INT_MAX);

    // 无符号溢出是良定义的：按 2^n 取模回绕
    uint8_t u = 255;
    printf("255 + 1 = %u\\n", (unsigned)(u + 1));
    return 0;
}`},
  {t:'table',head:['类型','典型宽度','取值范围','用途'],rows:[
    ['<code>char</code>','8 bit','由实现决定是否有符号','字符，不适合做算术'],
    ['<code>int</code>','32 bit','至少 −32767…32767','默认整数类型，速度通常最优'],
    ['<code>long long</code>','≥64 bit','至少 ±9.2×10¹⁸','大整数'],
    ['<code>int32_t</code>','恰好 32 bit','−2³¹…2³¹−1','协议、文件格式、跨平台确定性'],
    ['<code>uint64_t</code>','恰好 64 bit','0…2⁶⁴−1','位掩码、哈希、计数器'],
    ['<code>size_t</code>','字长','0…SIZE_MAX','数组下标、<code>sizeof</code> 结果'],
    ['<code>ptrdiff_t</code>','字长','有符号','两个指针相减的结果']
  ]},
  {t:'p',x:'<b>整数提升（integer promotion）</b>是 C 里最隐蔽的规则之一：凡是需要整数运算的表达式，<code>char</code>、<code>short</code>、位域、枚举都会先被提升为 <code>int</code>（若 <code>int</code> 装不下则提升为 <code>unsigned int</code>）。所以 <code>(uint8_t)0xFF + 1</code> 的类型其实是 <code>int</code>，结果是 256 而不是 0。'},
  {t:'note',kind:'warn',k:'有符号 / 无符号混用',x:'<code>-1 &lt; 1u</code> 的结果是 <code>false</code>：比较前 <code>-1</code> 被转换成 <code>unsigned int</code>，变成 <code>UINT_MAX</code>。用 <code>-Wsign-compare</code>（<code>-Wall -Wextra</code> 已包含）抓这类问题；循环下标统一用 <code>size_t</code>，别混用 <code>int</code>。'},
  {t:'cards',items:[
    ['选类型的原则','计数与下标用 <code>size_t</code>；需要精确位宽用 <code>intN_t</code>；一般数值用 <code>int</code>；浮点默认 <code>double</code> 而非 <code>float</code>'],
    ['char 的符号性','<code>char</code> 是否有符号由实现定义。存字节请用 <code>unsigned char</code> 或 <code>uint8_t</code>，别用裸 <code>char</code>'],
    ['浮点注意','<code>float</code> 字面量要写 <code>1.0f</code>；不要用 <code>==</code> 比较浮点数；金额不要用二进制浮点']
  ]},
  {t:'ex',k:'动手练一练',items:[
    '打印 <code>sizeof(char) / short / int / long / long long / float / double / void*</code>，记录你所在平台的结果。',
    '解释 <code>sizeof(1.0f) == sizeof(1.0)</code> 是否成立，以及 <code>1.0f + 1.0</code> 的结果类型。',
    '写程序验证 <code>(uint8_t)255 + 1</code> 的类型与值，并说明整数提升如何影响它。'
  ]}
],

'c-1-6': [
  {t:'h',x:'深入：const、constexpr 与对象的存储位置'},
  {t:'p',x:'C 里的 <code>const</code> 含义是「通过这个对象名不可修改」，<b>不等于编译期常量</b>。所以 <code>const int n = 10; int a[n];</code> 在 C 文件作用域是非法的（<code>n</code> 不是常量表达式），这点和 C++ 不同。C23 引入 <code>constexpr</code> 才真正补上了「编译期常量」这一格。'},
  {t:'code',lang:'C23 · const vs constexpr',x:`#include <stdio.h>
const     int A = 10;        // 只读对象，不是常量表达式
constexpr int B = 20;        // C23：真正的编译期常量

int main(void) {
    int arr[B];              // OK：B 是常量表达式
    // int arr2[A];          // C 中不允许（A 不是常量表达式）
    constexpr double PI = 3.141592653589793;
    constexpr int MASK = 0b1111'0000;   // C23 二进制字面量 + 分隔符
    printf("B=%d MASK=%d PI=%.6f sizeof(arr)=%zu\\n", B, MASK, PI, sizeof arr);
    return 0;
}`},
  {t:'table',head:['字面量','类型','说明'],rows:[
    ['<code>42</code>','<code>int</code>','十进制，最小的能容纳的 int 类型'],
    ['<code>42U / 42L / 42LL</code>','<code>unsigned / long / long long</code>','后缀改变类型'],
    ['<code>0x2A / 0b101010 / 052</code>','整型','十六进制 / C23 二进制 / 八进制'],
    ['<code>1\'000\'000</code>','整型','C23 数字分隔符，单引号只是可读性'],
    ['<code>1.0 / 1.0f / 1.0L</code>','<code>double / float / long double</code>','无后缀默认 double'],
    ['<code>"abc"</code>','<code>char[4]</code>','静态存储，含结尾 NUL，修改它是 UB'],
    ['<code>u8"abc"</code>','<code>char8_t[]</code>','C23 UTF-8 字符串字面量']
  ]},
  {t:'p',x:'字符串字面量存放在只读静态区，<code>char *p = "abc"; p[0] = \'x\';</code> 是未定义行为（通常直接段错误）。正确写法是 <code>char s[] = "abc";</code>——这会分配一个可写的数组并把字面量<b>拷贝</b>进去。C23 起建议在指向字面量时用 <code>const char *</code>，让编译器帮你拦住误改。'},
  {t:'note',kind:'tip',k:'初始化',x:'局部变量不会自动清零。养成「声明即初始化」的习惯：<code>int count = 0;</code>；聚合类型用 <code>= {0}</code> 或 C99 指定初始化器 <code>struct P p = {.x = 1, .y = 2};</code>，既清晰又不怕成员顺序调整。'},
  {t:'ex',k:'动手练一练',items:[
    '分别用 <code>const int</code> 与 <code>constexpr int</code> 声明数组长度，验证哪个能通过编译。',
    '写程序打印 <code>sizeof("abc")</code> 与 <code>strlen("abc")</code>，解释差 1 的原因。',
    '解释为什么 <code>char *p = "abc"</code> 应写成 <code>const char *</code>，并试试用 <code>-Wwrite-strings</code> 编译。'
  ]}
],

'c-1-7': [
  {t:'h',x:'深入：求值顺序、序列点与未定义行为'},
  {t:'p',x:'运算符优先级只决定「谁和谁结合」，<b>不决定「谁先算」</b>。在 <code>f() + g() * h()</code> 里，乘法优先于加法，但三个函数的调用顺序完全未指定。C 用<b>序列点（sequenced before）</b>描述先后顺序：只有 <code>&amp;&amp;</code>、<code>||</code>、<code>?:</code>、逗号运算符、以及完整表达式结尾等少数位置能确定先后。'},
  {t:'code',lang:'C · 危险写法与安全写法对照',x:`#include <stdio.h>
int main(void) {
    int i = 0;
    // 危险：同一表达式里既读又改 i，且无序列点 => UB
    // printf("%d %d\\n", i++, i++);
    // 危险：数组下标与自增混用
    // a[i] = i++;

    // 安全：拆成两条语句（分号是序列点）
    int a = i++;
    int b = i++;
    printf("a=%d b=%d i=%d\\n", a, b, i);

    // 短路是有保证的顺序，常用于防空指针
    int *p = 0;
    if (p != 0 && *p > 0) puts("positive");   // 不会解引用空指针

    // 逗号运算符也有确定顺序
    int x = (puts("first"), 42);
    printf("x=%d\\n", x);
    return 0;
}`},
  {t:'table',head:['运算符','结合性','常见坑'],rows:[
    ['<code>++ -- (后缀)</code>','左→右','<code>i++ + i++</code> 是 UB'],
    ['<code>!</code> <code>~</code> <code>(type)</code> <code>sizeof</code>','右→左','<code>sizeof x + 1</code> 易误读，加括号'],
    ['<code>* / %</code>','左→右','整数除法向零取整，负数取模符号跟被除数'],
    ['<code>&lt;&lt; &gt;&gt;</code>','左→右','有符号负数右移、移位超过位宽都是 UB'],
    ['<code>&amp; ^ |</code>','左→右','优先级低于 <code>==</code>，<code>x &amp; 1 == 0</code> 不是你想要的意思'],
    ['<code>&amp;&amp; ||</code>','左→右','有短路与序列点，右侧可能不执行'],
    ['<code>= += ...</code>','右→左','赋值表达式本身有值，<code>if (x = 1)</code> 恒真']
  ]},
  {t:'note',kind:'danger',k:'最容易写出的 UB',x:'<code>i = i++ + 1;</code>、<code>printf("%d %d", i++, i++);</code>、<code>a[i] = i++;</code>、<code>1 &lt;&lt; 32</code>（32 位 int）、<code>-1 &gt;&gt; 1</code>（有符号右移由实现定义）——这些在笔试和真实 bug 里都极常见。<code>-Wall</code> 能报一部分，但不能全靠它。'},
  {t:'p',x:'位运算优先级尤其反直觉：<code>&amp;</code> 比 <code>==</code> 低，所以 <code>if (flags &amp; MASK == MASK)</code> 会被解析成 <code>flags &amp; (MASK == MASK)</code>。<b>凡是位运算与比较混写，一律加括号</b>：<code>if ((flags &amp; MASK) == MASK)</code>。'},
  {t:'ex',k:'动手练一练',items:[
    '用 <code>-Wall -Wextra -Wsequence-point</code> 编译一段含 <code>i++ + i++</code> 的代码，看编译器怎么说。',
    '不借助临时变量，用异或交换两个整数，并说明它在 <code>a</code> 与 <code>b</code> 是同一对象时为什么失效。',
    '解释 <code>x &amp; 1 == 0</code> 与 <code>(x &amp; 1) == 0</code> 的区别。'
  ]}
],

'c-1-8': [
  {t:'h',x:'深入：格式字符串、缓冲区与 scanf 的坑'},
  {t:'p',x:'<code>printf</code> 是变参函数，编译器无法自动把参数个数和格式符一一对应（现代编译器靠特殊属性才能给出警告）。格式符与参数类型不匹配属于未定义行为，轻则打印乱码，重则崩溃。尤其注意 <code>%zu</code> 对应 <code>size_t</code>、<code>%p</code> 需要 <code>(void*)</code>、<code>%lld</code> 对应 <code>long long</code>。'},
  {t:'table',head:['格式符','对应类型','备注'],rows:[
    ['<code>%d / %u / %x</code>','<code>int / unsigned / unsigned</code>','<code>%#x</code> 带 0x 前缀'],
    ['<code>%lld / %llu</code>','<code>long long / unsigned long long</code>','别写成 <code>%ld</code>'],
    ['<code>%zu / %td</code>','<code>size_t / ptrdiff_t</code>','C99 起，C23 还可用 <code>%b</code> 打印二进制'],
    ['<code>%f / %g / %e</code>','<code>double</code>','<code>printf</code> 中 <code>float</code> 会提升为 double'],
    ['<code>%c / %s</code>','<code>int / char*</code>','<code>%s</code> 遇 NUL 才停，务必保证有结尾'],
    ['<code>%p</code>','<code>void*</code>','传别的指针类型严格说要强转'],
    ['<code>%n</code>','<code>int*</code>','写回已输出字符数，常被安全规范禁用']
  ]},
  {t:'code',lang:'C23 · 安全的输入方式',x:`#include <stdio.h>
#define BUF 64

int main(void) {
    char line[BUF];
    int  age;

    // 推荐：先整行读入，再解析。永远指定宽度，避免溢出
    if (fgets(line, sizeof line, stdin) == 0) return 1;
    if (sscanf(line, "%d", &age) != 1) {
        fputs("输入不是整数\\n", stderr);
        return 1;
    }
    printf("age=%d\\n", age);

    // scanf 常见坑：%s 不限制宽度、残留换行、返回值未检查
    // scanf("%s", line);   // 危险，输入过长就溢出
    // scanf("%63s", line); // 至少要限宽，但仍残留 '\\n'
    return 0;
}`},
  {t:'ul',items:[
    '<b>stdin/stdout 有缓冲</b>：stdout 连到终端时通常行缓冲，重定向到文件时全缓冲，所以调试日志可能「不及时出现」——用 <code>fflush(stdout)</code> 或写 stderr。',
    '<b>scanf 会留下换行</b>：连续 <code>scanf("%d", ...)</code> 后再 <code>fgets</code> 常读到空行；格式串前加一个空格可跳过空白：<code>scanf(" %c", &amp;ch)</code>。',
    '<b>一定检查返回值</b>：<code>scanf</code> 返回成功赋值的项数，输入不匹配时会一直卡在缓冲区里，导致后面的读取全部失败。',
    '<b>不要用 <code>gets</code></b>：它已在 C11 被移除，因为无法限制长度，是经典缓冲区溢出源头。'
  ]},
  {t:'note',kind:'tip',k:'格式化输出到字符串',x:'需要拼接时用 <code>snprintf(buf, sizeof buf, ...)</code>，它会截断且保证 NUL 结尾；返回值是「本应写入的长度」，若 <code>&gt;= sizeof buf</code> 说明被截断了。C23 起还可考虑 <code>strdup</code>/<code>asprintf</code> 类扩展（后者是 POSIX 而非标准 C）。'},
  {t:'ex',k:'动手练一练',items:[
    '写一个程序用 <code>printf("%b\\n", 0b1010\'1100u)</code> 打印二进制，观察 C23 的 <code>%b</code> 输出。',
    '故意输入非数字，观察不检查 <code>scanf</code> 返回值时程序会怎样。',
    '用 <code>snprintf</code> 实现安全的字符串拼接，并处理返回值表示的截断情况。'
  ]}
],

'c-1-9': [
  {t:'h',x:'深入：把警告当错误的工程习惯'},
  {t:'table',head:['编译选项','抓到什么','建议'],rows:[
    ['<code>-Wall</code>','最常用的一批警告','必开'],
    ['<code>-Wextra</code>','未用参数、符号比较、缺初值等','必开'],
    ['<code>-Wpedantic</code>','使用了编译器扩展','必开，保证可移植'],
    ['<code>-Werror</code>','把警告升级为错误','CI 中必开'],
    ['<code>-Wconversion</code>','隐式窄化转换','数值敏感项目建议开'],
    ['<code>-Wshadow</code>','局部变量遮蔽外层变量','建议开'],
    ['<code>-Wformat=2</code>','格式串与类型不匹配','建议开'],
    ['<code>-fsanitize=address,undefined</code>','运行时越界 / UB','开发期常开，见 6.4']
  ]},
  {t:'code',lang:'Bash · 开发期 / 发布期两套编译',x:`# 开发期：符号 + 无优化 + 全套 sanitizer
gcc -std=c2x -Wall -Wextra -Wpedantic -Werror -Wshadow \\
    -g -O0 -fsanitize=address,undefined main.c -o app_dev

# 发布期：优化 + 去掉符号
gcc -std=c2x -Wall -Wextra -Wpedantic -Werror -O2 -DNDEBUG \\
    -s main.c -o app`},
  {t:'p',x:'注释应该回答「为什么」，而不是复述「做什么」。<code>i++; // i 加一</code> 是噪音；<code>/* 这里必须重读寄存器，硬件会在读后清除标志位 */</code> 才有价值。C23 同时支持 <code>//</code> 与 <code>/* */</code>，注意块注释不能嵌套，且注释在预处理阶段就被替换成一个空格（所以 <code>a/*x*/b</code> 是 <code>a b</code> 而不是 <code>ab</code>）。'},
  {t:'cards',items:[
    ['命名','函数与变量用 <code>snake_case</code>；宏全大写；类型名可加 <code>_t</code> 后缀（但 POSIX 保留了该后缀，谨慎）；布尔函数用 <code>is_</code> / <code>has_</code> 前缀'],
    ['头文件','每个 <code>.c</code> 配一个同名 <code>.h</code>，头文件自带 include guard 或 <code>#pragma once</code>，只放声明不放定义'],
    ['函数','单个函数尽量不超过一屏；参数超过 4 个考虑封装成结构体；所有内部辅助函数加 <code>static</code>'],
    ['错误处理','统一约定返回值含义（0 成功 / 负数错误码），资源释放走单一出口或 goto cleanup，见 6.1']
  ]},
  {t:'note',kind:'tip',k:'工具链',x:'除了编译器，再加两件工具就能挡住大半低级错误：<code>clang-format</code> 统一格式（提交前自动跑），<code>clang-tidy</code> 或 <code>cppcheck</code> 做静态分析。它们与 <code>-Werror</code> 搭配，是 C 项目最低成本的质量防线。'},
  {t:'ex',k:'动手练一练',items:[
    '把本章所有示例都用 <code>-Wall -Wextra -Wpedantic -Werror -std=c2x</code> 编译一遍，记录并修掉所有警告。',
    '给一段故意含未用变量、符号比较、隐式窄化的代码加编译选项，看每种警告分别由哪个选项触发。',
    '写一个 <code>Makefile</code>，提供 <code>make dev</code> 与 <code>make release</code> 两个目标（详见 6.2）。'
  ]}
],

/* ---------------- 第 2 章 ---------------- */
'c-2-1': [
  {t:'h',x:'深入：switch 的贯穿、范围与布尔判断'},
  {t:'p',x:'<code>switch</code> 的表达式必须是整数类型（含枚举、字符），<code>case</code> 标签必须是常量表达式。它本质是「跳转到某个标签」，所以<b>不加 <code>break</code> 会一路贯穿</b>到下一个 <code>case</code>——这既是经典 bug，也是刻意合并多个分支的有用技巧。C23 起可以用 <code>[[fallthrough]]</code> 属性明确标注「我是故意的」，编译器便不再警告。'},
  {t:'code',lang:'C23 · fallthrough 属性与合并分支',x:`#include <stdio.h>

static void grade(char c) {
    switch (c) {
        case 'A': case 'B': case 'C':          // 合并分支，无需属性
            puts("及格"); break;
        case 'D':
            puts("补考");
            [[fallthrough]];                   // C23：明确声明故意贯穿
        case 'E':
            puts("需重修"); break;
        default:
            puts("未知等级"); break;
    }
}

int main(void) { grade('D'); grade('A'); return 0; }`},
  {t:'p',x:'C 没有「真值类型」之外的语义：<b>0 为假，一切非 0 为真</b>。所以 <code>if (x)</code> 对指针、浮点数、整数都成立，但各有风险：浮点与 0 精确比较本就不靠谱；指针应显式写 <code>if (p != nullptr)</code> 更清楚；把 <code>if (x == 1)</code> 写成 <code>if (x = 1)</code> 是恒真赋值，建议把常量放左边（<code>if (1 == x)</code>）或直接依赖 <code>-Wparentheses</code>。'},
  {t:'table',head:['写法','推荐度','理由'],rows:[
    ['<code>if (p != nullptr)</code>','★★★','意图明确，C23 用 nullptr'],
    ['<code>if (p)</code>','★★','简洁，C 圈常见惯用法'],
    ['<code>if (flag == true)</code>','★','冗余，且 true 只是 1，容易误导'],
    ['<code>if (x = 1)</code>','✗','赋值恒真，几乎总是笔误'],
    ['<code>if (d == 0.0)</code>','✗','浮点应比较容差 <code>fabs(d) &lt; EPS</code>']
  ]},
  {t:'note',kind:'warn',k:'default 不要省',x:'哪怕所有枚举值都覆盖了，也要写 <code>default</code>：枚举底层值可能来自外部输入、强转或内存损坏。省掉 default 又不处理返回值，编译器在 <code>-Wswitch</code> 下会提醒你「漏了某个枚举成员」。'},
  {t:'ex',k:'动手练一练',items:[
    '写一个把 1~12 映射到季度的 switch，用合并 case，并用 <code>[[fallthrough]]</code> 标注一处故意贯穿。',
    '编译含 <code>if (x = 1)</code> 的代码，看 <code>-Wall</code> 给出什么警告。',
    '把 <code>if/else if</code> 链与等价的 <code>switch</code> 都写出来，比较可读性与编译器生成的跳转表。'
  ]}
],

'c-2-2': [
  {t:'h',x:'深入：循环不变式、控制流与性能直觉'},
  {t:'p',x:'三种循环不是等价的替代品，而是表达不同意图：<b>次数已知用 <code>for</code></b>，<b>条件驱动用 <code>while</code></b>，<b>至少执行一次用 <code>do…while</code></b>。写循环时先在心里（或注释里）写下<b>循环不变式</b>——「每轮开始前什么一定成立」，这是证明循环正确、也是定位死循环最快的方法。'},
  {t:'code',lang:'C23 · 三种循环与常见控制流',x:`#include <stdio.h>

int main(void) {
    int a[] = {3, -1, 7, 0, 5};

    // for：下标范围一目了然，size_t 避免符号比较警告
    for (size_t i = 0; i < sizeof a / sizeof a[0]; ++i) {
        if (a[i] < 0) continue;      // 跳过负数
        if (a[i] == 7) break;        // 提前结束
        printf("%d ", a[i]);
    }
    puts("");

    // while：读到 EOF / 条件满足为止
    int n = 0, sum = 0;
    while (n < 5 && sum < 10) { sum += a[n] > 0 ? a[n] : 0; ++n; }
    printf("sum=%d, n=%d\\n", sum, n);

    // do…while：菜单这类"至少问一次"的场景
    int choice;
    do {
        choice = 0;                  // 模拟用户输入
        printf("choice=%d\\n", choice);
    } while (choice != 0);
    return 0;
}`},
  {t:'table',head:['陷阱','后果','规避'],rows:[
    ['<code>for (size_t i = n-1; i &gt;= 0; --i)</code>','<code>size_t</code> 永不小于 0，死循环','用 <code>i-- &gt; 0</code> 或倒序用有符号整数'],
    ['浮点做循环变量','累积误差导致多/少一轮','用整数计数，循环内换算成浮点'],
    ['循环条件里调用有副作用的函数','求值次数难推理','先算好再比较'],
    ['<code>while</code> 里忘记推进变量','死循环','写完立刻检查「哪一行让条件趋近为假」'],
    ['在循环里反复 <code>strlen(s)</code>','O(n²)','提前存 <code>size_t len = strlen(s)</code>']
  ]},
  {t:'note',kind:'tip',k:'编译器替你做的事',x:'<code>-O2</code> 下编译器会做循环展开、强度削减、向量化。不要手动「微优化」循环（比如把 <code>i++</code> 改成 <code>++i</code> 对整数毫无区别）；把精力放在<b>算法复杂度</b>和<b>内存访问局部性</b>上，见 6.7。'},
  {t:'ex',k:'动手练一练',items:[
    '用 <code>do…while</code> 写一个「输入直到合法」的校验循环，并写出它的循环不变式。',
    '找出并修复 <code>for (size_t i = 10; i &gt;= 0; --i)</code> 的死循环。',
    '分别用 while、for、递归求 1..n 之和，比较三者的终止条件写在哪里。'
  ]}
],

'c-2-3': [
  {t:'h',x:'深入：栈帧、参数传递与函数设计'},
  {t:'p',x:'C 的参数传递只有一种：<b>按值传递</b>。所谓「传址」只是「把指针的值拷贝一份」。因此函数内改 <code>int x</code> 不会影响调用方，但改 <code>*p</code> 会影响——因为两份指针副本指向同一块内存。数组作为参数时会自动<b>退化</b>为指向首元素的指针，所以函数里 <code>sizeof(arr)</code> 得到的是指针大小而非数组大小，必须额外传长度。'},
  {t:'code',lang:'C23 · 值传递 vs 指针参数',x:`#include <stdio.h>

static void by_value(int x) { x = 99; }
static void by_pointer(int *p) { if (p) *p = 99; }

// 数组参数会退化为指针，长度必须显式传
static int sum(const int *a, size_t n) {
    int s = 0;
    for (size_t i = 0; i < n; ++i) s += a[i];
    return s;
}

int main(void) {
    int v = 1;
    by_value(v);      printf("after by_value:   %d\\n", v);
    by_pointer(&v);   printf("after by_pointer: %d\\n", v);

    int arr[] = {1, 2, 3, 4};
    printf("sum=%d\\n", sum(arr, sizeof arr / sizeof arr[0]));
    return 0;
}`},
  {t:'table',head:['要素','规则','注意'],rows:[
    ['函数原型','先声明后使用，或定义在调用之前','C23 起 <code>void f();</code> 等价于 <code>void f(void)</code>'],
    ['返回值','非 <code>void</code> 函数所有路径都要 return','漏返回是 UB，<code>-Wreturn-type</code> 会报'],
    ['<code>static</code>','限制为内部链接','只在单个 <code>.c</code> 用的辅助函数一律加'],
    ['<code>inline</code>','给编译器内联提示，不保证内联','跨文件使用需配合头文件里的定义，见 3.6'],
    ['递归','必须有可达的基线条件','每层都压栈，深递归会栈溢出'],
    ['变参','<code>&lt;stdarg.h&gt;</code> 的 <code>va_list</code>','无法检查类型，见 3.9']
  ]},
  {t:'p',x:'设计时让函数<b>只做一件事</b>，并通过返回值报告错误。常见约定有两种：返回 <code>int</code> 错误码（0 成功，负数表示错误，结果通过指针参数带出），或返回指针（<code>nullptr</code> 表示失败）。前者在 C 库里更常见，因为不用额外查 <code>errno</code>；关键是整个项目<b>统一一种</b>，见 6.1。'},
  {t:'note',kind:'warn',k:'不要返回局部变量的地址',x:'<code>int *f(void){ int x = 1; return &amp;x; }</code> 返回的是已销毁栈帧的地址，属于典型的悬空指针。<code>-Wall</code> 会警告。需要返回数据，要么让调用方传入缓冲区，要么用 <code>malloc</code> 并在文档里写明「调用方负责 free」。'},
  {t:'ex',k:'动手练一练',items:[
    '写一个 <code>swap(int *a, int *b)</code>，并说明为什么参数必须是指针。',
    '写一个函数同时返回数组的最小值与最大值，用指针参数带出结果，返回 0/错误码。',
    '用递归实现阶乘，再用循环实现一遍；说明递归深度受什么限制。'
  ]}
],

'c-2-4': [
  {t:'h',x:'深入：内存布局、退化与变长数组'},
  {t:'p',x:'数组是「一段连续、同类型、有长度的对象」。<code>int a[3][4]</code> 在内存里就是 12 个连续的 <code>int</code>，按<b>行优先</b>排列：<code>a[0][0], a[0][1], …, a[2][3]</code>。<code>a[i][j]</code> 的地址是 <code>(char*)a + (i*4 + j)*sizeof(int)</code>——理解这一点，多维数组传参、指针运算、缓存友好性就都通了。'},
  {t:'code',lang:'C23 · 二维数组、指针与 VLA',x:`#include <stdio.h>

// 形参里第二维及之后必须写明，编译器要靠它算步长
static void print_matrix(size_t rows, size_t cols, const int m[rows][cols]) {
    for (size_t i = 0; i < rows; ++i) {
        for (size_t j = 0; j < cols; ++j) printf("%3d", m[i][j]);
        putchar('\\n');
    }
}

int main(void) {
    int m[2][3] = {{1,2,3},{4,5,6}};
    printf("sizeof(m)=%zu, sizeof(m[0])=%zu\\n", sizeof m, sizeof m[0]);
    printf("&m[0][0]=%p, &m[1][0]=%p\\n", (void*)&m[0][0], (void*)&m[1][0]);
    print_matrix(2, 3, m);

    // C99 起支持 VLA（C11 后为可选特性，C23 亦有条件支持）
    size_t n = 4;
    int vla[n];
    for (size_t i = 0; i < n; ++i) vla[i] = (int)i * 10;
    printf("vla[3]=%d\\n", vla[3]);
    return 0;
}`},
  {t:'table',head:['写法','<code>a</code> 是什么','<code>sizeof a</code>'],rows:[
    ['<code>int a[5];</code>','5 个 int 的数组','<code>5*sizeof(int)</code>'],
    ['函数形参 <code>int a[5]</code>','实为 <code>int*</code>','指针大小'],
    ['<code>int *p = a;</code>','指向首元素的指针','指针大小'],
    ['<code>int (*p)[5] = &amp;a;</code>','指向「5 个 int 的数组」的指针','指针大小'],
    ['<code>int *p[5]</code>','5 个指针组成的数组','<code>5*sizeof(int*)</code>'],
    ['<code>int m[2][3]</code>','2 个「3 元素数组」的数组','<code>6*sizeof(int)</code>']
  ]},
  {t:'note',kind:'danger',k:'越界零容忍',x:'C 不做边界检查：<code>a[5]</code> 在 <code>int a[5]</code> 上是 UB，可能读到相邻变量、破坏栈帧，且常常「看起来正常」直到优化等级改变。凡是下标来自外部输入，必须先显式判断 <code>if (i &lt; n)</code>；开发期用 ASan（6.4）兜底。'},
  {t:'p',x:'C99 引入的<b>指定初始化器</b>在数组上同样好用：<code>int a[10] = {[3] = 7, [9] = 1};</code> 只初始化指定位置，其余自动为 0。对稀疏配置表尤其合适，也比一长串手写 0 更不容易错位。'},
  {t:'ex',k:'动手练一练',items:[
    '打印一个 <code>int m[3][4]</code> 每行的首地址，验证相邻行相差 <code>4*sizeof(int)</code>。',
    '分别写「数组指针」与「指针数组」的声明，并说明如何用 <code>sizeof</code> 区分。',
    '用指定初始化器构造一张稀疏查找表，并用下标访问验证未指定项为 0。'
  ]}
],

'c-2-5': [
  {t:'h',x:'深入：字符串函数的安全边界与内存重叠'},
  {t:'p',x:'C 字符串不是「一种类型」，而是<b>约定</b>：一段以 NUL（<code>\\0</code>）结尾的 <code>char</code> 数组。标准库函数都靠扫描 NUL 来确定长度，因此缺了结尾字节就会越界读。<code>&lt;string.h&gt;</code> 里最容易出事的是不检查目标缓冲区大小的那几个函数。'},
  {t:'table',head:['函数','作用','风险 / 替代'],rows:[
    ['<code>strcpy</code>','整串拷贝','不检查目标大小 → 用 <code>snprintf</code> / <code>memcpy</code>（已知长度）'],
    ['<code>strncpy</code>','限长拷贝','可能不补 NUL，且会填满剩余空间 → 谨慎'],
    ['<code>strcat / strncat</code>','追加','需自己算剩余空间'],
    ['<code>strlen</code>','求长度','遇 NUL 才停；不含结尾 NUL'],
    ['<code>strcmp / strncmp</code>','比较','返回负/零/正，不是 −1/0/1'],
    ['<code>memcpy</code>','按字节拷贝','<b>区间重叠是 UB</b>'],
    ['<code>memmove</code>','按字节拷贝','允许重叠，稍慢但安全'],
    ['<code>memset</code>','按字节填充','只能填 0 / 0xFF 这类按字节值']
  ]},
  {t:'code',lang:'C23 · 安全的拼接与重叠拷贝',x:`#include <stdio.h>
#include <string.h>

int main(void) {
    char buf[16] = "abc";
    const char *suffix = "defghijklmnopqrst";   // 故意超长

    // snprintf 会截断并保证 NUL 结尾；返回值是"本应写入"的长度
    int need = snprintf(buf, sizeof buf, "%s%s", buf, suffix); // 注意：src/dst 重叠！
    // 上面写法本身有问题（buf 同时作源和目标），正确做法：
    char buf2[16] = "abc";
    int need2 = snprintf(buf2, sizeof buf2, "%s%s", "abc", suffix);
    printf("need=%d, buf2=%s\\n", need2, buf2);
    if (need2 >= (int)sizeof buf2) fputs("已截断\\n", stderr);

    // 重叠区间必须用 memmove
    char s[] = "abcdef";
    memmove(s + 2, s, 4);        // 把 "abcd" 移到偏移 2
    printf("s=%s\\n", s);        // ababcd
    (void)need;
    return 0;
}`},
  {t:'note',kind:'warn',k:'两个高频错误',x:'① <code>char s[3] = "abc";</code> 装不下结尾 NUL，会退化成 <code>char[3]</code> 且没有终止符；② <code>if (strcmp(a,b) == 1)</code> 永远不成立——标准只保证符号，不保证具体值。另外 <code>sizeof(str)</code> 与 <code>strlen(str)</code> 含义完全不同，前者是数组/指针大小。'},
  {t:'p',x:'涉及中文等非 ASCII 文本时，<code>strlen</code> 返回的是<b>字节数</b>不是字符数。UTF-8 下一个汉字通常占 3 字节。需要按字符处理应使用专门的 UTF-8 库；C23 新增了 <code>char8_t</code> 与 <code>u8""</code> 字面量，但并未自带完整的 Unicode 算法库。'},
  {t:'ex',k:'动手练一练',items:[
    '自己实现 <code>size_t my_strlen(const char *s)</code> 与 <code>void my_strcpy(char *d, const char *s)</code>，并与标准库对比。',
    '构造一个 <code>memcpy</code> 区间重叠的例子，用 ASan 观察，再换成 <code>memmove</code>。',
    '写一个安全的 <code>join</code> 函数：把多个字符串用分隔符拼进固定缓冲区，截断时返回所需长度。'
  ]}
],

'c-2-6': [
  {t:'h',x:'深入：指针的三要素与 const 的位置'},
  {t:'p',x:'一个指针值包含三件事：<b>地址</b>、<b>类型（决定步长和解引用宽度）</b>、<b>所指向对象的生命周期</b>。<code>int*</code> 与 <code>float*</code> 可能存着同样的地址，但 <code>p + 1</code> 前进的字节数不同、<code>*p</code> 读出的字节数也不同。<code>void*</code> 是「无类型的地址」，可以隐式与任意对象指针互转，但不能解引用、不能做算术。'},
  {t:'code',lang:'C23 · 指针、void* 与 nullptr',x:`#include <stdio.h>
#include <stdint.h>

int main(void) {
    int x = 0x11223344;
    int  *pi = &x;
    void *pv = pi;              // 对象指针 -> void*，隐式
    int  *back = pv;            // void* -> 对象指针，C 中隐式（C++ 需强转）

    printf("pi=%p back=%p same=%s\\n", (void*)pi, (void*)back, pi==back?"yes":"no");
    printf("pi+1 前进 %td 字节\\n", (char*)(pi+1)-(char*)pi);

    unsigned char *bytes = (unsigned char*)&x;   // 唯一可安全检视对象表示的指针
    for (size_t i = 0; i < sizeof x; ++i) printf("%02X ", bytes[i]);
    putchar('\\n');

    int *nil = nullptr;         // C23：有类型的空指针常量
    printf("nil==0? %s\\n", nil == nullptr ? "yes" : "no");
    return 0;
}`},
  {t:'table',head:['声明','读法','能否改指针','能否改所指对象'],rows:[
    ['<code>const int *p</code>','指向 const int 的指针','能','不能'],
    ['<code>int const *p</code>','同上，两种写法等价','能','不能'],
    ['<code>int *const p</code>','const 指针，指向 int','不能','能'],
    ['<code>const int *const p</code>','都不可改','不能','不能'],
    ['<code>int **p</code>','指向「int 指针」的指针','能','能（改内层指针）']
  ]},
  {t:'p',x:'读复杂声明有一个可靠口诀：<b>从变量名出发，先向右看，遇到右括号再向左看</b>；<code>*</code> 读作「指向…的指针」，<code>[]</code> 读作「…的数组」，<code>()</code> 读作「返回…的函数」。例如 <code>int *(*fp)(int)</code> 是「fp 是指向『接受 int、返回 int* 的函数』的指针」，详见 3.3。'},
  {t:'note',kind:'danger',k:'空指针与野指针',x:'<code>nullptr</code>（或旧代码的 <code>NULL</code>）解引用是 UB；未初始化的指针、<code>free</code> 之后未置空的指针更危险，因为它们可能「碰巧能用」。习惯：<code>free(p); p = nullptr;</code>，以及声明即初始化。注意 <code>nullptr</code> 的类型是 <code>nullptr_t</code>，不等于整数 0。'},
  {t:'ex',k:'动手练一练',items:[
    '打印本机字节序：用 <code>unsigned char*</code> 检视 <code>uint32_t x = 1</code> 的首字节。',
    '解释 <code>const int *p</code> 与 <code>int *const p</code> 的区别，各写一段能编译和不能编译的代码。',
    '写一个函数 <code>void zero(void *mem, size_t n)</code>，把任意缓冲区清零（用 <code>unsigned char*</code>）。'
  ]}
],

'c-2-7': [
  {t:'h',x:'深入：指针算术、数组退化与严格别名'},
  {t:'p',x:'指针加减的整数单位不是字节，而是<b>所指类型的大小</b>：<code>int *p; p + 3</code> 前进 <code>3*sizeof(int)</code> 字节。两个指针相减只在<b>指向同一数组</b>（含末尾后一位）时有定义，结果类型是 <code>ptrdiff_t</code>。除此之外比较或相减都是未定义行为——编译器因此可以做很多激进优化。'},
  {t:'code',lang:'C23 · 用指针遍历数组',x:`#include <stdio.h>

static int sum_ptr(const int *begin, const int *end) {
    int s = 0;
    for (const int *p = begin; p != end; ++p) s += *p;   // 半开区间 [begin, end)
    return s;
}

int main(void) {
    int a[] = {1,2,3,4,5};
    size_t n = sizeof a / sizeof a[0];

    printf("sum=%d\\n", sum_ptr(a, a + n));
    printf("a 与 &a 地址相同但类型不同：a+1 跨 %td 字节，&a+1 跨 %td 字节\\n",
           (char*)(a+1)-(char*)a, (char*)(&a+1)-(char*)&a);

    // a[i] 与 *(a+i) 完全等价，甚至 i[a] 也合法（别这么写）
    printf("a[2]=%d, 2[a]=%d\\n", a[2], 2[a]);
    return 0;
}`},
  {t:'p',x:'<b>数组名在大多数表达式里退化为指向首元素的指针</b>，但有三个例外：作为 <code>sizeof</code> 操作数、作为 <code>&amp;</code> 操作数、以及作为字符串字面量初始化数组时。<code>&amp;a</code> 的类型是 <code>int (*)[5]</code>（指向整个数组），虽然数值和 <code>a</code> 相同，但 <code>&amp;a + 1</code> 会跨过整个数组。'},
  {t:'note',kind:'warn',k:'严格别名规则（strict aliasing）',x:'通过「不兼容类型」的左值访问同一对象是 UB，例如把 <code>float*</code> 强转成 <code>int*</code> 再读写（想看浮点位模式应该用 <code>memcpy</code> 或 <code>unsigned char*</code>）。<code>-O2 -fstrict-aliasing</code> 下这类代码可能给出「不合逻辑」的结果。字符类型是唯一被允许检视任意对象表示的例外。'},
  {t:'cards',items:[
    ['半开区间','用 <code>[begin, end)</code> 表示范围，遍历写 <code>p != end</code>，避免 <code>&lt;=</code> 与末尾后指针比较的坑'],
    ['末尾后指针','允许计算 <code>a + n</code> 并用于比较，但<b>不允许解引用</b>'],
    ['const 正确性','不修改数据的函数参数一律写 <code>const T *</code>，既表达意图也让编译器帮你查错']
  ]},
  {t:'ex',k:'动手练一练',items:[
    '只用指针（不写下标的 <code>[]</code>）实现 <code>strlen</code>、<code>memcpy</code> 风格的遍历。',
    '打印 <code>a</code>、<code>&amp;a</code>、<code>&amp;a[0]</code> 的地址，以及 <code>a+1</code> 与 <code>&amp;a+1</code> 的差值。',
    '用 <code>memcpy</code> 把一个 <code>float</code> 的位模式读进 <code>uint32_t</code>，说明为什么比指针强转安全。'
  ]}
],

'c-2-8': [
  {t:'h',x:'深入：四种作用域、三种链接与存储期'},
  {t:'p',x:'这三个概念常被混为一谈。<b>作用域</b>回答「这个名字在源码哪里可见」，<b>链接</b>回答「多个翻译单元里同名实体是不是同一个」，<b>存储期</b>回答「对象活多久」。把它们拆开，头文件里的 <code>static</code>、<code>extern</code>、<code>const</code> 就不再玄学。'},
  {t:'table',head:['概念','取值','关键点'],rows:[
    ['作用域','文件 / 块 / 函数 / 函数原型','块作用域从声明处到该块结束；内层可遮蔽外层'],
    ['链接','外部 / 内部 / 无','<code>static</code> 在文件作用域给内部链接；局部变量无链接'],
    ['存储期','静态 / 线程 / 自动 / 分配','静态存储期对象只初始化一次，默认零初始化'],
    ['<code>extern</code>','声明而非定义','「这个符号在别处定义」，头文件里放这个'],
    ['<code>static</code> 局部','静态存储期 + 块作用域','跨调用保值，但只在函数内可见，非线程安全']
  ]},
  {t:'code',lang:'C23 · 三种 static 的含义',x:`#include <stdio.h>

static int file_counter = 0;     // (1) 内部链接：本文件私有
extern int global_value;         // 声明：定义在别的 .c 里

static int next_id(void) {       // (2) 内部链接的函数
    static int id = 0;           // (3) 静态存储期的局部变量
    return ++id;
}

int main(void) {
    printf("%d %d %d\\n", next_id(), next_id(), next_id()); // 1 2 3
    printf("file_counter=%d\\n", ++file_counter);
    return 0;
}

/* 另一个文件里应有：int global_value = 42; */`},
  {t:'p',x:'静态存储期对象（全局变量、<code>static</code> 局部变量）在程序启动时零初始化，且初始化顺序跨翻译单元<b>未指定</b>——所以不要在一个文件的全局初始化器里依赖另一个文件的全局变量（所谓 static initialization order fiasco）。需要确定性顺序时改用函数内 <code>static</code> 加惰性初始化。'},
  {t:'note',kind:'warn',k:'头文件里别放定义',x:'在头文件写 <code>int g = 0;</code> 并被两个 <code>.c</code> 包含，会产生两个同名外部符号 → 链接期 multiple definition。正确做法：头文件只写 <code>extern int g;</code>，定义放在唯一一个 <code>.c</code> 里。C23 的 <code>constexpr</code> 对象因具有内部链接，放在头文件里是安全的。'},
  {t:'ex',k:'动手练一练',items:[
    '建两个 <code>.c</code>，验证文件作用域加 <code>static</code> 前后 <code>nm</code> 输出符号大小写的变化。',
    '写一个函数调用计数器（函数内 <code>static</code>），再改成多线程调用，思考为什么它不是线程安全的。',
    '把 <code>extern int g;</code> 与 <code>int g;</code> 分别写进头文件，观察链接结果。'
  ]}
],

'c-2-9': [
  {t:'h',x:'深入：对齐、填充、位域与柔性数组'},
  {t:'p',x:'结构体成员并不总是紧挨着放。为了让 CPU 能高效（甚至合法）地访问，编译器会在成员之间插入<b>填充字节</b>，使每个成员满足自身对齐要求。因此 <code>sizeof(struct)</code> 常常大于各成员大小之和，而且<b>成员顺序会改变结构体大小</b>——按「大到小」排列成员通常最省空间。'},
  {t:'code',lang:'C23 · 对齐、offsetof 与柔性数组',x:`#include <stdio.h>
#include <stddef.h>
#include <stdlib.h>
#include <string.h>

typedef struct { char c; int i; char d; } Bad;    // 通常 12 字节
typedef struct { int i; char c; char d; } Good;   // 通常 8 字节

// 柔性数组成员：必须是最后一个成员，前面至少还有一个具名成员
typedef struct { size_t n; int data[]; } IntVec;

int main(void) {
    printf("sizeof(Bad)=%zu sizeof(Good)=%zu\\n", sizeof(Bad), sizeof(Good));
    printf("offsetof(Bad,i)=%zu alignof(int)=%zu\\n", offsetof(Bad,i), alignof(int));

    size_t n = 5;
    IntVec *v = malloc(sizeof *v + n * sizeof v->data[0]);
    if (!v) return 1;
    v->n = n;
    for (size_t i = 0; i < n; ++i) v->data[i] = (int)i * 2;
    printf("v->data[4]=%d\\n", v->data[4]);
    free(v);
    return 0;
}`},
  {t:'table',head:['特性','写法','要点'],rows:[
    ['指定初始化','<code>struct P p = {.x=1,.y=2};</code>','不依赖成员顺序，未指定项清零'],
    ['复合字面量','<code>(struct P){.x=1}</code>','C99，可作临时对象或函数实参'],
    ['位域','<code>unsigned flags:3;</code>','布局由实现定义，别用于跨平台协议'],
    ['柔性数组','<code>int data[];</code>','C99，一次 malloc 分配头 + 数据，缓存友好'],
    ['<code>alignas</code>','<code>alignas(64) int x;</code>','C23 关键字，缓存行对齐见 6.7'],
    ['<code>offsetof</code>','<code>offsetof(T, member)</code>','<code>&lt;stddef.h&gt;</code>，无需构造对象']
  ]},
  {t:'note',kind:'warn',k:'结构体比较与拷贝',x:'可以用 <code>=</code> 整体赋值结构体，但<b>不能用 <code>==</code> 比较</b>（填充字节内容不确定，逐成员比较也可能踩坑）。含柔性数组的结构体不能整体赋值、不能直接按值传参，也不能作为数组元素。位域则不要取地址（<code>&amp;</code> 非法）。'},
  {t:'p',x:'序列化到文件或网络时，绝不要直接 <code>fwrite(&amp;my_struct, sizeof my_struct, 1, fp)</code>：填充字节、字节序、类型宽度在不同平台都可能不同。正确做法是按字段逐个编码成明确的字节序与宽度，或用专门的序列化库。'},
  {t:'ex',k:'动手练一练',items:[
    '预测并用程序验证 <code>struct {char;double;char;}</code> 的 <code>sizeof</code>，再重排成员使其最小。',
    '用柔性数组实现一个可增长的 <code>IntVec</code>，提供 push / 释放函数。',
    '写一个函数比较两个结构体是否「逻辑相等」，逐成员比较并说明填充字节为什么不能比。'
  ]}
],

'c-2-10': [
  {t:'h',x:'深入：union 的类型双关与 C23 枚举底层类型'},
  {t:'p',x:'<code>union</code> 的所有成员共用同一块内存，大小等于最大成员（再按最大对齐补齐）。它的正当用途是<b>节省内存地表示「同一时刻只用其中一种」</b>，通常配一个标签字段构成 tagged union。用 union 在不同类型间「重新解释」位模式（type punning）在 C 中是实现允许的，但在 C++ 中是 UB，且可移植性差，推荐改用 <code>memcpy</code>。'},
  {t:'code',lang:'C23 · tagged union 与枚举底层类型',x:`#include <stdio.h>
#include <stdint.h>
#include <string.h>

typedef enum : uint8_t {      // C23：显式指定底层类型，节省空间
    VAL_INT, VAL_DOUBLE, VAL_STR
} ValKind;

typedef struct {
    ValKind kind;
    union { int i; double d; const char *s; } as;
} Value;

static void print_value(Value v) {
    switch (v.kind) {
        case VAL_INT:    printf("int: %d\\n", v.as.i); break;
        case VAL_DOUBLE: printf("double: %.2f\\n", v.as.d); break;
        case VAL_STR:    printf("str: %s\\n", v.as.s); break;
        default:         fputs("?\\n", stderr);
    }
}

static uint32_t float_bits(float f) {   // 安全的位模式转换
    uint32_t u; memcpy(&u, &f, sizeof u); return u;
}

int main(void) {
    print_value((Value){.kind=VAL_INT,   .as.i=42});
    print_value((Value){.kind=VAL_DOUBLE,.as.d=3.14});
    printf("sizeof(ValKind)=%zu, 1.0f 的位模式=%08X\\n",
           sizeof(ValKind), float_bits(1.0f));
    return 0;
}`},
  {t:'table',head:['C17','C23','意义'],rows:[
    ['枚举底层类型由实现选择','<code>enum E : uint8_t {...}</code>','可精确控制大小，便于协议/ABI'],
    ['枚举值超出 <code>int</code> 需扩展','可指定能容纳的底层类型','不再依赖编译器扩展'],
    ['<code>enum</code> 与整数几乎无差别','仍可隐式转换，但类型更明确','配合 <code>-Wenum-conversion</code> 更安全']
  ]},
  {t:'p',x:'枚举在 C 里本质是具名的整数常量集合，<b>并不限制变量只能取列出的值</b>（<code>enum E e = 999;</code> 合法）。所以 <code>switch</code> 枚举时务必写 <code>default</code>。C23 指定底层类型后，枚举对象的大小与符号性变得可预测，这对嵌入式和二进制协议很有价值。'},
  {t:'note',kind:'tip',k:'选 union 还是 void*',x:'需要「几种已知类型之一」用 tagged union（无堆分配、类型清晰）；需要「任意用户数据」用 <code>void*</code> 加回调（泛型容器，见 5.8）。两者别混用：union 里放指针又放值，很容易忘记哪个字段有效。'},
  {t:'ex',k:'动手练一练',items:[
    '实现一个 <code>Value</code> 类型，支持 int / double / 字符串，并写 <code>free_value</code> 处理所有权。',
    '用 <code>memcpy</code> 把 <code>double</code> 的位模式读进 <code>uint64_t</code>，打印 IEEE 754 的符号/阶码/尾数。',
    '对比指定 <code>: uint8_t</code> 前后 <code>sizeof(enum)</code> 的变化。'
  ]}
],

'c-2-11': [
  {t:'h',x:'深入：掩码惯用法与 C23 &lt;stdbit.h&gt;'},
  {t:'p',x:'位运算是 C 最贴近硬件的部分，也是嵌入式、协议解析、权限系统的日常。核心是四个固定动作：<b>置位</b> <code>x |= mask</code>、<b>清位</b> <code>x &amp;= ~mask</code>、<b>翻转</b> <code>x ^= mask</code>、<b>测试</b> <code>(x &amp; mask) != 0</code>。一律用<b>无符号</b>类型做位运算，避免有符号右移和溢出的坑。'},
  {t:'code',lang:'C23 · 位操作与 stdbit.h',x:`#include <stdio.h>
#include <stdint.h>
#include <stdbit.h>     // C23：stdc_bit_ceil / stdc_popcount 等

#define BIT(n)  (1u << (n))
#define MASK(n) (BIT(n) - 1u)

int main(void) {
    uint32_t flags = 0;
    flags |=  BIT(3) | BIT(7);              // 置位
    flags &= ~BIT(3);                       // 清位
    flags ^=  BIT(0);                       // 翻转
    printf("flags=%08X, bit7=%s\\n", flags,
           (flags & BIT(7)) ? "set" : "clear");

    printf("popcount=%u, leading_zeros=%u\\n",
           stdc_popcount(flags), stdc_count_zeros(flags));
    printf("bit_ceil(37)=%u\\n", stdc_bit_ceil(37u));   // 64

    // 取低 4 位 / 判断是否为 2 的幂
    printf("low4=%u, is_pow2(32)=%s\\n",
           flags & MASK(4),
           (flags && !(flags & (flags - 1))) ? "yes" : "no");
    return 0;
}`},
  {t:'table',head:['需求','惯用写法','说明'],rows:[
    ['第 n 位置 1','<code>x |= 1u &lt;&lt; n</code>','n 必须小于位宽'],
    ['第 n 位清 0','<code>x &amp;= ~(1u &lt;&lt; n)</code>','<code>~</code> 在无符号上才安全'],
    ['取最低置位','<code>x &amp; -x</code>','需无符号；Fenwick 树常用'],
    ['清最低置位','<code>x &amp; (x - 1)</code>','配合循环可数 1 的个数'],
    ['判断 2 的幂','<code>x &amp;&amp; !(x &amp; (x-1))</code>','注意排除 0'],
    ['向上取到 2 的幂','<code>stdc_bit_ceil(x)</code>','C23 &lt;stdbit.h&gt;'],
    ['循环移位','<code>(x &lt;&lt; k) | (x &gt;&gt; (W-k))</code>','C 没有循环移位运算符']
  ]},
  {t:'note',kind:'warn',k:'移位三禁',x:'① 移位位数 ≥ 类型位宽是 UB；② 对<b>有符号负数</b>左移是 UB、右移是实现定义；③ 把 1 左移到符号位（如 <code>1 &lt;&lt; 31</code> 对 32 位 int）是 UB。统一写 <code>1u &lt;&lt; n</code>，需要 64 位就写 <code>1ull &lt;&lt; n</code>。'},
  {t:'p',x:'位域（<code>unsigned a:3;</code>）看着省事，但位的分配顺序、跨存储单元的行为、可否取地址都由实现定义，<b>不要用来解析外部协议或做跨平台持久化</b>。协议字段一律用显式掩码加移位，行为完全确定。'},
  {t:'ex',k:'动手练一练',items:[
    '实现 <code>count_bits(uint32_t)</code>：分别用循环清最低位与 <code>stdc_popcount</code>，比较结果。',
    '用位掩码实现一组权限（读/写/执行/管理）的赋予、撤销与检查。',
    '写一个函数解析 IPv4 地址字符串的四个字节，只使用移位与掩码。'
  ]}
]

};
