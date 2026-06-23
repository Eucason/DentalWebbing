/* eslint-disable react-refresh/only-export-components */
import { lazy } from 'react'
import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { RouteErrorFallback } from './components/layout/RouteErrorFallback'

const HomePage = lazy(() => import('./pages/HomePage'))
const ServicesPage = lazy(() => import('./pages/ServicesPage'))
const TeamPage = lazy(() => import('./pages/TeamPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

const routes = [
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/services',
    element: <ServicesPage />,
  },
  {
    path: '/team',
    element: <TeamPage />,
  },
  {
    path: '/contact',
    element: <ContactPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<AppLayout />} errorElement={<RouteErrorFallback />}>
      {routes.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={route.element}
          errorElement={<RouteErrorFallback />}
        />
      ))}
    </Route>
  )
)
