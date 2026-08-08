/**
 * Quién es el usuario de la petición actual, según la sesión de Studio.
 *
 * La sesión la crea `setStudioUserSession` y guarda el `providerId`, que para
 * las cuentas propias es el nombre de usuario. Con eso se recupera la ficha
 * completa del fichero de cuentas, que es donde vive el rol.
 *
 * No se confía en nada que venga del navegador: la cookie está cifrada y
 * firmada por el propio módulo, y el rol se lee del disco en cada petición. Así
 * quitarle el rol a alguien surte efecto de inmediato, sin esperar a que caduque
 * su sesión.
 */
import { createError, getRequestProtocol, useSession, type H3Event } from 'h3'

/**
 * El módulo solo auto-importa `setStudioUserSession` y `clearStudioUserSession`,
 * no una función para leerla. Se abre la misma sesión con los mismos parámetros
 * que usa su propia ruta `/__nuxt_studio/auth/session`: mismo nombre de cookie y
 * mismo secreto, que sale de la configuración en tiempo de ejecución.
 */
export async function editorDeLaSesion(event: H3Event): Promise<Editor | undefined> {
  const sesion = await useSession<{ user?: { providerId?: string } }>(event, {
    name: 'studio-session',
    password: useRuntimeConfig(event).studio?.auth?.sessionSecret,
    cookie: { secure: getRequestProtocol(event) === 'https', path: '/' }
  }).catch(() => null)

  const id = sesion?.data?.user?.providerId
  if (!id) return undefined
  return leerEditores().find(e => e.usuario === id)
}

/** Corta la petición si quien la hace no es administrador. */
export async function exigirAdmin(event: H3Event): Promise<Editor> {
  const editor = await editorDeLaSesion(event)
  if (!editor) {
    throw createError({ statusCode: 401, statusMessage: 'Necesitas iniciar sesión' })
  }
  if (!esAdmin(editor)) {
    throw createError({ statusCode: 403, statusMessage: 'Solo los administradores pueden gestionar cuentas' })
  }
  return editor
}
