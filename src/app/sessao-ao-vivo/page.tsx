'use client'

import { useEffect, useState } from 'react'
import { WebinarCountdown } from '@/features/webinario/webinar-countdown'
import { WebinarRoom } from '@/features/webinario/webinar-room'

export default function WebinarioPage() {
  const [status, setStatus] = useState<'loading' | 'waiting' | 'live'>('loading')

  useEffect(() => {
    // ?preview=true pula o countdown — útil para testar sem esperar sessão
    const isPreview = new URLSearchParams(window.location.search).get('preview') === 'true'
    if (isPreview) {
      setStatus('live')
    } else {
      setStatus('waiting')
    }
  }, [])

  if (status === 'loading') {
    return <div className="min-h-screen bg-gray-950" />
  }

  if (status === 'live') {
    return <WebinarRoom />
  }

  // Waiting / countdown (Lobby premium com design system)
  return <WebinarCountdown onSessionStart={() => setStatus('live')} />
}
