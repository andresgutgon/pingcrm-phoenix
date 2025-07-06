defmodule PingcrmWeb.Auth.ConfirmEmailController do
  use PingcrmWeb, :controller

  alias Pingcrm.Accounts.Auth

  def edit(conn, params) do
    conn
    |> assign_prop(:token, params["token"])
    |> render_inertia("Auth/ConfirmEmailPage")
  end

  def update(conn, %{"token" => token}) do
    message =
      case Auth.confirm_email_change(conn.assigns.current_scope.user, token) do
        {:ok, _} ->
          {:info, "Email confirmed successfully."}

        {:error, :no_email_to_change} ->
          {:error, "No pending email change to confirm."}

        :error ->
          {:error, "Email confirmation link is invalid or it has expired."}
      end

    {level, text} = message

    if level == :info do
      conn
      |> put_flash(:info, text)
      |> redirect(to: ~p"/profile")
    else
      conn
      |> put_flash(:error, text)
      |> redirect(to: ~p"/confirm-email/#{token}")
    end
  end
end
