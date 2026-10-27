import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { CategoryPage } from '@/components/CategoryPage'
import { pageMetadata } from '@/lib/seo'
import { CATEGORIES, getCategory, getSubcategory } from '@/lib/taxonomy'

export const revalidate = 3600

type Props = { params: Promise<{ slug: string; sub: string }> }

export function generateStaticParams() {
  return CATEGORIES.flatMap((c) => c.subcategories.map((s) => ({ slug: c.slug, sub: s.slug })))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, sub } = await params
  const category = getCategory(slug)
  const subcategory = getSubcategory(slug, sub)
  if (!category || !subcategory) return {}
  return pageMetadata({
    title: `${subcategory.label} | ${category.label}`,
    description: `Artigos e guias sobre ${subcategory.label.toLowerCase()} no e-commerce, da editoria ${category.label} do Blog da Nexis.`,
    path: `/${category.slug}/${subcategory.slug}`,
  })
}

export default async function SubcategoryPage({ params }: Props) {
  const { slug, sub } = await params
  const category = getCategory(slug)
  const subcategory = getSubcategory(slug, sub)
  if (!category || !subcategory) notFound()
  return <CategoryPage category={category} sub={subcategory} />
}
