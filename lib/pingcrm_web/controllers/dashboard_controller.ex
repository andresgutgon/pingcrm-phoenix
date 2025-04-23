defmodule PingcrmWeb.DashboardController do
  use PingcrmWeb, :controller

  def index(conn, _params) do
    ssr = true

    conn
    |> assign_prop(:ssr, ssr)
    |> render_inertia("DashboardPage", ssr: ssr)
  end
end
