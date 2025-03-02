import Config

config :app, App.Repo,
  username: "coffee",
  password: "secret",
  # Running in the host this has to be the IP address of the container
  hostname: "db",
  # Por from the host is exposed as 5432
  # port: 5432,
  database: "coffee_pitch_development",
  stacktrace: true,
  show_sensitive_data_on_connection_error: true,
  pool_size: 10

# For development, we disable any cache and enable
# debugging and code reloading.
#
# The watchers configuration can be used to run external
# watchers to your application. For example, we can use it
# to bundle .js and .css sources.
config :app, AppWeb.Endpoint,
  # Bind to 0.0.0.0 to expose the server to the docker host machine.
  # This makes make the service accessible from any network interface.
  # Change to `ip: {127, 0, 0, 1}` to allow access only from the server machine.
  http: [ip: {0, 0, 0, 0}, port: 4004],
  check_origin: false,
  code_reloader: true,
  debug_errors: true,
  secret_key_base: "ZJdhzfq3sIfPMX0r8n2Uz3DkjMpObkvG/HtPvIgqZ6tkeryuPXV/2hwNQFxU7LQ5",
  watchers: [
    pnpm: ["run", "dev", cd: Path.expand("../assets", __DIR__)],
  ]

config :app, App.Mailer,
  adapter: Swoosh.Adapters.SMTP,
  smtp_host: System.get_env("MAILPIT_SMTP_HOST") || "mailpit",
  smtp_port: String.to_integer(System.get_env("MAILPIT_SMTP_PORT") || "1025"),
  username: "",
  password: "",
  tls: :if_available,
  auth: :never

# ## SSL Support
#
# In order to use HTTPS in development, a self-signed
# certificate can be generated by running the following
# Mix task:
#
#     mix phx.gen.cert
#
# Run `mix help phx.gen.cert` for more information.
#
# The `http:` config above can be replaced with:
#
#     https: [
#       port: 4001,
#       cipher_suite: :strong,
#       keyfile: "priv/cert/selfsigned_key.pem",
#       certfile: "priv/cert/selfsigned.pem"
#     ],
#
# If desired, both `http:` and `https:` keys can be
# configured to run both http and https servers on
# different ports.

# Enable dev routes for dashboard and mailbox
config :app, dev_routes: true

# Do not include metadata nor timestamps in development logs
config :logger, :console, format: "[$level] $message\n"

# Set a higher stacktrace during development. Avoid configuring such
# in production as building large stacktraces may be expensive.
config :phoenix, :stacktrace_depth, 20

# Initialize plugs at runtime for faster development compilation
config :phoenix, :plug_init_mode, :runtime

config :phoenix_live_view,
  # Include HEEx debug annotations as HTML comments in rendered markup
  debug_heex_annotations: true,
  # Enable helpful, but potentially expensive runtime checks
  enable_expensive_runtime_checks: true

# Disable swoosh api client as it is only required for production adapters.
config :swoosh, :api_client, false
