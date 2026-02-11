# site.md - Sitemap & Flows

## Architecture Overview

`jacilandia.mx` is a high-performance SPA built with React 19 and Vite. It features a custom "atmospheric" navigation system where each view has its own color palette and transitions.

## Screen Inventory

| Intent            | Route                | Key Components                        |
| :---------------- | :------------------- | :------------------------------------ |
| Landing / Hero    | `/`                  | `HomeView`, `AtmosphereOverlay`       |
| About Us          | `?view=ABOUT`        | `AboutView`, `TeamGrid`               |
| Methodology       | `?view=METHODOLOGY`  | `MethodologyView`, `InteractiveSteps` |
| Levels / Classes  | `?view=LEVELS`       | `LevelsView`, `CurriculumCards`       |
| Pricing / Plans   | `?view=PRICING`      | `PricingView`, `ComparisonTable`      |
| Testimonials      | `?view=TESTIMONIALS` | `TestimonialsView`, `MasonryWall`     |
| Locations         | `?view=LOCATIONS`    | `LocationsView`, `MapDisplay`         |
| Registration      | `?view=REGISTER`     | `RegisterView`, `MultiStepForm`       |
| Student Dashboard | `?view=DASHBOARD`    | `DashboardView`, `ProgressTracker`    |
| Privacy Policy    | `?view=PRIVACY`      | `PrivacyView`                         |

## User Flows

1. **Discovery**: Home -> Levels -> Pricing -> Register.
2. **Support**: Home -> Locations -> About.
3. **Engagement**: Home -> Testimonials -> Methodology.
