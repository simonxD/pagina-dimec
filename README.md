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

Markdown con frontmatter. Cada fichero es una persona del Departamento y genera
su página en `/personas/<nombre-del-fichero>`.

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

**Si una persona no aparece en la web, la causa es casi siempre una de estas tres:**

1. `categoria` tiene un valor distinto de esos cuatro. Nuxt Content valida cada
   fichero contra el esquema y **descarta en silencio** los que no cumplen: no hay
   error visible, la persona simplemente no existe para el sitio.
2. Falta un campo obligatorio (`nombre`, `cargo` o `categoria`). Mismo efecto.
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

`https://dimec.pollomongoliano.cc/_studio` → login con GitHub.

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

### 4.4. Credenciales

Viven **fuera del repositorio**, en `C:\dimec\studio.env.ps1`, que carga
`iniciar-dimec.ps1` antes de arrancar el servidor:

| Variable | Para qué |
|---|---|
| `STUDIO_GITHUB_CLIENT_ID` | OAuth App de GitHub |
| `STUDIO_GITHUB_CLIENT_SECRET` | OAuth App de GitHub |
| `STUDIO_GITHUB_MODERATORS` | Correos autorizados, separados por comas |

**`STUDIO_GITHUB_MODERATORS` es la única barrera de acceso.** El módulo solo
aplica el filtro si la variable tiene contenido: si se deja vacía, cualquier
persona con cuenta de GitHub puede autenticarse en el panel de un sitio público.
Compara contra el correo **primario** de GitHub, no contra los secundarios.

La OAuth App usa como callback:

```
https://dimec.pollomongoliano.cc/__nuxt_studio/auth/github
```

### 4.5. Permisos por usuario (pendiente)

Está previsto dar acceso a profesores para editar **solo su propia ficha**, y a
otras personas para editar las páginas generales.

El módulo trae autenticación (GitHub, GitLab, Google, SSO) pero **la lista blanca
es plana**: no distingue quién puede tocar qué. No hay permisos por carpeta de
fábrica.

Lo que ya está preparado para ello: cada persona es **un fichero independiente**
en `content/personas/`. Esa es la pieza que hace viable el permiso por persona —
si todas vivieran en un único YAML no habría forma de separar el acceso. Para
implementarlo habrá que añadir una capa propia sobre la sesión de Studio que
compare el usuario autenticado con el fichero que intenta guardar.

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

Ambas corren como `SYSTEM`. Eso obliga a dos cosas que no son obvias:

- `git config --system safe.directory C:/dimec/src`, o git rechaza operar sobre un
  repositorio cuyo propietario es otro usuario.
- `bun` se instala con winget dentro del perfil de `hp` y solo entra en el PATH de
  ese usuario, así que `desplegar.ps1` lo **resuelve por ruta absoluta**. Si se
  reinstala bun en otro sitio, hay que actualizar esa lista de rutas.

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
Revisa su `categoria` contra los cuatro valores válidos y que tenga `nombre` y
`cargo`. Un fichero que no cumple el esquema se descarta sin avisar. Para ver qué
ingirió realmente el sitio, consulta `.output\server\contents.sqlite`.

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
