<script setup lang="ts">
/**
 * Gestión de las cuentas que pueden editar el sitio.
 *
 * Sustituye al script `bun run editor`, que obligaba a entrar por consola a la
 * máquina. Solo la ven los administradores; el servidor lo comprueba en cada
 * petición, así que ocultar el enlace no es la protección, solo la cortesía.
 */
definePageMeta({ layout: 'default' })

useSeoMeta({
  title: 'Cuentas',
  description: 'Gestión de las cuentas que pueden editar el sitio.',
  robots: 'noindex, nofollow'
})

interface Cuenta {
  usuario: string
  nombre: string
  correo: string
  rol: 'admin' | 'editor'
  ficha: string
}

const peticion = useRequestFetch()
const { data: cuentas, refresh, error } = await useAsyncData('cuentas', () =>
  peticion<Cuenta[]>('/api/cuentas')
)

const vacio = { usuario: '', nombre: '', correo: '', contrasena: '', rol: 'editor' as const, ficha: '' }
const formulario = ref({ ...vacio })
const editando = ref(false)
const aviso = ref('')
const problema = ref('')
const guardando = ref(false)

function nuevo() {
  formulario.value = { ...vacio }
  editando.value = false
  aviso.value = problema.value = ''
}

function modificar(c: Cuenta) {
  formulario.value = { ...c, contrasena: '' }
  editando.value = true
  aviso.value = problema.value = ''
}

async function guardar() {
  guardando.value = true
  aviso.value = problema.value = ''
  try {
    const r = await $fetch<{ creada: boolean }>('/api/cuentas', {
      method: 'POST',
      body: formulario.value
    })
    aviso.value = r.creada ? 'Cuenta creada.' : 'Cambios guardados.'
    formulario.value = { ...vacio }
    editando.value = false
    await refresh()
  } catch (e: unknown) {
    const err = e as { data?: { statusMessage?: string }, statusMessage?: string }
    problema.value = err.data?.statusMessage || err.statusMessage || 'No se pudo guardar'
  } finally {
    guardando.value = false
  }
}

async function eliminar(c: Cuenta) {
  if (!confirm(`¿Eliminar la cuenta de ${c.nombre}? No se puede deshacer.`)) return
  problema.value = aviso.value = ''
  try {
    await $fetch(`/api/cuentas/${c.usuario}`, { method: 'DELETE' })
    aviso.value = 'Cuenta eliminada.'
    await refresh()
  } catch (e: unknown) {
    const err = e as { data?: { statusMessage?: string }, statusMessage?: string }
    problema.value = err.data?.statusMessage || err.statusMessage || 'No se pudo eliminar'
  }
}
</script>

