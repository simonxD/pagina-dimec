<script setup lang="ts">
useSeoMeta({
  title: 'Oportunidades de carreras',
  description:
    'Campo ocupacional y salidas profesionales de la Ingeniería Civil Mecánica USM.'
})

const sectores = [
  {
    titulo: 'Energía',
    descripcion: 'Generación, transmisión y eficiencia energética, con presencia creciente en renovables y almacenamiento.'
  },
  {
    titulo: 'Minería',
    descripcion: 'Diseño y operación de plantas, mantenimiento de equipos móviles y sistemas de transporte de mineral.'
  },
  {
    titulo: 'Manufactura',
    descripcion: 'Procesos de fabricación, automatización de líneas productivas y control de calidad.'
  },
  {
    titulo: 'Consultoría e ingeniería de proyectos',
    descripcion: 'Estudios de factibilidad, diseño de detalle e inspección técnica de obras.'
  },
  {
    titulo: 'Investigación y desarrollo',
    descripcion: 'Centros de investigación, universidades y áreas de innovación de la industria.'
  },
  {
    titulo: 'Emprendimiento',
    descripcion: 'Creación de empresas de base tecnológica a partir de desarrollos propios.'
  }
]
</script>

<template>
  <div>
    <!-- Pon la foto en public/cabeceras/ y pásala como :imagen="'/cabeceras/oportunidades.jpg'" -->
    <CabeceraPagina titulo="Oportunidades de carreras" :padre="{ label: 'Estudios', to: '/estudios' }" />

    <div class="mx-auto w-full max-w-[1200px] px-5 py-10 lg:px-2.5">
      <p class="text-lg text-muted mb-10">
        La formación en ingeniería mecánica abre puertas en sectores muy distintos entre sí.
        Estas son las salidas más frecuentes de nuestros egresados y egresadas.
      </p>

      <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="s in sectores"
          :key="s.titulo"
          class="rounded-lg border border-default p-6"
        >
          <h2 class="text-lg font-semibold text-usm-nav">{{ s.titulo }}</h2>
          <p class="mt-2 text-sm text-muted leading-relaxed">{{ s.descripcion }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
