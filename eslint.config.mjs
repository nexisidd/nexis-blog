import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

const eslintConfig = [
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      // Imagens vêm do Payload/R2 já redimensionadas, com width/height; next/image não é necessário.
      '@next/next/no-img-element': 'off',
    },
  },
  { ignores: ['.next/', 'src/migrations/', 'src/payload-types.ts', 'src/app/(payload)/'] },
]

export default eslintConfig
