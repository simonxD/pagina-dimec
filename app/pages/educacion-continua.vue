<script setup lang="ts">
useSeoMeta({
  title: 'Educación continua',
  description:
    'Diplomados y cursos de especialización del Departamento de Ingeniería Mecánica USM.'
})

const modalidades = [
  {
    titulo: 'Diplomados',
    descripcion: 'Programas de varios meses orientados a la especialización técnica de profesionales en ejercicio.'
  },
  {
    titulo: 'Cursos de especialización',
    descripcion: 'Formación breve sobre herramientas y normativas concretas del ejercicio profesional.'
  },
  {
    titulo: 'Capacitación a empresas',
    descripcion: 'Programas diseñados a medida para equipos técnicos de una organización.'
  }
]
</script>

<template>
  <div>
    <!-- Pon la foto en public/cabeceras/ y pásala como :imagen="'/cabeceras/educacion-continua.jpg'" -->
    <CabeceraPagina titulo="Educación continua" />

    <div class="mx-auto w-full max-w-[1200px] px-5 py-10 lg:px-2.5">
      <p class="text-lg text-muted mb-10">
        El Departamento ofrece formación para profesionales que buscan actualizarse o
        especializarse sin dejar el ejercicio de su carrera.
      </p>

      <div class="grid gap-5 md:grid-cols-3">
        <div
          v-for="m in modalidades"
          :key="m.titulo"
          class="rounded-lg border border-default p-6"
        >
          <h2 class="text-xl font-semibold text-usm-nav">{{ m.titulo }}</h2>
          <p class="mt-2 text-sm text-muted leading-relaxed">{{ m.descripcion }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
