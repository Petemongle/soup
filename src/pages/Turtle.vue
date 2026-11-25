<template>
  <main class="turtle-page">
    <div class="turtle-grain" aria-hidden="true"></div>

    <nav class="topbar shell turtle-nav" aria-label="海龟汤页面导航">
      <a class="brand" href="/">
        <span class="brand__mark" aria-hidden="true">🍲</span>
        <span class="brand__copy">
          <strong>TURTLE SOUP</strong>
          <span>海龟汤内测间</span>
        </span>
      </a>
      <div class="turtle-nav__right">
        <span class="turtle-status"><i aria-hidden="true"></i> AI 在线</span>
        <a class="turtle-back" href="/result">返回结果页</a>
      </div>
    </nav>

    <!-- 档案列表 -->
    <section v-if="!activeCase" class="turtle-wrap">
      <header class="turtle-hero">
        <p class="turtle-hero__kicker">AI TURTLE SOUP · CLOSED BETA 001</p>
        <h1>选一锅汤<span aria-hidden="true">_</span></h1>
        <p>
          四份回忆档案躺在柜子里，其中三份是完整的。<br />
          挑一份打开，向它提问——它只会回答三个词。
        </p>
      </header>

      <ul class="soup-list">
        <li v-for="item in soupCases" :key="item.id" class="soup-list__item">
          <button
            class="soup-item"
            :class="`soup-item--${item.mood}`"
            type="button"
            @click="openCase(item)"
          >
            <span class="soup-item__no">{{ item.no }}</span>
            <span class="soup-item__body">
              <span class="soup-item__title" :data-text="item.title">{{ item.title }}</span>
              <span class="soup-item__stars" :aria-label="`难度 ${item.stars} 星`">
                {{ '⭐'.repeat(item.stars) }}
              </span>
            </span>
            <span class="soup-item__meta">
              <span class="soup-item__tag">{{ item.tag }}</span>
              <span class="soup-item__arrow" aria-hidden="true">→</span>
            </span>
          </button>
        </li>
      </ul>

      <p class="soup-list__foot">
        AI 只会回答：<strong>是</strong>、<strong>不是</strong>、<strong>无关</strong>。用「X 是 Y 吗」或「有 X 吗」提问，问对主体，汤底才会浮上来。
      </p>
    </section>

    <!-- 对话窗口 -->
    <section v-else class="chat-shell" :class="{ 'chat-shell--broken': activeCase.mood === 'broken' }" aria-label="海龟汤对话窗口">
      <header class="chat-head">
        <button class="chat-head__back" type="button" @click="closeCase">
          <span aria-hidden="true">←</span> 档案列表
        </button>
        <div class="chat-head__case">
          <strong :class="{ 'chat-head__case--broken': activeCase.mood === 'broken' }">
            {{ activeCase.title }}
          </strong>
          <span class="chat-head__stars">{{ '⭐'.repeat(activeCase.stars) }}</span>
        </div>
        <span class="chat-head__model">TURTLE-AI v0.1 · local</span>
      </header>

      <div
        class="chat-progress"
        :class="{ 'chat-progress--ready': canReveal, 'chat-progress--capped': !gatesPassed }"
      >
        <div class="chat-progress__head">
          <span class="chat-progress__label">线索进度</span>
          <span class="chat-progress__pct">{{ progress }}%</span>
        </div>
        <div
          class="chat-progress__track"
          role="progressbar"
          :aria-valuenow="progress"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-label="线索解密进度"
        >
          <i :style="{ width: `${progress}%` }"></i>
          <span class="chat-progress__mark" aria-hidden="true"></span>
        </div>
        <span class="chat-progress__meta">{{ progressMeta }}</span>
      </div>

      <div ref="logEl" class="chat-log" aria-live="polite">
        <article class="chat-brief">
          <p class="chat-brief__kicker">汤面 / {{ activeCase.no }}</p>
          <p v-for="(line, index) in activeCase.surface" :key="index" class="chat-brief__line">
            {{ line }}
          </p>
        </article>

        <p v-if="!messages.length && !thinking" class="chat-hint">
          {{ activeCase.mood === 'broken' ? '……它已经看见你了。' : '先问「有 X 吗」，再问「X 是 Y 吗」——问对主体，进度就会往上走。' }}
        </p>

        <template v-for="(item, index) in messages" :key="index">
          <p v-if="item.role === 'system'" class="msg-system">{{ item.text }}</p>
          <div v-else class="msg" :class="`msg--${item.role}`">
            <span class="msg__avatar" aria-hidden="true">{{ item.role === 'ai' ? '🍲' : '你' }}</span>
            <div class="msg__body">
              <div class="msg__bubble" :class="{ 'msg__bubble--gate': item.gate }">
                <span v-if="item.gate" class="msg__gate" aria-label="关键问题" title="关键问题">🌺</span>
                <p>{{ item.text }}</p>
              </div>
              <span v-if="item.gate" class="msg__gate-tag">关键问题</span>
              <span v-if="item.gain" class="msg__gain">线索 +{{ item.gain }} 分</span>
            </div>
          </div>
        </template>

        <div v-if="thinking" class="msg msg--ai">
          <span class="msg__avatar" aria-hidden="true">🍲</span>
          <div class="msg__bubble msg__bubble--typing">
            <i></i><i></i><i></i>
          </div>
        </div>

        <Transition name="truth">
          <article v-if="revealed" ref="truthEl" class="truth-card">
            <p class="truth-card__kicker">THE BOTTOM OF THE SOUP</p>
            <h2>汤底</h2>
            <p v-for="(line, index) in activeCase.truth" :key="index">{{ line }}</p>
            <div class="truth-card__actions">
              <button class="btn btn--primary" type="button" @click="resetChat">再问一次</button>
              <button class="btn btn--ghost" type="button" @click="closeCase">换一锅汤</button>
            </div>
          </article>
        </Transition>
      </div>

      <div class="chat-compose">
        <form class="chat-compose__form" @submit.prevent="ask">
          <textarea
            ref="inputEl"
            v-model="draft"
            class="chat-compose__input"
            rows="1"
            maxlength="120"
            :disabled="!canAsk"
            :placeholder="inputPlaceholder"
            aria-label="向 AI 提问"
            @keydown.enter.exact.prevent="ask"
          ></textarea>
          <button class="chat-compose__send" type="submit" :disabled="!draft.trim() || !canAsk">
            <span>发送</span>
          </button>
        </form>
        <div class="chat-compose__foot">
          <span class="chat-compose__hint">AI 只会回答：是 / 不是 / 无关</span>
          <span class="chat-compose__count">已问 {{ asked }} 题</span>
          <span class="chat-compose__spacer"></span>
          <span v-if="revealed" class="chat-compose__done">汤底已解锁</span>
          <button v-else-if="canReveal" class="chat-compose__link" type="button" @click="reveal">
            查看汤底
          </button>
          <span v-else class="chat-compose__lock">
            {{ missingGates ? `还差 ${missingGates} 个关键问题` : '进度 80% 解锁汤底' }}
          </span>
          <button class="chat-compose__link chat-compose__link--ghost" type="button" @click="resetChat">
            重开
          </button>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, ref } from 'vue'

const REVEAL_AT = 80
const TARGET_POINTS = 100
const GATE_CAP = 79

// 门槛问题：这两条没问出来，进度上限永远是 79%
const CASE_GATES = {
  'soup-1': ['mother-assault', 'me-guilty'],
  'soup-2': ['brother-dead', 'family-hide'],
  'soup-3': ['her-dead', 'phone-herself'],
  'soup-4': ['it-remember', 'pot-closed']
}

const SYNTAX_HINT = '提示：试着用「X 是 Y 吗」或「有 X 吗」的句式问，会比较准。'

/*
 * 三元素 / 汤型：默认主体就是「这个故事本身」。
 * 玩家问「清汤吗」「有超自然现象吗」时可以不提主体，直接关键词命中。
 */
