<script setup>
import { ref, computed } from "vue";
import { getPelanggaran, getStatistik } from "@/services/mockData";
import { formatNama } from "@/utils/formatNama";
import {
  ShieldAlert,
  AlertTriangle,
  FilePlus2,
  ListChecks,
  BarChart3,
  ArrowRight,
  BookOpen,
  Clock3,
  CheckCircle2,
  XCircle,
  ShieldCheck,
} from "@/components/ui/Icons";

const props = defineProps({
  profileName: { type: String, default: "" },
});

const stats = computed(() => getStatistik());
const pelanggaran = computed(() => getPelanggaran());

const greeting = computed(() => {
  const hour = new Date().getHours();
  if (hour < 11) return "Selamat Pagi";
  if (hour < 15) return "Selamat Siang";
  if (hour < 18) return "Selamat Sore";
  return "Selamat Malam";
});

const today = computed(() =>
  new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
);

const recent = computed(() => pelanggaran.value.slice(0, 5));

const topSiswa = computed(() => {
  const map = new Map();
  pelanggaran.value.forEach((p) => {
    if (!map.has(p.siswa_id)) {
      map.set(p.siswa_id, { nama: p.siswa_nama, kelas: p.siswa_kelas, nisn: p.siswa_nisn, poin: 0, total: 0 });
    }
    const entry = map.get(p.siswa_id);
    entry.poin += p.poin;
    entry.total += 1;
  });
  return Array.from(map.values()).sort((a, b) => b.poin - a.poin).slice(0, 5);
});

const statCards = computed(() => [
  { label: "Total Pelanggaran", value: stats.value.total, icon: ListChecks, class: "blue" },
  { label: "Total Poin", value: stats.value.poinTotal, icon: AlertTriangle, class: "yellow" },
  { label: "Ringan", value: stats.value.perLevel.RINGAN, icon: ShieldCheck, class: "green" },
  { label: "Sedang", value: stats.value.perLevel.SEDANG, icon: Clock3, class: "blue" },
  { label: "Berat", value: stats.value.perLevel.BERAT, icon: XCircle, class: "red" },
  { label: "Menunggu Tindak Lanjut", value: stats.value.perStatus.MENUNGGU, icon: Clock3, class: "yellow" },
]);

const quickMenus = [
  { label: "Catat Baru", desc: "Input pelanggaran", icon: FilePlus2, to: "/guru/pencatatan", class: "red" },
  { label: "Data Pelanggaran", desc: "Semua catatan", icon: ListChecks, to: "/guru/pelanggaran", class: "blue" },
  { label: "Kategori", desc: "Master kategori", icon: BookOpen, to: "/guru/kategori", class: "yellow" },
  { label: "Rekap Laporan", desc: "Rekap & cetak", icon: BarChart3, to: "/guru/rekap", class: "green" },
];
</script>

<template>
  <main class="pel-page">
    <section class="sp-head">
      <div class="sp-head-left">
        <div class="sp-avatar"><ShieldAlert size="24" /></div>
        <div class="sp-head-info">
          <h2>{{ greeting }}, {{ formatNama(props.profileName || "Guru BK") }} 👋</h2>
          <p>{{ today }}</p>
        </div>
      </div>
      <div class="sp-head-right">
        <div class="sp-head-meta"><strong>{{ stats.total }}</strong><small>Catatan</small></div>
        <div class="sp-head-meta"><strong>{{ stats.perStatus.MENUNGGU }}</strong><small>Menunggu</small></div>
      </div>
    </section>

    <section class="pel-card">
      <div class="pel-card-head">
        <div class="pel-card-head-title"><ListChecks size="18" /><h3>Ringkasan Pelanggaran</h3></div>
      </div>
      <div class="pel-stats">
        <div v-for="card in statCards" :key="card.label" class="pel-stat" :class="card.class">
          <component :is="card.icon" />
          <strong>{{ card.value }}</strong>
          <small>{{ card.label }}</small>
        </div>
      </div>
    </section>

    <section class="pel-card">
      <div class="pel-card-head">
        <div class="pel-card-head-title"><BarChart3 size="18" /><h3>Menu Cepat</h3></div>
      </div>
      <div class="pel-quick">
        <RouterLink v-for="m in quickMenus" :key="m.to" :to="m.to" class="pel-quick-item">
          <component :is="m.icon" />
          <strong>{{ m.label }}</strong>
          <small>{{ m.desc }}</small>
        </RouterLink>
      </div>
    </section>

    <section class="pel-card">
      <div class="pel-card-head">
        <div class="pel-card-head-title"><Clock3 size="18" /><h3>Pelanggaran Terbaru</h3></div>
        <RouterLink to="/guru/pelanggaran" class="pel-head-badge" style="color: var(--color-primary)">Lihat semua →</RouterLink>
      </div>

      <div v-if="recent.length" class="pel-list">
        <div v-for="(item, i) in recent" :key="item.id" class="pel-item">
          <div class="pel-no">{{ i + 1 }}</div>
          <div class="pel-item-body">
            <strong>{{ formatNama(item.siswa_nama) }}</strong>
            <small>{{ item.siswa_kelas }} · {{ item.tanggal }} {{ item.waktu }}</small>
          </div>
          <div class="pel-item-end">
            <span class="level-badge" :class="item.kategori_level">{{ item.kategori_level }}</span>
            <small style="color: var(--color-muted); font-size: 0.62rem; font-weight: 800">{{ item.kategori_nama }}</small>
          </div>
        </div>
      </div>
      <div v-else class="pel-empty">
        <CheckCircle2 size="22" />
        <strong>Belum ada pelanggaran</strong>
        <small>Semua siswa tertib.</small>
      </div>
    </section>

    <section class="pel-card">
      <div class="pel-card-head">
        <div class="pel-card-head-title"><AlertTriangle size="18" /><h3>Siswa Terbanyak Poin</h3></div>
      </div>

      <div v-if="topSiswa.length" class="pel-list">
        <div v-for="(item, i) in topSiswa" :key="item.nisn" class="pel-item">
          <div class="pel-no">{{ i + 1 }}</div>
          <div class="pel-item-body">
            <strong>{{ formatNama(item.nama) }}</strong>
            <small>{{ item.kelas }} · NISN {{ item.nisn }} · {{ item.total }} pelanggaran</small>
          </div>
          <div class="pel-item-end">
            <span class="poin-pill">{{ item.poin }} poin</span>
          </div>
        </div>
      </div>

      <RouterLink to="/guru/rekap" class="pel-btn" style="width: 100%; justify-content: center; margin-top: 4px">
        Lihat Rekap Lengkap <ArrowRight size="16" />
      </RouterLink>
    </section>
  </main>
</template>
