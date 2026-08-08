import { navigationLinks } from './navigation'

export interface Miga {
  label: string
  /** Sin `to` es el último tramo: la página actual, sin enlace */
  to?: string
}

/** Etiqueta de una ruta según el menú */
function etiquetaDeRuta(ruta: string): string | undefined {
  for (const l of navigationLinks) {
    if (l.to === ruta) return l.label
    for (const h of l.hijos ?? []) {
      if (h.to === ruta) return h.label
    }
  }
}

/** Entrada del menú que contiene esta ruta como hija (p. ej. /pregrado → Estudios) */
function padreEnElMenu(ruta: string): Miga | undefined {
  for (const l of navigationLinks) {
    if (l.to === ruta) continue
    if ((l.hijos ?? []).some(h => h.to === ruta)) return { label: l.label, to: l.to }
  }
}

/**
 * Construye la ruta de navegación real:
 *   /personas/juan-perez → Inicio › Personas › Juan Pérez
 *   /pregrado            → Inicio › Estudios › Pregrado
 *
 * `padre` permite declararlo a mano en páginas que no cuelgan del menú. Acepta
 * varios tramos porque la ficha de una persona necesita dos:
 *   Inicio » Personas » Profesores Jornada Completa » Nombre Apellido
 */
export function construirMigas(ruta: string, titulo: string, padre?: Miga | Miga[]): Miga[] {
  const migas: Miga[] = [{ label: 'Inicio', to: '/' }]
  const segmentos = ruta.split('/').filter(Boolean)

  if (padre) {
    migas.push(...(Array.isArray(padre) ? padre : [padre]))
  } else if (segmentos.length > 1) {
    // Ruta anidada: el primer segmento es la sección contenedora
    const rutaPadre = `/${segmentos[0]}`
    migas.push({ label: etiquetaDeRuta(rutaPadre) ?? segmentos[0]!, to: rutaPadre })
  } else {
    const enMenu = padreEnElMenu(ruta)
    if (enMenu) migas.push(enMenu)
  }

  migas.push({ label: titulo })
  return migas
}
