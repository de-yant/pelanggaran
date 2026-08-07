import { reactive } from "vue";

let toastTimer = null;

const toast = reactive({
  show: false,
  type: "info",
  title: "",
  message: "",
  icon: null,
  duration: 3000,
});

const modal = reactive({
  show: false,
  type: "info",
  title: "",
  message: "",
  confirmText: "Ya",
  cancelText: "Batal",
  showCancel: true,
  loading: false,
  onConfirm: null,
  onCancel: null,
});

function showToast({ type = "info", title = "", message = "", icon = null, duration = 3000 } = {}) {
  clearTimeout(toastTimer);
  toast.show = true;
  toast.type = type;
  toast.title = title;
  toast.message = message;
  toast.icon = icon;
  toast.duration = duration;
  if (type !== "loading" && duration > 0) {
    toastTimer = setTimeout(() => hideToast(), duration);
  }
}

function hideToast() {
  clearTimeout(toastTimer);
  toast.show = false;
  toast.icon = null;
  toastTimer = null;
}

function showModal({
  type = "info",
  title = "",
  message = "",
  confirmText = "Ya",
  cancelText = "Batal",
  showCancel = true,
  onConfirm = null,
  onCancel = null,
} = {}) {
  modal.show = true;
  modal.type = type;
  modal.title = title;
  modal.message = message;
  modal.confirmText = confirmText;
  modal.cancelText = cancelText;
  modal.showCancel = showCancel;
  modal.loading = false;
  modal.onConfirm = onConfirm;
  modal.onCancel = onCancel;
}

function closeModal() {
  if (typeof modal.onCancel === "function") modal.onCancel();
  resetModal();
}

async function confirmModal() {
  if (modal.loading) return;
  const action = modal.onConfirm;
  resetModal();
  try {
    if (typeof action === "function") await Promise.resolve(action());
  } catch (err) {
    console.error("Modal Error:", err);
    error(err?.message || "Aksi gagal diproses.", "Terjadi Kesalahan");
  }
}

function resetModal() {
  modal.show = false;
  modal.type = "info";
  modal.title = "";
  modal.message = "";
  modal.confirmText = "Ya";
  modal.cancelText = "Batal";
  modal.showCancel = true;
  modal.loading = false;
  modal.onConfirm = null;
  modal.onCancel = null;
}

function success(message = "Berhasil diproses.", title = "Berhasil") {
  showToast({ type: "success", title, message });
}

function error(message = "Terjadi kesalahan.", title = "Gagal") {
  showToast({ type: "error", title, message, duration: 4000 });
}

function warning(message = "Periksa kembali data Anda.", title = "Peringatan") {
  showToast({ type: "warning", title, message, duration: 3500 });
}

function info(message = "Informasi terbaru tersedia.", title = "Informasi") {
  showToast({ type: "info", title, message });
}

function loading(message = "Sedang memproses data...", title = "Mohon tunggu") {
  showToast({ type: "loading", title, message, duration: 0 });
}

function confirm({ title = "Konfirmasi", message = "Apakah Anda yakin?", confirmText = "Ya", cancelText = "Batal", onConfirm = null } = {}) {
  showModal({ type: "warning", title, message, confirmText, cancelText, showCancel: true, onConfirm });
}

function alert({ type = "info", title = "Informasi", message = "", confirmText = "Mengerti" } = {}) {
  showModal({ type, title, message, confirmText, showCancel: false });
}

function danger({ title = "Hapus Data?", message = "Data yang dihapus tidak bisa dikembalikan.", confirmText = "Hapus", cancelText = "Batal", onConfirm = null } = {}) {
  showModal({ type: "danger", title, message, confirmText, cancelText, showCancel: true, onConfirm });
}

export function useUiStore() {
  return {
    toast,
    modal,
    showToast,
    hideToast,
    showModal,
    closeModal,
    confirmModal,
    resetModal,
    success,
    error,
    warning,
    info,
    loading,
    confirm,
    alert,
    danger,
  };
}
