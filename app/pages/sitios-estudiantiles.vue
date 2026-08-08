<script setup lang="ts">
useSeoMeta({
  title: 'Sitios estudiantiles',
  description:
    'Plataformas y servicios en línea para estudiantes del Departamento de Ingeniería Mecánica USM.'
})

// El contenido vive en content/paginas/sitios-estudiantiles.yml y se edita desde /_studio.
const { data: pagina } = await useAsyncData('pagina-sitios-estudiantiles', () =>
  queryCollection('sitiosEstudiantiles').first()
)

const sitios = computed(() => pagina.value?.sitios ?? [])
</script>

<template>
  <div>
    <!-- Pon la foto en public/cabeceras/ y pásala como :imagen="'/cabeceras/sitios-estudiantiles.jpg'" -->
    <CabeceraPagina titulo="Sitios estudiantiles" :padre="{ label: 'Estudios', to: '/estudios' }" />

    <div class="mx-auto w-full max-w-[1200px] px-5 py-10 lg:px-2.5">
      <p class="text-lg text-muted mb-10">
        {{ pagina?.intro }}
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
