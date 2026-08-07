<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useUiStore } from "@/stores/ui";
import { APP_VERSION, APP_NAME, SEKOLAH_NAMA } from "@/config";
import { getSiswaByNisn, getStatistik } from "@/services/mockData";
import { setSiswaSession } from "@/services/authService";
import { formatNama } from "@/utils/formatNama";
import {
  ShieldAlert,
  LogIn,
  IdCard,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  Code2,
  Users,
  ShieldCheck,
  Search,
} from "@/components/ui/Icons";

const router = useRouter();
const ui = useUiStore();

const nisnInput = ref("");
const nisnError = ref("");
const loading = ref(false);

const stats = computed(() => getStatistik());

function goLogin() {
  router.push("/login");
}

async function verifyNisn() {
  nisnError.value = "";
  const val = nisnInput.value.trim();

  if (!/^\d{10}$/.test(val)) {
    nisnError.value = "NISN harus 10 digit angka.";
    return;
  }

  loading.value = true;
  await new Promise((r) => setTimeout(r, 600));

  const siswa = getSiswaByNisn(val);
  loading.value = false;

  if (!siswa) {
    nisnError.value = "NISN tidak ditemukan. Periksa kembali.";
    nisnInput.value = "";
    return;
  }

  setSiswaSession({ id: siswa.id, nisn: siswa.nisn, nama: siswa.nama, kelas: siswa.kelas });

  ui.success(`Selamat datang, ${formatNama(siswa.nama)}!`);
  setTimeout(() => {
    router.push(`/${siswa.nisn}/dashboard`);
  }, 700);
}
</script>

<template>
  <main class="land-page">
    <div class="land-container">
      <nav class="land-nav">
        <div class="land-brand">
          <div class="land-brand-icon"><ShieldAlert size="20" /></div>
          <div>
            <strong>{{ SEKOLAH_NAMA }}</strong>
            <small>{{ APP_NAME }}</small>
          </div>
        </div>
        <button class="land-btn" @click="goLogin">
          <LogIn size="16" /> Masuk Guru
        </button>
      </nav>

      <section class="land-hero">
        <div class="land-hero-text">
          <span class="land-badge"><Search size="13" /> Catat & Pantau Pelanggaran</span>
          <h1>Sistem pencatatan<br />pelanggaran <mark>siswa</mark></h1>
          <p>Kelola data pelanggaran, kategori, poin, hingga laporan rekap — mudah, cepat, dan rapi.</p>

          <div class="land-stats">
            <div class="land-stat">
              <strong>{{ stats.total }}</strong>
              <small>Pelanggaran</small>
            </div>
            <div class="land-stat">
              <strong>{{ stats.perLevel.BERAT }}</strong>
              <small>Berat</small>
            </div>
            <div class="land-stat">
              <strong>{{ stats.perStatus.MENUNGGU }}</strong>
              <small>Menunggu</small>
            </div>
          </div>
        </div>

        <div class="land-role">
          <button class="role-card" @click="goLogin">
            <div class="role-icon blue"><ShieldCheck size="24" /></div>
            <div>
              <strong>Guru / Staf</strong>
              <small>Kelola data pelanggaran, kategori, dan laporan</small>
            </div>
            <ArrowRight size="18" class="role-arrow" />
          </button>

          <div class="role-divider"><span>atau</span></div>

          <div class="role-card role-siswa">
            <div class="role-icon green"><Users size="24" /></div>
            <div>
              <strong>Siswa</strong>
              <small>Verifikasi NISN untuk melihat catatan pelanggaran</small>
            </div>
          </div>

          <div class="nisn-box">
            <div class="nisn-icon"><IdCard size="18" /></div>
            <input
              v-model="nisnInput"
              type="text"
              inputmode="numeric"
              maxlength="10"
              placeholder="Masukkan NISN (10 digit)"
              @keydown.enter="verifyNisn"
            />
            <button class="nisn-btn" :disabled="loading" @click="verifyNisn">
              <Loader2 v-if="loading" size="16" class="spin" />
              <CheckCircle2 v-else size="16" />
            </button>
          </div>

          <div v-if="nisnError" class="nisn-error"><AlertCircle size="15" /> {{ nisnError }}</div>
        </div>
      </section>

      <footer class="land-footer">
        <span>© {{ new Date().getFullYear() }} <strong>{{ SEKOLAH_NAMA }}</strong></span>
        <span class="land-dev"><Code2 size="14" /> v{{ APP_VERSION }} · HaryantoLabs</span>
      </footer>
    </div>
  </main>
</template>

<style scoped>
.land-page {
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  padding: 20px 16px 30px;
}

