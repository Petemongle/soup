<template>
  <main class="quiz-page">
    <div class="quiz-ambient" aria-hidden="true">
      <span class="quiz-ambient__blob quiz-ambient__blob--pink"></span>
      <span class="quiz-ambient__blob quiz-ambient__blob--mint"></span>
      <span class="quiz-ambient__blob quiz-ambient__blob--butter"></span>
      <span class="quiz-ambient__emoji quiz-ambient__emoji--one">🍲</span>
      <span class="quiz-ambient__emoji quiz-ambient__emoji--two">🥄</span>
    </div>

    <nav class="topbar shell" aria-label="测试导航">
      <a class="brand" href="/">
        <span class="brand__mark" aria-hidden="true">🍲</span>
        <span class="brand__copy">
          <strong>SOUP LAB</strong>
          <span>汤汤人格研究所</span>
        </span>
      </a>
      <a class="exit-link" href="/">退出测试</a>
    </nav>

    <section class="quiz-wrap">
      <header class="quiz-head">
        <div class="quiz-head__step">
          <span class="quiz-head__label">QUESTION</span>
          <strong>{{ currentLabel }}</strong>
        </div>

        <div class="quiz-head__progress">
          <div class="quiz-head__progress-copy">
            <span>已完成 {{ answeredCount }} / {{ questions.length }}</span>
            <span>{{ progressPercent }}%</span>
          </div>
          <div class="progress-track" role="progressbar" :aria-valuenow="progressPercent" aria-valuemin="0" aria-valuemax="100">
            <span class="progress-track__fill" :style="{ width: `${progressPercent}%` }"></span>
          </div>
          <div class="question-dots" aria-hidden="true">
            <span
              v-for="(question, index) in questions"
              :key="question.id"
              class="question-dot"
              :class="{
                'question-dot--current': index === currentIndex,
                'question-dot--done': answers[question.id]
              }"
            ></span>
          </div>
        </div>
      </header>

      <Transition name="question-swap" mode="out-in">
        <article class="question-panel" :key="currentQuestion.id">
          <div class="question-panel__meta">
            <span class="question-category">{{ categoryOf(currentQuestion.id) }}</span>
            <span class="question-hint">凭第一直觉选，不要想太久</span>
          </div>

          <h1 class="question-title">{{ currentQuestion.title }}</h1>

          <div class="option-grid" role="group" :aria-label="`第 ${currentIndex + 1} 题选项`">
            <button
              v-for="(option, index) in currentQuestion.options"
              :key="option.key"
              type="button"
              class="option"
              :class="[`option--${index}`, { 'option--selected': selected === option.key }]"
              :aria-pressed="selected === option.key"
              @click="selectOption(option.key)"
            >
              <span class="option__key">{{ option.key }}</span>
              <span class="option__text">{{ option.text }}</span>
              <span class="option__check" aria-hidden="true">✓</span>
            </button>
          </div>

          <div class="question-panel__actions">
            <button class="btn btn--ghost prev-button" type="button" :disabled="currentIndex === 0" @click="previousQuestion">
              <span aria-hidden="true">←</span>
              上一题
            </button>

            <button class="btn btn--primary next-button" type="button" :disabled="!selected" @click="nextQuestion">
              {{ isLast ? '揭晓我的汤' : '下一题' }}
              <span class="btn__arrow" aria-hidden="true">→</span>
            </button>
          </div>
        </article>
      </Transition>

      <p class="quiz-footnote">本测试仅供娱乐 · 不要因为结果是汤而怀疑人生</p>
    </section>
  </main>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { questions } from '../data/questions.js'

const STORAGE_KEY = 'soup-test-answers'
const answers = reactive({})
const currentIndex = ref(0)

const currentQuestion = computed(() => questions[currentIndex.value])
const selected = computed(() => answers[currentQuestion.value.id] || null)
const isLast = computed(() => currentIndex.value === questions.length - 1)
const currentLabel = computed(() => `${String(currentIndex.value + 1).padStart(2, '0')} / ${String(questions.length).padStart(2, '0')}`)

const answeredCount = computed(() =>
  questions.filter((question) => Boolean(answers[question.id])).length
)

const progressPercent = computed(() =>
  Math.round((answeredCount.value / questions.length) * 100)
)

const categories = ['生活观察', '眼缘测试', '脑洞雷达', '口味偏好', '互联网体质']

function categoryOf(id) {
  return categories[(id - 1) % categories.length]
}

