# site.md - Sitemap & Flows

## Architecture Overview

`jacilandia.mx` is a high-performance SPA built with React 19 and Vite. It features a custom "atmospheric" navigation system where each view has its own color palette and transitions.

## Screen Inventory

| Intent            | State / Route  | Key Components                | Backend Integration          |
| :---------------- | :------------- | :---------------------------- | :--------------------------- |
| Landing / Hero    | `HOME`         | `HomeView`, `FloatingMonster` | -                            |
| About Us          | `ABOUT`        | `AboutView`, `TeamGrid`       | -                            |
| Methodology       | `METHODOLOGY`  | `MethodologyView`             | -                            |
| Levels / Classes  | `LEVELS`       | `LevelsView`                  | -                            |
| Pricing / Plans   | `PRICING`      | `PricingView`                 | `/api/checkout/subscription` |
| Testimonials      | `TESTIMONIALS` | `TestimonialsView`            | -                            |
| Locations         | `LOCATIONS`    | `LocationsView`               | -                            |
| Registration      | `REGISTER`     | `RegisterView`, `LuciaForm`   | `/api/auth/login-dev`        |
| Student Dashboard | `DASHBOARD`    | `DashboardView`               | `/api/drops`, `/api/user`    |
| Downloads         | -              | `DownloadButton`              | `/api/download/:dropId`      |
| Privacy Policy    | `PRIVACY`      | `PrivacyView`                 | -                            |

## User Flows

1. **Discovery**: Home -> Levels -> Pricing -> Register.
2. **Subscription**: Pricing -> MercadoPago Checkout -> Dashboard.
3. **Consumption**: Dashboard -> Drop Selection -> R2 Asset Download.
4. **Authentication**: Login -> Lucia Session -> Protected Routes.
