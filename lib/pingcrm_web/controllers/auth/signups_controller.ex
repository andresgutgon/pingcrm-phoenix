defmodule PingcrmWeb.Auth.SignupsController do
  use PingcrmWeb, :controller
  alias Pingcrm.Accounts.Auth

  def new(conn, _params) do
    render_inertia(conn, "Auth/SignupPage")
  end

  def create(conn, params) do
    case Auth.create_account(params) do
      {:ok, {_account, user}} ->
        Auth.send_confirmation(
          user,
          &url(~p"/confirm/#{&1}")
        )

        redirect(conn, to: ~p"/confirmation-sent?email=#{user.email}")

      {:error, changeset} ->
        conn
        |> assign_errors(changeset)
        |> redirect(to: ~p"/signup")
    end
  end
end
