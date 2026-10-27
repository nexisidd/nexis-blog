import configPromise from '@payload-config'
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'

// Ativa o modo prévia só para quem está logado no painel e redireciona para a página do artigo.
export async function GET(request: Request) {
  const url = new URL(request.url)
  const slug = url.searchParams.get('slug')
  if (!slug || !/^[a-z0-9-]+$/.test(slug)) return new Response('Slug inválido', { status: 400 })

  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers: request.headers })
  if (!user) {
    ;(await draftMode()).disable()
    return new Response('Faça login no painel para pré-visualizar.', { status: 403 })
  }

  ;(await draftMode()).enable()
  redirect(`/${slug}`)
}
