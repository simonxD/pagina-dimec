export type Red = 'linkedin' | 'instagram'

export interface Publicacion {
  /** Red de la que proviene: cambia el icono y el texto del enlace */
  red: Red
  /** Enlace a la publicación concreta */
  url: string
  /** Fecha en formato ISO: '2026-07-28' */
  fecha: string
  /** Texto de la publicación (o un extracto). Se recorta a 4 líneas. */
  texto: string
  /** Imagen: déjala en public/publicaciones/ */
  imagen?: string
}

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

/**
 * Publicaciones destacadas de las redes del Departamento.
 *
 * Ni LinkedIn ni Instagram exponen un feed público: leerlos sin credenciales
 * devuelve un muro de autenticación. Por eso esta lista se mantiene a mano.
 * Para añadir una: copia el enlace de la publicación, pega el texto y guarda
 * la imagen en public/publicaciones/.
 *
 * El orden de la lista es el orden en que aparecen: la más reciente primero.
 */
export const publicaciones: Publicacion[] = [
  {
    red: 'linkedin',
    url: PERFILES.linkedin.url,
    fecha: '2026-07-28',
    texto: '',
    imagen: ''
  },
  {
    red: 'instagram',
    url: PERFILES.instagram.url,
    fecha: '2026-07-15',
    texto: '',
    imagen: ''
  },
  {
    red: 'linkedin',
    url: PERFILES.linkedin.url,
    fecha: '2026-07-02',
    texto: '',
    imagen: ''
  },
  {
    red: 'instagram',
    url: PERFILES.instagram.url,
    fecha: '2026-06-20',
    texto: '',
    imagen: ''
  }
]
