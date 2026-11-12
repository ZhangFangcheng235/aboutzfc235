/* ==========================================================
   逐节扩写 · C 语言 第 3~4 章（c-3-* / c-4-*）
   ========================================================== */
window.WIKI_X_C2 = {

/* ---------------- 第 3 章 ---------------- */
'c-3-1': [
  {t:'h',x:'深入：malloc 家族、生命周期与四类内存错误'},
  {t:'p',x:'C 程序里的对象分布在几个区域：<b>静态区</b>（全局与 static，程序全程存在）、<b>栈</b>（自动对象，随函数调用创建销毁）、<b>堆</b>（手动分配，由你决定何时释放）、以及<b>只读区</b>（字符串字面量、代码）。<code>malloc</code> 系列向堆申请内存，返回 <code>void*</code>；失败时返回 <code>nullptr</code>，必须检查。'},
  {t:'table',head:['函数','行为','典型用法'],rows:[
    ['<code>malloc(n)</code>','分配 n 字节，<b>不初始化</b>','内容即将全部被覆写时'],
    ['<code>calloc(k,n)</code>','分配 k×n 字节并清零','数组、结构体，需要零初值'],
    ['<code>realloc(p,n)</code>','调整大小，可能搬迁','动态数组扩容；失败时原块仍有效'],
    ['<code>free(p)</code>','释放；<code>free(nullptr)</code> 安全','释放后置 <code>p = nullptr</code>'],
    ['<code>aligned_alloc(a,n)</code>','按对齐要求分配','SIMD / 缓存行对齐']
  ]},
  {t:'code',lang:'C23 · 可增长动态数组（含 realloc 正确写法）',x:`#include <stdio.h>
#include <stdlib.h>

typedef struct { int *data; size_t len, cap; } Vec;

static int vec_push(Vec *v, int x) {
    if (v->len == v->cap) {
        size_t nc = v->cap ? v->cap * 2 : 4;
        // 关键：用临时指针接收，失败时原内存不被弄丢
        int *tmp = realloc(v->data, nc * sizeof *tmp);
        if (!tmp) return -1;             // 内存不足
        v->data = tmp;
        v->cap  = nc;
    }
    v->data[v->len++] = x;
    return 0;
}

int main(void) {
    Vec v = {0};
    for (int i = 0; i < 10; ++i) {
        if (vec_push(&v, i * i) != 0) { free(v.data); return 1; }
    }
    printf("len=%zu cap=%zu last=%d\\n", v.len, v.cap, v.data[v.len-1]);
    free(v.data);                        // 唯一的所有者负责释放
    return 0;
}`},
  {t:'cards',items:[
    ['内存泄漏','分配后丢失指针或忘记 <code>free</code>；长驻进程会逐渐耗尽内存'],
    ['悬空指针','<code>free</code> 后继续解引用；释放后立即置 <code>nullptr</code>'],
    ['重复释放','同一块内存 free 两次，通常直接崩溃'],
    ['越界读写','堆块溢出会破坏分配器元数据，表现为「隔很久才崩在别处」']
  ]},
  {t:'note',kind:'tip',k:'所有权要写进文档',x:'每个返回堆内存的函数，都要在注释里明确「调用方负责 free」以及用哪个函数释放（<code>malloc</code> 配 <code>free</code>，不能混用 <code>new/delete</code> 或平台专用分配器）。这是 C 项目里最容易扯皮的接口约定，见 6.1。'},
  {t:'code',lang:'Bash · 用 Sanitizer 抓内存错误',x:`gcc -std=c2x -g -O1 -fsanitize=address,undefined -fno-omit-frame-pointer main.c -o app
ASAN_OPTIONS=detect_leaks=1 ./app
# 也可用 valgrind（无需重新编译，但慢）
valgrind --leak-check=full --show-leak-kinds=all ./app`},
  {t:'ex',k:'动手练一练',items:[
    '给上面的 <code>Vec</code> 补上 <code>vec_free</code> 与 <code>vec_reserve</code>，并用 ASan 验证无泄漏。',
    '故意制造一次 use-after-free，看 AddressSanitizer 的报错格式，学会读栈回溯。',
    '解释 <code>realloc(p, n)</code> 失败时为什么不能写 <code>p = realloc(p, n)</code>。'
  ]}
],

'c-3-2': [
  {t:'h',x:'深入：函数指针、回调与泛型容器'},
  {t:'p',x:'函数名在表达式里会退化为<b>指向该函数的指针</b>。函数指针的类型必须包含返回类型与全部参数类型，因此声明看起来很绕，配合 <code>typedef</code> 会清晰很多。它的两大用途是<b>回调</b>（把行为当参数传进去）和<b>分派表</b>（用数组索引代替一长串 switch）。'},
  {t:'code',lang:'C23 · 回调、qsort 与分派表',x:`#include <stdio.h>
#include <stdlib.h>

typedef int (*Op)(int, int);            // Op 是「接受两个 int、返回 int 的函数指针」
static int add(int a, int b) { return a + b; }
static int mul(int a, int b) { return a * b; }

static int cmp_int(const void *a, const void *b) {
    int x = *(const int*)a, y = *(const int*)b;
    return (x > y) - (x < y);          // 避免 x-y 溢出
}

int main(void) {
    Op ops[] = {add, mul};             // 分派表
    printf("add=%d mul=%d\\n", ops[0](3,4), ops[1](3,4));

    int a[] = {5,1,9,3,7};
    qsort(a, sizeof a/sizeof a[0], sizeof a[0], cmp_int);
    for (size_t i = 0; i < 5; ++i) printf("%d ", a[i]);
    putchar('\\n');
    return 0;
}`},
  {t:'p',x:'标准 C 的回调通常只能带「函数指针」，没有 C++ 那样捕获上下文的闭包。解决办法是让接口同时接收一个 <code>void *userdata</code>：库把 <code>userdata</code> 原封不动传回回调，调用方在里面强转成自己的上下文结构。几乎所有成熟的 C 库（<code>qsort_r</code>、libcurl、SQLite、事件循环）都用这个模式。'},
  {t:'code',lang:'C23 · 带上下文的回调',x:`#include <stdio.h>

typedef void (*Visitor)(int value, void *ctx);

static void walk(const int *a, size_t n, Visitor visit, void *ctx) {
    for (size_t i = 0; i < n; ++i) visit(a[i], ctx);
}
static void sum_print(int v, void *ctx) {
    *(int*)ctx += v;
    printf("visit %d\\n", v);
}
int main(void) {
    int a[] = {1,2,3}, total = 0;
    walk(a, 3, sum_print, &total);
    printf("total=%d\\n", total);
    return 0;
}`},
  {t:'note',kind:'warn',k:'函数指针的两条红线',x:'① 不要用不兼容的函数指针类型互相强转后调用（UB）；② 不要返回指向局部 <code>static</code> 之外临时对象的指针。另外 <code>qsort</code> 的比较函数必须满足严格弱序，且<b>不能用减法</b>返回差值——<code>INT_MIN - INT_MAX</code> 会溢出。'},
  {t:'ex',k:'动手练一练',items:[
    '用函数指针数组实现一个简单的计算器（+ − × ÷），替代 switch 分派。',
    '实现 <code>for_each(arr, n, Visitor, void* ctx)</code>，用 <code>ctx</code> 同时累计总和与最大值。',
    '阅读 <code>qsort</code> 原型，说明比较函数参数为什么是 <code>const void*</code>。'
  ]}
],

'c-3-3': [
  {t:'h',x:'深入：读懂复杂声明与 C23 typeof'},
  {t:'p',x:'C 的声明语法是「用起来长什么样，就声明成什么样」。<code>int *p</code> 的意思是「<code>*p</code> 是 int」。掌握口诀后任何声明都能拆：<b>从标识符出发，先向右读到 <code>()</code> / <code>[]</code>，遇到右括号再向左读 <code>*</code>，逐层外包</b>。'},
  {t:'table',head:['声明','读法'],rows:[
    ['<code>int *p</code>','p 是指向 int 的指针'],
    ['<code>int a[5]</code>','a 是 5 个 int 的数组'],
    ['<code>int *a[5]</code>','a 是 5 个「int 指针」的数组'],
    ['<code>int (*a)[5]</code>','a 是指向「5 个 int 的数组」的指针'],
    ['<code>int f(int)</code>','f 是接受 int、返回 int 的函数'],
    ['<code>int (*f)(int)</code>','f 是指向「接受 int、返回 int 的函数」的指针'],
    ['<code>int (*a[3])(int)</code>','a 是 3 个「函数指针」组成的数组']
  ]},
  {t:'p',x:'<code>typedef</code> 与 <code>#define</code> 看似都能起别名，但语义完全不同：前者由编译器理解类型，后者只是文本替换。<code>typedef int *P; P a, b;</code> 声明了两个指针；<code>#define P int*; P a, b;</code> 展开成 <code>int* a, b;</code>，<code>b</code> 其实是 int。定义类型别名一律用 <code>typedef</code>。'},
  {t:'code',lang:'C23 · typeof 与类型安全泛型宏',x:`#include <stdio.h>

/* C23：typeof 让宏能保留参数原本的类型，不必强转 */
#define SWAP(a, b) do {          \\
    typeof(a) _tmp = (a);        \\
    (a) = (b);                   \\
    (b) = _tmp;                 \\
} while (0)

#define MAX(a, b) ((typeof(a))(((a) > (b)) ? (a) : (b)))

int main(void) {
    int    x = 1, y = 9;
    double d = 2.5, e = 7.5;
    SWAP(x, y); SWAP(d, e);
    printf("x=%d y=%d d=%.1f e=%.1f\\n", x, y, d, e);
    printf("max=%d\\n", MAX(3, 8));

    /* typeof_unqual 会去掉 const / volatile 限定 */
    const int ci = 5;
    typeof_unqual(ci) plain = ci;   // plain 是普通 int
    plain = 10;
    printf("plain=%d\\n", plain);
    return 0;
}`},
  {t:'note',kind:'tip',k:'typeof 解决了什么',x:'过去写「类型通用」的宏只能用 <code>void*</code> 或编译器扩展 <code>__typeof__</code>。C23 把 <code>typeof</code> / <code>typeof_unqual</code> 标准化后，配合 <code>_Generic</code>（5.8）可以写出既类型安全又不损失性能的泛型代码。'},
  {t:'ex',k:'动手练一练',items:[
    '手写拆解 <code>int (*(*f[3])(double))[5]</code> 的每一层含义（可用 <code>cdecl</code> 校验）。',
    '用 <code>typeof</code> 写一个 <code>MIN</code> 宏，并说明为什么 <code>do { ... } while(0)</code> 包裹是必要的。',
    '对比 <code>typedef char* Str; Str a,b;</code> 与 <code>#define Str char*; Str a,b;</code> 的实际类型。'
  ]}
],

'c-3-4': [
  {t:'h',x:'深入：文件流、二进制 I/O 与错误检查'},
  {t:'p',x:'<code>FILE*</code> 是带缓冲的流抽象。<code>fopen</code> 的模式串决定打开方式；文本模式与二进制模式在 POSIX 上没有区别，但在 Windows 上文本模式会做 <code>\\r\\n</code> 转换，因此<b>读写非文本数据一律加 <code>b</code></b>。所有 I/O 函数都要检查返回值，尤其是 <code>fopen</code> 与 <code>fread</code>。'},
  {t:'table',head:['模式','含义','文件不存在时'],rows:[
    ['<code>"r"</code>','只读文本','失败返回 nullptr'],
    ['<code>"w"</code>','只写文本，<b>清空</b>原文件','创建'],
    ['<code>"a"</code>','追加写','创建'],
    ['<code>"r+"</code>','读写，位置在开头','失败'],
    ['<code>"w+"</code>','读写，清空','创建'],
    ['<code>"rb" / "wb" / "ab"</code>','二进制版本','同上，但不做换行转换']
  ]},
  {t:'code',lang:'C23 · 完整的文件复制（含错误处理）',x:`#include <stdio.h>
#include <stdlib.h>

static int copy_file(const char *src, const char *dst) {
    FILE *in = fopen(src, "rb");
    if (!in) { perror(src); return -1; }
    FILE *out = fopen(dst, "wb");
    if (!out) { perror(dst); fclose(in); return -1; }

    char buf[8192];
    size_t n;
    while ((n = fread(buf, 1, sizeof buf, in)) > 0) {
        if (fwrite(buf, 1, n, out) != n) {
            fputs("写入失败\\n", stderr);
            fclose(in); fclose(out); return -1;
        }
    }
    if (ferror(in)) { perror("读取"); fclose(in); fclose(out); return -1; }
    if (fclose(in) != 0 || fclose(out) != 0) return -1;   // 刷新缓冲也可能失败
    return 0;
}

int main(int argc, char **argv) {
    if (argc != 3) { fprintf(stderr, "用法: %s 源 目标\\n", argv[0]); return 1; }
    return copy_file(argv[1], argv[2]) == 0 ? 0 : 1;
}`},
  {t:'ul',items:[
    '<code>fread(buf, size, count, fp)</code> 返回的是<b>成功读取的元素个数</b>，不是字节数；把 <code>size</code> 写成 1、<code>count</code> 写成缓冲区字节数最容易推理。',
    '<code>feof(fp)</code> 只有在<b>尝试读过文件末尾之后</b>才为真，用它当 <code>while</code> 条件会多读一轮。',
    '<code>fseek</code> + <code>ftell</code> 求文件大小对二进制流可靠，但大文件应用 <code>fseeko/ftello</code>（POSIX）或 <code>fgetpos/fsetpos</code>。',
    '<code>fclose</code> 会刷新缓冲；写入后不关闭就退出，数据可能根本没落盘。'
  ]},
  {t:'note',kind:'warn',k:'路径与编码',x:'<code>fopen</code> 的路径受当前工作目录影响，且 Windows 下 UTF-8 路径需要额外处理（<code>_wfopen</code> 或设置清单）。生产代码不要拼接不可信路径，避免目录穿越；临时文件用平台提供的安全接口而不是自己猜名字。'},
  {t:'ex',k:'动手练一练',items:[
    '写一个统计文件字节数与行数的程序，正确处理「最后一行没有换行」的情况。',
    '用 <code>fwrite</code> 把一个结构体数组写成二进制，再读回来；思考为什么这种做法不可移植（回顾 2.9）。',
    '实现一个 <code>tail -n</code> 简化版：从文件末尾向前找 n 个换行符。'
  ]}
],

'c-3-5': [
  {t:'h',x:'深入：宏的陷阱与更安全的替代'},
  {t:'p',x:'宏是<b>预处理期的文本替换</b>，不参与类型检查、不遵守作用域、也不遵守求值顺序。三条经典陷阱：参数没加括号导致优先级错误；参数有副作用被求值多次；多条语句没包成单条语句导致 <code>if/else</code> 断裂。'},
  {t:'code',lang:'C23 · 正确与错误的宏对照',x:`#include <stdio.h>

/* 错误示范（不要这样写） */
#define SQR_BAD(x)  x * x
#define MAX_BAD(a,b) a > b ? a : b
#define LOG_BAD(s) printf("log: "); printf("%s\\n", s)

/* 正确写法：每个参数加括号、整体加括号、多条语句包进 do-while(0) */
#define SQR(x)   ((x) * (x))
#define LOG(s)   do { printf("log: "); printf("%s\\n", (s)); } while (0)

/* C23 更推荐：能用函数/内联就不用宏；需要泛型用 typeof */
static inline int sqri(int x) { return x * x; }
#define SWAP(a,b) do { typeof(a) _t=(a); (a)=(b); (b)=_t; } while (0)

int main(void) {
    printf("SQR_BAD(1+2)=%d, SQR(1+2)=%d\\n", SQR_BAD(1+2), SQR(1+2));
    int i = 1, j = 2;
    if (i == 0) LOG("skip"); else LOG("ok");   // 若用 LOG_BAD 会编译/逻辑出错
    SWAP(i, j);
    printf("i=%d j=%d sqri=%d\\n", i, j, sqri(5));
    return 0;
}`},
  {t:'table',head:['机制','写法','用途'],rows:[
    ['字符串化 <code>#</code>','<code>#x</code> → <code>"x"</code>','把宏参数变成字符串字面量'],
    ['连接 <code>##</code>','<code>a ## b</code>','拼出新的标识符'],
    ['变参宏','<code>... / __VA_ARGS__</code>','日志、断言'],
    ['C23 <code>__VA_OPT__</code>','变参为空时省略逗号','解决 <code>LOG(fmt)</code> 尾随逗号'],
    ['<code>#if / #ifdef</code>','条件编译','平台分支、功能开关'],
    ['<code>#warning</code>','C23 新增','编译期提示（不中断）'],
    ['<code>#error</code>','强制报错','不支持的配置直接失败']
  ]},
  {t:'code',lang:'C23 · __VA_OPT__ 与条件编译',x:`#include <stdio.h>

#define LOG(fmt, ...) \\
    printf("[%s:%d] " fmt "\\n", __FILE__, __LINE__ __VA_OPT__(,) __VA_ARGS__)

int main(void) {
    LOG("启动");                 // 无变参，逗号被省略
    LOG("count=%d", 3);         // 有变参，逗号保留
#if defined(__STDC_VERSION__) && __STDC_VERSION__ >= 202311L
    LOG("C23 编译器");
#else
    LOG("非 C23，请检查特性支持");
#endif
    return 0;
}`},
  {t:'note',kind:'tip',k:'优先级顺序',x:'能用 <code>static inline</code> 函数就不用宏（有类型检查、可调试、无重复求值）；需要编译期常量用 <code>constexpr</code>；需要泛型用 <code>_Generic</code> 或 <code>typeof</code>；只有「需要 <code>__FILE__</code>、字符串化、条件编译、生成代码」时才不得不用宏。宏名一律全大写。'},
  {t:'ex',k:'动手练一练',items:[
    '验证 <code>SQR_BAD(1+2)</code> 的实际展开结果，并解释为什么是错的。',
    '写一个 <code>ASSERT</code> 宏，用 <code>do{...}while(0)</code> 包裹并打印文件与行号。',
    '用 <code>#</code> 与 <code>##</code> 写一个自动生成枚举名与名称字符串的宏表。'
  ]}
],

'c-3-6': [
  {t:'h',x:'深入：头文件设计与「一个定义规则」'},
  {t:'p',x:'头文件的作用是<b>把声明公开给其他翻译单元</b>。一条铁律：头文件里只放声明、类型定义、<code>constexpr</code> 对象、<code>static inline</code> 函数与宏；<b>不要放具有外部链接的对象定义或普通函数定义</b>，否则被多个 <code>.c</code> 包含就会 multiple definition。'},
  {t:'code',lang:'C23 · 规范的头文件 / 实现文件配对',x:`/* ===== vec.h ===== */
#ifndef VEC_H
#define VEC_H
#include <stddef.h>

typedef struct { int *data; size_t len, cap; } Vec;

void  vec_init(Vec *v);
int   vec_push(Vec *v, int x);   /* 0 成功，-1 内存不足 */
void  vec_free(Vec *v);          /* 调用方必须在结束后调用 */

/* 跨文件的短小函数：static inline 放头文件，每个 TU 各有一份内部副本 */
static inline size_t vec_size(const Vec *v) { return v ? v->len : 0; }
#endif /* VEC_H */

/* ===== vec.c ===== */
#include "vec.h"
#include <stdlib.h>
void vec_init(Vec *v) { *v = (Vec){0}; }
int  vec_push(Vec *v, int x) { /* 实现见 3.1 */ return 0; }
void vec_free(Vec *v) { free(v->data); *v = (Vec){0}; }`},
  {t:'table',head:['放进头文件','放进 .c 文件'],rows:[
    ['<code>typedef</code> / 结构体定义','普通函数实现'],
    ['<code>extern int g;</code>（声明）','<code>int g = 0;</code>（定义）'],
    ['函数原型','文件内 <code>static</code> 辅助函数'],
    ['<code>static inline</code> 短函数','全局可变状态'],
    ['<code>constexpr</code> 常量（C23，内部链接）','只在本文件用的宏']
  ]},
  {t:'p',x:'循环包含（A.h 包含 B.h，B.h 又包含 A.h）靠 <b>include guard</b> 或 <code>#pragma once</code> 解决。标准写法是 <code>#ifndef PROJECT_MODULE_H / #define ... / #endif</code>，宏名要带项目与模块前缀避免冲突。<code>#pragma once</code> 更简洁但非标准（虽然所有主流编译器都支持）。'},
  {t:'note',kind:'warn',k:'包含路径与耦合',x:'头文件应<b>自洽</b>：单独 <code>#include "vec.h"</code> 就能编译通过，不依赖调用方先包含别的头。用引号 <code>"..."</code> 引本项目头文件、尖括号 <code>&lt;...&gt;</code> 引系统头。公开头文件里尽量少包含其他头，能用前置声明就别包含，能显著缩短编译时间。'},
  {t:'ex',k:'动手练一练',items:[
    '把 3.1 的 <code>Vec</code> 拆成 <code>vec.h</code> + <code>vec.c</code> + <code>main.c</code>，用 <code>gcc main.c vec.c -o app</code> 链接。',
    '故意把 <code>int g = 0;</code> 写进被两个文件包含的头文件，观察报错，再用 <code>extern</code> 修复。',
    '构造一次循环包含，验证 include guard 是否生效。'
  ]}
],

'c-3-7': [
  {t:'h',x:'深入：命令行解析、环境变量与退出语义'},
  {t:'p',x:'<code>int main(int argc, char *argv[])</code> 里 <code>argv[0]</code> 是程序名（不保证是绝对路径），<code>argv[argc]</code> 保证为 <code>nullptr</code>。环境变量通过 <code>getenv</code> 读取，返回的字符串<b>不要修改、不要 free</b>；标准 C 没有跨平台的 <code>setenv</code>（那是 POSIX）。'},
  {t:'code',lang:'C23 · 命令行参数与环境变量',x:`#include <stdio.h>
#include <stdlib.h>
#include <errno.h>
#include <string.h>

static void usage(const char *prog) {
    fprintf(stderr, "用法: %s [-v] 文件\\n", prog);
}

int main(int argc, char **argv) {
    int verbose = 0;
    const char *file = nullptr;

    for (int i = 1; i < argc; ++i) {
        if (strcmp(argv[i], "-v") == 0)      verbose = 1;
        else if (strcmp(argv[i], "-h") == 0) { usage(argv[0]); return 0; }
        else if (!file)                       file = argv[i];
        else { usage(argv[0]); return 2; }
    }
    if (!file) { usage(argv[0]); return 2; }

    const char *home = getenv("HOME");
    printf("file=%s verbose=%d home=%s\\n", file, verbose, home ? home : "(未设置)");

    FILE *fp = fopen(file, "r");
    if (!fp) {                     // errno + strerror / perror 给出原因
        fprintf(stderr, "打开失败: %s\\n", strerror(errno));
        return 1;
    }
    fclose(fp);
    return 0;                      // 0 = 成功，非 0 = 失败
}`},
  {t:'table',head:['退出方式','行为','何时用'],rows:[
    ['<code>return n</code> from main','等价于 <code>exit(n)</code>','正常路径'],
    ['<code>exit(n)</code>','刷新流、执行 <code>atexit</code> 注册函数','库函数里需要终止程序'],
    ['<code>_Exit(n)</code> / <code>quick_exit</code>','不刷新、不跑 atexit','fork 后的子进程、崩溃恢复'],
    ['<code>abort()</code>','异常终止，可能产生 core','断言失败、不可恢复错误'],
    ['<code>EXIT_SUCCESS / EXIT_FAILURE</code>','可移植的退出码','代替硬编码 0 / 1']
  ]},
  {t:'p',x:'<code>errno</code> 是线程局部的错误码，只在函数<b>明确失败之后</b>才有意义：成功调用不会把它清零，所以先检查返回值再读 <code>errno</code>。<code>perror</code> 会自动附加当前 <code>errno</code> 的描述；<code>strerror</code> 只返回描述字符串。多线程里不要用一个全局 errno 值传递业务错误，直接返回错误码。'},
  {t:'note',kind:'tip',k:'退出码约定',x:'约定清楚并在 README 写明：<code>0</code> 成功、<code>1</code> 运行时错误、<code>2</code> 用法错误、<code>64~78</code> 可参照 sysexits.h。脚本会依赖退出码做判断，随意返回会让自动化流程失效。'},
  {t:'ex',k:'动手练一练',items:[
    '给上面的程序增加 <code>-o 输出文件</code> 选项，并对重复/缺失参数给出不同退出码。',
    '写一个 <code>atexit</code> 处理器，验证 <code>exit</code> 与 <code>_Exit</code> 的区别。',
    '故意打开不存在的文件，比较 <code>perror</code> 与 <code>strerror(errno)</code> 的输出。'
  ]}
],

'c-3-8': [
  {t:'h',x:'深入：C23 标准库地图与新增头文件'},
  {t:'p',x:'C 语言本身很小，能力几乎都来自标准库。按用途分组记忆，比逐个背函数有效得多。C23 在「位操作」「溢出检查」「安全清零」「嵌入二进制」几处补上了长期缺失的标准能力。'},
  {t:'table',head:['头文件','职责','常用内容'],rows:[
    ['<code>&lt;stdio.h&gt;</code>','输入输出','<code>printf fopen fread fprintf snprintf</code>'],
    ['<code>&lt;stdlib.h&gt;</code>','通用工具','<code>malloc qsort atoi exit getenv</code>'],
    ['<code>&lt;string.h&gt;</code>','字符串与内存','<code>memcpy memmove strlen strcmp memset_explicit</code>'],
    ['<code>&lt;stdint.h&gt; / &lt;limits.h&gt;</code>','整数类型与范围','<code>int32_t INT_MAX CHAR_BIT SIZE_MAX</code>'],
    ['<code>&lt;stddef.h&gt;</code>','基础定义','<code>size_t ptrdiff_t nullptr_t offsetof</code>'],
    ['<code>&lt;stdbit.h&gt;</code> <b>(C23 新)</b>','位操作','<code>stdc_popcount stdc_bit_ceil stdc_count_ones</code>'],
    ['<code>&lt;stdckdint.h&gt;</code> <b>(C23 新)</b>','溢出检查算术','<code>ckd_add ckd_sub ckd_mul</code>'],
    ['<code>&lt;stdatomic.h&gt;</code>','原子操作','<code>atomic_int atomic_fetch_add</code>，见 6.5'],
    ['<code>&lt;threads.h&gt;</code>','线程','<code>thrd_create mtx_t</code>，见 6.5'],
    ['<code>&lt;math.h&gt; / &lt;complex.h&gt;</code>','数学','<code>sqrt fabs sin</code>，链接需 <code>-lm</code>'],
    ['<code>&lt;time.h&gt;</code>','时间','<code>clock time timespec_get</code>'],
    ['<code>&lt;stdarg.h&gt; / &lt;assert.h&gt;</code>','变参 / 断言','见 3.9']
  ]},
  {t:'code',lang:'C23 · 一次用上三个新库',x:`#include <stdio.h>
#include <stdint.h>
#include <stdbit.h>
#include <stdckdint.h>
#include <string.h>

int main(void) {
    uint32_t x = 0b1010'0110u;
    printf("popcount=%u bit_width=%u\\n", stdc_popcount(x), stdc_bit_width(x));

    uint8_t a = 250, b = 10, r;
    if (ckd_add(&r, a, b)) puts("uint8 加法溢出");
    else printf("r=%u\\n", r);

    char secret[16] = "s3cret";
    memset_explicit(secret, 0, sizeof secret);   // C23：不会被优化掉的安全清零
    return 0;
}`},
  {t:'note',kind:'warn',k:'标准库 ≠ 操作系统 API',x:'标准 C 没有 socket、目录遍历、高精度定时器、动态加载、线程优先级——这些属于 POSIX / Win32。写跨平台程序时要么用抽象层，要么条件编译；6.6 会介绍 POSIX 常用调用。另外 <code>strdup / strndup</code> 长期是 POSIX 扩展，用之前确认编译器与标准开关。'},
  {t:'ex',k:'动手练一练',items:[
    '列出你最近写过的程序用到的全部标准库函数，按上表分组，找出你从未用过的组。',
    '用 <code>ckd_mul</code> 实现一个安全的「数组总字节数」计算，避免 <code>n * sizeof(T)</code> 溢出。',
    '查资料说明为什么普通 <code>memset</code> 清密码可能被编译器优化掉，<code>memset_explicit</code> 解决了什么。'
  ]}
],

'c-3-9': [
  {t:'h',x:'深入：断言、变参函数与 UB 清单'},
  {t:'p',x:'<code>assert(expr)</code> 在 <code>NDEBUG</code> 未定义时展开成「表达式为假则打印并 abort」，定义 <code>NDEBUG</code> 后完全消失。它用于表达<b>「这在逻辑上绝不该发生」的内部不变量</b>，不能用来处理可预期的外部错误（用户输入错误、文件不存在、内存不足）——那些必须走正常的错误处理路径，因为发布版里断言会被编译掉。'},
  {t:'code',lang:'C23 · 断言与变参函数',x:`#include <stdio.h>
#include <stdarg.h>
#include <assert.h>

/* 变参函数：至少需要一个具名参数来定位 va_list */
static int sum_n(int count, ...) {
    va_list ap;
    va_start(ap, count);
    int s = 0;
    for (int i = 0; i < count; ++i) s += va_arg(ap, int);
    va_end(ap);
    return s;
}

static void log_fmt(const char *fmt, ...) {
    va_list ap;
    va_start(ap, fmt);
    vprintf(fmt, ap);        // 变参版本的标准函数
    va_end(ap);
}

int main(void) {
    assert(sum_n(3, 1, 2, 3) == 6);      // 内部不变量
    printf("sum=%d\\n", sum_n(4, 1, 2, 3, 4));
    log_fmt("%s=%d\\n", "answer", 42);
    return 0;
}`},
  {t:'table',head:['常见 UB','为什么危险','规避'],rows:[
    ['数组越界 / 缓冲区溢出','可能静默改坏相邻数据','显式边界检查 + ASan'],
    ['解引用空 / 悬空 / 未初始化指针','崩溃或更糟','判空、释放置空、声明即初始化'],
    ['有符号整数溢出','编译器可假定不发生','<code>ckd_*</code> 或先检查范围'],
    ['无序列点的重复修改','结果依赖编译器','拆成多条语句'],
    ['读取未初始化对象','值不确定','一律初始化'],
    ['<code>memcpy</code> 区间重叠','破坏数据','改 <code>memmove</code>'],
    ['违反严格别名','优化后结果异常','用 <code>memcpy</code> / 字符指针'],
    ['格式串与参数类型不符','栈上按错类型解读','开 <code>-Wformat=2</code>']
  ]},
  {t:'note',kind:'danger',k:'UB 不是「结果随机」',x:'未定义行为意味着编译器可以做任何假设，包括把整段代码删掉。典型例子：因为假定有符号溢出不会发生，编译器可能把 <code>if (x + 1 &gt; x)</code> 直接优化成恒真。所以「在我机器上跑对了」完全不构成正确性证据。'},
  {t:'p',x:'变参函数没有类型检查：<code>va_arg(ap, int)</code> 若实际传的是 <code>double</code>，行为未定义；默认参数提升会把 <code>float</code> 变 <code>double</code>、<code>char/short</code> 变 <code>int</code>。自己写变参接口时，务必提供「<code>v</code> 前缀」版本（如 <code>vprintf</code> 风格），方便上层封装。'},
  {t:'ex',k:'动手练一练',items:[
    '写一个 <code>my_printf</code> 风格的日志函数，提供 <code>logf(fmt,...)</code> 与 <code>vlogf(fmt, va_list)</code> 两层。',
    '用 <code>-DNDEBUG</code> 编译含断言的程序，验证断言里的<b>副作用</b>会一起消失（所以断言里别放 ++）。',
    '把本章 UB 清单里任意三条写成会出错的小程序，用 UBSan 逐一验证。'
  ]}
],

/* ---------------- 第 4 章 · C23 ---------------- */
'c-4-1': [
  {t:'h',x:'深入：C23 全景与逐项迁移清单'},
  {t:'p',x:'C23（ISO/IEC 9899:2024）的定位是「现代化 + 清理」，而非新增大型抽象。变化可以归成四类：<b>关键字化</b>（去掉下划线前缀与头文件依赖）、<b>补现代能力</b>（<code>#embed</code>、<code>typeof</code>、<code>constexpr</code>、属性）、<b>数值与位操作补齐</b>（<code>_BitInt</code>、<code>%b</code>、两个新库）、<b>语法清理</b>（删 K&R、三字母词、旧式声明）。'},
  {t:'table',head:['类别','特性','本教程小节'],rows:[
    ['关键字','<code>bool true false nullptr</code>','4.2'],
    ['关键字','<code>constexpr</code>（对象）','4.3'],
    ['关键字','<code>typeof typeof_unqual</code>','4.4'],
    ['关键字','<code>alignas alignof static_assert thread_local</code>','4.11'],
    ['语法','标准属性 <code>[[...]]</code>','4.5'],
    ['预处理','<code>#embed</code> / <code>#warning</code> / <code>__VA_OPT__</code>','4.6 / 4.10'],
    ['数值','二进制字面量、分隔符、<code>%b</code>、<code>_BitInt</code>','4.7'],
    ['类型','枚举底层类型、<code>auto</code> 推断','4.8'],
    ['标准库','<code>&lt;stdckdint.h&gt; &lt;stdbit.h&gt;</code>、<code>memset_explicit</code>','4.9 / 4.11'],
    ['清理','删三字母词、K&R 定义、<code>void f()</code> 语义改变','4.11']
  ]},
  {t:'steps',items:[
    ['第 1 步：确认工具链','GCC 14+ / Clang 18+ 用 <code>-std=c23</code>；稍旧的用 <code>-std=c2x</code>。先跑一遍现有测试。'],
    ['第 2 步：清理自定义定义','删掉项目里的 <code>typedef int bool;</code>、<code>#define NULL ...</code>、<code>#define static_assert ...</code> 等与新关键字冲突的宏。'],
    ['第 3 步：处理旧式声明','把所有 <code>void f();</code> 改成显式 <code>void f(void)</code>，补齐缺失的函数原型。'],
    ['第 4 步：逐项引入新特性','先用 <code>nullptr</code> / <code>bool</code> / <code>static_assert</code>（低风险），再试 <code>constexpr</code> / <code>typeof</code> / <code>#embed</code>。'],
    ['第 5 步：开启更严的警告','加 <code>-Wpedantic -Werror</code>，用 CI 锁定编译器版本，避免「我本地能编」的漂移。']
  ]},
  {t:'note',kind:'warn',k:'不要一次全改',x:'新特性和存量代码的冲突往往出现在宏与头文件里。建议按文件逐步切换，每步都跑测试；尤其 <code>#embed</code> 与 <code>_BitInt</code> 对不同编译器支持程度不一，发布前要在所有目标平台验证。'},
  {t:'ex',k:'思考题',items:[
    '为什么把 <code>_Static_assert</code> 改名为 <code>static_assert</code> 属于「破坏性」变化？项目里可能存在什么写法会因此编译失败？',
    '如果你的项目必须同时支持 C17 与 C23 编译器，如何用 <code>__STDC_VERSION__</code> 做条件兼容？'
  ]}
],

'c-4-2': [
  {t:'h',x:'深入：bool 与 nullptr 的类型语义'},
  {t:'p',x:'C23 之前，<code>bool</code> 来自 <code>&lt;stdbool.h&gt;</code>，本质是宏：<code>#define bool _Bool</code>、<code>#define true 1</code>、<code>#define false 0</code>。C23 把三者提升为关键字，<code>&lt;stdbool.h&gt;</code> 变成空壳（仅为兼容保留）。<code>_Bool</code> 仍可用，但新代码不必再写。'},
  {t:'p',x:'更重要的变化是 <code>nullptr</code>：它是一个<b>类型为 <code>nullptr_t</code> 的空指针常量</b>，而 <code>NULL</code> 在 C 里可能被定义为整数 <code>0</code> 或 <code>((void*)0)</code>。整数 0 会在变参函数、泛型选择里被当成 int，从而引发难以察觉的类型错误；<code>nullptr</code> 消除了这种歧义。'},
  {t:'code',lang:'C23 · bool / nullptr / _Generic 对照',x:`#include <stdio.h>
#include <stddef.h>

#define TYPE_NAME(x) _Generic((x), \\
    int: "int", void*: "void*", nullptr_t: "nullptr_t", default: "other")

int main(void) {
    bool ok = true;                 // 关键字，不需要 <stdbool.h>
    printf("sizeof(bool)=%zu, ok=%d\\n", sizeof(bool), ok);

    int *p = nullptr;               // 有类型的空指针
    printf("TYPE_NAME(nullptr) = %s\\n", TYPE_NAME(nullptr));
    printf("TYPE_NAME(p)       = %s\\n", TYPE_NAME(p));

    // nullptr 可以隐式转换成任意对象指针，且不等于整数 0 的语义
    if (p == nullptr) puts("p 是空指针");
    return 0;
}`},
  {t:'table',head:['场景','C17','C23'],rows:[
    ['布尔变量','<code>#include &lt;stdbool.h&gt;</code> + <code>bool</code>','直接 <code>bool</code>'],
    ['空指针','<code>NULL</code>（类型不确定）','<code>nullptr</code>（<code>nullptr_t</code>）'],
    ['泛型分支','无法区分 0 与空指针','可用 <code>nullptr_t</code> 分支'],
    ['与 C++ 互操作','宏定义常被 C++ 头覆盖','语义与 C++ 对齐']
  ]},
  {t:'note',kind:'warn',k:'迁移冲突',x:'老代码里常见的 <code>typedef enum { FALSE, TRUE } BOOL;</code> 或 <code>#define bool int</code> 在 C23 下会直接报错，因为 <code>bool</code> 已是关键字。先删这些定义，再切编译开关。'},
  {t:'ex',k:'动手练一练',items:[
    '打印 <code>sizeof(bool)</code>、<code>sizeof(nullptr_t)</code>，并说明 <code>bool</code> 存储时是否只占 1 位。',
    '用 <code>_Generic</code> 写一个 <code>is_null(x)</code>，分别识别 <code>nullptr</code>、整数 0、普通指针。',
    '把一段使用 <code>NULL</code> 的代码改成 <code>nullptr</code>，并比较编译警告数量。'
  ]}
],

'c-4-3': [
  {t:'h',x:'深入：constexpr 能做什么、不能做什么'},
  {t:'p',x:'C23 的 <code>constexpr</code> 只用于<b>对象</b>，且要求初始化器是常量表达式；它同时隐含 <code>const</code>，并具有<b>内部链接</b>（因此放头文件里不会引发重复定义）。注意与 C++ 的区别：<b>C23 没有 constexpr 函数</b>，也不能用 <code>constexpr</code> 修饰函数或让任意表达式在编译期求值。'},
  {t:'code',lang:'C23 · constexpr 的正确用法',x:`#include <stdio.h>

constexpr int     N       = 8;
constexpr double  PI      = 3.141592653589793;
constexpr unsigned MASK   = 0b1111'0000u;
constexpr size_t  BUF_SZ  = 256;

int main(void) {
    int arr[N];                       // 合法：N 是常量表达式
    static_assert(N == 8, "N 必须为 8");   // C23 关键字
    char buf[BUF_SZ];

    /* 下面这些都不合法（C23）：
       constexpr int x = some_function();   // 初始化器不是常量表达式
       constexpr int f(int a) { return a; } // 没有 constexpr 函数
       int a[const_obj];                    // const 对象仍不是常量表达式 */

    printf("N=%d PI=%.4f MASK=%u sizeof(arr)=%zu sizeof(buf)=%zu\\n",
           N, PI, MASK, sizeof arr, sizeof buf);
    return 0;
}`},
  {t:'table',head:['写法','是否常量表达式','能否作数组长度'],rows:[
    ['<code>#define N 8</code>','文本替换，是','能'],
    ['<code>enum { N = 8 };</code>','是','能'],
    ['<code>constexpr int N = 8;</code>','是（C23）','能'],
    ['<code>const int N = 8;</code>','<b>否</b>（C 与 C++ 不同）','不能'],
    ['<code>static const int N = 8;</code>','否','不能'],
    ['<code>int N = 8;</code>','否','C99 起会变长数组，语义不同']
  ]},
  {t:'p',x:'为什么 C 里 <code>const int N = 8</code> 不是常量表达式？因为 C 的 <code>const</code> 只表示「不可通过这个左值修改」，对象仍可能被别名、被外部链接定义、在运行时才初始化。C23 用 <code>constexpr</code> 单独划出「编译期已知」这一格，比宏更安全（有类型、有作用域、可被调试器看到）。'},
  {t:'note',kind:'tip',k:'选型建议',x:'需要类型与作用域的常量优先用 <code>constexpr</code>；需要字符串化、条件编译、生成标识符时仍用宏；与 C17 编译器共存时用 <code>enum</code> 或宏做兼容层。头文件中放 <code>constexpr</code> 是安全的，放 <code>const int</code> 定义则要注意链接。'},
  {t:'ex',k:'动手练一练',items:[
    '分别用 <code>const int</code> 与 <code>constexpr int</code> 定义数组长度，记录编译结果。',
    '把项目里一组 <code>#define</code> 常量改成 <code>constexpr</code>，观察调试器能否查看它们。',
    '思考：为什么 C23 的 <code>constexpr</code> 对象默认内部链接，这对头文件设计有什么好处？'
  ]}
],

'c-4-4': [
  {t:'h',x:'深入：typeof / typeof_unqual 与泛型宏'},
  {t:'p',x:'<code>typeof(expr)</code> 产生表达式的<b>类型</b>（保留 <code>const/volatile</code> 限定），<code>typeof_unqual(expr)</code> 则去掉顶层限定。它们过去是 GCC/Clang 的 <code>__typeof__</code> 扩展，C23 正式标准化，让「类型通用」的宏第一次有了可移植写法。'},
  {t:'code',lang:'C23 · typeof 驱动的通用宏',x:`#include <stdio.h>
#include <string.h>

/* 标准 C23 写法：typeof 保留参数原本类型 */
#define CLAMP(x, lo, hi) ((typeof(x))((x) < (lo) ? (lo) : ((x) > (hi) ? (hi) : (x))))
#define DECL_LIKE(v, name) typeof(v) name

#define SWAP(a, b) do {            \\
    typeof_unqual(a) _t = (a);     \\
    (a) = (b); (b) = _t;          \\
} while (0)

int main(void) {
    const int limit = 100;
    DECL_LIKE(limit, copy) = 5;    // copy 是 const int
    // copy = 6;                   // 会报错：const
    typeof_unqual(limit) mutable_copy = limit;  // 普通 int
    mutable_copy = 7;

    int x = 3, y = 9;
    SWAP(x, y);
    printf("x=%d y=%d clamp=%d mutable=%d copy=%d\\n",
           x, y, CLAMP(150, 0, 10), mutable_copy, copy);
    return 0;
}`},
  {t:'p',x:'注意 <code>typeof</code> 与 <code>_Generic</code> 的分工：<code>typeof</code> 让你「声明一个同类型变量」，<code>_Generic</code> 让你「按类型选择不同实现」（见 5.8）。两者组合可以写出类型安全、零开销的泛型容器与数学宏，这是 C23 之前只能靠编译器扩展做到的事。'},
  {t:'note',kind:'warn',k:'宏里的求值次数',x:'<code>CLAMP(x++, 0, 10)</code> 仍会因为宏展开多次求值 <code>x++</code> 而出错——<code>typeof</code> 解决的是类型问题，不是副作用问题。若要同时解决，需要用语句表达式（GNU 扩展）或改成 <code>static inline</code> 函数；标准 C 里最稳妥的做法是要求调用方传入无副作用的表达式并写进注释。'},
  {t:'table',head:['需求','C17 做法','C23 做法'],rows:[
    ['声明同类型临时变量','<code>__typeof__</code>（扩展）','<code>typeof(a) tmp</code>'],
    ['去掉 const 限定','手写类型','<code>typeof_unqual(a)</code>'],
    ['泛型 MAX/MIN','强转或 void*','<code>typeof</code> + <code>_Generic</code>'],
    ['按类型分派','无标准方案','<code>_Generic</code>（C11 起）']
  ]},
  {t:'ex',k:'动手练一练',items:[
    '用 <code>typeof</code> 写一个适用于 int / double / size_t 的 <code>ABS</code> 宏。',
    '解释 <code>typeof(const_var)</code> 与 <code>typeof_unqual(const_var)</code> 声明的变量有什么不同。',
    '用 <code>typeof</code> 实现一个「自动推导元素类型」的数组打印宏。'
  ]}
],

'c-4-5': [
  {t:'h',x:'深入：标准属性 [[...]] 全表'},
  {t:'p',x:'C23 统一了此前各家编译器的 <code>__attribute__((...))</code> / <code>__declspec</code>，把常用能力收进标准语法 <code>[[attr]]</code>。属性是<b>给编译器的提示与约束</b>，不改变程序语义（但 <code>[[noreturn]]</code> 之类会影响优化与警告）；不认识的标准属性允许被忽略，因此比编译器扩展更可移植。'},
  {t:'table',head:['属性','作用于','效果'],rows:[
    ['<code>[[nodiscard]]</code>','函数 / 类型','忽略返回值时警告，防漏检查错误码'],
    ['<code>[[maybe_unused]]</code>','变量 / 函数 / 参数','抑制「未使用」警告'],
    ['<code>[[deprecated("msg")]]</code>','声明','使用时给出弃用警告'],
    ['<code>[[fallthrough]]</code>','case 内语句','声明 switch 故意贯穿'],
    ['<code>[[noreturn]]</code>','函数','承诺不返回，优化 + 抑制警告'],
    ['<code>[[unsequenced]]</code>','函数','无副作用、可任意重排（纯函数）'],
    ['<code>[[reproducible]]</code>','函数','相同输入得相同输出，允许缓存'],
    ['<code>[[assume(expr)]]</code> 类扩展','语句','编译器假设（各家支持不一）']
  ]},
  {t:'code',lang:'C23 · 属性的实际用法',x:`#include <stdio.h>
#include <stdlib.h>

[[nodiscard]]
static int parse_int(const char *s, int *out) {
    char *end;
    long v = strtol(s, &end, 10);
    if (end == s || *end != '\\0') return -1;
    *out = (int)v;
    return 0;
}

[[noreturn]] static void fatal(const char *msg) {
    fprintf(stderr, "致命错误: %s\\n", msg);
    exit(EXIT_FAILURE);
}

[[deprecated("改用 parse_int")]]
static int old_parse(const char *s) { return atoi(s); }

int main(void) {
    int v;
    if (parse_int("42", &v) != 0) fatal("解析失败");
    printf("v=%d\\n", v);
    [[maybe_unused]] int reserved = 0;
    // parse_int("7", &v);   // 忽略返回值会触发 nodiscard 警告
    (void)old_parse;         // 避免弃用警告
    return 0;
}`},
  {t:'note',kind:'tip',k:'最值得立刻用起来的两个',x:'<code>[[nodiscard]]</code> 用在所有返回错误码的函数上，能挡住「调用完不检查」这类高频 bug；<code>[[fallthrough]]</code> 让 switch 的故意贯穿变成显式声明，同时消除警告。这两条几乎零成本，收益最大。'},
  {t:'p',x:'属性位置有语法讲究：<code>[[nodiscard]] int f(void);</code> 作用于函数；<code>int f([[maybe_unused]] int x);</code> 作用于参数；<code>[[nodiscard]] struct Result {...};</code> 作用于类型，使所有返回该类型的函数都带检查。写错位置可能作用到别的声明上，配合 <code>-Wall</code> 看警告即可发现。'},
  {t:'ex',k:'动手练一练',items:[
    '给 3.1 的 <code>vec_push</code> 加 <code>[[nodiscard]]</code>，观察忽略返回值时的警告。',
    '写一个 <code>[[noreturn]]</code> 的错误处理函数，比较加与不加时编译器的未初始化警告。',
    '用 <code>[[deprecated]]</code> 标记一个旧接口并给出迁移提示文本。'
  ]}
],

'c-4-6': [
  {t:'h',x:'深入：#embed 参数与真实工程用法'},
  {t:'p',x:'过去要把图片、字体、着色器、固件等二进制数据编进程序，只能用 <code>xxd -i</code> 之类的外部工具生成一个巨大的 <code>unsigned char[]</code>，再把它纳入构建流程。C23 的 <code>#embed</code> 让编译器<b>直接读取文件并生成初始化列表</b>，无需外部生成器，也不受命令行长度限制。'},
  {t:'code',lang:'C23 · #embed 基础与参数',x:`#include <stdio.h>

/* 最简形式：展开成逗号分隔的 unsigned char 字面量列表 */
static const unsigned char logo[] = {
    #embed "assets/logo.png"
};

/* 可用参数控制内容 */
static const unsigned char header[] = {
    #embed "assets/logo.png" limit(16) prefix(0xAA,) suffix(0xBB,)
};

int main(void) {
    printf("logo 大小=%zu 字节, 前 4 字节=%02X %02X %02X %02X\\n",
           sizeof logo, logo[0], logo[1], logo[2], logo[3]);
    printf("header 大小=%zu\\n", sizeof header);
    return 0;
}`},
  {t:'table',head:['参数','含义','示例'],rows:[
    ['<code>limit(n)</code>','最多嵌入 n 个字节','快速取文件头做格式探测'],
    ['<code>prefix(...)</code>','在列表前插入内容','加长度前缀、魔数'],
    ['<code>suffix(...)</code>','在列表后插入内容','补 0 结尾、校验字节'],
    ['<code>if_empty(...)</code>','文件为空时的替代内容','避免空初始化列表'],
    ['<code>__has_embed</code>','预处理期探测文件是否存在','条件编译兜底']
  ]},
  {t:'code',lang:'C23 · 条件探测与字符串资源',x:`#include <stdio.h>

#if __has_embed("config/default.json")
static const char default_cfg[] = {
    #embed "config/default.json" suffix(0)
};
#else
static const char default_cfg[] = "{}";
#endif

int main(void) { printf("默认配置: %s\\n", default_cfg); return 0; }`},
  {t:'note',kind:'warn',k:'路径与构建依赖',x:'<code>#embed</code> 的查找路径由编译器的包含路径决定（类似 <code>#include</code>），相对路径基准可能随实现而变；用 <code>-I</code> 明确指定更稳。被嵌入的文件是构建依赖，改了它必须触发重编译——Makefile/CMake 里要显式声明这个依赖，否则会出现「资源改了但程序没变」的诡异问题。'},
  {t:'p',x:'与 <code>xxd -i</code> 相比，<code>#embed</code> 还有个隐藏好处：编译器不必把巨大的文本数组解析成 token，大型资源编译时内存与耗时都明显更好。目前 GCC 15 / Clang 19 起支持较完整，老编译器需保留生成脚本作为兜底。'},
  {t:'ex',k:'动手练一练',items:[
    '用 <code>#embed</code> 把一个小文本文件编进程序，打印其字节数与内容。',
    '用 <code>limit(8)</code> 读取一个 PNG 文件头，验证前 8 字节是否为 PNG 签名。',
    '用 <code>__has_embed</code> 写一个「资源缺失时使用内置默认值」的兼容分支。'
  ]}
],

'c-4-7': [
  {t:'h',x:'深入：二进制字面量、%b、分隔符与 _BitInt'},
  {t:'p',x:'C23 补齐了数值表达上长期缺失的几块：<b>二进制字面量</b> <code>0b1010</code>、<b>数字分隔符</b> <code>1\'000\'000</code>、<code>printf/scanf</code> 的 <b><code>%b / %B</code></b> 二进制格式，以及任意位宽的 <b><code>_BitInt(N)</code></b>。前三者纯属可读性提升，最后一个是真正的能力扩展。'},
  {t:'code',lang:'C23 · 四种新数值写法',x:`#include <stdio.h>

int main(void) {
    unsigned mask  = 0b1111'0000u;         // 二进制 + 分隔符
    long     pop   = 1'000'000L;           // 十进制分隔符
    unsigned hex   = 0xDEAD'BEEFu;

    printf("mask=%u (%b)\\n", mask, mask);  // %b 打印二进制
    printf("hex=%08X, pop=%ld\\n", hex, pop);

    unsigned bits;
    if (scanf("%b", &bits) == 1) printf("读入的二进制值=%u\\n", bits);

    // _BitInt(N)：恰好 N 位的有符号整数（unsigned _BitInt(N) 为无符号）
    _BitInt(17) a = 60000;
    _BitInt(17) b = 60000;
    _BitInt(17) c = a + b;                 // 不会像 int16 那样溢出
    printf("a+b=%lld\\n", (long long)c);
    return 0;
}`},
  {t:'table',head:['写法','C17','C23'],rows:[
    ['二进制字面量','编译器扩展 <code>0b...</code>','标准 <code>0b1010</code>'],
    ['数字分组','无','<code>\'</code> 作分隔符，编译期忽略'],
    ['打印二进制','自己写循环','<code>%b</code> / <code>%B</code>'],
    ['超大整数','<code>long long</code> 或数组模拟','<code>_BitInt(N)</code>（N 由实现上限约束）'],
    ['位宽精确类型','<code>int8/16/32/64_t</code>','任意位宽 <code>_BitInt</code>']
  ]},
  {t:'note',kind:'warn',k:'_BitInt 的边界',x:'<code>_BitInt(N)</code> 的 N 上限由实现规定（GCC/Clang 目前支持很大但不是无限）；它的对齐、与 ABI 的交互、以及 <code>printf</code> 的格式符都需要注意——通常先转换成 <code>long long</code> 或用 <code>%jd</code> 配合 <code>intmax_t</code>。跨编译器使用前务必实测。分隔符 <code>\'</code> 不能出现在开头、结尾或紧邻小数点。'},
  {t:'p',x:'分隔符纯为可读性：编译器会直接忽略 <code>\'</code>，所以 <code>0b1111\'0000</code> 与 <code>0b11110000</code> 完全等价。协议字段、寄存器掩码、大常数用它分组能让代码自检容易得多，建议团队统一分组习惯（二进制每 4 位一组、十进制每 3 位一组）。'},
  {t:'ex',k:'动手练一练',items:[
    '用 <code>0b</code> + 分隔符定义一组寄存器位掩码，并用 <code>%b</code> 打印验证。',
    '对比 <code>int16_t</code> 与 <code>_BitInt(17)</code> 在做 60000+60000 时的结果。',
    '写一个函数把 <code>unsigned</code> 按 4 位一组打印成带分隔符的二进制串（不依赖 <code>%b</code>）。'
  ]}
],

'c-4-8': [
  {t:'h',x:'深入：枚举底层类型与 auto 类型推断'},
  {t:'p',x:'C17 里枚举的底层类型由实现自行挑选（通常是 <code>int</code>），枚举值若超出 <code>int</code> 范围就得依赖编译器扩展。C23 允许显式指定：<code>enum E : uint8_t { ... };</code>。这不仅省空间，更关键的是让<b>枚举的表示在 ABI 与二进制协议中变得可预测</b>。'},
  {t:'code',lang:'C23 · 枚举底层类型与 auto',x:`#include <stdio.h>
#include <stdint.h>

typedef enum : uint8_t { MODE_OFF, MODE_ON, MODE_AUTO } Mode;      // 1 字节
typedef enum : uint32_t { F_A = 1u << 0, F_B = 1u << 31 } Flags;   // 能容纳 2^31

int main(void) {
    auto   n = 42;            // C23：auto 变为类型推断，n 是 int
    auto   d = 3.14;          // double
    auto   p = &n;            // int*
    const auto r = n;         // const int

    printf("sizeof(Mode)=%zu sizeof(Flags)=%zu\\n", sizeof(Mode), sizeof(Flags));
    printf("n=%d d=%.2f *p=%d r=%d\\n", n, d, *p, r);
    return 0;
}`},
  {t:'note',kind:'danger',k:'auto 的语义变了',x:'C17 及以前 <code>auto</code> 是存储类说明符（表示自动存储期，几乎从不写）；<b>C23 起它变成类型推断</b>，且必须有初始化器。老代码里若有 <code>auto int x;</code> 会直接编译失败。这也是迁移时容易忽略的一处破坏性变化。'},
  {t:'table',head:['场景','推荐写法','理由'],rows:[
    ['类型名很长','<code>auto cfg = get_default_config();</code>','少写冗长类型，改类型时不用到处改'],
    ['公开接口','<b>不要</b>用 auto','接口应显式写出类型，便于阅读与 ABI 稳定'],
    ['数值精度敏感','<b>不要</b>用 auto','推断结果可能不是你想要的宽度'],
    ['宏/泛型代码','配合 <code>typeof</code>','保持参数原本类型']
  ]},
  {t:'p',x:'C 社区对 <code>auto</code> 的态度比 C++ 保守：C 的卖点之一就是「类型一目了然」，尤其在指针与整数宽度敏感的系统代码里。建议在<b>局部变量、类型名冗长、且类型从右侧表达式一眼可辨</b>时使用，函数签名与全局变量一律显式写类型。'},
  {t:'ex',k:'动手练一练',items:[
    '对比同一个枚举在指定 <code>: uint8_t</code> 前后的 <code>sizeof</code>。',
    '定义含 <code>1u &lt;&lt; 31</code> 成员的枚举，验证 C23 下能否编译并打印其大小。',
    '找出一段 <code>auto int x;</code> 形式的旧代码，改成 C23 合法写法。'
  ]}
],

'c-4-9': [
  {t:'h',x:'深入：溢出检查与位操作标准库'},
  {t:'p',x:'C23 新增两个小而关键的头文件：<code>&lt;stdckdint.h&gt;</code> 提供「带进位检查」的加减乘，<code>&lt;stdbit.h&gt;</code> 提供一套与硬件指令对应的位操作。它们把过去各家编译器内置函数（<code>__builtin_add_overflow</code>、<code>__builtin_popcount</code>）标准化，且<b>返回值语义清晰</b>：成功返回 false，溢出返回 true。'},
  {t:'code',lang:'C23 · ckd_* 与 stdc_* 完整示例',x:`#include <stdio.h>
#include <stdint.h>
#include <stdckdint.h>
#include <stdbit.h>

int main(void) {
    // 1) 溢出检查：结果写入 *result，溢出返回 true 且结果仍被"环绕"写入
    int a = INT32_MAX, r;
    if (ckd_add(&r, a, 1)) puts("int 加法溢出");
    else printf("r=%d\\n", r);

    uint8_t x = 200, y = 100, z;
    if (ckd_mul(&z, x, y)) printf("uint8 乘法溢出，z=%u\\n", z);

    // 2) 安全的分配尺寸计算：n * sizeof(T) 不溢出才分配
    size_t n = 1024; size_t bytes;
    if (ckd_mul(&bytes, n, sizeof(double))) puts("尺寸溢出");
    else printf("需分配 %zu 字节\\n", bytes);

    // 3) 位操作
    uint32_t v = 0b1010'0100u;
    printf("popcount=%u leading_zeros=%u trailing_zeros=%u\\n",
           stdc_popcount(v), stdc_count_zeros(v), stdc_trailing_zeros(v));
    printf("bit_width=%u bit_floor=%u bit_ceil=%u\\n",
           stdc_bit_width(v), stdc_bit_floor(v), stdc_bit_ceil(v));
    printf("has_single_bit(64)=%s\\n", stdc_has_single_bit(64u) ? "yes" : "no");
    return 0;
}`},
  {t:'table',head:['函数（stdckdint.h）','作用','函数（stdbit.h）','作用'],rows:[
    ['<code>ckd_add(&r,a,b)</code>','加法并检查','<code>stdc_popcount</code>','统计 1 的位数'],
    ['<code>ckd_sub(&r,a,b)</code>','减法并检查','<code>stdc_count_zeros / ones</code>','统计 0 / 1 位数'],
    ['<code>ckd_mul(&r,a,b)</code>','乘法并检查','<code>stdc_bit_width</code>','最高有效位所需位数'],
    ['','','<code>stdc_bit_ceil / bit_floor</code>','向上/下取到 2 的幂'],
    ['','','<code>stdc_leading_zeros</code>','前导零个数'],
    ['','','<code>stdc_has_single_bit</code>','是否 2 的幂']
  ]},
  {t:'note',kind:'tip',k:'最实用的一个模式',x:'所有形如 <code>malloc(n * sizeof(T))</code> 的分配，都应该先用 <code>ckd_mul</code> 检查乘积是否溢出，否则「元素个数来自外部输入」时可能分配过小再越界写——这是真实世界里最常见的堆溢出成因之一。也可先判断 <code>n &gt; SIZE_MAX / sizeof(T)</code>。'},
  {t:'p',x:'<code>ckd_*</code> 用的是<b>结果类型的宽度</b>来判断溢出，因此 <code>uint8_t z; ckd_add(&amp;z, 200, 100)</code> 会返回 true（300 装不进 uint8_t）。注意溢出时结果仍会被写入（按环绕语义），所以一定要先看返回值再使用结果。'},
  {t:'ex',k:'动手练一练',items:[
    '实现一个 <code>safe_malloc_array(n, size)</code>，用 <code>ckd_mul</code> 拦截尺寸溢出。',
    '用 <code>stdc_trailing_zeros</code> 实现「取最低置位的位置」，与 <code>x &amp; -x</code> 对照。',
    '分别用位运算循环与 <code>stdc_popcount</code> 统计 1 的位数，用 <code>-O2</code> 编译后反汇编比较。'
  ]}
],

'c-4-10': [
  {t:'h',x:'深入：__VA_OPT__、#warning 与变参宏改进'},
  {t:'p',x:'C99 的变参宏有个著名尴尬：<code>#define LOG(fmt, ...) printf(fmt, __VA_ARGS__)</code> 在只传 <code>fmt</code> 时会展开成 <code>printf(fmt, )</code>——多一个逗号，语法错误。各家编译器用 <code>##__VA_ARGS__</code> 打补丁。C23 给出标准答案 <code>__VA_OPT__(内容)</code>：<b>仅当变参非空时</b>才展开括号里的内容。'},
  {t:'code',lang:'C23 · __VA_OPT__ 与 #warning',x:`#include <stdio.h>

#define LOG(fmt, ...) \\
    printf("[%s:%d] " fmt "\\n", __FILE__, __LINE__ __VA_OPT__(,) __VA_ARGS__)

#warning "本文件使用了实验性接口，发布前请复核"

#define CHECK(cond, ...) \\
    do { if (!(cond)) { fprintf(stderr, "失败: " #cond "\\n" __VA_OPT__(__VA_ARGS__)); } } while (0)

int main(void) {
    LOG("启动完成");               // 变参为空，逗号省略
    LOG("用户 %s 登录", "fc235");  // 变参非空，逗号保留
    CHECK(1 == 1);
    CHECK(1 == 2, "补充信息: %d\\n", 42);
    return 0;
}`},
  {t:'table',head:['指令 / 宏','C17','C23'],rows:[
    ['变参为空时省略逗号','编译器扩展 <code>##__VA_ARGS__</code>','标准 <code>__VA_OPT__</code>'],
    ['编译期提示但不中断','<code>#pragma message</code>（扩展）','标准 <code>#warning</code>'],
    ['变参宏参数','<code>__VA_ARGS__</code>','同，配合 <code>__VA_OPT__</code>'],
    ['属性式语法','编译器扩展','统一 <code>[[...]]</code>']
  ]},
  {t:'p',x:'<code>#warning</code> 的用武之地是「不阻止编译但要让人看见」：临时绕过、待迁移的旧接口、需要人工复核的平台分支。它比注释可靠（会出现在构建日志里），又比 <code>#error</code> 温和。发布流程里可以用 <code>-Werror</code> 配合把特定 warning 升级，形成「带 TODO 就不许合入」的约束。'},
  {t:'note',kind:'warn',k:'宏依旧不是函数',x:'即便有了 <code>__VA_OPT__</code>，宏仍然不检查类型、不保证单次求值。日志宏里如果写 <code>LOG("%d", i++)</code>，没问题；但自己写的「通用计算宏」一定要审查副作用，能改成 <code>static inline</code> 就改。'},
  {t:'ex',k:'动手练一练',items:[
    '写一个日志宏，支持 <code>LOG("msg")</code> 与 <code>LOG("%d", x)</code> 两种形式且不产生警告。',
    '用 <code>#if __STDC_VERSION__</code> 写一个「C23 用 <code>__VA_OPT__</code>、旧编译器用扩展」的兼容层。',
    '在代码里加一条 <code>#warning</code>，观察构建日志输出，再与 <code>#error</code> 对比。'
  ]}
],

'c-4-11': [
  {t:'h',x:'深入：语法清理与标准库补录'},
  {t:'p',x:'C23 删掉了一批「历史包袱」，让语言更一致，也让老代码必须做少量适配。理解这些删除项，比记新特性更能避免迁移时踩坑。'},
  {t:'table',head:['被移除 / 改变','旧行为','C23 行为'],rows:[
    ['三字母词 <code>??= ??/ ??\'</code>','预处理期替换成 <code># \\ ^</code>','完全删除，不再替换'],
    ['K&R 函数定义','<code>int f(a) int a; {...}</code>','删除，必须用原型式定义'],
    ['旧式函数声明 <code>void f();</code>','参数未指定','等价于 <code>void f(void)</code>'],
    ['<code>_Noreturn</code> / <code>&lt;stdnoreturn.h&gt;</code>','C11 函数说明符','改用 <code>[[noreturn]]</code>'],
    ['<code>&lt;stdbool.h&gt; / &lt;stdalign.h&gt; / &lt;stdnoreturn.h&gt;</code>','提供宏/关键字','变为空壳或弃用'],
    ['<code>register</code> 存储类','提示放入寄存器','语义淡化，编译器自行决定'],
    ['<code>gets</code>','C11 已移除','保持移除，用 <code>fgets</code>']
  ]},
  {t:'code',lang:'C23 · 关键字化的完整对照',x:`#include <stdio.h>
#include <stdlib.h>
#include <stddef.h>

static_assert(sizeof(void*) >= 4, "需要至少 32 位平台");   // 不再写 _Static_assert
alignas(16) static unsigned char aligned_buf[64];          // 不再写 _Alignas

[[noreturn]] static void die(void) { _Exit(1); }           // 不再写 _Noreturn

int main(void) {
    bool ok = true;                     // 不再需要 <stdbool.h>
    void *p = nullptr;                 // 不再依赖 NULL 的定义
    printf("align=%zu ok=%d p==nullptr:%s\\n",
           alignof(max_align_t), ok, p == nullptr ? "yes" : "no");
    (void)aligned_buf; (void)die;
    return 0;
}`},
  {t:'p',x:'标准库侧还补录了几项实用能力：<code>&lt;string.h&gt;</code> 的 <code>memset_explicit</code>（保证不被优化掉的安全清零，用于擦除密钥）、<code>&lt;stdbit.h&gt;</code> 与 <code>&lt;stdckdint.h&gt;</code>（4.9）、<code>nullptr_t</code> 进入 <code>&lt;stddef.h&gt;</code>，以及 <code>%b</code> 格式化（4.7）。这些改动共同把「安全」与「可读性」往前推了一步。'},
  {t:'note',kind:'tip',k:'迁移自查命令',x:'用 <code>grep -rnE "_Static_assert|_Alignas|_Alignof|_Noreturn|stdbool.h|stdalign.h|void f\\(\\);" src/</code> 先扫一遍存量代码，再按对照表批量替换。最后用 <code>-std=c23 -Wpedantic -Werror</code> 全量编译，剩下的报错基本就是老式声明和自定义 bool 宏。'},
  {t:'ex',k:'思考与练习',items:[
    '把一个使用 <code>void f();</code> 且调用时传三个参数的 C17 程序移到 C23，记录报错并修复。',
    '把 <code>_Static_assert</code>、<code>_Alignas</code>、<code>_Noreturn</code> 全部改成 C23 写法。',
    '讨论：为什么删除三字母词这种「几乎没人用」的特性也会引发兼容性问题？'
  ]}
]

};
