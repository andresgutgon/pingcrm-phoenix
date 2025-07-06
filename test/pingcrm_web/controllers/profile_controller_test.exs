defmodule PingcrmWeb.ProfileControllerTest do
  use PingcrmWeb.ConnCase, async: true

  alias Pingcrm.Accounts
  alias Pingcrm.Accounts.User

  describe "GET /profile" do
    test "renders profile page for authenticated user", %{conn: conn} do
      conn = conn |> log_in_user(account_owner().user) |> get(~p"/profile")
      response = html_response(conn, 200)
      assert response =~ "My profile"
    end

    test "redirects to login if user not authenticated", %{conn: conn} do
      conn = get(conn, ~p"/profile")
      assert redirected_to(conn) == ~p"/login"

      assert Phoenix.Flash.get(conn.assigns.flash, :error) =~
               "You must log in to access this page"
    end

    test "redirects to confirmation if user not confirmed", %{conn: conn} do
      user = account_owner(confirmed_at: nil).user
      conn = conn |> log_in_user(user) |> get(~p"/profile")
      assert redirected_to(conn) == ~p"/confirm"

      assert Phoenix.Flash.get(conn.assigns.flash, :error) =~
               "You must confirm your account to access this page"
    end
  end

  describe "PATCH /profile/password" do
    setup %{conn: conn} do
      user = account_owner().user
      conn = log_in_user(conn, user, token_authenticated_at: DateTime.utc_now())

      %{conn: conn, user: user}
    end

    test "successfully updates password with valid current password", %{conn: conn, user: user} do
      new_password = "NewSecure_Password123!"

      conn =
        patch(conn, ~p"/profile/password", %{
          "current_password" => valid_user_password(),
          "password" => new_password,
          "password_confirmation" => new_password
        })

      assert redirected_to(conn) == ~p"/profile"
      assert Phoenix.Flash.get(conn.assigns.flash, :info) =~ "Password updated successfully"

      updated_user = Accounts.get_user!(user.id)
      assert User.valid_password?(updated_user, new_password)
      refute User.valid_password?(updated_user, valid_user_password())
    end

    test "fails with incorrect current password", %{conn: conn} do
      conn =
        patch(conn, ~p"/profile/password", %{
          "current_password" => "wrong_password",
          "password" => "NewSecure_Password123!",
          "password_confirmation" => "NewSecure_Password123!"
        })

      assert redirected_to(conn) == ~p"/profile"
      errors = inertia_errors(conn)
      assert errors[:current_password] == "Current password is incorrect"
    end

    test "fails with password confirmation mismatch", %{conn: conn} do
      conn =
        patch(conn, ~p"/profile/password", %{
          "current_password" => valid_user_password(),
          "password" => "NewSecure_Password123!",
          "password_confirmation" => "DifferentPassword123!"
        })

      assert redirected_to(conn) == ~p"/profile"
      errors = inertia_errors(conn)
      assert errors[:password_confirmation] == "does not match password"
    end

    test "fails with weak password", %{conn: conn} do
      conn =
        patch(conn, ~p"/profile/password", %{
          "current_password" => valid_user_password(),
          "password" => "weak",
          "password_confirmation" => "weak"
        })

      assert redirected_to(conn) == ~p"/profile"
      errors = inertia_errors(conn)
      assert errors[:password]
    end

    test "validates password requirements", %{conn: conn} do
      conn =
        patch(conn, ~p"/profile/password", %{
          "current_password" => valid_user_password(),
          "password" => "Short1!",
          "password_confirmation" => "Short1!"
        })

      assert redirected_to(conn) == ~p"/profile"
      errors = inertia_errors(conn)
      assert errors[:password] && String.contains?(errors[:password], "should be at least")
    end

    test "validates password without uppercase", %{conn: conn} do
      conn =
        patch(conn, ~p"/profile/password", %{
          "current_password" => valid_user_password(),
          "password" => "nouppercase123!",
          "password_confirmation" => "nouppercase123!"
        })

      assert redirected_to(conn) == ~p"/profile"
      errors = inertia_errors(conn)

      assert errors[:password] &&
               String.contains?(errors[:password], "at least one upper case character")
    end

    test "validates password without lowercase", %{conn: conn} do
      conn =
        patch(conn, ~p"/profile/password", %{
          "current_password" => valid_user_password(),
          "password" => "NOLOWERCASE123!",
          "password_confirmation" => "NOLOWERCASE123!"
        })

      assert redirected_to(conn) == ~p"/profile"
      errors = inertia_errors(conn)

      assert errors[:password] &&
               String.contains?(errors[:password], "at least one lower case character")
    end
  end

  describe "sudo mode enforcement" do
    setup %{conn: conn} do
      user = account_owner().user
      %{conn: conn, user: user}
    end

    test "allows password update when in sudo mode (within 10 minutes)", %{conn: conn, user: user} do
      # Set authenticated_at to 5 minutes ago (within sudo mode window of 10 minutes)
      five_minutes_ago = DateTime.add(DateTime.utc_now(), -5, :minute)
      conn = log_in_user(conn, user, token_authenticated_at: five_minutes_ago)

      conn =
        patch(conn, ~p"/profile/password", %{
          "current_password" => valid_user_password(),
          "password" => "NewSecure_Password123!",
          "password_confirmation" => "NewSecure_Password123!"
        })

      assert redirected_to(conn) == ~p"/profile"
      assert Phoenix.Flash.get(conn.assigns.flash, :info) =~ "Password updated successfully"
    end

    test "redirects to login when not in sudo mode (outside 10 minutes)", %{
      conn: conn,
      user: user
    } do
      # Set authenticated_at to 15 minutes ago (outside sudo mode window of 10 minutes)
      fifteen_minutes_ago = DateTime.add(DateTime.utc_now(), -15, :minute)
      conn = log_in_user(conn, user, token_authenticated_at: fifteen_minutes_ago)

      conn =
        patch(conn, ~p"/profile/password", %{
          "current_password" => valid_user_password(),
          "password" => "NewSecure_Password123!",
          "password_confirmation" => "NewSecure_Password123!"
        })

      assert redirected_to(conn) == ~p"/login"

      assert Phoenix.Flash.get(conn.assigns.flash, :error) =~
               "You must re-authenticate to access this page"
    end

    test "sudo mode boundary test - exactly 10 minutes", %{conn: conn, user: user} do
      # Set authenticated_at to exactly 10 minutes ago
      exactly_ten_minutes_ago = DateTime.add(DateTime.utc_now(), -10, :minute)
      conn = log_in_user(conn, user, token_authenticated_at: exactly_ten_minutes_ago)

      conn =
        patch(conn, ~p"/profile/password", %{
          "current_password" => valid_user_password(),
          "password" => "NewSecure_Password123!",
          "password_confirmation" => "NewSecure_Password123!"
        })

      # Should redirect to login as 10 minutes is the cutoff
      assert redirected_to(conn) == ~p"/login"

      assert Phoenix.Flash.get(conn.assigns.flash, :error) =~
               "You must re-authenticate to access this page"
    end

    test "redirects back to profile after login when kicked off from sudo mode", %{
      conn: conn,
      user: user
    } do
      # Set authenticated_at to 15 minutes ago (outside sudo mode window)
      fifteen_minutes_ago = DateTime.add(DateTime.utc_now(), -15, :minute)
      conn = log_in_user(conn, user, token_authenticated_at: fifteen_minutes_ago)

      # Try to access password change, should be kicked to login
      conn =
        patch(conn, ~p"/profile/password", %{
          "current_password" => valid_user_password(),
          "password" => "NewSecure_Password123!",
          "password_confirmation" => "NewSecure_Password123!"
        })

      assert redirected_to(conn) == ~p"/login"

      assert Phoenix.Flash.get(conn.assigns.flash, :error) =~
               "You must re-authenticate to access this page"

      # Now log in again - should be redirected back to /profile
      conn = recycle(conn)

      conn =
        post(conn, ~p"/login", %{
          "email" => user.email,
          "password" => valid_user_password()
        })

      assert redirected_to(conn) == ~p"/profile"
    end
  end
end
