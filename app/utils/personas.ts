/**
 * La nómina vive ahora en content/personas/*.md y se edita desde nuxt.studio.
 * El esquema de cada ficha está en content.config.ts.
 *
 * Aquí solo quedan las categorías, que son estructura del sitio y no contenido
 * editable: cambiarlas implica tocar también el esquema de la colección.
 */
export const categorias = [
  { id: 'jornada', label: 'Profesores Jornada Completa' },
  { id: 'parttime', label: 'Profesores Part-time' },
  { id: 'apoyo', label: 'Apoyos Académicos y Auxiliares de Laboratorio' },
  { id: 'administrativos', label: 'Administrativos' }
] as const
