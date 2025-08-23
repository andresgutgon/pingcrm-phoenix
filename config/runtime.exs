import Config

env = config_env()
dev_mode = env == :dev
prod_mode = env == :prod
test_dev_mode = env == :test and System.get_env("CI") != "true"

config :pingcrm,
  env: env,
  dev_mode: dev_mode,
  prod_mode: prod_mode,
  test_dev_mode: test_dev_mode

if System.get_env("PHX_SERVER") do
  config :pingcrm, PingcrmWeb.Endpoint, server: true
end

config :pingcrm, Inertia.SSR,
  path: Path.join([Application.app_dir(:pingcrm), "priv", "ssr-js"]),
  ssr_adapter: Vitex.inertia_ssr_adapter(dev_mode: dev_mode or test_dev_mode),
  esm: true

for {app, configuration} <-
      Pingcrm.Storage.Config.configure(
        prod_mode: prod_mode,
        test_dev_mode: test_dev_mode
      ) do
  config app, configuration
end

# === PROD ONLY CONFIG ===
if env == :prod do
  # Database
  database_url =
    System.get_env("DATABASE_URL") ||
      raise """
      environment variable DATABASE_URL is missing.
      For example: ecto://USER:PASS@HOST/DATABASE
      """

  config :pingcrm, Pingcrm.Repo,
    url: database_url,
    pool_size: String.to_integer(System.get_env("POOL_SIZE", "10")),
    socket_options: if(System.get_env("ECTO_IPV6") in ~w(true 1), do: [:inet6], else: [])

  secret_key_base =
    System.get_env("SECRET_KEY_BASE") ||
      raise """
      environment variable SECRET_KEY_BASE is missing.
      You can generate one by calling: mix phx.gen.secret
      """

  port = String.to_integer(System.get_env("PORT", "4004"))
  host = System.get_env("PHX_HOST", "localhost")
  scheme = System.get_env("PHX_SCHEME", "http")

  config :pingcrm, :dns_cluster_query, System.get_env("DNS_CLUSTER_QUERY")

  config :pingcrm, PingcrmWeb.Endpoint,
    url: [host: host, port: port, scheme: scheme],
    http: [
      # IPv4 bind (all interfaces inside container)
      ip: {0, 0, 0, 0},
      port: port
    ],
    secret_key_base: secret_key_base
end
