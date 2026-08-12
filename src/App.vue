<template>
  <div class="min-h-screen bg-background relative selection:bg-primary/30 selection:text-white overflow-x-hidden">
    <!-- Ambient Background Elements -->
    <div class="fixed inset-0 z-0 pointer-events-none">
      <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]"></div>
      <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent/10 blur-[120px]"></div>
    </div>
    
    <main class="relative z-10">
      <Dashboard />
    </main>
  </div>
</template>

<script setup>
import Dashboard from './components/Dashboard.vue'
</script>
