defmodule PingcrmWeb.Plugs.Host do
  @moduledoc """
  A plug to assign the site and app host to Inertia props.
  """
  import Inertia.Controller, only: [assign_prop: 3]

  @main_host Application.compile_env!(:pingcrm, PingcrmWeb)[:main_host]
  @app_host Application.compile_env!(:pingcrm, PingcrmWeb)[:app_host]
  @site_url Application.compile_env!(:pingcrm, PingcrmWeb)[:site_url]
  @app_url Application.compile_env!(:pingcrm, PingcrmWeb)[:app_url]

  def init(opts), do: opts

  def call(conn, _opts) do
    conn
    |> assign_prop(:main_host, @main_host)
    |> assign_prop(:app_host, @app_host)
    |> assign_prop(:site_url, @site_url)
    |> assign_prop(:app_url, @app_url)
  end
end
