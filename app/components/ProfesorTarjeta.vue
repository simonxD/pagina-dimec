<script setup lang="ts">
// Tarjeta de persona. La capa azul sube al pasar el cursor y muestra el
// contacto y un "Ver más". Toda la tarjeta es un enlace, así que en móvil
// basta con tocarla: no hace falta acertar en el botón.

// El item viene de la colección `personas` de @nuxt/content
const props = defineProps<{ persona: Record<string, any> }>()

const tieneFoto = computed(() => Boolean(props.persona.foto))
const tieneAreas = computed(() => Boolean(props.persona.areas?.length))

const estiloFoto = computed(() =>
  props.persona.foto
    ? { backgroundImage: `url('${props.persona.foto}')` }
    : undefined
)

// Degradado del original: negro abajo, transparente al 90% de su alto.
const degradado = 'linear-gradient(0deg, rgb(0,0,0) 0px, rgba(0,0,0,0) 90%)'
</script>

<template>
  <NuxtLink
    :to="persona.path"
    class="group relative block h-[260px] overflow-hidden rounded-[10px] bg-usm-nav bg-cover
           bg-center shadow-[0_0_10px_0_rgba(0,0,0,0.4)]"
    :style="estiloFoto"
  >
    <!-- El degradado solo hace falta si hay foto debajo -->
    <div
      v-if="tieneFoto"
      class="absolute inset-x-0 bottom-0 h-[60%]"
      :style="{ backgroundImage: degradado }"
    />

    <!-- Cara frontal: nombre y cargo abajo -->
    <div
      class="absolute inset-0 z-[2] flex flex-col justify-end p-5"
      :class="tieneAreas && 'pb-[62px]'"
    >
      <h2 class="border-l-[3px] border-usm-dorado pl-[1em] text-[18px] font-semibold text-white">
        {{ persona.nombre }}
      </h2>
      <p class="mt-1 text-sm text-white">{{ persona.cargo }}</p>
    </div>

    <!-- Capa azul que sube desde abajo al pasar el cursor -->
    <div
      class="absolute inset-x-0 top-full z-10 h-full bg-[rgba(0,94,144,0.95)] p-5
             opacity-0 transition-[top,opacity] duration-300 ease-in-out
             flex flex-col justify-end
             group-hover:top-0 group-hover:opacity-100
             group-focus-visible:top-0 group-focus-visible:opacity-100"
      :class="tieneAreas && 'pb-[62px]'"
    >
      <!-- Repite el nombre y el cargo solo para la vista: se ocultan a los
           lectores de pantalla para no anunciarlos dos veces por tarjeta. -->
      <div aria-hidden="true">
        <p class="border-l-[3px] border-usm-dorado pl-[1em] text-[18px] font-semibold text-white">
          {{ persona.nombre }}
        </p>
        <p class="mt-1 text-sm font-bold text-white">{{ persona.cargo }}</p>
      </div>

      <p v-if="persona.email || persona.telefono" class="mt-1 text-xs text-white">
        <span v-if="persona.email">{{ persona.email }}</span>
        <br v-if="persona.email && persona.telefono">
        <span v-if="persona.telefono">Fono: {{ persona.telefono }}</span>
      </p>

      <!-- No es un enlace propio: toda la tarjeta ya lo es -->
      <span class="mt-3 inline-flex items-center gap-2 text-[15px] font-bold text-white/90">
        <span class="grid size-7 shrink-0 place-items-center rounded-full bg-usm-dorado text-white">
          <UIcon name="i-lucide-arrow-right" class="size-3.5" />
        </span>
        Ver más
      </span>
    </div>

    <!-- Áreas: solo jornada completa. Siempre por encima de la capa azul. -->
    <ul
      v-if="tieneAreas"
      class="absolute inset-x-0 bottom-0 z-20 flex items-center gap-3 px-5 pb-4"
    >
      <li v-for="a in areas" :key="a.id">
        <UTooltip :text="a.nombre" :delay-duration="0">
          <span
            class="block transition duration-200 hover:scale-125"
            :class="persona.areas?.includes(a.id) ? 'text-white' : 'text-white/25'"
            :aria-label="a.nombre"
          >
            <UIcon :name="a.icon" class="size-[18px]" />
          </span>
        </UTooltip>
      </li>
    </ul>
  </NuxtLink>
</template>
