import { createBrowserRouter } from 'react-router'
import { AppLayout } from '../components/layout/AppLayout.tsx'
import { AdminLayout } from '../features/admin/AdminLayout.tsx'
import { AuthProvider } from '../features/admin/AuthProvider.tsx'
import { RequireAuth } from '../features/admin/RequireAuth.tsx'
import { AboutPage } from '../pages/AboutPage.tsx'
import { ContactPage } from '../pages/ContactPage.tsx'
import { HomePage } from '../pages/HomePage.tsx'
import { NotFoundPage } from '../pages/NotFoundPage.tsx'
import { WorkPage } from '../pages/WorkPage.tsx'
import {
  CertificationsPage,
  DashboardPage,
  EmailGalleryDemoPage,
  LegacyDemoPage,
  LoginPage,
  LogisticsDemoPage,
  MessagesPage,
  NotificationsDemoPage,
  PlansDemoPage,
  ProjectEditorPage,
  ProjectsPage,
  SiteContentPage,
  SupportDemoPage,
  ToursDemoPage,
  TrackingDemoPage,
  WorkDetailPage,
} from './lazyPages.tsx'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'work', element: <WorkPage /> },
      { path: 'work/:slug', element: <WorkDetailPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: 'demo/logistics', element: <LogisticsDemoPage /> },
      { path: 'demo/notifications', element: <NotificationsDemoPage /> },
      { path: 'demo/tracking', element: <TrackingDemoPage /> },
      { path: 'demo/support', element: <SupportDemoPage /> },
      { path: 'demo/legacy', element: <LegacyDemoPage /> },
      { path: 'demo/tours', element: <ToursDemoPage /> },
      { path: 'demo/emails', element: <EmailGalleryDemoPage /> },
      { path: 'demo/plans', element: <PlansDemoPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
  {
    path: 'admin',
    element: <AuthProvider />,
    children: [
      { path: 'login', element: <LoginPage /> },
      {
        element: <RequireAuth />,
        children: [
          {
            element: <AdminLayout />,
            children: [
              { index: true, element: <DashboardPage /> },
              { path: 'projects', element: <ProjectsPage /> },
              { path: 'projects/:id', element: <ProjectEditorPage /> },
              { path: 'certifications', element: <CertificationsPage /> },
              { path: 'content', element: <SiteContentPage /> },
              { path: 'messages', element: <MessagesPage /> },
              { path: '*', element: <NotFoundPage /> },
            ],
          },
        ],
      },
    ],
  },
])
