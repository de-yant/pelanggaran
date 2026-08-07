<script setup>
import { ref } from "vue";
import AppSidebar from "./AppSidebar.vue";
import AppHeader from "./AppHeader.vue";
import AppFooter from "./AppFooter.vue";
import BottomNav from "./BottomNav.vue";
import { formatNama } from "@/utils/formatNama";
import { APP_VERSION, APP_NAME, SEKOLAH_NAMA } from "@/config";

const props = defineProps({
  roleTitle: {
    type: String,
    default: "Dashboard",
  },
  subtitle: {
    type: String,
    default: "",
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
  sidebarMenus: {
    type: Array,
    default: () => [],
  },
  bottomMenus: {
    type: Array,
    default: () => [],
  },
  centerTo: {
    type: String,
    default: "",
  },
});

const sidebarOpen = ref(true);

const finalProfileName = formatNama(props.profileName || "Pengguna");
const finalProfileDetail = props.profileDetail || "User";

function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value;
}
</script>
<template>
  <div class="app-layout" :class="{ 'sidebar-collapsed': !sidebarOpen }">
    <AppSidebar
      :app-name="APP_NAME"
      :profile-name="finalProfileName"
      :profile-detail="finalProfileDetail"
      :profile-photo="profilePhoto"
      :menus="sidebarMenus"
    />

    <section class="main-area">
      <AppHeader
        :title="roleTitle"
        :subtitle="subtitle"
        :sidebar-open="sidebarOpen"
        :profile-name="finalProfileName"
        :profile-detail="finalProfileDetail"
        :profile-photo="profilePhoto"
        @toggle-sidebar="toggleSidebar"
      />

      <div class="content-scroll">
        <main class="content">
          <RouterView
            :profile-name="finalProfileName"
            :profile-detail="finalProfileDetail"
            :profile-photo="profilePhoto"
          />
        </main>

        <AppFooter :school-name="SEKOLAH_NAMA" :app-name="APP_NAME" :version="APP_VERSION" />
      </div>
    </section>

    <BottomNav :menus="bottomMenus" :center-to="centerTo" />
  </div>
</template>
