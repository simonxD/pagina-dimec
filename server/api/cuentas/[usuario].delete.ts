/**
 * Elimina una cuenta de editor.
 */
import { createError, eventHandler, getRouterParam } from 'h3'

export default eventHandler(async (event) => {
  const quienEdita = await exigirAdmin(event)
  const usuario = String(getRouterParam(event, 'usuario') ?? '').toLowerCase()

  if (usuario === quienEdita.usuario) {
    throw createError({ statusCode: 400, statusMessage: 'No puedes eliminar tu propia cuenta' })
  }

  const editores = leerEditores()
  if (!editores.some(e => e.usuario === usuario)) {
    throw createError({ statusCode: 404, statusMessage: 'Esa cuenta no existe' })
  }

  const resto = editores.filter(e => e.usuario !== usuario)

  // Quedarse sin administradores dejaría el sistema sin quien gestione cuentas y
  // sin forma de arreglarlo desde la web: habría que editar el JSON en el
  // servidor a mano.
  if (!resto.some(e => e.rol === 'admin')) {
    throw createError({
      statusCode: 400,
      statusMessage: 'No se puede eliminar: sería la última cuenta con permisos de administración'
    })
  }

  guardarEditores(resto)
  return { ok: true }
})
