import type { TaskConfig } from 'payload'

// Envia o e-mail de convite (link para criar a senha) para um usuário recém-criado no painel.
export const sendInvite: TaskConfig<{ input: { email: string }; output: object }> = {
  slug: 'sendInvite',
  label: 'Enviar convite',
  inputSchema: [{ name: 'email', type: 'email', required: true }],
  retries: 3,
  handler: async ({ input, req }) => {
    await req.payload.forgotPassword({ collection: 'users', data: { email: input.email }, req })
    return { output: {} }
  },
}
