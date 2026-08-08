<script setup lang="ts">
useSeoMeta({
  title: 'Asignaturas',
  description:
    'Asignaturas impartidas por el Departamento de Ingeniería Mecánica USM.'
})

// El contenido vive en content/paginas/asignaturas.yml y se edita desde /_studio.
const { data: pagina } = await useAsyncData('pagina-asignaturas', () =>
  queryCollection('asignaturas').first()
)

const asignaturas = computed(() => pagina.value?.asignaturas ?? [])
</script>

<template>
  <div>
    <!-- Pon la foto en public/cabeceras/ y pásala como :imagen="'/cabeceras/asignaturas.jpg'" -->
    <CabeceraPagina titulo="Asignaturas" :padre="{ label: 'Estudios', to: '/estudios' }" />

    <div class="mx-auto w-full max-w-[1200px] px-5 py-10 lg:px-2.5">
      <p class="text-lg text-muted mb-10">
        {{ pagina?.intro }}
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
