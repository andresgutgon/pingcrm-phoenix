defmodule Pingcrm.Application do
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    dev_mode = Application.get_env(:pingcrm, :dev_mode)

    children = [
      PingcrmWeb.Telemetry,
      Pingcrm.Repo,
      {DNSCluster, query: Application.get_env(:pingcrm, :dns_cluster_query) || :ignore},
      {Phoenix.PubSub, name: Pingcrm.PubSub},
      {Finch, name: Pingcrm.Finch},
      PingcrmWeb.Endpoint,
      {Vitex,
       dev_mode: dev_mode,
       endpoint: PingcrmWeb.Endpoint,
       js_framework: :react,
       manifest_name: "vite_manifest"},
      {Inertia.SSR, Application.fetch_env!(:pingcrm, Inertia.SSR)}
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: Pingcrm.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  @impl true
  def config_change(changed, _new, removed) do
    PingcrmWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
