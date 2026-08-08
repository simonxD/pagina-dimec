# Sitio web del Departamento de Ingeniería Mecánica (DIMEC) — USM

Sitio institucional del Departamento, hecho con Nuxt 4 y Nuxt Content 3, con un
editor visual integrado (Nuxt Studio) para que el contenido lo mantenga gente del
Departamento sin tocar código.

Este documento es la referencia completa: qué es cada cosa, cómo se despliega, qué
decisiones se tomaron y por qué. Si vas a trabajar sobre este proyecto, léelo
entero antes de cambiar nada.

---

## 1. De un vistazo

| | |
|---|---|
| Framework | Nuxt 4.5 (Vue 3), renderizado en servidor |
| Contenido | Nuxt Content 3.15 (compila a SQLite en el arranque) |
| Interfaz | Nuxt UI 4 + Tailwind |
| Editor | nuxt-studio 1.7, autoalojado en `/_studio` |
| Gestor de paquetes | **bun** (no npm — ver §7) |
| Repositorio | `github.com/simonxD/pagina-dimec`, rama `main`, público |
| Sitio en producción | `https://dimec.pollomongoliano.cc` |
| Alojamiento | Un PC con Windows 11, en la red del propietario |

El sitio **no está en un proveedor de nube**. Corre en una máquina física y sale a
internet por un túnel de Cloudflare. Esto condiciona casi todo lo demás.

---

## 2. Desarrollo local

```bash
bun install
bun run dev
```

El sitio queda en `http://localhost:3000`. En modo desarrollo, Studio aparece como
un botón flotante abajo a la izquierda y escribe directamente sobre los ficheros
del disco: no hace commits. Para publicar desde local se usa git normalmente.

Otros comandos:

```bash
bun run build      # compila a .output/
bun run preview    # sirve lo compilado
```

---

## 3. Cómo está organizado el contenido

Hay una distinción que hay que entender antes de tocar nada:

```
content/     ← lo gestiona Studio. Editable desde el navegador.
datos/       ← FUERA del editor, a propósito.
app/         ← código. No editable desde Studio.
```

### 3.1. `content/personas/` — una persona por fichero

Un `.yml` por persona. Cada fichero genera su página en
`/personas/<nombre-del-fichero>`, sin tildes: `simón-ramos.yml` responde en
`/personas/simon-ramos`.

**La colección es de tipo `data`, no `page`, y la diferencia es deliberada.** Una
colección `page` arrastra un esquema propio de Nuxt Content —`title`,
`description`, `seo`, `navigation`, `body`, `extension`, `path`— y Studio los
muestra todos. En la práctica eso obligaba a escribir el nombre de la persona
tres veces (Title, Title de SEO y el campo propio), enseñaba un bloque SEO que no
significa nada para quien no es técnico, abría un editor de markdown aparte para
el cuerpo, y al crear una ficha preguntaba si se quería en md, yaml, json, csv o
xml.

Con `data` no se hereda nada: el formulario tiene exactamente los campos del
esquema y el fichero es siempre `.yml`. **El SEO se sigue generando**, pero desde
`app/pages/personas/[slug].vue`, a partir del nombre y el cargo.

El texto de «Acerca de» es el campo `resena`: texto corriente, con los párrafos
separados por una línea en blanco. No hace falta saber markdown.

La sección Personas es **exclusivamente para miembros del Departamento**:
profesores de jornada completa, profesores part-time, apoyos académicos y
auxiliares de laboratorio, y administrativos. No es un directorio general.

El campo `categoria` decide en qué pestaña de `/personas` aparece cada persona, y
solo acepta cuatro valores:

| `categoria` | Pestaña |
|---|---|
| `jornada` | Profesores Jornada Completa |
| `parttime` | Profesores Part-time |
| `apoyo` | Apoyos Académicos y Auxiliares de Laboratorio |
| `administrativos` | Administrativos |

`cargo` y `categoria` tienen valor por defecto a propósito. Una ficha recién
creada aparece en la web enseguida, en la pestaña de jornada completa y con un
cargo «por completar». Es preferible a que desaparezca sin motivo visible: Nuxt
Content **descarta en silencio** todo fichero que no cumpla el esquema, sin error
ni aviso.

