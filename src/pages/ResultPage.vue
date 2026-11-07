<template>
  <main class="result-page">
    <div class="result-ambient" aria-hidden="true">
      <span class="result-ambient__blob result-ambient__blob--pink"></span>
      <span class="result-ambient__blob result-ambient__blob--mint"></span>
      <span class="result-ambient__blob result-ambient__blob--lavender"></span>
      <span class="result-ambient__emoji result-ambient__emoji--one">✨</span>
      <span class="result-ambient__emoji result-ambient__emoji--two">🥄</span>
    </div>

    <nav class="topbar shell" aria-label="结果页导航">
      <a class="brand" href="/">
        <span class="brand__mark" aria-hidden="true">🍲</span>
        <span class="brand__copy">
          <strong>SOUP LAB</strong>
          <span>汤汤人格研究所</span>
        </span>
      </a>
      <a class="exit-link" href="/test">再测一次</a>
    </nav>

    <section v-if="result" class="result-wrap">
      <header class="result-hero">
        <div class="result-hero__badge">SOUP PERSONALITY REPORT · 汤格鉴定报告</div>
        <div class="result-hero__emoji" aria-hidden="true">{{ result.emoji }}</div>
        <p class="result-hero__kicker">你的汤之人格是</p>
        <h1 class="result-hero__name">{{ result.name }}</h1>
        <p class="result-hero__title">{{ result.title }}</p>
      </header>
      <div class="result-layout">
        <article class="report-card">
          <div class="report-card__header">
            <div>
              <span class="report-card__eyebrow">TASTING NOTES</span>
              <h2>你的汤底说明书</h2>
            </div>
            <span class="report-card__stamp">已鉴定</span>
          </div>
          <div class="report-card__body">
            <p v-for="(paragraph, index) in paragraphs" :key="index">{{ paragraph }}</p>
          </div>
          <div class="report-card__footer">
            <span>SOUP NO. {{ result.id.toUpperCase() }}</span>
            <span>{{ new Date().getFullYear() }} · SOUP LAB</span>
          </div>
        </article>

        <aside class="recipe-card">
          <span class="recipe-card__tape">今日配方</span>
          <div class="recipe-card__big-emoji" aria-hidden="true">{{ result.emoji }}</div>
          <h2>饮用建议</h2>
          <ul class="recipe-list">
            <li><span aria-hidden="true">🌡️</span>趁热喝，别让好心情凉掉</li>
            <li><span aria-hidden="true">🫶</span>适合分享给懂你奇奇怪怪的人</li>
            <li><span aria-hidden="true">🛌</span>今日宜：吃饱、睡好、少内耗</li>
          </ul>
          <div class="recipe-card__divider"></div>
          <p class="recipe-card__quote">「你不是奇怪，你只是独一份的汤底。」</p>
        </aside>
      </div>

      <div class="result-actions">
        <button class="btn btn--primary" type="button" @click="restart">
          再测一碗 <span class="btn__arrow" aria-hidden="true">→</span>
        </button>
        <button class="btn btn--ghost" type="button" @click="shareResult">
          <span aria-hidden="true">🔗</span> 复制分享文案
        </button>
        <a class="btn btn--ghost" href="/">回到首页</a>
      </div>

      <Transition name="toast">
        <p v-if="toast" class="toast" role="status">{{ toast }}</p>
      </Transition>
      <p class="result-footnote">本结果由汤汤人格研究所随机炖煮 · 仅供娱乐，请勿当真</p>

      <aside
        v-if="!adDismissed"
        class="soup-ad"
        :class="{ 'soup-ad--haunted': adHaunted }"
        aria-label="AI 海龟汤游戏广告"
        @mouseenter="startHaunt"
        @mouseleave="stopHaunt"
        @focusin="startHaunt"
        @focusout="onAdFocusOut"
      >
        <button class="soup-ad__close" type="button" aria-label="关闭广告" @click="dismissAd">×</button>
        <div class="soup-ad__scanlines" aria-hidden="true"></div>
        <div class="soup-ad__static" aria-hidden="true"></div>

        <div class="soup-ad__mark" aria-hidden="true">
          <span>🍲</span>
          <i>AI</i>
        </div>

        <p class="soup-ad__kicker">{{ adHaunted ? '// MEMORY CORRUPTED //' : 'SOUP LAB · 限时内测' }}</p>
        <h2 class="soup-ad__title">AI海龟汤游戏</h2>
        <p class="soup-ad__line">{{ adHaunted ? '它记得你。你确定要回忆吗？' : '点击试玩！' }}</p>
        <a class="soup-ad__cta" href="/turtle">
          <span>{{ adHaunted ? '回 忆' : '点击试玩' }}</span>
          <span aria-hidden="true">{{ adHaunted ? '↺' : '→' }}</span>
        </a>
        <p class="soup-ad__foot">{{ adHaunted ? 'NO.001 · 勿回望' : '3 分钟一局 · 免费试玩' }}</p>
      </aside>
    </section>

    <section v-else class="empty-state">
      <div class="empty-state__emoji" aria-hidden="true">🥣</div>
      <p class="empty-state__kicker">EMPTY POT</p>
      <h1>锅里还是空的</h1>
      <p>先回答完 10 道题，我们才知道你是什么味道的汤。</p>
      <a class="btn btn--primary" href="/test">去开锅 <span class="btn__arrow" aria-hidden="true">→</span></a>
    </section>
  </main>
