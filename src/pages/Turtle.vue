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

    <section class="turtle-wrap">
      <header class="turtle-hero">
        <p class="turtle-hero__kicker">AI TURTLE SOUP · CLOSED BETA 001</p>
        <h1>AI 海龟汤<span aria-hidden="true">_</span></h1>
        <p>
          它只会回答三个词：<strong>是</strong>、<strong>不是</strong>、<strong>无关</strong>。<br />
          问对问题，汤底才会浮上来。
        </p>
      </header>

      <div class="turtle-layout">
        <article class="case-card">
          <div class="case-card__top">
            <span>回忆档案 / 001</span>
            <span class="case-card__signal">● SIGNAL STABLE</span>
          </div>
          <h2>凌晨三点的电梯</h2>
          <p>凌晨三点，她收到一条来自自己的消息：</p>
          <blockquote>「别坐电梯。」</blockquote>
          <p>她住在 13 楼。电梯门在她面前打开了。</p>
          <div class="case-card__meta">
            <span>汤面已加载</span>
            <span>询问次数 {{ questionCount }} / 3</span>
          </div>
        </article>

        <section class="terminal-card" aria-label="AI 问答终端">
          <div class="terminal-card__bar">
            <span></span>
            <span></span>
            <span></span>
            <em>ai_turtle.exe · local</em>
          </div>

          <div ref="logEl" class="terminal-card__log" aria-live="polite">
            <p v-if="!log.length" class="terminal-line terminal-line--muted">
              <b>AI</b><span>&gt; 等待你的第一个问题...</span>
            </p>
            <p
              v-for="(item, index) in log"
              :key="index"
              class="terminal-line"
              :class="`terminal-line--${item.role}`"
            >
              <b>{{ item.role === 'you' ? 'YOU' : 'AI' }}</b>
              <span>{{ item.text }}</span>
            </p>
          </div>

          <form class="terminal-card__ask" @submit.prevent="ask">
            <input
              ref="inputEl"
              v-model="question"
              type="text"
              maxlength="60"
              :disabled="questionCount >= 3 || revealed"
              placeholder="问一个只能回答是/否的问题"
              aria-label="向 AI 提问"
            />
            <button
              class="terminal-card__send"
              type="submit"
              :disabled="!question.trim() || questionCount >= 3 || revealed"
            >
              发送
            </button>
          </form>

          <div class="terminal-card__foot">
            <span v-if="!revealed">AI 只会回答：是 / 不是 / 无关</span>
            <button
              v-if="questionCount >= 3 && !revealed"
              class="terminal-card__reveal"
              type="button"
              @click="reveal"
            >
              查看汤底
            </button>
            <span v-else-if="revealed">汤底已解锁</span>
            <button v-else class="terminal-card__ghost" type="button" @click="reset">
              清空对话
            </button>
          </div>
        </section>
      </div>

      <Transition name="truth">
        <section v-if="revealed" ref="truthEl" class="truth-card">
          <p class="truth-card__kicker">THE BOTTOM OF THE SOUP</p>
          <h2>汤底</h2>
          <p>这栋楼没有 13 楼。</p>
          <p>电梯门打开时，她看见的是自己的房间——从门外。</p>
          <p class="truth-card__whisper">发消息的人，是明天早上的她。</p>
          <div class="truth-card__actions">
            <button class="btn btn--primary" type="button" @click="reset">再问一次</button>
            <a class="btn btn--ghost" href="/result">回到结果页</a>
          </div>
        </section>
      </Transition>
    </section>
  </main>
</template>

<script setup>
import { nextTick, ref } from 'vue'

const question = ref('')
const questionCount = ref(0)
const log = ref([])
const revealed = ref(false)
const logEl = ref(null)
const inputEl = ref(null)
const truthEl = ref(null)

const answerRules = [
  { pattern: /电梯|楼层|十三|13/, answer: '是。' },
  { pattern: /消息|短信|手机|发件人/, answer: '是。' },
  { pattern: /门|走廊|外面/, answer: '是。' },
  { pattern: /她|女孩|自己|名字/, answer: '是。' },
  { pattern: /死|血|尸体|受伤/, answer: '不是。' },
  { pattern: /晚上|凌晨|三点|时间/, answer: '是。' }
]

