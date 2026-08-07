<script setup lang="ts">
// Enlace "Ver todo" con el formato de usm.cl: círculo dorado de 28px con la
// flecha en blanco, colocado ANTES del texto, y el texto en 15px/700.
// Sobre fondo oscuro se pasa `claro`.

withDefaults(defineProps<{
  to: string
  label?: string
  /** Sobre fondos oscuros */
  claro?: boolean
}>(), {
  label: 'Ver todo',
  claro: false
})
</script>

<template>
  <NuxtLink
    :to="to"
    class="group inline-flex items-center gap-2.5 text-[15px] font-bold"
    :class="claro ? 'text-white/85' : 'text-usm-nav/80'"
  >
    <span
      class="grid size-7 shrink-0 place-items-center rounded-full bg-usm-dorado text-white
             transition-transform duration-200 group-hover:scale-110"
    >
      <UIcon name="i-lucide-arrow-right" class="size-3.5" />
    </span>
    {{ label }}
  </NuxtLink>
</template>
