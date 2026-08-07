<script setup lang="ts">
useSeoMeta({
  title: 'Postgrado',
  description:
    'Programas de postgrado del Departamento de Ingeniería Mecánica: magíster y doctorado.'
})

// Los identificadores coinciden con los enlaces del menú (app/utils/navigation.ts)
const programas = [
  {
    id: 'magister-ciencias',
    titulo: 'Magíster en Ciencias de Ingeniería Mecánica',
    descripcion:
      'Programa de carácter científico orientado a la investigación, complementario al Doctorado en Ingeniería Mecánica.'
  },
  {
    id: 'magister-energia',
    titulo: 'Magíster en Economía Energética',
    descripcion:
      'Primer programa de postgrado profesional del área energética del país, en funcionamiento desde 2005.'
  },
  {
    id: 'doctorado',
    titulo: 'Doctorado en Ingeniería Mecánica',
    descripcion:
      'En funcionamiento desde 1964. La USM fue la primera universidad de América Latina en ofrecer programas de doctorado en ingeniería.'
  }
]
</script>

<template>
  <div>
    <!-- Pon la foto en public/cabeceras/ y pásala como :imagen="'/cabeceras/postgrado.jpg'" -->
    <CabeceraPagina titulo="Postgrado" />

    <div class="mx-auto w-full max-w-[1200px] px-5 py-10 lg:px-2.5">
      <p class="text-lg text-muted mb-10">
        El Departamento imparte tres programas de continuidad de estudios, entre formación
        científica y profesional.
      </p>

      <div class="space-y-12">
        <section
          v-for="p in programas"
          :key="p.id"
          :id="p.id"
          class="scroll-mt-24"
        >
          <h2 class="text-2xl font-semibold">{{ p.titulo }}</h2>
          <p class="mt-2 text-muted">{{ p.descripcion }}</p>
        </section>
      </div>
    </div>
  </div>
</template>
