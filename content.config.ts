import { defineCollection, defineContentConfig, z } from '@nuxt/content'
import { fileURLToPath } from 'node:url'

/**
 * Colecciones de contenido del sitio.
 *
 * Hay dos grupos, y la diferencia importa:
 *
 *  - Lo que vive en `content/` lo gestiona nuxt-studio: aparece en el editor de
 *    /_studio y se puede cambiar desde el navegador.
 *  - Lo que vive en `datos/` queda fuera del editor a proposito, porque lo va a
 *    escribir un proceso automatico y editarlo a mano solo generaria conflictos.
 *
 * Sobre los esquemas: no son decorativos. Studio construye el formulario de
 * edicion a partir de ellos, asi que cada campo declarado aparece como un
 * control con su tipo, y lo que no este declarado no se puede editar. Por eso
 * se usan colecciones de tipo `data` (YAML) para las paginas: producen un
 * formulario con campos con nombre, en vez de un editor de texto libre donde
 * alguien sin experiencia tecnica se pierde.
 *
 * Los .describe() se convierten en el texto de ayuda de cada campo dentro del
 * formulario. Merece la pena escribirlos pensando en quien va a editar.
 */

/** Enlace reutilizable. Se repite en varias paginas. */
const enlace = z.object({
  label: z.string().describe('Texto visible del enlace'),
  to: z.string().describe('Direccion. Interna como /contacto, o externa completa con https://'),
  externo: z.boolean().default(false).describe('Marcar si lleva fuera del sitio: se abre en otra pestana')
})

