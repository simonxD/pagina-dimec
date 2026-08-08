/**
 * Deja la sesión de Studio sin un token utilizable.
 *
 * `setStudioUserSession` guarda el STUDIO_GITHUB_TOKEN real en la sesión, y esa
 * sesión se sirve entera en /__nuxt_studio/auth/session. Cualquier editor podía
 * leerlo desde las herramientas del navegador y escribir en el repositorio por
 * su cuenta, saltándose cualquier permiso.
 *
 * Con el proxy de /git no hace falta que el navegador tenga nada: el token lo
 * pone el servidor al reenviar. Aquí se sustituye por un valor inservible, para
 * que lo que se filtre no sirva de nada.
 *
 * Se conserva un valor no vacío a propósito: el editor comprueba que exista
 * antes de intentar publicar, y dejarlo vacío haría que se rindiera antes de
 * llamar al proxy.
 */
import { getRequestProtocol, useSession, type H3Event } from 'h3'

export async function vaciarTokenDeLaSesion(event: H3Event): Promise<void> {
  const sesion = await useSession<{ user?: Record<string, unknown> }>(event, {
    name: 'studio-session',
    password: useRuntimeConfig(event).studio?.auth?.sessionSecret,
    cookie: { secure: getRequestProtocol(event) === 'https', path: '/' }
  })

  const usuario = sesion.data?.user
  if (!usuario) return

  await sesion.update({
    user: { ...usuario, accessToken: 'gestionado-por-el-servidor' }
  })
}
