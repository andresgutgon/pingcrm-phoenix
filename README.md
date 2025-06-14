[![Backend](https://github.com/andresgutgon/pingcrm-phoenix/actions/workflows/backend-ci.yml/badge.svg?branch=main)](https://github.com/andresgutgon/pingcrm-phoenix/actions/workflows/backend-ci.yml)
[![Frontend](https://github.com/andresgutgon/pingcrm-phoenix/actions/workflows/frontend-ci.yml/badge.svg?branch=main)](https://github.com/andresgutgon/pingcrm-phoenix/actions/workflows/frontend-ci.yml)

# Ping CRM
This [InertiaJS's official example](https://inertiajs.com/demo-application)
built with Elixir, InertiaJS and React.

## Install deps in development
Elixir is run inside a docker container. To install the dependencies run the following command:
```bash
docker compose run web mix deps.get
```

## Tests on the docker container from outside

Run tests in watch mode by running `./bin/test`

You can pass a file path and also a line number with the following syntax:

```bash
./bin/test tests/ui/text_test.exs:23
```

Test in watch mode

```bash
./bin/test --watch
```

Run test in debug mode. You can put a require IEx; IEx.pry
in your test file to stop the execution and start a debug session.

```bash
./bin/test --debug
```

## Data migrations
When the app is released how to do data migrations?
[This fly.io article is nice](https://fly.io/phoenix-files/backfilling-data/)
```bash
mix ecto.gen.migration --migrations-path=priv/repo/data_migrations add_demo_user
```