.land-container {
  width: 100%;
  max-width: 1120px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.land-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.land-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.land-brand-icon {
  width: 42px;
  height: 42px;
  flex: 0 0 42px;
  display: grid;
  place-items: center;
  border-radius: 15px;
  color: #fff;
  background: linear-gradient(135deg, var(--color-primary-dark), var(--color-primary));
  box-shadow: 0 10px 22px color-mix(in srgb, var(--color-primary) 28%, transparent);
}

.land-brand strong {
  display: block;
  color: var(--color-text);
  font-size: 0.95rem;
  font-weight: 900;
  letter-spacing: -0.03em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.land-brand small {
  display: block;
  margin-top: 2px;
  color: var(--color-muted);
  font-size: 0.72rem;
  font-weight: 800;
}

.land-btn {
  height: 40px;
  padding: 0 16px;
  border: 1px solid var(--color-border);
  border-radius: 13px;
  background: var(--color-surface);
  color: var(--color-text);
  font-size: 0.78rem;
  font-weight: 900;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  cursor: pointer;
  transition: 0.2s;
}

.land-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.land-hero {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 28px;
  align-items: center;
}

.land-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border-radius: 999px;
  color: var(--color-primary);
  background: color-mix(in srgb, var(--color-primary) 12%, transparent);
  font-size: 0.72rem;
  font-weight: 900;
}

.land-hero h1 {
  margin: 14px 0 0;
  color: var(--color-text);
  font-size: clamp(1.7rem, 4vw, 2.6rem);
  font-weight: 950;
  line-height: 1.05;
  letter-spacing: -0.045em;
}

.land-hero h1 mark {
  color: var(--color-primary);
  background: transparent;
}

.land-hero-text p {
  margin: 12px 0 0;
  color: var(--color-muted);
  font-size: 0.92rem;
  line-height: 1.6;
  max-width: 480px;
}

.land-stats {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.land-stat {
  min-width: 92px;
  padding: 12px 14px;
  border-radius: 15px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-soft);
  text-align: center;
}

.land-stat strong {
  display: block;
  font-size: 1.15rem;
  font-weight: 950;
  line-height: 1;
  color: var(--color-text);
}

.land-stat small {
  display: block;
  margin-top: 4px;
  font-size: 0.62rem;
  font-weight: 850;
  color: var(--color-muted);
}

.land-role {
  padding: 22px;
  border-radius: 24px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-card);
  display: grid;
  gap: 12px;
}

.role-card {
  width: 100%;
  padding: 14px;
  border: 1px solid var(--color-border);
  border-radius: 16px;
  background: var(--color-surface-soft);
  display: flex;
  align-items: center;
  gap: 12px;
  text-align: left;
  color: var(--color-text);
  cursor: pointer;
  transition: 0.2s;
}

button.role-card:hover {
  border-color: var(--color-primary);
  transform: translateY(-2px);
}

.role-icon {
  width: 46px;
  height: 46px;
  flex: 0 0 46px;
  display: grid;
  place-items: center;
  border-radius: 15px;
}

.role-icon.blue {
  color: var(--color-primary);
  background: color-mix(in srgb, var(--color-primary) 14%, transparent);
}

.role-icon.green {
  color: var(--color-success);
  background: color-mix(in srgb, var(--color-success) 14%, transparent);
}

.role-card strong {
  display: block;
  font-size: 0.88rem;
  font-weight: 950;
}

.role-card small {
  display: block;
  margin-top: 2px;
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--color-muted);
  line-height: 1.4;
}

.role-arrow {
  margin-left: auto;
  flex-shrink: 0;
  color: var(--color-muted);
}

.role-divider {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--color-muted);
  font-size: 0.68rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.role-divider::before,
.role-divider::after {
  content: "";
  flex: 1;
  height: 1px;
  background: var(--color-border);
}

.nisn-box {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 52px;
  padding: 0 8px 0 14px;
  border-radius: 15px;
  border: 1px solid var(--color-border);
  background: var(--color-surface-soft);
  transition: 0.15s;
}

.nisn-box:focus-within {
  border-color: var(--color-primary);
  box-shadow: var(--ring);
}

.nisn-icon {
  color: var(--color-muted);
  flex-shrink: 0;
  display: grid;
  place-items: center;
}

.nisn-box input {
  flex: 1;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--color-text);
  font-size: 0.9rem;
  font-weight: 800;
}

.nisn-btn {
  width: 38px;
  height: 38px;
  flex: 0 0 38px;
  border: 0;
  border-radius: 12px;
  color: #fff;
  background: linear-gradient(135deg, var(--color-primary-dark), var(--color-primary));
  display: grid;
  place-items: center;
  cursor: pointer;
}

.nisn-error {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #dc2626;
  font-size: 0.74rem;
  font-weight: 800;
  line-height: 1.35;
}

.spin {
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.land-footer {
  margin-top: auto;
  padding-top: 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  border-top: 1px solid var(--color-border);
  color: var(--color-muted);
  font-size: 0.76rem;
  font-weight: 800;
}

.land-footer strong {
  color: var(--color-text);
  font-weight: 900;
}

.land-dev {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.land-dev svg {
  color: var(--color-primary);
}

@media (max-width: 820px) {
  .land-hero {
    grid-template-columns: 1fr;
    gap: 18px;
  }

  .land-stats {
    flex-wrap: wrap;
  }
}

@media (max-width: 480px) {
  .land-nav {
    align-items: flex-start;
  }

  .land-footer {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
}
</style>
