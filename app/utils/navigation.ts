import { areas } from './areas'

export interface SubEnlace {
  label: string
  to: string
}

export interface EnlaceNav {
  label: string
  to: string
  icon?: string
  /** Si tiene hijos, se despliega un submenú al pasar el cursor */
  hijos?: SubEnlace[]
}

export const navigationLinks: EnlaceNav[] = [
  { label: 'Inicio', to: '/', icon: 'i-lucide-home' },
  {
    label: 'Departamento',
    to: '/departamento',
    icon: 'i-lucide-building-2',
    hijos: [
      { label: 'Quiénes somos', to: '/departamento' },
      { label: 'Misión y visión', to: '/departamento#mision' },
      { label: 'Nuestra historia', to: '/departamento#historia' }
    ]
  },
  { label: 'Personas', to: '/personas', icon: 'i-lucide-users' },
  {
    label: 'Estudios',
    to: '/estudios',
    icon: 'i-lucide-graduation-cap',
    hijos: [
      { label: 'Pregrado', to: '/pregrado' },
      { label: 'Postgrado', to: '/postgrado' },
      { label: 'Educación continua', to: '/educacion-continua' }
    ]
  },
  {
    label: 'Investigación',
    to: '/investigacion',
    icon: 'i-lucide-flask-conical',
    // Las siete áreas del Departamento, desde app/utils/areas.ts
    hijos: areas.map(a => ({ label: a.nombre, to: `/investigacion#${a.id}` }))
  },
  { label: 'Laboratorios', to: '/laboratorios', icon: 'i-lucide-microscope' },
  { label: 'Vinculación', to: '/vinculacion', icon: 'i-lucide-handshake' }
]
