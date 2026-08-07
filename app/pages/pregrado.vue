<script setup lang="ts">
useSeoMeta({
  title: 'Pregrado',
  description:
    'Ingeniería Civil Mecánica en la Universidad Técnica Federico Santa María: áreas de formación, campus y acreditación.'
})

const areasFormacion = [
  {
    title: 'Diseño y mecánica de sólidos',
    description: 'Diseño de máquinas, resistencia de materiales, elementos finitos y vibraciones.'
  },
  {
    title: 'Energía y termofluidos',
    description: 'Termodinámica, transferencia de calor, mecánica de fluidos y sistemas energéticos.'
  },
  {
    title: 'Manufactura y materiales',
    description: 'Procesos de fabricación, metalurgia, tratamientos térmicos y control de calidad.'
  },
  {
    title: 'Automatización y control',
    description: 'Mecatrónica, instrumentación, control automático y robótica industrial.'
  }
]

const campus = [
  { nombre: 'Campus Casa Central Valparaíso', detalle: 'Avda. España 1680, Valparaíso' },
  { nombre: 'Campus San Joaquín', detalle: 'Av. Vicuña Mackenna 3939, San Joaquín, Santiago' }
]
</script>

<template>
  <div>
    <!-- Pon la foto en public/cabeceras/ y pásala como :imagen="'/cabeceras/pregrado.jpg'" -->
    <CabeceraPagina titulo="Pregrado" />

    <div class="mx-auto w-full max-w-[1200px] px-5 py-10 lg:px-2.5">
      <p class="text-lg text-muted mb-10">
        El Departamento imparte la carrera de Ingeniería Civil Mecánica, con un plan de
        estudios con enfoque en competencias que se dicta en ambos campus.
      </p>

      <section id="areas" class="scroll-mt-24">
        <h2 class="text-2xl font-semibold mb-2">Áreas de formación</h2>
        <p class="text-muted mb-6">
          Ejes en torno a los que se organizan los cursos y los trabajos de título.
        </p>

        <UPageGrid>
          <UPageCard
            v-for="a in areasFormacion"
            :key="a.title"
            :title="a.title"
            :description="a.description"
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
