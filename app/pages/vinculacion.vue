<script setup lang="ts">
useSeoMeta({
  title: 'Vinculación',
  description:
    'Vinculación con el medio del Departamento de Ingeniería Mecánica USM: industria, alumni, visitas, donaciones y servicios a externos.'
})

// El contenido vive en content/paginas/vinculacion.yml y se edita desde /_studio.
const { data: pagina } = await useAsyncData('pagina-vinculacion', () =>
  queryCollection('vinculacion').first()
)

const secciones = computed(() => pagina.value?.secciones ?? [])
</script>

<template>
  <div>
    <!-- Pon la foto en public/cabeceras/ y pásala como :imagen="'/cabeceras/vinculacion.jpg'" -->
    <CabeceraPagina titulo="Vinculación" />

    <div class="mx-auto w-full max-w-[1200px] px-5 py-10 lg:px-2.5">
      <p class="text-lg text-muted mb-10">
        {{ pagina?.intro }}
      </p>

      <div class="grid gap-5 md:grid-cols-2">
        <section
          v-for="s in secciones"
          :id="s.id"
          :key="s.id"
          class="flex scroll-mt-24 flex-col rounded-lg border border-default p-6"
        >
          <h2 class="text-xl font-semibold text-usm-nav">{{ s.titulo }}</h2>
          <p class="mt-2 flex-1 text-sm leading-relaxed text-muted">{{ s.texto }}</p>

          <a
            v-if="s.enlace.externo"
            :href="s.enlace.to"
            target="_blank"
            class="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-usm hover:underline"
          >
            {{ s.enlace.label }}
            <UIcon name="i-lucide-arrow-up-right" class="size-4" />
          </a>
          <NuxtLink
            v-else
            :to="s.enlace.to"
            class="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-usm hover:underline"
          >
            {{ s.enlace.label }}
            <UIcon name="i-lucide-arrow-right" class="size-4" />
          </NuxtLink>
        </section>
      </div>
    </div>
  </div>
</template>
