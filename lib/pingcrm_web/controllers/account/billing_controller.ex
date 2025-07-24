defmodule PingcrmWeb.Account.BillingController do
  use PingcrmWeb, :controller
  alias PingcrmWeb.UserAuth

  plug UserAuth,
       {:require_admin,
        [
          redirect_to: "/account/team",
          flash_message: "You need to be admin to access billing section"
        ]}
       when action in [:show]

  def show(conn, _params) do
    conn
    |> render_inertia("Account/BillingPage")
  end
end
