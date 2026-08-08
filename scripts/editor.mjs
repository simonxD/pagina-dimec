/**
 * Gestión de las cuentas de editor del sitio.
 *
 *   bun run editor            lista las cuentas
 *   bun run editor agregar    crea una cuenta o cambia su contraseña
 *   bun run editor quitar     elimina una cuenta
 *
 * Las cuentas viven en C:\dimec\editores.json, fuera del repositorio, porque
 * contienen hashes de contraseñas. Nunca se guarda la contraseña en claro.
 */
import { readFileSync, writeFileSync, existsSync, chmodSync } from 'node:fs'
import { scryptSync, randomBytes } from 'node:crypto'
import { createInterface } from 'node:readline'

const RUTA = process.env.EDITORES_FICHERO || 'C:\\dimec\\editores.json'

function leer() {
  if (!existsSync(RUTA)) return []
  try {
    const d = JSON.parse(readFileSync(RUTA, 'utf8'))
    return Array.isArray(d) ? d : []
  } catch {
    console.error(`No se pudo leer ${RUTA}. Revisa que sea un JSON valido.`)
    process.exit(1)
  }
}

function guardar(editores) {
  writeFileSync(RUTA, JSON.stringify(editores, null, 2) + '\n', 'utf8')
  try { chmodSync(RUTA, 0o600) } catch { /* en Windows lo gobiernan las ACL */ }
}

function crearClave(contrasena) {
  const sal = randomBytes(16)
  return `scrypt$${sal.toString('hex')}$${scryptSync(contrasena, sal, 64).toString('hex')}`
}

// Interactivo cuando se ejecuta a mano, y por tuberia cuando lo alimenta otro
// proceso. Encadenar rl.question sin mas funciona en el primer caso pero se
// queda colgado en el segundo: al agotarse la entrada, las preguntas siguientes
// no se resuelven nunca. Con la entrada leida de golpe funcionan los dos.
const interactivo = process.stdin.isTTY
const rl = interactivo
  ? createInterface({ input: process.stdin, output: process.stdout })
  : null

let pendientes = []
if (!interactivo) {
  const trozos = []
  for await (const t of process.stdin) trozos.push(t)
  pendientes = trozos.join('').split('\n')
}

const preguntar = texto => interactivo
  ? new Promise(r => rl.question(texto, v => r(v.trim())))
  : Promise.resolve((pendientes.shift() ?? '').trim())

/** Pregunta sin dejar la contraseña escrita en pantalla ni en el historial. */
function preguntarOculto(texto) {
  if (!interactivo) return Promise.resolve(pendientes.shift() ?? '')
  return new Promise((resolver) => {
    process.stdout.write(texto)
    const alEscribir = rl._writeToOutput
    rl._writeToOutput = () => {}
    rl.question('', (valor) => {
      rl._writeToOutput = alEscribir
      process.stdout.write('\n')
      resolver(valor)
    })
  })
}

const cerrar = () => rl?.close()

const accion = process.argv[2] || 'listar'
const editores = leer()

if (accion === 'listar') {
  if (!editores.length) {
    console.log(`No hay cuentas todavia. Crea una con:  bun run editor agregar`)
  } else {
    console.log(`Cuentas en ${RUTA}:\n`)
    for (const e of editores) console.log(`  ${e.usuario.padEnd(18)} ${e.nombre}  <${e.correo}>`)
  }
  cerrar()
} else if (accion === 'agregar') {
  const usuario = (await preguntar('Usuario (sin espacios): ')).toLowerCase()
  if (!usuario) { console.error('El usuario no puede quedar vacio.'); cerrar(); process.exit(1) }

  const existente = editores.find(e => e.usuario.toLowerCase() === usuario)
  if (existente) console.log(`Ya existe: se le cambiara la contrasena y los datos.`)

  const nombre = (await preguntar(`Nombre completo${existente ? ` [${existente.nombre}]` : ''}: `))
    || existente?.nombre || usuario
  const correo = (await preguntar(`Correo${existente ? ` [${existente.correo}]` : ''}: `))
    || existente?.correo || ''

  const c1 = await preguntarOculto('Contrasena: ')
  const c2 = await preguntarOculto('Repite la contrasena: ')
  cerrar()

  if (c1 !== c2) { console.error('\nNo coinciden. No se guardo nada.'); process.exit(1) }
  if (c1.length < 10) { console.error('\nUsa al menos 10 caracteres: el formulario esta en internet.'); process.exit(1) }

  const registro = { usuario, nombre, correo, clave: crearClave(c1) }
  const resto = editores.filter(e => e.usuario.toLowerCase() !== usuario)
  guardar([...resto, registro])

  console.log(`\nGuardado en ${RUTA}`)
  console.log('Reinicia el sitio para que tome los cambios:')
  console.log('  Stop-ScheduledTask -TaskName "DIMEC web"; Start-ScheduledTask -TaskName "DIMEC web"')
} else if (accion === 'quitar') {
  const usuario = (await preguntar('Usuario a eliminar: ')).toLowerCase()
  cerrar()
  const resto = editores.filter(e => e.usuario.toLowerCase() !== usuario)
  if (resto.length === editores.length) { console.error('No existe esa cuenta.'); process.exit(1) }
  guardar(resto)
  console.log(`Eliminada. Quedan ${resto.length} cuenta(s). Reinicia el sitio.`)
} else {
  console.error(`Accion desconocida: ${accion}. Usa: listar, agregar o quitar.`)
  cerrar()
  process.exit(1)
}
