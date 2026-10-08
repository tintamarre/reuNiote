<script setup lang="ts">
defineProps<{
  label: string
  value: string
  hint?: string
  tone?: 'default' | 'good' | 'bad'
}>()
</script>

<template>
  <div class="rounded-2xl bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 p-4 sm:p-5">
    <div class="text-sm text-gray-500 dark:text-gray-400">{{ label }}</div>
    <div class="mt-1 text-2xl sm:text-3xl font-semibold tabular-nums">{{ value }}</div>
    <div
      v-if="hint"
      class="mt-1 text-sm tabular-nums"
      :class="{
        'text-gray-500 dark:text-gray-400': !tone || tone === 'default',
        'text-money': tone === 'good',
        'text-accent': tone === 'bad',
      }"
    >
      {{ hint }}
    </div>
  </div>
</template>
