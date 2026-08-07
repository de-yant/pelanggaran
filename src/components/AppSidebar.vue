<script setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { APP_NAME } from "@/config";
import { logout } from "@/services/authService";
import {
  Home,
  CalendarCheck,
  ScanLine,
  FileText,
  UserRound,
  Settings,
  Building2,
  Briefcase,
  LogOut,
  Edit2,
  User,
  ClipboardList,
  BookOpen,
  BarChart3,
  AlertTriangle,
  ListChecks,
  FilePlus2,
  ShieldAlert,
} from "@/components/ui/Icons";

const props = defineProps({
  appName: {
    type: String,
    default: APP_NAME,
  },
  profileName: {
    type: String,
    default: "",
  },
  profileDetail: {
    type: String,
    default: "",
  },
  profilePhoto: {
    type: String,
    default: "",
  },
  menus: {
    type: Array,
    default: () => [],
  },
  logo: {
    type: String,
    default: "",
  },
});

const route = useRoute();
const router = useRouter();

function handleLogout() {
  logout();
  router.push("/");
}

const iconMap = {
  Home,
  CalendarCheck,
  ScanLine,
  FileText,
  UserRound,
  Settings,
  Building2,
  Briefcase,
  LogOut,
  Edit2,
  ClipboardList,
  BookOpen,
  BarChart3,
  AlertTriangle,
  ListChecks,
  FilePlus2,
  ShieldAlert,
};

const pageTitle = computed(() => {
  return route.meta?.title || "Dashboard";
});

const displayAppName = computed(() => {
  return props.appName || APP_NAME;
});

const displayName = computed(() => {
  return props.profileName || "Pengguna";
});

const displayDetail = computed(() => {
  return props.profileDetail || "User";
});

const safeMenus = computed(() => {
  return Array.isArray(props.menus) ? props.menus : [];
});

const navMenus = computed(() => {
  return safeMenus.value.filter((m) => m.label !== "Keluar");
});

const logoutMenu = computed(() => {
  return safeMenus.value.find((m) => m.label === "Keluar");
});
</script>

<template>
  <aside class="app-sidebar">
    <div class="sidebar-brand">
      <div class="sidebar-brand-icon" :class="{ 'has-logo': logo }">
        <img v-if="logo" :src="logo" :alt="pageTitle" class="sidebar-logo-img" />
        <ShieldAlert v-else size="22" />
      </div>

      <div class="sidebar-brand-text">
        <strong>{{ pageTitle }}</strong>
        <small>{{ displayAppName }}</small>
      </div>
    </div>

    <div class="sidebar-profile">
      <img v-if="profilePhoto" :src="profilePhoto" :alt="displayName" />

      <div v-else class="sidebar-avatar-placeholder">
        <User size="32" />
      </div>

      <h3>{{ displayName }}</h3>
    </div>

    <nav class="side-menu">
      <RouterLink
        v-for="menu in navMenus"
        :key="menu.to || menu.label"
        :to="menu.to"
        class="side-link"
        active-class="active"
      >
        <component :is="iconMap[menu.icon] || Home" size="18" />
        <span>{{ menu.label }}</span>
      </RouterLink>
    </nav>

    <div class="sidebar-logout-area">
      <button
        v-if="logoutMenu"
        class="side-link logout-link"
        @click="handleLogout"
      >
        <component :is="iconMap[logoutMenu.icon] || Home" size="18" />
        <span>{{ logoutMenu.label }}</span>
      </button>
    </div>

  </aside>
</template>

<style scoped>
.app-sidebar {
  display: none;
}

@media (min-width: 900px) {
  .app-sidebar {
    position: sticky;
    top: 0;
    height: 100vh;
    width: 100%;
    min-width: 0;
    overflow: hidden;
    padding: 16px 28px 24px;
    display: flex;
    flex-direction: column;
    background: var(--color-surface-glass);
    border-right: 1px solid var(--color-border);
    box-shadow: 12px 0 40px rgba(15, 23, 42, 0.04);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
  }
}

.sidebar-brand {
  width: 100%;
  min-width: 0;
  margin-bottom: 18px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.sidebar-brand-icon {
  width: 46px;
  height: 46px;
  flex: 0 0 46px;
  border-radius: 17px;
  display: grid;
  place-items: center;
  color: var(--color-primary);
  background: var(--color-surface);
  box-shadow: 0 12px 28px
    color-mix(in srgb, var(--color-primary) 25%, transparent);
}

.sidebar-brand-icon.has-logo {
  background: var(--color-surface);
  box-shadow: none;
}

.sidebar-logo-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 11px;
  padding: 5px;
}

.sidebar-brand-text {
  min-width: 0;
  line-height: 1.1;
}

.sidebar-brand-text strong {
  display: block;
  color: var(--color-text);
  font-size: 0.98rem;
  font-weight: 900;
  letter-spacing: -0.04em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sidebar-brand-text small {
  display: block;
  margin-top: 3px;
  color: var(--color-muted);
  font-size: 0.72rem;
  font-weight: 800;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sidebar-profile {
  margin: 18px 0 24px;
  padding: 18px;
  border-radius: var(--radius-lg);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-card);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  text-align: center;
}

.sidebar-profile img,
.sidebar-avatar-placeholder {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin: 0 auto 12px;
  border: 2px solid color-mix(in srgb, var(--color-surface) 88%, #fff);
  background: var(--color-surface-soft);
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08);
}

.sidebar-avatar-placeholder svg {
  width: 28px;
  height: 28px;
}

.sidebar-profile img {
  object-fit: cover;
}

.sidebar-avatar-placeholder {
  display: grid;
  place-items: center;
  color: var(--color-primary);
}

.sidebar-profile h3 {
  margin: 0;
  color: var(--color-text);
  font-size: 0.96rem;
  font-weight: 900;
  line-height: 1.25;
}

.side-menu {
  display: grid;
  gap: 8px;
  overflow-y: auto;
  padding-right: 2px;
}

.side-menu::-webkit-scrollbar {
  width: 4px;
}

.side-menu::-webkit-scrollbar-thumb {
  background: color-mix(in srgb, var(--color-muted) 24%, transparent);
  border-radius: 999px;
}

.side-link {
  position: relative;
  min-width: 0;
  padding: 13px 14px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-radius: 18px;
  color: var(--color-muted);
  font-size: 0.86rem;
  font-weight: 900;
  transition:
    transform 0.2s ease,
    color 0.2s ease,
    background 0.2s ease;
}

.side-link svg {
  flex: 0 0 auto;
}

.side-link span {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.side-link:hover,
.side-link.router-link-active,
.side-link.active {
  color: var(--color-primary-dark);
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--color-primary) 15%, transparent),
    color-mix(in srgb, var(--color-primary) 7%, transparent)
  );
}

.side-link:hover {
  transform: translateX(2px);
}

.side-link.router-link-active::before,
.side-link.active::before {
  content: "";
  position: absolute;
  left: -8px;
  width: 4px;
  height: 24px;
  border-radius: 999px;
  background: var(--color-primary);
}

.sidebar-logout-area {
  margin-top: auto;
  padding: 12px 0 4px;
  border-top: 1px solid var(--color-border);
}

.logout-link {
  width: 100%;
  border: none;
  background: none;
  font: inherit;
  cursor: pointer;
  text-align: left;
  color: #dc2626;
  font-weight: 800;
}

.logout-link:hover {
  color: #fff !important;
  background: #dc2626 !important;
}
</style>
