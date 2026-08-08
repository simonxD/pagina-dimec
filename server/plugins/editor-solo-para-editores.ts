/**
 * No enviar el editor a quien solo viene a leer.
 *
 * nuxt-studio anade a cada pagina cinco enlaces <link rel="prefetch"> que suman
 * unos 760 KB, de los cuales 747 KB son el bundle del editor: Monaco, Shiki para
 * resaltado de sintaxis, MDC y TipTap. Medido sobre la portada en produccion.
 *
 * Al ser `prefetch` y no `modulepreload` no bloquean el renderizado, y por eso
 * las notas de Lighthouse salian bien igualmente (89 movil, 99 escritorio). Pero
 * el navegador acaba descargandolos en cuanto queda ocioso, asi que cualquier
 * visitante paga 760 KB de datos por un editor que no va a abrir jamas. En una
 * conexion movil eso si se nota.
 *
 * La comprobacion se hace con la cookie `studio-session-check`, que el propio
 * modulo emite junto a la sesion. No se usa `studio-session` porque esa es
 * httpOnly y cifrada: aqui solo hace falta saber si hay sesion o no, no quien es.
 * Si alguien se inventa la cookie, lo unico que consigue es descargarse el
 * editor; sin sesion valida no puede editar nada.
 */
export default defineNitroPlugin((nitro) => {
  nitro.hooks.hook('render:html', (html, { event }) => {
    const tieneSesion = Boolean(
      getCookie(event, 'studio-session-check') || getCookie(event, 'studio-session')
    )
    if (tieneSesion) return

    // Los enlaces vienen en `head` como cadenas sueltas, y una misma cadena
    // puede contener varias etiquetas. Por eso se filtra dentro de cada una en
    // vez de descartar la entrada entera.
    html.head = html.head.map(entrada =>
      entrada.replace(/<link[^>]*rel="prefetch"[^>]*>/g, '')
    )
  })
})
