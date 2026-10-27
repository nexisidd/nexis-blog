'use client'

import { PublishButton, useAuth } from '@payloadcms/ui'

// Redator não vê o botão Publicar (nem o agendamento). O bloqueio real está no hook do servidor.
export const RolePublishButton = () => {
  const { user } = useAuth<{ role?: string }>()
  if (user?.role === 'redator') return null
  return <PublishButton />
}
