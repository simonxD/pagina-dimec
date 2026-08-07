<script setup lang="ts">
// Réplica del header de comunicaciones.usm.cl
// Escritorio (≥1024px): barra azul 40px + barra blanca 100px = 140px
// Móvil (<1024px):      solo barra blanca 100px + menú desplegable

const abierto = ref(false)
const route = useRoute()

// Cierra el desplegable al navegar
watch(() => route.fullPath, () => {
  abierto.value = false
})

// Chips de la barra azul, con el formato de informatica.usm.cl:
// 11px/700 en blanco, relleno 4x8, esquinas de 2px, celeste #0EADD8 para los
// enlaces de servicio y dorado #E5B300 para el destacado.
const botones = [
  {
    // TODO: apuntar al portal interno real del Departamento
    label: 'Sitios Internos',
    to: '#',
    externo: true,
    clase: 'bg-[#0eadd8] hover:brightness-95'
  },
  {
    label: 'Contacto',
    to: '/contacto',
    externo: false,
    clase: 'bg-[#0eadd8] hover:brightness-95'
  },
  {
    label: 'Admisión',
    to: 'https://admision.usm.cl/',
    externo: true,
    clase: 'bg-usm-dorado hover:brightness-95'
  }
]

const redes = [
  { icon: 'i-simple-icons-facebook', label: 'Facebook', to: 'https://www.facebook.com/usantamaria' },
  { icon: 'i-simple-icons-x', label: 'X', to: 'https://twitter.com/usantamaria' },
  { icon: 'i-simple-icons-youtube', label: 'YouTube', to: 'https://www.youtube.com/channel/UCr5rEvayXIC0YnJxDAWuWtQ' },
  { icon: 'i-simple-icons-instagram', label: 'Instagram', to: 'https://www.instagram.com/usantamaria/' },
  { icon: 'i-simple-icons-linkedin', label: 'LinkedIn', to: 'https://www.linkedin.com/school/usantamaria/' }
]

// La barra azul se pliega al bajar y vuelve al llegar arriba del todo.
// El margen de 4px evita parpadeos con el rebote de los trackpads.
const plegada = ref(false)

function alDesplazar() {
  plegada.value = window.scrollY > 4
}