**Si aun así una persona no aparece:**

1. Falta `nombre`, que es el único campo sin valor por defecto.
2. `categoria` tiene un valor distinto de esos cuatro.
3. Se publicó desde Studio pero el sitio no se ha recompilado todavía. Ver §5.

Las etiquetas de las pestañas están en `app/utils/personas.ts`. Añadir una
categoría nueva exige tocar ese fichero **y** el `enum` de `content.config.ts`:
cambiar solo uno de los dos rompe el sitio.

### 3.2. `content/paginas/*.yml` — una página por fichero

El contenido de casi todas las páginas está en YAML, con una colección propia por
página. Ficheros disponibles:

```
departamento.yml        estudios.yml           pregrado.yml
postgrado.yml           educacion-continua.yml asignaturas.yml
investigacion.yml       laboratorios.yml       campus.yml
oportunidades.yml       sitios-estudiantiles.yml
vinculacion.yml         contacto.yml
```

**Inicio (`/`) no es editable**, por decisión expresa: su carrusel y su
composición son estructura, no contenido.

Por qué YAML y una colección por página, y no una sola colección genérica: Studio
genera el formulario de edición **a partir del esquema**. Con colecciones
separadas, el menú del editor queda como un espejo del sitio y cada campo se llama
como la cosa que edita («Períodos de la historia», «Laboratorios»). Con una
colección genérica de «secciones» el formulario sería una lista de cajas llamadas
`seccion` y `elemento`, sin relación visible con la web. La diferencia importa
porque quien edita no es programador.

### 3.3. `datos/noticias/` — fuera del editor a propósito

Las noticias del carrusel de Inicio **no se editan a mano**. Están pensadas para
alimentarse solas desde las redes sociales del Departamento mediante API.

Studio solo gestiona `content/`, así que la colección apunta a `datos/noticias/`
mediante el `cwd` de su `source` en `content.config.ts`. Eso las mantiene fuera
del editor sin dejar de renderizarlas.

Cuando se implemente la integración, debe escribir en `datos/noticias/*.md`
respetando el esquema (`titulo`, `fecha`, `red`, `url`, `imagen`) y hacer commit;
el autodespliegue se encarga del resto.

### 3.4. Lo que sigue en código, y por qué

| Dónde | Qué | Por qué no es editable |
|---|---|---|
| `app/utils/areas.ts` | Las 7 áreas del Departamento: id, nombre, icono | Los identificadores los referencian las fichas de personas. Cambiarlos desde un formulario rompería esas referencias en silencio. La **descripción** de cada área sí se edita, en `investigacion.yml` |
| `app/utils/navigation.ts` | Menú principal y submenús | Estructura de navegación, no contenido |
| `app/utils/personas.ts` | Etiquetas de las 4 categorías | Acopladas al `enum` del esquema |
| `app/pages/index.vue` | Inicio | Excluido por decisión |
| `app/pages/contacto.vue` | Lógica del formulario | Es comportamiento. Los **datos de contacto** de la barra lateral sí se editan |

---

## 4. El editor (Nuxt Studio)

### 4.1. Qué es

Studio dejó de ser una plataforma alojada en `nuxt.studio` y ahora es un módulo
autoalojado. El editor se sirve **desde este mismo servidor**, en `/_studio`, y al
publicar hace *commit* contra el repositorio de GitHub.

### 4.2. Entrar

```
Editores:    https://dimec.pollomongoliano.cc/entrar
Mantenedor:  https://dimec.pollomongoliano.cc/_studio
```

La primera es usuario y contraseña, gestionadas desde la máquina, y **no requiere
cuenta de GitHub**. La segunda es OAuth de GitHub y existe para quien administra
el repositorio. Ambas dejan la misma sesión y abren el mismo editor: tras entrar,
la interfaz de Studio aparece sobre el propio sitio. Detalle en §4.4.

### 4.3. Configuración

En `nuxt.config.ts`, bloque `studio`:

