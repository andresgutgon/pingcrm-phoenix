defmodule PingcrmWeb.HomeController do
  use PingcrmWeb, :controller

  def show(conn, _params) do
    conn
    |> render_inertia("HomePage")
  end
end
