import type {
  BeforeAfter,
  CaseStudy,
  ClinicInfo,
  Doctor,
  Service,
  Testimonial,
  ContactFormData,
  ContactFormResponse,
  TenantConfig,
  WpPage,
  Faq,
  SpecialOffer,
  FinancingOption,
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
    teamCredentials: true,
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
  socialMetrics: {
    googleRating: 4.9,
    googleReviewCount: 312,
    rating: 4.9,
    reviewCount: 312,
    yearsInBusiness: 2009,
    accreditations: ['ADA Member', 'AGD Fellow'],
    awards: ['Top Dentist 2024', 'Best of Spring Valley'],
  },
  insurance: {
    acceptedProviders: ['Aetna', 'Cigna', 'Delta Dental', 'MetLife', 'United Healthcare'],
    paymentPlans: ['In-house financing', 'CareCredit', '0% APR for 12 months'],
    newPatientSpecial: {
      headline: 'New Patient Special',
      description:
        'Comprehensive exam, X-rays, and a full cleaning — everything you need to start your smile journey.',
      price: '£149',
      ctaLabel: 'Claim Offer',
      ctaHref: '#contact',
    },
  },
  mapIframeUrl:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.816!2d36.8219!3d-1.2833!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMcKwMTYnNTkuOSJTIDM2wrA0OScxOS4xIkU!5e0!3m2!1sen!2ske!4v0000000000000',
}

// ---------------------------------------------------------------------------
// Mock Doctors (minimum 3)
// ---------------------------------------------------------------------------
// Fixture variety is deliberate — it exercises every branch of the credential
// UI in offline/dev mode:
//   1. Dr. Osei  — structured `credentials` repeater (2+) AND legacy
//                  `qualifications`, so the merged `credentialChips` path and
//                  the full drawer (video + fun_fact + metadata) all render.
//   2. Dr. Kariuki — ZERO credentials/qualifications → R2 self-hide: no chip
//                  block, no trigger, drawer unreachable.
//   3. Dr. Mwangi — structured repeater only (legacy qualifications absent),
//                  proving the UI never branches on which shape arrived.
//
// `credentialChips` is populated by hand here because mock mode returns
// MOCK_DOCTORS directly, bypassing the endpoint mapper — it must therefore
// mirror exactly what `normaliseCredentialChips()` would produce.
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
    credentials: [
      { credential_title: 'BDS', credential_type: 'Degree', institution: 'University of Nairobi', year: '2010' },
      { credential_title: 'MFDS RCS', credential_type: 'Fellowship', institution: 'Royal College of Surgeons Edinburgh', year: '2014' },
      { credential_title: 'Invisalign Certification', credential_type: 'Certification', institution: 'Align Technology', year: '2018' },
    ],
    credentialChips: [
      'BDS – University of Nairobi',
      'MFDS RCS Edinburgh',
      'Invisalign Certified Provider',
      'BDS',
      'MFDS RCS',
      'Invisalign Certification',
    ],
    years_in_practice: 14,
    languages_spoken: ['English', 'Swahili'],
    personal_bio_video_url: 'https://example.com/videos/dr-osei-bio.mp4',
    fun_fact: 'Outside the clinic Dr. Osei is a keen landscape painter and has exhibited twice in Nairobi.',
  },
  {
    id: 2,
    slug: 'dr-felix-kariuki',
    name: 'Dr. Felix Kariuki',
    specialty: 'Orthodontics & Implantology',
    bio: 'Specialising in braces, clear aligners, and dental implants, Dr. Kariuki combines cutting-edge technology with a gentle approach to transform smiles of all ages.',
    imageUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400',
    // Intentionally no qualifications / credentials → credentialChips empty.
    credentialChips: [],
    years_in_practice: 9,
    languages_spoken: ['English', 'Swahili', 'German'],
  },
  {
    id: 3,
    slug: 'dr-linda-mwangi',
    name: 'Dr. Linda Mwangi',
    specialty: 'Paediatric Dentistry & Oral Health',
    bio: 'Dr. Mwangi specialises in creating a positive dental experience for children from infancy through adolescence, building lifelong habits for excellent oral health.',
    imageUrl: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400',
    credentials: [
      { credential_title: 'BDS', credential_type: 'Degree', institution: 'University of Nairobi', year: '2012' },
      { credential_title: 'MDS Paediatric Dentistry', credential_type: 'Degree', institution: 'University of KwaZulu-Natal', year: '2016' },
      { credential_title: 'SAADP Membership', credential_type: 'Membership', institution: 'SAADP', year: '2017' },
    ],
    credentialChips: [
      'BDS',
      'MDS Paediatric Dentistry',
      'SAADP Membership',
    ],
    years_in_practice: 11,
    languages_spoken: ['English', 'Swahili'],
    fun_fact: 'Dr. Mwangi once volunteered on a dental outreach trip across three rural counties in a single week.',
  },
]