- `repository` — a qué repositorio y rama se hace commit. `private: false` porque
  el repo es público, lo que hace que el login pida solo el permiso
  `public_repo`. **Si el repositorio se vuelve privado hay que poner
  `private: true`**, o la API de GitHub responderá 404 al publicar: un token sin
  permiso no distingue entre «no existe» y «no puedes verlo».
- `editor` — se ocultan las herramientas de código (bloques de código, líneas
  horizontales, vídeo, inserción de componentes) y el selector de iconos se limita
  a `lucide`, que es la familia que usa el sitio.

### 4.4. Quién entra, y cómo

Hay **tres puertas**. Todas terminan llamando a `setStudioUserSession`, que es
quien adjunta el token de escritura del servidor: por eso **ningún editor
necesita cuenta de GitHub**, entre por donde entre.

#### a) Cuenta propia — la que está en uso hoy

```
https://dimec.pollomongoliano.cc/entrar
```

Usuario y contraseña, gestionados desde la máquina. Es un **puente**: existe
porque registrar la aplicación en Entra ID requiere permisos de administrador del
inquilino de la USM, que hay que pedir a la DTI.

Las cuentas viven en `C:\dimec\editores.json`, fuera del repositorio, con la
contraseña hasheada con **scrypt**. Se gestionan con:

```bash
cd C:\dimec\src
bun run editor           # listar
bun run editor agregar   # crear cuenta o cambiar contraseña
bun run editor quitar    # eliminar
```

Tras cualquier cambio hay que reiniciar el sitio.

Tres medidas que no son opcionales teniendo un formulario expuesto a internet, y
que conviene no quitar:

- **scrypt** en vez de un hash rápido: hace inviable probar contraseñas en masa
  si el fichero se filtrara.
- **Bloqueo de 15 minutos tras 5 fallos**, en memoria. Reiniciar el servidor
  limpia los bloqueos.
- **Comparación en tiempo constante**, y se calcula un hash señuelo aunque el
  usuario no exista: si no, la diferencia de tiempo revelaría qué usuarios son
  reales.

**No hay recuperación de contraseña.** No hay correo de reseteo: si alguien la
olvida, se le asigna una nueva con `bun run editor agregar`. Manejable para unos
pocos editores; no lo sería para decenas.

#### b) Cuenta institucional Microsoft — pendiente de la DTI

```
https://dimec.pollomongoliano.cc/api/entrar/microsoft
```

La ruta está escrita y probada, a la espera de que se pueda registrar la
aplicación en Entra ID. Cuando exista, es rellenar `MS_TENANT_ID`,
`MS_CLIENT_ID`, `MS_CLIENT_SECRET` y `EDITORES`, y se puede dejar de repartir
cuentas propias.

La ruta es propia (`server/api/entrar/microsoft.get.ts`) y no el proveedor SSO
que trae nuxt-studio, por dos razones concretas:

1. Ese proveedor tiene las direcciones OIDC fijas como `<servidor>/oauth/authorize`,
   `/oauth/token` y `/oauth/userinfo`. Entra ID usa `/oauth2/v2.0/authorize` y
   sirve el perfil desde `graph.microsoft.com`, otro dominio. No encajan.
2. Ese proveedor **no tiene lista de permitidos**. Con el inquilino de la USM
   entraría cualquiera con correo de la universidad, estudiantes incluidos.

La lista de editores es `EDITORES` y **falla cerrada**: sin lista, no entra nadie.

#### c) GitHub — para quien administra el repositorio

Se conserva la ruta nativa `/_studio` con OAuth de GitHub. Útil para el
mantenedor. Ojo con la diferencia de comportamiento entre las dos:

```js
// GitHub (nativo)  — falla ABIERTO
if (moderators.length > 0 && !moderators.includes(email)) → 403

// Microsoft (propio) — falla CERRADO
if (!editores.includes(correo)) → 403
```

Si `STUDIO_GITHUB_MODERATORS` se deja vacía, **cualquier cuenta de GitHub entra**.
Compara contra el correo **primario** de GitHub.

#### Variables

Viven **fuera del repositorio**, en `C:\dimec\studio.env.ps1`, que carga
`iniciar-dimec.ps1` antes de arrancar el servidor:

