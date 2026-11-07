export const results = [
  {
    id: 'tomato-egg',
    name: '番茄鸡蛋汤',
    emoji: '🍅',
    title: '是仙品，也可以同时是大众追求！',

    description: `
你的生活虽然常规，却从来不会因此变得平淡。你不一定非要追求惊天动地的人生，但总会在平凡的日子里寻找属于自己的小小乐趣。你向往独特的风格，也愿意按照自己的方式生活，不太喜欢被别人规定“应该是什么样子”。

你是自己生活里的小太阳。即使偶尔遇到突如其来的麻烦，也通常能够慢慢调整状态，把事情一件一件处理好。你可能没有什么特别离谱的超能力，但你拥有一种很难得的稳定感——该吃饭吃饭，该睡觉睡觉，该发疯的时候也绝不含糊。

总之，番茄鸡蛋汤是一种非常经典的存在。

简单、可靠、好吃，而且永远有人喜欢。
    `.trim(),

    rules: [
      { question: 1, options: ['B', 'C'], score: 1 },
      { question: 2, options: ['A'], score: 1 },
      { question: 3, options: ['C'], score: 1 },
      { question: 4, options: ['C'], score: 1 },
      { question: 6, options: ['A'], score: 1 },
      { question: 7, options: ['A', 'B'], score: 1 },
      { question: 9, options: ['A', 'B'], score: 1 },
      { question: 10, options: ['B', 'C'], score: 1 }
    ]
  },

  {
    id: 'tangtang',
    name: '汤汤（不啥）',
    emoji: '🍲',
    title: '是清波寨大当家，是很棒的朋友，也是啥子！',

    description: `
你性格直爽，讲究义气，做事洒脱，不喜欢被各种规矩束缚。比起精心计算每一步，你更愿意凭自己的感觉行动。自由对你来说非常重要，你喜欢轻松自在的生活，也喜欢跟真正合得来的人一起玩耍、戏水、发癫。

你讨厌背叛。

一旦你真正认定一个人是朋友，就会把对方当成自己人。朋友遇到困难的时候，你可能嘴上还会损两句，但真到了需要帮忙的时候，你大概已经第一个冲出去了。

你身上有一种很难得的少年气：不喜欢把事情想得太复杂，也不屑于为了迎合别人改变自己。

当然，这一切最重要的前提是——

你是个啥子。
    `.trim(),

    rules: [
      { question: 1, options: ['B'], score: 1 },
      { question: 2, options: ['D'], score: 1 },
      { question: 3, options: ['A', 'B'], score: 1 },
      { question: 4, options: ['A', 'D'], score: 1 },
      { question: 5, options: ['A', 'B', 'C'], score: 1 },
      { question: 6, options: ['B', 'D'], score: 1 },
      { question: 8, options: ['A', 'B'], score: 1 },
      { question: 9, options: ['B', 'D'], score: 1 }
    ]
  },

  {
    id: 'loofah',
    name: '丝瓜汤',
    emoji: '🥒',
    title: '降肝火的神器，也是美国人下毒的媒介！',

    description: `
你的创伤是你的印章。它们或许曾经让你感到疲惫，让你不得不弯下腰面对一些并不容易处理的事情，但你也在一次次经历之中慢慢长出了自己的模样。

你很擅长捕捉人与人之间那些微妙的情绪，尤其是代际沟通、家庭关系以及“明明大家都在说话，为什么就是没办法好好交流”这种问题。

你心思细腻，共情力很强，很容易注意到别人忽略的小细节。

但神奇的是，你并不会永远沉浸在这些沉重的东西里。

你反而很擅长把压抑的情绪包装成夸张、荒诞甚至有点抽象的玩笑。别人可能觉得你只是在发癫，但实际上，那或许正是你与生活相处的方式。

把眼泪变成笑话，把创伤变成段子，然后继续生活。
    `.trim(),

    rules: [
      { question: 1, options: ['D'], score: 1 },
      { question: 2, options: ['C', 'D'], score: 1 },
      { question: 3, options: ['B', 'D'], score: 1 },
      { question: 4, options: ['B', 'C'], score: 1 },
      { question: 5, options: ['C'], score: 1 },
      { question: 6, options: ['C'], score: 3 },
      { question: 8, options: ['C', 'D'], score: 1 },
      { question: 10, options: ['C'], score: 1 }
    ]
  },

  {
    id: 'tomson',
    name: '汤臣一品',
    emoji: '🏠',
    title: '而你，我的朋友，你是真正的富豪！',

    description: `
目光所及，不必权衡取舍。

很多普通人需要纠结很久的问题，对你来说可能只需要一个简单的解决方案——买。

你拥有一种令人羡慕的选择自由：不喜欢的东西可以换掉，不合适的环境可以离开，想吃的东西不用等到星期四，喜欢的东西也不用先打开计算器看看余额。

你不必为了生计过度委屈自己，也不需要为了几百块钱反复思考到底值不值得。

当然，真正的富豪并不只是银行卡上的数字。

更重要的是，你拥有一种“我还有选择”的底气。

所以当别人还在研究优惠券的时候，你已经轻轻地说出了那句至理名言：

“买。”
    `.trim(),

    rules: [
      { question: 1, options: ['A'], score: 1 },
      { question: 2, options: ['B'], score: 1 },
      { question: 4, options: ['B', 'C'], score: 1 },
      { question: 5, options: ['A', 'B'], score: 1 },
      { question: 6, options: ['D'], score: 1 },
      { question: 7, options: ['C', 'D'], score: 1 },
      { question: 9, options: ['A', 'D'], score: 1 },
      { question: 10, options: ['A'], score: 3 }
    ]
  },

  {
    id: 'white-fungus',
    name: '银耳汤',
    emoji: '🍮',
    title: '微甜的滋味，更是繁复生活的一剂良药！',

    description: `
你总能从一些不起眼的小事里捡到欢喜。

路边突然盛开的花、好喝的一杯饮料、朋友发来的一句废话、天气刚刚好的傍晚——这些看起来没有什么特别的瞬间，都可能让你觉得“今天其实也还不错”。

你的心里没有太多复杂的算计，对世界始终保留着一份柔软的信任。

即使遇到糟心的事情，你也许会难过、生气，甚至当场骂两句，但通常不会让这些事情在心里停留太久。你依然愿意真诚地对待身边的人，也愿意相信别人并不是时时刻刻都怀着恶意。

你眼里藏着一种简单的光。

不是不懂这个世界的复杂，而是看见复杂之后，依然愿意喜欢那些简单的东西。

活得干净、柔软，又鲜活。
    `.trim(),

    rules: [
      { question: 1, options: ['C'], score: 1 },
      { question: 2, options: ['A', 'C', 'D'], score: 1 },
      { question: 3, options: ['A', 'C'], score: 1 },
      { question: 4, options: ['A', 'B', 'D'], score: 1 },
      { question: 5, options: ['D'], score: 1 },
      { question: 6, options: ['A', 'B'], score: 1 },
      { question: 7, options: ['A'], score: 1 },
      { question: 8, options: ['B', 'C'], score: 1 },
      { question: 9, options: ['A', 'B'], score: 1 }
    ]
  },

  {
    id: 'brown-rice',
    name: '糙米薏仁汤',
    emoji: '🌾',
    title: '祺嫔又梦魇了？',

    description: `
你似乎拥有一种非常特殊的能力：

把现实里的痛苦，变成旁人完全看不懂的东西。

当生活开始变得难以处理时，你未必会选择正面硬碰硬。相比之下，你更喜欢用抽象、荒诞、戏谑甚至莫名其妙的表达，把那些沉重的情绪包起来。

别人问：“你还好吗？”

你可能：

🥺👉🍚👉🐟👉🌚

然后自己笑了。

这并不意味着你没有烦恼。恰恰相反，你可能比很多人都更清楚生活里那些让人烦躁、疲惫甚至无奈的东西。

只是你有自己的处理方式。

你可以用一个梗、一张表情包、一句完全不着边际的话，把原本沉重的空气戳破一个洞，然后从里面重新透口气。

当然，也存在另一种可能：

你真的只是喜欢表情符号。

又或者……

你根本就是在梦游。
    `.trim(),

    special: {
      type: 'emoji-options-top-two'
    },

    rules: [
      { question: 1, options: ['D'], score: 1 },
      { question: 2, options: ['B'], score: 1 },
      { question: 3, options: ['C'], score: 1 },
      { question: 4, options: ['D'], score: 1 },
      { question: 5, options: ['A'], score: 1 },
      { question: 6, options: ['C'], score: 1 },
      { question: 8, options: ['A'], score: 1 }
    ]
  },

  {
    id: 'plum',
    name: '酸梅汤',
    emoji: '🧃',
    title: '是百搭的款式，但是谁会刻意去买呢？',

    description: `
你待人就像浅淡的菊香，不争、不扰，也不会刻意抢占任何人的注意力。

在人群里，你可能并不是最显眼的那个人。

聚会的时候你不会主动成为中心，聊天的时候也不一定需要所有人都注意到你。你更习惯待在自己的位置上，看着周围发生的一切，偶尔说一句话，然后继续安静地观察这个世界。

你的心底或许藏着一点对世间的倦怠。

但你不会因此大声抱怨，也很少试图把自己的情绪强行塞给别人。你只是和世界保持着一点刚刚好的距离。

不靠得太近，也不离得太远。

你可能没有特别强烈的攻击性，也没有什么非要证明不可的东西。

世界爱怎么热闹就怎么热闹。

你喝你的酸梅汤。
    `.trim(),

    rules: [
      { question: 1, options: ['A'], score: 1 },
      { question: 3, options: ['D'], score: 2 },
      { question: 5, options: ['D'], score: 1 },
      { question: 6, options: ['C'], score: 1 },
      { question: 7, options: ['A', 'B', 'C', 'D'], score: 1 },
      { question: 8, options: ['D'], score: 2 },
      { question: 9, options: ['D'], score: 1 },
      { question: 10, options: ['D'], score: 1 }
    ]
  }
]