defmodule PingcrmWeb.Account.BillingControllerTest do
  use PingcrmWeb.ConnCase, async: true

  describe "GET /account/billing" do
    test "redirects to team page when user is not admin", %{conn: conn} do
      %{user: user, account: _account} = user_with_account()

      conn =
        conn
        |> log_in_user(user)
        |> get(~p"/account/billing")

      assert redirected_to(conn) == "/account/team"

      assert Phoenix.Flash.get(conn.assigns.flash, :error) ==
               "You need to be admin to access billing section"
    end

    test "allows access when user is admin", %{conn: conn} do
      %{user: user, account: _account} = account_owner()

      conn =
        conn
        |> log_in_user(user)
        |> get(~p"/account/billing")

      assert html_response(conn, 200)
      refute conn.halted
    end

    test "redirects unauthenticated users to login", %{conn: conn} do
      conn = get(conn, ~p"/account/billing")

      assert redirected_to(conn) == "/login"

      assert Phoenix.Flash.get(conn.assigns.flash, :error) ==
               "You must log in to access this page."
    end
  end
end