| Variable | Para qué |
|---|---|
| `STUDIO_GITHUB_TOKEN` | Token con el que se publican **todos** los cambios. Sin él se entra pero no se publica |
| `EDITORES_FICHERO` | Opcional: otra ruta para las cuentas propias. Por defecto `C:dimeceditores.json` |
| `MS_TENANT_ID` / `MS_CLIENT_ID` / `MS_CLIENT_SECRET` | Registro de aplicación en Entra ID |
| `EDITORES` | Correos `usm.cl` autorizados, separados por comas |
| `STUDIO_GITHUB_CLIENT_ID` / `..._SECRET` | OAuth App de GitHub (puerta del mantenedor) |
| `STUDIO_GITHUB_MODERATORS` | Correos autorizados por la puerta de GitHub |

Direcciones de redirección que hay que declarar:

```
Entra ID:  https://dimec.pollomongoliano.cc/api/entrar/microsoft
GitHub:    https://dimec.pollomongoliano.cc/__nuxt_studio/auth/github
```

**La autoría en git se pierde con la puerta de Microsoft**: todos los commits
llevan la firma del dueño del `STUDIO_GITHUB_TOKEN`, no de quien editó.

### 4.5. El parche a nuxt-studio

Dos cosas del editor no son configurables porque están incrustadas en su código
compilado: el selector de formato al crear un archivo y los textos de los
botones. Se resolvieron con un **parche persistente de bun**.

```
patches/nuxt-studio@1.7.0.patch     el parche (4,2 MB, ver más abajo)
package.json → patchedDependencies  lo registra
```

No es editar `node_modules` a mano: bun reaplica el parche en cada instalación.
Comprobado borrando `node_modules` entero y reinstalando desde cero.

**Qué cambia**, todo dentro de `dist/app/`:

| Antes | Después |
|---|---|
| `KO=[wO.Markdown,wO.YAML,wO.YML,wO.JSON]` | `KO=[wO.YML]` |
| `default:qt(wO).Markdown` | `default:qt(wO).YML` |
| `"createDocument":"Nuevo archivo"` | `"Agregar funcionario"` |
| `"createDocument":"Crear un nuevo archivo"` | `"Agregar un funcionario nuevo"` |
| `"fileName":"Nombre del archivo"` | `"nombre-apellido"` |

Se filtra la **lista** `KO`, no el enum `wO`: cada valor del enum se referencia
7-8 veces en el bundle y quitarlos rompería el editor.

**Tres cosas que hay que tener presentes:**

1. **Los textos son globales, no por colección.** El botón dirá «Agregar
   funcionario» también en Páginas. Se aceptó porque las páginas son ficheros
   fijos y nadie crea páginas nuevas; el único sitio donde se crea de verdad es
   Personas.
2. **Al actualizar `nuxt-studio` el parche puede no aplicar.** Entonces la
   instalación **falla con un error**, no se aplica a medias en silencio. Hay que
   rehacerlo: `bun patch nuxt-studio`, repetir las sustituciones de la tabla, y
   `bun patch --commit node_modules/nuxt-studio`.
3. **El fichero pesa 4,2 MB** porque el bundle está minificado en una sola línea
   y el diff arrastra la línea entera. Es feo pero inevitable.

Lo que sí es configuración y no parche: el idioma español, con
`studio.i18n.defaultLocale`. El módulo trae la traducción completa y por defecto
sale en inglés.

**El endpoint `/__nuxt_studio/auth/session` devuelve el `accessToken` de la
sesión** a quien esté identificado. Con la puerta de cuentas propias eso es el
`STUDIO_GITHUB_TOKEN` del servidor: cualquier editor puede extraerlo. Es diseño
del módulo. Por eso el token debe tener el alcance mínimo (`public_repo`, o
*fine-grained* limitado a este repositorio) y por eso importa quién está en la
lista de editores.

**El endpoint `/__nuxt_studio/auth/session` devuelve el `accessToken` de la
sesión** a quien esté identificado. Con la puerta de cuentas propias eso es el
`STUDIO_GITHUB_TOKEN` del servidor: cualquier editor puede extraerlo. Es diseño
del módulo. Por eso el token debe tener el alcance mínimo (`public_repo`, o
*fine-grained* limitado a este repositorio) y por eso importa quién está en la
lista de editores.

