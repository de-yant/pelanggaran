<script setup>
import "@/assets/css/guru.css";
import AppLayout from "../components/AppLayout.vue";
import { APP_NAME } from "@/config";

const guruNama = JSON.parse(localStorage.getItem("pelanggaran_user") || "{}").nama || "Guru BK";

const sidebarMenus = [
  { label: "Beranda", to: "/guru/dashboard", icon: "Home" },
  { label: "Data Pelanggaran", to: "/guru/pelanggaran", icon: "ListChecks" },
  { label: "Kategori", to: "/guru/kategori", icon: "BookOpen" },
  { label: "Pencatatan", to: "/guru/pencatatan", icon: "FilePlus2" },
  { label: "Rekap Laporan", to: "/guru/rekap", icon: "BarChart3" },
  { label: "Keluar", to: "/logout", icon: "LogOut" },
];

const bottomMenus = [
  { label: "Beranda", to: "/guru/dashboard", icon: "Home" },
  { label: "Pelanggaran", to: "/guru/pelanggaran", icon: "ListChecks" },
  { label: "Kategori", to: "/guru/kategori", icon: "BookOpen" },
  { label: "Rekap", to: "/guru/rekap", icon: "BarChart3" },
];
</script>

<template>
  <AppLayout
    :role-title="APP_NAME"
    subtitle="Pencatatan pelanggaran siswa"
    :profile-name="guruNama"
    profile-detail="Guru"
    :sidebar-menus="sidebarMenus"
    :bottom-menus="bottomMenus"
    center-to="/guru/pencatatan"
  />
</template>