// ---------------------------------------------------------------------------
// Mock Before/After (minimum 3)
// ---------------------------------------------------------------------------
// One case is featured (pins to top); treatment_type and display_order are
// varied so the gallery's featured-pin + sort + filter logic is exercised.
// Case titles are operator-edited anonymised descriptors — no real patient
// names (R7 pseudonymisation).
export const MOCK_BEFORE_AFTER: BeforeAfter[] = [
  {
    id: 1,
    slug: 'case-veneer-smile-makeover',
    case_title: 'Full Smile Makeover — Porcelain Veneers',
    treatment_type: 'Veneers',
    description:
      'Diagonal asymmetry and heavy staining across the upper anterior segment transformed with a set of porcelain veneers in two visits.',
    dentist: 'Dr. Amara Osei',
    before_image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600',
    after_image: 'https://images.unsplash.com/photo-1598256989928-f843536ece3d?w=600',
    is_featured: true,
    display_order: 1,
  },
  {
    id: 2,
    slug: 'case-invisalign-alignment',
    case_title: 'Invisalign Clear Aligner Correction',
    treatment_type: 'Invisalign',
    description:
      'Mild crowding and a narrow arch resolved with a series of clear aligners, completing within the estimated timeline.',
    dentist: 'Dr. Felix Kariuki',
    before_image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600',
    after_image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600',
    is_featured: false,
    display_order: 2,
  },
  {
    id: 3,
    slug: 'case-whitening-brightening',
    case_title: 'In-Chair Teeth Whitening',
    treatment_type: 'Whitening',
    description:
      'Years of coffee and tea staining lifted by several shades in a single in-chair session, with sensitivity managed throughout.',
    dentist: 'Dr. Linda Mwangi',
    before_image: 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=600',
    after_image: 'https://images.unsplash.com/photo-1571772996211-2f02c9727629?w=600',
    is_featured: false,
    display_order: 3,
  },
  {
    id: 4,
    slug: 'case-implant-single-replacement',
    case_title: 'Single Tooth Implant Replacement',
    treatment_type: 'Implants',
    description:
      'A missing lower molar replaced with a titanium implant and crown, restoring full chewing function without bridging to adjacent teeth.',
    dentist: 'Dr. Felix Kariuki',
    before_image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=600',
    after_image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600',
    is_featured: false,
    display_order: 4,
  },
]

