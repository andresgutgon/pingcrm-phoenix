defmodule PingcrmWeb.ProfileController do
  use PingcrmWeb, :controller

  alias Pingcrm.Accounts
  alias Pingcrm.Accounts.Auth
  alias PingcrmWeb.UserAuth

  plug :sudo_mode when action in [:update_password]

  def show(conn, _params) do
    conn
    |> render_inertia("ProfilePage")
  end

  def update(conn, params) do
    case Accounts.update_profile(conn.assigns.current_scope.user, params) do
      {:ok, _u} ->
        conn
        |> put_flash(:info, "Profile updated")
        |> redirect(to: ~p"/profile")

      {:error, changeset} ->
        conn
        |> assign_errors(changeset)
        |> redirect(to: ~p"/profile")
    end
  end

  def update_email(conn, params) do
    case Auth.update_email(conn.assigns.current_scope.user, params) do
      {:ok, user} ->
        Auth.send_change_email_confirmation(
          user,
          &url(~p"/confirm-email/#{&1}")
        )

        conn
        |> redirect(to: ~p"/profile")

      {:error, changeset} ->
        conn
        |> assign_errors(changeset)
        |> redirect(to: ~p"/profile")
    end
  end

  def update_password(conn, params) do
    case Auth.update_password(conn.assigns.current_scope.user, params) do
      {:ok, _} ->
        conn
        |> put_flash(:info, "Password updated successfully.")
        |> redirect(to: ~p"/profile")

      {:error, changeset} ->
        conn
        |> assign_errors(changeset)
        |> redirect(to: ~p"/profile")
    end
  end

  def change_account(conn, %{"id" => id}) do
    account_id = String.to_integer(id)
    user = conn.assigns.current_scope.user

    case Accounts.has_account?(user, account_id) do
      true ->
        conn
        |> put_session(:account_id, account_id)
        |> configure_session(renew: true)
        |> redirect(to: get_referer_path(conn))

      false ->
        conn
        |> put_flash(:error, "You do not have access to that account.")
        |> redirect(to: "/")
    end
  end

  def set_default_account(conn, %{"account_id" => account_id}) do
    user = conn.assigns.current_scope.user

    case Accounts.set_default_account(user, account_id) do
      {:ok, _user} ->
        conn
        |> redirect(to: get_referer_path(conn))

      {:error, changeset} ->
        conn
        |> assign_errors(changeset)
        |> redirect(to: "/")
    end
  end

  defp sudo_mode(conn, _opts) do
    UserAuth.call(
      conn,
      {:sudo_mode,
       [
         return_to:
           case action_name(conn) do
             :update_password -> ~p"/profile"
           end
       ]}
    )
  end
end
