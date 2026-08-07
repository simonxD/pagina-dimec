<script setup lang="ts">
// Réplica del carrusel principal de informatica.usm.cl
// 500px de alto, transición por fundido (300ms), avance automático cada 10s,
// degradado oscuro desde arriba y paginación con círculos numerados.

export interface Diapositiva {
  /** Ruta de la imagen de fondo, p. ej. '/slides/laboratorio.jpg'.
   *  Si se deja vacía se muestra un fondo azul de relleno. */
  imagen: string
  titulo: string
  subtitulo: string
  /** Enlace al que lleva la diapositiva completa */
  to: string
}

const props = withDefaults(defineProps<{
  slides: Diapositiva[]
  /** Milisegundos entre diapositivas */
  intervalo?: number
}>(), {
  intervalo: 10000
})

const actual = ref(0)
let temporizador: ReturnType<typeof setInterval> | undefined

function siguiente() {
  actual.value = (actual.value + 1) % props.slides.length
}

function reiniciar() {
  if (temporizador) clearInterval(temporizador)
  // Respeta a quien haya pedido menos animación en su sistema
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  temporizador = setInterval(siguiente, props.intervalo)
}

function ir(i: number) {
  actual.value = i
  reiniciar()
}

onMounted(reiniciar)
onBeforeUnmount(() => {
  if (temporizador) clearInterval(temporizador)
})

const degradado = 'linear-gradient(0deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.9) 80%)'
</script>

<template>
  <section
    class="relative h-[500px] overflow-hidden"
    aria-roledescription="carrusel"
    aria-label="Destacados del departamento"
  >
    <div
      v-for="(s, i) in slides"
      :key="i"
      class="absolute inset-0 transition-opacity duration-300"
      :class="i === actual ? 'opacity-100' : 'pointer-events-none opacity-0'"
      :aria-hidden="i !== actual"
    >
      <!-- Fondo -->
      <div
        class="absolute inset-0 bg-cover bg-center"
        :class="!s.imagen && 'bg-usm'"
        :style="s.imagen ? { backgroundImage: `url('${s.imagen}')` } : undefined"
      />

      <!-- Degradado oscuro (arriba opaco, abajo transparente) -->
      <div class="absolute inset-0" :style="{ backgroundImage: degradado }" />

      <!-- Texto -->
      <div class="relative mx-auto flex h-full max-w-[1140px] flex-col justify-center px-[30px] lg:px-[15px]">
        <h2
          class="max-w-[525px] border-l-4 border-usm-dorado pl-[1em] text-[30px]
                 font-bold leading-tight text-white"
        >
          {{ s.titulo }}
        </h2>
        <p class="mt-2 max-w-[525px] text-[18px] font-semibold leading-snug text-white">
          {{ s.subtitulo }}
        </p>

        <!-- "Ver más": el círculo se aleja del texto al pasar el cursor,
             igual que en arquitectura.usm.cl -->
        <NuxtLink
          :to="s.to"
          class="group mt-5 inline-flex w-fit items-center text-sm font-bold text-white"
          :tabindex="i === actual ? 0 : -1"
        >
          Ver más
          <span
            class="ml-2 grid size-7 place-items-center rounded-full bg-usm-dorado text-white
                   transition-all duration-200 group-hover:ml-4 group-hover:scale-110
                   group-hover:bg-white group-hover:text-usm"
          >
            <UIcon name="i-lucide-arrow-right" class="size-3.5" />
          </span>
        </NuxtLink>
      </div>
    </div>

    <!-- Paginación numerada -->
    <div class="absolute inset-x-0 bottom-[50px] z-10">
      <div class="mx-auto flex max-w-[1140px] gap-[10px] px-[5px]">
        <button
          v-for="(s, i) in slides"
          :key="i"
          type="button"
          class="size-[26px] rounded-full bg-white/20 text-xs font-semibold transition-colors hover:bg-white/30"
          :class="i === actual ? 'text-white' : 'text-[#3b424c]'"
          :aria-label="`Ir a la diapositiva ${i + 1}: ${s.titulo}`"
          :aria-current="i === actual"
          @click="ir(i)"
        >
          {{ i + 1 }}
        </button>
      </div>
    </div>
  </section>
</template>