function answerQuestion(text) {
  const matched = answerRules.find((rule) => rule.pattern.test(text))
  return matched ? matched.answer : '无关。'
}

function ask() {
  const text = question.value.trim()
  if (!text || questionCount.value >= 3 || revealed.value) {
    return
  }

  log.value.push({ role: 'you', text })
  log.value.push({ role: 'ai', text: answerQuestion(text) })
  questionCount.value += 1
  question.value = ''

  nextTick(() => {
    if (logEl.value) {
      logEl.value.scrollTop = logEl.value.scrollHeight
    }
  })
}

function reveal() {
  revealed.value = true
  nextTick(() => {
    truthEl.value?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  })
}

function reset() {
  question.value = ''
  questionCount.value = 0
  log.value = []
  revealed.value = false
  nextTick(() => inputEl.value?.focus())
}
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

.turtle-wrap {
  position: relative;
  z-index: 2;
  width: min(1080px, calc(100% - 40px));
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
  font-size: clamp(58px, 10vw, 118px);
  font-weight: 900;
  letter-spacing: -0.09em;
  line-height: 0.86;
}

.turtle-hero h1 span {
  color: #f27d9f;
  animation: turtle-blink 1s steps(2, start) infinite;
}

.turtle-hero > p:last-child {
  max-width: 560px;
  margin-top: 24px;
  color: #c8bccb;
  font-size: clamp(14px, 1.5vw, 17px);
  font-weight: 600;
  line-height: 1.9;
}

.turtle-hero strong {
  color: #fff;
  font-weight: 900;
}

.turtle-layout {
  display: grid;
  grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
  align-items: start;
  gap: 20px;
  margin-top: 44px;
}

.case-card {
  padding: 30px;
  border: 1.5px solid rgba(255, 255, 255, 0.1);
  border-radius: 32px;
  background: rgba(26, 21, 32, 0.82);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.28);
}

.case-card__top {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  color: #8b7892;
  font-size: 9px;
  font-weight: 900;
  letter-spacing: 0.14em;
}

.case-card__signal {
  color: #73c9a6;
}

.case-card h2 {
  margin-top: 22px;
  color: #fff8ef;
  font-size: clamp(27px, 3vw, 38px);
  font-weight: 900;
  letter-spacing: -0.06em;
}

.case-card > p {
  margin-top: 18px;
  color: #c8bccb;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.85;
}

.case-card blockquote {
  margin: 16px 0 0;
  padding: 16px 18px;
  border-left: 3px solid #f27d9f;
  border-radius: 0 16px 16px 0;
  background: rgba(242, 125, 159, 0.08);
  color: #ffe8ee;
  font-size: clamp(18px, 2vw, 23px);
  font-weight: 900;
  letter-spacing: 0.04em;
}

.case-card__meta {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 10px;
  margin-top: 28px;
  padding-top: 16px;
  border-top: 1px dashed rgba(255, 255, 255, 0.12);
  color: #77687f;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.08em;
}

.terminal-card {
  overflow: hidden;
  border: 1px solid #3b2e3f;
  border-radius: 24px;
  background: #07060a;
  box-shadow: 0 26px 70px rgba(0, 0, 0, 0.48);
}

.terminal-card__bar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 12px 16px;
  border-bottom: 1px solid #2a2130;
  background: #100d15;
}

.terminal-card__bar span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #4a3a4f;
}

.terminal-card__bar span:nth-child(1) {
  background: #f27d9f;
}

.terminal-card__bar span:nth-child(2) {
  background: #ffe5a3;
}

.terminal-card__bar span:nth-child(3) {
  background: #73c9a6;
}

.terminal-card__bar em {
  margin-left: 8px;
  color: #8b7892;
  font-family: 'Cascadia Code', Consolas, monospace;
  font-size: 9px;
  font-style: normal;
  letter-spacing: 0.08em;
}

.terminal-card__log {
  height: 264px;
  padding: 18px;
  overflow-y: auto;
  font-family: 'Cascadia Code', Consolas, monospace;
  font-size: 12px;
  line-height: 1.75;
  scrollbar-color: #4a3a4f #07060a;
}

.terminal-line {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin: 0 0 10px;
}

