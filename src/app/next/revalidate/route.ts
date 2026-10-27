import { revalidatePath } from 'next/cache'

import { revalidateSecret } from '@/hooks/revalidate'

// Rota interna usada pela fila de jobs (publicação agendada) para revalidar páginas.
export async function POST(request: Request) {
  const secret = revalidateSecret()
  if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`)
    return new Response('Não autorizado', { status: 401 })

  const { paths } = (await request.json().catch(() => ({}))) as { paths?: unknown }
  if (!Array.isArray(paths)) return new Response('paths inválido', { status: 400 })
  const valid = paths.filter((p): p is string => typeof p === 'string' && p.startsWith('/'))
  for (const path of valid) revalidatePath(path)
  return Response.json({ revalidated: valid })
}
