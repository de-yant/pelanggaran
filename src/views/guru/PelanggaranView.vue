<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useUiStore } from "@/stores/ui";
import {
  getPelanggaran,
  getKategori,
  deletePelanggaran,
  updatePelanggaran,
} from "@/services/mockData";
import { formatNama } from "@/utils/formatNama";
import { ListChecks, Plus, Edit3, Trash2, X, Save, Loader2, Frown, FilePlus2 } from "@/components/ui/Icons";

const router = useRouter();
const ui = useUiStore();

const search = ref("");
const filterLevel = ref("");
const filterStatus = ref("");
const currentPage = ref(1);
const perPage = ref(10);

const kategoriOptions = computed(() => getKategori());

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase();
  return getPelanggaran().filter((p) => {
    const matchQ =
      !q ||
      p.siswa_nama.toLowerCase().includes(q) ||
      p.siswa_nisn.includes(q) ||
      p.kategori_nama.toLowerCase().includes(q);
    const matchL = !filterLevel.value || p.kategori_level === filterLevel.value;
    const matchS = !filterStatus.value || p.status === filterStatus.value;
    return matchQ && matchL && matchS;
  });
});

const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / perPage.value)));
const paginated = computed(() => {
  const start = (currentPage.value - 1) * perPage.value;
  return filtered.value.slice(start, start + perPage.value);
});
const startNumber = computed(() => (currentPage.value - 1) * perPage.value + 1);

function onFilterChange() {
  currentPage.value = 1;
}

const editForm = ref(null);
const showEdit = ref(false);
const saving = ref(false);
const editError = ref("");

function openEdit(item) {
  editError.value = "";
  editForm.value = {
    id: item.id,
    kategori_id: item.kategori_id,
    tanggal: item.tanggal,
    waktu: item.waktu,
    keterangan: item.keterangan,
    status: item.status,
    siswa_nama: item.siswa_nama,
  };
  showEdit.value = true;
}

function closeEdit() {
  showEdit.value = false;
  editForm.value = null;
}

async function saveEdit() {
  if (!editForm.value) return;
  editError.value = "";
  if (!editForm.value.kategori_id || !editForm.value.tanggal) {
    editError.value = "Kategori dan tanggal wajib diisi.";
    return;
  }

  saving.value = true;
  await new Promise((r) => setTimeout(r, 400));
  updatePelanggaran(editForm.value.id, {
    kategori_id: editForm.value.kategori_id,
    tanggal: editForm.value.tanggal,
    waktu: editForm.value.waktu,
    keterangan: editForm.value.keterangan,
    status: editForm.value.status,
  });
  saving.value = false;
  closeEdit();
  ui.success("Data pelanggaran diperbarui.");
}

function confirmDelete(item) {
  ui.danger({
    title: "Hapus Pelanggaran?",
    message: `Catatan pelanggaran ${formatNama(item.siswa_nama)} (${item.kategori_nama}) akan dihapus.`,
    confirmText: "Hapus",
    onConfirm: () => {
      deletePelanggaran(item.id);
      ui.success("Catatan pelanggaran dihapus.");
    },
  });
}
</script>

