<script setup lang="ts">
useSeoMeta({
  title: 'Pregrado',
  description:
    'Ingeniería Civil Mecánica en la Universidad Técnica Federico Santa María: áreas de formación, campus y acreditación.'
})

// El contenido vive en content/paginas/pregrado.yml y se edita desde /_studio.
const { data: pagina } = await useAsyncData('pagina-pregrado', () =>
  queryCollection('pregrado').first()
)

const areasFormacion = computed(() => pagina.value?.areasFormacion ?? [])
const campus = computed(() => pagina.value?.campus ?? [])
</script>

<template>
  <div>
    <!-- Pon la foto en public/cabeceras/ y pásala como :imagen="'/cabeceras/pregrado.jpg'" -->
    <CabeceraPagina titulo="Pregrado" />

    <div class="mx-auto w-full max-w-[1200px] px-5 py-10 lg:px-2.5">
      <p class="text-lg text-muted mb-10">
        {{ pagina?.intro }}
      </p>

      <section id="areas" class="scroll-mt-24">
        <h2 class="text-2xl font-semibold mb-2">Áreas de formación</h2>
        <p class="text-muted mb-6">
          Ejes en torno a los que se organizan los cursos y los trabajos de título.
        </p>

        <UPageGrid>
          <UPageCard
            v-for="a in areasFormacion"
            :key="a.titulo"
            :title="a.titulo"
            :description="a.descripcion"
            variant="subtle"
          />
        </UPageGrid>
      </section>

      <USeparator class="my-12" />

      <section id="campus" class="scroll-mt-24">
        <h2 class="text-2xl font-semibold mb-6">Dónde se dicta</h2>
        <div class="grid gap-5 sm:grid-cols-2">
          <div v-for="c in campus" :key="c.nombre" class="rounded-lg border border-default p-5">
            <p class="font-semibold text-usm-nav">{{ c.nombre }}</p>
            <p class="mt-1 text-sm text-muted">{{ c.detalle }}</p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