</template>
<script setup>
import { computed, onBeforeUnmount, ref } from 'vue'
import { results } from '../data/result.js'

const STORAGE_KEY = 'soup-test-answers'

function loadAnswers() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')
    return parsed && typeof parsed === 'object' ? parsed : null
  } catch {
    return null
  }
}

const answers = loadAnswers()

const result = computed(() => {
  if (!answers || Object.keys(answers).length < 10) {
    return null
  }

  return results
    .map((item, index) => {
      const score = item.rules.reduce((total, rule) => {
        return rule.options.includes(answers[rule.question])
          ? total + (rule.score || 1)
          : total
      }, 0)

      return { ...item, score, index }
    })
    .sort((a, b) => b.score - a.score || a.index - b.index)[0]
})

const paragraphs = computed(() =>
  result.value
    ? result.value.description.split(/\n\s*\n/).map((text) => text.trim()).filter(Boolean)
    : []
)

const adDismissed = ref(false)
const adHaunted = ref(false)
let hauntTimer = null
const AD_HOVER_DELAY = 3000

const toast = ref('')
let toastTimer = null

function showToast(message) {
  toast.value = message
  window.clearTimeout(toastTimer)
  toastTimer = window.setTimeout(() => {
    toast.value = ''
  }, 2600)
}

function startHaunt() {
  if (adDismissed.value) {
    return
  }

  window.clearTimeout(hauntTimer)
  hauntTimer = window.setTimeout(() => {
    adHaunted.value = true
  }, AD_HOVER_DELAY)
}

function stopHaunt() {
  window.clearTimeout(hauntTimer)
  adHaunted.value = false
}

function onAdFocusOut(event) {
  if (!event.currentTarget.contains(event.relatedTarget)) {
    stopHaunt()
  }
}

function dismissAd() {
  window.clearTimeout(hauntTimer)
  adHaunted.value = false
  adDismissed.value = true
}

async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text)
    return
  }

  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.setAttribute('readonly', '')
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  document.body.appendChild(textarea)
  textarea.select()
  document.execCommand('copy')
  textarea.remove()
}

async function shareResult() {
  if (!result.value) {
    return
  }

  const text = `${result.value.emoji} 我的汤之人格是「${result.value.name}」！${result.value.title}\n你也来测测：${window.location.origin}/test`

  try {
    await copyText(text)
    showToast('分享文案已复制，快去发给朋友吧 ✨')
  } catch {
    showToast('复制失败，请手动截图分享这碗汤 🥲')
  }
}

function restart() {
  localStorage.removeItem(STORAGE_KEY)
  window.location.href = '/test'
}

onBeforeUnmount(() => {
  window.clearTimeout(toastTimer)
  window.clearTimeout(hauntTimer)
})
</script>

<style scoped>
.result-page {
  position: relative;
  min-height: 100svh;
  overflow: hidden;
}

