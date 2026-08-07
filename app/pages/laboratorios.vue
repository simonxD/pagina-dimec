<script setup lang="ts">
useSeoMeta({
  title: 'Laboratorios',
  description:
    'Laboratorios del Departamento de Ingeniería Mecánica USM.'
})

const laboratorios = [
  { nombre: 'Laboratorio de ensayo de materiales', detalle: 'Campus Casa Central Valparaíso' },
  { nombre: 'Laboratorio de termofluidos', detalle: 'Campus Casa Central Valparaíso' },
  { nombre: 'Laboratorio de vibraciones y acústica', detalle: 'Campus Casa Central Valparaíso' },
  { nombre: 'Laboratorio de manufactura', detalle: 'Campus Casa Central Valparaíso' },
  { nombre: 'Laboratorio de automatización', detalle: 'Campus San Joaquín' },
  { nombre: 'Sala de simulación computacional', detalle: 'Campus San Joaquín' }
]
</script>

<template>
  <div>
    <!-- Pon la foto en public/cabeceras/ y pásala como :imagen="'/cabeceras/laboratorios.jpg'" -->
    <CabeceraPagina titulo="Laboratorios" />

    <div class="mx-auto w-full max-w-[1200px] px-5 py-10 lg:px-2.5">
      <p class="text-lg text-muted mb-10">
        El Departamento cuenta con laboratorios de docencia e investigación en ambos campus,
        disponibles para trabajos de título, tesis y proyectos con la industria.
      </p>

      <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="l in laboratorios"
          :key="l.nombre"
          class="rounded-lg border border-default p-5"
        >
          <p class="font-semibold text-usm-nav">{{ l.nombre }}</p>
          <p class="mt-1 text-sm text-muted">{{ l.detalle }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