<template>
  <div class="mx-auto w-full max-w-[900px] px-5 py-12">
    <h1 class="text-[30px] font-bold text-usm-nav">Cuentas</h1>
    <p class="mt-2 text-muted">
      Quiénes pueden entrar a editar el sitio.
    </p>

    <!-- Si el servidor rechaza la consulta es que quien mira no es
         administrador. Se dice sin rodeos en vez de dejar la página vacía. -->
    <div v-if="error" class="mt-8 rounded-lg border border-default p-6">
      <p class="font-semibold text-usm-nav">No tienes acceso a esta página</p>
      <p class="mt-2 text-sm text-muted">
        Solo las cuentas con permisos de administración pueden gestionar usuarios.
        Si crees que es un error, pídeselo a quien administra el sitio.
      </p>
    </div>

    <template v-else>
      <p v-if="aviso" class="mt-6 text-sm font-semibold text-usm">{{ aviso }}</p>
      <p v-if="problema" class="mt-6 text-sm font-semibold text-red-600">{{ problema }}</p>

      <!-- ── Listado ── -->
      <ul class="mt-8 border-t border-default">
        <li
          v-for="c in cuentas ?? []"
          :key="c.usuario"
          class="flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-default py-4"
        >
          <div class="min-w-0 flex-1">
            <p class="font-semibold text-usm-nav">
              {{ c.nombre }}
              <span
                v-if="c.rol === 'admin'"
                class="ml-2 rounded-full bg-usm px-2 py-0.5 text-xs font-semibold text-white"
              >
                Administra cuentas
              </span>
            </p>
            <p class="mt-0.5 break-all text-sm text-muted">
              {{ c.usuario }}<span v-if="c.correo"> · {{ c.correo }}</span>
            </p>
            <p v-if="c.ficha" class="mt-0.5 text-sm text-muted">
              Ficha: {{ c.ficha }}
            </p>
          </div>
          <div class="flex gap-2">
            <UButton size="sm" variant="outline" @click="modificar(c)">Modificar</UButton>
            <UButton size="sm" variant="ghost" color="error" @click="eliminar(c)">Eliminar</UButton>
          </div>
        </li>
      </ul>

      <!-- ── Alta y edición ── -->
      <section class="mt-10 rounded-lg border border-default p-6">
        <h2 class="text-lg font-semibold text-usm-nav">
          {{ editando ? `Modificando a ${formulario.usuario}` : 'Agregar una cuenta' }}
        </h2>

        <form class="mt-5 space-y-4" @submit.prevent="guardar">
          <div class="grid gap-4 sm:grid-cols-2">
            <UFormField label="Usuario" :description="editando ? 'No se puede cambiar' : 'Sin espacios ni tildes'">
              <UInput v-model="formulario.usuario" :disabled="editando" class="w-full" />
            </UFormField>
            <UFormField label="Nombre completo">
              <UInput v-model="formulario.nombre" class="w-full" />
            </UFormField>
            <UFormField label="Correo">
              <UInput v-model="formulario.correo" type="email" class="w-full" />
            </UFormField>
            <UFormField
              label="Contraseña"
              :description="editando ? 'Déjala vacía para no cambiarla' : 'Mínimo 10 caracteres'"
            >
              <UInput v-model="formulario.contrasena" type="password" class="w-full" />
            </UFormField>
          </div>

          <UFormField
            label="Ficha en Personas"
            description="Carpeta y archivo de su perfil, por ejemplo jornada/nombre-apellido-1. Vacío si no tiene ficha."
          >
            <UInput v-model="formulario.ficha" class="w-full" />
          </UFormField>

          <UFormField
            label="Permisos"
            description="Quien administra cuentas puede entrar aquí y dar de alta o baja a otras personas."
          >
            <USelect
              v-model="formulario.rol"
              class="w-full"
              :items="[
                { label: 'Editor: solo edita contenido', value: 'editor' },
                { label: 'Administrador: además gestiona cuentas', value: 'admin' }
              ]"
            />
          </UFormField>

          <div class="flex gap-3 pt-1">
            <UButton type="submit" :loading="guardando" :disabled="guardando">
              {{ editando ? 'Guardar cambios' : 'Crear cuenta' }}
            </UButton>
            <UButton v-if="editando" variant="ghost" @click="nuevo">Cancelar</UButton>
          </div>
        </form>
      </section>

      <!-- Lo que este rol NO hace. Callarlo daría una falsa sensación de
           control sobre quién puede tocar qué contenido. -->
      <section class="mt-10 rounded-lg border border-amber-300 bg-amber-50 p-6">
        <h2 class="font-semibold text-usm-nav">Sobre los permisos de contenido</h2>
        <p class="mt-2 text-sm text-muted leading-relaxed">
          El rol decide quién gestiona cuentas, no qué puede editar cada persona.
          Cualquiera que entre al editor puede modificar cualquier página, incluidas
          las fichas de otros. Limitarlo de verdad exige cambiar cómo publica el
          editor; está explicado en la documentación del proyecto.
        </p>
      </section>
    </template>
  </div>
</template>
