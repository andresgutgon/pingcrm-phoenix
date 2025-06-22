defmodule PingcrmWeb.Auth.SessionsController do
  use PingcrmWeb, :controller

  alias Pingcrm.Accounts
  alias PingcrmWeb.UserAuth

  def new(conn, _params) do
    render_inertia(conn, "Auth/LoginPage")
  end

  def create(conn, %{"email" => email, "password" => password} = user_params) do
    if user = Accounts.get_user_by_email_and_password(email, password) do
      conn
      |> put_flash(:info, "Welcome back!")
      |> UserAuth.log_in_user(user, user_params)
    else
      conn
      |> assign_errors(%{email: "Invalid email or password"})
      |> render_inertia("Auth/LoginPage", ssr: true)
    end
  end

  def delete(conn, _params) do
    conn
    |> put_flash(:info, "Logged out successfully.")
    |> UserAuth.log_out_user()
  end
end
