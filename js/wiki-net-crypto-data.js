/* ==========================================================
   网络攻防技术篇 · 戊 · 密码学、认证与身份安全
   主线：基础目标 → 公钥与 PKI → 口令存储 → 令牌与 SSO →
         TLS 实战 → 典型误用
   立场：只使用标准库/成熟实现，不自行设计算法
   ========================================================== */
window.WIKI_NET_CRYPTO = {
  id:'net-crypto', num:'戊', en:'COURSE V · CRYPTOGRAPHY & IDENTITY',
  title:'密码学、认证与身份安全',
  lead:'身份是新的边界，而密码学是身份的地基。本课程不推导数学，只讲工程上必须理解的契约：对称与非对称加密各自解决什么、哈希与消息认证的区别、证书链如何建立信任、口令为什么必须慢哈希、JWT / OAuth / Cookie 各自的安全前提，以及那些年复一年重复出现的误用——自制算法、固定 IV、硬编码密钥、把加密当成完整性。',
  chips:['身份安全','标准实现','共 6 章'],
  chapters:[

  /* ================= 第 1 章 ================= */
  {id:'nc-1',num:'1',title:'密码学基础目标',lead:'先分清「保密」「完整」「认证」「不可否认」。',sections:[
    {id:'nc-1-1',num:'1.1',title:'四个目标与攻击者模型',lead:'不同目标需要不同原语，混用就会出事。',tags:['基础'],blocks:[
      {t:'table',head:['目标','含义','典型原语'],rows:[
        ['机密性','别人看不到内容','AES-GCM、ChaCha20-Poly1305'],
        ['完整性','内容被改过能被发现','HMAC、AEAD 的认证标签、哈希（需配合认证）'],
        ['认证 / 真实性','确认对方是谁、消息来自谁','数字签名、MAC、证书、MFA'],
        ['不可否认','事后无法抵赖','数字签名 + 可信时间戳 + 审计链']
      ]},
      {t:'p',x:'现代密码学以 <b>Kerckhoffs 原则</b>为前提：安全性只应依赖<b>密钥</b>，不能依赖算法保密。因此「我们用了自研算法，别人不知道」不是优势，而是最大的风险。攻击者模型也从不假设「只能被动窃听」——默认攻击者能<b>截获、篡改、重放、注入</b>任意报文（Dolev-Yao 模型），协议必须在这种条件下仍成立。'},
      {t:'note',k:'编码不是加密',x:'Base64、URL 编码、十六进制、ROT13 都只是表示形式，<b>不提供任何机密性</b>。把 Base64 过的令牌当作「加密了」是极常见的误解。'}
    ]},
    {id:'nc-1-2',num:'1.2',title:'对称加密、模式与 IV/Nonce',lead:'同样的 AES，用错模式就不安全。',tags:['核心'],blocks:[
      {t:'p',x:'<b>对称加密</b>双方共用同一密钥，速度快、适合大量数据。但分组密码（如 AES）必须指定<b>工作模式</b>：ECB 因相同明文块产生相同密文块会泄露模式，绝对禁用；CBC 需要不可预测的 IV 且不带认证，历史上引出多次填充预言攻击；现代只推荐 <b>AEAD</b> 模式——<b>AES-GCM</b> 与 <b>ChaCha20-Poly1305</b>，一次同时提供机密性与完整性。'},
      {t:'code',lang:'Python',x:'from cryptography.hazmat.primitives.ciphers.aead import AESGCM\nimport os\n\nkey = AESGCM.generate_key(bit_length=256)\naes = AESGCM(key)\n\ndef encrypt(plaintext: bytes, aad: bytes = b"") -> bytes:\n    nonce = os.urandom(12)          # GCM 标准 96 位；每次必须唯一\n    return nonce + aes.encrypt(nonce, plaintext, aad)\n\ndef decrypt(blob: bytes, aad: bytes = b"") -> bytes:\n    nonce, ct = blob[:12], blob[12:]\n    # 认证失败（被篡改 / 密钥错 / nonce 错）会直接抛异常\n    return aes.decrypt(nonce, ct, aad)\n\n# 关键纪律：\n# 1) 同一 key 下 nonce 绝不能重复（重复会破坏 GCM 安全性）\n# 2) 绝不固定 IV、绝不用计数器当 nonce 又在不同进程复用\n# 3) aad 放不需要加密但必须防篡改的上下文（如用户 ID、记录 ID）'},
      {t:'ul',items:[
        '<b>密钥与 nonce 生命周期不同</b>：密钥长期、nonce 每条消息唯一且可随密文一起传',
        '<b>认证标签</b>：解密前先验签，认证失败绝不「容错」返回部分明文',
        '<b>密钥轮换</b>：用密钥版本号/密钥 ID 标识，支持平滑轮换与旧数据解密',
        '<b>不要用加密做完整性</b>：CBC 之类不带认证的模式必须额外加 HMAC（且顺序要正确）'
      ]},
      {t:'note',k:'流密码的重用灾难',x:'任何「密钥流复用」都等价于把两段明文异或后暴露给攻击者。ChaCha20 / CTR 模式下 nonce 重用、以及早期 WEP 的 IV 重用，都是同一类错误。'}
    ]},
    {id:'nc-1-3',num:'1.3',title:'哈希、MAC 与随机数',lead:'三个最常被混为一谈的原语。',tags:['核心'],blocks:[
      {t:'table',head:['原语','有密钥？','保证什么','用途'],rows:[
        ['<b>哈希</b> SHA-256 / BLAKE3','无','数据指纹，抗碰撞','完整性校验（需配合可信渠道）、文件去重、口令派生的一部分'],
        ['<b>MAC / HMAC</b>','有','持密钥者才能生成正确的认证标签','消息认证、API 签名、CSRF Token、会话令牌签名'],
        ['<b>KDF</b> Argon2 / HKDF','有','把弱输入/主密钥派生成强密钥','口令存储、从主密钥派生多个子密钥'],
        ['<b>CSPRNG</b> <code>os.urandom</code>','—','不可预测','密钥、nonce、盐、令牌、会话 ID']
      ]},
      {t:'code',lang:'Python',x:'import hashlib, hmac, secrets, os\n\n# 哈希：只做指纹，不含身份认证\ndigest = hashlib.sha256(b"data").hexdigest()\n\n# HMAC：带密钥认证，比较必须用常量时间函数\ntag = hmac.new(secret_key, b"data", hashlib.sha256).hexdigest()\nassert hmac.compare_digest(tag, presented_tag)\n\n# 所有安全随机都用 secrets / os.urandom，绝不用 random\ntoken = secrets.token_urlsafe(32)\nsalt  = os.urandom(16)\n\n# 反例：random.randint / Math.random / 时间戳自增做令牌\n# 这类值可预测，等于没有认证'},
      {t:'p',x:'还有一个易错点：<b>哈希不等于完整性保证</b>。攻击者若同时能改数据和旁边的哈希值，SHA-256 本身挡不住——需要 MAC（有密钥）或数字签名，或把哈希放在可信的只读渠道。同理，比较 MAC/签名时要用<b>常量时间比较</b>（<code>hmac.compare_digest</code>），否则可能通过响应耗时逐字节推断正确值（时序攻击）。'},
      {t:'note',k:'MD5 与 SHA-1',x:'二者已被证实可构造碰撞，<b>不得用于证书签名、文件完整性校验等抗碰撞场景</b>。现有系统应迁移到 SHA-256 / SHA-3 / BLAKE2/3；口令存储则完全不该用普通哈希（见第 3 章）。'}
    ]}
  ]},

  /* ================= 第 2 章 ================= */
  {id:'nc-2',num:'2',title:'公钥密码与 PKI',lead:'解决「素不相识的两方如何建立信任」。',sections:[
    {id:'nc-2-1',num:'2.1',title:'密钥交换、加密与签名',lead:'RSA / ECC / DH 各管一段。',tags:['核心'],blocks:[
      {t:'table',head:['机制','作用','工程选择'],rows:[
        ['<b>DH / ECDHE</b>','在不安全信道上协商出共享秘密','TLS 1.3 用 X25519 等做临时密钥交换，提供前向安全'],
        ['<b>RSA / ECC 加密</b>','用公钥加密、私钥解密','现代协议已少用 RSA 加密传密钥；更多用于签名'],
        ['<b>数字签名</b> ECDSA / Ed25519 / RSA-PSS','私钥签、公钥验，证明来源与完整性','代码签名、证书、JWT、制品签名'],
        ['<b>证书</b>','把公钥与身份绑定并由 CA 背书','TLS、mTLS、邮件与文档签名']
      ]},
      {t:'p',x:'非对称密码慢，所以实际系统几乎总是<b>混合使用</b>：用非对称做身份认证与密钥协商，再用协商出的对称密钥加密大量数据（TLS 正是如此）。另一个要点是<b>前向安全</b>：用临时 ECDHE 时，每次会话的共享秘密都不同，即使服务器私钥日后泄露，历史会话也无法被回溯解密；而静态 RSA 密钥传输没有这个性质，这是 TLS 1.3 废弃它的主因。'},
      {t:'note',k:'签名 ≠ 加密',x:'「用私钥加密」是常见错误说法。私钥做的是<b>签名</b>：任何人有公钥都能验，因此它不提供机密性，只提供来源与完整性证明。'}
    ]},
    {id:'nc-2-2',num:'2.2',title:'证书链、验证与吊销',lead:'验签之外还要验域名、有效期与用途。',tags:['核心'],blocks:[
      {t:'ol',items:[
        '<b>构建链</b>：叶子证书 → 一个或多个中间 CA → 本地信任库里的根证书',
        '<b>逐级验签</b>：用上级公钥验证下级证书签名，检查 Basic Constraints / Key Usage 允许签发证书',
        '<b>身份匹配</b>：用 <b>SAN</b>（Subject Alternative Name）匹配访问的域名，不再看 CN；支持通配符但只匹配一级',
        '<b>有效期</b>：检查 notBefore / notAfter，并确认本机时间可信（时间错误会让验证全盘失效）',
        '<b>吊销检查</b>：OCSP Stapling / CRL / 厂商吊销列表；并考虑 CT 日志是否收录',
        '<b>策略约束</b>：CAA 记录、名称约束、算法与密钥长度最低要求'
      ]},
      {t:'p',x:'<b>跳过证书验证</b>是工程里最危险的一行配置：<code>verify=False</code>、<code>NODE_TLS_REJECT_UNAUTHORIZED=0</code>、自签证书加进全局信任库、移动端「信任所有证书」——它们都会让 TLS 退化成「加密但可被中间人」。开发/测试环境的临时绕过必须确保<b>绝不进生产构建</b>，可用编译期开关或环境判定硬性拦截。'},
      {t:'code',lang:'Python',x:'import httpx\n\n# 正确：默认完整验证证书链与主机名\nr = httpx.get("https://api.example.com", timeout=5)\n\n# 企业私有 CA：把该 CA 加入专用信任库，而不是关闭验证\n# client = httpx.Client(verify="/etc/ssl/certs/internal-ca.pem")\n\n# 反例（仅用于本地排障，禁止出现在生产代码）：\n# httpx.get(url, verify=False)'},
      {t:'note',k:'mTLS',x:'双向 TLS 要求客户端也出示证书，常用于服务间身份（微分段、零信任）。代价是<b>证书签发、轮换与吊销的整套运维</b>，别只把证书配上去就以为完事了。'}
    ]},
    {id:'nc-2-3',num:'2.3',title:'密钥生命周期管理',lead:'生成、存储、使用、轮换、销毁，每一环都可能漏。',tags:['工程'],blocks:[
      {t:'ul',items:[
        '<b>生成</b>：用 CSPRNG，在可信环境内生成；私钥不出 HSM/KMS 更安全',
        '<b>存储</b>：放 KMS / HSM / 密钥管理服务或受限文件（权限 0600），绝不进源码、镜像、环境变量明文、前端 bundle',
        '<b>使用</b>：最小权限调用、审计每次使用、避免把密钥打到日志与异常堆栈',
        '<b>分离</b>：不同用途用不同密钥（加密 ≠ 签名 ≠ 派生），一钥多用会互相削弱',
        '<b>轮换</b>：用 <code>kid</code> / 版本号支持双密钥并存，先发新、后停旧、再销毁',
        '<b>泄露处置</b>：立即吊销、轮换、检查调用日志、评估需重新加密/重签的数据范围'
      ]},
      {t:'p',x:'现实里绝大多数「密码学被攻破」其实是<b>密钥管理失守</b>：算法是 AES-256、协议是 TLS 1.3，但私钥躺在公开仓库、KMS 策略给了 <code>*</code>、或日志里打印了完整令牌。所以做设计评审时，先问「<b>密钥从哪来、谁能用、怎么换、泄露了怎么办</b>」，再讨论算法参数。'},
      {t:'ex',k:'动手练一练',items:[
        '列出你项目里所有密钥/令牌，标出存放位置、使用人、上次轮换时间与泄露后的处置步骤',
        '检查代码库与镜像里是否存在硬编码密钥，并把发现接入 CI 阻断',
        '为一个签名密钥设计带 <code>kid</code> 的平滑轮换流程（新旧并存 → 全量切换 → 停用旧）'
      ]}
    ]}
  ]},

  /* ================= 第 3 章 ================= */
  {id:'nc-3',num:'3',title:'口令与凭据存储',lead:'数据库被拖走时，能不能守住用户口令。',sections:[
    {id:'nc-3-1',num:'3.1',title:'加盐慢哈希',lead:'把离线爆破的成本抬高几个数量级。',tags:['核心'],blocks:[
      {t:'p',x:'口令存储要同时解决两件事：<b>加盐</b>让攻击者无法用预计算表或一次性批量爆破所有账号；<b>慢</b>让每猜一次都要付出可观的 CPU/内存代价。普通哈希（哪怕 SHA-512）太快，GPU 每秒可试数十亿次，完全不适用。'},
      {t:'code',lang:'Python',x:'from argon2 import PasswordHasher\nfrom argon2.exceptions import VerifyMismatchError, InvalidHashError\n\n# 参数按机器性能压测后确定：目标是单次约 50~200ms，且内存成本足够抵抗 GPU\nph = PasswordHasher(\n    time_cost=3,             # 迭代轮数\n    memory_cost=64 * 1024,   # 64 MiB 内存硬度\n    parallelism=2,\n    hash_len=32, salt_len=16,\n)\n\ndef store(pw: str) -> str:\n    return ph.hash(pw)       # 结果自带算法/参数/随机盐/摘要，可直接存一列\n\ndef check(pw: str, stored: str) -> bool:\n    try:\n        ok = ph.verify(stored, pw)\n    except (VerifyMismatchError, InvalidHashError):\n        return False\n    if ok and ph.check_needs_rehash(stored):\n        pass                  # 登录成功后用新参数重算并更新，实现平滑升级\n    return ok'},
      {t:'table',head:['方案','评价','适用'],rows:[
        ['明文 / 可逆加密','绝对禁止','—'],
        ['MD5 / SHA-1 / SHA-256 直接哈希','禁止，太快','—'],
        ['哈希 + 全局固定盐','禁止，一次爆破全库','—'],
        ['<b>Argon2id</b>','首选，内存硬度抗 GPU','新系统'],
        ['<b>scrypt</b> / <b>bcrypt</b>','成熟可用；bcrypt 有 72 字节输入上限','兼容老系统'],
        ['PBKDF2-HMAC-SHA256','合规场景常用，需足够迭代次数','FIPS 等受限环境']
      ]},
      {t:'note',k:' pepper（胡椒）',x:'在慢哈希之外再加一个<b>服务端全局密钥</b>（存在 KMS 而非数据库），可使「只拖走数据库」的攻击者即使在拥有盐的情况下也无法离线爆破。但它不是加盐的替代，且丢失会导致所有口令无法验证，需妥善备份。'}
    ]},
    {id:'nc-3-2',num:'3.2',title:'口令策略与泄露校验',lead:'别把力气花在「必须含大写和符号」上。',tags:['防御'],blocks:[
      {t:'ul',items:[
        '<b>长度优先</b>：鼓励 ≥12~14 字符的口令短语，比复杂符号规则更有效也更易记',
        '<b>禁止常见口令</b>：注册/改密时比对已泄露口令清单（可用 k-anonymity 式前缀查询，不发送完整口令）',
        '<b>不强制定期更换</b>：无泄露迹象时频繁更换反而促使用户写成 <code>Password2026!</code> 这类可预测模式',
        '<b>不限制粘贴、不搞密码提示问题</b>：便于口令管理器；提示问题往往比口令更易被猜到',
        '<b>唯一性</b>：引导用户一站一密，或直接推广口令管理器 + 通行密钥（Passkey）',
        '<b>限速与 MFA</b>：见丙篇 5.3，这是防在线爆破与凭据填充的主力'
      ]},
      {t:'p',x:'<b>凭据填充（credential stuffing）</b>与爆破不同：攻击者拿别处泄露的「邮箱+口令」来撞你的登录，请求本身完全合法，因此「口令复杂度」几乎不起作用，真正有效的是 <b>MFA、泄露口令校验、异常登录检测与限速</b>。'},
      {t:'note',k:'统一响应',x:'登录失败不要区分「账号不存在」「口令错误」「账号被锁」；响应体与耗时也应尽量一致，否则会形成<b>账号枚举</b>接口，被攻击者用来筛选有效账号。'}
    ]},
    {id:'nc-3-3',num:'3.3',title:'通行密钥与无口令认证',lead:'用公钥密码替代「共享秘密」。',tags:['前沿'],blocks:[
      {t:'p',x:'<b>Passkey / WebAuthn / FIDO2</b> 的思路是：服务端只存公钥，认证时用私钥对一次挑战签名，私钥留在用户设备（或经同步的加密保管库）里。因为服务端没有可泄露的共享秘密、签名绑定了来源域名，<b>钓鱼站拿不到可用凭据</b>，数据库泄露也不会导致口令外流。'},
      {t:'table',head:['维度','口令','通行密钥'],rows:[
        ['服务端存储','慢哈希摘要','公钥（泄露也不可用于登录）'],
        ['钓鱼抗性','弱，用户会把口令输给假站','强，签名绑定 RP ID（域名）'],
        ['重放','口令可重复使用','每次挑战唯一，签名不可重放'],
        ['可用性','无需设备','需要设备/同步方案与恢复流程']
      ]},
      {t:'p',x:'落地要点：设计好<b>账号恢复</b>（设备丢失怎么办）、跨设备同步策略、以及与传统 MFA 的过渡期共存；同时保留审计日志与异常登录提醒。无口令不是「取消认证」，而是把认证从「人记住秘密」换成「设备持有密钥」。'},
      {t:'ex',k:'动手练一练',items:[
        '为你的登录页列出「有通行密钥」与「只有口令」两种路径下的账号恢复方案',
        '检查登录失败响应在账号不存在 / 口令错误 / 账号锁定三种情况下是否完全一致',
        '说明为什么「服务端存公钥」能降低数据库泄露的影响'
      ]}
    ]}
  ]},

  /* ================= 第 4 章 ================= */
  {id:'nc-4',num:'4',title:'令牌、SSO 与协议',lead:'会话、JWT、OAuth 各自的前提条件。',sections:[
    {id:'nc-4-1',num:'4.1',title:'Session 与 Cookie 属性',lead:'服务端会话仍是最容易做对的选择。',tags:['核心'],blocks:[
      {t:'code',lang:'HTTP',x:'# 登录后重新生成会话 ID，Cookie 六个属性都要到位\nSet-Cookie: __Host-sid=<CSPRNG 随机值>; Path=/; Secure; HttpOnly;\n            SameSite=Lax; Max-Age=3600\n\n# 各属性的作用：\n# Secure     仅 HTTPS 传输\n# HttpOnly   JS 读不到，缓解 XSS 窃取会话\n# SameSite  跨站请求不自动携带，缓解 CSRF\n# __Host-   前缀强制 Secure + Path=/ + 无 Domain，防子域覆盖\n# Path/Domain 尽量收窄\n# Max-Age   配合服务端空闲/绝对超时'},
      {t:'p',x:'服务端 Session 的优点是<b>可即时吊销</b>：改密、退出、发现异常都能立刻让会话失效。代价是需要在服务端存状态（Redis / 数据库），并考虑跨节点共享与过期清理。对绝大多数单体或中小规模系统，这是最稳妥的默认选择；只有确实需要无状态横向扩展、或需要跨服务传递身份时，才考虑 JWT。'},
      {t:'note',k:'退出要真的退出',x:'只清浏览器 Cookie、服务端会话记录还在，等于没退出。<b>退出、改密、权限变更都必须作废旧会话</b>，并提供「退出所有设备」。'}
    ]},
    {id:'nc-4-2',num:'4.2',title:'JWT 结构与验签陷阱',lead:'payload 只是 Base64，不是加密。',tags:['核心'],blocks:[
      {t:'code',lang:'Text',x:'xxxxx.yyyyy.zzzzz\n  |      |      └─ signature：对 base64url(header)+"."+base64url(payload) 的签名\n  |      └─ payload：claims（sub / iat / exp / aud / iss / jti / 自定义）\n  └─ header：alg / kid / typ\n\n# 注意：header 与 payload 只是 Base64URL 编码，任何人都能解码阅读。\n# 所以：不要放口令、身份证号、内部权限明细等敏感数据；\n#       也不要把「前端看不到」当作保密手段。'},
      {t:'table',head:['陷阱','后果','正确做法'],rows:[
        ['信任 header 里的 <code>alg</code>','<code>none</code> / 算法混淆导致伪造','服务端硬编码允许算法白名单，验签前先校验 alg'],
        ['不校验 <code>exp/aud/iss/nbf</code>','过期或签发给他系统的令牌被接受','四项全验，时钟留小容差'],
        ['<code>kid</code> 直接拼路径或查库','路径穿越 / 注入 / 选到攻击者控制的密钥','<code>kid</code> 从预加载的可信映射里取'],
        ['长期有效且无法吊销','改密后旧令牌仍能用','短 access token + 可吊销 refresh token + 令牌版本号'],
        ['令牌出现在 URL/日志/Referer','被历史记录与第三方泄露','放 Authorization 头，日志脱敏'],
        ['把权限明细写进 payload','权限变更不能即时生效','服务端按 <code>sub</code> 实时查权限']
      ]},
      {t:'p',x:'JWT 的「无状态」是有代价的：<b>无法即时失效</b>。工程上通常用三层组合弥补——access token 只活 5~15 分钟；refresh token 存服务端可吊销并记录设备；再给每个用户一个 <code>token_version</code>，改密时递增使旧令牌全部失效。若这些都要做，其实已经很接近 Session 了，选型时要诚实评估。'},
      {t:'note',k:'JWS / JWE / JWT',x:'日常说的 JWT 多数是 <b>JWS</b>（只签名、不加密）。真需要机密性才用 <b>JWE</b>（加密），但复杂度与误用风险更高；更简单的办法是<b>只放一个不透明的会话 ID</b>。'}
    ]},
    {id:'nc-4-3',num:'4.3',title:'OAuth 2.0 / OIDC 要点',lead:'授权与认证别混，回调与 state 别省。',tags:['核心'],blocks:[
      {t:'p',x:'<b>OAuth 2.0</b> 是<b>授权</b>框架（允许第三方代表用户访问资源），<b>OIDC</b> 在其上加了 <b>ID Token</b> 才用于身份认证。现代推荐流程是 <b>Authorization Code + PKCE</b>：前端拿授权码，后端用码 + <code>code_verifier</code> 换令牌；隐式流程（implicit）已不推荐。'},
      {t:'ul',items:[
        '<b>state</b>：每会话随机、绑定会话、回调时严格校验，防授权码注入与 CSRF',
        '<b>PKCE</b>：<code>code_challenge</code> 由随机 <code>code_verifier</code> 派生，防授权码被截获后冒用',
        '<b>redirect_uri</b>：<b>精确全匹配</b>预注册地址，禁止前缀/通配匹配，防授权码被导向攻击者域名',
        '<b>scope 最小化</b>：只申请必要权限，用户可拒绝；令牌按 scope 限制',
        '<b>校验 ID Token</b>：验签、<code>iss</code>、<code>aud</code>、<code>exp</code>、<code>nonce</code>',
        '<b>令牌存储</b>：Web 后端保管；SPA 优先走 BFF（后端代管）模式，避免把 refresh token 放浏览器'
      ]},
      {t:'note',k:'常见混淆',x:'把 <b>access token 当成「用户已登录」的证明</b>是错的：它只说明「这个客户端被授权访问某资源」。做登录应校验 OIDC 的 ID Token 或自家会话，并明确「谁是当前用户」。'}
    ]}
  ]},

  /* ================= 第 5 章 ================= */
  {id:'nc-5',num:'5',title:'TLS 实战与配置',lead:'把甲篇的握手原理落到可核查的配置上。',sections:[
    {id:'nc-5-1',num:'5.1',title:'版本、套件与证书选择',lead:'少即是多：只留必要的现代配置。',tags:['防御'],blocks:[
      {t:'ul',items:[
        '<b>协议</b>：只启 TLS 1.2 / 1.3；关闭 SSLv3、TLS 1.0/1.1',
        '<b>套件</b>：优先 <code>TLS_AES_128_GCM_SHA256</code>、<code>TLS_CHACHA20_POLY1305_SHA256</code>（1.3 内置）；1.2 用 ECDHE + AEAD',
        '<b>禁用</b>：静态 RSA 密钥交换、CBC、RC4、3DES、NULL/EXPORT、压缩、重协商',
        '<b>证书</b>：ECDSA 或 RSA 2048+，SAN 覆盖全部对外域名，链完整（含中间 CA）',
        '<b>自动化</b>：ACME 自动签发与续期，监控到期时间并设置多层告警',
        '<b>前后一致</b>：CDN、负载均衡、源站三处的配置都要检查，别只改一处'
      ]},
      {t:'code',lang:'Bash',x:'# 自有域名的配置自查（只读）\nopenssl s_client -connect example.com:443 -servername example.com \\\n  -tls1_2 </dev/null 2>/dev/null | grep -E "Protocol|Cipher|Verify return code"\n\n# 检查证书到期\nopenssl s_client -connect example.com:443 -servername example.com </dev/null 2>/dev/null \\\n  | openssl x509 -noout -dates -subject -ext subjectAltName\n\n# 生产建议直接采用 Mozilla SSL Configuration Generator 生成的基线'},
      {t:'note',k:'证书监控',x:'证书过期导致的服务中断非常常见，且完全可预防。把「所有对外证书到期时间」纳入统一监控，提前 30/14/7 天告警，并把续期做成自动化流程而非人工提醒。'}
    ]},
    {id:'nc-5-2',num:'5.2',title:'证书校验、固定与 HSTS',lead:'客户端与浏览器侧的最后几道关。',tags:['防御'],blocks:[
      {t:'ul',items:[
        '<b>全量校验</b>：应用代码里绝不关闭证书验证；私有 CA 用独立信任库而非全局信任',
        '<b>主机名校验</b>：与证书验证同等重要，很多「只关了 verify」的实现其实连主机名都不查',
        '<b>证书固定</b>：移动端可固定公钥（而非整张证书，便于轮换）；必须有备用 pin 与紧急更新通道，否则轮换会引发全量不可用',
        '<b>HSTS</b>：<code>max-age</code> 逐步加大，<code>includeSubDomains</code> 前先确认所有子域都支持 HTTPS；谨慎使用 preload',
        '<b>防混合内容</b>：全站资源走 HTTPS，用 CSP 的 <code>upgrade-insecure-requests</code> 辅助',
        '<b>CAA / CT 监控</b>：限定可签发 CA，订阅 CT 日志发现未申请证书'
      ]},
      {t:'p',x:'移动端与企业代理场景经常出现「为了方便信任所有证书」的实现。这在有中间人的网络里等于把 TLS 的认证完全放弃。若业务确实需要审计代理，应<b>只信任该组织签发的专用 CA</b>，并把它限定在管理策略下，而不是做全局信任或关闭验证。'},
      {t:'note',k:'SSL Stripping',x:'HSTS 之前，攻击者可以把 https 链接改写成 http 并代转发，用户看到的仍是「能访问的页面」。HSTS 让浏览器<b>强制只用 HTTPS</b>，是防降级的关键；但首次访问仍需 preload 列表覆盖。'}
    ]},
    {id:'nc-5-3',num:'5.3',title:'加密流量的可见性与隐私平衡',lead:'既要保护通信，也要能发现异常。',tags:['工程'],blocks:[
      {t:'p',x:'TLS 普及后，传统基于明文内容的检测失效，但<b>元数据仍可用</b>：SNI/证书信息、连接时长、包长与时序、上下行比、DNS 查询、JA3/JA4 指纹、目的 IP 信誉。企业若需在自有managed设备上做内容审计，应走<b>明确告知、制度授权、最小化采集、脱敏留存</b>的代理方案，并排除银行/医疗等敏感类别。'},
      {t:'table',head:['需求','可行手段','注意'],rows:[
        ['发现异常外联','DNS 日志、NetFlow、代理日志、元数据行为分析','不需解密内容即可成立'],
        ['检测数据外传','出站流量基线、DLP、上传量异常','关注体量与目的地，而非内容明文'],
        ['排障与性能','TLS 握手日志、应用层指标','优先在端点采集，避免全量解密'],
        ['合规审计','访问日志、授权记录、密钥使用审计','采集范围与留存期须有制度依据']
      ]},
      {t:'note',k:'别为了可见性牺牲全部隐私',x:'全量解密、长期留存正文、未告知员工，往往既违反隐私法规又制造新的高价值数据集。<b>优先用元数据与端点遥测达成检测目标</b>，解密只作为有明确依据的例外。'}
    ]}
  ]},

  /* ================= 第 6 章 ================= */
  {id:'nc-6',num:'6',title:'典型密码学误用',lead:'事故清单：几乎每一条都在真实事件里重复出现过。',sections:[
    {id:'nc-6-1',num:'6.1',title:'自制算法与固定参数',lead:'「自己写个简单加密」是事故起点。',tags:['误用'],blocks:[
      {t:'table',head:['误用','为什么危险','替代方案'],rows:[
        ['自研加密 / 异或混淆','无安全证明，模式与密钥都可被还原','AES-GCM / ChaCha20-Poly1305'],
        ['固定 IV / 固定盐 / 固定 nonce','相同明文产生相同密文，密钥流复用','每次随机生成并随密文传输'],
        ['ECB 模式','泄露明文块分布（经典「企鹅图」）','AEAD 模式'],
        ['MD5 / SHA-1 用于抗碰撞','已可构造碰撞','SHA-256 / BLAKE3'],
        ['用哈希代替 MAC','攻击者可同时改数据与哈希','HMAC / 数字签名'],
        ['<code>random</code> 生成令牌','可预测','<code>secrets</code> / <code>os.urandom</code>']
      ]},
      {t:'p',x:'一条实用的判断准则：<b>只要代码里出现了自己拼的加密/签名逻辑，就先假设它是错的</b>，改用语言标准库或经过广泛审计的库（libsodium、cryptography、WebCrypto、Bouncy Castle）。密码学实现的正确性无法靠「跑通了」验证——错误的实现照样能加解密成功，只是不安全。'},
      {t:'note',k:'「混淆」不是安全',x:'把密钥拆成几段藏在代码不同文件里、用 Base64 包几层、变量名改得看不懂，都只是提高一点阅读成本，对能读到客户端代码或反编译的攻击者没有实质作用。'}
    ]},
    {id:'nc-6-2',num:'6.2',title:'密钥硬编码与随机数',lead:'最常见的泄露源与最容易被忽略的随机性。',tags:['误用'],blocks:[
      {t:'ul',items:[
        '<b>硬编码密钥</b>：写进源码、配置、Docker 镜像、前端 bundle、移动端包（客户端的一切都是公开的）',
        '<b>环境变量不是保险箱</b>：会被 <code>/proc</code>、崩溃报告、CI 日志、<code>docker inspect</code> 泄露',
        '<b>弱随机数</b>：<code>Math.random()</code>、<code>random.randint</code>、时间戳、自增 ID 做令牌/会话 ID/nonce',
        '<b>盐太短或复用</b>：盐必须每值独立且足够长（16 字节以上）',
        '<b>密钥与数据同库</b>：数据库被拖走时密钥一起被拖走，加密等于没做',
        '<b>无轮换机制</b>：泄露后不知道该换哪里、换完旧数据怎么办'
      ]},
      {t:'code',lang:'Python',x:'import secrets, os\n\n# 正确：所有安全敏感随机都来自 CSPRNG\nsession_id = secrets.token_urlsafe(32)     # 会话 ID\nnonce      = os.urandom(12)                # GCM nonce\nsalt       = os.urandom(16)                # 口令盐\nreset_tok  = secrets.token_urlsafe(24)     # 一次性重置令牌\n\n# 反例（切勿使用）：\n# token = str(int(time.time()))\n# token = random.randint(100000, 999999)   # 6 位验证码可穷举\n# 若必须发数字验证码：至少 6 位 + 短时效 + 限次 + 绑定会话'},
      {t:'note',k:'密钥要在系统之外',x:'密钥的管理系统应与数据存放系统<b>权限隔离</b>：应用只有「使用密钥」的权限，没有「导出密钥」的权限；密钥创建、轮换、吊销由独立流程与审计覆盖。'}
    ]},
    {id:'nc-6-3',num:'6.3',title:'加密不等于完整性，认证不等于授权',lead:'两个概念混淆，会毁掉整套设计。',tags:['误用'],blocks:[
      {t:'p',x:'<b>加密只保证看不懂，不保证没被改</b>。CBC 模式下翻转密文的某一位就能可预测地改动明文对应位（位翻转攻击），若没有 MAC，服务端解密后拿到的是被篡改过却「解密成功」的数据。这就是为什么现代只用 AEAD、或必须「加密后 MAC（Encrypt-then-MAC）」并先验证再解密。'},
      {t:'p',x:'<b>认证（你是谁）也不等于授权（你能做什么）</b>。一个验签通过的 JWT 只说明「令牌是真的」，不代表持有人在<b>此刻</b>仍有权访问这个对象——账号可能已被禁用、权限已被回收、资源可能属于别人。所以对象级判权必须每次在服务端重新做（丙篇 6.1），不能因为「签名没问题」就放行。'},
      {t:'cards',items:[
        ['三条底线','只用标准算法与成熟库；密钥不进代码与客户端；所有安全随机来自 CSPRNG'],
        ['三个必查','验签算法是否固定；过期/受众/签发者是否全验；权限是否每次实时判定'],
        ['一个习惯','把加密、完整性、认证、授权四个词分开写在设计文档里，逐个确认由哪个组件负责'],
        ['与己篇衔接','密钥使用审计、证书到期、异常验签失败都是安全运营要采集的信号']
      ]},
      {t:'ex',k:'课程小结',items:[
        '审查一段签名校验代码，确认算法白名单、<code>kid</code> 来源、四个 claims 校验是否齐全',
        '找出项目里所有 <code>verify=False</code> / 关闭主机名校验 / 信任所有证书的位置并评估影响',
        '写一份密钥清单：用途、存放、知悉范围、轮换周期、泄露处置步骤'
      ]}
    ]}
  ]}
  ]
};
