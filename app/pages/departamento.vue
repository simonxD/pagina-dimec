<script setup lang="ts">
useSeoMeta({
  title: 'Departamento',
  description:
    'Historia, misión y estructura del Departamento de Ingeniería Mecánica USM.'
})

// El contenido vive en content/paginas/departamento.yml y se edita desde /_studio.
const { data: pagina } = await useAsyncData('pagina-departamento', () =>
  queryCollection('departamento').first()
)

// Se exponen con los mismos nombres que usaba el contenido fijo para que la
// plantilla no cambie: lo que se renderiza es exactamente lo de antes.
const valores = computed(() => pagina.value?.valores ?? [])
const estructura = computed(() => pagina.value?.estructura ?? [])

const historia = computed(() => pagina.value?.historia ?? [])
</script>

<template>
  <div>
    <!-- Pon la foto en public/cabeceras/ y pásala como :imagen="'/cabeceras/departamento.jpg'" -->
    <CabeceraPagina titulo="Departamento" />

    <div class="mx-auto w-full max-w-[1200px] px-5 py-10 lg:px-2.5">
      <p class="text-lg text-muted mb-10">
        {{ pagina?.intro }}
      </p>

      <section id="mision" class="scroll-mt-24">
        <UPageGrid>
          <UPageCard
            v-for="v in valores"
            :key="v.titulo"
            :title="v.titulo"
            :description="v.texto"
          />
        </UPageGrid>
      </section>

      <USeparator class="my-12" />

      <section id="historia" class="scroll-mt-24">
        <h2 class="text-[30px] font-bold text-usm-nav">{{ pagina?.tituloHistoria }}</h2>

        <!-- Cada período va con su etiqueta a la izquierda en escritorio,
             para que el texto largo no quede como un muro continuo. -->
        <div class="mt-8 space-y-10">
          <article
            v-for="h in historia"
            :key="h.periodo"
            class="grid gap-2 lg:grid-cols-[160px_1fr] lg:gap-8"
          >
            <p class="text-sm font-bold uppercase tracking-wide text-usm lg:text-right">
              {{ h.periodo }}
            </p>
            <p class="text-muted leading-relaxed">{{ h.texto }}</p>
          </article>
        </div>
      </section>

      <USeparator class="my-12" />

      <section id="estructura" class="scroll-mt-24">
        <h2 class="text-[30px] font-bold text-usm-nav">{{ pagina?.tituloEstructura }}</h2>

        <ul class="mt-8 border-t border-default">
          <li v-for="e in estructura" :key="e.cargo" class="border-b border-default">
            <NuxtLink
              :to="`/personas/${e.slug}`"
              class="group flex flex-wrap items-baseline gap-x-6 gap-y-1 py-4
                     transition-colors hover:bg-[#f5f5f5]"
            >
              <span class="w-full font-semibold text-usm-nav sm:w-[320px]">{{ e.cargo }}</span>
              <span class="text-muted group-hover:text-usm">{{ e.persona }}</span>
            </NuxtLink>
          </li>
        </ul>
      </section>

    </div>
  </div>
</template>
