export default defineAppConfig({
  ui: {
    // Nuxt UI necesita una paleta completa (tonos del 50 al 900) para el color 'primary'. 
    // Por ahora, le asignaremos el azul estándar más parecido para los componentes interactivos.
    primary: 'sky', 
    gray: 'slate',
    
    // Aquí puedes forzar que ciertos componentes usen tus colores institucionales por defecto
    button: {
      default: {
        color: 'gray'
      }
    }
  }
})