.result-ambient {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

.result-ambient__blob {
  position: absolute;
  border-radius: 50%;
  opacity: 0.6;
}

.result-ambient__blob--pink {
  top: 4%;
  left: -8rem;
  width: 26rem;
  height: 26rem;
  background: var(--pink-soft);
}

.result-ambient__blob--mint {
  top: 43%;
  right: -9rem;
  width: 27rem;
  height: 27rem;
  background: var(--mint-soft);
}

.result-ambient__blob--lavender {
  bottom: -10rem;
  left: 25%;
  width: 31rem;
  height: 31rem;
  background: var(--lavender-soft);
}

.result-ambient__emoji {
  position: absolute;
  display: grid;
  place-items: center;
  width: 58px;
  height: 58px;
  border: 2px solid rgba(43, 35, 56, 0.08);
  border-radius: 20px;
  background: rgba(255, 253, 251, 0.72);
  box-shadow: 0 8px 0 rgba(43, 35, 56, 0.05);
  font-size: 27px;
}

.result-ambient__emoji--one {
  top: 19%;
  right: 5%;
  transform: rotate(9deg);
}

.result-ambient__emoji--two {
  bottom: 16%;
  left: 4%;
  transform: rotate(-8deg);
}

.exit-link {
  display: inline-flex;
  align-items: center;
  min-height: 38px;
  padding: 8px 15px;
  border: 1.5px solid rgba(43, 35, 56, 0.09);
  border-radius: 999px;
  background: rgba(255, 253, 251, 0.68);
  color: var(--ink-soft);
  font-size: 12px;
  font-weight: 800;
  text-decoration: none;
  backdrop-filter: blur(12px);
}

.exit-link:hover {
  background: #fff;
}

.result-wrap {
  position: relative;
  z-index: 2;
  width: min(1040px, calc(100% - 40px));
  margin-inline: auto;
  padding: 28px 0 54px;
}

.result-hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.result-hero__badge {
  display: inline-flex;
  align-items: center;
  min-height: 36px;
  padding: 8px 15px;
  border: 1.5px solid rgba(43, 35, 56, 0.08);
  border-radius: 999px;
  background: rgba(255, 253, 251, 0.68);
  color: var(--ink-soft);
  font-size: 9px;
  font-weight: 900;
  letter-spacing: 0.16em;
  backdrop-filter: blur(12px);
}

.result-hero__emoji {
  display: grid;
  place-items: center;
  width: 132px;
  height: 132px;
  margin-top: 25px;
  border: 2px solid rgba(43, 35, 56, 0.1);
  border-radius: 44px;
  background: linear-gradient(145deg, var(--pink-soft), var(--butter-soft));
  box-shadow:
    0 13px 0 rgba(43, 35, 56, 0.07),
    0 24px 50px rgba(131, 95, 146, 0.12);
  font-size: 68px;
  transform: rotate(-5deg);
}

.result-hero__kicker {
  margin-top: 28px;
  color: var(--ink-faint);
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.18em;
}

.result-hero__name {
  margin-top: 8px;
  color: var(--ink);
  font-size: clamp(48px, 8vw, 92px);
  font-weight: 900;
  letter-spacing: -0.08em;
  line-height: 1;
}

.result-hero__title {
  max-width: 720px;
  margin-top: 17px;
  color: var(--ink-soft);
  font-size: clamp(16px, 2vw, 21px);
  font-weight: 700;
  line-height: 1.65;
}

.result-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.65fr) minmax(280px, 0.72fr);
  align-items: start;
  gap: 20px;
  margin-top: 38px;
}

.report-card {
  padding: clamp(25px, 4vw, 44px);
  border: 2px solid rgba(43, 35, 56, 0.08);
  border-radius: 42px;
  background: rgba(255, 253, 251, 0.92);
  box-shadow:
    0 25px 60px rgba(111, 81, 128, 0.12),
    0 10px 0 rgba(43, 35, 56, 0.035);
}

.report-card__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
  padding-bottom: 22px;
  border-bottom: 1.5px dashed rgba(43, 35, 56, 0.12);
}

.report-card__eyebrow {
  color: var(--ink-faint);
  font-size: 9px;
  font-weight: 900;
  letter-spacing: 0.2em;
}

.report-card h2 {
  margin-top: 6px;
  font-size: clamp(25px, 3.4vw, 36px);
  font-weight: 900;
  letter-spacing: -0.05em;
}

.report-card__stamp {
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  width: 68px;
  height: 68px;
  border: 2px solid var(--pink-strong);
  border-radius: 50%;
  color: var(--pink-strong);
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.1em;
  transform: rotate(9deg);
}

.report-card__body {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding-top: 25px;
}

.report-card__body p {
  color: var(--ink-soft);
  font-size: 15px;
  font-weight: 600;
  line-height: 1.95;
}

.report-card__body p:first-child::first-letter {
  float: left;
  margin: 5px 7px 0 0;
  color: var(--ink);
  font-size: 42px;
  font-weight: 900;
  line-height: 0.8;
}

