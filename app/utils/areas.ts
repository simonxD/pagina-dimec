export interface Area {
  id: string
  nombre: string
  /** Icono de lucide.dev que representa el área */
  icon: string
}

/** Las siete áreas del departamento, en el orden en que se muestran. */
export const areas: Area[] = [
  { id: 'termicos', nombre: 'Procesos Térmicos', icon: 'i-lucide-flame' },
  { id: 'fluidos', nombre: 'Mecánica de Fluidos', icon: 'i-lucide-waves' },
  { id: 'renovables', nombre: 'Energías Renovables', icon: 'i-lucide-wind' },
  { id: 'produccion', nombre: 'Ingeniería de Métodos y Gestión de la Producción', icon: 'i-lucide-factory' },
  { id: 'mantenimiento', nombre: 'Ingeniería y Gestión del Mantenimiento', icon: 'i-lucide-wrench' },
  { id: 'mecatronica', nombre: 'Mecatrónica', icon: 'i-lucide-bot' },
  { id: 'solidos', nombre: 'Diseño de Máquinas y Mecánica de Sólidos', icon: 'i-lucide-cog' }
]
