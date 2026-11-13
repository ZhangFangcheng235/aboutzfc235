/* ==========================================================
   方程的工艺百科全书 · 操作系统篇
   课程：Linux 操作系统知识
   说明：面向工程实践的系统教程——讲清 Linux 的内核、目录结构、
        权限模型、systemd、包管理、Shell、网络与启动排错。
        内容为通用工程常识归纳，命令以常见发行版为准。
   ========================================================== */
window.WIKI_LINUX = {
  id:'linux', num:'丙', en:'COURSE III · LINUX',
  title:'Linux 操作系统知识',
  lead:'一类以 Linux 内核为核心、遵循 POSIX、开源协作的操作系统家族（发行版）。它从服务器、嵌入式一路走到安卓与超级计算机，几乎撑起整个互联网基础设施。本篇从「内核与发行版的关系」讲到「权限、进程、包管理、Shell、网络、启动排错」，把日常工程里真正用得到的 Linux 知识系统整理成可查阅的教程。',
  chips:['Linux 内核','一切皆文件','POSIX','systemd','bash / 包管理'],
  chapters:[

  /* ================= 第 1 章 ================= */
  {id:'linux-1',num:'1',title:'认识 Linux',lead:'先分清内核、GNU 与发行版，以及为什么它无处不在。',sections:[
    {id:'linux-1-1',num:'1.1',title:'一句话定位与历史',lead:'一个大学生写的爱好，长成了互联网底座。',tags:['绪论'],blocks:[
      {t:'p',x:'<b>Linux 是 1991 年由林纳斯·托瓦兹（Linus Torvalds）发布的类 Unix 操作系统内核</b>。它最初是个人爱好，如今运行在从智能手表、路由器到超算、云服务器的几乎一切设备上。'},
      {t:'p',x:'需要厘清一个常见误会：通常说的「Linux 系统」其实是 <b>Linux 内核 + GNU 工具链 + 各种自由软件</b> 的组合，所以也有人严谨地称它为 <b>GNU/Linux</b>。内核只负责最底层的资源调度，真正的可用系统靠 GNU 等提供 <code>gcc</code>、<code>bash</code>、<code>coreutils</code> 等。'},
      {t:'table',head:['年份','事件','意义'],rows:[
        ['1991','Linus 发布内核 0.01','开源协作的起点'],
        ['1992','以 GPLv2 发布','允许自由使用、修改、分发'],
        ['1993','Debian / Slackware 诞生','早期发行版出现'],
        ['2003+','RHEL / SUSE / Ubuntu 成熟','企业级生态成型'],
        ['2007+','Android 基于 Linux','走进数十亿手机'],
        ['2010+','云与容器','Linux 成为云基础设施事实标准']
      ]},
      {t:'note',kind:'tip',k:'内核版本 vs 发行版版本',x:'<b>内核版本</b>（如 6.8）由 Linus 团队维护；<b>发行版版本</b>（如 Ubuntu 24.04）由各社区/公司打包。你看到的 <code>uname -r</code> 是内核版本，系统版本要用 <code>cat /etc/os-release</code>。'},
      {t:'faq',q:'Linus 现在还写代码吗？',a:'他长期担任内核「仁慈的独裁者」，亲自审核与合并关键改动、维护版本号。今天内核由全球数千名开发者协作，Linus 的签名决定哪些补丁进主线。'}
    ]},
    {id:'linux-1-2',num:'1.2',title:'内核与发行版的关系',lead:'内核是发动机，发行版是整车。',tags:['概念'],blocks:[
      {t:'p',x:'<b>内核（kernel）</b>只提供进程调度、内存管理、文件系统、网络、设备驱动等基础能力。<b>发行版（Distribution / Distro）</b>则是把内核 + 引导器 + 包管理器 + 桌面 + 默认配置打包成「能安装使用的完整系统」。'},
      {t:'table',head:['层次','由谁提供','例子'],rows:[
        ['内核','Linus 主线 / 发行版补丁','linux-image-6.8'],
        ['基础工具','GNU 等','coreutils, bash, glibc'],
        ['包管理','发行版','apt / dnf / pacman'],
        ['桌面/配置','发行版','GNOME/KDE + 默认设置'],
        ['支持策略','发行版','LTS 周期、安全更新']
      ]},
      {t:'p',x:'同一个内核，可以被 Ubuntu、Fedora、Arch 各自打包成体验迥异的系统。所以「用 Linux」其实是在选<b>发行版</b>——选的是它的包管理器、稳定性策略与社区。'},
      {t:'note',kind:'warn',k:'不同发行版命令不完全通用',x:'<b>包管理命令差异最大</b>：Debian/Ubuntu 用 <code>apt</code>，Red Hat/Fedora 用 <code>dnf</code>，Arch 用 <code>pacman</code>。跨发行版抄命令前先确认「这家用哪套」，否则会报命令不存在。'},
      {t:'faq',q:'为什么有这么多发行版，不统一？',a:'因为开源允许任何人基于 GPL 自由派生。不同发行版服务不同人群：稳定优先（Debian/RHEL）、新潮优先（Arch/Fedora）、易用优先（Ubuntu/Mint）。竞争带来了繁荣。'}
    ]},
    {id:'linux-1-3',num:'1.3',title:'常见发行版谱系',lead:'Debian / Red Hat / Arch / SUSE 四大脉络。',tags:['版本'],blocks:[
      {t:'p',x:'发行版虽多，但「血统」大致汇入几条主流脉络。理解脉络比记名字重要——同脉络的包管理与配置高度相似。'},
      {t:'cards',items:[
        ['Debian 系','apt/dpkg，稳如老狗：Debian、Ubuntu、Linux Mint、Kali'],
        ['Red Hat 系','rpm/dnf，企业主力：RHEL、Fedora、CentOS Stream、Rocky/Alma'],
        ['Arch 系','pacman，滚动更新、文档极好：Arch、Manjaro、EndeavourOS'],
        ['SUSE 系','zypper/rpm，欧洲企业：openSUSE、SUSE Linux Enterprise']
      ]},
      {t:'p',x:'<b>Ubuntu</b> 基于 Debian 但更面向桌面与云；<b>CentOS Stream</b> 是 RHEL 的上游滚动版；<b>Rocky/Alma</b> 是 CentOS 停更后的社区继任者，目标「1:1 兼容 RHEL」。选服务器时这些名字会反复出现。'},
      {t:'note',kind:'tip',k:'服务器怎么选',x:'求稳选 <b>Debian Stable</b> 或 <b>RHEL 系（含 Rocky/Alma）</b>；求最新内核/软件选 <b>Fedora</b> 或 <b>Ubuntu LTS</b>；容器/云镜像常是精简的 Debian/Alpine。桌面新手推荐 Ubuntu 或 Linux Mint。'},
      {t:'faq',q:'Alpine 为什么那么小？',a:'Alpine 用 <b>musl libc</b> 而非 glibc、用 <b>BusyBox</b> 替代一堆 GNU 工具，且默认无 systemd，因此镜像可压到几 MB，是容器基础镜像的热门选择——但 musl 与 glibc 的细微差异偶尔会让某些二进制不兼容。'}
    ]},
    {id:'linux-1-4',num:'1.4',title:'为什么工程上离不开 Linux',lead:'服务器、开发、嵌入式、容器都是它。',tags:['定位'],blocks:[
      {t:'p',x:'无论从哪个角度，Linux 都是工程基础设施的默认选择：'},
      {t:'ul',items:[
        '<b>服务器与云</b>：绝大多数网站、API、数据库跑在 Linux 上；AWS/GCP/Azure 的云主机默认镜像多为 Linux。',
        '<b>容器与编排</b>：Docker、Kubernetes 的根基是 Linux 的 cgroup 与命名空间。',
        '<b>开发环境</b>：命令行工具链、包管理、SSH 协作成熟，CI/CD 天然契合。',
        '<b>嵌入式与安卓</b>：路由器、机顶盒、汽车、安卓手机内核皆是 Linux。'
      ]},
      {t:'quote',x:'学 Linux 不是为了「换桌面」，而是掌握支撑整个互联网的底层操作系统——它的权限模型、进程模型、网络模型，是理解现代计算的关键。'},
      {t:'note',kind:'warn',k:'开源≠无成本',x:'Linux 免费，但<b>运维责任在你</b>：安全更新、备份、排错都要自己来。企业发行版的订阅费买的正是「有人兜底的支持与稳定周期」。'}
    ]}
  ]},

  /* ================= 第 2 章 ================= */
  {id:'linux-2',num:'2',title:'系统架构',lead:'内核、Shell、用户空间，以及「一切皆文件」。',sections:[
    {id:'linux-2-1',num:'2.1',title:'内核、Shell 与用户空间',lead:'三层协作：内核管资源，Shell 当中介。',tags:['架构'],blocks:[
      {t:'p',x:'Linux 系统的运行分为两大部分：<b>内核空间</b>（Kernel Space，运行内核与少数驱动，特权级最高）与 <b>用户空间</b>（User Space，运行所有普通程序）。二者通过<b>系统调用（syscall）</b> 这道门沟通。'},
      {t:'table',head:['组件','所在空间','职责'],rows:[
        ['内核','内核空间','进程/内存/文件/网络/驱动的调度核心'],
        ['C 库 glibc','用户空间','把 syscall 包装成可用函数'],
        ['Shell（bash 等）','用户空间','命令行解释器，人与内核的对话窗口'],
        ['普通程序','用户空间','编辑器、服务器、浏览器等']
      ]},
      {t:'p',x:'<b>Shell</b> 是用户与内核之间的「翻译 + 脚本语言」。你敲 <code>ls</code>，Shell 找到程序、启动进程，程序再通过 glibc 调内核去读目录。理解这条链，就知道为什么「命令不存在」常常是 PATH 或包没装的问题。'},
      {t:'note',kind:'tip',k:'用户态崩了不会拖垮内核',x:'和 Windows 一样，用户态程序崩溃（Segmentation fault）只杀死自己；但<b>有 Bug 的内核模块（.ko）崩溃会 Kernel Panic</b>，整机挂起。所以内核模块要格外谨慎。'},
      {t:'faq',q:'内核和 Shell 哪个更重要？',a:'都重要但层级不同：<b>内核是地基</b>，没有它什么都不是；<b>Shell 是默认入口</b>，没有它你也能写程序直接调 syscall。日常运维里 Shell 是最高频工具，但出问题时你最终要回到内核视角。'}
    ]},
    {id:'linux-2-2',num:'2.2',title:'一切皆文件',lead:'Unix 哲学里最强大的一条约定。',tags:['哲学'],blocks:[
      {t:'p',x:'Linux 继承 Unix 的著名设计：<b>「一切皆文件（Everything is a file）」</b>。不仅仅是磁盘文件，连硬件设备、管道、套接字、甚至内核参数，都表现为文件系统中的某个路径，可用同一套读写接口操作。'},
      {t:'table',head:['「文件」','实际是什么','怎么用'],rows:[
        ['<code>/dev/sda</code>','第一块硬盘','像文件一样读写整个磁盘'],
        ['<code>/dev/ttyUSB0</code>','串口设备','打开即操作串口'],
        ['<code>/proc/cpuinfo</code>','内核导出的 CPU 信息','cat 即可读'],
        ['<code>/sys/...</code>','内核可调参数','echo 改值即生效'],
        ['<code>/dev/null</code>','黑洞','重定向丢弃数据']
      ]},
      {t:'p',x:'这套抽象的好处是<b>统一的工具链</b>：<code>cat</code>、<code>dd</code>、<code>grep</code> 既能读文本也能读设备。比如 <code>cat /dev/sda > image.img</code> 就能把整块硬盘镜像下来——也正因为太强，<code>dd</code> 被戏称「磁盘毁灭命令」。'},
      {t:'note',kind:'danger',k:'dd 与设备文件很危险',x:'由于设备也表现为文件，<code>dd if=/dev/zero of=/dev/sda</code> 会<b>清空整块硬盘</b>。对 <code>/dev/</code> 下路径动手前务必三思，确认 if/of 方向。'},
      {t:'faq',q:'为什么改个内核参数要去写 /sys 或 /proc？',a:'因为这些目录是内核<b>实时导出的接口</b>：读是查看当前状态，写是下发指令。这是「一切皆文件」的体现，比专门的配置命令更通用、更可脚本化。'}
    ]},
    {id:'linux-2-3',num:'2.3',title:'用户态与内核态、系统调用',lead:'特权级的界限，安全与稳定的根基。',tags:['特权'],blocks:[
      {t:'p',x:'CPU 有特权级，Linux 主要用两级：<b>内核态（Ring 0）</b>运行内核与模块，<b>用户态（Ring 3）</b>运行普通程序。用户态程序想碰硬件（如读磁盘、开网络），必须经 <b>系统调用</b> 陷入内核。'},
      {t:'steps',items:[
        ['用户程序请求','例如 open("a.txt")','在用户态调用 glibc 封装'],
        ['陷入内核','syscall 指令','CPU 切到 Ring 0'],
        ['内核执行','VFS → 文件系统 → 驱动','真正读磁盘'],
        ['返回用户态','把结果交回','程序拿到文件描述符']
      ]},
      {t:'p',x:'这种隔离让<b>用户程序无法直接破坏系统</b>。安全边界（如 seccomp、Capabilities、SELinux）进一步限制了进程能调哪些 syscall、能碰哪些资源——这是容器安全的核心机制。'},
      {t:'note',kind:'tip',k:'strace 能看清 syscall',x:'想看一个程序到底和系统「说了什么」，用 <code>strace 程序</code> 跟踪其所有系统调用。排错「卡住/权限拒绝」时，strace 常常一针见血。'},
      {t:'faq',q:'为什么有些程序要 root 才能跑？',a:'读写特权端口（<1024）、改网络/挂载、加载内核模块等需要 <b>root 或相应 Capability</b>。普通用户权限有限，这是安全设计，不是刁难。日常应尽量 sudo 而非常驻 root。'}
    ]},
    {id:'linux-2-4',num:'2.4',title:'进程模型与 init',lead:'所有进程的祖先都是 PID 1。',tags:['进程'],blocks:[
      {t:'p',x:'Linux 启动后内核创建第一个用户态进程 <b>init（PID 1）</b>，之后所有进程都是它的后代（或由其收养的孤儿）。<b>PID 1 不能死</b>——它一死系统就恐慌（kernel panic）。'},
      {t:'table',head:['init 实现','特点'],rows:[
        ['SysV init','最老，串行启动脚本 /etc/init.d'],
        ['Upstart','Ubuntu 曾用，事件驱动'],
        ['systemd','现代主流，并行启动、依赖管理、日志集成'],
        ['OpenRC / runit','轻量，多见于 Gentoo/Artix/Alpine']
      ]},
      {t:'p',x:'现代发行版几乎都用 <b>systemd</b> 作为 PID 1：它负责挂载、服务、日志（journald）、网络（可选）、登录会话等，是一个「管得很多」的超级 init。关于它的具体用法见第 5 章。'},
      {t:'note',kind:'tip',k:'看懂进程树',x:'用 <code>ps -ef</code> 或 <code>pstree</code> 看进程树，能直观看到「谁生了我、我管着谁」。守护进程通常是 systemd 的子进程，用户程序是登录 shell 的后代。'},
      {t:'faq',q:'为什么有人讨厌 systemd？',a:'因为它「超出 init 本职」、设计中心化、日志二进制化（journal），与 Unix「小而专」的哲学相悖。但现实是它解决了并行启动、依赖、日志聚合等老大难问题，已成为主流。'}
    ]}
  ]},

  /* ================= 第 3 章 ================= */
  {id:'linux-3',num:'3',title:'文件系统与目录结构',lead:'ext4、FHS 目录树、inode、挂载——Linux 怎么组织磁盘。',sections:[
    {id:'linux-3-1',num:'3.1',title:'ext4 与常见文件系统',lead:'日志型文件系统，Linux 的默认主力。',tags:['文件系统'],blocks:[
      {t:'p',x:'<b>ext4（Fourth Extended Filesystem）</b>是 Linux 上最经典、最稳定的文件系统，带<b>日志（journal）</b>：先把元数据操作记到日志，意外断电后快速恢复一致性，不易 fsck 卡很久。'},
      {t:'table',head:['文件系统','适用'],rows:[
        ['ext4','通用默认，稳，支持大文件/大卷'],
        ['xfs','大文件/高并发场景（RHEL 默认）'],
        ['btrfs','写时复制、快照、校验，功能多但偏新'],
        ['zfs','企业级，数据完整性强（许可证与内核集成有争议）'],
        ['tmpfs','内存文件系统，重启即失（/run, /dev/shm）'],
        ['overlayfs','容器分层镜像的基石']
      ]},
      {t:'p',x:'容器镜像的分层靠 <b>overlayfs</b>：多个只读层叠一个可写层，节省空间又互不污染。理解它，就理解了「为什么容器启动快、为什么改容器文件不影响镜像」。'},
      {t:'note',kind:'warn',k:'别在意外断电后直接 fsck 破坏数据',x:'文件系统报错时应先 <code>umount</code> 再 <code>fsck</code>，且<b>fsck 有损修复可能丢文件</b>。重要数据先备份再修。ext4 的日志已大幅降低这类风险，但仍非万无一失。'},
      {t:'faq',q:'ext4 和 xfs 怎么选？',a:'<b>通用桌面/服务器选 ext4</b> 最省心；<b>大文件、高并发、大规模存储</b>（如数据库、流媒体）常选 xfs（RHEL 默认）。两者都很成熟，差异多在高负载特性。'}
    ]},
    {id:'linux-3-2',num:'3.2',title:'FHS 目录树',lead:'全世界的 Linux 都用同一套目录约定。',tags:['目录'],blocks:[
      {t:'p',x:'<b>FHS（Filesystem Hierarchy Standard）</b>规定了根目录下各目录的用途，让软件与运维跨发行版一致。记住核心几条，路就认得了。'},
      {t:'table',head:['目录','内容'],rows:[
        ['<code>/</code>','根，一切的起点'],
        ['<code>/bin /usr/bin</code>','用户基本命令'],
        ['<code>/sbin /usr/sbin</code>','系统管理命令（多需 root）'],
        ['<code>/etc</code>','系统配置（重点！）'],
        ['<code>/home</code>','普通用户家目录'],
        ['<code>/root</code>','root 的家目录'],
        ['<code>/var</code>','易变数据：日志、缓存、邮件、数据库'],
        ['<code>/tmp</code>','临时文件，重启可能清空'],
        ['<code>/proc /sys</code>','内核导出的虚拟文件系统'],
        ['<code>/dev</code>','设备文件'],
        ['<code>/mnt /media</code>','挂载点']
      ]},
      {t:'p',x:'<b>/etc</b> 是配置中枢：网络、服务、用户、计划任务的配置几乎都在这里（如 <code>/etc/fstab</code> 挂载表、<code>/etc/passwd</code> 用户、<code>/etc/ssh/</code> SSH）。改系统先来 <code>/etc</code> 看。'},
      {t:'note',kind:'tip',k:'/bin 与 /usr/bin 为什么分两家',x:'历史上 <code>/</code> 是小的启动盘、<code>/usr</code> 是大盘，所以基础命令留在 /bin。如今多为统一布局，很多发行版把 <code>/bin</code> 软链到 <code>/usr/bin</code>。知道有这回事即可。'},
      {t:'faq',q:'为什么没有 C: D: 盘符？',a:'Linux 用<b>单一根 + 挂载</b>：所有存储都「挂」到某个目录树下，没有独立字母。一块新硬盘挂到 <code>/data</code>，访问 <code>/data</code> 就是访问它——比盘符更统一。'}
    ]},
    {id:'linux-3-3',num:'3.3',title:'inode 与硬链接/软链接',lead:'文件的「身份证」与两种链接方式。',tags:['底层'],blocks:[
      {t:'p',x:'在 ext4 里，每个文件对应一个 <b>inode（索引节点）</b>，记录元数据（权限、大小、时间戳、数据块指针），而<b>文件名只是目录项到 inode 的映射</b>。这一点决定了链接的两种形态。'},
      {t:'table',head:['','硬链接','软链接（符号链接）'],rows:[
        ['本质','同一 inode 的多个名字','一个指向路径的新文件'],
        ['跨文件系统','不行','可以'],
        ['指向目录','不行（防环）','可以'],
        ['原文件删除','仍在（inode 引用计数）','失效（悬空）'],
        ['命令','<code>ln 源 目标</code>','<code>ln -s 源 目标</code>']
      ]},
      {t:'p',x:'<b>硬链接</b>让一个文件有多个名字，删除任一都不影响数据（直到最后一个链接被删）；<b>软链接</b>像个快捷方式，记录的是路径，原文件没了它就断。日常多用软链接。'},
      {t:'code',lang:'bash',x:'# 查看文件的 inode 号\nls -i file.txt\n\n# 创建硬链接（同一 inode）\nln file.txt hard.txt\n\n# 创建软链接（独立文件，指向路径）\nln -s /var/log/app.log app.log\n\n# 删除原文件后：hard.txt 仍可读；app.log 变悬空（红色闪烁）'},
      {t:'note',kind:'warn',k:'小心软链接环与误删',x:'软链接可指向目录，配置不当会形成<b>递归/环路</b>，让 <code>rm -rf</code> 或备份工具陷入死循环。对含软链接的目录做递归操作要格外小心。'},
      {t:'faq',q:'为什么硬链接不能跨文件系统？',a:'因为 <b>inode 号只在同一个文件系统内唯一</b>，跨盘后同一 inode 号指向的是别的东西。软链接存的是路径字符串，与文件系统无关，所以能跨。'}
    ]},
    {id:'linux-3-4',num:'3.4',title:'挂载与 /etc/fstab',lead:'把存储「接」到目录树的指定位置。',tags:['挂载'],blocks:[
      {t:'p',x:'Linux 里「使用一块存储」的动作叫 <b>挂载（mount）</b>：把设备（如 <code>/dev/sdb1</code>）挂到某目录（如 <code>/data</code>），此后访问该目录即访问该设备。卸载用 <code>umount</code>。'},
      {t:'code',lang:'bash',x:'# 临时挂载一个分区到 /data\nmount /dev/sdb1 /data\n\n# 查看已挂载情况\ndf -h          # 各挂载点的容量\nmount | column -t\n\n# 卸载（确保没人在用）\numount /data\n\n# 重新挂载为只读（救急/修复时常用）\nmount -o remount,ro /data'},
      {t:'p',x:'<b>/etc/fstab</b> 是开机自动挂载表，每行定义一个挂载：设备、挂载点、文件系统类型、选项、dump/pass。写错 fstab 可能导致<b>开机卡在救援模式</b>，改前务必备份并测试。'},
      {t:'table',head:['字段','含义'],rows:[
        ['设备','UUID=... 或 /dev/sdX','推荐用 UUID 避免盘序变动'],
        ['挂载点','如 /data','必须已存在的目录'],
        ['类型','ext4 / xfs / nfs ...','文件系统类型'],
        ['选项','defaults / nofail / ro ...','挂载行为'],
        ['dump / pass','0 0','备份标记 / fsck 顺序']
      ]},
      {t:'note',kind:'warn',k:'fstab 写错会开不了机',x:'给可能不存在的设备加 <b>nofail</b> 选项，避免它缺失时系统卡住；改完用 <code>mount -a</code> 测试能否全部挂载成功，再重启。'},
      {t:'ex',k:'动手练一练',items:[
        '用 <code>lsblk</code> 看清本机磁盘与分区的层级关系。',
        '给一块测试分区配 UUID 写入 fstab，用 <code>mount -a</code> 验证，再重启确认自动挂载。',
        '思考：为什么推荐 fstab 里用 UUID 而不是 /dev/sdb1？'
      ]}
    ]}
  ]},

  /* ================= 第 4 章 ================= */
  {id:'linux-4',num:'4',title:'用户、组与权限',lead:'Linux 安全模型的基座：UID/GID 与 rwx。',sections:[
    {id:'linux-4-1',num:'4.1',title:'UID/GID 与密码文件',lead:'用户与组不过是几个文本文件里的记录。',tags:['账户'],blocks:[
      {t:'p',x:'Linux 的用户与组信息主要存在几个文本文件里（现代系统用数据库加速，但逻辑一致）：'},
      {t:'table',head:['文件','内容'],rows:[
        ['<code>/etc/passwd</code>','每个用户一行：用户名:密码占位:x:UID:GID:描述:家目录:shell'],
        ['<code>/etc/shadow</code>','密码哈希与过期策略（仅 root 可读）'],
        ['<code>/etc/group</code>','组：组名:密码:GID:成员列表'],
        ['<code>/etc/gshadow</code>','组密码（少用）']
      ]},
      {t:'p',x:'<b>UID（用户 ID）</b>才是系统识别「你是谁」的依据，用户名只是给人看的。特别地，<code>UID=0</code> 即 <b>root</b>，拥有至高权限；普通用户从 1000 起。GID 同理标识组。'},
      {t:'note',kind:'tip',k:'passwd 里的 x 是什么',x:'早期密码明文存在 <code>/etc/passwd</code>，后来为安全移到 <code>/etc/shadow</code>，原处只留一个占位 <code>x</code>。所以看到 <code>x</code> 别以为没设密码——真正的哈希在 shadow 里。'},
      {t:'faq',q:'为什么有些 UID 小于 1000？',a:'<b>系统账户</b>（如 daemon、www-data、nobody）被分配小于 1000 的 UID，用于跑服务而非真人登录。它们通常无家目录或受限，降低服务被攻破后的危害。'}
    ]},
    {id:'linux-4-2',num:'4.2',title:'rwx 权限位',lead:'读/写/执行，按「用户/组/其他」三组。',tags:['权限'],blocks:[
      {t:'p',x:'每个文件/目录有 9 位基础权限，分三组各 3 位：<b>属主（u）/ 属组（g）/ 其他（o）</b>，每位是 r（读）/ w（写）/ x（执行）。用 <code>ls -l</code> 看，如 <code>-rwxr-xr--</code>。'},
      {t:'table',head:['权限','对文件','对目录'],rows:[
        ['r','可读取内容','可列出目录项（ls）'],
        ['w','可修改内容','可增删文件（需 x）'],
        ['x','可作为程序执行','可进入（cd）/ 访问内部文件']
      ]},
      {t:'p',x:'注意<b>目录的 x 很关键</b>：没有 x，即使有 r 也进不去、打不开里面的文件。权限计算可用数字：r=4,w=2,x=1，如 <code>755 = rwxr-xr-x</code>、<code>644 = rw-r--r--</code>。'},
      {t:'code',lang:'bash',x:'# 改权限：给属主读写执行、组和其他只读\nchmod 755 script.sh\n\n# 递归改目录下所有文件为 644、目录为 755\nfind . -type f -exec chmod 644 {} +\nfind . -type d -exec chmod 755 {} +\n\n# 改属主/属组\nchown user:group file.txt'},
      {t:'note',kind:'warn',k:'777 是坏习惯',x:'图省事给 <code>777</code>（所有人可读写执行）会敞开口子，任何用户/程序都能改它，<b>是安全隐患也是排错时掩盖真问题的糖衣</b>。应按需最小授权。'},
      {t:'faq',q:'为什么 root 也能读 600 的文件？',a:'因为 root 的权限检查被豁免（UID=0 几乎无视 DAC 检查）。这也意味着 root 一旦被攻陷危害极大——所以日常不该以 root 登录。'}
    ]},
    {id:'linux-4-3',num:'4.3',title:'umask 与特殊位',lead:'默认权限从哪来，以及 SUID/SGID/Sticky。',tags:['进阶'],blocks:[
      {t:'p',x:'新建文件的默认权限由 <b>umask</b> 决定：它是一组「要屏蔽的位」。常见 umask 022 → 文件默认 644、目录 755。umask 越小，默认越开放。'},
      {t:'table',head:['特殊位','含义'],rows:[
        ['SUID','程序运行时以文件属主身份执行（如 passwd 改 shadow）'],
        ['SGID','以文件属组身份执行；目录里新建文件继承该组'],
        ['Sticky','仅文件属主/root 可删（如 /tmp）']
      ]},
      {t:'p',x:'<b>SUID</b> 是「以文件主人身份跑」的危险而有用机制：<code>/usr/bin/passwd</code> 靠它让普通用户能改自己的密码（写只有 root 能写的 shadow）。但它也是提权攻击的重灾区——不该给的 SUID 要清掉。'},
      {t:'code',lang:'bash',x:'# 查看 umask\numask            # 如 0022\n\n# 设置 SUID（4）、SGID（2）、Sticky（1）的数字前缀\nchmod 4755 prog   # 设 SUID\nchmod 2775 dir    # 设 SGID（目录：新建文件继承组）\nchmod 1777 /tmp   # 设 Sticky\n\n# 查找系统里所有 SUID 文件（安全巡检）\nfind / -perm -4000 -type f 2>/dev/null'},
      {t:'note',kind:'danger',k:'定期审计 SUID/SGID',x:'攻击者常把恶意程序设成 SUID root 来提权。安全巡检应定期 <code>find / -perm -4000 -o -perm -2000</code> 列出所有特殊位文件，确认它们都来自可信软件。'},
      {t:'faq',q:'为什么 /tmp 权限是 1777？',a:'<b>Sticky 位</b>保证：所有人都能在 /tmp 建文件，但<b>只有文件主人能删自己的</b>，别人删不了。否则公共临时目录会被互相误删/投毒。'}
    ]},
    {id:'linux-4-4',num:'4.4',title:'sudo 与提权',lead:'不用 root 登录，也能按需拿权限。',tags:['提权'],blocks:[
      {t:'p',x:'最佳实践是<b>日常用普通用户，需要时才 sudo</b>（superuser do）。<code>sudo</code> 按 <code>/etc/sudoers</code> 规则临时提权，且<b>记录审计日志</b>——远比直接 root 登录安全可控。'},
      {t:'code',lang:'bash',x:'# 以 root 身份执行单条命令\nsudo apt update\n\n# 切到 root shell（谨慎）\nsudo -i\n\n# 以某用户身份执行（运维常用）\nsudo -u www-data php artisan queue:work'},
      {t:'p',x:'<code>/etc/sudoers</code> 定义谁能 sudo、能跑什么。强烈建议用 <code>visudo</code> 编辑（带语法校验，写错会导致所有人无法提权，甚至锁死）。可给运维组「免密 sudo 特定命令」等精细授权。'},
      {t:'table',head:['做法','评价'],rows:[
        ['日常普通用户 + sudo','✅ 推荐，可审计、可控'],
        ['root 直接登录','⚠️ 危险，日志难追溯、易误伤'],
        ['给所有人 NOPASSWD ALL','❌ 过度授权，形同虚设'],
        ['按命令精细化授权','✅ 企业最佳实践']
      ]},
      {t:'note',kind:'warn',k:'sudoers 写错会锁死系统',x:'<code>/etc/sudoers</code> 语法错误会让 <b>所有人都无法 sudo</b>，而修复它又需要 sudo——死循环。务必用 <code>visudo</code> 编辑，它会在保存时校验语法、出错则不让退出。'},
      {t:'faq',q:'sudo 和 su 有什么区别？',a:'<code>su</code> 是「切换用户」（需目标密码，su 到 root 需 root 密码）；<code>sudo</code> 是「以他人身份执行单条命令」（需自己密码 + sudoers 授权）。sudo 更可审计、更安全。'}
    ]}
  ]},

  /* ================= 第 5 章 ================= */
  {id:'linux-5',num:'5',title:'进程与系统管理',lead:'看进程、发信号、管服务——systemd 是中心。',sections:[
    {id:'linux-5-1',num:'5.1',title:'进程、线程与 PID',lead:'进程是资源的容器，PID 是它的身份证。',tags:['基础'],blocks:[
      {t:'p',x:'<b>进程（Process）</b>是运行中的程序实例，拥有独立地址空间、被分配一个唯一 <b>PID</b>。<b>线程</b>是进程内的执行流，共享地址空间。Linux 内部把线程也实现为「轻量进程（LWP）」，调度一视同仁。'},
      {t:'table',head:['查看工具','用途'],rows:[
        ['<code>ps -ef</code> / <code>ps aux</code>','快照式列出进程'],
        ['<code>top</code> / <code>htop</code>','实时动态监控（CPU/内存/负载）'],
        ['<code>pstree</code>','树状展示进程父子关系'],
        ['<code>pgrep / pidof</code>','按名查 PID']
      ]},
      {t:'p',x:'<b>父进程（PPID）</b>生下子进程；父死而子未死则被 PID 1 收养。理解这点对排查「孤儿进程」「僵尸进程（zombie）」很有用：僵尸是已退出但父未收尸的进程，占着 PID 不释放。'},
      {t:'note',kind:'tip',k:'僵尸进程怎么来的',x:'子进程退出后，父进程需用 <code>wait()</code> 回收其状态。若父进程写得不好或卡住，子进程就变成 zombie（状态 <code>Z</code>）。清理办法是修/重启父进程，杀僵尸本身没用。'},
      {t:'faq',q:'为什么 PID 会不够用？',a:'PID 有上限（<code>/proc/sys/kernel/pid_max</code>，通常很大）。正常不会耗尽，但若大量短命进程频繁创建销毁、父又不回收，可能短暂吃紧或拖慢 fork。'}
    ]},
    {id:'linux-5-2',num:'5.2',title:'ps / top / htop 监控',lead:'从快照到实时，看清资源去向。',tags:['监控'],blocks:[
      {t:'p',x:'排查卡顿/负载先看进程视图：<code>ps</code> 给某一刻的快照，<code>top/htop</code> 给实时动态。关注 CPU%、MEM%、以及 <b>负载（load average）</b>。'},
      {t:'code',lang:'bash',x:'# 按 CPU 占用排序看前 10\nps aux --sort=-%cpu | head -11\n\n# 实时，按内存排序（top 内按 M）\ntop\n\n# 更友好、支持鼠标/颜色\nhtop\n\n# 看某进程打开了哪些文件（排错利器）\nlsof -p <PID>\n# 看哪个进程占了某端口\nss -ltnp | grep :8080'},
      {t:'table',head:['指标','含义 / 警戒'],rows:[
        ['load average','1/5/15 分钟平均就绪进程数；>CPU 核数表示饱和'],
        ['%CPU','单进程占用，多核可超 100%'],
        ['RES / %MEM','常驻内存，看是否内存泄漏'],
        ['TIME+','累计 CPU 时间，揪出长跑高耗进程']
      ]},
      {t:'note',kind:'tip',k:'load 高不一定 CPU 满',x:'<b>负载高可能是 I/O 瓶颈</b>（磁盘/网络卡住，进程排队等 I/O）。区分办法：看 <code>%wa</code>（iowait）与 <code>si/hi</code>（软/硬中断）。I/O 等待也算进负载。'},
      {t:'faq',q:'htop 比 top 强在哪？',a:'htop 支持<b>彩色、鼠标、纵向滚动看完整命令、直接杀进程</b>，且默认按树展示；top 更通用（几乎所有机器都有）。功能上 htop 更友好，但 top 是「保底工具」。'}
    ]},
    {id:'linux-5-3',num:'5.3',title:'信号与作业控制',lead:'用信号优雅地「说话」给进程。',tags:['信号'],blocks:[
      {t:'p',x:'进程间（或内核与进程间）用<b>信号（signal）</b>沟通。最常用：<code>SIGTERM(15)</code> 礼貌请求退出、<code>SIGKILL(9)</code> 强制杀死（不可捕获）、<code>SIGHUP(1)</code> 常用于「重载配置」、<code>SIGINT(2)</code> 是 Ctrl+C。'},
      {t:'table',head:['信号','编号','作用'],rows:[
        ['SIGINT','2','终端中断（Ctrl+C），可捕获'],
        ['SIGTERM','15','终止请求，进程可清理后退出'],
        ['SIGKILL','9','强制杀死，无法捕获/清理'],
        ['SIGHUP','1','挂断/重载配置（守护进程惯例）'],
        ['SIGSTOP','19','暂停（Ctrl+Z），不可捕获']
      ]},
      {t:'p',x:'<b>作业控制</b>让你在终端里前后台切换：<code>Cmd &</code> 后台跑、<code>Ctrl+Z</code> 暂停、<code>jobs</code> 看列表、<code>fg</code> 拉回前台、<code>bg</code> 后台继续。<code>nohup</code> 让进程脱离终端、退出登录后仍运行。'},
      {t:'code',lang:'bash',x:'# 优雅终止某进程（先 TERM 再 KILL）\nkill -15 <PID> && sleep 2 && kill -9 <PID>\n\n# 按名批量终止\nsudo pkill -15 nginx\n\n# 后台运行 + 忽略挂断\nnohup long_task.sh > task.log 2>&1 &'},
      {t:'note',kind:'warn',k:'能用 TERM 就别用 KILL',x:'<code>SIGKILL(9)</code> 不给进程清理机会（不刷盘、不释放锁、不删临时文件），可能造成数据损坏。先 <code>kill -15</code> 等几秒，不行再 <code>-9</code>。'},
      {t:'faq',q:'为什么 kill 9 有时也杀不掉？',a:'因为 <b>SIGKILL 只能杀用户态进程</b>。若进程卡在内核态（如不可中断的 I/O，状态 D），信号排队直到它返回；只有重启能解决 D 状态卡死。'}
    ]},
    {id:'linux-5-4',num:'5.4',title:'systemd 与服务管理',lead:'现代 init 兼管服务、日志、挂载、登录。',tags:['systemd'],blocks:[
      {t:'p',x:'<b>systemd</b> 是当今绝大多数发行版的 PID 1 与系统管理器。它用<b>单元（unit）</b>描述一切：<code>.service</code>（服务）、<code>.socket</code>、<code>.mount</code>、<code>.timer</code>（定时）等。服务管理都围绕它。'},
      {t:'table',head:['命令','作用'],rows:[
        ['<code>systemctl start/stop nginx</code>','启/停服务'],
        ['<code>systemctl enable/disable</code>','开/关开机自启'],
        ['<code>systemctl status nginx</code>','看状态与最近日志'],
        ['<code>systemctl restart/reload</code>','重启 / 重载配置'],
        ['<code>journalctl -u nginx</code>','看该服务日志'],
        ['<code>systemctl --failed</code>','列出启动失败的服务']
      ]},
      {t:'p',x:'一个服务单元文件长这样：<code>[Unit]</code> 描述与依赖、<code>[Service]</code> 写执行命令/用户/重启策略、<code>[Install]</code> 写开机启用方式。把自研程序做成服务，就能像系统服务一样启停、开机自启、崩溃自动重启。'},
      {t:'code',lang:'bash',x:'# /etc/systemd/system/myapp.service 示例片段\n[Unit]\nDescription=My App\nAfter=network.target\n\n[Service]\nExecStart=/usr/bin/python3 /opt/myapp/app.py\nUser=myapp\nRestart=on-failure\n\n[Install]\nWantedBy=multi-user.target\n\n# 启用并启动\nsudo systemctl daemon-reload\nsudo systemctl enable --now myapp'},
      {t:'note',kind:'tip',k:'日志都在 journald',x:'systemd 自带 <b>journald</b> 集中收集所有服务与内核日志，用 <code>journalctl</code> 查。想持久化日志需配置 <code>/etc/systemd/journald.conf</code> 的 Storage=persistent（默认可能仅内存）。'},
      {t:'faq',q:'服务起不来怎么查？',a:'三步走：<code>systemctl status 名</code> 看退出码与报错；<code>journalctl -u 名 -xe</code> 看详细日志；<code>systemctl cat 名</code> 看实际单元文件。绝大多数问题在这三步里浮现。'}
    ]}
  ]},

  /* ================= 第 6 章 ================= */
  {id:'linux-6',num:'6',title:'软件包管理',lead:'apt / dnf / pacman 各管各的，源码编译是兜底。',sections:[
    {id:'linux-6-1',num:'6.1',title:'包管理的思想',lead:'依赖、仓库、版本——为什么不用到处下安装包。',tags:['概念'],blocks:[
      {t:'p',x:'<b>包管理器</b>把软件及其<b>依赖</b>打包、登记到「仓库（repository）」，统一下载、安装、升级、卸载。它解决了 Windows 时代「到处找 exe、DLL 地狱」的痛点：依赖自动解析、版本集中可查。'},
      {t:'table',head:['概念','含义'],rows:[
        ['仓库','软件包的集中来源（官方/第三方）'],
        ['依赖','装 A 需先装 B/C，管理器自动解决'],
        ['元数据','版本、依赖、大小、签名信息'],
        ['缓存','已下载包缓存在本地（/var/cache/...）'],
        ['签名','校验包来源与完整性，防篡改']
      ]},
      {t:'p',x:'操作前先 <code>update/refresh</code> 刷新仓库索引，再 <code>upgrade</code> 升级。<b>生产机升级要谨慎</b>：先评估、可先在测试机验证，避免一次升级把服务搞挂。'},
      {t:'note',kind:'warn',k:'别混用不同包管理器',x:'同一系统不要同时用 apt 和 dnf 装包——它们的依赖数据库独立，会<b>互相覆盖、制造冲突</b>。一台机器认准一套包管理器。'},
      {t:'faq',q:'为什么 Linux 很少中「流氓软件捆绑」？',a:'因为软件来自<b>受审的仓库</b>，安装由包管理器统一管辖，没有「下一步下一步」的捆绑陷阱。这也是 Linux 桌面更干净的原因之一。'}
    ]},
    {id:'linux-6-2',num:'6.2',title:'apt（Debian / Ubuntu）',lead:'dpkg 之上的高层管理器。',tags:['apt'],blocks:[
      {t:'p',x:'Debian 系用 <code>dpkg</code>（底层，管单个 .deb）与 <code>apt</code>（高层，管依赖与仓库）。日常用 apt 即可。'},
      {t:'table',head:['命令','作用'],rows:[
        ['<code>sudo apt update</code>','刷新仓库索引（必先做）'],
        ['<code>sudo apt upgrade</code>','升级已装包'],
        ['<code>sudo apt install 包</code>','安装（自动装依赖）'],
        ['<code>sudo apt remove / purge</code>','卸载 / 卸载并清配置'],
        ['<code>apt search 词</code>','搜包'],
        ['<code>apt list --installed</code>','列出已装']
      ]},
      {t:'code',lang:'bash',x:'# 安装 nginx 并设为开机启动（服务由包自带 unit）\nsudo apt update\nsudo apt install -y nginx\nsudo systemctl enable --now nginx\n\n# 加第三方仓库（示例：NodeSource）\ncurl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -\nsudo apt install -y nodejs'},
      {t:'note',kind:'tip',k:'autoremove 清理孤儿依赖',x:'卸载后用 <code>sudo apt autoremove</code> 清掉不再被需要的依赖包，保持系统整洁。但确认列表里没有你仍要的「被误判孤儿」包。'},
      {t:'faq',q:'apt 和 apt-get 有区别吗？',a:'<code>apt</code> 是面向人的更友好封装（进度条、彩色）；<code>apt-get</code> 更稳定、适合脚本。日常推荐 apt，脚本里用 apt-get 更可预测。'}
    ]},
    {id:'linux-6-3',num:'6.3',title:'dnf / yum 与 pacman',lead:'Red Hat 系与 Arch 系各自一套。',tags:['dnf/pacman'],blocks:[
      {t:'p',x:'Red Hat 系（Fedora/RHEL/Rocky/Alma）用 <code>dnf</code>（新，yum 的继任者，底层仍是 rpm）；Arch 系用 <code>pacman</code>（简洁、滚动更新）。命令形态不同，但思路一致。'},
      {t:'table',head:['操作','dnf（Red Hat 系）','pacman（Arch 系）'],rows:[
        ['刷新索引','<code>dnf check-update</code>','<code>pacman -Sy</code>'],
        ['安装','<code>dnf install 包</code>','<code>pacman -S 包</code>'],
        ['升级全部','<code>dnf upgrade</code>','<code>pacman -Syu</code>'],
        ['卸载','<code>dnf remove 包</code>','<code>pacman -Rs 包</code>'],
        ['搜索','<code>dnf search 词</code>','<code>pacman -Ss 词</code>']
      ]},
      {t:'p',x:'<b>Arch 的滚动更新</b>意味着没有「大版本」概念，永远追最新。好处是软件新，风险是<b>某次更新可能破坏系统</b>，对稳定性要求高的服务器慎用，需勤备份。'},
      {t:'note',kind:'warn',k:'pacman -Syu 与部分更新',x:'Arch 不推荐「只更新部分包」——依赖是整体一致的，<b>部分更新易断依赖</b>。要么整体 <code>-Syu</code>，要么不更新。企业服务器多半选固定版本周期的发行版而非滚动。'},
      {t:'faq',q:'yum 和 dnf 现在用哪个？',a:'新系统用 <code>dnf</code>（更快、依赖解析更好），<code>yum</code> 多为指向 dnf 的兼容别名。写脚本用 dnf 即可。'}
    ]},
    {id:'linux-6-4',num:'6.4',title:'从源码编译',lead:'当仓库没有你需要的版本或补丁。',tags:['源码'],blocks:[
      {t:'p',x:'当仓库版本太旧、或需要自定义编译选项，就要<b>从源码编译</b>。经典三步走：<code>configure → make → make install</code>（Autotools 系），或用 CMake / 语言的包管理器。'},
      {t:'code',lang:'bash',x:'# Autotools 经典三连\n./configure --prefix=/usr/local\nmake -j$(nproc)\nsudo make install\n\n# CMake 项目\ncmake -B build -DCMAKE_BUILD_TYPE=Release\ncmake --build build -j$(nproc)\nsudo cmake --install build'},
      {t:'p',x:'编译前用包管理器装好<b>构建依赖</b>（如 Debian 的 <code>build-essential</code>、Red Hat 的 <code>Development Tools</code>、头文件包 <code>*-dev</code>/<code>*-devel</code>）。否则 <code>configure</code> 会报缺库。'},
      {t:'table',head:['注意点','说明'],rows:[
        ['装到哪','<code>--prefix</code> 建议 /usr/local，避免覆盖系统包'],
        ['依赖头文件','需要 <code>库名-dev</code>（Debian）或 <code>库名-devel</code>（Red Hat）'],
        ['卸载','源码装的包包管理器管不到，最好用 checkinstall 或记录文件'],
        ['容器/CI','用多阶段构建，最终镜像只留产物']
      ]},
      {t:'note',kind:'warn',k:'源码安装难卸载、难追溯',x:'源码 <code>make install</code> 的文件<b>包管理器不知道</b>，日后升级/卸载都很麻烦。优先考虑官方仓库、PPA/第三方仓库、或容器；源码编译作为最后手段，并做好记录。'},
      {t:'faq',q:'包管理装的和源码装的有冲突吗？',a:'可能。两者装到同一路径会互相覆盖。约定俗成源码放 <code>/usr/local</code>、包管放 <code>/usr</code>，且 PATH 里 /usr/local 在前。若冲突，优先保留包管理版本，源码包另辟路径。'}
    ]}
  ]},

  /* ================= 第 7 章 ================= */
  {id:'linux-7',num:'7',title:'命令行与 Shell',lead:'管道、重定向、文本三剑客——Linux 生产力的核心。',sections:[
    {id:'linux-7-1',num:'7.1',title:'bash 基础与快捷键',lead:'最常见 Shell，以及让它好用的几个键。',tags:['bash'],blocks:[
      {t:'p',x:'<b>bash（Bourne Again Shell）</b>是最普及的 Shell。它既是交互解释器，也是脚本语言。掌握几个快捷键能极大提速。'},
      {t:'table',head:['快捷键','作用'],rows:[
        ['<code>Ctrl+R</code>','反向搜索历史命令'],
        ['<code>Ctrl+A / Ctrl+E</code>','跳到行首 / 行尾'],
        ['<code>Ctrl+U / Ctrl+K</code>','删光标前 / 后'],
        ['<code>Tab</code>','自动补全命令/路径'],
        ['<code>Ctrl+L</code>','清屏（同 clear）'],
        ['<code>!!</code>','重复上一条命令（常配 sudo）']
      ]},
      {t:'p',x:'<b>环境变量</b>影响行为：<code>PATH</code> 决定去哪找命令、<code>HOME</code> 是家目录、<code>LANG</code> 是语言。它们定义在 <code>~/.bashrc</code>（交互）、<code>/etc/profile</code>（全局）等文件里。'},
      {t:'code',lang:'bash',x:'# 查看与追加 PATH\nexport PATH="$PATH:/opt/mytools"\n\n# 把别名写进 ~/.bashrc\necho "alias ll=\'ls -alF\'" >> ~/.bashrc\nsource ~/.bashrc\n\n# 上条命令忘了加 sudo？\nsudo !!'},
      {t:'note',kind:'tip',k:'bashrc 与 profile 的区别',x:'<code>~/.bash_profile</code>/<code>~/.profile</code> 在<b>登录 shell</b>加载；<code>~/.bashrc</code> 在<b>交互非登录 shell</b>加载。很多发行版让 profile 顺带 source bashrc，确保二者都生效。'},
      {t:'faq',q:'为什么有时改了 bashrc 不生效？',a:'因为要重新加载：<code>source ~/.bashrc</code> 或新开终端。另外若以<b>登录 shell</b>启动且 profile 没 source bashrc，改动也不会自动应用——检查 profile 是否包含 source bashrc。'}
    ]},
    {id:'linux-7-2',num:'7.2',title:'管道与重定向',lead:'把小工具串成流水线，是 Unix 的精髓。',tags:['管道'],blocks:[
      {t:'p',x:'<b>管道（|）</b>把一个命令的标准输出接到下一个的标准输入；<b>重定向（>、>>、<）</b>把输入输出接到文件。两者结合，就能用一堆小工具拼出强大处理，而不必写大程序。'},
      {t:'table',head:['符号','含义'],rows:[
        ['<code>cmd1 | cmd2</code>','管道：cmd1 输出 → cmd2 输入'],
        ['<code>> file</code>','覆盖写入文件'],
        ['<code>>> file</code>','追加写入文件'],
        ['<code>2>&1</code>','把 stderr 合并到 stdout'],
        ['<code>< file</code>','从文件读取 stdin'],
        ['<code>&></code>','stdout+stderr 一起重定向']
      ]},
      {t:'code',lang:'bash',x:'# 统计 nginx 访问日志里访问最多的 IP 前 10\ncat access.log | awk \'{print $1}\' | sort | uniq -c | sort -rn | head -10\n\n# 监控某关键字的实时出现\ntail -f app.log | grep --line-buffered ERROR\n\n# 把错误也写进日志文件\nsome_cmd &> run.log'},
      {t:'note',kind:'tip',k:'理解 stdin/stdout/stderr 三个流',x:'每个进程默认有 0=stdin、1=stdout、2=stderr。<code>2>&1</code> 就是把 2 号流指向 1 号流的目标。排错时常把 stderr 也重定向到文件，避免错误跑到屏幕又没记录。'},
      {t:'faq',q:'为什么管道里 grep 有时不实时？',a:'因为管道有<b>缓冲</b>。用 <code>grep --line-buffered</code> 或 <code>stdbuf -oL</code> 强制按行刷新，配合 <code>tail -f</code> 才能实时看到输出。这是排「实时日志过滤不刷新」的关键。'}
    ]},
    {id:'linux-7-3',num:'7.3',title:'grep / find / sed / awk',lead:'文本四件套，处理日志与数据的标配。',tags:['文本'],blocks:[
      {t:'p',x:'这四个是 Linux 文本处理的「四件套」，几乎每天都会用到。它们各有所长，常常串联。'},
      {t:'table',head:['工具','一句话'],rows:[
        ['<code>grep</code>','按模式搜索文本（支持正则）'],
        ['<code>find</code>','按条件找文件（名字/时间/大小/权限）'],
        ['<code>sed</code>','流编辑器，做替换/删除等批量改动'],
        ['<code>awk</code>','按列处理结构化文本，还能计数/聚合']
      ]},
      {t:'code',lang:'bash',x:'# 在代码中递归搜某函数（显示行号）\ngrep -rn "my_func" src/ --include="*.c"\n\n# 找 7 天内修改、大于 10MB 的文件\nfind /data -type f -mtime -7 -size +10M\n\n# 把所有 foo 替换成 bar（仅打印，不动文件）\nsed \'s/foo/bar/g\' file.txt\n\n# 按冒号切分，打印第 1 列并去重计数\nawk -F: \'{print $1}\' access.log | sort | uniq -c'},
      {t:'note',kind:'tip',k:'sed -i 会直接改文件',x:'<code>sed -i</code> 原地修改文件，<b>改前最好先备份或先不加 -i 看效果</b>。批量替换配置文件时，先 <code>sed</code> 打印确认无误，再 <code>-i</code> 落盘。'},
      {t:'ex',k:'动手练一练',items:[
        '用 grep 在本工程目录里找出所有「TODO」注释并带行号列出。',
        '用 find + du 找出占用空间最大的前 5 个目录。',
        '用 awk 算一个 CSV 文件某数值列的总和。',
        '思考：为什么文本四件套能「组合」出强大功能，而 GUI 工具难做到？'
      ]}
    ]},
    {id:'linux-7-4',num:'7.4',title:'写一个实用的 Shell 脚本',lead:'把重复命令变成可复用的脚本。',tags:['脚本'],blocks:[
      {t:'p',x:'脚本就是把命令按顺序写进 <code>.sh</code> 文件，开头用 <code>#!/bin/bash</code>（shebang）声明解释器。赋予执行权限后即可运行。它是把「手工操作」固化为「可重复流程」的基本功。'},
      {t:'code',lang:'bash',x:'#!/bin/bash\n# backup.sh —— 每日备份某目录到带日期的压缩包\nset -euo pipefail   # 出错即停、未定义变量报错、管道失败也算错\nSRC="/var/www"\nDST="/backup/www_$(date +%F).tar.gz"\ntar -czf "$DST" "$SRC"\necho "已备份: $DST ($(du -h "$DST" | cut -f1))"'},
      {t:'table',head:['技巧','作用'],rows:[
        ['<code>set -e</code>','命令失败立即退出，避免错误被掩盖'],
        ['<code>"$var"</code> 加引号','防含空格的路径被拆成多参数'],
        ['<code>$()</code>','命令替换，捕获输出'],
        ['<code>chmod +x</code>','赋予执行权限']
      ]},
      {t:'code',lang:'bash',x:'# 运行脚本\nchmod +x backup.sh\n./backup.sh\n\n# 用 cron/systemd timer 每日 3 点执行（见 5.4）'},
      {t:'note',kind:'warn',k:'脚本里的变量一定要加引号',x:'<code>rm -rf $DIR/</code> 若 DIR 为空或含空格，会变成 <code>rm -rf /</code> 灾难。<b>始终用双引号包裹变量</b>，并配合 <code>set -euo pipefail</code> 让脚本更健壮。'},
      {t:'faq',q:'bash 脚本和 Python 脚本怎么选？',a:'<b>简单串命令/系统任务用 bash</b>（直接调系统工具、快）；<b>复杂逻辑、数据处理、跨平台用 Python</b>。很多运维脚本是「bash 调度 + Python 干重活」的组合。'}
    ]}
  ]},

  /* ================= 第 8 章 ================= */
  {id:'linux-8',num:'8',title:'网络与远程',lead:'ip / ss / SSH / 防火墙——联网与远程的基本功。',sections:[
    {id:'linux-8-1',num:'8.1',title:'IP 配置与 ip / ss 命令',lead:'弃用 ifconfig，拥抱 iproute2。',tags:['网络'],blocks:[
      {t:'p',x:'现代 Linux 用 <code>iproute2</code> 套件管理网络，主命令是 <code>ip</code>；旧工具 <code>ifconfig/netstat</code> 已被标记为过时（deprecated）但很多系统仍保留。'},
      {t:'table',head:['任务','新命令（iproute2）','旧命令'],rows:[
        ['看网卡/IP','<code>ip addr</code>','ifconfig'],
        ['看路由','<code>ip route</code>','route'],
        ['看端口','<code>ss -ltnp</code>','netstat -ltnp'],
        ['管理网卡','<code>ip link set eth0 up</code>','ifup/ifconfig up']
      ]},
      {t:'p',x:'网络配置通常由 <code>NetworkManager</code> 或 <code>systemd-networkd</code> 管理，持久化写在 <code>/etc/netplan/</code>（Ubuntu）、<code>/etc/NetworkManager/</code> 或 <code>/etc/systemd/network/</code>。改完用 <code>ip</code> 验证。'},
      {t:'code',lang:'bash',x:'# 看所有网卡与 IP\nip -br addr\n\n# 看默认路由与网关\nip route show default\n\n# 看谁在监听 80/443 端口\nss -ltnp | grep -E \':80|:443\'\n\n# 临时加一个 IP（重启失效）\nip addr add 192.168.1.100/24 dev eth0'},
      {t:'note',kind:'tip',k:'排「端口被占」用 ss',x:'服务起不来报「address already in use」，用 <code>ss -ltnp | grep :端口</code> 立刻看到<b>哪个进程 PID/程序占了端口</b>。这是排启动冲突最快的方法。'},
      {t:'faq',q:'为什么 ifconfig 还能用却说它过时？',a:'因为 <code>net-tools</code>（ifconfig/netstat）多年未维护、功能不全（不支持新特性如 VRF、多路由表）。<code>iproute2</code> 是其官方继任者，新脚本应改用 <code>ip/ss</code>。'}
    ]},
    {id:'linux-8-2',num:'8.2',title:'SSH 远程登录与密钥',lead:'安全远程管理的基石。',tags:['SSH'],blocks:[
      {t:'p',x:'<b>SSH（Secure Shell）</b>是 Linux 远程管理的标准：加密通道 + 身份认证。日常 <code>ssh 用户@主机</code> 登录，<code>scp/sftp</code> 传文件。'},
      {t:'table',head:['操作','命令'],rows:[
        ['登录','<code>ssh user@host</code>'],
        ['指定端口','<code>ssh -p 2222 user@host</code>'],
        ['传文件','<code>scp file user@host:/path</code>'],
        ['免密登录','配公钥到对方 ~/.ssh/authorized_keys'],
        ['端口转发','<code>ssh -L/-R</code> 隧道']
      ]},
      {t:'p',x:'<b>密钥登录</b>比密码安全得多：本地生成 <code>ssh-keygen</code> 一对密钥，把公钥放到服务器的 <code>~/.ssh/authorized_keys</code>。之后可禁用密码登录，挡掉暴力破解。'},
      {t:'code',lang:'bash',x:'# 生成密钥对（默认 ~/.ssh/id_rsa）\nssh-keygen -t ed25519 -C "my@key"\n\n# 把公钥上传到服务器（自动追加到 authorized_keys）\nssh-copy-id user@host\n\n# 之后即可免密登录\nssh user@host\n\n# 服务端建议：改 /etc/ssh/sshd_config 关密码登录\n# PasswordAuthentication no   # 确认密钥可用后再改！'},
      {t:'note',kind:'warn',k:'关密码登录前先确认密钥能用',x:'很多人「先改配置禁用密码、再测密钥」结果把自己锁门外。<b>顺序反了</b>：先确保密钥能登、保留一个会话，再禁用密码，最后测试新连接。改 sshd_config 后 <code>systemctl reload sshd</code>。'},
      {t:'faq',q:'SSH 隧道（端口转发）有什么用？',a:'可以把远端服务「映射」到本地端口（<code>-L</code>），或把本地服务暴露给远端（<code>-R</code>）。常用于<b>安全访问内网数据库、绕过限制、加密不明网络</b>。这也是前面 JNL OS 用 SSH 进 QEMU 虚机的同类思路。'}
    ]},
    {id:'linux-8-3',num:'8.3',title:'防火墙：iptables / nftables / firewalld',lead:'控制谁能连进来、数据往哪走。',tags:['防火墙'],blocks:[
      {t:'p',x:'Linux 防火墙内核层是 <b>netfilter</b>，用户层工具有两代：老牌 <code>iptables</code> 与新一代 <code>nftables</code>（性能更好、语法统一）。发行版再包一层：Red Hat 系常用 <code>firewalld</code>，Ubuntu 常用 <code>ufw</code>（iptables 的友好前端）。'},
      {t:'table',head:['层','工具'],rows:[
        ['内核','netfilter'],
        ['规则引擎','iptables（旧）/ nftables（新）'],
        ['前端','ufw（Debian/Ubuntu）、firewalld（Red Hat）'],
        ['概念','表(table) → 链(chain) → 规则(rule)']
      ]},
      {t:'code',lang:'bash',x:'# ufw（简单，Ubuntu 推荐）\nsudo ufw allow 22/tcp\nsudo ufw allow 80,443/tcp\nsudo ufw enable\nsudo ufw status\n\n# firewalld（Red Hat）\nsudo firewall-cmd --add-port=8080/tcp --permanent\nsudo firewall-cmd --reload\n\n# 查看 nftables 规则（底层）\nsudo nft list ruleset'},
      {t:'p',x:'默认策略一般是<b>入站拒绝、出站允许</b>（或仅放开已建立的连接）。开一个服务，记得放行对应端口，否则外网联不进来。云服务器还要注意<b>安全组（云平台侧）</b>这层额外的墙。'},
      {t:'note',kind:'warn',k:'云服务器有「双重防火墙」',x:'你在系统里放行了 22，但若<b>云平台安全组没放</b>，照样连不上。排「明明开了端口却连不上」时，别忘查安全组/网络 ACL 这层云侧规则。'},
      {t:'faq',q:'nftables 会取代 iptables 吗？',a:'是的，主流发行版正迁移到 <code>nftables</code>（iptables 多以兼容层存在）。新部署建议直接学 nftables/firewalld/ufw，不必深抠旧的 iptables 细枝末节。'}
    ]},
    {id:'linux-8-4',num:'8.4',title:'网络排错工具',lead:'ping / dig / curl / traceroute 的分工。',tags:['排错'],blocks:[
      {t:'p',x:'网络不通时按「分层」逐一排查：连通性 → 路由路径 → DNS → 应用层。每个环节有对应工具。'},
      {t:'table',head:['现象','先试','说明'],rows:[
        ['完全不通','<code>ping 8.8.8.8</code>','查基础 IP 连通（ICMP）'],
        ['能 ping IP 但打不开域名','<code>dig 域名</code> / <code>nslookup</code>','查 DNS 解析'],
        ['连得上但慢/绕路','<code>traceroute 主机</code>','看路径与卡在哪跳'],
        ['HTTP 服务异常','<code>curl -v URL</code>','看请求/响应细节'],
        ['端口是否监听','<code>ss -ltnp</code>','查本机监听']
      ]},
      {t:'code',lang:'bash',x:'# 测 DNS 解析（看返回的 IP 与耗时）\ndig +short example.com\n\n# 看 HTTP 各阶段耗时与响应头\ncurl -w "time_total=%{time_total}\\n" -o /dev/null -s https://example.com\n\n# 跟踪到目标的路径\ntraceroute -I 8.8.8.8\n\n# 测某端口是否可连（TCP 握手）\ncurl -v telnet://host:3306'},
      {t:'note',k:'ICMP 可能被禁，ping 不通≠网络断',x:'很多服务器/云<b>禁了 ICMP</b>，导致 <code>ping</code> 不通但实际 TCP 服务正常。别只靠 ping 下结论，要用 <code>curl/ss/telnet</code> 测真实端口。'},
      {t:'ex',k:'动手练一练',items:[
        '模拟一次「网页打不开」：先用 dig 查 DNS，再用 curl -v 看卡在 DNS/TLS/连接哪一步。',
        '用 ss 找出本机所有监听端口，对照 systemctl status 看服务是否真在跑。',
        '思考：为什么「能上微信却打不开网页」多半是 DNS 问题，而「ping 通 IP 却打不开网页」也指向 DNS？'
      ]}
    ]}
  ]},

  /* ================= 第 9 章 ================= */
  {id:'linux-9',num:'9',title:'启动流程与排错',lead:'从加电到登录：引导、initramfs、日志与救援。',sections:[
    {id:'linux-9-1',num:'9.1',title:'BIOS/UEFI 与引导',lead:'加电后第一棒交给谁。',tags:['引导'],blocks:[
      {t:'p',x:'开机后，固件（<b>BIOS</b> 老旧 / <b>UEFI</b> 现代）先做加电自检（POST），然后从启动设备加载<b>引导加载器（bootloader）</b>。UEFI 还支持安全启动（Secure Boot），验证引导程序签名。'},
      {t:'table',head:['阶段','负责'],rows:[
        ['POST','固件自检硬件'],
        ['固件','找启动设备，加载引导器'],
        ['引导加载器','GRUB2：选内核、传参数'],
        ['内核','解压、初始化、挂根文件系统'],
        ['initramfs','临时根，加载驱动/解密'],
        ['PID 1','systemd 接管，拉起系统']
      ]},
      {t:'p',x:'<b>UEFI + GPT</b> 已是新机器标准：启动更快、支持大磁盘、Secure Boot 可防引导级恶意软件。老旧 BIOS + MBR 仍在兼容场景。理解这层有助于排「开机卡在黑屏/进不了系统」。'},
      {t:'note',kind:'warn',k:'Secure Boot 与自定义内核/驱动',x:'开启 Secure Boot 后，<b>未签名的内核模块（如某些显卡/NVIDIA 驱动、自编译内核）可能无法加载</b>。这正是前面 JNL OS 把「NVIDIA 在 rc 内核上全程兼容」列为不承诺项的原因之一。'},
      {t:'faq',q:'BIOS 和 UEFI 怎么区分？',a:'看启动界面与磁盘分区：UEFI 通常配 <b>GPT</b> 分区、有 EFI 系统分区（ESP）；BIOS 配 MBR。现代机器默认 UEFI，可在固件设置里切。'}
    ]},
    {id:'linux-9-2',num:'9.2',title:'GRUB2 引导加载器',lead:'选内核、传参数、救启动的关口。',tags:['GRUB'],blocks:[
      {t:'p',x:'<b>GRUB2</b> 是主流引导加载器：开机时列出可启动项（多个内核/其他系统），并把内核与 initramfs 载入内存、传启动参数。它的配置在 <code>/boot/grub/grub.cfg</code>（一般不要手改，改 <code>/etc/default/grub</code> 后 <code>update-grub</code> 生成）。'},
      {t:'table',head:['任务','做法'],rows:[
        ['选内核/进恢复','开机按住 Shift（BIOS）或自动出现菜单（UEFI）'],
        ['临时改启动参数','编辑菜单项，在 linux 行尾加参数（如 single）'],
        ['改默认项','<code>/etc/default/grub</code> + <code>update-grub</code>'],
        ['修复 GRUB','用 Live USB 进 chroot 重装 grub']
      ]},
      {t:'p',x:'常见紧急操作：在 GRUB 菜单按 <code>e</code> 编辑，在内核行尾加 <code>init=/bin/bash</code> 或 <code>single</code> 可进入<b>单用户/救援模式</b>，绕过正常启动来修密码或 fstab。'},
      {t:'code',lang:'bash',x:'# 重装 GRUB 到磁盘（修复引导）\nsudo grub-install /dev/sda\nsudo update-grub\n\n# 在 GRUB 菜单编辑时，内核行尾加（进入单用户）\nsingle\n# 或\ninit=/bin/bash'},
      {t:'note',kind:'danger',k:'改 grub.cfg 要谨慎',x:'<b>别直接手改 grub.cfg</b>（它由工具生成，下次更新会被覆盖）。应改 <code>/etc/default/grub</code> 再 <code>update-grub</code>。写错可能导致无法列出启动项。'},
      {t:'faq',q:'双系统（Windows+Linux）引导怎么管？',a:'通常让 <b>GRUB 接管</b>：装 Linux 时把它装到 EFI 分区，GRUB 会自动探测 Windows 并加入菜单。若 Windows 更新覆盖了引导，再用 Live USB 重装 grub 即可恢复。'}
    ]},
    {id:'linux-9-3',num:'9.3',title:'initramfs 与 systemd 启动',lead:'临时根文件系统，先把根「接」起来。',tags:['启动'],blocks:[
      {t:'p',x:'<b>initramfs</b>是一个临时的早期根文件系统，内核先挂载它，在里面加载真正的磁盘/文件系统/加密/LVM 等驱动，再把控制权交给真正的根（switch_root）。没有它，内核往往找不到/解不开根文件系统。'},
      {t:'p',x:'根挂上后，内核启动 <b>PID 1（systemd）</b>，由它并行拉起各单元：挂载（<code>local-fs.target</code>）、网络（<code>network.target</code>）、多用户（<code>multi-user.target</code>）、图形（<code>graphical.target</code>）。'},
      {t:'table',head:['target','含义'],rows:[
        ['<code>basic.target</code>','基础系统就绪'],
        ['<code>multi-user.target</code>','命令行多用户（相当于旧 runlevel 3）'],
        ['<code>graphical.target</code>','带图形界面（runlevel 5）'],
        ['<code>rescue.target</code>','救援单用户模式'],
        ['<code>emergency.target</code>','紧急 shell（根只读）']
      ]},
      {t:'code',lang:'bash',x:'# 查看默认启动目标\nsystemctl get-default\n\n# 临时切到命令行模式（不重启）\nsudo systemctl isolate multi-user.target\n\n# 设默认启动为图形\nsudo systemctl set-default graphical.target'},
      {t:'note',kind:'tip',k:'卡在启动多半是这几处',x:'启动失败常见根因：<code>/etc/fstab</code> 写错（挂不上根/数据盘）、某服务 <code>enable</code> 又故障、initramfs 缺驱动（如加密/LVM）。看屏幕报错 + <code>journalctl -xb</code> 定位。'},
      {t:'faq',q:'initramfs 和 initrd 是一回事吗？',a:'功能类似，格式不同：旧 <code>initrd</code> 是镜像（块设备），新 <code>initramfs</code> 是 cpio 归档（更灵活、按需解压）。现在多统称 initramfs，更新内核后用 <code>update-initramfs -u</code>（Debian）或 <code>dracut</code>（Red Hat）重建。'}
    ]},
    {id:'linux-9-4',num:'9.4',title:'救援模式与日志',lead:'进不去系统时，怎么把门撬开。',tags:['救援'],blocks:[
      {t:'p',x:'当系统无法正常启动，有几条「撬门」路径：单用户/救援模式、Live USB chroot、以及最重要的——<b>先读日志</b>。'},
      {t:'steps',items:[
        ['看启动报错','GRUB 加 single / 进 rescue.target'],
        ['Live USB 启动','用安装盘/U 盘启动，挂载原系统'],
        ['chroot 修复','在 Live 环境 chroot 进去修 grub/fstab/密码'],
        ['读日志定位','<code>journalctl -xb</code> 看本次启动日志']
      ]},
      {t:'p',x:'<b>journalctl</b> 是 systemd 统一日志的入口：<code>journalctl -xb</code> 看「本次启动」日志（x=本次，b=启动），<code>-p err</code> 只看错误，<code>-u 服务名</code> 看某服务。排启动故障几乎必用。'},
      {t:'code',lang:'bash',x:'# 本次启动的全部日志\njournalctl -xb\n\n# 只看错误级以上\njournalctl -xb -p err\n\n# 进 Live 后挂载并 chroot 修复（示意）\nmount /dev/sda2 /mnt\nsudo chroot /mnt\n# 在里面：passwd root / 修 fstab / grub-install'},
      {t:'note',kind:'warn',k:'救援前先想「有没有备份」',x:'能进 Live 挂载数据盘，第一件事应是<b>把重要数据拷出来</b>，再做修复操作。很多「我只要修一下」最终变成「数据没了」——备份永远优先于修复。'},
      {t:'quote',x:'Linux 的启动链条很长（固件 → GRUB → 内核 → initramfs → systemd → target），但每环都有明确的日志与入口。会排错的人，不是记命令，而是知道<b>故障落在哪一环、去哪读证据</b>。'}
    ]}
  ]}

  ]
};