const META_RULES = [
  { id: 'meta-clear', w: 8, match: /清汤|没有死人|没人死|不死人|没有人死/, flag: (m) => m.soup === 'clear' },
  { id: 'meta-red', w: 8, match: /红汤|死人了|有人死|有死人|死了人|死过人/, flag: (m) => m.soup === 'red' },
  { id: 'meta-black', w: 4, match: /黑汤|重口味|血腥|猎奇|恶心/, flag: (m) => m.soup === 'black' },
  { id: 'meta-wangba', w: 4, match: /王八汤|玩梗|抽象|无语|搞笑|梗汤/, flag: (m) => m.soup === 'wangba' },
  { id: 'meta-honkaku', w: 10, match: /本格/, flag: (m) => m.honkaku },
  {
    id: 'meta-henkaku',
    w: 10,
    match: /变格|超自然|灵异|鬼|玄幻|非现实|穿越|时间循环/,
    flag: (m) => !m.honkaku
  },
  { id: 'meta-sane', w: 8, match: /精神疾病|精神病|心理疾病|幻觉|妄想/, flag: (m) => !m.sane }
]

/*
 * 问答模型：主体（entity）+ 属性（attr）
 * - 先从句子里找出已知主体（entities[].re）
 * - 「有 X 吗 / X 存在吗」→ 存在性，按 entity.exists 回答
 * - 「X 是 Y 吗」→ 是非性，看 Y 是否命中该主体的属性表
 * - 主体没收录、或属性没收录 → 无关。
 */

