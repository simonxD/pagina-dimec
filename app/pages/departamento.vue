<script setup lang="ts">
useSeoMeta({
  title: 'Departamento',
  description:
    'Historia, misión y estructura del Departamento de Ingeniería Mecánica USM.'
})

const valores = [
  {
    title: 'Misión',
  },
  {
    title: 'Visión',
  },
  {
    title: 'Vinculación con el medio',
  }
]

// Cargos del Departamento. Reemplaza los nombres por los reales; el `slug`
// enlaza con la ficha de esa persona en /personas.
const estructura = [
  { cargo: 'Dirección del Departamento', persona: 'Nombre Apellido', slug: 'nombre-apellido-1' },
  { cargo: 'Subdirección académica', persona: 'Nombre Apellido', slug: 'nombre-apellido-2' },
  { cargo: 'Jefatura de Carrera de Pregrado', persona: 'Nombre Apellido', slug: 'nombre-apellido-3' },
  { cargo: 'Jefatura de Programas de Postgrado', persona: 'Nombre Apellido', slug: 'nombre-apellido-4' },
  { cargo: 'Secretaría del Departamento', persona: 'Nombre Apellido', slug: 'admin-1' }
]

// Texto tomado de mecanica.usm.cl/quienes-somos/
const historia = [
  {
    periodo: '1932 – 1939',
    texto: 'La historia del Departamento de Ingeniería Mecánica USM comienza el 15 de mayo de 1932, fecha en la cual comienza a funcionar la Escuela de Artes y Oficios. La infraestructura se centraba en el Pabellón de Talleres (actual Edificio C del Campus Casa Central - Valparaíso), con un extenso taller mecánico equipado con las más modernas máquinas-herramientas de su tiempo, una templadora y una gran máquina de ensayo de materiales. En 1934 se inicia la construcción del Laboratorio de Máquinas. Junto con esto inicia su funcionamiento la Escuela de Ingeniería, y en 1937, los alumnos de esta Escuela tuvieron la posibilidad de obtener el título de Ingeniero Mecánico en el recién inaugurado Colegio de Ingenieros. Fue en 1939 cuando egresaron los primeros cuatro ingenieros mecánicos con el sello tecnológico de la USM. Ellos fueron los primeros Ingenieros Mecánicos titulados en Chile.'
  },
  {
    periodo: 'Década de 1960',
    texto: 'A inicios de la década de 1960 existió un notorio impulso a la investigación tecnológica lo cual llevó a la creación de una Escuela de Graduados en la USM, con el propósito de ofrecer los Grados de Magíster y Doctor en Ingeniería, donde una de las especialidades fue Ingeniería Mecánica. De este modo, La USM fue la primera universidad en América Latina en ofrecer programas de doctorado en ingeniería. El doctorado en Ingeniería Mecánica comenzó a funcionar en 1964.'
  },
  {
    periodo: 'Década de 1970',
    texto: 'En 1970 se inició además el Magíster en Ingeniería Mecánica, que vino a complementar, a nivel de master, al programa de Doctorado en Ingeniería Mecánica. Al mismo tiempo la USM celebró convenios de colaboración académica con la Universidad de Pittsburgh en Estados Unidos y la Universidad Técnica de Aachen de Alemania, para poner en marcha un plan de perfeccionamiento académico de profesores. Durante esa década y la siguiente se desarrollaron significativos avances para el Departamento en términos de equipamiento, implementación e infraestructura de laboratorios, adquiriéndose una importante cantidad de maquinarias, equipos e instrumental para los diversos laboratorios.'
  },
  {
    periodo: 'Década de 1990',
    texto: 'A principios de la década de 1990 se gestó la idea del Centro Integrado de Manufactura y Automatización (CIMA), como un centro de incorporación de tecnologías de manufactura avanzada en la formación de pregrado y la realización de investigación. En 1998 el Departamento empieza a impartir, adicionalmente a Ingeniería Civil Mecánica, la carrera de Ingeniería Mecánica Industrial, la cual, con una duración de diez semestres, remplazó a la tradicional Ingeniería de Ejecución Mecánica, que el Departamento había ofrecido hasta entonces.'
  },
  {
    periodo: '2005 – 2009',
    texto: 'En 2005 inició su funcionamiento el Programa de Magíster de Economía Energética (MEE), primer programa de postgrado profesional del área energética en el país. Durante 2007 el Departamento comienza además una reestructuración y reformulación de su postgrado científico. En el marco de este proceso se inician las acreditaciones de estos programas de postgrado ante la CNA. Por otra parte, a partir del año 2009 se abre la carrera de Ingeniería Civil Mecánica en el Campus Santiago San Joaquín. De este modo, el Departamento extendió su quehacer a Santiago.'
  },
  {
    periodo: '2016 – 2017',
    texto: 'En 2016 comenzó la implementación en ambos campus de un plan de estudios de Ingeniería Civil Mecánica actualizado, basado en un diseño curricular con enfoque en competencias. En 2017 la carrera de Ingeniería Civil Mecánica obtuvo su más reciente acreditación, por el máximo de 7 años, siendo esta su tercera acreditación consecutiva desde que se inició el proceso de acreditación de carreras en Chile.'
  }
]
</script>

<template>
  <div>
    <!-- Pon la foto en public/cabeceras/ y pásala como :imagen="'/cabeceras/departamento.jpg'" -->
    <CabeceraPagina titulo="Departamento" />

    <div class="mx-auto w-full max-w-[1200px] px-5 py-10 lg:px-2.5">
      <p class="text-lg text-muted mb-10">
        El Departamento de Ingeniería Mecánica reúne la docencia, la investigación
        y la extensión en las áreas de diseño, energía, materiales y manufactura.
      </p>

      <section id="mision" class="scroll-mt-24">
        <UPageGrid>
          <UPageCard
            v-for="v in valores"
            :key="v.title"
            :title="v.title"
          />
        </UPageGrid>
      </section>

      <USeparator class="my-12" />

      <section id="historia" class="scroll-mt-24">
        <h2 class="text-[30px] font-bold text-usm-nav">Nuestra Historia</h2>

        <!-- Cada período va con su etiqueta a la izquierda en escritorio,
             para que el texto largo no quede como un muro continuo. -->
        <div class="mt-8 space-y-10">
          <article
            v-for="h in historia"
            :key="h.periodo"
            class="grid gap-2 lg:grid-cols-[160px_1fr] lg:gap-8"
          >
            <p class="text-sm font-bold uppercase tracking-wide text-usm lg:text-right">
              {{ h.periodo }}
            </p>
            <p class="text-muted leading-relaxed">{{ h.texto }}</p>
          </article>
        </div>
      </section>

      <USeparator class="my-12" />

      <section id="estructura" class="scroll-mt-24">
        <h2 class="text-[30px] font-bold text-usm-nav">Estructura</h2>

        <ul class="mt-8 border-t border-default">
          <li v-for="e in estructura" :key="e.cargo" class="border-b border-default">
            <NuxtLink
              :to="`/personas/${e.slug}`"
              class="group flex flex-wrap items-baseline gap-x-6 gap-y-1 py-4
                     transition-colors hover:bg-[#f5f5f5]"
            >
              <span class="w-full font-semibold text-usm-nav sm:w-[320px]">{{ e.cargo }}</span>
              <span class="text-muted group-hover:text-usm">{{ e.persona }}</span>
            </NuxtLink>
          </li>
        </ul>
      </section>

    </div>
  </div>
</template>