### 4.6. Cuentas y permisos

Las cuentas se gestionan desde **`/administrar`**, visible solo para quien tenga
el rol `admin`. Sustituye al script `bun run editor`, que obligaba a entrar por
consola a la máquina; el script sigue existiendo como salida de emergencia si
alguna vez nadie puede entrar.

Cada cuenta tiene:

| Campo | Para qué |
|---|---|
| `rol` | `admin` gestiona cuentas; `editor` no |
| `ficha` | Qué perfil de Personas le corresponde, p. ej. `jornada/nombre-apellido-1` |

Dos salvaguardas impiden dejar el sistema sin quien lo gobierne: nadie puede
quitarse a sí mismo el rol de administrador ni borrar su propia cuenta, y no se
puede eliminar la última cuenta con permisos de administración. Sin ellas habría
que reparar el JSON a mano en el servidor.

#### Lo que el rol NO controla

**El rol decide quién gestiona cuentas, no qué puede editar cada persona.**

Nuxt Studio publica llamando a `https://api.github.com` **desde el navegador**,
con el token en la sesión. Cualquiera que entre al editor puede leer ese token
—está en `/__nuxt_studio/auth/session`— y escribir en cualquier fichero del
repositorio. Un permiso por carpeta implementado en esta aplicación sería
decorativo: se vería aplicado y se saltaría abriendo las herramientas del
navegador.

Para que fuese real habría que **interponer el servidor**: parchear Studio para
que su URL base apunte a un endpoint propio en vez de a la API de GitHub, y que
ese endpoint compruebe el usuario de la sesión contra el fichero que intenta
escribir antes de reenviar la petición con el token, que dejaría de salir del
servidor. Es un proyecto en sí mismo —hay que cubrir todas las llamadas que
Studio hace: referencias, árboles, blobs, commits— y cualquiera que se escape
rompe la publicación.

Mientras tanto: la lista de cuentas es la barrera real. Quien está dentro puede
tocarlo todo.

### 4.7. Por qué no PocketBase ni Firebase

Se evaluaron al plantear la gestión de usuarios y se descartaron:

- **Firebase** exige crear el proyecto desde la consola de Google con una cuenta
  propia. No se puede automatizar desde aquí.
- **PocketBase** sí es instalable —un binario con SQLite y panel propio— pero
  añade un servicio más corriendo en el mismo PC, otro puerto y otra cosa que
  mantener viva, **y no resuelve el problema**: la limitación está en cómo
  publica Studio, no en dónde se guardan los usuarios.

Las cuentas viven en `C:dimeceditores.json`, fuera del repositorio, con las
contraseñas hasheadas con scrypt. Para un puñado de editores es suficiente y no
añade infraestructura.

### 4.8. Permisos por fichero (pendiente)

Está previsto dar acceso a profesores para editar **solo su propia ficha**, y a
otras personas para editar las páginas generales.

Hoy la lista `EDITORES` es **plana**: quien está en ella puede editarlo todo,
incluidas las fichas de los demás.

Dos cosas ya están preparadas para cuando se implemente:

1. **Cada persona es un fichero independiente** en `content/personas/`. Es la
   pieza que hace viable el permiso por persona; si todas vivieran en un único
   YAML no habría forma de separar el acceso.
2. **Todas las escrituras pasan por un único token del servidor**, no por
   credenciales de cada usuario. Eso permite interceptar el guardado y comparar
   el correo de la sesión con el fichero que se intenta tocar — algo imposible
   cuando cada quien empujaba con su propio token de GitHub.

El punto donde engancharlo es `setStudioUserSession`, en
`server/api/entrar/microsoft.get.ts`: ahí se decide qué se guarda en la sesión.

---

## 5. Despliegue

### 5.1. El ciclo completo

```
editar en /_studio  →  commit a GitHub  →  vigilante detecta  →  recompila  →  visible
```

