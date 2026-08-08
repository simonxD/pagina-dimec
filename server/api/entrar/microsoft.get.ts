/**
 * Inicio de sesión del editor con la cuenta institucional de Microsoft (usm.cl).
 *
 * Por qué esta ruta existe en vez de usar el proveedor SSO que trae nuxt-studio:
 *
 *  1. Ese proveedor tiene las direcciones OIDC fijas como `<servidor>/oauth/authorize`,
 *     `/oauth/token` y `/oauth/userinfo`. Entra ID usa `/oauth2/v2.0/authorize` y
 *     sirve el perfil desde graph.microsoft.com, otro dominio. No encajan.
 *  2. Ese proveedor no tiene lista de permitidos. Con el inquilino de la USM
 *     entraría cualquiera que tenga correo de la universidad, estudiantes
 *     incluidos.
 *
 * El módulo expone `setStudioUserSession` justamente para casos así: se le pasa
 * quién es la persona y él adjunta el token de escritura del servidor
 * (STUDIO_GITHUB_TOKEN). Así ningún editor necesita cuenta de GitHub.
 *
 * Variables necesarias (van en C:\dimec\studio.env.ps1):
 *   MS_TENANT_ID       Identificador del inquilino de la USM
 *   MS_CLIENT_ID       Registro de aplicación en Entra ID
 *   MS_CLIENT_SECRET   Secreto de ese registro
 *   EDITORES           Correos autorizados, separados por comas
 *   STUDIO_GITHUB_TOKEN  Token con permiso de escritura sobre el repositorio
 *
 * Dirección de redirección que hay que declarar en Entra ID:
 *   https://dimec.pollomongoliano.cc/api/entrar/microsoft
 */
import {
  createError, deleteCookie, eventHandler, getCookie, getQuery,
  getRequestURL, sendRedirect, setCookie
} from 'h3'

interface RespuestaToken {
  access_token?: string
  id_token?: string
  error?: string
  error_description?: string
}

/**
 * Lee las reclamaciones del id_token sin verificar la firma.
 *
 * Es aceptable aquí y solo aquí: el token no llega por el navegador sino de una
 * llamada directa servidor a servidor contra el punto de token de Microsoft,
 * sobre TLS y autenticada con el secreto de cliente. Si ese token llegase por
 * cualquier otra vía, habría que validar la firma contra las claves públicas del
 * inquilino antes de fiarse de una sola de sus reclamaciones.
 */
function leerClaims(idToken: string): Record<string, unknown> {
  const carga = idToken.split('.')[1]
  if (!carga) return {}
  const json = Buffer.from(carga.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8')
  return JSON.parse(json)
}

export default eventHandler(async (event) => {
  const tenant = process.env.MS_TENANT_ID
  const clientId = process.env.MS_CLIENT_ID
  const clientSecret = process.env.MS_CLIENT_SECRET

  // Se comprueba tambien que no sigan puestos los marcadores del fichero de
  // ejemplo. Son texto no vacio, asi que una comprobacion de "esta definida"
  // los da por buenos: la peticion sale hacia Microsoft con un inquilino
  // inventado y lo que ve quien entra es una pagina de error de Microsoft, sin
  // ninguna pista de que el problema esta en la configuracion de este servidor.
  const sinRellenar = [tenant, clientId, clientSecret]
    .some(v => !v || v.startsWith('PEGAR_'))

  if (sinRellenar) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Falta rellenar MS_TENANT_ID, MS_CLIENT_ID o MS_CLIENT_SECRET en C:\\dimec\\studio.env.ps1'
    })
  }
  const tokenEscritura = process.env.STUDIO_GITHUB_TOKEN
  if (!tokenEscritura || tokenEscritura.startsWith('PEGAR_')) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Falta rellenar STUDIO_GITHUB_TOKEN: sin el, quien entre no podra publicar cambios'
    })
  }

  const base = `https://login.microsoftonline.com/${tenant}/oauth2/v2.0`
  const url = getRequestURL(event)
  const redirectUri = `${url.protocol}//${url.host}${url.pathname}`
  const query = getQuery(event)

  if (query.error) {
    throw createError({
      statusCode: 401,
      statusMessage: `Microsoft rechazo el inicio de sesion: ${query.error_description || query.error}`
    })
  }

  // ── Primera visita: mandar a Microsoft ──
  if (!query.code) {
    const estado = crypto.randomUUID()
    setCookie(event, 'ms-estado', estado, {
      httpOnly: true,
      secure: url.protocol === 'https:',
      sameSite: 'lax',
      maxAge: 600,
      path: '/'
    })
    return sendRedirect(event, `${base}/authorize?` + new URLSearchParams({
      client_id: clientId,
      response_type: 'code',
      redirect_uri: redirectUri,
      response_mode: 'query',
      scope: 'openid email profile',
      state: estado
    }))
  }

  // ── Vuelta desde Microsoft ──
  // El estado se compara contra la cookie para que un tercero no pueda inducir
  // el inicio de sesion desde otro sitio.
  const esperado = getCookie(event, 'ms-estado')
  deleteCookie(event, 'ms-estado')
  if (!esperado || esperado !== query.state) {
    throw createError({ statusCode: 401, statusMessage: 'El estado no coincide; se aborta el inicio de sesion' })
  }

  const token = await $fetch<RespuestaToken>(`${base}/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'authorization_code',
      code: String(query.code),
      redirect_uri: redirectUri
    }).toString()
  }).catch((e: { data?: RespuestaToken }) => e.data ?? { error: 'fallo la peticion del token' })

  if (token.error || !token.id_token) {
    throw createError({
      statusCode: 401,
      statusMessage: `No se pudo obtener el token: ${token.error_description || token.error}`
    })
  }

  const claims = leerClaims(token.id_token)
  const correo = String(
    claims.email ?? claims.preferred_username ?? claims.upn ?? ''
  ).toLowerCase().trim()
  const nombre = String(claims.name ?? correo)

  if (!correo) {
    throw createError({ statusCode: 401, statusMessage: 'Microsoft no devolvio ningun correo' })
  }

  // ── Lista de permitidos ──
  // Falla cerrada a propósito: sin lista, no entra nadie. El inquilino de la USM
  // incluye a toda la comunidad universitaria, así que pertenecer a él no puede
  // ser suficiente para editar el sitio del Departamento.
  const editores = (process.env.EDITORES ?? '')
    .split(',').map(c => c.trim().toLowerCase()).filter(Boolean)

  if (!editores.includes(correo)) {
    throw createError({
      statusCode: 403,
      statusMessage: `${correo} no esta en la lista de editores del sitio`
    })
  }

  // A partir de aquí Studio se encarga: adjunta STUDIO_GITHUB_TOKEN a la sesión
  // y los cambios se publican con él.
  await setStudioUserSession(event, {
    providerId: String(claims.oid ?? claims.sub ?? correo),
    name: nombre,
    email: correo,
    avatar: ''
  })

  // El token real no debe llegar al navegador: las publicaciones pasan por el
  // proxy de /git, que lo pone del lado del servidor.
  await vaciarTokenDeLaSesion(event)

  const destino = decodeURIComponent(getCookie(event, 'studio-redirect') || '')
  deleteCookie(event, 'studio-redirect')
  return sendRedirect(event, destino.startsWith('/') && !destino.startsWith('//') ? destino : '/')
})
