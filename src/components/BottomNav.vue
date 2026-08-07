<script setup>
import {
  Home,
  Building2,
  Briefcase,
  UserRound,
  CalendarCheck,
  ClipboardList,
  FileText,
  Settings,
  Users,
  Shield,
  ScanLine,
  Edit2,
  AlertTriangle,
  ListChecks,
  FilePlus2,
  BarChart3,
} from "@/components/ui/Icons"

defineProps({
  menus: {
    type: Array,
    default: () => []
  },
  centerTo: {
    type: String,
    default: ''
  }
})

const iconMap = {
  Home,
  Building2,
  Briefcase,
  UserRound,
  CalendarCheck,
  ClipboardList,
  FileText,
  Settings,
  Users,
  Shield,
  ScanLine,
  Edit2,
  AlertTriangle,
  ListChecks,
  FilePlus2,
  BarChart3,
}
</script>

<template>
  <nav
    v-if="centerTo"
    class="bottom-nav"
    aria-label="Navigasi bawah"
  >
    <RouterLink
      v-for="menu in menus.slice(0, 2)"
      :key="menu.to"
      :to="menu.to"
      class="nav-item"
    >
      <component :is="iconMap[menu.icon] || Home" size="20" />
      <span>{{ menu.label }}</span>
    </RouterLink>

    <RouterLink
      :to="centerTo"
      class="scan-center"
      aria-label="Tambah"
    >
      <span class="scan-wave"></span>

      <div class="scan-fab">
        <FilePlus2 size="26" />
      </div>
    </RouterLink>

    <RouterLink
      v-for="menu in menus.slice(2, 4)"
      :key="menu.to"
      :to="menu.to"
      class="nav-item"
    >
      <component :is="iconMap[menu.icon] || Home" size="20" />
      <span>{{ menu.label }}</span>
    </RouterLink>
  </nav>

  <nav
    v-else-if="menus.length"
    class="bottom-nav no-scan"
    aria-label="Navigasi bawah"
  >
    <RouterLink
      v-for="menu in menus.slice(0, 4)"
      :key="menu.to"
      :to="menu.to"
      class="nav-item"
    >
      <component :is="iconMap[menu.icon] || Home" size="20" />
      <span>{{ menu.label }}</span>
    </RouterLink>
  </nav>
</template>
