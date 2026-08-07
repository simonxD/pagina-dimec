<script setup lang="ts">
useSeoMeta({
  title: 'Sitios estudiantiles',
  description:
    'Plataformas y servicios en línea para estudiantes del Departamento de Ingeniería Mecánica USM.'
})

// TODO: confirmar las URL internas del Departamento antes de publicar.
const sitios = [
  {
    nombre: 'Aula USM',
    descripcion: 'Plataforma de cursos, material y entregas de las asignaturas.',
    url: 'https://aula.usm.cl/'
  },
  {
    nombre: 'Sistema de Información de Gestión Académica',
    descripcion: 'Inscripción de asignaturas, avance curricular y certificados.',
    url: 'https://siga.usm.cl/pag/'
  },
  {
    nombre: 'Portal de Autoservicio Institucional',
    descripcion: 'Trámites administrativos y datos personales.',
    url: 'https://ssb.usm.cl'
  },
  {
    nombre: 'Biblioteca',
    descripcion: 'Catálogo, préstamos y acceso a bases de datos científicas.',
    url: 'https://biblioteca.usm.cl/'
  },
  {
    nombre: 'Directorio USM',
    descripcion: 'Contactos de unidades académicas y administrativas.',
    url: 'https://directorio.usm.cl/'
  },
  {
    nombre: 'Dirección de Tecnologías de la Información',
    descripcion: 'Correo institucional, redes y soporte técnico.',
    url: 'https://dti.usm.cl/'
  }
]
</script>

<template>
  <div>
    <!-- Pon la foto en public/cabeceras/ y pásala como :imagen="'/cabeceras/sitios-estudiantiles.jpg'" -->
    <CabeceraPagina titulo="Sitios estudiantiles" :padre="{ label: 'Estudios', to: '/estudios' }" />

    <div class="mx-auto w-full max-w-[1200px] px-5 py-10 lg:px-2.5">
      <p class="text-lg text-muted mb-10">
        Plataformas que vas a usar durante la carrera, reunidas en un solo lugar.
      </p>

      <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <a
          v-for="s in sitios"
          :key="s.url"
          :href="s.url"
          target="_blank"
          class="group rounded-lg border border-default p-6 transition-colors hover:border-usm"
        >
          <h2 class="flex items-start gap-2 text-lg font-semibold text-usm-nav group-hover:text-usm">
            {{ s.nombre }}
            <UIcon name="i-lucide-arrow-up-right" class="mt-1 size-4 shrink-0" />
          </h2>
          <p class="mt-2 text-sm leading-relaxed text-muted">{{ s.descripcion }}</p>
        </a>
      </div>
    </div>
  </div>
</template>
