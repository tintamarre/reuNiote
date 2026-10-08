<script setup lang="ts">
import { computed } from 'vue'
import { useMeeting } from './composables/useMeeting'
import { useTheme } from './composables/useTheme'
import MeetingForm from './components/MeetingForm.vue'
import MetricCard from './components/MetricCard.vue'
import { formatClock, formatDuration, formatEuro, formatTime } from './utils'

const {
  status,
  attendees,
  plannedMinutes,
  hourlyRate,
  startedAt,
  endsAt,
  plannedSeconds,
  elapsedSeconds,
  plannedCost,
  currentCost,
  costDelta,
  completion,
  isOvertime,
  start,
  stop,
  reset,
} = useMeeting()

const { theme, toggleTheme } = useTheme()

const deltaLabel = computed(() => {
  const sign = costDelta.value > 0 ? '+' : '−'
  return `${sign} ${formatEuro(Math.abs(costDelta.value))} vs estimation`
})
</script>

<template>
  <div class="min-h-screen">
    <main class="mx-auto max-w-3xl px-4 py-8 sm:py-12">
      <header class="flex items-start justify-between gap-4">
        <div>
          <h1 class="text-3xl sm:text-4xl font-bold">💸 Coûts d’une réunion</h1>
          <p class="mt-2 text-gray-600 dark:text-gray-400">
            Cette application permet d’estimer le coût réel d’une réunion pour le contribuable.
          </p>
        </div>
        <button
          @click="toggleTheme"
          class="shrink-0 rounded-full p-2 hover:bg-gray-200 dark:hover:bg-dark-700 transition-colors"
          :title="theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'"
          :aria-label="theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'"
        >
          <svg v-if="theme === 'dark'" class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd" />
          </svg>
          <svg v-else class="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        </button>
      </header>

      <section class="mt-8">
        <MeetingForm
          v-if="status === 'setup'"
          v-model:attendees="attendees"
          v-model:planned-minutes="plannedMinutes"
          v-model:hourly-rate="hourlyRate"
          :planned-cost="plannedCost"
          @start="start"
        />

        <div v-else class="space-y-4">
          <div
            v-if="status === 'running'"
            class="rounded-2xl border border-money/30 bg-money/10 px-4 py-3 text-sm"
          >
            Réunion de {{ attendees }} personnes lancée à {{ formatTime(startedAt!) }} jusqu’à
            {{ formatTime(endsAt!) }}, pour une durée prévue de {{ formatDuration(plannedSeconds) }}.
          </div>
          <div v-else class="rounded-2xl border border-accent/30 bg-accent/10 p-5">
            <div class="text-2xl font-bold">🎉 Félicitations, la réunion est terminée !</div>
            <p class="mt-2 text-gray-700 dark:text-gray-300">
              Elle a duré {{ formatClock(elapsedSeconds) }} et a coûté
              <strong class="tabular-nums">{{ formatEuro(currentCost) }}</strong>.
            </p>
          </div>

          <div class="rounded-2xl bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 p-5 sm:p-6">
            <div class="text-sm text-gray-500 dark:text-gray-400">Coût actuel</div>
            <div
              class="mt-1 text-5xl sm:text-7xl font-bold tabular-nums"
              :class="isOvertime ? 'text-accent' : 'text-money'"
            >
              {{ formatEuro(currentCost) }}
            </div>
            <div class="mt-5 h-3 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-dark-700">
              <div
                class="h-full rounded-full transition-[width] duration-300"
                :class="isOvertime ? 'bg-accent' : 'bg-money'"
                :style="{ width: `${Math.min(completion, 100)}%` }"
              />
            </div>
            <div class="mt-2 flex justify-between text-sm text-gray-500 dark:text-gray-400 tabular-nums">
              <span>{{ completion.toFixed(1).replace('.', ',') }} %</span>
              <span v-if="isOvertime" class="text-accent font-medium">Dépassement de {{ formatClock(elapsedSeconds - plannedSeconds) }}</span>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <MetricCard label="🕰 Temps écoulé" :value="formatClock(elapsedSeconds)" :hint="`sur ${formatClock(plannedSeconds)} prévues`" />
            <MetricCard label="💰 Coût estimé" :value="formatEuro(plannedCost)" hint="pour la durée prévue" />
            <MetricCard
              label="📉 Écart"
              :value="formatEuro(Math.abs(costDelta))"
              :hint="deltaLabel"
              :tone="costDelta > 0 ? 'bad' : 'good'"
            />
          </div>

          <div class="flex justify-end">
            <button
              v-if="status === 'running'"
              @click="stop"
              class="rounded-xl bg-accent px-6 py-3 font-semibold text-white shadow-sm transition hover:brightness-110 active:scale-95"
            >
              Arrêter la réunion
            </button>
            <button
              v-else
              @click="reset"
              class="rounded-xl bg-money px-6 py-3 font-semibold text-white shadow-sm transition hover:brightness-110 active:scale-95"
            >
              Nouvelle réunion
            </button>
          </div>
        </div>
      </section>

      <footer class="mt-12 text-sm text-gray-500 dark:text-gray-400">
        Code source disponible sur
        <a href="https://github.com/tintamarre/reuNiote/" class="underline hover:text-money">GitHub</a>.
      </footer>
    </main>
  </div>
</template>
