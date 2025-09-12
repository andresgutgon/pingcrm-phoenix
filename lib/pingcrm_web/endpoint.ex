defmodule PingcrmWeb.Endpoint do
  use Phoenix.Endpoint, otp_app: :pingcrm
  alias Pingcrm.Storage.Config, as: Storage

  # The session will be stored in the cookie and signed,
  # this means its contents can be read but not tampered with.
  # Set :encryption_salt if you would also like to encrypt it.
  @session_options [
    store: :cookie,
    key: "_app_key",
    signing_salt: "s80pesug",
    same_site: "Lax"
  ]

  # Used by Oban dashboard
  socket(
    "/live",
    Phoenix.LiveView.Socket,
    websocket: [connect_info: [session: @session_options]]
  )

  # Serve at "/" the static files from "priv/static" directory.
  #
  # You should set gzip to true if you are running phx.digest
  # when deploying your static files in production.
  plug Plug.Static,
    at: "/",
    from: :pingcrm,
    gzip: false,
    only: PingcrmWeb.static_paths()

  if Storage.disk?() do
    plug Plug.Static,
      at: Storage.storage_path(),
      from: {Storage, :storage_root, []},
      gzip: false
  end

  # Code reloading can be explicitly enabled under the
  # :code_reloader configuration of your endpoint.
  if code_reloading? do
    plug Phoenix.CodeReloader
    plug Phoenix.Ecto.CheckRepoStatus, otp_app: :pingcrm
  end

  if Code.ensure_loaded?(Tidewave) do
    plug Tidewave, autoformat: true
  end

  plug Plug.RequestId
  plug Plug.Telemetry, event_prefix: [:phoenix, :endpoint]

  plug Plug.Parsers,
    parsers: [:urlencoded, :multipart, :json],
    pass: ["*/*"],
    json_decoder: Phoenix.json_library()

  plug Plug.MethodOverride
  plug Plug.Head
  plug Plug.Session, @session_options
  plug PingcrmWeb.Router
end
