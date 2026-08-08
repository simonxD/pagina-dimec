<script setup lang="ts">
// Puerta de entrada al editor del sitio.
//
// No lleva enlace desde el menú a propósito: no es una página para las visitas.
// Quien edita llega por la dirección directa.
definePageMeta({ layout: 'default' })

useSeoMeta({
  title: 'Entrar',
  description: 'Acceso al editor del sitio del Departamento de Ingeniería Mecánica.',
  robots: 'noindex, nofollow'
})

// Si ya hay sesión abierta, esta página no tiene sentido: manda al inicio, donde
// aparece el editor. La cookie de sesión es httpOnly y no se puede leer desde el
// navegador, así que hay que preguntárselo al servidor. useRequestFetch reenvía
// las cookies de la petición original, que es lo que hace que funcione también
// durante el renderizado en servidor.
// El endpoint responde { user: { email, ... }, id }. El identificador viene
// siempre, tenga o no sesión: lo que distingue a alguien identificado es que
// exista `user`.
const peticion = useRequestFetch()
const { data: sesion } = await useAsyncData('sesion-studio', () =>
  peticion<{ user?: { email?: string } }>('/__nuxt_studio/auth/session')
    .catch(() => null)
)

if (sesion.value?.user?.email) {
  await navigateTo('/', { replace: true })
}

const usuario = ref('')
const contrasena = ref('')
const error = ref('')
const enviando = ref(false)

async function entrar() {
  error.value = ''
  enviando.value = true
  try {
    await $fetch('/api/entrar', {
      method: 'POST',
      body: { usuario: usuario.value, contrasena: contrasena.value }
    })
    // Recarga completa en vez de navegación interna: el editor se engancha al
    // arrancar la aplicación, así que necesita que la página se cargue de nuevo
    // con la sesión ya puesta.
    window.location.href = '/'
  } catch (e: unknown) {
    const err = e as { statusMessage?: string, data?: { statusMessage?: string } }
    error.value = err.data?.statusMessage || err.statusMessage || 'No se pudo iniciar sesión'
    enviando.value = false
  }
}
</script>

<template>
  <div class="mx-auto flex w-full max-w-[420px] flex-col justify-center px-5 py-20">
    <h1 class="text-[30px] font-bold text-usm-nav">Entrar a editar</h1>
    <p class="mt-2 text-muted">
      Acceso para quienes mantienen el contenido del sitio.
    </p>

    <form class="mt-8 space-y-5" @submit.prevent="entrar">
      <div>
        <label for="usuario" class="mb-1.5 block text-sm font-semibold text-usm-nav">
          Usuario
        </label>
        <UInput
          id="usuario"
          v-model="usuario"
          autocomplete="username"
          autocapitalize="none"
          class="w-full"
        />
      </div>

      <div>
        <label for="contrasena" class="mb-1.5 block text-sm font-semibold text-usm-nav">
          Contraseña
        </label>
        <UInput
          id="contrasena"
          v-model="contrasena"
          type="password"
          autocomplete="current-password"
          class="w-full"
        />
      </div>

      <p v-if="error" class="text-sm text-red-600">{{ error }}</p>

      <UButton type="submit" size="lg" :loading="enviando" :disabled="enviando">
        Entrar
      </UButton>
    </form>

    <!-- Cuatro cosas que evitan la mayoría de los tropiezos. La primera existe
         porque el selector de formato del editor no se puede quitar: viene fijo
         en Studio y su opción por defecto, md, es justo la que no funciona. -->
    <section class="mt-10 border-t border-default pt-6">
      <h2 class="text-sm font-semibold uppercase tracking-wide text-slate-600">
        Antes de empezar
      </h2>
      <ul class="mt-4 space-y-3 text-sm text-muted">
        <li class="flex gap-2.5">
          <UIcon name="i-lucide-triangle-alert" class="mt-0.5 size-4 shrink-0 text-usm" />
          <span>
            Al crear una persona, en el selector de formato elige
            <strong class="text-usm-nav">yml</strong>. La opción <em>md</em> que
            viene marcada por defecto no sirve, y el error no se avisa.
          </span>
        </li>
        <li class="flex gap-2.5">
          <UIcon name="i-lucide-link" class="mt-0.5 size-4 shrink-0 text-usm" />
          <span>
            El nombre del archivo forma la dirección web de esa persona. Usa
            algo como <code class="text-usm-nav">nombre-apellido</code>.
          </span>
        </li>
        <li class="flex gap-2.5">
          <UIcon name="i-lucide-check" class="mt-0.5 size-4 shrink-0 text-usm" />
          <span>
            Rellena <strong class="text-usm-nav">Nombre</strong> y
            <strong class="text-usm-nav">Categoría</strong>: deciden si aparece
            y en qué pestaña.
          </span>
        </li>
        <li class="flex gap-2.5">
          <UIcon name="i-lucide-clock" class="mt-0.5 size-4 shrink-0 text-usm" />
          <span>
            Tras publicar, el sitio tarda unos minutos en actualizarse. Es
            normal.
          </span>
        </li>
      </ul>
    </section>

    <p class="mt-8 border-t border-default pt-5 text-sm text-muted">
      ¿Olvidaste la contraseña? No hay recuperación automática: pídele a quien
      administra el sitio que te asigne una nueva.
    </p>
  </div>
</template>
