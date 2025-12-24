defmodule PingcrmWeb.ProfileControllerTest do
  use PingcrmWeb.ConnCase, async: true
  import Swoosh.TestAssertions

  alias Pingcrm.Accounts
  alias Pingcrm.Accounts.User
  alias Pingcrm.Accounts.UserToken
  alias Pingcrm.Repo

  describe "GET /profile" do
    test "renders profile page for authenticated user", %{conn: conn} do
      conn = conn |> log_in_user(account_owner().user) |> get(~p"/profile")
      response = html_response(conn, 200)
      assert response =~ "Profile Settings"
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

  describe "PATCH /profile" do
    setup %{conn: conn} do
      user = account_owner().user
      conn = log_in_user(conn, user)

      %{conn: conn, user: user}
    end

    test "successfully updates profile with valid first_name and last_name", %{
      conn: conn,
      user: user
    } do
      new_first_name = "Jane"
      new_last_name = "Smith"

      conn =
        patch(conn, ~p"/profile", %{
          "first_name" => new_first_name,
          "last_name" => new_last_name
        })

      assert redirected_to(conn) == ~p"/profile"
      assert Phoenix.Flash.get(conn.assigns.flash, :info) =~ "Profile updated"

      updated_user = Accounts.get_user!(user.id)
      assert updated_user.first_name == new_first_name
      assert updated_user.last_name == new_last_name
    end

    test "successfully updates only first_name", %{conn: conn, user: user} do
      new_first_name = "UpdatedFirstName"

      conn =
        patch(conn, ~p"/profile", %{
          "first_name" => new_first_name,
          "last_name" => user.last_name
        })

      assert redirected_to(conn) == ~p"/profile"
      assert Phoenix.Flash.get(conn.assigns.flash, :info) =~ "Profile updated"

      updated_user = Accounts.get_user!(user.id)
      assert updated_user.first_name == new_first_name
      assert updated_user.last_name == user.last_name
    end

    test "successfully updates only last_name", %{conn: conn, user: user} do
      new_last_name = "UpdatedLastName"

      conn =
        patch(conn, ~p"/profile", %{
          "first_name" => user.first_name,
          "last_name" => new_last_name
        })

      assert redirected_to(conn) == ~p"/profile"

      updated_user = Accounts.get_user!(user.id)
      assert updated_user.first_name == user.first_name
      assert updated_user.last_name == new_last_name
    end

    test "fails with empty first_name", %{conn: conn} do
      conn =
        patch(conn, ~p"/profile", %{
          "first_name" => "",
          "last_name" => "Smith"
        })

      assert redirected_to(conn) == ~p"/profile"
      errors = inertia_errors(conn)
      assert errors[:first_name] == "can't be blank"
    end

    test "fails with empty last_name", %{conn: conn} do
      conn =
        patch(conn, ~p"/profile", %{
          "first_name" => "Jane",
          "last_name" => ""
        })

      assert redirected_to(conn) == ~p"/profile"
      errors = inertia_errors(conn)
      assert errors[:last_name] == "can't be blank"
    end

    test "fails with both first_name and last_name empty", %{conn: conn} do
      conn =
        patch(conn, ~p"/profile", %{
          "first_name" => "",
          "last_name" => ""
        })

      assert redirected_to(conn) == ~p"/profile"
      errors = inertia_errors(conn)
      assert errors[:first_name] == "can't be blank"
      assert errors[:last_name] == "can't be blank"
    end

    test "does not trim whitespace from first_name and last_name", %{conn: conn, user: user} do
      conn =
        patch(conn, ~p"/profile", %{
          "first_name" => "  Jane  ",
          "last_name" => "  Smith  "
        })

      assert redirected_to(conn) == ~p"/profile"

      updated_user = Accounts.get_user!(user.id)
      assert updated_user.first_name == "  Jane  "
      assert updated_user.last_name == "  Smith  "
    end

    test "handles unicode characters in names", %{conn: conn, user: user} do
      conn =
        patch(conn, ~p"/profile", %{
          "first_name" => "José",
          "last_name" => "García"
        })

      assert redirected_to(conn) == ~p"/profile"
      assert Phoenix.Flash.get(conn.assigns.flash, :info) =~ "Profile updated"

      updated_user = Accounts.get_user!(user.id)
      assert updated_user.first_name == "José"
      assert updated_user.last_name == "García"
    end

    test "redirects to login if user not authenticated", %{conn: conn} do
      conn =
        conn
        |> Plug.Conn.clear_session()
        |> patch(~p"/profile", %{"first_name" => "Jane", "last_name" => "Smith"})

      assert redirected_to(conn) == ~p"/login"

      assert Phoenix.Flash.get(conn.assigns.flash, :error) =~
               "You must log in to access this page"
    end

    test "redirects to confirmation if user not confirmed", %{conn: conn} do
      user = account_owner(confirmed_at: nil).user

      conn =
        conn
        |> Plug.Conn.clear_session()
        |> log_in_user(user)
        |> patch(~p"/profile", %{"first_name" => "Jane", "last_name" => "Smith"})

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

  describe "PATCH /profile/email" do
    setup %{conn: conn} do
      user = account_owner().user
      conn = log_in_user(conn, user)

      %{conn: conn, user: user}
    end

    test "successfully updates email with valid email", %{conn: conn, user: user} do
      new_email = unique_user_email()

      conn =
        patch(conn, ~p"/profile/email", %{
          "email_changed" => new_email
        })

      assert redirected_to(conn) == ~p"/profile"

      updated_user = Accounts.get_user!(user.id)
      assert updated_user.email_changed == new_email
      # Original email should remain unchanged
      assert updated_user.email == user.email
    end

    test "sends email change confirmation email", %{conn: conn, user: user} do
      new_email = unique_user_email()

      patch(conn, ~p"/profile/email", %{
        "email_changed" => new_email
      })

      assert_email_sent(fn message ->
        body = message.html_body || message.text_body

        user_token = Repo.get_by!(UserToken, user_id: user.id, context: "confirm_email_change")

        assert message.subject =~ "Confirm your new email"
        assert message.to == [{"", user.email}]
        assert body =~ "You can confirm your new email address"
        [_, token] = Regex.run(~r/\/confirm-email\/([A-Za-z0-9\-_]+)/, body)

        decoded_token = Base.url_decode64!(token, padding: false)
        assert user_token.token == :crypto.hash(:sha256, decoded_token)
      end)
    end

    test "fails with invalid email format", %{conn: conn} do
      conn =
        patch(conn, ~p"/profile/email", %{
          "email_changed" => "invalid_email"
        })

      assert redirected_to(conn) == ~p"/profile"
      errors = inertia_errors(conn)
      assert errors[:email_changed] == "must have the @ sign and no spaces"
    end

    test "fails with email that has spaces", %{conn: conn} do
      conn =
        patch(conn, ~p"/profile/email", %{
          "email_changed" => "test @example.com"
        })

      assert redirected_to(conn) == ~p"/profile"
      errors = inertia_errors(conn)
      assert errors[:email_changed] == "must have the @ sign and no spaces"
    end

    test "fails with email too long", %{conn: conn} do
      long_email = String.duplicate("a", 150) <> "@example.com"

      conn =
        patch(conn, ~p"/profile/email", %{
          "email_changed" => long_email
        })

      assert redirected_to(conn) == ~p"/profile"
      errors = inertia_errors(conn)

      assert errors[:email_changed] &&
               String.contains?(errors[:email_changed], "should be at most")
    end

    test "fails when email is already taken by another user", %{conn: conn} do
      existing_user = user_with_account()

      conn =
        patch(conn, ~p"/profile/email", %{
          "email_changed" => existing_user.user.email
        })

      assert redirected_to(conn) == ~p"/profile"
      errors = inertia_errors(conn)
      assert errors[:email_changed] == "has already been taken"
    end

    test "fails when email is already taken as email_changed by another user", %{conn: conn} do
      another_user = user_with_account()
      email_to_change = unique_user_email()

      # Set email_changed for another user
      Repo.update!(
        User.email_changed_changeset(another_user.user, %{"email_changed" => email_to_change})
      )

      conn =
        patch(conn, ~p"/profile/email", %{
          "email_changed" => email_to_change
        })

      assert redirected_to(conn) == ~p"/profile"
      errors = inertia_errors(conn)
      assert errors[:email_changed] == "has already been taken"
    end

    test "fails when new email is same as current email", %{conn: conn, user: user} do
      conn =
        patch(conn, ~p"/profile/email", %{
          "email_changed" => user.email
        })

      assert redirected_to(conn) == ~p"/profile"
      errors = inertia_errors(conn)
      assert errors[:email_changed] == "must be different from current email"
    end

    test "redirects to login if user not authenticated", %{conn: conn} do
      conn =
        conn
        |> Plug.Conn.clear_session()
        |> patch(~p"/profile/email", %{"email_changed" => unique_user_email()})

      assert redirected_to(conn) == ~p"/login"

      assert Phoenix.Flash.get(conn.assigns.flash, :error) =~
               "You must log in to access this page"
    end

    test "redirects to confirmation if user not confirmed", %{conn: conn} do
      user = account_owner(confirmed_at: nil).user

      conn =
        conn
        |> Plug.Conn.clear_session()
        |> log_in_user(user)
        |> patch(~p"/profile/email", %{"email_changed" => unique_user_email()})

      assert redirected_to(conn) == ~p"/confirm"

      assert Phoenix.Flash.get(conn.assigns.flash, :error) =~
               "You must confirm your account to access this page"
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

  describe "POST /profile/change_account/:id" do
    setup %{conn: conn} do
      owner_data = account_owner()
      user = owner_data.user
      original_account = owner_data.account
      another_account = insert(:account)
      insert(:member_membership, %{user: user, account: another_account})
      conn = log_in_user(conn, user)

      %{
        conn: conn,
        user: user,
        original_account: original_account,
        another_account: another_account
      }
    end

    test "successfully changes to an account the user has access to", %{
      conn: conn,
      another_account: another_account
    } do
      initial_account_id = get_session(conn, :account_id)

      conn =
        conn
        |> put_req_header("referer", "/organizations")
        |> post(~p"/profile/change_account/#{another_account.id}")

      assert redirected_to(conn) == "/organizations"
      assert get_session(conn, :account_id) == another_account.id
      refute get_session(conn, :account_id) == initial_account_id
    end

    test "redirects to home when no referer is provided", %{
      conn: conn,
      another_account: another_account
    } do
      conn = post(conn, ~p"/profile/change_account/#{another_account.id}")

      assert redirected_to(conn) == "/"
      assert get_session(conn, :account_id) == another_account.id
    end

    test "preserves referer query parameters in redirect", %{
      conn: conn,
      another_account: another_account
    } do
      conn =
        conn
        |> put_req_header("referer", "/organizations?page=2&filter=active")
        |> post(~p"/profile/change_account/#{another_account.id}")

      assert redirected_to(conn) == "/organizations?page=2&filter=active"
      assert get_session(conn, :account_id) == another_account.id
    end

    test "handles account ID as string", %{
      conn: conn,
      another_account: another_account
    } do
      conn = post(conn, ~p"/profile/change_account/#{Integer.to_string(another_account.id)}")

      assert redirected_to(conn) == "/"
      assert get_session(conn, :account_id) == another_account.id
    end

    test "fails when user does not have access to the account", %{conn: conn} do
      unauthorized_account = insert(:account)

      conn =
        conn
        |> put_req_header("referer", "/organizations")
        |> post(~p"/profile/change_account/#{unauthorized_account.id}")

      assert redirected_to(conn) == "/"

      assert Phoenix.Flash.get(conn.assigns.flash, :error) =~
               "You do not have access to that account."

      refute get_session(conn, :account_id) == unauthorized_account.id
    end

    test "fails when account does not exist", %{conn: conn} do
      non_existent_id = 99_999

      conn = post(conn, ~p"/profile/change_account/#{non_existent_id}")

      assert redirected_to(conn) == "/"

      assert Phoenix.Flash.get(conn.assigns.flash, :error) =~
               "You do not have access to that account."
    end

    test "renews session when changing accounts", %{
      conn: conn,
      another_account: another_account
    } do
      conn = post(conn, ~p"/profile/change_account/#{another_account.id}")

      # Session should be renewed and account_id should be updated
      # Should still be authenticated
      assert get_session(conn, :user_token)
      assert get_session(conn, :account_id) == another_account.id

      # Verify that the session was marked for renewal
      assert conn.private[:plug_session_info] == :renew
    end

    test "can change back to original account", %{
      conn: conn,
      original_account: original_account,
      another_account: another_account
    } do
      conn = post(conn, ~p"/profile/change_account/#{another_account.id}")
      assert get_session(conn, :account_id) == another_account.id

      conn = post(conn, ~p"/profile/change_account/#{original_account.id}")
      assert get_session(conn, :account_id) == original_account.id
    end

    test "redirects to login if user not authenticated", %{conn: conn} do
      # Create an account to try to change to
      another_account = insert(:account)

      conn =
        conn
        |> Plug.Conn.clear_session()
        |> post(~p"/profile/change_account/#{another_account.id}")

      assert redirected_to(conn) == ~p"/login"

      assert Phoenix.Flash.get(conn.assigns.flash, :error) =~
               "You must log in to access this page"
    end

    test "preserves authentication state after account change", %{
      conn: conn,
      another_account: another_account
    } do
      assert get_session(conn, :user_token)
      conn = post(conn, ~p"/profile/change_account/#{another_account.id}")

      # Should still have authentication token (though may be renewed)
      assert get_session(conn, :user_token)
      assert get_session(conn, :account_id) == another_account.id
    end
  end

  describe "PATCH /profile/set_default_account" do
    setup %{conn: conn} do
      owner_data = account_owner()
      user = owner_data.user
      original_account = owner_data.account
      another_account = insert(:account)
      insert(:member_membership, %{user: user, account: another_account})
      conn = log_in_user(conn, user)

      %{
        conn: conn,
        user: user,
        original_account: original_account,
        another_account: another_account
      }
    end

    test "successfully sets default account for user with valid account", %{
      conn: conn,
      user: user,
      another_account: another_account
    } do
      assert user.default_account_id == nil

      conn =
        conn
        |> put_req_header("referer", "/profile")
        |> patch(~p"/profile/set_default_account/#{another_account.id}")

      assert redirected_to(conn) == "/profile"

      updated_user = Repo.get!(User, user.id)
      assert updated_user.default_account_id == another_account.id
    end

    test "fails when user does not have membership in the account", %{conn: conn} do
      unauthorized_account = insert(:account)

      conn =
        patch(
          conn,
          ~p"/profile/set_default_account/#{unauthorized_account.id}"
        )

      assert redirected_to(conn) == ~p"/"
      assert inertia_errors(conn) == %{default_account_id: "must be an account you belong to"}
    end

    test "fails when account does not exist", %{conn: conn} do
      non_existent_id = 99_999

      conn = patch(conn, ~p"/profile/set_default_account/#{non_existent_id}")

      assert redirected_to(conn) == ~p"/"
      assert inertia_errors(conn) == %{default_account_id: "must be an account you belong to"}
    end

    test "redirects to login if user not authenticated", %{conn: conn} do
      unauthorized_account = insert(:account)

      conn =
        conn
        |> Plug.Conn.clear_session()
        |> patch(~p"/profile/set_default_account/#{unauthorized_account.id}")

      assert redirected_to(conn) == ~p"/login"

      assert Phoenix.Flash.get(conn.assigns.flash, :error) =~
               "You must log in to access this page"
    end

    test "handles invalid account_id parameter gracefully", %{conn: conn} do
      conn =
        patch(conn, ~p"/profile/set_default_account/invalid")

      assert redirected_to(conn) == ~p"/"
    end
  end
end
