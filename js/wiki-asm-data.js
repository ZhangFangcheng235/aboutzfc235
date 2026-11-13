/* ==========================================================
   方程的工艺百科全书 · 语言篇
   课程：汇编语言（Assembly）
   说明：以 x86（NASM / Intel 语法）为主线，串起「高级语言 →
        机器码」的最底层视图。覆盖数制、寄存器、寻址、指令、
        工具链、调用约定、系统调用，并对照 ARM 与编译器输出。
        内容为通用计算机体系常识归纳，不绑定单一汇编器版本。
   ========================================================== */
window.WIKI_ASM = {
  id:'asm', num:'庚', en:'COURSE VII · ASSEMBLY',
  title:'汇编语言',
  lead:'离机器最近的一门「人类可读」语言：一行指令大致对应一条 CPU 能直接执行的机器码。本教程以 x86 为主、NASM 为工具，把寄存器、寻址、指令、调用约定、系统调用一层层讲清，让你既能读懂编译器生成的汇编，也能亲手写出在裸机上跑的小程序。',
  chips:['x86 / NASM','实模式 + 保护模式','寄存器与寻址','调用约定','系统调用'],
  chapters:[

  /* ================= 第 1 章 ================= */
  {id:'asm-1',num:'1',title:'汇编语言概览',lead:'先弄清它在「语言金字塔」里的位置，以及为什么今天还要学。',sections:[
    {id:'asm-1-1',num:'1.1',title:'从 C 到机器码：汇编在什么位置',lead:'高级语言 → 汇编 → 机器码，汇编是那条「可读的中间带」。',tags:['绪论'],blocks:[
      {t:'p',x:'程序从你写的源码到 CPU 真正执行，大致经过三层：<b>高级语言</b>（C/Python）→ <b>汇编语言</b>（助记符）→ <b>机器码</b>（0/1 的字节）。汇编是其中唯一「人还能直接读懂」的一层——它几乎是一一对应机器指令的符号化表示。'},
      {t:'table',head:['层级','例子','谁读','可移植性'],rows:[
        ['高级语言','<code>int x = a + b;</code>','人与编译器','高（跨平台）'],
        ['汇编语言','<code>mov eax, [b]</code>','人与汇编器','低（绑定架构）'],
        ['机器码','<code>8B 05 .. .. .. ..</code>','CPU','无（硬件专属）']
      ]},
      {t:'p',x:'汇编指令 <code>mov eax, [b]</code> 经汇编器翻译成几个字节的机器码，CPU 取指、译码、执行。学习汇编，本质上是学习「CPU 的母语」。'},
      {t:'note',k:'汇编不是一种语言，是一类',x:'「汇编」是按<b>架构</b>分的：x86、ARM、RISC-V、MIPS 各有自己的指令集与汇编语法。本教程主线用 x86（最常见），第 8 章对照 ARM。'}
    ]},
    {id:'asm-1-2',num:'1.2',title:'为什么今天还要学汇编',lead:'编译器、调试、安全、驱动——到处都用得上。',tags:['定位'],blocks:[
      {t:'ul',items:[
        '<b>读懂编译器输出</b>：性能卡点时看 <code>-S</code> 生成的汇编，才知道循环有没有被向量化、函数有没有被内联。',
        '<b>调试与逆向</b>：崩溃栈、core dump、反编译都离不开汇编。',
        '<b>安全和漏洞利用</b>：栈溢出、ROP 链、侧信道，全在指令与栈帧层面。',
        '<b>驱动 / 启动 / 嵌入式</b>：BIOS、引导扇区、中断向量、裸机程序必须手写汇编。',
        '<b>理解计算机本身</b>：寄存器、栈、调用约定、系统调用——这些概念在高级语言里被藏了起来。'
      ]},
      {t:'quote',x:'会写高级语言让你「能做事」；懂汇编让你「知道为什么快或慢、为什么崩」。它是把计算机从黑盒变成白盒的一把钥匙。'},
      {t:'note',kind:'tip',k:'不必用汇编写业务',x:'日常工程几乎不该用汇编写业务逻辑——可读性差、易错、不可移植。汇编的用武之地是<b>性能关键路径、底层系统与需要精确控制硬件</b>的地方。'}
    ]},
    {id:'asm-1-3',num:'1.3',title:'两大语法流派：Intel 与 AT&T',lead:'同一段机器码，两种「方言」。',tags:['语法'],blocks:[
      {t:'p',x:'x86 汇编有两大常见语法：<b>Intel 语法</b>（NASM、MASM 用）与 <b>AT&T 语法</b>（GCC、GDB 默认输出用）。两者描述同一指令，写法不同：'},
      {t:'table',head:['维度','Intel（NASM）','AT&T（GAS）'],rows:[
        ['操作数顺序','目的, 源','源, 目的'],
        ['寄存器','<code>eax</code>','<code>%eax</code>'],
        ['立即数','<code>42</code>','<code>$42</code>'],
        ['内存','<code>[eax]</code>','<code>(%eax)</code>'],
        ['大小后缀','隐含','<code>movl</code>(l=32位)']
      ]},
      {t:'code',lang:'asm',x:'; Intel 语法（NASM）\nmov eax, 42        ; eax = 42\nadd eax, ebx       ; eax = eax + ebx\n\n# AT&T 语法（GAS），顺序相反、带 % 和 $、带后缀 l\nmovl $42, %eax     # eax = 42\naddl %ebx, %eax    # eax = eax + ebx'},
      {t:'note',k:'本教程用 Intel 语法',x:'NASM + Intel 语法对初学者更直观（「目的在左」符合赋值直觉）。看到 GCC 反汇编里的 <code>%eax</code>、<code>$42</code> 也别慌——那只是 AT&T 方言，意思一样。'}
    ]}
  ]},

  /* ================= 第 2 章 ================= */
  {id:'asm-2',num:'2',title:'数制与数据表示',lead:'CPU 只认 0 和 1，但人要用十六进制与它对话。',sections:[
    {id:'asm-2-1',num:'2.1',title:'二进制、十六进制与字节',lead:'为什么汇编员离不开 0x。',tags:['基础'],blocks:[
      {t:'p',x:'1 个<b>比特（bit）</b>是 0 或 1；8 个比特组成 1 个<b>字节（byte）</b>，可表示 0～255（0x00～0xFF）。汇编里内存地址、机器码、寄存器值几乎都用<b>十六进制（0x…）</b>书写——因为 1 个字节正好对应 2 位十六进制，换算最省心。'},
      {t:'table',head:['十进制','十六进制','二进制','字节含义'],rows:[
        ['0','0x00','00000000','全零'],
        ['255','0xFF','11111111','全一（1 字节最大）'],
        ['256','0x100','00000001 00000000','进位到下一字节'],
        ['4096','0x1000','1 个 4KB 页的大小','']
      ]},
      {t:'code',lang:'asm',x:'; 十六进制立即数以 0x 或 h 后缀表示\nmov eax, 0xFF        ; 255\nmov ebx, 1024        ; 十进制也行\nmov ecx, 0x1000      ; 4096'},
      {t:'note',k:'记住几个常用幂',x:'<code>0x10=16</code>、<code>0x100=256</code>、<code>0x1000=4096</code>、<code>0x10000=65536</code>。看到地址 <code>0x7fffxxxx</code> 之类，能立刻估出量级，调试时很有用。'}
    ]},
    {id:'asm-2-2',num:'2.2',title:'补码：负数怎么存',lead:'CPU 不用「负号」，用「按位取反加一」。',tags:['关键'],blocks:[
      {t:'p',x:'有符号整数在 x86 里用<b>补码（two\'s complement）</b>表示：正数照旧，负数 = 对应正数「按位取反再加 1」。<code>0xFF</code> 当作无符号是 255，当作有符号 8 位就是 <code>-1</code>。一个字节的范围是 <code>-128 ～ 127</code>。'},
      {t:'table',head:['8 位二进制','无符号值','有符号（补码）'],rows:[
        ['00000000','0','0'],
        ['01111111','127','127'],
        ['10000000','128','-128'],
        ['11111111','255','-1']
      ]},
      {t:'p',x:'补码的好处是<b>减法可以用加法实现</b>：<code>a - b</code> 等价于 <code>a + (-b)</code>，CPU 只需一套加法电路。这也是为什么溢出、符号位在汇编里是个绕不开的话题。'},
      {t:'note',kind:'warn',k:'有符号/无符号溢出不同',x:'同样的加法结果，按有符号解读可能「溢出」（符号位翻转），按无符号解读只是「进位」。条件跳转指令（<code>jl/jg</code> 对有符号，<code>jb/ja</code> 对无符号）就是为此分开的。'}
    ]},
    {id:'asm-2-3',num:'2.3',title:'大小端与对齐',lead:'一个 32 位整数在内存里怎么躺。',tags:['内存'],blocks:[
      {t:'p',x:'<b>大小端（endianness）</b>决定多字节数据在内存里的字节顺序。x86 是<b>小端（little-endian）</b>：低字节在前。所以 32 位值 <code>0x12345678</code> 在内存里按 <code>78 56 34 12</code> 排列。'},
      {t:'code',lang:'asm',x:'; 0x12345678 在小端内存中的字节序列（地址由低到高）\n; 地址:  00  01  02  03\n; 内容: 78h 56h 34h 12h\nmov dword [buf], 0x12345678'},
      {t:'p',x:'<b>对齐（alignment）</b>指数据地址最好是自身大小的整数倍（4 字节 int 放在 4 的倍数地址）。对齐访问更快，某些架构（如部分 ARM）不对齐会直接异常。C 结构体里的「填充字节」就是对齐的产物。'},
      {t:'note',kind:'tip',k:'调试时认大小端',x:'在调试器里看内存（<code>dump</code>/<code>x</code>）看到字节是反的别怀疑人生——那是小端。把字节倒过来读，才是你代码里写的数。'}
    ]}
  ]},

  /* ================= 第 3 章 ================= */
  {id:'asm-3',num:'3',title:'寄存器与寻址',lead:'寄存器是 CPU 手边的「工作台」，比内存快得多。',sections:[
    {id:'asm-3-1',num:'3.1',title:'x86 通用寄存器',lead:'EAX/EBX/ECX/EDX… 每个都有约定俗成的用途。',tags:['寄存器'],blocks:[
      {t:'p',x:'x86-32 有 8 个 32 位<b>通用寄存器</b>：<code>EAX EBX ECX EDX ESI EDI EBP ESP</code>。名字里的 <code>E</code> 表示 Extended（32 位）；它们的低 16 位是 <code>AX BX CX DX…</code>，AX 又分为高 8 位 AH、低 8 位 AL，这是历史包袱也是兼容需要。'},
      {t:'table',head:['寄存器','惯例用途'],rows:[
        ['EAX','累加器：函数返回值、算术主战场'],
        ['ECX','计数器：循环、<code>rep</code> 串操作'],
        ['ESP','栈指针：永远指向栈顶'],
        ['EBP','基址指针：栈帧基准，访问局部变量'],
        ['ESI / EDI','源/目标索引：<code>movs</code> 等串操作'],
        ['EBX','被调用者保存，可做通用变量']
      ]},
      {t:'code',lang:'asm',x:mov_ax_example()},
      {t:'note',k:'寄存器是稀缺资源',x:'32 位只有 8 个通用寄存器，64 位（x86-64）扩展到 16 个（RAX…R15）。寄存器比内存快几个数量级，所以编译器拼命把变量塞进寄存器——这也是为什么「少读写内存」能提速。'}
    ]},
    {id:'asm-3-2',num:'3.2',title:'段寄存器与内存模型',lead:'实模式靠段:偏移拼地址；保护模式由系统管。',tags:['内存'],blocks:[
      {t:'p',x:'早期 x86 是 16 位、地址总线 20 位，于是用<b>段寄存器（CS/DS/SS/ES）</b>配合偏移来寻址：物理地址 = 段 × 16 + 偏移。这种「段:偏移」模型深刻影响了 DOS（见操作系统篇 DOS 课程）。'},
      {t:'ul',items:[
        '<code>CS</code>：代码段，配合 IP 指向下一条要执行的指令',
        '<code>DS</code>：数据段，默认的数据访问基址',
        '<code>SS</code>：栈段，配合 SP 形成栈',
        '<code>ES/FS/GS</code>：附加段，用于串操作或特殊用途（FS 常在 Windows/Linux 里存线程局部数据）'
      ]},
      {t:'p',x:'进入<b>保护模式</b>后，段寄存器里存的不再是「段基址」，而是「段选择子」，真正的基址/界限由<b>全局描述符表（GDT）</b>管理。现代操作系统下你基本不用手工设段寄存器，但理解它有助于看懂崩溃栈里的 <code>cs/ds/ss</code> 值。'},
      {t:'note',kind:'tip',k:'NASM 帮你省掉段前缀',x:'在 32/64 位平坦内存模型下，NASM 默认用 <code>ds</code> 访问数据，你写 <code>[buf]</code> 即可，不必写 <code>ds:[buf]</code>。只有在实模式或特殊段访问时才显式加段前缀。'}
    ]},
    {id:'asm-3-3',num:'3.3',title:'寻址方式',lead:'操作数可以从寄存器、立即数或内存来，内存还能各种算。',tags:['核心'],blocks:[
      {t:'p',x:'指令的操作数来源有三类：<b>立即数</b>（直接写死的数）、<b>寄存器</b>（寄存器里的值）、<b>内存</b>（按地址取）。内存操作数还能用多种<b>寻址方式</b>组合出地址：'},
      {t:'table',head:['寻址方式','写法','含义'],rows:[
        ['直接','<code>[var]</code>','变量地址'],
        ['寄存器间接','<code>[eax]</code>','eax 里存的是地址'],
        ['基址+偏移','<code>[ebx+8]</code>','结构体内第 8 字节'],
        ['基址+变址','<code>[ebx+esi*4]</code>','数组第 esi 个元素(4字节)'],
        ['比例变址','<code>[ebx+esi*4+12]</code>','结构体数组元素']
      ]},
      {t:'code',lang:'asm',x:'; 访问数组 arr[i]，每个元素 4 字节，首地址在 ebx\nmov esi, 3          ; i = 3\nmov eax, [ebx + esi*4]   ; eax = arr[3]\n\n; 访问结构体字段：base 在 ecx，字段偏移 12\nmov edx, [ecx + 12]      ; 取第 4 个 4 字节字段'},
      {t:'note',kind:'warn',k:'别混淆 比例因子',x:'<code>[esi*4]</code> 里的 4 是<b>元素大小</b>（字节），不是下标。下标 3 × 元素大小 4 = 偏移 12。写错比例因子会读到错位的内存——这是汇编里最常见的隐蔽 bug 之一。'}
    ]}
  ]},

  /* ================= 第 4 章 ================= */
  {id:'asm-4',num:'4',title:'指令集基础',lead:'mov / add / sub / cmp / jmp——几十个常用指令撑起全部程序。',sections:[
    {id:'asm-4-1',num:'4.1',title:'数据传送：mov 与它的亲戚',lead:'mov 不是「移动」而是「复制」。',tags:['指令'],blocks:[
      {t:'p',x:'<code>mov dst, src</code> 把 src 的<b>副本</b>写入 dst，原值不变（所以它更像「复制」而非「移动」）。dst 不能是立即数，两个操作数不能都是内存（要中转）。'},
      {t:'code',lang:'asm',x:mov_family_example()},
      {t:'p',x:'除 <code>mov</code> 外，还有 <code>xchg</code>（交换）、<code>movzx/movsx</code>（零扩展/符号扩展，把小类型安全放大到大寄存器）、<code>lea</code>（取地址）。'},
      {t:'note',k:'lea 不是 load',x:'<code>lea eax, [ebx+8]</code> 不读内存，而是把<b>地址表达式的值</b>算出来放进 eax。它常被用来快速做「基址+偏移」的算术，比用 <code>add</code> 还快——是个经典小技巧。'}
    ]},
    {id:'asm-4-2',num:'4.2',title:'算术与逻辑运算',lead:'add/sub/mul/div、and/or/xor/shl——位运算是汇编的看家本领。',tags:['指令'],blocks:[
      {t:'code',lang:'asm',x:'; 算术\nadd eax, ebx       ; eax = eax + ebx\nsub ecx, 1         ; ecx = ecx - 1\ninc edx             ; edx += 1\ndec esi             ; esi -= 1\n\n; 逻辑（按位）\nand eax, 0xFF       ; 取低 8 位（掩码）\nor  ebx, 0x1000     ; 置某一位\nxor ecx, ecx        ; 最快的「清零」写法\nshl eax, 2          ; 左移 2 位 = 乘 4\nshr ebx, 1          ; 右移 1 位 = 除 2（无符号）'},
      {t:'p',x:'<code>xor reg, reg</code> 是清 0 的惯用法：既短又快，还顺手清掉条件标志。位运算（与/或/非/异或/移位）在汇编里地位极高——权限掩码、对齐、压缩、加密全靠它。'},
      {t:'note',kind:'tip',k:'乘除尽量换成移位',x:'除以 2 的幂用 <code>shr</code> 比 <code>div</code> 快得多；乘 2 的幂用 <code>shl</code>。编译器也这么干。但注意 <code>div</code> 对<b>有符号</b>用 <code>idiv</code>，且会把余数丢进 <code>edx</code>，别忘了。'}
    ]},
    {id:'asm-4-3',num:'4.3',title:'标志位与比较',lead:'EFLAGS 里藏着的「比较结果」，决定程序怎么跳。',tags:['关键'],blocks:[
      {t:'p',x:'x86 有个 <b>EFLAGS</b> 标志寄存器，很多指令会顺手更新其中的标志位（如 ZF 零标志、SF 符号位、CF 进位、OF 溢出）。<code>cmp a, b</code> 内部就是做 <code>a - b</code> 并根据结果设标志位，但不保存差。<b>真正判断大小的是后面的条件跳转</b>。'},
      {t:'table',head:['条件跳转','含义（有符号）','含义（无符号）'],rows:[
        ['je / jz','相等（ZF=1）','相等'],
        ['jne / jnz','不等','不等'],
        ['jg / jge','大于 / 大于等于','ja / jae'],
        ['jl / jle','小于 / 小于等于','jb / jbe']
      ]},
      {t:'code',lang:'asm',x:cmp_example()},
      {t:'note',kind:'warn',k:'有符号与无符号别混',x:'<code>-1</code>（补码全 1）作为无符号是极大值。所以比较两个数前要先确定它们的「解读方式」：和 <code>jl</code> 配对的必须是有符号比较，和 <code>jb</code> 配对的必须是无符号比较。'}
    ]}
  ]},

  /* ================= 第 5 章 ================= */
  {id:'asm-5',num:'5',title:'工具链：汇编、链接、调试',lead:'从 .asm 到可执行文件，再到单步看寄存器。',sections:[
    {id:'asm-5-1',num:'5.1',title:'NASM + ld 构建第一个程序',lead:'汇编器把助记符变机器码，链接器把段拼成可执行。',tags:['工具'],blocks:[
      {t:'p',x:'主流流程是：<b>NASM</b> 把 <code>.asm</code> 汇编成目标文件 <code>.o</code>，再由<b>链接器（ld）</b>链接成可执行文件。也可让 GCC 直接驱动这条链。'},
      {t:'code',lang:'bash',x:'; 用 NASM 汇编、用 ld 链接（Linux 64 位）\nnasm -f elf64 hello.asm -o hello.o\nld hello.o -o hello\n\n; 或让 gcc 一条龙（更省心，自动接好 C 运行时）\nnasm -f elf64 hello.asm -o hello.o\ngcc hello.o -o hello'},
      {t:'p',x:'<code>-f elf64</code> 指定输出 64 位 ELF 格式——格式必须和链接器/目标平台匹配，否则报「格式不兼容」。32 位机器用 <code>-f elf32</code>。'},
      {t:'note',k:'选 NASM 还是 GAS',x:'NASM（Intel 语法、跨平台、文档友好）适合学习；GAS 是 GNU 工具链默认的汇编器（AT&T 语法），看 GCC 反汇编时会遇到。两者指令语义一致，只是写法不同。'}
    ]},
    {id:'asm-5-2',num:'5.2',title:'用 GDB 单步调试汇编',lead:'看每一步后寄存器和内存怎么变。',tags:['调试'],blocks:[
      {t:'p',x:'GDB 是窥探汇编执行过程的最佳工具。关键命令：<code>break</code> 下断点、<code>stepi</code>（或 <code>si</code>）单步一条指令、<code>info registers</code> 看全部寄存器、<code>x/4xw &addr</code> 看内存、<code>disassemble</code> 看反汇编。'},
      {t:'code',lang:'gdb',x:'; 在 _start 处下断点并单步\n(gdb) break _start\n(gdb) run\n(gdb) stepi\n(gdb) info registers eax ebx ecx\n(gdb) x/4xw &buf        ; 以 4 字节(字)单位看 buf 处 4 个单元\n(gdb) disassemble _start'},
      {t:'p',x:'调试汇编的核心心法：<b>每执行一条指令，预期寄存器/内存的变化，再用 GDB 验证</b>。一旦预期和实际对不上，就找到了 bug。'},
      {t:'note',kind:'tip',k:'si 与 ni 的区别',x:'<code>stepi</code> 会进函数内部单步；<code>nexti</code>（<code>ni</code>）把整条 <code>call</code> 当一步跳过。看「当前函数内部」用 si，想快速过掉库函数用 ni。'}
    ]},
    {id:'asm-5-3',num:'5.3',title:'GCC 内联汇编',lead:'在 C 里直接嵌几行汇编，做编译器做不到的微调。',tags:['实战'],blocks:[
      {t:'p',x:'C 里可用 <code>asm</code>（或 <code>__asm__</code>）嵌入汇编，叫<b>内联汇编</b>。简单写法 <code>asm("nop");</code> 让编译器原样插入指令。真正有用的是带「约束」的扩展内联汇编，用来声明输入/输出/会被破坏的寄存器。'},
      {t:'code',lang:'C',x:'#include <stdio.h>\nint main(){\n    int a = 3, b = 4, c;\n    /* 扩展内联汇编：c = a + b */\n    asm ("addl %%ebx, %%eax"\n         : "=a"(c)          /* 输出：结果放 eax，赋给 c */\n         : "a"(a), "b"(b));  /* 输入：a 进 eax, b 进 ebx */\n    printf("%d\\n", c);     /* 7 */\n}'},
      {t:'p',x:'内联汇编里的 <code>%%</code> 是给编译器看的转义（最终生成单个 <code>%</code>）。约束字符串 <code>"a"(a)</code> 告诉编译器「把变量 a 放进 eax」。写错约束会导致编译器基于错误假设优化，产生诡异 bug。'},
      {t:'note',kind:'danger',k:'内联汇编是双刃剑',x:'一旦写了内联汇编，你就部分接管了编译器对寄存器/内存的假设。除非性能或指令访问确实必要，否则优先纯 C——多数情况下编译器比你更会安排寄存器。'}
    ]}
  ]},

  /* ================= 第 6 章 ================= */
  {id:'asm-6',num:'6',title:'控制流与函数调用',lead:'跳转、循环、函数——汇编里没有「for」「函数」，只有跳来跳去和栈。',sections:[
    {id:'asm-6-1',num:'6.1',title:'跳转与循环',lead:'无条件跳 jmp，条件跳 je/jne/jg… 拼出 if 和 while。',tags:['控制流'],blocks:[
      {t:'p',x:'高级语言里的 <code>if/while/for</code>，在汇编里都被翻译成<b>跳转指令</b> + 标志位。一个循环，就是「做一件事 → cmp → 条件跳回开头」。'},
      {t:'code',lang:'asm',x:loop_example()},
      {t:'p',x:'注意：汇编没有花括号，靠<b>标签（label）</b>（如 <code>.loop:</code>）和跳转来界定范围。写的时候心里要有「这块代码执行完跳去哪」的地图。'},
      {t:'note',kind:'tip',k:'标签是汇编的控制结构',x:'标签本身不占机器码，只是个地址记号。<code>jmp .loop</code> 就是「跳到那个地址」。把标签起得有意义（<code>.loop</code> / <code>.done</code> / <code>.err</code>），比满屏 <code>L1/L2</code> 好读十倍。'}
    ]},
    {id:'asm-6-2',num:'6.2',title:'call / ret 与栈帧',lead:'函数调用靠栈：call 压返回地址，ret 弹回来。',tags:['核心'],blocks:[
      {t:'p',x:'<code>call func</code> 把<b>返回地址（下一条指令的地址）</b>压入栈，再跳到 func；func 末尾 <code>ret</code> 把返回地址弹回 <code>eip</code>，回到调用处。参数、局部变量则通过 <code>esp/ebp</code> 这组栈指针管理。'},
      {t:'code',lang:'asm',x:stack_frame_example()},
      {t:'p',x:'进入函数时经典的「序幕（prologue）」：<code>push ebp; mov ebp, esp</code> 建立<b>栈帧</b>，之后用 <code>[ebp+8]</code> 取参数、<code>[ebp-4]</code> 取局部变量；结尾「尾声（epilogue）」：<code>mov esp, ebp; pop ebp; ret</code> 还原现场。'},
      {t:'note',kind:'warn',k:'栈失衡必崩',x:'<code>push</code> 几次就要 <code>pop</code> 几次，<code>call</code> 必须有对应的 <code>ret</code>。栈指针算错一寸，<code>ret</code> 就会跳到错误地址——段错误或诡异崩溃就此而来。这是汇编调试的头号元凶。'}
    ]},
    {id:'asm-6-3',num:'6.3',title:'调用约定：cdecl 等',lead:'谁清理参数、参数从右往左还是从左往右压栈。',tags:['约定'],blocks:[
      {t:'p',x:'<b>调用约定（calling convention）</b>规定函数调用时：参数按什么顺序压栈、由调用者还是被调者清理栈、返回值放哪个寄存器。C 默认 <b>cdecl</b>：参数<b>从右往左</b>压栈，<b>调用者</b>清理（所以可变参数 printf 才可行）。'},
      {t:'table',head:['约定','参数顺序','清栈方','返回值'],rows:[
        ['cdecl','右→左','调用者','eax'],
        ['stdcall','右→左','被调者','eax'],
        ['fastcall','部分进寄存器','被调者','eax'],
        ['System V AMD64','寄存器优先(rdi,rsi…)','调用者','rax']
      ]},
      {t:'code',lang:'asm',x:cdecl_example()},
      {t:'note',k:'64 位改用寄存器传参',x:'32 位几乎全靠栈传参；64 位（System V AMD64，Linux/macOS）前 6 个整型参数走寄存器 <code>rdi rsi rdx rcx r8 r9</code>，其余才压栈。看反汇编时认得出这套顺序，函数参数一眼就能对上。'}
    ]}
  ]},

  /* ================= 第 7 章 ================= */
  {id:'asm-7',num:'7',title:'系统调用与第一个程序',lead:'脱离库函数，直接和内核对话，写出不需要 libc 的程序。',sections:[
    {id:'asm-7-1',num:'7.1',title:'Linux 系统调用号与寄存器约定',lead:'把「要什么服务」放进 eax，参数放进其它寄存器，再 int 0x80 / syscall。',tags:['系统调用'],blocks:[
      {t:'p',x:'在 Linux 里，程序不能直接碰硬件，要通过<b>系统调用</b>请求内核代劳。<b>32 位</b>用中断 <code>int 0x80</code>：系统调用号放 <code>eax</code>，参数依次放 <code>ebx ecx edx esi edi</code>。'},
      {t:'table',head:['调用号(eax)','服务','参数(ebx,ecx,edx…)'],rows:[
        ['1','sys_exit','退出码'],
        ['3','sys_read','fd, buf, count'],
        ['4','sys_write','fd, buf, count'],
        ['5','sys_open','path, flags, mode']
      ]},
      {t:'p',x:'<b>64 位</b>改用更快的 <code>syscall</code> 指令：调用号放 <code>rax</code>，参数 <code>rdi rsi rdx r10 r8 r9</code>，返回值仍在 <code>rax</code>。'},
      {t:'note',k:'为什么有 int 0x80 和 syscall',x:'<code>int 0x80</code> 是老式软中断，慢但兼容；<code>syscall</code> 是 64 位的专用指令，快得多。写 64 位程序统一用 <code>syscall</code>。'}
    ]},
    {id:'asm-7-2',num:'7.2',title:'写一个纯汇编写的 hello world',lead:'不链接 libc，自己 syscall 打印再退出。',tags:['实战'],blocks:[
      {t:'code',lang:'asm',x:hello_world_asm()},
      {t:'p',x:'这段程序：<code>sys_write</code>（号 1）把消息写到文件描述符 1（标准输出），再 <code>sys_exit</code>（号 60）以 0 退出。注意 64 位用 <code>rax/rdi/rsi/rdx</code> 与 <code>syscall</code>。'},
      {t:'code',lang:'bash',x:nasm_build_cmds()},
      {t:'note',k:'不链接 libc 的意义',x:'这种程序体积极小、不依赖任何库，常被用在<b>引导程序、壳代码、CTF</b> 等场景。它让你看清：所谓「打印」和「退出」，底层就是两次系统调用。'}
    ]},
    {id:'asm-7-3',num:'7.3',title:'读写文件：用 fd 而非 FILE*',lead:'open/read/write/close 一套系统调用走到底。',tags:['实战'],blocks:[
      {t:'p',x:'文件操作也是系统调用：<code>open</code>（号 2）返回<b>文件描述符 fd</b>，<code>read</code>（0）/ <code>write</code>（1）/ <code>close</code>（3）都围绕 fd 工作。这和 C 的 <code>fopen</code> 不同——<code>fopen</code> 是 libc 在 fd 之上包的缓冲层。'},
      {t:'code',lang:'asm',x:read_file_asm()},
      {t:'p',x:'相比 C 的 <code>fopen/fread</code>，直接 syscall 少了缓冲层、更贴近内核，但需要你自己管理缓冲区、循环读、处理短读（一次 read 不一定读满 count）。'},
      {t:'note',kind:'warn',k:'检查返回值是铁律',x:'系统调用失败时返回值是负的错误码（<code>-ENOSYS</code> 之类）。汇编里没人替你检查，<b>每次 syscall 后都要检查 rax 是否 ≥ 0</b>，否则拿错误值当 fd 继续用会直接崩。'}
    ]}
  ]},

  /* ================= 第 8 章 ================= */
  {id:'asm-8',num:'8',title:'现代汇编与跨平台',lead:'把汇编当「可观测工具」：看编译器怎么写，再对照 ARM。',sections:[
    {id:'asm-8-1',num:'8.1',title:'看编译器生成的汇编',lead:'gcc -S 把 C 翻译成汇编，是学习的最佳教材。',tags:['工具'],blocks:[
      {t:'p',x:'让编译器把 C 翻译成汇编，是学汇编最高效的路径：<code>gcc -S -O2 foo.c</code> 直接产出 <code>foo.s</code>，你看到的都是真实的、优化过的指令。'},
      {t:'code',lang:'bash',x:'# 生成汇编（不编译链接），看编译器写了什么\ngcc -S -O2 -masm=intel foo.c -o foo.s\n\n# 反汇编已编译的可执行文件\nobjdump -d -M intel a.out | less'},
      {t:'p',x:'对比 <code>-O0</code> 和 <code>-O2</code> 的汇编，你会直观看到：循环被展开、变量被塞进寄存器、死代码被删掉。这套「读反汇编」的能力，是性能优化的基本功。'},
      {t:'note',kind:'tip',k:'认得出优化痕迹',x:'看到 <code>lea</code> 做乘法、<code>cmov</code> 替代分支、<code>xor eax,eax</code> 清零，都是编译器的惯用优化。能读懂它们，就能判断「编译器到底听没听你的话」。'}
    ]},
    {id:'asm-8-2',num:'8.2',title:'SIMD 与性能',lead:'一条指令同时算 4/8/16 个数——向量化。',tags:['性能'],blocks:[
      {t:'p',x:'现代 CPU 有<b>SIMD（单指令多数据）</b>指令集：MMX、SSE、AVX、AVX-512。它们用宽寄存器（128/256/512 位）一次对多个数据并行运算，是图像处理、音频、科学计算提速的关键。'},
      {t:'table',head:['指令集','寄存器宽','一次可算'],rows:[
        ['MMX/SSE','128 位','4 个 32 位 float'],
        ['AVX','256 位','8 个 32 位 float'],
        ['AVX-512','512 位','16 个 32 位 float']
      ]},
      {t:'code',lang:'asm',x:simd_example()},
      {t:'note',k:'通常让编译器做向量化',x:'手写 SIMD 汇编易错且难移植。多数情况用编译器自动向量化（<code>-O3</code>）或编译器内建函数（<code>_mm_add_ps</code> 等 intrinsics）即可。纯手写 SIMD 只在极限优化或研究时才上。'}
    ]},
    {id:'asm-8-3',num:'8.3',title:'ARM 汇编速览',lead:'换套指令集：寄存器更多、后缀决定条件、加载/存储分离。',tags:['对照'],blocks:[
      {t:'p',x:'ARM（手机、树莓派、苹果芯片）是最常见的另一套架构。它和 x86 思路差异很大：<b>更多寄存器</b>（R0–R15）、<b>加载/存储分离</b>（只能从内存 load 到寄存器、store 回去，不能像 x86 那样「内存直接加内存」）、<b>条件后缀</b>（<code>addne</code> 表示「不相等才加」）。'},
      {t:'table',head:['x86','ARM 等价','说明'],rows:[
        ['<code>mov eax, 1</code>','<code>mov r0, #1</code>','立即数用 # 前缀'],
        ['<code>add eax, ebx</code>','<code>add r0, r0, r1</code>','ARM 三操作数：dst, src1, src2'],
        ['<code>cmp</code> + <code>jne</code>','<code>cmp r0, r1; bne loop</code>','b 是 branch（跳）'],
        ['内存直接运算','<code>ldr/str</code> 中转','ARM 不允许内存参与 ALU']
      ]},
      {t:'code',lang:'asm',x:arm_example()},
      {t:'note',kind:'tip',k:'ARM 的「条件执行」很特别',x:'ARM 指令可带条件后缀（<code>beq</code> 等于才跳、<code>addeq</code> 等于才加），能省掉不少分支跳转。x86 后来也加了 <code>cmov</code> 等条件传送来模仿这种好处。'}
    ]}
  ]}
  ]
};

