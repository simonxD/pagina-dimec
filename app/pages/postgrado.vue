<script setup lang="ts">
useSeoMeta({
  title: 'Postgrado',
  description:
    'Programas de postgrado del Departamento de Ingeniería Mecánica: magíster y doctorado.'
})

// El contenido vive en content/paginas/postgrado.yml y se edita desde /_studio.
// Los identificadores coinciden con los enlaces del menú (app/utils/navigation.ts)
const { data: pagina } = await useAsyncData('pagina-postgrado', () =>
  queryCollection('postgrado').first()
)

const programas = computed(() => pagina.value?.programas ?? [])
</script>

<template>
  <div>
    <!-- Pon la foto en public/cabeceras/ y pásala como :imagen="'/cabeceras/postgrado.jpg'" -->
    <CabeceraPagina titulo="Postgrado" />

    <div class="mx-auto w-full max-w-[1200px] px-5 py-10 lg:px-2.5">
      <p class="text-lg text-muted mb-10">
        {{ pagina?.intro }}
      </p>

      <div class="space-y-12">
        <section
          v-for="p in programas"
          :key="p.id"
          :id="p.id"
          class="scroll-mt-24"
        >
          <h2 class="text-2xl font-semibold">{{ p.titulo }}</h2>
          <p class="mt-2 text-muted">{{ p.descripcion }}</p>
        </section>
      </div>
    </div>
  </div>
</template>
