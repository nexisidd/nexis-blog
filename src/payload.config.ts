import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { postgresAdapter } from '@payloadcms/db-postgres'
import {
  EXPERIMENTAL_TableFeature,
  FixedToolbarFeature,
  HeadingFeature,
  lexicalEditor,
  LinkFeature,
} from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import path from 'path'
import { buildConfig } from 'payload'
import { pt } from '@payloadcms/translations/languages/pt'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { Authors } from './collections/Authors'
import { Datasets } from './collections/Datasets'
import { Glossary } from './collections/Glossary'
import { Media } from './collections/Media'
import { Posts } from './collections/Posts'
import { Users } from './collections/Users'
import { deploySite } from './jobs/deploySite'
import { sendInvite } from './jobs/sendInvite'
import { migrations } from './migrations'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
const s3Enabled = Boolean(process.env.S3_BUCKET)
const cronSecret = process.env.CRON_SECRET

export default buildConfig({
  serverURL,
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: { titleSuffix: ' · Painel do Blog da Nexis' },
    dateFormat: 'dd/MM/yyyy HH:mm',
    livePreview: {
      collections: ['posts'],
      breakpoints: [
        { label: 'Celular', name: 'mobile', width: 390, height: 844 },
        { label: 'Desktop', name: 'desktop', width: 1280, height: 900 },
      ],
    },
  },
  i18n: { supportedLanguages: { pt }, fallbackLanguage: 'pt' },
  collections: [Posts, Authors, Glossary, Datasets, Media, Users],
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures.filter((f) => !['heading', 'link'].includes(f.key)),
      HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
      LinkFeature({ enabledCollections: ['posts', 'glossary'] }),
      EXPERIMENTAL_TableFeature(),
      FixedToolbarFeature(),
    ],
  }),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URI || '' },
    // Em produção o schema muda só por migração (rodada automaticamente ao subir o servidor).
    push: false,
    prodMigrations: migrations,
  }),
  email: process.env.SMTP_HOST
    ? nodemailerAdapter({
        defaultFromAddress: process.env.EMAIL_FROM_ADDRESS || 'blog@iddnexis.com.br',
        defaultFromName: process.env.EMAIL_FROM_NAME || 'Blog da Nexis',
        transportOptions: {
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT || 587),
          secure: Number(process.env.SMTP_PORT) === 465,
          auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
        },
      })
    : undefined,
  sharp,
  jobs: {
    // A publicação agendada vira um job na fila "default". O próprio servidor processa a fila a cada minuto.
    autoRun: [{ cron: '* * * * *', queue: 'default', limit: 10 }],
    shouldAutoRun: () => process.env.JOBS_AUTORUN !== 'false',
    deleteJobOnComplete: true,
    tasks: [sendInvite, deploySite],
    access: {
      // Permite que um Cron Job do Render chame GET /api/payload-jobs/run com "Authorization: Bearer <CRON_SECRET>".
      run: ({ req }) =>
        Boolean(req.user) || (Boolean(cronSecret) && req.headers.get('authorization') === `Bearer ${cronSecret}`),
    },
  },
  plugins: [
    s3Storage({
      enabled: s3Enabled,
      alwaysInsertFields: true,
      collections: {
        media: process.env.S3_PUBLIC_URL
          ? {
              prefix: 'blog',
              disablePayloadAccessControl: true,
              generateFileURL: ({ filename, prefix }) =>
                `${process.env.S3_PUBLIC_URL!.replace(/\/$/, '')}/${prefix ? `${prefix}/` : ''}${filename}`,
            }
          : { prefix: 'blog' },
      },
      bucket: process.env.S3_BUCKET || '',
      config: {
        region: process.env.S3_REGION || 'auto',
        endpoint: process.env.S3_ENDPOINT || undefined,
        forcePathStyle: Boolean(process.env.S3_ENDPOINT),
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
        },
      },
    }),
  ],
})