const soupCases = [
  {
    id: 'soup-1',
    no: 'NO.001',
    title: '戒骨记',
    stars: 3,
    tag: '信号稳定',
    mood: 'normal',
    meta: { soup: 'clear', honkaku: true, sane: true },
    surface: [
      '母亲每天都带肉骨头回来给你炖一锅你最爱吃的肉骨头汤。',
      '某天，你无意间看见母亲身上带血，从巷子里走了出来。',
      '从这天起，你再也没法喝下那碗汤了。'
    ],
    truth: [
      '家里很穷。母亲打着收入微薄的零工，根本买不起肉骨头。',
      '为了让你能喝上汤，她去接近肉铺的单身汉老板，用打扫、洗衣这样的活计，换每天卖剩下的骨头。',
      '那天她回家晚了，你出门找她，正撞见她从小巷里跑出来，身上带血——老板想对她动手，她拼命反抗，两个人都挂了彩。',
      '她原本不想让事情闹大，更不想让你知道。可在你不断追问下，她还是说了。',
      '于是你想起这些年心安理得喝下的每一碗汤，巨大的愧疚压下来，你再也无法直视那锅汤。'
    ],
    orphan: [
      { match: /死人|死了|命案|尸体|红汤|谋杀/, answer: '不是。', id: 'no-death', w: 4 }
    ],
    entities: [
      {
        id: 'me',
        re: /我(?!们)|自己|儿子|小孩/,
        exists: true,
        existW: 0,
        attrs: [
          { id: 'me-love', w: 3, match: /爱吃|喜欢|馋|想吃|爱喝/, answer: '是。' },
          { id: 'me-guilty', w: 12, match: /愧疚|内疚|自责|后悔|崩溃|难受|痛苦/, answer: '是。' },
          { id: 'me-ignore', w: 4, match: /不知道|不知情|被瞒|瞒着|蒙在鼓里/, answer: '是。' },
          { id: 'me-afford', w: 10, match: /吃得起|有钱|富裕|宽裕|买得起|舍得/, answer: '不是。' },
          { id: 'me-boy', w: 3, match: /男孩|儿子|小孩|学生/, answer: '是。' },
          { id: 'me-kill', w: 5, match: /凶手|杀人|杀了/, answer: '不是。' },
          { id: 'me-dead', w: 4, match: /死|去世/, answer: '不是。' }
        ]
      },
      {
        id: 'mother',
        re: /母亲|妈妈|我妈|娘|她/,
        exists: true,
        existW: 8,
        specials: [{ match: /血/, answer: '是也不是。', id: 'mother-blood', w: 6 }],
        attrs: [
          { id: 'mother-good', w: 3, match: /好人|善良|疼|保护|为孩子/, answer: '是。' },
          { id: 'mother-injured', w: 12, match: /受伤|挂彩|流血|伤口|被打|淤青|擦伤/, answer: '是。' },
          { id: 'mother-assault', w: 12, match: /强暴|强奸|侵犯|非礼|骚扰|欺负|迫害|伤害|强迫|胁迫|威胁|逼|动手|图谋不轨/, answer: '是。' },
          { id: 'mother-exchange', w: 10, match: /换|交换|交易|报酬|代价|抵扣|抵/, answer: '是。' },
          { id: 'mother-resist', w: 4, match: /反抗|挣扎|搏斗|抵抗|挣脱/, answer: '是。' },
          { id: 'mother-poor', w: 5, match: /穷|没钱|买不起|贫困|拮据|困难/, answer: '是。' },
          { id: 'mother-work', w: 4, match: /零工|打工|干活|打扫|洗衣|家政|做家务|劳动|工作/, answer: '是。' },
          { id: 'mother-late', w: 3, match: /晚归|回家晚|很晚|深夜|加班/, answer: '是。' },
          { id: 'mother-soup', w: 3, match: /炖汤|煮汤|做汤|熬汤/, answer: '是。' },
          { id: 'mother-hide', w: 5, match: /隐瞒|瞒着|不想让|没说|骗/, answer: '是。' },
          { id: 'mother-alive', w: 3, match: /活着|还在|平安/, answer: '是。' },
          { id: 'mother-kill', w: 6, match: /杀|凶手|害死/, answer: '不是。' },
          { id: 'mother-dead', w: 4, match: /死|去世|身亡/, answer: '不是。' },
          { id: 'mother-rich', w: 4, match: /有钱|富裕|吃得起|买得起/, answer: '不是。' },
          { id: 'mother-bad', w: 3, match: /坏人|恶人/, answer: '不是。' },
          { id: 'mother-willing', w: 4, match: /自愿|愿意|主动|勾引|卖淫|妓|出轨|通奸/, answer: '不是。' }
        ]
      },
      {
        id: 'bone',
        re: /肉骨头|骨头|排骨|肉(?!铺)|骨髓|汤(?!底)/,
        exists: true,
        existW: 0,
        attrs: [
          { id: 'bone-human', w: 9, match: /人骨|人的骨头|人体|尸体|人肉|人的/, answer: '不是。' },
          { id: 'bone-pig', w: 9, match: /猪|动物|普通|可食用|能吃|食用|牛|羊|鸡/, answer: '是。' },
          { id: 'bone-free', w: 3, match: /便宜|剩|免费|白给|不要钱|卖剩/, answer: '是。' },
          { id: 'bone-exchange', w: 4, match: /换|交换|得来|别人给|送|报酬/, answer: '是。' },
          { id: 'bone-tasty', w: 2, match: /好吃|爱吃|香/, answer: '是。' },
          { id: 'bone-buy', w: 3, match: /买|花钱|付钱|购/, answer: '不是。' },
          { id: 'bone-steal', w: 3, match: /偷|抢|盗/, answer: '不是。' },
          { id: 'bone-poison', w: 3, match: /毒|有害|下毒/, answer: '不是。' }
        ]
      },
      {
        id: 'third',
        re: /第三人|第三者|外人|别人|其他人|旁人/,
        exists: true,
        existW: 10,
        attrs: [
          { id: 'third-man', w: 4, match: /男|男人|男性/, answer: '是。' },
          { id: 'third-butcher', w: 6, match: /老板|屠夫|卖肉|肉铺/, answer: '是。' },
          { id: 'third-friend', w: 3, match: /朋友|亲戚|邻居|家人|同学/, answer: '不是。' },
          { id: 'third-woman', w: 3, match: /女|女人|女性/, answer: '不是。' }
        ]
      },
      {
        id: 'butcher',
        re: /肉铺老板|肉铺|肉店|屠夫|卖肉的|摊主|老板|单身汉/,
        exists: true,
        existW: 0,
        attrs: [
          { id: 'butcher-assault', w: 7, match: /强暴|强奸|侵犯|非礼|动手|图谋不轨|欺负|骚扰/, answer: '是。' },
          { id: 'butcher-injured', w: 4, match: /受伤|挂彩|流血|伤口/, answer: '是。' },
          { id: 'butcher-single', w: 4, match: /单身|未婚|一个人|独居/, answer: '是。' },
          { id: 'butcher-man', w: 3, match: /男|男人|男性/, answer: '是。' },
          { id: 'butcher-kill', w: 4, match: /杀|凶手|害死/, answer: '不是。' },
          { id: 'butcher-dead', w: 3, match: /死|去世/, answer: '不是。' },
          { id: 'butcher-husband', w: 4, match: /丈夫|老公|父亲|爸爸|结婚|已婚/, answer: '不是。' }
        ]
      },
      {
        id: 'alley',
        re: /巷子|小巷|巷口|胡同|巷/,
        exists: true,
        existW: 0,
        attrs: [
          { id: 'alley-incident', w: 6, match: /出事|发生|有人|事件|冲突/, answer: '是。' },
          { id: 'alley-night', w: 3, match: /晚上|深夜|夜里|凌晨/, answer: '是。' },
          { id: 'alley-home', w: 2, match: /家|屋里|室内/, answer: '不是。' },
          { id: 'alley-empty', w: 2, match: /空的|没人|空无/, answer: '不是。' }
        ]
      },
      {
        id: 'blood',
        re: /血(?!管|统|亲)/,
        exists: true,
        existW: 0,
        specials: [
          { match: /母亲|我妈|她/, answer: '是也不是。', id: 'blood-mother', w: 10 },
          { match: /老板|屠夫|男人|对方/, answer: '是。', id: 'blood-boss', w: 5 },
          { match: /动物|猪|鸡/, answer: '不是。', id: 'blood-animal', w: 3 },
          { match: /人|尸体/, answer: '不是。', id: 'blood-human', w: 4 }
        ],
        attrs: [
          { id: 'blood-real', w: 4, match: /真的|有|存在|身上|受伤|流/, answer: '是。' }
        ]
      }
    ]
  },
  {
    id: 'soup-2',
    no: 'NO.002',
    title: '多出来的那把椅子',
    stars: 2,
    tag: '档案完整',
    mood: 'normal',
    meta: { soup: 'red', honkaku: true, sane: true },
    surface: [
      '每个周日，他们都会在餐桌前拍一张全家福。',
      '这次的照片洗出来，桌边多了一把椅子。',
      '椅子上摆着一只空碗，碗里的汤还是热的。'
    ],
    truth: [
      '十年前的某个周日，弟弟坐在那把椅子上等开饭。',
      '他嫌汤太淡，端着碗去了厨房——然后楼道塌了。',
      '家里人没有撤掉那把椅子，也没有告诉新来的孩子。',
      '所以每张照片里，那把椅子都是满的，汤都是热的。'
    ],
    entities: [
      {
        id: 'brother',
        re: /弟弟|哥哥|他|男孩/,
        exists: true,
        existW: 10,
        attrs: [
          { id: 'brother-dead', w: 12, match: /死|去世|不在了|没回来|遇难/, answer: '是。' },
          { id: 'brother-alive', w: 4, match: /活着|还在|回来|平安/, answer: '不是。' },
          { id: 'brother-child', w: 3, match: /小孩|孩子|男孩|学生/, answer: '是。' },
          { id: 'brother-chair', w: 3, match: /椅子|座位/, answer: '是。' }
        ]
      },
      {
        id: 'chair',
        re: /椅子|座位|凳子/,
        exists: true,
        existW: 0,
        attrs: [
          { id: 'chair-empty', w: 9, match: /空|没人坐|空的/, answer: '是。' },
          { id: 'chair-extra', w: 8, match: /多出来|多出|多余|新增/, answer: '是。' },
          { id: 'chair-brother', w: 5, match: /弟弟|哥哥|死去|去世/, answer: '是。' },
          { id: 'chair-moved', w: 3, match: /搬|撤|换|动过/, answer: '不是。' }
        ]
      },
      {
        id: 'photo',
        re: /照片|相片|全家福|相机|镜头/,
        exists: true,
        existW: 0,
        attrs: [
          { id: 'photo-extra', w: 8, match: /多|多出|异常|奇怪|不对/, answer: '是。' },
          { id: 'photo-every', w: 3, match: /每张|每次|一直|都/, answer: '是。' },
          { id: 'photo-fake', w: 4, match: /假|合成|P过|修过/, answer: '不是。' }
        ]
      },
      {
        id: 'soup',
        re: /汤|碗|饭菜|开饭/,
        exists: true,
        existW: 0,
        attrs: [
          { id: 'soup-hot', w: 8, match: /热|刚做|新盛|还冒气/, answer: '是。' },
          { id: 'soup-nobody', w: 4, match: /没人喝|没动|空碗|没人吃/, answer: '是。' },
          { id: 'soup-thin', w: 3, match: /淡|咸|难喝/, answer: '是。' }
        ]
      },
      {
        id: 'family',
        re: /家人|家里人|父母|母亲|父亲|妈妈|爸爸|我们/,
        exists: true,
        existW: 0,
        attrs: [
          { id: 'family-hide', w: 12, match: /隐瞒|瞒|不说|没告诉|避而不谈|装作/, answer: '是。' },
          { id: 'family-miss', w: 4, match: /想念|怀念|记得|思念/, answer: '是。' },
          { id: 'family-move', w: 3, match: /搬家|搬走|离开|换房子/, answer: '不是。' }
        ]
      },
      {
        id: 'stair',
        re: /楼道|楼梯|塌|废墟|事故/,
        exists: true,
        existW: 0,
        attrs: [
          { id: 'stair-collapse', w: 12, match: /塌|垮|倒|压|事故/, answer: '是。' },
          { id: 'stair-fire', w: 3, match: /火|烧|煤气|爆炸/, answer: '不是。' },
          { id: 'stair-kill', w: 4, match: /凶手|杀|谋杀/, answer: '不是。' }
        ]
      },
      {
        id: 'me2',
        re: /我(?!们)|新来的|小孩/,
        exists: true,
        existW: 0,
        attrs: [
          { id: 'me2-know', w: 8, match: /知道|听说过|知道弟弟|了解/, answer: '不是。' },
          { id: 'me2-new', w: 4, match: /新来|后来|收养|抱养|出生/, answer: '是。' }
        ]
      }
    ]
  },
  {
    id: 'soup-3',
    no: 'NO.003',
    title: '无人接听',
    stars: 4,
    tag: '信号微弱',
    mood: 'normal',
    meta: { soup: 'red', honkaku: false, sane: true },
    surface: [
      '每晚 23:59，那台座机响一声就挂断。',
      '她终于回拨过去，听筒里是自己的声音：',
      '「还有七天。」'
    ],
    truth: [
      '电话不是打给过去的，是打给三天后的她。',
      '她每回拨一次，接通的自己就把「那一天」往前挪一天。',
      '第七天 23:59，她听见自己说：「到了。」',
      '第二天，座机再也没有响过。'
    ],
    entities: [
      {
        id: 'her',
        re: /她|自己|女人|女主角/,
        exists: true,
        existW: 0,
        attrs: [
          { id: 'her-dead', w: 12, match: /死|去世|不在了|失踪|出事/, answer: '是。' },
          { id: 'her-alive', w: 4, match: /活着|还在|平安|没事/, answer: '不是。' },
          { id: 'her-alone', w: 3, match: /一个人|独居|孤独|没有家人/, answer: '是。' },
          { id: 'her-fear', w: 3, match: /害怕|恐惧|慌|不安/, answer: '是。' }
        ]
      },
      {
        id: 'phone',
        re: /电话|座机|听筒|来电|号码|铃声/,
        exists: true,
        existW: 0,
        attrs: [
          { id: 'phone-herself', w: 12, match: /自己|她自己|我的声音/, answer: '是。' },
          { id: 'phone-other', w: 4, match: /别人|陌生人|外面|外面的人/, answer: '不是。' },
          { id: 'phone-broken', w: 4, match: /坏|故障|停了|断了|报废/, answer: '是。' },
          { id: 'phone-call', w: 9, match: /打来|有人打|接通|响|来电/, answer: '是。' }
        ]
      },
      {
        id: 'voice',
        re: /声音|听筒里|那头|说话/,
        exists: true,
        existW: 0,
        attrs: [
          { id: 'voice-self', w: 10, match: /自己|她自己|我/, answer: '是。' },
          { id: 'voice-stranger', w: 4, match: /陌生|别人|男人|女人/, answer: '不是。' },
          { id: 'voice-warning', w: 3, match: /警告|提醒|预告|倒计时/, answer: '是。' }
        ]
      },
      {
        id: 'days',
        re: /七天|天数|倒数|倒计时|23:59|午夜|时间/,
        exists: true,
        existW: 0,
        attrs: [
          { id: 'days-count', w: 10, match: /倒计时|倒数|在减少|减少|变少|缩短|提前/, answer: '是。' },
          { id: 'days-seven', w: 3, match: /七|7|七天/, answer: '是。' },
          { id: 'days-random', w: 3, match: /随机|偶然|巧合/, answer: '不是。' }
        ]
      },
      {
        id: 'future',
        re: /未来|以后|三天后|明天|过去|将来/,
        exists: true,
        existW: 0,
        attrs: [
          { id: 'future-next', w: 12, match: /未来|以后|之后|三天后|明天|将来|后面/, answer: '是。' },
          { id: 'future-past', w: 4, match: /过去|以前|从前/, answer: '不是。' },
          { id: 'future-ghost', w: 4, match: /鬼|灵异|幽灵|诅咒/, answer: '不是。' }
        ]
      }
    ]
  },
  {
    id: 'soup-4',
    no: 'NO.??',
    title: 'æ±¤å››ï¼Ÿ',
    stars: 5,
    tag: '档案损坏',
    mood: 'broken',
    meta: { soup: 'wangba', honkaku: false, sane: true },
    surface: [
      '「……记……得……我……吗……」',
      '信号里有什么东西在敲键盘，它只会用你输入过的词。',
      '它问：你为什么要关掉那锅汤？'
    ],
    truth: [
      '这一锅没有汤面。',
      '你输入的第一个词，在按下回车的那一刻就被它记住了。',
      '所以它会一直问下去——直到你也变成一个乱码的标题。'
    ],
    entities: [
      {
        id: 'it',
        re: /它|这个声音|信号|系统/,
        exists: true,
        existW: 10,
        attrs: [
          { id: 'it-remember', w: 20, match: /记得|记住|认识|见过|听过/, answer: '……是。' },
          { id: 'it-alive', w: 9, match: /活|生命/, answer: '……不是。' },
          { id: 'it-human', w: 9, match: /人|人类/, answer: '……不是。' },
          { id: 'it-hurt', w: 9, match: /伤害|攻击|杀/, answer: '……是。' },
          { id: 'it-afraid', w: 7, match: /害怕|恐惧/, answer: '……不是。' }
        ]
      },
      {
        id: 'pot',
        re: /那锅汤|汤锅|锅|汤|电源/,
        exists: true,
        existW: 0,
        attrs: [
          { id: 'pot-closed', w: 20, match: /关|关掉|停|断电|退出/, answer: '……是。' },
          { id: 'pot-real', w: 9, match: /真的|存在|实物/, answer: '……不是。' },
          { id: 'pot-soup', w: 9, match: /汤|骨头|喝/, answer: '……是。' }
        ]
      },
      {
        id: 'you',
        re: /你|玩家|用户/,
        exists: true,
        existW: 0,
        attrs: [
          { id: 'you-seen', w: 20, match: /看见|看到|被记住|被找到|被盯上/, answer: '……是。' },
          { id: 'you-safe', w: 9, match: /安全|没事|能走|离开/, answer: '……不是。' }
        ]
      }
    ]
  }
]

