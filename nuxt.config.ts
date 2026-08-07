// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/ui', '@nuxt/content'],
  css: ['~/assets/css/main.css'],
  // Habilita la edición desde nuxt.studio. Studio se conecta al repositorio de
  // GitHub del proyecto y escribe sobre los archivos de content/.
  content: {
    preview: {
      api: 'https://api.nuxt.studio'
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