// ---------------------------------------------------------------------------
// Mock Services (minimum 6)
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// Mock Services (minimum 6)
// ---------------------------------------------------------------------------
// Pricing + metadata fields are intentionally varied across entries so the
// conditional rendering in ServicesSection has something to exercise:
//   - teeth-whitening / root-canal / preventive-care → numeric price band
//   - dental-implants → price band + financing_note + gallery
//   - orthodontics / dental-veneers → is_price_upon_request (band hidden)
export const MOCK_SERVICES: Service[] = [
  {
    id: 1,
    slug: 'teeth-whitening',
    name: 'Teeth Whitening',
    description:
      'Professional in-chair and take-home whitening treatments that safely lighten enamel staining by up to 8 shades, leaving you with a brilliantly bright smile.',
    iconUrl: '/icons/whitening.svg',
    imageUrl: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600',
    starting_price: 250,
    price_range_max: 600,
    price_suffix: 'per arch',
    is_price_upon_request: false,
    price_fine_print: 'Results vary. Includes in-chair session.',
    procedure_time: '60 min',
    recovery_time: 'None',
  },
  {
    id: 2,
    slug: 'dental-implants',
    name: 'Dental Implants',
    description:
      'Permanent, natural-looking tooth replacements anchored directly into the jawbone. Implants restore full chewing function and prevent bone loss long-term.',
    iconUrl: '/icons/implant.svg',
    imageUrl: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=600',
    starting_price: 2500,
    price_range_max: 4500,
    price_suffix: 'per tooth',
    is_price_upon_request: false,
    price_fine_print: 'Includes implant, abutment and crown.',
    financing_note: '0% financing available over 12 months.',
    procedure_time: '3–6 months',
    recovery_time: '1–2 weeks',
    gallery: [
      'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800',
      'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800',
    ],
  },
  {
    id: 3,
    slug: 'orthodontics',
    name: 'Orthodontics & Braces',
    description:
      'From traditional metal braces to virtually invisible clear aligners, our orthodontic plans are tailored to achieve precise, lasting alignment for teens and adults alike.',
    iconUrl: '/icons/braces.svg',
    imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600',
    is_price_upon_request: true,
    procedure_time: '12–24 months',
    recovery_time: 'Ongoing',
  },
  {
    id: 4,
    slug: 'root-canal',
    name: 'Root Canal Treatment',
    description:
      'Modern endodontic therapy that saves severely infected teeth, eliminating pain and preserving your natural tooth structure using precision rotary instruments.',
    iconUrl: '/icons/root-canal.svg',
    imageUrl: 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=600',
    starting_price: 700,
    price_range_max: 1200,
    price_suffix: 'per tooth',
    is_price_upon_request: false,
    price_fine_print: 'Final cost depends on the number of canals.',
    procedure_time: '90 min',
    recovery_time: '2–3 days',
  },
  {
    id: 5,
    slug: 'dental-veneers',
    name: 'Porcelain Veneers',
    description:
      'Ultra-thin porcelain shells bonded to the front surface of teeth to correct discolouration, chips, gaps, and minor misalignment — a complete smile makeover in two visits.',
    iconUrl: '/icons/veneers.svg',
    imageUrl: 'https://images.unsplash.com/photo-1598256989928-f843536ece3d?w=600',
    is_price_upon_request: true,
    procedure_time: '2 visits',
    recovery_time: '1 week',
    gallery: [
      'https://images.unsplash.com/photo-1598256989928-f843536ece3d?w=800',
      'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800',
    ],
  },
  {
    id: 6,
    slug: 'preventive-care',
    name: 'Preventive Care & Hygiene',
    description:
      'Regular scale-and-polish, fluoride treatments, fissure sealants, and personalised oral hygiene coaching keep decay and gum disease at bay — and reduce long-term treatment costs.',
    iconUrl: '/icons/hygiene.svg',
    imageUrl: 'https://images.unsplash.com/photo-1571772996211-2f02c9727629?w=600',
    starting_price: 120,
    price_range_max: 250,
    price_suffix: 'per visit',
    is_price_upon_request: false,
    price_fine_print: 'Includes scale, polish and check-up.',
    procedure_time: '45 min',
    recovery_time: 'None',
  },
]

