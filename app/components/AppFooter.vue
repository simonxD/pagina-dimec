<script setup lang="ts">
// Réplica del pie de comunicaciones.usm.cl
// Escritorio (≥1024px): 4 columnas de 280px + sello; abajo logo y redes
// Móvil (<1024px):      una sola columna; imágenes y redes centradas

const columnas = [
  {
    grupos: [
      {
        titulo: 'Universidad',
        enlaces: [
          { label: 'Nuestra Historia', to: 'https://usm.cl/universidad/historia/' },
          { label: 'Federico Santa María', to: 'https://usm.cl/universidad/federico-santa-maria/biografia/' },
          { label: 'Definiciones Estratégicas', to: 'https://usm.cl/universidad/plan-estrategico/' },
          { label: 'Modelo Educativo', to: 'https://usm.cl/universidad/modelo-educativo/contexto/' },
          { label: 'Organización', to: 'https://usm.cl/universidad/rectoria/' }
        ]
      },
      {
        titulo: 'Campus y sedes',
        enlaces: [
          { label: 'Información Campus y Sedes', to: 'https://usm.cl/universidad/campus-y-sedes/' },
          { label: 'Tour Virtual', to: 'https://tour360.usm.cl/' }
        ]
      }
    ],
    extra: { label: 'Política de Privacidad', to: 'https://gobiernodedatos.usm.cl/politica-de-privacidad/' }
  },
  {
    grupos: [
      {
        titulo: 'Extensión y cultura',
        enlaces: [
          { label: 'Dirección de Comunicaciones Estratégicas y Extensión Cultural', to: 'https://comunicaciones.usm.cl/' },
          { label: 'Dirección General de Vinculación con el Medio', to: 'https://vinculacion.usm.cl/' },
          { label: 'Dirección de Asuntos Internacionales', to: 'https://oai.usm.cl/' },
          { label: 'Alumni', to: 'https://www.exalumnos.usm.cl/' },
          { label: 'Noticias', to: 'https://usm.cl/noticias' },
          { label: 'Eventos', to: 'https://usm.cl/eventos' },
          { label: 'Radio USM', to: 'https://radio.usm.cl/' },
          { label: 'Cultura USM', to: 'https://cultura.usm.cl/' }
        ]
      }
    ]
  },
  {
    grupos: [
      {
        titulo: 'Servicios',
        enlaces: [
          { label: 'Aula USM', to: 'https://aula.usm.cl/' },
          { label: 'Biblioteca', to: 'https://biblioteca.usm.cl/' },
          { label: 'Portal de Autoservicio Institucional', to: 'https://ssb.usm.cl' },
          { label: 'Dirección de Tecnologías de la Información', to: 'https://dti.usm.cl/' },
          { label: 'Sistema de Información de Gestión Académica', to: 'https://siga.usm.cl/pag/' },
          { label: 'Sistema Integrado de Información Argos ERP', to: 'https://argos-erp.usm.cl/' },
          { label: 'Sistema de Remuneraciones Históricas', to: 'https://srh.usm.cl/' },
          { label: 'Directorio USM', to: 'https://directorio.usm.cl/' },
          { label: 'Trabaja con nosotros', to: 'https://usm.rexmas.com/jobs/universidad-tecnica-federico-santa-maria' }
        ]
      }
    ]
  }
]

// Datos de contacto del Departamento, tomados de mecanica.usm.cl
const contacto = [
  {
    bloques: [
      { titulo: 'Fono Campus Casa Central Valparaíso', icon: 'i-lucide-phone', valor: '+56 32 2654 162', href: 'tel:+56322654162' },
      { titulo: 'Fono Campus San Joaquín', icon: 'i-lucide-phone', valor: '+56 2 2303 72 50', href: 'tel:+560223037250' }
    ]
  },
  {
    bloques: [
      { titulo: 'Dirección Campus Casa Central Valparaíso', icon: 'i-lucide-map-pin', valor: 'Avda. España 1680, Valparaíso' },
      { titulo: 'Dirección Campus San Joaquín', icon: 'i-lucide-map-pin', valor: 'Av. Vicuña Mackenna 3939, San Joaquín, Santiago' }
    ]
  },
  {
    bloques: [
      { titulo: 'E-mail', icon: 'i-lucide-mail', valor: 'sec.mec@usm.cl', href: 'mailto:sec.mec@usm.cl' }
    ]
  }
]

