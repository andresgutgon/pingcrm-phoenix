defmodule PingcrmWeb.Account.TeamController do
  use PingcrmWeb, :controller

  def show(conn, _params) do
    conn
    |> render_inertia("Account/TeamPage")
  end
end
