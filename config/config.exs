import Config

config :pingcrm, :scopes,
  user: [
    default: true,
    module: Pingcrm.Accounts.Scope,
    assign_key: :current_scope,
    access_path: [:user, :id],
    schema_key: :user_id,
    schema_type: :id,
    schema_table: :users,
    test_login_helper: :register_and_log_in_user
  ]

config :pingcrm,
  ecto_repos: [Pingcrm.Repo],
  generators: [timestamp_type: :utc_datetime]

# Configures the endpoint
config :pingcrm, PingcrmWeb.Endpoint,
  url: [host: "localhost"],
  adapter: Bandit.PhoenixAdapter,
  render_errors: [
    formats: [html: PingcrmWeb.ErrorHTML, json: PingcrmWeb.ErrorJSON],
    layout: false
  ],
  pubsub_server: Pingcrm.PubSub

# Configures the mailer
#
# By default it uses the "Local" adapter which stores the emails
# locally. You can see the emails in your browser, at "/dev/mailbox".
#
# For production it's recommended to configure a different adapter
# at the `config/runtime.exs`.
config :pingcrm, Pingcrm.Mailer, adapter: Swoosh.Adapters.Local
config :pingcrm, :storage_root, Path.expand("../priv/uploads", __DIR__)

config :inertia,
  endpoint: PingcrmWeb.Endpoint,
  static_paths: ["/assets/app.js"],
  default_version: "1",
  camelize_props: false,
  history: [encrypt: false],
  ssr: true,
  raise_on_ssr_failure: config_env() != :prod

config :wayfinder_ex,
  otp_app: :pingcrm,
  router: PingcrmWeb.Router,
  ignore_paths: ["^/backoffice"]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

config :phoenix, :json_library, Jason

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{config_env()}.exs"