onMounted(() => {
  alDesplazar()
  window.addEventListener('scroll', alDesplazar, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', alDesplazar)
})
</script>

<template>
  <header class="fixed inset-x-0 top-0 z-50">
    <!-- ─── Barra azul superior (oculta bajo 1024px, se pliega al bajar) ─── -->
    <div
      class="hidden overflow-hidden bg-usm transition-[height] duration-300
             motion-reduce:transition-none lg:block"
      :class="plegada ? 'h-0' : 'h-10'"
      :aria-hidden="plegada"
    >
      <div class="mx-auto flex h-10 max-w-[1200px] items-center justify-between px-5 lg:px-2.5">
        <a
          href="https://usm.cl"
          target="_blank"
          class="relative inline-block text-[11px] font-bold leading-5 text-white
                 after:absolute after:-bottom-px after:left-0 after:h-[2px] after:w-full
                 after:bg-usm-dorado after:opacity-0 after:transition-opacity
                 after:duration-300 after:ease-[cubic-bezier(0.58,0.3,0.005,1)]
                 hover:after:opacity-100"
        >
          USM.cl
        </a>

        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2.5">
            <template v-for="b in botones" :key="b.label">
              <a
                v-if="b.externo"
                :href="b.to"
                target="_blank"
                class="rounded-[2px] px-2 py-1 text-[11px] font-bold leading-[11px] text-white transition-all"
                :class="b.clase"
              >
                {{ b.label }}
              </a>
              <NuxtLink
                v-else
                :to="b.to"
                class="rounded-[2px] px-2 py-1 text-[11px] font-bold leading-[11px] text-white transition-all"
                :class="b.clase"
              >
                {{ b.label }}
              </NuxtLink>
            </template>
          </div>

          <div class="flex items-center gap-[5px]">
            <a
              v-for="r in redes"
              :key="r.label"
              :href="r.to"
              target="_blank"
              :aria-label="r.label"
              class="grid size-5 place-items-center rounded-full bg-white text-usm transition-opacity hover:opacity-75"
            >
              <UIcon :name="r.icon" class="size-2.5" />
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- ─── Barra blanca principal ─── -->
    <div class="bg-white">
      <div class="mx-auto flex h-[100px] max-w-[1200px] items-center justify-between px-5 lg:px-2.5">
        <NuxtLink to="/" class="shrink-0">
          <!-- El logotipo es apaisado (1801x276), más que el del original.
               Se iguala el ANCHO del original (376 / 250 px) en vez del alto:
               así ocupa el mismo espacio horizontal en la barra. -->
          <img
            src="/logos/dimec.png"
            alt="DIMEC — Departamento de Ingeniería Mecánica"
            width="1801"
            height="276"
            class="h-auto w-[250px] lg:w-[376px]"
          >
        </NuxtLink>

        <!-- Menú horizontal (escritorio) -->
        <nav class="hidden items-center gap-3 lg:flex">
          <!-- El submenú se abre al pasar el cursor y con el tabulador.
               Se usa :focus-visible (no :focus-within) porque un clic de ratón
               también deja el foco puesto, y el menú se quedaba abierto al
               retirar el cursor. :focus-visible solo se activa con el teclado. -->
          <div v-for="l in navigationLinks" :key="l.label" class="group relative">
            <NuxtLink
              :to="l.to"
              class="relative flex items-center gap-1 px-2 py-3 text-sm font-semibold text-usm-nav
                     after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full
                     after:bg-usm-dorado after:opacity-0 after:transition-opacity
                     after:duration-300 after:ease-[cubic-bezier(0.58,0.3,0.005,1)]
                     group-hover:after:opacity-100
                     group-[:has(:focus-visible)]:after:opacity-100"
              active-class="after:opacity-100"
            >
              {{ l.label }}
              <UIcon
                v-if="l.hijos"
                name="i-lucide-chevron-down"
                class="size-3.5 transition-transform duration-200 group-hover:rotate-180"
              />
            </NuxtLink>

            <div
              v-if="l.hijos"
              class="invisible absolute left-0 top-full z-10 w-[280px] -translate-y-1 border-t-2
                     border-usm-dorado bg-white opacity-0 shadow-lg transition-all duration-200
                     group-hover:visible group-hover:translate-y-0 group-hover:opacity-100
                     group-[:has(:focus-visible)]:visible
                     group-[:has(:focus-visible)]:translate-y-0
                     group-[:has(:focus-visible)]:opacity-100"
            >
              <NuxtLink
                v-for="h in l.hijos"
                :key="h.to"
                :to="h.to"
                class="block px-4 py-3 text-sm text-usm-nav transition-colors
                       hover:bg-usm-oscuro hover:text-white"
              >
                {{ h.label }}
              </NuxtLink>
            </div>
          </div>
        </nav>

        <!-- Hamburguesa (móvil) -->
        <button
          type="button"
          class="grid size-[38px] place-items-center text-[#494c4f] lg:hidden"
          :aria-expanded="abierto"
          aria-label="Menú"
          @click="abierto = !abierto"
        >
          <UIcon :name="abierto ? 'i-lucide-x' : 'i-lucide-menu'" class="size-[25px]" />
        </button>
      </div>
    </div>

    <!-- ─── Desplegable móvil ─── -->
    <div
      v-show="abierto"
      class="max-h-[calc(100vh-100px)] overflow-y-auto border-t border-neutral-200
             bg-white shadow-lg lg:hidden"
    >
      <div v-for="l in navigationLinks" :key="l.label" class="border-b border-neutral-100">
        <NuxtLink
          :to="l.to"
          class="block px-5 py-4 text-sm font-semibold text-usm-nav transition-colors
                 duration-300 hover:bg-usm-oscuro hover:text-white"
          active-class="text-usm"
        >
          {{ l.label }}
        </NuxtLink>

        <!-- Los hijos se muestran siempre, sangrados: en móvil un submenú que
             además hay que desplegar añade un toque de más por cada nivel. -->
        <NuxtLink
          v-for="h in l.hijos"
          :key="h.to"
          :to="h.to"
          class="block border-t border-neutral-100 bg-neutral-50 py-3 pl-9 pr-5 text-sm
                 text-usm-nav transition-colors hover:bg-usm-oscuro hover:text-white"
        >
          {{ h.label }}
        </NuxtLink>
      </div>
    </div>
  </header>
</template>