.report-card__footer {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 10px;
  margin-top: 30px;
  padding-top: 18px;
  border-top: 1.5px dashed rgba(43, 35, 56, 0.12);
  color: var(--ink-faint);
  font-size: 9px;
  font-weight: 900;
  letter-spacing: 0.13em;
}

.recipe-card {
  position: sticky;
  top: 22px;
  padding: 29px 24px 25px;
  border: 2px solid rgba(43, 35, 56, 0.08);
  border-radius: 34px;
  background: var(--mint-soft);
  box-shadow: 0 9px 0 rgba(43, 35, 56, 0.04);
  transform: rotate(1.2deg);
}

.recipe-card__tape {
  position: absolute;
  top: -12px;
  left: 50%;
  padding: 7px 17px;
  border-radius: 8px;
  background: var(--mint);
  color: var(--ink);
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 0.1em;
  transform: translateX(-50%) rotate(-2deg);
}

.recipe-card__big-emoji {
  display: grid;
  place-items: center;
  width: 78px;
  height: 78px;
  margin-bottom: 17px;
  border: 2px solid rgba(43, 35, 56, 0.08);
  border-radius: 25px;
  background: rgba(255, 253, 251, 0.66);
  font-size: 40px;
}

.recipe-card h2 {
  font-size: 20px;
  font-weight: 900;
}

.recipe-list {
  display: flex;
  flex-direction: column;
  gap: 13px;
  padding: 0;
  margin: 19px 0 0;
  list-style: none;
}

.recipe-list li {
  display: flex;
  align-items: flex-start;
  gap: 9px;
  color: var(--ink-soft);
  font-size: 12px;
  font-weight: 700;
  line-height: 1.55;
}

.recipe-list span {
  font-size: 16px;
  line-height: 1.2;
}

.recipe-card__divider {
  height: 1.5px;
  margin: 22px 0 17px;
  background: rgba(43, 35, 56, 0.1);
}

.recipe-card__quote {
  color: var(--ink);
  font-size: 13px;
  font-weight: 900;
  line-height: 1.65;
}

.result-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  margin-top: 30px;
}

.result-actions .btn {
  min-height: 52px;
  padding-inline: 22px;
  font-size: 14px;
}

.toast {
  width: fit-content;
  max-width: 100%;
  margin: 20px auto 0;
  padding: 11px 18px;
  border: 1.5px solid rgba(43, 35, 56, 0.08);
  border-radius: 999px;
  background: var(--butter);
  color: var(--ink);
  font-size: 12px;
  font-weight: 800;
  text-align: center;
}

