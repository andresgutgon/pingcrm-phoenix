defmodule PingcrmWeb.Account.SettingsController do
  use PingcrmWeb, :controller
  alias PingcrmWeb.UserAuth

  plug UserAuth,
       {:require_admin, [redirect_to: "/account/team", flash_message: false]}
       when action in [:show]

  def show(conn, _params) do
    conn
    |> render_inertia("Account/SettingsPage")
  end
end
