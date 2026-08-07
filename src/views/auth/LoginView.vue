<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUiStore } from "@/stores/ui";
import { APP_NAME, SEKOLAH_NAMA } from "@/config";
import { setGuruSession } from "@/services/authService";
import { ShieldAlert, LogIn, LockKeyhole, UserRound, Eye, EyeOff, ArrowLeft, AlertCircle, Loader2 } from "@/components/ui/Icons";

const router = useRouter();
const ui = useUiStore();

const username = ref("");
const password = ref("");
const showPassword = ref(false);
const errorMsg = ref("");
const loading = ref(false);

async function doLogin() {
  errorMsg.value = "";

  if (!username.value.trim() || !password.value.trim()) {
    errorMsg.value = "Nama pengguna dan kata sandi wajib diisi.";
    return;
  }

  loading.value = true;
  await new Promise((r) => setTimeout(r, 700));
  loading.value = false;

  setGuruSession(username.value.trim());
  ui.success("Berhasil masuk. Selamat bekerja!");
  router.replace("/guru/dashboard");
}
</script>

<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-brand">
        <div class="login-logo"><ShieldAlert size="28" /></div>
        <h1>{{ APP_NAME }}</h1>
        <p>{{ SEKOLAH_NAMA }}</p>
      </div>

      <form class="login-form" @submit.prevent="doLogin">
        <div class="login-field" :class="{ 'has-error': errorMsg }">
          <label><UserRound size="14" /> Nama Pengguna</label>
          <input
            v-model="username"
            type="text"
            placeholder="Nama pengguna / NIP"
            autocomplete="username"
          />
        </div>

        <div class="login-field" :class="{ 'has-error': errorMsg }">
          <label><LockKeyhole size="14" /> Kata Sandi</label>
          <div class="password-wrap">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Masukkan kata sandi"
              autocomplete="current-password"
            />
            <button type="button" class="password-toggle" @click="showPassword = !showPassword">
              <EyeOff v-if="showPassword" size="17" />
              <Eye v-else size="17" />
            </button>
          </div>
        </div>

        <div v-if="errorMsg" class="login-error"><AlertCircle size="15" /> {{ errorMsg }}</div>

        <button class="login-btn" type="submit" :disabled="loading">
          <span class="btn-inner">
            <Loader2 v-if="loading" size="16" class="spin" />
            <LogIn v-else size="16" />
            {{ loading ? "Memproses..." : "Masuk" }}
          </span>
        </button>

        <div class="login-links">
          <a href="#" @click.prevent="router.push('/')"><ArrowLeft size="15" /> Kembali</a>
        </div>
      </form>

      <div class="login-footer">
        <p>Demo — masukkan nama & kata sandi apa saja untuk masuk.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.spin {
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
