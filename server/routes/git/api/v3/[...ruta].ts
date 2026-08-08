/**
 * Proxy entre el editor y GitHub.
 *
 * ── Por qué existe ──
 *
 * Nuxt Studio publica llamando a https://api.github.com DESDE EL NAVEGADOR, con
 * el token en la sesión. Eso tiene dos consecuencias graves:
 *
 *   1. Cualquiera que entre al editor puede leer ese token en
 *      /__nuxt_studio/auth/session y escribir en cualquier fichero del
 *      repositorio, desde fuera de la aplicación.
 *   2. Cualquier permiso por carpeta implementado en la interfaz sería
 *      decorativo: se saltaría abriendo las herramientas del navegador.
 *
 * Studio construye su dirección base como `${instanceUrl}/api/v3` cuando el
 * host de `instanceUrl` no es github.com — es la vía prevista para GitHub
 * Enterprise. Apuntando esa opción a este servidor, todas sus llamadas pasan por
 * aquí: se comprueba quién es y qué intenta tocar, y solo entonces se reenvían a
 * GitHub con el token real, que nunca sale de la máquina.
 *
 * ── Qué NO afecta ──
 *
 * Solo interviene al publicar. El sitio público no pasa por aquí y su velocidad
 * queda igual.
 */
import { createError, eventHandler, getRouterParam, getQuery, readRawBody, getMethod } from 'h3'

const GITHUB = 'https://api.github.com'

/**
 * Qué ficheros puede escribir cada quien.
 *
 *   admin                  todo
 *   editor con ficha       solo su propia ficha de Personas
 *   editor sin ficha       las páginas generales, pero ninguna ficha ajena
 *
 * Esa división es la que pidió el Departamento: profesores que mantienen su
 * perfil, y encargados de contenido general que no tienen perfil propio.
 */
function puedeEscribir(editor: Editor, ruta: string): boolean {
  if (esAdmin(editor)) return true

  const limpia = ruta.replace(/^\/+/, '')

  if (editor.ficha) {
    // `ficha` se guarda como `jornada/nombre-apellido-1`, sin extensión, para no
    // atar la cuenta al formato del fichero.
    const suya = `content/personas/${editor.ficha}`
    return limpia === suya || limpia.startsWith(`${suya}.`)
  }

  // Sin ficha: contenido general, nunca fichas de personas.
  return limpia.startsWith('content/paginas/') || limpia.startsWith('public/')
}

/** Rutas de fichero que lleva el cuerpo de una petición de escritura. */
function rutasDelCuerpo(ruta: string, cuerpo: string): string[] {
  // Al crear un árbol, cada entrada trae el fichero que se escribe. Es el único
  // punto donde se ven todas las rutas de una publicación.
  if (ruta.includes('/git/trees')) {
    try {
      const j = JSON.parse(cuerpo) as { tree?: { path?: string }[] }
      return (j.tree ?? []).map(t => String(t.path ?? '')).filter(Boolean)
    } catch { return [] }
  }
  // Escritura directa de un fichero: la ruta va en la propia dirección.
  const contenidos = ruta.match(/\/contents\/(.+)$/)
  if (contenidos) return [decodeURIComponent(contenidos[1]!.split('?')[0]!)]
  return []
}

export default eventHandler(async (event) => {
  const editor = await editorDeLaSesion(event)
  if (!editor) {
    throw createError({ statusCode: 401, statusMessage: 'Necesitas iniciar sesión para publicar' })
  }

  const token = process.env.STUDIO_GITHUB_TOKEN
  if (!token || token.startsWith('PEGAR_')) {
    throw createError({ statusCode: 500, statusMessage: 'Falta STUDIO_GITHUB_TOKEN en el servidor' })
  }

  const ruta = String(getRouterParam(event, 'ruta') ?? '')
  const metodo = getMethod(event)
  const cuerpo = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(metodo)
    ? (await readRawBody(event, 'utf8')) ?? ''
    : undefined

  // Las lecturas no necesitan comprobación: quien tiene sesión ya ve el
  // contenido en el editor, y el repositorio es público.
  if (cuerpo !== undefined) {
    const rutas = rutasDelCuerpo(ruta, cuerpo)
    const prohibidas = rutas.filter(r => !puedeEscribir(editor, r))
    if (prohibidas.length) {
      throw createError({
        statusCode: 403,
        statusMessage: `No tienes permiso para modificar: ${prohibidas.slice(0, 3).join(', ')}`
      })
    }
  }

  const consulta = new URLSearchParams(getQuery(event) as Record<string, string>).toString()
  const destino = `${GITHUB}/${ruta}${consulta ? `?${consulta}` : ''}`

  const respuesta = await fetch(destino, {
    method: metodo,
    headers: {
      // El token del servidor sustituye al que mande el navegador, que es
      // deliberadamente inservible.
      Authorization: token.startsWith('github_pat_') ? `token ${token}` : `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
      'User-Agent': 'dimec-studio'
    },
    body: cuerpo || undefined
  })

  event.node.res.statusCode = respuesta.status
  return await respuesta.text()
})