Studio **no toca el servidor**: solo hace commit. Si el sitio no se recompila, el
cambio no aparece y Studio se queda mostrando «Waiting for deployment». En
plataformas como Vercel eso lo resuelve el CI; aquí lo resuelve una tarea
programada.

### 5.2. Directorios en la máquina

```
C:\dimec\src\              código fuente y compilación (este repositorio)
C:\dimec\.output\          lo que sirve el servidor: una COPIA del build
C:\dimec\.output.anterior\ build previo, para volver atrás
```

**Los dos primeros tienen que estar separados.** El servidor mantiene abierto
`.output\server\contents.sqlite` mientras corre; si se compilara sobre el mismo
directorio desde el que sirve, `bun run build` fallaría al limpiar su salida con
`EBUSY: resource busy or locked`, dejando el sitio vivo solo hasta el siguiente
reinicio.

### 5.3. Scripts

| Script | Qué hace |
|---|---|
| `C:\dimec\desplegar.ps1` | `git pull` → `bun install` → `bun run build` → respalda → para → copia → arranca → verifica |
| `C:\dimec\vigilar-repo.ps1` | Compara el commit local con `origin/main`; si difieren, llama a `desplegar.ps1` |
| `C:\dimec\iniciar-dimec.ps1` | Arranca el servidor. Lo invoca la tarea al iniciar Windows |

Despliegue manual:

```powershell
powershell -ExecutionPolicy Bypass -File C:\dimec\desplegar.ps1
```

Con `-SinPull` compila lo que ya hay sin traer cambios de git.

Si algo falla, el script **no toca lo publicado** e imprime los comandos para
volver al build anterior.

### 5.4. Tareas programadas

| Tarea | Cuándo | Qué |
|---|---|---|
| `DIMEC web` | Al iniciar Windows | Arranca el servidor Node |
| `DIMEC autodespliegue` | Cada 2 minutos | Vigila GitHub y redespliega |

Ambas corren como `SYSTEM`. Eso obliga a tres cosas que no son obvias:

- `git config --system safe.directory C:/dimec/src`, o git rechaza operar sobre un
  repositorio cuyo propietario es otro usuario.
- `bun` se instala con winget dentro del perfil de `hp` y solo entra en el PATH de
  ese usuario, así que `desplegar.ps1` lo **resuelve por ruta absoluta**. Si se
  reinstala bun en otro sitio, hay que actualizar esa lista de rutas.
- **La salida de bun va siempre a fichero, nunca a la tubería del proceso padre.**
  Esto no es cosmético: sin redirigir, nadie consume esa tubería, el búfer del
  sistema se llena y el proceso queda bloqueado escribiendo, con 0 % de CPU,
  indefinidamente. Ocurrió dos veces (25 y 6 minutos sin avanzar) antes de
  identificarlo. Ejecutado a mano no pasa, porque la consola vacía la salida.

Por eso hay **límites de tiempo en dos capas**: 10 minutos para las dependencias
y 20 para compilar dentro de `desplegar.ps1`, y 30 para el despliegue completo
dentro de `vigilar-repo.ps1`. Al vencerse se mata el árbol de procesos con
`taskkill /T` y se anota el fallo. Sin el límite exterior, un bloqueo dejaría la
tarea «en ejecución» para siempre y, con `MultipleInstances=IgnoreNew`, todos los
disparos siguientes se descartarían en silencio: el autodespliegue moriría sin
que nadie se enterara.

Dos trampas de PowerShell 5.1 que costaron un rato y conviene no reintroducir:

- `Start-Process -PassThru` **no rellena `ExitCode`** salvo que se acceda antes a
  `$p.Handle`. Sin eso, un comando correcto se da por fallido.
- `$proceso.Kill($true)` para matar el árbol de procesos **no existe** en esta
  versión: es de .NET moderno. Hay que usar `taskkill /T /F`.

Registro del autodespliegue: `C:\dimec\autodespliegue.log`. Solo escribe cuando
ocurre algo; el silencio significa que no había nada nuevo.

---

## 6. Red y seguridad

```
internet → Cloudflare → túnel cloudflared → 127.0.0.1:3000 (Node)
```

- El servidor Node escucha **solo en loopback**. Ni la LAN ni Tailscale llegan a
  él directamente.
