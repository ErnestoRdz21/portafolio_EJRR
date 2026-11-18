import { lazy } from 'react'

export const WorkDetailPage = lazy(() =>
  import('../pages/WorkDetailPage.tsx').then((module) => ({
    default: module.WorkDetailPage,
  })),
)
export const LogisticsDemoPage = lazy(() =>
  import('../pages/demos/LogisticsDemoPage.tsx').then((module) => ({
    default: module.LogisticsDemoPage,
  })),
)
export const NotificationsDemoPage = lazy(() =>
  import('../pages/demos/NotificationsDemoPage.tsx').then((module) => ({
    default: module.NotificationsDemoPage,
  })),
)
export const TrackingDemoPage = lazy(() =>
  import('../pages/demos/TrackingDemoPage.tsx').then((module) => ({
    default: module.TrackingDemoPage,
  })),
)
export const SupportDemoPage = lazy(() =>
  import('../pages/demos/SupportDemoPage.tsx').then((module) => ({
    default: module.SupportDemoPage,
  })),
)
export const LegacyDemoPage = lazy(() =>
  import('../pages/demos/LegacyDemoPage.tsx').then((module) => ({
    default: module.LegacyDemoPage,
  })),
)
export const ToursDemoPage = lazy(() =>
  import('../pages/demos/ToursDemoPage.tsx').then((module) => ({
    default: module.ToursDemoPage,
  })),
)
export const EmailGalleryDemoPage = lazy(() =>
  import('../pages/demos/EmailGalleryDemoPage.tsx').then((module) => ({
    default: module.EmailGalleryDemoPage,
  })),
)
export const PlansDemoPage = lazy(() =>
  import('../pages/demos/PlansDemoPage.tsx').then((module) => ({
    default: module.PlansDemoPage,
  })),
)
export const LoginPage = lazy(() =>
  import('../pages/admin/LoginPage.tsx').then((module) => ({
    default: module.LoginPage,
  })),
)
export const DashboardPage = lazy(() =>
  import('../pages/admin/DashboardPage.tsx').then((module) => ({
    default: module.DashboardPage,
  })),
)
export const ProjectsPage = lazy(() =>
  import('../pages/admin/ProjectsPage.tsx').then((module) => ({
    default: module.ProjectsPage,
  })),
)
export const ProjectEditorPage = lazy(() =>
  import('../pages/admin/ProjectEditorPage.tsx').then((module) => ({
    default: module.ProjectEditorPage,
  })),
)
export const CertificationsPage = lazy(() =>
  import('../pages/admin/CertificationsPage.tsx').then((module) => ({
    default: module.CertificationsPage,
  })),
)
export const MessagesPage = lazy(() =>
  import('../pages/admin/MessagesPage.tsx').then((module) => ({
    default: module.MessagesPage,
  })),
)
export const SiteContentPage = lazy(() =>
  import('../pages/admin/SiteContentPage.tsx').then((module) => ({
    default: module.SiteContentPage,
  })),
)
