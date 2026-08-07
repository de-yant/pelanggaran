export function setGuruSession(nama = "Guru BK") {
  localStorage.setItem("role", "guru");
  localStorage.setItem("pelanggaran_user", JSON.stringify({ nama, role: "guru" }));
}

export function setSiswaSession(siswa) {
  localStorage.setItem("role", "siswa");
  localStorage.setItem("siswa_session", JSON.stringify(siswa));
}

export function getCurrentUser() {
  try {
    const role = localStorage.getItem("role") || "";
    if (role === "siswa") {
      const siswa = JSON.parse(localStorage.getItem("siswa_session") || "{}");
      return { role, ...siswa };
    }
    return JSON.parse(localStorage.getItem("pelanggaran_user") || "{}");
  } catch {
    return {};
  }
}

export function isLoggedIn() {
  const role = localStorage.getItem("role");
  if (role === "siswa") {
    const siswa = JSON.parse(localStorage.getItem("siswa_session") || "{}");
    return Boolean(siswa.id);
  }
  return role === "guru";
}

export function logout() {
  localStorage.removeItem("role");
  localStorage.removeItem("pelanggaran_user");
  localStorage.removeItem("siswa_session");
}
