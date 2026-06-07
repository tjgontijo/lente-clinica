'use client'

import { useEffect, useState } from 'react'
import { getNextSession, formatCountdown } from '@/features/webinario/webinar-schedule'
import { WebinarRoom } from '@/features/webinario/webinar-room'

export default function WebinarioPage() {
  const [status, setStatus] = useState<'loading' | 'waiting' | 'live'>('loading')
  const [secondsLeft, setSecondsLeft] = useState(0)
  const [sessionLabel, setSessionLabel] = useState('')

  useEffect(() => {
    // ?preview=true pula o countdown — útil para testar sem esperar sessão
    const isPreview = new URLSearchParams(window.location.search).get('preview') === 'true'
    if (isPreview) {
      setStatus('live')
      return
    }

    function tick() {
      const session = getNextSession()

      if (session.status === 'live' || session.status === 'offer') {
        setStatus('live')
        return
      }

      setStatus('waiting')
      setSecondsLeft(session.secondsUntilStart)

      const fmt = new Intl.DateTimeFormat('pt-BR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'America/Sao_Paulo',
      })
      setSessionLabel(fmt.format(session.startsAt))
    }

    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [])

  if (status === 'loading') {
    return <div className="min-h-screen bg-gray-950" />
  }

  if (status === 'live') {
    return <WebinarRoom />
  }

  // Waiting / countdown
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4">
      <div className="max-w-xl w-full text-center space-y-8">
        <div className="space-y-2">
          <p className="text-purple-400 text-xs font-semibold tracking-widest uppercase">
            Sessão Ao Vivo
          </p>
          <h1 className="text-white text-3xl font-bold leading-tight">
            Supervisão de Casos Clínicos
          </h1>
          <p className="text-gray-400">com Dra. Tatiana Gontijo</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 space-y-3">
          <p className="text-gray-400 text-sm">A sessão começa em</p>
          <div className="text-white text-6xl font-mono font-bold tabular-nums">
            {formatCountdown(secondsLeft)}
          </div>
          <p className="text-gray-500 text-sm capitalize">{sessionLabel}</p>
        </div>

        <div className="flex items-center justify-center gap-2 text-amber-400">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-sm font-medium">30 vagas disponíveis nesta sessão</span>
        </div>

        <div className="text-left space-y-3 bg-gray-900/50 rounded-xl p-6 border border-gray-800">
          <p className="text-white text-sm font-semibold">Nesta sessão:</p>
          <ul className="space-y-2 text-gray-400 text-sm">
            {[
              'Um caso clínico real aberto ao vivo na plataforma Lente Clínica',
              'Como reconhecer quando uma "melhora" pode ser sinal de crise',
              'O modelo exato de comunicação com o psiquiatra',
            ].map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-purple-400 mt-0.5 flex-shrink-0">→</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-gray-600 text-xs">
          Esta página atualiza automaticamente quando a sessão começar.
        </p>
      </div>
    </div>
  )
}
