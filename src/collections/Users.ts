import type { CollectionConfig } from 'payload'
import { APIError } from 'payload'

import { adminOnly, adminOnlyField, isAdmin, isLoggedIn } from '@/access'

const MIN_PASSWORD = 10

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Usuário', plural: 'Usuários' },
  admin: { useAsTitle: 'email', defaultColumns: ['name', 'email', 'role'], group: 'Administração' },
  auth: {
    maxLoginAttempts: 5,
    lockTime: 15 * 60 * 1000,
    tokenExpiration: 60 * 60 * 8,
    cookies: { secure: process.env.NODE_ENV === 'production', sameSite: 'Lax' },
    forgotPassword: {
      expiration: 1000 * 60 * 60 * 48,
      generateEmailSubject: () => 'Acesso ao painel do Blog da Nexis',
      generateEmailHTML: (args) => {
        const url = `${process.env.NEXT_PUBLIC_SERVER_URL || ''}/admin/reset/${args?.token}`
        return `<p>Olá!</p><p>Use o link abaixo para criar ou redefinir sua senha do painel do Blog da Nexis. Ele vale por 48 horas.</p><p><a href="${url}">${url}</a></p><p>Se você não esperava este e-mail, ignore.</p>`
      },
    },
  },
  access: {
    // Primeiro usuário (tela de criação inicial) pode ser criado sem login; depois, só admin.
    create: async ({ req }) => {
      if (isAdmin(req.user)) return true
      const { totalDocs } = await req.payload.count({ collection: 'users', overrideAccess: true })
      return totalDocs === 0
    },
    read: ({ req }) => (isAdmin(req.user) ? true : isLoggedIn(req.user) ? { id: { equals: req.user!.id } } : false),
    update: ({ req }) => (isAdmin(req.user) ? true : isLoggedIn(req.user) ? { id: { equals: req.user!.id } } : false),
    delete: adminOnly,
    unlock: adminOnly,
  },
  fields: [
    { name: 'name', label: 'Nome', type: 'text' },
    {
      name: 'role',
      label: 'Perfil',
      type: 'select',
      required: true,
      defaultValue: 'redator',
      saveToJWT: true,
      access: { update: adminOnlyField },
      options: [
        { label: 'Admin (tudo, inclusive usuários)', value: 'admin' },
        { label: 'Editor (publica, agenda e edita qualquer artigo)', value: 'editor' },
        { label: 'Redator (cria e edita os próprios rascunhos)', value: 'redator' },
      ],
    },
  ],
  hooks: {
    beforeValidate: [
      ({ data }) => {
        const password = data?.password
        if (typeof password === 'string' && password.length > 0) {
          if (password.length < MIN_PASSWORD || !/[A-Za-z]/.test(password) || !/\d/.test(password))
            throw new APIError(
              `A senha precisa ter pelo menos ${MIN_PASSWORD} caracteres, com letras e números.`,
              400,
              undefined,
              true,
            )
        }
        return data
      },
    ],
    beforeChange: [
      async ({ data, operation, req }) => {
        // O primeiro usuário do sistema vira admin automaticamente.
        if (operation === 'create') {
          const { totalDocs } = await req.payload.count({ collection: 'users', overrideAccess: true })
          if (totalDocs === 0) data.role = 'admin'
        }
        return data
      },
    ],
    afterChange: [
      async ({ doc, operation, req }) => {
        // Convite: quando um admin cria alguém, a pessoa recebe o link para definir a própria senha.
        // Vai pela fila de jobs porque o usuário só existe no banco depois que esta operação termina.
        if (operation === 'create' && isAdmin(req.user) && req.context?.skipInvite !== true) {
          await req.payload.jobs.queue({ task: 'sendInvite', input: { email: doc.email }, req })
        }
        return doc
      },
    ],
  },
}
