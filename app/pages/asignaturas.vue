<script setup lang="ts">
useSeoMeta({
  title: 'Asignaturas',
  description:
    'Asignaturas impartidas por el Departamento de Ingeniería Mecánica USM.'
})

// Datos de ejemplo: reemplazar por el catálogo real de asignaturas.
const asignaturas = [
  { codigo: 'IWM000', nombre: 'Nombre de la asignatura', nivel: 'Pregrado', creditos: 3 },
  { codigo: 'IWM001', nombre: 'Nombre de la asignatura', nivel: 'Pregrado', creditos: 3 },
  { codigo: 'IWM002', nombre: 'Nombre de la asignatura', nivel: 'Pregrado', creditos: 4 },
  { codigo: 'IWM100', nombre: 'Nombre de la asignatura', nivel: 'Postgrado', creditos: 5 },
  { codigo: 'IWM101', nombre: 'Nombre de la asignatura', nivel: 'Postgrado', creditos: 5 }
]
</script>

<template>
  <div>
    <!-- Pon la foto en public/cabeceras/ y pásala como :imagen="'/cabeceras/asignaturas.jpg'" -->
    <CabeceraPagina titulo="Asignaturas" :padre="{ label: 'Estudios', to: '/estudios' }" />

    <div class="mx-auto w-full max-w-[1200px] px-5 py-10 lg:px-2.5">
      <p class="text-lg text-muted mb-10">
        Asignaturas impartidas por el Departamento, en pregrado y postgrado.
      </p>

      <ul class="border-t border-default">
        <li
          v-for="a in asignaturas"
          :key="a.codigo"
          class="flex flex-wrap items-baseline gap-x-5 gap-y-1 border-b border-default py-4"
        >
          <span class="w-20 shrink-0 text-sm font-bold text-usm">{{ a.codigo }}</span>
          <span class="min-w-0 flex-1 text-usm-nav">{{ a.nombre }}</span>
          <span class="text-sm text-muted">{{ a.nivel }}</span>
          <span class="w-20 text-right text-sm text-muted">{{ a.creditos }} créditos</span>
        </li>
      </ul>
    </div>
  </div>
</template>
