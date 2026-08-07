<script setup lang="ts">
useSeoMeta({
  title: 'Estudios',
  description:
    'Programas de pregrado, postgrado y educación continua del Departamento de Ingeniería Mecánica USM.'
})

const programas = [
  {
    titulo: 'Pregrado',
    descripcion: 'Ingeniería Civil Mecánica, dictada en el Campus Casa Central Valparaíso y en el Campus San Joaquín.',
    to: '/pregrado'
  },
  {
    titulo: 'Postgrado',
    descripcion: 'Dos magísteres y un doctorado, entre formación científica y profesional.',
    to: '/postgrado'
  },
  {
    titulo: 'Educación continua',
    descripcion: 'Diplomados y cursos de especialización para profesionales en ejercicio.',
    to: '/educacion-continua'
  }
]
</script>

<template>
  <div>
    <!-- Pon la foto en public/cabeceras/ y pásala como :imagen="'/cabeceras/estudios.jpg'" -->
    <CabeceraPagina titulo="Estudios" />

    <div class="mx-auto w-full max-w-[1200px] px-5 py-10 lg:px-2.5">
      <p class="text-lg text-muted mb-10">
        El Departamento cubre el ciclo formativo completo, desde la carrera de pregrado
        hasta los programas de postgrado y la especialización de profesionales.
      </p>

      <div class="grid gap-5 md:grid-cols-3">
        <NuxtLink
          v-for="p in programas"
          :key="p.to"
          :to="p.to"
          class="group rounded-lg border border-default p-6 transition-colors hover:border-usm"
        >
          <h2 class="text-xl font-semibold text-usm-nav group-hover:text-usm">
            {{ p.titulo }}
          </h2>
          <p class="mt-2 text-sm text-muted leading-relaxed">{{ p.descripcion }}</p>
          <span class="mt-4 inline-flex items-center gap-2 text-sm font-bold text-usm-nav/80">
            <span class="grid size-7 shrink-0 place-items-center rounded-full bg-usm-dorado text-white">
              <UIcon name="i-lucide-arrow-right" class="size-3.5" />
            </span>
            Ver más
          </span>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
