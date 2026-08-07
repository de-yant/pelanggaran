<script setup>
import { ref, computed } from "vue";
import { useUiStore } from "@/stores/ui";
import {
  getSiswa,
  getKategori,
  addPelanggaran,
  getPelanggaran,
} from "@/services/mockData";
import { formatNama } from "@/utils/formatNama";
import { FilePlus2, Save, CheckCircle2, Loader2, Clock3, AlertCircle } from "@/components/ui/Icons";

const ui = useUiStore();

const siswaOptions = computed(() => getSiswa());
const kategoriOptions = computed(() => getKategori());

const form = ref({
  siswa_id: "",
  kategori_id: "",
  tanggal: new Date().toISOString().slice(0, 10),
  waktu: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", hour12: false }),
  keterangan: "",
});

const formError = ref("");
const saving = ref(false);
const justSaved = ref(false);

const lastRecords = computed(() => getPelanggaran().slice(0, 3));

function resetForm() {
  form.value = {
    siswa_id: "",
    kategori_id: "",
    tanggal: new Date().toISOString().slice(0, 10),
    waktu: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", hour12: false }),
    keterangan: "",
  };
  formError.value = "";
}

async function submit() {
  formError.value = "";

  if (!form.value.siswa_id) {
    formError.value = "Pilih siswa yang melanggar.";
    return;
  }
  if (!form.value.kategori_id) {
    formError.value = "Pilih kategori pelanggaran.";
    return;
  }
  if (!form.value.tanggal) {
    formError.value = "Tanggal wajib diisi.";
    return;
  }

  saving.value = true;
  await new Promise((r) => setTimeout(r, 500));

  addPelanggaran({
    siswa_id: form.value.siswa_id,
    kategori_id: form.value.kategori_id,
    tanggal: form.value.tanggal,
    waktu: form.value.waktu,
    keterangan: form.value.keterangan,
  });

  saving.value = false;
  justSaved.value = true;

  const siswa = siswaOptions.value.find((s) => s.id === form.value.siswa_id);
  const kategori = kategoriOptions.value.find((k) => k.id === form.value.kategori_id);

  ui.success(
    `${formatNama(siswa?.nama || "Siswa")} dicatat untuk "${kategori?.nama}" (+${kategori?.poin} poin).`
  );

  resetForm();

  setTimeout(() => { justSaved.value = false; }, 2500);
}

function formatTanggal(t) {
  if (!t) return "—";
  const d = new Date(t + "T00:00:00");
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}
</script>

<template>
  <main class="pel-page">
    <section class="pel-card">
      <div class="pel-card-head">
        <div class="pel-card-head-title"><FilePlus2 size="18" /><h3>Pencatatan Pelanggaran</h3></div>
      </div>

      <form class="pel-form" @submit.prevent="submit">
        <div class="pel-form-group">
          <label>Siswa *</label>
          <select v-model="form.siswa_id">
            <option value="">— Pilih Siswa —</option>
            <option v-for="s in siswaOptions" :key="s.id" :value="s.id">
              {{ formatNama(s.nama) }} · {{ s.kelas }} · {{ s.nisn }}
            </option>
          </select>
        </div>

        <div class="pel-form-group">
          <label>Kategori Pelanggaran *</label>
          <select v-model="form.kategori_id">
            <option value="">— Pilih Kategori —</option>
            <option v-for="k in kategoriOptions" :key="k.id" :value="k.id">
              {{ k.nama }} ({{ k.level }} · +{{ k.poin }} poin)
            </option>
          </select>
        </div>

        <div class="pel-form-grid">
          <div class="pel-form-group">
            <label>Tanggal *</label>
            <input v-model="form.tanggal" type="date" />
          </div>
          <div class="pel-form-group">
            <label>Waktu</label>
            <input v-model="form.waktu" type="time" />
          </div>
        </div>

        <div class="pel-form-group">
          <label>Keterangan</label>
          <textarea v-model="form.keterangan" placeholder="Deskripsi kejadian pelanggaran..."></textarea>
        </div>

        <div v-if="formError" class="edit-error"><AlertCircle size="15" /> {{ formError }}</div>

        <div v-if="justSaved" class="just-saved">
          <CheckCircle2 size="16" /> Pelanggaran berhasil dicatat.
        </div>

        <button class="pel-btn" type="submit" style="width: 100%; height: 48px; justify-content: center; font-size: 0.85rem" :disabled="saving">
          <Loader2 v-if="saving" size="17" class="spin" />
          <Save v-else size="17" />
          {{ saving ? "Menyimpan..." : "Simpan Pencatatan" }}
        </button>
      </form>
    </section>

    <section class="pel-card">
      <div class="pel-card-head">
        <div class="pel-card-head-title"><Clock3 size="18" /><h3>Catatan Terakhir</h3></div>
      </div>

      <div v-if="lastRecords.length" class="pel-list">
        <div v-for="(item, i) in lastRecords" :key="item.id" class="pel-item">
          <div class="pel-no">{{ i + 1 }}</div>
          <div class="pel-item-body">
            <strong>{{ formatNama(item.siswa_nama) }}</strong>
            <small>{{ formatTanggal(item.tanggal) }} {{ item.waktu }} · {{ item.kategori_nama }}</small>
          </div>
          <div class="pel-item-end">
            <span class="poin-pill">+{{ item.poin }}</span>
          </div>
        </div>
      </div>
      <div v-else class="pel-empty">
        <Clock3 size="22" />
        <strong>Belum ada catatan</strong>
      </div>
    </section>
  </main>
</template>

<style scoped>
.edit-error {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 12px;
  border-radius: 12px;
  background: color-mix(in srgb, var(--color-danger) 12%, transparent);
  color: var(--color-danger);
  font-size: 0.76rem;
  font-weight: 800;
}

.just-saved {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 12px;
  border-radius: 12px;
  background: color-mix(in srgb, var(--color-success) 14%, transparent);
  color: var(--color-success);
  font-size: 0.76rem;
  font-weight: 800;
}

.spin {
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
