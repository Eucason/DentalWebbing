export interface ContactFormData {
  name: string
  email: string
  phone: string | null
  message: string
}

export interface ContactFormResponse {
  success: boolean
}
