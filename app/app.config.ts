export default defineAppConfig({
  ui: {
    colors: {
      // Escala definida en app/assets/css/main.css.
      // Antes era 'green': el texto blanco sobre el verde por defecto
      // solo llegaba a 2,2:1 de contraste y Lighthouse lo marcaba.
      primary: 'usm',
      // Color de los grises (fondos, bordes, texto secundario).
      // Alternativas: slate, gray, zinc, neutral, stone.
      neutral: 'slate'
    }
  }
})