export default defineContentConfig({
  collections: {
    // ─────────────────────────────────────────────────────────────────────
    // Personas. Un fichero por persona, en content/personas/.
    //
    // Esa division por fichero no es casual: cuando se anadan permisos por
    // usuario, dar acceso a un profesor a su propia ficha se reduce a acotarlo
    // a su fichero. Si todas las personas vivieran en un unico YAML no habria
    // forma de separar quien puede tocar que.
    // ─────────────────────────────────────────────────────────────────────
    personas: defineCollection({
      // `data` y no `page`. La diferencia decide como se ve el editor.
      //
      // Una coleccion `page` arrastra un esquema propio de Nuxt Content con
      // title, description, seo, navigation, body, extension y path, y Studio
      // los muestra todos. En la practica eso obligaba a escribir el nombre de
      // la persona tres veces (Title, Title de SEO y el campo propio), mostraba
      // un bloque SEO que no significa nada para quien no es tecnico, abria un
      // editor de markdown aparte para el cuerpo, y al crear una ficha preguntaba
      // si se queria en md, yaml, json, csv o xml.
      //
      // Con `data` no se hereda nada: el formulario tiene exactamente los campos
      // de aqui abajo, y el fichero es siempre .yml. El SEO se sigue generando,
      // pero desde el codigo a partir del nombre y el cargo.
      type: 'data',
      // Se aceptan las tres extensiones de datos, no solo .yml, aunque lo normal
      // sea usar .yml.
      //
      // Al crear una ficha, Studio pregunta el formato con un desplegable
      // (md / yaml / yml / json) que NO se puede quitar ni configurar: la lista
      // esta incrustada en el codigo compilado del editor. Si la coleccion solo
      // aceptara .yml, elegir "yaml" o "json" crearia un fichero que el sitio
      // ignora en silencio, sin error y sin pista de por que esa persona no
      // aparece. Aceptando las tres, cualquier eleccion razonable funciona.
      //
      // La unica que sigue sin servir es "md", que es ademas la opcion por
      // defecto del desplegable: un markdown no encaja en una coleccion de
      // datos. Esta avisado en el README y en la pagina de entrada.
      source: 'personas/*.{yml,yaml,json}',
      schema: z.object({
        nombre: z.string().describe('Nombre y apellidos, tal como debe aparecer en la web'),

        // Los campos obligatorios llevan valor por defecto para que una ficha
        // recien creada se vea en la web enseguida, con textos evidentes de
        // completar. Es preferible a que desaparezca sin motivo visible: Nuxt
        // Content descarta en silencio lo que no cumple el esquema, sin error.
        cargo: z.string().default('Cargo por completar')
          .describe('Cargo o titulo. Ejemplo: Profesor titular'),
        categoria: z.enum(['jornada', 'parttime', 'apoyo', 'administrativos'])
          .default('jornada')
          .describe('Pestana de /personas donde aparece esta persona'),
        orden: z.number().default(100)
          .describe('Posicion dentro de su pestana. El numero mas bajo aparece primero'),
        grado: z.string().optional().describe('Grado academico. Ejemplo: Doctor en Ingenieria Mecanica'),
        email: z.string().optional().describe('Correo institucional'),
        telefono: z.string().optional(),
        oficina: z.string().optional().describe('Ubicacion de la oficina'),
        web: z.string().optional().describe('Pagina personal, con https://'),
        foto: z.string().optional()
          .describe('Ruta de la foto dentro de public/personas/. Ejemplo: /personas/nombre.jpg'),
        areas: z.array(z.string()).default([])
          .describe('Areas del Departamento a las que pertenece. Identificadores de app/utils/areas.ts'),
        intereses: z.array(z.string()).default([])
          .describe('Intereses de investigacion, uno por linea'),
        investigaciones: z.array(z.object({
          titulo: z.string(),
          resumen: z.string(),
          url: z.string().optional()
        })).default([]).describe('Investigaciones destacadas'),
        publicaciones: z.array(z.object({
          titulo: z.string(),
          medio: z.string().describe('Revista, congreso o editorial'),
          anio: z.number(),
          url: z.string().optional()
        })).default([]).describe('Publicaciones recientes'),
        docencia: z.array(z.object({
          codigo: z.string().describe('Codigo de la asignatura. Ejemplo: IWM101'),
          nombre: z.string()
        })).default([]).describe('Asignaturas que imparte'),
        enlaces: z.array(z.object({
          label: z.string(),
          url: z.string()
        })).default([]).describe('Enlaces externos: ORCID, Google Scholar, LinkedIn...'),

        // Sustituye al cuerpo markdown que tenia la coleccion cuando era `page`.
        // Es texto corriente: se separan parrafos dejando una linea en blanco, y
        // no hace falta saber markdown para escribirlo.
        resena: z.string().default('')
          .describe('Texto que aparece en "Acerca de". Deja una linea en blanco entre parrafos')
      })
    }),

    // ─────────────────────────────────────────────────────────────────────
    // Noticias. Fuera de content/ y por tanto fuera del editor.
    //
    // Estan pensadas para alimentarse solas desde las redes sociales mediante
    // API. Dejarlas editables invitaria a escribir a mano algo que un proceso
    // automatico va a sobrescribir, y ese conflicto es dificil de diagnosticar
    // despues. Cuando exista la integracion, escribira en datos/noticias/.
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
    // Paginas. Una coleccion por pagina, con los campos que esa pagina usa de
    // verdad.
    //
    // Podria haberse hecho con una sola coleccion generica de "secciones", pero
    // el formulario resultante seria una lista de cajas llamadas "seccion" y
    // "elemento", sin relacion visible con lo que se ve en la web. Separandolas,
    // el menu de Studio queda como un espejo del sitio y cada campo se llama
    // como la cosa que edita.
    //
    // Inicio no esta aqui: se dejo fuera de la edicion a peticion expresa.
    // ─────────────────────────────────────────────────────────────────────
    departamento: defineCollection({
      type: 'data',
      source: 'paginas/departamento.yml',
      schema: z.object({
        intro: z.string().describe('Parrafo de entrada, debajo del titulo'),
        valores: z.array(z.object({
          titulo: z.string().describe('Mision, Vision, ...'),
          texto: z.string().default('').describe('Contenido de la tarjeta')
        })).default([]),
        tituloHistoria: z.string().default('Nuestra Historia'),
        historia: z.array(z.object({
          periodo: z.string().describe('Rango de anos. Ejemplo: 1932 - 1939'),
          texto: z.string().describe('Que ocurrio en ese periodo')
        })).default([]),
        tituloEstructura: z.string().default('Estructura'),
        estructura: z.array(z.object({
          cargo: z.string().describe('Nombre del cargo'),
          persona: z.string().describe('Quien lo ocupa'),
          slug: z.string().describe('Fichero de esa persona en Personas, sin .md. Ejemplo: nombre-apellido-1')
        })).default([])
      })
    }),

    estudios: defineCollection({
      type: 'data',
      source: 'paginas/estudios.yml',
      schema: z.object({
        intro: z.string().default(''),
        programas: z.array(z.object({
          titulo: z.string(),
          descripcion: z.string(),
          to: z.string().describe('Pagina a la que lleva la tarjeta. Ejemplo: /pregrado')
        })).default([])
      })
    }),

    pregrado: defineCollection({
      type: 'data',
      source: 'paginas/pregrado.yml',
      schema: z.object({
        intro: z.string().default(''),
        areasFormacion: z.array(z.object({
          titulo: z.string().describe('Nombre del area de formacion'),
          descripcion: z.string()
        })).default([]).describe('Areas de formacion de la carrera'),
        campus: z.array(z.object({
          nombre: z.string(),
          detalle: z.string().describe('Direccion')
        })).default([]).describe('Campus donde se imparte')
      })
    }),

    postgrado: defineCollection({
      type: 'data',
      source: 'paginas/postgrado.yml',
      schema: z.object({
        intro: z.string().default(''),
        programas: z.array(z.object({
          id: z.string().describe('Identificador para enlazar desde el menu. No usar espacios ni tildes'),
          titulo: z.string(),
          descripcion: z.string()
        })).default([])
      })
    }),

    educacionContinua: defineCollection({
      type: 'data',
      source: 'paginas/educacion-continua.yml',
      schema: z.object({
        intro: z.string().default(''),
        modalidades: z.array(z.object({
          titulo: z.string(),
          descripcion: z.string()
        })).default([])
      })
    }),

    asignaturas: defineCollection({
      type: 'data',
      source: 'paginas/asignaturas.yml',
      schema: z.object({
        intro: z.string().default(''),
        asignaturas: z.array(z.object({
          codigo: z.string().describe('Codigo oficial. Ejemplo: IWM101'),
          nombre: z.string(),
          nivel: z.enum(['Pregrado', 'Postgrado']),
          creditos: z.number()
        })).default([])
      })
    }),

    investigacion: defineCollection({
      type: 'data',
      source: 'paginas/investigacion.yml',
      schema: z.object({
        intro: z.string().default(''),
        // El identificador de cada area lo fija app/utils/areas.ts porque las
        // fichas de personas apuntan a el. Aqui solo se edita su descripcion:
        // cambiar un identificador desde el editor romperia esas referencias
        // en silencio.
        descripciones: z.array(z.object({
          area: z.enum(['termicos', 'fluidos', 'renovables', 'produccion',
                        'mantenimiento', 'mecatronica', 'solidos'])
            .describe('Area del Departamento'),
          texto: z.string().describe('Descripcion que aparece bajo el nombre del area')
        })).default([])
      })
    }),

    laboratorios: defineCollection({
      type: 'data',
      source: 'paginas/laboratorios.yml',
      schema: z.object({
        intro: z.string().default(''),
        laboratorios: z.array(z.object({
          nombre: z.string(),
          detalle: z.string().describe('Campus o ubicacion')
        })).default([])
      })
    }),

    campus: defineCollection({
      type: 'data',
      source: 'paginas/campus.yml',
      schema: z.object({
        intro: z.string().default(''),
        campus: z.array(z.object({
          nombre: z.string(),
          direccion: z.string(),
          telefono: z.string().default(''),
          detalle: z.string().describe('Que hay en este campus')
        })).default([])
      })
    }),

    oportunidades: defineCollection({
      type: 'data',
      source: 'paginas/oportunidades.yml',
      schema: z.object({
        intro: z.string().default(''),
        sectores: z.array(z.object({
          titulo: z.string().describe('Sector. Ejemplo: Energia'),
          descripcion: z.string()
        })).default([])
      })
    }),

    sitiosEstudiantiles: defineCollection({
      type: 'data',
      source: 'paginas/sitios-estudiantiles.yml',
      schema: z.object({
        intro: z.string().default(''),
        sitios: z.array(z.object({
          nombre: z.string(),
          descripcion: z.string(),
          url: z.string().describe('Direccion completa, con https://')
        })).default([])
      })
    }),

    vinculacion: defineCollection({
      type: 'data',
      source: 'paginas/vinculacion.yml',
      schema: z.object({
        intro: z.string().default(''),
        secciones: z.array(z.object({
          id: z.string().describe('Identificador para enlazar desde el menu. Sin espacios ni tildes'),
          titulo: z.string(),
          texto: z.string(),
          enlace: enlace
        })).default([])
      })
    }),

    contacto: defineCollection({
      type: 'data',
      source: 'paginas/contacto.yml',
      schema: z.object({
        intro: z.string().default(''),
        tituloDatos: z.string().default('Datos de contacto'),
        datos: z.array(z.object({
          label: z.string().describe('Que es. Ejemplo: Direccion, Telefono'),
          valor: z.string(),
          icon: z.string().default('i-lucide-info')
            .describe('Icono de lucide.dev. Ejemplo: i-lucide-map-pin')
        })).default([])
      })
    })
  }
})
