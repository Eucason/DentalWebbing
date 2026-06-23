import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { createApiClient } from '../../api/client'
import { submitContactForm } from '../../api/endpoints'
import { useTenantConfig } from '../../context/useTenant'
import { mockSubmitContactForm } from '../../mocks/data'
import { Button } from '../ui/Button'

// ---------------------------------------------------------------------------
// Zod validation schema — mirrors the exact spec in Task 19
// ---------------------------------------------------------------------------

const phoneRegex = /^\+?[\d\s-]{7,15}$/

const contactSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required.')
    .min(2, 'Name must be at least 2 characters.')
    .max(80, 'Name must be at most 80 characters.'),
  email: z.string().min(1, 'Email is required.').email('Please enter a valid email address.'),
  phone: z
    .string()
    .nullable()
    .refine(
      (val) => val === null || val === '' || phoneRegex.test(val),
      'Please enter a valid phone number.'
    )
    .transform((val) => (val === '' ? null : val)),
  message: z
    .string()
    .min(1, 'Message is required.')
    .min(10, 'Message must be at least 10 characters.')
    .max(1000, 'Message must be at most 1000 characters.'),
})

type ContactFormValues = z.infer<typeof contactSchema>

// ---------------------------------------------------------------------------
// ContactForm component
// ---------------------------------------------------------------------------
// State machine:
//   Idle       → form visible, submit enabled, no alert
//   Submitting → submit button loading, all fields disabled
//   Success    → form hidden, green inline alert
//   Error      → form visible, red inline alert below form
// ---------------------------------------------------------------------------

export function ContactForm() {
  const tenantConfig = useTenantConfig()
  const useMocks = import.meta.env.VITE_USE_MOCKS === 'true'

  const mutation = useMutation<{ success: boolean }, Error, ContactFormValues>({
    mutationFn: (payload) => {
      const safePayload = {
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        message: payload.message,
      }
      return useMocks
        ? mockSubmitContactForm(safePayload)
        : submitContactForm(createApiClient(tenantConfig), safePayload)
    },
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      message: '',
    },
  })

  const onSubmit = (data: ContactFormValues) => {
    mutation.mutate(data)
  }

  // ── Success state — replace the entire form ──────────────────────────────
  if (mutation.isSuccess) {
    return (
      <div
        className="rounded-lg border border-green-200 bg-green-50 px-6 py-8 text-center"
        role="status"
        aria-live="polite"
      >
        <svg
          className="mx-auto mb-3 h-10 w-10 text-green-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="text-lg font-semibold text-green-800">
          Thank you! We'll be in touch shortly.
        </p>
      </div>
    )
  }

  // ── Form (Idle / Submitting / Error) ──────────────────────────────────────
  const formDisabled = mutation.isPending

  // Shared input classes — focus-visible ring for keyboard users
  const inputClasses =
    'mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm placeholder-slate-400 focus:border-[var(--tenant-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tenant-primary)] disabled:cursor-not-allowed disabled:opacity-50'

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
        {/* Name */}
        <div>
          <label htmlFor="contact-name" className="block text-sm font-medium text-slate-700">
            Name{' '}
            <span className="text-red-500" aria-hidden="true">
              *
            </span>
          </label>
          <input
            id="contact-name"
            type="text"
            placeholder="Your full name"
            disabled={formDisabled}
            aria-required="true"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'contact-name-error' : undefined}
            className={inputClasses}
            {...register('name')}
          />
          {errors.name && (
            <p id="contact-name-error" className="mt-1 text-xs text-red-600" role="alert">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="contact-email" className="block text-sm font-medium text-slate-700">
            Email{' '}
            <span className="text-red-500" aria-hidden="true">
              *
            </span>
          </label>
          <input
            id="contact-email"
            type="email"
            placeholder="you@example.com"
            disabled={formDisabled}
            aria-required="true"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'contact-email-error' : undefined}
            className={inputClasses}
            {...register('email')}
          />
          {errors.email && (
            <p id="contact-email-error" className="mt-1 text-xs text-red-600" role="alert">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Phone (optional) */}
        <div>
          <label htmlFor="contact-phone" className="block text-sm font-medium text-slate-700">
            Phone <span className="text-slate-400 text-xs">(optional)</span>
          </label>
          <input
            id="contact-phone"
            type="text"
            placeholder="+254 700 123 456"
            disabled={formDisabled}
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? 'contact-phone-error' : undefined}
            className={inputClasses}
            {...register('phone')}
          />
          {errors.phone && (
            <p id="contact-phone-error" className="mt-1 text-xs text-red-600" role="alert">
              {errors.phone.message}
            </p>
          )}
        </div>

        {/* Message */}
        <div>
          <label htmlFor="contact-message" className="block text-sm font-medium text-slate-700">
            Message{' '}
            <span className="text-red-500" aria-hidden="true">
              *
            </span>
          </label>
          <textarea
            id="contact-message"
            rows={5}
            placeholder="How can we help you?"
            disabled={formDisabled}
            aria-required="true"
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? 'contact-message-error' : undefined}
            className={`${inputClasses} resize-y`}
            {...register('message')}
          />
          {errors.message && (
            <p id="contact-message-error" className="mt-1 text-xs text-red-600" role="alert">
              {errors.message.message}
            </p>
          )}
        </div>

        {/* HIPAA Disclaimer */}
        <p className="rounded-md border border-slate-100 bg-slate-50 p-3 text-xs text-slate-500">
          <strong className="font-semibold text-slate-700">Privacy Note:</strong> Please do not
          include any sensitive medical or personal health information (PHI) in this form. This form
          is intended for general inquiries only.
        </p>

        {/* Submit */}
        <Button
          type="submit"
          loading={mutation.isPending}
          disabled={formDisabled}
          aria-busy={mutation.isPending}
          className="self-start"
        >
          Send Message
        </Button>
      </form>

      {/* API error alert */}
      {mutation.isError && (
        <div
          className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-700"
          role="alert"
          aria-live="polite"
        >
          Something went wrong. Please try again or call us directly.
        </div>
      )}
    </div>
  )
}
