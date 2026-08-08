<script setup lang="ts">
useSeoMeta({
  title: 'Laboratorios',
  description:
    'Laboratorios del Departamento de Ingeniería Mecánica USM.'
})

// El contenido vive en content/paginas/laboratorios.yml y se edita desde /_studio.
const { data: pagina } = await useAsyncData('pagina-laboratorios', () =>
  queryCollection('laboratorios').first()
)

const laboratorios = computed(() => pagina.value?.laboratorios ?? [])
</script>

<template>
  <div>
    <!-- Pon la foto en public/cabeceras/ y pásala como :imagen="'/cabeceras/laboratorios.jpg'" -->
    <CabeceraPagina titulo="Laboratorios" />

    <div class="mx-auto w-full max-w-[1200px] px-5 py-10 lg:px-2.5">
      <p class="text-lg text-muted mb-10">
        {{ pagina?.intro }}
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
