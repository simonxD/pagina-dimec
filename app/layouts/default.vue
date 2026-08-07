<template>
  <div class="flex min-h-screen flex-col">
    <AppHeader />

    <!-- El header es fijo: este relleno evita que tape el contenido -->
    <main class="flex-1 pt-[100px] lg:pt-[140px]">
      <slot />
    </main>

    <AppFooter />
  </div>
</template>