function selectOption(key) {
  answers[currentQuestion.value.id] = key
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function nextQuestion() {
  if (!selected.value) {
    return
  }

  if (isLast.value) {
    submitTest()
    return
  }

  currentIndex.value += 1
  scrollToTop()
}

function previousQuestion() {
  if (currentIndex.value === 0) {
    return
  }

  currentIndex.value -= 1
  scrollToTop()
}

function submitTest() {
  if (answeredCount.value < questions.length) {
    return
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(answers))
  window.location.href = '/result'
}
</script>

<style scoped>
.quiz-page {
  position: relative;
  min-height: 100svh;
  overflow: hidden;
}

.quiz-ambient {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

.quiz-ambient__blob {
  position: absolute;
  border-radius: 50%;
  opacity: 0.62;
}

.quiz-ambient__blob--pink {
  top: 13%;
  left: -9rem;
  width: 25rem;
  height: 25rem;
  background: var(--pink-soft);
}

.quiz-ambient__blob--mint {
  right: -8rem;
  top: 35%;
  width: 24rem;
  height: 24rem;
  background: var(--mint-soft);
}

.quiz-ambient__blob--butter {
  bottom: -10rem;
  left: 34%;
  width: 30rem;
  height: 30rem;
  background: var(--butter-soft);
}

.quiz-ambient__emoji {
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

.quiz-ambient__emoji--one {
  top: 18%;
  right: 5%;
  transform: rotate(8deg);
}

.quiz-ambient__emoji--two {
  bottom: 12%;
  left: 4%;
  transform: rotate(-10deg);
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
  transition:
    background 180ms ease,
    transform 180ms ease;
}

.exit-link:hover {
  background: #fff;
  transform: translateY(-2px);
}

.quiz-wrap {
  position: relative;
  z-index: 2;
  width: min(900px, calc(100% - 40px));
  margin-inline: auto;
  padding: 24px 0 56px;
}

.quiz-head {
  display: grid;
  grid-template-columns: 142px minmax(0, 1fr);
  align-items: center;
  gap: 26px;
  margin-bottom: 22px;
  padding: 14px 18px;
  border: 1.5px solid rgba(43, 35, 56, 0.07);
  border-radius: 28px;
  background: rgba(255, 253, 251, 0.58);
  box-shadow: 0 8px 0 rgba(43, 35, 56, 0.03);
  backdrop-filter: blur(15px);
}

.quiz-head__step {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding-left: 8px;
}

.quiz-head__label {
  color: var(--ink-faint);
  font-size: 9px;
  font-weight: 900;
  letter-spacing: 0.22em;
}

.quiz-head__step strong {
  font-size: 24px;
  font-weight: 900;
  letter-spacing: -0.04em;
}

.quiz-head__progress {
  min-width: 0;
}

.quiz-head__progress-copy {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 7px;
  color: var(--ink-soft);
  font-size: 11px;
  font-weight: 800;
}

.progress-track {
  width: 100%;
  height: 11px;
  overflow: hidden;
  border-radius: 999px;
  background: #eee7ed;
}

.progress-track__fill {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--pink-strong), var(--lavender-strong));
  transition: width 380ms cubic-bezier(0.22, 1, 0.36, 1);
}

.question-dots {
  display: flex;
  gap: 5px;
  margin-top: 8px;
}

.question-dot {
  flex: 1;
  height: 4px;
  border-radius: 999px;
  background: rgba(43, 35, 56, 0.08);
  transition: background 180ms ease;
}

.question-dot--done {
  background: var(--pink);
}

.question-dot--current {
  background: var(--ink);
}

.question-panel {
  position: relative;
  overflow: hidden;
  padding: clamp(26px, 4.5vw, 50px);
  border: 2px solid rgba(43, 35, 56, 0.08);
  border-radius: 46px;
  background: rgba(255, 253, 251, 0.92);
  box-shadow:
    0 26px 65px rgba(111, 81, 128, 0.13),
    0 10px 0 rgba(43, 35, 56, 0.035);
}

.question-panel::before {
  content: "";
  position: absolute;
  top: -95px;
  right: -65px;
  width: 210px;
  height: 210px;
  border-radius: 50%;
  background: var(--pink-soft);
  pointer-events: none;
}

.question-panel::after {
  content: "🍲";
  position: absolute;
  top: 23px;
  right: 26px;
  font-size: 27px;
  opacity: 0.75;
  transform: rotate(8deg);
  pointer-events: none;
}

.question-panel__meta {
  position: relative;
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}

.question-category {
  display: inline-flex;
  align-items: center;
  min-height: 30px;
  padding: 6px 12px;
  border-radius: 999px;
  background: var(--mint-soft);
  color: #388268;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.06em;
}

.question-hint {
  color: var(--ink-faint);
  font-size: 11px;
  font-weight: 700;
}

.question-title {
  position: relative;
  z-index: 1;
  max-width: 720px;
  margin-top: 22px;
  color: var(--ink);
  font-size: clamp(27px, 4.1vw, 43px);
  font-weight: 900;
  letter-spacing: -0.045em;
  line-height: 1.28;
}

.option-grid {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  margin-top: 30px;
}

.option {
  --option-bg: var(--pink-soft);
  --option-key: #d75c84;
  display: grid;
  grid-template-columns: 39px minmax(0, 1fr) 24px;
  align-items: center;
  gap: 13px;
  min-height: 100px;
  padding: 16px 17px;
  border: 2px solid transparent;
  border-radius: 24px;
  background: var(--option-bg);
  color: var(--ink);
  text-align: left;
  transition:
    transform 180ms ease,
    border-color 180ms ease,
    box-shadow 180ms ease,
    filter 180ms ease;
}

.option--0 {
  --option-bg: var(--pink-soft);
  --option-key: #d75c84;
}

.option--1 {
  --option-bg: var(--butter-soft);
  --option-key: #b88919;
}

.option--2 {
  --option-bg: var(--mint-soft);
  --option-key: #388268;
}

.option--3 {
  --option-bg: var(--lavender-soft);
  --option-key: #7b63c9;
}

.option:hover {
  transform: translateY(-3px);
  filter: saturate(1.06);
  box-shadow: 0 9px 0 rgba(43, 35, 56, 0.05);
}

.option--selected {
  border-color: var(--ink);
  box-shadow: 0 8px 0 rgba(43, 35, 56, 0.1);
  transform: translateY(-2px);
}

.option__key {
  display: grid;
  place-items: center;
  width: 39px;
  height: 39px;
  border-radius: 14px;
  background: rgba(255, 253, 251, 0.72);
  color: var(--option-key);
  font-size: 15px;
  font-weight: 900;
  box-shadow: 0 3px 0 rgba(43, 35, 56, 0.045);
}

.option__text {
  color: var(--ink);
  font-size: 15px;
  font-weight: 700;
  line-height: 1.55;
}

.option__check {
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  border: 2px solid rgba(43, 35, 56, 0.12);
  border-radius: 50%;
  color: transparent;
  font-size: 13px;
  font-weight: 900;
  transition:
    background 180ms ease,
    border-color 180ms ease,
    color 180ms ease,
    transform 180ms ease;
}

.option--selected .option__check {
  border-color: var(--ink);
  background: var(--ink);
  color: #fff;
  transform: rotate(-8deg) scale(1.08);
}

.question-panel__actions {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 30px;
  padding-top: 22px;
  border-top: 1.5px dashed rgba(43, 35, 56, 0.1);
}

.prev-button {
  min-width: 122px;
}

.next-button {
  min-width: 188px;
}

.quiz-footnote {
  margin-top: 20px;
  color: var(--ink-faint);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-align: center;
}

.question-swap-enter-active,
.question-swap-leave-active {
  transition:
    opacity 220ms ease,
    transform 220ms ease;
}

.question-swap-enter-from {
  opacity: 0;
  transform: translateX(28px) scale(0.985);
}

.question-swap-leave-to {
  opacity: 0;
  transform: translateX(-24px) scale(0.985);
}

@media (max-width: 760px) {
  .quiz-wrap {
    width: min(100% - 28px, 900px);
    padding-top: 12px;
  }

  .quiz-head {
    grid-template-columns: 96px minmax(0, 1fr);
    gap: 14px;
    padding: 12px 14px;
    border-radius: 23px;
  }

  .quiz-head__step strong {
    font-size: 19px;
  }

  .quiz-head__label {
    font-size: 8px;
  }

  .quiz-head__progress-copy {
    font-size: 10px;
  }

  .question-dots {
    display: none;
  }

  .question-panel {
    padding: 25px 19px 22px;
    border-radius: 34px;
  }

  .question-panel::after {
    top: 18px;
    right: 17px;
    font-size: 22px;
  }

  .question-title {
    margin-top: 18px;
    font-size: clamp(26px, 8.2vw, 36px);
  }

  .question-hint {
    display: none;
  }

  .option-grid {
    grid-template-columns: 1fr;
    gap: 10px;
    margin-top: 23px;
  }

  .option {
    min-height: 82px;
    padding: 13px 14px;
    border-radius: 20px;
  }

  .option__text {
    font-size: 14px;
  }

  .question-panel__actions {
    margin-top: 23px;
    padding-top: 18px;
  }

  .prev-button {
    min-width: 105px;
    padding-inline: 16px;
  }

  .next-button {
    min-width: 0;
    flex: 1;
    padding-inline: 17px;
  }

  .quiz-ambient__emoji {
    display: none;
  }
}

@media (max-width: 420px) {
  .brand__copy span {
    display: none;
  }

  .quiz-head {
    grid-template-columns: 78px minmax(0, 1fr);
  }

  .quiz-head__step strong {
    font-size: 17px;
  }

  .question-panel {
    padding: 22px 15px 18px;
  }

  .option {
    grid-template-columns: 34px minmax(0, 1fr) 22px;
    gap: 10px;
  }

  .option__key {
    width: 34px;
    height: 34px;
    border-radius: 12px;
  }

  .option__text {
    font-size: 13px;
  }
}
</style>
