<script setup lang="ts">
useSeoMeta({
  title: 'Educación continua',
  description:
    'Diplomados y cursos de especialización del Departamento de Ingeniería Mecánica USM.'
})

// El contenido vive en content/paginas/educacion-continua.yml y se edita desde /_studio.
const { data: pagina } = await useAsyncData('pagina-educacion-continua', () =>
  queryCollection('educacionContinua').first()
)

const modalidades = computed(() => pagina.value?.modalidades ?? [])
</script>

<template>
  <div>
    <!-- Pon la foto en public/cabeceras/ y pásala como :imagen="'/cabeceras/educacion-continua.jpg'" -->
    <CabeceraPagina titulo="Educación continua" />

    <div class="mx-auto w-full max-w-[1200px] px-5 py-10 lg:px-2.5">
      <p class="text-lg text-muted mb-10">
        {{ pagina?.intro }}
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
