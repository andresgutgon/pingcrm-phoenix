# BASE stage: Install system dependencies
# ::::::::::::::::::::::::::::::::::::::::
FROM elixir:1.18.2 AS base

# Install necessary system dependencies
RUN apt-get update && \
    apt-get install --yes build-essential inotify-tools postgresql-client git && \
    apt-get clean

# Node.js
RUN curl -sL https://deb.nodesource.com/setup_22.x | bash - && \
    apt-get install -y nodejs

ADD . /app
RUN mix local.rebar --force && \
    mix local.hex --force

RUN corepack enable
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

WORKDIR /app

# Only for new Phoenix projects
# RUN mix archive.install --force hex phx_new 1.7.19

FROM base AS dev

WORKDIR /app

COPY mix.exs mix.lock ./
RUN mix deps.get --force

COPY assets/package.json assets/pnpm-lock.yaml ./assets/
RUN pnpm install --prefix ./assets

COPY . .

ARG MAILPIT_SMTP_HOST=mailpit
ENV MAILPIT_SMTP_HOST=${MAILPIT_SMTP_HOST}
ARG MAILPIT_SMTP_PORT=1025
ENV MAILPIT_SMTP_PORT=${MAILPIT_SMTP_PORT}

EXPOSE 4004

CMD ["mix", "phx.server"]
