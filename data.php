<?php
/**
 * data.php —— 集卡系统数据源
 * 在支持 PHP 的服务器上，js/main.js 会优先从这里读取卡牌数据；
 * 静态托管（如 GitHub Pages）不支持 PHP 时，自动使用 main.js 内置的兜底数据。
 */
header('Content-Type: application/json; charset=utf-8');

$cards = [
  ['name' => '爱国福',   'tag' => '福卡 · 壹',     'rare' => '稀有度 ★★★',   'poem' => '苟利国家生死以<br>岂因祸福避趋之',     'bless' => '愿山河无恙，家国永安。此心如炬，与君共赴新程。'],
  ['name' => '富强福',   'tag' => '福卡 · 贰',     'rare' => '稀有度 ★★★★', 'poem' => '仓廪实而知礼节<br>衣食足而知荣辱',     'bless' => '愿仓廪丰实，百业兴旺；手中有粮，心中有光。'],
  ['name' => '和谐福',   'tag' => '福卡 · 叁',     'rare' => '稀有度 ★★☆',   'poem' => '家和万事兴<br>人和百业旺',             'bless' => '愿阖家和睦，邻里相亲；一屋两人的烟火，胜过万家灯火。'],
  ['name' => '友善福',   'tag' => '福卡 · 肆',     'rare' => '稀有度 ★★★',   'poem' => '上善若水<br>水善利万物而不争',         'bless' => '愿与人为善，温柔相待；你给出的善意，都会绕回来。'],
  ['name' => '敬业福',   'tag' => '福卡 · 伍',     'rare' => '稀有度 ★★★★★', 'poem' => '业精于勤荒于嬉<br>行成于思毁于随',     'bless' => '愿心无旁骛，事事有成；白天写代码，晚上开直播，皆是热爱。'],
  ['name' => 'FC235',    'tag' => '特别 · 人物牌', 'rare' => '人物牌 ★★★★★', 'poem' => '白天写代码，晚上开直播<br>网站自己手搓', 'bless' => '站长本尊，VS2026 般可靠——编译通过，人生顺遂。'],
  ['name' => 'rcl',      'tag' => '隐藏 · 人物牌', 'rare' => '隐藏款 ★★★★★★', 'w' => 4, 'poem' => 'WORLD 1-1<br>橘猫常驻 · 喵~',          'bless' => '像素世界里的特别支持者——全站最难抽到的一张，嘘，别告诉 rcl。'],
  ['name' => 'JGhuihui', 'tag' => '特别 · 人物牌', 'rare' => '人物牌 ★★★★',  'poem' => 'wow<br>液态玻璃 · 折射万千',           'bless' => 'QIU 科技作者——像四层折射玻璃一样通透的人。'],
  ['name' => 'zhangsen', 'tag' => '特别 · 人物牌', 'rare' => '人物牌 ★★★★',  'poem' => 'NODE-Z2 / 2092<br>由 zhangsen 强力驱动', 'bless' => '来自 2092 的支持者——扫描线之下的硬核浪漫。'],
  ['name' => 'JNL OS',   'tag' => '联动 · JNL',    'rare' => '联动牌 ★★★★',  'poem' => '安全 · 稳定 · 高效<br>3GB 内存流畅运行', 'bless' => 'Java Net Lava OS——基于 Debian 13 的 Cinnamon 发行版，开箱即用、离线部署。jnlos.netlify.app'],
  ['name' => '云梦分享站', 'tag' => '联动 · YUNMENG', 'rare' => '联动牌 ★★★★', 'poem' => '迎新纳福 · 2027<br>软件分享 × 在线工具', 'bless' => '云梦分享站 × zhangfangcheng.cn 联动——精选软件、在线工具、安全绿色、极速直链。yunmeng.de5.net'],
];

echo json_encode($cards, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