<template>
  <main class="pel-page">
    <section class="pel-card">
      <div class="pel-card-head">
        <div class="pel-card-head-title"><ListChecks size="18" /><h3>Data Pelanggaran</h3></div>
        <span class="pel-head-badge">{{ filtered.length }} catatan</span>
      </div>

      <div class="pel-toolbar">
        <input v-model="search" type="text" placeholder="Cari nama / NISN / kategori..." @input="onFilterChange" />
        <select v-model="filterLevel" @change="onFilterChange">
          <option value="">Semua Level</option>
          <option value="RINGAN">Ringan</option>
          <option value="SEDANG">Sedang</option>
          <option value="BERAT">Berat</option>
        </select>
        <select v-model="filterStatus" @change="onFilterChange">
          <option value="">Semua Status</option>
          <option value="MENUNGGU">Menunggu</option>
          <option value="DIPROSES">Diproses</option>
          <option value="SELESAI">Selesai</option>
        </select>
        <button class="pel-btn" @click="router.push('/guru/pencatatan')">
          <Plus size="16" /> Catat Baru
        </button>
      </div>

      <div v-if="paginated.length" class="pel-list">
        <div v-for="item in paginated" :key="item.id" class="pel-item">
          <div class="pel-no">{{ startNumber + paginated.indexOf(item) }}</div>
          <div class="pel-item-body">
            <strong>{{ formatNama(item.siswa_nama) }}</strong>
            <small>{{ item.siswa_kelas }} · {{ item.tanggal }} {{ item.waktu }} · {{ item.kategori_nama }}</small>
          </div>
          <div class="pel-item-end">
            <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap; justify-content: flex-end">
              <span class="level-badge" :class="item.kategori_level">{{ item.kategori_level }}</span>
              <span class="status-badge" :class="item.status">{{ item.status }}</span>
              <span class="poin-pill">+{{ item.poin }}</span>
            </div>
            <div class="pel-actions">
              <button class="pel-icon-btn" title="Edit" @click="openEdit(item)"><Edit3 size="14" /></button>
              <button class="pel-icon-btn danger" title="Hapus" @click="confirmDelete(item)"><Trash2 size="14" /></button>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="pel-empty">
        <Frown size="22" />
        <strong>Data tidak ditemukan</strong>
        <small>Ubah kata kunci atau filter pencarian.</small>
        <button class="pel-btn" style="margin-top: 6px" @click="router.push('/guru/pencatatan')">
          <FilePlus2 size="15" /> Catat Pelanggaran
        </button>
      </div>

      <div class="pel-pagination">
        <button :disabled="currentPage <= 1" @click="currentPage--">‹</button>
        <button v-for="p in totalPages" :key="p" :class="{ active: p === currentPage }" @click="currentPage = p">{{ p }}</button>
        <button :disabled="currentPage >= totalPages" @click="currentPage++">›</button>
      </div>
    </section>

    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="showEdit" class="edit-backdrop" @click.self="closeEdit">
          <div class="edit-card">
            <div class="edit-head">
              <h3>Edit Pelanggaran</h3>
              <button class="edit-x" @click="closeEdit"><X size="16" /></button>
            </div>

            <div class="pel-form">
              <div class="pel-form-group">
                <label>Siswa</label>
                <input :value="formatNama(editForm?.siswa_nama || '')" disabled />
              </div>

              <div class="pel-form-group">
                <label>Kategori *</label>
                <select v-model="editForm.kategori_id">
                  <option v-for="k in kategoriOptions" :key="k.id" :value="k.id">
                    {{ k.nama }} ({{ k.level }} · +{{ k.poin }})
                  </option>
                </select>
              </div>

              <div class="pel-form-grid">
                <div class="pel-form-group">
                  <label>Tanggal *</label>
                  <input v-model="editForm.tanggal" type="date" />
                </div>
                <div class="pel-form-group">
                  <label>Waktu</label>
                  <input v-model="editForm.waktu" type="time" />
                </div>
              </div>

              <div class="pel-form-group">
                <label>Status</label>
                <select v-model="editForm.status">
                  <option value="MENUNGGU">Menunggu</option>
                  <option value="DIPROSES">Diproses</option>
                  <option value="SELESAI">Selesai</option>
                </select>
              </div>

              <div class="pel-form-group">
                <label>Keterangan</label>
                <textarea v-model="editForm.keterangan" placeholder="Deskripsi kejadian..."></textarea>
              </div>

              <div v-if="editError" class="edit-error"><X size="14" /> {{ editError }}</div>

              <div class="edit-actions">
                <button class="pel-btn secondary" @click="closeEdit">Batal</button>
                <button class="pel-btn" :disabled="saving" @click="saveEdit">
                  <Loader2 v-if="saving" size="15" class="spin" />
                  <Save v-else size="15" />
                  Simpan
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </main>
</template>

<style scoped>
.pel-toolbar {
  grid-template-columns: 1fr 1fr 1fr auto;
}

.edit-backdrop {
  position: fixed;
  inset: 0;
  z-index: 9998;
  display: grid;
  place-items: center;
  padding: 18px;
  background: rgba(15, 23, 42, 0.58);
  backdrop-filter: blur(12px);
}

.edit-card {
  width: min(440px, 100%);
  max-height: 92dvh;
  overflow-y: auto;
  padding: 20px;
  border-radius: 24px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  box-shadow: 0 30px 90px rgba(15, 23, 42, 0.3);
}

.edit-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding-bottom: 12px;
  margin-bottom: 14px;
  border-bottom: 1px solid var(--color-border);
}

.edit-head h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 950;
  color: var(--color-text);
}

.edit-x {
  width: 32px;
  height: 32px;
  border: 0;
  border-radius: 10px;
  background: var(--color-surface-soft);
  color: var(--color-muted);
  display: grid;
  place-items: center;
  cursor: pointer;
}

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

.edit-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.edit-actions .pel-btn {
  width: 100%;
  justify-content: center;
}

.spin {
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 600px) {
  .pel-toolbar {
    grid-template-columns: 1fr 1fr;
  }

  .pel-toolbar .pel-btn {
    grid-column: 1 / -1;
  }
}
</style>
