defmodule PingcrmWeb.ProfileController do
  use PingcrmWeb, :controller

  alias Pingcrm.Accounts.Auth
  alias PingcrmWeb.UserAuth

  plug :sudo_mode when action in [:update_password]

  def show(conn, _params) do
    conn
    |> render_inertia("ProfilePage", ssr: true)
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
