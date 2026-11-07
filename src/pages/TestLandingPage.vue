<template>
  <main class="landing">
    <div class="ambient" aria-hidden="true">
      <span class="ambient__blob ambient__blob--pink"></span>
      <span class="ambient__blob ambient__blob--mint"></span>
      <span class="ambient__blob ambient__blob--lavender"></span>
      <span class="ambient__emoji ambient__emoji--one">🍅</span>
      <span class="ambient__emoji ambient__emoji--two">🥚</span>
      <span class="ambient__emoji ambient__emoji--three">🥒</span>
      <span class="ambient__emoji ambient__emoji--four">🌽</span>
    </div>

    <nav class="topbar shell" aria-label="主导航">
      <a class="brand" href="/">
        <span class="brand__mark" aria-hidden="true">🍲</span>
        <span class="brand__copy">
          <strong>SOUP LAB</strong>
          <span>汤汤人格研究所</span>
        </span>
      </a>
      <div class="status-pill">
        <span class="status-dot" aria-hidden="true"></span>
        今日营业中
      </div>
    </nav>

    <section class="hero shell">
      <div class="hero__copy">
        <div class="eyebrow-pill">
          <span aria-hidden="true">✦</span>
          10 道题 · 3 分钟 · 0 负担
        </div>

        <h1 class="hero__title">
          测测你
          <span class="hero__title-accent">是什么汤？</span>
        </h1>

        <p class="hero__lead">
          每个人心里都有一锅慢炖的汤。有人清甜，有人浓郁，
          有人表面平静，锅底却藏着一整个宇宙。
        </p>

        <div class="hero__actions">
          <button class="btn btn--primary hero__cta" type="button" @click="startTest">
            开始喝汤
            <span class="btn__arrow" aria-hidden="true">→</span>
          </button>
          <span class="people-pill">
            <span class="people-pill__faces" aria-hidden="true">
              <i>🍅</i><i>🥒</i><i>🍮</i>
            </span>
            已有 <strong>114,514</strong> 人开锅
          </span>
        </div>

        <p class="hero__microcopy">仅限娱乐 · 请勿空腹测试 · 建议凭第一直觉作答</p>
      </div>

      <div class="hero__visual" aria-label="一碗正在冒热气的可爱汤">
        <div class="soup-card">
          <span class="soup-card__tape">TODAY'S SOUP</span>

          <div class="steam" aria-hidden="true">
            <span></span>
            <span></span>
            <span></span>
          </div>

          <div class="soup-bowl" aria-hidden="true">
            <div class="soup-bowl__rim">
              <div class="soup-bowl__surface">
                <span class="soup-bowl__ingredient soup-bowl__ingredient--one">🍅</span>
                <span class="soup-bowl__ingredient soup-bowl__ingredient--two">🥚</span>
                <span class="soup-bowl__ingredient soup-bowl__ingredient--three">🌿</span>
              </div>
            </div>
            <div class="soup-bowl__body">
              <div class="soup-bowl__face">
                <span></span>
                <span></span>
                <i></i>
              </div>
            </div>
          </div>

          <p class="soup-card__caption">你的灵魂，正在咕嘟咕嘟</p>
        </div>

        <span class="sticker sticker--mint" aria-hidden="true">100%<br />新鲜</span>
        <span class="sticker sticker--pink" aria-hidden="true">今日<br />宜喝汤</span>
        <span class="floating-chip floating-chip--one" aria-hidden="true">🍥 软乎乎</span>
        <span class="floating-chip floating-chip--two" aria-hidden="true">✨ 有点东西</span>
      </div>
    </section>

    <section class="feature-row shell" aria-label="测试特点">
      <article class="feature feature--pink">
        <span class="feature__number">01</span>
        <h2>凭直觉选</h2>
        <p>不用分析，第一反应往往最接近真实的你。</p>
      </article>
      <article class="feature feature--mint">
        <span class="feature__number">02</span>
        <h2>只要 3 分钟</h2>
        <p>摸鱼间隙就能完成，适合搭配奶茶服用。</p>
      </article>
      <article class="feature feature--lavender">
        <span class="feature__number">03</span>
        <h2>汤底有暗号</h2>
        <p>别只看结果，汤底和那句话里，可能还藏着下一步。</p>
      </article>
    </section>

    <footer class="page-footer shell">
      © 2026 SOUP LAB · 本测试结果仅供娱乐，请勿认真到睡不着
    </footer>
  </main>
</template>

<script setup>
function startTest() {
  window.location.href = '/test'
}
</script>

<style scoped>
.landing {
  position: relative;
  min-height: 100svh;
  overflow: hidden;
}

