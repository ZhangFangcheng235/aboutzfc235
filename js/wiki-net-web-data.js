/* ==========================================================
   网络攻防技术篇 · 丙 · Web 应用安全
   主线：威胁模型 → 注入 → XSS → CSRF/SSRF → 认证会话 →
         访问控制 → 上传/反序列化/组件 → API 与前端
   立场：所有漏洞均以「原理 + 防御代码」讲解，示例限定本地靶场，
         不提供针对真实系统的可用性利用载荷
   ========================================================== */
window.WIKI_NET_WEB = {
  id:'net-web', num:'丙', en:'COURSE III · WEB APPLICATION SECURITY',
  title:'Web 应用安全',
  lead:'Web 应用是绝大多数组织对外暴露面最大、逻辑最复杂的一层。本课程以 OWASP Top 10 为骨架，逐类拆解注入、XSS、CSRF/SSRF、认证与会话缺陷、越权与业务逻辑、文件上传与反序列化、依赖供应链，以及 API 与前端特有的风险。每个漏洞都按「为什么会成立 → 怎么被触发 → 如何正确修复 → 如何验证修复」四步讲，代码示例以防御实现和本地靶场为主。',
  chips:['OWASP Top 10','防御优先','共 8 章'],
  chapters:[

  /* ================= 第 1 章 ================= */
  {id:'nw-1',num:'1',title:'Web 工作原理与威胁模型',lead:'先明确「哪里是不可信输入、哪里是信任边界」。',sections:[
    {id:'nw-1-1',num:'1.1',title:'请求链路与信任边界',lead:'从浏览器到数据库，每一跳都要重新校验。',tags:['基础'],blocks:[
      {t:'p',x:'一次典型请求经过：浏览器 → DNS/CDN → 负载均衡/WAF → Web 服务器 → 应用框架 → 业务逻辑 → 缓存/数据库/对象存储 → 第三方 API。安全设计的基本事实是：<b>来自浏览器的任何东西都不可信</b>——URL 参数、请求体、首部（含 <code>Referer</code>、<code>X-Forwarded-For</code>）、Cookie、上传文件、WebSocket 消息，全部算输入。'},
      {t:'p',x:'常见错误是「在网关校验过一次，后面就都信了」。<b>每一处信任边界都要重新校验</b>：网关做的只是粗粒度过滤，业务层仍需做类型、范围、权限、状态校验；数据库层应有最小权限账号与约束；调用第三方前要校验返回数据，而不是默认对方一定给合法格式。'},
      {t:'note',k:'客户端校验不是安全控制',x:'前端 JS 的表单校验、隐藏字段、按钮置灰，都只是<b>用户体验</b>，攻击者可以直接构造请求绕过。<b>服务端必须独立做完整校验</b>，这是 Web 安全的第一条纪律。'}
    ]},
    {id:'nw-1-2',num:'1.2',title:'同源策略与浏览器安全模型',lead:'为什么会有 CORS、CSP、SameSite 这些机制。',tags:['基础'],blocks:[
      {t:'p',x:'<b>同源</b>指协议、主机、端口三者相同。同源策略限制一个源的脚本读取另一个源的响应数据，是浏览器隔离不同站点的基石。注意它限制的是<b>读</b>，不是<b>发</b>：表单提交、<code>&lt;img&gt;</code>、<code>&lt;script&gt;</code> 标签本来就能跨域发请求，这正是 CSRF 成立的原因（第 4 章）。'},
      {t:'table',head:['机制','解决什么','关键配置'],rows:[
        ['<b>CORS</b>','受控地允许跨域读取响应','<code>Access-Control-Allow-Origin</code> 精确白名单；带凭据时不能为 <code>*</code>'],
        ['<b>CSP</b>','限制可加载与可执行的脚本来源，缓解 XSS','<code>default-src "self"</code>、nonce/hash、禁用 <code>unsafe-inline</code>'],
        ['<b>SameSite</b>','控制 Cookie 是否随跨站请求发送','<code>Lax</code> 为常用默认，敏感操作配合 CSRF Token'],
        ['<b>Cookie 属性</b>','降低会话被窃取的概率','<code>HttpOnly</code>、<code>Secure</code>、<code>SameSite</code>、限定 Path/Domain'],
        ['<b>HSTS</b>','防止降级到明文 HTTP','<code>max-age</code> + <code>includeSubDomains</code>（谨慎）']
      ]},
      {t:'p',x:'这几个机制共同构成「浏览器侧纵深防御」：即便应用偶尔漏了一处输出编码，CSP 也可能挡住内联脚本执行；即便会话 Cookie 被 XSS 读到，<code>HttpOnly</code> 也能阻止 <code>document.cookie</code> 取值。但它们是<b>兜底</b>，不能代替服务端正确实现。'},
      {t:'note',k:'CORS 配错很常见',x:'把 <code>Access-Control-Allow-Origin</code> 设成反射请求里的 <code>Origin</code>（等于任意站点都放行），再叠加 <code>Allow-Credentials: true</code>，会让任意站点带用户凭据读取响应，等同于数据泄露。'}
    ]},
    {id:'nw-1-3',num:'1.3',title:'OWASP Top 10 概览',lead:'把最常见风险放进一张地图。',tags:['概览'],blocks:[
      {t:'table',head:['类别','核心问题','本教程对应'],rows:[
        ['A01 访问控制失效','该拦的没拦，越权读写他人数据','第 6 章'],
        ['A02 加密机制失效','明文传输、弱算法、密钥管理不当','戊篇'],
        ['A03 注入','把不可信数据当成代码/命令执行','第 2 章'],
        ['A04 不安全设计','设计阶段就缺少威胁建模','乙篇 6.2、辛篇 1.2'],
        ['A05 安全配置错误','默认账号、调试模式、多余服务、错误页泄漏','乙篇 4.2、本章 1.1'],
        ['A06 自带组件有漏洞','依赖过时、缺乏清单与更新','第 7 章'],
        ['A07 身份识别与认证失效','弱口令、会话固定、爆破无防护','第 5 章'],
        ['A08 软件与数据完整性失效','反序列化、CI/CD、自动更新被篡改','第 7 章、辛篇 2.2'],
        ['A09 日志与监测失效','出事了查不到、告警没人看','己篇 4.x'],
        ['A10 SSRF','服务端代发请求打到内网/元数据','第 4 章']
      ]},
      {t:'p',x:'这份清单的价值在于<b>共性</b>：绝大多数条目都可归结为「<b>信任了不该信任的输入</b>」或「<b>没有在正确的层做校验</b>」。因此修复思路也高度一致：白名单输入校验、上下文相关的输出编码、服务端强制授权、最小权限、以及可观测的日志。'},
      {t:'ex',k:'动手练一练',items:[
        '挑一个你熟悉的接口，列出它接收的<b>全部</b>输入（含首部与 Cookie），标出哪些服务端没校验',
        '检查自家站点响应头里是否有 CSP / HSTS / X-Content-Type-Options',
        '把上表里 10 类风险各写一句「如果发生在我负责的系统上，最坏结果是什么」'
      ]}
    ]}
  ]},

  /* ================= 第 2 章 ================= */
  {id:'nw-2',num:'2',title:'注入类漏洞',lead:'数据与代码边界被打破，是所有注入的根因。',sections:[
    {id:'nw-2-1',num:'2.1',title:'SQL 注入的原理',lead:'字符串拼接让输入变成了 SQL 语法的一部分。',tags:['核心'],blocks:[
      {t:'p',x:'当应用把用户输入<b>拼接</b>进 SQL 文本再交给数据库解析，输入里的引号、注释符、布尔表达式就会改变语句结构。数据库看到的不是「一个参数值」，而是「一段被改写过的程序」。这就是注入：<b>数据越过了边界，被当成代码执行</b>。'},
      {t:'code',lang:'Text',x:'# 反例（仅说明原理，切勿在真实系统使用）\n# 代码： "SELECT * FROM users WHERE name = \'" + user_input + "\'"\n# 输入： admin\' OR \'1\'=\'1\n# 数据库实际解析到的语句语义被改变，条件恒真，绕过限定\n# 危害梯度：绕过条件 → 读取其他表 → 写数据 → 读写文件/执行命令（依数据库配置）\n\n# 注意：本教程不提供针对真实系统的完整利用串；\n# 学习验证请在本地靶场（如自建的练习环境）用占位输入观察「语义被改写」这一现象'},
      {t:'p',x:'判断是否存在注入，本质是观察「输入改变了语句的<b>结构</b>还是只改变了<b>值</b>」。基于报错、布尔差异、时间延迟的探测都属于这个范畴。但更重要的是：<b>无论能否被利用，拼接本身就是缺陷</b>，应直接修掉，而不是只过滤几个关键字。'},
      {t:'note',k:'黑名单过滤不可靠',x:'过滤 <code>SELECT</code>、单引号、注释符，总会被大小写、编码、注释拆分、多字节字符集或二次注入绕过。<b>唯一可靠的解法是让数据永远不进入解析器的语法层</b>，即下节的参数化查询。'}
    ]},
    {id:'nw-2-2',num:'2.2',title:'参数化查询与正确防御',lead:'预编译语句把值与语法彻底分离。',tags:['防御'],blocks:[
      {t:'code',lang:'Python',x:'# 正确：参数化查询（占位符，值由驱动单独传输，不参与 SQL 解析）\nimport sqlite3\n\ndef get_user(conn, name: str):\n    cur = conn.execute("SELECT id, name FROM users WHERE name = ?", (name,))\n    return cur.fetchone()\n\n# 正确：ORM 的参数绑定\ndef get_by_email(session, email: str):\n    return session.query(User).filter(User.email == email).first()\n\n# 动态列名/表名不能占位符化时用白名单映射，绝不拼接用户输入\nALLOWED_SORT = {"name": "name", "created": "created_at", "id": "id"}\ndef list_users(conn, sort_key: str):\n    col = ALLOWED_SORT.get(sort_key, "id")       # 白名单，非法值退回默认\n    return conn.execute(f"SELECT id, name FROM users ORDER BY {col}").fetchall()'},
      {t:'code',lang:'Java',x:'// JDBC PreparedStatement：同样把值与语法分离\nString sql = "SELECT id, name FROM users WHERE name = ? AND status = ?";\ntry (PreparedStatement ps = conn.prepareStatement(sql)) {\n    ps.setString(1, name);\n    ps.setInt(2, status);\n    try (ResultSet rs = ps.executeQuery()) { /* ... */ }\n}'},
      {t:'ul',items:[
        '<b>全量参数化</b>：所有来自外部的值，包括 LIMIT、ORDER BY 之外的每一处',
        '<b>白名单映射</b>：动态表名/列名/排序方向只能从预定义集合里选',
        '<b>最小权限</b>：应用账号不应有 DDL、文件读写、跨库访问等高危权限',
        '<b>纵深</b>：统一错误页、WAF 作缓解、日志与慢查询监控作检测',
        '<b>验证</b>：代码评审查所有 SQL 构造点，自动化 SAST 规则拦截字符串拼接'
      ]},
      {t:'note',k:'存储过程也能注入',x:'存储过程里若用动态 SQL 拼接，同样可注入。参数化的是<b>调用方式</b>，不是「用了存储过程就安全」。'}
    ]},
    {id:'nw-2-3',num:'2.3',title:'其他注入家族',lead:'命令、模板、LDAP、XPath、日志与表达式。',tags:['扩展'],blocks:[
      {t:'table',head:['注入类型','被误当代码的输入流向','正确做法'],rows:[
        ['命令注入','拼进 shell 命令','避免调用 shell；用 API 数组传参，<code>subprocess.run([...], shell=False)</code>'],
        ['模板注入 SSTI','拼进模板字符串','模板与数据分离，禁用用户可控模板，沙箱化模板环境'],
        ['LDAP / XPath','拼进查询过滤器','对特殊字符转义，使用参数化/白名单'],
        ['表达式注入','进入表达式引擎（如 OGNL、SpEL）','绝不求值用户输入，升级框架并禁用危险特性'],
        ['日志注入','换行符伪造日志行','对换行与控制字符编码，结构化日志'],
        ['CRLF 注入','<code>\\r\\n</code> 插入 HTTP 首部','校验并编码，框架层面禁止外部值进响应头']
      ]},
      {t:'p',x:'共通规律只有一句：<b>任何「把字符串交给某个解释器去解析」的地方都是潜在注入点</b>——SQL 解析器、shell、模板引擎、表达式引擎、XPath 解析器、HTTP 响应构造器、日志格式化器。排查代码时，与其记漏洞名字，不如顺着「解释器调用点」逐个找。'},
      {t:'ex',k:'动手练一练',items:[
        '在自建的本地练习库里，用参数化与拼接各查一次同名记录，对比数据库驱动收到的语句',
        '审查一段调用外部命令的代码，把字符串拼接改成参数数组形式',
        '写出你项目里所有「用户输入会进入解释器」的位置清单（含日志与响应头）'
      ]}
    ]}
  ]},

  /* ================= 第 3 章 ================= */
  {id:'nw-3',num:'3',title:'跨站脚本 XSS',lead:'脚本被浏览器当作页面的一部分执行。',sections:[
    {id:'nw-3-1',num:'3.1',title:'三种 XSS 类型',lead:'反射型、存储型、DOM 型的差别在于「数据怎么到达浏览器」。',tags:['核心'],blocks:[
      {t:'table',head:['类型','路径','典型场景'],rows:[
        ['反射型','输入出现在<b>当前请求</b>的响应里','搜索结果页、错误提示、带参数的跳转页'],
        ['存储型','输入被<b>持久化</b>，之后每次访问都渲染','评论、昵称、工单、留言、富文本内容'],
        ['DOM 型','不经过服务端，前端 JS 把不可信数据写进危险 sink','<code>innerHTML</code>、<code>eval</code>、<code>location</code>、模板拼接']
      ]},
      {t:'p',x:'XSS 的本质是<b>浏览器无法区分「页面自己的脚本」和「数据里夹带的脚本」</b>。危害包括窃取会话（若 Cookie 未设 HttpOnly）、以用户身份发起操作、篡改页面内容、钓鱼、以及配合 CSRF 形成连锁。存储型危害最大，因为一次注入可影响所有后续访问者。'},
      {t:'note',k:'DOM 型最易被漏掉',x:'服务端做了输出编码也挡不住 DOM 型：数据可能来自 <code>location.hash</code>、<code>postMessage</code>、前端接口返回，直接被 <code>innerHTML</code> 写入。要审查的是<b>前端的 sink</b>，不只是后端模板。'}
    ]},
    {id:'nw-3-2',num:'3.2',title:'上下文相关的输出编码',lead:'HTML、属性、JS、URL、CSS 五种上下文各不相同。',tags:['防御'],blocks:[
      {t:'p',x:'正确的防御是<b>在数据进入某个上下文时，按该上下文的规则编码</b>。HTML 正文里要转义 <code>&lt; &gt; &amp; " \'</code>；属性里还要处理引号；放进 <code>&lt;script&gt;</code> 里需要 JS 字符串编码；放进 URL 参数要用 URL 编码；CSS 上下文又有自己的规则。<b>不存在一种「万能转义」能覆盖所有位置</b>。'},
      {t:'code',lang:'JavaScript',x:'// 反例：把不可信数据直接交给 HTML 解析器\nelement.innerHTML = userInput;                    // 危险\neval("var x = " + userInput);                     // 危险\nlocation.href = userInput;                        // 危险（javascript: 伪协议）\n\n// 正例：默认用文本节点，天然不解析标记\nelement.textContent = userInput;                  // 安全\n\n// 正例：必须插入 HTML 时，用框架/库的自动转义模板，\n// 并对富文本走白名单净化（如 DOMPurify），只允许安全标签与属性\nimport DOMPurify from "dompurify";\nelement.innerHTML = DOMPurify.sanitize(richHtml, {\n  ALLOWED_TAGS: ["b", "i", "p", "a", "ul", "li"],\n  ALLOWED_ATTR: ["href", "title"],\n});\n// 注意：href 仍需校验协议，只允许 http/https/mailto，拒绝 javascript:'},
      {t:'code',lang:'Python',x:'# 后端模板引擎默认开启自动转义（以 Jinja2 为例）\n# {{ user_input }}   → 自动 HTML 转义，安全\n# {{ user_input|safe }} → 显式关闭转义，仅在内容已净化后使用\nfrom markupsafe import escape\nhtml = f"<p>{escape(user_input)}</p>"   # 手动场景也要显式转义'},
      {t:'note',k:'富文本是难点',x:'允许用户提交 HTML 时，必须走<b>服务端白名单净化</b>（解析 DOM、只保留安全标签与属性、校验 URL 协议），而不是正则过滤 <code>&lt;script&gt;</code>。正则黑名单会被大小写、事件属性、SVG/MathML、编码变形绕过。'}
    ]},
    {id:'nw-3-3',num:'3.3',title:'CSP 与其他兜底',lead:'即使漏了一处编码，也要让脚本难以执行。',tags:['防御'],blocks:[
      {t:'code',lang:'HTTP',x:'Content-Security-Policy:\n  default-src "self";\n  script-src "self" "nonce-rAnd0mPerRequest";\n  object-src "none";\n  base-uri "none";\n  frame-ancestors "none";\n  report-uri /csp-report\n\n# 配套首部\nX-Content-Type-Options: nosniff\nReferrer-Policy: strict-origin-when-cross-origin\nSet-Cookie: sid=...; HttpOnly; Secure; SameSite=Lax; Path=/'},
      {t:'ul',items:[
        '<b>nonce / hash</b>：每响应生成随机 nonce，只有带正确 nonce 的脚本才执行，弃用 <code>unsafe-inline</code>',
        '<b>object-src none</b>：禁掉 Flash/插件类老载体；<code>base-uri none</code> 防 <code>&lt;base&gt;</code> 劫持相对路径',
        '<b>frame-ancestors</b>：替代老式 <code>X-Frame-Options</code>，防点击劫持',
        '<b>Trusted Types</b>：在浏览器侧强制 DOM sink 只能接收经过策略处理的值，专治 DOM XSS',
        '<b>HttpOnly</b>：即使出现 XSS 也读不到会话 Cookie；<b>SameSite</b> 同时缓解 CSRF'
      ]},
      {t:'p',x:'CSP 上线建议先用 <code>Content-Security-Policy-Report-Only</code> 收集违规报告，逐步收紧策略再切到强制模式，否则容易一次性打断现有页面。CSP 是<b>纵深防御</b>，不是输出编码的替代品：策略里一旦为兼容开了 <code>unsafe-inline</code> 或通配 CDN，防护力度会大幅下降。'},
      {t:'ex',k:'动手练一练',items:[
        '在本地页面里分别用 <code>textContent</code> 与 <code>innerHTML</code> 插入同一段带标签的字符串，观察差异',
        '给一个自有站点先加 Report-Only CSP，收集一天违规报告后再决定正式策略',
        '检查会话 Cookie 是否同时具备 HttpOnly / Secure / SameSite 三个属性'
      ]}
    ]}
  ]},

  /* ================= 第 4 章 ================= */
  {id:'nw-4',num:'4',title:'CSRF 与 SSRF',lead:'一个借用户的浏览器发请求，一个借服务器发请求。',sections:[
    {id:'nw-4-1',num:'4.1',title:'CSRF：借用户身份发请求',lead:'浏览器会自动带上 Cookie，服务端分不清是否用户本意。',tags:['核心'],blocks:[
      {t:'p',x:'<b>CSRF</b>（跨站请求伪造）利用的是「浏览器发跨站请求时会自动携带目标站 Cookie」：恶意页面诱导用户（或仅让其访问）发起一个改数据的请求，服务端看到合法会话就执行了。它<b>不需要读到响应</b>，只要请求能发出去就成立——这也是同源策略管不住它的原因。'},
      {t:'ul',items:[
        '<b>CSRF Token</b>：每个会话/表单下发不可预测的令牌，服务端校验；令牌不放在 Cookie 里',
        '<b>SameSite=Lax / Strict</b>：跨站请求默认不带 Cookie，是目前最省事的基础防线',
        '<b>二次确认</b>：改密、转账、删资源等敏感操作要求口令/验证码/MFA 复核',
        '<b>校验 Origin / Referer</b>：作为附加检查，注意部分场景会缺失该首部',
        '<b>只用 POST/PUT/DELETE 改状态</b>：GET 必须幂等、无副作用（这是设计前提，不是防护）'
      ]},
      {t:'code',lang:'Python',x:'# FastAPI/Flask 思路：为每个会话生成令牌，校验后才接受状态变更\ndef csrf_protect(session, form_token, request):\n    expected = session.get("csrf_token")\n    if not expected or not hmac.compare_digest(expected, form_token):\n        raise PermissionError("CSRF 校验失败")\n    origin = request.headers.get("Origin")\n    if origin and origin not in ALLOWED_ORIGINS:\n        raise PermissionError("来源不被允许")\n    # 通过后执行业务；响应里轮换新令牌'},
      {t:'note',k:'常见误区',x:'「用了 JSON + POST 就没 CSRF」是错的——简单请求仍可跨域发出；只是自定义首部或 <code>application/json</code> 会触发 CORS 预检，间接增加了难度。<b>不要把 CORS 预检当防护</b>，Token 与 SameSite 才是正解。'}
    ]},
    {id:'nw-4-2',num:'4.2',title:'SSRF：让服务器替你发请求',lead:'从「能访问公网」变成「能访问内网与元数据」。',tags:['核心'],blocks:[
      {t:'p',x:'<b>SSRF</b>（服务端请求伪造）出现在「服务端根据用户输入去抓取某个 URL」的功能里：图片抓取、URL 预览、Webhook 测试、PDF 生成、导入远程资源。若未限制目标，输入可以把请求导向 <b>127.0.0.1</b>、内网网段、云元数据服务（如 <code>169.254.169.254</code>）或内网管理接口。云上尤其危险，因为元数据服务可能返回临时访问凭据。'},
      {t:'code',lang:'Python',x:'import ipaddress, socket\nfrom urllib.parse import urlparse\n\nALLOWED_SCHEMES = {"http", "https"}\n\ndef is_safe_url(raw: str) -> bool:\n    p = urlparse(raw)\n    if p.scheme not in ALLOWED_SCHEMES or not p.hostname:\n        return False\n    # 解析所有 A/AAAA 记录，逐个判断是否公网地址（防 DNS rebinding）\n    for info in socket.getaddrinfo(p.hostname, None):\n        ip = ipaddress.ip_address(info[4][0])\n        if ip.is_private or ip.is_loopback or ip.is_link_local \\\n           or ip.is_reserved or ip.is_multicast:\n            return False\n    return True\n\ndef fetch(raw: str):\n    if not is_safe_url(raw):\n        raise ValueError("目标地址不被允许")\n    # 仍需在 HTTP 客户端侧禁用自动跟随重定向，或对每一跳重新校验\n    return http_client.get(raw, allow_redirects=False, timeout=3)'},
      {t:'ul',items:[
        '<b>协议白名单</b>：只允许 http/https，禁 <code>file://</code>、<code>gopher://</code>、<code>dict://</code>',
        '<b>解析后校验 IP</b>：先解析再判断，且对<b>每一跳重定向</b>重新校验（防 DNS rebinding 与跳转绕过）',
        '<b>网络层隔离</b>：出口代理/防火墙默认拒绝内网段，比应用代码更可靠',
        '<b>云侧加固</b>：强制 IMDSv2、限制 hop limit，减少 SSRF 拿到临时凭据的可能',
        '<b>统一出口</b>：走固定代理并做域名白名单，避免任意地址外联'
      ]},
      {t:'note',k:'只做字符串黑名单不够',x:'拦 <code>127.0.0.1</code> 会被十进制/八进制 IP、IPv6 回环、短网址、DNS 指向内网、302 跳转绕过。<b>必须解析成 IP 后判断属性，并在网络层兜底</b>。'}
    ]},
    {id:'nw-4-3',num:'4.3',title:'开放重定向与 URL 校验',lead:'看似无害的跳转，常被用作钓鱼与绕过链路。',tags:['防御'],blocks:[
      {t:'p',x:'<b>开放重定向</b>指应用把用户可控参数直接作为跳转目标（如 <code>?next=</code>）。它被用于钓鱼（链接看起来是可信域名）、绕过基于来源的校验，以及串联 SSRF/OAuth 流程。修复方式与 SSRF 类似：<b>只允许站内相对路径</b>，或用白名单映射目标，不接受完整外部 URL。'},
      {t:'code',lang:'Python',x:'from urllib.parse import urlparse\n\ndef safe_next(raw: str, default: str = "/") -> str:\n    p = urlparse(raw)\n    # 只接受站内相对路径：无 scheme、无 netloc、且以单个 / 开头\n    if p.scheme or p.netloc or not raw.startswith("/") or raw.startswith("//"):\n        return default\n    return raw\n\n# 若业务确实需要跳到外部域名，用固定白名单映射，别直接透传 URL\nALLOWED_TARGETS = {"docs": "https://docs.example.com", "help": "https://help.example.com"}'},
      {t:'ex',k:'动手练一练',items:[
        '检查项目里所有「接收 URL 并由服务端发起请求」的功能点，逐项确认是否做了解析后 IP 校验',
        '为 <code>?next=</code> 参数写一组测试用例：正常相对路径、<code>//evil.com</code>、绝对 URL、含反斜杠的变形',
        '在云控制台确认实例元数据服务是否已强制 IMDSv2'
      ]}
    ]}
  ]},

  /* ================= 第 5 章 ================= */
  {id:'nw-5',num:'5',title:'认证与会话安全',lead:'「你是谁」和「这次还是不是你」都要守住。',sections:[
    {id:'nw-5-1',num:'5.1',title:'口令存储与口令策略',lead:'绝不明文、绝不快速哈希、必须带盐。',tags:['核心'],blocks:[
      {t:'p',x:'口令存储的唯一正确姿势是<b>加盐的慢哈希</b>：为每个口令生成独立随机盐，用故意昂贵的 KDF（Argon2id 优先，其次 scrypt / bcrypt）计算摘要，只存「算法参数 + 盐 + 摘要」。慢的意义在于把离线爆破成本抬高几个数量级；加盐让彩虹表与批量爆破失效。'},
      {t:'code',lang:'Python',x:'from argon2 import PasswordHasher\nfrom argon2.exceptions import VerifyMismatchError\n\nph = PasswordHasher(time_cost=3, memory_cost=64 * 1024, parallelism=2)\n\ndef hash_password(pw: str) -> str:\n    return ph.hash(pw)          # 内部自动生成随机盐并把参数编进结果\n\ndef verify(pw: str, stored: str) -> bool:\n    try:\n        return ph.verify(stored, pw)\n    except VerifyMismatchError:\n        return False\n    # 若 ph.check_needs_rehash(stored) 为真，登录成功后顺手升级哈希参数'},
      {t:'ul',items:[
        '<b>禁止</b>：明文、可逆加密、MD5/SHA-1/SHA-256 直接哈希、全局固定盐、自己设计算法',
        '<b>口令策略</b>：优先长度（≥12）+ 泄露口令校验，少用强制定期更换与奇怪复杂度规则',
        '<b>防凭据填充</b>：MFA、失败次数限速/锁定、同 IP 多账号异常检测、设备与地理校验',
        '<b>找回流程</b>：重置令牌一次性、短时效、绑定账号、用后即焚；不透露「账号是否存在」',
        '<b>传输</b>：全站 HTTPS，登录与改密接口额外限速并记录审计日志'
      ]},
      {t:'note',k:'加密不是哈希',x:'加密可逆（有密钥就能还原），口令不需要还原，只需要<b>比对</b>。把口令加密存起来，等于密钥一泄露全部口令同时泄露。'}
    ]},
    {id:'nw-5-2',num:'5.2',title:'会话管理与固定/劫持',lead:'登录后换 ID，Cookie 设好属性，退出真正失效。',tags:['核心'],blocks:[
      {t:'code',lang:'HTTP',x:'# 登录成功后必须重新生成会话 ID（防会话固定）\n# 伪代码：session.regenerate_id() 后写入新会话\n\nSet-Cookie: sid=<新随机ID>; HttpOnly; Secure; SameSite=Lax;\n            Path=/; Max-Age=3600\n\n# 服务端仍需保存会话状态与过期时间，支持主动失效：\n#  - 改密 / 提权 / 异地登录后作废旧会话\n#  - 退出时服务端删除会话记录（不只是清浏览器 Cookie）\n#  - 设置绝对超时与空闲超时'},
      {t:'ul',items:[
        '<b>会话固定</b>：攻击者先塞一个已知会话 ID 给受害者，受害者登录后该 ID 变成已认证 ⇒ 登录后必须换 ID',
        '<b>会话劫持</b>：通过 XSS、明文传输、日志泄露、中间人拿到 <code>sid</code> ⇒ HttpOnly + Secure + 全站 HTTPS',
        '<b>ID 强度</b>：用 CSPRNG 生成足够长度，绝不用自增、时间戳、用户名哈希',
        '<b>失效能力</b>：服务端要有会话清单与主动吊销能力，尤其是「退出所有设备」功能',
        '<b>并发与异常</b>：同账号异地/多设备登录提示，敏感操作重新认证'
      ]},
      {t:'p',x:'自包含令牌（JWT）与服务端 Session 的取舍：Session 易于即时吊销、服务端可控，代价是要存状态；JWT 无状态便于横向扩展，但<b>注销与改密后难以及时失效</b>，需要短有效期 + 刷新令牌 + 黑名单/版本号来弥补。详见戊篇 4.2。'},
      {t:'note',k:'Cookie 前缀',x:'使用 <code>__Host-</code> 前缀可强制要求 Secure、Path=/、无 Domain，防止子域写入同名 Cookie 覆盖会话，是低成本高收益的加固。'}
    ]},
    {id:'nw-5-3',num:'5.3',title:'MFA 与爆破防护',lead:'让「偷到口令」不再等于「拿到账号」。',tags:['防御'],blocks:[
      {t:'table',head:['因素','形式','注意'],rows:[
        ['所知','口令、PIN','单独使用最弱，需配合限速与泄露检测'],
        ['所有','TOTP、硬件密钥、短信/邮件验证码','短信有 SIM 交换与拦截风险；FIDO2/WebAuthn 抗钓鱼最佳'],
        ['所是','指纹、人脸','生物特征不可更换，需本地校验与回退方案，注意合规']
      ]},
      {t:'ul',items:[
        '<b>按风险分级</b>：管理员、资金、导出数据、改密等操作强制 MFA 或重新认证',
        '<b>限速维度</b>：账号 + IP + 设备指纹分别计数，避免只按 IP 被分布式绕过',
        '<b>避免账号枚举</b>：登录失败、注册、找回口令的统一返回相同文案与相近耗时',
        '<b>验证码与令牌</b>：一次性、短时效、绑定会话、验证后立即失效、限制尝试次数',
        '<b>通知</b>：异地登录、新设备、改密成功都发提醒并提供「不是我」入口'
      ]},
      {t:'note',k:'MFA 也要防绕过',x:'常见绕过的不是密码学，而是流程：找回口令接口没接 MFA、备用码可无限次试、旧会话在开启 MFA 后未失效、以及「记住此设备」永久豁免。<b>把所有认证相关路径一起纳入保护</b>。'}
    ]}
  ]},

  /* ================= 第 6 章 ================= */
  {id:'nw-6',num:'6',title:'访问控制与业务逻辑',lead:'认证回答「你是谁」，授权回答「你能不能」。',sections:[
    {id:'nw-6-1',num:'6.1',title:'越权：IDOR 与水平/垂直越权',lead:'每一次资源访问都要在服务端重新判权。',tags:['核心'],blocks:[
      {t:'p',x:'<b>IDOR</b>（不安全的直接对象引用）指接口用可枚举的 ID（<code>?id=1234</code>、订单号、文件名）定位资源，却没校验「这个 ID 是不是属于当前用户」。<b>水平越权</b>是同级用户互看数据，<b>垂直越权</b>是普通用户调用管理员功能。二者常年位居 OWASP 首位，因为它不是「漏洞」，而是<b>忘了写一行判权</b>。'},
      {t:'code',lang:'Python',x:'# 反例：只按 ID 查，不校验归属\ndef get_order(order_id):\n    return db.query("SELECT * FROM orders WHERE id = ?", (order_id,))\n\n# 正例：把「当前用户」作为查询条件的一部分，让数据库替你挡住越权\ndef get_order(order_id, current_user_id):\n    row = db.query(\n        "SELECT * FROM orders WHERE id = ? AND user_id = ?",\n        (order_id, current_user_id),\n    ).first()\n    if row is None:\n        raise NotFound()        # 统一返回 404，不泄露「资源存在但无权」\n    return row\n\n# 管理员接口：装饰器/中间件统一做角色校验，别靠前端隐藏菜单\ndef admin_required(fn):\n    @functools.wraps(fn)\n    def wrapper(user, *a, **kw):\n        if "admin" not in user.roles:\n            raise PermissionDenied()\n        return fn(user, *a, **kw)\n    return wrapper'},
      {t:'ul',items:[
        '<b>默认拒绝</b>：每个处理函数显式声明所需权限，未声明即拒绝',
        '<b>集中判权</b>：用中间件/策略引擎统一处理，避免每个开发各写一套',
        '<b>不可预测 ID 不是防护</b>：UUID 只是增加枚举难度，判权依然必须做',
        '<b>覆盖所有动词</b>：GET/POST/PUT/DELETE、导出、批量、以及「预览/草稿」状态都要判',
        '<b>覆盖间接对象</b>：附件、日志、评论、子资源、API 版本 v1/v2 都可能是漏网之鱼'
      ]},
      {t:'note',k:'403 与 404',x:'为防资源枚举，无权访问时常统一返回 404。但别用「隐藏 ID」代替判权——泄露一个 ID 不该造成越权。'}
    ]},
    {id:'nw-6-2',num:'6.2',title:'竞态、幂等与状态机',lead:'并发与顺序错误造成的业务逻辑漏洞。',tags:['进阶'],blocks:[
      {t:'p',x:'业务逻辑漏洞往往没有「恶意字符」，全靠合法的合法请求按异常顺序/并发触发：优惠券重复使用、余额并发扣成负数、重复提交订单、先发货后付款、跳过审批步骤、修改已确认订单的价格。自动化扫描器基本发现不了，必须靠<b>威胁建模 + 状态机设计</b>。'},
      {t:'code',lang:'SQL',x:'-- 用数据库约束与原子操作兜底，而不是「先查后写」\n-- 反例：SELECT balance → 应用层判断 → UPDATE（并发下会超扣）\n-- 正例：把判断放进单条原子语句\nUPDATE accounts\n   SET balance = balance - 100\n WHERE user_id = 42 AND balance >= 100;\n-- 检查受影响行数：为 0 说明余额不足，不要靠应用层预检\n\n-- 唯一约束防重复：订单号/幂等键建唯一索引\nCREATE UNIQUE INDEX uk_idem ON requests(idempotency_key);'},
      {t:'ul',items:[
        '<b>幂等键</b>：写操作带客户端生成的唯一键，服务端去重，防重复提交与网络重试',
        '<b>状态机</b>：显式定义允许的状态迁移，服务端拒绝非法跃迁（如「已取消→已发货」）',
        '<b>服务端定价</b>：金额、折扣、库存一律以服务端计算结果为准，不信任客户端传值',
        '<b>锁与事务</b>：关键操作用数据库事务 + 行锁/乐观锁（版本号），隔离级别要匹配',
        '<b>全链路校验</b>：每一步都重新读服务端状态，不沿用上一步的客户端回传值'
      ]},
      {t:'note',k:'测试怎么做',x:'用并发请求（同账号同时发 N 次）、乱序调用（跳过中间步骤）、重放旧请求、篡改金额与数量字段，分别验证服务端是否仍保持不变量。<b>不变量（invariant）思维</b>比逐接口找漏洞更有效。'}
    ]},
    {id:'nw-6-3',num:'6.3',title:'批量操作、导出与限流',lead:'「合法但过量」也是一种攻击面。',tags:['防御'],blocks:[
      {t:'ul',items:[
        '<b>分页上限</b>：限制 <code>page_size</code> 上限与查询时间范围，防一次性拖库与慢查询打满 DB',
        '<b>导出权限</b>：导出/报表接口按最小列集返回，单独判权、单独限流、记录审计日志',
        '<b>资源消耗</b>：上传大小、图片缩放尺寸、正则复杂度、递归深度、图查询复杂度都要设上限',
        '<b>限流维度</b>：按用户 + IP + 接口分别限流；429 响应带 <code>Retry-After</code>',
        '<b>验证码/人机校验</b>：只在高风险接口启用，避免拖累正常体验',
        '<b>异常监控</b>：单账号短时间大量读取、非工作时段批量导出，都应触发告警'
      ]},
      {t:'p',x:'这类问题介于「安全」与「可用性」之间，常被归到性能或产品需求里，结果是没人负责。建议在接口设计评审时就把<b>配额、上限、超时、审计</b>列为必填项，与「返回什么字段」一起写进接口契约。'},
      {t:'ex',k:'动手练一练',items:[
        '找出一个查询接口，确认 <code>page_size</code> 是否有服务端强制上限',
        '为一个「下单扣库存」流程写出三条必须成立的不变量，并说明各自靠什么机制保证',
        '设计一组并发测试用例，验证重复提交不会生成两张订单'
      ]}
    ]}
  ]},

  /* ================= 第 7 章 ================= */
  {id:'nw-7',num:'7',title:'上传、反序列化与组件',lead:'把「外来数据」变成「本地代码或文件」的高危路径。',sections:[
    {id:'nw-7-1',num:'7.1',title:'文件上传安全',lead:'校验内容、重命名、隔离存储、禁止执行。',tags:['核心'],blocks:[
      {t:'p',x:'上传功能的风险有两类：一是<b>可执行内容被放到 Web 可访问目录并被解析</b>（WebShell），二是<b>路径穿越 / 覆盖</b>把文件写到不该写的位置。此外还有超大文件耗尽磁盘、伪造 Content-Type、图片里夹带恶意内容、以及解压炸弹（zip bomb）。'},
      {t:'code',lang:'Python',x:'import os, uuid, imghdr\nfrom pathlib import Path\n\nALLOWED = {"image/png": ".png", "image/jpeg": ".jpg", "image/webp": ".webp"}\nMAX_BYTES = 5 * 1024 * 1024\n\ndef save_upload(file, base="/var/data/uploads"):\n    data = file.read(MAX_BYTES + 1)\n    if len(data) > MAX_BYTES:\n        raise ValueError("文件过大")\n    # 1) 以内容嗅探类型，不信客户端声明的 Content-Type / 扩展名\n    kind = imghdr.what(None, data)\n    ext = {"png": ".png", "jpeg": ".jpg", "webp": ".webp"}.get(kind)\n    if not ext:\n        raise ValueError("文件类型不被允许")\n    # 2) 完全放弃原文件名，用随机名；路径由服务端拼接\n    name = uuid.uuid4().hex + ext\n    target = Path(base) / name\n    # 3) 存在即拒绝（避免覆盖），写入时指定权限\n    with open(target, "xb") as f:\n        f.write(data)\n    return name          # 通过独立的只读路由/域名对外提供，绝不交给脚本解析器'},
      {t:'ul',items:[
        '<b>白名单</b>：按业务需要允许最少类型，用魔数/嗅探校验内容而非扩展名',
        '<b>重命名 + 随机化</b>：不保留原始文件名，杜绝路径穿越与特殊字符',
        '<b>隔离存储</b>：存到 Web 根目录之外或对象存储，静态资源走独立域名 + CDN',
        '<b>禁止执行</b>：上传目录配置成静态只提供、不解析脚本（Nginx <code>location</code> 明确类型）',
        '<b>限制大小与频率</b>：请求体上限、单用户配额、压缩文件解压后大小与条目数上限',
        '<b>扫描与审计</b>：接病毒扫描，记录上传者、时间、哈希'
      ]},
      {t:'note',k:'别只靠黑名单扩展名',x:'拦 <code>.php</code> 会被 <code>.php5</code>、<code>.phtml</code>、双扩展名、大小写、尾随点/空格、以及解析漏洞绕过。<b>服务端随机重命名 + 禁止脚本解析</b>才是根治。'}
    ]},
    {id:'nw-7-2',num:'7.2',title:'不安全的反序列化',lead:'把字节流还原成对象时，别让它决定要做什么。',tags:['核心'],blocks:[
      {t:'p',x:'某些序列化格式（Java 原生、Python <code>pickle</code>、PHP <code>unserialize</code>、.NET BinaryFormatter、部分 YAML/XML 解析器）在还原对象时会<b>自动调用魔术方法或构造任意类型</b>。若字节流来自不可信来源，就可能被构造成「反序列化即执行」的调用链（gadget chain）。'},
      {t:'code',lang:'Python',x:'import json, yaml\n\n# 正例：只处理纯数据格式，且明确类型与字段\ndef parse_config(raw: str) -> dict:\n    obj = json.loads(raw)          # JSON 只产生基本类型，不构造任意对象\n    if not isinstance(obj, dict) or "name" not in obj:\n        raise ValueError("配置格式不合法")\n    return {"name": str(obj["name"])[:64]}\n\n# 正例：必须读 YAML 时用 safe_load，禁止 yaml.load\ndef parse_yaml(raw: str):\n    return yaml.safe_load(raw)      # safe_load 只构建简单类型\n\n# 反例（切勿用于外部数据）：\n# pickle.loads(user_bytes) / yaml.load(raw, Loader=yaml.Loader)\n# 若必须传递结构化对象，改为显式 schema + 字段白名单'},
      {t:'ul',items:[
        '<b>首选纯数据格式</b>：JSON / MessagePack / Protobuf，配合 schema 校验',
        '<b>禁用危险 API</b>：<code>pickle</code>、<code>yaml.load</code>、Java 原生反序列化、BinaryFormatter',
        '<b>完整性保护</b>：若必须序列化会话/令牌到客户端，用服务端签名（HMAC）或加密并验签后再读',
        '<b>类白名单</b>：框架提供的反序列化允许列表机制（如 Java <code>ObjectInputFilter</code>）',
        '<b>依赖升级</b>：gadget 常来自第三方库，及时打补丁并做依赖扫描'
      ]},
      {t:'note',k:'签名不等于安全',x:'对序列化数据签名能防篡改，但若服务端仍会反序列化<b>任意类型</b>，一旦签名密钥泄露或存在其他构造路径，问题依旧。根本解法是<b>不还原成可执行对象</b>。'}
    ]},
    {id:'nw-7-3',num:'7.3',title:'组件、依赖与供应链',lead:'你的代码没漏洞，不代表你引入的库没有。',tags:['工程'],blocks:[
      {t:'ul',items:[
        '<b>SBOM</b>：为每个制品生成软件物料清单（CycloneDX / SPDX），说清直接和间接依赖及版本',
        '<b>版本锁定与校验</b>：锁文件 + 哈希校验，避免「同名不同内容」与构建期漂移',
        '<b>持续扫描</b>：SCA 工具比对 CVE / KEV / EPSS，接入 CI 阻断高危引入',
        '<b>来源可信</b>：只用官方源与私有代理仓库，核对包名防 typosquatting，审查维护者变更',
        '<b>最小依赖</b>：定期清理不再使用的库，依赖越少面越小',
        '<b>构建链完整性</b>：保护 CI 凭据、隔离构建环境、签名制品、验证发布渠道'
      ]},
      {t:'code',lang:'Bash',x:'# 常见自查动作（以自有项目为例）\npython -m pip freeze > requirements.txt\npip-audit                        # Python 依赖已知漏洞\nnpm audit --omit=dev            # Node 依赖\nsyft dir:. -o cyclonedx-json=sbom.json    # 生成 SBOM\ngrype sbom:sbom.json            # 用 SBOM 做漏洞匹配'},
      {t:'p',x:'供应链攻击的特点是不碰你的应用逻辑：投毒一个流行包、劫持维护者账号、篡改 CI 脚本、或污染基础镜像，就能在所有下游同时生效。因此防护要覆盖<b>引入前（来源与评审）、构建时（隔离与校验）、运行后（最小权限与出口管控）</b>三段，而不只是「扫一遍 CVE」。'},
      {t:'note',k:'修复要验证',x:'升版本后要跑回归测试并确认漏洞确实消失（复测），同时留意「修了 A 引入 B」。把依赖更新纳入常态化节奏，别等出事才临时升级。'}
    ]}
  ]},

  /* ================= 第 8 章 ================= */
  {id:'nw-8',num:'8',title:'API 与前端安全',lead:'前后端分离与微服务之后，边界更多了。',sections:[
    {id:'nw-8-1',num:'8.1',title:'REST / GraphQL 的授权与配额',lead:'每个字段都可能是一次独立的数据访问。',tags:['API'],blocks:[
      {t:'ul',items:[
        '<b>对象级授权（BOLA）</b>：REST 每个带 ID 的端点、GraphQL 每个 resolver 都要判权，不能用网关一次校验代替',
        '<b>功能级授权</b>：<code>/admin/*</code>、批量接口、内部接口一律显式角色校验',
        '<b>过度数据暴露</b>：不要直接把 ORM 对象序列化返回；按用例定义响应 DTO，剔除口令哈希、内部 ID、权限字段',
        '<b>GraphQL 复杂度限制</b>：限制查询深度、别名数量、分页大小，防嵌套查询打满数据库',
        '<b>批量与速率</b>：单请求批量条数上限 + 按 API Key/用户限流',
        '<b>版本与废弃</b>：老版本 API 同样要打补丁或下线，别留「没人用的旧接口」'
      ]},
      {t:'p',x:'OWASP API Security Top 10 里排第一的就是 <b>BOLA</b>（失效的对象级授权），本质上就是 6.1 的 IDOR 在 API 语境下的名字：攻击者把请求里的对象 ID 换成别人的，服务端若只校验「登录了没有」而不校验「有没有权访问这个对象」，数据就泄露了。'},
      {t:'note',k:'文档与调试端点',x:'Swagger / OpenAPI、GraphQL Playground、Actuator、健康检查在生产环境应限制访问或关闭；它们本身不是漏洞，却会把接口清单与内部结构完整交出去。'}
    ]},
    {id:'nw-8-2',num:'8.2',title:'CORS、安全首部与前端存储',lead:'浏览器侧的最后一层配置。',tags:['防御'],blocks:[
      {t:'code',lang:'Python',x:'# CORS：精确白名单，带凭据时不能用通配符\nALLOWED_ORIGINS = {"https://app.example.com", "https://admin.example.com"}\n\ndef cors_headers(origin: str) -> dict:\n    if origin not in ALLOWED_ORIGINS:\n        return {}\n    return {\n        "Access-Control-Allow-Origin": origin,\n        "Access-Control-Allow-Credentials": "true",\n        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",\n        "Access-Control-Allow-Headers": "Content-Type, Authorization",\n        "Vary": "Origin",          # 避免缓存把某个源的响应发给另一个源\n    }'},
      {t:'ul',items:[
        '<b>不要把 Token 放 localStorage</b>：XSS 一旦发生即可读取；优先用 HttpOnly Cookie + CSRF 防护',
        '<b>避免在前端放长期密钥</b>：任何打包进 JS 的密钥都是公开的，第三方调用要经服务端代理',
        '<b>postMessage</b>：校验 <code>event.origin</code> 精确匹配，别用 <code>*</code> 作为目标',
        '<b>第三方脚本</b>：统计/广告/SDK 引入即用即审，加 SRI 与 CSP 白名单，定期清理',
        '<b>source map / 调试开关</b>：生产构建关闭，避免把源码与内部信息交给客户端'
      ]},
      {t:'p',x:'前后端分离后，很多团队把全部安全寄托在「网关统一鉴权」上。但网关通常只验证令牌有效，无法判断「这个用户能不能改这条记录」。<b>对象级判权必须落在业务服务里</b>，网关只做认证与粗粒度路由。'},
      {t:'note',k:'Vary: Origin',x:'CORS 响应按 Origin 变化时若不带 <code>Vary: Origin</code>，CDN 可能把「给 A 站放行」的响应缓存后发给 B 站，造成跨域读取。这是很容易漏掉的一行配置。'}
    ]},
    {id:'nw-8-3',num:'8.3',title:'JWT / OAuth 常见误用',lead:'令牌本身安全，用错地方才危险。',tags:['API'],blocks:[
      {t:'table',head:['误用','后果','正确做法'],rows:[
        ['<code>alg: none</code> 或允许客户端指定算法','伪造任意令牌','服务端固定允许的算法白名单，验签前先校验 <code>alg</code>'],
        ['不校验签名 / 过期 / <code>aud</code> / <code>iss</code>','过期或被冒用的令牌仍可用','完整校验四个声明，密钥按 <code>kid</code> 从可信集合取'],
        ['把口令、权限变更写进长期令牌','改密后旧令牌仍有效','短时效 access token + 可吊销 refresh token + 令牌版本号'],
        ['令牌放在 URL / 日志里','被浏览器历史、Referer、代理日志泄露','放 Authorization 头，日志脱敏'],
        ['OAuth 不校验 <code>state</code>','授权码被注入、账号被绑定','每会话随机 state 并严格校验'],
        ['重定向 URI 用前缀匹配','授权码被导向攻击者域名','精确全匹配注册过的 redirect_uri']
      ]},
      {t:'p',x:'JWT 的三段是 <code>header.payload.signature</code>，前两段只是 Base64URL 编码（<b>不是加密</b>），任何人都能读。所以<b>不要往 payload 里放敏感信息</b>，也不要以为「用了 JWT 就不需要服务端状态」——注销、改密、权限回收都要求某种形式的服务端可见状态。'},
      {t:'ex',k:'课程小结',items:[
        '为你负责的一个 API 列出所有带对象 ID 的端点，逐个确认对象级判权落地',
        '检查 JWT 校验代码是否同时固定算法、校验 exp/aud/iss、并从可信 <code>kid</code> 集合取密钥',
        '把本章 8 类风险映射到乙篇的资产台账，标出哪些对外入口还没做过这些检查'
      ]}
    ]}
  ]}
  ]
};
