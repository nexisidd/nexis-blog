// Gera o site público em HTML estático (pasta out/) para o Cloudflare Pages.
// As rotas do painel (Payload) e da prévia saem do build: o site estático só tem páginas públicas.
// Uso: npm run build:static  (precisa de DATABASE_URI e PAYLOAD_SECRET para ler o conteúdo publicado)
import { spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, renameSync, rmSync } from 'node:fs'
import path from 'node:path'

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..')
const hiddenDir = path.join(root, '.static-hidden')
const hide = ['src/app/(payload)', 'src/app/next']

const restore = () => {
  for (const rel of hide) {
    const from = path.join(hiddenDir, path.basename(rel))
    if (existsSync(from)) renameSync(from, path.join(root, rel))
  }
  if (existsSync(hiddenDir)) rmSync(hiddenDir, { recursive: true, force: true })
}

// Se um build anterior foi interrompido, devolve as pastas antes de começar.
restore()

let status = 1
try {
  mkdirSync(hiddenDir, { recursive: true })
  for (const rel of hide) renameSync(path.join(root, rel), path.join(hiddenDir, path.basename(rel)))
  rmSync(path.join(root, 'out'), { recursive: true, force: true })

  const result = spawnSync('npx', ['next', 'build'], {
    cwd: root,
    stdio: 'inherit',
    env: {
      ...process.env,
      STATIC_EXPORT: 'true',
      // O build só lê o banco; quem processa a fila de jobs é o painel.
      JOBS_AUTORUN: 'false',
      NODE_OPTIONS: `${process.env.NODE_OPTIONS || ''} --no-deprecation`.trim(),
    },
  })
  status = result.status ?? 1
} finally {
  restore()
}

if (status === 0 && !existsSync(path.join(root, 'out', 'index.html'))) {
  console.error('Build terminou, mas out/index.html não foi gerado.')
  status = 1
}
process.exit(status)
