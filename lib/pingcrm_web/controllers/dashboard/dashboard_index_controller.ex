defmodule PingcrmWeb.Dashboard.DashboardIndexController do
  use PingcrmWeb, :controller

  def index(conn, _params) do
    conn
    |> render_inertia("Dashboard/DashboardPage")
  end
end
