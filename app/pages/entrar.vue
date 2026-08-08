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

    <p class="mt-8 border-t border-default pt-5 text-sm text-muted">
      ¿Olvidaste la contraseña? No hay recuperación automática: pídele a quien
      administra el sitio que te asigne una nueva.
    </p>
  </div>
</template>
