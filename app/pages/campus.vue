<script setup lang="ts">
useSeoMeta({
  title: 'Campus y sedes',
  description:
    'Campus donde el Departamento de Ingeniería Mecánica USM imparte sus programas.'
})

// El contenido vive en content/paginas/campus.yml y se edita desde /_studio.
const { data: pagina } = await useAsyncData('pagina-campus', () =>
  queryCollection('campus').first()
)

const campus = computed(() => pagina.value?.campus ?? [])
</script>

<template>
  <div>
    <!-- Pon la foto en public/cabeceras/ y pásala como :imagen="'/cabeceras/campus.jpg'" -->
    <CabeceraPagina titulo="Campus y sedes" :padre="{ label: 'Estudios', to: '/estudios' }" />

    <div class="mx-auto w-full max-w-[1200px] px-5 py-10 lg:px-2.5">
      <p class="text-lg text-muted mb-10">
        {{ pagina?.intro }}
      </p>

      <div class="grid gap-5 md:grid-cols-2">
        <div v-for="c in campus" :key="c.nombre" class="rounded-lg border border-default p-6">
          <h2 class="text-xl font-semibold text-usm-nav">{{ c.nombre }}</h2>
          <p class="mt-3 text-sm leading-relaxed text-muted">{{ c.detalle }}</p>

          <dl class="mt-5 space-y-3 text-sm">
            <div>
              <dt class="text-xs font-semibold uppercase tracking-wide text-slate-600">Dirección</dt>
              <dd class="mt-0.5 text-muted">{{ c.direccion }}</dd>
            </div>
            <div>
              <dt class="text-xs font-semibold uppercase tracking-wide text-slate-600">Teléfono</dt>
              <dd class="mt-0.5 text-muted">{{ c.telefono }}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  </div>
</template>
