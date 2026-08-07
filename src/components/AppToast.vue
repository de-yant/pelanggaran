<script setup>
import { computed } from "vue";
import { useUiStore } from "@/stores/ui";

const ui = useUiStore();

const toastIcon = computed(() => {
  const icons = {
    success: "✅",
    error: "❌",
    warning: "⚠️",
    info: "ℹ️",
    loading: "⏳",
  };

  return icons[ui.toast.type] || icons.info;
});

const toastTitle = computed(() => {
  if (ui.toast.title) return ui.toast.title;

  const titles = {
    success: "Berhasil",
    error: "Gagal",
    warning: "Peringatan",
    info: "Informasi",
    loading: "Mohon Tunggu",
  };

  return titles[ui.toast.type] || titles.info;
});
</script>

<template>
  <Teleport to="body">
    <Transition name="toast">
      <div
        v-if="ui.toast.show"
        class="app-toast"
        :class="`is-${ui.toast.type}`"
        role="alert"
      >
        <div class="app-toast-icon">
          <span v-if="ui.toast.type === 'loading'" class="toast-spinner"></span>
          <span v-else>{{ toastIcon }}</span>
        </div>

        <div class="app-toast-content">
          <strong>{{ toastTitle }}</strong>
          <p v-if="ui.toast.message">{{ ui.toast.message }}</p>
        </div>

        <button
          v-if="ui.toast.type !== 'loading'"
          type="button"
          class="app-toast-close"
          aria-label="Tutup notifikasi"
          @click="ui.hideToast"
        >
          ×
        </button>
      </div>
    </Transition>
  </Teleport>
</template>
