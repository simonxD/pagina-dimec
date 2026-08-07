<script setup lang="ts">
useHead({
  titleTemplate: (title?: string) => (title ? `${title} · DIMEC` : 'DIMEC'),
  htmlAttrs: { lang: 'es' }
})
</script>

<template>
  <UApp>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
