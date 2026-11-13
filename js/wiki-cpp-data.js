/* ==========================================================
   C++ 系统教程数据
   标准：ISO/IEC 14882（C++20 主线，兼顾 11/14/17/23）
   章节 1~9，从 C 基础过渡到现代 C++，按 章.节 编号
   ========================================================== */
window.WIKI_CPP = {
  id:'cpp', num:'丙', en:'COURSE III · C++',
  title:'C++',
  lead:'一门在 C 之上叠加面向对象与泛型能力的系统级语言。本教程从「与 C 的差异」讲起，覆盖类与对象、运算符重载、继承多态、模板与 STL，最后落到 C++11/14/17/20 的现代写法。每节都给出可编译示例，编号 1.1 至 9.x。',
  chips:['C++20','面向过程+面向对象+泛型','共 9 章'],
  chapters:[

  /* ================= 第 1 章 ================= */
  {id:'cpp-1',num:'1',title:'C++ 概览与历史',lead:'C++ 从「带类的 C」走到今天的多范式语言。',sections:[
    {id:'cpp-1-1',num:'1.1',title:'C++ 是什么',lead:'在 C 的贴近硬件之上，叠加封装、继承、多态与模板。',tags:['绪论'],blocks:[
      {t:'p',x:'<b>C++ 诞生于 1980 年代初，由 Bjarne Stroustrup 在贝尔实验室设计。</b>最初叫「C with Classes」，目标是给 C 加上类（class），同时保留 C 的全部性能与可控性。1985 年正式命名为 C++——「++」取自 C 的自增运算符，寓意「C 的下一步」。'},
      {t:'p',x:'C++ 不是「C 的纯超集」，但绝大多数 C 代码能在 C++ 里编译。二者的关键差异：C++ 有更严格的类型检查（如 <code>void*</code> 不能隐式转其它指针）、要求函数先声明后使用、<code>const</code> 语义更强、新增了引用、重载、命名空间、类、模板、异常、STL 等大量机制。'},
      {t:'table',head:['维度','C','C++'],rows:[
        ['编程范式','过程式','过程式 + 面向对象 + 泛型 + 函数式'],
        ['内存管理','malloc/free','new/delete + 智能指针 + RAII'],
        ['抽象手段','结构体 + 函数','类、模板、运算符重载、继承多态'],
        ['标准库','较小（C 标准库）','极大（STL：容器/算法/迭代器/字符串/IO）'],
        ['类型安全','较弱','显著增强（强类型枚举、引用、auto）']
      ]},
      {t:'note',k:'学 C++ 的心态',x:'不要把 C++ 当成「C 加一堆语法糖」。它的核心设计哲学是「零开销抽象」——你用上的抽象（类、模板、智能指针）不比手写 C 更慢，用不上的抽象你不必付出代价。'}
    ]},
    {id:'cpp-1-2',num:'1.2',title:'标准演进：C++98 到 C++23',lead:'现代 C++ 的「现代」主要指 2011 年之后的版本。',tags:['标准'],blocks:[
      {t:'table',head:['标准','年份','关键内容'],rows:[
        ['C++98','1998','第一个 ISO 标准，STL 入标准，模板初具规模'],
        ['C++03','2003','缺陷修订'],
        ['<b>C++11</b>','<b>2011</b>','现代 C++ 起点：<code>auto</code>、lambda、<code>nullptr</code>、<code>shared_ptr</code>、<code>move</code>、<code>range-for</code>、<code>thread</code>、<code>constexpr</code>'],
        ['C++14','2014','泛型 lambda、<code>auto</code> 返回值推导、<code>std::make_unique</code>'],
        ['C++17','2017','结构化绑定、<code>if constexpr</code>、<code>std::optional/filesystem/string_view</code>、折叠表达式'],
        ['C++20','2020','<code>concepts</code>、<code>ranges</code>、<code>modules</code>、协程、<code>std::format</code>、三路比较 <code><=></code>'],
        ['C++23','2023','<code>std::print</code>、<code>import std</code> 模块、<code>std::expected</code>']
      ]},
      {t:'note',k:'选哪个标准写',x:'教程示例默认面向 <b>C++20</b>，因为它把 concepts/ranges/format 等实用特性稳定下来。编译命令用 <code>g++ -std=c++20 -O2</code>。旧项目常停留在 C++11/14，迁移时留意 <code>auto</code> 与 lambda 的可用性。'}
    ]},
    {id:'cpp-1-3',num:'1.3',title:'第一个 C++ 程序与编译',lead:'名字空间、<iostream>、<code>using namespace</code> 初见。',tags:['入门'],blocks:[
      {t:'code',lang:'C++20 · hello.cpp',x:'#include <iostream>\n\nint main() {\n    std::cout << "Hello, C++20!" << std::endl;\n    return 0;\n}'},
      {t:'ul',items:[
        '<code>#include &lt;iostream&gt;</code>：标准输入输出流头文件，提供 <code>std::cout</code>',
        '<code>std::cout</code>：标准输出流对象，<code>&lt;&lt;</code> 是「流插入」运算符，把右侧内容推入流',
        '<code>std::endl</code>：输出换行并刷新缓冲区；日常也可用 <code>"\\n"</code> 减少刷新开销',
        '<code>std</code> 是标准库所在的<b>命名空间</b>，用 <code>std::</code> 前缀避免名字冲突'
      ]},
      {t:'code',lang:'Bash',x:'g++ -std=c++20 -O2 hello.cpp -o hello\n./hello\n# Hello, C++20!'},
      {t:'note',k:'要不要写 using namespace std',x:'头文件中<b>绝对不要</b>写 <code>using namespace std;</code>，它会把整个标准库名字拉进全局，极易污染与冲突。仅在 .cpp 文件、且作用域受限（函数内）时谨慎使用。'}
    ]}
  ]},

  /* ================= 第 2 章 ================= */
  {id:'cpp-2',num:'2',title:'基础语法：C 之上多了什么',lead:'类型增强、引用、auto、范围 for、默认参数与函数重载。',sections:[
    {id:'cpp-2-1',num:'2.1',title:'bool、string 与强类型',lead:'C++ 把 C 的零一整数升级为真正的布尔与字符串类型。',tags:['类型'],blocks:[
      {t:'p',x:'C++ 原生提供 <code>bool</code> 类型与字面量 <code>true</code>/<code>false</code>（C 里只是宏）。它可与整数互转，但语义清晰：判断分支应返回 <code>bool</code> 而非 <code>int</code>。'},
      {t:'p',x:'<code>std::string</code> 取代了 C 里危险的 <code>char*</code> 手工管理：自动管理内存、可拼接比较、带 <code>.size()</code>/<code>.find()</code>/<code>.substr()</code> 等方法。注意 <code>string</code> 与 C 风格字符串互转用 <code>.c_str()</code>。'},
      {t:'code',lang:'C++',x:'#include <string>\nstd::string s = "hi";\nif (s == "hi") s += " there";   // 拼接\nconst char* c = s.c_str();      // 转 C 字符串'},
      {t:'note',k:'enum class',x:'C++11 的<b>强类型枚举</b> <code>enum class Color { Red, Green };</code> 不会隐式转 int、作用域隔离、可指定底层类型，彻底解决 C 枚举的名字污染与弱类型问题。'}
    ]},
    {id:'cpp-2-2',num:'2.2',title:'引用：变量的别名',lead:'引用不是指针，是已存在对象的另一个名字，必须初始化且不可改绑。',tags:['核心'],blocks:[
      {t:'p',x:'<b>引用（reference）</b>是某个对象的别名：<code>int& r = x;</code> 之后 <code>r</code> 与 <code>x</code> 是同一块内存的两个名字，改 <code>r</code> 即改 <code>x</code>。引用必须在声明时绑定，且终身不能改绑到别的变量——这与指针（可重指、可为空）本质不同。'},
      {t:'code',lang:'C++',x:'int x = 10;\nint& r = x;      // r 是 x 的别名\nr = 20;          // x 现在也是 20\n// int& bad;      // 错误：引用必须初始化'},
      {t:'p',x:'引用最常见的用途是<b>函数参数与返回值</b>：既能像指针那样避免拷贝大对象，又像值传递那样语法干净，还能用来实现「输出参数」和运算符重载。'},
      {t:'note',k:'传值 vs 传引用',x:'小对象（int、指针）传值更快；大对象（容器、结构体）优先 <code>const T&</code> 传参避免拷贝；需要修改实参时才用 <code>T&</code>。'}
    ]},
    {id:'cpp-2-3',num:'2.3',title:'auto、范围 for 与 nullptr',lead:'现代 C++ 让你少写类型名、少写循环样板。',tags:['现代'],blocks:[
      {t:'p',x:'<code>auto</code> 让编译器从初始化式推导类型，特别适合冗长的迭代器类型。它<b>不是动态类型</b>——类型在编译期就确定了，只是少打字。'},
      {t:'code',lang:'C++',x:'std::vector<int> v = {1,2,3};\nfor (auto it = v.begin(); it != v.end(); ++it) { }   // 旧写法\nfor (auto x : v) { }                                  // 范围 for：只读副本\nfor (const auto& x : v) { }                           // 避免拷贝\nfor (auto& x : v) { x *= 2; }                         // 可修改元素'},
      {t:'p',x:'<code>nullptr</code> 取代了 C 的 <code>NULL</code>/<code>0</code>：它是一个独立的指针字面值类型 <code>std::nullptr_t</code>，不会在「指针还是整数」上产生歧义重载。'},
      {t:'note',k:'auto 的边界',x:'函数参数不能用 <code>auto</code>（除非是模板或 C++20 简写概念）；<code>auto</code> 会丢弃引用与 cv 限定，需要时用 <code>auto&</code>/<code>const auto&</code>。'}
    ]},
    {id:'cpp-2-4',num:'2.4',title:'函数重载、默认参数与内联',lead:'同名函数靠参数类型/个数区分；默认参数减少重载样板。',tags:['函数'],blocks:[
      {t:'p',x:'<b>函数重载</b>允许同一作用域里有多个同名函数，编译器根据调用时的实参类型与个数选择最匹配的版本。它只认参数列表，不认返回类型。'},
      {t:'code',lang:'C++',x:'int add(int a, int b) { return a + b; }\ndouble add(double a, double b) { return a + b; }\nstd::string add(const std::string& a, const std::string& b) { return a + b; }'},
      {t:'p',x:'<b>默认参数</b>从右往左连续提供：<code>void f(int a, int b=2, int c=3);</code> 调用 <code>f(1)</code> 等价于 <code>f(1,2,3)</code>。默认参数只在声明处写一次（通常在头文件），定义处不要再写。'},
      {t:'note',k:'inline',x:'<code>inline</code> 建议编译器把函数体展开以省去调用开销，并允许多个翻译单元有相同定义（解决头文件里写小函数的问题）。但它只是「建议」，真正是否内联由编译器决定。'}
    ]}
  ]},

  /* ================= 第 3 章 ================= */
  {id:'cpp-3',num:'3',title:'类与对象',lead:'封装数据与方法，理解构造、析构、this 与 const 成员。',sections:[
    {id:'cpp-3-1',num:'3.1',title:'从结构体到类',lead:'class 默认私有，struct 默认公有——其余几乎一样。',tags:['OOP'],blocks:[
      {t:'p',x:'<b>类（class）</b>把数据成员与操作它们的函数（成员函数）封装在一起。与 C 的 <code>struct</code> 最大区别：<code>class</code> 的成员默认 <code>private</code>（外部不能直接访问），<code>struct</code> 默认 <code>public</code>——在 C++ 里二者仅此一点不同，都可含成员函数、构造函数、继承。'},
      {t:'code',lang:'C++',x:'class Point {\npublic:\n    int x = 0, y = 0;          // 成员数据\n    void move(int dx, int dy) { x += dx; y += dy; }  // 成员函数\nprivate:\n    int id_;                    // 私有成员，外部不可见\n};'},
      {t:'p',x:'访问控制在<b>编译期</b>生效：把不该暴露的细节设为 <code>private</code>，对外只留必要的 <code>public</code> 接口，这就是封装带来的「信息隐藏」。'},
      {t:'note',k:'接口与实现分离',x:'习惯上把类的声明放头文件（<code>.h</code>），成员函数定义放 <code>.cpp</code>；只有短小或模板函数才在类体内直接定义（隐式 inline）。'}
    ]},
    {id:'cpp-3-2',num:'3.2',title:'构造函数、析构函数与 this',lead:'对象诞生与消亡时自动调用的两个特殊成员函数。',tags:['核心'],blocks:[
      {t:'p',x:'<b>构造函数</b>在对象创建时自动调用，负责初始化；<b>析构函数</b>（名前加 <code>~</code>）在对象销毁时调用，负责释放资源。二者都没有返回类型。'},
      {t:'code',lang:'C++',x:'class Buffer {\n    int* data_;\npublic:\n    Buffer(int n) : data_(new int[n]) {}   // 构造：分配\n    ~Buffer() { delete[] data_; }          // 析构：释放\n};'},
      {t:'p',x:'成员函数内有一个隐式指针 <code>this</code>，指向「调用该函数的那个对象」。当参数名与成员名冲突时，用 <code>this->x</code> 区分；也常用于返回对象自身以支持链式调用。'},
      {t:'note',k:'构造初始化列表',x:'<code>: data_(new int[n])</code> 是<b>初始化列表</b>，比在函数体内赋值更高效（尤其是 <code>const</code> 成员与引用成员<b>只能</b>在初始化列表里初始化）。'}
    ]},
    {id:'cpp-3-3',num:'3.3',title:'const 成员与 getter/setter',lead:'const 成员函数承诺不修改对象状态。',tags:['封装'],blocks:[
      {t:'p',x:'在成员函数参数列表后加 <code>const</code>（如 <code>int x() const;</code>）表示该函数<b>不修改对象的可观察状态</b>。const 对象只能调用 const 成员函数——这让编译器帮你守住「只读」契约。'},
      {t:'code',lang:'C++',x:'class Counter {\n    int n_ = 0;\npublic:\n    int get() const { return n_; }      // const：可读\n    void inc() { ++n_; }                // 非 const：可写\n};'},
      {t:'p',x:'<b>getter/setter</b> 是封装的常见手法：把成员设为 private，用取值/设值函数暴露受控访问（设值时可做校验）。现代 C++ 也常用隐式生成的特殊成员函数简化这些样板。'},
      {t:'note',k:'Rule of Zero/Three/Five',x:'若类需要自定义析构、拷贝构造、拷贝赋值之一，往往三者都要（Rule of Three）；C++11 加入移动后变成 Rule of Five。最理想的现代写法是 <b>Rule of Zero</b>：用智能指针和容器管理资源，自己一个特殊函数都不写。'}
    ]}
  ]},

  /* ================= 第 4 章 ================= */
  {id:'cpp-4',num:'4',title:'运算符重载',lead:'让自定义类型也能用 +、==、<< 等运算符，像内建类型一样自然。',sections:[
    {id:'cpp-4-1',num:'4.1',title:'为什么要重载运算符',lead:'复数相加、字符串拼接、向量点积——可读性的关键。',tags:['OOP'],blocks:[
      {t:'p',x:'运算符重载让你为自定义类型赋予运算符含义，使代码读起来像数学表达式。<code>Complex a,b; auto c = a + b;</code> 比 <code>a.add(b)</code> 直观得多。但<b>不能发明新运算符</b>，也不能改变优先级和结合性。'},
      {t:'code',lang:'C++',x:'struct Complex {\n    double re, im;\n    Complex operator+(const Complex& o) const {\n        return {re + o.re, im + o.im};\n    }\n};'},
      {t:'note',k:'适度原则',x:'只重载语义清晰、不会误导读者的运算符。把 <code>+</code> 重载成「相减」是反模式；不能重载 <code>::</code>、<code>.*</code>、<code>?:</code>、<code>sizeof</code> 等少数运算符。'}
    ]},
    {id:'cpp-4-2',num:'4.2',title:'流输出 << 与比较 ==',lead:'最常见的两个重载：让对象能直接打印和比较。',tags:['实用'],blocks:[
      {t:'code',lang:'C++',x:'#include <iostream>\nstd::ostream& operator<<(std::ostream& os, const Complex& c) {\n    return os << c.re << "+" << c.im << "i";\n}\nbool operator==(const Complex& a, const Complex& b) {\n    return a.re == b.re && a.im == b.im;\n}'},
      {t:'p',x:'<code>&lt;&lt;</code> 重载必须返回流引用 <code>std::ostream&</code> 才能链式 <code>cout &lt;&lt; a &lt;&lt; b</code>；它通常声明为类的 <code>friend</code> 以访问私有成员。'},
      {t:'note',k:'C++20 的 <=>',x:'C++20 引入三路比较运算符 <code>&lt;=&gt;</code>，写一次 <code>auto operator&lt;=&gt;(const T&) const = default;</code> 即可自动提供 <code>==,&lt;,&lt;=,&gt;,&gt;=</code> 全部比较，告别手写一堆比较函数。'}
    ]}
  ]},

  /* ================= 第 5 章 ================= */
  {id:'cpp-5',num:'5',title:'继承与多态',lead:'复用代码（继承）与「同一接口多种实现」（多态）。',sections:[
    {id:'cpp-5-1',num:'5.1',title:'继承：is-a 关系',lead:'派生类获得基类成员，并可扩展或改写。',tags:['OOP'],blocks:[
      {t:'p',x:'<b>继承</b>表达「是一个（is-a）」关系：<code>class Dog : public Animal</code> 表示 Dog 是一种 Animal，自动拥有 Animal 的公开成员。访问级别 <code>public</code> 继承最常用。'},
      {t:'code',lang:'C++',x:'class Animal {\npublic:\n    void eat() const { /* ... */ }\n};\nclass Dog : public Animal {\npublic:\n    void bark() const { /* ... */ }\n};'},
      {t:'note',k:'多用组合少用继承',x:'继承带来紧耦合与 fragile base class 问题。若关系不是真正的 is-a，优先用<b>组合</b>（把一个对象作为成员）而非继承。'}
    ]},
    {id:'cpp-5-2',num:'5.2',title:'虚函数与多态',lead:'通过基类指针/引用，调用到派生类的实现。',tags:['核心'],blocks:[
      {t:'p',x:'在基类成员函数前加 <code>virtual</code>，派生类用 <code>override</code> 改写它，就实现了<b>多态</b>：用基类指针指向派生类对象时，调用的是运行时实际类型的版本。这是「开闭原则」的基石。'},
      {t:'code',lang:'C++',x:'struct Shape { virtual double area() const = 0; };  // 纯虚：抽象类\nstruct Circle : Shape {\n    double r;\n    double area() const override { return 3.14159 * r * r; }\n};\nShape* s = new Circle{2.0};\ns->area();   // 调用 Circle::area，运行时决定'},
      {t:'p',x:'<code>= 0</code> 的纯虚函数让类成为<b>抽象类</b>，不能实例化，只能作接口。析构函数若被继承链通过基类指针删除，基类析构<b>必须</b>声明为 <code>virtual</code>，否则派生部分不会释放。'},
      {t:'note',k:'override 与 final',x:'<code>override</code> 让编译器检查你确实重写了虚函数（防止签名写错）；<code>final</code> 阻止进一步派生或重写。两者都能尽早暴露错误。'}
    ]}
  ]},

  /* ================= 第 6 章 ================= */
  {id:'cpp-6',num:'6',title:'模板与泛型',lead:'写出「与类型无关」的函数与类，编译期实例化出具体版本。',sections:[
    {id:'cpp-6-1',num:'6.1',title:'函数模板',lead:'一个函数适配所有可比较/可运算的类型。',tags:['泛型'],blocks:[
      {t:'p',x:'<b>模板</b>把类型变成参数。函数模板 <code>template &lt;typename T&gt; T max(T a, T b)</code> 在你用 <code>int</code>、<code>double</code> 等调用时，编译器实例化出对应版本——一份源码，多种类型，且零运行时开销。'},
      {t:'code',lang:'C++',x:'template <typename T>\nT max(T a, T b) { return a < b ? b : a; }\n\nint i = max(3, 7);          // 实例化为 int 版\ndouble d = max(1.2, 5.6);   // 实例化为 double 版'},
      {t:'note',k:'模板在编译期',x:'模板实例化发生在编译期，错误信息往往很长（「模板天书」）。C++20 的 <code>concepts</code> 可约束模板参数类型，让报错变得人话。'}
    ]},
    {id:'cpp-6-2',num:'6.2',title:'类模板',lead:'vector、pair、智能指针都是类模板。',tags:['泛型'],blocks:[
      {t:'code',lang:'C++',x:'template <typename T>\nclass Box {\n    T value_;\npublic:\n    Box(T v) : value_(v) {}\n    T get() const { return value_; }\n};\nBox<int> bi{42};      Box<std::string> bs{"hi"};'},
      {t:'p',x:'标准库的容器 <code>std::vector&lt;int&gt;</code>、智能指针 <code>std::shared_ptr&lt;Foo&gt;</code> 都是类模板。模板参数也可以是非类型（如数组大小 <code>std::array&lt;int, 10&gt;</code>）。'},
      {t:'note',k:'模板的实现位置',x:'模板通常整个写在头文件里，因为编译器需要看到完整定义才能实例化。这点和普通函数「声明在头、定义在 .cpp」相反。'}
    ]}
  ]},

  /* ================= 第 7 章 ================= */
  {id:'cpp-7',num:'7',title:'标准库 STL',lead:'容器、算法、迭代器、string 与智能指针——C++ 的生产力核心。',sections:[
    {id:'cpp-7-1',num:'7.1',title:'容器：vector / map / set',lead:'不同容器在「随机访问、插入、查找」上各有取舍。',tags:['STL'],blocks:[
      {t:'table',head:['容器','特点','典型场景'],rows:[
        ['<code>vector&lt;T&gt;</code>','动态数组，尾部追加 O(1)，随机访问 O(1)','最常用顺序容器'],
        ['<code>list&lt;T&gt;</code>','双向链表，任意位置插入 O(1)，无随机访问','频繁中间插入'],
        ['<code>map&lt;K,V&gt;</code>','红黑树，按键有序，查找 O(log n)','键值字典'],
        ['<code>unordered_map&lt;K,V&gt;</code>','哈希表，平均 O(1)','高频查找'],
        ['<code>set&lt;T&gt;</code> / <code>unordered_set&lt;T&gt;</code>','去重集合','判重、交集']
      ]},
      {t:'code',lang:'C++',x:'#include <vector>\n#include <map>\nstd::vector<int> v = {3,1,2};\nv.push_back(4);\nstd::map<std::string,int> score; score["a"] = 90;'},
      {t:'note',k:'vector 优先',x:'除非有明确理由，否则默认用 <code>vector</code>。它缓存友好、尾部操作快，比手写的 C 数组安全得多。'}
    ]},
    {id:'cpp-7-2',num:'7.2',title:'迭代器、算法与 lambda',lead:'算法操作「范围」，lambda 提供就地行为。',tags:['STL'],blocks:[
      {t:'p',x:'<b>迭代器</b>是连接容器与算法的胶水：算法（如 <code>std::sort</code>、<code>std::find</code>）只认迭代器区间 <code>[first, last)</code>，不关心底层容器。'},
      {t:'code',lang:'C++',x:'#include <algorithm>\nstd::vector<int> v = {3,1,2,5,4};\nstd::sort(v.begin(), v.end());                       // 排序\nint n = std::count_if(v.begin(), v.end(),\n    [](int x){ return x > 2; });                      // lambda 计数'},
      {t:'p',x:'<b>lambda</b>是匿名函数对象，<code>[]</code> 捕获列表决定能否访问外部变量。<code>[&]</code> 按引用、<code>[=]</code> 按值。C++14 起支持泛型 lambda <code>[](auto x){}</code>。'}
    ]},
    {id:'cpp-7-3',num:'7.3',title:'智能指针与 RAII',lead:'用对象生命周期管理资源，告别手动 delete。',tags:['现代','核心'],blocks:[
      {t:'p',x:'<b>RAII</b>（资源获取即初始化）是 C++ 的资源管理哲学：把资源（内存、文件、锁）绑定到对象的生命周期，构造时获取、析构时释放，异常安全且零泄漏风险。'},
      {t:'code',lang:'C++',x:'#include <memory>\nauto p = std::make_unique<Buffer>(1024);   // 独占，离开作用域自动 delete\nstd::shared_ptr<Foo> s = std::make_shared<Foo>(); // 引用计数，共享拥有\n// 不再需要写 delete'},
      {t:'table',head:['智能指针','语义'],rows:[
        ['<code>unique_ptr</code>','独占所有权，零开销，首选'],
        ['<code>shared_ptr</code>','共享所有权，引用计数（有原子开销）'],
        ['<code>weak_ptr</code>','不增加计数，打破 shared_ptr 循环引用']
      ]},
      {t:'note',k:'优先 make_unique / make_shared',x:'用 <code>make_*</code> 而非 <code>new</code>，能避免裸指针暴露、减少一次分配、且异常安全。'}
    ]}
  ]},

  /* ================= 第 8 章 ================= */
  {id:'cpp-8',num:'8',title:'现代 C++ 惯用法',lead:'移动语义、lambda、constexpr、结构化绑定，把代码写短写对。',sections:[
    {id:'cpp-8-1',num:'8.1',title:'移动语义与 std::move',lead:'把资源「偷」过来而非拷贝，省掉昂贵复制。',tags:['现代'],blocks:[
      {t:'p',x:'C++11 引入<b>右值引用 <code>T&&</code></b>与移动语义：当一个对象是临时值（右值），可以「移动」其资源（如把指针转让）而非深拷贝。<code>std::move(x)</code> 把左值<b>转义</b>为右值引用，提示「你可以搬走我」。'},
      {t:'code',lang:'C++',x:'std::vector<int> a = {1,2,3};\nstd::vector<int> b = std::move(a);  // a 的资源搬给 b，a 变空\n// 此后不要再使用 a 的内容'},
      {t:'note',k:'move 之后',x:'被 <code>std::move</code> 的对象处于「有效但未指定状态」：可析构、可重新赋值，但不应再读其旧值。移动构造函数/赋值应标记为 <code>noexcept</code> 以便容器扩容时优先移动。'}
    ]},
    {id:'cpp-8-2',num:'8.2',title:'constexpr 与编译期计算',lead:'在编译期就算好的值，零运行时成本。',tags:['现代'],blocks:[
      {t:'p',x:'<code>constexpr</code> 标记可在编译期求值的变量或函数。编译期算好的结果直接嵌进二进制，提升性能并可用于需要常量表达式的场合（数组大小、模板参数）。'},
      {t:'code',lang:'C++',x:'constexpr int square(int n) { return n * n; }\nint arr[square(8)];            // 编译期确定大小\nconstexpr int k = square(5);   // 编译期算得 25'},
      {t:'note',k:'C++20 consteval',x:'<code>consteval</code> 要求函数<b>必须</b>在编译期求值（立即函数），比 constexpr 更严格，适合写「元编程」式的计算。'}
    ]},
    {id:'cpp-8-3',num:'8.3',title:'结构化绑定与可选值',lead:'把元组/结构体拆成独立变量，用 optional 表达「可能无值」。',tags:['现代'],blocks:[
      {t:'code',lang:'C++',x:'#include <tuple>\nauto [a, b] = std::make_tuple(1, "hi");   // 拆包\n\n#include <optional>\nstd::optional<int> find(int key) { /* 找到返回 int，否则 {} */ }\nif (auto v = find(7)) use(*v);   // 有值才解引用'},
      {t:'p',x:'<code>std::optional&lt;T&gt;</code> 比返回「-1 表示没找到」之类的魔法值安全得多：它明确表达「可能有值，也可能没有」，强制你先检查再取值。'}
    ]}
  ]},

  /* ================= 第 9 章 ================= */
  {id:'cpp-9',num:'9',title:'工程实践与并发入门',lead:'头文件守卫、异常处理、并发与构建，把代码送上生产线。',sections:[
    {id:'cpp-9-1',num:'9.1',title:'头文件守卫与编译模型',lead:'防止同一个头被多次包含导致重定义。',tags:['工程'],blocks:[
      {t:'code',lang:'C++',x:'#ifndef POINT_H\n#define POINT_H\nclass Point { /* ... */ };\n#endif  // POINT_H\n\n// 或 C++23 一行搞定：\n// #pragma once'},
      {t:'p',x:'<b><code>#pragma once</code></b> 绝大多数编译器支持，比手写 include guard 简洁且不易出错。C++ 20 的<b>模块（modules）</b> <code>import</code> 是更现代的替代，能显著加快编译、彻底解决宏污染问题，但生态仍在普及中。'},
      {t:'note',k:'头文件只放声明',x:'头文件里放声明、类定义、模板、inline 小函数；变量的定义与函数体放 <code>.cpp</code>，避免多翻译单元包含导致 <code>multiple definition</code>。'}
    ]},
    {id:'cpp-9-2',num:'9.2',title:'异常与 noexcept',lead:'用异常表达「不该发生但发生了」的错误路径。',tags:['工程'],blocks:[
      {t:'p',x:'<code>throw</code> 抛出异常、<code>try/catch</code> 捕获。异常适合处理「真正异常」的错误，让正常路径保持干净。但异常有开销且某些嵌入式/实时场景禁用（用返回码替代）。'},
      {t:'code',lang:'C++',x:'try {\n    if (bad) throw std::runtime_error("failed");\n} catch (const std::exception& e) {\n    std::cerr << e.what() << std::endl;\n}'},
      {t:'p',x:'<code>noexcept</code> 声明函数不会抛异常：它既是给编译器的优化承诺，也是接口契约（违反会直接 terminate）。移动构造、析构应优先标 <code>noexcept</code>。'}
    ]},
    {id:'cpp-9-3',num:'9.3',title:'并发：std::thread 与原子',lead:'C++11 起标准库原生支持多线程。',tags:['并发'],blocks:[
      {t:'p',x:'<code>std::thread</code> 让函数或 lambda 在独立线程运行；<code>join()</code> 等待它结束。共享数据必须用互斥量 <code>std::mutex</code> 或原子类型 <code>std::atomic</code> 保护，否则会发生数据竞争（未定义行为）。'},
      {t:'code',lang:'C++',x:'#include <thread>\n#include <atomic>\nstd::atomic<int> counter{0};\nstd::thread t1([&]{ for(int i=0;i<1000;++i) ++counter; });\nstd::thread t2([&]{ for(int i=0;i<1000;++i) ++counter; });\nt1.join(); t2.join();   // counter == 2000'},
      {t:'note',k:'优先高级抽象',x:'直接 <code>new std::thread</code> 容易出错。优先用 <code>std::async</code>、并行算法 <code>std::for_each(std::execution::par, ...)</code> 或任务队列，把线程管理交给库。'}
    ]}
  ]}
  ]
};
