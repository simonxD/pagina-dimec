<script setup lang="ts">
useSeoMeta({
  title: 'Oportunidades de carreras',
  description:
    'Campo ocupacional y salidas profesionales de la Ingeniería Civil Mecánica USM.'
})

// El contenido vive en content/paginas/oportunidades.yml y se edita desde /_studio.
const { data: pagina } = await useAsyncData('pagina-oportunidades', () =>
  queryCollection('oportunidades').first()
)

const sectores = computed(() => pagina.value?.sectores ?? [])
</script>

<template>
  <div>
    <!-- Pon la foto en public/cabeceras/ y pásala como :imagen="'/cabeceras/oportunidades.jpg'" -->
    <CabeceraPagina titulo="Oportunidades de carreras" :padre="{ label: 'Estudios', to: '/estudios' }" />

    <div class="mx-auto w-full max-w-[1200px] px-5 py-10 lg:px-2.5">
      <p class="text-lg text-muted mb-10">
        {{ pagina?.intro }}
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
