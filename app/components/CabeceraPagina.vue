<script setup lang="ts">
// Cabecera de página interior, calcada de comunicaciones.usm.cl/kit-digital-usm/
// Escritorio: 370px de alto · Móvil: 195px
// El "cuadro amarillo" es en realidad el borde izquierdo del título.

const props = defineProps<{
  titulo: string
  /** Ruta de la imagen de fondo, p. ej. '/cabeceras/docencia.jpg'.
   *  Si se omite queda el gris institucional de reserva. */
  imagen?: string
  /** Sección o secciones contenedoras, para páginas que no cuelgan del menú */
  padre?: Miga | Miga[]
}>()

const route = useRoute()

const migas = computed(() => construirMigas(route.path, props.titulo, props.padre))

const estiloFondo = computed(() =>
  props.imagen
    ? {
        backgroundImage: `url('${props.imagen}')`,
        backgroundSize: 'cover',
        backgroundPosition: '50% 50%'
      }
    : undefined
)

// Degradado: opaco arriba, transparente abajo.
const degradado = 'linear-gradient(0deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.9) 100%)'
</script>

<template>
  <section class="relative h-[195px] bg-usm-nav lg:h-[370px]" :style="estiloFondo">
    <!-- Velo oscuro sobre la mitad superior, como en arquitectura.usm.cl -->
    <div class="absolute inset-x-0 top-0 h-1/2" :style="{ backgroundImage: degradado }" />

    <div class="relative flex h-full items-end pb-[30px]">
      <div class="mx-auto w-full max-w-[1200px] px-2.5">
        <h1
          class="border-l-4 border-usm-dorado pl-[1em] text-[36px] font-bold
                 leading-tight text-white [text-shadow:1px_1px_6px_#000]"
        >
          {{ titulo }}
        </h1>
      </div>
    </div>
  </section>

  <!-- Miga de pan: barra azul de 4px + la ruta completa -->
  <div class="py-[15px]">
    <div class="mx-auto w-full max-w-[1200px] px-2.5">
      <nav class="border-l-4 border-usm pl-2.5 text-sm" aria-label="Ruta de navegación">
        <template v-for="(m, i) in migas" :key="m.label + i">
          <NuxtLink v-if="m.to" :to="m.to" class="text-usm hover:underline">{{ m.label }}</NuxtLink>
          <span v-else class="font-bold text-usm-nav">{{ m.label }}</span>
          <span v-if="i < migas.length - 1" class="text-usm-nav"> » </span>
        </template>
      </nav>
    </div>
  </div>
</template>
