/* ==========================================================
   网络攻防技术篇 · 甲 · 网络基础与协议分析
   主线：分层模型 → 传输层 → 应用层 → TLS → 流量分析 → 边界拓扑
   说明：本卷所有实验均假定在自建靶场或已获书面授权的环境内进行
   ========================================================== */
window.WIKI_NET_BASE = {
  id:'net-base', num:'甲', en:'COURSE I · NETWORK FUNDAMENTALS',
  title:'网络基础与协议分析',
  lead:'不看懂数据包，就谈不上攻防。本课程从 OSI / TCP-IP 分层与封装讲起，把 IP、TCP、UDP、DNS、HTTP、TLS 的工作机制拆开，再教你在合法授权前提下抓包、读包、还原会话，最后说明交换机、路由器、防火墙与 DMZ 如何划出网络边界。后续所有攻防章节都以这里的概念为共同语言。',
  chips:['TCP/IP','协议分析','共 6 章'],
  chapters:[

  /* ================= 第 1 章 ================= */
  {id:'nb-1',num:'1',title:'分层模型与数据封装',lead:'先建立「一份数据怎么走完全程」的整体图像。',sections:[
    {id:'nb-1-1',num:'1.1',title:'OSI 与 TCP/IP 模型',lead:'两种分层不是竞争关系，是参考与实现的关系。',tags:['基础'],blocks:[
      {t:'p',x:'<b>OSI 七层模型</b>是教学与排障用的参考框架：物理层、数据链路层、网络层、传输层、会话层、表示层、应用层。<b>TCP/IP 四层模型</b>是互联网实际实现：链路层、网际层、传输层、应用层。二者大致对应，会话/表示/应用三层在 TCP/IP 里合并为应用层。分层的价值在于<b>每一层只关心自己那一层的协议数据单元</b>，改动下层不影响上层。'},
      {t:'table',head:['层','协议数据单元','典型协议','寻址依据'],rows:[
        ['链路层','帧 Frame','Ethernet、ARP、Wi-Fi 802.11','MAC 地址'],
        ['网际层','包 Packet','IPv4、IPv6、ICMP、IPsec','IP 地址'],
        ['传输层','段 Segment / 数据报','TCP、UDP、QUIC','端口号'],
        ['应用层','报文 Message','HTTP、DNS、TLS、SSH、SMTP','应用协议自身字段']
      ]},
      {t:'p',x:'排障时分层法非常实用：先确认物理链路与 MAC（能不能 ping 通网关），再确认 IP 路由，再确认端口是否监听，最后看应用协议返回什么。<b>大部分「网络不通」其实止步在前两层</b>。安全上，每一层也各有各的攻击面：ARP 欺骗在链路层、IP 伪造在网际层、SYN Flood 在传输层、注入漏洞在应用层。'},
      {t:'note',k:'封装与解封装',x:'发送端自上而下逐层加头部（有时加尾部校验），接收端自下而上逐层剥离。<code>以太网帧头 + IP 头 + TCP 头 + 应用数据 + 帧尾 FCS</code> 就是一次典型 HTTP 请求在网线上的样子。'}
    ]},
    {id:'nb-1-2',num:'1.2',title:'端口、套接字与连接标识',lead:'一个连接由五元组唯一确定。',tags:['基础'],blocks:[
      {t:'p',x:'<b>套接字（socket）</b>是 <code>IP:端口</code> 的组合；一条 TCP 连接由<b>五元组</b>唯一标识：源 IP、源端口、目的 IP、目的端口、传输层协议。服务器靠「知名端口」提供固定服务，客户端用<b>临时端口（ephemeral port）</b>，Linux 默认范围约 32768–60999，可用 <code>sysctl net.ipv4.ip_local_port_range</code> 查看。'},
      {t:'code',lang:'Text',x:'# 常见知名端口（IANA 约定，非强制）\n20/21   FTP 数据/控制      22   SSH\n23      Telnet（明文）       25   SMTP\n53      DNS（UDP/TCP）      80   HTTP\n110     POP3                143  IMAP\n443     HTTPS               445  SMB\n3306    MySQL               5432 PostgreSQL\n6379    Redis               8080 常见 HTTP 替代端口\n\n# 查看本机监听与连接\nss -tulpn          # Linux：TCP/UDP 监听及对应进程\nnetstat -ano        # Windows：含 PID\nlsof -i :8080       # macOS/Linux：谁占用了端口'},
      {t:'p',x:'端口只是<b>约定</b>，服务可以跑在任何端口上，所以「看到 443 就一定是 HTTPS」并不成立——这正是服务指纹识别（见乙篇）要解决的问题。对防守方而言，<b>把不该暴露的端口暴露到公网</b>是最常见的失陷入口：数据库、Redis、Docker API、调试端口都曾造成大规模事件。'},
      {t:'note',k:'0.0.0.0 与 127.0.0.1',x:'监听 <code>0.0.0.0</code> 表示接受所有网卡的连接，<code>127.0.0.1</code> 只接受本机。开发时若把调试服务绑到 <code>0.0.0.0</code> 又没加防火墙，等于把它推到公网。'}
    ]},
    {id:'nb-1-3',num:'1.3',title:'IPv4、IPv6 与子网划分',lead:'CIDR、NAT、私有地址决定了边界在哪里。',tags:['基础'],blocks:[
      {t:'code',lang:'Text',x:'192.168.1.0/24   → 网络号 192.168.1.0，掩码 255.255.255.0\n                   可用主机 192.168.1.1 ~ 192.168.1.254（254 个）\n10.0.0.0/8       → 1670 万个地址\n172.16.0.0/12    → 104 万个地址\n\n私有地址段（RFC 1918）：10/8、172.16/12、192.168/16\n特殊地址：127.0.0.0/8 回环、169.254/16 链路本地、224/4 组播\n\nIPv6：2001:db8::/32 为文档保留前缀\n       fe80::/10 链路本地、::1 回环、ff00::/8 组播'},
      {t:'p',x:'<b>CIDR</b> 用「前缀长度」表示网络位的位数，取代了老式的 A/B/C 类地址。掩码与 IP 做按位与得到网络号。<b>NAT</b> 让多台内网主机共享一个公网 IP，客观上形成了「外部无法主动连入」的天然边界，但它<b>不是防火墙</b>——一旦有内网主机主动外连或被植入反向隧道，NAT 就形同虚设。'},
      {t:'p',x:'IPv6 地址空间巨大，传统「扫整个网段」不再可行，但<code>fe80::</code>链路本地、SLAAC 生成的 EUI-64 地址、以及 DNS 反向区仍是发现入口。双栈环境里，运维常常只给 IPv4 配了防火墙规则，<b>IPv6 成为被遗忘的旁路</b>，这是真实攻防中很常见的疏漏。'},
      {t:'note',k:'ARP 与 NDP',x:'IPv4 用 <b>ARP</b> 把 IP 解析成 MAC，IPv6 用 <b>NDP</b>（ICMPv6）。二者都缺乏内建认证，局域网内可被伪造——这是「丁篇」中间人攻击原理的起点。'}
    ]}
  ]},

  /* ================= 第 2 章 ================= */
  {id:'nb-2',num:'2',title:'传输层：TCP 与 UDP',lead:'连接状态机是理解扫描、拒绝服务与会话劫持的前提。',sections:[
    {id:'nb-2-1',num:'2.1',title:'TCP 三次握手与状态机',lead:'SYN / SYN-ACK / ACK 与十一种状态。',tags:['核心'],blocks:[
      {t:'code',lang:'Text',x:'客户端                                    服务端\n  |  ---- SYN  seq=x ---------------------->  |  LISTEN → SYN-RECEIVED\n  |  <--- SYN-ACK seq=y, ack=x+1 ----------  |\n  |  ---- ACK  ack=y+1 -------------------->  |  ESTABLISHED\n  |              数据传输（ESTABLISHED）       |\n  |  ---- FIN -------------------------------->  |  主动关闭方\n  |  <--- ACK / FIN --------------------------  |\n  |  ---- ACK -------------------------------->  |  TIME_WAIT（2×MSL）'},
      {t:'p',x:'三次握手的作用是<b>双方各自确认自己的发送与接收能力正常</b>，并同步初始序列号 ISN。ISN 必须不可预测：早期系统用简单递增，攻击者可据此伪造报文劫持或注入会话（TCP 序列号预测攻击）；现代系统用随机化 ISN。关闭连接是<b>四次挥手</b>，因为 TCP 是全双工，两个方向要分别关闭。'},
      {t:'p',x:'<b>TIME_WAIT</b> 停留在主动关闭方，持续 2×MSL，作用是让迟到的报文消散、并保证最后的 ACK 能重传。<b>SYN-RECEIVED</b> 半连接队列是 SYN Flood 的攻击点：攻击者只发 SYN 不回 ACK，队列被占满后正常用户无法建连；缓解手段是 <b>SYN Cookie</b>、增大队列与限速。'},
      {t:'note',k:'端口扫描为什么能判断开放',x:'收到 SYN 回 SYN-ACK = 开放；回 RST = 关闭；无响应或被 ICMP 不可达 = 被过滤。这正是「乙篇」端口扫描的原理，理解状态机就能读懂扫描结果里的 open / closed / filtered。'}
    ]},
    {id:'nb-2-2',num:'2.2',title:'可靠传输、流量与拥塞控制',lead:'序号、确认、重传、滑动窗口四大机制。',tags:['原理'],blocks:[
      {t:'ul',items:[
        '<b>序列号与确认号</b>：按字节编号，ACK 表示「此序号之前的都收到了」，丢包会因缺口触发重传',
        '<b>超时重传与快速重传</b>：RTO 基于 RTT 动态估算；收到 3 个重复 ACK 立即重传，不等超时',
        '<b>滑动窗口</b>：接收方用窗口字段通告还能收多少字节，实现流量控制，避免快发送方淹没慢接收方',
        '<b>拥塞控制</b>：慢启动 → 拥塞避免 → 快速恢复（Reno/Cubic/BBR），把网络当作共享资源主动退让'
      ]},
      {t:'p',x:'TCP 头里的<b>控制位</b>尤其值得记住：<code>SYN</code> 建连、<code>ACK</code> 确认、<code>FIN</code> 正常关闭、<code>RST</code> 异常复位、<code>PSH</code> 催促交付、<code>URG</code> 紧急数据。抓包时，异常的 RST 洪流往往意味着扫描、连接被中间设备阻断，或会话被重置攻击打断。'},
      {t:'note',k:'TCP 不保证安全',x:'TCP 只保证「可靠、有序」，<b>不提供机密性、完整性、身份认证的密码学保证</b>。明文协议（HTTP、Telnet、FTP）在链路上可被任意读取和篡改，这是 TLS 存在的理由。'}
    ]},
    {id:'nb-2-3',num:'2.3',title:'UDP、QUIC 与无连接协议',lead:'低开销换来的是没有状态、没有重传。',tags:['原理'],blocks:[
      {t:'p',x:'<b>UDP</b> 头部仅 8 字节（源端口、目的端口、长度、校验和），不建连、不重传、不排序、不拥塞控制。适合 DNS、NTP、SNMP、实时音视频、日志上报这类「宁可丢一个包也不要等」的场景。代价是<b>源 IP 极易伪造</b>，因此 UDP 常被用于反射放大型 DDoS（见丁篇 5.2）。'},
      {t:'code',lang:'Text',x:'# 观察 DNS 一次典型的 UDP 查询/应答\n# 客户端:51234 → 8.8.8.8:53   查询 example.com A\n# 8.8.8.8:53 → 客户端:51234   应答 93.184.216.34\n# 无握手、无状态；仅靠「源端口 + 事务 ID」匹配应答\n\n# DNS 报文 >512 字节或区域传送时改用 TCP:53\n# 查看本机 UDP 监听\nss -ulpn'},
      {t:'p',x:'<b>QUIC</b>（RFC 9000）基于 UDP 重新实现了可靠传输与 TLS 1.3 加密，是 HTTP/3 的底座。它把连接标识从「五元组」换成独立的 <b>Connection ID</b>，因此手机从 Wi-Fi 切到蜂窝网络时连接不中断（连接迁移）。对流量分析而言，QUIC 大部分头部被加密，传统基于明文特征的检测手段需要相应调整。'},
      {t:'note',k:'DNS 事务 ID',x:'DNS 靠 16 位事务 ID 与随机源端口匹配应答。若二者可预测，攻击者就能抢在真服务器之前回伪造应答，即 <b>DNS 缓存投毒</b>。现代实现使用随机化并配合 DNSSEC 作密码学验证。'}
    ]}
  ]},

  /* ================= 第 3 章 ================= */
  {id:'nb-3',num:'3',title:'应用层协议',lead:'DNS、HTTP 与常见服务，也是攻防最密集的一层。',sections:[
    {id:'nb-3-1',num:'3.1',title:'DNS：从域名到 IP',lead:'递归查询、记录类型与安全扩展。',tags:['核心'],blocks:[
      {t:'code',lang:'Text',x:'# 常见记录类型\nA      域名 → IPv4           AAAA   域名 → IPv6\nCNAME  别名 → 另一域名       MX     邮件服务器\nNS     授权域名服务器         TXT    任意文本（SPF/DKIM/验证）\nSOA    区域起始授权记录       PTR    反向解析 IP → 域名\nCAA    限定可签发证书的 CA\n\n# 合法自查命令\ndig example.com A +short\ndig +trace example.com         # 逐级展示递归解析过程\nnslookup -type=MX example.com\ncat /etc/resolv.conf           # 本机配置的递归解析器'},
      {t:'p',x:'解析流程：浏览器缓存 → 操作系统缓存 → 本地递归解析器 → 根域 → 顶级域（.com）→ 权威域名服务器。<b>递归解析器</b>替客户端跑完全程，<b>权威服务器</b>只回答自己负责的区。<code>TTL</code> 决定缓存时长，改解析记录前先调低 TTL 是运维常识。'},
      {t:'p',x:'安全要点：<b>DNSSEC</b> 用签名保证应答未被篡改（防投毒，但不加密查询内容）；<b>DoH / DoT</b> 把查询塞进 HTTPS/TLS 以保护隐私，同时也让企业基于明文 DNS 的监控失效；<b>SPF/DKIM/DMARC</b> 三类 TXT 记录用于防邮件伪造；<b>DNS 隧道</b>把数据编码进子域名做隐蔽外传，是检测上要留意的异常模式。'},
      {t:'note',k:'授权边界',x:'对他人域名做枚举、区域传送（AXFR）尝试属于主动探测，必须在书面授权范围内。自查自家资产没问题，扫描第三方域名前先确认授权，这一点在「乙篇」与「辛篇」会反复强调。'}
    ]},
    {id:'nb-3-2',num:'3.2',title:'HTTP 请求、响应与状态',lead:'方法、首部、状态码与无状态带来的会话机制。',tags:['核心'],blocks:[
      {t:'code',lang:'HTTP',x:'GET /api/user?id=7 HTTP/1.1\nHost: example.com\nUser-Agent: Mozilla/5.0\nAccept: application/json\nAuthorization: Bearer <token>\nCookie: sid=abc123\n\nHTTP/1.1 200 OK\nContent-Type: application/json; charset=utf-8\nSet-Cookie: sid=abc123; HttpOnly; Secure; SameSite=Lax\nCache-Control: no-store\nContent-Security-Policy: default-src "self"\n\n{"id":7,"name":"Ada"}'},
      {t:'table',head:['类别','常见值','安全含义'],rows:[
        ['方法','GET / POST / PUT / PATCH / DELETE / OPTIONS','幂等性、CSRF 风险、是否允许改资源'],
        ['2xx','200 / 201 / 204','成功；201 创建、204 无内容'],
        ['3xx','301 / 302 / 304 / 307','跳转与缓存；开放重定向风险'],
        ['4xx','400 / 401 / 403 / 404 / 405 / 429','401 未认证、403 已认证但无权限、429 限速'],
        ['5xx','500 / 502 / 503 / 504','服务端错误；常泄漏堆栈、路径、版本'],
        ['安全首部','CSP / HSTS / X-Content-Type-Options / Referrer-Policy','浏览器侧缓解 XSS、降级、嗅探']
      ]},
      {t:'p',x:'HTTP 是<b>无状态</b>协议，服务端靠 <code>Cookie</code> + 服务端 Session 或自包含令牌（JWT）识别用户。<code>Host</code> 首部决定虚拟主机路由，也是 Host 头攻击与 SSRF 的常见载体。<code>HTTP/2</code> 引入二进制分帧与多路复用，<code>HTTP/3</code> 换到 QUIC；但语义（方法、首部、状态码）保持一致。'},
      {t:'note',k:'错误信息不要给太多',x:'把堆栈、SQL 语句、绝对路径、框架版本直接返回给客户端，等于给攻击者免费提供地图。生产环境统一返回通用错误页，细节写进服务端日志。'}
    ]},
    {id:'nb-3-3',num:'3.3',title:'常见服务协议速览',lead:'SSH、SMTP、SMB、RDP、DHCP 各自的暴露面。',tags:['概览'],blocks:[
      {t:'table',head:['协议/端口','用途','主要安全关注点'],rows:[
        ['SSH 22','远程登录、隧道、文件传输','禁用口令登录改密钥、禁 root 直登、限制来源 IP、记录审计日志'],
        ['SMTP 25 / 587 / 465','邮件发送','开放中继（open relay）、SPF/DKIM/DMARC、钓鱼与附件检测'],
        ['SMB 445','文件与打印共享','绝不对公网开放；弱口令、永恒之蓝类漏洞、NTLM 凭据泄露'],
        ['RDP 3389','Windows 远程桌面','爆破、蓝屏类漏洞；应置于 VPN/堡垒机之后并启用 MFA'],
        ['DHCP 67/68','自动分配地址','无认证，恶意 DHCP 可下发伪造网关/DNS 实施中间人'],
        ['NTP 123','时间同步','monlist 类放大反射；限制速率与访问来源'],
        ['SNMP 161/162','网络设备监控','默认团体名 public/private；v3 才有认证加密']
      ]},
      {t:'p',x:'这些服务的共性是<b>设计年代早、默认配置偏信任内网</b>。一旦因云上安全组配置失误、NAS 映射、容器端口暴露而出现在公网，往往几小时内就会被自动化扫描发现。防守侧的通用动作：最小暴露面、改默认凭据、强制加密与认证、集中日志、定期补丁。'},
      {t:'note',k:'内网不等于可信',x:'「它在内网所以不用加固」是最危险的假设。攻击者一旦拿下任一入口（钓鱼、暴露服务、供应链），内网横向移动的难度完全取决于这些服务当初有没有按最小权限配置。'}
    ]}
  ]},

  /* ================= 第 4 章 ================= */
  {id:'nb-4',num:'4',title:'TLS 与加密通信',lead:'机密性、完整性、身份认证三者如何同时达成。',sections:[
    {id:'nb-4-1',num:'4.1',title:'证书、CA 与信任链',lead:'HTTPS 的「S」本质是一套公钥基础设施。',tags:['核心'],blocks:[
      {t:'p',x:'<b>X.509 证书</b>把「域名（或组织）」与「公钥」绑定，并由 <b>CA（证书颁发机构）</b>签名。信任链是：浏览器/操作系统内置的根证书 → 中间 CA → 服务器叶子证书。验证时逐级验签，并检查域名匹配（SAN）、有效期、是否吊销、密钥用途。'},
      {t:'code',lang:'Bash',x:'# 查看服务端证书链（对自有域名或授权目标）\nopenssl s_client -connect example.com:443 -servername example.com -showcerts </dev/null\n\n# 解析证书内容\nopenssl x509 -in cert.pem -noout -text | head -40\n# 关注：Issuer / Subject / Subject Alternative Name / Not After / Key Usage\n\n# 检查证书透明度日志（发现被误签发或遗漏的子域）\n# crt.sh / 各 CA 的 CT 日志查询服务'},
      {t:'p',x:'<b>证书透明度（CT）</b>要求 CA 把每张签发记录写入公开只增日志，因此「为某域名签了哪些证书」可被公开检索——这既是防守方发现自己资产的好方法，也是侦察阶段枚举子域的常用来源（乙篇 2.2）。<b>CAA 记录</b>可限定只允许哪些 CA 为本域签发，降低误签发风险。'},
      {t:'note',k:'吊销并不总是可靠',x:'CRL 与 OCSP 存在时效与隐私问题，浏览器多采用 OCSP Stapling 或厂商自带的吊销列表。<b>证书固定（pinning）</b>能防伪造 CA，但配置不当会导致证书轮换时全站不可用，需谨慎。'}
    ]},
    {id:'nb-4-2',num:'4.2',title:'TLS 1.3 握手与密钥交换',lead:'从 RSA 密钥传输到前向安全的 ECDHE。',tags:['原理'],blocks:[
      {t:'code',lang:'Text',x:'TLS 1.2（简化）：\n  ClientHello（支持的套件/版本/随机数）\n  ServerHello + Certificate + ServerKeyExchange\n  ClientKeyExchange → 双方生成会话密钥\n  Finished（用派生密钥加密，验证握手未被篡改）\n\nTLS 1.3（1-RTT，默认前向安全）：\n  ClientHello 携带 key_share（ECDHE 临时公钥）\n  ServerHello 返回自己的 key_share + 加密的证书\n  双方由 ECDHE 共享秘密 + HKDF 派生流量密钥\n  支持 0-RTT 早期数据（有重放风险，非幂等操作禁用）'},
      {t:'p',x:'<b>前向安全（PFS）</b>指每次会话用临时密钥交换，即使服务器私钥日后泄露，历史流量也无法被解密。TLS 1.3 强制使用带 PFS 的套件，废弃了 RSA 密钥传输、静态 DH、RC4、3DES、CBC 模式与压缩（CRIME/BREACH）。对称加密只保留 AEAD 算法（AES-GCM、ChaCha20-Poly1305），<b>加密与完整性一次完成</b>。'},
      {t:'p',x:'<b>SNI</b>（Server Name Indication）让一台 IP 上托管多个 HTTPS 站点，但 ClientHello 里的域名早期是明文，因此有隐私与审查问题；<b>ECH</b>（Encrypted Client Hello）正在解决这个问题。<b>ALPN</b> 协商 h2 / http/1.1。'},
      {t:'note',k:'TLS 只保护传输中',x:'TLS 管不到：终端上的恶意软件、服务端日志里记录的明文、应用层的注入漏洞、以及「用户主动把凭据交给钓鱼站」。HTTPS 不等于网站安全，这是 Web 安全篇的起点。'}
    ]},
    {id:'nb-4-3',num:'4.3',title:'常见 TLS 配置错误与自查',lead:'协议版本、套件、证书链与 HSTS。',tags:['防御'],blocks:[
      {t:'ul',items:[
        '<b>启用过时协议</b>：SSLv3 / TLS 1.0 / 1.1 应关闭（POODLE、BEAST 等）',
        '<b>弱套件</b>：禁用 NULL / EXPORT / RC4 / 3DES / CBC + 静态 RSA 密钥交换',
        '<b>证书链不完整</b>：只发叶子证书、缺中间 CA，部分客户端会报不受信任',
        '<b>域名不匹配 / 过期</b>：SAN 未覆盖 www 或裸域；证书到期导致全站中断',
        '<b>混合内容</b>：HTTPS 页面里加载 HTTP 资源，浏览器拦截或降级风险',
        '<b>未启用 HSTS</b>：首次访问仍可能被 SSL Stripping 降级到明文 HTTP'
      ]},
      {t:'code',lang:'Nginx',x:'server {\n    listen 443 ssl http2;\n    server_name example.com;\n    ssl_protocols TLSv1.2 TLSv1.3;\n    ssl_ciphers HIGH:!aNULL:!MD5:!3DES:!RC4;\n    ssl_prefer_server_ciphers off;\n    ssl_session_tickets off;\n    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;\n    add_header X-Content-Type-Options nosniff always;\n    add_header Referrer-Policy strict-origin-when-cross-origin always;\n}'},
      {t:'p',x:'自查可以用 <code>openssl s_client</code>、<code>nmap --script ssl-enum-ciphers</code>（限自有资产）或在线评级服务；生产配置建议直接参考 Mozilla SSL Configuration Generator 生成，再按业务兼容性微调。定期复检，因为「配置一次就永远正确」并不成立。'},
      {t:'note',k:'测试自家资产',x:'上述命令与扫描脚本都应指向<b>自有或已授权</b>的域名与主机。对第三方系统做协议探测、密码套件枚举可能触犯法律与平台条款。'}
    ]}
  ]},

  /* ================= 第 5 章 ================= */
  {id:'nb-5',num:'5',title:'抓包与流量分析',lead:'把字节流还原成可读的会话，是排障也是取证。',sections:[
    {id:'nb-5-1',num:'5.1',title:'抓包原理与合法边界',lead:'网卡混杂模式、镜像口与授权前提。',tags:['合规'],blocks:[
      {t:'p',x:'网卡通常只接收目的 MAC 是自己的帧；<b>混杂模式（promiscuous）</b>让它收下链路上所有帧。但交换机会按 MAC 表定向转发，所以在交换网络里想看别人的流量，还需要<b>交换机镜像口（SPAN）</b>、网络分路器（TAP）或在网关/主机上安装采集点。抓包工具通过 <code>libpcap</code> / <code>Npcap</code> 拿到链路层副本。'},
      {t:'code',lang:'Bash',x:'# 仅在自有主机 / 授权环境中使用\nip link show                       # 查看网卡\nsudo tcpdump -i eth0 -n -c 20      # 抓前 20 个包，不解析域名\nsudo tcpdump -i any -w cap.pcap -s 0   # 全量保存到文件\nsudo tcpdump -r cap.pcap -nn | head     # 离线读取\n\n# Wireshark 图形界面：显示过滤器比捕获过滤器更常用\n# 捕获过滤器(BPF)：host 10.0.0.5 and port 443\n# 显示过滤器：     http.request && ip.addr == 10.0.0.5'},
      {t:'p',x:'<b>合法边界必须说在前面</b>：抓取、查看他人通信内容，在多数司法辖区属于对通信秘密的侵犯，只有在①自有网络且已告知、②取得书面授权的渗透测试/取证委托、③法定职权范围内这几种情形才成立。企业做流量监控应在制度、劳动合同与隐私告知中明确，并限定采集范围与留存期限。即使有授权，也应<b>最小化采集</b>，避免把口令、个人信息写进长期留存的 pcap。'},
      {t:'note',k:'加密让抓包变了',x:'TLS 普及后，抓包主要能看到 IP、端口、SNI、流量时序与包长，看不到正文。要分析明文需客户端信任代理证书（如企业审计代理或本地调试），这属于有明确授权且需告知的场景。'}
    ]},
    {id:'nb-5-2',num:'5.2',title:'过滤器与会话还原',lead:'从海量包里快速定位一次完整对话。',tags:['技能'],blocks:[
      {t:'code',lang:'Text',x:'# Wireshark 显示过滤器常用写法\nip.addr == 10.0.0.5 && tcp.port == 443\ntcp.flags.syn == 1 && tcp.flags.ack == 0    # 所有 SYN\ntcp.flags.reset == 1                         # 异常复位\nhttp.request.method == "POST"\ndns.qry.name contains "example"\ntls.handshake.type == 1                      # ClientHello\nframe contains "password"\n\n# 会话还原：右键包 → Follow → TCP Stream\n# 得到按序号拼好的双向文本（仅明文协议可读）\n# tshark 命令行等价：\ntshark -r cap.pcap -q -z follow,tcp,ascii,0'},
      {t:'ul',items:[
        '<b>先定位再深挖</b>：用 Statistics → Conversations 找出流量最大的会话与最活跃端口',
        '<b>看时序</b>：SYN 之后立刻 RST、大量重传、超长间隔都可能分别对应扫描、链路故障、慢速攻击',
        '<b>看异常 DNS</b>：超长子域、高频 TXT 查询、罕见 TLD 常是隧道或 C2 信标特征',
        '<b>看 TLS 指纹</b>：ClientHello 的套件顺序、扩展列表可区分浏览器与脚本库（JA3/JA4 思路）'
      ]},
      {t:'p',x:'还原会话前要确认<b>没有分片、乱序与重传干扰</b>；TCP Stream 已按序号重组，比逐帧读可靠得多。分析加密流量时，可用「连接持续时间 + 包长分布 + 上行/下行比 + 周期性」做行为侧判断，这类元数据即使内容加密也依然存在。'},
      {t:'ex',k:'动手练一练（本地靶场）',items:[
        '在本机起一个 HTTP 服务，抓取一次完整请求，用 Follow TCP Stream 找到请求行与响应头',
        '对比同一页面在 HTTP 与 HTTPS 下抓包能看到的内容差异',
        '统计一次握手的 SYN / SYN-ACK / ACK 三个包，记录双方 ISN 与窗口大小'
      ]}
    ]},
    {id:'nb-5-3',num:'5.3',title:'协议特征与异常识别',lead:'把「正常」建模出来，异常才看得见。',tags:['检测'],blocks:[
      {t:'table',head:['观察到的现象','可能的原因','核查方向'],rows:[
        ['同一源在短时间内对大量不同端口发 SYN','端口扫描','源 IP 是否为已授权扫描器；是否有后续建连'],
        ['大量 SYN 无后续 ACK，目标半连接队列高','SYN Flood / 扫描副作用','SYN Cookie 状态、连接队列使用率'],
        ['DNS 查询子域极长且高频、TXT 记录异常','DNS 隧道 / 数据外传','查询长度分布、域名熵、外联目的'],
        ['固定周期的小流量外联（心跳）','C2 信标 / 定时任务','周期方差、进程与连接关联、目标信誉'],
        ['明文协议出现口令、Token 字段','未加密传输','立即评估暴露范围并推动加密改造'],
        ['大量 404 / 401 / 500 且参数形态相似','目录枚举、爆破、漏洞探测','请求来源、UA、参数分布、WAF 日志']
      ]},
      {t:'p',x:'检测的本质是<b>建立基线 + 找偏离</b>：先知道自家网络平时有哪些协议、哪些主机互相通信、流量峰谷在哪，异常才有参照。单纯堆规则容易造成告警疲劳，所以「己篇」会讲日志规范化、SIEM 关联与 Sigma 规则工程，把这里识别出的模式固化成可运营的检测能力。'},
      {t:'note',k:'别只看单点',x:'单个异常包几乎不能定性。把 DNS 查询 → TCP 建连 → HTTP 请求 → 进程/账户日志串成时间线，才能区分「运维脚本」「授权扫描」和真实入侵，这也是应急响应的基本功。'}
    ]}
  ]},

  /* ================= 第 6 章 ================= */
  {id:'nb-6',num:'6',title:'网络边界设备与拓扑',lead:'边界划在哪里，决定了攻击面有多大。',sections:[
    {id:'nb-6-1',num:'6.1',title:'交换、路由与 VLAN',lead:'二层广播域与三层网段如何隔离。',tags:['架构'],blocks:[
      {t:'p',x:'<b>交换机</b>工作在二层，按 MAC 地址表转发帧，每个端口是一个冲突域，但同一 VLAN 内是一个<b>广播域</b>——ARP 欺骗、DHCP 欺骗之所以能在局域网生效，根源就在这里。<b>路由器</b>工作在三层，按 IP 路由表转发包，天然隔离广播域，并成为施加 ACL 的位置。'},
      {t:'code',lang:'Text',x:'# VLAN 概念示意（不同厂商语法不同，仅表意）\nvlan 10  name Office      # 办公网 192.168.10.0/24\nvlan 20  name Server      # 服务器区 192.168.20.0/24\nvlan 30  name Mgmt        # 带外管理 192.168.30.0/24\ninterface gi0/1\n  switchport mode access\n  switchport access vlan 10\n  spanning-tree portfast\n  storm-control broadcast level 1.00\n\n# 三层间访问控制：只允许办公网访问服务器区 443\n# deny 192.168.10.0/24 -> 192.168.30.0/24 any'},
      {t:'p',x:'<b>VLAN 不是安全边界</b>：它只是逻辑隔离，配置错误（如 trunk 允许所有 VLAN、native VLAN 未改、双标签跳转）可能让隔离失效。真正的安全隔离需要<b>ACL / 防火墙策略</b>在三层做「默认拒绝」。此外要关闭未使用端口、限制 MAC 数量、启用 DHCP Snooping 与动态 ARP 检测（DAI）来防二层欺骗。'},
      {t:'note',k:'管理平面要独立',x:'交换机/路由器/防火墙的管理口、IPMI、BMC 应放在独立管理 VLAN 或带外网络，且不对办公网开放。管理平面被拿下，所有数据平面的隔离策略都可以被改掉。'}
    ]},
    {id:'nb-6-2',num:'6.2',title:'防火墙、NAT 与 DMZ',lead:'默认拒绝、最小放行、分区分级。',tags:['架构'],blocks:[
      {t:'p',x:'<b>防火墙</b>按规则匹配五元组（新一代还可识别应用、用户、内容）。设计原则是<b>默认拒绝 + 显式白名单</b>：先 deny all，再逐条放行确实需要的源、目的、端口，最后定期清理「临时开的口子」。规则顺序很重要，宽松规则放前面会让后面的收紧形同虚设。'},
      {t:'table',head:['区域','典型内容','访问原则'],rows:[
        ['外网 / Internet','不可信','默认不允许主动入站'],
        ['DMZ','对外提供服务的反向代理、Web、邮件网关','可被外网访问指定端口；<b>禁止主动发起</b>到内网的连接'],
        ['内网 / 办公区','员工终端','按需访问 DMZ 与部分内部服务；终端间默认隔离'],
        ['核心区','数据库、域控、密钥系统','仅接受来自应用服务器的特定端口，禁止直连外网'],
        ['管理区','堡垒机、监控、日志、备份','独立认证与审计，最小可达范围']
      ]},
      {t:'p',x:'<b>DMZ</b> 的意义是「把必须对外暴露的东西单独放一层，并假设它迟早会被攻破」，从而限制爆炸半径：Web 服务器即使失陷，也不能直接连数据库所在网段之外的任意主机。<b>NAT</b> 只做地址转换，<b>不替代状态检测防火墙</b>；云环境里等价概念是安全组 / 网络 ACL，逻辑一致但配置粒度更细。'},
      {t:'note',k:'出站同样要管',x:'很多单位只管入站、放行全部出站。结果是恶意软件一旦落地就能自由回连 C2、外传数据。<b>出站白名单 + DNS 管控 + 代理审计</b>是遏制横向与外泄的关键一环。'}
    ]},
    {id:'nb-6-3',num:'6.3',title:'零信任与微分段',lead:'从「内网可信」转向「每次访问都验证」。',tags:['架构'],blocks:[
      {t:'p',x:'传统模型是「城堡与护城河」：外面不可信、里面全可信。一旦边界被突破（VPN 凭据泄露、钓鱼终端、供应链），攻击者就在内网畅通无阻。<b>零信任</b>把前提改成「<b>永不信任、始终验证</b>」：不以网络位置作为授权依据，每次访问都结合身份、设备健康度、上下文做最小权限的即时授权。'},
      {t:'ul',items:[
        '<b>身份为新的边界</b>：强认证（MFA）+ 单点登录 + 设备证书，替代「在内网所以放行」',
        '<b>微分段</b>：把东西向流量也纳入管控，工作负载之间按需放行，抑制横向移动',
        '<b>持续评估</b>：终端补丁、磁盘加密、EDR 状态不合格则降权或拒绝接入',
        '<b>最小权限与短时效</b>：临时提权、即时（JIT）访问、凭据自动轮换',
        '<b>全量可观测</b>：所有访问决策与流量留痕，供检测与审计回溯'
      ]},
      {t:'p',x:'落地通常是渐进的：先做资产与身份梳理，再收敛 VPN 与高权限账号，接着在关键系统前加访问代理，最后推微分段。技术上涉及 SDP、mTLS、服务网格（如基于身份的工作负载通信）与策略引擎。零信任不是某个产品，而是<b>一套持续收敛信任的架构原则</b>。'},
      {t:'ex',k:'小结与衔接',items:[
        '画出你自己负责系统的一张数据流图：哪些入口对外、哪些服务互访、边界策略在哪',
        '找出一条「如果这台主机失陷，攻击者下一步能到哪」的路径，并给出收敛建议',
        '带着这张图进入「乙篇 信息收集」，从防守方视角检查有哪些资产会被外部看到'
      ]}
    ]}
  ]}
  ]
};
