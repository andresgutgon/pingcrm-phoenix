---
applyTo: "lib/**/*.(ex|exs|exs) | config/**/*.(exs|ex) | priv/repo/seeds.exs | test/**/*.(ex|exs)"
---

- This is a Phoenix (Elixir) project. We use [Phoenix Framework](https://www.phoenixframework.org/) for the backend, and Inertia.js with React for the frontend.
- The backend is written in Elixir using the Phoenix framework.

- **Commands:**
  **IMPORTANT**: All commands should be run through `docker compose run web` to ensure they execute in the correct environment.
  - `docker compose run web mix COMAND` ANY MIX command runs through docker.

  - `./bin/test.sh` Run all tests
  - `./bin/test.sh [FIND_THE_PATH_TO_THE_TEST] (optional)` Ran specific tests.
  Ex.: `./bin/test.sh test/controllers/user_controller_test.exs` you can also
  pick by line number, e.g. `./bin/test.sh test/controllers/user_controller_test.exs:10`
  - `docker compose run web mix credo --strict` (Credo for Elixir code analysis)
  - `docker compose run web mix format` Format Elixir code properly
  - `docker compose run web mix COMAND` ANY MIX command runs through docker.


- **About Credo**:
When running `credo` with `--strict` mode it has to be clean.
This is an example of non-clean output.
```
209 mods/funs, found 2 code readability issues, 5 software design suggestions.
```
**important** It has to say `found no issues.` otherwise fix the issues.