// ---------------------------------------------------------------------------
// Mock Testimonials
// ---------------------------------------------------------------------------
// Optional fields (rating, location, imageUrl, video_url, video_thumbnail,
// source_platform, treatment_received) are varied across entries so the
// component's conditional rendering is exercised in offline/dev mode. Entry 3
// is a video testimonial — it is the only one with a video_url, so the
// inline-player branch gets exercised in dev/mock mode.
export const MOCK_TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    author: 'Sarah M.',
    quote:
      'I used to dread dental visits, but this team completely changed that. The staff is gentle, explain every step, and genuinely care about your comfort. My whole family comes here now.',
    rating: 5,
    location: 'Spring Valley, NJ',
    imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200',
    source_platform: 'Google',
    treatment_received: 'Preventive Care',
  },
  {
    id: 2,
    author: 'James T.',
    quote:
      'Got same-day emergency care when I cracked a molar on a Friday evening. They stayed late, fixed it perfectly, and followed up the next morning. That level of dedication is rare.',
    rating: 5,
    location: 'Nanuet, NJ',
    source_platform: 'Trustpilot',
    treatment_received: 'Emergency Repair',
  },
  {
    id: 3,
    author: 'Priya K.',
    quote:
      'The Invisalign experience was seamless from the 3D scan to the final retainer. My confidence has never been higher, and the results came in under the estimated timeline.',
    rating: 4,
    video_url: 'https://example.com/testimonials/priya-invisalign.mp4',
    video_thumbnail: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600',
    source_platform: 'Google',
    treatment_received: 'Invisalign',
  },
  {
    id: 4,
    author: 'Marcus L.',
    quote:
      'Teeth whitening results were stunning. In one session my smile went from years of coffee staining to genuinely bright. People keep asking what I did differently.',
    rating: 5,
    location: 'Monsey, NY',
    treatment_received: 'Teeth Whitening',
  },
  {
    id: 5,
    author: 'Elena V.',
    quote:
      'Root canal sounds scary but they made it completely painless. The numbing was perfect, the procedure was quick, and I was back at work the same afternoon. Truly remarkable.',
    rating: 5,
    source_platform: 'Trustpilot',
  },
  {
    id: 6,
    author: 'David R.',
    quote:
      'My kids actually look forward to their cleanings now. The hygienists are patient and make it educational. Finding a dentist the whole family loves is rare — we found ours.',
    rating: 5,
    location: 'Pearl River, NY',
    source_platform: 'Google',
    treatment_received: 'Paediatric Hygiene',
  },
]

// ---------------------------------------------------------------------------
// Mock Special Offers
// ---------------------------------------------------------------------------
//
// The client-side filter keeps only offers that are BOTH is_active=true AND
// within the [start_date, end_date] window (today = 2026-07-15 in dev).
//
//   A — active + in-window + has regular_price  → RENDERS (exercises strikethrough)
//   B — active + expired (end 2026-06-30)        → filtered out
//   C — inactive (is_active=false) + in-window   → filtered out
//   D — active + future (start 2026-09-01)       → filtered out
export const MOCK_SPECIAL_OFFERS: SpecialOffer[] = [
  {
    id: 1,
    headline: 'Teeth Whitening Special',
    offer_description:
      'Professional in-chair whitening that lifts stains by up to 8 shades in a single visit.',
    price_display: '£99',
    regular_price: '£199',
    image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600',
    cta_label: 'Claim Offer',
    cta_url: '#contact',
    start_date: '2026-06-01',
    end_date: '2026-08-31',
    is_active: true,
    display_order: 1,
  },
  {
    id: 2,
    headline: 'Invisalign Consultation',
    offer_description:
      'Digital smile scan, treatment timeline estimate, and flexible payment options.',
    price_display: '£49',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600',
    cta_label: 'Book Consultation',
    cta_url: '#contact',
    start_date: '2026-01-01',
    end_date: '2026-06-30',
    is_active: true,
    display_order: 2,
  },
  {
    id: 3,
    headline: 'Dental Implant Assessment',
    offer_description:
      '3D imaging and a personalised implant plan with our senior implantologist.',
    price_display: '£75',
    regular_price: '£150',
    image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=600',
    cta_label: 'Reserve Slot',
    cta_url: '#contact',
    start_date: '2026-06-01',
    end_date: '2026-08-31',
    is_active: false,
    display_order: 3,
  },
  {
    id: 4,
    headline: 'Orthodontics Early Bird',
    offer_description:
      'Book your braces or clear-aligner treatment before the end of September and save.',
    price_display: '£1,299',
    image: 'https://images.unsplash.com/photo-1598256989928-f843536ece3d?w=600',
    cta_label: 'Learn More',
    cta_url: '#contact',
    start_date: '2026-09-01',
    end_date: '2026-10-31',
    is_active: true,
    display_order: 4,
  },
]

