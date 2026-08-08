// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/ui', '@nuxt/content', 'nuxt-studio'],
  css: ['~/assets/css/main.css'],
  // Edición desde el propio sitio, en /_studio. Studio dejó de ser la plataforma
  // alojada en nuxt.studio y pasó a ser un módulo autoalojado: el editor se sirve
  // desde este servidor y publica haciendo commit al repositorio.
  //
  // Sustituye a la configuración anterior (content.preview.api), que apuntaba a
  // la API de la plataforma antigua y ya no interviene.
  studio: {
    route: '/_studio',
    repository: {
      provider: 'github',
      owner: 'simonxD',
      repo: 'pagina-dimec',
      branch: 'main',
      // El repositorio es publico, asi que basta el scope 'public_repo' y el
      // token que emite GitHub no alcanza ningun repositorio privado de la
      // cuenta. Con private: true pediria 'repo', que da acceso a todos.
      //
      // Si algun dia se vuelve privado hay que poner private: true, o la API
      // respondera 404 al buscar la rama: un token sin permiso no distingue
      // entre "no existe" y "no puedes verlo".
      private: false,
      // Studio calcula su direccion base como `${instanceUrl}/api/v3` cuando el
      // host no es github.com: es la via prevista para GitHub Enterprise. Se
      // aprovecha para que todas sus llamadas pasen por el proxy de este mismo
      // servidor, que comprueba permisos y anade el token real.
      //
      // Sin esto, el navegador hablaria directo con la API de GitHub y cualquier
      // permiso seria decorativo.
      instanceUrl: 'https://dimec.pollomongoliano.cc/git'
    },
    // El editor lo va a usar gente del Departamento, no desarrolladores. Se
    // recortan las herramientas que solo tienen sentido escribiendo codigo o
    // maquetando: bloques de codigo, lineas horizontales, video incrustado e
    // insercion de componentes Vue. Dejarlas visibles invita a romper el
    // formato del sitio sin darse cuenta.
    // El editor lo usa gente del Departamento, en espanol. El modulo trae los
    // textos traducidos; sin esto sale en ingles ("New file", "Page settings").
    i18n: {
      defaultLocale: 'es'
    },
    editor: {
      commands: {
        exclude: ['codeBlock', 'code', 'horizontalRule', 'video', 'style', 'insert']
      },
      components: {
        exclude: ['*']
      },
      // El sitio usa iconos de lucide. Limitar el selector evita elegir uno de
      // otra familia que luego no se muestre.
      iconLibraries: ['lucide']
    }
  },
  // El sitio institucional no tiene modo oscuro. Desactivarlo por completo evita
  // que el fondo salga oscuro si el sistema del visitante lo prefiere así.
  ui: {
    colorMode: false
  },
  // Precomprime CSS, JS y SVG. Sin esto el servidor los sirve en crudo: la hoja
  // de estilos son 212 KB que bloquean el pintado (~1,4 s en móvil simulado).
  nitro: {
    compressPublicAssets: { gzip: true, brotli: true }
  },
  // Empaqueta en el cliente los iconos detectados en el código fuente,
  // para que no se pidan al vuelo tras la hidratación.
  icon: {
    clientBundle: {
      // Los patrones por defecto no incluyen .ts/.js, donde vive la navegación.
      scan: {
        globInclude: ['**/*.{vue,jsx,tsx,js,ts,md,mdc,mdx,yml,yaml}']
      }
    }
  }
})