.ambient {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

.ambient__blob {
  position: absolute;
  display: block;
  border-radius: 50%;
  filter: blur(1px);
  opacity: 0.65;
}

.ambient__blob--pink {
  top: 9%;
  left: -8rem;
  width: 24rem;
  height: 24rem;
  background: var(--pink-soft);
}

.ambient__blob--mint {
  right: -7rem;
  bottom: 12%;
  width: 27rem;
  height: 27rem;
  background: var(--mint-soft);
}

.ambient__blob--lavender {
  top: 38%;
  right: 24%;
  width: 12rem;
  height: 12rem;
  background: var(--lavender-soft);
}

.ambient__emoji {
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
  animation: bob 5s ease-in-out infinite;
}

.ambient__emoji--one {
  top: 21%;
  left: 4%;
  transform: rotate(-9deg);
}

.ambient__emoji--two {
  top: 52%;
  left: 2%;
  animation-delay: -1.8s;
  transform: rotate(7deg);
}

.ambient__emoji--three {
  right: 4%;
  bottom: 26%;
  animation-delay: -3.2s;
  transform: rotate(10deg);
}

.ambient__emoji--four {
  top: 16%;
  right: 7%;
  animation-delay: -2.4s;
  transform: rotate(-6deg);
}

.hero {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(360px, 0.82fr);
  align-items: center;
  gap: clamp(32px, 6vw, 90px);
  padding: 52px 0 50px;
}

.hero__copy {
  max-width: 650px;
}

.hero__title {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-top: 22px;
  color: var(--ink);
  font-size: clamp(52px, 6.8vw, 96px);
  font-weight: 900;
  letter-spacing: -0.075em;
  line-height: 0.98;
}

.hero__title-accent {
  position: relative;
  display: inline-block;
  margin-top: 10px;
  padding: 5px 20px 11px 18px;
  border-radius: 28px 28px 44px 18px;
  background: var(--pink);
  box-shadow: 0 10px 0 rgba(43, 35, 56, 0.06);
  transform: rotate(-1.5deg);
}

.hero__title-accent::after {
  content: "";
  position: absolute;
  right: 14px;
  bottom: -8px;
  width: 24px;
  height: 24px;
  border-radius: 8px;
  background: var(--pink);
  transform: rotate(22deg);
}

.hero__lead {
  max-width: 520px;
  margin-top: 28px;
  color: var(--ink-soft);
  font-size: clamp(16px, 1.65vw, 19px);
  font-weight: 600;
  line-height: 1.85;
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
  margin-top: 34px;
}

.hero__cta {
  min-width: 186px;
  min-height: 62px;
  padding-inline: 30px;
  font-size: 18px;
}

.people-pill {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-height: 52px;
  padding: 8px 16px 8px 9px;
  border: 1.5px solid rgba(43, 35, 56, 0.08);
  border-radius: 999px;
  background: rgba(255, 253, 251, 0.72);
  color: var(--ink-soft);
  font-size: 13px;
  font-weight: 700;
  backdrop-filter: blur(12px);
}

.people-pill strong {
  color: var(--ink);
  font-weight: 900;
}

.people-pill__faces {
  display: flex;
  align-items: center;
  padding-left: 4px;
}

.people-pill__faces i {
  display: grid;
  place-items: center;
  width: 31px;
  height: 31px;
  margin-left: -6px;
  border: 2px solid var(--cream);
  border-radius: 50%;
  background: var(--butter-soft);
  font-size: 16px;
  font-style: normal;
}

.people-pill__faces i:nth-child(2) {
  background: var(--mint-soft);
}

.people-pill__faces i:nth-child(3) {
  background: var(--lavender-soft);
}

.hero__microcopy {
  margin-top: 20px;
  color: var(--ink-faint);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.04em;
}

.hero__visual {
  position: relative;
  display: grid;
  place-items: center;
  min-height: 560px;
}

.soup-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: min(430px, 100%);
  aspect-ratio: 0.92;
  padding: 34px 28px 26px;
  border: 2px solid rgba(43, 35, 56, 0.09);
  border-radius: 50px 50px 62px 62px;
  background:
    radial-gradient(circle at 36% 18%, rgba(255, 255, 255, 0.95), transparent 30%),
    linear-gradient(150deg, var(--butter-soft), #fff 54%, var(--pink-soft));
  box-shadow:
    0 28px 70px rgba(131, 95, 146, 0.17),
    0 10px 0 rgba(43, 35, 56, 0.045);
  transform: rotate(2deg);
}

.soup-card::before {
  content: "";
  position: absolute;
  inset: 18px;
  border: 2px dashed rgba(43, 35, 56, 0.08);
  border-radius: 38px 38px 50px 50px;
  pointer-events: none;
}

.soup-card__tape {
  position: absolute;
  top: 27px;
  left: 50%;
  z-index: 2;
  padding: 8px 22px 9px;
  border-radius: 9px;
  background: var(--butter);
  color: var(--ink);
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 0.22em;
  transform: translateX(-50%) rotate(-3deg);
  box-shadow: 0 4px 0 rgba(43, 35, 56, 0.06);
}

.steam {
  position: relative;
  display: flex;
  gap: 16px;
  height: 106px;
  padding-top: 45px;
}

.steam span {
  display: block;
  width: 18px;
  height: 52px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.7);
  filter: blur(1px);
  animation: steam 3s ease-in-out infinite;
}

