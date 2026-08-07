<script setup>
import { computed } from "vue";
import { useUiStore } from "@/stores/ui";

const ui = useUiStore();

const modalIcon = computed(() => {
  const icons = {
    success: "✅",
    error: "❌",
    warning: "⚠️",
    info: "ℹ️",
    danger: "🗑️",
    delete: "🗑️",
    logout: "🚪",
  };

  return icons[ui.modal.type] || icons.info;
});

const modalTitle = computed(() => {
  if (ui.modal.title) return ui.modal.title;

  const titles = {
    success: "Berhasil",
    error: "Terjadi Kesalahan",
    warning: "Peringatan",
    info: "Informasi",
    danger: "Konfirmasi Hapus",
    delete: "Konfirmasi Hapus",
    logout: "Logout?",
  };

  return titles[ui.modal.type] || "Informasi";
});

const isDanger = computed(() => {
  return ["danger", "delete", "error"].includes(ui.modal.type);
});

const isSingleButton = computed(() => {
  return !ui.modal.showCancel;
});
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="ui.modal.show"
        class="app-modal-backdrop"
        @click.self="!ui.modal.loading && ui.closeModal()"
      >
        <div
          class="app-modal-card"
          :class="[
            `is-${ui.modal.type}`,
            {
              'is-danger-mode': isDanger,
              'is-single-button': isSingleButton,
            },
          ]"
          role="dialog"
          aria-modal="true"
        >
          <button
            v-if="ui.modal.showCancel"
            type="button"
            class="modal-x-btn"
            :disabled="ui.modal.loading"
            aria-label="Tutup modal"
            @click="ui.closeModal"
          >
            ×
          </button>

          <div class="app-modal-icon">
            {{ modalIcon }}
          </div>

          <h3>{{ modalTitle }}</h3>

          <p v-if="ui.modal.message">
            {{ ui.modal.message }}
          </p>

          <div class="app-modal-actions">
            <button
              v-if="ui.modal.showCancel"
              type="button"
              class="modal-cancel-btn"
              :disabled="ui.modal.loading"
              @click="ui.closeModal"
            >
              {{ ui.modal.cancelText || "Batal" }}
            </button>

            <button
              type="button"
              class="modal-confirm-btn"
              :disabled="ui.modal.loading"
              @click="ui.confirmModal"
            >
              <span v-if="ui.modal.loading" class="modal-spinner"></span>
              <span v-else>{{ ui.modal.confirmText || "Ya" }}</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