const redes = [
  { icon: 'i-simple-icons-facebook', label: 'Facebook', to: 'https://www.facebook.com/usantamaria' },
  { icon: 'i-simple-icons-x', label: 'X', to: 'https://twitter.com/usantamaria' },
  { icon: 'i-simple-icons-youtube', label: 'YouTube', to: 'https://www.youtube.com/channel/UCr5rEvayXIC0YnJxDAWuWtQ' },
  { icon: 'i-simple-icons-instagram', label: 'Instagram', to: 'https://www.instagram.com/usantamaria/' },
  { icon: 'i-simple-icons-linkedin', label: 'LinkedIn', to: 'https://www.linkedin.com/school/usantamaria/' }
]

// Los archivos viven en public/logos/, así que la ruta empieza por /logos/
// (sin "public"). Cada logo enlaza a la institución que representa.
// `w`/`h` son las dimensiones reales del archivo. Van en los atributos width y
// height de la etiqueta para que el navegador reserve el hueco antes de que la
// imagen cargue; el tamaño en pantalla lo sigue mandando el CSS.
const aliados = [
  { nombre: 'Acceso Educación Superior', src: '/logos/logo_acceso.svg', url: 'https://acceso.mineduc.cl/', w: 320, h: 120 },
  { nombre: 'Consejo de Rectores', src: '/logos/logo_consejorectores.svg', url: 'https://www.consejoderectores.cl/', w: 80, h: 80 },
  { nombre: 'Red G9', src: '/logos/logo_g9-1.svg', url: 'https://redg9.cl/', w: 240, h: 150 },
  { nombre: 'Agrupación de Universidades Regionales', src: '/logos/logo_aur.svg', url: 'https://www.auregionales.cl/', w: 116, h: 80 },
  { nombre: 'Consejo de Rectores de Valparaíso', src: '/logos/logo_cruv.svg', url: 'https://consejoderectoresvalparaiso.cl/', w: 300, h: 144 },
  { nombre: 'REUNA', src: '/logos/logo_reuna.svg', url: 'https://www.reuna.cl/', w: 136, h: 80 },
  { nombre: 'Universia', src: '/logos/logo_universia.svg', url: 'https://www.universia.net/cl/home.html', w: 160, h: 80 }
]

const sello = {
  src: '/logos/sello-acreditacion.svg',
  url: 'https://acreditacion.usm.cl/',
  w: 81,
  h: 150
}

const usmLogo = {
  src: '/logos/usm_cl.svg',
  url: 'https://www.usm.cl',
  w: 300,
  h: 126
}
</script>

