/**
 * Crea o actualiza una cuenta de editor.
 *
 * La contraseña es opcional al actualizar: si no viene, se conserva la que
 * hubiera. Así se puede corregir un nombre o un rol sin obligar a reasignar
 * credenciales.
 */
import { createError, eventHandler, readBody } from 'h3'

interface Cuerpo {
  usuario?: string
  nombre?: string
  correo?: string
  contrasena?: string
  rol?: 'admin' | 'editor'
  ficha?: string
}

export default eventHandler(async (event) => {
  const quienEdita = await exigirAdmin(event)
  const c = await readBody<Cuerpo>(event)

  const usuario = String(c?.usuario ?? '').trim().toLowerCase()
  if (!/^[a-z0-9._-]{3,}$/.test(usuario)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'El usuario debe tener al menos 3 caracteres: letras, números, punto, guion o guion bajo'
    })
  }

  const editores = leerEditores()
  const existente = editores.find(e => e.usuario === usuario)

  if (!existente && !c?.contrasena) {
    throw createError({ statusCode: 400, statusMessage: 'Una cuenta nueva necesita contraseña' })
  }
  if (c?.contrasena && String(c.contrasena).length < 10) {
    throw createError({
      statusCode: 400,
      statusMessage: 'La contraseña debe tener al menos 10 caracteres: el formulario está en internet'
    })
  }

  // Nadie puede quitarse a sí mismo el rol de administrador. Sin esta
  // comprobación, el único administrador puede degradarse por error y dejar el
  // sistema sin quien gestione las cuentas, sin forma de arreglarlo desde la web.
  const rol = c?.rol === 'admin' ? 'admin' : 'editor'
  if (usuario === quienEdita.usuario && rol !== 'admin') {
    throw createError({
      statusCode: 400,
      statusMessage: 'No puedes quitarte a ti mismo el rol de administrador'
    })
  }

  const registro: Editor = {
    usuario,
    nombre: String(c?.nombre ?? existente?.nombre ?? usuario).trim(),
    correo: String(c?.correo ?? existente?.correo ?? '').trim(),
    clave: c?.contrasena ? crearClave(String(c.contrasena)) : existente!.clave,
    rol,
    ficha: String(c?.ficha ?? existente?.ficha ?? '').trim()
  }

  guardarEditores([...editores.filter(e => e.usuario !== usuario), registro])

  return { ok: true, creada: !existente }
})
