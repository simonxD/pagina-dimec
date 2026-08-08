<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '@nuxt/ui'

useSeoMeta({
  title: 'Contacto',
  description: 'Contacta al Departamento de Ingeniería Mecánica.'
})

const toast = useToast()

const state = reactive({
  nombre: '',
  email: '',
  asunto: '',
  mensaje: ''
})

const validate = (state: Record<string, string>): FormError[] => {
  const errors: FormError[] = []
  if (!state.nombre) errors.push({ name: 'nombre', message: 'Indica tu nombre' })
  if (!state.email) {
    errors.push({ name: 'email', message: 'Indica tu correo' })
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email)) {
    errors.push({ name: 'email', message: 'El correo no es válido' })
  }
  if (!state.asunto) errors.push({ name: 'asunto', message: 'Indica un asunto' })
  if (!state.mensaje) {
    errors.push({ name: 'mensaje', message: 'Escribe tu mensaje' })
  } else if (state.mensaje.length < 20) {
    errors.push({ name: 'mensaje', message: 'El mensaje debe tener al menos 20 caracteres' })
  }
  return errors
}

// TODO: conectar con el backend / servicio de correo.
// Por ahora el formulario solo valida y muestra una confirmación local.
async function onSubmit(_event: FormSubmitEvent<typeof state>) {
  toast.add({
    title: 'Formulario aún no conectado',
    description: 'La validación funciona, pero falta enlazar el envío con un backend o servicio de correo.',
    color: 'warning',
    icon: 'i-lucide-triangle-alert'
  })
}

// El contenido vive en content/paginas/contacto.yml y se edita desde /_studio.
// El formulario de envío no es contenido: su lógica se queda en el código.
const { data: pagina } = await useAsyncData('pagina-contacto', () =>
  queryCollection('contacto').first()
)

const datos = computed(() => pagina.value?.datos ?? [])
</script>

<template>
  <div>
    <!-- Pon la foto en public/cabeceras/ y pásala como :imagen="'/cabeceras/contacto.jpg'" -->
    <CabeceraPagina titulo="Contacto" />

    <div class="mx-auto w-full max-w-[1200px] px-5 py-10 lg:px-2.5">
      <p class="text-lg text-muted mb-10">
        {{ pagina?.intro }}
      </p>

      <div class="grid gap-10 lg:grid-cols-[1fr_20rem]">
        <UCard>
          <UForm :state="state" :validate="validate" class="space-y-5" @submit="onSubmit">
            <div class="grid gap-5 sm:grid-cols-2">
              <UFormField label="Nombre" name="nombre" required>
                <UInput v-model="state.nombre" placeholder="Tu nombre" class="w-full" />
              </UFormField>

              <UFormField label="Correo electrónico" name="email" required>
                <UInput v-model="state.email" type="email" placeholder="tu@correo.cl" class="w-full" />
              </UFormField>
            </div>

            <UFormField label="Asunto" name="asunto" required>
              <UInput v-model="state.asunto" placeholder="Motivo de tu consulta" class="w-full" />
            </UFormField>

            <UFormField label="Mensaje" name="mensaje" required>
              <UTextarea v-model="state.mensaje" :rows="6" placeholder="Cuéntanos en qué podemos ayudarte" class="w-full" />
            </UFormField>

            <UButton type="submit" icon="i-lucide-send" size="lg">
              Enviar mensaje
            </UButton>
          </UForm>
        </UCard>

        <aside class="space-y-4">
          <UCard variant="subtle">
            <h2 class="font-semibold mb-4">Datos de contacto</h2>
            <ul class="space-y-4">
              <li v-for="d in datos" :key="d.label" class="flex gap-3">
                <UIcon :name="d.icon" class="size-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p class="text-sm font-medium">{{ d.label }}</p>
                  <p class="text-muted text-sm">{{ d.valor }}</p>
                </div>
              </li>
            </ul>
          </UCard>
        </aside>
      </div>
    </div>
  </div>
</template>