/* ---------- 汇编课程内用到的可复用代码片段（集中管理，避免重复与转义错误） ---------- */
function mov_ax_example(){
  return '; 32 位：用 8/16/32 位视图操作同一个寄存器\nmov ax, 0x1234       ; 写低 16 位（AX）\nmov al, 0xFF         ; 只改最低 8 位（AL）\n; 此时 eax 低 16 位已被改写为 0x12FF 之类\n\n; 取地址用 lea（不访问内存）\nlea eax, [ebx+8]      ; eax = ebx + 8，而非读 ebx+8 处的内容';
}
function mov_family_example(){
  return 'mov eax, 10         ; eax = 10（立即数 → 寄存器）\nmov ebx, eax        ; ebx = eax（寄存器 → 寄存器）\nmov ecx, [num]      ; ecx = 内存变量 num 的值\nmov [buf], edx      ; 把 edx 写入内存 buf\n\nmovzx eax, byte [b] ; 零扩展：1 字节 0xFF → 0x000000FF\nmovsx eax, byte [b] ; 符号扩展：0xFF(有符号-1) → 0xFFFFFF...FF';
}
function cmp_example(){
  return '    mov eax, 5\n    mov ebx, 3\n    cmp eax, ebx      ; 内部算 5 - 3，设 ZF=0, SF=0\n    je  .equal        ; 相等才跳（这里不跳）\n    jg  .greater      ; 有符号：eax > ebx 则跳（这里跳）\n.equal:\n    ; ...\n.greater:\n    ; 走到这里';
}
function loop_example(){
  return '    mov ecx, 5          ; 计数器 i = 5\n.loop:\n    ; 这里放循环体（例如打印 ecx 当前值）\n    dec ecx             ; i--\n    jnz .loop           ; ZF=0（即 ecx≠0）就跳回 .loop\n    ; 循环结束，ecx 此时为 0';
}
function stack_frame_example(){
  return '; 函数 prologue（序幕）\nmyfunc:\n    push ebp\n    mov  ebp, esp       ; ebp 指向当前栈帧底部\n    sub  esp, 16        ; 留出 16 字节局部变量空间\n    ; ... 用 [ebp-4]、[ebp-8] 访问局部变量，[ebp+8] 取第 1 个参数 ...\n; epilogue（尾声）\n    mov  esp, ebp       ; 释放局部变量\n    pop  ebp            ; 还原调用者的栈帧\n    ret                 ; 返回调用处';
}
function cdecl_example(){
  return '; C 调用 myadd(2, 3)，cdecl 从右往左压栈\n    push 3              ; 第 2 个参数\n    push 2              ; 第 1 个参数\n    call myadd          ; 压返回地址并跳入\n    add  esp, 8         ; 调用者清理 8 字节（2 个参数）\n\nmyadd:\n    mov  eax, [esp+4]   ; 取第 1 个参数\n    add  eax, [esp+8]   ; 加第 2 个参数\n    ret                 ; 返回值已在 eax';
}
function hello_world_asm(){
  return '; hello.asm —— 64 位 Linux，纯 syscall，不依赖 libc\nsection .data\n    msg db "Hello, Assembly!", 10\n    len equ $ - msg\nsection .text\n    global _start\n_start:\n    mov  rax, 1          ; sys_write\n    mov  rdi, 1          ; fd = 1 (stdout)\n    mov  rsi, msg        ; 缓冲区指针\n    mov  rdx, len        ; 字节数\n    syscall\n    mov  rax, 60         ; sys_exit\n    mov  rdi, 0          ; 退出码 0\n    syscall';
}
function nasm_build_cmds(){
  return 'nasm -f elf64 hello.asm -o hello.o\nld hello.o -o hello\n./hello           # 输出: Hello, Assembly!';
}
function read_file_asm(){
  return '; 伪片段：打开并读取一个文件（64 位 Linux）\n; rax=2 open(path, O_RDONLY, 0)  → 返回 fd\n; rax=0 read(fd, buf, count)      → 返回读到的字节数\n; rax=3 close(fd)\n; rax=60 exit(0)\n; 注意：每次 syscall 后都要检查 rax，负值表示错误';
}
function simd_example(){
  return '; AVX2：用 256 位 ymm 寄存器一次加 8 个 float\n; C 里写 _mm256_add_ps，编译器会生成类似指令\n; 纯汇编示意：\n; vaddps ymm0, ymm1, ymm2   ; ymm0 = ymm1 + ymm2（8 个 float 同时相加）\n; 一次指令完成 8 次加法，吞吐是标量版的 8 倍';
}
function arm_example(){
  return '; ARM（AArch64）示意：把两个数相加并存回\n; R0 收第 1 个参数，R1 收第 2 个，结果放 R0\n    add  w0, w0, w1     ; w0 = w0 + w1（32 位）\n    ret                 ; 返回（相当于 x30）\n\n; 带条件后缀：相等才加\n    cmp  w0, w1\n    addeq w0, w0, w1    ; 仅当 Z 标志置位时执行';
}