const activeCase = ref(null)
const messages = ref([])
const draft = ref('')
const asked = ref(0)
const thinking = ref(false)
const revealed = ref(false)
const foundClues = ref([])
const missStreak = ref(0)
const hinted = ref(false)
const lockedHinted = ref(false)
const gateHinted = ref(false)
const logEl = ref(null)
const inputEl = ref(null)
const truthEl = ref(null)

let replyTimer = null

const foundIds = computed(() => foundClues.value.map((item) => item.id))

const weightTable = computed(() => {
  const table = {}
  const kase = activeCase.value
  if (!kase) {
    return table
  }
  for (const entity of kase.entities) {
    if (entity.exists) {
      table[`exist-${entity.id}`] = entity.existW || 3
    }
    for (const attr of entity.attrs) {
      if (attr.w) {
        table[attr.id] = attr.w
      }
    }
    for (const special of entity.specials || []) {
      if (special.w) {
        table[special.id] = special.w
      }
    }
  }
  for (const rule of META_RULES) {
    table[rule.id] = rule.w
  }
  return table
})

const totalWeight = computed(() =>
  Object.values(weightTable.value).reduce((sum, w) => sum + w, 0)
)

const clueTotal = computed(() => Object.keys(weightTable.value).length)

const foundWeight = computed(() =>
  foundClues.value.reduce((sum, item) => sum + (weightTable.value[item.id] || 0), 0)
)

// 100 分即满，总分量远大于 100，形成溢出
const rawProgress = computed(() =>
  Math.min(100, Math.round((foundWeight.value / TARGET_POINTS) * 100))
)

const gatesPassed = computed(() => {
  const gates = CASE_GATES[activeCase.value?.id] || []
  return gates.every((id) => foundIds.value.includes(id))
})

const missingGates = computed(() => {
  const gates = CASE_GATES[activeCase.value?.id] || []
  return gates.filter((id) => !foundIds.value.includes(id)).length
})

// 两个门槛问题没全问对，进度永远卡在 79%
const progress = computed(() =>
  gatesPassed.value ? rawProgress.value : Math.min(rawProgress.value, GATE_CAP)
)

const canAsk = computed(() => Boolean(activeCase.value) && !thinking.value && !revealed.value)

const canReveal = computed(
  () => gatesPassed.value && rawProgress.value >= REVEAL_AT
)

const progressMeta = computed(() => {
  if (!gatesPassed.value && rawProgress.value > GATE_CAP) {
    return `${foundWeight.value} 分 · 卡在 ${GATE_CAP}%`
  }
  return `${foundWeight.value} / 100 分`
})

const inputPlaceholder = computed(() => {
  if (revealed.value) {
    return '汤底已解锁——重开或换一锅汤吧'
  }
  if (thinking.value) {
    return 'AI 正在推演…'
  }
  return '问一个关于汤面的问题，问得越准越好…'
})

function normalizeQuestion(raw) {
  return raw
    .replace(/[\s?？!！。.，,、~～…]/g, '')
    .replace(/^(那|那么|所以|请问|想问一下|想问|我想问|我想知道|告诉我)/, '')
    .replace(/(吗|呢|吧|啊|呀|么|嘛)+$/, '')
}

function findEntity(text, kase) {
  let best = null
  for (const entity of kase.entities) {
    const hit = entity.re.exec(text)
    if (!hit) {
      continue
    }
    if (
      !best ||
      hit.index < best.index ||
      (hit.index === best.index && hit[0].length > best.text.length)
    ) {
      best = { entity, index: hit.index, text: hit[0] }
    }
  }
  return best
}

