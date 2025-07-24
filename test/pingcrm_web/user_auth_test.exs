defmodule PingcrmWeb.UserAuthTest do
  use PingcrmWeb.ConnCase, async: true

  alias Pingcrm.Accounts
  alias Pingcrm.Accounts.{Presenter, Scope}
  alias PingcrmWeb.UserAuth

  @remember_me_cookie "_pingcrm_web_user_remember_me"
  @remember_me_cookie_max_age 60 * 60 * 24 * 14

  setup %{conn: conn} do
    conn =
      conn
      |> Map.replace!(:secret_key_base, PingcrmWeb.Endpoint.config(:secret_key_base))
      |> init_test_session(%{})

    %{user: user, account: account} = account_owner(authenticated_at: DateTime.utc_now(:second))

    %{user: user, account: account, conn: conn}
  end

  describe "log_in_user/3" do
    test "stores the user token in the session", %{conn: conn, user: user} do
      conn = UserAuth.log_in_user(conn, user)
      assert token = get_session(conn, :user_token)
      assert redirected_to(conn) == ~p"/dashboard"
      assert Accounts.get_user_by_session_token(token)
    end

    test "clears everything previously stored in the session", %{conn: conn, user: user} do
      conn = conn |> put_session(:to_be_removed, "value") |> UserAuth.log_in_user(user)
      refute get_session(conn, :to_be_removed)
    end

    test "stores account_id in the session", %{conn: conn, user: user, account: account} do
      conn = UserAuth.log_in_user(conn, user)
      redirected_path = redirected_to(conn)
      token = get_session(conn, :user_token)

      conn =
        build_conn()
        |> Phoenix.ConnTest.init_test_session(%{user_token: token})
        |> get(redirected_path)

      assert get_session(conn, :account_id) == account.id
    end

    test "keeps session when re-authenticating", %{conn: conn, user: user, account: account} do
      conn =
        conn
        |> assign(:current_scope, Scope.for_user(user, account.id))
        |> put_session(:to_be_removed, "value")
        |> UserAuth.log_in_user(user)

      assert get_session(conn, :to_be_removed)
    end

    test "clears session when user does not match when re-authenticating", %{
      conn: conn,
      user: user
    } do
      %{user: other_user, account: other_account} = account_owner()

      conn =
        conn
        |> assign(:current_scope, Scope.for_user(other_user, other_account.id))
        |> put_session(:to_be_removed, "value")
        |> UserAuth.log_in_user(user)

      refute get_session(conn, :to_be_removed)
    end

    test "redirects to the configured path", %{conn: conn, user: user} do
      conn = conn |> put_session(:user_return_to, "/hello") |> UserAuth.log_in_user(user)
      assert redirected_to(conn) == "/hello"
    end

    test "writes a cookie if remember_me is configured", %{conn: conn, user: user} do
      conn = conn |> fetch_cookies() |> UserAuth.log_in_user(user, %{"remember_me" => "true"})
      assert get_session(conn, :user_token) == conn.cookies[@remember_me_cookie]
      assert get_session(conn, :user_remember_me) == true

      assert %{value: signed_token, max_age: max_age} = conn.resp_cookies[@remember_me_cookie]
      assert signed_token != get_session(conn, :user_token)
      assert max_age == @remember_me_cookie_max_age
    end

    test "writes a cookie if remember_me was set in previous session", %{conn: conn, user: user} do
      conn = conn |> fetch_cookies() |> UserAuth.log_in_user(user, %{"remember_me" => "true"})
      assert get_session(conn, :user_token) == conn.cookies[@remember_me_cookie]
      assert get_session(conn, :user_remember_me) == true

      conn =
        conn
        |> recycle()
        |> Map.replace!(:secret_key_base, PingcrmWeb.Endpoint.config(:secret_key_base))
        |> fetch_cookies()
        |> init_test_session(%{user_remember_me: true})

      # the conn is already logged in and has the remember_me cookie set,
      # now we log in again and even without explicitly setting remember_me,
      # the cookie should be set again
      conn = conn |> UserAuth.log_in_user(user, %{})
      assert %{value: signed_token, max_age: max_age} = conn.resp_cookies[@remember_me_cookie]
      assert signed_token != get_session(conn, :user_token)
      assert max_age == @remember_me_cookie_max_age
      assert get_session(conn, :user_remember_me) == true
    end
  end

  describe "logout_user/1" do
    test "erases session and cookies", %{conn: conn, user: user} do
      user_token = Accounts.Auth.create_session_token(user)

      conn =
        conn
        |> put_session(:user_token, user_token)
        |> put_req_cookie(@remember_me_cookie, user_token)
        |> fetch_cookies()
        |> UserAuth.log_out_user()

      refute get_session(conn, :user_token)
      refute conn.cookies[@remember_me_cookie]
      assert %{max_age: 0} = conn.resp_cookies[@remember_me_cookie]
      assert redirected_to(conn) == ~p"/login"
      refute Accounts.get_user_by_session_token(user_token)
    end

    test "works even if user is already logged out", %{conn: conn} do
      conn = conn |> fetch_cookies() |> UserAuth.log_out_user()
      refute get_session(conn, :user_token)
      assert %{max_age: 0} = conn.resp_cookies[@remember_me_cookie]
      assert redirected_to(conn) == ~p"/login"
    end
  end

  describe "fetch_scope/2" do
    test "authenticates user from session", %{conn: conn, user: user, account: account} do
      user_token = Accounts.Auth.create_session_token(user)

      conn =
        conn |> put_session(:user_token, user_token) |> UserAuth.fetch_scope([])

      assert conn.assigns.current_scope.user.id == user.id
      assert conn.assigns.current_scope.user.authenticated_at == user.authenticated_at
      assert conn.assigns.current_scope.account.name == account.name
      assert get_session(conn, :user_token) == user_token
    end

    test "authenticates user from cookies", %{conn: conn, user: user} do
      logged_in_conn =
        conn |> fetch_cookies() |> UserAuth.log_in_user(user, %{"remember_me" => "true"})

      user_token = logged_in_conn.cookies[@remember_me_cookie]
      %{value: signed_token} = logged_in_conn.resp_cookies[@remember_me_cookie]

      conn =
        conn
        |> put_req_cookie(@remember_me_cookie, signed_token)
        |> UserAuth.fetch_scope([])

      assert conn.assigns.current_scope.user.id == user.id
      assert conn.assigns.current_scope.user.authenticated_at == user.authenticated_at
      assert get_session(conn, :user_token) == user_token
      assert get_session(conn, :user_remember_me)
    end

    test "does not authenticate if data is missing", %{conn: conn, user: user} do
      _ = Accounts.Auth.create_session_token(user)
      conn = UserAuth.fetch_scope(conn, [])
      refute get_session(conn, :user_token)
      refute conn.assigns.current_scope
    end

    test "reissues a new token after a few days and refreshes cookie", %{conn: conn, user: user} do
      logged_in_conn =
        conn |> fetch_cookies() |> UserAuth.log_in_user(user, %{"remember_me" => "true"})

      token = logged_in_conn.cookies[@remember_me_cookie]
      %{value: signed_token} = logged_in_conn.resp_cookies[@remember_me_cookie]

      offset_user_token(token, -10, :day)
      {user, _} = Accounts.get_user_by_session_token(token)

      conn =
        conn
        |> put_session(:user_token, token)
        |> put_session(:user_remember_me, true)
        |> put_req_cookie(@remember_me_cookie, signed_token)
        |> UserAuth.fetch_scope([])

      assert conn.assigns.current_scope.user.id == user.id
      assert conn.assigns.current_scope.user.authenticated_at == user.authenticated_at
      assert new_token = get_session(conn, :user_token)
      assert new_token != token
      assert %{value: new_signed_token, max_age: max_age} = conn.resp_cookies[@remember_me_cookie]
      assert new_signed_token != signed_token
      assert max_age == @remember_me_cookie_max_age
    end

    test "uses default_account_id when no account_id in session", %{conn: conn} do
      owner_data = account_owner()
      user = owner_data.user
      second_account = insert(:account)
      insert(:member_membership, %{user: user, account: second_account})

      {:ok, user_with_default} = Accounts.set_default_account(user, second_account.id)

      user_token = Accounts.Auth.create_session_token(user_with_default)

      conn =
        conn
        |> put_session(:user_token, user_token)
        |> UserAuth.fetch_scope([])

      assert conn.assigns.current_scope.user.id == user.id
      assert conn.assigns.current_scope.account.id == second_account.id
      assert conn.assigns.current_scope.account.name == second_account.name
      assert get_session(conn, :account_id) == second_account.id
    end

    test "falls back to first account when no default_account_id and no session account_id", %{
      conn: conn
    } do
      owner_data = account_owner()
      user = owner_data.user
      first_account = owner_data.account
      second_account = insert(:account)
      insert(:member_membership, %{user: user, account: second_account})

      assert user.default_account_id == nil

      user_token = Accounts.Auth.create_session_token(user)

      conn =
        conn
        |> put_session(:user_token, user_token)
        |> UserAuth.fetch_scope([])

      assert conn.assigns.current_scope.user.id == user.id
      assert conn.assigns.current_scope.account.id == first_account.id
      assert conn.assigns.current_scope.account.name == first_account.name
      assert get_session(conn, :account_id) == first_account.id
    end
  end

  describe "require_sudo_mode/2" do
    test "allows users that have authenticated in the last 10 minutes", %{
      conn: conn,
      user: user,
      account: account
    } do
      conn =
        conn
        |> fetch_flash()
        |> assign(:current_scope, Scope.for_user(user, account.id))
        |> UserAuth.require_sudo_mode([])

      refute conn.halted
      refute conn.status
    end

    test "redirects when authentication is too old", %{conn: conn, user: user, account: account} do
      eleven_minutes_ago = DateTime.utc_now(:second) |> DateTime.add(-11, :minute)
      user = %{user | authenticated_at: eleven_minutes_ago}
      user_token = Accounts.Auth.create_session_token(user)
      {user, token_inserted_at} = Accounts.get_user_by_session_token(user_token)
      assert DateTime.compare(token_inserted_at, user.authenticated_at) == :gt

      conn =
        conn
        |> fetch_flash()
        |> assign(:current_scope, Scope.for_user(user, account.id))
        |> UserAuth.require_sudo_mode([])

      assert redirected_to(conn) == ~p"/login"

      assert Phoenix.Flash.get(conn.assigns.flash, :error) ==
               "You must re-authenticate to access this page."
    end
  end

  describe "redirect_if_user_is_authenticated/2" do
    setup %{conn: conn} do
      %{conn: UserAuth.fetch_scope(conn, [])}
    end

    test "redirects if user is authenticated", %{conn: conn, user: user, account: account} do
      conn =
        conn
        |> assign(:current_scope, Scope.for_user(user, account.id))
        |> UserAuth.redirect_if_user_is_authenticated([])

      assert conn.halted
      assert redirected_to(conn) == ~p"/dashboard"
    end

    test "does not redirect if user is not authenticated", %{conn: conn} do
      conn = UserAuth.redirect_if_user_is_authenticated(conn, [])
      refute conn.halted
      refute conn.status
    end
  end

  describe "require_confirmed_user/2" do
    setup %{conn: conn} do
      %{conn: UserAuth.fetch_scope(conn, [])}
    end

    test "redirects if user is not authenticated", %{conn: conn} do
      conn = conn |> fetch_flash() |> UserAuth.require_confirmed_user([])
      assert conn.halted

      assert redirected_to(conn) == ~p"/login"

      assert Phoenix.Flash.get(conn.assigns.flash, :error) ==
               "You must log in to access this page."
    end

    test "stores the path to redirect to on GET", %{conn: conn} do
      halted_conn =
        %{conn | path_info: ["foo"], query_string: ""}
        |> fetch_flash()
        |> UserAuth.require_confirmed_user([])

      assert halted_conn.halted
      assert get_session(halted_conn, :user_return_to) == "/foo"

      halted_conn =
        %{conn | path_info: ["foo"], query_string: "bar=baz"}
        |> fetch_flash()
        |> UserAuth.require_confirmed_user([])

      assert halted_conn.halted
      assert get_session(halted_conn, :user_return_to) == "/foo?bar=baz"

      halted_conn =
        %{conn | path_info: ["foo"], query_string: "bar", method: "POST"}
        |> fetch_flash()
        |> UserAuth.require_confirmed_user([])

      assert halted_conn.halted
      refute get_session(halted_conn, :user_return_to)
    end

    test "does not redirect if user is authenticated and confirmed", %{
      conn: conn,
      user: user,
      account: account
    } do
      conn =
        conn
        |> assign(:current_scope, Scope.for_user(user, account.id))
        |> UserAuth.require_confirmed_user([])

      refute conn.halted
      refute conn.status
    end

    test "allows access only to confirmed users", %{conn: conn, account: account} do
      confirmed_user = insert(:user, confirmed_at: DateTime.utc_now())
      insert(:admin_membership, %{user: confirmed_user, account: account})

      conn =
        conn
        |> assign(:current_scope, Scope.for_user(confirmed_user, account.id))
        |> UserAuth.require_confirmed_user([])

      refute conn.halted
      refute conn.status
      assert conn.assigns.user.id == confirmed_user.id

      # Test unconfirmed user is redirected
      unconfirmed_user = insert(:user, confirmed_at: nil)
      insert(:admin_membership, %{user: unconfirmed_user, account: account})

      conn =
        build_conn()
        |> init_test_session(%{})
        |> fetch_flash()
        |> assign(:current_scope, Scope.for_user(unconfirmed_user, account.id))
        |> UserAuth.require_confirmed_user([])

      assert conn.halted
      assert redirected_to(conn) == ~p"/confirm"

      assert Phoenix.Flash.get(conn.assigns.flash, :error) ==
               "You must confirm your account to access this page."
    end

    test "redirects unconfirmed user to confirmation page", %{conn: conn, account: account} do
      # Create an unconfirmed user
      unconfirmed_user = insert(:user, confirmed_at: nil)
      insert(:admin_membership, %{user: unconfirmed_user, account: account})

      conn =
        conn
        |> fetch_flash()
        |> assign(:current_scope, Scope.for_user(unconfirmed_user, account.id))
        |> UserAuth.require_confirmed_user([])

      assert conn.halted
      assert redirected_to(conn) == ~p"/confirm"

      assert Phoenix.Flash.get(conn.assigns.flash, :error) ==
               "You must confirm your account to access this page."
    end

    test "sets auth prop with user initials when user is authenticated and confirmed", %{
      conn: conn,
      user: user,
      account: account
    } do
      conn =
        conn
        |> assign(:current_scope, Scope.for_user(user, account.id))
        |> UserAuth.require_confirmed_user([])

      refute conn.halted

      # Check that auth prop is set with serialized user that includes initials
      auth_prop = conn.private.inertia_shared.auth

      assert auth_prop.user.id == user.id
      assert auth_prop.user.first_name == user.first_name
      assert auth_prop.user.last_name == user.last_name

      # User initials should be first letter of first_name + first letter of last_name
      expected_initials = String.at(user.first_name, 0) <> String.at(user.last_name, 0)
      assert auth_prop.user.initials == expected_initials

      # Also check account and role are properly set
      assert auth_prop.account.id == account.id
      assert auth_prop.role == "admin"
      assert is_list(auth_prop.accounts)
    end

    test "inertia shared props", %{conn: conn, user: user, account: account} do
      second_account = insert(:account)
      insert(:member_membership, %{user: user, account: second_account})

      conn =
        conn
        |> assign(:current_scope, Scope.for_user(user, account.id))
        |> UserAuth.require_confirmed_user([])

      auth_prop = conn.private.inertia_shared[:auth]

      assert auth_prop == %{
               user: Presenter.serialize(user),
               account:
                 Presenter.serialize_account(account, %{is_current: true, is_default: false}),
               role: "admin",
               accounts: [
                 Presenter.serialize_account(account, %{
                   is_current: true,
                   is_default: false
                 }),
                 Presenter.serialize_account(second_account, %{
                   is_current: false,
                   is_default: false
                 })
               ]
             }
    end

    test "stores the path to redirect to on GET for unconfirmed user", %{
      conn: conn,
      account: account
    } do
      # Create an unconfirmed user
      unconfirmed_user = insert(:user, confirmed_at: nil)
      insert(:admin_membership, %{user: unconfirmed_user, account: account})

      halted_conn =
        %{conn | path_info: ["foo"], query_string: ""}
        |> fetch_flash()
        |> assign(:current_scope, Scope.for_user(unconfirmed_user, account.id))
        |> UserAuth.require_confirmed_user([])

      assert halted_conn.halted
      assert get_session(halted_conn, :user_return_to) == "/foo"

      halted_conn =
        %{conn | path_info: ["foo"], query_string: "bar=baz"}
        |> fetch_flash()
        |> assign(:current_scope, Scope.for_user(unconfirmed_user, account.id))
        |> UserAuth.require_confirmed_user([])

      assert halted_conn.halted
      assert get_session(halted_conn, :user_return_to) == "/foo?bar=baz"

      halted_conn =
        %{conn | path_info: ["foo"], query_string: "bar", method: "POST"}
        |> fetch_flash()
        |> assign(:current_scope, Scope.for_user(unconfirmed_user, account.id))
        |> UserAuth.require_confirmed_user([])

      assert halted_conn.halted
      refute get_session(halted_conn, :user_return_to)
    end
  end

  describe "require_admin/2" do
    test "allows access when user has admin role", %{conn: conn} do
      %{user: user, account: account} = account_owner(authenticated_at: DateTime.utc_now(:second))

      conn =
        conn
        |> assign(:current_scope, Scope.for_user(user, account.id))
        |> UserAuth.require_admin([])

      refute conn.halted
    end

    test "denies access when user has member role", %{conn: conn} do
      %{user: user, account: account} = user_with_account()

      conn =
        conn
        |> fetch_flash()
        |> assign(:current_scope, Scope.for_user(user, account.id))
        |> UserAuth.require_admin([])

      assert conn.halted
      assert redirected_to(conn) == "/dashboard"

      assert Phoenix.Flash.get(conn.assigns.flash, :error) ==
               "You must be an admin to access this page."
    end

    test "denies access when user has no scope", %{conn: conn} do
      conn =
        conn
        |> fetch_flash()
        |> assign(:current_scope, nil)
        |> UserAuth.require_admin([])

      assert conn.halted
      assert redirected_to(conn) == "/dashboard"

      assert Phoenix.Flash.get(conn.assigns.flash, :error) ==
               "You must be an admin to access this page."
    end

    test "redirects to custom path when redirect_to option is provided", %{conn: conn} do
      %{user: user, account: account} = user_with_account()

      conn =
        conn
        |> fetch_flash()
        |> assign(:current_scope, Scope.for_user(user, account.id))
        |> UserAuth.require_admin(redirect_to: "/account/team")

      assert conn.halted
      assert redirected_to(conn) == "/account/team"

      assert Phoenix.Flash.get(conn.assigns.flash, :error) ==
               "You must be an admin to access this page."
    end

    test "shows custom flash message when flash_message option is provided", %{conn: conn} do
      %{user: user, account: account} = user_with_account()

      conn =
        conn
        |> fetch_flash()
        |> assign(:current_scope, Scope.for_user(user, account.id))
        |> UserAuth.require_admin(flash_message: "Admin access required for billing.")

      assert conn.halted
      assert redirected_to(conn) == "/dashboard"
      assert Phoenix.Flash.get(conn.assigns.flash, :error) == "Admin access required for billing."
    end

    test "uses both custom redirect and flash message when both options provided", %{conn: conn} do
      %{user: user, account: account} = user_with_account()

      conn =
        conn
        |> fetch_flash()
        |> assign(:current_scope, Scope.for_user(user, account.id))
        |> UserAuth.require_admin(redirect_to: "/profile", flash_message: "Custom admin message")

      assert conn.halted
      assert redirected_to(conn) == "/profile"
      assert Phoenix.Flash.get(conn.assigns.flash, :error) == "Custom admin message"
    end

    test "works as plug with call/2 function", %{conn: conn} do
      %{user: user, account: account} = user_with_account()

      conn =
        conn
        |> fetch_flash()
        |> assign(:current_scope, Scope.for_user(user, account.id))
        |> UserAuth.call(:require_admin)

      assert conn.halted
      assert redirected_to(conn) == "/dashboard"

      assert Phoenix.Flash.get(conn.assigns.flash, :error) ==
               "You must be an admin to access this page."
    end

    test "works as plug with call/2 function and options", %{conn: conn} do
      %{user: user, account: account} = user_with_account()

      conn =
        conn
        |> fetch_flash()
        |> assign(:current_scope, Scope.for_user(user, account.id))
        |> UserAuth.call(
          {:require_admin, [redirect_to: "/custom", flash_message: "Custom message"]}
        )

      assert conn.halted
      assert redirected_to(conn) == "/custom"
      assert Phoenix.Flash.get(conn.assigns.flash, :error) == "Custom message"
    end

    test "skips flash message when flash_message is false", %{conn: conn} do
      %{user: user, account: account} = user_with_account()

      conn =
        conn
        |> fetch_flash()
        |> assign(:current_scope, Scope.for_user(user, account.id))
        |> UserAuth.require_admin(redirect_to: "/account/team", flash_message: false)

      assert conn.halted
      assert redirected_to(conn) == "/account/team"
      assert Phoenix.Flash.get(conn.assigns.flash, :error) == nil
    end

    test "skips flash message when flash_message is nil", %{conn: conn} do
      %{user: user, account: account} = user_with_account()

      conn =
        conn
        |> fetch_flash()
        |> assign(:current_scope, Scope.for_user(user, account.id))
        |> UserAuth.require_admin(redirect_to: "/account/team", flash_message: nil)

      assert conn.halted
      assert redirected_to(conn) == "/account/team"
      assert Phoenix.Flash.get(conn.assigns.flash, :error) == nil
    end
  end
end
