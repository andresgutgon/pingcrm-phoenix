defmodule PingcrmWeb.Auth.ConfirmationsControllerTest do
  use PingcrmWeb.ConnCase, async: true
  import Swoosh.TestAssertions
  alias Phoenix.Flash

  alias Pingcrm.Accounts
  alias Pingcrm.Accounts.{Auth, User, UserToken}
  alias Pingcrm.Repo

  describe "GET /confirmation-sent" do
    test "renders the confirmation sent page with email", %{conn: conn} do
      email = "test@example.com"
      conn = get(conn, ~p"/confirmation-sent?email=#{email}")
      response = html_response(conn, 200)
      # This would typically check for the page content
      assert response =~ "Confirmation Sent"
      assert response =~ email
    end

    test "renders the confirmation sent page without email", %{conn: conn} do
      conn = get(conn, ~p"/confirmation-sent")
      response = html_response(conn, 200)
      assert response =~ "Confirmation Sent"
    end
  end

  describe "GET /confirm" do
    test "renders the resend confirmation page", %{conn: conn} do
      conn = get(conn, ~p"/confirm")
      response = html_response(conn, 200)
      assert response =~ "No confirmation?"
    end
  end

  describe "POST /confirm (resend confirmation)" do
    setup do
      %{user: account_owner(confirmed_at: nil).user}
    end

    test "sends confirmation email for valid unconfirmed user", %{conn: conn, user: user} do
      conn = post(conn, ~p"/confirm", %{"email" => user.email})

      assert redirected_to(conn) == ~p"/"
      assert Flash.get(conn.assigns.flash, :info) =~ "If your email is in our system"

      user_token = Repo.get_by(UserToken, user_id: user.id, context: "confirm")
      assert user_token

      assert_email_sent(fn email ->
        assert email.to == [{"", user.email}]
        assert email.subject =~ "Confirmation instructions"
      end)
    end

    test "does not send confirmation email if user is already confirmed", %{
      conn: conn,
      user: user
    } do
      Repo.update!(User.confirm_changeset(user))

      conn = post(conn, ~p"/confirm", %{"email" => user.email})
      assert redirected_to(conn) == ~p"/"

      assert Flash.get(conn.assigns.flash, :info) =~ "If your email is in our system"
      refute Repo.get_by(UserToken, user_id: user.id, context: "confirm")

      refute_email_sent()
    end

    test "does not send confirmation email for non-existent email", %{conn: conn} do
      conn = post(conn, ~p"/confirm", %{"email" => "nonexistent@example.com"})
      assert redirected_to(conn) == ~p"/"

      assert Flash.get(conn.assigns.flash, :info) =~ "If your email is in our system"
      assert Repo.all(UserToken) == []

      refute_email_sent()
    end

    test "shows generic message for security (prevents email enumeration)", %{conn: conn} do
      valid_conn = post(conn, ~p"/confirm", %{"email" => "valid@example.com"})
      invalid_conn = post(conn, ~p"/confirm", %{"email" => "invalid@example.com"})

      valid_flash = Flash.get(valid_conn.assigns.flash, :info)
      invalid_flash = Flash.get(invalid_conn.assigns.flash, :info)

      assert valid_flash == invalid_flash
      assert valid_flash =~ "If your email is in our system"
    end
  end

  describe "GET /confirm/:token" do
    test "renders the confirmation page with valid token", %{conn: conn} do
      token = "some-valid-token"
      token_path = ~p"/confirm/#{token}"
      conn = get(conn, token_path)
      response = html_response(conn, 200)
      assert response =~ "Confirm your account"
      assert response =~ "action=\"#{token_path}\""
    end

    test "renders the confirmation page with any token format", %{conn: conn} do
      token = "invalid-token-123"
      token_path = ~p"/confirm/#{token}"
      conn = get(conn, token_path)
      response = html_response(conn, 200)
      assert response =~ "Confirm your account"
    end
  end

  describe "POST /confirm/:token (confirm user)" do
    setup do
      %{user: account_owner(confirmed_at: nil).user}
    end

    test "successfully confirms user with valid token", %{conn: conn, user: user} do
      token =
        extract_user_token(fn url ->
          Auth.send_confirmation(user, url)
        end)

      conn = post(conn, ~p"/confirm/#{token}")

      assert redirected_to(conn) == ~p"/"
      assert Flash.get(conn.assigns.flash, :info) =~ "User confirmed successfully"

      confirmed_user = Accounts.get_user!(user.id)
      assert confirmed_user.confirmed_at

      refute Repo.get_by(UserToken, user_id: user.id, context: "confirm")

      refute get_session(conn, :user_token)
    end

    test "handles expired/invalid token gracefully", %{conn: conn} do
      conn = post(conn, ~p"/confirm/invalid-token")

      assert redirected_to(conn) == ~p"/"

      assert Flash.get(conn.assigns.flash, :error) =~
               "User confirmation link is invalid or it has expired"
    end

    test "handles already used token", %{conn: conn, user: user} do
      token =
        extract_user_token(fn url ->
          Auth.send_confirmation(user, url)
        end)

      post(conn, ~p"/confirm/#{token}")
      conn = post(conn, ~p"/confirm/#{token}")

      assert redirected_to(conn) == ~p"/"

      assert Flash.get(conn.assigns.flash, :error) =~
               "User confirmation link is invalid or it has expired"
    end

    test "handles confirmation when user is already logged in and confirmed", %{
      conn: conn,
      user: user
    } do
      Repo.update!(User.confirm_changeset(user))

      conn = log_in_user(conn, user)
      conn = post(conn, ~p"/confirm/any-token")

      assert redirected_to(conn) == ~p"/"
      refute Flash.get(conn.assigns.flash, :error)
    end

    test "confirmation process is idempotent", %{conn: conn, user: user} do
      token =
        extract_user_token(fn url ->
          Auth.send_confirmation(user, url)
        end)

      post(conn, ~p"/confirm/#{token}")
      conn = post(conn, ~p"/confirm/#{token}")

      assert redirected_to(conn) == ~p"/"

      assert Flash.get(conn.assigns.flash, :error) =~
               "User confirmation link is invalid or it has expired"
    end

    test "does not affect other users' tokens", %{conn: conn} do
      user1 = account_owner(confirmed_at: nil).user
      user2 = account_owner(confirmed_at: nil).user

      # Create tokens for both users
      token1 = extract_user_token(fn url -> Auth.send_confirmation(user1, url) end)
      _token2 = extract_user_token(fn url -> Auth.send_confirmation(user2, url) end)

      post(conn, ~p"/confirm/#{token1}")

      # Verify user1 is confirmed but user2 is not
      assert Accounts.get_user!(user1.id).confirmed_at
      refute Accounts.get_user!(user2.id).confirmed_at

      # Verify user2 still has their token
      assert Repo.get_by(UserToken, user_id: user2.id, context: "confirm")
    end
  end

  describe "security considerations" do
    test "confirmation tokens are properly hashed in database", %{conn: conn} do
      user = account_owner(confirmed_at: nil).user

      token =
        extract_user_token(fn url ->
          Auth.send_confirmation(user, url)
        end)

      user_token = Repo.get_by!(UserToken, user_id: user.id, context: "confirm")
      refute user_token.token == token

      # But the hashed version should verify correctly
      conn = post(conn, ~p"/confirm/#{token}")
      assert redirected_to(conn) == ~p"/"
      assert Flash.get(conn.assigns.flash, :info) =~ "User confirmed successfully"
    end

    test "confirmation endpoints don't leak user existence", %{conn: conn} do
      existing_user = account_owner(confirmed_at: nil).user

      conn1 = post(conn, ~p"/confirm", %{"email" => existing_user.email})
      conn2 = post(conn, ~p"/confirm", %{"email" => "nonexistent@example.com"})

      assert redirected_to(conn1) == redirected_to(conn2)
      assert Flash.get(conn1.assigns.flash, :info) == Flash.get(conn2.assigns.flash, :info)
    end
  end
end
