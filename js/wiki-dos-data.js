/* ==========================================================
   方程的工艺百科全书 · 操作系统篇
   课程：DOS（磁盘操作系统）
   说明：以 MS-DOS / PC DOS 为主线，讲清命令行操作系统的历史定位、
        实模式内存模型、文件系统与命令、启动配置、BIOS/DOS 中断、
        DEBUG 调试工具，以及它在今天（模拟器、引导、FreeDOS）的延续。
        内容为通用历史与工程常识归纳，命令以 MS-DOS 6.x 为参照。
   ========================================================== */
window.WIKI_DOS = {
  id:'dos', num:'丁', en:'COURSE IV · DOS',
  title:'DOS · 磁盘操作系统',
  lead:'DOS（Disk Operating System）是个人计算机的第一代主流操作系统：没有窗口、没有鼠标依赖，一切靠命令行。本课程以 MS-DOS 为主线，讲清它的内存模型（640K 界限）、FAT 文件系统、CONFIG.SYS / AUTOEXEC.BAT、BIOS/DOS 中断，以及用汇编写出能在裸机上跑的 .COM 程序，并顺着 DEBUG 与 DOSBox 把这段历史接到今天。',
  chips:['实模式 16 位','640K 常规内存','FAT12/16','CONFIG.SYS','DEBUG / DOSBox'],
  chapters:[

  /* ================= 第 1 章 ================= */
  {id:'dos-1',num:'1',title:'什么是 DOS',lead:'先分清它是「一个系统」还是「一类系统」，以及为什么 DOS 不等于 Windows。',sections:[
    {id:'dos-1-1',num:'1.1',title:'DOS 的历史定位',lead:'从 CP/M 到 MS-DOS，再到 Windows 的底座。',tags:['绪论'],blocks:[
      {t:'p',x:'<b>DOS</b> 是「磁盘操作系统」的统称。1970 年代就有不少 DOS（CP/M、Apple DOS 等）；而今天说 DOS，通常指 <b>MS-DOS</b>（微软 1981 年为 IBM PC 推出）及其兼容的 PC DOS。它是 1980–1990 年代个人电脑的事实标准。'},
      {t:'table',head:['年份','事件','意义'],rows:[
        ['1980','CP/M-86 与 QDOS 竞争 IBM PC 订单','微软买下 QDOS 改写'],
        ['1981','MS-DOS 1.0 随 IBM PC 发布','PC 时代开启'],
        ['1983','MS-DOS 2.0 引入子目录','吸收 UNIX 的层次目录思想'],
        ['1987','MS-DOS 3.3 普及','大量兼容机标配'],
        ['1993','Windows NT 问世','DOS 作为底层逐渐退场'],
        ['1995','Windows 95 仍保留 DOS 模式','但内核已转向 32 位']
      ]},
      {t:'quote',x:'DOS 是「命令行的 PC」的代名词。它把计算机从实验室和打字机式的终端，变成普通人也能开机就用的一台盒子——尽管用的是黑底白字的命令行。'},
      {t:'note',kind:'tip',k:'DOS 是一「类」不是一「个」',x:'MS-DOS、PC DOS、DR-DOS、FreeDOS 都是 DOS 家族成员，命令与中断大体兼容。本教程以 MS-DOS 为参照，其它成员大同小异。'}
    ]},
    {id:'dos-1-2',num:'1.2',title:'命令行操作系统的样子',lead:'没有 GUI，只有提示符、光标和你敲的命令。',tags:['界面'],blocks:[
      {t:'p',x:'DOS 是纯<b>命令行操作系统</b>：启动后屏幕是黑底、一行提示符（如 <code>C:\\></code>），你输入命令、回车执行。没有窗口、没有鼠标驱动（早期），一切交互靠键盘与文本。'},
      {t:'code',lang:'Batch · 提示符',x:'C:\\> dir\nC:\\> cd GAMES\nC:\\GAMES> copy old.exe new.exe\nC:\\GAMES> edit readme.txt'},
      {t:'ul',items:[
        '<b>提示符</b>：<code>C:\\></code> 表示当前在 C 盘根目录',
        '<b>命令</b>：内部命令（如 <code>dir/cd</code>，常驻内存）与外部命令（如 <code>format.com</code>，独立文件）',
        '<b>参数</b>：命令后跟 <code>/参数</code>，如 <code>dir /w</code>（宽列）、<code>dir /p</code>（分屏）'
      ]},
      {t:'note',k:'为什么 DOS 命令常带斜杠参数',x:'DOS 用 <code>/</code> 表示开关（<code>dir /w</code>），而 UNIX 用 <code>-</code>（<code>ls -l</code>）。这是两套传统的分野，今天仍在 Windows 的 CMD 里保留着。'}
    ]},
    {id:'dos-1-3',num:'1.3',title:'DOS 与 Windows 的关系',lead:'Windows 早期就「坐在 DOS 肩上」，后来彻底独立。',tags:['关系'],blocks:[
      {t:'p',x:'很多人以为「DOS 被 Windows 取代了」，其实关系分阶段：<b>Windows 1.0–3.x</b> 是跑在 DOS 之上的图形外壳（先有 DOS，再 <code>win</code> 进桌面）；<b>Windows 95/98/Me</b> 仍保留 DOS 模式（可重启进纯 DOS）；<b>Windows NT/2000/XP 及以后</b>才彻底脱离 DOS，使用独立内核。'},
      {t:'table',head:['Windows 版本','与 DOS 关系'],rows:[
        ['3.1 / 3.11','纯图形外壳，依赖 DOS 启动'],
        ['95 / 98 / Me','自成体系，但仍带实模式 DOS 入口'],
        ['NT / 2000 / XP+','独立内核，命令行是 CMD 而非真 DOS']
      ]},
      {t:'note',kind:'warn',k:'CMD 不是 DOS',x:'现代 Windows 的 <code>cmd.exe</code> 只是<b>命令解释器</b>，命令风格继承自 DOS，但底层是 NT 内核，不是 16 位实模式 DOS。真正的 DOS 需要实模式或通过模拟器运行。'},
      {t:'faq',q:'为什么还有人用 DOS？',a:'嵌入式设备、老式工控机、医疗仪器、复古游戏与引导程序研究仍离不开它。更重要的是：理解 DOS 的<b>实模式、640K 限制、中断模型</b>，是理解整个 PC 体系演进的钥匙（详见第 2、5 章）。'}
    ]}
  ]},

  /* ================= 第 2 章 ================= */
  {id:'dos-2',num:'2',title:'内存模型与实模式',lead:'8086 的 20 位地址总线，逼出了「段:偏移」和著名的 640K 界限。',sections:[
    {id:'dos-2-1',num:'2.1',title:'1MB 内存与 640K 常规内存',lead:'为什么 DOS 程序总被 640K 这根线卡住。',tags:['内存'],blocks:[
      {t:'p',x:'8086 是 16 位 CPU，但地址总线是 <b>20 位</b>，所以最多访问 <code>1MB</code>（0x00000～0xFFFFF）内存。其中 <code>0～640K</code>（0x00000～0x9FFFF）留给 DOS 程序，叫<b>常规内存（conventional memory）</b>；640K～1MB 留给显存、BIOS、ROM，叫上位内存（UMA）。'},
      {t:'table',head:['地址范围','名称','用途'],rows:[
        ['0–640K','常规内存','DOS 与应用程序'],
        ['640K–768K','上位内存 UMA','显存、BIOS 数据'],
        ['768K–1M','保留','ROM、BIOS 代码'],
        ['1M 以上','扩展内存 XMS','80386+ 才能用，DOS 不能直接寻址']
      ]},
      {t:'quote',x:'「640K 对任何人来说都足够用了」——这句常被归于比尔·盖茨的名言其实真伪难辨，但它精准地点出了 DOS 时代最著名的一根天花板。'},
      {t:'note',kind:'tip',k:'1M 之外怎么用',x:'80286 有 24 位地址（16MB），80386 有 32 位（4GB），但 DOS 程序默认还活在实模式的 1MB 里。想用 1MB 以上的「扩展内存（XMS）」，要靠 <code>HIMEM.SYS</code> 这类驱动以特殊方式搬运。'}
    ]},
    {id:'dos-2-2',num:'2.2',title:'段:偏移寻址',lead:'两个 16 位数拼出一个 20 位地址。',tags:['寻址'],blocks:[
      {t:'p',x:'实模式下，一个物理地址由<b>段（segment）</b>和<b>偏移（offset）</b>两部分表示：<code>物理地址 = 段 × 16 + 偏移</code>。例如 <code>1234:5678</code> 表示段 0x1234、偏移 0x5678，物理地址 = 0x1234×0x10 + 0x5678 = 0x179B8。'},
      {t:'code',lang:'asm',x:seg_offset_example()},
      {t:'p',x:'因为「段×16+偏移」存在多种组合得到同一物理地址，所以<b>同一内存可以有多个逻辑表示</b>：<code>0000:1234</code> 和 <code>0123:0004</code> 指向同一个位置。调试器里看到不同写法别慌。'},
      {t:'note',kind:'warn',k:'段不能想写多大写多大',x:'段和偏移各 16 位，所以单个段最大 64K。一个「段:偏移」只能覆盖 64K 连续空间——这就是 DOS 下「数据段 64K 限制」的来源，写大数组要分段（far 指针）处理。'}
    ]},
    {id:'dos-2-3',num:'2.3',title:'中断向量表',lead:'0 号到 255 号中断，是 DOS 调用底层服务的「黄页」。',tags:['中断'],blocks:[
      {t:'p',x:'实模式最低 <code>1KB</code>（0x00000–0x003FF）是<b>中断向量表（IVT）</b>，共 256 个槽，每个 4 字节（段:偏移），记录某个中断发生时 CPU 该跳去哪段代码。BIOS、DOS 都通过中断号对外提供服务。'},
      {t:'table',head:['中断向量号','来源','服务'],rows:[
        ['0x00–0x1F','BIOS','硬件异常、磁盘、视频、键盘等'],
        ['0x20–0x2F','DOS','文件、内存、进程等系统功能'],
        ['0x21','DOS','最常用：万能功能分发器'],
        ['0x10','BIOS','视频/显示服务（INT 10h）']
      ]},
      {t:'p',x:'调用中断用 <code>int n</code> 指令。例如 <code>int 21h</code> 是 DOS 的「总服务台」：把具体功能号放进 <code>ah</code> 寄存器再 <code>int 21h</code>，就能请求打开文件、打印字符等。这正是 DOS 程序与系统对话的方式（第 5 章详讲）。'},
      {t:'note',k:'中断是 DOS 的「系统调用」',x:'比起现代 Linux 的 <code>syscall</code>，DOS 用 <code>int 21h</code> 软中断当系统调用。本质一样：应用程序发出请求，内核（DOS/BIOS）代为执行特权操作。'}
    ]}
  ]},

  /* ================= 第 3 章 ================= */
  {id:'dos-3',num:'3',title:'文件系统与常用命令',lead:'FAT 是 DOS 的「磁盘语言」，DIR/COPY 是每天的肌肉记忆。',sections:[
    {id:'dos-3-1',num:'3.1',title:'FAT12 与 FAT16',lead:'用一张「文件分配表」串起簇链。',tags:['文件系统'],blocks:[
      {t:'p',x:'DOS 使用 <b>FAT（File Allocation Table，文件分配表）</b>文件系统。软盘用 FAT12（每项 12 位），硬盘用 FAT16（每项 16 位）。它的核心思想：磁盘被分成「簇（cluster）」，文件占用的簇通过 FAT 表串成一条链。'},
      {t:'table',head:['版本','簇大小','最大卷','典型介质'],rows:[
        ['FAT12','512B–4K','32MB','360K/1.44M 软盘'],
        ['FAT16','2K–64K','2GB（通常分区 ≤2GB）','早期硬盘'],
        ['FAT32','典型 4K、8K、16K、32K','理论 2TB，常用 ≤32GB','后期大软盘/USB']
      ]},
      {t:'p',x:'FAT 表像一张「链表索引」：每个簇在表里有一个表项，记录「下一个簇的编号」，结尾用特殊标记（0xFFF/0xFFFF）。删除文件只是把链首标记为「空闲」并改目录项，所以误删后<b>停止写入</b>才有机会找回。'},
      {t:'note',kind:'warn',k:'FAT 几乎没有权限',x:'FAT 是单用户、无权限模型的设计（软盘时代谁都不能设权限）。它后来的「只读/隐藏/系统」属性只是 DOS 文件属性位，远非现代文件系统的 ACL/权限体系。'}
    ]},
    {id:'dos-3-2',num:'3.2',title:'文件与目录命令',lead:'DIR / CD / COPY / DEL / REN / TYPE 一天要用几十次。',tags:['命令'],blocks:[
      {t:'code',lang:'Batch',x:'; 列出当前目录（宽列、分屏）\ndir /w /p\n\n; 切换目录、建目录、删目录\ncd GAMES\nmd SAVE\nrd SAVE\n\n; 复制、改名、删除、查看\copy a.exe b.exe\nren a.exe old.exe\ndel temp.dat\ntype readme.txt'},
      {t:'table',head:['命令','作用','常用参数'],rows:[
        ['<code>dir</code>','列目录','/w 宽列，/p 分屏，/s 含子目录'],
        ['<code>cd</code>','进/出目录','cd.. 回到上层'],
        ['<code>copy</code>','复制文件','支持跨盘'],
        ['<code>del</code>','删除文件','<code>del *.*</code> 清空（危险）'],
        ['<code>type</code>','显示文本文件内容','只认纯文本'],
        ['<code>md/rd</code>','建/删目录','rd 无法删非空目录']
      ]},
      {t:'note',kind:'danger',k:'del *.* 与 format 是高危操作',x:'<code>del *.*</code> 会删光当前目录（DOS 会问一次确认）；<code>format C:</code> 直接清空 C 盘且几乎不可恢复。在 DOS 里这些没有「回收站」兜底，动手前务必看清当前目录（看提示符 <code>C:\\XXX></code>）。'}
    ]},
    {id:'dos-3-3',num:'3.3',title:'批处理 .bat',lead:'把一串命令写成文件，一键执行。',tags:['脚本'],blocks:[
      {t:'p',x:'<b>批处理文件（.bat）</b>是 DOS 的「脚本」：把若干命令按顺序写进文本文件，敲文件名即可依次执行。它是没有窗口时代里最重要的自动化手段。'},
      {t:'code',lang:'Batch · auto.bat',x:'@echo off\n echo 欢迎使用备份脚本\necho 正在复制文档...\n copy C:\\DOC\\*.txt A:\\BACKUP\\ /y\n if errorlevel 1 goto FAIL\n echo 备份完成\ngoto END\n:FAIL\necho 备份失败，请检查软盘\n:END'},
      {t:'ul',items:[
        '<code>@echo off</code>：关掉「回显」，屏幕不再逐行打印命令本身',
        '<code>:</code> 标签 + <code>goto</code>：实现跳转（DOS 没有 while/for 之外的结构化循环，常用 goto 拼）',
        '<code>if errorlevel n</code>：判断上条命令的返回码是否 ≥ n',
        '<code>%1 %2 ...</code>：接收命令行参数'
      ]},
      {t:'note',k:'errorlevel 的判断方向',x:'<code>if errorlevel 1</code> 在 DOS 里表示「返回码 ≥ 1」，<b>不是等于 1</b>。所以要先判断大数再判断小数（先 <code>errorlevel 2</code> 再 <code>errorlevel 1</code>），否则会被前面的条件吞掉。'}
    ]}
  ]},

  /* ================= 第 4 章 ================= */
  {id:'dos-4',num:'4',title:'启动配置',lead:'开机两步走：CONFIG.SYS 先配置系统，AUTOEXEC.BAT 再设环境。',sections:[
    {id:'dos-4-1',num:'4.1',title:'CONFIG.SYS 与设备驱动',lead:'加载 HIMEM、EMM386，声明可同时打开的文件数。',tags:['启动'],blocks:[
      {t:'p',x:'<b>CONFIG.SYS</b> 在 DOS 启动时最早被读取，用来<b>配置系统本身</b>：加载设备驱动、设置缓冲区、声明可打开文件数等。它先于 AUTOEXEC.BAT 执行。'},
      {t:'code',lang:'CFG · CONFIG.SYS',x:'DEVICE=C:\\DOS\\HIMEM.SYS\nDEVICE=C:\\DOS\\EMM386.EXE NOEMS\nDOS=HIGH,UMB\nFILES=40\nBUFFERS=20\nLASTDRIVE=Z\nSHELL=C:\\DOS\\COMMAND.COM C:\\DOS /P'},
      {t:'table',head:['语句','作用'],rows:[
        ['<code>DEVICE=</code>','加载设备驱动（.sys）'],
        ['<code>HIMEM.SYS</code>','管理 1MB 以上的扩展内存 XMS'],
        ['<code>EMM386.EXE</code>','把 XMS 模拟成 UMB 上位内存，腾出常规内存'],
        ['<code>FILES=</code>','可同时打开的文件数上限'],
        ['<code>BUFFERS=</code>','磁盘缓存块数']
      ]},
      {t:'note',kind:'tip',k:'DOS=HIGH 把内核搬上空',x:'<code>DOS=HIGH,UMB</code> 让 DOS 内核和设备驱动尽量装进上位内存（UMB），给应用程序让出宝贵的常规内存 640K。这是「内存优化」的核心一招。'}
    ]},
    {id:'dos-4-2',num:'4.2',title:'AUTOEXEC.BAT',lead:'设置路径、环境变量、启动常用驻留程序。',tags:['启动'],blocks:[
      {t:'p',x:'<b>AUTOEXEC.BAT</b> 在 CONFIG.SYS 之后执行，负责<b>设置运行环境</b>：PATH 路径、PROMPT 提示符、环境变量、加载常驻内存程序（TSR，如鼠标驱动、杀毒）。'},
      {t:'code',lang:'Batch · AUTOEXEC.BAT',x:'@echo off\nPATH C:\\DOS;C:\\TOOLS;C:\\GAMES\nSET TEMP=C:\\TEMP\nPROMPT $P$G\nsmartdrv\nmouse\ncls\necho DOS 启动完成'},
      {t:'ul',items:[
        '<code>PATH</code>：命令搜索路径，让你在任意目录直接敲程序名',
        '<code>SET</code>：设置环境变量（<code>%TEMP%</code> 之类），用 <code>%变量%</code> 引用',
        '<code>PROMPT $P$G</code>：把提示符设为「当前路径 + &gt;」',
        '<code>smartdrv</code>/<code>mouse</code>：磁盘缓存、鼠标驱动（常驻内存）'
      ]},
      {t:'note',kind:'warn',k:'改之前先备份',x:'CONFIG.SYS / AUTOEXEC.BAT 改错会导致<b>启动失败或内存冲突</b>。任何修改前先把原文件复制成 <code>CONFIG.OLD</code>，出问题用启动盘进 DOS 改回。'}
    ]},
    {id:'dos-4-3',num:'4.3',title:'内存优化：UMB / XMS / EMS',lead:'把常规内存留给程序，把杂项塞进上位与扩展内存。',tags:['内存'],blocks:[
      {t:'p',x:'DOS 程序的「内存焦虑」催生了一整套优化术语。目标只有一个：<b>给 640K 常规内存腾地方</b>，把驱动、常驻程序搬去别处。'},
      {t:'table',head:['内存类型','位置','怎么用'],rows:[
        ['常规内存','0–640K','程序主战场，最稀缺'],
        ['上位内存 UMB','640K–1M 的空隙','靠 EMM386 开辟，装驱动'],
        ['扩展内存 XMS','1MB 以上','HIMEM.SYS 管理，供大程序'],
        ['扩充内存 EMS','页帧方式访问','早期游戏的「扩展卡」式内存']
      ]},
      {t:'p',x:'经典优化姿势：<code>HIMEM.SYS</code> 接管 XMS → <code>EMM386.EXE</code> 把 XMS 切一块当 UMB → <code>DEVICEHIGH / LOADHIGH</code> 把驱动和 TSR 装进 UMB。最终 DOS 报告「常规内存剩余」越大，老游戏越跑得动。'},
      {t:'note',k:'今天为什么不用懂这些',x:'现代操作系统（Windows/Linux）用保护模式与虚拟内存，早已没有 640K 限制和 XMS/EMS 之分。但 DOS 的这套内存分层，恰好解释了「为什么当年电脑这么折腾」——它是 PC 体系演进的活化石。'}
    ]}
  ]},

  /* ================= 第 5 章 ================= */
  {id:'dos-5',num:'5',title:'BIOS 与 DOS 中断',lead:'INT 10h / 21h / 13h 三件套，是 DOS 程序能做的全部「超能力」。',sections:[
    {id:'dos-5-1',num:'5.1',title:'INT 10h：视频服务',lead:'清屏、写字、改显示模式，全靠它。',tags:['BIOS'],blocks:[
      {t:'p',x:'<code>INT 10h</code> 是 BIOS 提供的<b>视频服务</b>。把功能号放进 <code>ah</code> 再 <code>int 10h</code>，就能操作屏幕。最常见的功能：<code>ah=0</code> 设显示模式、<code>ah=0Eh</code> 写一个字符（TTY）、<code>ah=06h</code> 上滚窗口（清屏）。'},
      {t:'code',lang:'asm',x:int10_example()},
      {t:'table',head:['ah','INT 10h 功能'],rows:[
        ['00h','设置显示模式（文本/图形、分辨率）'],
        ['06h','窗口上滚（可用于清屏）'],
        ['0Eh','在当前光标处写一个字符'],
        ['02h','设置光标位置']
      ]},
      {t:'note',kind:'tip',k:'字符模式 vs 图形模式',x:'DOS 默认是 80×25 的<b>文本模式</b>，每个格子由「字符码 + 属性（前景/背景色）」组成。想要像素级画图得切到图形模式（如 13h 的 320×200 256 色），但那要自己操作显存，复杂得多。'}
    ]},
    {id:'dos-5-2',num:'5.2',title:'INT 21h：DOS 功能分发器',lead:'打开文件、读写、退出、打印——万能服务台。',tags:['DOS'],blocks:[
      {t:'p',x:'<code>INT 21h</code> 是 DOS 的<b>总功能入口</b>。把具体功能号放进 <code>ah</code>，再填好参数寄存器，<code>int 21h</code> 即可。它是 DOS 程序与系统对话的主通道。'},
      {t:'table',head:['ah','功能','常用参数'],rows:[
        ['09h','显示以 $ 结尾的字符串','ds:dx 指向字符串'],
        ['02h','显示一个字符','dl = 字符'],
        ['3Ch','创建文件','dx=路径，cx=属性'],
        ['3Dh','打开文件','dx=路径，返回句柄 ax'],
        ['3Fh','读文件','bx=句柄，cx=字节数，dx=缓冲'],
        ['40h','写文件','同上'],
        ['4Ch','结束程序（退出）','al=返回码']
      ]},
      {t:'code',lang:'asm',x:int21_example()},
      {t:'note',k:'字符串为何以 $ 结尾',x:'INT 21h 的 09h 功能用 <code>$</code> 作为字符串结束符（和 C 的 <code>\\0</code> 不同）。所以 DOS 字符串常量常以 <code>db "Hello$"（注意有 $）</code> 结尾，否则会打印到内存里下一个 $ 才停。'}
    ]},
    {id:'dos-5-3',num:'5.3',title:'INT 13h：磁盘服务',lead:'直接读写扇区，引导程序靠它。',tags:['BIOS'],blocks:[
      {t:'p',x:'<code>INT 13h</code> 是 BIOS 的<b>磁盘服务</b>，工作在比文件系统更底层——直接按「磁头/柱面/扇区（CHS）」读写扇区。引导扇区（boot sector）加载、低级格式化、磁盘诊断都靠它。'},
      {t:'table',head:['ah','INT 13h 功能'],rows:[
        ['00h','复位磁盘控制器'],
        ['02h','读扇区到内存','chs + 扇区数 + 缓冲地址'],
        ['03h','写扇区','同上'],
        ['04h','检验扇区'],
        ['08h','读取驱动器参数']
      ]},
      {t:'p',x:'正因为 INT 13h 绕过文件系统，引导程序能「直接把第一个扇区读进内存并跳过去执行」——这正是操作系统启动的第一步。现代引导器（如 GRUB 早期阶段）仍沿用这条思路。'},
      {t:'note',kind:'danger',k:'INT 13h 很危险',x:'直接写扇区会破坏文件系统结构，误操作可能导致整盘不可读。学习时务必在<b>模拟器（DOSBox）或单独软盘镜像</b>里练，绝不在真实硬盘上随便 int 13h 写扇区。'}
    ]}
  ]},

  /* ================= 第 6 章 ================= */
  {id:'dos-6',num:'6',title:'用汇编写 DOS 程序',lead:'一个 .COM 文件，几百字节就能在裸机 DOS 上跑起来。',sections:[
    {id:'dos-6-1',num:'6.1',title:'COM 与 EXE 文件格式',lead:'COM 最简单：整段就是一段 64K 代码数据，起点在 100h。',tags:['格式'],blocks:[
      {t:'p',x:'DOS 程序主要有两种格式。<b>COM</b> 极简：文件就是一段机器码，加载到段内偏移 <code>100h</code> 处，所有段（CS=DS=ES=SS）指向同一段，大小上限约 64K；<b>EXE</b> 复杂：带重定位信息，可有多个段、更大、分不同段加载。'},
      {t:'table',head:['维度','COM','EXE'],rows:[
        ['大小上限','约 64K','理论很大'],
        ['段','单一（全同）','多段、可重定位'],
        ['起点','固定 100h','由头决定'],
        ['结构','裸代码','含 MZ 头与重定位表']
      ]},
      {t:'p',x:'学习用 <b>COM</b> 最合适：不需要链接器重定位，写一段、用 DEBUG 或汇编写一个就行。记得第一条指令前留出 100h 的 PSP（程序段前缀）空间——它存放命令行参数、内存大小等。'},
      {t:'note',k:'100h 的来历',x:'DOS 在每个 COM 程序前放一个 256 字节（100h）的 <b>PSP（Program Segment Prefix）</b>，所以你的代码从偏移 100h 开始。早期病毒、内存技巧常在这 256 字节里做文章。'}
    ]},
    {id:'dos-6-2',num:'6.2',title:'显示字符串',lead:'用 INT 21h 09h，把以 $ 结尾的字符串打到屏幕。',tags:['实战'],blocks:[
      {t:'code',lang:'asm',x:dos_hello_asm()},
      {t:'p',x:'要点：<code>org 100h</code> 告诉汇编器代码从 100h 起（COM 约定）；<code>mov dx, msg</code> 把字符串偏移装入 dx；<code>mov ah, 09h</code> + <code>int 21h</code> 打印；最后 <code>mov ah, 4Ch / int 21h</code> 以 0 退出。'},
      {t:'code',lang:'Batch · 构建',x:dos_build_cmds()},
      {t:'note',kind:'tip',k:'在 DOSBox 里跑',x:'没有真 DOS 也不怕：用 <b>DOSBox</b> 模拟器，把汇编器（如 NASM 配 DOS 版）和生成的 COM 放进挂载目录，<code>mount c c:\\dos</code> 后就能执行，效果与当年一致。'}
    ]},
    {id:'dos-6-3',num:'6.3',title:'读键盘与退出',lead:'INT 21h 01h 等一个键，再干净退出。',tags:['实战'],blocks:[
      {t:'code',lang:'asm',x:dos_input_asm()},
      {t:'table',head:['ah','INT 21h 键盘功能'],rows:[
        ['01h','等一个键并回显','al = 字符'],
        ['07h','等一个键不回显','al = 字符'],
        ['08h','等一个键不回显（屏蔽 Ctrl+C）','al = 字符'],
        ['0Ah','读一行到缓冲区','ds:dx 指向缓冲']
      ]},
      {t:'p',x:'结合 5.2 的写字符串与这里的读键盘，就能写出最简单的「交互程序」：打印菜单 → 等按键 → 根据按键分支。这正是老式 TUI（文本界面）程序的雏形。'},
      {t:'note',k:'Ctrl+C 会打断',x:'DOS 默认 <code>01h</code> 等键时按 <code>Ctrl+C</code> 会触发中断 23h 终止程序。想屏蔽它用 <code>08h</code>。写小游戏时这点很关键。'}
    ]}
  ]},

  /* ================= 第 7 章 ================= */
  {id:'dos-7',num:'7',title:'调试与工具',lead:'DEBUG 是 DOS 时代的「瑞士军刀」：反汇编、看内存、改字节、单步。',sections:[
    {id:'dos-7-1',num:'7.1',title:'DEBUG 命令速查',lead:'-a 汇编、-u 反汇编、-d 看内存、-t 单步、-g 运行、-r 看寄存器。',tags:['工具'],blocks:[
      {t:'p',x:'<b>DEBUG</b> 是 DOS 自带的调试器，提示符是 <code>-</code>。它既能当汇编器（<code>-a</code> 直接写汇编并转机器码），又能当反汇编/内存查看器，是学习实模式汇编的绝佳沙盒。'},
      {t:'table',head:['命令','作用'],rows:[
        ['<code>-a</code>','汇编：输入汇编指令，转成机器码'],
        ['<code>-u</code>','反汇编：把机器码显示成汇编'],
        ['<code>-d</code>','以十六进制+ASCII 查看内存'],
        ['<code>-e</code>','修改内存字节'],
        ['<code>-r</code>','查看/修改寄存器'],
        ['<code>-t</code>','单步执行一条指令'],
        ['<code>-g</code>','运行到指定地址/断点'],
        ['<code>-q</code>','退出 DEBUG']
      ]},
      {t:'code',lang:'DEBUG',x:'-r\nAX=0000 BX=0000 CX=0000 ...\n-u 0100 010F\n0100 B409        MOV AH,09\n0102 BA0A01      MOV DX,010A\n...'},
      {t:'note',k:'DEBUG 是 16 位实模式',x:'经典 DEBUG 只认 16 位实模式，地址用段:偏移表示（如 <code>0B3C:0100</code>）。调试 COM 程序时，常把段设为 CS 当前值再看 100h 起。'}
    ]},
    {id:'dos-7-2',num:'7.2',title:'用 DEBUG 反汇编与单步',lead:'看清每条指令执行后寄存器怎么变。',tags:['调试'],blocks:[
      {t:'p',x:'调试一段程序的标准流程：<code>-u</code> 反汇编确认地址；<code>-r</code> 看初始寄存器；<code>-t</code> 单步，每步后 <code>-r</code> 复查 AX/BX/FLAGS；<code>-d</code> 看数据段有没有写对。'},
      {t:'code',lang:'DEBUG',x:'; 单步执行并观察\n-t\nAX=0900 BX=0000 ...  IP=0102  NV UP EI PL NZ NA PO NC\n-t\nAX=0900 BX=0000 DX=010A ... ; 现在 DX 已指向字符串\n; 卡住时 -d ds:100 看数据段内容'},
      {t:'p',x:'<b>FLAGS 寄存器</b>每行末那串 <code>NV UP EI PL NZ NA PO NC</code> 就是标志位状态（NV=无溢出、ZF 取决于 NZ/ ZR 等）。判断跳转会不会发生时，盯这一串最准。'},
      {t:'note',kind:'warn',k:'DEBUG 改内存要小心',x:'<code>-e</code> 直接改字节，写错可能让程序跑飞。改前先用 <code>-d</code> 看清原值，改完 <code>-u</code> 反汇编确认。'}
    ]},
    {id:'dos-7-3',num:'7.3',title:'内存查看与修补',lead:'-d 看十六进制与 ASCII，-e 直接写字节打补丁。',tags:['调试'],blocks:[
      {t:'p',x:'<code>-d 段:偏移</code> 会以「地址 十六进制字节… ASCII」的形式列出内存。程序里的字符串、数据表，都能在这里一眼看到。'},
      {t:'code',lang:'DEBUG',x:'-d ds:100\n0B3C:0100  48 65 6C 6C 6F 24 00 00-00 00 00 00 00 00 00 00   Hello$......\n; 把 Hello 改成 Hi：用 -e 改写前两个字节\n-e ds:100 48 69\n-d ds:100\n0B3C:0100  48 69 6C 6C 6F 24 ...   Hi llo$...'},
      {t:'p',x:'这种「直接改字节打补丁」在早期很常见：改个跳转条件、改个提示字符串，不必重新编译。它也是理解「数据在内存里就是一串字节」的最直观方式。'},
      {t:'note',k:'十六进制转 ASCII 要熟练',x:'<code>48h=\'H\'、65h=\'e\'、6Ch=\'l\'、6Fh=\'o\'、24h=\'$\'</code>。会心算这几个，看 <code>-d</code> 输出的 ASCII 列就像读明文。'}
    ]}
  ]},

  /* ================= 第 8 章 ================= */
  {id:'dos-8',num:'8',title:'DOS 的遗产与今天',lead:'它没消失——只是换成了模拟器、FreeDOS 和引导扇区里的影子。',sections:[
    {id:'dos-8-1',num:'8.1',title:'DOSBox 与 FreeDOS',lead:'一个让你今天还能跑 DOS 程序，一个让你今天还能装 DOS。',tags:['延续'],blocks:[
      {t:'p',x:'<b>DOSBox</b> 是开源的 x86 实模式模拟器，专门为了在今天的 Windows/Linux/macOS 上跑 DOS 游戏和软件。它模拟了 CPU、声卡、显卡，让你重温 <code>C:\\></code> 的黑屏。'},
      {t:'code',lang:'Batch · dosbox.conf',x:dosbox_mount()},
      {t:'p',x:'<b>FreeDOS</b> 是一个开源、自由、与 MS-DOS 高度兼容的操作系统，可以真机或虚拟机安装，用来跑老软件、做嵌入式、或作为学习实模式汇编的平台。'},
      {t:'table',head:['工具','用途'],rows:[
        ['DOSBox','模拟器，主打游戏/老软件兼容'],
        ['FreeDOS','可安装的 DOS，兼容 MS-DOS 命令'],
        ['PCem / 86Box','更硬核，模拟具体型号的老主板']
      ]},
      {t:'note',kind:'tip',k:'学汇编首选 FreeDOS + NASM',x:'想「真机感」地学 DOS 汇编，装个 FreeDOS 虚拟机，里面跑 NASM（有 DOS 版）和 DEBUG 等价物（如 <code>fddebug</code>），比在模拟器里折腾更顺手。'}
    ]},
    {id:'dos-8-2',num:'8.2',title:'引导扇区与实模式',lead:'开机第一件事：BIOS 把 512 字节引导扇区读进 7C00h 并跳过去。',tags:['引导'],blocks:[
      {t:'p',x:'DOS 的启动链条解释了现代 PC 的来历：加电 → BIOS 自检 → 读磁盘<b>第一个扇区（512 字节引导扇区）</b>到内存 <code>0x7C00</code> → 跳过去执行。这个扇区就是最初的「引导程序（bootloader）」。'},
      {t:'code',lang:'asm',x:boot_sector_asm()},
      {t:'p',x:'引导扇区必须以 <code>0x55 0xAA</code> 这两个字节结尾（所谓「引导签名」），BIOS 才认它。这 512 字节里要完成「读更多扇区 → 进入保护模式 → 加载内核」的接力第一棒。'},
      {t:'note',kind:'danger',k:'写引导扇区务必用镜像',x:'直接在真实硬盘 MBR 上练手极易把机器搞到开不了机。请在虚拟机或软盘/硬盘镜像文件里操作，并先用 <code>-d</code>/模拟器验证，再考虑写真盘。'}
    ]},
    {id:'dos-8-3',num:'8.3',title:'为什么还要懂 DOS',lead:'不是怀旧，而是理解「现代系统从哪来」。',tags:['意义'],blocks:[
      {t:'ul',items:[
        '<b>理解 PC 体系</b>：实模式、段:偏移、中断、640K，是现代 x86 兼容层仍保留的「祖制」。',
        '<b>读懂启动流程</b>：引导扇区、INT 13h、保护模式切换，是任何操作系统（含 Linux/Windows）开机故事的起点。',
        '<b>复古与嵌入式</b>：老工控、医疗设备、复古游戏、BIOS 工具链，至今离不开 DOS 技能。',
        '<b>底层编程直觉</b>：亲手写 COM、用 DEBUG 单步，能建立「指令→寄存器→内存」的硬直觉，比看十遍概念都管用。'
      ]},
      {t:'quote',x:'DOS 是计算机史里最「看得穿」的一段：没有抽象层、没有黑盒，每条指令的效果你都能亲手验证。它值得被理解，而不只是被怀念。'},
      {t:'note',kind:'tip',k:'和本卷其它课程打通',x:'学完 DOS 再看 <b>Windows</b>：会明白「CMD 的命令为什么带 /」、<b>实模式到保护模式的跨越</b>；再看 <b>Linux</b>：会明白「bootloader → 内核」的接力，正是 DOS 引导故事的升级版。'}
    ]}
  ]}
  ]
};

