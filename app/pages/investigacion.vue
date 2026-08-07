<script setup lang="ts">
useSeoMeta({
  title: 'Investigación',
  description:
    'Áreas de investigación del Departamento de Ingeniería Mecánica USM.'
})

// Descripción de cada una de las siete áreas. Los identificadores y los
// nombres vienen de app/utils/areas.ts, que también alimenta el menú.
const descripciones: Record<string, string> = {
  termicos: 'Combustión, transferencia de calor, sistemas de generación y eficiencia energética en procesos industriales.',
  fluidos: 'Mecánica de fluidos experimental y computacional, turbomáquinas y flujos multifásicos.',
  renovables: 'Solar, eólica, geotermia, almacenamiento e integración de fuentes renovables al sistema energético.',
  produccion: 'Diseño y optimización de sistemas productivos, logística, calidad y gestión de operaciones.',
  mantenimiento: 'Confiabilidad, mantenimiento predictivo, gestión de activos y análisis de fallas.',
  mecatronica: 'Robótica, control automático, instrumentación y automatización de procesos.',
  solidos: 'Diseño de máquinas, mecánica de sólidos, fatiga, elementos finitos y análisis estructural.'
}
</script>

<template>
  <div>
    <!-- Pon la foto en public/cabeceras/ y pásala como :imagen="'/cabeceras/investigacion.jpg'" -->
    <CabeceraPagina titulo="Investigación" />

    <div class="mx-auto w-full max-w-[1200px] px-5 py-10 lg:px-2.5">
      <p class="text-lg text-muted mb-10">
        La investigación del Departamento se organiza en siete áreas, que combinan
        desarrollo teórico, simulación y trabajo experimental en laboratorio.
      </p>

      <div class="space-y-10">
        <section v-for="a in areas" :id="a.id" :key="a.id" class="scroll-mt-24">
          <h2 class="text-2xl font-semibold">{{ a.nombre }}</h2>
          <p class="mt-2 max-w-[760px] text-muted leading-relaxed">
            {{ descripciones[a.id] }}
          </p>
        </section>
      </div>
    </div>
  </div>
</template>
