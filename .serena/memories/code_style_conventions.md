# Code Style & Conventions

## TypeScript
- TypeScript 5.x mandatory
- Strong typing — avoid `any`
- Use `interface` for object shapes
- Use `type` for unions and aliases

## React Components
- Functional components (no class components)
- Use `export default` for page components
- Props should be typed: `interface ComponentProps { ... }`
- Use `'use client'` for client components in App Router
- Use hooks: `useState`, `useEffect`, `useCallback`, `useMemo`

## Styling
- Tailwind CSS v4 classes
- No inline styles unless necessary
- Dark mode support using `dark:` prefix
- Responsive: `sm:`, `md:`, `lg:`, `xl:` breakpoints

## Naming
- PascalCase: Components, Types, Interfaces
- camelCase: Functions, variables, properties
- kebab-case: CSS classes
- snake_case: File names with underscores OK (e.g., `cockpit-data.ts`)

## API Routes
- Located in `src/app/api/`
- Export `GET`, `POST`, `PUT`, `DELETE` functions
- Return JSON responses with appropriate status codes
- Use `NextRequest`, `NextResponse` from `next/server`
- Protect with auth middleware (defined in `src/middleware.ts`)

## File Organization
- One main component per file
- Related utilities in `lib/`
- Type definitions inline or in separate `types.ts` if large
- Keep component complexity low — extract sub-components

## Comments
- Add comments for "why" not "what"
- Keep code self-documenting where possible
- Use JSDoc for function/component documentation sparingly