// ---------------------------------------------------------------------------
// Mock FAQs
// ---------------------------------------------------------------------------
export const MOCK_FAQS: Faq[] = [
  {
    id: 1,
    category: 'Appointments',
    question: 'How do I book an appointment?',
    answer:
      'You can book online using the form on this page, or call us directly during business hours. We confirm every appointment by phone or email within one business day.',
  },
  {
    id: 2,
    category: 'Appointments',
    question: 'Do you accept walk-in or emergency patients?',
    answer:
      'Yes — we reserve time each day for dental emergencies including severe toothache, swelling, and cracked teeth. Call us and we will see you as quickly as possible, usually the same day.',
  },
  {
    id: 3,
    category: 'Insurance & Billing',
    question: 'Which insurance plans do you accept?',
    answer:
      'We accept most major dental insurance plans including Aetna, Cigna, Delta Dental, MetLife, and United Healthcare. Contact us to confirm your specific plan is in-network.',
  },
  {
    id: 4,
    category: 'Insurance & Billing',
    question: "What if I don't have dental insurance?",
    answer:
      'We offer flexible payment plans and a new-patient special for uninsured patients. Our team will outline all costs upfront so there are no surprises.',
  },
  {
    id: 5,
    category: 'Treatments',
    question: 'Does a root canal hurt?',
    answer:
      'Modern root canals are performed under effective local anaesthesia and are no more uncomfortable than having a filling. Most patients return to normal activities the same day.',
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
// Mock Financing Options (minimum 3)
// ---------------------------------------------------------------------------
// Fixture variety is deliberate — it exercises every branch of the financing
// band in offline/dev mode:
//   1. Apex In-House Plan  — is_in_house_plan=true → distinct in-house styling;
//                            no pre_qualify_url (clinic's own plan, so the CTA
//                            branch is NOT rendered for this card).
//   2. BrightPay Finance   — third-party, accepted, HAS a pre_qualify_url → the
//                            "Check eligibility" CTA renders.
//   3. ClearDent Credit    — third-party, accepted, no pre_qualify_url → proves
//                            the card renders correctly without a CTA.
//   4. MedSplit Loans      — third-party, accepted → additional third-party
//                            entry so the mixed-band layout is exercised.
//
// Every field is populated here (including `accepted`) because mock mode returns
// MOCK_FINANCING_OPTIONS directly, bypassing the endpoint mapper — it must
// therefore mirror exactly what `fetchFinancingOptions()` would produce.
export const MOCK_FINANCING_OPTIONS: FinancingOption[] = [
  {
    id: 1,
    slug: 'apex-in-house-plan',
    provider_name: 'Apex In-House Plan',
    description:
      'Spread the cost over 6, 12 or 24 monthly payments with zero interest on our own flexible plan.',
    is_in_house_plan: true,
    monthly_payment_display: 'From £49/mo',
    pre_qualify_url: '',
    accepted: true,
    logo: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=200',
    display_order: 1,
  },
  {
    id: 2,
    slug: 'brightpay-finance',
    provider_name: 'BrightPay Finance',
    description:
      'Affordable monthly payment plans for dental and specialist treatment, subject to status.',
    is_in_house_plan: false,
    monthly_payment_display: 'From £35/mo',
    pre_qualify_url: 'https://brightpay.example.com/pre-qualify',
    accepted: true,
    logo: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=200',
    display_order: 2,
  },
  {
    id: 3,
    slug: 'cleardent-credit',
    provider_name: 'ClearDent Credit',
    description:
      'Low-rate credit for higher-value procedures with quick online decisions and no upfront fees.',
    is_in_house_plan: false,
    monthly_payment_display: 'From £60/mo',
    pre_qualify_url: '',
    accepted: true,
    logo: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=200',
    display_order: 3,
  },
  {
    id: 4,
    slug: 'medsplit-loans',
    provider_name: 'MedSplit Loans',
    description:
      'Medical financing designed for dental care — flexible terms and repayments tailored to you.',
    is_in_house_plan: false,
    monthly_payment_display: 'From £42/mo',
    pre_qualify_url: 'https://medsplit.example.com/apply',
    accepted: true,
    logo: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=200',
    display_order: 4,
  },
]

// ---------------------------------------------------------------------------
// Mock Case Studies (smile stories — minimum 3)
// ---------------------------------------------------------------------------
// Fixture variety is deliberate — it exercises every branch of the smile-
// stories band in offline/dev mode:
//   1. "Alex R."  — full before/after images, NO video_url → the standard
//                    card layout (image pair + text, no play link).
//   2. "Jordan K."— full before/after images AND a video_url → the play
//                    button/link branch renders.
//   3. "Sam T."   — NO before/after images (edge case) → the image-free
//                    layout branch renders (placeholder tiles, text only).
//
// patient_name values are pseudonyms only (R7): no real names, no diagnosis
// or procedure dates. Every field is populated here (including `doctor` as a
// display name) because mock mode returns MOCK_CASE_STUDIES directly,
// bypassing the endpoint mapper — it must therefore mirror exactly what
// `fetchCaseStudies()` would produce.
export const MOCK_CASE_STUDIES: CaseStudy[] = [
  {
    id: 1,
    slug: 'smile-makeover-veneers',
    patient_name: 'Alex R.',
    treatment_type: 'Porcelain Veneers',
    story_body:
      'After years of feeling self-conscious about a gap and uneven staining, a set of porcelain veneers completely transformed my confidence. The whole process took just two visits, and the result looks completely natural.',
    before_image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600',
    after_image: 'https://images.unsplash.com/photo-1598256989928-f843536ece3d?w=600',
    doctor: 'Dr. Amara Osei',
    display_order: 1,
  },
  {
    id: 2,
    slug: 'invisalign-alignment',
    patient_name: 'Jordan K.',
    treatment_type: 'Invisalign',
    story_body:
      'I was nervous about braces as an adult, but the clear aligners were far more comfortable than I expected. A year later my smile is straighter than I ever thought possible — and the video walkthrough captured the whole journey.',
    before_image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600',
    after_image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600',
    video_url: 'https://example.com/case-studies/jordan-invisalign.mp4',
    doctor: 'Dr. Felix Kariuki',
    display_order: 2,
  },
  {
    id: 3,
    slug: 'whitening-confidence',
    patient_name: 'Sam T.',
    treatment_type: 'Teeth Whitening',
    story_body:
      'Years of coffee and tea had taken their toll. A single in-chair whitening session lifted the staining by several shades, and I left the clinic genuinely smiling at my reflection.',
    // Intentionally no before/after images → exercises the image-free layout.
    before_image: '',
    after_image: '',
    doctor: 'Dr. Linda Mwangi',
    display_order: 3,
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

// ---------------------------------------------------------------------------
// Mock Contact Lease (location-aware appointment request)
// ---------------------------------------------------------------------------

/**
 * Mock stand-in for the `contact-lease` endpoint. Logs the non-PHI intake
 * payload to the console (so the location-aware request flow is observable
 * during offline dev) and resolves immediately.
 *
 * Real filtering of any PHI never happens client-side — this mock only ever
 * sees the non-PHI fields `location_id`, `preferred_time`, and
 * `reason_for_visit`. Collecting medical history, medications, SSN,
 * subscriber ID, or chart data is a hand-off to a BAA-covered vendor, never
 * a native field.
 */
export async function mockSubmitContactLease(
  payload: ContactFormData
): Promise<ContactFormResponse> {
  // eslint-disable-next-line no-console
  console.log('[mock] contact-lease appointment request', {
    name: payload.name,
    email: payload.email,
    phone: payload.phone,
    location_id: payload.location_id,
    preferred_time: payload.preferred_time,
    reason_for_visit: payload.reason_for_visit,
  })
  return { success: true }
}
