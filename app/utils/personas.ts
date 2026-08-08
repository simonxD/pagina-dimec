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

/**
 * Dirección de la ficha de una persona a partir de su fichero.
 *
 * Las colecciones de tipo `data` no generan `path` automáticamente como hacían
 * las de tipo `page`, así que la ruta se construye aquí desde el nombre del
 * fichero (`stem`), que es lo que identifica a cada persona.
 *
 * Se quitan las tildes: el editor puede llamar al fichero "simón-ramos.yml" y
 * eso produciría una dirección con caracteres que hay que codificar, fea de
 * copiar y de compartir.
 */
export function slugPersona(stem: string | undefined): string {
  return String(stem ?? '').split('/').pop()!
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
}

export function rutaPersona(persona: { stem?: string }): string {
  return `/personas/${slugPersona(persona.stem)}`
}
