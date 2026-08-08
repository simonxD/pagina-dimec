/**
 * Cuentas propias de editor: lectura del fichero y verificación de contraseña.
 *
 * Existen porque registrar la aplicación en Entra ID requiere permisos de
 * administrador del inquilino de la USM. Mientras eso no esté disponible, esto
 * permite dar acceso a quien haga falta sin depender de nadie.
 *
 * Es deliberadamente un puente. Cuando la DTI habilite el registro, la ruta de
 * Microsoft ya está escrita y ambas terminan en el mismo sitio:
 * `setStudioUserSession`. Migrar es dejar de repartir estas cuentas.
 *
 * El fichero vive FUERA del repositorio, en C:\dimec\editores.json, porque
 * contiene hashes de contraseñas. Se crea y se modifica con:
 *
 *   bun run editor
 */
import { readFileSync, writeFileSync, renameSync } from 'node:fs'
import { scryptSync, timingSafeEqual, randomBytes } from 'node:crypto'

export interface Editor {
  usuario: string
  nombre: string
  correo: string
  /** Formato: scrypt$<sal en hex>$<hash en hex> */
  clave: string
  /**
   * `admin` puede gestionar cuentas; `editor` no.
   *
   * Ojo con lo que este rol NO hace: no limita que puede tocar cada quien
   * dentro del editor. Studio publica llamando a la API de GitHub desde el
   * navegador, con el token en la sesion, asi que cualquiera con acceso puede
   * extraerlo y escribir en cualquier fichero. El rol gobierna esta aplicacion,
   * no el contenido. Ver el README, seccion de permisos.
   */
  rol?: 'admin' | 'editor'
  /**
   * Ficha de Personas que le corresponde, si tiene.
   *
   * Ejemplo: `jornada/nombre-apellido-1`. Sirve para llevar la cuenta de quien
   * mantiene que perfil y para los administradores sin ficha propia, que lo
   * dejan vacio.
   */
  ficha?: string
}

export function esAdmin(editor: Editor | undefined): boolean {
  return editor?.rol === 'admin'
}

const RUTA = process.env.EDITORES_FICHERO || 'C:\\dimec\\editores.json'

/**
 * Genera el valor que se guarda en el fichero. Lo usa el script de gestión.
 *
 * scrypt viene en Node, así que no añade dependencias, y está diseñado para ser
 * caro de calcular: eso es lo que hace inviable probar contraseñas en masa
 * contra el fichero si alguna vez se filtrara.
 */
export function crearClave(contrasena: string): string {
  const sal = randomBytes(16)
  const hash = scryptSync(contrasena, sal, 64)
  return `scrypt$${sal.toString('hex')}$${hash.toString('hex')}`
}

export function leerEditores(): Editor[] {
  try {
    const datos = JSON.parse(readFileSync(RUTA, 'utf8'))
    return Array.isArray(datos) ? datos : []
  } catch {
    // Fichero ausente o ilegible: ninguna cuenta es válida. Falla cerrado.
    return []
  }
}

/**
 * Comprueba la contraseña en tiempo constante.
 *
 * Comparar hashes con === filtra información: cuanto antes difieran los bytes,
 * antes devuelve, y esa diferencia de tiempo permite deducir el hash byte a
 * byte. timingSafeEqual tarda lo mismo siempre.
 */
export function claveCorrecta(editor: Editor, contrasena: string): boolean {
  const partes = String(editor.clave || '').split('$')
  if (partes.length !== 3 || partes[0] !== 'scrypt') return false

  const sal = Buffer.from(partes[1]!, 'hex')
  const esperado = Buffer.from(partes[2]!, 'hex')
  const calculado = scryptSync(contrasena, sal, esperado.length)

  return esperado.length === calculado.length && timingSafeEqual(esperado, calculado)
}

/**
 * Freno a la fuerza bruta, en memoria.
 *
 * Sin esto, una contraseña débil cae probando sin más: el formulario está en
 * internet y nadie vigila los intentos. Cinco fallos bloquean al usuario quince
 * minutos. Se guarda en memoria a propósito: reiniciar el servidor limpia los
 * bloqueos, y para un sitio con un puñado de editores eso es preferible a
 * mantener estado en disco.
 */
const intentos = new Map<string, { fallos: number, hasta: number }>()
const MAX_FALLOS = 5
const BLOQUEO_MS = 15 * 60 * 1000

export function estaBloqueado(usuario: string): number {
  const r = intentos.get(usuario)
  if (!r || r.hasta < Date.now()) return 0
  return Math.ceil((r.hasta - Date.now()) / 60000)
}

export function anotarFallo(usuario: string): void {
  const r = intentos.get(usuario) ?? { fallos: 0, hasta: 0 }
  r.fallos += 1
  if (r.fallos >= MAX_FALLOS) {
    r.hasta = Date.now() + BLOQUEO_MS
    r.fallos = 0
  }
  intentos.set(usuario, r)
}

export function limpiarFallos(usuario: string): void {
  intentos.delete(usuario)
}

/**
 * Escribe el fichero de cuentas.
 *
 * Se escribe primero en un fichero temporal y luego se sustituye, para que una
 * interrupción a media escritura no deje el JSON cortado: si eso pasara, nadie
 * podría entrar y el fichero tendría que repararse a mano en el servidor.
 */
export function guardarEditores(editores: Editor[]): void {
  const temporal = `${RUTA}.tmp`
  writeFileSync(temporal, JSON.stringify(editores, null, 2) + '\n', 'utf8')
  renameSync(temporal, RUTA)
}
