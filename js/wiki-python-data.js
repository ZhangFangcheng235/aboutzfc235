/* ==========================================================
   Python 系统教程数据
   标准：Python 3.10+（以 3.12 语法为主，标注版本差异）
   章节 1~9，从运行环境到语法、容器、函数、面向对象、
   标准库、进阶特性与工程实践
   ========================================================== */
window.WIKI_PYTHON = {
  id:'python', num:'辛', en:'COURSE VIII · PYTHON',
  title:'Python',
  lead:'一门以可读性为设计核心的通用解释型语言。本教程按 CPython 3.10+ 为主线，从「怎么跑起来」讲到数据模型、容器、流程控制、函数与模块、面向对象、文件与标准库，再到迭代器/装饰器/并发这些进阶机制，最后落到虚拟环境、测试与工程实践。每节都给可直接在 REPL 里验证的代码。',
  chips:['Python 3.12','解释型','共 9 章'],
  chapters:[

  /* ================= 第 1 章 ================= */
  {id:'py-1',num:'1',title:'Python 是什么与运行环境',lead:'先弄清解释型语言、解释器与运行方式，再写第一行代码。',sections:[
    {id:'py-1-1',num:'1.1',title:'语言定位与设计哲学',lead:'可读性优先、动态类型、自带电池。',tags:['绪论'],blocks:[
      {t:'p',x:'<b>Python</b> 由 Guido van Rossum 于 1991 年发布，是一门<b>解释型、动态类型、多范式</b>的通用语言。它不追求把机器性能压到极限，而是把<b>人的阅读与维护成本</b>放在第一位：用缩进代替花括号划分代码块，语法接近可执行的伪代码。'},
      {t:'p',x:'所谓「自带电池（batteries included）」，指标准库覆盖了文件、网络、正则、日期、JSON、并发、测试等绝大多数日常需求，不必先装第三方包就能干活。再加上 PyPI 上庞大的生态，Python 成为脚本自动化、数据分析、Web 后端、机器学习胶水层的首选之一。'},
      {t:'code',lang:'Python',x:'import this   # 在 REPL 里运行，会打印《Python 之禅》\n# 其中几句正是这门语言的设计纲领：\n# Beautiful is better than ugly.\n# Explicit is better than implicit.\n# Simple is better than complex.'},
      {t:'table',head:['维度','Python 的做法','带来的影响'],rows:[
        ['类型系统','动态强类型：变量无类型，值有类型，不做隐式转换','写得快，但类型错误要到运行时才暴露'],
        ['代码块','缩进（4 空格约定）','格式统一，缩进错误直接是语法错误'],
        ['执行方式','源码 → 字节码 .pyc → CPython 虚拟机','跨平台，无需为不同 CPU 重新编译'],
        ['内存','引用计数为主 + 分代 GC 处理循环引用','一般无需手工释放']
      ]},
      {t:'note',k:'强类型不是弱类型',x:'Python 是<b>强类型</b>：<code>"3" + 1</code> 会抛 <code>TypeError</code>，不会像某些语言那样悄悄把字符串转成数字。类型不会自动变，只是检查发生在运行时。'}
    ]},
    {id:'py-1-2',num:'1.2',title:'安装、解释器与 REPL',lead:'认准 python3、pip 与虚拟环境这三条命令。',tags:['环境'],blocks:[
      {t:'p',x:'生产与教学一律使用 <b>Python 3</b>（Python 2 已于 2020 年停止维护）。Linux/macOS 常自带 Python 3，Windows 建议从 python.org 安装并勾选「Add to PATH」。<code>python --version</code> 与 <code>pip --version</code> 用于确认解释器和包管理器配套；若系统里同时有 2 和 3，用 <code>python3</code> / <code>pip3</code> 明确指定。'},
      {t:'code',lang:'Bash',x:'python3 --version        # 例：Python 3.12.4\npython3                 # 进入交互式 REPL，>>> 为提示符\n>>> 1 + 1\n2\n>>> exit()              # 或 Ctrl+D 退出\n\npython3 -m pip --version\npython3 -m pip list     # 查看已安装的包'},
      {t:'p',x:'<code>python -m pip</code> 比直接敲 <code>pip</code> 更可靠：它保证包被装进<b>当前这个解释器</b>对应的环境，避免多版本共存时装错位置。<code>REPL</code> 适合验证碎片想法，<code>IPython</code> / <code>Jupyter</code> 则提供更强的补全与可视化。'},
      {t:'note',k:'别用系统 Python 装包',x:'Linux 的系统 Python 被包管理器（apt/yum）用于系统工具，直接 <code>sudo pip install</code> 可能破坏系统依赖。始终先建虚拟环境（见 7.3）。'}
    ]},
    {id:'py-1-3',num:'1.3',title:'第一个程序与三种运行方式',lead:'脚本文件、模块执行与 -c 单行。',tags:['入门'],blocks:[
      {t:'code',lang:'Python',x:'# hello.py\n"""模块级文档字符串：说明这个文件做什么。"""\n\ndef greet(name: str) -> str:\n    return f"你好，{name}！"\n\nif __name__ == "__main__":\n    print(greet("世界"))'},
      {t:'code',lang:'Bash',x:'python3 hello.py                 # 直接执行脚本\npython3 -c "print(2 ** 10)"      # 执行单行代码\npython3 -m http.server 8000      # 以模块方式运行标准库工具\npython3 -i hello.py              # 执行后停留在 REPL，便于检查变量'},
      {t:'p',x:'<code>if __name__ == "__main__":</code> 是关键惯用法：文件被<b>直接运行</b>时 <code>__name__</code> 为 <code>"__main__"</code>，被 <b>import</b> 时则是模块名。这样同一个文件既能当脚本用，又能被别的模块安全导入而不触发主逻辑。'},
      {t:'ex',k:'动手练一练',items:[
        '在 REPL 里计算 <code>2 ** 100</code>，观察 Python 的大整数是否溢出',
        '把 hello.py 改成接收命令行参数（提示：<code>import sys</code>，读 <code>sys.argv</code>）',
        '用 <code>python3 -m this</code> 再读一遍《Python 之禅》，找出与「缩进即语法」呼应的句子'
      ]}
    ]}
  ]},

  /* ================= 第 2 章 ================= */
  {id:'py-2',num:'2',title:'基础语法与数据模型',lead:'变量是名字绑定，理解这一点就理解了大半 Python。',sections:[
    {id:'py-2-1',num:'2.1',title:'变量、赋值与动态类型',lead:'不是「装值的盒子」，而是贴到对象上的标签。',tags:['核心'],blocks:[
      {t:'p',x:'Python 里<b>变量没有类型，值才有类型</b>。赋值语句做的事是「把一个名字绑定到某个对象」，而不是把值拷进一块声明好类型的内存。因此同一个名字可以随时改绑到不同类型的对象，用 <code>type(x)</code> 看对象类型、<code>id(x)</code> 看对象身份。'},
      {t:'code',lang:'Python',x:'x = 10          # 名字 x 绑定到整数对象 10\nprint(type(x), id(x))   # <class "int">  1407...\nx = "ten"       # 重新绑定到字符串对象，完全合法\nprint(type(x))          # <class "str">\n\na = [1, 2]\nb = a           # b 和 a 绑定的是同一个列表对象\nb.append(3)\nprint(a)        # [1, 2, 3] —— 通过 b 改动，a 也看到'},
      {t:'p',x:'上面最后三行是新手最容易踩的坑：<code>b = a</code> 不复制列表，只增加一条绑定。要真正复制，用 <code>a.copy()</code>、<code>list(a)</code> 或切片 <code>a[:]</code>；嵌套结构要 <code>copy.deepcopy(a)</code>。判断两个名字是否指向同一对象用 <code>is</code>，判断值相等用 <code>==</code>。'},
      {t:'note',k:'== 与 is',x:'<code>is</code> 比较身份（<code>id</code>），<code>==</code> 比较值。小整数与短字符串有缓存驻留，<code>1000 is 1000</code> 在不同上下文可能给出不同结果，<b>永远不要用 is 比较数值或字符串</b>；只用 <code>x is None</code> 这类单例判断。'}
    ]},
    {id:'py-2-2',num:'2.2',title:'数值、布尔与运算',lead:'int 任意精度、float 有误差、bool 是 int 的子类。',tags:['基础'],blocks:[
      {t:'code',lang:'Python',x:'2 ** 100          # 大整数，不会溢出\n0b1010, 0o17, 0xFF   # 二进制/八进制/十六进制字面量\n1_000_000        # 下划线分组，可读性更好\n7 / 2            # 3.5  真除法，结果总是 float\n7 // 2           # 3    向下取整除法\n7 % 2            # 1    取模\ndivmod(7, 2)     # (3, 1)\nround(3.14159, 2)  # 3.14\n\n0.1 + 0.2       # 0.30000000000000004\nfrom decimal import Decimal\nDecimal("0.1") + Decimal("0.2")   # Decimal("0.3")'},
      {t:'p',x:'<code>float</code> 遵循 IEEE 754 双精度，二进制无法精确表示 0.1 这类十进制小数，所以涉及金额、计量时要用 <code>decimal.Decimal</code>（注意用<b>字符串</b>构造，用 float 构造会把误差带进去）或整数分单位。<code>bool</code> 是 <code>int</code> 的子类，<code>True + 1 == 2</code> 成立，但业务代码里别依赖这个。'},
      {t:'p',x:'<b>真值测试</b>：假值包括 <code>None</code>、<code>False</code>、数值零、空容器（<code>""</code>、<code>[]</code>、<code>{}</code>、<code>set()</code>）；其余为真。判断容器是否为空直接写 <code>if items:</code>，不要写 <code>if len(items) &gt; 0:</code>。'},
      {t:'note',k:'链式比较',x:'Python 支持 <code>1 &lt; x &lt; 10</code>，等价于 <code>1 &lt; x and x &lt; 10</code>，但中间表达式只求值一次。写区间判断时用链式更准确也更易读。'}
    ]},
    {id:'py-2-3',num:'2.3',title:'字符串与格式化',lead:'不可变序列、f-string 与常用方法。',tags:['核心'],blocks:[
      {t:'p',x:'<code>str</code> 是 <b>Unicode 码点序列</b>，且<b>不可变</b>：<code>s[0] = "X"</code> 会报错，任何「修改」其实都生成了新对象。因此循环里反复 <code>s += piece</code> 会产生大量临时对象，应改用列表收集后 <code>"".join(parts)</code>。'},
      {t:'code',lang:'Python',x:'name, n = "Python", 3\nf"{name:>10} 第 {n:02d} 版"     # 右对齐宽10、整数补零\nf"{3.14159:.2f}  {255:#x}  {0.25:.0%}"\n# "3.14  0xff  25%"\n\n"  Hello, World  ".strip().lower().split(", ")\n# ["hello", "world"]\n"-".join(["a", "b", "c"])      # "a-b-c"\n"abc".upper(), "AbC".casefold()\n"Python".startswith("Py"), "a.txt".endswith(".txt")\n\nr"C:\\new\\tab"    # 原始字符串，反斜杠不转义'},
      {t:'p',x:'<b>f-string</b>（3.6+）是首选格式化方式：在字面量前加 <code>f</code>，花括号内可直接写表达式，冒号后接格式规格。3.8+ 还支持 <code>f"{x=}"</code> 调试写法，同时打印表达式与值。<code>str.format()</code> 与 <code>%</code> 属于旧式，维护老代码时会遇到。'},
      {t:'note',k:'编码',x:'Python 3 里 <code>str</code> 是文本，<code>bytes</code> 是字节，二者不会隐式互转。<code>"中".encode("utf-8")</code> 得到 <code>b"\\xe4\\xb8\\xad"</code>，反向用 <code>.decode("utf-8")</code>。读写文件与网络时务必显式指定 <code>encoding="utf-8"</code>。'}
    ]}
  ]},

  /* ================= 第 3 章 ================= */
  {id:'py-3',num:'3',title:'容器类型',lead:'list / tuple / dict / set 是日常代码的主干。',sections:[
    {id:'py-3-1',num:'3.1',title:'列表与元组',lead:'可变序列与不可变序列，以及该用哪个。',tags:['容器'],blocks:[
      {t:'code',lang:'Python',x:'xs = [3, 1, 2]\nxs.append(4); xs.extend([5, 6]); xs.insert(0, 0)\nxs.pop()          # 删末尾并返回值\nxs.remove(3)      # 删第一个值为 3 的元素\nxs.sort()         # 原地排序（返回 None！）\nsorted(xs, reverse=True)   # 返回新列表，不改原对象\n\n# 元组：不可变，可哈希（元素都可哈希时）\npoint = (3, 4)\nx, y = point          # 序列解包\na, b = b, a           # 借助元组打包实现交换\n\ndef bounds(seq):\n    return min(seq), max(seq)   # 返回多值本质是返回元组'},
      {t:'p',x:'<code>list</code> 是可变序列，适合需要增删的场景；<code>tuple</code> 不可变，适合表示「一组固定的记录」（坐标、配置项、字典键）。单元素元组要写逗号：<code>(42,)</code>，否则只是括号表达式。<b>命名元组</b> <code>namedtuple</code> 与 <code>NamedTuple</code> 兼顾可读性与轻量。'},
      {t:'note',k:'别在遍历时改列表',x:'<code>for x in xs: xs.remove(x)</code> 会因索引移动而漏删。要么遍历副本 <code>for x in xs[:]</code>，要么用列表推导式重建：<code>xs = [x for x in xs if keep(x)]</code>。'}
    ]},
    {id:'py-3-2',num:'3.2',title:'字典与集合',lead:'哈希表支撑的两类结构，查找平均 O(1)。',tags:['容器'],blocks:[
      {t:'code',lang:'Python',x:'d = {"name": "Ada", "age": 36}\nd["lang"] = "Python"          # 新增/覆盖\nd.get("job", "未知")           # 缺键返回默认值，不抛异常\nd.setdefault("tags", []).append(" pioneer ")   # 缺键则先建空列表\nfor k, v in d.items():        # 同时取键值对\n    print(k, v)\n\n# 字典合并（3.9+）与视图\nmerged = d | {"age": 37}\nd.keys() & {"name", "job"}    # keys 视图支持集合运算\n\ns = {1, 2, 2, 3}             # {1, 2, 3}，自动去重\ns.add(4); s.discard(99)       # discard 缺元素不报错\ns | {3, 5}, s & {2, 3}, s - {1}   # 并 / 交 / 差'},
      {t:'p',x:'字典保持<b>插入顺序</b>（3.7+ 保证），键必须<b>可哈希</b>（不可变且实现了正确的 <code>__hash__</code>/<code>__eq__</code>），所以 <code>list</code> 不能当键，<code>tuple</code> 可以。<code>collections.defaultdict</code> 适合分组计数，<code>Counter</code> 专门做频次统计。'},
      {t:'note',k:'KeyError 的三种写法',x:'已知键存在用 <code>d[k]</code>（出错即暴露 bug）；不确定时用 <code>d.get(k, default)</code>；要「取不到就写入」用 <code>setdefault</code> 或 <code>defaultdict</code>。别用 <code>if k in d: … else: …</code> 反复查两次哈希。'}
    ]},
    {id:'py-3-3',num:'3.3',title:'切片、推导式与解包',lead:'用表达式代替显式循环，代码更短也更快。',tags:['进阶'],blocks:[
      {t:'code',lang:'Python',x:'a = list(range(10))\na[2:5], a[:3], a[::2], a[::-1]   # 切片 [start:stop:step]\na[2:5] = [20, 30, 40]            # 切片赋值可改长度\n\nsquares = [x * x for x in range(10) if x % 2 == 0]\nindex   = {w: len(w) for w in ["a", "bb", "ccc"]}\nflat    = [y for row in matrix for y in row]   # 两层推导，顺序按书写顺序\n\nfirst, *middle, last = a         # 星号解包收集剩余\nfor i, item in enumerate(a, start=1):\n    print(i, item)\nfor k, v in zip(keys, values):   # 并行遍历，长度不齐以短的为准\n    print(k, v)'},
      {t:'p',x:'推导式不仅能构造列表，还能构造<b>集合</b>（<code>{...}</code>）、<b>字典</b>（<code>{k: v ...}</code>）与<b>生成器</b>（把方括号换圆括号，见 8.1）。判断标准是可读性：逻辑超过两层嵌套或带复杂条件时，宁可写普通循环。'},
      {t:'ex',k:'动手练一练',items:[
        '用 <code>Counter</code> 统计一段英文里出现最多的 5 个单词',
        '用字典推导式把 <code>{"a":1,"b":2}</code> 的键值互换，思考值重复时会怎样',
        '不写循环，用切片把 <code>[1,2,3,4,5]</code> 变成 <code>[5,4,3,2,1]</code>'
      ]}
    ]}
  ]},

  /* ================= 第 4 章 ================= */
  {id:'py-4',num:'4',title:'流程控制',lead:'条件、循环、异常三件套。',sections:[
    {id:'py-4-1',num:'4.1',title:'条件与比较',lead:'缩进即代码块，match 处理结构化分支。',tags:['基础'],blocks:[
      {t:'code',lang:'Python',x:'score = 85\nif score >= 90:\n    grade = "A"\nelif score >= 60:\n    grade = "B"\nelse:\n    grade = "C"\n\n# 条件表达式（三元）\nlabel = "及格" if score >= 60 else "不及格"\n\n# 3.10+ 结构化模式匹配\ndef handle(cmd):\n    match cmd:\n        case ["go", x, y] if x > 0:\n            return f"移动到 {x},{y}"\n        case ["quit"] | ["exit"]:\n            return "退出"\n        case _:\n            return "未知命令"'},
      {t:'p',x:'Python 没有 <code>switch</code>，3.10 起用 <code>match/case</code> 做<b>结构模式匹配</b>：它不只是比值，还能解构列表、字典、类实例并绑定变量，配合守卫 <code>if</code> 使用。纯数值或字符串的多分支用字典映射函数往往更简洁。'},
      {t:'note',k:'缩进统一',x:'同一代码块内不要混用 Tab 与空格，官方风格指南 PEP 8 规定 <b>4 个空格</b>。混用会触发 <code>TabError</code>，或更糟——看起来对齐但逻辑错位。'}
    ]},
    {id:'py-4-2',num:'4.2',title:'循环与迭代',lead:'for 面向可迭代对象，while 面向条件。',tags:['基础'],blocks:[
      {t:'code',lang:'Python',x:'for i in range(5):          # 0..4\n    if i == 2:\n        continue            # 跳过本轮\n    if i == 4:\n        break               # 提前结束\n    print(i)\nelse:\n    print("未被 break 中断时执行")   # for/while 的 else 子句\n\nwhile True:\n    line = input("> ")\n    if not line:\n        break\n    print(line.upper())\n\n# 常见工具函数\nsum(range(101)), any([False, True]), all([1, "x"])'},
      {t:'p',x:'<code>for</code> 遍历的是<b>可迭代对象</b>（列表、字符串、字典、文件、生成器……），不是 C 风格的索引循环。需要下标时用 <code>enumerate</code>，需要并行用 <code>zip</code>，需要反向用 <code>reversed</code>，需要排序副本用 <code>sorted</code>。<code>for...else</code> 的 <code>else</code> 在循环<b>正常耗尽</b>时执行，被 <code>break</code> 则不执行，常用于「搜索未命中」的收尾。'},
      {t:'note',k:'别用 range(len(xs))',x:'写 <code>for i in range(len(xs)): print(xs[i])</code> 是典型的「把 C 习惯带进 Python」。直接 <code>for x in xs</code>；确实需要索引就 <code>for i, x in enumerate(xs)</code>。'}
    ]},
    {id:'py-4-3',num:'4.3',title:'异常与上下文管理',lead:'EAFP 风格、finally 与 with。',tags:['核心'],blocks:[
      {t:'code',lang:'Python',x:'try:\n    n = int(user_input)\n    result = 100 / n\nexcept ValueError:\n    result = None               # 只捕获预期内的具体异常\nexcept ZeroDivisionError as e:\n    raise RuntimeError("除数不合法") from e\nelse:\n    print("没有异常时才执行")\nfinally:\n    print("无论是否异常都执行，用于清理")\n\n# with 语句：进入时获取资源，退出时保证释放\nwith open("data.txt", encoding="utf-8") as f:\n    for line in f:              # 文件对象本身可迭代，逐行惰性读取\n        process(line.strip())\n\nraise ValueError(f"非法取值: {value!r}")'},
      {t:'p',x:'Python 鼓励 <b>EAFP</b>（Easier to Ask Forgiveness than Permission）：先试着做，出错再捕获，而不是层层 <code>if</code> 预检。<code>except</code> 必须捕获<b>具体异常类</b>，裸 <code>except:</code> 会连 <code>KeyboardInterrupt</code>、<code>SystemExit</code> 一起吞掉。<code>raise ... from e</code> 保留异常链，便于排查。'},
      {t:'note',k:'with 与上下文管理器',x:'任何实现了 <code>__enter__</code>/<code>__exit__</code> 的对象都能用在 <code>with</code> 里：文件、锁、数据库连接、临时目录。<code>contextlib.contextmanager</code> 装饰器可以把一个生成器函数快速变成上下文管理器。'}
    ]}
  ]},

  /* ================= 第 5 章 ================= */
  {id:'py-5',num:'5',title:'函数、模块与作用域',lead:'从参数到包组织，写可复用代码的骨架。',sections:[
    {id:'py-5-1',num:'5.1',title:'函数定义与参数',lead:'位置参数、默认值、可变参数与关键字限定。',tags:['核心'],blocks:[
      {t:'code',lang:'Python',x:'def connect(host, port=443, *, timeout=3, retry=2):\n    """建立连接（文档字符串，help() 可查看）。"""\n    return f"{host}:{port} t={timeout} r={retry}"\n\nconnect("example.com")                     # 用默认 port\nconnect("example.com", 8080, timeout=5)    # 关键字参数\nconnect("h", 80, 5)                        # 报错：* 之后只能关键字传参\n\ndef total(*args, **kwargs):                # 收集任意位置/关键字参数\n    return sum(args), kwargs\ntotal(1, 2, 3, tag="demo")                 # (6, {"tag": "demo"})\n\ndef area(w, h): return w * h               # 简单函数可写单行\nprint(connect.__doc__)'},
      {t:'note',k:'可变默认值陷阱',x:'<b>绝对不要</b>写 <code>def add(x, bag=[]):</code>。默认值在函数定义时只求值一次，所有调用共享同一个列表。正确写法：<code>def add(x, bag=None): bag = [] if bag is None else bag</code>。'}
    ]},
    {id:'py-5-2',num:'5.2',title:'作用域、闭包与 lambda',lead:'LEGB 规则与 late binding。',tags:['进阶'],blocks:[
      {t:'p',x:'名字查找遵循 <b>LEGB</b>：<b>L</b>ocal（本函数）→ <b>E</b>nclosing（外层闭包）→ <b>G</b>lobal（模块）→ <b>B</b>uilt-in（内建）。在函数中给名字赋值会让它被判定为局部变量；确实要改模块级变量需 <code>global</code>，要改外层闭包变量需 <code>nonlocal</code>。'},
      {t:'code',lang:'Python',x:'def make_counter():\n    n = 0\n    def inc():\n        nonlocal n          # 声明修改闭包变量\n        n += 1\n        return n\n    return inc              # 返回函数对象，n 被「带」着走\nc = make_counter(); print(c(), c())   # 1 2\n\nsquare = lambda x: x * x    # 匿名函数，只适合简单表达式\nsorted(words, key=lambda w: (len(w), w.lower()))\n\n# 闭包的晚绑定坑\nfs = [lambda: i for i in range(3)]\nprint([f() for f in fs])    # [2, 2, 2]，不是 [0,1,2]\nfs = [lambda i=i: i for i in range(3)]   # 用默认参数固化当期值\nprint([f() for f in fs])    # [0, 1, 2]'},
      {t:'p',x:'<code>lambda</code> 只能包含表达式，不能写语句；需要复用、需要文档字符串、逻辑稍复杂时一律用 <code>def</code>。<code>functools</code> 里的 <code>partial</code>、<code>lru_cache</code>、<code>reduce</code> 是函数式编程的常用补充。'}
    ]},
    {id:'py-5-3',num:'5.3',title:'模块、包与导入',lead:'把代码拆成文件，并弄清 import 到底做了什么。',tags:['工程'],blocks:[
      {t:'code',lang:'Python',x:'# 项目结构\n# pkg/\n#   __init__.py      把这个目录标记为包（3.3+ 命名空间包可省略）\n#   core.py\n#   utils.py\nimport math                       # 导入模块\nfrom collections import Counter, defaultdict\nfrom pkg import core as c         # 别名，避免重名\nc.run()\n\n# core.py 里控制对外暴露\n__all__ = ["run", "VERSION"]\n\nimport importlib; importlib.reload(core)   # 开发时重载模块\nprint(__name__)                    # 直接运行时为 "__main__"'},
      {t:'p',x:'<code>import</code> 首次执行时会<b>执行模块顶层代码</b>并把结果缓存进 <code>sys.modules</code>，后续导入直接复用。因此模块顶层应只放定义与常量，把副作用放进 <code>if __name__ == "__main__"</code>。相对导入 <code>from . import utils</code> 只在包内部有效，直接运行该文件时不能用。'},
      {t:'note',k:'别用 from x import *',x:'星号导入会污染命名空间、让静态分析失效，读者也看不出名字从哪来。显式列出需要的名字；<code>__all__</code> 用于约定「哪些算公开 API」。'}
    ]}
  ]},

  /* ================= 第 6 章 ================= */
  {id:'py-6',num:'6',title:'面向对象',lead:'类、继承、魔术方法与数据类。',sections:[
    {id:'py-6-1',num:'6.1',title:'类与实例',lead:'self、__init__、实例属性与类属性。',tags:['OOP'],blocks:[
      {t:'code',lang:'Python',x:'class Point:\n    kind = "2D"                 # 类属性：所有实例共享\n\n    def __init__(self, x, y):\n        self.x, self.y = x, y   # 实例属性\n\n    def dist(self, other):\n        return ((self.x-other.x)**2 + (self.y-other.y)**2) ** 0.5\n\n    @classmethod\n    def origin(cls):            # 收 cls，可返回 cls(...) 支持子类\n        return cls(0, 0)\n\n    @staticmethod\n    def help():                 # 不收 self/cls，只是命名空间里的普通函数\n        return "Point(x, y)"\n\n    def __repr__(self):         # 供 print / 调试\n        return f"Point({self.x}, {self.y})"\n\np = Point(3, 4)\nprint(p, p.dist(Point.origin()), Point.kind)'},
      {t:'p',x:'方法第一个参数约定叫 <code>self</code>，由解释器自动传入实例。<code>__init__</code> 是初始化而非构造（对象已由 <code>__new__</code> 创建）。Python 没有真正的私有成员，<code>_name</code> 是约定「内部使用」，<code>__name</code> 会触发名称改写（name mangling）以避免子类意外覆盖。'},
      {t:'note',k:'类属性踩坑',x:'把可变对象（列表、字典）当类属性，所有实例会共享它。需要每实例独立就在 <code>__init__</code> 里创建，或用 6.3 的 <code>dataclass</code> 配 <code>field(default_factory=list)</code>。'}
    ]},
    {id:'py-6-2',num:'6.2',title:'继承、多态与魔术方法',lead:'鸭子类型、super 与运算符重载。',tags:['OOP'],blocks:[
      {t:'code',lang:'Python',x:'class Vec:\n    def __init__(self, *xs): self.xs = list(xs)\n    def __len__(self): return len(self.xs)\n    def __iter__(self): return iter(self.xs)\n    def __add__(self, o): return Vec(*[a+b for a,b in zip(self, o)])\n    def __eq__(self, o): return self.xs == o.xs\n    def __repr__(self): return f"Vec({self.xs})"\n\nclass NamedVec(Vec):\n    def __init__(self, name, *xs):\n        super().__init__(*xs)     # 调用父类初始化，多重继承时按 MRO\n        self.name = name\n\nprint(Vec(1,2) + Vec(3,4))     # Vec([4, 6])\nprint(len(Vec(1,2,3)), NamedVec.__mro__)'},
      {t:'p',x:'Python 多态靠<b>鸭子类型</b>：只要对象实现了所需方法就能用，不必继承某个基类。需要显式约束时用 <code>abc.ABC</code> 定义抽象基类，或用 <code>typing.Protocol</code> 做结构化类型检查（静态检查器识别，运行时不强制）。多重继承的方法解析顺序由 <b>C3 线性化</b> 决定，可用 <code>Class.__mro__</code> 查看。'},
      {t:'table',head:['魔术方法','触发时机','常见用途'],rows:[
        ['<code>__str__</code> / <code>__repr__</code>','<code>str()</code> / <code>repr()</code>、print','面向用户 / 面向开发者的字符串'],
        ['<code>__len__</code> / <code>__bool__</code>','<code>len()</code> / 真值测试','让自定义容器支持长度与布尔判断'],
        ['<code>__getitem__</code>','<code>obj[k]</code>、切片、迭代','实现序列/映射协议'],
        ['<code>__enter__</code> / <code>__exit__</code>','<code>with</code> 进入与退出','资源管理'],
        ['<code>__call__</code>','<code>obj()</code>','让实例像函数一样可调用']
      ]}
    ]},
    {id:'py-6-3',num:'6.3',title:'数据类、枚举与类型标注',lead:'少写样板代码，让 IDE 与检查器帮忙。',tags:['工程'],blocks:[
      {t:'code',lang:'Python',x:'from dataclasses import dataclass, field\nfrom enum import Enum, auto\nfrom typing import Optional\n\nclass State(Enum):\n    DRAFT = auto(); PUBLISHED = auto()\n\n@dataclass(frozen=True)          # 自动生成 __init__/__repr__/__eq__，且不可变\nclass Article:\n    title: str\n    state: State = State.DRAFT\n    tags: list[str] = field(default_factory=list)\n    author: Optional[str] = None\n\na = Article("Python 入门")\nprint(a)                      # Article(title="Python 入门", ...)\n\ndef greet(name: str, times: int = 1) -> list[str]:\n    return [f"Hi {name}"] * times\n\n# 3.10+ 联合类型写法\ndef parse(x: int | str) -> dict[str, int]:\n    return {"v": int(x)}'},
      {t:'p',x:'<b>类型标注（type hints）</b> 不参与运行时，解释器不检查；价值在于 IDE 补全、文档化和 <code>mypy</code> / <code>pyright</code> 静态检查。3.9+ 可直接用内建泛型 <code>list[str]</code>、<code>dict[str, int]</code>，3.10+ 用 <code>X | Y</code> 表示联合类型。<code>typing</code> 还提供 <code>Any</code>、<code>Callable</code>、<code>Protocol</code>、<code>TypeVar</code>。'},
      {t:'ex',k:'动手练一练',items:[
        '用 <code>@dataclass</code> 定义一个 <code>Student</code>，包含姓名、成绩列表与求平均分的方法',
        '给 <code>Vec</code> 补上 <code>__sub__</code> 与 <code>__mul__</code>（数乘），并写 3 条断言测试',
        '用 <code>mypy</code> 检查一段带类型标注的代码，故意传错类型看报错信息'
      ]}
    ]}
  ]},

  /* ================= 第 7 章 ================= */
  {id:'py-7',num:'7',title:'文件、标准库与依赖',lead:'把程序接上真实世界的数据与包。',sections:[
    {id:'py-7-1',num:'7.1',title:'文件与路径',lead:'pathlib 优于字符串拼路径，编码必须显式。',tags:['IO'],blocks:[
      {t:'code',lang:'Python',x:'from pathlib import Path\n\np = Path("data") / "2026" / "log.txt"    # 跨平台路径拼接\np.parent.mkdir(parents=True, exist_ok=True)\np.write_text("第一行\\n第二行\\n", encoding="utf-8")\ntext = p.read_text(encoding="utf-8")\nfor line in p.open(encoding="utf-8"):    # 惰性逐行，适合大文件\n    print(line.rstrip())\n\nprint(p.name, p.stem, p.suffix, p.exists(), p.stat().st_size)\nfor f in Path(".").glob("**/*.py"):      # 递归匹配\n    print(f)'},
      {t:'p',x:'<code>open()</code> 的模式：<code>r</code> 读、<code>w</code> 覆盖写、<code>a</code> 追加、<code>x</code> 独占创建、<code>b</code> 二进制、<code>+</code> 读写。文本模式务必传 <code>encoding="utf-8"</code>，否则依赖平台默认编码，在 Windows 上读中文极易乱码。<b>始终用 with</b> 保证句柄释放。'},
      {t:'note',k:'大文件别 read() 整份',x:'<code>read_text()</code> 会一次性载入内存。处理 GB 级日志应逐行迭代文件对象，或用 <code>mmap</code>、分块读取；写入用 <code>writelines</code> 配生成器，避免先攒一个巨大列表。'}
    ]},
    {id:'py-7-2',num:'7.2',title:'常用标准库速查',lead:'JSON / CSV / 正则 / 日期 / 日志。',tags:['标准库'],blocks:[
      {t:'code',lang:'Python',x:'import json, csv, re, datetime, logging, argparse\n\nobj = {"name": "Ada", "ok": True}\nblob = json.dumps(obj, ensure_ascii=False, indent=2)\njson.loads(blob)\n\nwith open("r.csv", newline="", encoding="utf-8") as f:\n    for row in csv.DictReader(f):        # 按表头读成字典\n        print(row["name"])\n\nre.findall(r"\\d{4}-\\d{2}-\\d{2}", "日期 2026-11-13")\nre.sub(r"\\s+", " ", "a   b")\nre.compile(r"(?P<y>\\d{4})-\\d{2}").match("2026-11").group("y")\n\ndatetime.date.today().isoformat()\ndatetime.datetime.now(datetime.timezone.utc).isoformat()\n(datetime.date(2026,1,1) + datetime.timedelta(days=30))\n\nlogging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")\nlogging.info("任务完成 %s", obj)'},
      {t:'p',x:'另外几个高频模块：<code>os</code>/<code>sys</code>（环境与解释器）、<code>subprocess</code>（调用外部进程，优先 <code>run(..., check=True)</code>，别用 <code>shell=True</code> 拼不可信输入）、<code>itertools</code>/<code>functools</code>/<code>collections</code>（迭代与函数工具）、<code>urllib</code>/<code>http.client</code>（HTTP，复杂场景用第三方 <code>requests</code>/<code>httpx</code>）、<code>sqlite3</code>（零配置关系库）、<code>unittest</code>（测试）、<code>tempfile</code>（临时文件）。'},
      {t:'note',k:'正则要编译与转义',x:'循环里重复用同一模式应先 <code>re.compile</code>；把用户输入拼进正则前必须 <code>re.escape(user_input)</code>，否则既有误匹配也有灾难性回溯（ReDoS）风险。匹配 HTML 请用解析器而不是正则。'}
    ]},
    {id:'py-7-3',num:'7.3',title:'虚拟环境、pip 与项目结构',lead:'每个项目一套依赖，可复现是底线。',tags:['工程'],blocks:[
      {t:'code',lang:'Bash',x:'python3 -m venv .venv            # 创建虚拟环境\nsource .venv/bin/activate        # Linux/macOS 激活\n# Windows: .venv\\Scripts\\activate\npython -m pip install requests==2.32.3\npython -m pip freeze > requirements.txt\npython -m pip install -r requirements.txt\ndeactivate\n\n# 现代方案：pyproject.toml + 工具链\nuv init myproj && uv add httpx pytest\nuv run pytest'},
      {t:'code',lang:'Text',x:'# 典型项目布局\nmyproj/\n  pyproject.toml        # 元数据、依赖、构建与工具配置（PEP 621）\n  README.md\n  src/myproj/           # src 布局，避免误导入本地源码\n    __init__.py\n    core.py\n  tests/\n    test_core.py'},
      {t:'p',x:'<code>requirements.txt</code> 适合锁定一套已验证版本；新项目推荐 <code>pyproject.toml</code> 声明依赖与工具配置（black、ruff、pytest、mypy 都能在这里配），配合 <code>uv</code> 或 <code>pip-tools</code> 生成锁文件。把 <code>.venv/</code>、<code>__pycache__/</code>、<code>.env</code> 写进 <code>.gitignore</code>；密钥走环境变量，绝不提交。'},
      {t:'note',k:'依赖安全',x:'安装前核对包名，谨防 <b>typosquatting</b>（如 <code>reqeusts</code>）。用 <code>pip-audit</code> / <code>uv audit</code> 扫描已知漏洞，锁定版本并定期更新，这与后面「网络攻防技术篇」讲的供应链安全直接相关。'}
    ]}
  ]},

  /* ================= 第 8 章 ================= */
  {id:'py-8',num:'8',title:'进阶特性',lead:'迭代器、装饰器与并发模型。',sections:[
    {id:'py-8-1',num:'8.1',title:'迭代器与生成器',lead:'惰性求值让内存占用与数据量脱钩。',tags:['进阶'],blocks:[
      {t:'p',x:'<b>可迭代对象</b>实现 <code>__iter__()</code> 返回迭代器，<b>迭代器</b>实现 <code>__next__()</code> 并在耗尽时抛 <code>StopIteration</code>。<code>for</code> 循环就是不断调用 <code>next()</code> 的糖。含 <code>yield</code> 的函数是<b>生成器函数</b>，调用它返回一个生成器，每次 <code>next()</code> 执行到下一个 <code>yield</code> 并暂停，局部变量状态被保留。'},
      {t:'code',lang:'Python',x:'def fib(n):\n    a, b = 0, 1\n    for _ in range(n):\n        yield a               # 暂停并交出值\n        a, b = b, a + b\n\nlist(fib(8))                  # [0,1,1,2,3,5,8,13]\n\n# 生成器表达式：不构造中间列表\nsum(x*x for x in range(1_000_000))\n\nimport itertools\nfor k, grp in itertools.groupby("aaabbc"):\n    print(k, list(grp))\nitertools.chain.from_iterable(rows)\nitertools.islice(fib(10**9), 5)   # 无限序列也能安全取前 5 个'},
      {t:'note',k:'生成器只能消费一次',x:'生成器不是容器，遍历完就耗尽，也没有 <code>len()</code>。需要重复使用就 <code>list(gen)</code> 固化，或重新调用生成器函数。函数里只要出现 <code>yield</code>，整个函数体都变成惰性执行——连第一行也要等第一次 <code>next()</code> 才跑。'}
    ]},
    {id:'py-8-2',num:'8.2',title:'装饰器',lead:'不改动原函数，横切地加上日志、缓存、鉴权。',tags:['进阶'],blocks:[
      {t:'code',lang:'Python',x:'import functools, time\n\ndef timed(fn):\n    @functools.wraps(fn)       # 保留 __name__/__doc__ 等元信息\n    def wrapper(*args, **kwargs):\n        t0 = time.perf_counter()\n        try:\n            return fn(*args, **kwargs)\n        finally:\n            print(f"{fn.__name__} 耗时 {time.perf_counter()-t0:.3f}s")\n    return wrapper\n\n@timed\ndef work(n):\n    """模拟耗时任务"""\n    time.sleep(n)\n\n@functools.lru_cache(maxsize=None)   # 标准库缓存装饰器\ndef comb(n, k):\n    return 1 if k in (0, n) else comb(n-1, k-1) + comb(n-1, k)\n\nprint(work.__name__, work.__doc__)   # 若漏掉 wraps 会变成 wrapper / None'},
      {t:'p',x:'装饰器本质就是「接收函数、返回函数」的高阶函数：<code>@timed</code> 等价于 <code>work = timed(work)</code>。带参数的装饰器再多包一层工厂函数；类也可以用 <code>functools.total_ordering</code>、<code>dataclasses.dataclass</code> 这类装饰器修饰。<code>singledispatch</code> 可按参数类型分派实现。'},
      {t:'note',k:'务必用 functools.wraps',x:'漏掉它会导致被装饰函数的 <code>__name__</code>、<code>__doc__</code>、签名和注解丢失，进而影响日志、文档生成、依赖注入与测试框架。这是最常见的装饰器 bug。'}
    ]},
    {id:'py-8-3',num:'8.3',title:'并发：线程、进程与 asyncio',lead:'按 I/O 密集还是 CPU 密集选模型。',tags:['进阶'],blocks:[
      {t:'table',head:['模型','适用','关键点'],rows:[
        ['<code>threading</code>','I/O 密集（网络、磁盘）','GIL 使同一时刻只有一个线程执行字节码，但 I/O 等待时会释放'],
        ['<code>concurrent.futures.ThreadPoolExecutor</code>','批量 I/O 任务','线程池 + <code>map</code>/<code>submit</code>，接口统一'],
        ['<code>multiprocessing</code> / <code>ProcessPoolExecutor</code>','CPU 密集','多进程绕开 GIL，代价是序列化与进程开销'],
        ['<code>asyncio</code>','高并发 I/O（万级连接）','单线程事件循环，<code>async/await</code>，必须用异步版库']
      ]},
      {t:'code',lang:'Python',x:'from concurrent.futures import ThreadPoolExecutor\nimport asyncio, httpx\n\nurls = ["https://example.com"] * 10\nwith ThreadPoolExecutor(max_workers=8) as pool:\n    results = list(pool.map(lambda u: httpx.get(u).status_code, urls))\n\nasync def fetch(client, url):\n    r = await client.get(url)      # await 处让出事件循环\n    return r.status_code\n\nasync def main():\n    async with httpx.AsyncClient() as client:\n        return await asyncio.gather(*(fetch(client, u) for u in urls))\n\nasyncio.run(main())'},
      {t:'p',x:'<b>GIL</b>（全局解释器锁）是 CPython 的实现特性：它保护对象引用计数，让单线程代码简单、C 扩展易写，但使纯 Python 的多线程无法并行利用多核。所以 <b>CPU 密集用多进程，I/O 密集用线程或 asyncio</b>。注意异步函数里若混入同步阻塞调用（如 <code>time.sleep</code>、同步数据库驱动），会把整个事件循环卡住。'},
      {t:'note',k:'别混用阻塞与异步',x:'在 <code>async def</code> 里要等就 <code>await asyncio.sleep()</code>；必须调用同步阻塞库时用 <code>asyncio.to_thread(fn, ...)</code> 丢到线程池，避免拖垮并发。'}
    ]}
  ]},

  /* ================= 第 9 章 ================= */
  {id:'py-9',num:'9',title:'工程实践',lead:'让代码能被别人（和半年后的自己）维护。',sections:[
    {id:'py-9-1',num:'9.1',title:'代码风格与测试',lead:'PEP 8、格式化、静态检查与 pytest。',tags:['工程'],blocks:[
      {t:'code',lang:'Python',x:'# test_core.py\nimport pytest\n\ndef add(a, b): return a + b\n\n@pytest.mark.parametrize("a,b,expect", [\n    (1, 2, 3), (0, 0, 0), (-1, 1, 0),\n])\ndef test_add(a, b, expect):\n    assert add(a, b) == expect\n\ndef test_raises():\n    with pytest.raises(TypeError):\n        add("1", 2)'},
      {t:'code',lang:'Bash',x:'ruff check .          # 极快的 lint（替代 flake8/isort 大部分规则）\nruff format .         # 统一格式（与 black 兼容）\nmypy src/             # 静态类型检查\npytest -q             # 跑测试\npytest --cov=myproj   # 覆盖率'},
      {t:'ul',items:[
        '<b>PEP 8</b>：4 空格缩进、行宽 88/79、模块级定义之间空两行、导入按标准库/第三方/本地分组',
        '<b>命名</b>：<code>snake_case</code> 函数与变量、<code>CapWords</code> 类、<code>UPPER_CASE</code> 常量、<code>_leading</code> 表内部',
        '<b>可读性</b>：优先显式而非炫技；一个函数只做一件事；公共函数写文档字符串说明参数、返回与异常',
        '<b>测试</b>：边界值、异常路径、参数化用例；用 <code>tmp_path</code>、<code>monkeypatch</code> 隔离文件系统与网络'
      ]},
      {t:'note',k:'断言与异常',x:'<code>assert</code> 会被 <code>python -O</code> 优化掉，只能用于调试与测试；对外部输入做校验要显式 <code>raise ValueError</code>，不能依赖 assert。'}
    ]},
    {id:'py-9-2',num:'9.2',title:'调试与性能',lead:'先测量再优化，别靠猜。',tags:['工程'],blocks:[
      {t:'code',lang:'Bash',x:'python -m pdb script.py       # 断点调试：b / n / s / p / c\npython -X dev script.py       # 开启开发模式，暴露更多警告\npython -m cProfile -s cumtime script.py    # 函数级性能剖析\npython -m timeit "sum(range(1000))"       # 微基准'},
      {t:'code',lang:'Python',x:'import time, tracemalloc\nfrom functools import lru_cache\n\nt0 = time.perf_counter()\n# ... 待测代码 ...\nprint(f"耗时 {(time.perf_counter()-t0)*1000:.1f} ms")\n\ntracemalloc.start()\n# ... 待测代码 ...\nprint(tracemalloc.get_traced_memory())   # (当前, 峰值) 字节'},
      {t:'ul',items:[
        '<b>选对数据结构</b>：频繁成员判断用 <code>set</code>/<code>dict</code>（O(1)）而非 <code>list</code>（O(n)），往往比任何微优化都有效',
        '<b>避免循环内重复计算</b>：把不变量提到循环外，字符串拼接用 <code>join</code>',
        '<b>用内建与库</b>：<code>sum</code>、<code>sorted</code>、NumPy 向量化都是 C 实现，远快于手写 Python 循环',
        '<b>缓存</b>：<code>lru_cache</code> 适合纯函数；注意带副作用或参数不可哈希时不适用'
      ]}
    ]},
    {id:'py-9-3',num:'9.3',title:'应用方向与学习路径',lead:'Python 常见落地场景与下一步。',tags:['总结'],blocks:[
      {t:'cards',items:[
        ['自动化与运维','脚本、批处理、文件整理、系统巡检；<code>pathlib</code> + <code>subprocess</code> + <code>argparse</code>'],
        ['Web 后端','FastAPI / Django / Flask；配合 SQLAlchemy、Pydantic、异步数据库驱动'],
        ['数据分析与科学计算','NumPy / pandas / Matplotlib / Polars；Jupyter 做探索'],
        ['网络与安全','爬虫、协议分析、日志处理、安全工具原型；正是下一卷要用到的能力'],
        ['打包与发布','<code>pyproject.toml</code> + <code>python -m build</code> + <code>twine</code> 发到 PyPI']
      ]},
      {t:'p',x:'建议的进阶顺序：先把本教程 1~7 章的语法与标准库用熟，能独立写出带命令行参数、读写文件、有异常处理和测试的小工具；再按方向补 8 章的并发与装饰器，最后读 9 章的工程化。读源码（标准库里 <code>collections</code>、<code>contextlib</code>、<code>dataclasses</code> 都很短且写得极好）比多刷一遍语法更有效。'},
      {t:'note',k:'与安全的关系',x:'写 Python 时最常引入的安全问题：把不可信输入拼进 <code>eval</code>/<code>exec</code>、<code>subprocess(shell=True)</code>、SQL 语句或 <code>pickle.loads</code>；用 <code>yaml.load</code> 而非 <code>safe_load</code>；依赖未锁定版本。这些在「网络攻防技术篇」的 Web 与供应链章节会逐一展开。'}
    ]}
  ]}
  ]
};
