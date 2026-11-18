/* ==========================================================
   方程的工艺百科全书 · 操作系统篇
   课程：Java Net Lava OS（JNL OS）
   素材来源：Gitee 仓库 java-net-lava-os_-lx 的 README.md 与 docs/ 文档
   （status 2026-11-15 / plan / oobe-installer / jnlpkg / 教程 / build 等）
   按 章.节 编号整理归纳，仅陈述文档已载明的事实，规划中部分明确标注
   ========================================================== */
window.WIKI_JNL = {
  "id": "jnl",
  "num": "甲",
  "en": "COURSE I · JAVA NET LAVA OS",
  "title": "Java Net Lava OS（JNL OS）",
  "lead": "一个以 Linux 7.4-rc1 为底座、已交付实体机安装 ISO 的自研桌面操作系统原型。本门依据项目公开仓库 README 与 docs 文档（状态截至 2026-11-15），把它的定位、三次路线变更、内核与自建基底、NyxNiri 桌面、图形 OOBE 与双盘装机、ISO 三重启动、Secure Boot 信任链、.jnlpkg 原生包、自研应用与商店、上手教程、构建体系与里程碑逐章整理成可循序查阅的教程；只陈述文档已载明的事实，规划中的部分明确标注，不作推测。",
  "chips": [
    "状态 2026-11-15",
    "实体机安装 ISO",
    "Linux 7.4-rc1",
    "Secure Boot 全链路",
    ".jnlpkg 原生包"
  ],
  "codeUnit": "个配置与命令示例",
  "chapters": [
    {
      "id": "jnl-1",
      "num": "1",
      "title": "认识 JNL OS：定位、现状与路线变迁",
      "lead": "先弄清它现在是什么、走到了哪一步，以及它为什么三次改变技术路线。",
      "sections": [
        {
          "id": "jnl-1-1",
          "num": "1.1",
          "title": "一句话定位与当前交付物",
          "lead": "从「QEMU 里的实验镜像」变成「可装机 ISO」。",
          "tags": [
            "绪论"
          ],
          "blocks": [
            {
              "t": "p",
              "x": "<b>JNL OS（Java Net Lava OS）是一个以 Linux 7.4-rc1 为内核底座、面向实体机交付的桌面操作系统原型。</b>它的当前交付物是<b>实体机安装 ISO</b>，已通过 <b>BIOS / UEFI / Secure Boot 三重启动验证</b>，开机即进入图形 OOBE 安装向导，走完即可装到硬盘并进桌面。"
            },
            {
              "t": "p",
              "x": "这与旧资料里「只能在 QEMU 里跑、不是可装实体机的 ISO」的描述已经不同。本门按仓库最新状态（<code>docs/status.md</code>，<b>2026-11-15</b>）重写：以「已落地的事实」与「规划中的里程碑」分开陈述，不把目标写成现状。"
            },
            {
              "t": "table",
              "head": [
                "层次",
                "当前实现",
                "状态"
              ],
              "rows": [
                [
                  "内核",
                  "Linux 7.4-rc1，release <code>7.4.0-rc1-jnl</code>，驱动内建、bzImage 约 25.6 MB",
                  "已落地"
                ],
                [
                  "用户空间",
                  "从基础系统引导的<b>自建基底</b>，全面遮掩上游痕迹，保留 dpkg / apt",
                  "已落地"
                ],
                [
                  "桌面",
                  "<b>NyxNiri</b>（Niri 合成器 + Noctalia V5 桌面壳 + 项目配置），默认中文",
                  "已落地"
                ],
                [
                  "安装",
                  "图形 OOBE 八步向导 + 真实双盘装机 + ISO 安装介质",
                  "已落地"
                ],
                [
                  "原生包",
                  "<b>.jnlpkg</b> 自解压可执行包 + jnl-pkg 前端 + 应用商店",
                  "已落地"
                ],
                [
                  "安全",
                  "Secure Boot 全链路启动（MOK 签内核 + GPG 分离签名 + GRUB 自验签）",
                  "已落地"
                ],
                [
                  "兼容 / 本地 AI",
                  "Wine / Proton 兼容层、本地智能体",
                  "规划中（M4 / M5）"
                ]
              ]
            },
            {
              "t": "note",
              "k": "本篇依据",
              "x": "内容依据项目公开仓库 <code>README.md</code> 与 <code>docs/</code> 下多份文档归纳：状态以 <code>status.md</code>（2026-11-15）、路线以 <code>plan.md</code>、安装以 <code>oobe-installer.md</code>、包格式以 <code>jnlpkg.md</code> 与打包教程、上手以《使用教程》为准。文档中未载明的细节一律标注为「规划中 / 未验证」，不作推测。"
            }
          ]
        },
        {
          "id": "jnl-1-2",
          "num": "1.2",
          "title": "三次路线变更：从「从零」到「可装机」",
          "lead": "读懂这份时间线，才不会用旧结论误判现状。",
          "tags": [
            "路线",
            "重点"
          ],
          "blocks": [
            {
              "t": "p",
              "x": "JNL OS 的技术路线不是一次定死的，而是在<b>半年内调整了三次</b>。每次调整都解决了上一版的硬伤，也留下了一段仍可查的历史路线记录。"
            },
            {
              "t": "steps",
              "items": [
                [
                  "路",
                  "线",
                  "时",
                  "间",
                  "线"
                ],
                [
                  [
                    "2026-11-08 · 第一次：从零构建",
                    "决定用 <b>Buildroot</b> 从零构建 userland，桌面只用 <b>NyxNiri</b>，内核保持 7.4-rc1；不再使用 GNOME。目标是最纯粹的「自建」。"
                  ],
                  [
                    "2026-11-10 · 第一阶段达成",
                    "Buildroot 2026.08.1 从零镜像在 QEMU 中「开机 → Niri → Noctalia」闭环成功，验收截图 <code>out/desktop.png</code>。但它<b>没有 dpkg / apt</b>，装不了 <code>.deb</code>。"
                  ],
                  [
                    "2026-11-12 · 第二次：自建基底 + 全面遮掩",
                    "为满足「<code>.deb</code> 可装可运行」，改用<b>从基础系统引导的基底</b>，并把一切上游痕迹改写成自建系统；同时完成图形 OOBE、中文、预装软件与真实双盘装机。"
                  ],
                  [
                    "2026-11-14 ~ 15 · 第三次：实体机交付三件套",
                    "补齐内核硬件驱动、打通 Secure Boot 全链路、替换默认终端为 Tabby + Zsh。ISO 的 BIOS / UEFI / Secure Boot 三重启动全部验证通过，当前交付物正式变为<b>实体机安装 ISO</b>。"
                  ]
                ]
              ]
            },
            {
              "t": "p",
              "x": "Buildroot 路线并未被抹去：其外部树、defconfig 与补丁记录保留在 <code>buildroot-external/</code> 与 <code>docs/buildroot-patches.md</code>，作为「从零 userland」阶段的历史档案。读旧文档时若看到「无 dpkg / apt」「只有 QEMU 镜像」等表述，指的都是 11-08 至 11-10 的阶段。"
            },
            {
              "t": "faq",
              "q": "为什么放弃「纯粹从零」而回到带 dpkg / apt 的基底？",
              "a": "因为产品要交付给普通用户，<b>「能装软件」是硬需求</b>。Buildroot 镜像里没有 dpkg / apt，<code>.deb</code> 装不了也跑不起来；换用自建基底后，既保留了完整的软件生态，又通过<a href=\"#jnl-3-3\">全面遮掩</a>让系统在标识上呈现为 Java Net Lava OS。这是一次「纯粹性让位于可用性」的取舍。"
            }
          ]
        },
        {
          "id": "jnl-1-3",
          "num": "1.3",
          "title": "资料来源与阅读顺序",
          "lead": "按三条线索读，不必从头到尾。",
          "tags": [
            "导读"
          ],
          "blocks": [
            {
              "t": "p",
              "x": "本门把仓库文档重新组织为可循序查阅的十三条线。若带着问题来，可按下面三张入口直接跳读："
            },
            {
              "t": "cards",
              "items": [
                [
                  "想知道「它怎么装」",
                  "读第 5 ~ 7 章：OOBE 向导、双盘装机、ISO 三重启动与 Secure Boot。"
                ],
                [
                  "想知道「它怎么运作」",
                  "读第 2 ~ 4、8 ~ 10 章：内核、基底、桌面、原生包、自研应用与上手教程。"
                ],
                [
                  "想知道「它走到哪一步」",
                  "读第 1.2、12、13 章：路线时间线、里程碑 M0–M7、已完成清单与遗留问题。"
                ]
              ]
            },
            {
              "t": "note",
              "k": "术语约定",
              "x": "文中 <code>自建基底</code> 指项目从基础系统引导、遮掩上游标识后的用户空间；<code>自建系统</code> 在原始文档中指同一件事，本门统一用前者表述，不影响对原文的引用。"
            }
          ]
        }
      ]
    },
    {
      "id": "jnl-2",
      "num": "2",
      "title": "内核与硬件底座",
      "lead": "唯一内核、驱动内建、只记录实测的硬件矩阵。",
      "sections": [
        {
          "id": "jnl-2-1",
          "num": "2.1",
          "title": "Linux 7.4-rc1：唯一内核基线",
          "lead": "系统中不存在任何发行版内核。",
          "tags": [
            "内核"
          ],
          "blocks": [
            {
              "t": "p",
              "x": "JNL OS 的内核是 <b>Linux 7.4-rc1</b>，release 字符串为 <code>7.4.0-rc1-jnl</code>，构建产物为 <code>out/bzImage</code>（约 25.6 MB）。仓库用 <code>scripts/verify-kernel-source.sh</code> 核对源码 Makefile 确为 7.4-rc1，并明确<b>系统中不存在发行版内核</b>：<code>/boot</code> 为空、无 <code>linux-image-*</code> 包，QEMU 直接加载 <code>out/bzImage</code>。"
            },
            {
              "t": "p",
              "x": "基线选在 <code>rc</code>（候选发布）而非稳定版，是开发期的主动选择：能最快拿到新硬件驱动。代价是 API 变动频繁，第三方外部模块容易编译失败——这是开发计划里登记的首要风险之一。正式版发布后会切换到稳定 / LTS 基线，并建立「换内核不改用户态」的收敛机制。"
            },
            {
              "t": "note",
              "k": "边界",
              "x": "GNU/Linux 内核源代码按 GPL 等开源许可证发布，本项目遵守其许可与开源要求；本门只陈述仓库已载明的构建与验证事实，不提供内核配置全文、补丁源码或可照做的编译参数。"
            }
          ]
        },
        {
          "id": "jnl-2-2",
          "num": "2.2",
          "title": "驱动内建：让 ISO 走到不同硬件上",
          "lead": "显卡、有线网卡、无线网卡全部 <code>=y</code> 编进内核。",
          "tags": [
            "驱动",
            "重点"
          ],
          "blocks": [
            {
              "t": "p",
              "x": "2026-11-14 ~ 15 的「内核驱动补齐」把常用硬件驱动<b>全部以 <code>=y</code> 内建</b>到内核里，而不是作为可在运行时加载的模块。这样 ISO 启动到 OOBE 时无需依赖 <code>/lib/modules</code> 目录，也就不受「根文件系统尚未挂载」的时序限制。"
            },
            {
              "t": "table",
              "head": [
                "类别",
                "内建驱动",
                "目的"
              ],
              "rows": [
                [
                  "显卡",
                  "<code>amdgpu</code> / <code>nouveau</code> / <code>radeon</code>",
                  "防止 AMD、NVIDIA（开源栈）、老 AMD 卡黑屏"
                ],
                [
                  "有线网卡",
                  "<code>igb</code>",
                  "Intel 千兆有线网卡"
                ],
                [
                  "无线网卡",
                  "<code>iwlwifi</code> / <code>ath9k</code> / <code>ath10k</code> / <code>brcmfmac</code> / <code>mt76</code>",
                  "覆盖 Intel、Atheros、博通、联发科常见 WiFi 芯片"
                ]
              ]
            },
            {
              "t": "p",
              "x": "这套「全内建」策略与后续 OOBE 里 <code>nmcli</code> / WiFi 扫描直接可用是一体的：驱动在内核启动时就位，用户进入设置面板即可看到网卡，不必先手动装固件或加载模块。"
            }
          ]
        },
        {
          "id": "jnl-2-3",
          "num": "2.3",
          "title": "硬件矩阵：只记录实测，不写预计",
          "lead": "原则是「未拿到真机的条目标为未测」。",
          "tags": [
            "边界"
          ],
          "blocks": [
            {
              "t": "p",
              "x": "<code>docs/hardware-matrix.md</code> 是硬件兼容性矩阵 v0，它开宗明义：<b>只记录实际测过的组合；未拿到真机的条目一律标「未测」，不写「预计支持」</b>。状态标记分为通过 / 部分 / 失败 / 未测 / 实验五档。"
            },
            {
              "t": "table",
              "head": [
                "类别",
                "目标",
                "当前标记"
              ],
              "rows": [
                [
                  "开发主机",
                  "Intel Core i3-12100F / 24 GB / Windows 11 / WSL2",
                  "通过（作为构建宿主，非目标机）"
                ],
                [
                  "首批虚拟目标",
                  "qemu64、virtio-blk / virtio-gpu / virtio-input / virtio-net",
                  "未测（M0/M1 验收基线）"
                ],
                [
                  "CPU / GPU",
                  "AMD Zen 6、RDNA 新显卡；NVIDIA 新显卡",
                  "未测（依赖上游驱动）"
                ],
                [
                  "SoC",
                  "Apple M4",
                  "实验（Asahi 上游化能力评估）"
                ]
              ]
            },
            {
              "t": "note",
              "k": "口径",
              "x": "矩阵里「实验 / 未测」是诚实的状态标注，不代表功能不可用，也不代表承诺交付日期。开发计划明确：Apple M4 只承诺基础 Wayland 图形与外设可用；NVIDIA 专有驱动在 rc 内核上不承诺全程支持，待稳定基线切换后再评估。"
            }
          ]
        }
      ]
    },
    {
      "id": "jnl-3",
      "num": "3",
      "title": "自建基底与全面遮掩",
      "lead": "为什么换基底、怎么遮掩、踩过什么坑。",
      "sections": [
        {
          "id": "jnl-3-1",
          "num": "3.1",
          "title": "为什么放弃 Buildroot 路线",
          "lead": "「装不了 .deb」是硬伤。",
          "tags": [
            "路线"
          ],
          "blocks": [
            {
              "t": "p",
              "x": "Buildroot 阶段确实做到了「从零 userland」：工具链 glibc 2.44 + GCC 15.3，根文件系统标识为 <code>Java Net Lava OS 0.1</code>，开机能进 NyxNiri 桌面。但它<b>刻意不引入任何发行版包管理器</b>，软件只能在构建期以 Buildroot 包的形式进入镜像——这意味着用户拿到系统后<b>装不了新软件</b>，更装不了 <code>.deb</code>。"
            },
            {
              "t": "p",
              "x": "产品要求「<code>.deb</code> 可装可运行」，于是 2026-11-12 调整为<b>自建基底</b>路线：从基础系统引导起底（debootstrap），再装配桌面栈、遮掩标识、加入 jnl-pkg 前端。代价是 Niri 与 Noctalia 需要在自建系统上重新编译（用 Rust 1.85 + meson 完成），并增加一整套遮掩工作。"
            },
            {
              "t": "note",
              "k": "取舍",
              "x": "这不是「放弃自建」，而是把「自建」的重心从「每一行都从零写」移到「用户看到、用到的每一处都是自己的」。内核、桌面壳、包管理前端、安装器、应用仍是自研或深度定制；只有最底层的软件生态借用了 Debian 系的 dpkg / apt。"
            }
          ]
        },
        {
          "id": "jnl-3-2",
          "num": "3.2",
          "title": "全面遮掩：把上游痕迹改写成自建系统",
          "lead": "从 os-release 到欢迎语，逐处改写。",
          "tags": [
            "遮掩",
            "重点"
          ],
          "blocks": [
            {
              "t": "p",
              "x": "换用自建基底后，如何让系统「看起来就是 JNL OS」成了一组具体工程。<code>docs/oobe-installer.md</code> 记录了逐项处理："
            },
            {
              "t": "table",
              "head": [
                "位置",
                "处理"
              ],
              "rows": [
                [
                  "<code>/etc/os-release</code>",
                  "改写为 <code>NAME=\"Java Net Lava OS\"</code>、<code>ID=jnl</code>，去掉上游标识字段"
                ],
                [
                  "上游版本标识文件",
                  "删除"
                ],
                [
                  "<code>/etc/issue</code>、<code>issue.net</code>、<code>motd</code>、<code>hostname</code>",
                  "统一改为 Java Net Lava OS / <code>jnl-os</code>"
                ],
                [
                  "Noctalia 欢迎语",
                  "把英文与中文翻译文件里的欢迎语改为「欢迎使用 Java Net Lava OS」"
                ],
                [
                  "dpkg status 描述",
                  "以安全文本替换方式去掉上游字样"
                ],
                [
                  "<code>dpkg</code> / <code>apt --version</code>",
                  "不碰二进制，改用 <code>/usr/local/bin/</code> 包装脚本拦截输出"
                ]
              ]
            },
            {
              "t": "p",
              "x": "遮掩 Verification 的结论是：<code>os-release</code> / <code>issue</code> / <code>hostname</code> / <code>dpkg status</code> 均无上游字样，<code>dpkg/apt --version</code> 输出中性。<b>唯一残留</b>是 <code>/etc/apt/sources.list</code> 里的软件源仓库路径（域名已中性化，但路径仍可看出来源）——文档说明这是功能需要：镜像站对中性域名的虚拟主机会拒绝，导致拿不到 Release 文件。"
            }
          ]
        },
        {
          "id": "jnl-3-3",
          "num": "3.3",
          "title": "踩坑：绝不能用 sed 改二进制",
          "lead": "一个段错误引出包装脚本方案。",
          "tags": [
            "踩坑"
          ],
          "blocks": [
            {
              "t": "p",
              "x": "遮掩过程中最典型的一个坑：<b>用 <code>sed</code> 直接改 <code>dpkg</code> / <code>apt</code> 二进制文件里的版本字符串</b>，会让 ELF 内的字符串偏移发生变化，程序运行时直接段错误。团队从缓存的 <code>.deb</code> 还原了工具（<code>os-restore-tools.sh</code>），改用<b>包装脚本</b>方案：在 <code>/usr/local/bin/</code> 放置同名脚本，只在 <code>--version</code> 时输出中性文本，其他参数透传给真正的二进制。"
            },
            {
              "t": "p",
              "x": "同一份文档还记录了另外几处关键修复，可作为「系统工程师怎么排查」的样例：<b>输入设备完全无响应</b>，根因是 <code>input</code> 组与 <code>systemd-journal</code> 的 gid 冲突（都是 999），导致 udev 规则 <code>GROUP=input</code> 失败——重建为唯一 gid 并把 jnl 用户入组后解决；<b>niri 仍看不到输入设备</b>，是因未安装 <code>udev</code> 包、缺 <code>60-input-id.rules</code>，设备没有 ID_INPUT 标签而被 libinput 跳过。"
            },
            {
              "t": "note",
              "k": "阅读价值",
              "x": "这一节能看到真实系统工程的思维方式：先确认现象（无输入 / 段错误），再定位到具体机制（gid 冲突 / ELF 偏移），最后选择副作用最小的修复（重建组 / 包装脚本），而不是用蛮力覆盖。"
            }
          ]
        }
      ]
    },
    {
      "id": "jnl-4",
      "num": "4",
      "title": "桌面栈 NyxNiri 与终端",
      "lead": "平铺合成器、桌面壳、中文与 Tabby/Zsh。",
      "sections": [
        {
          "id": "jnl-4-1",
          "num": "4.1",
          "title": "Niri + Noctalia：什么是 NyxNiri",
          "lead": "不是 GNOME，而是 Wayland 上的平铺桌面。",
          "tags": [
            "桌面"
          ],
          "blocks": [
            {
              "t": "p",
              "x": "<b>NyxNiri</b> 是 JNL OS 唯一的桌面环境名称，它由三部分组成：<b>Niri</b>（Rust 编写的 Wayland 平铺合成器）、<b>Noctalia V5</b>（桌面壳，提供顶栏、任务栏、开始菜单等）与项目自有的 NyxNiri 配置。项目明确<b>不再使用 GNOME</b>；历史 M0 基线里的 Ubuntu 24.04 + GNOME 46 只作为对照保留。"
            },
            {
              "t": "p",
              "x": "会话链路是 systemd → <code>jnl-niri.service</code> → seatd（<code>LIBSEAT_BACKEND</code>）→ PAM / logind 会话 → niri。Niri 经过三处本地补丁（允许软件渲染器、类型标注、渲染节点规范化），在 QEMU 里能看到 <code>got render node: renderD128</code>；Noctalia 用 meson 构建，顶栏与壁纸渲染正常。"
            },
            {
              "t": "note",
              "k": "平铺桌面",
              "x": "与 Windows / GNOME 的「浮动窗口」不同，平铺合成器把窗口自动排布成不重叠的列与块，主要用键盘切换。JNL OS 在它之上叠加了 Windows 式交互（开始菜单、任务栏、运行窗口），试图兼顾两者的习惯。"
            }
          ]
        },
        {
          "id": "jnl-4-2",
          "num": "4.2",
          "title": "默认中文与字体",
          "lead": "zh_CN.UTF-8 + zh-Hans 界面 + CJK 字体。",
          "tags": [
            "中文"
          ],
          "blocks": [
            {
              "t": "p",
              "x": "中文支持是三条一起做的：生成 <code>zh_CN.UTF-8</code> locale 并在会话里设置 <code>LANG=zh_CN.UTF-8</code>；把 Noctalia 界面切到 zh-Hans；安装文泉驿 / Noto CJK 字体。早先「全英文 + 终端报 <code>invalid locale</code>」的问题，根因就是没有生成 UTF-8 locale。"
            },
            {
              "t": "p",
              "x": "终端字体也做了品牌化：四字重的 <b>MesloLGS NF</b> 装入 <code>/usr/share/fonts/truetype/meslo</code> 并执行 <code>fc-cache</code> 生效，用于 Powerlevel10k 主题里的 Nerd Font 图标。"
            }
          ]
        },
        {
          "id": "jnl-4-3",
          "num": "4.3",
          "title": "Tabby + Zsh：默认终端栈",
          "lead": "Windows 式终端体验 + 现代 shell。",
          "tags": [
            "终端",
            "重点"
          ],
          "blocks": [
            {
              "t": "p",
              "x": "2026-11-14 ~ 15 的第三件交付物是把默认终端换成 <b>Tabby 1.0.234</b>（装在 <code>/opt/Tabby</code>），并把 <code>x-terminal-emulator</code> 指向 <code>tabby-xterm</code> 包装脚本（把 <code>-e</code> 参数转成 <code>tabby run</code>），<code>Mod+Return</code> 直达 Tabby。foot / footclient / foot-server 三个桌面条目加 <code>NoDisplay=true</code> 置灰（桌面规范没有「禁用」态，用隐藏实现），kitty 本就没有桌面条目。"
            },
            {
              "t": "p",
              "x": "Shell 换成 <b>Zsh 5.9 + Oh-My-Zsh + Powerlevel10k</b>（lean 风格、nerdfont-v3 图标），外加 zsh-autosuggestions 与 zsh-syntax-highlighting；root 与 jnl 用户的默认 shell 都切到 <code>/usr/bin/zsh</code>。文档记录 <code>compaudit</code> 检查通过。"
            },
            {
              "t": "note",
              "k": "为什么换掉 foot",
              "x": "README 把「Tabby 作为默认终端」列为交付三件套之一，原因是它更贴近 Windows 用户熟悉的标签页式终端体验——这与「Windows 交互范式」的产品定位一致，而不是单纯的功能替换。"
            }
          ]
        }
      ]
    },
    {
      "id": "jnl-5",
      "num": "5",
      "title": "图形 OOBE 与真实双盘装机",
      "lead": "八步向导，真的在目标盘上装系统。",
      "sections": [
        {
          "id": "jnl-5-1",
          "num": "5.1",
          "title": "OOBE 八步向导",
          "lead": "欢迎到完成，走完重启进桌面。",
          "tags": [
            "安装",
            "重点"
          ],
          "blocks": [
            {
              "t": "p",
              "x": "首启动图形向导源码是 <code>oobe/jnl-oobe.py</code>（Python 3 + GTK 3），安装到 <code>/usr/local/bin/jnl-oobe</code>。触发条件是 <code>/var/lib/jnl/needs-oobe</code> 标记存在时，会话入口用 <code>exec jnl-oobe</code> 替代 Noctalia。"
            },
            {
              "t": "steps",
              "items": [
                [
                  "八",
                  "步",
                  "流",
                  "程"
                ],
                [
                  [
                    "欢迎",
                    "选择语言（中文 / English）"
                  ],
                  [
                    "区域",
                    "选择时区（<code>timedatectl</code> + <code>/etc/localtime</code>）"
                  ],
                  [
                    "键盘",
                    "选择键盘布局"
                  ],
                  [
                    "网络",
                    "自动获取（DHCP）或静态地址"
                  ],
                  [
                    "磁盘",
                    "选择目标盘并确认数据会被清空；页面实时列出可用磁盘"
                  ],
                  [
                    "账户",
                    "创建用户名与密码"
                  ],
                  [
                    "软件",
                    "确认预装软件（LibreOffice / GDEBI / Firefox）"
                  ],
                  [
                    "摘要 → 开始安装",
                    "显示实时进度条与安装日志，完成后点击重启"
                  ]
                ]
              ]
            },
            {
              "t": "p",
              "x": "所有设置经 <code>sudo</code> 免密生效。一个细节是按键可用性：回车=下一步、Tab 切换输入框；复选框调用 <code>set_can_focus(False)</code> 以免抢走焦点。键盘驱动的修复本身也是一段排障故事——见 <a href=\"#jnl-3-3\">3.3</a> 的 gid 冲突。"
            }
          ]
        },
        {
          "id": "jnl-5-2",
          "num": "5.2",
          "title": "磁盘页与双盘环境",
          "lead": "怎么区分「安装环境盘」和「目标盘」。",
          "tags": [
            "安装"
          ],
          "blocks": [
            {
              "t": "p",
              "x": "真实装机在 QEMU 里用<b>双盘</b>模拟："
            },
            {
              "t": "table",
              "head": [
                "虚拟盘",
                "角色",
                "引导方式"
              ],
              "rows": [
                [
                  "<code>rootfs.ext4</code>（vda，8 GB）",
                  "安装环境（含 OOBE 与系统）",
                  "<code>-kernel out/bzImage</code>"
                ],
                [
                  "<code>target.img</code>（vdb，40 GB 稀疏）",
                  "<b>安装目标</b>，被分区 / 格式化 / 写入 GRUB",
                  "装完后由 SeaBIOS → GRUB 引导"
                ]
              ]
            },
            {
              "t": "p",
              "x": "磁盘页需要正确识别并列出目标盘 <code>vdb — 40GB</code>，同时<b>排除正在运行中的安装盘 vda</b>。实现上通过 <code>/proc/self/mountinfo</code> 的 <code>maj:min</code> 定位根所在磁盘并排除它——不能直接用 <code>/proc/mounts</code>，因为那里根设备显示为 <code>/dev/root</code>，无法定位到具体盘。"
            },
            {
              "t": "note",
              "k": "两种启动模式",
              "x": "安装环境模式：<code>bash scripts/qemu-desktop.sh</code>（默认，挂两盘并用 -kernel）；已装系统模式：<code>JNL_BOOT=disk bash scripts/qemu-desktop.sh</code>（只挂目标盘、不带 -kernel，走 GRUB）。"
            }
          ]
        },
        {
          "id": "jnl-5-3",
          "num": "5.3",
          "title": "真实装机：分区到引导",
          "lead": "rsync 拷系统，GRUB 写进目标盘 MBR。",
          "tags": [
            "装机",
            "重点"
          ],
          "blocks": [
            {
              "t": "p",
              "x": "这不是「模拟安装」，而是真的把系统写到第二块盘上。安装动作按顺序执行："
            },
            {
              "t": "steps",
              "items": [
                [
                  "装",
                  "机",
                  "动",
                  "作"
                ],
                [
                  [
                    "分区",
                    "<code>parted</code> 建 MBR 分区表 + 单个 ext4 主分区"
                  ],
                  [
                    "格式化",
                    "<code>mkfs.ext4</code> 格式化目标分区"
                  ],
                  [
                    "拷贝系统",
                    "<code>rsync</code> 把整个系统拷过去，排除 OOBE 标记与 live 挂载目录"
                  ],
                  [
                    "写配置",
                    "生成 <code>fstab</code>（用 UUID 标识分区）"
                  ],
                  [
                    "装引导",
                    "<code>grub-install</code>（i386-pc，BIOS/MBR）并写 <code>grub.cfg</code>"
                  ],
                  [
                    "重启",
                    "<code>systemctl reboot</code>，从目标盘引导进桌面"
                  ]
                ]
              ]
            },
            {
              "t": "p",
              "x": "验证记录显示：<code>run_apply END ok=True</code>，所有步骤 <code>rc=0</code>；<code>lsblk</code> 显示 <code>vdb → vdb1 (40G ext4)</code>；用 <code>JNL_BOOT=disk</code> 重启后，SeaBIOS → GRUB → 内核 → 约 5 秒到 <code>graphical.target</code> → 进入桌面。装好的系统不再进入 OOBE（标记已被排除），是干净的 Noctalia 桌面，剩余约 34 GB。"
            },
            {
              "t": "faq",
              "q": "为什么拷贝时要排除 live 挂载目录？",
              "a": "安装环境本身可能是从 ISO 的 squashfs + overlay 启动的，存在 <code>/squash</code>、<code>/iso</code>、<code>/ovl</code>、<code>/overlay</code> 等挂载点。若不排除，会把安装介质一并拷进目标盘，既浪费空间又可能让新系统的挂载关系错乱。"
            }
          ]
        },
        {
          "id": "jnl-5-4",
          "num": "5.4",
          "title": "装机关键修复",
          "lead": "几处「不修就不可用」的问题。",
          "tags": [
            "踩坑"
          ],
          "blocks": [
            {
              "t": "table",
              "head": [
                "问题",
                "根因",
                "修复"
              ],
              "rows": [
                [
                  "sudo 提权失败",
                  "<code>jnl-niri.service</code> 的 <code>CapabilityBoundingSet=CAP_SYS_ADMIN</code> 限制能力边界，子进程 sudo 拿不到 <code>CAP_SETUID</code>",
                  "移除该限制，保留 <code>AmbientCapabilities=CAP_SYS_ADMIN</code>（niri 需要 DRM master）"
                ],
                [
                  "SSH 不通（banner 超时）",
                  "<code>eth0</code> 一直 DOWN，networkd 未拉起",
                  "<code>jnl-netup.service</code> 兜底：<code>ip link set eth0 up</code> + 静态地址 <code>10.0.2.15</code>"
                ],
                [
                  "镜像空间满、apt 装不了",
                  "构建产物 <code>/build</code> 3.6 GB + apt 缓存 711 MB 占满 8 GB",
                  "<code>os-make-image.sh</code> 打包前清理，rootfs 降到 3.2 GB、留 4.2 GB 可用"
                ],
                [
                  "启动卡 90 秒",
                  "<code>serial-getty@ttyS0</code> 等待 <code>dev-ttyS0.device</code> 超时",
                  "mask 掉该单元"
                ],
                [
                  "欢迎语显示 Noctalia",
                  "品牌化未应用到自建系统翻译文件",
                  "在遮掩脚本里改 Noctalia 的 en/zh 翻译"
                ]
              ]
            },
            {
              "t": "note",
              "k": "遗留",
              "x": "文档如实记录了几处未解项：<code>sources.list</code> 仓库路径仍含上游字样（功能正常）；networkd 未自动拉起 eth0（靠兜底服务）；Noctalia 自身欢迎向导在 OOBE 后仍会弹一次（可预置配置跳过）；OOBE 按键日志写在 <code>/tmp/oobe-keys.log</code>。"
            }
          ]
        }
      ]
    },
    {
      "id": "jnl-6",
      "num": "6",
      "title": "实体机 ISO 与三重启动",
      "lead": "从 squashfs live 到 BIOS / UEFI / Secure Boot。",
      "sections": [
        {
          "id": "jnl-6-1",
          "num": "6.1",
          "title": "ISO 是怎么做出来的",
          "lead": "initramfs + squashfs + grub-mkrescue。",
          "tags": [
            "ISO",
            "重点"
          ],
          "blocks": [
            {
              "t": "p",
              "x": "安装介质产物是 <code>jnl-os-installer.iso</code>（BIOS + UEFI 混合，squashfs 约 874 MB），构建脚本为 <code>scripts/build-iso.sh</code>。它的启动链是：GRUB → vmlinuz → initrd → squashfs + overlay（live）→ systemd → <b>OOBE</b>。"
            },
            {
              "t": "steps",
              "items": [
                [
                  "三",
                  "步",
                  "构",
                  "建"
                ],
                [
                  [
                    "initramfs",
                    "用 busybox + 自定义 <code>/init</code>：挂载 ISO9660 → loop 挂载 squashfs → tmpfs 作上层 overlay → <code>switch_root</code> 到 systemd"
                  ],
                  [
                    "squashfs",
                    "<code>mksquashfs -comp xz</code>——因为内核只支持 xz / zlib，<b>不支持 zstd</b>"
                  ],
                  [
                    "引导",
                    "<code>grub-mkrescue</code> 同时生成 BIOS（i386-pc）与 UEFI（x86_64-efi）El Torito 引导"
                  ]
                ]
              ]
            },
            {
              "t": "p",
              "x": "为了让这条链成立，内核配置必须包含 <code>ISO9660_FS</code>、<code>BLK_DEV_LOOP</code>、<code>SQUASHFS_XZ</code>、<code>OVERLAY_FS</code>、<code>TMPFS</code> 与 <code>EFI</code>。启动后用状态标志验证：<code>flag=YES</code>、<code>python=1</code>（OOBE 正在运行）、<code>niri=y</code>、<code>root=overlay</code>。"
            }
          ]
        },
        {
          "id": "jnl-6-2",
          "num": "6.2",
          "title": "BIOS / UEFI / Secure Boot 三重验证",
          "lead": "三种启动方式都到达 OOBE。",
          "tags": [
            "验证"
          ],
          "blocks": [
            {
              "t": "p",
              "x": "ISO 的验证覆盖三种固件路径，统一判据是「启动到 OOBE」：<code>flag=YES python=1 niri=y root=overlay</code>。测试脚本 <code>scripts/test-iso.sh</code> 用 <code>JNL_ISO_MODE=bios|uefi</code> 切换模式，UEFI 路径走 OVMF pflash 模拟固件。"
            },
            {
              "t": "table",
              "head": [
                "模式",
                "引导链",
                "结果"
              ],
              "rows": [
                [
                  "Legacy BIOS",
                  "SeaBIOS → GRUB(i386-pc) → 内核 → initrd → live → OOBE",
                  "通过"
                ],
                [
                  "UEFI（关 Secure Boot）",
                  "OVMF → GRUB(x86_64-efi) → 内核 → OOBE",
                  "通过"
                ],
                [
                  "UEFI + Secure Boot",
                  "OVMF 校验签名 → GRUB → 内核 → OOBE",
                  "通过"
                ]
              ]
            },
            {
              "t": "note",
              "k": "与用户手册的差异",
              "x": "《使用教程》里写「UEFI + Secure Boot 开启时引导器未获微软签名、会被固件拒绝，需关闭」——这是面向普通用户、在真实主板上的保守指引；而状态文档记录的 Secure Boot 三重启动通过，是在 OVMF（开源 UEFI 实现）中用自己的 MOK 与签名体系验证的。两者并不矛盾：前者说的是「未导入自定义密钥的普通主板」，后者说的是「导入了项目密钥 / 测试环境」。"
            }
          ]
        },
        {
          "id": "jnl-6-3",
          "num": "6.3",
          "title": "启动菜单与诊断入口",
          "lead": "三个入口，黑屏时有得选。",
          "tags": [
            "诊断"
          ],
          "blocks": [
            {
              "t": "p",
              "x": "启动菜单提供三个入口：<b>Java Net Lava OS Installer</b>（正常安装）；<b>Debug: initcall trace</b>（逐行打印内核驱动初始化，启动卡住时诊断）；<b>Debug: no modeset</b>（跳过显卡模式设置，黑屏时尝试）。这是把「出问题怎么办」前置到启动阶段的设计。"
            },
            {
              "t": "p",
              "x": "写 U 盘必须用 <b>DD / Raw 模式</b>（Rufus 选 DD 而不是 ISO 文件复制；balenaEtcher 默认即 DD；win32diskimager / dd 直接整盘写）。若把 ISO 解压后把文件复制进 U 盘，就没有 ISO9660 引导结构，会报 <code>boot medium not found</code>。写完后用 <code>scripts/verify-usb.ps1</code> 检测 ISO9660 魔数 <code>CD001</code> 与 SHA256 一致性，两项都 OK 才启动。"
            },
            {
              "t": "note",
              "k": "截图不可靠",
              "x": "文档特别提醒：QEMU monitor 的 <code>screendump</code> 偶尔返回早期帧或陈旧帧。判定系统状态应以可靠手段为准——<code>/proc</code> 进程、<code>/proc/mounts</code>、flag 文件、<code>niri msg</code>，或用 ImageMagick 独立算图片平均色。"
            }
          ]
        }
      ]
    },
    {
      "id": "jnl-7",
      "num": "7",
      "title": "Secure Boot 信任链",
      "lead": "MOK、GPG 分离签名与 GRUB 自验签。",
      "sections": [
        {
          "id": "jnl-7-1",
          "num": "7.1",
          "title": "为什么需要签名",
          "lead": "从固件到内核的信任如何传递。",
          "tags": [
            "安全"
          ],
          "blocks": [
            {
              "t": "p",
              "x": "Secure Boot（安全启动）是 UEFI 固件的一项机制：只允许加载带可信签名的引导器与内核，防止启动阶段的恶意代码（如 rootkit）抢在系统之前运行。要让它为 JNL OS 所用，需要自己建立一套签名体系，并把公钥交由固件信任。"
            },
            {
              "t": "p",
              "x": "仓库 <code>security/secureboot/</code> 目录里保存着两份物料：一张 <b>MOK 证书</b>（<code>MOK.crt</code>，主题为 Java Net Lava OS Secure Boot）与一把 <b>GRUB 公钥</b>（<code>grub-pubkey.gpg</code>）。前者用于内核签名，后者用于 GRUB 对自身加载的组件做校验。"
            },
            {
              "t": "note",
              "k": "边界",
              "x": "本门只讲信任链的结构与已验证结论，不提供密钥生成参数、签名命令、固件导入步骤或可照做的配置——这类操作一旦出错可能导致设备无法启动，须由具备经验的人员在可控环境中进行。"
            }
          ]
        },
        {
          "id": "jnl-7-2",
          "num": "7.2",
          "title": "三层签名如何咬合",
          "lead": "MOK 签内核、sbsign 签引导器、GPG 分离验签。",
          "tags": [
            "安全",
            "重点"
          ],
          "blocks": [
            {
              "t": "p",
              "x": "状态文档把这套体系概括为一句话：<b>MOK（X.509）签内核 + sbsign 签 EFI GRUB；GPG（RSA4096）分离签名内核 / initrd / grub.cfg；GRUB 内嵌公钥 + pgp 模块自验签；<code>--disable-shim-lock</code></b>。拆开看是三层："
            },
            {
              "t": "steps",
              "items": [
                [
                  "信",
                  "任",
                  "链",
                  "三",
                  "层"
                ],
                [
                  [
                    "固件层",
                    "UEFI 固件信任 MOK，MOK 的私钥给内核签名；EFI 版 GRUB 用 <code>sbsign</code> 签名，使固件愿意加载它。"
                  ],
                  [
                    "引导层",
                    "GRUB 内嵌 GPG 公钥并加载 <code>pgp</code> 模块，启动时对内核、initrd、<code>grub.cfg</code> 的分离签名做校验——签名不匹配就拒绝加载。"
                  ],
                  [
                    "系统层",
                    "校验通过后进入内核，再到 <code>graphical.target</code> 与 niri 桌面。"
                  ]
                ]
              ]
            },
            {
              "t": "p",
              "x": "OVMF 实测链路为：GRUB 菜单 → 内核 → <code>graphical.target</code> → niri 桌面。ISO 的 Secure Boot 启动同样到达 OOBE（<code>flag=YES python=1 niri=y root=overlay</code>）。这说明签名链在测试固件上是完整可用的。"
            },
            {
              "t": "faq",
              "q": "<code>--disable-shim-lock</code> 是做什么的？",
              "a": "shim 是连接固件与 Linux 引导器的中间层，shim lock 会对它加载的对象做额外校验。项目在自己的签名体系下关闭这层锁，改由内嵌 GPG 公钥的 GRUB 自行完成校验——这样信任链由自己的密钥说了算，但前提是 GRUB 自身已通过固件校验。"
            }
          ]
        },
        {
          "id": "jnl-7-3",
          "num": "7.3",
          "title": "现状与未竟",
          "lead": "已经打通的与仍在规划的分清楚。",
          "tags": [
            "边界"
          ],
          "blocks": [
            {
              "t": "p",
              "x": "要明确区分：<b>Secure Boot 全链路已打通并验证</b>，但开发计划里 M2 的完整目标还包括 <b>LUKS2 全盘加密 + TPM2 无感解锁 + 恢复密钥体系</b>，这部分仍是规划。状态文档第 5 节把「安全启动链：Secure Boot + LUKS2 + TPM2」列为下一步；计划文档也把「加密安装 + TPM 解锁率 ≥ 99% + 篡改场景全部拒绝并留痕」列为 M2 的出口门禁。"
            },
            {
              "t": "table",
              "head": [
                "项",
                "当前状态"
              ],
              "rows": [
                [
                  "Secure Boot 签名与验证",
                  "已落地（OVMF + ISO 三重启动）"
                ],
                [
                  "LUKS2 全盘加密",
                  "规划中（M2）"
                ],
                [
                  "TPM2 密封解锁与 PCR 联动",
                  "规划中（M2，并与 A/B 更新咬合）"
                ],
                [
                  "恢复密钥 / 应急救援镜像",
                  "规划中（M2）"
                ]
              ]
            },
            {
              "t": "note",
              "k": "不承诺",
              "x": "首版明确不承诺的清单里还有：Apple M4 全硬件功能、NVIDIA 专有驱动在 rc 内核上的全程支持、依赖内核级反作弊的联机游戏、Windows 专业套件、云端 AI 托管服务。这些边界被刻意写进文档，避免用户产生过高预期。"
            }
          ]
        }
      ]
    },
    {
      "id": "jnl-8",
      "num": "8",
      "title": ".jnlpkg：原生可执行包",
      "lead": "一个文件，既能直接跑，也能装进系统。",
      "sections": [
        {
          "id": "jnl-8-1",
          "num": "8.1",
          "title": "设计目标：一份文件两种语义",
          "lead": "对标免安装体验 + 自有后缀品牌。",
          "tags": [
            "包格式",
            "重点"
          ],
          "blocks": [
            {
              "t": "p",
              "x": "<code>.jnlpkg</code> 是 JNL OS 自有的<b>自解压可执行包</b>格式（format=1，2026-11-15 落地）。一个文件同时具备两种语义：<b>直接执行</b>（免安装，像 AppImage）与<b>安装到系统</b>（像包管理器）。它既是技术方案，也是品牌识别——自有后缀让「这是 JNL 的软件」一眼可辨。"
            },
            {
              "t": "table",
              "head": [
                "目标",
                "手段"
              ],
              "rows": [
                [
                  "一个文件双语义",
                  "直接执行与 <code>jnl-pkg install</code> 共用同一份 payload"
                ],
                [
                  "零依赖解释器",
                  "头部本身就是合法 shell，<code>sh pkg</code> 也能跑"
                ],
                [
                  "不改自定义内核",
                  "复用内核已编入的 <code>CONFIG_BINFMT_MISC</code>"
                ],
                [
                  "安全",
                  "magic 校验、tar 路径穿越防护、包名白名单、清单只用 sed 解析（绝不 eval）"
                ],
                [
                  "快",
                  "内容寻址缓存（sha256），重复执行免解压"
                ]
              ]
            }
          ]
        },
        {
          "id": "jnl-8-2",
          "num": "8.2",
          "title": "文件结构：4096 字节头 + payload + rcl 尾",
          "lead": "三段式布局，各司其职。",
          "tags": [
            "包格式"
          ],
          "blocks": [
            {
              "t": "p",
              "x": "一个 <code>.jnlpkg</code> 由三段组成，每段的起点与长度都被严格约定："
            },
            {
              "t": "table",
              "head": [
                "段",
                "位置",
                "内容"
              ],
              "rows": [
                [
                  "Header",
                  "offset 0，定长 4096 字节",
                  "首行 <code>JNLPKG=1; exec /usr/lib/jnl/jnlpkg-run \"$0\" \"$@\"</code>，随后是注释行与空行填充；前 6 字节 <code>JNLPKG</code> 是 magic"
                ],
                [
                  "Payload",
                  "offset 4096 起",
                  "<code>gzip( tar( jnl.pkg, payload/... ) )</code>，运行时用 <code>tail -c +4097</code> 精确切出"
                ],
                [
                  "尾部标记",
                  "文件最末尾 3 字节",
                  "固定的 <code>rcl</code> 标记（详见 <a href=\"#jnl-8-5\">8.5</a>）"
                ]
              ]
            },
            {
              "t": "p",
              "x": "<b>Header 为什么定长 4096</b>：解释器不必扫描分隔符，直接从第 4097 字节开始读就是数据区。<b>首行为什么是合法 shell</b>：<code>JNLPKG=1</code> 是变量赋值、<code>exec</code> 转入解释器，因此 <code>sh pkg</code> 与内核 binfmt 走的是完全相同的代码路径。"
            },
            {
              "t": "note",
              "k": "命名呼应",
              "x": "包尾的 <code>rcl</code> 标记与本百科 rcl 语录篇同源——它是项目的一个内部趣味符号：构建时自动追加并在输出里显现（<code>footer=rcl</code>），<code>jnl-pkg info-jnl</code> 也能查到；gzip 解压会自动忽略这段尾部数据，所以不影响任何功能。"
            }
          ]
        },
        {
          "id": "jnl-8-3",
          "num": "8.3",
          "title": "三条执行路径汇聚一处",
          "lead": "直接跑、sh 跑、jnl-pkg run 跑的是同一个解释器。",
          "tags": [
            "包格式",
            "重点"
          ],
          "blocks": [
            {
              "t": "p",
              "x": "无论用哪种方式启动，最终都落到同一个解释器 <code>/usr/lib/jnl/jnlpkg-run</code>："
            },
            {
              "t": "steps",
              "items": [
                [
                  "三",
                  "条",
                  "路",
                  "径"
                ],
                [
                  [
                    "<code>./foo.jnlpkg</code>",
                    "内核 binfmt_misc 按 magic <code>JNLPKG</code> 识别，自动交给解释器"
                  ],
                  [
                    "<code>sh foo.jnlpkg</code>",
                    "首行的 <code>exec</code> 语句转入解释器"
                  ],
                  [
                    "<code>jnl-pkg run foo.jnlpkg</code>",
                    "前端直接 <code>exec</code> 解释器"
                  ]
                ]
              ]
            },
            {
              "t": "p",
              "x": "解释器解压到 <code>~/.cache/jnlpkg/sha256/</code>（按内容寻址缓存），读取 <code>jnl.pkg</code> 清单后执行入口。内核注册靠 <code>/etc/binfmt.d/jnlpkg.conf</code> 里的 <code>:jnlpkg:M::JNLPKG::/usr/lib/jnl/jnlpkg-run:</code>——文档特别提醒<b>末尾冒号必须保留</b>，flags 为空但分隔符不能省，否则内核会返回无效参数。"
            },
            {
              "t": "table",
              "head": [
                "命令",
                "作用"
              ],
              "rows": [
                [
                  "<code>jnl-pkg build &lt;dir&gt;</code>",
                  "把含 <code>jnl.pkg</code> + <code>payload/</code> 的目录打成包"
                ],
                [
                  "<code>jnl-pkg run foo.jnlpkg</code>",
                  "不安装直接运行"
                ],
                [
                  "<code>jnl-pkg install foo.jnlpkg</code>",
                  "安装（按后缀自动分发 .jnlpkg / .deb / 包名）"
                ],
                [
                  "<code>jnl-pkg remove &lt;name&gt;</code>",
                  "卸载"
                ],
                [
                  "<code>jnl-pkg list-jnl</code> / <code>info-jnl</code>",
                  "列出 / 查看详情"
                ]
              ]
            }
          ]
        },
        {
          "id": "jnl-8-4",
          "num": "8.4",
          "title": "安全模型",
          "lead": "五道防线与已知限制。",
          "tags": [
            "包格式",
            "安全"
          ],
          "blocks": [
            {
              "t": "table",
              "head": [
                "防线",
                "实现"
              ],
              "rows": [
                [
                  "magic 校验",
                  "解释器先查 6 字节 <code>JNLPKG</code>，坏文件直接拒绝"
                ],
                [
                  "路径穿越",
                  "解压前用 <code>tar -tz</code> 扫描，拒绝 <code>../</code> 与绝对路径成员"
                ],
                [
                  "清单注入",
                  "只用 <code>sed -n</code> 解析 key=value，<b>不 eval / 不 source</b>"
                ],
                [
                  "包名注入",
                  "白名单正则；安装前检查不与系统命令同名（防覆盖 <code>ls</code> 一类）"
                ],
                [
                  "入口逃逸",
                  "拒绝 <code>..</code> 与绝对路径的 entry"
                ]
              ]
            },
            {
              "t": "p",
              "x": "安装后的目录布局：<code>/opt/jnl-pkgs/&lt;name&gt;/</code>（只读数据）、<code>/usr/local/bin/&lt;name&gt;</code>（包装器）、<code>/var/lib/jnl-pkg/</code>（安装清单与原始包）、以及 <code>desktop=true</code> 时生成的 <code>.desktop</code> 启动项。MIME 类型为 <code>application/x-jnlpkg</code>，双击由「JNL 安装器」处理。验证方面，<code>scripts/test-jnlpkg.sh</code> 有 27 项测试（三路径 / 缓存 / 安装卸载 / 坏 magic / 路径穿越 / 包名冲突），并在 Secure Boot 的真机环境里跑过运行时验证。"
            },
            {
              "t": "note",
              "k": "已知限制",
              "x": "v1 没有签名与沙箱，信任模型等同于直接执行任意程序；签名体系计划随 M2 的密钥链扩展。镜像内没装文件管理器时双击链路未激活（MIME 与 handler 已就位）；<code>.desktop</code> 关联靠手写缓存，因为镜像里没有桌面数据库更新工具。"
            }
          ]
        },
        {
          "id": "jnl-8-5",
          "num": "8.5",
          "title": "清单字段与打包样例",
          "lead": "从零打一个自己的应用。",
          "tags": [
            "包格式"
          ],
          "blocks": [
            {
              "t": "p",
              "x": "打包源目录固定含两个条目：<code>jnl.pkg</code>（清单）与 <code>payload/</code>（应用内容）。清单必填 <code>name</code>（小写字母数字与下划线连字符）、<code>version</code>、<code>entry</code>（相对 payload 的入口，禁止 <code>..</code> 与绝对路径）；可选 <code>desktop</code>、<code>title</code>、<code>summary</code>、<code>icon</code>、<code>category</code>。"
            },
            {
              "t": "code",
              "lang": "ini",
              "x": "name=hello\nversion=1.0.0\nentry=hello.sh\ndesktop=true\ntitle=Hello JNL\nsummary=打包教程示例\ncategory=Utility"
            },
            {
              "t": "p",
              "x": "入口脚本第一行写解释器声明（<code>#!/bin/sh</code> 或 <code>#!/usr/bin/env python3</code>）并设为可执行；运行时可通过 <code>JNL_PKG_NAME</code> / <code>JNL_PKG_VERSION</code> / <code>JNL_PKG_DIR</code> 获取自身信息。构建后用 <code>tail -c 3</code> 应能看到尾部标记，<code>sh pkg</code> 应能直接跑出结果。"
            },
            {
              "t": "faq",
              "q": "<code>gzip: trailing garbage ignored</code> 要紧吗？",
              "a": "不要紧。这正是尾部标记被 gzip 当作无关数据忽略时的正常提示，解压与安装结果完全正确。"
            }
          ]
        }
      ]
    },
    {
      "id": "jnl-9",
      "num": "9",
      "title": "自研应用、应用商店与分发",
      "lead": "12 个系统应用 + 37 项商店索引。",
      "sections": [
        {
          "id": "jnl-9-1",
          "num": "9.1",
          "title": "12 个自研系统应用",
          "lead": "全部以 .jnlpkg 形式交付。",
          "tags": [
            "应用"
          ],
          "blocks": [
            {
              "t": "p",
              "x": "仓库 <code>apps/</code> 目录下有 12 个自研应用，每个是一个含 <code>jnl.pkg</code> 与 <code>payload/</code> 的打包源，构建为 <code>.jnlpkg</code> 后在商店上架。它们覆盖了从系统设置到日常工具的一整套体验："
            },
            {
              "t": "table",
              "head": [
                "应用",
                "定位"
              ],
              "rows": [
                [
                  "JNL 设置",
                  "自研系统设置：网络（含 WiFi 开关与扫描）、时间语言（NTP 开关）、天气定位、账户、关于系统"
                ],
                [
                  "JNL 应用商店",
                  "蓝白色商店风格的官方应用入口，浏览 / 下载 / 安装 .jnlpkg"
                ],
                [
                  "JNL 运行",
                  "类 Windows 的 Win+R 运行窗口"
                ],
                [
                  "JNL 安装器",
                  "双击 .deb / .jnlpkg 的默认图形安装器（替代 GDebi）"
                ],
                [
                  "JNL 更新中心",
                  "更新入口"
                ],
                [
                  "计算器 / 时钟 / 截图工具 / 图片查看器 / 画图",
                  "日常工具"
                ],
                [
                  "文件管理器 / 任务管理器",
                  "系统工具"
                ]
              ]
            },
            {
              "t": "note",
              "k": "意义",
              "x": "「设置」自身就是 <code>.jnlpkg</code> 原生包、可在商店重装与更新——这形成了自举：系统核心应用走的是和应用开发者一样的分发通道，而不是特权路径。"
            }
          ]
        },
        {
          "id": "jnl-9-2",
          "num": "9.2",
          "title": "商店索引与分发链路",
          "lead": "SHA256 校验 + 本地回退。",
          "tags": [
            "分发"
          ],
          "blocks": [
            {
              "t": "p",
              "x": "<code>store/index.json</code> 目前列出 <b>37 项应用</b>，分两类：12 个 JNL 自研应用（分类为系统 / 应用 / 工具），以及 25 项「热门软件」条目（微信、QQ、WPS、Chrome、Firefox、Steam、VS Code、网易云音乐、钉钉、腾讯会议、OBS、VLC、GIMP、Blender、Node.js、Docker 等）。"
            },
            {
              "t": "p",
              "x": "商店打开时读取官方 Gitee 仓库的索引；网络不可用时自动回退到本地索引（<code>/var/lib/jnl/store/</code>）。点安装后下载包、做 <b>SHA256 校验</b>、再交给安装器。开发者上架一个应用，需把产物放进 <code>store/</code>、在索引 <code>apps</code> 数组追加条目（填正确的 name / title / version / url / sha256 / size），推送后商店点「刷新源」即可看到。"
            },
            {
              "t": "note",
              "k": "诚实口径",
              "x": "「热门软件」是商店索引里的条目，代表分发入口已就位；它不等于这些 Windows 应用已能在 JNL OS 上运行——Windows 应用兼容层仍属规划中的 M4。索引条目与「可运行」是两件事。"
            }
          ]
        },
        {
          "id": "jnl-9-3",
          "num": "9.3",
          "title": "如何读这份应用生态",
          "lead": "入口、机制、边界三层看。",
          "tags": [
            "导读"
          ],
          "blocks": [
            {
              "t": "p",
              "x": "读 JNL 的应用生态，可分成三层："
            },
            {
              "t": "cards",
              "items": [
                [
                  "入口层",
                  "商店、双击安装、运行窗口、文件管理器——用户接触到的图形入口。"
                ],
                [
                  "机制层",
                  "<code>.jnlpkg</code> 格式、<code>jnl-pkg</code> 前端、binfmt 直执行、SHA256 校验——支撑入口的技术。"
                ],
                [
                  "边界层",
                  "哪些已落地（12 个自研应用），哪些只是索引条目（热门软件），哪些仍是规划（Wine / Proton 兼容层）。"
                ]
              ]
            },
            {
              "t": "p",
              "x": "这样分层后，再看「商店里有微信 / Steam」就不会误读为「已经能玩 Steam 游戏」——它说明的是分发目录已经搭好，具体能不能跑取决于兼容层的进展。"
            }
          ]
        }
      ]
    },
    {
      "id": "jnl-10",
      "num": "10",
      "title": "上手使用：从安装到日常",
      "lead": "快捷键、设置、运行窗口与常见问题。",
      "sections": [
        {
          "id": "jnl-10-1",
          "num": "10.1",
          "title": "桌面快捷键",
          "lead": "Mod 键为核心的一套操作。",
          "tags": [
            "使用"
          ],
          "blocks": [
            {
              "t": "p",
              "x": "桌面为 niri（Wayland），终端为 Tabby，Shell 为 Zsh + Oh-My-Zsh。常用快捷键："
            },
            {
              "t": "table",
              "head": [
                "快捷键",
                "功能"
              ],
              "rows": [
                [
                  "<code>Mod + Return</code>",
                  "打开终端（Tabby）"
                ],
                [
                  "<code>Mod + S</code>",
                  "打开「设置」（Windows 11 风格）"
                ],
                [
                  "<code>Mod + R</code>",
                  "打开「运行」窗口（Win+R）"
                ],
                [
                  "<code>Mod + E</code>",
                  "文件管理器"
                ],
                [
                  "<code>Mod + I</code>",
                  "系统信息面板"
                ],
                [
                  "<code>Mod + Q</code>",
                  "关闭窗口"
                ],
                [
                  "<code>Mod + Shift + Q</code>",
                  "退出桌面会话"
                ],
                [
                  "<code>Mod + Tab</code>",
                  "窗口总览"
                ],
                [
                  "<code>Mod + /</code>",
                  "快捷键帮助浮层"
                ],
                [
                  "<code>Mod + 方向键</code>",
                  "切换窗口 / 列"
                ]
              ]
            },
            {
              "t": "note",
              "k": "商店快捷键",
              "x": "应用商店没有默认快捷键，可从应用列表启动，或在终端输入 <code>jnl-store</code>。"
            }
          ]
        },
        {
          "id": "jnl-10-2",
          "num": "10.2",
          "title": "设置面板五个分区",
          "lead": "网络、时间、天气、账户、关于。",
          "tags": [
            "使用"
          ],
          "blocks": [
            {
              "t": "steps",
              "items": [
                [
                  "五",
                  "个",
                  "分",
                  "区"
                ],
                [
                  [
                    "网络和 Internet",
                    "查看有线 / WiFi 状态与 IP；WiFi 开关、扫描、输入密码连接；后端为 NetworkManager，终端可用 <code>nmtui</code> / <code>nmcli</code>"
                  ],
                  [
                    "时间和语言",
                    "实时时钟、时区、NTP 自动同步开关（如阿里云时间源）、手动设置"
                  ],
                  [
                    "天气与定位",
                    "IP 定位城市或手选，当前温度 / 体感 / 湿度 / 风速与 4 天预报（数据来自公开气象接口）"
                  ],
                  [
                    "账户",
                    "查看用户名与设备名、修改登录密码"
                  ],
                  [
                    "关于系统",
                    "系统版本、内核、内存、处理器、根分区信息"
                  ]
                ]
              ]
            },
            {
              "t": "p",
              "x": "时间不准时打开 NTP 开关即可自动校准，终端用 <code>timedatectl status</code> 查看；WiFi 扫不到先确认开关已开，再执行 <code>nmcli radio wifi on</code> 与 <code>nmcli device wifi rescan</code>。"
            }
          ]
        },
        {
          "id": "jnl-10-3",
          "num": "10.3",
          "title": "运行窗口与软件安装",
          "lead": "网址、路径、命令一站式入口。",
          "tags": [
            "使用"
          ],
          "blocks": [
            {
              "t": "p",
              "x": "「运行」窗口（<code>Mod+R</code>）沿用 Windows 习惯：输入网址（含 <code>://</code> 或 <code>www.</code>）用浏览器打开；输入文件 / 目录路径用文件管理器或默认程序打开；输入命令则在终端执行（取消勾选则后台执行）。还支持历史记录下拉与文件浏览按钮。"
            },
            {
              "t": "p",
              "x": "安装软件有图形与终端两条路：图形方式在文件管理器里双击 <code>.deb</code> / <code>.jnlpkg</code>，由 JNL 安装器打开、看信息、点安装（<code>.deb</code> 缺依赖会自动补齐）；终端方式用 <code>jnl-pkg install / list-jnl / info-jnl / remove / run</code>。由于内核已注册 binfmt，<code>.jnlpkg</code> 直接赋予可执行权限后 <code>./pkg.jnlpkg</code> 也能跑。"
            },
            {
              "t": "faq",
              "q": "启动报「boot medium not found」怎么办？",
              "a": "几乎都是 U 盘烧录方式错误——把 ISO 当作普通文件复制了。用 DD / Raw 模式整盘重写，并用校验脚本确认 ISO9660 魔数与 SHA256 一致；若 ISO 正确但仍报挂载失败，多为 U 盘坏块，换一个 U 盘重烧。"
            }
          ]
        }
      ]
    },
    {
      "id": "jnl-11",
      "num": "11",
      "title": "构建体系与脚本",
      "lead": "Windows 开发机 + WSL2 + QEMU 的工程闭环。",
      "sections": [
        {
          "id": "jnl-11-1",
          "num": "11.1",
          "title": "开发机前提与环境组成",
          "lead": "Windows 侧、WSL 侧、虚拟化侧各司其职。",
          "tags": [
            "构建"
          ],
          "blocks": [
            {
              "t": "p",
              "x": "仓库 README 与 <code>docs/build.md</code> 给出的开发机前提是：<b>Windows 11 + WSL2</b>，WSL 发行版为 Ubuntu 24.04（通过 <code>.wsl/</code> 下的 rootfs 导入，命名为 <code>JNL-BUILD</code>），虚拟化用 <b>QEMU 8.2 + KVM（<code>/dev/kvm</code>）</b>，Windows 侧无需装 QEMU；构建目录建议 ≥ 30 GB 空闲。新路线阶段把构建目录统一为 <code>/root/jnl-os</code>，同步更新了 115 个脚本里的引用。"
            },
            {
              "t": "table",
              "head": [
                "侧",
                "承担什么"
              ],
              "rows": [
                [
                  "Windows 宿主",
                  "跑 UU远程 / VNC 客户端 / noVNC 浏览器；PowerShell 脚本负责启动与查看"
                ],
                [
                  "WSL2（JNL-BUILD）",
                  "编译内核、构建 rootfs 与 ISO、跑 QEMU、提供 SSH 与 noVNC"
                ],
                [
                  "QEMU",
                  "加载 bzImage 或 ISO，模拟双盘 / 固件（OVMF）/  virtio 设备"
                ]
              ]
            }
          ]
        },
        {
          "id": "jnl-11-2",
          "num": "11.2",
          "title": "构建脚本分层",
          "lead": "从内核到镜像的一条流水线。",
          "tags": [
            "构建"
          ],
          "blocks": [
            {
              "t": "p",
              "x": "仓库 <code>scripts/</code> 下有数百个脚本，大致可分四类。理解分类后，就不会被数量吓到——真正的主线只有一条，其余是检查、诊断与验证。"
            },
            {
              "t": "cards",
              "items": [
                [
                  "构建类",
                  "<code>bootstrap-build-env.sh</code>（依赖）、<code>build-kernel.sh</code>（内核）、<code>os-*.sh</code> 系列（自建基底：引导 / 配置 / 遮掩 / 修复 / 封装）、<code>build-apps.sh</code>（应用）、<code>build-iso.sh</code>（ISO）。"
                ],
                [
                  "启动类",
                  "<code>qemu-desktop.sh</code>（桌面 / 双盘）、<code>run-console-smoke.ps1</code>（控制台冒烟）、<code>run-desktop.ps1</code>（历史基线）。"
                ],
                [
                  "检查类",
                  "大量 <code>check-*.sh</code> / <code>verify-*.sh</code>：核对内核版本、驱动、会话、品牌字体、Secure Boot 工具、目标标记等。"
                ],
                [
                  "诊断类",
                  "<code>diag-*.sh</code> / <code>debug-*.sh</code> / <code>analyze-*.py</code>：分析桌面截图、Wayland 崩溃、OOBE 磁盘页、GRUB 探测等。"
                ]
              ]
            },
            {
              "t": "p",
              "x": "自建基底阶段的 <code>os-*.sh</code> 顺序是：debootstrap 引导 → 配 apt 与查询包 → 装桌面依赖 → 重编 Niri / Noctalia → 装 LibreOffice / GDEBI / Firefox → 配用户 / seatd / 会话 / locale / 网络 / SSH → 遮掩 → 各类修复 → 装 OOBE → 收尾 → 打 ext4 镜像。每一步都对应文档里的一条踩坑记录。"
            }
          ]
        },
        {
          "id": "jnl-11-3",
          "num": "11.3",
          "title": "远程查看：三条链路",
          "lead": "VNC、noVNC 与 SSH。",
          "tags": [
            "运维"
          ],
          "blocks": [
            {
              "t": "p",
              "x": "远程查看有三条链路：<b>VNC <code>127.0.0.1:5900</code></b>（客户端直连）、<b>noVNC <code>http://127.0.0.1:6080/vnc.html?autoconnect=true</code></b>（浏览器查看，推荐远程时用）、<b>SSH <code>127.0.0.1:2222</code></b>（调试，账号 <code>jnl</code>）。noVNC 由 WSL 内的 websockify 提供，脚本 <code>open-desktop-browser.cmd</code> 会自动检查并打开浏览器。"
            },
            {
              "t": "p",
              "x": "一个反复强调的环境坑：VNC 地址要填 <code>127.0.0.1</code> 而不是 <code>localhost</code>——Windows 会优先把 localhost 解析到 IPv6 的 <code>::1</code>，而 WSL 的端口转发只监听 IPv4，结果就是连不上。这个坑同时写进了 README 与状态文档。"
            }
          ]
        }
      ]
    },
    {
      "id": "jnl-12",
      "num": "12",
      "title": "里程碑 M0–M7 与质量门禁",
      "lead": "计划怎么编排、依赖怎么咬合。",
      "sections": [
        {
          "id": "jnl-12-1",
          "num": "12.1",
          "title": "八个里程碑一览",
          "lead": "每个里程碑是一个可演示、可测试的收敛点。",
          "tags": [
            "路线图"
          ],
          "blocks": [
            {
              "t": "table",
              "head": [
                "里程碑",
                "定义",
                "完成标志"
              ],
              "rows": [
                [
                  "M0",
                  "仓库骨架 + CI + 最小可启动镜像",
                  "每夜构建出能进 shell 的镜像；QEMU 启动成功率 ≥ 95%"
                ],
                [
                  "M1",
                  "稳定启动底座（图形 / 电源 / 外设）",
                  "首批机型稳定进 Wayland 桌面；挂起恢复 ≥ 98%"
                ],
                [
                  "M2",
                  "Secure Boot + LUKS2 + TPM2 全链",
                  "出厂默认加密安装、重启无感解锁；篡改全拒绝并留痕"
                ],
                [
                  "M3",
                  "Windows 范式桌面 MVP",
                  "任务栏 / 开始菜单 / 文件管理器 / 贴边分屏可用"
                ],
                [
                  "M4",
                  "Windows 应用兼容层 MVP",
                  "管理器里安装并运行至少一款常见 Windows 应用"
                ],
                [
                  "M5",
                  "本地 AI Agent MVP",
                  "自然语言完成文件整理 / 设置查询 / 应用启动，可关可审计"
                ],
                [
                  "M6",
                  "软件中心 + A/B 无回梯更新",
                  "三后端可用；更新失败自动回滚"
                ],
                [
                  "M7",
                  "Daily Driver 候选发布",
                  "全量验收清单全绿，灰度反馈「日常可用」"
                ]
              ]
            },
            {
              "t": "note",
              "k": "口径",
              "x": "里程碑是收敛点而非日历排期。文档明确不含日历日期；「完成」以可演示、可测试为准。本门不把规划中的里程碑写成已达成——目前实际完成的是 M0 的一部分、内核底座、桌面闭环、OOBE / ISO / 安全启动与原生包体系。"
            }
          ]
        },
        {
          "id": "jnl-12-2",
          "num": "12.2",
          "title": "关键路径与并行",
          "lead": "哪些必须串、哪些可以并。",
          "tags": [
            "路线图"
          ],
          "blocks": [
            {
              "t": "p",
              "x": "计划把 <b>M0 → M1 → M2 → M6 → M7</b> 定为关键路径——镜像、签名与更新体系互相咬合，不能跳步。<b>M3 → M5</b> 可与 M4 并行（不同技能树）；<b>WP7（CI / 测试）</b> 从 M0 起横切全程，没有独立里程碑。"
            },
            {
              "t": "steps",
              "items": [
                [
                  "硬",
                  "依",
                  "赖"
                ],
                [
                  [
                    "M0 → 一切",
                    "CI 与镜像管线是地基"
                  ],
                  [
                    "M2 → M6",
                    "A/B 更新的签名与 PCR 密封联动依赖 M2 的密钥体系"
                  ],
                  [
                    "M3 → M5",
                    "AI 助手的任务栏入口依赖桌面的扩展槽位"
                  ],
                  [
                    "内核 Vulkan 驱动 → M4",
                    "新显卡上 DXVK 转译要等驱动稳定"
                  ]
                ]
              ]
            },
            {
              "t": "p",
              "x": "计划还给出按人分工的建议：内核系统向走 M0→M1→M2→M6 关键路径；桌面体验向走 M3→M5；兼容应用向走 M4→软件中心。单人则按关键路径串行。"
            }
          ]
        },
        {
          "id": "jnl-12-3",
          "num": "12.3",
          "title": "风险与不承诺",
          "lead": "把不确定性摆在台面上。",
          "tags": [
            "边界"
          ],
          "blocks": [
            {
              "t": "p",
              "x": "开发计划登记了八项风险，其中影响最大的有：<b>rc 内核基线狭窄</b>（API 变动频繁，第三方模块易编译失败，靠小步更新 + 补丁暂存 + 稳定版双轨缓解）；<b>TPM 密封与 A/B 更新联动</b>（PCR 变更可能导致重启解锁失败，靠接口先行 + 串行更新 + 保留恢复密钥缓解）；<b>Wine / Proton 兼容预期过高</b>（靠管理器前置提示 + 真实打分缓解，不宣传「完美兼容」）。"
            },
            {
              "t": "table",
              "head": [
                "首版明确不承诺",
                "原因"
              ],
              "rows": [
                [
                  "Apple M4 全硬件功能",
                  "只承诺基础 Wayland 图形 + 外设可用，实验状态"
                ],
                [
                  "NVIDIA 专有驱动在 rc 内核上全程",
                  "等稳定基线切换后再承诺"
                ],
                [
                  "内核级反作弊的联机游戏",
                  "反作弊驱动与 rc 内核 / 虚拟化冲突"
                ],
                [
                  "Windows 专业重型套件",
                  "部分依赖 IE 组件或深度迁移"
                ],
                [
                  "云端 AI 能力",
                  "首版只做本地与可自配 key，不做云托管"
                ]
              ]
            },
            {
              "t": "note",
              "k": "为什么单列",
              "x": "一个系统项目的可信度，往往不取决于它承诺了什么，而取决于它敢不敢写清楚不做什么。JNL OS 把「不承诺清单」和验收门禁一起写进计划，是这种边界意识的体现。"
            }
          ]
        }
      ]
    },
    {
      "id": "jnl-13",
      "num": "13",
      "title": "现状清单、遗留与文档索引",
      "lead": "读完之后去哪里核对一手资料。",
      "sections": [
        {
          "id": "jnl-13-1",
          "num": "13.1",
          "title": "已完成清单（截至 2026-11-15）",
          "lead": "仓库文档共同确认的落地成果。",
          "tags": [
            "进展"
          ],
          "blocks": [
            {
              "t": "table",
              "head": [
                "域",
                "已落地"
              ],
              "rows": [
                [
                  "内核",
                  "7.4-rc1 自有内核、源码验证、驱动内建（显卡 / 网卡 / WiFi）"
                ],
                [
                  "桌面",
                  "NyxNiri（Niri + Noctalia），中文，Tabby + Zsh 终端栈"
                ],
                [
                  "安装",
                  "图形 OOBE 八步、真实双盘装机、BIOS / UEFI hybrid ISO"
                ],
                [
                  "安全",
                  "Secure Boot 全链路、ISO 三重启动到 OOBE"
                ],
                [
                  "包与应用",
                  ".jnlpkg 原生格式（27 项测试 + 真机验证）、12 个自研应用、37 项商店索引"
                ],
                [
                  "遮掩",
                  "os-release / issue / hostname / dpkg status 中性化"
                ],
                [
                  "配套",
                  "initramfs 控制台冒烟、VNC / noVNC / SSH 三链路实测"
                ]
              ]
            }
          ]
        },
        {
          "id": "jnl-13-2",
          "num": "13.2",
          "title": "遗留问题与下一步",
          "lead": "已知但尚未解决的部分。",
          "tags": [
            "边界"
          ],
          "blocks": [
            {
              "t": "ul",
              "items": [
                "<b>M0 正式门禁</b>：CI 每夜构建与 QEMU 启动成功率 ≥ 95% 尚未落地。",
                "<b>systemd --user 静默退出</b>：目前 niri 由系统服务直接拉起绕过它，影响 dbus 会话激活与部分桌面集成。",
                "<b>XWayland</b>：X11 应用暂不可用；Noctalia 自身欢迎向导在 OOBE 后仍会弹一次。",
                "<b>networkd</b>：eth0 靠兜底服务拉起，真实硬件需改用 DHCP。",
                "<b>安全完整链</b>：LUKS2 + TPM2、恢复密钥体系仍属 M2 规划。",
                "<b>兼容与 AI</b>：Wine / Proton 兼容层（M4）、本地智能体（M5）、A/B 更新（M6）尚未实现。",
                "<b>体积</b>：ISO squashfs 约 874 MB、镜像 8 GB，后续评估更小体积与增量更新。"
              ]
            },
            {
              "t": "note",
              "k": "口径",
              "x": "以上「未落地」以仓库 state 文档为准；本门不据推测补写实现细节。"
            }
          ]
        },
        {
          "id": "jnl-13-3",
          "num": "13.3",
          "title": "文档索引与全门收束",
          "lead": "按问题回到一手资料。",
          "tags": [
            "索引",
            "总结"
          ],
          "blocks": [
            {
              "t": "table",
              "head": [
                "想核对什么",
                "翻哪份文档"
              ],
              "rows": [
                [
                  "整体状态与当前交付物",
                  "<code>docs/status.md</code>"
                ],
                [
                  "路线决策、里程碑、门禁与风险",
                  "<code>docs/plan.md</code>"
                ],
                [
                  "自建基底、OOBE、双盘装机与 ISO",
                  "<code>docs/oobe-installer.md</code>"
                ],
                [
                  ".jnlpkg 格式与安全模型",
                  "<code>docs/jnlpkg.md</code>"
                ],
                [
                  "打包、上架与清单字段",
                  "<code>docs/jnlpkg-packaging.md</code>"
                ],
                [
                  "安装、快捷键、设置、商店、常见问题",
                  "<code>docs/教程.md</code>"
                ],
                [
                  "构建环境与流程",
                  "<code>docs/build.md</code>"
                ],
                [
                  "Buildroot 历史路线与补丁",
                  "<code>docs/buildroot-patches.md</code>"
                ],
                [
                  "硬件矩阵、M0 验收",
                  "<code>docs/hardware-matrix.md</code>、<code>docs/m0-acceptance.md</code>"
                ]
              ]
            },
            {
              "t": "quote",
              "x": "JNL OS 的看点在两处：一是它把操作系统交付链路（内核 → 基底 → 桌面 → 安装 → 包 → 安全）逐层做了一遍并留下可查记录；二是它把「做到哪、没做到哪、不承诺什么」都写进文档。读它，读的是一份可复现、可质疑的系统工程笔记，而不是一份宣传材料。"
            },
            {
              "t": "note",
              "k": "全门小结",
              "x": "十三章走完了：<b>定位与路线（1）→ 内核与基底（2–3）→ 桌面与终端（4）→ 安装与 ISO（5–6）→ 安全（7）→ 原生包与应用（8–9）→ 上手（10）→ 构建（11）→ 里程碑与边界（12）→ 现状与索引（13）</b>。凡本文档未载明的细节，以项目仓库一手文档为准；本门只作知识整理与导读，不构成开发、采购、部署或安全方面的专业意见。"
            }
          ]
        }
      ]
    }
  ]
};
