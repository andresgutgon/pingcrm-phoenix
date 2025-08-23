defmodule PingcrmWeb.Auth.SessionsControllerTest do
  use PingcrmWeb.ConnCase, async: true

  setup do
    %{user: account_owner().user}
  end

  describe "GET /login" do
    test "renders login page", %{conn: conn} do
      conn = get(conn, ~p"/login")
      response = html_response(conn, 200)
      assert response =~ "Welcome Back!"
    end
  end

  describe "POST /login" do
    test "logs the user in", %{conn: conn, user: user} do
      conn =
        post(conn, ~p"/login", %{
          "email" => user.email,
          "password" => valid_user_password()
        })

      assert get_session(conn, :user_token)
      assert redirected_to(conn) == ~p"/dashboard"

      # Now do a logged in request and assert on the menu
      conn = get(conn, ~p"/dashboard")
      response = html_response(conn, 200)
      assert response =~ user.email
      assert response =~ "Dashboard"
      assert response =~ "Organizations"
    end

    test "logs the user in with remember me", %{conn: conn, user: user} do
      conn =
        post(conn, ~p"/login", %{
          "email" => user.email,
          "password" => valid_user_password(),
          "remember_me" => "true"
        })

      assert conn.resp_cookies["_pingcrm_web_user_remember_me"]
      assert redirected_to(conn) == ~p"/dashboard"
    end

    test "logs the user in with return to", %{conn: conn, user: user} do
      conn = get(conn, "/dashboard")
      assert redirected_to(conn) == "/login"

      conn =
        conn
        |> recycle()
        |> post(~p"/login", %{
          "email" => user.email,
          "password" => valid_user_password()
        })

      assert redirected_to(conn) == PingcrmWeb.UserAuth.signed_in_path(conn)
      assert Phoenix.Flash.get(conn.assigns.flash, :info) =~ "Welcome back!"
    end

    test "emits error message with invalid credentials", %{conn: conn, user: user} do
      conn =
        post(conn, ~p"/login", %{
          "email" => user.email,
          "password" => "invalid_password"
        })

      response = html_response(conn, 200)
      assert response =~ "Welcome Back!"
      assert response =~ "Invalid email or password"
    end
  end

  describe "DELETE /logout" do
    test "logs the user out", %{conn: conn, user: user} do
      conn = conn |> log_in_user(user) |> delete(~p"/logout")
      assert "/login" = redirected_to(conn, 302)

      # Check that the flash message was set
      assert Phoenix.Flash.get(conn.assigns.flash, :info) =~ "Logged out successfully"
      refute get_session(conn, :user_token)
    end

    test "redirects to /login if not logged", %{conn: conn} do
      conn = delete(conn, ~p"/logout")
      assert redirected_to(conn) == ~p"/login"
      refute get_session(conn, :user_token)
    end
  end
end
