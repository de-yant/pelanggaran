<script setup>
import { computed } from "vue";
import { ChevronRight } from "@/components/ui/Icons";

const props = defineProps({
  currentPage: { type: Number, required: true },
  totalPages: { type: Number, required: true },
  perPage: { type: Number, default: 10 },
});

const emit = defineEmits(["page-change", "per-page-change"]);

const perPageOptions = [10, 20, 50, 100];

const pages = computed(() => {
  const total = props.totalPages;
  const current = props.currentPage;

  if (total <= 3) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const result = [1];

  if (current > 2) result.push("...");

  if (current !== 1 && current !== total) {
    result.push(current);
  }

  if (current < total - 1) result.push("...");

  result.push(total);

  return result;
});

function goTo(page) {
  if (page < 1 || page > props.totalPages || page === props.currentPage) return;
  emit("page-change", page);
}
</script>

<template>
  <div v-if="totalPages > 1" class="pagination-bar">
    <div class="pag-left">
      <button class="pag-btn" :disabled="currentPage <= 1" @click="goTo(currentPage - 1)">
        <ChevronRight size="15" class="rot180" />
      </button>

      <template v-for="(item, i) in pages" :key="i">
        <span v-if="item === '...'" class="pag-dots">...</span>
        <button v-else class="pag-btn" :class="{ active: item === currentPage }" @click="goTo(item)">
          {{ item }}
        </button>
      </template>

      <button class="pag-btn" :disabled="currentPage >= totalPages" @click="goTo(currentPage + 1)">
        <ChevronRight size="15" />
      </button>
    </div>

    <div class="pag-right">
      <span class="pag-label">Tampil</span>
      <select class="pag-select" :value="perPage" @change="emit('per-page-change', Number($event.target.value))">
        <option v-for="opt in perPageOptions" :key="opt" :value="opt">{{ opt }}</option>
      </select>
    </div>
  </div>
</template>

<style scoped>
.pagination-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 0;
  flex-wrap: wrap;
}

.pag-left {
  display: flex;
  align-items: center;
  gap: 4px;
}

.pag-btn {
  min-width: 28px;
  height: 28px;
  padding: 0 4px;
  border: 0;
  background: transparent;
  color: var(--color-muted);
  font-size: 0.82rem;
  font-weight: 850;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: 0.1s;
}

.pag-btn:hover:not(:disabled) {
  color: var(--color-text);
}

.pag-btn.active {
  color: var(--color-primary);
  font-weight: 950;
}

.pag-btn:disabled {
  opacity: 0.25;
  cursor: not-allowed;
}

.pag-dots {
  padding: 0 2px;
  color: var(--color-muted);
  font-weight: 900;
  font-size: 0.82rem;
}

.pag-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pag-label {
  color: var(--color-muted);
  font-size: 0.76rem;
  font-weight: 800;
  white-space: nowrap;
}

.pag-select {
  height: 28px;
  padding: 0 6px;
  border: 0;
  background: var(--color-surface);
  color: var(--color-text);
  font-size: 0.82rem;
  font-weight: 850;
  cursor: pointer;
  outline: none;
}

.rot180 {
  transform: rotate(180deg);
}
</style>