.steam span:nth-child(2) {
  height: 70px;
  margin-top: -18px;
  animation-delay: -1s;
}

.steam span:nth-child(3) {
  height: 42px;
  margin-top: 12px;
  animation-delay: -2s;
}

.soup-bowl {
  position: relative;
  width: 78%;
  margin-top: -12px;
}

.soup-bowl__rim {
  position: relative;
  z-index: 2;
  height: 108px;
  padding: 13px 19px 0;
  border: 3px solid var(--ink);
  border-radius: 50%;
  background: #fffdf7;
  box-shadow: 0 10px 0 rgba(43, 35, 56, 0.1);
}

.soup-bowl__surface {
  position: relative;
  height: 78px;
  overflow: hidden;
  border: 3px solid var(--ink);
  border-radius: 50%;
  background:
    radial-gradient(circle at 28% 40%, rgba(255, 255, 255, 0.8) 0 5%, transparent 6%),
    radial-gradient(circle at 68% 32%, rgba(255, 255, 255, 0.6) 0 4%, transparent 5%),
    linear-gradient(160deg, #ffc6a3, #f28f8f);
}

.soup-bowl__surface::after {
  content: "";
  position: absolute;
  left: 18%;
  bottom: 14%;
  width: 34%;
  height: 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.22);
  transform: rotate(-6deg);
}

.soup-bowl__ingredient {
  position: absolute;
  font-size: 25px;
  filter: drop-shadow(0 3px 0 rgba(43, 35, 56, 0.08));
}

.soup-bowl__ingredient--one {
  left: 16%;
  top: 27%;
  transform: rotate(-10deg);
}

.soup-bowl__ingredient--two {
  right: 18%;
  top: 22%;
  transform: rotate(12deg);
}

.soup-bowl__ingredient--three {
  left: 46%;
  bottom: 18%;
  transform: rotate(8deg);
}

