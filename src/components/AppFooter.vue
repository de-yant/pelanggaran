<script setup>
import { Code2 } from "@/components/ui/Icons";
import { APP_VERSION, APP_NAME, SEKOLAH_NAMA } from "@/config";

defineProps({
  schoolName: {
    type: String,
    default: SEKOLAH_NAMA,
  },
  developer: {
    type: String,
    default: "HaryantoLabs",
  },
  version: {
    type: String,
    default: APP_VERSION,
  },
});
</script>

<template>
  <footer class="app-footer">
    <div class="footer-inner">
      <p class="footer-school">
        <span>
          © {{ new Date().getFullYear() }}
          <strong>{{ schoolName }}</strong>
        </span>
      </p>

      <span class="footer-dev">
        <Code2 size="15" />
        <span>v{{ version }} · {{ developer }}</span>
      </span>
    </div>
  </footer>
</template>
