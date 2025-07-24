defmodule PingcrmWeb.Auth.ResetPasswordController do
  use PingcrmWeb, :controller

  alias Pingcrm.Accounts
  alias Pingcrm.Accounts.Auth

  plug :get_user_by_reset_password_token when action in [:edit, :update]

  def new(conn, params) do
    conn
    |> maybe_assign_email_prop(params)
    |> render_inertia("Auth/ResetPasswordPage")
  end

  def create(conn, %{"email" => email}) do
    if user = Accounts.get_user_by_email(email) do
      Auth.send_reset_password(
        user,
        &url(~p"/reset_password/#{&1}")
      )
    end

    conn
    |> put_flash(
      :success,
      "If your email is in our system, you will receive instructions to reset your password shortly."
    )
    |> redirect(to: ~p"/login")
  end

  def edit(conn, _params) do
    conn
    |> assign_prop(:token, conn.assigns.token)
    |> render_inertia("Auth/ChangePasswordPage")
  end

  # Do not log in the user after reset password to avoid a
  # leaked token giving the user access to the account.
  def update(conn, user_params) do
    case Auth.reset_password(conn.assigns.user, user_params) do
      {:ok, _} ->
        conn
        |> put_flash(:success, "Password reset successfully.")
        |> redirect(to: ~p"/login")

      {:error, changeset} ->
        conn
        |> assign_errors(changeset)
        |> redirect(to: ~p"/reset_password/#{conn.assigns.token}")
    end
  end

  defp get_user_by_reset_password_token(conn, _opts) do
    %{"token" => token} = conn.params

    if user = Accounts.get_user_by_reset_password_token(token) do
      conn |> assign(:user, user) |> assign(:token, token)
    else
      conn
      |> put_flash(:error, "Reset password link is invalid or it has expired.")
      |> redirect(to: ~p"/login")
      |> halt()
    end
  end

  defp maybe_assign_email_prop(conn, %{"email" => email}) when is_binary(email) and email != "" do
    if valid_email?(email) do
      assign_prop(conn, :email, email)
    else
      conn
    end
  end

  defp maybe_assign_email_prop(conn, _params), do: conn

  defp valid_email?(email) when is_binary(email) do
    String.match?(email, ~r/^[^\s]+@[^\s]+$/)
  end
end
