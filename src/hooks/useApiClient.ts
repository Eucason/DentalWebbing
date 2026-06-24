import { useMemo } from 'react'
import { createApiClient } from '../api/client'
import { useTenantConfig } from '../context/TenantContext'
import type { AxiosInstance } from 'axios'

export function useApiClient(): AxiosInstance {
  const config = useTenantConfig()

  const apiClient = useMemo(() => {
    return createApiClient(config)
  }, [config.id, config.apiSubdirectoryPath])

  return apiClient
}
