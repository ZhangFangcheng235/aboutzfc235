/* ==========================================================
   逐节扩写 · C 语言 第 5~6 章（c-5-* / c-6-*）
   ========================================================== */
window.WIKI_X_C3 = {

/* ---------------- 第 5 章 ---------------- */
'c-5-1': [
  {t:'h',x:'深入：顺序表 vs 链表的取舍与完整实现'},
  {t:'p',x:'选择线性结构时，真正决定性能的往往不是渐进复杂度，而是<b>内存访问模式</b>。顺序表连续存储，缓存命中率高、随机访问 O(1)，但中间插入删除要搬移元素；链表插入删除 O(1)（已知前驱），却每次都要追逐指针，缓存不友好，且每个节点额外付出指针开销。'},
  {t:'table',head:['操作','顺序表','单链表','说明'],rows:[
    ['按下标访问','O(1)','O(n)','顺序表的绝对优势'],
    ['头部插入','O(n)','O(1)','链表常用于实现栈/队列'],
    ['尾部插入','均摊 O(1)','O(n)（无尾指针时）','维护尾指针可降为 O(1)'],
    ['中间插入','O(n)','O(1)（已定位）','查找本身仍是 O(n)'],
    ['内存开销','仅数据','每节点多 1~2 个指针','小元素时链表开销占比很高'],
    ['缓存局部性','好','差','实测小数据集顺序表常快数倍']
  ]},
  {t:'code',lang:'C23 · 带头结点的单链表（含统一释放）',x:`#include <stdio.h>
#include <stdlib.h>

typedef struct Node { int val; struct Node *next; } Node;
typedef struct { Node *head; size_t size; } List;   /* head 为哨兵，不存数据 */

static void list_init(List *l) {
    l->head = malloc(sizeof *l->head);
    l->head->next = nullptr; l->size = 0;
}
static int list_push_front(List *l, int v) {
    Node *n = malloc(sizeof *n);
    if (!n) return -1;
    n->val = v; n->next = l->head->next;
    l->head->next = n; l->size++;
    return 0;
}
static Node *list_find(List *l, int v) {
    for (Node *p = l->head->next; p; p = p->next)
        if (p->val == v) return p;
    return nullptr;
}
static int list_erase(List *l, int v) {
    Node *prev = l->head;
    while (prev->next && prev->next->val != v) prev = prev->next;
    if (!prev->next) return -1;
    Node *dead = prev->next;
    prev->next = dead->next; free(dead); l->size--;
    return 0;
}
static void list_free(List *l) {
    Node *p = l->head;
    while (p) { Node *next = p->next; free(p); p = next; }
    l->head = nullptr; l->size = 0;
}

int main(void) {
    List l; list_init(&l);
    for (int i = 0; i < 5; ++i) list_push_front(&l, i);
    printf("size=%zu, find(3)=%s\\n", l.size, list_find(&l,3)?"yes":"no");
    list_erase(&l, 3);
    printf("after erase size=%zu\\n", l.size);
    list_free(&l);
    return 0;
}`},
  {t:'note',kind:'tip',k:'哨兵节点的价值',x:'用一个不存数据的头结点，可以让「在空表插入」和「在中间插入」走同一段代码，消除大量 <code>if (head == nullptr)</code> 分支。Linux 内核链表、教学实现都常用这个技巧。'},
  {t:'p',x:'双向链表额外维护 <code>prev</code>，支持 O(1) 删除已知节点，是 LRU 缓存、 intrusive 容器的基础。工程里更常见的做法是「侵入式」：把 <code>next/prev</code> 直接嵌进业务结构体，避免为每个元素单独 malloc，也减少一次指针跳转。'},
  {t:'ex',k:'动手练一练',items:[
    '给上面的链表补 <code>list_push_back</code> 与尾指针，把尾部插入降到 O(1)。',
    '实现 <code>list_reverse</code>，要求原地反转、不分配新节点。',
    '用 ASan 验证 <code>list_free</code> 后无泄漏与重复释放。'
  ]}
],

'c-5-2': [
  {t:'h',x:'深入：环形缓冲与两种队列实现'},
  {t:'p',x:'栈（LIFO）用动态数组实现最自然：一个 <code>top</code> 下标，push/pop 都是均摊 O(1)，且内存连续。队列（FIFO）若用数组直接移动元素会是 O(n)，标准解法是<b>环形缓冲区</b>：用 <code>head</code>、<code>count</code> 两个量，下标对容量取模复用空间。'},
  {t:'code',lang:'C23 · 定长环形队列',x:`#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct { int *buf; size_t cap, head, count; } Ring;

static int ring_init(Ring *q, size_t cap) {
    q->buf = malloc(cap * sizeof *q->buf);
    if (!q->buf) return -1;
    q->cap = cap; q->head = 0; q->count = 0;
    return 0;
}
static int ring_push(Ring *q, int v) {
    if (q->count == q->cap) return -1;                 // 满
    q->buf[(q->head + q->count) % q->cap] = v;
    q->count++;
    return 0;
}
static int ring_pop(Ring *q, int *out) {
    if (q->count == 0) return -1;                      // 空
    *out = q->buf[q->head];
    q->head = (q->head + 1) % q->cap;
    q->count--;
    return 0;
}

int main(void) {
    Ring q; ring_init(&q, 4);
    for (int i = 1; i <= 3; ++i) ring_push(&q, i);
    int v; ring_pop(&q, &v); printf("pop=%d\\n", v);
    ring_push(&q, 4); ring_push(&q, 5);                // 回绕写入
    while (ring_pop(&q, &v) == 0) printf("%d ", v);
    putchar('\\n');
    free(q.buf);
    return 0;
}`},
  {t:'table',head:['判空 / 判满','做法','注意'],rows:[
    ['用 <code>count</code>','<code>count==0</code> 空，<code>count==cap</code> 满','最简单，推荐'],
    ['留一个空位','<code>head==tail</code> 空，<code>(tail+1)%cap==head</code> 满','浪费一格，常见教材写法'],
    ['用满位标志','额外 bool 记录最后一次操作是 push 还是 pop','逻辑稍绕'],
    ['动态扩容','满时 realloc 并搬移','实现时要按 head 拆成两段拷贝']
  ]},
  {t:'note',kind:'warn',k:'索引类型一致',x:'环形结构里所有下标与计数统一用 <code>size_t</code>，避免 <code>int</code> 与 <code>size_t</code> 混用触发 <code>-Wsign-compare</code>，也避免负数取模得到意外结果。取模前确认 <code>cap &gt; 0</code>，<code>ring_init(0)</code> 必须拒绝。'},
  {t:'p',x:'队列的另一条路是链表实现：入队挂到尾、出队摘头，容量不限但每次分配节点。嵌入式/高频场景通常用环形数组（确定内存、无 malloc）；任务调度、消息队列若长度波动大则用链表。双端队列（deque）则可用「分块数组」兼顾两端操作与局部性。'},
  {t:'ex',k:'动手练一练',items:[
    '给 <code>Ring</code> 增加扩容：满时容量翻倍，并把环形数据按正确顺序搬过去。',
    '用动态数组实现一个栈，提供 <code>push/pop/top/size</code> 并做边界检查。',
    '用「两个栈」实现队列，分析每个操作的均摊复杂度。'
  ]}
],

'c-5-3': [
  {t:'h',x:'深入：BST 的插入、查找、删除与退化'},
  {t:'p',x:'二叉搜索树保持一个不变式：<b>左子树所有值 &lt; 根 &lt; 右子树所有值</b>。查找、插入、删除的复杂度都等于树高 h——平衡时 O(log n)，最坏（有序插入）退化成链表 O(n)。这也是实际工程里更多用红黑树、AVL 或跳表的原因。'},
  {t:'code',lang:'C23 · BST 插入 / 查找 / 中序遍历 / 释放',x:`#include <stdio.h>
#include <stdlib.h>

typedef struct Node { int key; struct Node *l, *r; } Node;

static Node *node_new(int k) {
    Node *n = malloc(sizeof *n);
    if (n) { n->key = k; n->l = n->r = nullptr; }
    return n;
}
static Node **find_slot(Node **p, int k) {
    while (*p && (*p)->key != k) p = (k < (*p)->key) ? &(*p)->l : &(*p)->r;
    return p;                       /* 返回「指针的指针」，插入无需特殊处理根 */
}
static int bst_insert(Node **root, int k) {
    Node **slot = find_slot(root, k);
    if (*slot) return 0;            /* 已存在 */
    *slot = node_new(k);
    return *slot ? 0 : -1;
}
static void inorder(Node *n) {
    if (!n) return;
    inorder(n->l); printf("%d ", n->key); inorder(n->r);
}
static void bst_free(Node *n) {
    if (!n) return;
    bst_free(n->l); bst_free(n->r); free(n);
}

int main(void) {
    Node *root = nullptr;
    int keys[] = {5,3,8,1,4,7,9};
    for (size_t i = 0; i < 7; ++i) bst_insert(&root, keys[i]);
    inorder(root); putchar('\\n');   /* 1 3 4 5 7 8 9 */
    bst_free(root);
    return 0;
}`},
  {t:'table',head:['遍历','顺序','典型用途'],rows:[
    ['前序 根-左-右','根最先','复制树、序列化表达式'],
    ['中序 左-根-右','BST 下有序','有序输出、验证 BST'],
    ['后序 左-右-根','根最后','释放整棵树、计算子树信息'],
    ['层序','按深度逐层','BFS、求树高、打印树形']
  ]},
  {t:'p',x:'删除是 BST 最麻烦的操作，分三种情况：① 叶子——直接释放；② 只有一个孩子——用孩子顶替自己；③ 两个孩子——用<b>中序后继</b>（右子树最小值）的 key 覆盖当前节点，再递归删除那个后继。注意所有递归实现都要考虑<b>树高过大导致栈溢出</b>。'},
  {t:'note',kind:'tip',k:'「指针的指针」技巧',x:'<code>Node **find_slot</code> 返回的是「指向某个指针成员的槽位」，插入时只需 <code>*slot = new_node</code>，不用区分「根为空」还是「插到叶子」，代码短且不易错。这个模式在链表、树、哈希桶里都通用。'},
  {t:'ex',k:'动手练一练',items:[
    '补齐 <code>bst_erase(Node **root, int key)</code> 的三种情况，并用中序遍历验证结果仍有序。',
    '实现 <code>bst_height</code> 与 <code>bst_size</code>，分别按有序插入与随机插入对比树高。',
    '把递归中序遍历改成显式栈的迭代版本，避免深树爆栈。'
  ]}
],

'c-5-4': [
  {t:'h',x:'深入：哈希函数、冲突处理与扩容'},
  {t:'p',x:'哈希表把 key 通过哈希函数映射到桶下标，理想情况下插入/查找/删除都是均摊 O(1)。三个设计点决定实际表现：<b>哈希函数是否均匀</b>、<b>冲突如何解决</b>、<b>负载因子到多少时扩容</b>。C 标准库没有哈希表，必须自己实现或引入第三方库。'},
  {t:'table',head:['冲突策略','做法','优缺点'],rows:[
    ['链地址法','每个桶挂一条链表','实现简单、抗聚集；节点分散、缓存一般'],
    ['开放寻址 · 线性探测','冲突时向后找空位','缓存极好；易聚集，删除需墓碑标记'],
    ['开放寻址 · 双重哈希','第二个哈希决定步长','分布更均匀，实现稍复杂'],
    ['布谷鸟哈希','两个候选位置，必要时踢出重放','最坏查询 O(1)，实现复杂']
  ]},
  {t:'code',lang:'C23 · 字符串键哈希表（链地址法）',x:`#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdint.h>

typedef struct Entry { char *key; int val; struct Entry *next; } Entry;
typedef struct { Entry **buckets; size_t cap, size; } Map;

static uint64_t fnv1a(const char *s) {
    uint64_t h = 1469598103934665603ULL;
    for (; *s; ++s) { h ^= (unsigned char)*s; h *= 1099511628211ULL; }
    return h;
}
static Map *map_new(size_t cap) {
    Map *m = malloc(sizeof *m);
    m->buckets = calloc(cap, sizeof *m->buckets);
    m->cap = cap; m->size = 0;
    return m;
}
static int map_put(Map *m, const char *key, int val) {
    size_t i = fnv1a(key) % m->cap;
    for (Entry *e = m->buckets[i]; e; e = e->next)
        if (strcmp(e->key, key) == 0) { e->val = val; return 0; }  /* 更新 */
    Entry *e = malloc(sizeof *e);
    if (!e) return -1;
    e->key = malloc(strlen(key) + 1);
    strcpy(e->key, key);
    e->val = val; e->next = m->buckets[i]; m->buckets[i] = e;
    m->size++;
    return 0;
}
static int map_get(const Map *m, const char *key, int *out) {
    size_t i = fnv1a(key) % m->cap;
    for (Entry *e = m->buckets[i]; e; e = e->next)
        if (strcmp(e->key, key) == 0) { *out = e->val; return 0; }
    return -1;
}
static void map_free(Map *m) {
    for (size_t i = 0; i < m->cap; ++i) {
        Entry *e = m->buckets[i];
        while (e) { Entry *n = e->next; free(e->key); free(e); e = n; }
    }
    free(m->buckets); free(m);
}
int main(void) {
    Map *m = map_new(16);
    map_put(m, "C23", 2024); map_put(m, "C*", 2025);
    int v; if (map_get(m, "C23", &v) == 0) printf("C23=%d\\n", v);
    map_free(m);
    return 0;
}`},
  {t:'p',x:'<b>扩容</b>：当 <code>size / cap &gt; 0.75</code> 时把桶数组翻倍，并把所有条目<b>重新哈希</b>（不能直接搬链表节点，因为桶下标变了）。整数键可用乘法哈希或 <code>splitmix64</code> 之类混淆函数；字符串键用 FNV-1a / Murmur / xxhash。永远不要对用户输入直接取模而不做混淆——容易构造大量同余键造成退化攻击。'},
  {t:'note',kind:'warn',k:'内存所有权',x:'上面的 <code>map_put</code> 自己 <code>strdup</code> 了 key，所以 <code>map_free</code> 要逐个 free。另一种设计是只存 <code>const char*</code> 并把所有权留给调用方——<b>必须在头文件注明用哪一种</b>，否则不是泄漏就是悬空。'},
  {t:'ex',k:'动手练一练',items:[
    '给 <code>Map</code> 增加负载因子触发的扩容与 rehash。',
    '实现 <code>map_erase</code>，注意链地址法里要维护前驱指针。',
    '用线性探测实现同一接口，对比随机键下的查找耗时。'
  ]}
],

'c-5-5': [
  {t:'h',x:'深入：复杂度、稳定性与 qsort 实战'},
  {t:'p',x:'排序是理解算法与内存访问的最好切口。<b>稳定性</b>指相等元素排序后相对顺序不变——对「先按时间排、再按姓名排」这类多关键字场景很重要。C 标准库的 <code>qsort</code> <b>不保证稳定</b>（多数实现是快排/归并变体，但标准无承诺），需要稳定时得自己写归并排序或给 key 附加原始下标。'},
  {t:'table',head:['算法','平均 / 最坏','稳定','空间','适用'],rows:[
    ['插入排序','O(n²) / O(n²)','是','O(1)','小规模或基本有序'],
    ['快速排序','O(n log n) / O(n²)','否','O(log n)','通用，缓存友好'],
    ['归并排序','O(n log n) / O(n log n)','是','O(n)','需要稳定 / 链表 / 外部排序'],
    ['堆排序','O(n log n) / O(n log n)','否','O(1)','内存受限、需要最坏保证'],
    ['计数/基数排序','O(n+k)','可做到','O(k)','整数、范围有限'],
    ['<code>qsort</code>','实现相关','不保证','实现相关','日常首选']
  ]},
  {t:'code',lang:'C23 · qsort 多字段排序',x:`#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct { const char *name; int score; int id; } Student;

/* 严格弱序：先按分数降序，再按 id 升序（保证结果确定、且 qsort 不稳定也无妨） */
static int cmp_student(const void *a, const void *b) {
    const Student *x = a, *y = b;
    if (x->score != y->score) return (x->score < y->score) - (x->score > y->score);
    return (x->id > y->id) - (x->id < y->id);
}
int main(void) {
    Student s[] = {{"甲",90,3},{"乙",90,1},{"丙",85,2},{"丁",95,4}};
    size_t n = sizeof s / sizeof s[0];
    qsort(s, n, sizeof s[0], cmp_student);
    for (size_t i = 0; i < n; ++i)
        printf("%s score=%d id=%d\\n", s[i].name, s[i].score, s[i].id);
    return 0;
}`},
  {t:'note',kind:'warn',k:'比较函数的三条纪律',x:'① 用 <code>(x&gt;y)-(x&lt;y)</code> 而不是 <code>x-y</code>（防溢出）；② 必须满足传递性，否则 <code>qsort</code> 行为未定义；③ 相等时返回 0，若还要稳定就补一个唯一 tiebreaker（如 id）。<code>strcmp</code> 的返回值可直接使用，但不能假设是 ±1。'},
  {t:'p',x:'实用建议：数据量小于几十用插入排序（常数极小）；通用场景直接 <code>qsort</code> 别自己造轮子；需要稳定或对最坏复杂度有硬要求（实时系统）才自己写归并/堆排序。排序对象很大时，改为排序<b>指针数组或索引数组</b>，避免反复搬移大结构体。'},
  {t:'ex',k:'动手练一练',items:[
    '实现快速排序（三数取中 + 尾递归优化），并与 <code>qsort</code> 对 10 万个随机整数计时。',
    '写一个稳定的归并排序，排序结构体数组并验证相等元素的相对顺序。',
    '实现「先按姓名、再按分数」的多级比较函数，并说明为什么 id tiebreaker 能消除 qsort 不稳定带来的差异。'
  ]}
],

'c-5-6': [
  {t:'h',x:'深入：二分查找的边界与 STL 式 lower_bound'},
  {t:'p',x:'二分查找写错边界是经典问题。可靠写法是<b>半开区间 <code>[lo, hi)</code></b>：循环条件 <code>lo &lt; hi</code>，中点 <code>mid = lo + (hi - lo)/2</code>（防溢出），命中后把 <code>hi = mid</code> 继续往左找第一个，或 <code>lo = mid + 1</code> 往右。这样能同时覆盖「找不到」「有重复」两种情况。'},
  {t:'code',lang:'C23 · lower_bound / upper_bound',x:`#include <stdio.h>
#include <stddef.h>

/* 返回第一个 >= key 的下标；若都小于 key，返回 n */
static size_t lower_bound(const int *a, size_t n, int key) {
    size_t lo = 0, hi = n;
    while (lo < hi) {
        size_t mid = lo + (hi - lo) / 2;
        if (a[mid] < key) lo = mid + 1;
        else              hi = mid;
    }
    return lo;
}
/* 返回第一个 > key 的下标 */
static size_t upper_bound(const int *a, size_t n, int key) {
    size_t lo = 0, hi = n;
    while (lo < hi) {
        size_t mid = lo + (hi - lo) / 2;
        if (a[mid] <= key) lo = mid + 1;
        else               hi = mid;
    }
    return lo;
}
int main(void) {
    int a[] = {1,2,2,2,4,7,9};
    size_t n = sizeof a / sizeof a[0];
    size_t l = lower_bound(a, n, 2), u = upper_bound(a, n, 2);
    printf("值 2 的区间 = [%zu, %zu)，共 %zu 个\\n", l, u, u - l);
    printf("查找 5 应插入位置 = %zu\\n", lower_bound(a, n, 5));
    return 0;
}`},
  {t:'table',head:['查找','前提','复杂度','返回'],rows:[
    ['顺序查找','无','O(n)','下标或 -1'],
    ['二分查找','已排序 + 随机访问','O(log n)','任一 / 第一个匹配'],
    ['<code>lower_bound</code>','已排序','O(log n)','第一个 ≥ key 的位置'],
    ['插值查找','有序且分布均匀','均摊 O(log log n)','数据倾斜时退化'],
    ['哈希查找','已建哈希表','均摊 O(1)','值 / 未找到'],
    ['<code>bsearch</code>','标准库二分','O(log n)','未指定返回哪个重复项']
  ]},
  {t:'note',kind:'tip',k:'标准库 bsearch',x:'<code>void *bsearch(const void *key, const void *base, size_t nmemb, size_t size, int (*compar)(const void*, const void*))</code> 返回找到的元素指针，找不到返回 <code>nullptr</code>；<b>有重复元素时不保证返回哪一个</b>。需要「第一个 ≥」的语义就用上面的 <code>lower_bound</code>。'},
  {t:'p',x:'查找算法的选择本质上受数据结构约束：数组可随机访问才谈得上二分；链表即使有序也只能顺序走（除非改造成跳表）；哈希用空间换时间，但不支持范围查询与有序遍历。设计接口前先想清楚「需不需要有序」——这一条往往直接决定用树还是哈希表。'},
  {t:'ex',k:'动手练一练',items:[
    '用 <code>lower_bound</code> 实现「统计有序数组中某值出现次数」。',
    '在旋转有序数组（如 4 5 6 1 2 3）中查找目标值，要求 O(log n)。',
    '对比 <code>bsearch</code> 与自写 <code>lower_bound</code> 在有重复元素时的差异。'
  ]}
],

'c-5-7': [
  {t:'h',x:'深入：递归三要素、分治与回溯剪枝'},
  {t:'p',x:'写对递归只需盯住三件事：<b>基线条件</b>（什么时候直接返回）、<b>递进</b>（如何把问题变小）、<b>状态恢复</b>（回溯时把改动撤销）。所有递归都能改写成显式栈的迭代形式，代价是代码变长；递归的风险是栈深度，C 不做尾递归优化保证，深递归务必改迭代或加深度上限。'},
  {t:'code',lang:'C23 · 回溯：全排列（带状态恢复）',x:`#include <stdio.h>
#define N 3

static void permute(int a[], int used[], int depth) {
    if (depth == N) {                       /* 基线条件 */
        for (int i = 0; i < N; ++i) printf("%d ", a[i]);
        putchar('\\n');
        return;
    }
    for (int v = 1; v <= N; ++v) {
        if (used[v]) continue;              /* 剪枝：已用过的数跳过 */
        used[v] = 1; a[depth] = v;         /* 做选择 */
        permute(a, used, depth + 1);       /* 递进 */
        used[v] = 0;                       /* 撤销选择（回溯的关键） */
    }
}
int main(void) {
    int a[N] = {0}, used[N + 1] = {0};
    permute(a, used, 0);
    return 0;
}`},
  {t:'table',head:['范式','思路','例子'],rows:[
    ['分治','拆成独立子问题、合并结果','归并排序、快速排序、二分查找'],
    ['回溯','逐步构造解、失败则撤销','全排列、N 皇后、数独、子集和'],
    ['动态规划','重叠子问题，存表避免重算','背包、最长公共子序列、最短路'],
    ['贪心','每步取局部最优','活动选择、Huffman、Dijkstra'],
    ['尾递归','递归调用是最后一步','可机械改写为循环，C 不保证优化']
  ]},
  {t:'p',x:'回溯的复杂度通常是指数级，<b>剪枝</b>决定能不能用：提前排除不可能的分支（如 N 皇后里同列/同对角线已占用）、按约束排序候选、用位掩码把状态压缩成一个整数，往往能把运行时间压低几个数量级。用位掩码做集合是 C 里非常高效的惯用法（回顾 2.11）。'},
  {t:'note',kind:'warn',k:'栈与重复计算',x:'斐波那契的朴素递归是 O(2ⁿ)，因为重复计算同一子问题；改成迭代或记忆化立刻变 O(n)。递归前先问：「同一个参数组合会不会被调用多次？」会，就该上记忆化或动态规划。另外局部大数组不要放在递归函数里，会迅速吃光栈。'},
  {t:'ex',k:'动手练一练',items:[
    '用位掩码改写全排列，把 <code>used[]</code> 压缩成一个 <code>unsigned</code>。',
    '实现 N 皇后，统计解的数量，并加入对角线剪枝。',
    '把递归版阶乘/斐波那契改成迭代版，用 <code>time</code> 对比大输入下的耗时。'
  ]}
],

'c-5-8': [
  {t:'h',x:'深入：_Generic 泛型选择与 C23 组合技'},
  {t:'p',x:'<code>_Generic</code>（C11 起）在<b>编译期</b>根据控制表达式的类型选择分支，不产生运行时开销，也不做隐式转换。它是 C 里实现「同名函数按类型分派」的标准手段，配合 C23 的 <code>typeof</code> 可以写出相当接近 C++ 模板的泛型宏。'},
  {t:'code',lang:'C23 · _Generic 类型分派 + typeof',x:`#include <stdio.h>
#include <math.h>

static const char *type_of_i(int x)      { (void)x; return "int"; }
static const char *type_of_d(double x)   { (void)x; return "double"; }
static const char *type_of_s(char *x)    { (void)x; return "char*"; }
static const char *type_of_other(void)   { return "other"; }

#define TYPE_NAME(x) _Generic((x), \\
    int: type_of_i, double: type_of_d, char*: type_of_s, \\
    default: type_of_other)(x)

/* 泛型绝对值：按类型选择 fabs / abs / labs */
#define ABS(x) _Generic((x), \\
    int: abs, long: labs, double: fabs, float: fabsf, default: abs)(x)

/* typeof + _Generic：声明同类型变量并按类型初始化 */
#define ZERO_OF(x) ((typeof(x))0)

int main(void) {
    int i = 1; double d = 2.5; char s[] = "hi";
    printf("i=%s d=%s s=%s\\n", TYPE_NAME(i), TYPE_NAME(d), TYPE_NAME(s));
    printf("ABS(-3)=%d ABS(-2.5)=%.1f\\n", ABS(-3), ABS(-2.5));
    typeof(i) j = ZERO_OF(i);
    printf("j=%d\\n", j);
    return 0;
}`},
  {t:'table',head:['机制','阶段','适合'],rows:[
    ['<code>_Generic</code>','编译期按类型选择','少量固定类型的重载'],
    ['<code>typeof</code>','编译期取类型','声明同类型临时变量'],
    ['<code>void*</code>','运行期擦除类型','泛型容器（回调传 size / 比较函数）'],
    ['宏 + 内联函数','预处理 + 编译','生成重复但类型安全的代码'],
    ['<code>_BitInt</code>','编译期位宽','任意精度整数（C23）']
  ]},
  {t:'p',x:'_Generic 的匹配基于<b>控制表达式的静态类型</b>，且会先做左值转换（丢掉顶层 const），所以 <code>const int</code> 会匹配 <code>int</code> 分支。一个坑是 default 分支的表达式也必须能通过类型检查——即使运行时不会走到，编译器仍会编译它，所以别在 default 里放类型不兼容的调用。'},
  {t:'note',kind:'tip',k:'工程上的泛型容器',x:'C 里做「能装任意类型」的容器，主流做法是 <code>void*</code> + 元素大小 + 比较/析构回调（像 <code>qsort</code>、<code>bsearch</code> 那样），或者用宏生成具体类型的实现（如 <code>klib</code>、<code>stb_ds</code>）。<code>_Generic</code> 更适合「少数几个已知类型的同名函数」，不适合承载整套容器。'},
  {t:'ex',k:'动手练一练',items:[
    '用 <code>_Generic</code> 实现 <code>print(x)</code>，支持 int / double / const char*。',
    '写一个类型无关的 <code>swap</code> 宏，利用 <code>typeof</code> 与 <code>sizeof</code> 交换任意对象。',
    '用 <code>void*</code> + <code>size_t elem_size</code> 实现一个泛型动态数组（回顾 3.1 的 Vec）。'
  ]}
],

/* ---------------- 第 6 章 ---------------- */
'c-6-1': [
  {t:'h',x:'深入：接口约定、不变量与错误处理模式'},
  {t:'p',x:'C 没有异常、没有 RAII，模块之间的契约全靠文档与约定。一个好接口必须明确四件事：<b>输入是否有效</b>（能不能传 nullptr / 长度能否为 0）、<b>谁拥有内存</b>（返回的东西要不要释放）、<b>错误如何报告</b>（返回码 / errno / 输出参数）、<b>失败后状态如何</b>（对象是否仍可用）。'},
  {t:'code',lang:'C23 · 统一错误处理与单一清理出口',x:`#include <stdio.h>
#include <stdlib.h>

typedef enum { OK = 0, ERR_INVALID = -1, ERR_NOMEM = -2, ERR_IO = -3 } Status;

/* 头文件里应注明：成功时 *out 由调用方用 buffer_free 释放；
   失败时 *out 保证为 nullptr，对象保持未初始化状态。 */
typedef struct { unsigned char *data; size_t len; } Buffer;

static Status buffer_load(const char *path, Buffer *out) {
    *out = (Buffer){0};                    /* 失败也保证输出确定 */
    if (!path || !out) return ERR_INVALID;

    FILE *fp = fopen(path, "rb");
    if (!fp) return ERR_IO;
    if (fseek(fp, 0, SEEK_END) != 0) { fclose(fp); return ERR_IO; }
    long n = ftell(fp);
    if (n < 0) { fclose(fp); return ERR_IO; }
    rewind(fp);

    unsigned char *buf = malloc((size_t)n);
    if (!buf) { fclose(fp); return ERR_NOMEM; }
    if (fread(buf, 1, (size_t)n, fp) != (size_t)n) {
        free(buf); fclose(fp); return ERR_IO;
    }
    fclose(fp);
    *out = (Buffer){ .data = buf, .len = (size_t)n };
    return OK;
}
static void buffer_free(Buffer *b) { free(b->data); *b = (Buffer){0}; }

int main(void) {
    Buffer b;
    Status s = buffer_load("data.bin", &b);
    if (s != OK) { fprintf(stderr, "加载失败: %d\\n", s); return 1; }
    printf("读取 %zu 字节\\n", b.len);
    buffer_free(&b);
    return 0;
}`},
  {t:'cards',items:[
    ['不变量','每个结构体都要能说清「什么状态算合法」，如 <code>Vec</code> 恒满足 <code>len &lt;= cap</code> 且 <code>cap==0 ⇔ data==nullptr</code>'],
    ['内部函数 static','不对外暴露的函数一律 <code>static</code>，减少符号污染，也便于编译器内联'],
    ['不透明指针','公开头文件只写 <code>typedef struct Impl Impl;</code>，定义藏在 .c 里，强制调用方走接口'],
    ['goto cleanup','多资源函数用统一清理标签，避免每个错误分支重复写 free 而漏掉某一个']
  ]},
  {t:'note',kind:'tip',k:'goto 在 C 里是好习惯',x:'C 里 <code>goto cleanup;</code> 是实现「单一出口」的标准写法（Linux 内核大量使用），能让资源释放只写一遍。约束是：只向后跳、不跳进作用域内部、不用来做普通控制流。别因为「goto 有害」的教条把错误处理写成层层嵌套。'},
  {t:'ex',k:'动手练一练',items:[
    '把 <code>buffer_load</code> 改写成 <code>goto cleanup</code> 版本，对比分支数量。',
    '为 3.1 的 <code>Vec</code> 写一份头文件注释，明确所有权与失败后状态。',
    '设计一个不透明句柄 <code>Parser*</code>，只暴露 create/parse/destroy 三个函数。'
  ]}
],

'c-6-2': [
  {t:'h',x:'深入：Makefile 依赖、CMake 目标与构建类型'},
  {t:'p',x:'构建系统的核心不是「把编译命令写进文件」，而是<b>正确声明依赖</b>：哪个 <code>.o</code> 依赖哪些 <code>.c</code> 和 <code>.h</code>，头文件改了要触发哪些重编译。手写 Makefile 时最容易漏的就是头文件依赖，推荐用编译器的 <code>-MMD -MP</code> 自动生成 <code>.d</code> 文件。'},
  {t:'code',lang:'Makefile · 自动生成头文件依赖',x:`CC      ?= gcc
CFLAGS  := -std=c2x -Wall -Wextra -Wpedantic -Werror -O2
CFLAGS  += -MMD -MP                 # 生成 .d 依赖文件
SRC     := $(wildcard src/*.c)
OBJ     := $(SRC:.c=.o)
DEP     := $(OBJ:.o=.d)
TARGET  := app

.PHONY: all clean dev test
all: $(TARGET)

$(TARGET): $(OBJ)
	$(CC) $(OBJ) -o $@ $(LDFLAGS)

%.o: %.c
	$(CC) $(CFLAGS) -c $< -o $@

-include $(DEP)                     # 关键：引入自动生成的头文件依赖

dev: CFLAGS := -std=c2x -Wall -Wextra -g -O0 -fsanitize=address,undefined
dev: clean all

clean:
	rm -f $(OBJ) $(DEP) $(TARGET)

test: $(TARGET)
	./$(TARGET) --selftest`},
  {t:'code',lang:'CMakeLists.txt · 现代 CMake 写法',x:`cmake_minimum_required(VERSION 3.20)
project(craft_c LANGUAGES C)
set(CMAKE_C_STANDARD 23)
set(CMAKE_C_STANDARD_REQUIRED ON)

add_library(vec STATIC src/vec.c)
target_include_directories(vec PUBLIC include)
target_compile_options(vec PRIVATE -Wall -Wextra -Wpedantic -Werror)

add_executable(app src/main.c)
target_link_libraries(app PRIVATE vec)

option(ENABLE_SANITIZER "启用 ASan/UBSan" OFF)
if(ENABLE_SANITIZER)
  target_compile_options(app PRIVATE -fsanitize=address,undefined -g)
  target_link_options(app PRIVATE -fsanitize=address,undefined)
endif()

enable_testing()
add_test(NAME selftest COMMAND app --selftest)`},
  {t:'table',head:['场景','推荐','理由'],rows:[
    ['单文件 / 教学','一条 gcc 命令','无需构建系统'],
    ['几个文件的小项目','Makefile','零依赖、透明、易调试'],
    ['跨平台 / 多目标 / 依赖库','CMake','生成器抽象、生态成熟'],
    ['大型项目','CMake + 包管理 + CI','target 级属性、可复现构建'],
    ['嵌入资源','<code>#embed</code> + 显式依赖','见 4.6，别忘了声明文件依赖']
  ]},
  {t:'note',kind:'warn',k:'Debug 与 Release 要分开',x:'<code>-O0 -g</code> 便于调试与 Sanitizer，<code>-O2 -DNDEBUG</code> 用于发布，两者行为可能不同（尤其有 UB 时）。分别在 CI 里跑一遍，别只在本地 Debug 下测过就发版。'},
  {t:'ex',k:'动手练一练',items:[
    '给上面的 Makefile 增加 <code>make asan</code> 目标，并验证改头文件会触发重编译。',
    '用 CMake 生成构建并分别编译 Debug / Release，对比可执行文件大小。',
    '故意在 <code>.c</code> 里包含一个不存在的头文件，观察 <code>-MMD</code> 生成的 <code>.d</code> 内容。'
  ]}
],

'c-6-3': [
  {t:'h',x:'深入：最小测试框架与覆盖率'},
  {t:'p',x:'C 没有官方测试框架，但自己搭一个最小可用的只要几十行：宏负责「断言 + 打印文件行号」，一个注册函数收集用例，main 里跑完统计通过数并返回非 0 表示失败。关键是<b>测试要能进 CI</b>——用退出码表达结果。'},
  {t:'code',lang:'C23 · 极简测试框架 + 覆盖率命令',x:`#include <stdio.h>

static int passed = 0, failed = 0;
#define TEST(name, body) do {                        \\
    int before = failed;                            \\
    body;                                           \\
    if (failed == before) { ++passed; printf("  ok  %s\\n", name); } \\
    else                  printf("FAIL  %s\\n", name); \\
} while (0)
#define EXPECT(cond) do { if (!(cond)) {             \\
    ++failed; fprintf(stderr, "  %s:%d: 断言失败: %s\\n", \\
                      __FILE__, __LINE__, #cond); } } while (0)

static int add(int a, int b) { return a + b; }

int main(void) {
    TEST("基本加法", { EXPECT(add(2,3) == 5); EXPECT(add(-1,1) == 0); });
    TEST("边界值",   { EXPECT(add(0,0) == 0); });
    printf("%d passed, %d failed\\n", passed, failed);
    return failed ? 1 : 0;
}`},
  {t:'code',lang:'Bash · 覆盖率统计',x:`# GCC：插桩编译 -> 运行 -> 生成报告
gcc -std=c2x -g -O0 --coverage main.c -o test_app
./test_app
gcov main.c                 # 生成 main.c.gcov，逐行标注执行次数
lcov --capture --directory . --output-file coverage.info
genhtml coverage.info --output-directory coverage_html

# Clang 对应： -fprofile-instr-generate -fcoverage-mapping`},
  {t:'table',head:['测试层次','测什么','工具'],rows:[
    ['单元测试','单个函数 / 模块','自写框架、Unity、CMocka、Criterion'],
    ['集成测试','模块间协作、文件与网络','脚本 + CLI 退出码'],
    ['回归测试','修过的 bug 不再出现','把复现用例固化进测试集'],
    ['模糊测试','随机/畸形输入下的崩溃','libFuzzer、AFL++、honggfuzz'],
    ['内存测试','泄漏、越界、UB','ASan / UBSan / Valgrind（见 6.4）'],
    ['覆盖率','哪些分支没跑到','gcov / lcov / llvm-cov']
  ]},
  {t:'note',kind:'tip',k:'覆盖率不是目标',x:'100% 行覆盖率不等于没有 bug：未覆盖的是<b>分支组合、边界值、错误路径</b>。优先给「解析外部输入」「内存管理」「错误恢复」写测试，这些地方缺陷密度最高；再配合模糊测试自动生成畸形输入，性价比远高于堆覆盖率数字。'},
  {t:'ex',k:'动手练一练',items:[
    '给 5.4 的哈希表写 5 个测试用例：插入、更新、查找未命中、删除、扩容。',
    '用 <code>gcov</code> 找出测试没覆盖的分支，并补一个用例覆盖它。',
    '把测试接进 6.2 的 CMake <code>add_test</code>，用 <code>ctest</code> 运行。'
  ]}
],

'c-6-4': [
  {t:'h',x:'深入：Sanitizer 能抓什么、怎么读报错'},
  {t:'p',x:'Sanitizer 是编译器插桩的运行时检查器，开发期开启几乎零成本就能挡住 C 里最危险的一整类错误。<b>ASan</b> 管内存（越界、use-after-free、重复释放、泄漏），<b>UBSan</b> 管未定义行为（溢出、移位、对齐、空指针解引用），<b>TSan</b> 管数据竞争（见 6.5）。它们不能同时全开（ASan 与 TSan 互斥），按需分别跑。'},
  {t:'code',lang:'Bash · 常用开关与环境变量',x:`# 开发期标配
gcc -std=c2x -g -O1 -fno-omit-frame-pointer \\
    -fsanitize=address,undefined main.c -o app
ASAN_OPTIONS=detect_leaks=1:halt_on_error=1 \\
UBSAN_OPTIONS=print_stacktrace=1 ./app

# 只查内存（性能更好，可长期开着跑测试）
clang -fsanitize=address -g -O1 main.c -o app_asan

# 只查未定义行为（开销最小，适合 CI 常开）
clang -fsanitize=undefined -fno-sanitize-recover=all -g main.c -o app_ubsan

# 数据竞争（不能与 ASan 同时用）
clang -fsanitize=thread -g -O1 main.c -o app_tsan`},
  {t:'table',head:['Sanitizer','典型报错','根因'],rows:[
    ['ASan','<code>heap-buffer-overflow</code>','数组/堆块越界读写'],
    ['ASan','<code>heap-use-after-free</code>','释放后继续使用'],
    ['ASan','<code>attempting double-free</code>','同一块内存释放两次'],
    ['ASan','<code>detected memory leaks</code>','分配后未释放'],
    ['UBSan','<code>signed integer overflow</code>','有符号溢出'],
    ['UBSan','<code>shift exponent too large</code>','移位位数越界'],
    ['UBSan','<code>misaligned address</code>','未对齐访问'],
    ['TSan','<code>data race</code>','多线程无同步地读写同一对象']
  ]},
  {t:'p',x:'读 ASan 报错的顺序：先看<b>错误类型</b>，再看 <code>READ/WRITE of size N at ...</code> 定位越界访问点，然后看 <code>allocated by thread T0 here:</code> 找到这块内存当初在哪分配，最后是「shadow bytes」图示确认越界方向。配合 <code>-g -fno-omit-frame-pointer</code>，栈回溯能精确到行号。'},
  {t:'note',kind:'warn',k:'Release 里别开 ASan',x:'Sanitizer 会显著增加内存占用（ASan 约 2~3 倍）并改变内存布局，只用于开发与测试构建。发布版应关掉 Sanitizer，但保留 <code>_FORTIFY_SOURCE=2</code>、栈保护 <code>-fstack-protector-strong</code>、PIE 与 RELRO 这类生产可用的加固选项。'},
  {t:'ex',k:'动手练一练',items:[
    '故意写 <code>int a[4]; a[4]=1;</code>，用 ASan 定位并读懂报错的三段信息。',
    '制造 <code>INT_MAX + 1</code>，用 UBSan 抓到并改用 <code>ckd_add</code> 修复（回顾 4.9）。',
    '对比同一程序在 <code>-O0</code> 与 <code>-O2</code> 下 UB 的表现差异。'
  ]}
],

'c-6-5': [
  {t:'h',x:'深入：数据竞争、互斥与原子操作'},
  {t:'p',x:'并发 bug 的根源是<b>数据竞争</b>：两个线程同时访问同一对象，至少一个在写，且没有同步。C11 起标准定义了内存模型，竞争属于未定义行为（不只是「结果不确定」）。标准库提供两条路：<code>&lt;threads.h&gt;</code> 的线程与互斥量，以及 <code>&lt;stdatomic.h&gt;</code> 的原子类型。'},
  {t:'code',lang:'C23 · 互斥量保护共享计数',x:`#include <stdio.h>
#include <threads.h>

#define NTHREADS 4
#define LOOPS    100000

static long counter = 0;
static mtx_t lock;

static int worker(void *arg) {
    (void)arg;
    for (int i = 0; i < LOOPS; ++i) {
        mtx_lock(&lock);
        ++counter;                 /* 临界区：必须串行 */
        mtx_unlock(&lock);
    }
    return 0;
}
int main(void) {
    thrd_t t[NTHREADS];
    mtx_init(&lock, mtx_plain);
    for (int i = 0; i < NTHREADS; ++i) thrd_create(&t[i], worker, nullptr);
    for (int i = 0; i < NTHREADS; ++i) thrd_join(t[i], nullptr);
    printf("counter=%ld (期望 %d)\\n", counter, NTHREADS * LOOPS);
    mtx_destroy(&lock);
    return 0;
}`},
  {t:'code',lang:'C23 · 原子版本（无锁）',x:`#include <stdio.h>
#include <threads.h>
#include <stdatomic.h>

static atomic_int counter = 0;

static int worker(void *arg) {
    (void)arg;
    for (int i = 0; i < 100000; ++i)
        atomic_fetch_add_explicit(&counter, 1, memory_order_relaxed);
    return 0;
}
int main(void) {
    thrd_t t[4];
    for (int i = 0; i < 4; ++i) thrd_create(&t[i], worker, nullptr);
    for (int i = 0; i < 4; ++i) thrd_join(t[i], nullptr);
    printf("counter=%d\\n", atomic_load(&counter));   // 400000
    return 0;
}`},
  {t:'table',head:['机制','开销','适用'],rows:[
    ['<code>mtx_t</code> 互斥量','较高（可能陷入内核）','保护一段临界区、多个变量的一致性'],
    ['<code>atomic_fetch_add</code>','低（一条指令）','单一计数器、标志位'],
    ['<code>atomic_flag</code> 自旋锁','低但占 CPU','极短临界区'],
    ['条件变量 <code>cnd_t</code>','配合互斥量','生产者-消费者、等待事件'],
    ['<code>thread_local</code>','每线程一份','避免共享，最彻底的解法'],
    ['<code>memory_order_relaxed</code>','最低','只要求原子性，不要求顺序（计数器）']
  ]},
  {t:'note',kind:'danger',k:'volatile 不是同步',x:'<code>volatile</code> 只阻止编译器优化掉访问，<b>不提供原子性、也不建立线程间同步</b>。多线程共享状态一律用 <code>atomic_*</code> 或互斥量。另外 <code>errno</code>、<code>thread_local</code> 是每线程一份，而 <code>static</code> 局部变量是共享的——函数内 static 计数器在多线程下会竞争。'},
  {t:'p',x:'内存序是进阶话题：<code>relaxed</code> 只保证原子，<code>release/acquire</code> 用来在线程间传递「此前写入可见」，<code>seq_cst</code> 是默认且最强。经验法则：<b>计数用 relaxed，发布数据用 release/acquire，拿不准就用默认 seq_cst</b>，别凭直觉降序优化。'},
  {t:'ex',k:'动手练一练',items:[
    '去掉上面互斥量版本里的锁，多次运行观察 counter 是否小于期望值。',
    '用 <code>mtx_t + cnd_t</code> 实现一个有界生产者-消费者队列。',
    '用 TSan 编译无锁版本，确认没有 data race 报告。'
  ]}
],

'c-6-6': [
  {t:'h',x:'深入：POSIX 常用调用与标准 C 的边界'},
  {t:'p',x:'标准 C 只覆盖语言与基础库；一旦涉及进程、文件描述符、信号、socket、时间、目录，就进入 POSIX（Linux/macOS/BSD）或 Win32 的领地。跨平台代码的常见做法是把这些调用封在一个 <code>platform_*.c</code> 里，用条件编译选择实现，业务层只依赖抽象接口。'},
  {t:'table',head:['能力','POSIX 调用','标准 C 对应'],rows:[
    ['文件描述符 I/O','<code>open/read/write/close</code>','<code>fopen/fread/fwrite/fclose</code>'],
    ['目录遍历','<code>opendir/readdir/closedir</code>','无'],
    ['进程','<code>fork/exec/waitpid</code>','<code>system</code>（能力很弱）'],
    ['高精度时间','<code>clock_gettime</code>','<code>clock / timespec_get</code>'],
    ['内存映射','<code>mmap/munmap</code>','无'],
    ['网络','<code>socket/connect/send/recv</code>','无'],
    ['线程（更常用）','<code>pthread_*</code>','<code>&lt;threads.h&gt;</code>'],
    ['错误处理','<code>errno + strerror_r</code>','<code>errno + strerror</code>']
  ]},
  {t:'code',lang:'POSIX · 用文件描述符复制文件',x:`#include <stdio.h>
#include <fcntl.h>
#include <unistd.h>
#include <errno.h>

int main(int argc, char **argv) {
    if (argc != 3) return 2;
    int in = open(argv[1], O_RDONLY);
    if (in < 0) { perror("open src"); return 1; }
    int out = open(argv[2], O_WRONLY | O_CREAT | O_TRUNC, 0644);
    if (out < 0) { perror("open dst"); close(in); return 1; }

    char buf[8192];
    ssize_t n;
    while ((n = read(in, buf, sizeof buf)) > 0) {
        ssize_t off = 0;
        while (off < n) {                 /* 处理部分写入 */
            ssize_t w = write(out, buf + off, (size_t)(n - off));
            if (w < 0) { if (errno == EINTR) continue; perror("write"); goto fail; }
            off += w;
        }
    }
    if (n < 0) { perror("read"); goto fail; }
    close(in); close(out);
    return 0;
fail:
    close(in); close(out);
    return 1;
}`},
  {t:'note',kind:'warn',k:'两类容易漏的细节',x:'① <code>read/write</code> 可能返回<b>短计数</b>（尤其管道、socket、被信号中断），必须循环处理并对 <code>EINTR</code> 重试；② 所有系统调用都要检查返回值，<code>-1</code> 时读 <code>errno</code>。相比之下标准 C 的 <code>fread/fwrite</code> 已经帮你处理了部分缓冲细节。'},
  {t:'p',x:'包含 POSIX 头文件前通常要定义特性测试宏（如 <code>#define _POSIX_C_SOURCE 200809L</code>），否则 <code>getline</code>、<code>strdup</code>、<code>clock_gettime</code> 等声明可能不可见。用 <code>-std=c2x -Wpedantic</code> 编译时尤其容易遇到，别用「关掉 -Wpedantic」来绕过。'},
  {t:'ex',k:'动手练一练',items:[
    '把 3.4 的 <code>FILE*</code> 复制程序与上面的 fd 版本对比，列出各自处理的边界情况。',
    '用 <code>opendir/readdir/stat</code> 写一个递归统计目录总大小的程序。',
    '用 <code>clock_gettime(CLOCK_MONOTONIC)</code> 给排序算法计时，比较 <code>clock()</code> 的差异。'
  ]}
],

'c-6-7': [
  {t:'h',x:'深入：缓存友好的数据结构与测量方法'},
  {t:'p',x:'现代 CPU 与内存之间差着两三个数量级：一次 L1 命中约 1 ns，一次主存访问可能上百纳秒。因此性能瓶颈常常不是「指令数」而是<b>等内存</b>。优化的第一原则是<b>让数据连续、让访问顺序可预测</b>——这正是数组优于链表、结构体数组（AoS）与数组结构体（SoA）之争的核心。'},
  {t:'table',head:['做法','效果','代价'],rows:[
    ['连续数组代替指针链','大幅减少 cache miss','插入删除需搬移'],
    ['行优先遍历二维数组','顺序访问命中率高','列优先会跨行跳转'],
    ['SoA 拆分热字段','只加载真正用到的字段','代码可读性下降'],
    ['按 64 字节对齐 <code>alignas(64)</code>','避免伪共享（多线程）','内存占用增加'],
    ['小对象内联而非指针','少一次跳转','结构体变大'],
    ['分支预测友好','排序后再处理可减少误预测','需实测']
  ]},
  {t:'code',lang:'C23 · 行/列遍历与 alignas',x:`#include <stdio.h>
#include <stdlib.h>
#include <time.h>

#define N 2048

static double now_ms(void) {
    struct timespec ts;
    timespec_get(&ts, TIME_UTC);
    return ts.tv_sec * 1000.0 + ts.tv_nsec / 1e6;
}
int main(void) {
    size_t bytes = (size_t)N * N * sizeof(int);
    int *m = aligned_alloc(64, bytes);       // C11 起，按缓存行对齐
    if (!m) return 1;
    for (size_t i = 0; i < (size_t)N*N; ++i) m[i] = (int)i;

    double t0 = now_ms();
    long s1 = 0;
    for (int i = 0; i < N; ++i)              // 行优先：连续
        for (int j = 0; j < N; ++j) s1 += m[i*N+j];
    double t1 = now_ms();

    long s2 = 0;
    for (int j = 0; j < N; ++j)              // 列优先：每次跨 N 个 int
        for (int i = 0; i < N; ++i) s2 += m[i*N+j];
    double t2 = now_ms();

    printf("行优先 %.1f ms, 列优先 %.1f ms, 校验 %s\\n",
           t1-t0, t2-t1, s1==s2?"一致":"不一致");
    free(m);
    return 0;
}`},
  {t:'p',x:'优化流程必须是<b>测量 → 定位 → 改动 → 再测量</b>。先用一个足够大的、贴近真实的数据集建立基准，再用 <code>perf</code>（Linux）、<code>valgrind --tool=cachegrind</code> 或 <code>clang -fsanitize=...</code> 找热点。凭直觉把 <code>i++</code> 改成 <code>++i</code>、手动展开循环这类微优化，编译器在 <code>-O2</code> 下早就做了，通常测不出差别。'},
  {t:'note',kind:'tip',k:'先改算法，再改布局，最后才谈指令',x:'优先级：① 降低复杂度 / 减少不必要的工作；② 改善数据布局与局部性；③ 减少分配次数（对象池、批量处理）；④ 才考虑 SIMD、内联汇编等。另外 <code>-O2 -flto</code> 常能带来免费收益，发布构建别忘了开。'},
  {t:'ex',k:'动手练一练',items:[
    '运行上面的行/列遍历程序，记录两种顺序的耗时比，并改变 N 观察曲线。',
    '把链表版与数组版的「求 100 万个整数之和」对比计时。',
    '用 <code>perf stat -e cache-misses</code> 测量两种遍历的缓存未命中数。'
  ]}
],

'c-6-8': [
  {t:'h',x:'深入：静态分析、格式化与代码规范落地'},
  {t:'p',x:'把质量检查<b>自动化并放进提交流程</b>，比写一份没人看的规范文档有效得多。最小可行组合：编译器警告全开 + <code>-Werror</code>、<code>clang-format</code> 统一格式、一个静态分析器、提交前钩子或 CI 里统一执行。'},
  {t:'table',head:['工具','作用','接入方式'],rows:[
    ['<code>gcc/clang -Wall -Wextra -Wpedantic -Werror</code>','编译期警告','构建脚本固定'],
    ['<code>clang-tidy</code>','语义级检查、现代化建议','<code>compile_commands.json</code>'],
    ['<code>cppcheck</code>','轻量静态分析，无需编译数据库','CI 单步执行'],
    ['<code>clang-format</code>','统一缩进/换行/空格','pre-commit 钩子'],
    ['ASan / UBSan / TSan','运行时检查','Debug 构建 + 测试（见 6.4）'],
    ['<code>include-what-you-use</code>','头文件依赖清理','可选'],
    ['<code>sparse / smatch</code>','内核风格检查','特定领域']
  ]},
  {t:'code',lang:'Bash · 一条命令串起检查流水线',x:`#!/bin/sh
set -e
# 1) 格式检查（不改动文件，只报告差异）
clang-format --dry-run --Werror src/*.c include/*.h

# 2) 严格编译
cmake -S . -B build -DCMAKE_EXPORT_COMPILE_COMMANDS=ON
cmake --build build -- -j

# 3) 静态分析
cppcheck --enable=warning,performance,portability --error-exitcode=1 \\
         --inline-suppr -I include src/

# 4) 测试（Debug + Sanitizer 构建见 6.2 / 6.4）
ctest --test-dir build --output-on-failure`},
  {t:'note',kind:'tip',k:'规范要可执行才有意义',x:'把规范写进 <code>.clang-format</code>、<code>.clang-tidy</code> 与 Makefile，让「符合规范」变成一条能通过/失败的命令，而不是 code review 时的主观争论。团队统一一份配置、提交进仓库，比任何文档都管用。'},
  {t:'p',x:'C 项目里值得写进规范的具体条目：所有公开函数写文档注释说明所有权与错误码；禁止在头文件放外部链接定义；禁止裸 <code>strcpy/strcat/gets</code>；所有分配检查返回值；下标统一用 <code>size_t</code>；内部函数一律 <code>static</code>；宏名全大写且参数加括号。这些大多能被上述工具自动检查。'},
  {t:'ex',k:'动手练一练',items:[
    '为项目写一份 <code>.clang-format</code>，并对现有源文件跑一次格式化，检查 diff。',
    '用 <code>cppcheck</code> 扫描 3.1 的 <code>Vec</code> 实现，看是否报出资源问题。',
    '把上面的检查脚本接进 git pre-commit 钩子（或 CI 配置）。'
  ]}
],

'c-6-9': [
  {t:'h',x:'全卷速查表与后续学习路线'},
  {t:'p',x:'学完六章，你已经覆盖了 C23 的语言核心、标准库、数据结构实现与工程实践。下面这张表把最容易混淆的点集中起来，供随时回查；之后给出三条可继续深入的路线。'},
  {t:'table',head:['主题','一句话要点','回到'],rows:[
    ['<code>const</code> vs <code>constexpr</code>','前者只读对象，后者才是编译期常量','1.6 / 4.3'],
    ['数组退化','作为函数参数时变成首元素指针，长度要另传','2.4 / 2.7'],
    ['指针 const 位置','<code>const</code> 在 <code>*</code> 左管对象，在右管指针','2.6'],
    ['序列点','同一表达式里既读又改同一对象多半是 UB','1.7'],
    ['<code>memcpy</code> vs <code>memmove</code>','重叠区间只能用 memmove','2.5'],
    ['结构体不可 <code>==</code>','填充字节不确定，逐成员比较','2.9'],
    ['头文件只放声明','定义放 .c，否则 multiple definition','3.6'],
    ['断言不处理外部错误','发布版 <code>NDEBUG</code> 会把它编译掉','3.9'],
    ['<code>NULL</code> vs <code>nullptr</code>','后者有类型 <code>nullptr_t</code>，C23 首选','4.2'],
    ['<code>auto</code> 语义已变','C23 是类型推断，不是存储类','4.8'],
    ['溢出检查','<code>ckd_add/sub/mul</code>，尤其 <code>n*sizeof(T)</code>','4.9'],
    ['<code>volatile</code> ≠ 线程同步','用 atomic 或互斥量','6.5']
  ]},
  {t:'steps',items:[
    ['路线 A · 系统方向','读《CS:APP》配合写 malloc 实现、简易 shell、小型文件系统；再进 Linux 内核模块与驱动。重点补：链接与装载、虚拟内存、系统调用。'],
    ['路线 B · 语言实现方向','用 C 写一个词法分析器 → 递归下降语法分析 → 字节码虚拟机；这正是「工艺篇」要讲的内容，也能反过来深化对指针、结构体、内存布局的理解。'],
    ['路线 C · 工程方向','把一个个人项目做成完整的库：公开头文件、CMake 构建、单元测试 + 覆盖率、CI、ASan/TSan、API 文档、语义化版本发布。重点补：ABI 兼容与错误处理设计。']
  ]},
  {t:'cards',items:[
    ['推荐的编译器组合','开发：<code>clang -O0 -g -fsanitize=address,undefined</code>；发布：<code>gcc -O2 -flto -D_FORTIFY_SOURCE=2</code>'],
    ['推荐常开选项','<code>-std=c2x -Wall -Wextra -Wpedantic -Werror -Wconversion -Wshadow</code>'],
    ['推荐工具','clang-format、clang-tidy、cppcheck、valgrind、perf、Compiler Explorer'],
    ['推荐练习','把本卷每个示例都改坏一次，再用 Sanitizer 找出来——比多读三遍更有效']
  ]},
  {t:'note',kind:'tip',k:'关于 C* 语言',x:'本卷甲部的 C* 语言是「以中文关键字 + 运行时安全检查 + 一行开窗口」为特色的教学语言，工具链会先把 <code>.cask</code> 编译成汇编再生成可执行文件。学完 C 之后再回头看 8.4「从 C* 走向 C23」，会对「语言设计如何取舍」有完全不同的体会。'},
  {t:'ex',k:'结业练习',items:[
    '把第 5 章的链表、哈希表、BST 整合成一个带单元测试与 CMake 构建的小库。',
    '用 <code>#embed</code> + <code>_Generic</code> + <code>constexpr</code> 写一个「编译期资源表」示例，用上至少 5 个 C23 新特性。',
    '给任意一个模块补上完整头文件注释（所有权、错误码、失败后状态），并让 CI 通过 <code>-Werror</code> + ASan + 单元测试。'
  ]}
]

};
