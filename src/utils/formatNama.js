export function formatNama(nama = "") {
  return String(nama)
    .toLocaleLowerCase("id-ID")
    .split(" ")
    .filter(Boolean)
    .map((kata) => kata.charAt(0).toLocaleUpperCase("id-ID") + kata.slice(1))
    .join(" ");
}