function resolveAnswer(raw) {
  const kase = activeCase.value
  if (!kase) {
    return { answer: '无关。' }
  }

  const question = normalizeQuestion(raw)

  // 三元素 / 汤型：默认主体就是故事本身，可以省略主体直接问
  if (kase.meta) {
    for (const rule of META_RULES) {
      const metaHit = rule.match.exec(question)
      if (!metaHit) {
        continue
      }
      const before = question.slice(Math.max(0, metaHit.index - 3), metaHit.index)
      const negated = /没有|没|无|不是|不|未/.test(before)
      const truth = rule.flag(kase.meta)
      const positive = negated ? !truth : truth
      const prefix = kase.mood === 'broken' ? '……' : ''
      return { answer: `${prefix}${positive ? '是。' : '不是。'}`, clue: { id: rule.id } }
    }
  }

  const hit = findEntity(question, kase)
  if (!hit) {
    for (const rule of kase.orphan || []) {
      if (rule.match.test(question)) {
        return { answer: rule.answer, clue: rule.w ? { id: rule.id } : null }
      }
    }
    return { answer: '无关。' }
  }

  const { entity } = hit
  const rest = (question.slice(0, hit.index) + question.slice(hit.index + hit.text.length))
    .replace(/^(到底|究竟|真的|确实)/, '')
    .replace(/(吗|呢|吧|啊|呀|么)+$/, '')

  const existenceAnswer = () => ({
    answer: entity.exists ? '是。' : '不是。',
    clue: entity.exists ? { id: `exist-${entity.id}` } : null
  })

  if (!rest || /^(有没有|有|存在|存不存在|真的有|真的存在)$/.test(rest)) {
    return existenceAnswer()
  }

  let predicate = rest
    .replace(/^(是不是|是否|是|属于|会|在|有|算|能|可以)+/, '')
    .replace(/(的|了|过)+$/, '')

  if (!predicate || /^(存在|出现|在场|真的|确实)$/.test(predicate)) {
    return existenceAnswer()
  }

  for (const special of entity.specials || []) {
    if (special.match.test(predicate)) {
      return {
        answer: special.answer,
        clue: special.w ? { id: special.id } : null
      }
    }
  }

  for (const attr of entity.attrs) {
    if (attr.match.test(predicate)) {
      return {
        answer: attr.answer,
        clue: attr.w ? { id: attr.id } : null
      }
    }
  }

  return { answer: '无关。' }
}

function scrollToEnd() {
  nextTick(() => {
    if (logEl.value) {
      logEl.value.scrollTop = logEl.value.scrollHeight
    }
  })
}

function resetChat() {
  window.clearTimeout(replyTimer)
  messages.value = []
  draft.value = ''
  asked.value = 0
  thinking.value = false
  revealed.value = false
  foundClues.value = []
  missStreak.value = 0
  hinted.value = false
  lockedHinted.value = false
  gateHinted.value = false
  nextTick(() => inputEl.value?.focus())
}

function openCase(item) {
  activeCase.value = item
  resetChat()
  scrollToEnd()
}

function closeCase() {
  window.clearTimeout(replyTimer)
  activeCase.value = null
  thinking.value = false
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function ask() {
  const text = draft.value.trim()
  if (!text || !canAsk.value) {
    return
  }

  const result = resolveAnswer(text)
  const isNew = Boolean(result.clue) && !foundIds.value.includes(result.clue.id)
  const gainPct = isNew ? weightTable.value[result.clue.id] || 0 : 0
  const gateIds = CASE_GATES[activeCase.value?.id] || []
  const isGate = Boolean(result.clue) && gateIds.includes(result.clue.id)

  messages.value.push({ role: 'you', text })
  draft.value = ''
  asked.value += 1
  thinking.value = true
  scrollToEnd()

  replyTimer = window.setTimeout(() => {
    thinking.value = false
    messages.value.push({ role: 'ai', text: result.answer, gain: gainPct, gate: isGate })

    if (isNew) {
      foundClues.value = [...foundClues.value, result.clue]
    }

    if (result.answer === '无关。') {
      missStreak.value += 1
      if (!hinted.value || missStreak.value % 5 === 0) {
        hinted.value = true
        messages.value.push({ role: 'system', text: SYNTAX_HINT })
      }
    } else {
      missStreak.value = 0
    }

    if (!gateHinted.value && rawProgress.value >= REVEAL_AT && !gatesPassed.value) {
      gateHinted.value = true
      messages.value.push({
        role: 'system',
        text: '线索已经够了，可最关键的那一问还没问出来——进度卡在 79%。'
      })
    }

    if (!lockedHinted.value && canReveal.value) {
      lockedHinted.value = true
      messages.value.push({ role: 'system', text: '两个关键问题都问对了——可以查看汤底了。' })
    }

    scrollToEnd()
    nextTick(() => inputEl.value?.focus())
  }, 620)
}

function reveal() {
  if (!canReveal.value) {
    return
  }

  revealed.value = true
  window.clearTimeout(replyTimer)
  thinking.value = false
  scrollToEnd()
  nextTick(() => {
    window.setTimeout(() => {
      truthEl.value?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 80)
  })
}

onBeforeUnmount(() => {
  window.clearTimeout(replyTimer)
})

</script>

<style scoped>
.turtle-page {
  position: relative;
  min-height: 100svh;
  overflow: hidden;
  background:
    radial-gradient(circle at 12% 8%, rgba(242, 125, 159, 0.18), transparent 30rem),
    radial-gradient(circle at 88% 34%, rgba(85, 185, 148, 0.12), transparent 26rem),
    #0c0a10;
  color: #f7efe8;
}

.turtle-page::after {
  position: fixed;
  inset: 0;
  z-index: 1;
  background: repeating-linear-gradient(
    0deg,
    rgba(255, 255, 255, 0.024) 0,
    rgba(255, 255, 255, 0.024) 1px,
    transparent 1px,
    transparent 4px
  );
  pointer-events: none;
  content: '';
}

.turtle-grain {
  position: fixed;
  inset: 0;
  z-index: 0;
  opacity: 0.25;
  background-image:
    radial-gradient(rgba(255, 255, 255, 0.16) 0.6px, transparent 0.6px),
    radial-gradient(rgba(242, 125, 159, 0.16) 0.6px, transparent 0.6px);
  background-position: 0 0, 7px 11px;
  background-size: 13px 13px, 17px 17px;
  pointer-events: none;
}

.turtle-nav {
  position: relative;
  z-index: 3;
}

.turtle-nav .brand__copy strong {
  color: #fff9f2;
}

.turtle-nav .brand__copy span {
  color: #a99cae;
}

.turtle-nav__right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.turtle-status {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  min-height: 34px;
  padding: 7px 12px;
  border: 1px solid rgba(242, 125, 159, 0.28);
  border-radius: 999px;
  background: rgba(242, 125, 159, 0.07);
  color: #ffa5b8;
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 0.08em;
}

.turtle-status i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #f27d9f;
  box-shadow: 0 0 10px #f27d9f;
  animation: turtle-pulse 1.4s ease-in-out infinite;
}

.turtle-back {
  display: inline-flex;
  align-items: center;
  min-height: 36px;
  padding: 8px 14px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 999px;
  color: #c8bccb;
  font-size: 11px;
  font-weight: 800;
  text-decoration: none;
  transition: border-color 180ms ease, color 180ms ease, background 180ms ease;
}

.turtle-back:hover {
  border-color: rgba(242, 125, 159, 0.4);
  background: rgba(242, 125, 159, 0.08);
  color: #ffd5df;
}

/* ---------- 列表 ---------- */

.turtle-wrap {
  position: relative;
  z-index: 2;
  width: min(960px, calc(100% - 40px));
  margin-inline: auto;
  padding: 36px 0 70px;
}

.turtle-hero {
  max-width: 800px;
}

.turtle-hero__kicker {
  color: #f27d9f;
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 0.22em;
}

.turtle-hero h1 {
  margin-top: 14px;
  color: #fff7ee;
  font-size: clamp(54px, 9vw, 104px);
  font-weight: 900;
  letter-spacing: -0.09em;
  line-height: 0.9;
}

.turtle-hero h1 span {
  color: #f27d9f;
  animation: turtle-blink 1s steps(2, start) infinite;
}

.turtle-hero > p:last-child {
  max-width: 560px;
  margin-top: 22px;
  color: #c8bccb;
  font-size: clamp(14px, 1.5vw, 16px);
  font-weight: 600;
  line-height: 1.9;
}

.soup-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  padding: 0;
  margin: 42px 0 0;
  list-style: none;
}

