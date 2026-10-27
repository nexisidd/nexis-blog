import type { Access, FieldAccess, PayloadRequest, Where } from 'payload'

export type Role = 'admin' | 'editor' | 'redator'

type UserLike = { id?: number | string; role?: Role | null; collection?: string } | null | undefined

const roleOf = (user: UserLike): Role | undefined =>
  user && (!user.collection || user.collection === 'users') ? user.role || undefined : undefined

export const isAdmin = (user: UserLike) => roleOf(user) === 'admin'
export const canPublish = (user: UserLike) => ['admin', 'editor'].includes(roleOf(user) || '')
export const isLoggedIn = (user: UserLike) => Boolean(roleOf(user))

export const adminOnly: Access = ({ req }) => isAdmin(req.user)
export const adminOnlyField: FieldAccess = ({ req }) => isAdmin(req.user)
export const loggedIn: Access = ({ req }) => isLoggedIn(req.user)
export const editorsAndAdmins: Access = ({ req }) => canPublish(req.user)

// Público só vê o que está publicado; quem está logado vê tudo (rascunhos e prévia).
export const publishedOrLoggedIn: Access = ({ req }) => {
  if (isLoggedIn(req.user)) return true
  return { _status: { equals: 'published' } } satisfies Where
}

// Redator só edita o que ele mesmo criou.
export const ownOrEditor: Access = ({ req }) => {
  if (canPublish(req.user)) return true
  if (!isLoggedIn(req.user)) return false
  return { createdBy: { equals: req.user!.id } } satisfies Where
}

export const userRole = (req: PayloadRequest) => roleOf(req.user)
