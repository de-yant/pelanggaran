<script setup>
import { ref, computed } from "vue";
import { useUiStore } from "@/stores/ui";
import { getPelanggaran, getSiswa, getStatistik } from "@/services/mockData";
import { formatNama } from "@/utils/formatNama";
import { BarChart3, FileDown, Filter, AlertTriangle, ShieldCheck, Clock3, XCircle } from "@/components/ui/Icons";

const ui = useUiStore();

const filterKelas = ref("");
const filterLevel = ref("");

const semuaSiswa = computed(() => getSiswa());
const semuaPelanggaran = computed(() => getPelanggaran());
const stats = computed(() => getStatistik());

const kelasOptions = computed(() => {
  const set = new Set(semuaSiswa.value.map((s) => s.kelas).filter(Boolean));
  return Array.from(set).sort();
});

const rekapRows = computed(() => {
  const q = filterKelas.value;
  const lvl = filterLevel.value;

  const rows = semuaSiswa.value
    .filter((s) => !q || s.kelas === q)
    .map((s) => {
      const catatan = semuaPelanggaran.value.filter((p) => p.siswa_id === s.id);
      const afterLevel = lvl ? catatan.filter((p) => p.kategori_level === lvl) : catatan;
      return {
        id: s.id,
        nama: s.nama,
        nisn: s.nisn,
        kelas: s.kelas,
        total: afterLevel.length,
        poin: afterLevel.reduce((sum, p) => sum + p.poin, 0),
        ringan: afterLevel.filter((p) => p.kategori_level === "RINGAN").length,
        sedang: afterLevel.filter((p) => p.kategori_level === "SEDANG").length,
        berat: afterLevel.filter((p) => p.kategori_level === "BERAT").length,
      };
    })
    .sort((a, b) => b.poin - a.poin);

  return rows;
});

const summaryCards = computed(() => [
  { label: "Ringan", value: stats.value.perLevel.RINGAN, icon: ShieldCheck, class: "green" },
  { label: "Sedang", value: stats.value.perLevel.SEDANG, icon: Clock3, class: "yellow" },
  { label: "Berat", value: stats.value.perLevel.BERAT, icon: XCircle, class: "red" },
  { label: "Total Poin", value: stats.value.poinTotal, icon: AlertTriangle, class: "blue" },
]);

const todayStr = computed(() =>
  new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
);

function exportCsv() {
  const header = ["Nama", "NISN", "Kelas", "Total", "Poin", "Ringan", "Sedang", "Berat"];
  const lines = rekapRows.value.map((r) => [
    `"${r.nama}"`, r.nisn, `"${r.kelas}"`, r.total, r.poin, r.ringan, r.sedang, r.berat,
  ].join(","));
  const csv = [header.join(","), ...lines].join("\n");

  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `rekap-pelanggaran-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);

  ui.success("Rekap CSV berhasil diunduh.");
}

function cetak() {
  ui.info("Menampilkan tampilan cetak...");
  setTimeout(() => window.print(), 400);
}
</script>

<template>
  <main class="pel-page">
    <section class="sp-head">
      <div class="sp-head-left">
        <div class="sp-avatar"><BarChart3 size="24" /></div>
        <div class="sp-head-info">
          <h2>Rekap Pelanggaran Siswa</h2>
          <p>{{ todayStr }}</p>
        </div>
      </div>
      <div class="sp-head-right">
        <div class="sp-head-meta"><strong>{{ rekapRows.length }}</strong><small>Siswa</small></div>
        <div class="sp-head-meta"><strong>{{ stats.total }}</strong><small>Catatan</small></div>
      </div>
    </section>

    <section class="pel-card">
      <div class="pel-card-head">
        <div class="pel-card-head-title"><BarChart3 size="18" /><h3>Ringkasan</h3></div>
      </div>
      <div class="pel-stats">
        <div v-for="card in summaryCards" :key="card.label" class="pel-stat" :class="card.class">
          <component :is="card.icon" />
          <strong>{{ card.value }}</strong>
          <small>{{ card.label }}</small>
        </div>
      </div>
    </section>

    <section class="pel-card">
      <div class="pel-card-head">
        <div class="pel-card-head-title"><Filter size="18" /><h3>Filter</h3></div>
      </div>

      <div class="pel-toolbar">
        <select v-model="filterKelas">
          <option value="">Semua Kelas</option>
          <option v-for="k in kelasOptions" :key="k" :value="k">{{ k }}</option>
        </select>
        <select v-model="filterLevel">
          <option value="">Semua Level</option>
          <option value="RINGAN">Ringan</option>
          <option value="SEDANG">Sedang</option>
          <option value="BERAT">Berat</option>
        </select>
        <button class="pel-btn secondary" @click="filterKelas = ''; filterLevel = ''">Reset</button>
        <button class="pel-btn" @click="exportCsv"><FileDown size="15" /> Unduh CSV</button>
      </div>
    </section>

    <section class="pel-card">
      <div class="pel-card-head">
        <div class="pel-card-head-title"><BarChart3 size="18" /><h3>Rekap per Siswa</h3></div>
        <button class="pel-btn secondary" @click="cetak">Cetak</button>
      </div>

      <div class="pel-table-wrap">
        <table class="pel-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Siswa</th>
              <th>Kelas</th>
              <th>Total</th>
              <th>Poin</th>
              <th>Ringan</th>
              <th>Sedang</th>
              <th>Berat</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, i) in rekapRows" :key="row.id">
              <td>{{ i + 1 }}</td>
              <td>
                <strong>{{ formatNama(row.nama) }}</strong>
                <small style="display: block; color: var(--color-muted); font-weight: 700">{{ row.nisn }}</small>
              </td>
              <td>{{ row.kelas }}</td>
              <td><span class="poin-pill">{{ row.total }}</span></td>
              <td><span class="poin-pill" style="color: var(--color-danger)">{{ row.poin }}</span></td>
              <td>{{ row.ringan }}</td>
              <td>{{ row.sedang }}</td>
              <td>{{ row.berat }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="!rekapRows.length" class="pel-empty">
        <BarChart3 size="22" />
        <strong>Tidak ada data</strong>
      </div>
    </section>
  </main>
</template>