/* ---------- DOS 课程内可复用代码片段（集中管理，避免重复与转义错误） ---------- */
function seg_offset_example(){
  return '; 段:偏移 → 物理地址 = 段 × 16 + 偏移\n; 例：段 0x1234，偏移 0x5678\n;   物理地址 = 0x1234 * 0x10 + 0x5678 = 0x179B8\n\nmov ax, 0x1234\nmov ds, ax          ; 把段基址 0x1234 装入数据段寄存器\nmov bx, 0x5678\nmov al, [bx]        ; 读 ds:bx（即 0x179B8）处 1 字节';
}
function int10_example(){
  return '; 用 INT 10h 清屏（窗口上滚到顶部）\nmov ah, 06h        ; 功能 06h：窗口上滚\nmov al, 0          ; 0 = 整屏滚动\nmov bh, 07h        ; 滚动后填充的属性（黑底白字）\nmov cx, 0          ; 左上角 (0,0)\nmov dx, 0x184F     ; 右下角 (24,79)，25 行 80 列\nint 10h\n\n; 在屏幕写个字符（TTY 模式）\nmov ah, 0Eh\nmov al, "A"\nint 10h';
}
function int21_example(){
  return '; 显示以 $ 结尾的字符串（功能 09h）\nmov ah, 09h\nmov dx, OFFSET msg   ; ds:dx 指向字符串\nint 21h\n\n; 退出程序（功能 4Ch）\nmov ah, 4Ch\nmov al, 0            ; 返回码 0\nint 21h\n\nmsg db "Hello, DOS$"  ; 注意结尾的 $';
}
function dos_hello_asm(){
  return '; hello.com —— 纯 DOS 汇编（COM 格式，起点 100h）\norg 100h\n\n    mov dx, msg        ; ds:dx 指向字符串（COM 里 ds=cs）\n    mov ah, 09h        ; 功能 09h：显示 $ 结尾字符串\n    int 21h\n\n    mov ah, 4Ch        ; 功能 4Ch：结束程序\n    mov al, 0          ; 返回码 0\n    int 21h\n\nmsg db "Hello, DOS$"  ; 必须以 $ 结尾';
}
function dos_build_cmds(){
  return '; 用 NASM（DOS 版）汇编成 COM，再用 DOSBox 运行\nnasm -f bin hello.asm -o hello.com\n\n; DOSBox 中：\nmount c c:\\dos\nc:\ndebug hello.com    ; 或直接在提示符下 hello';
}
function dos_input_asm(){
  return '; 等一个键再退出\n    mov ah, 01h        ; 功能 01h：等一个键并回显\n    int 21h            ; 输入字符在 al\n\n    mov ah, 4Ch\n    mov al, 0\n    int 21h';
}
function dosbox_mount(){
  return '[autoexec]\nmount c c:\\dos\ nc z:\\\n c:\n echo DOSBox 已就绪';
}
function boot_sector_asm(){
  return '; 引导扇区骨架（512 字节，结尾必须是 55 AA）\n    org 0x7C00        ; BIOS 把扇区加载到 0x7C00\n    ; ... 此处放「读磁盘其余部分、切换保护模式」的代码 ...\n    times 510-($-$$) db 0   ; 用 0 填充到 510 字节\n    db 0x55, 0xAA           ; 引导签名';
}