<template>
  <footer>
    <!-- ══════════ CONTACTO DEL DEPARTAMENTO ══════════
         Tipografía calcada de mecanica.usm.cl: título 20px/700 negro,
         etiquetas 14px/600 negro y valores 14px/400 en #3b424c. -->
    <div class="bg-[#e7e7e7]">
      <div class="mx-auto max-w-[1200px] px-5 py-12 lg:px-2.5">
        <div class="grid gap-x-6 gap-y-9 lg:grid-cols-4">
          <h3 class="text-[20px] font-bold leading-tight text-black">
            Departamento de Ingeniería Mecánica USM
          </h3>

          <div v-for="(col, i) in contacto" :key="i" class="space-y-[38px]">
            <div v-for="b in col.bloques" :key="b.titulo">
              <p class="mb-[5px] text-sm font-semibold leading-[21px] text-black">
                {{ b.titulo }}
              </p>
              <p class="flex items-start gap-2 text-sm leading-[21px] text-usm-nav">
                <UIcon :name="b.icon" class="mt-[3px] size-3.5 shrink-0" />
                <a v-if="b.href" :href="b.href" class="hover:underline">{{ b.valor }}</a>
                <span v-else>{{ b.valor }}</span>
              </p>
            </div>
          </div>
        </div>

        <p class="mt-10 text-center text-sm leading-[21px] text-usm-nav">
          DIMEC-UTFSM uses
          <a href="https://www.simio.com" target="_blank" class="font-bold text-black hover:underline">Simio simulation</a>
          software under a grant from Simio LLC
          <a href="https://www.simio.com" target="_blank" class="font-bold text-black hover:underline">www.simio.com</a>
        </p>
      </div>
    </div>

    <!-- ══════════ ZONA AZUL ══════════ -->
    <div class="bg-usm text-white">
      <div class="mx-auto max-w-[1200px] px-5 py-8 lg:px-2.5">
        <div class="grid gap-5 lg:grid-cols-4">
          <!-- Columnas de enlaces -->
          <div v-for="(col, i) in columnas" :key="i">
            <div v-for="(grupo, j) in col.grupos" :key="grupo.titulo" :class="j > 0 && 'mt-[30px]'">
              <!-- h3, no h4: las páginas llegan como mucho a h2, y saltar
                   un nivel rompe el orden de encabezados -->
              <h3 class="text-lg font-semibold uppercase">{{ grupo.titulo }}</h3>
              <ul class="mt-[14px]">
                <!-- La barrita dorada es el ::before del <li>, para que cubra
                     todo el alto del enlace aunque ocupe dos líneas. -->
                <li
                  v-for="e in grupo.enlaces"
                  :key="e.label"
                  class="group relative mb-1 leading-[20px]
                         before:absolute before:left-[-10px] before:top-0 before:h-full
                         before:w-[4px] before:bg-usm-dorado before:opacity-0
                         before:transition-opacity before:duration-300
                         hover:before:opacity-100"
                >
                  <a
                    :href="e.to"
                    target="_blank"
                    class="text-sm transition-colors duration-300 group-hover:text-usm-dorado"
                  >{{ e.label }}</a>
                </li>
              </ul>
            </div>

            <a
              v-if="col.extra"
              :href="col.extra.to"
              target="_blank"
              class="relative mt-6 inline-block text-sm transition-colors duration-300
                     before:absolute before:left-[-10px] before:top-0 before:h-full
                     before:w-[4px] before:bg-usm-dorado before:opacity-0
                     before:transition-opacity before:duration-300
                     hover:text-usm-dorado hover:before:opacity-100"
            >
              {{ col.extra.label }}
            </a>
          </div>

          <!-- Sello de acreditación: 200px de ancho, alto proporcional (371px) -->
          <div class="flex justify-center lg:justify-end">
            <a :href="sello.url" target="_blank" class="transition-opacity hover:opacity-80">
              <img
                :src="sello.src"
                alt="Universidad acreditada — ver detalle de la acreditación institucional"
                :width="sello.w"
                :height="sello.h"
                class="w-[200px] h-auto"
              >
            </a>
          </div>
        </div>

        <!-- Fila inferior: logo + redes -->
        <div class="mt-8 grid items-center gap-8 lg:grid-cols-3">
          <div class="flex justify-center lg:justify-start">
            <a :href="usmLogo.url" target="_blank" class="transition-opacity hover:opacity-80">
              <img
                :src="usmLogo.src"
                alt="usm.cl — sitio institucional"
                :width="usmLogo.w"
                :height="usmLogo.h"
                class="w-[180px] h-auto"
              >
            </a>
          </div>

          <div class="flex justify-center gap-[10px]">
            <a
              v-for="r in redes"
              :key="r.label"
              :href="r.to"
              target="_blank"
              :aria-label="r.label"
              class="grid size-10 place-items-center rounded-full bg-white text-usm transition-opacity hover:opacity-75"
            >
              <UIcon :name="r.icon" class="size-5" />
            </a>
          </div>

          <div class="hidden lg:block" />
        </div>
      </div>
    </div>

    <!-- ══════════ BANDA GRIS DE LOGOS ══════════ -->
    <div class="bg-usm-banda">
      <div class="mx-auto max-w-[1200px] px-5 py-10 lg:px-2.5">
        <!-- En móvil se desplaza en horizontal, como el carrusel del original -->
        <div class="flex items-center gap-10 overflow-x-auto lg:justify-between lg:gap-5 lg:overflow-visible">
          <a
            v-for="a in aliados"
            :key="a.nombre"
            :href="a.url"
            target="_blank"
            class="shrink-0 transition-opacity hover:opacity-80"
          >
            <img :src="a.src" :alt="a.nombre" :width="a.w" :height="a.h" class="h-[60px] w-auto">
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>
