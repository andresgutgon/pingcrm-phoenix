---
applyTo: 'assets/js/**/*.(ts|tsx)'
---

Front-end (TypeScript/Inertia.js/React/Shadcn React/Tailwind)

- TypeScript should never use the "any" type
- Pages should be created under "assets/js/Pages"
- Components should be created under "assets/js/components"
- Each page should use the <AppLayout>
- Forms must be implementing using `useForm` from `@inertiajs/react`
- Backend URLs are already generated under `assets/js/actions/[CONTROLLER_NAME]/**/*.ts`
- Links should use the Link component of Inertia.js. Links should include `preserveState={true}` if they change the URL without reloading the page. Same for programmatic navigation using `.visit(...)`

- Never suggest running `npm` in the host machine. Also use `pnpm`

- Frontend development instructions:
  - Use `pnpm` for package management.
  - Use `./bin/pnpm.sh tc` for running Typescript checks.
  - Use `./bin/pnpm.sh lint` for running ESLint.
  - Use `./bin/pnpm.sh prettier:check` for checking Prettier formatting.
  - Use `./bin/pnpm.sh prettier` for fixing Prettier issues.
