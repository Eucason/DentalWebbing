# Phase 3: Core Feature Implementation & Page Assembly Architecture Guide

**Milestone Goal:** Integrate data-fetching hooks using React Query to build out dynamic page sections, assemble the primary application pages, handle complex UI states (loading, error, empty), implement dynamic SEO metadata, and set up user interaction forms.

## 3.1 Custom Data Hooks (React Query Integration)

Implement the core data-fetching hooks in the `src/hooks/` directory. These hooks will utilize the centralized Axios instance and React Query to manage server state.

*   **`useClinicInfo()`:** Fetches the primary clinic details (Hero content, address, hours, phone). Should be configured with a long `staleTime` as this data rarely changes.
*   **`useDoctors()`:** Fetches the list of doctors/team members from the WordPress API. Must map the raw WP response into the strongly typed `Doctor` interface defined in Phase 2.
*   **`useServices()`:** Fetches the offered dental services. Should handle potential pagination or categorization parameters if the backend supports it.
*   **State Management:** Every hook must expose `data`, `isLoading`, and `isError` to allow components to easily render Skeletons or Error boundaries without managing local `useEffect` state.

## 3.2 Dynamic Section Components

Build the functional layout sections in `src/components/sections/` that consume the React Query hooks. 

*   **`HeroSection`:** Consumes `useClinicInfo()`. Applies tenant-specific background properties, primary branding colors via CSS variables, and dynamic Call-To-Action (CTA) buttons. Includes a skeleton loading state for the hero text.
*   **`DoctorsSection`:** Consumes `useDoctors()`. Renders a responsive CSS Grid (via Tailwind) of `Card` components. If `isLoading` is true, renders a grid of `Skeleton` cards. If `isError` is true, displays a localized error message.
*   **`ServicesSection`:** Consumes `useServices()`. Displays available treatments. Implements an empty state if the API returns no services (e.g., "Services coming soon").
*   **`ContactSection`:** Displays the dynamic address and contact information alongside a functional contact form (detailed in 3.5).

## 3.3 Page Assembly and Layouts

Assemble the full pages in `src/pages/` by combining the layout components (`Header`, `Footer`, `PageWrapper`) and the dynamic sections.

*   **`HomePage`:** Composes the `HeroSection`, an abbreviated `ServicesSection` (e.g., top 3 services), and the `DoctorsSection`.
*   **`ServicesPage`:** A dedicated page displaying the comprehensive list of services with potential filtering or detailed descriptions.
*   **`TeamPage`:** A dedicated expanded view of the clinic's staff and doctors.
*   **Layout Context Binding:** Ensure `Header` and `Footer` are successfully consuming the `TenantContext` to display the dynamic logo URL, clinic name, and global footer details.

## 3.4 Dynamic SEO & Document Head Management

Implement dynamic metadata injection to ensure proper SEO indexability for each tenant clinic.

*   **Dependency Addition:** Add `react-helmet-async` to manage the document `<head>`.
*   **Implementation:** Create a reusable `SEO` component (e.g., `src/components/SEO.tsx`) that accepts `title`, `description`, and `openGraph` props.
*   **Contextual Titles:** The `SEO` component should automatically append the clinic's name (from `TenantContext`) to the title (e.g., `Services | Apex Orthodontics`). Include this component at the top of every page in `src/pages/`.

## 3.5 Form Handling & User Interaction

Implement robust client-side form logic for the `ContactPage` or inline contact sections.

*   **Libraries:** Utilize `react-hook-form` for performant, uncontrolled form state management and optionally `zod` for schema-based validation.
*   **API Integration:** Use React Query's `useMutation` hook to handle form submission (e.g., sending the payload to a WordPress REST API endpoint).
*   **UX/Feedback:** Implement a `loading` state on the submit button using the primitive UI components built in Phase 2. Display success/error toast notifications or inline alerts upon submission resolution.

## 3.6 Responsive Design & Accessibility Polish

Finalize the frontend presentation layer ensuring it is mobile-ready and accessible.

*   **Responsive Grid:** Strictly adhere to Tailwind's mobile-first breakpoints (`sm:`, `md:`, `lg:`). Ensure that grids (like the Doctors roster) gracefully collapse from 3-columns on desktop to 1-column on mobile.
*   **Accessibility (a11y):** Ensure all dynamic image tags (from the WP API) have descriptive `alt` text. Verify that interactive elements like buttons and form inputs have appropriate ARIA attributes, label associations, and visible focus states, particularly against the dynamically applied tenant colors.
