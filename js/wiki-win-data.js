/* ==========================================================
   方程的工艺百科全书 · 操作系统篇
   课程：Windows 操作系统知识
   说明：面向工程实践的系统教程——讲清 Windows 的架构、文件系统、
        注册表、进程服务、命令行、安全、网络与排错。
        内容为通用工程常识归纳，不绑定单一版本号。
   ========================================================== */
window.WIKI_WIN = {
  id:'win', num:'乙', en:'COURSE II · WINDOWS',
  title:'Windows 操作系统知识',
  lead:'一类以 NT 内核为底座的闭源商业操作系统：图形交互成熟、硬件与软件生态最完整、企业桌面事实标准。本篇从「它在干什么」讲到「怎么管、怎么排错」，把名词（注册表、服务、UAC、BitLocker、RDP）逐一拆开，使其成为可被查阅与复用的知识，而不是零散的点击记忆。',
  chips:['NT 内核家族','NTFS / ReFS','注册表','CMD + PowerShell','UAC / BitLocker'],
  chapters:[

  /* ================= 第 1 章 ================= */
  {id:'win-1',num:'1',title:'认识 Windows',lead:'先分清它是什么、版本怎么分、为什么还在学。',sections:[
    {id:'win-1-1',num:'1.1',title:'一句话定位与历史谱系',lead:'从 MS-DOS 到 NT，再到今天的 Windows 11 / Server。',tags:['绪论'],blocks:[
      {t:'p',x:'<b>Windows 是微软（Microsoft）开发的图形化操作系统家族</b>。今天大家用的桌面版与服务器版，底层都来自 1993 年问世的 <b>Windows NT</b> 内核——它和早年的 MS-DOS 几乎没有直接继承关系，是一次从零设计的现代内核。'},
      {t:'p',x:'可以把历史分成两条线：<b>消费线</b>（Windows 95/98/XP/7/10/11）与 <b>NT 线</b>（NT 3.1 → 2000 → XP → Vista/7 → 8/10/11）。从 XP 起，消费线也并入了 NT 内核；所以现在无论家用还是服务器，跑的都是 NT 内核的不同「皮肤」。'},
      {t:'table',head:['年份','版本','意义'],rows:[
        ['1993','Windows NT 3.1','首个 NT 内核，抢占式多任务、32 位'],
        ['2001','Windows XP','消费线首次全面基于 NT，普及度里程碑'],
        ['2009','Windows 7','被长期视为最稳定的桌面版本'],
        ['2015','Windows 10','服务化（半年频道）、统一桌面/移动'],
        ['2021','Windows 11','新的界面与硬件门槛（TPM 2.0）'],
        ['持续','Windows Server','服务器线，角色化（AD/DNS/IIS…）']
      ]},
      {t:'note',kind:'tip',k:'一个常被搞混的点',x:'<b>「Windows」≠「DOS」</b>。CMD 里的 <code>dir</code>、<code>copy</code> 等命令是 DOS 时代的习惯沿用，但底层早已不是 DOS。理解这一点，就不会把命令行当成「怀旧功能」而忽略它。'},
      {t:'faq',q:'为什么 Windows 版本号不是整数？',a:'NT 内核有自己的内部版本号（如 Windows 10/11 内核为 <code>NT 10.0</code>）。对外营销名（10/11）与内核版本号<b>是两套体系</b>，用 <code>winver</code> 或 <code>ver</code> 看到的是内核版本。'}
    ]},
    {id:'win-1-2',num:'1.2',title:'版本谱系：家庭版 / 专业版 / 企业版 / 服务器',lead:'同一内核，不同功能裁剪与授权。',tags:['版本'],blocks:[
      {t:'p',x:'桌面 Windows 按<b>功能与授权</b>分成多个版本（Edition）。它们共享同一 NT 内核，差异主要在「哪些能力被解锁」：'},
      {t:'cards',items:[
        ['家庭版 Home','面向个人，缺少组策略、BitLocker、远程桌面主机等高级能力'],
        ['专业版 Pro','加入 BitLocker、Hyper-V、组策略、远程桌面主机，开发者/企业常用'],
        ['企业版 Enterprise','批量授权 + 长期服务通道（LTSC），IT 集中管理'],
        ['教育版/SE','面向学校或精简场景，能力与 Pro 接近']
      ]},
      {t:'p',x:'服务器线叫 <b>Windows Server</b>，按「角色（Role）」组织：Active Directory 域控、DNS/DHCP、IIS 网站、文件服务器等。它和桌面版共用内核，但默认无桌面或带服务器桌面体验，调度与授权逻辑不同。'},
      {t:'note',k:'怎么看自己是什么版本',x:'按 <code>Win + R</code> 输入 <code>winver</code> 回车，弹窗会写明版本（如「Windows 11 专业版 24H2」）与内部版本号。这是排查兼容性问题时最先要确认的信息。'},
      {t:'faq',q:'LTSC 是什么，和普通版有什么区别？',a:'<b>LTSC（Long-Term Servicing Channel）</b>是面向工控、医疗、收银等「不希望频繁更新」场景的通道：功能多年不变、只打安全补丁。普通版每半年推一次功能更新，LTSC 则更稳更慢。'}
    ]},
    {id:'win-1-3',num:'1.3',title:'为什么今天还要系统学 Windows',lead:'生态、游戏、企业三件事，短期无法替代。',tags:['定位'],blocks:[
      {t:'p',x:'尽管 Linux 在服务器与开发领域强势，Windows 在三个场景仍是事实标准：<b>办公与行业软件生态</b>（财务、CAD、专用客户端）、<b>游戏</b>（DirectX 与驱动支持最完整）、<b>企业桌面管理</b>（域、组策略、统一镜像）。'},
      {t:'ul',items:[
        '<b>硬件兼容最广</b>：打印机、扫描仪、手写板等外设的驱动大多以 Windows 为先。',
        '<b>交互范式最成熟</b>：开始菜单、任务栏、文件管理器是数亿人肌肉记忆，培训成本极低。',
        '<b>企业基础设施围绕它构建</b>：Active Directory、Exchange、域控、组策略几乎是企业 IT 的默认词汇。'
      ]},
      {t:'quote',x:'学 Windows 不是「怀旧」，而是理解一个占据全球桌面九成以上份额的系统——它如何组织资源、如何授权、如何排错，本身是一门工程。'},
      {t:'note',kind:'warn',k:'闭源带来的代价',x:'Windows 的内核与多数组件<b>不开源</b>，排错时你通常拿不到源码，只能依赖文档、事件日志与社区经验。这也是本篇反复强调「日志先行、备份先行」的原因。'}
    ]}
  ]},

  /* ================= 第 2 章 ================= */
  {id:'win-2',num:'2',title:'系统架构',lead:'NT 内核怎么把硬件、驱动与应用分开。',sections:[
    {id:'win-2-1',num:'2.1',title:'NT 内核概览',lead:'内核、执行体、HAL 三层，外加子系统。',tags:['内核'],blocks:[
      {t:'p',x:'<b>NT 内核</b>是一个<b>混合内核（hybrid kernel）</b>：既有微内核「模块化、驱动在独立进程」的思路，又为了性能把很多服务放进内核态。它由下到上大致分三层：'},
      {t:'table',head:['层','职责'],rows:[
        ['硬件抽象层 HAL','屏蔽不同主板的差异，让内核以上代码不必关心具体硬件'],
        ['内核（Kernel）','线程调度、中断、异常、多处理器同步等最底层机制'],
        ['执行体（Executive）','内存管理、对象管理、I/O 管理、进程/线程、安全引用监视器'],
        ['子系统','把内核能力包装成「Win32 环境」，应用只跟子系统打交道']
      ]},
      {t:'p',x:'应用并不会直接调用内核，而是经过 <b>Win32 子系统</b>（<code>csrss.exe</code> 与内核模式侧的 <code>win32k.sys</code>）。POSIX、OS/2 等早期子系统已被淘汰，今天主要是 Win32，外加 <b>WSL（Windows 上的 Linux 子系统）</b>。'},
      {t:'note',kind:'tip',k:'为什么叫「执行体」',x:'NT 设计文档里把内核之上那一大块服务叫 <b>Executive</b>（执行体），它管理着「对象」——进程、线程、文件、注册表键、事件等都是对象，统一走对象管理器与安全引用监视器。理解「一切皆对象」有助于看懂权限模型。'}
    ]},
    {id:'win-2-2',num:'2.2',title:'用户态与内核态',lead:'特权级（Ring 0 / Ring 3）决定谁能碰硬件。',tags:['特权'],blocks:[
      {t:'p',x:'x86/x64 CPU 有特权级别，NT 主要用两级：<b>内核态（Ring 0）</b>运行内核、驱动，可直访硬件；<b>用户态（Ring 3）</b>运行普通应用，不能直接碰硬件或内核内存。'},
      {t:'steps',items:[
        ['应用发起请求','比如「读这个文件」','调用 Win32 API（如 ReadFile）'],
        ['陷入内核','通过 SYSCALL 指令','CPU 切到 Ring 0，进入执行体'],
        ['内核执行','I/O 管理器调度驱动','真正去读磁盘'],
        ['返回用户态','把结果拷回','应用拿到数据，全程不知道内核细节']
      ]},
      {t:'p',x:'这种隔离的意义是<b>稳定性与安全性</b>：一个用户态程序崩溃不会拖垮系统；而一个<b>有 Bug 的内核驱动崩溃会直接蓝屏（BSOD）</b>。所以「装驱动要谨慎」不是玄学，是架构使然。'},
      {t:'note',kind:'warn',k:'蓝屏的本质',x:'蓝屏（Bugcheck）是内核检测到「再继续执行会数据损坏或安全失控」时主动停下来。绝大多数蓝屏根因是<b>第三方驱动</b>而非 Windows 自身。排错时先回忆「最近装了什么驱动/软件」。'},
      {t:'faq',q:'为什么有些程序要「以管理员身份运行」？',a:'很多操作（写系统目录、改注册表、加载驱动、绑低端口）需要<b>管理员令牌</b>。普通用户态程序权限不够，必须由 UAC 提升到管理员后再运行——详见第 7 章。'}
    ]},
    {id:'win-2-3',num:'2.3',title:'HAL 与设备驱动',lead:'硬件抽象层让一份内核跑遍千种主板。',tags:['硬件'],blocks:[
      {t:'p',x:'<b>HAL（Hardware Abstraction Layer）</b>是内核与具体主板/芯片组之间的薄层：它把「多处理器怎么启动」「时钟怎么读」「中断怎么分发」等硬件细节封装起来，内核之上代码用统一接口调用。于是<b>同一份内核镜像可适配海量硬件</b>。'},
      {t:'p',x:'真正和硬件对话的是<b>驱动程序（Driver）</b>，多为内核态的 <code>.sys</code> 文件，由 I/O 管理器通过「驱动栈」调度。以键盘为例：应用 → 键盘类驱动 → 端口驱动 → 硬件。多层栈让功能可叠加（过滤驱动、加密驱动）。'},
      {t:'table',head:['驱动类型','运行位置','例子'],rows:[
        ['设备驱动','内核态','显卡、网卡、磁盘控制器'],
        ['文件系统驱动','内核态','NTFS、FAT、第三方加密盘'],
        ['过滤驱动','内核态','杀软实时扫描、加密钩子'],
        ['用户态驱动','用户态','某些打印机/扫描仪（USBD 等）']
      ]},
      {t:'note',k:'驱动签名',x:'64 位 Windows 默认要求内核驱动<b>经微软签名</b>（DSE，驱动签名强制）。未签名驱动无法加载——这是防止恶意 Rootkit 的一道关卡，但也意味着老硬件的「无签名驱动」在新系统上可能用不了。'}
    ]},
    {id:'win-2-4',num:'2.4',title:'子系统：Win32 与 WSL',lead:'让 Windows 既跑原生应用，也能跑 Linux。',tags:['子系统'],blocks:[
      {t:'p',x:'NT 从设计上就支持多个<b>环境子系统</b>。今天最常用的是 <b>Win32 子系统</b>（绝大多数桌面程序的运行环境）；另一个越来越重要的是 <b>WSL（Windows Subsystem for Linux）</b>。'},
      {t:'cards',items:[
        ['Win32','经典桌面环境，提供 GDI/USER、窗口、GDI 绘图、Win32 API'],
        ['WSL 1','把 Linux 系统调用翻译为 NT 调用，无需真实内核'],
        ['WSL 2','内嵌一个轻量 Hyper-V 虚拟机跑真实 Linux 内核，兼容性最好']
      ]},
      {t:'p',x:'WSL 2 实际是在后台跑一个<b>轻量虚拟机</b>（基于 Hyper-V），里面是真正的 Linux 内核，因此能跑 Docker、systemd 等。它和宿主机通过虚拟网卡互通，文件可互访（<code>\\\\wsl$\\</code> 与 <code>/mnt/c</code>）。'},
      {t:'note',kind:'tip',k:'JNL OS 用到的就是 WSL',x:'前面 JNL OS 的构建环境正是 <b>Windows 11 + WSL2（Ubuntu 24.04）</b>：Windows 侧发命令、WSL 内编译与跑 QEMU。这正是「Win32 宿主 + WSL Linux 子系统」协作的典型工程场景。'},
      {t:'faq',q:'WSL 2 和装个虚拟机有什么区别？',a:'WSL 2 底层确实用了 Hyper-V 虚拟化，但它<b>深度集成</b>：启动快、与 Windows 文件/网络无缝、无需手动装系统。相比完整 VirtualBox/VMware 虚拟机，它更轻、更偏「开发工具」而非「独立机器」。'}
    ]}
  ]},

  /* ================= 第 3 章 ================= */
  {id:'win-3',num:'3',title:'文件系统与磁盘',lead:'盘符、分区、卷的区别，以及 NTFS 真正强在哪。',sections:[
    {id:'win-3-1',num:'3.1',title:'磁盘、分区、卷与盘符',lead:'四个常被混用的概念，先理清。',tags:['磁盘'],blocks:[
      {t:'p',x:'在 Windows 磁盘管理里，常把四样东西说混，但它们的含义不同：'},
      {t:'ul',items:[
        '<b>磁盘（Disk）</b>：一块物理硬盘（如「磁盘 0」），用 MBR 或 GPT 分区表。',
        '<b>分区（Partition）</b>：磁盘上划出的一段连续空间，GPT 支持很多个，MBR 最多 4 个主分区。',
        '<b>卷（Volume）</b>：能「格式化并挂成盘符」的逻辑存储单元，可由一个分区或多个分区/动态磁盘组成。',
        '<b>盘符（如 C:）</b>：卷被挂载后分配的一个字母，是用户可见的入口。'
      ]},
      {t:'table',head:['概念','例子','能否直接存文件'],rows:[
        ['磁盘','磁盘 0','否，要先分区'],
        ['分区','GPT 分区 1','否，要先建成卷并格式化'],
        ['卷','C: 卷','能，格式化后即是文件系统'],
        ['盘符','C: / D:','是卷的「门牌号」']
      ]},
      {t:'note',kind:'tip',k:'为什么系统盘常是 C:',x:'早期 PC 用 A:/B: 留给软驱，第一个硬盘分区自然成了 <b>C:</b>。这个历史惯例一直沿用，所以「系统盘 = C 盘」是约定，不是技术规定。'},
      {t:'faq',q:'GPT 和 MBR 选哪个？',a:'新机器一律 <b>GPT + UEFI</b>：支持 2TB 以上磁盘、更多分区、更安全启动。MBR 是老式 BIOS 时代的遗留，容量与分区数都受限，仅用于兼容老机器。'}
    ]},
    {id:'win-3-2',num:'3.2',title:'NTFS：权限、压缩、加密、日志',lead:'为什么系统盘几乎都用它。',tags:['文件系统'],blocks:[
      {t:'p',x:'<b>NTFS（New Technology File System）</b>是 Windows 的主力文件系统，相比 FAT 系列多了几项关键能力：'},
      {t:'cards',items:[
        ['ACL 权限','每个文件/目录有访问控制列表，可精确到用户/组（比 FAT 的「只读」位强得多）'],
        ['日志（Journaling）','记录元数据操作，意外断电后能快速恢复一致性'],
        ['压缩 / 配额','文件夹级透明压缩、对用户设磁盘配额'],
        ['EFS 加密','基于用户证书的透明文件加密（注意：不是全盘加密）']
      ]},
      {t:'p',x:'NTFS 用<b>主文件表（MFT）</b>记录一切：每个文件/目录在 MFT 里占一条记录，属性（名字、时间、权限、数据流）都挂在记录上。其中有个特殊概念叫 <b>ADS（备用数据流）</b>——一个文件可藏多条「无名/有名数据流」，常被安全工具用来隐藏信息，也常被攻击者滥用。'},
      {t:'code',lang:'powershell',x:'# 查看 NTFS 权限\nGet-Acl C:\\Windows | Format-List\n\n# 创建并查看备用数据流（ADS）\n"secret" > C:\\temp\\note.txt:hidden\nGet-Item C:\\temp\\note.txt -Stream *'},
      {t:'note',kind:'warn',k:'EFS 与 BitLocker 不同',x:'EFS 是<b>文件级</b>加密，且与用户证书绑定——重装系统或丢了证书，文件就解不开。需要「整盘/整卷」保护请用 <b>BitLocker</b>（见 7.3）。两者解决不同问题。'},
      {t:'faq',q:'NTFS 和 exFAT 怎么选？',a:'<b>NTFS</b> 用于系统盘和内部硬盘（支持权限/日志）；<b>exFAT</b> 用于 U 盘/SD 卡等需要跨 Windows/macOS/相机 的设备（无日志但兼容广、支持大文件）。FAT32 因 4GB 单文件上限基本只用于老旧设备。'}
    ]},
    {id:'win-3-3',num:'3.3',title:'ReFS 与 FAT32 的取舍',lead:'不是所有盘都该用 NTFS。',tags:['对比'],blocks:[
      {t:'p',x:'除 NTFS 外，Windows 还支持/使用另外两类文件系统，各有取舍：'},
      {t:'table',head:['文件系统','适合','不适合','关键特性'],rows:[
        ['NTFS','系统盘、内部数据盘','移动设备跨平台','ACL、日志、EFS、配额'],
        ['ReFS','服务器存储池、大容量卷','系统盘、家庭日用','抗损坏、自动校验、不支持压缩/EFS'],
        ['FAT32','老设备、小 U 盘','大文件（>4GB）','兼容性极广，无权限'],
        ['exFAT','跨平台移动存储','系统盘','支持大文件，无日志']
      ]},
      {t:'p',x:'<b>ReFS（Resilient File System）</b>是微软面向「数据完整性」设计的现代文件系统：写时复制、自动校验和修复、与 Storage Spaces 配合可抵御静默数据损坏。但它<b>不能做系统盘</b>、不支持文件压缩与 EFS，主要用在服务器与高端存储。'},
      {t:'note',k:'「格式化选什么」的速查',x:'系统盘/数据盘 → <b>NTFS</b>；给相机/老设备的小卡 → <b>FAT32</b>；跨 macOS 的大 U 盘 → <b>exFAT</b>；服务器海量存储池 → <b>ReFS</b>。'},
      {t:'faq',q:'为什么 U 盘格式化默认常是 exFAT 或 FAT32？',a:'因为它们<b>跨平台兼容最好</b>（macOS、Linux、电视、相机都能读）。NTFS 在 macOS 上默认只读、在部分设备上不支持，所以移动存储一般不选 NTFS。'}
    ]},
    {id:'win-3-4',num:'3.4',title:'命令行管理磁盘',lead:'diskpart 与 PowerShell 存储 cmdlet。',tags:['实操'],blocks:[
      {t:'p',x:'图形「磁盘管理」能做的基本都能用命令行批量/远程完成。两个主力：老牌 <code>diskpart</code>（交互式）和 PowerShell 的存储 cmdlet（可脚本化）。'},
      {t:'code',lang:'cmd',x:':: 列出磁盘与卷\ndiskpart\nlist disk\nlist volume\nexit\n\n:: 把 U 盘格式化为 exFAT（假设卷为 E:）\nformat E: /FS:exFAT /Q /V:USB'},
      {t:'code',lang:'powershell',x:'# PowerShell 方式（推荐，可脚本化）\nGet-Disk | Select Number,FriendlyName,Size\nGet-Volume | Select DriveLetter,FileSystemType,SizeRemaining\n# 清理并初始化一块新磁盘为 GPT + NTFS\nInitialize-Disk -Number 1 -PartitionStyle GPT\nNew-Partition -DiskNumber 1 -UseMaximumSize -DriveLetter F\nFormat-Volume -DriveLetter F -FileSystem NTFS -NewFileSystemLabel "Data"'},
      {t:'note',kind:'danger',k:'diskpart 的 clean 很危险',x:'<code>diskpart</code> 里的 <code>clean</code> 会<b>擦掉整块磁盘的分区表</b>，数据瞬间不可见。远程/脚本执行前务必先用 <code>list disk</code> 核对编号，别把系统盘清了。'},
      {t:'ex',k:'动手练一练',items:[
        '打开「磁盘管理」（<code>diskmgmt.msc</code>），对照本文看清你的 C: 是哪个磁盘的第几个分区。',
        '用 <code>fsutil fsinfo drives</code> 列出本机所有盘符，再用 <code>fsutil fsinfo volumeinfo C:</code> 查看文件系统类型。',
        '思考：为什么「卷」和「分区」要分两个概念？动态磁盘的跨分区卷能给你答案。'
      ]}
    ]}
  ]},

  /* ================= 第 4 章 ================= */
  {id:'win-4',num:'4',title:'注册表',lead:'Windows 的「中央配置数据库」，比一堆 .ini 文件强在哪。',sections:[
    {id:'win-4-1',num:'4.1',title:'什么是注册表，五大根键',lead:'一个层级化的配置数据库。',tags:['基础'],blocks:[
      {t:'p',x:'<b>注册表（Registry）</b>是 Windows 的<b>集中式配置数据库</b>，取代早期散落的 <code>.ini</code> 文本配置。它用层级「键（Key）— 值（Value）」结构，应用、驱动、系统设置都往里写。'},
      {t:'table',head:['根键（Hive 挂载点）','内容'],rows:[
        ['<code>HKCR</code>','HKEY_CLASSES_ROOT：文件类型关联、COM 组件'],
        ['<code>HKCU</code>','HKEY_CURRENT_USER：当前用户的配置'],
        ['<code>HKLM</code>','HKEY_LOCAL_MACHINE：本机全局配置（硬件、软件、系统）'],
        ['<code>HKU</code>','HKEY_USERS：所有加载的用户配置'],
        ['<code>HKCC</code>','HKEY_CURRENT_CONFIG：当前硬件配置档案']
      ]},
      {t:'p',x:'日常最常动的是 <code>HKCU</code>（改自己）与 <code>HKLM</code>（改全机，需管理员）。<code>HKCR</code> 实际是 <code>HKLM\\Software\\Classes</code> 与 <code>HKCU\\...\\Classes</code> 的合并视图——这解释了为什么「双击打开方式」既受系统也受用户影响。'},
      {t:'note',kind:'tip',k:'注册表的「值类型」',x:'值不止字符串：<b>REG_SZ</b>（文本）、<b>REG_DWORD</b>（32 位整数，常见开关 0/1）、<b>REG_BINARY</b>（二进制）、<b>REG_EXPAND_SZ</b>（含环境变量的文本）、<b>REG_MULTI_SZ</b>（多行文本）。改错类型会让程序读不出。'},
      {t:'faq',q:'注册表和「设置」App 是什么关系？',a:'「设置 / 控制面板」只是<b>图形前端</b>，它背后改的就是注册表。有些选项在 GUI 里没有，就只能直接改注册表——但 GUI 的好处是帮你避开无效值。'}
    ]},
    {id:'win-4-2',num:'4.2',title:'配置单元与物理文件',lead:'注册表不是一块大文件，而是多个 hive。',tags:['存储'],blocks:[
      {t:'p',x:'注册表在磁盘上以<b>配置单元（Hive）</b>文件形式存在，每个 hive 对应一部分。系统关键 hive 在 <code>%SystemRoot%\\System32\\config\\</code> 下：<code>SYSTEM</code>、<code>SOFTWARE</code>、<code>SAM</code>、<code>SECURITY</code>、<code>DEFAULT</code>。'},
      {t:'ul',items:[
        '<code>HKLM\\SAM</code> 与 <code>SECURITY</code> 存账户与策略，普通用户无权限读。',
        '每个用户的 <code>HKCU</code> 来自 <code>C:\\Users\\<名>\\NTUSER.DAT</code>——<b>它是随用户加载/卸载的文件</b>。',
        '这就是为什么删掉用户目录里的 <code>NTUSER.DAT</code> 相关项，重登录后会「重置」该用户的部分设置。'
      ]},
      {t:'p',x:'理解 hive 文件很重要：<b>注册表会被锁定占用</b>（系统运行时），不能直接复制；备份要用「导出」或卷影副本（VSS）。这点在 4.3 的备份方法里会体现。'},
      {t:'note',kind:'warn',k:'为什么不能直接删 NTUSER.DAT',x:'该文件在用户登录期间被系统独占打开。强行删除/移动会导致该用户下次登录配置损坏，甚至无法登录。要重置用户设置，正确做法是新建/修复配置，而非删文件。'},
      {t:'faq',q:'注册表会无限膨胀吗？',a:'理论上会。卸载软件若没清干净，会在 <code>HKLM\\Software</code> 与 <code>HKCU\\Software</code> 留下「孤键」。长期累积会让注册表变大、开机变慢。所谓「注册表清理」工具大多只删这些孤键，<b>收益有限且有风险</b>。'}
    ]},
    {id:'win-4-3',num:'4.3',title:'用注册表实战与备份',lead:'改前必备份，几个安全又有用的例子。',tags:['实操'],blocks:[
      {t:'p',x:'改注册表的第一铁律：<b>先备份，再动手</b>。最稳妥的方式是导出要改的那一支为 <code>.reg</code> 文件，出错可双击还原。'},
      {t:'code',lang:'cmd',x:':: 导出整支 HKLM\\Software 作为备份\nreg export HKLM\\Software C:\\backup\\sw.reg\n\n:: 查看某键\nreg query "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer"'},
      {t:'table',head:['想实现','路径 / 值','说明'],rows:[
        ['关闭开机自启某程序','<code>HKCU\\...\\Run</code> 删对应值','比任务管理器更底层'],
        ['重置资源管理器设置','删 <code>HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer</code> 子项','重登录生效'],
        ['禁止自动更新重启','<code>HKLM\\...\\WindowsUpdate\\AU</code> 相关值','企业环境常用，需谨慎']
      ]},
      {t:'note',kind:'danger',k:'高危区域别乱动',x:'<code>HKLM\\SYSTEM</code> 与 <code>HKLM\\SECURITY</code> 出问题可能<b>无法启动</b>。新手只建议在 <code>HKCU</code> 下做可逆的小改动，并养成「改前 <code>reg export</code>」的习惯。'},
      {t:'ex',k:'动手练一练',items:[
        '在 <code>HKCU\\Software</code> 下新建一个测试键并写入一个 REG_DWORD=1，然后用 <code>reg query</code> 读回，确认无误后删除并导出过的备份对比。',
        '找一找 <code>HKCU\\...\\Run</code> 里有哪些开机自启项，对照任务管理器的「启动」页，理解它们是一回事。',
        '思考：为什么同一设置有时在 HKCU、有时在 HKLM？这背后的「用户 vs 全机」逻辑是什么？'
      ]}
    ]},
    {id:'win-4-4',num:'4.4',title:'注册表与组策略',lead:'GPO 本质是往注册表里写值。',tags:['管理'],blocks:[
      {t:'p',x:'在企业环境里，你很少直接改注册表，而是用 <b>组策略（Group Policy / GPO）</b>。但组策略的「落地」方式，本质就是<b>往注册表写值</b>——只是它统一、可下发、可撤销。'},
      {t:'steps',items:[
        ['管理员定义 GPO','在域控上配置「计算机/用户配置」策略'],
        ['客户端定期拉取','开机/定时通过 GPSVC 同步'],
        ['策略写入注册表','落点多在 <code>HKLM\\Software\\Policies</code> 与 <code>HKCU\\...\\Policies</code>'],
        ['应用程序读取','遵循策略键，覆盖本地默认']
      ]},
      {t:'p',x:'本地组策略编辑器是 <code>gpedit.msc</code>（家庭版默认没有）。它和注册表的关系是：<b>组策略是「受管」的注册表</b>——当策略键存在时，通常优先级高于用户手动改的普通键。'},
      {t:'note',kind:'warn',k:'家庭版没有 gpedit',x:'Windows 家庭版不包含 <code>gpedit.msc</code>。网上有「强制安装」脚本，但更稳妥的做法是直接改对应注册表项，或用第三方工具。企业/专业版则原生支持。'},
      {t:'faq',q:'为什么改了注册表重启又被还原？',a:'很可能是<b>组策略在覆盖你</b>：域环境或本地 GPO 定期把 <code>Policies</code> 下的键写回去。正确做法是在组策略里改，而不是手动改普通键。'}
    ]}
  ]},

  /* ================= 第 5 章 ================= */
  {id:'win-5',num:'5',title:'进程、线程与服务',lead:'任务管理器背后，系统在跑什么。',sections:[
    {id:'win-5-1',num:'5.1',title:'进程与线程模型',lead:'一个程序跑起来，至少是「一个进程 + 多条线程」。',tags:['基础'],blocks:[
      {t:'p',x:'<b>进程（Process）</b>是资源（内存、句柄、权限）的容器；<b>线程（Thread）</b>是真正被 CPU 调度的执行流。一个进程可有多个线程，共享同一进程的内存。NT 的调度对象正是线程。'},
      {t:'table',head:['概念','隔离性','例子'],rows:[
        ['进程','地址空间独立','每个打开的 Chrome 窗口进程'],
        ['线程','共享进程内存，独立栈','一个进程里的渲染线程、网络线程'],
        ['作业（Job）','把多个进程打包管理','限制一组进程的总 CPU/内存']
      ]},
      {t:'p',x:'NT 里「进程」和「线程」都是<b>对象</b>，由执行体的进程/线程管理器创建与调度。每个线程有一个优先级（0–31），调度器结合优先级与就绪队列决定谁先跑——这也是为什么「前台卡顿」常常能在任务管理器里看到某线程占满一个核。'},
      {t:'note',kind:'tip',k:'进程 ≠ 程序',x:'<b>程序</b>是磁盘上的 <code>.exe</code> 文件；<b>进程</b>是它跑起来的实例。同一个 <code>notepad.exe</code> 开两次，是<b>两个进程</b>。理解这点对「为什么关掉一个窗口别的还在」很有用。'},
      {t:'faq',q:'为什么有的软件一堆同名进程？',a:'为了<b>稳定性与并行</b>：Chrome/Edge 把每个标签页放独立进程，一个崩了不影响整体；也为了利用多核并行渲染。代价是内存占用更高。'}
    ]},
    {id:'win-5-2',num:'5.2',title:'任务管理器与资源监视器',lead:'看 CPU/内存/磁盘/网络从哪看起。',tags:['排错'],blocks:[
      {t:'p',x:'<code>Ctrl+Shift+Esc</code> 直接打开<b>任务管理器</b>。默认是简版，点「详细信息」展开完整列：PID、状态、CPU、内存、磁盘、网络、GPU。它是排错的第一现场。'},
      {t:'ul',items:[
        '<b>CPU 高</b>：看哪个进程持续占满——可能是死循环、杀软扫描或恶意软件。',
        '<b>内存高</b>：看「专用工作集」，注意「提交大小」是否接近上限（会卡顿/报错）。',
        '<b>磁盘 100%</b>：常见元凶是 Superfetch/搜索索引/杀软首次扫描，或硬盘本身老化。',
        '<b>启动项</b>：切到「启动」页禁用不必要的自启，能明显加快开机。'
      ]},
      {t:'p',x:'更细的视角用 <b>资源监视器（Resource Monitor, resmon.exe）</b>：它能看到某个进程具体在读写哪个文件、连哪个 IP、锁了哪个端口——远比任务管理器细。'},
      {t:'code',lang:'powershell',x:'# 用 PowerShell 找占用 CPU 最高的前 5 个进程\nGet-Process | Sort-Object CPU -Descending | Select -First 5 Name,CPU,WorkingSet\n\n# 查某个进程打开了哪些文件句柄（需管理员）\nGet-Process notepad | ForEach-Object { $_.Modules }'},
      {t:'note',kind:'tip',k:'卡顿时先看「磁盘」不是「CPU」',x:'很多人卡顿第一反应是 CPU 不够，但 Windows 上更常见的是<b>磁盘瓶颈</b>（尤其机械盘 + 杀软 + 索引同时跑）。先看磁盘列是否长期 100%，再决定是换 SSD 还是关后台。'}
    ]},
    {id:'win-5-3',num:'5.3',title:'Windows 服务',lead:'后台常驻的程序，不由用户点开。',tags:['服务'],blocks:[
      {t:'p',x:'<b>服务（Service）</b>是在后台运行的长期进程，没有窗口，随系统启动或由事件触发。驱动、数据库、Web 服务器、更新、打印后台处理都常以服务形式存在。管理入口是 <code>services.msc</code>。'},
      {t:'table',head:['启动类型','含义'],rows:[
        ['自动（延迟）','开机后稍晚启动，加快开机速度'],
        ['自动','随系统启动即启动'],
        ['手动','被需要时（或依赖项）才启动'],
        ['禁用','不允许启动']
      ]},
      {t:'p',x:'服务以<b>特定账户</b>运行：Local System（高权限）、Local Service、Network Service，或指定用户。权限过大是安全风险，过小会连资源都访问不了。<b>配置服务账户是运维基本功</b>。'},
      {t:'code',lang:'powershell',x:'# 查看正在运行的服务\nsc queryex type= service state= running\n\n# 用 PowerShell 启停服务\nStop-Service Spooler -Force\nStart-Service Spooler\n\n# 设置某服务为手动启动\nset-service wuauserv -StartupType Manual'},
      {t:'note',kind:'warn',k:'别随意禁用不认识的服务',x:'诸如 <code>RPC、DCOM、Plug and Play、Power</code> 等是系统运转的骨架，禁用会导致<b>无法开机或功能崩坏</b>。拿不准的服务先查用途，或设为「手动」而非「禁用」。'},
      {t:'faq',q:'服务和普通后台程序有什么区别？',a:'服务由<b>服务控制管理器（SCM）</b>统一托管：能设启动类型、有崩溃重启策略、能远程管理、能脱离用户会话运行（用户注销它还在）。普通程序关掉用户就退出了。'}
    ]},
    {id:'win-5-4',num:'5.4',title:'任务计划程序',lead:'定时/事件触发的自动化中枢。',tags:['自动化'],blocks:[
      {t:'p',x:'<b>任务计划程序（Task Scheduler, taskschd.msc）</b>是 Windows 的定时/事件触发引擎。系统更新、维护、备份、登录脚本很多都靠它。它比「启动文件夹」强大得多。'},
      {t:'steps',items:[
        ['触发器','何时跑：登录时、定时、空闲时、事件日志出现某 ID 时'],
        ['操作','跑什么：启动程序、发邮件、显示消息'],
        ['条件','附加限制：仅在使用交流电、仅空闲时'],
        ['设置','失败重试、到期失效、如仍运行则停止']
      ]},
      {t:'p',x:'一个实用技巧：<b>用任务计划程序绕开「开机自启被 UAC 拦截」</b>——把程序配成「不管用户是否登录都运行」（需要存密码），它就能以高权限静默启动，不必每次弹 UAC。这是很多运维脚本的标准做法。'},
      {t:'code',lang:'powershell',x:'# 用命令行建一个每日定时任务\n$act = New-ScheduledTaskAction -Execute "C:\\scripts\\backup.ps1"\n$trig = New-ScheduledTaskTrigger -Daily -At 3am\nRegister-ScheduledTask -TaskName "NightBackup" -Action $act -Trigger $trig -User "SYSTEM"'},
      {t:'note',kind:'tip',k:'排查「为什么我的脚本没跑」',x:'先看任务历史（需开启任务历史记录）；常见原因：触发器条件不满足（如「仅交流电」插了电池）、账户密码过期、脚本路径含空格未加引号、权限不足。'}
    ]}
  ]},

  /* ================= 第 6 章 ================= */
  {id:'win-6',num:'6',title:'命令行：CMD 与 PowerShell',lead:'两种 Shell，一个面向文本，一个面向对象。',sections:[
    {id:'win-6-1',num:'6.1',title:'CMD：老牌命令解释器',lead:'DOS 习惯的延续，够用但不现代。',tags:['CMD'],blocks:[
      {t:'p',x:'<b>CMD（命令提示符）</b>继承自 MS-DOS 的命令风格，是 Windows 最传统的 Shell。它处理的是<b>文本行</b>，命令之间靠文本拼接传递。很多老脚本、安装包仍依赖它。'},
      {t:'table',head:['命令','作用'],rows:[
        ['<code>dir</code>','列目录（类似 ls）'],
        ['<code>cd</code>','切换目录'],
        ['<code>copy / xcopy / robocopy</code>','复制文件，robocopy 适合大批量/断点'],
        ['<code>ipconfig</code>','查看/刷新 IP 配置'],
        ['<code>net</code>','网络与用户/共享管理'],
        ['<code>tasklist / taskkill</code>','列进程 / 杀进程'],
        ['<code>ping / tracert</code>','网络连通与路径诊断']
      ]},
      {t:'p',x:'CMD 的局限在于<b>一切皆文本</b>：你想「列出所有大于 100MB 的文件」就得写一堆 <code>for /f</code> 解析，既难读又易错。这正是 PowerShell 出现的原因。'},
      {t:'code',lang:'cmd',x:':: 批量把 .txt 改名备份到备份目录\nfor %%f in (*.txt) do copy "%%f" "backup\\%%f.bak"\n\n:: 查端口占用（谁占了 8080）\nnetstat -ano | findstr :8080'},
      {t:'note',kind:'tip',k:'什么时候还用 CMD',x:'维护老脚本、在受限环境（有些精简系统没有 PowerShell）、或执行安装包自带的 .bat 时，CMD 仍是首选。新写的自动化应优先 PowerShell。'}
    ]},
    {id:'win-6-2',num:'6.2',title:'PowerShell：基于对象的 Shell',lead:'管道里传的是对象，不是文本。',tags:['PowerShell'],blocks:[
      {t:'p',x:'<b>PowerShell</b>是微软的现代 Shell 与脚本语言。它最大的不同：<b>管道（|）传递的是「对象」而非文本</b>。你可以把「进程对象」直接传给排序、筛选、格式化命令，不用解析字符串。'},
      {t:'table',head:['PowerShell','等价 CMD / 说明'],rows:[
        ['<code>Get-ChildItem</code> / <code>ls</code>','dir，但返回文件对象'],
        ['<code>Get-Process</code> / <code>ps</code>','tasklist，返回进程对象'],
        ['<code>Where-Object</code> / <code>?</code>','筛选对象属性'],
        ['<code>Select-Object</code> / <code>select</code>','选取/投影属性'],
        ['<code>Get-Content</code> / <code>cat</code>','type，读文件']
      ]},
      {t:'p',x:'PowerShell 里命令叫 <b>cmdlet</b>（发音 command-let），统一采用 <code>动词-名词</code> 命名（Get-/Set-/New-/Remove-），可读性强。还有<b>别名</b>兼容 Unix 与 CMD 习惯（<code>ls</code>、<code>cat</code>、<code>pwd</code>），降低迁移成本。'},
      {t:'note',kind:'tip',k:'版本：5.1 vs 7',x:'Windows 自带的是 <b>Windows PowerShell 5.1</b>（随系统、只修不升级）；另有跨平台的 <b>PowerShell 7（pwsh）</b>，需单独安装、迭代更快。脚本若用到 7 的新特性，要先确认运行环境。'},
      {t:'faq',q:'PowerShell 和 CMD 能互相调用吗？',a:'能。<b>PowerShell 里可直接敲 cmd 命令</b>（如 <code>ipconfig</code>）；CMD 里可用 <code>powershell -Command "..."</code> 调用 PowerShell。混合脚本在运维里很常见。'}
    ]},
    {id:'win-6-3',num:'6.3',title:'对象管道与常用 cmdlet',lead:'把「对象流」用出生产力。',tags:['实战'],blocks:[
      {t:'p',x:'理解「管道传对象」后，很多任务一行搞定。核心是：先 <code>Get-</code> 拿到对象，再用 <code>Where-Object</code> 筛选、<code>Sort-Object</code> 排序、<code>Select-Object</code> 投影、<code>Export-Csv</code> 导出。'},
      {t:'code',lang:'powershell',x:'# 找出占用内存 Top5 的进程，导出成 CSV\nGet-Process |\n  Sort-Object WorkingSet -Descending |\n  Select-Object -First 5 Name,Id,WorkingSet |\n  Export-Csv C:\\tmp\\topmem.csv -NoTypeInformation\n\n# 找出 7 天内修改过的大于 10MB 的文件\nGet-ChildItem C:\\Data -Recurse -File |\n  Where-Object { $_.Length -gt 10MB -and $_.LastWriteTime -gt (Get-Date).AddDays(-7) }'},
      {t:'p',x:'对象的好处是<b>属性结构化</b>：<code>$_.Length</code>、<code>$_.LastWriteTime</code> 直接可用，不用正则去抠文本。这让数据处理既快又不易错。'},
      {t:'note',kind:'warn',k:'PowerShell 默认不告警就「覆盖」',x:'<code>Set-Content</code> / <code>Move-Item</code> 等会<b>直接覆盖</b>目标，且不总是提示。脚本里对重要操作建议加 <code>-WhatIf</code>（预演）或 <code>-Confirm</code>（确认），先看清会改什么。'},
      {t:'ex',k:'动手练一练',items:[
        '用一条管道列出本机所有「自动启动」的服务名与状态。',
        '把 <code>C:\\Windows</code> 下最近 24 小时修改的文件数统计出来。',
        '对比同样需求在 CMD 里要写多少 <code>for /f</code>，体会「对象 vs 文本」的差别。'
      ]}
    ]},
    {id:'win-6-4',num:'6.4',title:'写一个实用的 PowerShell 脚本',lead:'从命令到可复用脚本。',tags:['脚本'],blocks:[
      {t:'p',x:'脚本就是把命令存成 <code>.ps1</code> 文件。但要注意：<b>Windows 默认禁止直接双击运行 .ps1</b>（执行策略 Execution Policy 防恶意脚本）。这是安全特性，不是 bug。'},
      {t:'code',lang:'powershell',x:'# daily-report.ps1 —— 每日系统简报\n$os = Get-CimInstance Win32_OperatingSystem\n$disk = Get-PSDrive C\ndate = Get-Date -Format "yyyy-MM-dd HH:mm"\nWrite-Host "===== 系统简报 $date ====="\nWrite-Host ("系统: " + $os.Caption + " " + $os.OSArchitecture)\nWrite-Host ("开机时长: " + $os.LastBootUpTime)\nWrite-Host ("C 盘剩余: " + [math]::Round($disk.Free/1GB,1) + " GB")\n$cpu = (Get-Process | Measure-Object CPU -Sum).Sum\nWrite-Host ("累计 CPU 时间: " + [math]::Round($cpu/60,1) + " 分钟")'},
      {t:'table',head:['执行策略','含义'],rows:[
        ['<code>Restricted</code>','默认，禁止任何脚本运行'],
        ['<code>RemoteSigned</code>','本地脚本随意，网上下载的需签名'],
        ['<code>AllSigned</code>','所有脚本都要可信签名'],
        ['<code>Bypass</code>','不限制（临时排错用）']
      ]},
      {t:'code',lang:'powershell',x:'# 临时以 RemoteSigned 运行脚本（当前进程有效）\nSet-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned\n.\\daily-report.ps1'},
      {t:'note',kind:'tip',k:'脚本放哪、怎么跑',x:'交互调试用 ISE 或 VS Code；生产脚本建议放在固定目录并用<b>任务计划程序</b>（见 5.4）按条件触发，而不是手动双击。'},
      {t:'faq',q:'为什么双击 .ps1 只打开记事本？',a:'因为默认执行策略禁止运行，外壳便把它当普通文件交给记事本。正确方式是在 PowerShell 里 <code>cd</code> 到目录后 <code>.\\脚本.ps1</code> 运行（必要时先放宽执行策略）。'}
    ]}
  ]},

  /* ================= 第 7 章 ================= */
  {id:'win-7',num:'7',title:'用户、权限与安全',lead:'账户、UAC、加密、防病毒——安全的几道防线。',sections:[
    {id:'win-7-1',num:'7.1',title:'账户：本地账户与 Microsoft 账户',lead:'两种登录身份，安全模型不同。',tags:['账户'],blocks:[
      {t:'p',x:'Windows 的登录身份主要有两类：<b>本地账户</b>（仅存于本机，离线可用）与 <b>Microsoft 账户（MSA）</b>（联网，可同步设置、找回密码、绑定商店）。'},
      {t:'table',head:['维度','本地账户','Microsoft 账户'],rows:[
        ['凭证存放','本机 SAM','微软云端 + 本机缓存'],
        ['密码找回','需重置盘/重装','可在线找回'],
        ['设置同步','无','跨设备同步主题/浏览器等'],
        ['离线使用','完全可用','首次需联网验证']
      ]},
      {t:'p',x:'无论哪种账户，背后都是 <b>SAM（安全账户管理器）</b>里的本地账户数据库，配合 LSA（本地安全机构）做认证。企业环境则常用 <b>Active Directory 域账户</b>——账户在域控上，员工用同一身份登任意域内机器。'},
      {t:'note',kind:'warn',k:'日常别用管理员账户上网',x:'用管理员身份日常办公/上网，一旦中招，恶意程序就自带高权限。<b>最佳实践：日常用标准用户，需要时才 UAC 提权</b>（见 7.2）。'},
      {t:'faq',q:'什么是「标准用户」vs「管理员」？',a:'标准用户只能改自己的东西；管理员能改系统、装驱动、写受保护目录。Windows 默认给首个账户管理员，但这不等于你要用它做一切——建一个标准账户日常用更安全。'}
    ]},
    {id:'win-7-2',num:'7.2',title:'UAC：用户账户控制',lead:'为什么总要「允许此应用更改你的设备」。',tags:['UAC'],blocks:[
      {t:'p',x:'<b>UAC（User Account Control）</b>是 Vista 起引入的安全机制：即使你是管理员，日常也以<b>「管理员-过滤」令牌</b>运行（权限被削）；当程序要做系统级操作时，才弹窗让你确认提升为完整管理员令牌。'},
      {t:'steps',items:[
        ['你登录管理员','系统给你两个令牌：完整管理员 + 过滤（降权）令牌'],
        ['日常操作','用降权令牌，改不了系统目录/注册表关键项'],
        ['程序请求提权','弹 UAC 框（蓝/红），你确认后切到完整令牌'],
        ['红色 vs 蓝色','蓝=本机已签名程序；红=来自互联网/未知发布者，更危险']
      ]},
      {t:'p',x:'UAC 的意义是<b>最小权限 + 明确授权</b>：即便你是管理员，恶意程序也不能「悄悄」拿到系统权限，必须先过你这一关。关掉 UAC 等于拆掉这道闸。'},
      {t:'note',kind:'warn',k:'别为了「省事」关 UAC',x:'很多人嫌弹窗烦就关 UAC（设为「从不通知」）。代价是任何程序都能直接以管理员身份运行，<b> ransomware（勒索软件）会因此畅通无阻</b>。忍一下弹窗，比中招强。'},
      {t:'faq',q:'为什么有时 UAC 不弹窗直接过了？',a:'如果该操作以管理员身份「计划任务」或「服务」运行，或你已在该会话提权过，可能不再弹。另外「管理员命令提示符」本身已是完整令牌，内部操作不重复弹。'}
    ]},
    {id:'win-7-3',num:'7.3',title:'BitLocker 与设备加密',lead:'整卷加密，防盗/防丢。',tags:['加密'],blocks:[
      {t:'p',x:'<b>BitLocker</b>是 Windows 的<b>整卷加密</b>功能：把整个分区（通常系统盘）加密，没有密钥就无法读取数据。对丢失/被盗的设备，这是最后一道防线——捡到电脑的人拿不到你的文件。'},
      {t:'table',head:['对比','EFS（4.2）','BitLocker'],rows:[
        ['范围','单文件/文件夹','整卷（分区）'],
        ['密钥绑定','用户证书','TPM / 密码 / USB 密钥'],
        ['防丢电脑','弱（系统盘未加密）','强（整盘加密）'],
        ['典型场景','保护特定文档','保护整台设备']
      ]},
      {t:'p',x:'现代设备多由 <b>TPM 芯片</b>自动保管密钥：开机时 TPM 校验引导链未被篡改，才释放密钥「无感解锁」。一旦引导被改（如换了引导程序），就需要恢复密钥——这正好挡住「把硬盘拆到别的机器读」的攻击。'},
      {t:'note',kind:'danger',k:'务必备份恢复密钥',x:'BitLocker 恢复密钥<b>一定要存到 Microsoft 账户 / 打印 / 文件</b>。否则主板/TPM 变动、或忘记密码时，<b>数据将永久不可恢复</b>。这是「加密的反面风险」。'},
      {t:'faq',q:'BitLocker 会影响性能吗？',a:'现代 CPU 有 <b>AES-NI</b> 指令加速，全盘加密的 overhead 通常很小（个位数百分比），日常几乎无感。比起安全收益，这点开销值得。'}
    ]},
    {id:'win-7-4',num:'7.4',title:'Defender 与防火墙',lead:'内置的两道主动防线。',tags:['防护'],blocks:[
      {t:'p',x:'Windows 自带 <b>Microsoft Defender 防病毒</b>与 <b>Windows Defender 防火墙</b>，无需额外安装即可提供基础防护。它们随系统更新病毒库，且与系统深度集成。'},
      {t:'cards',items:[
        ['Defender 防病毒','实时扫描、云查杀、勒索防护，家庭版默认开启'],
        ['SmartScreen','拦截可疑下载与网站，保护浏览器/商店'],
        ['防火墙','按入站/出站规则过滤网络流量，默认挡入站'],
        ['核心隔离 / HVCI','基于虚拟化的安全，挡内核级恶意代码']
      ]},
      {t:'p',x:'<b>防火墙</b>默认「阻止入站、允许出站」。这意味着别人很难从网络主动连进你的电脑，而你的电脑主动上网不受限。开某个服务（如远程桌面）时，记得放行对应端口（见 8.4）。'},
      {t:'code',lang:'powershell',x:'# 快速检查 Defender 状态\nGet-MpComputerStatus | Select AMServiceEnabled,AntispywareEnabled,RealTimeProtectionEnabled\n\n# 手动全盘扫描\nStart-MpScan -ScanType FullScan'},
      {t:'note',kind:'warn',k:'不要同时装多个杀软',x:'多个实时防护杀软会<b>互相冲突、抢文件锁、拖慢系统</b>，甚至误杀彼此。保留 Defender 或选一款第三方并关掉 Defender 实时防护即可，不要叠 buff。'},
      {t:'faq',q:'用 Defender 还用装第三方杀软吗？',a:'对绝大多数个人用户，<b>Defender 已足够</b>，且零成本、不拖沓。第三方杀软的价值在于更高级的防火墙/隐私/家庭管控。叠加运行反而有害。'}
    ]}
  ]},

  /* ================= 第 8 章 ================= */
  {id:'win-8',num:'8',title:'网络与远程',lead:'IP、共享、远程桌面、防火墙——联网的几件事。',sections:[
    {id:'win-8-1',num:'8.1',title:'TCP/IP 与 IP 配置',lead:'看 IP、改 IP、刷新 DHCP/DNS。',tags:['网络'],blocks:[
      {t:'p',x:'Windows 网络栈遵循标准 <b>TCP/IP</b>。日常排查从 <code>ipconfig</code> 开始：看是否拿到 IP、网关、DNS，以及是否「媒体已断开」。'},
      {t:'code',lang:'cmd',x:'ipconfig /all          :: 看全部网卡详情（含 MAC、DHCP、DNS）\nipconfig /release      :: 释放 DHCP 地址\nipconfig /renew        :: 重新获取\nipconfig /flushdns     :: 清空 DNS 缓存（域名解析异常时）'},
      {t:'table',head:['场景','做法'],rows:[
        ['上不了网先看','ipconfig：是否 169.254.x.x（没拿到 DHCP）'],
        ['能上 QQ 打不开网页','多为 DNS 问题，flushdns 或换 DNS'],
        ['改静态 IP','网络连接属性 → IPv4 → 手动填 IP/网关/DNS'],
        ['看路由','<code>route print</code> / <code>tracert</code>']
      ]},
      {t:'p',x:'<code>169.254.x.x</code> 是 <b>APIPA 自动私有地址</b>：当 DHCP 服务器拿不到地址时，系统自己随机分一个，仅能局域网通信、不能上网。看到它基本说明「DHCP 环节出问题」。'},
      {t:'note',kind:'tip',k:'DNS 比 IP 更常是元凶',x:'很多「网页打不开但微信能发」的现象，根因是<b>DNS 解析失败</b>（QQ 等用 IP/自家解析不依赖系统 DNS）。先 <code>flushdns</code>，再考虑换公共 DNS（如 8.8.8.8 / 223.5.5.5）。'},
      {t:'faq',q:'IPv4 和 IPv6 都要管吗？',a:'现在 Windows 默认<b>双栈</b>：IPv4 与 IPv6 并存。多数家庭网络仍以 IPv4 为主，但有些场景（如某些单位内网、或前面 JNL OS 里的 localhost 解析）IPv6 会优先介入，出问题时要想到它。'}
    ]},
    {id:'win-8-2',num:'8.2',title:'文件与打印机共享（SMB）',lead:'局域网内怎么互相访问文件夹。',tags:['共享'],blocks:[
      {t:'p',x:'Windows 的局域网共享基于 <b>SMB（Server Message Block）</b> 协议。通过「网络发现和文件共享」开启后，可在「网络」里看到同网段的机器并访问其共享文件夹。'},
      {t:'steps',items:[
        ['开启网络发现','网络和共享中心 → 启用网络发现与文件打印共享'],
        ['设置共享','右键文件夹 → 属性 → 共享 / 高级共享，设权限'],
        ['访问控制','用「Everyone」或具体账户，注意 NTFS 权限也会叠加'],
        ['访问','资源管理器输入 <code>\\\\计算机名\\共享名</code> 或 IP']
      ]},
      {t:'p',x:'共享权限和 <b>NTFS 权限是叠加取交集</b>的：共享给「只读」但 NTFS 给「完全控制」，实际仍是只读。排查「明明共享了却访问不了」时，两个权限都要查。'},
      {t:'note',kind:'warn',k:'SMBv1 要关掉',x:'<b>SMBv1</b> 是极老且漏洞百出的协议（WannaCry 就是利用它）。现代 Windows 默认关闭 SMBv1，切勿为兼容老设备而重新开启；老 NAS 应升级或走其他协议。'},
      {t:'code',lang:'powershell',x:'# 查看本机共享\nGet-SmbShare\n# 关闭危险的 SMBv1 协议（需重启）\nDisable-WindowsOptionalFeature -Online -FeatureName SMB1Protocol'}
    ]},
    {id:'win-8-3',num:'8.3',title:'远程桌面 RDP',lead:'从另一台机器接管这台 Windows。',tags:['远程'],blocks:[
      {t:'p',x:'<b>远程桌面（RDP, Remote Desktop Protocol）</b>让你从别处连上这台 Windows 并操作它的桌面。主机端在专业版/企业版上默认支持（家庭版只能当客户端，不能当主机）。'},
      {t:'table',head:['角色','版本要求','工具'],rows:[
        ['被控（主机）','专业版/企业版及以上','设置 → 系统 → 远程桌面'],
        ['控制（客户端）','任意版本','mstsc.exe（远程桌面连接）'],
        ['Web 方式','需网关','Remote Desktop Web Client']
      ]},
      {t:'p',x:'RDP 默认端口 <b>3389</b>。公网暴露 3389 是高风险行为（暴力破解重灾区）。最佳实践：改端口、用 VPN/跳板、开 NLA（网络级身份验证）、设强密码或证书。'},
      {t:'note',kind:'danger',k:'别把 3389 直接暴露在公网',x:'无数勒索事件始于「公网开放 RDP + 弱密码」。若要远程，请通过 <b>VPN 或 SSH 隧道</b>进入内网再连，或限制源 IP、启用账户锁定策略。直接裸奔 3389 等于招贼。'},
      {t:'faq',q:'远程桌面和 TeamViewer/向日葵有什么区别？',a:'RDP 是微软原生、性能高、需主机支持；TeamViewer 等是第三方穿透工具，<b>无需公网 IP、能跨 NAT</b>，但依赖其服务器、且有隐私/授权风险。内网用 RDP，外网临时协助用第三方。'}
    ]},
    {id:'win-8-4',num:'8.4',title:'防火墙入站/出站规则',lead:'放行还是拦截，靠规则说了算。',tags:['防火墙'],blocks:[
      {t:'p',x:'<b>Windows Defender 防火墙</b>按「配置文件（域/专用/公用）+ 入站/出站 + 程序/端口」组合出规则。默认<b>入站拒绝、出站允许</b>：对外服务要主动放行入站。'},
      {t:'code',lang:'powershell',x:'# 放行某程序通过防火墙（入站）\nNew-NetFirewallRule -DisplayName "MyApp" -Direction Inbound `\n  -Program "C:\\app\\server.exe" -Action Allow\n\n# 放行 TCP 8080 端口入站\nNew-NetFirewallRule -DisplayName "Web8080" -Direction Inbound `\n  -Protocol TCP -LocalPort 8080 -Action Allow\n\n# 列出所有入站规则\nGet-NetFirewallRule -Direction Inbound | Where Enabled'},
      {t:'table',head:['场景','该放行'],rows:[
        ['开 Web 服务','入站 TCP 80/443'],
        ['开远程桌面','入站 TCP 3389（建议先限制源 IP）'],
        ['开文件共享','入站 SMB（TCP 445）'],
        ['允许某软件上网','出站允许该程序']
      ]},
      {t:'note',kind:'warn',k:'公共网络记得切到「公用」配置文件',x:'连咖啡厅 Wi-Fi 时，网络位置应选<b>「公用」</b>，防火墙会更严（默认挡更多入站）。选成「专用/家庭」会放松入站，在公共网络下很危险。'},
      {t:'ex',k:'动手练一练',items:[
        '在本机用 PowerShell 放行一个测试端口，再用另一台机器的 <code>telnet IP 端口</code> 或 <code>Test-NetConnection</code> 验证连通。',
        '把网络配置文件从专用切到公用，观察防火墙规则差异。',
        '思考：为什么「出站默认允许」而「入站默认拒绝」？这与你作为客户端的角色有什么关系？'
      ]}
    ]}
  ]},

  /* ================= 第 9 章 ================= */
  {id:'win-9',num:'9',title:'维护与排错',lead:'事件日志、系统还原、启动修复——出事怎么救。',sections:[
    {id:'win-9-1',num:'9.1',title:'事件查看器',lead:'系统把「发生了什么」都记在这里。',tags:['日志'],blocks:[
      {t:'p',x:'<b>事件查看器（Event Viewer, eventvwr.msc）</b>是 Windows 的中央日志库。系统、应用、安全事件都按「日志」归档。出问题时，它比凭感觉猜可靠得多。'},
      {t:'table',head:['日志','看什么'],rows:[
        ['Windows 日志 → 系统','驱动故障、服务启停、磁盘警告、BSOD 记录'],
        ['Windows 日志 → 应用','各软件崩溃、报错'],
        ['Windows 日志 → 安全','登录、权限变更（审计）'],
        ['应用程序和服务日志','组件级细节（如 PowerShell 操作日志）']
      ]},
      {t:'p',x:'每条事件有<b>级别</b>（信息/警告/错误/关键）和<b>事件 ID</b>。排错时把「错误 + 事件 ID」直接拿去搜，往往能定位到具体成因——这是 Windows 排错最高效的路径。'},
      {t:'code',lang:'powershell',x:'# 取最近 20 条系统错误事件\nGet-EventLog -LogName System -EntryType Error -Newest 20 |\n  Select TimeGenerated,Source,EventID,Message\n\n# 查蓝屏相关的关键事件\nGet-WinEvent -FilterHashtable @{LogName=\'System\';Level=2} -MaxEvents 10'},
      {t:'note',kind:'tip',k:'蓝屏后去哪看',x:'蓝屏（BSOD）的转储分析门槛高，但<b>「系统」日志里通常有一条关键错误记录了崩溃前驱动/服务</b>。先翻事件查看器，比直接拿 dump 文件分析更省事。'}
    ]},
    {id:'win-9-2',num:'9.2',title:'系统还原与卷影复制',lead:'把系统/文件回到过去的某个点。',tags:['恢复'],blocks:[
      {t:'p',x:'<b>系统还原（System Restore）</b>会定期给系统设置和已安装程序创建「还原点」，出问题可回退到某个时间点（不影响个人文件）。它依赖 <b>卷影复制（VSS）</b> 技术。'},
      {t:'ul',items:[
        '还原点通常在安装软件/驱动、系统更新前自动创建，也可手动建。',
        '回退的是<b>系统配置与程序</b>，<b>个人文档一般不回退</b>（那是「文件历史记录/之前的版本」的职责）。',
        '若还原点被关，系统更新会创建「卸载更新」的应急点。'
      ]},
      {t:'p',x:'文件级的「回到过去」靠 <b>卷影副本 + 以前的版本</b>：右键文件/文件夹 →「以前的版本」，可还原被误改/误删的内容（前提是卷影正常、且时间点上有副本）。'},
      {t:'note',kind:'warn',k:'系统还原不是备份',x:'它救的是「系统配置」，<b>救不了硬盘损坏、勒索加密、误删个人文件</b>。真正的保险是独立备份（另盘/云）。别把还原点当备份用。'},
      {t:'faq',q:'为什么有时「以前的版本」是空的？',a:'因为<b>卷影副本默认空间有限、会被新副本覆盖</b>，或该功能被关闭。关键文件请改用专门的备份/同步方案，别依赖卷影。'}
    ]},
    {id:'win-9-3',num:'9.3',title:'启动修复与高级启动',lead:'开不了机时，进恢复环境。',tags:['启动'],blocks:[
      {t:'p',x:'当系统无法正常启动，可进入 <b>Windows 恢复环境（WinRE）</b>：通过设置 → 恢复 →「高级启动」重启，或开机时多次强制断电触发自动修复。里面有关键救援工具。'},
      {t:'table',head:['工具','用途'],rows:[
        ['启动修复','自动修复引导与系统文件问题'],
        ['系统还原','回到某个还原点'],
        ['卸载更新','回退有问题的质量/功能更新'],
        ['命令提示符','进恢复版 CMD，可跑 sfc / chkdsk / 手动修复'],
        ['重置此电脑','保留或删除文件后重装系统']
      ]},
      {t:'p',x:'两个常用修复命令：<code>sfc /scannow</code> 扫描并修复受保护的系统文件；<code>DISM</code> 修复组件存储。引导损坏时还可用 <code>bootrec /fixmbr</code>、<code>/fixboot</code>、<code>/rebuildbcd</code>。'},
      {t:'code',lang:'cmd',x:':: 在恢复环境 CMD 里依次尝试\nsfc /scannow\ndism /online /cleanup-image /restorehealth\nbootrec /fixmbr\nbootrec /fixboot\nbootrec /rebuildbcd'},
      {t:'note',kind:'warn',k:'「重置此电脑」也可能丢东西',x:'选「删除所有内容」会清掉个人文件；即便选「保留文件」，<b>已安装的程序与多数设置仍会丢失</b>。重置是「最后手段」，不是无痛恢复。'},
      {t:'faq',q:'怎么进 BIOS/UEFI 与恢复环境？',a:'开机按厂商键（Del/F2/F12 等）进 UEFI 设置；连续强制关机 2–3 次会触发 Windows 自动修复进入 WinRE。也可在系统里「按住 Shift 点重启」直接进入高级启动。'}
    ]},
    {id:'win-9-4',num:'9.4',title:'重置与重装：最后的手段',lead:'干净环境，重新开始。',tags:['重装'],blocks:[
      {t:'p',x:'当系统久病不愈、怀疑感染或配置崩坏，<b>重置/重装</b>是兜底。它和「系统还原」「修复」不同：会重建系统，代价是重装软件。'},
      {t:'steps',items:[
        ['备份个人文件','先拷到外盘/云（重置也可能波及）'],
        ['云下载 vs 本地','云下载获取最新系统，本地用现有文件'],
        ['保留 vs 删除文件','保留=只清程序与设置；删除=彻底清空'],
        ['重装后','(重装驱动/软件，恢复备份，设好备份策略']
      ]},
      {t:'p',x:'现代 Windows 还支持 <b>「云下载」重装</b>（从微软拉最新镜像），免去找安装盘的麻烦。企业则用 <b>镜像（WIM/ISO）+ MDT/SCCM</b> 批量部署，统一系统、驱动、软件。'},
      {t:'note',kind:'tip',k:'装完第一件事：做备份策略',x:'重装最痛苦的永远是「为什么没早点备份」。装好即用 <b>文件历史记录 / 第三方备份 / 云同步</b>把个人数据纳入自动保护，比任何救援工具都管用。'},
      {t:'quote',x:'排错的最高境界不是会修，而是<strong>有备份、会还原</strong>——把「无法挽回」变成「多花十分钟」。Windows 这套恢复工具链，价值正在于此。'}
    ]}
  ]}

  ]
};
