# Rakhlo Product UI

Rakhlo's application UI follows a quiet, product-first utility direction rather than a decorative dashboard aesthetic.

## Design direction

The interface uses a restrained neutral canvas, one primary accent, tight borders, modest corner radii, strong typography, and minimal motion. Large gradient backgrounds, floating decorative blobs, excessive card stacking, and hover movement are intentionally avoided.

The goal is for the interface to feel like a product people use every day, not a template or generated showcase.

## Navigation

The primary navigation is persistent on desktop and becomes a compact bottom bar on mobile.

A command menu is available with Cmd/Ctrl + K for:
- Dashboard
- Purchases
- Add purchase
- Direct purchase search from the command field

Application navigation uses Next.js links so internal navigation can use the framework's client transition/prefetch behavior rather than forcing full page reloads.

## Layout rules

- Keep page chrome compact.
- Use one clear primary action per page.
- Prefer list rows and dividers over a grid of decorative cards.
- Use a page header only when it adds useful context.
- Keep details grouped into small sections.
- Use empty states that explain what happened and the next useful action.
- Keep mobile controls reachable with one hand.

## Interaction rules

- Keyboard and pointer both work for important navigation.
- Destructive actions require explicit confirmation.
- Loading states preserve the final content geometry.
- Errors are local and actionable.
- Icons are paired with labels in primary navigation and actions.
- Motion is short and functional; reduced-motion users get a static experience.

## Component architecture

The UI is modular at three levels:

1. **Atoms:** `components/ui/*` for icons, language controls, logos, and other primitives.
2. **App shell:** `components/app/*` for navigation, command menu, page headers, dashboard composition, and shared application chrome.
3. **Feature modules:** `components/purchases/*`, document UI, and future domain-specific UI.

Domain logic stays outside components in `lib/*`, while persistence is handled through Supabase server/client modules.

## Reference research

The direction is informed by public design guidance and product interfaces from:

- **Linear** - compact sidebar organization and information-dense utility navigation.
- **Vercel Geist** - disciplined typography, spacing, contrast, and high-signal interface primitives.
- **Supabase Design System** - reusable atoms, fragments, UI patterns, predictable page layout, navigation, dialogs, and accessibility.
- **Arc** - command-driven navigation as a fast path for experienced users.

These references inform principles and interaction patterns; Rakhlo's visual language and information hierarchy remain its own.

## Performance principles

The app should prefer:

- Server Components for read-heavy pages.
- Parallel server data fetching where sections are independent.
- Small client components only around interactive behavior.
- Framework navigation links instead of hard reloads.
- Progressive loading with stable skeleton geometry.
- No AI or third-party service in the critical purchase workflow.

## Quality gate

Visual and interaction work is not merged directly to `main`. It passes the same TypeScript, unit-test, production-build, and Playwright gate as feature work.