.terminal-line b {
  flex: 0 0 auto;
  padding-top: 2px;
  color: #8b7892;
  font-size: 9px;
  letter-spacing: 0.1em;
}

.terminal-line span {
  min-width: 0;
  word-break: break-word;
}

.terminal-line--you span {
  color: #f3e9dd;
}

.terminal-line--ai b,
.terminal-line--ai span {
  color: #ff94a7;
}

.terminal-line--muted span {
  color: #77687f;
}

.terminal-card__ask {
  display: flex;
  gap: 8px;
  padding: 14px;
  border-top: 1px solid #2a2130;
}

.terminal-card__ask input {
  flex: 1;
  min-width: 0;
  height: 44px;
  padding: 0 13px;
  border: 1px solid #3b2e3f;
  border-radius: 12px;
  outline: none;
  background: #100d15;
  color: #fff;
  font: inherit;
  font-size: 12px;
  transition: border-color 160ms ease, box-shadow 160ms ease;
}

.terminal-card__ask input:focus {
  border-color: #f27d9f;
  box-shadow: 0 0 0 3px rgba(242, 125, 159, 0.12);
}

.terminal-card__ask input::placeholder {
  color: #6f6078;
}

.terminal-card__ask input:disabled {
  opacity: 0.55;
}

.terminal-card__send {
  flex: 0 0 auto;
  min-width: 64px;
  border: 1px solid #f27d9f;
  border-radius: 12px;
  background: #f27d9f;
  color: #1a101b;
  font-size: 12px;
  font-weight: 900;
  cursor: pointer;
  transition: filter 160ms ease, transform 160ms ease;
}

.terminal-card__send:hover:not(:disabled) {
  filter: brightness(1.08);
  transform: translateY(-1px);
}

.terminal-card__send:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.terminal-card__foot {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  min-height: 50px;
  padding: 0 16px 14px;
  color: #77687f;
  font-size: 10px;
  font-weight: 700;
}

.terminal-card__reveal,
.terminal-card__ghost {
  padding: 0;
  border: 0;
  background: transparent;
  color: #f27d9f;
  font: inherit;
  font-weight: 900;
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 4px;
}

.terminal-card__ghost {
  color: #8b7892;
}

.truth-card {
  margin-top: 20px;
  padding: 32px;
  border: 1.5px solid rgba(242, 125, 159, 0.5);
  border-radius: 28px;
  background: linear-gradient(135deg, rgba(242, 125, 159, 0.1), rgba(255, 229, 163, 0.035));
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.22);
}

.truth-card__kicker {
  color: #f27d9f;
  font-size: 9px;
  font-weight: 900;
  letter-spacing: 0.2em;
}

.truth-card h2 {
  margin-top: 8px;
  color: #fff8ef;
  font-size: clamp(34px, 4vw, 48px);
  font-weight: 900;
  letter-spacing: -0.06em;
}

.truth-card > p:not(.truth-card__kicker) {
  margin-top: 13px;
  color: #c8bccb;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.85;
}

.truth-card__whisper {
  color: #ffb2c1 !important;
  font-weight: 900 !important;
}

.truth-card__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 24px;
}

.truth-card__actions .btn--primary {
  background: #f27d9f;
  color: #170d18;
  box-shadow: 0 7px 0 rgba(0, 0, 0, 0.32);
}

.truth-card__actions .btn {
  min-height: 46px;
  padding: 10px 20px;
  font-size: 12px;
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

@media (max-width: 860px) {
  .turtle-layout {
    grid-template-columns: 1fr;
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
    font-size: clamp(54px, 16vw, 86px);
  }

  .turtle-hero > p:last-child {
    margin-top: 18px;
  }

  .turtle-layout {
    margin-top: 30px;
  }

  .case-card {
    padding: 22px;
    border-radius: 24px;
  }

  .terminal-card {
    border-radius: 19px;
  }

  .terminal-card__log {
    height: 230px;
  }

  .truth-card {
    padding: 24px 20px;
    border-radius: 22px;
  }

  .truth-card__actions {
    flex-direction: column;
  }

  .truth-card__actions .btn {
    width: 100%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .turtle-status i,
  .turtle-hero h1 span {
    animation: none;
  }
}
</style>
