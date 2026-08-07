<script setup lang="ts">
// Carrusel de publicaciones de LinkedIn.
// Los datos viven en app/utils/publicaciones.ts

const pista = ref<HTMLElement | null>(null)
const alInicio = ref(true)
const alFinal = ref(false)

function revisarBordes() {
  const el = pista.value
  if (!el) return
  alInicio.value = el.scrollLeft <= 4
  alFinal.value = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4
}

function desplazar(direccion: 1 | -1) {
  const el = pista.value
  if (!el) return
  // Avanza una tarjeta completa (ancho de la primera + separación)
  const tarjeta = el.querySelector('li')
  const paso = tarjeta ? tarjeta.getBoundingClientRect().width + 20 : el.clientWidth
  el.scrollBy({ left: paso * direccion, behavior: 'smooth' })
}

onMounted(() => {
  revisarBordes()
  pista.value?.addEventListener('scroll', revisarBordes, { passive: true })
  window.addEventListener('resize', revisarBordes, { passive: true })
})

onBeforeUnmount(() => {
  pista.value?.removeEventListener('scroll', revisarBordes)
  window.removeEventListener('resize', revisarBordes)
})

const formatoFecha = new Intl.DateTimeFormat('es-CL', {
  day: 'numeric',
  month: 'long',
  year: 'numeric'
})

const fechaLegible = (iso: string) => formatoFecha.format(new Date(`${iso}T12:00:00`))
</script>

<template>
  <section class="py-14">
    <div class="mx-auto w-full max-w-[1200px] px-5 lg:px-2.5">
      <!-- Encabezado -->
      <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 class="text-[30px] font-bold text-usm-nav">Noticias</h2>
          <p class="mt-1 text-sm text-muted">Novedades del Departamento en sus redes</p>
        </div>

        <div class="flex items-center gap-2">
          <BotonVerTodo :to="PERFILES.linkedin.url" label="Ver todo" class="mr-2" />

          <button
            type="button"
            aria-label="Publicaciones anteriores"
            :disabled="alInicio"
            class="grid size-10 place-items-center rounded-full border border-default text-usm-nav
                   transition-colors hover:bg-usm hover:text-white disabled:opacity-30
                   disabled:hover:bg-transparent disabled:hover:text-usm-nav"
            @click="desplazar(-1)"
          >
            <UIcon name="i-lucide-chevron-left" class="size-5" />
          </button>

          <button
            type="button"
            aria-label="Publicaciones siguientes"
            :disabled="alFinal"
            class="grid size-10 place-items-center rounded-full border border-default text-usm-nav
                   transition-colors hover:bg-usm hover:text-white disabled:opacity-30
                   disabled:hover:bg-transparent disabled:hover:text-usm-nav"
            @click="desplazar(1)"
          >
            <UIcon name="i-lucide-chevron-right" class="size-5" />
          </button>
        </div>
      </div>

      <!-- Pista -->
      <ul
        ref="pista"
        class="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2
               [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <li
          v-for="p in publicaciones"
          :key="p.url + p.fecha"
          class="w-[280px] shrink-0 snap-start sm:w-[360px] lg:w-[380px]"
        >
          <a
            :href="p.url"
            target="_blank"
            class="group flex h-full flex-col overflow-hidden rounded-[10px] border border-default
                   transition-shadow hover:shadow-[0_0_10px_0_rgba(0,0,0,0.25)]"
          >
            <!-- Imagen (o reserva azul si no hay) -->
            <div
              class="h-[200px] bg-usm bg-cover bg-center"
              :style="p.imagen ? { backgroundImage: `url('${p.imagen}')` } : undefined"
            >
              <div
                v-if="!p.imagen"
                class="grid h-full place-items-center text-white/70"
              >
                <UIcon :name="PERFILES[p.red].icon" class="size-10" />
              </div>
            </div>

            <div class="flex flex-1 flex-col p-5">
              <!-- slate-600: 7,4:1 sobre blanco. `text-dimmed` se quedaba en 2,6:1 -->
              <p class="text-xs uppercase tracking-wide text-slate-600">
                {{ fechaLegible(p.fecha) }}
              </p>
              <p class="mt-2 line-clamp-4 text-sm text-usm-nav">
                {{ p.texto }}
              </p>
              <span
                class="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-usm
                       group-hover:underline"
              >
                Ver en {{ PERFILES[p.red].nombre }}
                <UIcon name="i-lucide-arrow-up-right" class="size-4" />
              </span>
            </div>
          </a>
        </li>
      </ul>
    </div>
  </section>
</template>
