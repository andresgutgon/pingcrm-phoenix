defmodule PingcrmWeb.ProfileController do
  use PingcrmWeb, :controller
  # plug PingcrmWeb.UserAuth, :require_sudo_mode when action in [:update_password]

  def show(conn, _params) do
    user = conn.assigns.current_scope.user
    render_inertia(conn, "ProfilePage", %{user: user})
  end

  def update(conn, %{"user" => _user_params}) do
    user = conn.assigns.current_scope.user

    render_inertia(conn, "ProfilePage", %{user: user})
    # case Accounts.update_user_profile(user.id, user_params) do
    #   {:ok, _user} ->
    #     conn
    #     |> put_flash(:success, "Profile updated successfully.")
    #     |> redirect(to: ~p"/profile")
    #
    #   {:error, changeset} ->
    #     render_inertia(conn, "ProfilePage", %{user: user, errors: changeset})
    # end
  end

  def update_password(conn, %{"user" => _user_params}) do
    user = conn.assigns.current_scope.user
    render_inertia(conn, "ProfilePage", %{user: user})
    # user = conn.assigns.current_scope.user
    #
    # case Accounts.update_user_password(user.id, user_params) do
    #   {:ok, _user} ->
    #     conn
    #     |> put_flash(:success, "Password updated successfully.")
    #     |> redirect(to: ~p"/profile")
    #
    #   {:error, changeset} ->
    #     render_inertia(conn, "ProfilePage", %{user: user, errors: changeset})
    # end
  end
end
