import axios, { type AxiosInstance, type AxiosError } from 'axios'
import type { TenantConfig, ApiError } from '../types'

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

/**
 * Creates a tenant-scoped Axios instance.
 *
 * The `baseURL` is composed from the Vite environment variable
 * `VITE_API_HOST` and the resolved tenant's `apiSubdirectoryPath`, so
 * no infrastructure address ever appears outside this file or the env files.
 *
 * @example
 *   const api = createApiClient(tenantConfig)
 *   const data = await api.get('/wp-json/wp/v2/doctors')
 */
export function createApiClient(tenantConfig: TenantConfig): AxiosInstance {
  const baseURL = `${import.meta.env.VITE_API_HOST}${tenantConfig.apiSubdirectoryPath}`

  const instance = axios.create({
    baseURL,
    timeout: 15_000,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  // -------------------------------------------------------------------------
  // Response interceptor — normalize all errors into ApiError
  // -------------------------------------------------------------------------
  instance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      const apiError: ApiError = normalizeError(error)
      return Promise.reject(apiError)
    }
  )

  return instance
}

// ---------------------------------------------------------------------------
// Error normalization
// ---------------------------------------------------------------------------

/**
 * Converts any Axios error into the canonical `ApiError` shape.
 * This is the single place in the codebase that knows about raw Axios/HTTP
 * error structures so downstream code only ever sees `ApiError`.
 */
function normalizeError(error: AxiosError): ApiError {
  // Server responded with a non-2xx status
  if (error.response) {
    const status = error.response.status
    const data = error.response.data as Record<string, unknown> | undefined

    return {
      status,
      message:
        typeof data?.message === 'string'
          ? data.message
          : error.message || `Request failed with status ${status}`,
      code: typeof data?.code === 'string' ? data.code : String(status),
      details: data,
    }
  }

  // Request was made but no response received (network error / timeout)
  if (error.request) {
    return {
      status: 0,
      message: 'Network error — no response received from the server.',
      code: 'NETWORK_ERROR',
      details: { originalMessage: error.message },
    }
  }

  // Something went wrong setting up the request
  return {
    status: -1,
    message: error.message || 'An unexpected error occurred.',
    code: 'REQUEST_SETUP_ERROR',
  }
}
