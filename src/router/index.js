import { createRouter, createWebHistory } from "vue-router";
import { getCurrentUser, isLoggedIn } from "@/services/authService";
import { APP_NAME } from "@/config";

const routes = [
  {
    path: "/",
    name: "landing",
    component: () => import("../views/HomeView.vue"),
    meta: { title: "Beranda" },
  },

  {
    path: "/error",
    name: "error",
    component: () => import("../views/error/ErrorPage.vue"),
    meta: { title: "Error" },
  },

  {
    path: "/login",
    component: () => import("../layouts/AuthLayout.vue"),
    meta: { guestOnly: true, title: "Login Guru" },
    children: [
      {
        path: "",
        name: "login",
        component: () => import("../views/auth/LoginView.vue"),
      },
    ],
  },

  {
    path: "/guru",
    component: () => import("../layouts/GuruLayout.vue"),
    meta: { role: "guru" },
    children: [
      { path: "", redirect: "/guru/dashboard" },
      {
        path: "dashboard",
        name: "guru.dashboard",
        component: () => import("../views/guru/HomeView.vue"),
        meta: { title: "Dashboard Guru" },
      },
      {
        path: "pelanggaran",
        name: "guru.pelanggaran",
        component: () => import("../views/guru/PelanggaranView.vue"),
        meta: { title: "Data Pelanggaran" },
      },
      {
        path: "kategori",
        name: "guru.kategori",
        component: () => import("../views/guru/KategoriView.vue"),
        meta: { title: "Kategori Pelanggaran" },
      },
      {
        path: "pencatatan",
        name: "guru.pencatatan",
        component: () => import("../views/guru/PencatatanView.vue"),
        meta: { title: "Pencatatan Pelanggaran" },
      },
      {
        path: "rekap",
        name: "guru.rekap",
        component: () => import("../views/guru/RekapView.vue"),
        meta: { title: "Rekap Laporan" },
      },
    ],
  },

  {
    path: "/:nisn",
    component: () => import("../layouts/SiswaLayout.vue"),
    meta: { studentRoute: true },
    children: [
      { path: "", redirect: "/:nisn/dashboard" },
      {
        path: "dashboard",
        name: "siswa.dashboard",
        component: () => import("../views/siswa/HomeView.vue"),
        meta: { title: "Dashboard Siswa" },
      },
      {
        path: "rekap",
        name: "siswa.rekap",
        component: () => import("../views/siswa/RekapView.vue"),
        meta: { title: "Rekap Pelanggaran" },
      },
      {
        path: "profil",
        name: "siswa.profil",
        component: () => import("../views/siswa/ProfilView.vue"),
        meta: { title: "Profil Siswa" },
      },
    ],
  },

  {
    path: "/:pathMatch(.*)*",
    redirect: { name: "error", query: { code: "404", title: "Halaman Tidak Ditemukan", message: "Halaman yang kamu cari tidak ada atau telah dipindahkan." } },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

function getDashboardByRole(role, nisn) {
  if (role === "guru") return "/guru/dashboard";
  if (role === "siswa" && nisn) return `/${nisn}/dashboard`;
  return "/";
}

router.beforeEach((to) => {
  const isStudentRoute = to.matched.some((record) => record.meta.studentRoute);

  if (isStudentRoute && to.params.nisn === "logout") {
    localStorage.removeItem("siswa_session");
    localStorage.removeItem("role");
    return "/";
  }

  const user = getCurrentUser();
  const valid = isLoggedIn();

  const requiredRole = to.matched.find((record) => record.meta.role)?.meta.role;
  const guestOnly = to.matched.some((record) => record.meta.guestOnly);

  if (guestOnly && valid && user?.role) {
    const target = getDashboardByRole(user.role, user.nisn || user.id);
    if (target !== to.path) return target;
    return true;
  }

  if (!requiredRole && !isStudentRoute) {
    return true;
  }

  if (isStudentRoute) {
    const siswaSession = localStorage.getItem("siswa_session");
    if (siswaSession) return true;
    return "/";
  }

  if (!valid || !user) {
    if (to.path !== "/login") return "/login";
    return true;
  }

  if (requiredRole && user.role !== requiredRole) {
    const target = getDashboardByRole(user.role, user.nisn || user.id);
    if (target !== to.path) return target;
    return true;
  }

  return true;
});

router.afterEach((to) => {
  document.title = to.meta?.title || APP_NAME;
});

export default router;
