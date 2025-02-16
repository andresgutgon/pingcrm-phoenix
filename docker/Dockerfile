FROM elixir:1.18.2

RUN apt-get update && \
    apt-get install --yes build-essential inotify-tools postgresql-client git && \
    apt-get clean
#
ADD . /app
#
RUN mix local.hex --force && \
    mix local.rebar --force && \
    mix archive.install --force hex phx_new 1.7.14

RUN curl -sL https://deb.nodesource.com/setup_22.x | bash - && apt-get install -y nodejs

RUN corepack enable
RUN corepack prepare pnpm@9.12.2 --activate

# Install pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

WORKDIR /app

ARG MAILPIT_SMTP_HOST=mailpit
ENV MAILPIT_SMTP_HOST=${MAILPIT_SMTP_HOST}
ARG MAILPIT_SMTP_PORT=1025
ENV MAILPIT_SMTP_PORT=${MAILPIT_SMTP_PORT}

RUN mix deps.get
RUN pnpm install --prefix ./assets

EXPOSE 4004

CMD ["mix", "phx.server"]
