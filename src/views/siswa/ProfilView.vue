<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { getSiswaByNisn, getPelanggaranBySiswa } from "@/services/mockData";
import { formatNama } from "@/utils/formatNama";
import { UserRound, IdCard, School, Briefcase, AlertTriangle, ShieldCheck, CalendarDays } from "@/components/ui/Icons";

const route = useRoute();
const nisn = route.params.nisn;

const siswa = computed(() => getSiswaByNisn(nisn));
const catatan = computed(() => getPelanggaranBySiswa(siswa.value?.id || ""));

const totalPoin = computed(() => catatan.value.reduce((s, p) => s + p.poin, 0));
const totalCatatan = computed(() => catatan.value.length);
</script>

<template>
  <main class="pel-page">
    <section class="sp-head">
      <div class="sp-head-left">
        <div class="sp-avatar">{{ (siswa?.nama || "S").charAt(0) }}</div>
        <div class="sp-head-info">
          <h2>{{ formatNama(siswa?.nama || "Siswa") }}</h2>
          <p>{{ siswa?.kelas }}</p>
        </div>
      </div>
      <div class="sp-head-right">
        <div class="sp-head-meta"><strong>{{ totalCatatan }}</strong><small>Catatan</small></div>
        <div class="sp-head-meta"><strong>{{ totalPoin }}</strong><small>Poin</small></div>
      </div>
    </section>

    <section class="pel-card">
      <div class="pel-card-head">
        <div class="pel-card-head-title"><UserRound size="18" /><h3>Data Siswa</h3></div>
      </div>

      <div class="pel-profile-grid">
        <div class="pel-profile-item">
          <IdCard size="18" style="flex-shrink: 0; color: var(--color-primary)" />
          <div>
            <label>Nama Lengkap</label>
            <strong>{{ formatNama(siswa?.nama || "-") }}</strong>
          </div>
        </div>
        <div class="pel-profile-item">
          <ShieldCheck size="18" style="flex-shrink: 0; color: var(--color-primary)" />
          <div>
            <label>NISN</label>
            <strong>{{ siswa?.nisn || "-" }}</strong>
          </div>
        </div>
        <div class="pel-profile-item">
          <School size="18" style="flex-shrink: 0; color: var(--color-primary)" />
          <div>
            <label>Kelas / Rombel</label>
            <strong>{{ siswa?.kelas || "-" }}</strong>
          </div>
        </div>
        <div class="pel-profile-item">
          <CalendarDays size="18" style="flex-shrink: 0; color: var(--color-primary)" />
          <div>
            <label>Status Keaktifan</label>
            <strong style="color: var(--color-success)">Aktif</strong>
          </div>
        </div>
      </div>
    </section>

    <section class="pel-card">
      <div class="pel-card-head">
        <div class="pel-card-head-title"><AlertTriangle size="18" /><h3>Ringkasan Poin</h3></div>
      </div>

      <div class="poin-summary">
        <div class="poin-box green">
          <span>Total Catatan</span>
          <strong>{{ totalCatatan }}</strong>
        </div>
        <div class="poin-box yellow">
          <span>Total Poin</span>
          <strong>{{ totalPoin }}</strong>
        </div>
        <div class="poin-box red">
          <span>Level</span>
          <strong style="font-size: 0.85rem">
            {{ totalPoin < 10 ? "RINGAN" : totalPoin < 25 ? "SEDANG" : "BERAT" }}
          </strong>
        </div>
      </div>

      <p style="margin: 10px 0 0; color: var(--color-muted); font-size: 0.72rem; font-weight: 750; line-height: 1.5">
        Data ini merupakan tampilan demo menggunakan data contoh dan belum terhubung ke database.
      </p>
    </section>
  </main>
</template>
