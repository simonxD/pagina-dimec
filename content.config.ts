import { defineCollection, defineContentConfig, z } from '@nuxt/content'
import { fileURLToPath } from 'node:url'
import { readdirSync, readFileSync, statSync } from 'node:fs'

/**
 * Intereses que ya usan otras personas del Departamento.
 *
 * Se leen de las fichas existentes en cada compilacion y se muestran como ayuda
 * del campo. No es un autocompletado -Studio solo admite textarea, media e icon
 * como tipos de control, y activar el selector con busqueda exigiria reescribir
 * el renderizador de campos dentro de su codigo minificado- pero resuelve el
 * problema de fondo: que cada cual escriba "Energia solar", "energia solar" y
 * "Solar termica" para la misma cosa. Teniendo la lista delante se copia el
 * termino que ya existe.
 */
function interesesEnUso(): string[] {
  const raiz = fileURLToPath(new URL('content/personas', import.meta.url))
  const encontrados = new Set<string>()

  const recorrer = (dir: string) => {
    for (const entrada of readdirSync(dir)) {
      const ruta = `${dir}/${entrada}`
      if (statSync(ruta).isDirectory()) { recorrer(ruta); continue }
      if (!/\.(yml|yaml)$/.test(entrada)) continue
      const texto = readFileSync(ruta, 'utf8')
      // Lista YAML en linea: intereses: ['A', 'B']
      const enLinea = texto.match(/^intereses:\s*\[(.*)\]/m)?.[1]
      if (enLinea) {
        for (const t of enLinea.split(',')) {
          const v = t.trim().replace(/^['"]|['"]$/g, '')
          if (v) encontrados.add(v)
        }
      }
      // Lista YAML por bloques
      const bloque = texto.match(/^intereses:\s*\n((?:\s*-\s*.*\n?)+)/m)?.[1]
      if (bloque) {
        for (const l of bloque.split('\n')) {
          const v = l.replace(/^\s*-\s*/, '').trim().replace(/^['"]|['"]$/g, '')
          if (v) encontrados.add(v)
        }
      }
    }
  }

  try { recorrer(raiz) } catch { /* sin fichas todavia */ }
  return [...encontrados].sort((a, b) => a.localeCompare(b, 'es'))
}

const interesesConocidos = interesesEnUso()

/**
 * Colecciones de contenido del sitio.
 *
 * Hay dos grupos, y la diferencia importa:
 *
 *  - Lo que vive en `content/` lo gestiona nuxt-studio: aparece en el editor y
 *    se puede cambiar desde el navegador.
 *  - Lo que vive en `datos/` queda fuera del editor a proposito, porque lo va a
 *    escribir un proceso automatico y editarlo a mano solo generaria conflictos.
 *
 * ── Sobre los esquemas ──
 *
 * No son decorativos: Studio construye el formulario de edicion a partir de
 * ellos. Cada campo declarado aparece como un control, y lo que no este
 * declarado no se puede editar.
 *
 * Se usa `.editor()` en lugar de `.describe()` porque permite tres cosas que
 * cambian por completo como se ve el formulario:
 *
 *   label        el nombre visible del campo. Sin el, Studio muestra la clave
 *                del esquema tal cual ("areasFormacion", "tituloHistoria"),
 *                que no significa nada para quien mantiene el contenido.
 *   description  texto de ayuda debajo del campo.
 *   input        el tipo de control. 'textarea' es imprescindible en cualquier
 *                campo de mas de una frase: el control por defecto es una linea
 *                unica que corta el texto visualmente sin avisar de nada.
 *
 * Los tipos de control que Studio reconoce son 'textarea', 'media' e 'icon'.
 * No hay un control de texto enriquecido para campos: negritas, listas y
 * encabezados solo existen en el cuerpo markdown de las colecciones `page`.
 */

/** Texto de varias frases. Se repite mucho, y siempre necesita area multilinea. */
const parrafo = (label: string, description?: string) =>
  z.string().editor({ input: 'textarea', label, ...(description ? { description } : {}) })

/** Texto de una linea. */
const linea = (label: string, description?: string) =>
  z.string().editor({ label, ...(description ? { description } : {}) })

/** Enlace reutilizable. Se repite en varias paginas. */
const enlace = z.object({
  label: linea('Texto del botón', 'Lo que se lee. Ejemplo: Ver oportunidades'),
  to: linea('Dirección', 'Interna como /contacto, o externa completa con https://'),
  externo: z.boolean().default(false)
    .editor({ label: '¿Sale del sitio?', description: 'Marcar si lleva a otra web: se abrirá en una pestaña nueva' })
})

export default defineContentConfig({
  collections: {
    // ─────────────────────────────────────────────────────────────────────
    // Personas. Un fichero por persona.
    //
    // Esa division por fichero no es casual: cuando se anadan permisos por
    // usuario, dar acceso a un profesor a su propia ficha se reduce a acotarlo
    // a su fichero. Si todas vivieran en un unico YAML no habria forma de
    // separar quien puede tocar que.
    //
    // Es `data` y no `page`: una coleccion `page` arrastra title, description,
    // seo, navigation, body y extension, y Studio los muestra todos. Eso
    // obligaba a escribir el nombre tres veces y enseñaba un bloque SEO que no
    // significa nada para quien no es tecnico. El SEO se genera igual, desde
    // app/pages/personas/[slug].vue.
    // ─────────────────────────────────────────────────────────────────────
    personas: defineCollection({
      type: 'data',
      // Se aceptan las tres extensiones de datos porque el desplegable de
      // formato de Studio no distingue por coleccion. Si solo valiera .yml,
      // elegir otra crearia un fichero que el sitio ignora en silencio.
      // Una subcarpeta por categoria. La carpeta ES la clasificacion: crear una
      // ficha dentro de `parttime` la deja clasificada como profesor part-time
      // sin que haya que rellenar ningun campo, y no existe la posibilidad de
      // que carpeta y campo se contradigan.
      source: 'personas/**/*.{yml,yaml,json}',
      schema: z.object({
        nombre: linea('Nombre', 'Nombre y apellidos, tal como deben verse en la web'),

        // Los campos obligatorios llevan valor por defecto para que una ficha
        // recien creada aparezca enseguida, con textos evidentes de completar.
        // Es preferible a que desaparezca: Nuxt Content descarta en silencio lo
        // que no cumple el esquema, sin error ni aviso.
        cargo: z.string().default('Cargo por completar')
          .editor({ label: 'Cargo', description: 'Ejemplo: Profesora asociada' }),
        orden: z.number()
          .editor({
            label: 'Orden en el listado',
            description: 'Posición dentro de su pestaña en Personas. El 1 aparece primero, luego el 2, y así. Si dos personas repiten número, quedan en orden arbitrario.'
          })
          .default(100),

        grado: z.string().editor({ label: 'Grado académico', description: 'Ejemplo: Doctora en Ingeniería Mecánica' }).optional(),
        email: z.string().editor({ label: 'Correo' }).optional(),
        telefono: z.string().editor({ label: 'Teléfono' }).optional(),
        oficina: z.string().editor({ label: 'Oficina', description: 'Ejemplo: Edificio C, oficina 210' }).optional(),
        web: z.string().editor({ label: 'Página personal', description: 'Dirección completa, con https://' }).optional(),
        foto: z.string().editor({ input: 'media', label: 'Fotografía', description: 'Se guarda en public/personas/' }).optional(),

        areas: z.array(z.string())
          .editor({ label: 'Áreas del Departamento', description: 'Identificadores de app/utils/areas.ts. Ejemplo: termicos' })
          .default([]),
        intereses: z.array(z.string())
          .editor({
            label: 'Intereses',
            description: interesesConocidos.length
              ? `Uno por elemento. Si alguno coincide con los que ya se usan, cópialo tal cual para que agrupen: ${interesesConocidos.join(' · ')}`
              : 'Uno por elemento. Ejemplo: Combustión'
          })
          .default([]),

        investigaciones: z.array(z.object({
          titulo: linea('Título'),
          resumen: parrafo('Resumen', 'Una o dos frases sobre el objetivo y el estado'),
          url: z.string().optional().editor({ label: 'Enlace' })
        })).editor({ label: 'Investigaciones destacadas' }).default([]),

        // Una sola lista de publicaciones, con una casilla para destacar.
        //
        // Se descarto tener dos listas separadas: obligaria a escribir la misma
        // publicacion dos veces para que apareciera en ambos sitios, o a moverla
        // de lista a mano. Con la casilla, la web las reparte sola.
        publicaciones: z.array(z.object({
          titulo: linea('Título'),
          medio: linea('Publicado en', 'Revista, congreso o editorial'),
          anio: z.number().editor({ label: 'Año' }),
          url: z.string().optional().editor({ label: 'Enlace' }),
          destacada: z.boolean().default(false).editor({
            label: '¿Destacada?',
            description: 'Marcada, aparece arriba en "Publicaciones destacadas". Sin marcar, solo en el listado completo'
          })
        })).editor({ label: 'Publicaciones' }).default([]),

        docencia: z.array(z.object({
          codigo: linea('Código', 'Ejemplo: IWM101'),
          nombre: linea('Asignatura')
        })).editor({ label: 'Docencia' }).default([]),

        resena: z.string().default('')
          .editor({
            input: 'textarea',
            label: 'Acerca de',
            description: 'Deja una línea en blanco entre párrafos'
          })
      })
    }),

    // ─────────────────────────────────────────────────────────────────────
    // Noticias. Fuera de content/ y por tanto fuera del editor: las alimentara
    // un proceso automatico desde las redes sociales. Sin etiquetas de editor
    // porque nadie las va a editar a mano.
    // ─────────────────────────────────────────────────────────────────────
    noticias: defineCollection({
      type: 'page',
      source: {
        include: '**/*.md',
        prefix: '/noticias',
        cwd: fileURLToPath(new URL('datos/noticias', import.meta.url))
      },
      schema: z.object({
        titulo: z.string(),
        fecha: z.date(),
        red: z.enum(['linkedin', 'instagram']),
        url: z.string(),
        imagen: z.string().optional()
      })
    }),

    // ─────────────────────────────────────────────────────────────────────
    // Paginas. Una coleccion por pagina, con los campos que esa pagina usa.
    //
    // Con una coleccion generica de "secciones" el formulario seria una lista
    // de cajas llamadas `seccion` y `elemento`, sin relacion visible con la
    // web. Separandolas, el menu del editor es un espejo del sitio.
    //
    // Inicio no esta aqui: se dejo fuera de la edicion a peticion expresa.
    // ─────────────────────────────────────────────────────────────────────
    departamento: defineCollection({
      type: 'data',
      source: 'paginas/departamento.yml',
      schema: z.object({
        intro: parrafo('Texto de entrada', 'Párrafo que abre la página, debajo del título'),
        valores: z.array(z.object({
          titulo: linea('Título de la tarjeta', 'Misión, Visión...'),
          texto: parrafo('Contenido')
        })).default([]).editor({ label: 'Misión, visión y vinculación' }),
        tituloHistoria: linea('Título de la sección de historia').default('Nuestra Historia'),
        historia: z.array(z.object({
          periodo: linea('Periodo', 'Ejemplo: 1932 – 1939'),
          texto: parrafo('Qué pasó', 'Relato del periodo. Puede ocupar varios párrafos')
        })).default([]).editor({ label: 'Historia del Departamento' }),
        tituloEstructura: linea('Título de la sección de estructura').default('Estructura'),
        estructura: z.array(z.object({
          cargo: linea('Cargo'),
          persona: linea('Quién lo ocupa'),
          slug: linea('Ficha en Personas', 'Nombre del archivo de esa persona, sin extensión')
        })).default([]).editor({ label: 'Estructura del Departamento' })
      })
    }),

    estudios: defineCollection({
      type: 'data',
      source: 'paginas/estudios.yml',
      schema: z.object({
        intro: parrafo('Texto de entrada').default(''),
        programas: z.array(z.object({
          titulo: linea('Título'),
          descripcion: parrafo('Descripción'),
          to: linea('Página a la que lleva', 'Ejemplo: /pregrado')
        })).default([]).editor({ label: 'Tipos de programa' })
      })
    }),

    pregrado: defineCollection({
      type: 'data',
      source: 'paginas/pregrado.yml',
      schema: z.object({
        intro: parrafo('Texto de entrada').default(''),
        areasFormacion: z.array(z.object({
          titulo: linea('Área'),
          descripcion: parrafo('Qué se estudia en ella')
        })).default([]).editor({ label: 'Áreas de formación' }),
        campus: z.array(z.object({
          nombre: linea('Campus'),
          detalle: linea('Dirección')
        })).default([]).editor({ label: 'Dónde se imparte' })
      })
    }),

    postgrado: defineCollection({
      type: 'data',
      source: 'paginas/postgrado.yml',
      schema: z.object({
        intro: parrafo('Texto de entrada').default(''),
        programas: z.array(z.object({
          id: linea('Identificador', 'Para enlazar desde el menú. Sin espacios ni tildes'),
          titulo: linea('Nombre del programa'),
          descripcion: parrafo('Descripción')
        })).default([]).editor({ label: 'Programas' })
      })
    }),

    educacionContinua: defineCollection({
      type: 'data',
      source: 'paginas/educacion-continua.yml',
      schema: z.object({
        intro: parrafo('Texto de entrada').default(''),
        modalidades: z.array(z.object({
          titulo: linea('Modalidad'),
          descripcion: parrafo('En qué consiste')
        })).default([]).editor({ label: 'Modalidades' })
      })
    }),

    asignaturas: defineCollection({
      type: 'data',
      source: 'paginas/asignaturas.yml',
      schema: z.object({
        intro: parrafo('Texto de entrada').default(''),
        asignaturas: z.array(z.object({
          codigo: linea('Código', 'Ejemplo: IWM101'),
          nombre: linea('Nombre'),
          nivel: z.enum(['Pregrado', 'Postgrado']).editor({ label: 'Nivel' }),
          creditos: z.number().editor({ label: 'Créditos' })
        })).default([]).editor({ label: 'Catálogo de asignaturas' })
      })
    }),

    investigacion: defineCollection({
      type: 'data',
      source: 'paginas/investigacion.yml',
      schema: z.object({
        intro: parrafo('Texto de entrada').default(''),
        // El identificador de cada area lo fija app/utils/areas.ts porque las
        // fichas de personas apuntan a el. Aqui solo se edita su descripcion:
        // cambiar un identificador desde el editor romperia esas referencias.
        descripciones: z.array(z.object({
          area: z.enum(['termicos', 'fluidos', 'renovables', 'produccion',
                        'mantenimiento', 'mecatronica', 'solidos'])
            .editor({ label: 'Área' }),
          texto: parrafo('Descripción', 'Aparece bajo el nombre del área')
        })).default([]).editor({ label: 'Áreas de investigación' })
      })
    }),

    laboratorios: defineCollection({
      type: 'data',
      source: 'paginas/laboratorios.yml',
      schema: z.object({
        intro: parrafo('Texto de entrada').default(''),
        laboratorios: z.array(z.object({
          nombre: linea('Nombre'),
          detalle: linea('Ubicación', 'Campus donde está')
        })).default([]).editor({ label: 'Laboratorios' })
      })
    }),

    campus: defineCollection({
      type: 'data',
      source: 'paginas/campus.yml',
      schema: z.object({
        intro: parrafo('Texto de entrada').default(''),
        campus: z.array(z.object({
          nombre: linea('Nombre'),
          direccion: linea('Dirección'),
          telefono: linea('Teléfono').default(''),
          detalle: parrafo('Qué hay en este campus')
        })).default([]).editor({ label: 'Campus' })
      })
    }),

    oportunidades: defineCollection({
      type: 'data',
      source: 'paginas/oportunidades.yml',
      schema: z.object({
        intro: parrafo('Texto de entrada').default(''),
        sectores: z.array(z.object({
          titulo: linea('Sector', 'Ejemplo: Energía'),
          descripcion: parrafo('Qué se hace en él')
        })).default([]).editor({ label: 'Sectores' })
      })
    }),

    sitiosEstudiantiles: defineCollection({
      type: 'data',
      source: 'paginas/sitios-estudiantiles.yml',
      schema: z.object({
        intro: parrafo('Texto de entrada').default(''),
        sitios: z.array(z.object({
          nombre: linea('Nombre'),
          descripcion: parrafo('Para qué sirve'),
          url: linea('Dirección', 'Completa, con https://')
        })).default([]).editor({ label: 'Plataformas' })
      })
    }),

    vinculacion: defineCollection({
      type: 'data',
      source: 'paginas/vinculacion.yml',
      schema: z.object({
        intro: parrafo('Texto de entrada').default(''),
        secciones: z.array(z.object({
          id: linea('Identificador', 'Para enlazar desde el menú. Sin espacios ni tildes'),
          titulo: linea('Título'),
          texto: parrafo('Contenido'),
          enlace: enlace.editor({ label: 'Botón' })
        })).default([]).editor({ label: 'Secciones' })
      })
    }),

    contacto: defineCollection({
      type: 'data',
      source: 'paginas/contacto.yml',
      schema: z.object({
        intro: parrafo('Texto de entrada').default(''),
        tituloDatos: linea('Título del recuadro lateral').default('Datos de contacto'),
        datos: z.array(z.object({
          label: linea('Qué es', 'Ejemplo: Dirección, Teléfono'),
          valor: linea('Valor'),
          icon: z.string().default('i-lucide-info')
            .editor({ input: 'icon', label: 'Icono', iconLibraries: ['lucide'] })
        })).default([]).editor({ label: 'Datos de contacto' })
      })
    })
  }
})
