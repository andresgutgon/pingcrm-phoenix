---
applyTo: "lib/**/*.(ex|exs|exs) | config/**/*.(exs|ex) | priv/repo/seeds.exs | test/**/*.(ex|exs)"
---

- This is a Phoenix (Elixir) project. We use [Phoenix Framework](https://www.phoenixframework.org/) for the backend, and Inertia.js with React for the frontend.
- The backend is written in Elixir using the Phoenix framework.

- **Commands:**
  - `./bin/test.sh [FILE_PATTERN] (optional)` (for backend/Phoenix tests)
  - `docker compose run web mix credo --strict` (Credo for Elixir code analysis)


- **About Credo**:
When running `credo` with `--strict` mode it has to be clean.
This is an example of non-clean output.
```
209 mods/funs, found 2 code readability issues, 5 software design suggestions.
```
**important** It has to say `found no issues.` otherwise fix the issues.
