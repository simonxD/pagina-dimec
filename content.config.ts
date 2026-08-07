import { defineCollection, defineContentConfig, z } from '@nuxt/content'

/**
 * Colecciones editables desde nuxt.studio.
 *
 * El esquema no es decorativo: Studio construye el formulario de edición a
 * partir de él, así que cada campo que se declare aquí aparece como un control
 * con su tipo. Lo que no esté declarado no se puede editar desde la interfaz.
 */
export default defineContentConfig({
  collections: {
    personas: defineCollection({
      type: 'page',
      source: 'personas/*.md',
      schema: z.object({
        nombre: z.string(),
        cargo: z.string(),
        categoria: z.enum(['jornada', 'parttime', 'apoyo', 'administrativos']),
        /** Orden dentro de su categoría; menor aparece primero */
        orden: z.number().default(100),
        grado: z.string().optional(),
        email: z.string().optional(),
        telefono: z.string().optional(),
        oficina: z.string().optional(),
        web: z.string().optional(),
        /** Ruta de la foto en public/personas/ */
        foto: z.string().optional(),
        /** Identificadores de app/utils/areas.ts */
        areas: z.array(z.string()).default([]),
        intereses: z.array(z.string()).default([]),
        investigaciones: z.array(z.object({
          titulo: z.string(),
          resumen: z.string(),
          url: z.string().optional()
        })).default([]),
        publicaciones: z.array(z.object({
          titulo: z.string(),
          medio: z.string(),
          anio: z.number(),
          url: z.string().optional()
        })).default([]),
        docencia: z.array(z.object({
          codigo: z.string(),
          nombre: z.string()
        })).default([]),
        enlaces: z.array(z.object({
          label: z.string(),
          url: z.string()
        })).default([])
      })
    }),

    noticias: defineCollection({
      type: 'page',
      source: 'noticias/*.md',
      schema: z.object({
        titulo: z.string(),
        fecha: z.date(),
        red: z.enum(['linkedin', 'instagram']),
        url: z.string(),
        imagen: z.string().optional()
      })
    })
  }
})