.soup-bowl__body {
  position: relative;
  height: 176px;
  margin: -48px 18px 0;
  border: 3px solid var(--ink);
  border-top: 0;
  border-radius: 20px 20px 145px 145px;
  background: linear-gradient(160deg, #fffdf9, #ffe8ed 60%, #ffd3df);
  box-shadow: inset 0 -16px 0 rgba(242, 125, 159, 0.12);
}

.soup-bowl__body::before,
.soup-bowl__body::after {
  content: "";
  position: absolute;
  top: 35px;
  width: 38px;
  height: 18px;
  border-radius: 50%;
  background: rgba(255, 183, 202, 0.38);
}

.soup-bowl__body::before {
  left: 18px;
  transform: rotate(-18deg);
}

.soup-bowl__body::after {
  right: 18px;
  transform: rotate(18deg);
}

.soup-bowl__face {
  position: absolute;
  top: 58px;
  left: 50%;
  display: flex;
  align-items: center;
  gap: 31px;
  transform: translateX(-50%);
}

.soup-bowl__face span {
  width: 13px;
  height: 17px;
  border-radius: 50%;
  background: var(--ink);
}

.soup-bowl__face i {
  position: absolute;
  left: 50%;
  top: 18px;
  width: 26px;
  height: 12px;
  border-bottom: 4px solid var(--ink);
  border-radius: 0 0 50% 50%;
  transform: translateX(-50%);
}

.soup-card__caption {
  position: relative;
  z-index: 2;
  margin-top: 22px;
  padding: 9px 18px;
  border-radius: 999px;
  background: rgba(255, 253, 251, 0.8);
  color: var(--ink-soft);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.1em;
}

.sticker {
  position: absolute;
  z-index: 4;
  display: grid;
  place-items: center;
  width: 92px;
  height: 92px;
  border: 2px solid rgba(43, 35, 56, 0.12);
  border-radius: 50%;
  font-size: 13px;
  font-weight: 900;
  line-height: 1.2;
  text-align: center;
  box-shadow: 0 8px 0 rgba(43, 35, 56, 0.06);
}

.sticker--mint {
  top: 6%;
  right: 2%;
  background: var(--mint);
  transform: rotate(11deg);
}

.sticker--pink {
  bottom: 13%;
  left: -2%;
  background: var(--pink);
  transform: rotate(-10deg);
}

.floating-chip {
  position: absolute;
  z-index: 3;
  padding: 10px 16px;
  border: 2px solid rgba(43, 35, 56, 0.08);
  border-radius: 999px;
  background: rgba(255, 253, 251, 0.85);
  color: var(--ink-soft);
  font-size: 12px;
  font-weight: 800;
  box-shadow: 0 7px 0 rgba(43, 35, 56, 0.05);
  backdrop-filter: blur(12px);
}

.floating-chip--one {
  top: 34%;
  left: -5%;
  transform: rotate(-5deg);
}

.floating-chip--two {
  right: -4%;
  bottom: 34%;
  transform: rotate(5deg);
}

.feature-row {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
  padding-bottom: 18px;
}

.feature {
  position: relative;
  min-height: 178px;
  padding: 25px 25px 24px;
  overflow: hidden;
  border: 2px solid rgba(43, 35, 56, 0.07);
  border-radius: 32px;
  box-shadow: 0 8px 0 rgba(43, 35, 56, 0.035);
}

.feature--pink {
  background: var(--pink-soft);
}

.feature--mint {
  background: var(--mint-soft);
}

.feature--lavender {
  background: var(--lavender-soft);
}

.feature__number {
  display: inline-grid;
  place-items: center;
  width: 42px;
  height: 42px;
  margin-bottom: 18px;
  border-radius: 15px;
  background: rgba(255, 253, 251, 0.68);
  color: var(--ink-soft);
  font-size: 12px;
  font-weight: 900;
}

.feature h2 {
  font-size: 20px;
  font-weight: 900;
  letter-spacing: -0.03em;
}

.feature p {
  max-width: 260px;
  margin-top: 8px;
  color: var(--ink-soft);
  font-size: 14px;
  font-weight: 600;
  line-height: 1.7;
}

@keyframes bob {
  0%,
  100% {
    translate: 0 0;
  }
  50% {
    translate: 0 -10px;
  }
}

@keyframes steam {
  0%,
  100% {
    opacity: 0.25;
    transform: translateY(8px) scaleY(0.9);
  }
  50% {
    opacity: 0.8;
    transform: translateY(-5px) scaleY(1.06);
  }
}

@media (max-width: 980px) {
  .hero {
    grid-template-columns: 1fr;
    padding-top: 34px;
  }

  .hero__copy {
    max-width: 760px;
  }

  .hero__title {
    font-size: clamp(54px, 11vw, 86px);
  }

  .hero__visual {
    min-height: 520px;
  }

  .soup-card {
    width: min(420px, 84vw);
  }

  .ambient__emoji {
    display: none;
  }

  .floating-chip--one {
    left: 2%;
  }

  .floating-chip--two {
    right: 2%;
  }
}

@media (max-width: 720px) {
  .hero {
    gap: 22px;
    padding: 24px 0 34px;
  }

  .hero__title {
    margin-top: 18px;
    font-size: clamp(48px, 15.4vw, 72px);
    line-height: 1;
  }

  .hero__title-accent {
    margin-top: 8px;
    padding: 4px 15px 9px 13px;
    border-radius: 22px 22px 34px 14px;
  }

  .hero__lead {
    margin-top: 22px;
    font-size: 15px;
  }

  .hero__actions {
    align-items: stretch;
    margin-top: 26px;
  }

  .hero__cta {
    width: 100%;
  }

  .people-pill {
    align-self: flex-start;
  }

  .hero__visual {
    min-height: 450px;
    margin-top: 10px;
  }

  .soup-card {
    width: min(360px, 88vw);
    border-radius: 42px 42px 54px 54px;
  }

  .soup-bowl__rim {
    height: 92px;
  }

  .soup-bowl__surface {
    height: 65px;
  }

  .soup-bowl__body {
    height: 150px;
  }

  .soup-bowl__face {
    top: 48px;
  }

  .sticker {
    width: 74px;
    height: 74px;
    font-size: 11px;
  }

  .sticker--mint {
    right: 0;
  }

  .sticker--pink {
    left: 0;
  }

  .floating-chip {
    font-size: 10px;
  }

  .floating-chip--one {
    left: 2%;
  }

  .floating-chip--two {
    right: 2%;
  }

  .feature-row {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .feature {
    min-height: 0;
    padding: 22px;
    border-radius: 26px;
  }

  .feature__number {
    width: 36px;
    height: 36px;
    margin-bottom: 12px;
    border-radius: 12px;
  }
}

@media (max-width: 420px) {
  .hero__visual {
    min-height: 400px;
  }

  .soup-card {
    width: 86vw;
  }

  .sticker {
    width: 66px;
    height: 66px;
  }

  .floating-chip--one {
    display: none;
  }
}
</style>
