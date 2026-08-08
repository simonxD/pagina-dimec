<script setup lang="ts">
useSeoMeta({
  title: 'Investigación',
  description:
    'Áreas de investigación del Departamento de Ingeniería Mecánica USM.'
})

// El contenido vive en content/paginas/investigacion.yml y se edita desde /_studio.
// Los identificadores y los nombres de las áreas siguen en app/utils/areas.ts,
// que también alimenta el menú y las fichas de personas: aquí solo se edita el
// texto descriptivo de cada una.
const { data: pagina } = await useAsyncData('pagina-investigacion', () =>
  queryCollection('investigacion').first()
)

// El YAML guarda una lista para que el formulario de Studio sea manejable; la
// plantilla necesita un acceso por identificador de área.
const descripciones = computed<Record<string, string>>(() =>
  Object.fromEntries((pagina.value?.descripciones ?? []).map(d => [d.area, d.texto]))
)
</script>

<template>
  <div>
    <!-- Pon la foto en public/cabeceras/ y pásala como :imagen="'/cabeceras/investigacion.jpg'" -->
    <CabeceraPagina titulo="Investigación" />

    <div class="mx-auto w-full max-w-[1200px] px-5 py-10 lg:px-2.5">
      <p class="text-lg text-muted mb-10">
        {{ pagina?.intro }}
      </p>

      <div class="space-y-10">
        <section v-for="a in areas" :id="a.id" :key="a.id" class="scroll-mt-24">
          <h2 class="text-2xl font-semibold">{{ a.nombre }}</h2>
          <p class="mt-2 max-w-[760px] text-muted leading-relaxed">
            {{ descripciones[a.id] }}
          </p>
        </section>
      </div>
    </div>
  </div>
</template>