- No hay ningún puerto abierto en el router. `cloudflared` establece una conexión
  saliente; la casa no queda expuesta.
- El servicio de Windows `Cloudflared` mantiene el túnel, con arranque automático.
  Su configuración está en
  `C:\Windows\System32\config\systemprofile\.cloudflared\config.yml` y el
  `binPath` del servicio incluye `--config ... tunnel run` a mano: `cloudflared
  service install` **instala el servicio sin argumentos** y el túnel no conecta
  (error 1033). Si alguna vez se reinstala, hay que rehacerlo.
- El cortafuegos de Windows está activo en los tres perfiles con entrada
  bloqueada por defecto.

`robots.txt` bloquea la indexación. Es deliberado: el contenido todavía es de
plantilla («nombre-apellido-1», «Título de la publicación») y el sitio lleva la
identidad visual de la USM, así que podría confundirse con el oficial. **Para
abrirlo a los buscadores, deja `Disallow:` vacío** en `public/robots.txt`.

---

## 7. bun, y por qué no npm

El proyecto usa **bun**, y `bun.lock` va versionado.

`@nuxt/content` declara `better-sqlite3 ^12.5.0` como *peer* opcional mientras el
proyecto usa `^13.0.3`. npm aborta ante ese conflicto salvo que se le pase
`--legacy-peer-deps`; bun lo resuelve sin ayuda. La versión 13 es la que corre en
producción sin incidencias.

**No mezclar gestores.** Si un `npm install` deja un `package-lock.json` suelto,
está en `.gitignore` para que no convivan dos lockfiles describiendo árboles
distintos — un lockfile desincronizado rompe instalaciones en silencio.

---

## 8. Diagnóstico rápido

**Un cambio publicado en Studio no aparece**
Mira `C:\dimec\autodespliegue.log`. Si está vacío, la tarea no detectó nada:
comprueba que el commit llegó a `origin/main`. Si hay un fallo anotado, ahí está
el motivo. Para forzar: ejecuta `desplegar.ps1` a mano.

**Una persona no aparece en `/personas`**
Revisa que tenga `nombre` (el único campo sin valor por defecto) y que su
`categoria`, si está puesta, sea uno de los cuatro valores válidos. Un fichero que
no cumple el esquema se descarta sin avisar. Para ver qué ingirió realmente el
sitio, consulta `.output\server\contents.sqlite`:

```js
import Database from 'better-sqlite3'
const db = new Database('C:/dimec/.output/server/contents.sqlite', { readonly: true })
console.log(db.prepare('SELECT title, cargo, categoria FROM _content_personas').all())
```

**`/_studio` da 404**
No hay ningún proveedor de autenticación configurado: falta
`STUDIO_GITHUB_CLIENT_ID` en `studio.env.ps1`, o el servidor no se reinició
después de ponerlo.

**Publicar da 404 de la API de GitHub**
El token no ve el repositorio. Si el repo pasó a privado, hay que poner
`private: true` en la configuración de `studio` y volver a autenticarse.

**403 al entrar en Studio**
El correo autenticado no está en `STUDIO_GITHUB_MODERATORS`. Tiene que ser el
correo **primario** de la cuenta de GitHub.

**El build falla con `EBUSY ... contents.sqlite`**
Se está compilando sobre el directorio desde el que sirve el servidor. Usa
`desplegar.ps1`, que para el sitio antes de tocar `.output`.

---

## 9. Estado del contenido

Buena parte del contenido es **de plantilla** y hay que reemplazarlo:

- Las 12 personas se llaman «Nombre Apellido»
- Las 4 noticias se titulan «Título de la publicación»
- El catálogo de asignaturas es de ejemplo (`IWM000`…)
- Los datos de contacto dicen «Completar…»
- Misión, Visión y Vinculación con el medio están vacías
- Faltan las imágenes de cabecera: cada página las espera en
  `public/cabeceras/<pagina>.jpg` y hay un comentario en cada plantilla indicando
  cómo enlazarlas
- Las URL de sitios estudiantiles están sin confirmar

Mientras siga así, conviene mantener el `robots.txt` como está.
