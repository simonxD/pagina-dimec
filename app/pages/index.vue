<script setup lang="ts">
import type { TarjetaDestacada } from '~/components/TarjetasDestacadas.vue'

useSeoMeta({
  title: 'Inicio',
  description:
    'Departamento de Ingeniería Mecánica USM: docencia de pregrado y postgrado, investigación aplicada y vinculación con la industria.'
})

// Deja las fotos en public/slides/ y rellena `imagen`.
// Con `imagen` vacía se ve un fondo azul de relleno.
const diapositivas = [
  {
    imagen: '',
    titulo: 'Ingeniería Civil Mecánica',
    subtitulo: 'Formación de excelencia en diseño, energía y manufactura',
    to: '/pregrado'
  },
  {
    imagen: '',
    titulo: 'Conoce nuestros programas de postgrado',
    subtitulo: 'Magíster y Doctorado en Ingeniería Mecánica',
    to: '/postgrado'
  },
  {
    imagen: '',
    titulo: 'Investigación aplicada',
    subtitulo: 'Siete líneas de trabajo y laboratorios equipados',
    to: '/investigacion'
  },
  {
    imagen: '',
    titulo: 'Vinculación con la industria',
    subtitulo: 'Proyectos, ensayos y asesorías técnicas',
    to: '/vinculacion'
  }
]

// Fotos en public/destacados/; sin ellas queda un recuadro azul de reserva.
const estudiar: TarjetaDestacada[] = [
  {
    titulo: 'Programas de estudio',
    descripcion: 'Descubre qué programa se ajusta mejor a lo que buscas.',
    imagen: '',
    enlaces: [
      { label: 'Ingeniería Civil Mecánica', to: '/pregrado' },
      { label: 'Magíster y Doctorado', to: '/postgrado' },
      { label: 'Educación continua', to: '/educacion-continua' }
    ]
  },
  {
    titulo: 'Comenzar tus estudios',
    descripcion: '¿Tienes dudas? Aquí encuentras lo necesario para dar el primer paso.',
    imagen: '',
    enlaces: [
      { label: 'Oportunidades de carreras', to: '/oportunidades' },
      { label: 'Campus y sedes', to: '/campus' },
      { label: 'Contacto y admisión', to: '/contacto' }
    ]
  },
  {
    titulo: 'Para estudiantes',
    descripcion: 'Recursos y personas del Departamento durante tu paso por la carrera.',
    imagen: '',
    enlaces: [
      { label: 'Sitios estudiantiles', to: '/sitios-estudiantiles' },
      { label: 'Asignaturas', to: '/asignaturas' },
      { label: 'Vinculación', to: '/vinculacion' }
    ]
  }
]

const ejes = [
  {
    title: 'Docencia',
    to: '/pregrado'
  },
  {
    title: 'Investigación',
    to: '/investigacion'
  },
  {
    title: 'Personas',
    to: '/personas'
  }
]

const cifras = [
  { valor: '—', etiqueta: 'Estudiantes de pregrado' },
  { valor: '—', etiqueta: 'Académicos de jornada' },
  { valor: '—', etiqueta: 'Laboratorios' },
  { valor: '—', etiqueta: 'Publicaciones al año' }
]
</script>

<template>
  <div>
    <!-- La portada no tenía h1: los títulos del carrusel son h2 y cambian solos,
         así que el encabezado principal va oculto a la vista pero presente para
         buscadores y lectores de pantalla. -->
    <h1 class="sr-only">DIMEC — Departamento de Ingeniería Mecánica</h1>

    <HeroCarrusel :slides="diapositivas" />

    <!-- 1 · Noticias -->
    <PostsCarrusel />

    <!-- 2 · Estudiar en el DIMEC -->
    <TarjetasDestacadas
      titulo="Estudia mecánica"
      :tarjetas="estudiar"
    />

    <!-- 3 · Acerca del Departamento -->
    <section class="bg-[#f5f5f5] py-14">
      <div class="mx-auto w-full max-w-[1200px] px-5 lg:px-2.5">
        <div class="flex flex-wrap items-end justify-between gap-4">
          <h2 class="text-[30px] font-bold text-usm-nav">Acerca del Departamento</h2>
          <BotonVerTodo to="/departamento" label="Conoce el Departamento" />
        </div>
        <p class="mt-4 max-w-[760px] text-muted leading-relaxed">
          El Departamento de Ingeniería Mecánica de la Universidad Técnica Federico Santa
          María es el departamento académico más grande de Chile en su especialidad. Su
          historia arranca en 1932 y hoy reúne docencia de pregrado y postgrado,
          investigación aplicada y vinculación con la industria en dos campus.
        </p>

        <UPageGrid class="mt-8">
          <UPageCard
            v-for="e in ejes"
            :key="e.title"
            :title="e.title"
            :to="e.to"
          />
        </UPageGrid>

        <div class="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div
            v-for="c in cifras"
            :key="c.etiqueta"
            class="rounded-lg border border-default bg-white p-5 text-center"
          >
            <p class="text-4xl font-bold text-usm">{{ c.valor }}</p>
            <p class="mt-2 text-sm text-muted">{{ c.etiqueta }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
