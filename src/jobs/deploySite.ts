import type { PayloadRequest, TaskConfig } from 'payload'

// Reconstrói o site estático no Cloudflare Pages chamando o Deploy Hook do projeto.
export const deploySite: TaskConfig<{ input: { reason?: string }; output: { status: number } }> = {
  slug: 'deploySite',
  label: 'Atualizar o site (Cloudflare Pages)',
  inputSchema: [{ name: 'reason', type: 'text' }],
  retries: 3,
  handler: async ({ req }) => {
    const hook = process.env.PAGES_DEPLOY_HOOK_URL
    if (!hook) {
      req.payload.logger.warn('PAGES_DEPLOY_HOOK_URL não configurado: o site estático não foi reconstruído.')
      return { output: { status: 0 } }
    }
    const res = await fetch(hook, { method: 'POST' })
    if (!res.ok) throw new Error(`Deploy Hook respondeu ${res.status}`)
    req.payload.logger.info('Reconstrução do site solicitada ao Cloudflare Pages.')
    return { output: { status: res.status } }
  },
}

// Agenda uma reconstrução para daqui a 1 minuto. Se já houver uma pendente, não cria outra:
// várias publicações seguidas viram um build só.
export const queueSiteDeploy = async (req: PayloadRequest, reason: string) => {
  if (!process.env.PAGES_DEPLOY_HOOK_URL || req.context?.disableRevalidate) return
  const pending = await req.payload.count({
    collection: 'payload-jobs',
    where: {
      and: [
        { taskSlug: { equals: 'deploySite' } },
        { completedAt: { exists: false } },
        { hasError: { not_equals: true } },
      ],
    },
    overrideAccess: true,
    req,
  })
  if (pending.totalDocs > 0) return
  await req.payload.jobs.queue({
    task: 'deploySite',
    input: { reason },
    waitUntil: new Date(Date.now() + 60 * 1000),
    req,
  })
}
