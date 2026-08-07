<script setup lang="ts">
const route = useRoute()

// La ficha vive en content/personas/<slug>.md
const { data: persona } = await useAsyncData(`persona-${route.path}`, () =>
  queryCollection('personas').path(route.path).first()
)

if (!persona.value) {
  throw createError({ statusCode: 404, statusMessage: 'Persona no encontrada', fatal: true })
}

useSeoMeta({
  title: persona.value.nombre,
  description: `${persona.value.cargo} · Departamento de Ingeniería Mecánica USM`
})

const susAreas = computed(() =>
  areas.filter(a => persona.value?.areas?.includes(a.id))
)
</script>

<template>
  <div v-if="persona">
    <CabeceraPagina :titulo="persona.nombre" />

    <div class="mx-auto w-full max-w-[1200px] px-5 py-10 lg:px-2.5">
      <div class="grid gap-10 lg:grid-cols-[280px_1fr]">
        <!-- ── Columna izquierda: identidad y contacto ── -->
        <aside class="space-y-6">
          <div
            class="h-[280px] rounded-[10px] bg-usm-nav bg-cover bg-center"
            :style="persona.foto ? { backgroundImage: `url('${persona.foto}')` } : undefined"
          />

          <div>
            <p class="text-lg font-semibold text-usm-nav">{{ persona.cargo }}</p>
            <p v-if="persona.grado" class="mt-1 text-sm text-muted">{{ persona.grado }}</p>
          </div>

          <dl class="space-y-3 text-sm">
            <div v-if="persona.email">
              <dt class="text-xs font-semibold uppercase tracking-wide text-slate-600">Correo</dt>
              <dd class="mt-0.5">
                <a :href="`mailto:${persona.email}`" class="text-usm hover:underline">
                  {{ persona.email }}
                </a>
              </dd>
            </div>
            <div v-if="persona.telefono">
              <dt class="text-xs font-semibold uppercase tracking-wide text-slate-600">Teléfono</dt>
              <dd class="mt-0.5 text-muted">{{ persona.telefono }}</dd>
            </div>
            <div v-if="persona.oficina">
              <dt class="text-xs font-semibold uppercase tracking-wide text-slate-600">Oficina</dt>
              <dd class="mt-0.5 text-muted">{{ persona.oficina }}</dd>
            </div>
            <div v-if="persona.web">
              <dt class="text-xs font-semibold uppercase tracking-wide text-slate-600">Sitio web</dt>
              <dd class="mt-0.5">
                <a :href="persona.web" target="_blank" class="break-all text-usm hover:underline">
                  {{ persona.web.replace(/^https?:\/\//, '') }}
                </a>
              </dd>
            </div>
          </dl>

          <div v-if="persona.enlaces?.length" class="flex flex-wrap gap-2">
            <a
              v-for="e in persona.enlaces"
              :key="e.url"
              :href="e.url"
              target="_blank"
              class="rounded border border-default px-3 py-1.5 text-sm text-usm
                     transition-colors hover:bg-usm hover:text-white"
            >
              {{ e.label }}
            </a>
          </div>

          <div v-if="susAreas.length">
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-600">
              Áreas del Departamento
            </p>
            <ul class="mt-3 space-y-2">
              <li v-for="a in susAreas" :key="a.id" class="flex items-center gap-2.5 text-sm text-muted">
                <UIcon :name="a.icon" class="size-[18px] shrink-0 text-usm" />
                {{ a.nombre }}
              </li>
            </ul>
          </div>
        </aside>

        <!-- ── Columna derecha: contenido ── -->
        <div class="space-y-12">
          <section v-if="persona.body">
            <h2 class="text-2xl font-semibold">Acerca de</h2>
            <div class="mt-4 space-y-4 text-muted leading-relaxed [&_p]:mb-4">
              <ContentRenderer :value="persona" />
            </div>
          </section>

          <section v-if="persona.intereses?.length">
            <h2 class="text-2xl font-semibold">Intereses de investigación</h2>
            <ul class="mt-4 flex flex-wrap gap-2">
              <li
                v-for="i in persona.intereses"
                :key="i"
                class="rounded-full bg-[#f5f5f5] px-3 py-1.5 text-sm text-usm-nav"
              >
                {{ i }}
              </li>
            </ul>
          </section>

          <section v-if="persona.investigaciones?.length">
            <h2 class="text-2xl font-semibold">Investigaciones destacadas</h2>
            <div class="mt-4 grid gap-5 sm:grid-cols-2">
              <article
                v-for="inv in persona.investigaciones"
                :key="inv.titulo"
                class="rounded-lg border border-default p-5"
              >
                <h3 class="font-semibold text-usm-nav">{{ inv.titulo }}</h3>
                <p class="mt-2 text-sm text-muted leading-relaxed">{{ inv.resumen }}</p>
                <a
                  v-if="inv.url"
                  :href="inv.url"
                  target="_blank"
                  class="mt-3 inline-block text-sm font-semibold text-usm hover:underline"
                >
                  Ver detalle
                </a>
              </article>
            </div>
          </section>

          <section v-if="persona.publicaciones?.length">
            <h2 class="text-2xl font-semibold">Publicaciones recientes</h2>
            <ul class="mt-4 border-t border-default">
              <li
                v-for="p in persona.publicaciones"
                :key="p.titulo + p.anio"
                class="flex gap-5 border-b border-default py-4"
              >
                <span class="w-12 shrink-0 text-sm font-bold text-usm">{{ p.anio }}</span>
                <span class="text-sm">
                  <span class="text-usm-nav">{{ p.titulo }}</span>
                  <span class="text-muted"> · {{ p.medio }}</span>
                </span>
              </li>
            </ul>
          </section>

          <section v-if="persona.docencia?.length">
            <h2 class="text-2xl font-semibold">Docencia</h2>
            <ul class="mt-4 border-t border-default">
              <li
                v-for="d in persona.docencia"
                :key="d.codigo"
                class="flex gap-5 border-b border-default py-4 text-sm"
              >
                <span class="w-20 shrink-0 font-bold text-usm">{{ d.codigo }}</span>
                <span class="text-usm-nav">{{ d.nombre }}</span>
              </li>
            </ul>
          </section>

          <NuxtLink to="/personas" class="inline-flex items-center gap-2 text-sm font-semibold text-usm hover:underline">
            <UIcon name="i-lucide-arrow-left" class="size-4" />
            Volver a Personas
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
