<script setup lang="ts">
useSeoMeta({
  title: 'Personas',
  description: 'Cuerpo académico y personal del Departamento de Ingeniería Mecánica USM.'
})

// La nómina vive en content/personas/*.md y se edita desde nuxt.studio
const { data: todas } = await useAsyncData('personas', () =>
  queryCollection('personas').order('orden', 'ASC').all()
)

const activa = ref<string>('jornada')

const visibles = computed(() =>
  (todas.value ?? []).filter(p => p.categoria === activa.value)
)

// Desplegable de la versión móvil
const abierto = ref(false)
const etiquetaActiva = computed(
  () => categorias.find(c => c.id === activa.value)?.label ?? ''
)

function elegir(id: string) {
  activa.value = id
  abierto.value = false
}
</script>

<template>
  <div>
    <!-- Pon la foto en public/cabeceras/ y pásala como :imagen="'/cabeceras/personas.jpg'" -->
    <CabeceraPagina titulo="Personas" />

    <div class="mx-auto w-full max-w-[1200px] px-5 py-10 lg:px-2.5">
      <!-- Móvil: desplegable, como el menú del header -->
      <div class="mb-8 lg:hidden">
        <button
          type="button"
          class="flex w-full items-center justify-between border border-neutral-200 px-4 py-3
                 text-left text-sm font-semibold text-usm-nav"
          :aria-expanded="abierto"
          @click="abierto = !abierto"
        >
          {{ etiquetaActiva }}
          <UIcon
            name="i-lucide-chevron-down"
            class="ml-3 size-5 shrink-0 transition-transform duration-200"
            :class="abierto && 'rotate-180'"
          />
        </button>

        <ul v-show="abierto" class="border border-t-0 border-neutral-200">
          <li v-for="c in categorias" :key="c.id">
            <button
              type="button"
              class="block w-full border-l-4 px-4 py-3 text-left text-sm font-semibold
                     transition-colors"
              :class="activa === c.id
                ? 'border-usm-dorado text-usm-nav'
                : 'border-transparent text-usm-nav hover:bg-usm-oscuro hover:text-white'"
              @click="elegir(c.id)"
            >
              {{ c.label }}
            </button>
          </li>
        </ul>
      </div>

      <!-- Escritorio: barra, mismo tratamiento que el menú principal -->
      <div class="mb-8 hidden lg:block">
        <div role="tablist" aria-label="Categorías del personal" class="flex flex-wrap gap-4">
          <button
            v-for="c in categorias"
            :key="c.id"
            type="button"
            role="tab"
            :aria-selected="activa === c.id"
            class="relative whitespace-nowrap px-2 py-3 text-sm font-semibold text-usm-nav
                   after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full
                   after:bg-usm-dorado after:opacity-0 after:transition-opacity
                   after:duration-300 after:ease-[cubic-bezier(0.58,0.3,0.005,1)]
                   hover:after:opacity-100"
            :class="activa === c.id && 'after:opacity-100'"
            @click="activa = c.id"
          >
            {{ c.label }}
          </button>
        </div>
      </div>

      <!-- En escritorio la leyenda ocupa la tercera columna libre, a la derecha
           de las tarjetas. En móvil vuelve a apilarse encima. -->
      <div class="lg:flex lg:items-start lg:gap-5">
        <!-- Leyenda: solo tiene sentido donde hay áreas -->
        <div
          v-if="activa === 'jornada'"
          class="mb-10 rounded-lg border border-default p-5 lg:order-2 lg:mb-0 lg:flex-1"
        >
          <p class="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-600">
            Áreas del Departamento
          </p>
          <ul class="grid gap-x-8 gap-y-2.5 sm:grid-cols-2 lg:grid-cols-1">
            <li v-for="a in areas" :key="a.id" class="flex items-center gap-2.5 text-sm text-muted">
              <UIcon :name="a.icon" class="size-[18px] shrink-0 text-usm" />
              {{ a.nombre }}
            </li>
          </ul>
        </div>

        <!-- w-800 deja las tarjetas en 390px, como en el original -->
        <div
          role="tabpanel"
          class="grid max-w-[800px] gap-5 sm:grid-cols-2 lg:order-1 lg:w-[800px] lg:shrink-0"
        >
          <ProfesorTarjeta
            v-for="p in visibles"
            :key="p.path"
            :persona="p"
          />
        </div>
      </div>
    </div>
  </div>
</template>
