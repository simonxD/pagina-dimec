<script setup lang="ts">
// Bloque de tres tarjetas sobre fondo azul, con foto arriba y una lista de
// enlaces abajo. Inspirado en el bloque "Studying at ETH" de ethz.ch.

export interface EnlaceTarjeta {
  label: string
  to: string
}

export interface TarjetaDestacada {
  titulo: string
  descripcion: string
  /** Foto en public/, p. ej. '/destacados/pregrado.jpg'. Sin ella queda un
   *  recuadro azul oscuro de reserva. */
  imagen?: string
  enlaces: EnlaceTarjeta[]
}

withDefaults(defineProps<{
  titulo: string
  tarjetas: TarjetaDestacada[]
  /** Enlace "Ver todo" que acompaña al título, arriba a la derecha */
  verTodo?: string
  verTodoLabel?: string
}>(), {
  verTodo: undefined,
  verTodoLabel: 'Ver todo'
})
</script>

<template>
  <section class="py-14">
    <div class="mx-auto w-full max-w-[1200px] px-5 lg:px-2.5">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <h2 class="text-[30px] font-bold text-usm-nav">{{ titulo }}</h2>
        <BotonVerTodo v-if="verTodo" :to="verTodo" :label="verTodoLabel" />
      </div>

      <div class="mt-8 grid gap-6 md:grid-cols-3">
        <article
          v-for="t in tarjetas"
          :key="t.titulo"
          class="flex flex-col bg-usm p-5"
        >
          <div
            class="h-[190px] shrink-0 bg-usm-oscuro bg-cover bg-center"
            :style="t.imagen ? { backgroundImage: `url('${t.imagen}')` } : undefined"
          >
            <div v-if="!t.imagen" class="grid h-full place-items-center text-white/40">
              <UIcon name="i-lucide-image" class="size-10" />
            </div>
          </div>

          <h3 class="mt-5 text-lg font-semibold text-white">{{ t.titulo }}</h3>
          <p class="mt-2 text-sm leading-relaxed text-white/90">{{ t.descripcion }}</p>

          <ul class="mt-4 space-y-2">
            <li v-for="e in t.enlaces" :key="e.to + e.label">
              <NuxtLink
                :to="e.to"
                class="flex items-start gap-2 text-sm text-white transition-colors
                       hover:text-usm-dorado"
              >
                <UIcon
                  name="i-lucide-chevron-right"
                  class="mt-0.5 size-4 shrink-0 text-usm-dorado"
                />
                {{ e.label }}
              </NuxtLink>
            </li>
          </ul>
        </article>
      </div>
    </div>
  </section>
</template>
