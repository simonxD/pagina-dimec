/**
 * Inicio de sesión con cuenta propia, para el editor del sitio.
 *
 * Comparte destino con la ruta de Microsoft: las dos terminan llamando a
 * `setStudioUserSession`, que es quien adjunta el token de escritura del
 * servidor. Por eso quien edita nunca necesita cuenta de GitHub, entre por
 * donde entre.
 */
import { createError, eventHandler, readBody } from 'h3'

export default eventHandler(async (event) => {
  const tokenEscritura = process.env.STUDIO_GITHUB_TOKEN
  if (!tokenEscritura || tokenEscritura.startsWith('PEGAR_')) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Falta rellenar STUDIO_GITHUB_TOKEN en C:\\dimec\\studio.env.ps1: '
        + 'sin el, se puede entrar pero no publicar cambios'
    })
  }

  const cuerpo = await readBody<{ usuario?: string, contrasena?: string }>(event)
  const usuario = String(cuerpo?.usuario ?? '').trim().toLowerCase()
  const contrasena = String(cuerpo?.contrasena ?? '')

  if (!usuario || !contrasena) {
    throw createError({ statusCode: 400, statusMessage: 'Indica usuario y contraseña' })
  }

  const minutos = estaBloqueado(usuario)
  if (minutos > 0) {
    throw createError({
      statusCode: 429,
      statusMessage: `Demasiados intentos fallidos. Vuelve a probar en ${minutos} minutos.`
    })
  }

  const editores = leerEditores()
  const editor = editores.find(e => e.usuario.toLowerCase() === usuario)

  // Se comprueba la contraseña incluso si el usuario no existe, contra un valor
  // desechable. Si no, responder al instante ante un usuario inexistente y
  // tardar ante uno real revela cuáles existen.
  const valido = editor
    ? claveCorrecta(editor, contrasena)
    : (claveCorrecta({ usuario: '', nombre: '', correo: '', clave: CLAVE_SENUELO }, contrasena), false)

  if (!editor || !valido) {
    anotarFallo(usuario)
    throw createError({ statusCode: 401, statusMessage: 'Usuario o contraseña incorrectos' })
  }

  limpiarFallos(usuario)

  await setStudioUserSession(event, {
    providerId: editor.usuario,
    name: editor.nombre,
    email: editor.correo,
    avatar: ''
  })

  return { ok: true }
})

/**
 * Hash de una contraseña que no es la de nadie. Solo sirve para gastar el mismo
 * tiempo de cálculo cuando el usuario no existe.
 */
const CLAVE_SENUELO = 'scrypt$'
  + '00000000000000000000000000000000$'
  + '0'.repeat(128)
