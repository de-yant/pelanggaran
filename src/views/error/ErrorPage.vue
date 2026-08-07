<script setup>
import { useRoute, useRouter } from "vue-router";
import { Frown, Home } from "@/components/ui/Icons";

const route = useRoute();
const router = useRouter();

const code = route.query.code || "404";
const title = route.query.title || "Terjadi Kesalahan";
const message = route.query.message || "Terjadi masalah pada halaman yang Anda tuju.";
</script>

<template>
  <main class="err-page">
    <div class="err-card">
      <div class="err-icon"><Frown size="34" /></div>
      <span class="err-code">{{ code }}</span>
      <h1>{{ title }}</h1>
      <p>{{ message }}</p>
      <button class="err-btn" @click="router.push('/')">
        <Home size="16" /> Kembali ke Beranda
      </button>
    </div>
  </main>
</template>

<style scoped>
.err-page {
  min-height: 100dvh;
  display: grid;
  place-items: center;
  padding: 24px 16px;
  background: var(--color-bg);
}

.err-card {
  width: 100%;
  max-width: 380px;
  padding: 34px 28px;
  border-radius: 28px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-card);
  text-align: center;
}

.err-icon {
  width: 72px;
  height: 72px;
  margin: 0 auto 14px;
  display: grid;
  place-items: center;
  border-radius: 24px;
  color: var(--color-muted);
  background: var(--color-surface-soft);
}

.err-code {
  display: inline-block;
  color: var(--color-primary);
  font-size: 0.72rem;
  font-weight: 950;
  letter-spacing: 0.14em;
}

.err-card h1 {
  margin: 8px 0 0;
  color: var(--color-text);
  font-size: 1.25rem;
  font-weight: 950;
  letter-spacing: -0.03em;
}

.err-card p {
  margin: 8px 0 22px;
  color: var(--color-muted);
  font-size: 0.85rem;
  line-height: 1.6;
}

.err-btn {
  width: 100%;
  height: 48px;
  border: 0;
  border-radius: 16px;
  color: #fff;
  background: linear-gradient(135deg, var(--color-primary-dark), var(--color-primary));
  font-size: 0.86rem;
  font-weight: 950;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
}
</style>
