<script setup lang="ts">
useSeoMeta({
  title: 'Vinculación',
  description:
    'Vinculación con el medio del Departamento de Ingeniería Mecánica USM: industria, alumni, visitas, donaciones y servicios a externos.'
})

const secciones = [
  {
    id: 'oportunidades',
    titulo: 'Oportunidades de carrera e industrias',
    texto: 'Sectores donde ejercen nuestros egresados y egresadas, y vías de colaboración con empresas que buscan perfiles de ingeniería mecánica.',
    enlace: { label: 'Ver oportunidades', to: '/oportunidades', externo: false }
  },
  {
    id: 'alumni',
    titulo: 'Alumni',
    texto: 'Red de titulados del Departamento: actividades de reencuentro, mentorías a estudiantes y participación en la vida académica.',
    enlace: { label: 'Alumni USM', to: 'https://www.exalumnos.usm.cl/', externo: true }
  },
  {
    id: 'visitas',
    titulo: 'Visitas al DIMEC',
    texto: 'Recorridos por los laboratorios y charlas para colegios, institutos y organizaciones interesadas en conocer la carrera de cerca.',
    enlace: { label: 'Solicitar una visita', to: '/contacto', externo: false }
  },
  {
    id: 'donaciones',
    titulo: 'Donaciones',
    texto: 'Aportes destinados a equipamiento de laboratorios, becas y proyectos de investigación del Departamento.',
    enlace: { label: 'Portal de donaciones USM', to: 'https://donaciones.usm.cl/', externo: true }
  },
  {
    id: 'servicios',
    titulo: 'Servicios a externos',
    texto: 'Ensayos de laboratorio, asesorías técnicas, peritajes y estudios de ingeniería para empresas e instituciones.',
    enlace: { label: 'Consultar por un servicio', to: '/contacto', externo: false }
  },
  {
    id: 'idea',
    titulo: '¿Tienes una idea?',
    texto: 'Si tienes un proyecto, una necesidad técnica o una propuesta de colaboración, cuéntanos de qué se trata y buscamos con quién encaja dentro del Departamento.',
    enlace: { label: 'Escríbenos', to: '/contacto', externo: false }
  }
]
</script>

<template>
  <div>
    <!-- Pon la foto en public/cabeceras/ y pásala como :imagen="'/cabeceras/vinculacion.jpg'" -->
    <CabeceraPagina titulo="Vinculación" />

    <div class="mx-auto w-full max-w-[1200px] px-5 py-10 lg:px-2.5">
      <p class="text-lg text-muted mb-10">
        La vinculación con el medio conecta la docencia y la investigación del Departamento
        con la industria, sus titulados y la comunidad.
      </p>

      <div class="grid gap-5 md:grid-cols-2">
        <section
          v-for="s in secciones"
          :id="s.id"
          :key="s.id"
          class="flex scroll-mt-24 flex-col rounded-lg border border-default p-6"
        >
          <h2 class="text-xl font-semibold text-usm-nav">{{ s.titulo }}</h2>
          <p class="mt-2 flex-1 text-sm leading-relaxed text-muted">{{ s.texto }}</p>

          <a
            v-if="s.enlace.externo"
            :href="s.enlace.to"
            target="_blank"
            class="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-usm hover:underline"
          >
            {{ s.enlace.label }}
            <UIcon name="i-lucide-arrow-up-right" class="size-4" />
          </a>
          <NuxtLink
            v-else
            :to="s.enlace.to"
            class="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-usm hover:underline"
          >
            {{ s.enlace.label }}
            <UIcon name="i-lucide-arrow-right" class="size-4" />
          </NuxtLink>
        </section>
      </div>
    </div>
  </div>
</template>
