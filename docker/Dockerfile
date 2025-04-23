# syntax=docker/dockerfile:1.4

# Code config
ARG ELIXIR_VERSION=1.18.2
ARG OTP_VERSION=27.3
ARG DEBIAN_VERSION=bullseye-20250224-slim

# -- Base Elixir + Erlang + Debian Image --
FROM hexpm/elixir:${ELIXIR_VERSION}-erlang-${OTP_VERSION}-debian-${DEBIAN_VERSION} as base

RUN apt-get update && \
    apt-get install -y build-essential git curl && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

RUN mix local.hex --force && \
    mix local.rebar --force

WORKDIR /pingcrm

# -- Node + pnpm installer layer --
FROM base as node-layer

# Install Node.js 22 and pnpm 9.12.2
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && \
    apt-get install -y nodejs && \
    corepack enable && \
    corepack prepare pnpm@9.12.2 --activate

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# -- Dev Target --
FROM node-layer AS dev

# Install dev-only tools
RUN apt-get update && apt-get install -y inotify-tools postgresql-client && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

COPY . /pingcrm

RUN mix archive.install --force hex phx_new 1.7.14

ARG MAILPIT_SMTP_HOST=mailpit
ENV MAILPIT_SMTP_HOST=${MAILPIT_SMTP_HOST}
ARG MAILPIT_SMTP_PORT=1025
ENV MAILPIT_SMTP_PORT=${MAILPIT_SMTP_PORT}

RUN mix deps.get
RUN pnpm install --prefix ./assets

EXPOSE 4004
CMD ["mix", "phx.server"]

# -- Builder Target --
FROM node-layer AS builder

ENV MIX_ENV=prod

# High Concurrency and Timeout for fetching dependencies
ENV HEX_HTTP_CONCURRENCY=1
ENV HEX_HTTP_TIMEOUT=120

# Phoenix Framework
COPY mix.exs mix.lock ./
RUN mix deps.get --only prod

# Assets pipeline with full dependencies dev + prod
COPY assets/{package.json,pnpm-lock.yaml,.prettierignore} ./assets/
RUN pnpm install --prefix ./assets

RUN mkdir config
COPY config/config.exs config/prod.exs config/
RUN mix clean
RUN mix deps.compile

COPY priv priv
COPY lib lib
COPY assets assets

RUN mix assets.deploy
RUN mix compile

# Now clean and reinstall only runtime deps (e.g. for SSR)
RUN rm -rf ./assets/node_modules
RUN pnpm install --prefix ./assets --prod

COPY config/runtime.exs config/
COPY rel rel
RUN mix release

# -- Release Runtime Target --
FROM node-layer AS release

# Install runtime dependencies
RUN apt-get update && \
    apt-get install -y libstdc++6 openssl libncurses5 locales ca-certificates && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Set locale
RUN sed -i '/en_US.UTF-8/s/^# //g' /etc/locale.gen && locale-gen
ENV LANG en_US.UTF-8
ENV LANGUAGE en_US:en
ENV LC_ALL en_US.UTF-8

WORKDIR /pingcrm
RUN chown nobody /pingcrm

ENV MIX_ENV=prod

# App config
ARG APP_NAME=pingcrm
ARG APP_VERSION=0.1.0
ARG RELEASE_DIR=${APP_NAME}-${APP_VERSION}

COPY --from=builder --chown=nobody:root /${APP_NAME}/_build/prod/rel/${APP_NAME} ./
COPY --from=builder /${APP_NAME}/assets/package.json ./lib/${RELEASE_DIR}/priv/ssr-js/package.json
COPY --from=builder /${APP_NAME}/assets/node_modules   ./lib/${RELEASE_DIR}/priv/ssr-js/node_modules

USER nobody

CMD ["bin/server"]
