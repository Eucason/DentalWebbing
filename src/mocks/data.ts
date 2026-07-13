import type {
  ClinicInfo,
  Doctor,
  Service,
  ContactFormData,
  ContactFormResponse,
  TenantConfig,
  WpPage,
} from '../types'

// ---------------------------------------------------------------------------
// Mock Tenant Config
// ---------------------------------------------------------------------------
// The most foundational mock — TenantProvider resolves this before any other
// data loads, so the optional contact fields are populated to give Header /
// Footer something complete to render in offline dev mode.
export const MOCK_TENANT_CONFIG: TenantConfig = {
  id: 'mock-tenant-1',
  name: 'Apex Orthodontics',
  domain: 'apexorthodontics.net',
  apiSubdirectoryPath: '/wp-json/wp/v2',
  colors: {
    primary: '#0369a1',
    secondary: '#0ea5e9',
    accent: '#facc15',
  },
  contactEmail: 'hello@apexorthodontics.net',
  contactPhone: '+254 700 123 456',
  address: '142 Maplewood Avenue, Suite 3, Nairobi, Kenya 00200',
  navigation: [
    { to: '/', label: 'Home', end: true },
    { to: '/services', label: 'Services' },
    { to: '/team', label: 'Our Team' },
    { to: '/contact', label: 'Contact' },
    { to: '/invisalign-special', label: 'Invisalign Special' },
  ],
  features: {
    contactForm: true,
  },
}

// ---------------------------------------------------------------------------
// Mock Clinic Info
// ---------------------------------------------------------------------------
export const MOCK_CLINIC_INFO: ClinicInfo = {
  heroTitle: 'Your Smile Deserves the Best Care',
  heroSubtitle:
    'Compassionate, modern dentistry for the whole family. Book your appointment today and experience the difference.',
  heroImageUrl: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=1600',
  tagline: 'Trusted by 5,000+ patients across Nairobi',
  bookingUrl: '#contact',
  address: '142 Maplewood Avenue, Suite 3, Nairobi, Kenya 00200',
  contactPhone: '+254 700 123 456',
  contactEmail: 'hello@apexdental.co.ke',
  hours: {
    Monday: '8:00 AM – 6:00 PM',
    Tuesday: '8:00 AM – 6:00 PM',
    Wednesday: '8:00 AM – 6:00 PM',
    Thursday: '8:00 AM – 6:00 PM',
    Friday: '8:00 AM – 5:00 PM',
    Saturday: '9:00 AM – 2:00 PM',
    Sunday: 'Closed',
  },
  socialLinks: {
    facebook: 'https://facebook.com/apexdental',
    instagram: 'https://instagram.com/apexdental',
    twitter: 'https://twitter.com/apexdental',
  },
  mapIframeUrl:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.816!2d36.8219!3d-1.2833!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMcKwMTYnNTkuOSJTIDM2wrA0OScxOS4xIkU!5e0!3m2!1sen!2ske!4v0000000000000',
}

// ---------------------------------------------------------------------------
// Mock Doctors (minimum 3)
// ---------------------------------------------------------------------------
export const MOCK_DOCTORS: Doctor[] = [
  {
    id: 1,
    slug: 'dr-amara-osei',
    name: 'Dr. Amara Osei',
    specialty: 'General & Cosmetic Dentistry',
    bio: 'Dr. Osei brings over 14 years of experience in restorative and cosmetic dental procedures. She is passionate about preventive care and helping patients achieve confident smiles.',
    imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400',
    qualifications: [
      'BDS – University of Nairobi',
      'MFDS RCS Edinburgh',
      'Invisalign Certified Provider',
    ],
  },
  {
    id: 2,
    slug: 'dr-felix-kariuki',
    name: 'Dr. Felix Kariuki',
    specialty: 'Orthodontics & Implantology',
    bio: 'Specialising in braces, clear aligners, and dental implants, Dr. Kariuki combines cutting-edge technology with a gentle approach to transform smiles of all ages.',
    imageUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400',
    qualifications: [
      'BDS – Kenyatta University',
      'MSc Orthodontics – UCL',
      'ITI Fellow – Dental Implants',
    ],
  },
  {
    id: 3,
    slug: 'dr-linda-mwangi',
    name: 'Dr. Linda Mwangi',
    specialty: 'Paediatric Dentistry & Oral Health',
    bio: 'Dr. Mwangi specialises in creating a positive dental experience for children from infancy through adolescence, building lifelong habits for excellent oral health.',
    imageUrl: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400',
    qualifications: [
      'BDS – University of Nairobi',
      'MDS Paediatric Dentistry – UKZN',
      'SAADP Member',
    ],
  },
]

