import { computed, onUnmounted, ref } from 'vue'

export type MeetingStatus = 'setup' | 'running' | 'finished'

// Coût horaire moyen chargé d'un agent (estimation, hors frais d'infrastructure et frais généraux)
export const DEFAULT_HOURLY_RATE = 41.2

export function useMeeting() {
  const status = ref<MeetingStatus>('setup')
  const attendees = ref(4)
  const plannedMinutes = ref(90)
  const hourlyRate = ref(DEFAULT_HOURLY_RATE)

  const startedAt = ref<Date | null>(null)
  const now = ref(Date.now())
  let timer: ReturnType<typeof setInterval> | undefined

  const plannedSeconds = computed(() => plannedMinutes.value * 60)
  const endsAt = computed(() =>
    startedAt.value ? new Date(startedAt.value.getTime() + plannedSeconds.value * 1000) : null,
  )
  const elapsedSeconds = computed(() =>
    startedAt.value ? Math.max(0, (now.value - startedAt.value.getTime()) / 1000) : 0,
  )
  const costPerSecond = computed(() => (hourlyRate.value * attendees.value) / 3600)
  const plannedCost = computed(() => costPerSecond.value * plannedSeconds.value)
  const currentCost = computed(() => costPerSecond.value * elapsedSeconds.value)
  const costDelta = computed(() => currentCost.value - plannedCost.value)
  const completion = computed(() =>
    plannedSeconds.value ? (elapsedSeconds.value / plannedSeconds.value) * 100 : 0,
  )
  const isOvertime = computed(() => elapsedSeconds.value > plannedSeconds.value)

  function clearTimer() {
    if (timer) clearInterval(timer)
    timer = undefined
  }

  function start() {
    startedAt.value = new Date()
    now.value = Date.now()
    status.value = 'running'
    clearTimer()
    timer = setInterval(() => (now.value = Date.now()), 250)
  }

  function stop() {
    now.value = Date.now()
    clearTimer()
    status.value = 'finished'
  }

  function reset() {
    clearTimer()
    startedAt.value = null
    status.value = 'setup'
  }

  onUnmounted(clearTimer)

  return {
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
  }
}
