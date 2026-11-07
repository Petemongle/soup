<template>
  <TestLandingPage v-if="path === '/'" />
  <TestPage v-else-if="path === '/test'" />
  <ResultPage v-else-if="path === '/result'" />
  <TurtlePage v-else-if="path === '/turtle'" />
  <main v-else class="not-found">
    <div class="not-found__card">
      <span class="not-found__emoji" aria-hidden="true">🫥</span>
      <p class="not-found__kicker">404 · LOST IN SOUP</p>
      <h1>这锅汤还没煮开</h1>
      <p>你访问的页面好像被谁偷喝掉了，先回首页喝一碗吧。</p>
      <a class="btn btn--primary" href="/">
        回到首页
        <span class="btn__arrow" aria-hidden="true">→</span>
      </a>
    </div>
  </main>
</template>

<script setup>
import TestLandingPage from './pages/TestLandingPage.vue'
import TestPage from './pages/TestPage.vue'
import ResultPage from './pages/ResultPage.vue'
import TurtlePage from './pages/Turtle.vue'

const path = window.location.pathname.replace(/\/+$/, '') || '/'
</script>

<style scoped>
.not-found {
  display: grid;
  place-items: center;
  min-height: 100svh;
  padding: 24px;
}

.not-found__card {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: min(560px, 100%);
  padding: clamp(32px, 6vw, 58px);
  border: 2px solid rgba(43, 35, 56, 0.08);
  border-radius: 46px;
  background: rgba(255, 253, 251, 0.9);
  box-shadow:
    0 26px 65px rgba(111, 81, 128, 0.12),
    0 10px 0 rgba(43, 35, 56, 0.035);
  text-align: center;
}

.not-found__emoji {
  display: grid;
  place-items: center;
  width: 106px;
  height: 106px;
  border-radius: 36px;
  background: var(--lavender-soft);
  font-size: 52px;
  transform: rotate(-5deg);
}

.not-found__kicker {
  margin-top: 23px;
  color: var(--ink-faint);
  font-size: 9px;
  font-weight: 900;
  letter-spacing: 0.2em;
}

.not-found h1 {
  margin-top: 8px;
  font-size: clamp(34px, 7vw, 48px);
  font-weight: 900;
  letter-spacing: -0.06em;
}

.not-found p:not(.not-found__kicker) {
  max-width: 370px;
  margin-top: 14px;
  color: var(--ink-soft);
  font-size: 14px;
  font-weight: 600;
  line-height: 1.8;
}

.not-found .btn {
  margin-top: 25px;
}
</style>
