<script setup>
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { getSiswaByNisn, getPelanggaranBySiswa } from "@/services/mockData";
import { formatNama } from "@/utils/formatNama";
import { ShieldAlert, AlertTriangle, ListChecks, XCircle, Clock3, CheckCircle2 } from "@/components/ui/Icons";

const route = useRoute();
const nisn = route.params.nisn;

const siswa = computed(() => getSiswaByNisn(nisn));
const catatan = computed(() => getPelanggaranBySiswa(siswa.value?.id || ""));

const greeting = computed(() => {
  const hour = new Date().getHours();
  if (hour < 11) return "Selamat Pagi";
  if (hour < 15) return "Selamat Siang";
  if (hour < 18) return "Selamat Sore";
  return "Selamat Malam";
});

const totalPoin = computed(() => catatan.value.reduce((s, p) => s + p.poin, 0));
const totalCatatan = computed(() => catatan.value.length);
const beratCount = computed(() => catatan.value.filter((p) => p.kategori_level === "BERAT").length);
const menungguCount = computed(() => catatan.value.filter((p) => p.status === "MENUNGGU").length);

const BATAS = 50;
const sisaPoin = computed(() => Math.max(BATAS - totalPoin.value, 0));
const progres = computed(() => Math.min(Math.round((totalPoin.value / BATAS) * 100), 100));

const recent = computed(() => catatan.value.slice(0, 5));

function formatTanggal(t) {
  if (!t) return "—";
  const d = new Date(t + "T00:00:00");
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}
</script>

<template>
  <main class="pel-page">
    <section class="sp-head">
      <div class="sp-head-left">
        <div class="sp-avatar"><ShieldAlert size="24" /></div>
        <div class="sp-head-info">
          <h2>{{ greeting }}, {{ formatNama(siswa?.nama || "Siswa") }}</h2>
          <p>{{ siswa?.kelas }} · NISN {{ siswa?.nisn }}</p>
        </div>
      </div>
      <div class="sp-head-right">
        <div class="sp-head-meta"><strong>{{ totalCatatan }}</strong><small>Catatan</small></div>
        <div class="sp-head-meta"><strong>{{ totalPoin }}</strong><small>Poin</small></div>
      </div>
    </section>

    <section class="pel-card">
      <div class="pel-card-head">
        <div class="pel-card-head-title"><AlertTriangle size="18" /><h3>Akumulasi Poin</h3></div>
        <span class="poin-pill" style="color: var(--color-danger); font-size: 0.85rem">{{ totalPoin }} / {{ BATAS }}</span>
      </div>

      <div class="poin-bar">
        <i :style="{ width: progres + '%' }"></i>
      </div>

      <div class="poin-summary">
        <div class="poin-box green">
          <span>Catatan</span>
          <strong>{{ totalCatatan }}</strong>
        </div>
        <div class="poin-box yellow">
          <span>Menunggu</span>
          <strong>{{ menungguCount }}</strong>
        </div>
        <div class="poin-box red">
          <span>Berat</span>
          <strong>{{ beratCount }}</strong>
        </div>
      </div>

      <p v-if="sisaPoin > 0" class="poin-hint">
        Sisa poin sebelum batas perhatian: <strong>{{ sisaPoin }}</strong> poin.
      </p>
      <p v-else class="poin-hint" style="color: var(--color-danger)">
        Poin kamu sudah mencapai batas. Segera lakukan pembinaan bersama guru BK.
      </p>
    </section>

    <section class="pel-card">
      <div class="pel-card-head">
        <div class="pel-card-head-title"><ListChecks size="18" /><h3>Catatan Pelanggaran</h3></div>
      </div>

      <div v-if="recent.length" class="pel-list">
        <div v-for="(item, i) in recent" :key="item.id" class="pel-item">
          <div class="pel-no">{{ i + 1 }}</div>
          <div class="pel-item-body">
            <strong>{{ item.kategori_nama }}</strong>
            <small>{{ formatTanggal(item.tanggal) }} {{ item.waktu }} · {{ item.keterangan || "—" }}</small>
          </div>
          <div class="pel-item-end">
            <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap; justify-content: flex-end">
              <span class="status-badge" :class="item.status">{{ item.status }}</span>
              <span class="poin-pill">+{{ item.poin }}</span>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="pel-empty">
        <CheckCircle2 size="22" />
        <strong>Alhamdulillah, tidak ada catatan pelanggaran</strong>
        <small>Jaga terus sikap dan kedisiplinanmu!</small>
      </div>
    </section>

    <section class="pel-card">
      <div class="pel-card-head">
        <div class="pel-card-head-title"><Clock3 size="18" /><h3>Informasi</h3></div>
      </div>

      <div class="info-box">
        <strong>Bagaimana poin dihitung?</strong>
        <p>
          Setiap pelanggaran diberi poin sesuai level kategori: Ringan (+5), Sedang (+10), dan Berat (+25).
          Akumulasi poin digunakan sebagai bahan pembinaan kedisiplinan di sekolah.
        </p>
      </div>
    </section>
  </main>
</template>

<style scoped>
.poin-bar {
  width: 100%;
  height: 12px;
  border-radius: 999px;
  background: var(--color-surface-soft);
  border: 1px solid var(--color-border);
  overflow: hidden;
}

.poin-bar i {
  display: block;
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--color-success), var(--color-warning) 70%, var(--color-danger));
  transition: width 0.4s ease;
}

.poin-hint {
  margin: 0;
  color: var(--color-muted);
  font-size: 0.76rem;
  font-weight: 750;
}

.poin-hint strong {
  color: var(--color-text);
}

.info-box {
  padding: 14px;
  border-radius: 14px;
  background: var(--color-surface-soft);
  border: 1px solid var(--color-border);
}

.info-box strong {
  display: block;
  font-size: 0.8rem;
  font-weight: 950;
  color: var(--color-text);
}

.info-box p {
  margin: 6px 0 0;
  font-size: 0.76rem;
  line-height: 1.6;
  color: var(--color-muted);
  font-weight: 700;
}
</style>
