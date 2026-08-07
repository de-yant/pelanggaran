<script setup>
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { getSiswaByNisn, getPelanggaranBySiswa } from "@/services/mockData";
import { formatNama } from "@/utils/formatNama";
import { BarChart3, ShieldCheck, Clock3, XCircle } from "@/components/ui/Icons";

const route = useRoute();
const nisn = route.params.nisn;

const siswa = computed(() => getSiswaByNisn(nisn));
const catatan = computed(() => getPelanggaranBySiswa(siswa.value?.id || ""));

const filterLevel = ref("");
const filterStatus = ref("");

const totalPoin = computed(() => catatan.value.reduce((s, p) => s + p.poin, 0));

const summary = computed(() => [
  {
    label: "Ringan",
    value: catatan.value.filter((p) => p.kategori_level === "RINGAN").length,
    icon: ShieldCheck,
    class: "green",
  },
  {
    label: "Sedang",
    value: catatan.value.filter((p) => p.kategori_level === "SEDANG").length,
    icon: Clock3,
    class: "yellow",
  },
  {
    label: "Berat",
    value: catatan.value.filter((p) => p.kategori_level === "BERAT").length,
    icon: XCircle,
    class: "red",
  },
]);

const rows = computed(() => {
  return catatan.value
    .filter((p) => !filterLevel.value || p.kategori_level === filterLevel.value)
    .filter((p) => !filterStatus.value || p.status === filterStatus.value)
    .slice()
    .sort((a, b) => (b.tanggal + b.waktu).localeCompare(a.tanggal + a.waktu));
});

const perLevel = computed(() => {
  const map = new Map();
  catatan.value.forEach((p) => {
    if (!map.has(p.kategori_level)) {
      map.set(p.kategori_level, { level: p.kategori_level, jumlah: 0, poin: 0 });
    }
    const e = map.get(p.kategori_level);
    e.jumlah += 1;
    e.poin += p.poin;
  });
  return Array.from(map.values()).sort((a, b) => b.poin - a.poin);
});

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
        <div class="sp-avatar"><BarChart3 size="24" /></div>
        <div class="sp-head-info">
          <h2>Rekap Pelanggaran</h2>
          <p>{{ formatNama(siswa?.nama || "Siswa") }} · {{ siswa?.kelas }}</p>
        </div>
      </div>
      <div class="sp-head-right">
        <div class="sp-head-meta"><strong>{{ catatan.length }}</strong><small>Catatan</small></div>
        <div class="sp-head-meta"><strong>{{ totalPoin }}</strong><small>Poin</small></div>
      </div>
    </section>

    <section class="pel-card">
      <div class="pel-card-head">
        <div class="pel-card-head-title"><BarChart3 size="18" /><h3>Ringkasan</h3></div>
      </div>

      <div class="poin-summary">
        <div v-for="s in summary" :key="s.label" class="poin-box" :class="s.class">
          <component :is="s.icon" style="width: 20px; height: 20px; margin: 0 auto 4px" />
          <strong>{{ s.value }}</strong>
          <span>{{ s.label }}</span>
        </div>
      </div>

      <div class="rekap-breakdown">
        <div v-for="row in perLevel" :key="row.level" class="breakdown-item">
          <span class="level-badge" :class="row.level">{{ row.level }}</span>
          <span>{{ row.jumlah }} pelanggaran</span>
          <strong>{{ row.poin }} poin</strong>
        </div>
      </div>
    </section>

    <section class="pel-card">
      <div class="pel-card-head">
        <div class="pel-card-head-title"><BarChart3 size="18" /><h3>Riwayat</h3></div>
      </div>

      <div class="pel-toolbar">
        <select v-model="filterLevel">
          <option value="">Semua Level</option>
          <option value="RINGAN">Ringan</option>
          <option value="SEDANG">Sedang</option>
          <option value="BERAT">Berat</option>
        </select>
        <select v-model="filterStatus">
          <option value="">Semua Status</option>
          <option value="MENUNGGU">Menunggu</option>
          <option value="DIPROSES">Diproses</option>
          <option value="SELESAI">Selesai</option>
        </select>
        <button class="pel-btn secondary" @click="filterLevel = ''; filterStatus = ''">Reset</button>
      </div>

      <div v-if="rows.length" class="pel-list">
        <div v-for="(item, i) in rows" :key="item.id" class="pel-item">
          <div class="pel-no">{{ i + 1 }}</div>
          <div class="pel-item-body">
            <strong>{{ item.kategori_nama }}</strong>
            <small>{{ formatTanggal(item.tanggal) }} {{ item.waktu }} · {{ item.keterangan || "—" }}</small>
          </div>
          <div class="pel-item-end">
            <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap; justify-content: flex-end">
              <span class="level-badge" :class="item.kategori_level">{{ item.kategori_level }}</span>
              <span class="status-badge" :class="item.status">{{ item.status }}</span>
              <span class="poin-pill">+{{ item.poin }}</span>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="pel-empty">
        <BarChart3 size="22" />
        <strong>Riwayat kosong</strong>
        <small>Tidak ada catatan sesuai filter.</small>
      </div>
    </section>
  </main>
</template>

<style scoped>
.rekap-breakdown {
  display: grid;
  gap: 8px;
  margin-top: 12px;
}

.breakdown-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 13px;
  background: var(--color-surface-soft);
  border: 1px solid var(--color-border);
  color: var(--color-muted);
  font-size: 0.74rem;
  font-weight: 800;
}

.breakdown-item span:nth-child(2) {
  flex: 1;
}

.breakdown-item strong {
  color: var(--color-text);
  font-weight: 950;
}
</style>
