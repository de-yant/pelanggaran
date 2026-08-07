<script setup>
import { ref, computed } from "vue";
import { useUiStore } from "@/stores/ui";
import {
  getKategori,
  addKategori,
  updateKategori,
  deleteKategori,
} from "@/services/mockData";
import { BookOpen, Plus, Edit3, Trash2, X, Save, Loader2, Frown } from "@/components/ui/Icons";

const ui = useUiStore();

const kategori = computed(() => getKategori());

const showForm = ref(false);
const form = ref(null);
const saving = ref(false);
const formError = ref("");

function openAdd() {
  formError.value = "";
  form.value = { id: null, nama: "", level: "RINGAN", poin: 5, deskripsi: "" };
  showForm.value = true;
}

function openEdit(item) {
  formError.value = "";
  form.value = { id: item.id, nama: item.nama, level: item.level, poin: item.poin, deskripsi: item.deskripsi };
  showForm.value = true;
}

function closeForm() {
  showForm.value = false;
  form.value = null;
}

async function save() {
  if (!form.value) return;
  formError.value = "";

  if (!form.value.nama.trim()) {
    formError.value = "Nama kategori wajib diisi.";
    return;
  }
  if (!Number(form.value.poin) || Number(form.value.poin) <= 0) {
    formError.value = "Poin harus lebih dari 0.";
    return;
  }

  saving.value = true;
  await new Promise((r) => setTimeout(r, 400));

  if (form.value.id) {
    updateKategori(form.value.id, { nama: form.value.nama, level: form.value.level, poin: Number(form.value.poin), deskripsi: form.value.deskripsi });
    ui.success("Kategori diperbarui.");
  } else {
    addKategori({ nama: form.value.nama, level: form.value.level, poin: Number(form.value.poin), deskripsi: form.value.deskripsi });
    ui.success("Kategori baru ditambahkan.");
  }

  saving.value = false;
  closeForm();
}

function confirmDelete(item) {
  ui.danger({
    title: "Hapus Kategori?",
    message: `Kategori "${item.nama}" akan dihapus.`,
    confirmText: "Hapus",
    onConfirm: () => {
      const ok = deleteKategori(item.id);
      if (ok) ui.success("Kategori dihapus.");
      else ui.error("Kategori masih dipakai oleh data pelanggaran.");
    },
  });
}
</script>

<template>
  <main class="pel-page">
    <section class="pel-card">
      <div class="pel-card-head">
        <div class="pel-card-head-title"><BookOpen size="18" /><h3>Kategori Pelanggaran</h3></div>
        <button class="pel-btn" @click="openAdd"><Plus size="16" /> Tambah Kategori</button>
      </div>

      <div v-if="kategori.length" class="pel-list">
        <div v-for="(item, i) in kategori" :key="item.id" class="pel-item">
          <div class="pel-no">{{ i + 1 }}</div>
          <div class="pel-item-body">
            <strong>{{ item.nama }}</strong>
            <small>{{ item.deskripsi || "—" }}</small>
          </div>
          <div class="pel-item-end">
            <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap; justify-content: flex-end">
              <span class="level-badge" :class="item.level">{{ item.level }}</span>
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
        <strong>Belum ada kategori</strong>
        <small>Tambahkan kategori pelanggaran terlebih dahulu.</small>
      </div>
    </section>

    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="showForm" class="edit-backdrop" @click.self="closeForm">
          <div class="edit-card">
            <div class="edit-head">
              <h3>{{ form?.id ? "Edit Kategori" : "Tambah Kategori" }}</h3>
              <button class="edit-x" @click="closeForm"><X size="16" /></button>
            </div>

            <div class="pel-form">
              <div class="pel-form-group">
                <label>Nama Kategori *</label>
                <input v-model="form.nama" type="text" placeholder="cth: Terlambat masuk sekolah" />
              </div>

              <div class="pel-form-grid">
                <div class="pel-form-group">
                  <label>Level</label>
                  <select v-model="form.level">
                    <option value="RINGAN">Ringan</option>
                    <option value="SEDANG">Sedang</option>
                    <option value="BERAT">Berat</option>
                  </select>
                </div>
                <div class="pel-form-group">
                  <label>Poin *</label>
                  <input v-model.number="form.poin" type="number" min="1" />
                </div>
              </div>

              <div class="pel-form-group">
                <label>Deskripsi</label>
                <textarea v-model="form.deskripsi" placeholder="Penjelasan kategori..."></textarea>
              </div>

              <div v-if="formError" class="edit-error"><X size="14" /> {{ formError }}</div>

              <div class="edit-actions">
                <button class="pel-btn secondary" @click="closeForm">Batal</button>
                <button class="pel-btn" :disabled="saving" @click="save">
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
</style>
