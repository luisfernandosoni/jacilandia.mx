# changelog.md - Project Milestones

## [1.1.0] - 2026-02-11

### Added

- **Layout Stability**: Implemented `min-height` stabilization and stable `Suspense` fallbacks in `App.tsx` to prevent layout snapping during navigation of lazy-loaded views.
- **Street View Infrastructure**: Fixed initialization race condition and optimized script loading in `LocationsView.tsx` to ensure reliable recovery even when API keys or CORS issues are present locally.
- **Motion Refinement**: Standardized `ScrollReveal` entrance offset and `FloatingMonster` amplitude using `@motion-engine-v12` to prevent animation 'snapping'.
- **UX Polish**: Subtly reduced `InteractionCard` hover lift (y:-8px) and cleaned up conflicting pulse animations in `MethodologyView.tsx`.

- Repository cloned and initialized with Silicon Valley standard documentation.
- Git configuration updated to ignore `.agent` directory.
- Created `AGENTS.md`, `site.md`, `design.md`, `lessons.md`, and `task.md`.
- Analyzed React 19 + Hono integration.
