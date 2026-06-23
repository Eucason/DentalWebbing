/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_HOST: string
  readonly VITE_TENANT_CONFIG_PATH: string
  readonly VITE_APP_ENV: 'development' | 'staging' | 'production'
  readonly VITE_DEV_OVERRIDE_DOMAIN?: string
  readonly VITE_USE_MOCKS?: 'true' | 'false'
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
