<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import "@/assets/css/siswa.css";
import AppLayout from "../components/AppLayout.vue";
import { APP_NAME } from "@/config";

const route = useRoute();
const nisn = computed(() => route.params.nisn);

const session = JSON.parse(localStorage.getItem("siswa_session") || "{}");
const siswaNama = session.nama || "Siswa";
const siswaKelas = session.kelas || "";

const sidebarMenus = computed(() => [
  { label: "Beranda", to: `/${nisn.value}/dashboard`, icon: "Home" },
  { label: "Rekap Poin", to: `/${nisn.value}/rekap`, icon: "BarChart3" },
  { label: "Profil", to: `/${nisn.value}/profil`, icon: "UserRound" },
  { label: "Keluar", to: `/${nisn.value}/logout`, icon: "LogOut" },
]);

const bottomMenus = computed(() => [
  { label: "Beranda", to: `/${nisn.value}/dashboard`, icon: "Home" },
  { label: "Rekap", to: `/${nisn.value}/rekap`, icon: "BarChart3" },
  { label: "Profil", to: `/${nisn.value}/profil`, icon: "UserRound" },
]);
</script>

<template>
  <AppLayout
    :role-title="APP_NAME"
    subtitle="Monitoring pelanggaran siswa"
    :profile-name="siswaNama"
    :profile-detail="siswaKelas"
    :sidebar-menus="sidebarMenus"
    :bottom-menus="bottomMenus"
  />
</template>
