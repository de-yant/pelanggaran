<template>
  <Teleport to="body">
    <div class="page-loading-overlay">
      <div class="page-loading-card">
        <div class="page-loading-spinner"></div>

        <div class="page-loading-content">
          <h3>{{ title }}</h3>
          <p>{{ message }}</p>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
defineOptions({ inheritAttrs: false })

defineProps({
  title: {
    type: String,
    default: "Memuat data...",
  },

  message: {
    type: String,
    default: "Mohon tunggu sebentar.",
  },
});
</script>