// ---------------------------------------------------------------------------
// Mock Services (minimum 6)
// ---------------------------------------------------------------------------
export const MOCK_SERVICES: Service[] = [
  {
    id: 1,
    slug: 'teeth-whitening',
    name: 'Teeth Whitening',
    description:
      'Professional in-chair and take-home whitening treatments that safely lighten enamel staining by up to 8 shades, leaving you with a brilliantly bright smile.',
    iconUrl: '/icons/whitening.svg',
    imageUrl: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600',
  },
  {
    id: 2,
    slug: 'dental-implants',
    name: 'Dental Implants',
    description:
      'Permanent, natural-looking tooth replacements anchored directly into the jawbone. Implants restore full chewing function and prevent bone loss long-term.',
    iconUrl: '/icons/implant.svg',
    imageUrl: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=600',
  },
  {
    id: 3,
    slug: 'orthodontics',
    name: 'Orthodontics & Braces',
    description:
      'From traditional metal braces to virtually invisible clear aligners, our orthodontic plans are tailored to achieve precise, lasting alignment for teens and adults alike.',
    iconUrl: '/icons/braces.svg',
    imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600',
  },
  {
    id: 4,
    slug: 'root-canal',
    name: 'Root Canal Treatment',
    description:
      'Modern endodontic therapy that saves severely infected teeth, eliminating pain and preserving your natural tooth structure using precision rotary instruments.',
    iconUrl: '/icons/root-canal.svg',
    imageUrl: 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=600',
  },
  {
    id: 5,
    slug: 'dental-veneers',
    name: 'Porcelain Veneers',
    description:
      'Ultra-thin porcelain shells bonded to the front surface of teeth to correct discolouration, chips, gaps, and minor misalignment — a complete smile makeover in two visits.',
    iconUrl: '/icons/veneers.svg',
    imageUrl: 'https://images.unsplash.com/photo-1598256989928-f843536ece3d?w=600',
  },
  {
    id: 6,
    slug: 'preventive-care',
    name: 'Preventive Care & Hygiene',
    description:
      'Regular scale-and-polish, fluoride treatments, fissure sealants, and personalised oral hygiene coaching keep decay and gum disease at bay — and reduce long-term treatment costs.',
    iconUrl: '/icons/hygiene.svg',
    imageUrl: 'https://images.unsplash.com/photo-1571772996211-2f02c9727629?w=600',
  },
]

// ---------------------------------------------------------------------------
// Mock WordPress Pages
// ---------------------------------------------------------------------------

export const MOCK_PAGES: WpPage[] = [
  {
    id: 101,
    slug: 'invisalign-special',
    title: 'Invisalign Special',
    excerpt: 'A limited clear aligner offer for new orthodontic patients.',
    content: `
      <h2>Clear aligner consultation</h2>
      <p>Book a consultation to see whether Invisalign is a good fit for your smile goals.</p>
      <ul>
        <li>Digital smile scan</li>
        <li>Treatment timeline estimate</li>
        <li>Flexible payment options</li>
      </ul>
    `,
  },
]

// ---------------------------------------------------------------------------
// Mock Contact Form Submission
// ---------------------------------------------------------------------------

/**
 * Simulates a successful contact form submission with a short artificial
 * delay so the loading state of the submit button is visible during dev.
 */
export async function mockSubmitContactForm(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _payload: ContactFormData
): Promise<ContactFormResponse> {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ success: true }), 1200)
  })
}
