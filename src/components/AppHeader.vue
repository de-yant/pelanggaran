<script setup>
import {
  Bell,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  RefreshCw,
  Home,
  UserRound,
} from "@/components/ui/Icons";
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";

import { logout } from "@/services/authService";
import { useUiStore } from "@/stores/ui";
import { getMockNotifikasi, markAllNotifRead } from "@/services/mockData";

const props = defineProps({
  title: {
    type: String,
    default: "Dashboard",
  },
  subtitle: {
    type: String,
    default: "",
  },
  sidebarOpen: {
    type: Boolean,
    default: true,
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
  logo: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["toggle-sidebar"]);

const router = useRouter();
const ui = useUiStore();

const syncing = ref(false);
const showNotif = ref(false);
const profileMenuOpen = ref(false);

const notifList = ref([]);
const hasUnread = computed(() => notifList.value.some((n) => !n.read));

function loadNotif() {
  notifList.value = getMockNotifikasi();
}

function toggleNotif() {
  showNotif.value = !showNotif.value;
}

function markAllRead() {
  markAllNotifRead();
  notifList.value = getMockNotifikasi();
}

function handleClickOutside(e) {
  const notifEl = document.querySelector(".notif-btn");
  const notifDrop = document.querySelector(".notif-dropdown");
  if (notifEl && !notifEl.contains(e.target) && notifDrop && !notifDrop.contains(e.target)) {
    showNotif.value = false;
  }

  const profileEl = document.querySelector(".profile-toggle");
  const profileDrop = document.querySelector(".profile-dropdown");
  if (profileEl && !profileEl.contains(e.target) && profileDrop && !profileDrop.contains(e.target)) {
    profileMenuOpen.value = false;
  }
}

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
  loadNotif();
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});

function handleLogout() {
  logout();
  router.replace("/");
}

function goToProfile() {
  const role = localStorage.getItem("role") || "guru";
  router.push(`/${role}/profil`);
  profileMenuOpen.value = false;
}

function handleSync() {
  if (syncing.value) return;
  syncing.value = true;
  ui.loading("Menyinkronkan data (demo)...");
  setTimeout(() => {
    ui.hideToast();
    ui.success("Data berhasil disinkronkan", "Sinkron");
    syncing.value = false;
  }, 900);
}
</script>

<template>
  <header class="app-header">
    <div class="app-header-left">
      <button
        class="header-icon-btn sidebar-toggle-btn"
        type="button"
        title="Sidebar"
        @click="emit('toggle-sidebar')"
      >
        <PanelLeftClose v-if="sidebarOpen" size="20" />
        <PanelLeftOpen v-else size="20" />
      </button>

      <div class="mobile-top-logo">
        <img v-if="logo" :src="logo" alt="Logo" class="mobile-logo-img" />
        <Home v-else size="20" />
      </div>

      <div class="header-title-wrap">
        <strong>{{ title }}</strong>
        <small v-if="subtitle">{{ subtitle }}</small>
      </div>
    </div>

    <div class="app-header-actions">
      <button
        class="header-icon-btn sync-btn"
        :class="{ syncing }"
        type="button"
        title="Update Data"
        :disabled="syncing"
        @click="handleSync"
      >
        <RefreshCw size="20" />
      </button>

      <div class="notif-wrap">
        <button class="header-icon-btn notif-btn" type="button" title="Notifikasi" @click="toggleNotif">
          <Bell size="20" />
          <span v-if="hasUnread" class="notif-dot"></span>
        </button>
        <Transition name="notif">
          <div v-if="showNotif" class="notif-dropdown">
            <div class="notif-head">Notifikasi</div>
            <div v-for="item in notifList.slice(0, 4)" :key="item.id" class="notif-item" :class="{ unread: !item.read }">
              <div class="notif-item-body">
                <strong>{{ item.title }}</strong>
                <p>{{ item.message }}</p>
                <small>{{ item.time }}</small>
              </div>
              <div class="notif-item-dot" v-if="!item.read"></div>
            </div>
            <div v-if="!hasUnread" class="notif-empty">Tidak ada notifikasi</div>
            <button v-if="hasUnread" class="notif-mark-read" @click="markAllRead">Tandai semua telah dibaca</button>
          </div>
        </Transition>
      </div>

      <div class="profile-wrap">
        <button
          class="header-icon-btn profile-toggle"
          type="button"
          title="Profil"
          @click="profileMenuOpen = !profileMenuOpen"
        >
          <img v-if="profilePhoto" :src="profilePhoto" :alt="profileName" class="profile-avatar" />
          <UserRound v-else size="20" />
        </button>

        <Transition name="notif">
          <div v-if="profileMenuOpen" class="profile-dropdown">
            <div class="profile-dropdown-head">
              <strong>{{ profileName || "Pengguna" }}</strong>
              <small>{{ profileDetail || "User" }}</small>
            </div>
            <button class="profile-dropdown-item" @click="goToProfile">
              <UserRound size="16" />
              <span>Profil</span>
            </button>
            <button class="profile-dropdown-item danger" @click="handleLogout">
              <LogOut size="16" />
              <span>Keluar</span>
            </button>
          </div>
        </Transition>
      </div>
    </div>
  </header>
</template>

<style scoped>
.mobile-logo-img {
  width: 20px;
  height: 20px;
  object-fit: contain;
}

.profile-wrap {
  position: relative;
}

.profile-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
}

.profile-dropdown {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  z-index: 9999;
  width: 200px;
  padding: 8px;
  border-radius: 16px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
}

.profile-dropdown-head {
  padding: 10px;
  border-bottom: 1px solid var(--color-border);
}

.profile-dropdown-head strong {
  display: block;
  font-size: 0.82rem;
  font-weight: 900;
  color: var(--color-text);
}

.profile-dropdown-head small {
  display: block;
  margin-top: 2px;
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--color-muted);
}

.profile-dropdown-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border: 0;
  border-radius: 12px;
  background: transparent;
  color: var(--color-text);
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s;
}

.profile-dropdown-item:hover {
  background: var(--color-surface-soft);
}

.profile-dropdown-item.danger {
  color: var(--color-danger);
}

.profile-dropdown-item.danger:hover {
  background: color-mix(in srgb, var(--color-danger) 10%, transparent);
}
</style>
