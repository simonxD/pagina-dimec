export type Red = 'linkedin' | 'instagram'

/**
 * Las publicaciones viven en content/noticias/*.md y se editan desde
 * nuxt.studio. Aquí solo quedan los perfiles de cada red, que son
 * configuración del sitio y no contenido editable.
 */
export const PERFILES: Record<Red, { nombre: string; url: string; icon: string }> = {
  linkedin: {
    nombre: 'LinkedIn',
    url: 'https://www.linkedin.com/school/mecanicausm/',
    icon: 'i-simple-icons-linkedin'
  },
  instagram: {
    nombre: 'Instagram',
    // TODO: sustituir por el perfil real del Departamento
    url: 'https://www.instagram.com/',
    icon: 'i-simple-icons-instagram'
  }
}