.toast-enter-active,
.toast-leave-active {
  transition:
    opacity 180ms ease,
    transform 180ms ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

.result-footnote {
  margin-top: 24px;
  color: var(--ink-faint);
  font-size: 11px;
  font-weight: 700;
  text-align: center;
}

.empty-state {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: min(580px, calc(100% - 40px));
  margin: 7vh auto 0;
  padding: clamp(32px, 6vw, 58px);
  border: 2px solid rgba(43, 35, 56, 0.08);
  border-radius: 46px;
  background: rgba(255, 253, 251, 0.9);
  box-shadow:
    0 26px 65px rgba(111, 81, 128, 0.12),
    0 10px 0 rgba(43, 35, 56, 0.035);
  text-align: center;
}

.empty-state__emoji {
  display: grid;
  place-items: center;
  width: 112px;
  height: 112px;
  border-radius: 38px;
  background: var(--butter-soft);
  font-size: 56px;
  transform: rotate(-5deg);
}

.empty-state__kicker {
  margin-top: 24px;
  color: var(--ink-faint);
  font-size: 9px;
  font-weight: 900;
  letter-spacing: 0.2em;
}

.empty-state h1 {
  margin-top: 8px;
  font-size: clamp(34px, 7vw, 48px);
  font-weight: 900;
  letter-spacing: -0.06em;
}

.empty-state > p:not(.empty-state__kicker) {
  max-width: 360px;
  margin-top: 14px;
  color: var(--ink-soft);
  font-size: 14px;
  font-weight: 600;
  line-height: 1.8;
}

.empty-state .btn {
  margin-top: 25px;
}

@media (max-width: 840px) {
  .result-layout {
    grid-template-columns: 1fr;
  }

  .recipe-card {
    position: relative;
    transform: none;
  }

  .result-ambient__emoji {
    display: none;
  }
}

@media (max-width: 640px) {
  .result-wrap {
    width: min(100% - 28px, 1040px);
    padding-top: 14px;
  }

  .result-hero__emoji {
    width: 108px;
    height: 108px;
    border-radius: 36px;
    font-size: 55px;
  }

  .result-hero__name {
    font-size: clamp(46px, 14vw, 70px);
  }

  .result-hero__title {
    font-size: 15px;
  }

  .result-layout {
    margin-top: 26px;
  }

  .report-card {
    padding: 23px 19px;
    border-radius: 32px;
  }

  .report-card__stamp {
    width: 57px;
    height: 57px;
    font-size: 10px;
  }

  .report-card__body p {
    font-size: 14px;
  }

  .recipe-card {
    padding: 27px 21px 23px;
    border-radius: 29px;
  }

  .result-actions {
    flex-direction: column;
  }

  .result-actions .btn {
    width: 100%;
  }

  .empty-state {
    margin-top: 4vh;
    padding: 32px 22px;
    border-radius: 34px;
  }
}
/* Result page ad popup */
.soup-ad {
  position: fixed;
  right: max(20px, env(safe-area-inset-right));
  bottom: max(20px, env(safe-area-inset-bottom));
  z-index: 40;
  width: min(320px, calc(100vw - 32px));
  padding: 22px 22px 18px;
  border: 2px solid rgba(43, 35, 56, 0.1);
  border-radius: 30px;
  background: linear-gradient(145deg, #fffaf5 0%, #ffeef4 58%, #ffe8c9 100%);
  box-shadow:
    0 22px 55px rgba(111, 81, 128, 0.2),
    0 9px 0 rgba(43, 35, 56, 0.05);
  color: var(--ink);
  text-align: left;
  transform: rotate(-1.4deg);
  transform-origin: 100% 100%;
  animation: soup-ad-arrive 1.45s cubic-bezier(0.19, 1, 0.22, 1) 0.8s both;
  transition:
    background 350ms ease,
    border-color 350ms ease,
    border-radius 350ms ease,
    box-shadow 350ms ease,
    color 350ms ease,
    transform 350ms ease;
  isolation: isolate;
}

.soup-ad::after {
  position: absolute;
  inset: 0;
  z-index: 0;
  border-radius: inherit;
  background: repeating-linear-gradient(
    0deg,
    rgba(255, 255, 255, 0.1) 0,
    rgba(255, 255, 255, 0.1) 1px,
    transparent 1px,
    transparent 3px
  );
  opacity: 0;
  pointer-events: none;
  content: '';
  transition: opacity 300ms ease;
}

.soup-ad__scanlines {
  position: absolute;
  inset: 0;
  z-index: 0;
  border-radius: inherit;
  background: repeating-linear-gradient(
    180deg,
    transparent 0,
    transparent 8px,
    rgba(190, 0, 0, 0.09) 8px,
    rgba(190, 0, 0, 0.09) 9px
  );
  opacity: 0;
  pointer-events: none;
  transition: opacity 250ms ease;
}

/* TV snow: two layers of fractal noise that jump around like a dead channel */
.soup-ad__static {
  --soup-static: url('data:image/png;base64,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');
  position: absolute;
  inset: -14%;
  z-index: 0;
  border-radius: inherit;
  opacity: 0;
  pointer-events: none;
  mix-blend-mode: overlay;
  transition: opacity 320ms ease;
}

.soup-ad__static::before,
.soup-ad__static::after {
  position: absolute;
  inset: 0;
  content: '';
  background-image: var(--soup-static);
  background-repeat: repeat;
}

.soup-ad__static::before {
  background-size: 64px 64px;
  opacity: 0.42;
}

.soup-ad__static::after {
  background-size: 256px 256px;
  image-rendering: pixelated;
  opacity: 0.1;
}

.soup-ad__mark,
.soup-ad__kicker,
.soup-ad__title,
.soup-ad__line,
.soup-ad__cta,
.soup-ad__foot {
  position: relative;
  z-index: 1;
}

.soup-ad__mark {
  display: flex;
  align-items: center;
  gap: 8px;
  width: fit-content;
  margin-bottom: 13px;
  padding: 7px 9px 7px 7px;
  border: 1.5px solid rgba(43, 35, 56, 0.09);
  border-radius: 16px;
  background: rgba(255, 253, 251, 0.9);
  box-shadow: 0 5px 0 rgba(43, 35, 56, 0.06);
  transform: rotate(-3deg);
  transition: background 300ms ease, border-radius 300ms ease, transform 300ms ease;
}

.soup-ad__mark span {
  font-size: 29px;
  line-height: 1;
  transition: filter 300ms ease;
}

.soup-ad__mark i {
  padding: 4px 6px;
  border-radius: 7px;
  background: var(--pink);
  color: var(--ink);
  font-size: 9px;
  font-style: normal;
  font-weight: 900;
  letter-spacing: 0.08em;
}

.soup-ad__kicker {
  color: var(--ink-faint);
  font-size: 9px;
  font-weight: 900;
  letter-spacing: 0.16em;
}

.soup-ad__title {
  margin-top: 6px;
  color: var(--ink);
  font-size: 32px;
  font-weight: 900;
  letter-spacing: -0.07em;
  line-height: 1;
  transition: color 300ms ease, font-size 300ms ease, letter-spacing 300ms ease;
}

.soup-ad__line {
  margin-top: 10px;
  color: var(--ink-soft);
  font-size: 13px;
  font-weight: 800;
  line-height: 1.6;
  transition: color 300ms ease, font-size 300ms ease;
}

.soup-ad__cta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  min-height: 48px;
  margin-top: 15px;
  padding: 0 17px;
  border: 2px solid transparent;
  border-radius: 999px;
  background: var(--ink);
  box-shadow: 0 7px 0 rgba(43, 35, 56, 0.14);
  color: #fffdfb;
  font-size: 14px;
  font-weight: 900;
  text-decoration: none;
  transition:
    background 300ms ease,
    color 300ms ease,
    border-radius 300ms ease,
    box-shadow 300ms ease,
    font-size 300ms ease,
    letter-spacing 300ms ease,
    transform 180ms ease;
}

.soup-ad__cta:hover {
  transform: translateY(-2px);
}

.soup-ad__foot {
  margin-top: 11px;
  color: var(--ink-faint);
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.08em;
  transition: color 300ms ease;
}

.soup-ad__close {
  position: absolute;
  top: 9px;
  right: 10px;
  z-index: 5;
  display: grid;
  place-items: center;
  width: 26px;
  height: 26px;
  padding: 0;
  border: 1px solid rgba(43, 35, 56, 0.11);
  border-radius: 50%;
  background: rgba(255, 253, 251, 0.75);
  color: var(--ink-soft);
  font-size: 17px;
  line-height: 1;
  cursor: pointer;
  transition:
    background 180ms ease,
    border-radius 300ms ease,
    color 300ms ease;
}

.soup-ad__close:hover {
  background: #fff;
  color: var(--ink);
}

.soup-ad--haunted {
  border-color: #140104;
  border-radius: 0;
  background-color: #96876e;
  background-image:
    /* burnt vignette: the sheet is scorched towards every edge */
    radial-gradient(
      122% 108% at 50% 44%,
      transparent 42%,
      rgba(12, 3, 4, 0.22) 64%,
      rgba(8, 2, 3, 0.72) 100%
    ),
    /* scorch halo creeping out from the ripped corner */
    radial-gradient(
      circle 160px at -20px -30px,
      rgba(14, 2, 3, 0.9) 0 48%,
      rgba(26, 5, 6, 0.55) 66%,
      transparent 86%
    ),
    /* burnt bottom-right corner */
    radial-gradient(
      circle 84px at 108% 111%,
      #050001 0 50%,
      #180306 66%,
      rgba(238, 226, 198, 0.6) 70% 72%,
      rgba(70, 44, 22, 0.3) 80%,
      transparent 92%
    ),
    radial-gradient(34% 28% at 104% 40%, rgba(116, 0, 4, 0.5), transparent 72%),
    radial-gradient(42% 30% at -2% 106%, rgba(20, 4, 5, 0.5), transparent 76%),
    radial-gradient(28% 20% at 72% 9%, rgba(28, 10, 6, 0.26), transparent 72%),
    radial-gradient(24% 18% at 16% 90%, rgba(24, 8, 6, 0.24), transparent 72%),
    radial-gradient(30% 24% at 90% 76%, rgba(58, 20, 10, 0.2), transparent 74%),
    repeating-linear-gradient(101deg, rgba(58, 30, 14, 0.05) 0 1px, transparent 1px 23px);
  box-shadow: none;
  filter:
    drop-shadow(6px 6px 0 #100102)
    drop-shadow(0 0 18px rgba(150, 0, 0, 0.55));
  transform: rotate(0deg) scale(1.01);
  clip-path: polygon(
    0% 0.6%, 5.5% 0.2%, 9% 1.1%, 14.5% 0.1%,
    19% 0.9%, 26% 0.2%, 33% 1.2%, 38% 0.1%,
    44.5% 0.6%, 52% 0%, 59% 1.4%, 64% 0.3%,
    71% 0.1%, 78% 1.1%, 84% 0.2%, 90.5% 0.8%,
    96% 0.1%, 100% 0.4%, 99.1% 6%, 99.9% 12.5%,
    98.6% 19%, 99.8% 26%, 99.2% 33.5%, 100% 41%,
    98.8% 48%, 99.9% 55.5%, 99.1% 63%, 99.8% 70.5%,
    99% 78%, 99.9% 85%, 99.2% 92%, 100% 100%,
    97.5% 97.4%, 94% 99.6%, 91% 96.8%, 87.5% 99.9%,
    84% 97.9%, 80.5% 99.2%, 77% 96.4%, 73.5% 99.8%,
    70% 98.1%, 66.5% 99.9%, 63% 97.2%, 59.5% 99.4%,
    56% 98.6%, 52.5% 99.9%, 49% 97.1%, 45.5% 99.6%,
    42% 98.2%, 38.5% 99.9%, 35% 97.6%, 31.5% 99.2%,
    28% 96.9%, 24.5% 99.8%, 21% 98.4%, 17.5% 99.9%,
    14% 97.5%, 10.5% 99.3%, 7% 98.1%, 3.5% 99.9%,
    0% 100%, 1.2% 94.5%, 0.2% 88.5%, 2.4% 82.5%,
    0.3% 76.5%, 1.6% 70.5%, 0.2% 64.5%, 2.8% 58.5%,
    0.4% 52.5%, 1.4% 46.5%, 0.2% 40.5%, 2.2% 34.5%,
    0.3% 28.5%, 1.8% 22.5%, 0.2% 16.5%, 1.1% 10.5%,
    0.4% 4.5%
  );
}

/* the top-left corner is ripped clean off: a flap torn away from the void behind */
.soup-ad--haunted::before {
  position: absolute;
  inset: 0;
  z-index: 0;
  content: '';
  background: radial-gradient(circle at 100% 100%, #190507, #040001 62%);
  clip-path: polygon(
    0 0,
    34% 0,
    31.5% 3.2%,
    33% 6.6%,
    28% 8.6%,
    29.6% 12.4%,
    24.6% 14.2%,
    26.2% 18%,
    20.5% 19.6%,
    22.2% 23.4%,
    16.5% 25.6%,
    12.4% 23.2%,
    8.8% 26.2%,
    4.6% 23.6%,
    0 25.8%
  );
  filter: drop-shadow(2px 2px 0 rgba(244, 233, 206, 0.5));
  pointer-events: none;
  transition: opacity 300ms ease;
}

.soup-ad--haunted::after {
  opacity: 1;
  mix-blend-mode: screen;
  background-image:
    repeating-linear-gradient(
      180deg,
      transparent 0 178px,
      rgba(255, 250, 235, 0.26) 178px 179px,
      rgba(255, 255, 255, 0.06) 179px 194px,
      transparent 194px 372px
    ),
    repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.07) 0 1px, transparent 1px 3px);
  background-size: 100% 372px, 100% 3px;
  animation: soup-ad-roll 4.6s linear infinite;
}

.soup-ad--haunted .soup-ad__static {
  opacity: 1;
}

.soup-ad--haunted .soup-ad__static::before {
  animation: soup-ad-snow-fine 0.52s steps(1, end) infinite;
}

.soup-ad--haunted .soup-ad__static::after {
  animation: soup-ad-snow-coarse 0.86s steps(1, end) infinite;
}

.soup-ad--haunted .soup-ad__scanlines {
  opacity: 1;
  animation: soup-ad-scan 0.65s linear infinite;
}

.soup-ad--haunted .soup-ad__mark {
  border: 2px solid #1c0508;
  border-radius: 2px;
  background: #d8d0bd;
  box-shadow: 3px 3px 0 #1c0508;
  transform: rotate(0deg);
}

.soup-ad--haunted .soup-ad__mark span {
  filter: grayscale(1) contrast(1.45);
}

.soup-ad--haunted .soup-ad__mark i {
  background: #b00000;
  color: #fff200;
}

.soup-ad--haunted .soup-ad__kicker {
  color: #7b0000;
  font-family: 'Courier New', monospace;
  letter-spacing: 0.22em;
  animation: soup-ad-flicker 1.1s steps(2, start) infinite;
}

.soup-ad--haunted .soup-ad__title {
  color: #c40000;
  font-family: 'SimSun', '宋体', serif;
  font-size: 46px;
  letter-spacing: -0.14em;
  line-height: 0.88;
  text-shadow:
    2px 2px 0 #fff8e7,
    5px 5px 0 #160306;
  animation: soup-ad-twitch 0.28s steps(2, end) infinite;
}

.soup-ad--haunted .soup-ad__line {
  color: #230003;
  font-family: 'SimSun', '宋体', serif;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.05em;
}

.soup-ad--haunted .soup-ad__cta {
  border: 2px solid #1c0508;
  border-radius: 2px;
  background: #c40000;
  box-shadow: 4px 4px 0 #1c0508;
  color: #fff200;
  font-family: 'SimSun', '宋体', serif;
  font-size: 23px;
  letter-spacing: 0.2em;
  text-shadow: 2px 2px 0 #3d0000;
}

.soup-ad--haunted .soup-ad__cta:hover {
  background: #e00000;
  transform: translate(-1px, -1px);
}

.soup-ad--haunted .soup-ad__foot {
  color: #6d0000;
  font-family: 'Courier New', monospace;
  letter-spacing: 0.12em;
}

.soup-ad--haunted .soup-ad__close {
  border: 1px solid #1c0508;
  border-radius: 0;
  background: #1c0508;
  color: #ffef9a;
  font-family: 'Courier New', monospace;
}

@keyframes soup-ad-arrive {
  0% {
    opacity: 0;
    translate: 125% 28%;
    filter: blur(2px);
  }
  70% {
    opacity: 1;
    translate: -3% 0;
    filter: blur(0);
  }
  100% {
    opacity: 1;
    translate: 0 0;
  }
}

@keyframes soup-ad-twitch {
  0%,
  100% {
    transform: translate(0, 0);
  }
  25% {
    transform: translate(-1px, 0) skewX(-1deg);
  }
  75% {
    transform: translate(1px, 0) skewX(1deg);
  }
}

@keyframes soup-ad-flicker {
  0%,
  40% {
    opacity: 1;
  }
  41%,
  47% {
    opacity: 0.3;
  }
  48%,
  100% {
    opacity: 1;
  }
}

@keyframes soup-ad-scan {
  to {
    background-position: 0 18px;
  }
}

@keyframes soup-ad-roll {
  from {
    background-position: 0 -372px, 0 0;
  }
  to {
    background-position: 0 0, 0 0;
  }
}

@keyframes soup-ad-snow-fine {
  0% {
    background-position: 0 0;
  }
  17% {
    background-position: -47px 31px;
  }
  34% {
    background-position: 63px -52px;
  }
  51% {
    background-position: -88px -17px;
  }
  68% {
    background-position: 22px 74px;
  }
  84% {
    background-position: -31px 55px;
  }
  100% {
    background-position: 0 0;
  }
}

@keyframes soup-ad-snow-coarse {
  0% {
    background-position: 0 0;
  }
  25% {
    background-position: -124px 86px;
  }
  50% {
    background-position: 96px -142px;
  }
  75% {
    background-position: -68px -58px;
  }
  100% {
    background-position: 0 0;
  }
}

@media (max-width: 640px) {
  .soup-ad {
    right: max(12px, env(safe-area-inset-right));
    bottom: max(12px, env(safe-area-inset-bottom));
    width: min(340px, calc(100vw - 24px));
    padding: 18px 18px 15px;
    border-radius: 25px;
  }

  .soup-ad--haunted .soup-ad__title {
    font-size: 42px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .soup-ad {
    opacity: 1;
    animation: none;
    translate: 0 0;
  }

  .soup-ad--haunted .soup-ad__scanlines,
  .soup-ad--haunted .soup-ad__kicker,
  .soup-ad--haunted .soup-ad__title,
  .soup-ad--haunted::after,
  .soup-ad--haunted .soup-ad__static::before,
  .soup-ad--haunted .soup-ad__static::after {
    animation: none;
  }
}
</style>
