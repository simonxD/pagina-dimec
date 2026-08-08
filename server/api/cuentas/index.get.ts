/**
 * Lista de cuentas, para la pantalla de administración.
 *
 * Nunca devuelve el hash de la contraseña: no hace falta para nada en la
 * interfaz y sacarlo del servidor solo aumenta la superficie por la que puede
 * escaparse.
 */
import { eventHandler } from 'h3'

export default eventHandler(async (event) => {
  await exigirAdmin(event)

  return leerEditores().map(({ usuario, nombre, correo, rol, ficha }) => ({
    usuario,
    nombre,
    correo,
    rol: rol ?? 'editor',
    ficha: ficha ?? ''
  }))
})
