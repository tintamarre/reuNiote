<script setup lang="ts">
import { formatDuration, formatEuro } from '../utils'

const attendees = defineModel<number>('attendees', { required: true })
const plannedMinutes = defineModel<number>('plannedMinutes', { required: true })
const hourlyRate = defineModel<number>('hourlyRate', { required: true })

defineProps<{ plannedCost: number }>()
const emit = defineEmits<{ start: [] }>()
</script>

<template>
  <form
    class="rounded-2xl bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 p-5 sm:p-6 space-y-6"
    @submit.prevent="emit('start')"
  >
    <div>
      <div class="flex items-baseline justify-between gap-4">
        <label for="attendees" class="font-medium">Nombre de personnes présentes</label>
        <span class="text-2xl font-semibold tabular-nums">{{ attendees }}</span>
      </div>
      <input id="attendees" v-model.number="attendees" type="range" min="2" max="40" step="1" class="mt-3 w-full" />
    </div>

    <div>
      <div class="flex items-baseline justify-between gap-4">
        <label for="duration" class="font-medium">Durée estimée de la réunion</label>
        <span class="text-lg font-semibold">{{ formatDuration(plannedMinutes * 60) }}</span>
      </div>
      <input id="duration" v-model.number="plannedMinutes" type="range" min="5" max="480" step="5" class="mt-3 w-full" />
    </div>

    <div class="flex flex-wrap items-center justify-between gap-3">
      <label for="rate" class="font-medium">
        Coût horaire moyen par personne
        <span class="block text-sm font-normal text-gray-500 dark:text-gray-400">
          Hors frais d’infrastructure et frais généraux
        </span>
      </label>
      <div class="flex items-center gap-2">
        <input
          id="rate"
          v-model.number="hourlyRate"
          type="number"
          min="0"
          step="0.1"
          class="w-24 rounded-lg border border-gray-300 dark:border-dark-700 bg-transparent px-3 py-2 text-right tabular-nums focus:outline-none focus:ring-2 focus:ring-money"
        />
        <span class="text-gray-500 dark:text-gray-400">€/h</span>
      </div>
    </div>

    <div class="flex flex-wrap items-center justify-between gap-4 border-t border-gray-200 dark:border-dark-700 pt-5">
      <div>
        <div class="text-sm text-gray-500 dark:text-gray-400">Coût estimé</div>
        <div class="text-3xl font-semibold tabular-nums">{{ formatEuro(plannedCost) }}</div>
      </div>
      <button
        type="submit"
        class="rounded-xl bg-money px-6 py-3 font-semibold text-white shadow-sm transition hover:brightness-110 active:scale-95"
      >
        Lancer la réunion
      </button>
    </div>
  </form>
</template>
