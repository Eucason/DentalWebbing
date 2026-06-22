export interface Doctor {
  id: number
  slug: string
  name: string
  specialty?: string
  bio?: string
  imageUrl?: string
  qualifications?: string[]
}