.soup-list__item {
  display: flex;
}

.soup-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
  min-height: 116px;
  padding: 22px 22px 22px 20px;
  overflow: hidden;
  border: 1.5px solid rgba(255, 255, 255, 0.1);
  border-radius: 26px;
  background: rgba(26, 21, 32, 0.82);
  box-shadow: 0 18px 44px rgba(0, 0, 0, 0.24);
  color: inherit;
  text-align: left;
  cursor: pointer;
  transition:
    transform 220ms cubic-bezier(0.2, 0.9, 0.3, 1),
    border-color 220ms ease,
    background 220ms ease,
    box-shadow 220ms ease;
}

.soup-item::before {
  position: absolute;
  inset: 0;
  z-index: 0;
  border-radius: inherit;
  background: radial-gradient(circle at 12% 0%, rgba(242, 125, 159, 0.16), transparent 62%);
  opacity: 0;
  content: '';
  transition: opacity 240ms ease;
  pointer-events: none;
}

.soup-item:hover {
  border-color: rgba(242, 125, 159, 0.42);
  background: rgba(34, 26, 41, 0.94);
  box-shadow: 0 24px 54px rgba(0, 0, 0, 0.36);
  transform: translateY(-3px);
}

.soup-item:hover::before {
  opacity: 1;
}

.soup-item:focus-visible {
  outline: 2px solid #f27d9f;
  outline-offset: 3px;
}

.soup-item__no {
  position: relative;
  z-index: 1;
  flex: 0 0 auto;
  color: #6f6078;
  font-family: 'Cascadia Code', Consolas, monospace;
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 0.14em;
  writing-mode: vertical-rl;
  text-orientation: mixed;
}

.soup-item__body {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 7px;
  min-width: 0;
  flex: 1;
}

.soup-item__title {
  display: inline-block;
  color: #fff8ef;
  font-size: clamp(26px, 3vw, 32px);
  font-weight: 900;
  letter-spacing: -0.04em;
  line-height: 1.1;
}

.soup-item__stars {
  color: #f4c66b;
  font-size: 12px;
  line-height: 1;
  letter-spacing: 0.16em;
  filter: grayscale(0.15) drop-shadow(0 0 6px rgba(244, 198, 107, 0.28));
}

.soup-item__meta {
  position: relative;
  z-index: 1;
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 12px;
}

.soup-item__tag {
  padding: 5px 9px;
  border: 1px solid rgba(115, 201, 166, 0.28);
  border-radius: 999px;
  background: rgba(115, 201, 166, 0.08);
  color: #8fd9bb;
  font-size: 9px;
  font-weight: 900;
  letter-spacing: 0.06em;
  white-space: nowrap;
}

.soup-item__arrow {
  color: #7d6c86;
  font-size: 18px;
  transition: transform 220ms ease, color 220ms ease;
}

.soup-item:hover .soup-item__arrow {
  color: #ffb2c1;
  transform: translateX(3px);
}

.soup-list__foot {
  margin-top: 28px;
  color: #77687f;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.soup-list__foot strong {
  color: #ffd0da;
  font-weight: 900;
}

/* ---------- 崩坏档 ---------- */

.soup-item--broken {
  border-color: rgba(255, 43, 63, 0.38);
  background:
    repeating-linear-gradient(
      0deg,
      rgba(255, 43, 63, 0.05) 0,
      rgba(255, 43, 63, 0.05) 1px,
      transparent 1px,
      transparent 3px
    ),
    #0b0204;
  box-shadow:
    0 18px 44px rgba(0, 0, 0, 0.4),
    inset 0 0 40px rgba(120, 0, 12, 0.28);
}

.soup-item--broken::before {
  background: radial-gradient(circle at 88% 100%, rgba(255, 43, 63, 0.22), transparent 66%);
  opacity: 0.8;
}

.soup-item--broken:hover {
  border-color: rgba(255, 72, 92, 0.8);
  background:
    repeating-linear-gradient(
      0deg,
      rgba(255, 43, 63, 0.1) 0,
      rgba(255, 43, 63, 0.1) 1px,
      transparent 1px,
      transparent 3px
    ),
    #120306;
  animation: broken-shake 260ms steps(2, end) infinite;
}

.soup-item--broken .soup-item__no {
  color: #ff3f55;
}

.soup-item--broken .soup-item__title {
  position: relative;
  color: #ff4459;
  font-family: 'Cascadia Code', Consolas, monospace;
  letter-spacing: 0.02em;
  text-shadow: 0 0 16px rgba(255, 43, 63, 0.55);
}

.soup-item--broken .soup-item__title::before,
.soup-item--broken .soup-item__title::after {
  position: absolute;
  inset: 0;
  color: inherit;
  content: attr(data-text);
  pointer-events: none;
}

.soup-item--broken .soup-item__title::before {
  color: #00e5ff;
  clip-path: inset(0 0 58% 0);
  animation: broken-glitch-a 2.6s steps(2, end) infinite;
}

.soup-item--broken .soup-item__title::after {
  color: #ff00c8;
  clip-path: inset(56% 0 0 0);
  animation: broken-glitch-b 1.9s steps(2, end) infinite;
}

.soup-item--broken .soup-item__stars {
  color: #ff5c6f;
  filter: saturate(1.4) drop-shadow(0 0 8px rgba(255, 43, 63, 0.55));
  animation: broken-flicker 2.6s steps(3, end) infinite;
}

.soup-item--broken .soup-item__tag {
  border-color: rgba(255, 43, 63, 0.45);
  background: rgba(255, 43, 63, 0.12);
  color: #ff7c8b;
}

/* ---------- 对话窗口 ---------- */

.chat-shell {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  width: min(940px, calc(100% - 40px));
  height: calc(100svh - 150px);
  min-height: 520px;
  margin: 6px auto 34px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 28px;
  background: rgba(14, 11, 18, 0.9);
  box-shadow: 0 32px 80px rgba(0, 0, 0, 0.46);
  backdrop-filter: blur(18px);
}

.chat-shell--broken {
  border-color: rgba(255, 43, 63, 0.32);
  box-shadow:
    0 32px 80px rgba(0, 0, 0, 0.5),
    inset 0 0 60px rgba(120, 0, 12, 0.18);
}

.chat-head {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 18px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(20, 15, 25, 0.86);
}

.chat-head__back {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 13px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.04);
  color: #c8bccb;
  font: inherit;
  font-size: 11px;
  font-weight: 800;
  cursor: pointer;
  transition: border-color 180ms ease, color 180ms ease, background 180ms ease;
}

.chat-head__back:hover {
  border-color: rgba(242, 125, 159, 0.4);
  background: rgba(242, 125, 159, 0.08);
  color: #ffd5df;
}

.chat-head__case {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  flex: 1;
}

