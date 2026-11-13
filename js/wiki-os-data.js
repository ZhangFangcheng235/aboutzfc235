/* ==========================================================
   方程的工艺百科全书 · 操作系统篇
   课程：Java Net Lava OS（JNL OS）
   素材来源：资料库归档《JNL OS · 项目概览》《JNL OS · README》
   （依据项目仓库 README.md 与 docs/ 下 6 份文档，状态截至 2026-11-10）
   按 章.节 编号整理归纳，仅陈述文档已载明的事实
   ========================================================== */
window.WIKI_JNL = {
  id:'jnl', num:'甲', en:'COURSE I · JAVA NET LAVA OS',
  title:'Java Net Lava OS（JNL OS）',
  lead:'一个从零自研的 Linux 桌面操作系统原型：自有内核 + Buildroot 从零构建的用户空间 + NyxNiri 桌面 + 本地 AI 智能体。本篇依据项目归档文档，把它的定位、架构、构建流程与里程碑整理成可循序查阅的教程。',
  chips:['状态 2026-11-10','Linux 7.4-rc1','Buildroot 2026.08.1','QEMU 开发镜像'],
  chapters:[

  /* ================= 第 1 章 ================= */
  {id:'jnl-1',num:'1',title:'认识 JNL OS',lead:'先弄清它是什么、不是什么，以及为什么值得做。',sections:[
    {id:'jnl-1-1',num:'1.1',title:'一句话定位',lead:'一个从零自研的 Linux 桌面操作系统原型，目前跑在 QEMU 里。',tags:['绪论'],blocks:[
      {t:'p',x:'<b>JNL OS 是一个从零自研的 Linux 桌面操作系统原型。</b>它由四层构成：<b>自有内核</b>（Linux 7.4-rc1）、<b>Buildroot 从零构建的用户空间</b>、<b>NyxNiri 桌面</b>，以及规划中的<b>本地 AI 智能体</b>。产品目标被概括为一句话：<code>Linux 硬件与安全底座 + Windows 交互范式 + 本地 AI</code>。'},
      {t:'p',x:'名字的全称是 <b>Java Net Lava OS</b>，缩写 <code>JNL OS</code>。项目以源码仓库形式组织，构建产物为 <code>out/</code> 下的内核、initramfs、根文件系统镜像与验收截图。归档文档《项目概览》写明：依据仓库 <code>README.md</code> 与 <code>docs/</code> 下 6 份文档整理，状态截至 <b>2026-11-10</b>。'},
      {t:'table',head:['四个组成部分','对应实现'],rows:[
        ['Linux 硬件与安全底座','自有内核 <code>7.4.0-rc1-jnl</code>，规划 Secure Boot + LUKS2 + TPM2'],
        ['Windows 交互范式','NyxNiri 桌面壳（任务栏 / 开始菜单 / 文件管理器），规划 Wine / Proton 兼容层'],
        ['本地 AI','本地推理 + Agent 服务与 API，强调隐私、可关闭、可审计'],
        ['分发能力','软件中心 + A/B 无回梯更新 + 镜像构建']
      ]},
      {t:'note',k:'读这一篇的前提',x:'这不是一门语言教程，而是一份<b>系统工程笔记的导读</b>：它会带你读懂一个真实 OS 项目的架构决策、目录组织、构建脚本、验收方式与路线图。想复现实验，需要一台 Windows 11 + WSL2 的机器与约 30 GB 空闲磁盘。'},
      {t:'faq',q:'JNL 三个字母是什么的缩写？',a:'文档给出的全称是 <b>Java Net Lava OS</b>，因此 J / N / L 分别对应 Java、Net、Lava。归档 README 的标题即为「Java Net Lava OS (JNL OS)」，根文件系统里的系统标识也写成 <code>Java Net Lava OS 0.1</code>。'}
    ]},
    {id:'jnl-1-2',num:'1.2',title:'产品目标与四大能力',lead:'安全、兼容、AI、分发——四条并行的产品主线。',tags:['定位'],blocks:[
      {t:'p',x:'《项目概览》把目标能力列为四项：<b>安全 / 兼容 / AI / 分发</b>。它们不是同一层的东西：安全属于底座，兼容与 AI 属于桌面之上的能力，分发则决定系统能否被持续更新与交付。'},
      {t:'cards',items:[
        ['安全','Secure Boot 可信启动链 + LUKS2 磁盘加密 + TPM2 密封解锁，配套恢复流程'],
        ['兼容','Wine / Proton 运行时 + 兼容性管理器与数据库，目标是运行常见 Windows 应用'],
        ['AI','本地推理引擎 + Agent 服务与 API，用自然语言完成文件整理、设置查询、应用启动'],
        ['分发','软件中心（三后端）+ A/B 双分区更新 + 镜像构建，失败自动回滚']
      ]},
      {t:'p',x:'这四项能力分别落在里程碑 <b>M2（安全）、M4（兼容）、M5（AI）、M6（分发）</b> 上，属于中长期规划；当前（2026-11-10）完成的是 M0 阶段的镜像与桌面闭环。详见第 6 章里程碑。'},
      {t:'note',kind:'tip',k:'为什么说「Windows 交互范式」',x:'目标不是移植 Windows，而是让熟悉 Windows 的用户无须重新学习：任务栏、开始菜单、文件管理器、贴边分屏这些交互习惯被保留，底层却是 Wayland + Linux。这是 JNL OS 与常见 Linux 发行版在<b>产品定位</b>上最大的差别。'}
    ]},
    {id:'jnl-1-3',num:'1.3',title:'当前阶段：QEMU 开发镜像，不是发行版 ISO',lead:'先划清边界，避免对完成度产生误解。',tags:['边界'],blocks:[
      {t:'p',x:'《项目概览》用加粗强调了一句：<b>目前处于 QEMU 开发镜像阶段，不是可以装到实体机的发行版 ISO</b>。也就是说，现在的产物是在虚拟机里启动的 <code>bzImage</code> + <code>initramfs</code> + <code>rootfs.ext4</code>，没有安装器、没有引导器、也没有实体机硬件验证。'},
      {t:'ul',items:[
        '<b>已有</b>：可在 QEMU 中开机 → systemd → Niri → Noctalia 的完整桌面闭环，并有验收截图 <code>out/desktop.png</code>。',
        '<b>没有</b>：ISO / 安装器 / 引导器、硬件兼容性实机矩阵、Secure Boot 全链、Windows 兼容层、本地 AI Agent、软件中心与 A/B 更新。',
        '<b>参照物</b>：历史 M0 基线（Ubuntu 24.04 + GNOME 46）仅保留作对照，不作为产品路线。'
      ]},
      {t:'note',kind:'warn',k:'文档里的坑位',x:'归档文档明确提醒：远程查看时 VNC 客户端必须填 <code>127.0.0.1:5900</code> 而不是 <code>localhost:5900</code>——Windows 的 <code>localhost</code> 会优先解析到 IPv6 <code>::1</code>，而 WSL 端口转发只监听 IPv4。第 5 章会展开。'},
      {t:'faq',q:'现在能下载下来装到电脑上用吗？',a:'不能。文档把它定义为<b>操作系统原型</b>，交付物是 QEMU 镜像与构建脚本，用于开发与验收。Daily Driver（日常可用）候选是里程碑 <b>M7</b> 的目标，尚未达成。'}
    ]},
    {id:'jnl-1-4',num:'1.4',title:'资料来源与阅读顺序',lead:'本篇内容全部来自两份归档文档，可按三条线索读。',tags:['导读'],blocks:[
      {t:'p',x:'本篇依据资料库归档的 <b>《JNL OS · 项目概览》</b> 与 <b>《JNL OS · README》</b>，前者是速览（技术路线、进展、里程碑、仓库结构、版本产物、不承诺清单），后者是仓库入口说明（定位、目录、快速开始六步、当前状态清单）。'},
      {t:'steps',items:[
        ['想先懂「是什么」','第 1 章定位 + 第 2 章架构，约 10 分钟建立全局图景'],
        ['想动手复现','第 3 章环境与目录 → 第 4 章构建六步 → 第 5 章远程查看'],
        ['想看进度与规划','第 6 章已完成清单、M0–M7 里程碑、关键路径与风险']
      ]},
      {t:'p',x:'《项目概览》末尾还列出了一并归档的 6 份原始文档：<code>plan.md</code>（里程碑与门禁）、<code>status.md</code>（能力清单）、<code>build.md</code>（构建流程与 13 条环境坑）、<code>m0-acceptance.md</code>（M0 验收记录）、硬件兼容性矩阵、Buildroot 构建笔记。第 6.6 节给出完整索引。'},
      {t:'note',kind:'tip',k:'关于术语',x:'<b>NyxNiri</b> 是本项目对桌面的称呼，等于 <code>Niri 合成器 + Noctalia 桌面壳 + NyxNiri 配置</code> 三者的组合，不是单独的软件名。读到 Niri / Noctalia / NyxNiri 时按这个层次区分。'}
    ]}
  ]},

  /* ================= 第 2 章 ================= */
  {id:'jnl-2',num:'2',title:'技术路线与总体架构',lead:'2026-11-08 的路线决策如何把四层技术栈定下来。',sections:[
    {id:'jnl-2-1',num:'2.1',title:'2026-11-08 路线决策',lead:'一次关键转向：从「基于发行版」改为「全部从零」。',tags:['决策'],blocks:[
      {t:'p',x:'《项目概览》把技术路线标注为 <b>2026-11-08 路线决策（用户确认）</b>。这次决策确立了「不基于任何现有发行版」的原则：内核自己编译、用户空间用 Buildroot 从零构建、桌面只保留 NyxNiri。'},
      {t:'table',head:['层次','选型','说明'],rows:[
        ['内核','Linux 7.4-rc1（<code>7.4.0-rc1-jnl</code>）','系统中唯一内核，无发行版内核；rc 为开发基线，正式版发布后切换稳定 / LTS'],
        ['用户空间','Buildroot 2026.08.1 从零构建','<code>glibc 2.44 + GCC 15.3 + systemd</code>，不基于 Ubuntu / Arch / Debian，无 <code>dpkg/apt/pacman</code>'],
        ['桌面','仅 NyxNiri','Niri 26.04 合成器 + Noctalia 5.4.1 桌面壳 + NyxNiri 配置；<b>已弃用 GNOME 路线</b>'],
        ['目标能力','安全 / 兼容 / AI / 分发','Secure Boot + LUKS2 + TPM2、Wine/Proton、本地 AI Agent、软件中心与 A/B 更新']
      ]},
      {t:'p',x:'决策里还有一句重要注释：<b>历史 M0 基线（Ubuntu 24.04 + GNOME 46）保留为参照，不作为产品路线</b>。这解释了为什么 README 里同时存在「GNOME 桌面基线」和「新路线」两套启动脚本——前者是历史验收证据，后者才是方向。'},
      {t:'quote',x:'从「拿一个发行版改桌面」变成「自己定义从内核到桌面的每一层」，这是 JNL OS 从演示原型走向自研系统的分水岭。'},
      {t:'note',kind:'warn',k:'为什么弃用 GNOME',x:'文档只写了结论「已弃用 GNOME 路线」，未展开原因。可确证的是：M0 基线使用 <b>GNOME 46 Wayland</b> 并已完成截图验收，而新路线以 <b>Niri 滚动平铺合成器</b> 为桌面底座；里程碑 M3 的描述里也标注「桌面底座已改为 NyxNiri，本节待重写」。'}
    ]},
    {id:'jnl-2-2',num:'2.2',title:'内核层：Linux 7.4-rc1',lead:'唯一内核，rc 版本作为开发基线。',tags:['内核'],blocks:[
      {t:'p',x:'内核版本为 <b>Linux 7.4-rc1</b>，本地构建产物标识 <code>7.4.0-rc1-jnl</code>。远程验收时用 <code>uname -r</code> 实测得到的正是这个值，说明 QEMU 里跑的确实是自编译内核，而不是宿主机或发行版内核。'},
      {t:'ul',items:[
        '系统中<b>只有这一个内核</b>，不引入任何发行版预编译内核。',
        '<code>rc</code>（release candidate）是<b>开发基线</b>：文档写明正式版发布后切换到稳定 / LTS。',
        '内核产物：<code>out/bzImage</code>（18 MB）与 <code>out/initramfs.cpio.gz</code>（1.1 MB）。',
        '配置、补丁、固件清单位于仓库 <code>kernel/</code> 目录（当前为骨架，实际构建主要在 <code>scripts/</code>）。'
      ]},
      {t:'note',kind:'warn',k:'rc 内核的风险',x:'《项目概览》把「<b>rc 内核与 Wine / DXVK 图形栈抖动</b>」列为最大技术风险之一。rc 版本意味着内核 ABI 与驱动接口仍可能变动，NVIDIA 专有驱动在 rc 内核上的全程兼容也被列入「首版不承诺清单」。'},
      {t:'faq',q:'为什么用 rc 而不是稳定版？',a:'归档文档只说明「rc 为开发基线，正式版发布后切换稳定 / LTS」，未给出更细的理由。可以确定这是一条<b>有退出计划的临时选择</b>，而非长期绑定。'}
    ]},
    {id:'jnl-2-3',num:'2.3',title:'用户空间：Buildroot 从零构建',lead:'不基于任何发行版，也就没有 apt / pacman。',tags:['用户空间'],blocks:[
      {t:'p',x:'用户空间由 <b>Buildroot 2026.08.1</b> 从零构建，工具链为 <b>glibc 2.44 / GCC 15.3 / Rust 1.97.1</b>，init 系统为 <b>systemd</b>。文档特别注明 Buildroot 包的 <b>SHA256 与官方 GPG 签名清单一致</b>。'},
      {t:'p',x:'「不基于发行版」带来一个直接后果：<b>系统里没有 dpkg / apt / pacman</b>。所有软件包要么在 Buildroot 构建期编入根文件系统，要么作为自定义包放进外部树。这也是为什么 <code>buildroot-external/</code> 目录里会有一串自定义包。'},
      {t:'table',head:['组件','版本 / 内容'],rows:[
        ['Buildroot','2026.08.1'],
        ['工具链','<code>glibc 2.44</code> / <code>GCC 15.3</code> / <code>Rust 1.97.1</code>'],
        ['init 系统','systemd'],
        ['桌面组件','<code>niri 26.04</code>（vendored + 3 处本地补丁）、<code>noctalia 5.4.1</code>'],
        ['自定义包','<code>md4c</code>、<code>tomlplusplus</code>、<code>libqalculate</code>、<code>niri</code>、<code>noctalia</code>']
      ]},
      {t:'note',k:'外部树是什么',x:'<code>buildroot-external/</code> 存放 defconfig、rootfs overlay、post-build 脚本与自定义包。NyxNiri 的配置已放进 <code>buildroot-external/rootfs-overlay/home/jnl/.config/</code>，会在构建时直接写进镜像。这是「不改 Buildroot 主线、又能定制系统」的标准做法。'},
      {t:'code',lang:'bash',x:'# 生成 / 更新 Buildroot 配置（改 defconfig 后执行）\nwsl -d JNL-BUILD -u root -- bash "scripts/buildroot-configure.sh"\n\n# 后台全量构建，日志：/root/jnl-build/buildroot-build.log\nwsl -d JNL-BUILD -u root -- bash "scripts/buildroot-start.sh"\n\n# 构建产物\n# output/images/rootfs.ext4   （8 GB ext4，系统标识 Java Net Lava OS 0.1）'}
    ]},
    {id:'jnl-2-4',num:'2.4',title:'桌面层：仅 NyxNiri',lead:'Niri 合成器 + Noctalia 桌面壳 + 项目配置。',tags:['桌面'],blocks:[
      {t:'p',x:'桌面只保留 <b>NyxNiri</b>：<code>Niri 26.04</code> 作为 Wayland 合成器，<code>Noctalia 5.4.1</code> 作为桌面壳，再叠加项目自带的 NyxNiri 配置。会话链路在验收记录中被写得很清楚：'},
      {t:'steps',items:[
        ['systemd','开机后由 init 系统拉起服务'],
        ['jnl-niri.service','项目自定义的系统服务，直接启动 niri（见 2.4 说明）'],
        ['seatd → PAM / logind','完成设备权限与会话登记'],
        ['niri → Noctalia','合成器就绪后进入桌面壳，验收截图 out/desktop.png']
      ]},
      {t:'note',kind:'warn',k:'一处待修的会话问题',x:'《项目概览》在「未完成」里写明：<b><code>systemd --user</code>（<code>user@1000.service</code>）启动即静默退出</b>，dbus 会话环境不完整，目前由系统服务直接拉起 niri 绕过。这是当前架构里的一个已知绕行方案，不是最终设计。'},
      {t:'p',x:'另外，为适配 <b>QEMU 软件渲染</b>，Niri 打了 <b>3 处本地补丁</b>；<b>XWayland 尚未安装</b>，因此 X11 应用暂时不可用。NyxNiri 的完整功能（kitty、fcitx5 主题、壁纸取色、CLI 工具）也仍待补。'},
      {t:'faq',q:'Niri 和 Noctalia 分别负责什么？',a:'<b>Niri</b> 是 Wayland 合成器（负责窗口布局、滚动平铺、渲染输出），<b>Noctalia</b> 是桌面壳（提供任务栏、面板、外观等用户可见界面）。两者叠加项目配置，合称 <b>NyxNiri</b>。'}
    ]},
    {id:'jnl-2-5',num:'2.5',title:'四层架构一览',lead:'把前四节收成一张从硬件到桌面的分层图。',tags:['架构'],blocks:[
      {t:'p',x:'把 2.1–2.4 的内容自下而上叠起来，JNL OS 的技术栈可以归纳为四层。表格同时给出每层「已落地」与「规划中」的边界，避免把未来能力误读为现状。'},
      {t:'table',head:['层','已落地（2026-11-10）','规划中'],rows:[
        ['④ 应用与能力','桌面可进入、三链路远程查看','Wine/Proton 兼容层（M4）、本地 AI Agent（M5）、软件中心与 A/B 更新（M6）'],
        ['③ 桌面','Niri 26.04 + Noctalia 5.4.1 + NyxNiri 配置，QEMU 软件渲染适配 3 补丁','Windows 范式桌面 MVP：任务栏 / 开始菜单 / 文件管理器 / 贴边分屏（M3）'],
        ['② 用户空间','Buildroot 2026.08.1、glibc 2.44、GCC 15.3、systemd、<code>rootfs.ext4</code> 8 GB','Secure Boot + LUKS2 + TPM2 全链（M2）'],
        ['① 内核','Linux <code>7.4.0-rc1-jnl</code>、<code>bzImage</code> 18 MB、<code>initramfs</code> 1.1 MB','正式版 / LTS 内核、实体机硬件矩阵（M1）']
      ]},
      {t:'note',kind:'tip',k:'一条验收链',x:'判断「这一版是否真的跑起来了」，文档给出的可核查证据是：<code>uname -r</code> = <code>7.4.0-rc1-jnl</code>（内核自编译）、<code>JNL OS boot OK</code>（initramfs 闭环）、<code>out/desktop.png</code>（桌面截图）、VNC/noVNC/SSH 三链路连通。'}
    ]}
  ]},

  /* ================= 第 3 章 ================= */
  {id:'jnl-3',num:'3',title:'仓库结构与开发环境',lead:'先认路：目录地图、工具版本、开发机前提。',sections:[
    {id:'jnl-3-1',num:'3.1',title:'仓库目录地图',lead:'哪些是骨架，哪些是已落地的核心资产。',tags:['目录'],blocks:[
      {t:'p',x:'README 与《项目概览》给出同一份目录清单，并标注了每个目录的当前状态。最值得注意的两行是：<b><code>scripts/</code> 有 241 个文件，是核心资产</b>；<b><code>buildroot-external/</code> 已落地</b>，而多数功能目录仍是骨架。'},
      {t:'table',head:['目录','内容','当前情况'],rows:[
        ['<code>kernel/</code>','内核配置、补丁、固件清单','骨架（构建主要在 scripts/）'],
        ['<code>security/</code>','Secure Boot、LUKS2/TPM2、恢复流程','骨架'],
        ['<code>desktop/</code>','Shell、任务栏、开始菜单、文件管理器、设置','骨架'],
        ['<code>compat/</code>','Wine/Proton 运行时、兼容性管理器与数据库','骨架'],
        ['<code>ai/</code>','本地推理、Agent 服务与 API、隐私','骨架'],
        ['<code>distro/</code>','软件中心、A/B 更新、镜像构建','骨架'],
        ['<code>tests/</code>','内核 / 桌面 / 兼容层 / AI 测试','骨架'],
        ['<code>buildroot-external/</code>','defconfig、rootfs overlay、post-build、自定义包','<b>已落地</b>'],
        ['<code>scripts/</code>','构建与运行脚本（PowerShell + WSL Bash）','<b>241 个文件，核心资产</b>'],
        ['<code>docs/</code>','计划、状态、构建、验收、硬件矩阵、构建笔记','6 份文档'],
        ['<code>out/</code>','构建产物（不入库）','11 个文件']
      ]},
      {t:'note',k:'读目录的方法',x:'「骨架」意味着目录与职责已划分、但实现待填；真正可运行的能力集中在 <code>scripts/</code> 与 <code>buildroot-external/</code>。这符合 M0「仓库骨架 + CI + 最小可启动镜像」的完成标志。'}
    ]},
    {id:'jnl-3-2',num:'3.2',title:'关键版本与产物清单',lead:'复现实验时用来核对「我拿到的到底对不对」。',tags:['版本'],blocks:[
      {t:'p',x:'《项目概览》的「关键版本与产物」表是排查环境问题时最有用的一页，逐项抄录如下：'},
      {t:'table',head:['项','值'],rows:[
        ['Buildroot','2026.08.1（SHA256 与官方 GPG 签名清单一致）'],
        ['工具链','<code>glibc 2.44</code> / <code>GCC 15.3</code> / <code>Rust 1.97.1</code>'],
        ['桌面组件','<code>niri 26.04</code>（vendored + 3 补丁）、<code>noctalia 5.4.1</code>'],
        ['内核产物','<code>out/bzImage</code>（18 MB）、<code>out/initramfs.cpio.gz</code>（1.1 MB）'],
        ['历史镜像','<code>out/jnl-root.img</code>（12 GB ext4，Ubuntu + GNOME 基线）'],
        ['新镜像','Buildroot <code>output/images/rootfs.ext4</code>（8 GB ext4）'],
        ['验收证据','<code>out/desktop.png</code>、<code>out/desktop-serial.log</code>']
      ]},
      {t:'p',x:'新镜像的系统标识为 <code>Java Net Lava OS 0.1</code>。历史镜像 12 GB、新镜像 8 GB 的体积差，直观体现了「Ubuntu + GNOME 基线」与「Buildroot 从零 userland」的差别。'},
      {t:'ex',k:'动手核对',items:[
        '在你的构建机上找到 <code>out/</code> 目录，列出文件数，看是否接近归档文档所述的 11 个。',
        '比较两个根文件系统镜像的体积：历史 <code>jnl-root.img</code> 与新 <code>rootfs.ext4</code>，思考「从零构建」省掉了什么。',
        '打开 <code>out/desktop-serial.log</code>，找到 <code>JNL OS boot OK</code> 所在行，判断它出现在 initramfs 阶段还是桌面阶段。'
      ]}
    ]},
    {id:'jnl-3-3',num:'3.3',title:'开发机前提',lead:'Windows 11 + WSL2 + QEMU/KVM，磁盘 ≥ 30 GB。',tags:['环境'],blocks:[
      {t:'p',x:'README 的「开发机前提（Windows）」列得很具体，四条缺一不可：'},
      {t:'ul',items:[
        '<b>Windows 11 + WSL2</b>。',
        '<b>WSL 发行版：Ubuntu 24.04</b>——项目通过 <code>.wsl/</code> 下的 rootfs 导入，实例名为 <code>JNL-BUILD</code>。',
        '<b>QEMU 8.2（WSL 内）+ KVM（<code>/dev/kvm</code>）</b>；Windows 侧无需安装 QEMU。',
        '<b>磁盘：构建目录建议 ≥ 30 GB 空闲</b>。'
      ]},
      {t:'p',x:'注意这套环境是「<b>Windows 侧发命令、WSL 侧干活</b>」的双层结构：PowerShell 脚本负责调用 <code>wsl -d JNL-BUILD -u root -- bash ...</code>，真正的编译、镜像生成、QEMU 启动都发生在 WSL 内部。理解这一点，就能看懂第 4 章所有命令为什么要这样写。'},
      {t:'code',lang:'text',x:'Windows 11 (PowerShell)\n   │  wsl -d JNL-BUILD -u root -- bash <脚本>\n   ▼\nWSL2 · JNL-BUILD (Ubuntu 24.04)\n   │  gcc / buildroot / qemu-system-x86_64 -enable-kvm\n   ▼\nQEMU 虚拟机  →  bzImage + initramfs + rootfs.ext4  →  NyxNiri 桌面\n   │\n   └→ VNC 5900 / noVNC 6080 / SSH 2222 回连到 Windows 查看'},
      {t:'note',kind:'warn',k:'路径里的空格',x:'README 示例中的仓库路径含空格（<code>A_industry code/Java_Net_Lava</code>），因此所有传给 WSL 的脚本路径都<b>用双引号包住</b>。照抄命令时不要漏掉引号，否则 bash 会把路径截断。'}
    ]},
    {id:'jnl-3-4',num:'3.4',title:'构建、启动与远程入口脚本',lead:'把散落在 README 里的脚本名收成一张速查表。',tags:['脚本'],blocks:[
      {t:'p',x:'《项目概览》「开发与验证环境」把入口分成三类，README 的「快速开始」再给出具体命令。三类入口合起来就是完整工作流：'},
      {t:'table',head:['类别','脚本 / 入口','作用'],rows:[
        ['环境','<code>scripts/setup-wsl.ps1</code>','一次性导入 WSL 发行版 JNL-BUILD'],
        ['环境','<code>bootstrap-build-env.sh</code>','安装构建依赖'],
        ['构建','<code>build-kernel.sh</code> / <code>make-initramfs.sh</code>','编译内核、生成 initramfs'],
        ['构建','<code>buildroot-configure.sh</code> / <code>buildroot-start.sh</code>','配置并全量构建 Buildroot'],
        ['构建','<code>build-desktop-rootfs.sh</code>','构建历史 M0 桌面根文件系统'],
        ['启动','<code>run-console-smoke.ps1</code>','控制台冒烟（验证内核 + initramfs）'],
        ['启动','<code>run-desktop.ps1</code> / <code>run-buildroot-desktop.sh</code>','启动桌面 / 新镜像'],
        ['查看','<code>open-desktop-browser.cmd</code> / <code>vnc-check.ps1</code>','浏览器打开 noVNC / 自检 VNC']
      ]},
      {t:'note',kind:'tip',k:'先跑哪一条',x:'最短的验证闭环是 <b>setup-wsl → bootstrap → build-kernel → make-initramfs → run-console-smoke</b>，看到 <code>JNL OS boot OK</code> 即证明内核与 initramfs 打通，再进入桌面与 Buildroot 阶段。'}
    ]}
  ]},

  /* ================= 第 4 章 ================= */
  {id:'jnl-4',num:'4',title:'从零构建与启动',lead:'README 的「快速开始」六步，逐步拆开讲。',sections:[
    {id:'jnl-4-1',num:'4.1',title:'快速开始总览',lead:'六步从空环境走到可查看的桌面。',tags:['流程'],blocks:[
      {t:'p',x:'README 把上手流程编号为 1–6，前五步是历史 M0 基线（Ubuntu + GNOME）的闭环，第六步是新路线（Buildroot + NyxNiri）。下表是六步的速览，后续小节逐一展开。'},
      {t:'steps',items:[
        ['① 导入构建用 WSL 发行版','一次性执行 <code>setup-wsl.ps1</code>，得到 JNL-BUILD'],
        ['② 安装构建依赖','<code>bootstrap-build-env.sh</code>'],
        ['③ 构建内核 + initramfs','<code>build-kernel.sh</code> + <code>make-initramfs.sh</code>'],
        ['④ 控制台启动冒烟','<code>run-console-smoke.ps1</code>，看到 <code>JNL OS boot OK</code>'],
        ['⑤ 构建桌面根文件系统并启动','历史 M0 基线，VNC 查看，抓 <code>out/desktop.png</code>'],
        ['⑥ 新路线：Buildroot + NyxNiri','生成 defconfig、全量构建 <code>rootfs.ext4</code>、启动新镜像']
      ]},
      {t:'note',k:'两条路线都要会',x:'文档把 ⑤ 明确标为「历史 M0 基线」、把 ⑥ 标为「新路线（构建中）」。复现时先跑通 ①–④ 建立内核闭环，再按需要选择 ⑤ 看历史证据或 ⑥ 走产品方向。'}
    ]},
    {id:'jnl-4-2',num:'4.2',title:'第 1–2 步：导入 WSL 与安装依赖',lead:'一次性环境准备。',tags:['实操'],blocks:[
      {t:'p',x:'第 1 步在 Windows PowerShell 中导入项目自带的 rootfs，得到名为 <code>JNL-BUILD</code> 的 WSL 发行版；第 2 步在这个发行版里以 root 安装编译所需依赖。'},
      {t:'code',lang:'powershell',x:'# 1. 导入构建用 WSL 发行版（一次性，Windows PowerShell）\n.\\scripts\\setup-wsl.ps1\n\n# 2. 安装构建依赖（路径含空格，务必加双引号）\nwsl -d JNL-BUILD -u root -- bash "/mnt/g/FEPT/FEPT/A_industry code/Java_Net_Lava/scripts/bootstrap-build-env.sh"'},
      {t:'p',x:'两条命令的模式值得记住：<b>Windows 侧用 <code>.\\scripts\\xxx.ps1</code> 调用，WSL 侧用 <code>wsl -d JNL-BUILD -u root -- bash "绝对路径"</code> 执行</b>。<code>-u root</code> 保证有权限写 <code>/root/jnl-build</code> 等构建目录。'},
      {t:'faq',q:'为什么要单独导入一个 WSL 发行版，而不直接用现成的 Ubuntu？',a:'文档写明项目通过 <code>.wsl/</code> 下的 rootfs 导入、命名为 <code>JNL-BUILD</code>。这样做的直接好处是构建环境与日常环境隔离、可复现——归档文档把它列为已完成项之一。'}
    ]},
    {id:'jnl-4-3',num:'4.3',title:'第 3 步：构建内核与 initramfs',lead:'产出 bzImage 与 initramfs.cpio.gz。',tags:['实操'],blocks:[
      {t:'p',x:'第 3 步调用两个脚本，分别编译内核和打包 initramfs。产物落在 <code>out/bzImage</code>（18 MB）与 <code>out/initramfs.cpio.gz</code>（1.1 MB）。'},
      {t:'code',lang:'powershell',x:'wsl -d JNL-BUILD -u root -- bash "/mnt/g/FEPT/FEPT/A_industry code/Java_Net_Lava/scripts/build-kernel.sh"\nwsl -d JNL-BUILD -u root -- bash "/mnt/g/FEPT/FEPT/A_industry code/Java_Net_Lava/scripts/make-initramfs.sh"'},
      {t:'p',x:'这一步的产物是<b>下一步冒烟测试的输入</b>：QEMU 用 <code>-kernel out/bzImage -initrd out/initramfs.cpio.gz</code> 启动，只要能打印出约定字符串，就说明「内核 + 早期用户空间」这条最小链路闭环成功。'},
      {t:'note',kind:'tip',k:'为什么要先做 initramfs',x:'initramfs 是一个临时的早期根文件系统，负责在真正的根文件系统挂载前加载驱动、准备环境。先验证 <code>bzImage + initramfs</code>，可以在不依赖 <code>rootfs.ext4</code> 的情况下单独确认内核能启动——这是排查 OS 启动问题最常用的分层方法。'}
    ]},
    {id:'jnl-4-4',num:'4.4',title:'第 4 步：控制台冒烟 JNL OS boot OK',lead:'最小闭环的验收判据。',tags:['验收'],blocks:[
      {t:'p',x:'第 4 步执行 <code>run-console-smoke.ps1</code>。README 给出明确的验收判据：<b>看到 <code>JNL OS boot OK</code> 即表示内核与 initramfs 闭环成功</b>。'},
      {t:'code',lang:'powershell',x:'# 4. 控制台启动冒烟\n.\\scripts\\run-console-smoke.ps1\n\n# 期望输出\n# ...\n# JNL OS boot OK'},
      {t:'p',x:'这一句也被写进《项目概览》的「已完成」清单与《README》的当前状态清单，是全项目第一个可核查的里程碑证据。若失败，应回到 4.2 / 4.3 检查依赖与产物，而不是继续往下跑桌面。'},
      {t:'ex',k:'动手练一练',items:[
        '故意把 <code>make-initramfs.sh</code> 的产物改名，再跑一次冒烟，观察失败信息出现在哪个阶段。',
        '在 <code>out/desktop-serial.log</code> 里找到内核版本打印，确认它是 <code>7.4.0-rc1-jnl</code> 而非宿主机内核。',
        '思考：为什么验收判据用一句自定义字符串，而不是「能进 shell」？'
      ]}
    ]},
    {id:'jnl-4-5',num:'4.5',title:'第 5 步：历史 M0 桌面基线',lead:'Ubuntu + GNOME 46，通过 VNC 查看并自动截图。',tags:['历史基线'],blocks:[
      {t:'p',x:'第 5 步构建并启动<b>历史 M0 基线</b>（Ubuntu 24.04.5 + GNOME 46 Wayland）。脚本会自动抓取 <code>out/desktop.png</code> 作为验收证据，桌面通过 VNC <code>127.0.0.1:5900</code> 查看。'},
      {t:'code',lang:'powershell',x:'# 5. 构建桌面根文件系统并启动（历史 M0 基线：Ubuntu + GNOME）\nwsl -d JNL-BUILD -u root -- bash "/mnt/g/FEPT/FEPT/A_industry code/Java_Net_Lava/scripts/build-desktop-rootfs.sh"\n.\\scripts\\run-desktop.ps1'},
      {t:'p',x:'《项目概览》记录这条基线的验收细节：<b>GDM 自动登录、约 8–10 秒进桌面</b>，验收记录见 <code>docs/m0-acceptance.md</code>；还完成过 <code>.deb</code> 安装验证（APT 安装 / 运行 / 卸载 <code>hello</code>）。它是参照物，不代表产品方向。'},
      {t:'note',kind:'warn',k:'别把它当成当前架构',x:'M0 基线用的是 <b>Ubuntu + GNOME + APT</b>，与 2.1 节确定的「Buildroot 从零 + 仅 NyxNiri + 无 apt」<b>完全相反</b>。阅读 README 时若看到 GNOME / .deb / VNC 截图等描述，都属于这条历史线。'}
    ]},
    {id:'jnl-4-6',num:'4.6',title:'第 6 步上：Buildroot 全量构建',lead:'生成 rootfs.ext4（8 GB，Java Net Lava OS 0.1）。',tags:['新路线'],blocks:[
      {t:'p',x:'第 6 步切换到新路线。先生成 / 更新 Buildroot 配置（改 defconfig 后执行），再后台全量构建，日志写到 <code>/root/jnl-build/buildroot-build.log</code>。'},
      {t:'code',lang:'powershell',x:'# 6. 新路线：Buildroot 从零 userland + NyxNiri（构建中）\n# 生成 / 更新 Buildroot 配置（改 defconfig 后执行）\nwsl -d JNL-BUILD -u root -- bash "scripts/buildroot-configure.sh"\n\n# 后台全量构建（日志 /root/jnl-build/buildroot-build.log）\nwsl -d JNL-BUILD -u root -- bash "scripts/buildroot-start.sh"'},
      {t:'p',x:'构建产物是 Buildroot <code>output/images/rootfs.ext4</code>——<b>8 GB ext4</b>，系统标识 <code>Java Net Lava OS 0.1</code>。外部树（defconfig / rootfs overlay / Niri、Noctalia 等自定义包）位于 <code>buildroot-external/</code>，NyxNiri 配置已放进 <code>buildroot-external/rootfs-overlay/home/jnl/.config/</code>。'},
      {t:'note',k:'全量构建为什么耗时',x:'Buildroot 会从源码编译整套工具链（glibc / GCC / Rust）与所有选中的包，因此首次构建时间较长，文档才把它设计成<b>后台任务 + 日志文件</b>。这也是 3.3 节要求 ≥ 30 GB 磁盘的原因。'}
    ]},
    {id:'jnl-4-7',num:'4.7',title:'第 6 步下：启动新镜像',lead:'用环境变量指定 rootfs，交给 QEMU 启动。',tags:['新路线'],blocks:[
      {t:'p',x:'新镜像的启动方式与 M0 不同：在 WSL 内通过环境变量 <code>JNL_ROOT_IMG</code> 指向刚构建出的 <code>rootfs.ext4</code>，再交给 <code>scripts/qemu-desktop.sh</code>。'},
      {t:'code',lang:'bash',x:'# WSL 内\nJNL_ROOT_IMG=/root/jnl-build/buildroot-2026.08.1/output/images/rootfs.ext4 \\\n  bash scripts/qemu-desktop.sh'},
      {t:'p',x:'启动后进入的会话链路是 <code>systemd → jnl-niri.service → seatd → PAM/logind → niri</code>，最后出现 Noctalia 桌面壳。《项目概览》记录：<b>Niri 打了 3 处本地补丁以适配 QEMU 软件渲染</b>，验收截图为 <code>out/desktop.png</code>（2026-11-10）。'},
      {t:'faq',q:'M0 桌面与新镜像截图都叫 out/desktop.png？',a:'是的，两份文档都用 <code>out/desktop.png</code> 作为桌面验收证据的文件名，区别在于时间与内容：M0 是 <b>GNOME 46 Wayland 会话</b>，新路线是 <b>Niri → Noctalia</b>（2026-11-10）。查看时应结合 <code>out/desktop-serial.log</code> 的时间戳判断。'}
    ]}
  ]},

  /* ================= 第 5 章 ================= */
  {id:'jnl-5',num:'5',title:'远程查看与调试',lead:'VNC / noVNC / SSH 三条链路，以及那个 IPv6 坑。',sections:[
    {id:'jnl-5-1',num:'5.1',title:'三条远程链路',lead:'5900 / 6080 / 2222 各管一件事。',tags:['远程'],blocks:[
      {t:'p',x:'《项目概览》把「远程三链路实测通过」列为已完成项，README 给出具体端点。三条链路的分工如下：'},
      {t:'table',head:['链路','端点','用途'],rows:[
        ['VNC','<code>127.0.0.1:5900</code>','VNC 客户端直连桌面'],
        ['noVNC','<code>http://127.0.0.1:6080/vnc.html?autoconnect=true</code>','浏览器查看桌面，由 WSL 内 <code>websockify</code> 提供'],
        ['SSH','<code>ssh -p 2222 jnl@127.0.0.1</code>（密码 <code>jnl</code>）','命令行调试，例如 <code>uname -r</code> 核对内核']
      ]},
      {t:'p',x:'README 推荐远程时使用浏览器方式：双击 <code>scripts/open-desktop-browser.cmd</code>，或直接打开 noVNC 链接，<b>不需要安装 VNC 客户端</b>。文档还提到通过 UU 远程进入这台 Windows 后即可直接使用。'},
      {t:'note',kind:'tip',k:'为什么需要三条',x:'VNC 看画面、noVNC 让任意浏览器能看画面、SSH 进命令行查状态——分别对应「看」「随时随地看」「查」。验收时 <code>uname -r</code> 返回 <code>7.4.0-rc1-jnl</code> 就是通过 SSH 链路核实的。'}
    ]},
    {id:'jnl-5-2',num:'5.2',title:'127.0.0.1 与 localhost 的 IPv6 坑',lead:'README 用引用块单独强调的一条环境坑。',tags:['踩坑'],blocks:[
      {t:'p',x:'这是 README 里唯一用引用块特别标出的坑，值得单独记一节：<b>VNC 客户端请填 <code>127.0.0.1:5900</code>，不要用 <code>localhost:5900</code></b>。'},
      {t:'quote',x:'Windows 的 localhost 会优先解析到 ::1，而 WSL 的端口转发只监听 IPv4。可用 .scripts/vnc-check.ps1 自检。'},
      {t:'p',x:'原因链条是：<code>localhost</code> → IPv6 <code>::1</code> 优先 → WSL 端口转发只监听 IPv4 → 连接失败。直接写 <code>127.0.0.1</code> 就绕过了名称解析的歧义。这是 Windows + WSL2 组合里非常典型的一类问题。'},
      {t:'note',kind:'danger',k:'排查顺序',x:'若 VNC 连不上，先别怀疑镜像没起来：① 把地址改成 <code>127.0.0.1</code>；② 跑 <code>.\\scripts\\vnc-check.ps1</code> 自检；③ 用 SSH（<code>-p 2222</code>）确认虚拟机确实在运行；④ 再看 <code>out/desktop-serial.log</code>。'},
      {t:'faq',q:'noVNC 链接为什么也写 127.0.0.1？',a:'同一个原因。README 给的浏览器地址是 <code>http://127.0.0.1:6080/vnc.html?autoconnect=true</code>，同样避开 <code>localhost</code> 的 IPv6 优先解析。'}
    ]},
    {id:'jnl-5-3',num:'5.3',title:'noVNC：浏览器里看桌面',lead:'不需装客户端的推荐方式。',tags:['远程'],blocks:[
      {t:'p',x:'noVNC 由 WSL 内的 <code>websockify</code> 提供，把 VNC 协议转成 WebSocket，浏览器打开即可看到桌面。README 给了两种入口：'},
      {t:'ul',items:[
        '双击 <code>scripts/open-desktop-browser.cmd</code>（自动打开浏览器）。',
        '手动访问 <code>http://127.0.0.1:6080/vnc.html?autoconnect=true</code>。'
      ]},
      {t:'p',x:'文档说明：通过 UU 远程进入这台 Windows 后即可直接使用浏览器方式，这对「人在别处、机器在家」的调试场景很实用——你只需能操作那台 Windows 的桌面浏览器。'},
      {t:'note',k:'三层地址别混淆',x:'<b>5900</b> 是 VNC 原生端口，<b>6080</b> 是 noVNC/websockify 的 HTTP 端口，<b>2222</b> 是 SSH 转发端口。三者都绑在 Windows 侧的 <code>127.0.0.1</code>，由 WSL 端口转发连进虚拟机。'},
      {t:'h',x:'深入：websockify 在中间做了什么'},
      {t:'p',x:'VNC 走的是 RFB 协议、基于 TCP；浏览器只能发 HTTP / WebSocket。WSL 内的 <code>websockify</code> 就是一个<b>协议转换代理</b>：一端连本地 VNC 服务（5900），另一端对外提供 HTTP + WebSocket（6080），把 WebSocket 帧里的字节原样转发给 VNC，再把 VNC 的画面回传成浏览器能渲染的数据。因此 noVNC 并不是「另一套桌面」，它只是同一块画面的另一种投递方式。'},
      {t:'p',x:'这也解释了为什么两条链路的<b>画面内容完全一致</b>、却需要两个端口：<code>5900</code> 服务原生客户端，<code>6080</code> 服务浏览器。若浏览器打不开而 VNC 客户端正常，排查重点应放在 websockify 进程与 6080 端口，而不是镜像或桌面本身。'},
      {t:'table',head:['对比项','VNC 5900','noVNC 6080'],rows:[
        ['客户端','需安装 VNC 客户端','任意现代浏览器'],
        ['协议','RFB over TCP','HTTP + WebSocket → 转发到 RFB'],
        ['中间组件','无','WSL 内 <code>websockify</code>'],
        ['典型场景','本机调试、画质优先','远程协助、临时查看']
      ]},
      {t:'note',kind:'tip',k:'autoconnect 参数',x:'链接里的 <code>?autoconnect=true</code> 让 noVNC 页面加载后自动发起连接，省掉手动点「连接」的一步。若想先看连接参数再连，去掉这个参数即可。'}
    ]},
    {id:'jnl-5-4',num:'5.4',title:'停止桌面与 SSH 调试',lead:'收尾命令与常用检查。',tags:['运维'],blocks:[
      {t:'p',x:'README 在快速开始末尾给出两条收尾命令：停止桌面与 SSH 调试。'},
      {t:'code',lang:'powershell',x:'# 停止桌面\n.\\scripts\\run-desktop.ps1 -Stop\n\n# SSH 调试（密码 jnl）\nssh -p 2222 jnl@127.0.0.1\n\n# 进入后核对内核版本\nuname -r        # 期望：7.4.0-rc1-jnl'},
      {t:'p',x:'把 <code>uname -r</code> 作为每次启动后的第一句检查，是《项目概览》「远程三链路实测通过」里最容易被忽略但最关键的一步——它把「画面出来了」和「跑的是自编译内核」这两件事区分开。'},
      {t:'h',x:'深入：把自检做成固定动作'},
      {t:'p',x:'文档把「远程三链路实测通过」列为已完成项，但一次通过不等于每次通过。系统开发里更可靠的做法是把验收判据固化成<b>启动后的固定自检序列</b>：先看串口日志确认内核与 initramfs，再用 <code>uname -r</code> 确认跑的是自编译内核，然后确认桌面进程与截图产物，最后才检查三条远程链路是否可连。'},
      {t:'steps',items:[
        ['① 内核层','查 <code>out/desktop-serial.log</code>，确认 <code>JNL OS boot OK</code> 与 <code>7.4.0-rc1-jnl</code>'],
        ['② 会话层','确认 systemd → <code>jnl-niri.service</code> → niri 链路已起；留意 <code>user@1000.service</code> 的已知问题'],
        ['③ 画面层','确认 <code>out/desktop.png</code> 时间戳为本次启动，而非上一次的历史截图'],
        ['④ 远程层','VNC 5900 / noVNC 6080 / SSH 2222 各测一次，全部写 <code>127.0.0.1</code>']
      ]},
      {t:'p',x:'收尾时按文档用 <code>.\\scripts\\run-desktop.ps1 -Stop</code> 停止桌面，避免 QEMU 进程常驻占用 <code>/dev/kvm</code> 与内存；下次构建前再确认 <code>/root/jnl-build</code> 下没有残留的后台构建日志锁。'},
      {t:'ex',k:'动手练一练',items:[
        '列出三条链路各自的端口，并说明哪一条不需要额外安装客户端软件。',
        '若 <code>localhost:5900</code> 连不上而 <code>127.0.0.1:5900</code> 可以，写出完整的原因链条。',
        '设计一份「启动后自检清单」，至少包含内核版本、桌面截图、三链路连通性三项。',
        '思考：为什么「画面出来了」不足以证明跑的是自编译内核？'
      ]}
    ]}
  ]},

  /* ================= 第 6 章 ================= */
  {id:'jnl-6',num:'6',title:'进展、里程碑与边界',lead:'做到了哪一步、接下来做什么、什么明确不做。',sections:[
    {id:'jnl-6-1',num:'6.1',title:'已完成清单（截至 2026-11-10）',lead:'两份文档共同确认的落地成果。',tags:['进展'],blocks:[
      {t:'p',x:'《项目概览》「当前进展」与 README「当前状态」清单相互印证，可归纳为五组已完成项：'},
      {t:'cards',items:[
        ['内核闭环','自有内核 <code>7.4.0-rc1-jnl</code> 构建、initramfs 控制台冒烟 <code>JNL OS boot OK</code>'],
        ['M0 基线','Ubuntu 24.04.5 + GNOME 46 Wayland、GDM 自动登录、约 8–10 秒进桌面、.deb 安装验证、<code>docs/m0-acceptance.md</code>'],
        ['新路线第一阶段','Buildroot 全量构建产出 <code>rootfs.ext4</code>（8 GB），QEMU 完成「开机 → systemd → Niri → Noctalia」闭环'],
        ['会话链路','systemd → <code>jnl-niri.service</code> → seatd → PAM/logind → niri；Niri 3 处 QEMU 软件渲染补丁'],
        ['远程三链路','VNC 5900 / noVNC 6080 / SSH 2222 实测通过，<code>uname -r</code> = 7.4.0-rc1-jnl']
      ]},
      {t:'p',x:'此外 README 还把「开发计划与仓库骨架、WSL 构建环境导入、Linux 内核构建、initramfs 控制台启动、根文件系统与图形桌面启动、桌面截图验收、浏览器查看桌面、路线决策、Buildroot 外部树与 defconfig」逐项列为已完成。'},
      {t:'note',kind:'tip',k:'两条验收证据',x:'<code>out/desktop.png</code>（画面）与 <code>out/desktop-serial.log</code>（串口日志）。前者证明桌面起来了，后者能定位它起来之前发生了什么。做系统开发时，这两类证据要成对保留。'}
    ]},
    {id:'jnl-6-2',num:'6.2',title:'未完成与已知问题',lead:'文档明确写下的待办与绕行方案。',tags:['进展'],blocks:[
      {t:'p',x:'《项目概览》的「未完成 / 下一步」是判断项目真实完成度最诚实的一节，逐条如下：'},
      {t:'ol',items:[
        '<b>M0 正式门禁</b>：CI 每夜构建 + 近 14 次 QEMU 启动成功率 ≥ 95%（尚未达成）。',
        '<b><code>systemd --user</code> 问题</b>：<code>user@1000.service</code> 启动即静默退出，dbus 会话环境不完整，目前由系统服务直接拉起 niri 绕过。',
        '<b>XWayland 未安装</b>：X11 应用暂不可用。',
        '<b>NyxNiri 完整功能待补</b>：kitty、fcitx5 主题、壁纸取色、CLI 工具。',
        '<b>中长期能力</b>：实体机安装介质（ISO / 安装器 / 引导器）、硬件矩阵实机验证、安全启动链（M2）、Windows 兼容层（M4）、本地 AI Agent（M5）、软件中心与 A/B 更新（M6）。'
      ]},
      {t:'note',kind:'warn',k:'M0 还没「正式过关」',x:'虽然镜像与桌面闭环已完成，但 M0 的<b>正式完成标志是「每夜构建出能进 shell 的镜像、CI 绿」</b>，加上「近 14 次 QEMU 启动成功率 ≥ 95%」的门禁。文档把「CI 每夜构建」列为待补，说明 M0 仍处于收尾阶段。'},
      {t:'faq',q:'systemd --user 退出会有什么影响？',a:'用户级服务与完整的 dbus 会话环境无法按标准方式建立。当前用系统服务 <code>jnl-niri.service</code> 直接拉起 niri 作为<b>绕行方案</b>，桌面可用，但会话管理与后续桌面组件集成会受限制——文档把它归入「未完成」。'}
    ]},
    {id:'jnl-6-3',num:'6.3',title:'里程碑 M0–M7',lead:'从仓库骨架到 Daily Driver 候选。',tags:['路线图'],blocks:[
      {t:'p',x:'《项目概览》给出完整的 M0–M7 里程碑表，这里按原表归纳（完成标志为摘要）：'},
      {t:'table',head:['里程碑','定义','完成标志（摘要）'],rows:[
        ['M0','仓库骨架 + CI + 最小可启动镜像','每夜构建出能进 shell 的镜像、CI 绿'],
        ['M1','稳定启动底座（图形 / 电源 / 外设）','首批机型稳定进 Wayland 桌面'],
        ['M2','Secure Boot + LUKS2 + TPM2 全链','出厂默认加密安装、重启无感解锁'],
        ['M3','Windows 范式桌面 MVP','任务栏 / 开始菜单 / 文件管理器 / 贴边分屏可用（桌面底座已改为 NyxNiri，本节待重写）'],
        ['M4','Windows 应用兼容层 MVP','兼容性管理器中安装并运行 ≥1 款常见 Windows 应用'],
        ['M5','本地 AI Agent MVP','自然语言完成文件整理 / 设置查询 / 应用启动，可关闭可审计'],
        ['M6','软件中心 + A/B 无回梯更新','三后端可用、更新失败自动回滚'],
        ['M7','Daily Driver 候选发布','验收清单全绿、灰度反馈「日常可用」']
      ]},
      {t:'p',x:'M3 那一行特意保留了一条文档注记：由于桌面底座从 GNOME 改为 <b>NyxNiri</b>，该节「待重写」。这类注记是判断规划文档新鲜度的重要线索。'},
      {t:'note',k:'里程碑的读法',x:'M0–M2 是<b>底座</b>（能启动、能稳定启动、能安全启动），M3–M5 是<b>能力</b>（桌面、兼容、AI），M6–M7 是<b>交付</b>（更新与发布）。当前完成度集中在 M0，M1 及之后均为规划。'}
    ]},
    {id:'jnl-6-4',num:'6.4',title:'关键路径、并行与风险',lead:'哪些里程碑串成主线，哪些可以并行。',tags:['路线图'],blocks:[
      {t:'p',x:'《项目概览》在里程碑表后给出关键路径一句话：<b>M0 → M1 → M2 → M6 → M7</b>；<b>M3 → M5 与 M4 可并行</b>；<b>CI / 测试（WP7）横切全部里程碑</b>。'},
      {t:'steps',items:[
        ['主线（不可跳）','M0 可启动 → M1 稳定 → M2 安全 → M6 可更新 → M7 可发布'],
        ['并行支线 A','M3 桌面 MVP → M5 本地 AI Agent'],
        ['并行支线 B','M4 Windows 应用兼容层'],
        ['横切','CI 与测试（WP7）贯穿每一个里程碑']
      ]},
      {t:'p',x:'文档同时点名<b>最大技术风险</b>有两处：<b>TPM 密封与 A/B 更新联动</b>、<b>rc 内核与 Wine / DXVK 图形栈抖动</b>。前者正是 M2 与 M6 在主线上相邻的原因，后者解释了 M4 为什么被安排成可并行但高不确定性的支线。'},
      {t:'note',kind:'danger',k:'为什么 M2 与 M6 要联动考虑',x:'TPM 密封把解密密钥绑定到系统状态；A/B 更新会改变被度量的系统状态。若两者不协同设计，一次更新就可能导致重启后无法自动解锁——这直接违背 M2「重启无感解锁」的完成标志。'}
    ]},
    {id:'jnl-6-5',num:'6.5',title:'首版「明确不承诺」清单',lead:'边界感：先说清楚不做什么。',tags:['边界'],blocks:[
      {t:'p',x:'《项目概览》单列了一节「首版明确不承诺清单」，逐项如下。这类清单在工程项目里比功能列表更能说明定位：'},
      {t:'ul',items:[
        'Apple M4 全硬件功能（<b>仅实验级基础图形</b>）',
        'NVIDIA 专有驱动在 rc 内核上的全程兼容',
        '依赖内核级反作弊的联机游戏',
        '重型 Windows 专业套件',
        '云端 AI 能力'
      ]},
      {t:'p',x:'最后一条尤其呼应产品定位：JNL OS 强调的是<b>本地 AI Agent</b>（隐私、可关闭、可审计），因此明确不承诺云端 AI。第 2 章「四大能力」里的 AI 一项，也应在这个边界下理解。'},
      {t:'h',x:'深入：五条排除项背后的共同逻辑'},
      {t:'p',x:'把五条放在一起看，会发现它们排除的不是「能力不足」，而是<b>三类会把首版拖入不可控状态的外部依赖</b>：'},
      {t:'table',head:['排除项','依赖类型','为什么首版不碰'],rows:[
        ['Apple M4 全硬件功能','硬件生态','仅提供实验级基础图形，完整驱动与电源管理需大量实机适配'],
        ['NVIDIA 专有驱动全程兼容','闭源驱动 + rc 内核','rc 内核接口仍在变，闭源模块难以同步跟进'],
        ['内核级反作弊联机游戏','第三方内核模块','与自研内核、Secure Boot 链存在根本冲突'],
        ['重型 Windows 专业套件','大型应用兼容','超出 M4「运行 ≥1 款常见应用」的 MVP 范围'],
        ['云端 AI 能力','网络与数据出境','与「本地 AI · 隐私 · 可审计」的产品定位直接冲突']
      ]},
      {t:'p',x:'换句话说，这份清单是在给 M0–M7 的验收<b>划边界</b>：先把不依赖外部生态的部分（内核、用户空间、桌面、启动链）做扎实，再逐里程碑引入硬件、兼容层与智能能力。每一条排除项都能对应到某个后续里程碑或明确的产品取舍，不是随意删减。'},
      {t:'faq',q:'为什么连「云端 AI」都要专门排除？',a:'因为产品目标是「本地 AI」——推理与 Agent 服务跑在本机、强调隐私与可审计。若同时承诺云端能力，会与这一定位冲突，也会把网络依赖、数据出境等问题引入首版范围。文档用「明确不承诺」把范围钉死。'},
      {t:'note',kind:'tip',k:'读规划文档的方法',x:'一份可信的路线图，通常同时包含「要做什么」「做到什么程度算完成」「什么明确不做」三部分。JNL OS 的里程碑表提供前两部分，这份不承诺清单提供第三部分——三者齐备，才不容易被演示画面高估完成度。'}
    ]},
    {id:'jnl-6-6',num:'6.6',title:'归档文档索引',lead:'想继续深入时该翻哪一份。',tags:['索引'],blocks:[
      {t:'p',x:'《项目概览》末尾列出「本次一并归档的原始文档」，共 6 份（含 README 共 7 份）。这是从速览走向一手资料的路标：'},
      {t:'table',head:['文档','内容'],rows:[
        ['<code>README</code>','项目定位、仓库结构、快速开始、进度清单'],
        ['<code>docs/plan.md</code>','M0–M7 里程碑、WP 对照、依赖与并行、风险与质量门禁'],
        ['<code>docs/status.md</code>','2026-11-10 能力清单、远程查看方式、安装包格式支持、待办'],
        ['<code>docs/build.md</code>','WSL 构建流程、产物、已知环境坑（13 条）'],
        ['<code>docs/m0-acceptance.md</code>','2026-11-08 本地 QEMU 验收项、修复记录、复现命令'],
        ['硬件兼容性矩阵','开发主机、虚拟目标、真实目标硬件 v0'],
        ['Buildroot 构建笔记','自定义包、defconfig 踩坑、niri 补丁、会话链路坑位全集']
      ]},
      {t:'p',x:'本篇 6 章内容即由 <b>《JNL OS · 项目概览》</b> 与 <b>《JNL OS · README》</b> 归纳而成。想核对某处细节，或查看 13 条环境坑、QEMU 验收复现命令等更细的一手记录，请回到对应的归档原始文档。'},
      {t:'note',kind:'tip',k:'本篇小结',x:'你已经走完一条完整链路：<b>定位（1）→ 架构（2）→ 目录与环境（3）→ 构建与启动（4）→ 远程调试（5）→ 进展与路线（6）</b>。JNL OS 的价值不在于「已经能日用」，而在于它把一个操作系统从内核到桌面的每一层决策都摆到了台面上，可以被逐层阅读、复现与质疑。'}
    ]}
  ]}

  ]
};