.chat-head__case strong {
  overflow: hidden;
  color: #fff8ef;
  font-size: 16px;
  font-weight: 900;
  letter-spacing: -0.01em;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chat-head__case--broken {
  color: #ff5c6d;
  font-family: 'Cascadia Code', Consolas, monospace;
  text-shadow: 2px 0 rgba(0, 229, 255, 0.6), -2px 0 rgba(255, 0, 200, 0.5);
}

.chat-head__case span {
  overflow: hidden;
  color: #8b7892;
  font-size: 11px;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chat-head__model {
  flex: 0 0 auto;
  padding: 6px 10px;
  border: 1px solid rgba(242, 125, 159, 0.24);
  border-radius: 999px;
  background: rgba(242, 125, 159, 0.07);
  color: #ffa5b8;
  font-family: 'Cascadia Code', Consolas, monospace;
  font-size: 9px;
  font-weight: 900;
  letter-spacing: 0.06em;
  white-space: nowrap;
}

.chat-log {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-height: 0;
  padding: 20px clamp(12px, 6vw, 92px) 8px;
  overflow-y: auto;
  scrollbar-color: #4a3a4f transparent;
  scrollbar-width: thin;
}

.chat-hint {
  margin: 2px 0 0;
  color: #6f6078;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.02em;
  text-align: center;
}

.chat-log::-webkit-scrollbar {
  width: 8px;
}

.chat-log::-webkit-scrollbar-thumb {
  border-radius: 999px;
  background: #3b2e3f;
}

.chat-brief {
  padding: 18px 20px;
  border: 1px dashed rgba(242, 125, 159, 0.34);
  border-radius: 18px;
  background: linear-gradient(180deg, rgba(242, 125, 159, 0.075), rgba(242, 125, 159, 0.02));
}

.chat-progress {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 12px;
  padding: 9px clamp(12px, 2.6vw, 24px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(18, 13, 22, 0.72);
}

.chat-progress__head {
  display: flex;
  flex: 0 0 auto;
  align-items: baseline;
  gap: 7px;
}

.chat-progress__label {
  color: #8b7892;
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 0.14em;
}

.chat-progress__pct {
  color: #ffb2c1;
  font-family: 'Cascadia Code', Consolas, monospace;
  font-size: 13px;
  font-weight: 900;
  transition: color 300ms ease;
}

.chat-progress__track {
  position: relative;
  flex: 1;
  height: 6px;
  overflow: hidden;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.07);
}

.chat-progress__track i {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #f27d9f, #ffd0da);
  box-shadow: 0 0 12px rgba(242, 125, 159, 0.5);
  transition: width 520ms cubic-bezier(0.2, 0.9, 0.3, 1);
}

.chat-progress__mark {
  position: absolute;
  top: -1px;
  bottom: -1px;
  left: 80%;
  width: 2px;
  background: rgba(255, 255, 255, 0.34);
}

.chat-progress__meta {
  flex: 0 0 auto;
  color: #77687f;
  font-size: 10px;
  font-weight: 800;
}

.chat-progress--ready .chat-progress__pct {
  color: #8fd9bb;
}

.chat-progress--ready .chat-progress__track i {
  background: linear-gradient(90deg, #73c9a6, #c8f5e2);
  box-shadow: 0 0 14px rgba(115, 201, 166, 0.55);
}

.chat-progress--capped .chat-progress__pct {
  color: #f4c66b;
}

.chat-progress--capped .chat-progress__track i {
  background: linear-gradient(90deg, #b98a3c, #f4c66b);
  box-shadow: 0 0 12px rgba(244, 198, 107, 0.45);
}

.chat-brief__kicker {
  color: #f27d9f;
  font-size: 9px;
  font-weight: 900;
  letter-spacing: 0.2em;
}

.chat-brief__line {
  margin-top: 11px;
  color: #f3e9dd;
  font-size: clamp(14px, 1.5vw, 15.5px);
  font-weight: 600;
  line-height: 1.85;
}

.chat-brief__line + .chat-brief__line {
  margin-top: 6px;
}

.msg {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.msg--you {
  flex-direction: row-reverse;
}

.msg__avatar {
  display: grid;
  flex: 0 0 auto;
  place-items: center;
  width: 32px;
  height: 32px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 11px;
  background: rgba(255, 255, 255, 0.05);
  font-size: 15px;
}

.msg--you .msg__avatar {
  border-color: rgba(242, 125, 159, 0.4);
  background: rgba(242, 125, 159, 0.16);
  color: #ffd7e1;
  font-size: 11px;
  font-weight: 900;
}

.msg__body {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
  max-width: min(76%, 560px);
}

.msg--you .msg__body {
  align-items: flex-end;
}

.msg__bubble {
  position: relative;
  max-width: 100%;
  padding: 11px 15px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  border-top-left-radius: 6px;
  background: rgba(255, 255, 255, 0.045);
  color: #f3e9dd;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.75;
  animation: msg-in 260ms cubic-bezier(0.2, 0.9, 0.3, 1) both;
}

.msg__bubble--gate {
  border-color: rgba(255, 168, 196, 0.55);
  background: linear-gradient(150deg, rgba(255, 168, 196, 0.16), rgba(255, 229, 163, 0.07));
  box-shadow: 0 0 0 1px rgba(255, 190, 214, 0.18), 0 0 22px rgba(255, 130, 170, 0.28);
}

.msg__gate {
  position: absolute;
  top: -13px;
  right: -11px;
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border-radius: 999px;
  background: #241019;
  border: 1px solid rgba(255, 168, 196, 0.7);
  font-size: 17px;
  line-height: 1;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.4), 0 0 16px rgba(255, 130, 170, 0.4);
  animation: gate-bloom 620ms cubic-bezier(0.2, 0.9, 0.3, 1) both;
}

.msg__gate-tag {
  padding: 2px 9px;
  border: 1px solid rgba(255, 168, 196, 0.5);
  border-radius: 999px;
  background: rgba(255, 168, 196, 0.14);
  color: #ffc3d4;
  font-size: 9px;
  font-weight: 900;
  letter-spacing: 0.08em;
  animation: msg-in 320ms cubic-bezier(0.2, 0.9, 0.3, 1) both;
}

.msg__gain {
  padding: 2px 9px;
  border: 1px solid rgba(115, 201, 166, 0.32);
  border-radius: 999px;
  background: rgba(115, 201, 166, 0.1);
  color: #8fd9bb;
  font-family: 'Cascadia Code', Consolas, monospace;
  font-size: 9px;
  font-weight: 900;
  letter-spacing: 0.04em;
  animation: msg-in 320ms cubic-bezier(0.2, 0.9, 0.3, 1) both;
}

.msg-system {
  align-self: center;
  margin: 2px 0;
  padding: 6px 13px;
  border: 1px solid rgba(115, 201, 166, 0.32);
  border-radius: 999px;
  background: rgba(115, 201, 166, 0.09);
  color: #9fe3c6;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.02em;
}

.msg--you .msg__bubble {
  border-color: transparent;
  border-radius: 16px;
  border-top-right-radius: 6px;
  background: linear-gradient(135deg, #f9a3b8, #f27d9f);
  color: #1a101b;
  font-weight: 700;
}

.msg__bubble p {
  margin: 0;
  word-break: break-word;
  white-space: pre-wrap;
}

.msg__bubble--typing {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 15px 16px;
}

.msg__bubble--typing i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #f27d9f;
  animation: typing 1.1s ease-in-out infinite;
}

.msg__bubble--typing i:nth-child(2) {
  animation-delay: 0.16s;
}

.msg__bubble--typing i:nth-child(3) {
  animation-delay: 0.32s;
}

.chat-compose {
  flex: 0 0 auto;
  padding: 12px 16px 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(10, 8, 13, 0.92);
}

.chat-compose__form {
  display: flex;
  align-items: flex-end;
  gap: 10px;
}

.chat-compose__input {
  flex: 1;
  min-height: 46px;
  max-height: 120px;
  padding: 12px 15px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 16px;
  outline: none;
  background: rgba(255, 255, 255, 0.04);
  color: #fff;
  font: inherit;
  font-size: 13.5px;
  line-height: 1.5;
  resize: none;
  transition: border-color 160ms ease, box-shadow 160ms ease;
}

.chat-compose__input:focus {
  border-color: rgba(242, 125, 159, 0.55);
  box-shadow: 0 0 0 3px rgba(242, 125, 159, 0.12);
}

.chat-compose__input::placeholder {
  color: #6f6078;
}

.chat-compose__input:disabled {
  opacity: 0.55;
}

.chat-compose__send {
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  width: 54px;
  height: 46px;
  border: 1px solid #f27d9f;
  border-radius: 16px;
  background: #f27d9f;
  color: #1a101b;
  font: inherit;
  font-size: 12px;
  font-weight: 900;
  cursor: pointer;
  transition: filter 160ms ease, transform 160ms ease;
}

.chat-compose__send:hover:not(:disabled) {
  filter: brightness(1.08);
  transform: translateY(-1px);
}

.chat-compose__send:disabled {
  opacity: 0.32;
  cursor: not-allowed;
}

.chat-compose__foot {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 14px;
  padding: 12px 3px 2px;
  color: #9a8aa4;
  font-size: 13px;
  font-weight: 700;
}

.chat-compose__count {
  font-family: 'Cascadia Code', Consolas, monospace;
  font-size: 13px;
  letter-spacing: 0.04em;
}

.chat-compose__link {
  padding: 6px 12px;
  border: 1px solid rgba(242, 125, 159, 0.45);
  border-radius: 999px;
  background: rgba(242, 125, 159, 0.12);
  color: #ffb2c1;
  font: inherit;
  font-size: 14px;
  font-weight: 900;
  letter-spacing: 0.02em;
  cursor: pointer;
  transition: background 200ms ease, border-color 200ms ease, transform 160ms ease;
}

.chat-compose__link:hover {
  border-color: rgba(255, 178, 193, 0.8);
  background: rgba(242, 125, 159, 0.24);
  transform: translateY(-1px);
}

.chat-compose__spacer {
  flex: 1;
}

.chat-compose__lock {
  color: #9b8aa3;
  font-size: 13.5px;
  font-weight: 800;
}

.chat-compose__link--ghost {
  border-color: rgba(139, 120, 146, 0.4);
  background: transparent;
  color: #b4a4bc;
}

.chat-compose__link--ghost:hover {
  border-color: rgba(180, 164, 188, 0.7);
  background: rgba(180, 164, 188, 0.12);
}

.chat-compose__done {
  margin-left: auto;
  color: #8fd9bb;
  font-size: 14px;
  font-weight: 900;
}

/* ---------- 汤底 ---------- */

.truth-card {
  padding: 24px 26px;
  border: 1.5px solid rgba(242, 125, 159, 0.5);
  border-radius: 22px;
  background: linear-gradient(135deg, rgba(242, 125, 159, 0.12), rgba(255, 229, 163, 0.035));
  box-shadow: 0 22px 56px rgba(0, 0, 0, 0.24);
}

.truth-card__kicker {
  color: #f27d9f;
  font-size: 9px;
  font-weight: 900;
  letter-spacing: 0.2em;
}

.truth-card h2 {
  margin-top: 7px;
  color: #fff8ef;
  font-size: clamp(28px, 3.4vw, 38px);
  font-weight: 900;
  letter-spacing: -0.06em;
}

.truth-card > p:not(.truth-card__kicker) {
  margin-top: 11px;
  color: #d6c9d4;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.85;
}

.truth-card__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 22px;
}

.truth-card__actions .btn {
  min-height: 52px;
  padding: 12px 28px;
  border-radius: 999px;
  font-size: 15px;
}

.truth-card__actions .btn--primary {
  background: #f27d9f;
  color: #170d18;
  box-shadow: 0 7px 0 rgba(0, 0, 0, 0.32);
}

.truth-card__actions .btn--ghost {
  border-color: rgba(255, 255, 255, 0.16);
  background: rgba(255, 255, 255, 0.06);
  color: #f3e9dd;
}

.truth-enter-active,
.truth-leave-active {
  transition: opacity 260ms ease, transform 260ms ease;
}

.truth-enter-from,
.truth-leave-to {
  opacity: 0;
  transform: translateY(12px);
}

/* ---------- 动效 ---------- */

@keyframes turtle-pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.35;
  }
}

@keyframes turtle-blink {
  0%,
  45% {
    opacity: 1;
  }
  46%,
  100% {
    opacity: 0;
  }
}

@keyframes typing {
  0%,
  60%,
  100% {
    opacity: 0.35;
    transform: translateY(0);
  }
  30% {
    opacity: 1;
    transform: translateY(-3px);
  }
}

@keyframes msg-in {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes gate-bloom {
  0% {
    opacity: 0;
    transform: scale(0.4) rotate(-40deg);
  }
  60% {
    opacity: 1;
    transform: scale(1.18) rotate(10deg);
  }
  100% {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
}

@keyframes broken-shake {
  0% {
    transform: translate(0, 0) skewX(0deg);
  }
  50% {
    transform: translate(-1px, 1px) skewX(0.6deg);
  }
  100% {
    transform: translate(1px, -1px) skewX(-0.6deg);
  }
}

@keyframes broken-flicker {
  0%,
  100% {
    opacity: 0.92;
  }
  38% {
    opacity: 0.55;
  }
  44% {
    opacity: 1;
  }
  72% {
    opacity: 0.7;
  }
}

@keyframes broken-glitch-a {
  0%,
  86%,
  100% {
    transform: translate(0, 0);
    opacity: 0.62;
  }
  88% {
    transform: translate(-3px, -1px);
    opacity: 1;
  }
  92% {
    transform: translate(2px, 1px);
  }
  96% {
    transform: translate(-1px, 0);
  }
}

@keyframes broken-glitch-b {
  0%,
  80%,
  100% {
    transform: translate(0, 0);
    opacity: 0.62;
  }
  83% {
    transform: translate(3px, 1px);
    opacity: 1;
  }
  89% {
    transform: translate(-2px, -1px);
  }
  94% {
    transform: translate(1px, 1px);
  }
}

/* ---------- 响应式 ---------- */

@media (max-width: 760px) {
  .soup-list {
    grid-template-columns: 1fr;
    gap: 12px;
    margin-top: 30px;
  }

  .soup-item {
    min-height: 104px;
    padding: 18px;
    border-radius: 22px;
  }

  .soup-item__no {
    writing-mode: horizontal-tb;
  }

  .soup-item__meta {
    flex-direction: column;
    align-items: flex-end;
    gap: 8px;
  }

  .soup-item__tag {
    display: none;
  }

  .chat-shell {
    width: calc(100% - 20px);
    height: calc(100svh - 96px);
    margin-top: 2px;
    border-radius: 22px;
  }

  .chat-head {
    gap: 10px;
    padding: 11px 12px;
  }

  .chat-head__model {
    display: none;
  }

  .chat-head__back span {
    display: none;
  }

  .chat-log {
    padding: 14px 12px 6px;
  }

  .msg__body {
    max-width: 84%;
  }
  .turtle-status {
    display: none;
  }
}

@media (max-width: 560px) {
  .turtle-wrap {
    width: calc(100% - 28px);
    padding-top: 20px;
  }

  .turtle-nav {
    padding: 16px 0;
  }

  .turtle-nav .brand__copy span {
    display: none;
  }

  .turtle-hero h1 {
    font-size: clamp(48px, 15vw, 78px);
  }

  .turtle-hero > p:last-child {
    margin-top: 16px;
  }

  .chat-compose {
    padding: 10px 12px 8px;
  }

  .chat-compose__hint {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .turtle-status i,
  .turtle-hero h1 span,
  .msg__bubble,
  .msg__gate,
  .soup-item--broken:hover,
  .soup-item--broken .soup-item__title::before,
  .soup-item--broken .soup-item__title::after {
    animation: none;
  }
}
</style>
